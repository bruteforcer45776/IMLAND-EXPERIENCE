import type { SupabaseClient } from "@supabase/supabase-js";
import type { Database } from "@/integrations/supabase/types";
import { isWithinHours } from "./index.server";

export type AdminClient = SupabaseClient<Database>;

const PROVINCE_KEYWORDS = ["vercelli", "biella", "novara", "verbania", "cusio", "ossola"];
const CLICKBAIT_WORDS = [
  "shock",
  "incredibile",
  "sconvolgente",
  "imperdibile",
  "urgente",
  "bomba",
  "esclusiva",
  "secret",
  "sensazionale",
  "mai visto",
];

function normalizeTitle(title: string): string {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function titleSimilarity(a: string, b: string): number {
  const na = normalizeTitle(a);
  const nb = normalizeTitle(b);
  if (na === nb) return 1;
  const wordsA = new Set(na.split(" "));
  const wordsB = nb.split(" ");
  const common = wordsB.filter((w) => wordsA.has(w)).length;
  return common / Math.max(wordsA.size, wordsB.length, 1);
}

function isClickbait(title: string): boolean {
  const t = title.toLowerCase();
  return CLICKBAIT_WORDS.some((w) => t.includes(w));
}

function provinceBoost(title: string, province?: string | null): number {
  const t = title.toLowerCase();
  let score = 0;
  if (province && t.includes(province.toLowerCase())) score += 15;
  for (const p of PROVINCE_KEYWORDS) {
    if (t.includes(p)) score += 10;
  }
  return Math.min(score, 30);
}

export async function scoreAndDeduplicateCandidates(
  admin: AdminClient,
  runId: string,
): Promise<{ scored: number; duplicates: number; selected: number; error?: string }> {
  try {
    const { data: settings } = await admin.from("news_settings").select("*").single();
    if (!settings) throw new Error("settings missing");

    const { data: candidates } = await admin
      .from("news_candidates")
      .select("*")
      .eq("processing_status", "pending")
      .order("collected_at", { ascending: false })
      .limit(500);

    if (!candidates || candidates.length === 0) {
      return { scored: 0, duplicates: 0, selected: 0 };
    }

    const { data: existing } = await admin
      .from("news_candidates")
      .select("id, title_original, content_hash, url_hash")
      .neq("processing_status", "pending")
      .limit(2000);

    const existingHashes = new Set((existing ?? []).map((e) => e.content_hash));
    const existingUrls = new Set((existing ?? []).map((e) => e.url_hash));

    let duplicates = 0;
    const groups: Record<string, string> = {};

    for (const c of candidates) {
      if (existingHashes.has(c.content_hash) || existingUrls.has(c.url_hash)) {
        duplicates++;
        await admin
          .from("news_candidates")
          .update({ processing_status: "duplicate", rejection_reason: "duplicate" })
          .eq("id", c.id);
        continue;
      }

      let duplicateGroupId: string | null = null;
      for (const e of existing ?? []) {
        if (titleSimilarity(c.title_original, e.title_original) >= 0.75) {
          duplicateGroupId = e.id;
          break;
        }
      }
      if (duplicateGroupId) {
        duplicates++;
        await admin
          .from("news_candidates")
          .update({ processing_status: "duplicate", duplicate_group_id: duplicateGroupId, rejection_reason: "similar title" })
          .eq("id", c.id);
        continue;
      }

      let relevance = 30;
      let credibility = (c.source_id ? 50 : 30) + ((c as unknown as { reliability_score?: number }).reliability_score ?? 3) * 5;

      if (c.geographic_scope === "piemonte") relevance += 20;
      else if (c.geographic_scope === "italia") relevance += 10;

      relevance += provinceBoost(c.title_original, c.province);

      if (isWithinHours(c.source_published_at, 6)) {
        relevance += 15;
        credibility += 5;
      } else if (isWithinHours(c.source_published_at, 24)) {
        relevance += 8;
      }

      if (c.excerpt_original && c.excerpt_original.length > 80) {
        relevance += 5;
      }

      if (isClickbait(c.title_original)) {
        relevance -= 20;
        credibility -= 15;
      }

      relevance = Math.max(0, Math.min(100, relevance));
      credibility = Math.max(0, Math.min(100, credibility));

      await admin
        .from("news_candidates")
        .update({
          processing_status: "scored",
          relevance_score: relevance,
          credibility_score: credibility,
        })
        .eq("id", c.id);
    }

    const { data: scored } = await admin
      .from("news_candidates")
      .select("*")
      .eq("processing_status", "scored")
      .gte("relevance_score", settings.min_relevance_score)
      .gte("credibility_score", settings.min_credibility_score)
      .order("relevance_score", { ascending: false })
      .limit(100);

    let piemonteCount = 0;
    let italiaCount = 0;
    let selected = 0;

    for (const c of scored ?? []) {
      let shouldSelect = false;
      if (c.geographic_scope === "piemonte" && piemonteCount < settings.max_piemonte_articles) {
        shouldSelect = true;
        piemonteCount++;
      } else if (c.geographic_scope === "italia" && italiaCount < settings.max_italia_articles) {
        shouldSelect = true;
        italiaCount++;
      }
      if (shouldSelect) {
        selected++;
        await admin
          .from("news_candidates")
          .update({ processing_status: "selected" })
          .eq("id", c.id);
      }
    }

    await admin
      .from("news_automation_runs")
      .update({ duplicates_found: duplicates })
      .eq("id", runId);

    return { scored: scored?.length ?? 0, duplicates, selected };
  } catch (err) {
    return { scored: 0, duplicates: 0, selected: 0, error: err instanceof Error ? err.message : String(err) };
  }
}
