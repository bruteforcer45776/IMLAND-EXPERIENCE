import { createFileRoute } from "@tanstack/react-router";
import { generateText } from "ai";
import { createLovableAiGatewayProvider } from "@/lib/ai-gateway.server";
import { CHAT_SYSTEM, createChatLimiter, parseChatInput, shortcutAnswer } from "@/lib/chat-policy";

const limit = createChatLimiter();

export const Route = createFileRoute("/api/chat")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        const reply = (body: unknown, status = 200, headers: Record<string, string> = {}) => Response.json(body, { status, headers: { "Cache-Control": "no-store", ...headers } });
        const origin = request.headers.get("origin");
        if (origin && origin !== new URL(request.url).origin) return reply({ text: "Richiesta non consentita." }, 403);
        if (!request.headers.get("content-type")?.includes("application/json")) return reply({ text: "Formato non valido." }, 415);
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
            if (bytes > 4096) { await reader.cancel(); return reply({ text: "Messaggio troppo lungo." }, 413); }
            raw += decoder.decode(chunk.value, { stream: true });
          }
          raw += decoder.decode();
        } catch { return reply({ text: "Richiesta non valida." }, 400); }
        let body: unknown;
        try { body = JSON.parse(raw); } catch { return reply({ text: "Richiesta non valida." }, 400); }
        const text = parseChatInput(body);
        if (!text) return reply({ text: "Scrivi una domanda di massimo 240 caratteri." }, 400);
        const ip = request.headers.get("cf-connecting-ip");
        const quota = limit(ip ?? "local-preview");
        if (!quota.allowed) return reply({ text: quota.remaining === 0 ? "Limite di 5 domande raggiunto. Riprova più tardi o visita Contatti." : "Attendi qualche secondo prima di inviare un'altra domanda.", remaining: quota.remaining }, 429, { "Retry-After": String(quota.retryAfter) });
        const answer = shortcutAnswer(text);
        if (answer) return reply({ text: answer, mode: "guide", remaining: quota.remaining });

        const key = process.env.LOVABLE_API_KEY;
        if (!key || !ip) return reply({ text: "Le risposte AI non sono ancora attive. Posso indicarti Radio, Podcast, Eventi, News, Member, App e Contatti: scrivi uno di questi argomenti.", mode: "guide", remaining: quota.remaining });

        const gateway = createLovableAiGatewayProvider(key);
        const model = gateway("google/gemini-3-flash-preview");

        try {
          const result = await generateText({
            model,
            system: CHAT_SYSTEM,
            messages: [{ role: "user", content: text }],
            maxOutputTokens: 120,
            maxRetries: 0,
            abortSignal: AbortSignal.timeout(12000),
          });
          return reply({ text: result.text.trim() || "Consulta [Contatti](/contatti).", mode: "ai", remaining: quota.remaining });
        } catch {
          return reply({ text: "Il servizio AI è temporaneamente indisponibile. Consulta [FAQ](/faq) o [Contatti](/contatti).", mode: "guide", remaining: quota.remaining }, 503);
        }
      },
    },
  },
});
