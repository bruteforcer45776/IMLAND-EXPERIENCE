import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

/**
 * Invio e verifica delle segnalazioni ALERT.
 *
 * L'invio è aperto anche a chi non ha un account (una segnalazione dal
 * territorio deve poter arrivare sempre), quindi passa da qui: validazione
 * severa, campo esca anti-spam, limite di invii e stato iniziale "inviata".
 * La verifica dello stato restituisce soltanto codice, stato e date: nessun
 * dato personale di chi ha segnalato.
 */

const submitSchema = z.object({
  alertType: z.string().trim().min(2).max(60),
  category: z.string().trim().min(3).max(60),
  title: z.string().trim().min(5).max(160),
  body: z.string().trim().min(20).max(4000),
  comune: z.string().trim().min(2).max(80),
  province: z.string().trim().max(60).optional().nullable(),
  latitude: z.number().min(-90).max(90).optional().nullable(),
  longitude: z.number().min(-180).max(180).optional().nullable(),
  contactEmail: z.string().trim().email().max(255).optional().nullable(),
  payload: z.record(z.string(), z.string().max(600)).optional(),
  /** campo esca: deve restare vuoto */
  trap: z.string().max(0).optional(),
});

function alertCode(): string {
  const alphabet = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  let code = "";
  for (let i = 0; i < 6; i += 1) {
    code += alphabet[Math.floor(Math.random() * alphabet.length)];
  }
  return `AL-${code}`;
}

export const submitAlert = createServerFn({ method: "POST" })
  .inputValidator((data) => submitSchema.parse(data))
  .handler(async ({ data }) => {
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { getRequestHeader } = await import("@tanstack/react-start/server");

    // L'identità di chi segnala viene ricavata dal token della sessione,
    // mai da un valore inviato dal browser.
    let reporterId: string | null = null;
    const authorization = getRequestHeader("authorization");
    const token = authorization?.replace(/^Bearer\s+/i, "");
    if (token) {
      const { data: userData } = await supabaseAdmin.auth.getUser(token);
      reporterId = userData.user?.id ?? null;
    }

    if (data.contactEmail) {
      const since = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString();
      const { count } = await supabaseAdmin
        .from("territory_alerts")
        .select("id", { count: "exact", head: true })
        .eq("contact_email", data.contactEmail)
        .gte("created_at", since);
      if ((count ?? 0) >= 5) {
        return { ok: false as const, reason: "limit" as const };
      }
    }

    for (let attempt = 0; attempt < 5; attempt += 1) {
      const code = alertCode();
      const { error } = await supabaseAdmin.from("territory_alerts").insert({
        code,
        alert_type: data.alertType,
        category: data.category,
        title: data.title,
        body: data.body,
        comune: data.comune,
        province: data.province ?? null,
        latitude: data.latitude ?? null,
        longitude: data.longitude ?? null,
        contact_email: data.contactEmail ?? null,
        reporter_id: reporterId,
        payload: data.payload ?? {},
        state: "submitted",
        status: "received",
        submitted_at: new Date().toISOString(),
      });
      if (!error) return { ok: true as const, code };
      if (!/duplicate key/i.test(error.message)) {
        return { ok: false as const, reason: "error" as const };
      }
    }
    return { ok: false as const, reason: "error" as const };
  });

export const checkAlertStatus = createServerFn({ method: "GET" })
  .inputValidator((data) => z.object({ code: z.string().trim().min(4).max(20) }).parse(data))
  .handler(async ({ data }) => {
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");

    const { data: row } = await supabaseAdmin
      .from("territory_alerts")
      .select(
        "id, code, category, alert_type, title, comune, province, state, status, moderation_note, created_at, updated_at, submitted_at, published_at",
      )
      .eq("code", data.code.toUpperCase())
      .maybeSingle();

    if (!row) return { found: false as const };

    // Passaggi già avvenuti: solo stato e data, nessun dato personale.
    const { data: history } = await supabaseAdmin
      .from("alert_status_history")
      .select("to_state, created_at")
      .eq("alert_id", row.id)
      .order("created_at", { ascending: true });

    const { id: _id, ...safe } = row;
    return {
      found: true as const,
      alert: safe,
      history: (history ?? []).map((h) => ({ state: h.to_state, at: h.created_at })),
    };
  });
