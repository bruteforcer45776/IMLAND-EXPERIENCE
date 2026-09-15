import { useEffect, useId, useRef, useState, type FormEvent } from "react";
import { Link } from "@tanstack/react-router";
import { WHATSAPP_MEMBER_URL } from "@/lib/whatsapp";
import { Accessibility, Bot, Send, X, Type, Minus, Plus, Contrast, ZapOff } from "lucide-react";

// WhatsApp icon (replace number below with the real business number)

function WhatsAppIcon({ size = 20 }: { size?: number }) {
  return (
    <svg viewBox="0 0 24 24" width={size} height={size} fill="currentColor" aria-hidden="true">
      <path d="M12 2C6.48 2 2 6.48 2 12c0 2.17.7 4.18 1.89 5.83L2 22l4.29-1.89A9.96 9.96 0 0 0 12 22c5.52 0 10-4.48 10-10S17.52 2 12 2zm0 18a7.96 7.96 0 0 1-4.07-1.12l-.29-.17-2.54 1.12.56-2.47-.18-.29A7.96 7.96 0 0 1 4 12c0-4.41 3.59-8 8-8s8 3.59 8 8-3.59 8-8 8zm4.29-5.79c-.23-.12-1.37-.68-1.58-.75-.21-.08-.36-.12-.51.12-.15.23-.58.75-.71.9-.13.15-.27.17-.5.08-.23-.12-.98-.36-1.86-1.13-.69-.61-1.15-1.37-1.29-1.61-.13-.23-.01-.36.1-.47.1-.1.23-.27.34-.41.12-.14.15-.23.23-.38.08-.15.04-.28-.02-.39-.06-.11-.52-1.17-.71-1.61-.19-.42-.38-.36-.51-.37-.12 0-.27-.01-.42-.01-.15 0-.38.06-.58.27-.2.22-.77.74-.77 1.8 0 1.06.77 2.09.88 2.24.11.15 1.53 2.33 3.71 3.27.52.22.92.36 1.24.45.52.17 1 .14 1.37.09.42-.06 1.28-.5 1.46-.98.18-.48.18-.89.13-.98-.05-.09-.19-.14-.42-.25z" />
    </svg>
  );
}

export function StickyActions() {
  const [open, setOpen] = useState(false);
  const [fontSize, setFontSize] = useState<1 | 2 | 3>(1);
  const [reduceMotion, setReduceMotion] = useState(false);
  const [highContrast, setHighContrast] = useState(false);
  const titleId = useId();
  const panelRef = useRef<HTMLDivElement>(null);

  // Load preferences from localStorage on mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem("imland-a11y");
      if (stored) {
        const parsed = JSON.parse(stored);
        if (typeof parsed.fontSize === "number") setFontSize(parsed.fontSize);
        if (typeof parsed.reduceMotion === "boolean") setReduceMotion(parsed.reduceMotion);
        if (typeof parsed.highContrast === "boolean") setHighContrast(parsed.highContrast);
      }
    } catch {
      // ignore invalid storage
    }
  }, []);

  // Apply preferences and persist them
  useEffect(() => {
    const scale = fontSize === 1 ? "100%" : fontSize === 2 ? "110%" : "125%";
    document.documentElement.style.fontSize = scale;
    document.documentElement.classList.toggle("reduce-motion", reduceMotion);
    document.documentElement.classList.toggle("high-contrast", highContrast);
    try {
      localStorage.setItem("imland-a11y", JSON.stringify({ fontSize, reduceMotion, highContrast }));
    } catch {
      // ignore storage errors
    }
  }, [fontSize, reduceMotion, highContrast]);

  // Focus the panel title and close on Esc
  useEffect(() => {
    if (!open) return;
    const panel = panelRef.current;
    if (panel) {
      const title = panel.querySelector<HTMLElement>("[tabindex='-1']");
      title?.focus();
    }
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setOpen(false);
      }
    };
    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [open]);

  return (
    <>
      <AiChatbot />
      <aside
        aria-label="Azioni rapide"
        className="fixed bottom-[calc(9rem+env(safe-area-inset-bottom))] right-3 z-[59] flex flex-col gap-2 md:bottom-40 md:right-4 md:gap-3"
      >
      <a
        href={WHATSAPP_MEMBER_URL}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Contattaci su WhatsApp"
        className="sticky-glass inline-flex h-11 w-11 items-center justify-center rounded-full text-foreground transition-colors hover:bg-white/50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring md:h-12 md:w-12"
      >
        <WhatsAppIcon size={20} />
      </a>

      <button
        onClick={() => setOpen((v) => !v)}
        aria-label={open ? "Chiudi opzioni di accessibilità" : "Apri opzioni di accessibilità"}
        aria-expanded={open}
        className="sticky-glass inline-flex h-11 w-11 items-center justify-center rounded-full text-foreground transition-colors hover:bg-white/50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring md:h-12 md:w-12"
      >
        {open ? <X size={20} aria-hidden="true" /> : <Accessibility size={20} aria-hidden="true" />}
      </button>

      {open && (
        <>
          <div
            className="fixed inset-0 z-[55] bg-foreground/20"
            onClick={() => setOpen(false)}
            aria-hidden="true"
          />
          <div
            ref={panelRef}
            role="dialog"
            aria-modal="true"
            aria-labelledby={titleId}
            className="sticky-glass fixed bottom-[calc(10.75rem+env(safe-area-inset-bottom))] right-3 z-[60] w-[min(20rem,calc(100vw-1.5rem))] rounded-[20px] p-4 md:bottom-36 md:right-4"
          >
            <div className="flex items-center justify-between">
              <h2 id={titleId} tabIndex={-1} className="text-h3-im">
                Accessibilità
              </h2>
              <button
                onClick={() => setOpen(false)}
                aria-label="Chiudi"
                className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-white/12 bg-white/5 hover:bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              >
                <X size={16} />
              </button>
            </div>

            <div className="mt-4 space-y-4">
              {/* Font size */}
              <div>
                <div className="mb-2 flex items-center gap-2 text-sm font-medium text-foreground">
                  <Type size={16} aria-hidden="true" />
                  Dimensione testo
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setFontSize((s) => (s > 1 ? ((s - 1) as 1 | 2 | 3) : s))}
                    aria-label="Riduci dimensione testo"
                    className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-white/12 bg-white/5 hover:bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                  >
                    <Minus size={16} />
                  </button>
                  <span className="min-w-[3rem] text-center text-sm font-semibold">
                    {fontSize === 1 ? "100%" : fontSize === 2 ? "110%" : "125%"}
                  </span>
                  <button
                    onClick={() => setFontSize((s) => (s < 3 ? ((s + 1) as 1 | 2 | 3) : s))}
                    aria-label="Aumenta dimensione testo"
                    className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-white/12 bg-white/5 hover:bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                  >
                    <Plus size={16} />
                  </button>
                </div>
              </div>

              {/* Reduce motion */}
              <button
                onClick={() => setReduceMotion((v) => !v)}
                aria-pressed={reduceMotion}
                className={`flex w-full items-center justify-between rounded-2xl border px-3 py-2.5 text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring ${
                  reduceMotion
                    ? "border-foreground bg-signal text-white"
                    : "border-border bg-white/5 hover:bg-white/10"
                }`}
              >
                <span className="flex items-center gap-2">
                  <ZapOff size={16} aria-hidden="true" />
                  Riduci animazioni
                </span>
                <span className="text-xs font-semibold">{reduceMotion ? "ON" : "OFF"}</span>
              </button>

              {/* High contrast */}
              <button
                onClick={() => setHighContrast((v) => !v)}
                aria-pressed={highContrast}
                className={`flex w-full items-center justify-between rounded-2xl border px-3 py-2.5 text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring ${
                  highContrast
                    ? "border-foreground bg-signal text-white"
                    : "border-border bg-white/5 hover:bg-white/10"
                }`}
              >
                <span className="flex items-center gap-2">
                  <Contrast size={16} aria-hidden="true" />
                  Alto contrasto
                </span>
                <span className="text-xs font-semibold">{highContrast ? "ON" : "OFF"}</span>
              </button>

              <Link
                to="/contatti"
                onClick={() => setOpen(false)}
                className="block rounded-2xl border border-white/12 bg-white/5 px-3 py-2.5 text-sm font-medium hover:bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              >
                Segnala un problema di accessibilità
              </Link>
            </div>
          </div>
        </>
      )}
      </aside>
    </>
  );
}

