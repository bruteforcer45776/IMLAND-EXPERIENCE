import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";

/**
 * Gestione redazionale delle segnalazioni ALERT.
 *
 * Solo la redazione può cambiare stato, assegnare una segnalazione a una
 * persona e trasformarla in un contenuto del territorio. Ogni passaggio
 * resta tracciato: lo storico degli stati è automatico, i contenuti generati
 * vengono collegati alla segnalazione di origine e l'azione finisce nel
 * registro delle attività.
 */

const stateSchema = z.object({
  id: z.string().uuid(),
  state: z.enum([
    "submitted",
    "analyzing",
    "needs_review",
    "needs_information",
    "approved",
    "transformed",
    "published",
    "rejected",
    "archived",
  ]),
  note: z.string().trim().max(600).optional().nullable(),
  assignToMe: z.boolean().optional(),
});

const STATE_STATUS: Record<string, string> = {
  submitted: "received",
  analyzing: "in_review",
  needs_review: "in_review",
  needs_information: "in_review",
  approved: "verified",
  transformed: "verified",
  published: "published",
  rejected: "rejected",
  archived: "closed",
};

function slugify(value: string): string {
  return value
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 60);
}

function uniqueSlug(value: string): string {
  return `${slugify(value) || "contenuto"}-${Math.random().toString(36).slice(2, 7)}`;
}

async function ensureAdmin(context: { supabase: unknown; userId: string }) {
  const { assertAdmin } = await import("@/lib/news-automation/admin-access");
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  await assertAdmin(context as any);
}

export const adminSetAlertState = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((data) => stateSchema.parse(data))
  .handler(async ({ data, context }) => {
    await ensureAdmin(context);
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");

    const patch: Record<string, string | null> = {
      state: data.state,
      status: STATE_STATUS[data.state] ?? "in_review",
      moderation_note: data.note ?? null,
    };
    if (data.state === "published") patch["published_at"] = new Date().toISOString();
    if (data.state === "archived") patch["archived_at"] = new Date().toISOString();
    if (data.assignToMe) patch["assigned_to"] = context.userId;

    const { error } = await supabaseAdmin.from("territory_alerts").update(patch as never).eq("id", data.id);
    if (error) throw new Error("Non è stato possibile aggiornare la segnalazione.");

    await supabaseAdmin.from("audit_logs").insert({
      actor_id: context.userId,
      action: `alert.state.${data.state}`,
      entity_kind: "alert",
      entity_id: data.id,
      detail: { note: data.note ?? null },
    });

    return { ok: true as const };
  });

const transformSchema = z.object({
  id: z.string().uuid(),
  target: z.enum(["place", "job", "event", "news"]),
  title: z.string().trim().min(5).max(180),
  body: z.string().trim().min(20).max(8000),
  comune: z.string().trim().min(2).max(80),
  province: z.string().trim().max(60).optional().nullable(),
  address: z.string().trim().max(200).optional().nullable(),
  category: z.string().trim().max(80).optional().nullable(),
  companyName: z.string().trim().max(160).optional().nullable(),
  sector: z.string().trim().max(80).optional().nullable(),
  contractType: z.string().trim().max(80).optional().nullable(),
  startsAt: z.string().trim().max(40).optional().nullable(),
  venue: z.string().trim().max(160).optional().nullable(),
});

/**
 * Trasforma una segnalazione verificata in un contenuto: luogo su TERRAIN,
 * opportunità su JOBS, evento o notizia. Il contenuto nasce sempre da
 * verificare o non pubblicato, così la pubblicazione resta una scelta umana.
 */
