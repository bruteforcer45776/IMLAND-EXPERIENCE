import { useCallback, useEffect, useRef, useState } from "react";
import { X } from "lucide-react";

export function NewsDisclaimerModal() {
  const [open, setOpen] = useState(true);
  const dialogRef = useRef<HTMLDivElement>(null);
  const closeButtonRef = useRef<HTMLButtonElement>(null);
  const previousFocusRef = useRef<HTMLElement | null>(null);

  const close = useCallback(() => {
    setOpen(false);
    window.requestAnimationFrame(() => previousFocusRef.current?.focus());
  }, []);

  useEffect(() => {
    previousFocusRef.current = document.activeElement instanceof HTMLElement ? document.activeElement : null;
  }, []);

  useEffect(() => {
    if (!open) return;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    closeButtonRef.current?.focus();

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        event.preventDefault();
        close();
        return;
      }
      if (event.key !== "Tab") return;
      const focusable = dialogRef.current?.querySelectorAll<HTMLElement>(
        'button:not([disabled]), a[href], [tabindex]:not([tabindex="-1"])',
      );
      if (!focusable?.length) return;
      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    };

    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.body.style.overflow = previousOverflow;
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [close, open]);

  if (!open) return null;
  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center overflow-y-auto bg-black/60 p-4">
      <div
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby="news-disclaimer-title"
        aria-describedby="news-disclaimer-description"
        className="relative my-auto w-full min-w-0 max-w-xl rounded-3xl border border-border bg-background p-6 shadow-2xl md:p-8"
      >
        <button
          ref={closeButtonRef}
          onClick={close}
          className="absolute right-4 top-4 rounded-full p-1 text-muted-foreground hover:bg-muted"
          aria-label="Chiudi"
        >
          <X className="h-5 w-5" />
        </button>
        <h2 id="news-disclaimer-title" className="pr-10 text-h3-im">Una rassegna, fonti sempre visibili.</h2>
        <p id="news-disclaimer-description" className="mt-4 text-base leading-relaxed text-muted-foreground">
          IMLAND News seleziona notizie pubblicate da testate giornalistiche del territorio. Titoli,
          immagini e informazioni restano attribuiti alla fonte indicata: ogni card apre l’articolo
          originale sul sito dell’editore. IMLAND non è una testata giornalistica.
        </p>
        <button
          onClick={close}
          className="mt-6 inline-flex items-center justify-center rounded-full bg-primary px-6 py-3 text-sm font-medium text-primary-foreground"
        >
          Continua alla rassegna
        </button>
      </div>
    </div>
  );
}
