import { generateText } from "ai";
import type { SupabaseClient } from "@supabase/supabase-js";
import type { Database } from "@/integrations/supabase/types";
import { createLovableAiGatewayProvider } from "@/lib/ai-gateway.server";

export type AdminClient = SupabaseClient<Database>;

function slugify(title: string): string {
  return title
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 80);
}

function uniqueSlug(base: string, existing: string[]): string {
  let slug = base;
  let i = 2;
  while (existing.includes(slug)) {
    slug = `${base}-${i}`;
    i++;
  }
  return slug;
}

function pickCategory(title: string, excerpt: string): string {
  const text = `${title} ${excerpt}`.toLowerCase();
  const map: Record<string, string[]> = {
    cronaca: ["incidente", "scontro", "furto", "arresto", "morto", "morta", "ferito"],
    politica: ["comune", "regione", "giunta", "consiglio", "sindaco", "assessore", "elezioni"],
    economia: ["impresa", "azienda", "lavoro", "economia", "fatturato", "investimento"],
    cultura: ["teatro", "musica", "arte", "mostra", "spettacolo", "festival"],
    eventi: ["evento", "sagra", "manifestazione", "fiera", "concerto"],
    turismo: ["turismo", "borgo", "lago", "montagna", "escursione"],
    ambiente: ["ambiente", "clima", "sostenibilità", "rinnovabili", "inquinamento"],
    viabilita: ["viabilità", "traffico", "strada", "autostrada", "cantieri"],
    sport: ["calcio", "pallacanestro", "ciclismo", "tennis", "sport"],
    innovazione: ["innovazione", "startup", "digitale", "tecnologia", "ricerca"],
    sanita: ["sanità", "ospedale", "medico", "salute", "asl"],
  };
  for (const [cat, words] of Object.entries(map)) {
    if (words.some((w) => text.includes(w))) return cat;
  }
  return "territorio";
}

const GENERATION_PROMPT = `Sei la redazione di IMLAND Experience, un hub territoriale del Piemonte.
Devi scrivere un articolo giornalistico originale in italiano basato ESCLUSIVAMENTE sulle informazioni fornite.

REGOLE FONDAMENTALI:
- Non inventare fatti, numeri, persone, citazioni o dichiarazioni.
- Usa solo le informazioni presenti nelle fonti indicate.
- Distingui fatti confermati da informazioni in aggiornamento.
- Non creare citazioni dirette se non presenti testualmente nella fonte.
- Non imitare la struttura o lo stile della testata originale.
- Non copiare lunghi passaggi.
- Tono giornalistico neutrale, chiaro e territoriale.
- Evita sensazionalismo.
- Non dichiarare che IMLAND era presente sul luogo.
- Non firmare l'articolo con un nome reale.

OUTPUT JSON con questi campi:
{
  "title": "titolo originale e informativo",
  "subtitle": "sottotitolo breve",
  "summary": "sommario di 2-3 righe",
  "body": "corpo in HTML semplice con paragrafi e sottotitoli h2",
  "focus_keywords": ["keyword1", "keyword2"],
  "seo_title": "title tag SEO, max 60 caratteri",
  "seo_description": "meta description, max 160 caratteri",
  "category_slug": "una tra: territorio, cronaca, politica, economia, cultura, eventi, turismo, ambiente, viabilita, sport, innovazione, sanita, nazionale",
  "in_update": boolean
}`;

export async function generateArticles(
  admin: AdminClient,
  runId: string,
  lovableApiKey: string,
): Promise<{ generated: number; error?: string }> {
  try {
    const { data: candidates } = await admin
      .from("news_candidates")
      .select("*")
      .eq("processing_status", "selected")
      .order("relevance_score", { ascending: false })
      .limit(20);

    if (!candidates || candidates.length === 0) {
      return { generated: 0 };
    }

    const { data: existingSlugs } = await admin.from("news_articles").select("slug");
    const usedSlugs = (existingSlugs ?? []).map((a) => a.slug);

    const gateway = createLovableAiGatewayProvider(lovableApiKey);
    const model = gateway("google/gemini-3-flash-preview");

    let generated = 0;

    for (const candidate of candidates) {
      try {
        const { text } = await generateText({
          model,
          messages: [
            { role: "system", content: GENERATION_PROMPT },
            {
              role: "user",
              content: `Fonte: ${candidate.source_name}\nTitolo originale: ${candidate.title_original}\nEstratto: ${candidate.excerpt_original}\nURL: ${candidate.canonical_url}\nData: ${candidate.source_published_at ?? "non specificata"}\nTerritorio: ${candidate.geographic_scope ?? "non specificato"}`,
            },
          ],
        });

        const parsed = JSON.parse(text) as {
          title: string;
          subtitle?: string;
          summary?: string;
          body: string;
          focus_keywords?: string[];
          seo_title?: string;
          seo_description?: string;
          category_slug?: string;
          in_update?: boolean;
        };

        const baseSlug = slugify(parsed.title || candidate.title_original);
        const slug = uniqueSlug(baseSlug, usedSlugs);
        usedSlugs.push(slug);

        const category = parsed.category_slug || pickCategory(candidate.title_original, candidate.excerpt_original || "");

        const { data: article, error: articleErr } = await admin
          .from("news_articles")
          .insert({
            title: parsed.title,
            slug,
            subtitle: parsed.subtitle ?? "",
            summary: parsed.summary ?? "",
            body: parsed.body,
            category_slug: category,
            geographic_scope: candidate.geographic_scope,
            province: candidate.province,
            relevance_score: candidate.relevance_score,
            credibility_score: candidate.credibility_score,
            status: "draft",
            generated_by_ai: true,
            verification_status: "pending",
            seo_title: parsed.seo_title || parsed.title,
            seo_description: parsed.seo_description || parsed.summary || "",
            focus_keywords: parsed.focus_keywords ?? [],
            structured_data: { in_update: parsed.in_update === true },
          })
          .select("id")
          .single();

        if (articleErr || !article) throw articleErr || new Error("article insert failed");

        await admin.from("news_article_sources").insert({
          article_id: article.id,
          candidate_id: candidate.id,
          source_id: candidate.source_id,
          source_name: candidate.source_name || "Fonte",
          original_title: candidate.title_original,
          original_url: candidate.canonical_url,
          published_at: candidate.source_published_at,
          author: candidate.source_author,
        });

        await admin
          .from("news_candidates")
          .update({ processing_status: "selected" })
          .eq("id", candidate.id);

        generated++;
      } catch (err) {
        const message = err instanceof Error ? err.message : String(err);
        await admin
          .from("news_candidates")
          .update({ processing_status: "rejected", rejection_reason: `generation error: ${message}` })
          .eq("id", candidate.id);
      }
    }

    await admin
      .from("news_automation_runs")
      .update({ articles_generated: generated })
      .eq("id", runId);

    return { generated };
  } catch (err) {
    return { generated: 0, error: err instanceof Error ? err.message : String(err) };
  }
}
