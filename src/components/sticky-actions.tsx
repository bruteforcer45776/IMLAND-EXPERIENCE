import { useEffect, useId, useRef, useState, type FormEvent } from "react";
import { WHATSAPP_MEMBER_URL } from "@/lib/whatsapp";
import { Bot, Send, X } from "lucide-react";
import { CHAT_LIMIT, CHAT_MAX_CHARS, CHAT_WINDOW_MS } from "@/lib/chat-policy";
import { usePlayer } from "./player-context";

// WhatsApp icon (replace number below with the real business number)

function WhatsAppIcon({ size = 20 }: { size?: number }) {
  return (
    <svg viewBox="0 0 24 24" width={size} height={size} fill="currentColor" aria-hidden="true">
      <path d="M12 2C6.48 2 2 6.48 2 12c0 2.17.7 4.18 1.89 5.83L2 22l4.29-1.89A9.96 9.96 0 0 0 12 22c5.52 0 10-4.48 10-10S17.52 2 12 2zm0 18a7.96 7.96 0 0 1-4.07-1.12l-.29-.17-2.54 1.12.56-2.47-.18-.29A7.96 7.96 0 0 1 4 12c0-4.41 3.59-8 8-8s8 3.59 8 8-3.59 8-8 8zm4.29-5.79c-.23-.12-1.37-.68-1.58-.75-.21-.08-.36-.12-.51.12-.15.23-.58.75-.71.9-.13.15-.27.17-.5.08-.23-.12-.98-.36-1.86-1.13-.69-.61-1.15-1.37-1.29-1.61-.13-.23-.01-.36.1-.47.1-.1.23-.27.34-.41.12-.14.15-.23.23-.38.08-.15.04-.28-.02-.39-.06-.11-.52-1.17-.71-1.61-.19-.42-.38-.36-.51-.37-.12 0-.27-.01-.42-.01-.15 0-.38.06-.58.27-.2.22-.77.74-.77 1.8 0 1.06.77 2.09.88 2.24.11.15 1.53 2.33 3.71 3.27.52.22.92.36 1.24.45.52.17 1 .14 1.37.09.42-.06 1.28-.5 1.46-.98.18-.48.18-.89.13-.98-.05-.09-.19-.14-.42-.25z" />
    </svg>
  );
}

export function StickyActions() {
  return (
    <>
      <AiChatbot />
      <aside
        aria-label="Azioni rapide"
        className="floating-actions-right fixed right-3 z-[59] flex flex-col gap-2 md:right-4 md:gap-3"
      >
        <a
          href={WHATSAPP_MEMBER_URL}
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Contattaci su WhatsApp"
          className="inline-flex h-12 w-12 items-center justify-center rounded-full bg-[#25D366] text-white shadow-[0_10px_28px_rgba(37,211,102,0.38)] transition hover:scale-105 hover:bg-[#20bd5a] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white md:h-14 md:w-14"
        >
          <WhatsAppIcon size={26} />
        </a>
      </aside>
    </>
  );
}

type ChatMessage = { id: string; role: "user" | "assistant"; text: string };

