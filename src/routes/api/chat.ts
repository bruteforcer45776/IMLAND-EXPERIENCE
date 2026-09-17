import { createFileRoute } from "@tanstack/react-router";
import { generateText } from "ai";
import { createGroqProvider } from "@/lib/ai-gateway.server";
import { CHAT_SYSTEM, createChatLimiter, parseChatInput, shortcutAnswer } from "@/lib/chat-policy";
import { recommendMembers, searchByMeaningfulTerms, type SearchItem } from "@/data/search-index";
import { isSupabaseConfigured, supabase } from "@/integrations/supabase/client";

const limit = createChatLimiter();

const serviceIntent =
  /\b(cerco|consiglia|consigliami|mi serve|attivit[aà]|azienda|professionista|negozio|ristorante|elettricista|idraulico|ottico|farmacia|immobiliare|consulente)\b/i;

async function loadPublicDirectory(): Promise<SearchItem[]> {
  if (!isSupabaseConfigured()) return [];
  const [places, jobs, news] = await Promise.all([
    supabase
      .from("terrain_places")
      .select("slug,name,category,description,comune,province")
      .eq("status", "published")
      .limit(300),
    supabase
      .from("job_posts")
      .select("slug,title,company_name,sector,description,comune,province")
      .eq("status", "published")
      .limit(100),
    supabase
      .from("news_articles")
      .select("slug,title,summary,category_slug")
      .eq("status", "published")
      .limit(100),
  ]);

  const strings = (values: Array<string | null>) =>
    values.filter((value): value is string => Boolean(value));
  return [
    ...(places.data ?? []).map<SearchItem>((item) => ({
      kind: "luogo",
      title: item.name,
      subtitle: item.description ?? "Attività presente sulla mappa del territorio.",
      meta: strings([item.category, item.comune, item.province]).join(" · "),
      to: `/terrain/${item.slug}`,
      tags: strings([item.category, item.comune, item.province]),
    })),
    ...(jobs.data ?? []).map<SearchItem>((item) => ({
      kind: "lavoro",
      title: item.title,
      subtitle: item.description ?? `Opportunità pubblicata da ${item.company_name}.`,
      meta: strings([item.company_name, item.sector, item.comune, item.province]).join(" · "),
      to: `/jobs/${item.slug}`,
      tags: strings([item.company_name, item.sector, item.comune, item.province]),
    })),
    ...(news.data ?? []).map<SearchItem>((item) => ({
      kind: "news",
      title: item.title,
      subtitle: item.summary ?? "Notizia pubblicata da IMLAND Experience.",
      meta: item.category_slug ?? "News",
      to: `/news/${item.slug}`,
    })),
  ];
}

function formatResults(items: SearchItem[]) {
  return items
    .map(
      (item) =>
        `- ${item.title}: ${item.subtitle} (${item.meta ?? item.kind}) [link: ${item.to ?? item.href ?? "/contatti"}]`,
    )
    .join("\n");
}