export const adminTransformAlert = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((data) => transformSchema.parse(data))
  .handler(async ({ data, context }) => {
    await ensureAdmin(context);
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");

    const { data: alert, error: readError } = await supabaseAdmin
      .from("territory_alerts")
      .select("id, organization_id")
      .eq("id", data.id)
      .maybeSingle();
    if (readError || !alert) throw new Error("Segnalazione non trovata.");

    let targetId: string | null = null;
    let href: string | null = null;

    if (data.target === "place") {
      const slug = uniqueSlug(data.title);
      const { data: row, error } = await supabaseAdmin
        .from("terrain_places")
        .insert({
          name: data.title,
          slug,
          category: data.category || "Servizi al cittadino",
          description: data.body,
          comune: data.comune,
          province: data.province ?? null,
          address: data.address ?? null,
          organization_id: alert.organization_id,
          status: "pending",
          plan: "base",
        })
        .select("id, slug")
        .single();
      if (error) throw new Error("Non è stato possibile creare la scheda del luogo.");
      targetId = row.id;
      href = `/terrain/${row.slug}`;
    }

    if (data.target === "job") {
      const slug = uniqueSlug(data.title);
      const expires = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString();
      const { data: row, error } = await supabaseAdmin
        .from("job_posts")
        .insert({
          title: data.title,
          slug,
          company_name: data.companyName || "Da definire",
          sector: data.sector || "Ufficio e amministrazione",
          contract_type: data.contractType || "Tempo determinato",
          description: data.body,
          comune: data.comune,
          province: data.province ?? null,
          organization_id: alert.organization_id,
          status: "pending",
          expires_at: expires,
        })
        .select("id, slug")
        .single();
      if (error) throw new Error("Non è stato possibile creare l'opportunità.");
      targetId = row.id;
      href = `/jobs/${row.slug}`;
    }

    if (data.target === "event") {
      const starts = data.startsAt ? new Date(data.startsAt) : null;
      const { data: row, error } = await supabaseAdmin
        .from("member_events")
        .insert({
          title: data.title,
          description: data.body,
          starts_at: (starts && !Number.isNaN(starts.getTime()) ? starts : new Date()).toISOString(),
          venue: data.venue ?? null,
          city: data.comune,
          province: data.province ?? null,
          organization_id: alert.organization_id,
          member_only: false,
          is_published: false,
          status: "pending",
        })
        .select("id")
        .single();
      if (error) throw new Error("Non è stato possibile creare l'evento.");
      targetId = row.id;
      href = null;
    }

    if (data.target === "news") {
      const slug = uniqueSlug(data.title);
      const { data: row, error } = await supabaseAdmin
        .from("news_articles")
        .insert({
          title: data.title,
          slug,
          body: data.body,
          summary: data.body.slice(0, 240),
          province: data.province ?? null,
          geographic_scope: "comune",
          status: "draft",
          generated_by_ai: false,
          verification_status: "pending",
        })
        .select("id, slug")
        .single();
      if (error) throw new Error("Non è stato possibile creare la bozza di notizia.");
      targetId = row.id;
      href = `/news/${row.slug}`;
    }

    if (!targetId) throw new Error("Destinazione non valida.");

    await supabaseAdmin.from("content_relations").insert({
      source_kind: "alert",
      source_id: data.id,
      target_kind: data.target,
      target_id: targetId,
      relation: "generated",
      created_by: context.userId,
    });

    await supabaseAdmin
      .from("territory_alerts")
      .update({ state: "transformed", status: "verified" })
      .eq("id", data.id);

    await supabaseAdmin.from("audit_logs").insert({
      actor_id: context.userId,
      action: `alert.transform.${data.target}`,
      entity_kind: "alert",
      entity_id: data.id,
      detail: { target_id: targetId },
    });

    return { ok: true as const, targetId, href };
  });

/** Contenuti già nati da una segnalazione. */
export const adminAlertRelations = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .inputValidator((data) => z.object({ id: z.string().uuid() }).parse(data))
  .handler(async ({ data, context }) => {
    await ensureAdmin(context);
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { data: rows } = await supabaseAdmin
      .from("content_relations")
      .select("target_kind, target_id, relation, created_at")
      .eq("source_kind", "alert")
      .eq("source_id", data.id)
      .order("created_at", { ascending: true });
    return rows ?? [];
  });