type ChatMessage = { id: string; role: "user" | "assistant"; text: string };

function AiChatbot() {
  const [chatOpen, setChatOpen] = useState(false);
  const [input, setInput] = useState("");
  const [sending, setSending] = useState(false);
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
    if (!chatOpen) return;
    inputRef.current?.focus();
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setChatOpen(false);
    };
    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [chatOpen]);

  const submit = async (event: FormEvent) => {
    event.preventDefault();
    const text = input.trim();
    if (!text || sending) return;
    const next = [...messages, { id: crypto.randomUUID(), role: "user" as const, text }];
    setMessages(next);
    setInput("");
    setSending(true);
    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          simple: true,
          messages: next.map((message) => ({
            id: message.id,
            role: message.role,
            parts: [{ type: "text", text: message.text }],
          })),
        }),
      });
      if (!response.ok) throw new Error("chat unavailable");
      const data = (await response.json()) as { text?: string };
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
    <div className="fixed bottom-[calc(10rem+env(safe-area-inset-bottom))] left-3 z-[60] md:bottom-24 md:left-4">
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
                <p className="text-xs text-white/60">Online · risposte sul territorio</p>
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
              <p
                key={message.id}
                className={`max-w-[88%] whitespace-pre-wrap rounded-2xl px-4 py-3 text-sm leading-relaxed ${
                  message.role === "user"
                    ? "ml-auto bg-im-blue text-white"
                    : "bg-white/10 text-white/90"
                }`}
              >
                {message.text}
              </p>
            ))}
            {sending && <p className="w-fit rounded-2xl bg-white/10 px-4 py-3 text-sm text-white/65">Sto scrivendo…</p>}
          </div>

          <form onSubmit={submit} className="flex items-center gap-2 border-t border-white/10 p-3">
            <label htmlFor={`${panelId}-input`} className="sr-only">Scrivi un messaggio</label>
            <input
              ref={inputRef}
              id={`${panelId}-input`}
              value={input}
              onChange={(event) => setInput(event.target.value)}
              placeholder="Chiedi a IMLAND…"
              className="h-11 min-w-0 flex-1 rounded-full border border-white/10 bg-white/10 px-4 text-sm text-white outline-none placeholder:text-white/45 focus:border-white/35"
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
        onClick={() => setChatOpen((value) => !value)}
        aria-expanded={chatOpen}
        aria-controls={panelId}
        aria-label={chatOpen ? "Chiudi chatbot AI" : "Apri chatbot AI"}
        className="flex h-14 w-14 items-center justify-center rounded-full bg-im-blue text-white shadow-xl transition-transform hover:scale-105 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white md:h-16 md:w-16"
      >
        {chatOpen ? <X size={24} aria-hidden /> : <Bot size={25} aria-hidden />}
      </button>
    </div>
  );
}