export const Route = createFileRoute("/api/chat")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        const reply = (body: unknown, status = 200, headers: Record<string, string> = {}) =>
          Response.json(body, { status, headers: { "Cache-Control": "no-store", ...headers } });
        const origin = request.headers.get("origin");
        if (origin && origin !== new URL(request.url).origin)
          return reply({ text: "Richiesta non consentita." }, 403);
        if (!request.headers.get("content-type")?.includes("application/json"))
          return reply({ text: "Formato non valido." }, 415);
        const reader = request.body?.getReader();
        if (!reader) return reply({ text: "Scrivi una domanda." }, 400);
        let raw = "";
        let bytes = 0;
        const decoder = new TextDecoder();
        try {
          while (true) {
            const chunk = await reader.read();
            if (chunk.done) break;
            bytes += chunk.value.byteLength;
            if (bytes > 4096) {
              await reader.cancel();
              return reply({ text: "Messaggio troppo lungo." }, 413);
            }
            raw += decoder.decode(chunk.value, { stream: true });
          }
          raw += decoder.decode();
        } catch {
          return reply({ text: "Richiesta non valida." }, 400);
        }
        let body: unknown;
        try {
          body = JSON.parse(raw);
        } catch {
          return reply({ text: "Richiesta non valida." }, 400);
        }
        if (
          !body ||
          typeof body !== "object" ||
          (body as { aiAcknowledged?: unknown }).aiAcknowledged !== true
        ) {
          return reply(
            { text: "Conferma prima di aver compreso che stai parlando con un Assistente AI." },
            400,
          );
        }
        const text = parseChatInput(body);
        if (!text) return reply({ text: "Scrivi una domanda di massimo 240 caratteri." }, 400);
        const ip = request.headers.get("cf-connecting-ip");
        const quota = limit(ip ?? "local-preview");
        if (!quota.allowed)
          return reply(
            {
              text:
                quota.remaining === 0
                  ? "Limite di 5 domande raggiunto. Riprova più tardi o visita Contatti."
                  : "Attendi qualche secondo prima di inviare un'altra domanda.",
              remaining: quota.remaining,
            },
            429,
            { "Retry-After": String(quota.retryAfter) },
          );
        const liveItems = await loadPublicDirectory().catch(() => []);
        const memberMatches = serviceIntent.test(text) ? recommendMembers(text, liveItems, 3) : [];
        if (serviceIntent.test(text)) {
          if (memberMatches.length) {
            const suggestions = memberMatches
              .map((item) => `**${item.title}**${item.meta ? ` — ${item.meta}` : ""}`)
              .join("\n");
            return reply({
              text: `Tra le attività verificate trovo:\n${suggestions}\n\nApri la [mappa Member](/member) per dettagli e posizione.`,
              mode: "directory",
              remaining: quota.remaining,
            });
          }
          return reply({
            text: "Non trovo ancora un’attività verificata e pertinente sulla mappa. Scrivici da [Contatti](/contatti): ti aiutiamo a trovare il riferimento giusto.",
            mode: "directory",
            remaining: quota.remaining,
          });
        }

        const answer = shortcutAnswer(text);
        if (answer) return reply({ text: answer, mode: "guide", remaining: quota.remaining });

        const contextItems = searchByMeaningfulTerms(text, liveItems, 8);

        const key = process.env.GROQ_API_KEY;
        if (!key) {
          if (contextItems.length) {
            const links = contextItems
              .slice(0, 3)
              .map((item) => `[${item.title}](${item.to ?? "/cerca"})`)
              .join(", ");
            return reply({
              text: `Ho trovato questi contenuti pertinenti: ${links}.`,
              mode: "search",
              remaining: quota.remaining,
            });
          }
          return reply({
            text: "Non trovo un contenuto verificato per questa richiesta. Prova la [ricerca globale](/cerca) oppure scrivici da [Contatti](/contatti).",
            mode: "guide",
            remaining: quota.remaining,
          });
        }

        const gateway = createGroqProvider(key);
        const model = gateway("openai/gpt-oss-20b");

        try {
          const result = await generateText({
            model,
            system: CHAT_SYSTEM,
            messages: [
              {
                role: "user",
                content: `${text}\n\nCONTENUTI VERIFICATI DEL SITO:\n${contextItems.length ? formatResults(contextItems) : "Nessun contenuto pertinente trovato."}`,
              },
            ],
            maxOutputTokens: 180,
            maxRetries: 0,
            abortSignal: AbortSignal.timeout(12000),
          });
          return reply({
            text: result.text.trim() || "Consulta [Contatti](/contatti).",
            mode: "ai",
            remaining: quota.remaining,
          });
        } catch {
          if (contextItems.length) {
            const links = contextItems
              .slice(0, 3)
              .map((item) => `[${item.title}](${item.to ?? "/cerca"})`)
              .join(", ");
            return reply({
              text: `Il modello non è disponibile, ma ho trovato: ${links}.`,
              mode: "search",
              remaining: quota.remaining,
            });
          }
          return reply({
            text: "Il servizio AI è temporaneamente indisponibile. Consulta [FAQ](/faq) o [Contatti](/contatti).",
            mode: "guide",
            remaining: quota.remaining,
          });
        }
      },
    },
  },
});
