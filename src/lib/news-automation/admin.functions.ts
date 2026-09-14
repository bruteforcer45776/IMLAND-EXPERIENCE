import { createServerFn } from "@tanstack/react-start";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";
import type { Database } from "@/integrations/supabase/types";
import { assertAdmin } from "./admin-access";
import { collectDailyNews } from "./collect.server";
import { scoreAndDeduplicateCandidates } from "./score.server";
import { generateArticles } from "./generate.server";
import { verifyAndPublishArticles } from "./publish.server";

export const runNewsAutomation = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    await assertAdmin(context);
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const key = process.env.LOVABLE_API_KEY;
    if (!key) throw new Error("LOVABLE_API_KEY missing");

    const collect = await collectDailyNews(supabaseAdmin, "manual");
    if (!collect.ok) return collect;

    const score = await scoreAndDeduplicateCandidates(supabaseAdmin, collect.runId);
    if (score.error) return { ...collect, scoreError: score.error };

    const gen = await generateArticles(supabaseAdmin, collect.runId, key);
    if (gen.error) return { ...collect, generated: gen.generated, genError: gen.error };

    const pub = await verifyAndPublishArticles(supabaseAdmin, collect.runId);

    return {
      runId: collect.runId,
      ok: true,
      collected: collect.ok,
      scored: score.scored,
      duplicates: score.duplicates,
      selected: score.selected,
      generated: gen.generated,
      published: pub.published,
      review: pub.review,
      rejected: pub.rejected,
    };
  });

export const getNewsSettings = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    await assertAdmin(context);
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { data, error } = await supabaseAdmin.from("news_settings").select("*").single();
    if (error) throw error;
    return data;
  });

export const updateNewsSettings = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((data: { id: string; patch: Partial<Database["public"]["Tables"]["news_settings"]["Update"]> }) => data)
  .handler(async ({ data, context }) => {
    await assertAdmin(context);
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { error } = await supabaseAdmin.from("news_settings").update(data.patch).eq("id", data.id);
    if (error) throw error;
    return { ok: true };
  });

export const listNewsSources = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    await assertAdmin(context);
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { data, error } = await supabaseAdmin.from("news_sources").select("*").order("name");
    if (error) throw error;
    return data ?? [];
  });

export const upsertNewsSource = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator(
    (data: {
      id?: string;
      name: string;
      domain: string;
      feed_url?: string;
      endpoint_url?: string;
      source_type: "rss" | "api" | "institutional" | "html";
      coverage_scope: "piemonte" | "italia" | "provincia" | "comune";
      province?: string;
      city?: string;
      reliability_score: number;
      allows_scraping?: boolean;
      allows_image_reuse?: boolean;
      is_active?: boolean;
    }) => data,
  )
  .handler(async ({ data, context }) => {
    await assertAdmin(context);
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const payload = { ...data, updated_at: new Date().toISOString() };
    if (!data.id) {
      const { error } = await supabaseAdmin.from("news_sources").insert(payload);
      if (error) throw error;
    } else {
      const { error } = await supabaseAdmin.from("news_sources").update(payload).eq("id", data.id);
      if (error) throw error;
    }
    return { ok: true };
  });

export const listNewsCandidates = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .inputValidator((data: { status?: string; limit?: number }) => data)
  .handler(async ({ data, context }) => {
    await assertAdmin(context);
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    let q = supabaseAdmin.from("news_candidates").select("*").order("collected_at", { ascending: false });
    if (data.status) q = q.eq("processing_status", data.status as Database["public"]["Enums"]["news_candidate_status"]);
    if (data.limit) q = q.limit(data.limit);
    const { data: rows, error } = await q;
    if (error) throw error;
    return rows ?? [];
  });

export const listNewsArticles = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .inputValidator((data: { status?: string; limit?: number }) => data)
  .handler(async ({ data, context }) => {
    await assertAdmin(context);
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    let q = supabaseAdmin.from("news_articles").select("*").order("created_at", { ascending: false });
    if (data.status) q = q.eq("status", data.status as Database["public"]["Enums"]["news_article_status"]);
    if (data.limit) q = q.limit(data.limit);
    const { data: rows, error } = await q;
    if (error) throw error;
    return rows ?? [];
  });

export const getNewsArticleWithSources = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .inputValidator((data: { id: string }) => data)
  .handler(async ({ data, context }) => {
    await assertAdmin(context);
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const [{ data: article, error: aErr }, { data: sources, error: sErr }] = await Promise.all([
      supabaseAdmin.from("news_articles").select("*").eq("id", data.id).single(),
      supabaseAdmin.from("news_article_sources").select("*").eq("article_id", data.id),
    ]);
    if (aErr) throw aErr;
    if (sErr) throw sErr;
    return { article, sources: sources ?? [] };
  });

export const updateNewsArticle = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((data: { id: string; patch: Partial<Database["public"]["Tables"]["news_articles"]["Update"]> }) => data)
  .handler(async ({ data, context }) => {
    await assertAdmin(context);
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const patch = { ...data.patch, updated_at: new Date().toISOString(), reviewed_by: context.userId };
    const { error } = await supabaseAdmin.from("news_articles").update(patch).eq("id", data.id);
    if (error) throw error;
    return { ok: true };
  });

export const approveNewsArticle = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((data: { id: string }) => data)
  .handler(async ({ data, context }) => {
    await assertAdmin(context);
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { error } = await supabaseAdmin
      .from("news_articles")
      .update({
        status: "published",
        published_at: new Date().toISOString(),
        verification_status: "verified",
        reviewed_by: context.userId,
        updated_at: new Date().toISOString(),
      })
      .eq("id", data.id);
    if (error) throw error;
    return { ok: true };
  });

export const rejectNewsArticle = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((data: { id: string; reason?: string }) => data)
  .handler(async ({ data, context }) => {
    await assertAdmin(context);
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { error } = await supabaseAdmin
      .from("news_articles")
      .update({
        status: "rejected",
        review_notes: data.reason || "rejected by admin",
        reviewed_by: context.userId,
        updated_at: new Date().toISOString(),
      })
      .eq("id", data.id);
    if (error) throw error;
    return { ok: true };
  });

export const listAutomationRuns = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .inputValidator((data: { limit?: number }) => data)
  .handler(async ({ data, context }) => {
    await assertAdmin(context);
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { data: rows, error } = await supabaseAdmin
      .from("news_automation_runs")
      .select("*")
      .order("started_at", { ascending: false })
      .limit(data.limit ?? 20);
    if (error) throw error;
    return rows ?? [];
  });
