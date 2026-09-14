import type { SupabaseClient } from "@supabase/supabase-js";
import type { Database } from "@/integrations/supabase/types";
import {
  contentHash,
  isWithinHours,
  normalizeUrl,
  parseIsoOrRfcDate,
  parseRssItems,
  urlHash,
} from "./index.server";

export type AdminClient = SupabaseClient<Database>;

const FETCH_TIMEOUT_MS = 15_000;
const SOURCE_DELAY_MS = 500;
const MAX_AGE_HOURS = 36;

async function fetchWithTimeout(url: string, timeoutMs: number): Promise<Response> {
  const controller = new AbortController();
  const t = setTimeout(() => controller.abort(), timeoutMs);
  try {
    const res = await fetch(url, {
      signal: controller.signal,
      headers: {
        "User-Agent":
          "Mozilla/5.0 (compatible; IMLANDExperience/1.0; +https://imland-experience-hub-territoriale.area-di-lavo-2221.chatgpt.site)",
        Accept: "application/rss+xml, application/xml, text/xml",
      },
    });
    return res;
  } finally {
    clearTimeout(t);
  }
}

async function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export async function collectDailyNews(
  admin: AdminClient,
  triggeredBy: "cron" | "manual" = "cron",
): Promise<{ runId: string; ok: boolean; error?: string }> {
  const { data: settings } = await admin.from("news_settings").select("*").single();
  if (!settings) return { runId: "", ok: false, error: "news_settings missing" };
  if (settings.emergency_stop) return { runId: "", ok: false, error: "emergency_stop active" };
  if (!settings.automation_enabled && triggeredBy === "cron") {
    return { runId: "", ok: false, error: "automation disabled" };
  }

  const { data: running } = await admin
    .from("news_automation_runs")
    .select("id")
    .eq("status", "running")
    .gte("started_at", new Date(Date.now() - 30 * 60 * 1000).toISOString())
    .limit(1);
  if (running && running.length > 0) {
    return { runId: "", ok: false, error: "another run is active" };
  }

  const { data: run } = await admin
    .from("news_automation_runs")
    .insert({ status: "running", triggered_by: triggeredBy })
    .select("id")
    .single();
  if (!run) return { runId: "", ok: false, error: "failed to create run" };

  const runId = run.id;
  const errors: { source?: string; message: string }[] = [];
  const logs: string[] = [];
  let sourcesChecked = 0;
  let candidatesCollected = 0;

  try {
    const { data: sources } = await admin
      .from("news_sources")
      .select("*")
      .eq("is_active", true)
      .eq("source_type", "rss")
      .order("reliability_score", { ascending: false });

    if (!sources || sources.length === 0) {
      throw new Error("no active rss sources");
    }

    for (const source of sources) {
      if (!source.feed_url) continue;
      sourcesChecked++;
      try {
        const res = await fetchWithTimeout(source.feed_url, FETCH_TIMEOUT_MS);
        if (!res.ok) throw new Error(`http ${res.status}`);
        const xml = await res.text();
        const items = parseRssItems(xml);
        logs.push(`${source.name}: ${items.length} items parsed`);

        for (const item of items) {
          if (!isWithinHours(item.pubDate, MAX_AGE_HOURS)) continue;
          const collectedAt = new Date().toISOString();
          const hash = contentHash(item.title, item.description, item.link);
          const uHash = urlHash(item.link);

          const { error: insertErr } = await admin.from("news_candidates").insert({
            title_original: item.title,
            excerpt_original: item.description,
            canonical_url: item.link,
            source_id: source.id,
            source_name: source.name,
            source_author: item.author,
            source_published_at: parseIsoOrRfcDate(item.pubDate),
            collected_at: collectedAt,
            content_hash: hash,
            url_hash: uHash,
            geographic_scope: source.coverage_scope,
            province: source.province,
            raw_metadata: {
              source_feed: source.feed_url,
              normalized_url: normalizeUrl(item.link),
              rss_source_tag: item.source,
            },
          });

          if (insertErr && insertErr.code !== "23505") {
            errors.push({ source: source.name, message: insertErr.message });
          } else if (!insertErr) {
            candidatesCollected++;
          }
        }

        await admin
          .from("news_sources")
          .update({ last_checked_at: new Date().toISOString(), last_error: null })
          .eq("id", source.id);
      } catch (err) {
        const message = err instanceof Error ? err.message : String(err);
        errors.push({ source: source.name, message });
        await admin
          .from("news_sources")
          .update({ last_checked_at: new Date().toISOString(), last_error: message })
          .eq("id", source.id);
      }
      await sleep(SOURCE_DELAY_MS);
    }

    await admin
      .from("news_automation_runs")
      .update({
        status: "completed",
        finished_at: new Date().toISOString(),
        sources_checked: sourcesChecked,
        candidates_collected: candidatesCollected,
        errors,
        logs,
      })
      .eq("id", runId);

    await admin
      .from("news_settings")
      .update({ last_run_at: new Date().toISOString() })
      .eq("id", settings.id);

    return { runId, ok: true };
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    await admin
      .from("news_automation_runs")
      .update({
        status: "failed",
        finished_at: new Date().toISOString(),
        sources_checked: sourcesChecked,
        candidates_collected: candidatesCollected,
        errors: [...errors, { message }],
        logs,
      })
      .eq("id", runId);
    return { runId, ok: false, error: message };
  }
}