function AiChatbot() {
  const { chatOpen, setChatOpen } = usePlayer();
  const [input, setInput] = useState("");
  const [sending, setSending] = useState(false);
  const [remaining, setRemaining] = useState(CHAT_LIMIT);
  const [guideMode, setGuideMode] = useState(true);
  const quotaRef = useRef({ count: 0, resetAt: 0 });
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: "welcome",
      role: "assistant",
      text: "Ciao! Sono l’assistente IMLAND. Posso aiutarti a trovare radio, podcast, eventi, news e informazioni per diventare Member.",
    },
  ]);
  const inputRef = useRef<HTMLInputElement>(null);
  const panelId = useId();

  useEffect(() => {
    try {
      const saved = JSON.parse(sessionStorage.getItem("imland-chat-quota") || "null");
      if (
        saved &&
        Number.isFinite(saved.count) &&
        saved.count >= 0 &&
        saved.resetAt > Date.now() &&
        saved.resetAt <= Date.now() + CHAT_WINDOW_MS
      ) {
        quotaRef.current = saved;
        setRemaining(Math.max(0, CHAT_LIMIT - saved.count));
      }
    } catch {
      /* Storage is optional; server validation still applies. */
    }
  }, []);

  useEffect(() => {
    if (!chatOpen) return;
    inputRef.current?.focus();
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setChatOpen(false);
    };
    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [chatOpen, setChatOpen]);

  const submit = async (event: FormEvent) => {
    event.preventDefault();
    const text = input.trim();
    if (!text || text.length > CHAT_MAX_CHARS || sending) return;
    const now = Date.now();
    if (quotaRef.current.resetAt <= now)
      quotaRef.current = { count: 0, resetAt: now + CHAT_WINDOW_MS };
    if (quotaRef.current.count >= CHAT_LIMIT) {
      setMessages((current) => [
        ...current,
        {
          id: crypto.randomUUID(),
          role: "assistant",
          text: "Hai raggiunto il limite di 5 domande. Riprova tra 30 minuti oppure visita Contatti.",
        },
      ]);
      return;
    }
    quotaRef.current.count++;
    setRemaining(CHAT_LIMIT - quotaRef.current.count);
    try {
      sessionStorage.setItem("imland-chat-quota", JSON.stringify(quotaRef.current));
    } catch {
      /* Optional storage. */
    }
    const next = [...messages, { id: crypto.randomUUID(), role: "user" as const, text }];
    setMessages(next);
    setInput("");
    setSending(true);
    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          text,
        }),
        signal: AbortSignal.timeout(15000),
      });
      const data = (await response.json()) as { text?: string; mode?: string; remaining?: number };
      if (!data.text) throw new Error("chat unavailable");
      setGuideMode(data.mode !== "ai");
      if (typeof data.remaining === "number")
        setRemaining(Math.min(CHAT_LIMIT - quotaRef.current.count, Math.max(0, data.remaining)));
      setMessages((current) => [
        ...current,
        {
          id: crypto.randomUUID(),
          role: "assistant",
          text: data.text?.trim() || "Non ho trovato una risposta. Puoi riprovare?",
        },
      ]);
    } catch {
      setMessages((current) => [
        ...current,
        {
          id: crypto.randomUUID(),
          role: "assistant",
          text: "In questo momento non riesco a rispondere. Puoi riprovare tra poco oppure visitare la pagina Contatti.",
        },
      ]);
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="floating-chatbot fixed left-3 z-[60] md:left-4">
      {chatOpen && (
        <section
          id={panelId}
          role="dialog"
          aria-label="Chatbot AI IMLAND"
          data-surface="dark"
          className="absolute bottom-[4.25rem] left-0 flex h-[min(68vh,560px)] w-[min(92vw,380px)] origin-bottom-left flex-col overflow-hidden rounded-[24px] border border-white/15 bg-ink/95 text-white shadow-2xl backdrop-blur-xl animate-enter"
        >
          <header className="flex items-center justify-between border-b border-white/10 px-4 py-3">
            <div className="flex items-center gap-3">
              <span className="flex h-10 w-10 items-center justify-center rounded-full bg-im-blue text-white">
                <Bot size={20} aria-hidden />
              </span>
              <div>
                <h2 className="font-display text-base font-bold">Assistente IMLAND</h2>
                <p className="text-xs text-white/70">
                  {guideMode ? "Guida rapida" : "Risposte rapide"} · {remaining} richieste
                  disponibili
                </p>
              </div>
            </div>
            <button
              type="button"
              onClick={() => setChatOpen(false)}
              aria-label="Chiudi chat"
              className="flex h-9 w-9 items-center justify-center rounded-full bg-white/5 transition-colors hover:bg-white/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white"
            >
              <X size={18} />
            </button>
          </header>

          <div className="scrollbar-imland flex-1 space-y-3 overflow-y-auto p-4" aria-live="polite">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`max-w-[88%] whitespace-pre-wrap rounded-2xl px-4 py-3 text-sm leading-relaxed ${
                  message.role === "user"
                    ? "ml-auto bg-im-blue text-white"
                    : "bg-white/10 text-white/90"
                }`}
              >
                {message.text.split(/(\[[^\]]+\]\(\/[a-zA-Z0-9/_-]*\))/g).map((part, index) => {
                  const link = part.match(/^\[([^\]]+)\]\((\/[a-zA-Z0-9/_-]*)\)$/);
                  return link ? (
                    <a
                      key={index}
                      href={link[2]}
                      className="font-semibold underline underline-offset-4"
                    >
                      {link[1]}
                    </a>
                  ) : (
                    part
                  );
                })}
              </div>
            ))}
            {sending && (
              <p className="w-fit rounded-2xl bg-white/10 px-4 py-3 text-sm text-white/65">
                Sto scrivendo…
              </p>
            )}
          </div>

          <form onSubmit={submit} className="flex items-center gap-2 border-t border-white/10 p-3">
            <label htmlFor={`${panelId}-input`} className="sr-only">
              Scrivi un messaggio
            </label>
            <input
              ref={inputRef}
              id={`${panelId}-input`}
              value={input}
              onChange={(event) => setInput(event.target.value)}
              placeholder="Chiedi a IMLAND…"
              maxLength={CHAT_MAX_CHARS}
              className="h-11 min-w-0 flex-1 rounded-full border border-white/10 bg-white/10 px-4 text-base text-white outline-none placeholder:text-white/70 focus:border-white/35"
              disabled={sending}
            />
            <button
              type="submit"
              aria-label="Invia messaggio"
              disabled={sending || !input.trim()}
              className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-im-blue text-white transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white"
            >
              <Send size={18} aria-hidden />
            </button>
          </form>
        </section>
      )}

      <button
        type="button"
        onClick={() => setChatOpen(!chatOpen)}
        aria-expanded={chatOpen}
        aria-controls={panelId}
        aria-label={chatOpen ? "Chiudi chatbot AI" : "Apri chatbot AI"}
        className="sticky-chat-trigger flex h-14 w-14 items-center justify-center rounded-full text-white shadow-xl transition-transform hover:scale-105 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white md:h-16 md:w-16"
      >
        {chatOpen ? <X size={24} aria-hidden /> : <Bot size={25} aria-hidden />}
      </button>
    </div>
  );
}
