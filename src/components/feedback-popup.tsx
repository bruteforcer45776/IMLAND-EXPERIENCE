import { useEffect, useState } from "react";
import { Star, X, Heart } from "lucide-react";
import { toast } from "sonner";
import { z } from "zod";

import { isSupabaseConfigured, supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/use-auth";

const SUBMITTED_KEY = "imland-feedback-submitted-v2";
const DISMISSED_UNTIL_KEY = "imland-feedback-dismissed-until-v2";
const DELAY_MS = 120_000;
const DISMISS_FOR_MS = 7 * 24 * 60 * 60 * 1000;
const NOTE_MAX = 1000;

const feedbackSchema = z.object({
  rating: z.number().int().min(1, { message: "Seleziona una valutazione" }).max(5),
  note: z
    .string()
    .trim()
    .max(NOTE_MAX, { message: `La nota deve stare entro ${NOTE_MAX} caratteri` }),
});

/** Sondaggio di soddisfazione mostrato dopo due minuti di navigazione. */
export function FeedbackPopup() {
  const { user } = useAuth();
  const [open, setOpen] = useState(false);
  const [rating, setRating] = useState(0);
  const [hover, setHover] = useState(0);
  const [note, setNote] = useState("");
  const [sending, setSending] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    try {
      if (localStorage.getItem(SUBMITTED_KEY)) return;
      const dismissedUntil = Number(localStorage.getItem(DISMISSED_UNTIL_KEY) ?? 0);
      if (dismissedUntil > Date.now()) return;
    } catch {
      /* ignore */
    }
    const t = window.setTimeout(() => setOpen(true), DELAY_MS);
    return () => window.clearTimeout(t);
  }, []);

  const rememberDismissal = () => {
    try {
      localStorage.setItem(DISMISSED_UNTIL_KEY, String(Date.now() + DISMISS_FOR_MS));
    } catch {
      /* ignore */
    }
  };

  const close = () => {
    setOpen(false);
    rememberDismissal();
  };

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") close();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  const submit = async () => {
    const parsed = feedbackSchema.safeParse({ rating, note });
    if (!parsed.success) {
      toast.error(parsed.error.issues[0]?.message ?? "Controlla i dati inseriti");
      return;
    }
    setSending(true);
    const { error } = isSupabaseConfigured()
      ? await supabase.from("site_feedback").insert({
          rating: parsed.data.rating,
          note: parsed.data.note.length > 0 ? parsed.data.note : null,
          page_path: window.location.pathname.slice(0, 300),
          user_id: user?.id ?? null,
        })
      : { error: new Error("Servizio recensioni non configurato") };
    setSending(false);
    if (error) {
      toast.error("Non è stato possibile inviare il feedback. Riprova più tardi.");
      return;
    }
    toast.success("Grazie, la tua opinione è stata registrata.");
    setSubmitted(true);
    try {
      localStorage.setItem(SUBMITTED_KEY, "1");
      localStorage.removeItem(DISMISSED_UNTIL_KEY);
    } catch {
      /* ignore */
    }
    window.setTimeout(() => setOpen(false), 3500);
  };

  if (!open) return null;

  const shown = hover || rating;

  return (
    <div
      className="fixed inset-0 z-[120] flex items-center justify-center bg-black/70 p-4 backdrop-blur-md"
      onClick={close}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="feedback-title"
        onClick={(e) => e.stopPropagation()}
        className="relative w-full max-w-md overflow-hidden rounded-3xl border border-border bg-card p-6 shadow-2xl"
      >
        <button
          type="button"
          onClick={close}
          aria-label="Chiudi il sondaggio"
          className="absolute right-4 top-4 rounded-full p-2 text-muted-foreground hover:bg-muted"
        >
          <X className="h-4 w-4" />
        </button>

        {submitted ? (
          <div className="flex flex-col items-center py-6 text-center">
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-[#facc15]/20">
              <Heart className="h-8 w-8 fill-[#facc15] text-[#facc15]" />
            </div>
            <h2 id="feedback-title" className="mt-5 text-title-l">
              Grazie!
            </h2>
            <p className="mt-2 text-[15px] text-muted-foreground">
              La tua opinione ci aiuta a migliorare IMLAND Experience.
            </p>
            <div className="mt-4 flex items-center gap-1">
              {[1, 2, 3, 4, 5].map((value) => (
                <Star
                  key={value}
                  className={`h-6 w-6 ${
                    value <= rating ? "fill-[#facc15] text-[#facc15]" : "fill-white text-border"
                  }`}
                  aria-hidden="true"
                />
              ))}
            </div>
            <p className="mt-5 text-sm text-muted-foreground">
              Ti ricontatteremo presto se ci saranno novità.
            </p>
          </div>
        ) : (
          <>
            <p className="text-xs font-semibold uppercase tracking-wider text-signal">Sondaggio</p>
            <h2 id="feedback-title" className="mt-2 text-title-l">
              La tua opinione è importante
            </h2>
            <p className="mt-2 text-[15px] text-muted-foreground">
              Come valuti la tua esperienza su questo sito?
            </p>

            <div
              className="mt-5 flex items-center gap-2"
              role="radiogroup"
              aria-label="Valutazione da 1 a 5 stelle"
            >
              {[1, 2, 3, 4, 5].map((value) => (
                <button
                  key={value}
                  type="button"
                  role="radio"
                  aria-checked={rating === value}
                  aria-label={`${value} ${value === 1 ? "stella" : "stelle"}`}
                  onMouseEnter={() => setHover(value)}
                  onMouseLeave={() => setHover(0)}
                  onFocus={() => setHover(value)}
                  onBlur={() => setHover(0)}
                  onClick={() => setRating(value)}
                  className="rounded-full p-1 transition-transform hover:scale-110"
                >
                  <Star
                    className={`h-9 w-9 ${
                      value <= shown ? "fill-[#facc15] text-[#facc15]" : "fill-white text-border"
                    }`}
                  />
                </button>
              ))}
            </div>

            <label htmlFor="feedback-note" className="mt-5 block text-sm font-semibold">
              Vuoi aggiungere una nota?
            </label>
            <textarea
              id="feedback-note"
              value={note}
              maxLength={NOTE_MAX}
              onChange={(e) => setNote(e.target.value)}
              rows={4}
              placeholder="Raccontaci cosa ti è piaciuto o cosa possiamo migliorare."
              className="mt-2 w-full rounded-2xl border border-border bg-background p-3 text-sm outline-none focus:border-signal"
            />
            <p className="mt-1 text-right text-xs text-muted-foreground">
              {note.length}/{NOTE_MAX}
            </p>

            <div className="mt-4 flex items-center justify-end gap-3">
              <button
                type="button"
                onClick={close}
                className="rounded-full border border-border px-5 py-2.5 text-sm font-semibold hover:bg-muted"
              >
                Non ora
              </button>
              <button
                type="button"
                onClick={() => void submit()}
                disabled={sending || rating === 0}
                className="rounded-full bg-signal px-6 py-2.5 text-sm font-bold text-white disabled:opacity-50"
              >
                {sending ? "Invio…" : "Invia"}
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
