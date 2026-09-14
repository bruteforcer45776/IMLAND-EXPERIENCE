import type { SupabaseClient } from "@supabase/supabase-js";
import type { Database } from "@/integrations/supabase/types";

export type AdminClient = SupabaseClient<Database>;

const SENSITIVE_KEYWORDS = [
  "morto",
  "morta",
  "deceduto",
  "deceduta",
  "omicidio",
  "suicidio",
  "aggressione",
  "violenza sessuale",
  "minorenne",
  "bambino",
  "bambina",
  "scomparso",
  "scomparsa",
  "incidente mortale",
  "mortale",
  "procedimento penale",
  "inchiesta giudiziaria",
  "arresto",
  "fermo",
  "indagato",
  "denuncia",
  "controversia",
  "emergenza",
  "allarme",
];

function containsSensitive(text: string): boolean {
  const t = text.toLowerCase();
  return SENSITIVE_KEYWORDS.some((k) => t.includes(k));
}

function hasPrimarySource(sources: { source_id?: string | null }[]): boolean {
  return sources.length > 0 && sources.some((s) => s.source_id);
}

export async function verifyAndPublishArticles(
  admin: AdminClient,
  runId: string,
): Promise<{ published: number; review: number; rejected: number; error?: string }> {
  try {
    const { data: settings } = await admin.from("news_settings").select("*").single();
    if (!settings) throw new Error("settings missing");

    const { data: articles } = await admin
      .from("news_articles")
      .select("*")
      .eq("status", "draft")
      .order("created_at", { ascending: false })
      .limit(50);

    let published = 0;
    let review = 0;
    let rejected = 0;

    for (const article of articles ?? []) {
      const { data: sources } = await admin
        .from("news_article_sources")
        .select("source_id")
        .eq("article_id", article.id);

      const sourceCount = sources?.length ?? 0;
      const fullText = `${article.title} ${article.subtitle ?? ""} ${article.summary ?? ""} ${article.body ?? ""}`;
      const sensitive = containsSensitive(fullText);
      const primaryOrTwo = hasPrimarySource(sources ?? []) || sourceCount >= 2;

      let status: string = "review";
      let reason = "";

      if (
        (article.relevance_score ?? 0) >= settings.min_relevance_score &&
        (article.credibility_score ?? 0) >= settings.min_credibility_score &&
        primaryOrTwo &&
        !sensitive &&
        !settings.manual_review_mode &&
        !settings.emergency_stop
      ) {
        status = "published";
      } else if (
        (article.relevance_score ?? 0) < settings.min_relevance_score ||
        (article.credibility_score ?? 0) < settings.min_credibility_score ||
        !primaryOrTwo
      ) {
        status = "rejected";
        reason = "below thresholds or insufficient sources";
      } else {
        status = "review";
        reason = sensitive ? "sensitive content" : settings.manual_review_mode ? "manual review mode" : "verification";
      }

      const update: Partial<Database["public"]["Tables"]["news_articles"]["Update"]> = {
        status: status as Database["public"]["Enums"]["news_article_status"],
        verification_status: (status === "published" ? "verified" : "pending") as Database["public"]["Enums"]["news_verification_status"],
      };
      if (status === "published") {
        update.published_at = new Date().toISOString();
      }
      if (reason) {
        update.review_notes = reason;
      }

      await admin.from("news_articles").update(update).eq("id", article.id);

      if (status === "published") published++;
      else if (status === "review") review++;
      else rejected++;
    }

    await admin
      .from("news_automation_runs")
      .update({
        articles_published: published,
        articles_review: review,
        articles_rejected: rejected,
      })
      .eq("id", runId);

    return { published, review, rejected };
  } catch (err) {
    return { published: 0, review: 0, rejected: 0, error: err instanceof Error ? err.message : String(err) };
  }
}
