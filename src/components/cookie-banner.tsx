import { useEffect, useState } from "react";
import { BrandIcon } from "./brand-icons";
import { Link } from "@tanstack/react-router";
import { useModalA11y } from "@/hooks/use-modal-a11y";

const STORAGE_KEY = "imland-cookie-consent";

type Consent = {
  necessary: true;
  analytics: boolean;
  marketing: boolean;
  ts: number;
};

export function CookieBanner() {
  const [open, setOpen] = useState(false);
  const [showDetails, setShowDetails] = useState(false);
  const [analytics, setAnalytics] = useState(false);
  const [marketing, setMarketing] = useState(false);

  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const consent = JSON.parse(saved) as Consent;
        setAnalytics(Boolean(consent.analytics));
        setMarketing(Boolean(consent.marketing));
        setOpen(false);
      } else {
        setOpen(true);
      }
    } catch {
      setOpen(true);
    }
    const handler = () => setOpen(true);
    window.addEventListener("imland:cookie-reset", handler);
    return () => window.removeEventListener("imland:cookie-reset", handler);
  }, []);

  const save = (consent: Consent) => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(consent));
    } catch {
      // ignore
    }
    setOpen(false);
    window.dispatchEvent(new CustomEvent("imland:cookie-consent-updated"));
  };

  const acceptAll = () =>
    save({ necessary: true, analytics: true, marketing: true, ts: Date.now() });
  const rejectAll = () =>
    save({ necessary: true, analytics: false, marketing: false, ts: Date.now() });
  const saveChoices = () => save({ necessary: true, analytics, marketing, ts: Date.now() });
  const { dialogRef, initialFocusRef } = useModalA11y(open);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm">
      <div
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-live="polite"
        aria-label="Informativa sull'uso dei cookie"
        className="w-full max-w-2xl overflow-hidden rounded-3xl border border-border bg-card p-5 text-center shadow-2xl md:p-6"
      >
        <div className="relative flex flex-col items-center gap-4">
          <div className="flex-1">
            <h2 className="flex items-center justify-center gap-2 text-title-m">
              <BrandIcon name="verificato" className="h-5 w-5" aria-hidden />
              Rispettiamo la tua privacy
            </h2>
            <p className="mt-1.5 text-xs text-muted-foreground">
              Utilizziamo cookie tecnici necessari al funzionamento del sito e, previo consenso,
              cookie di analisi e marketing come previsto dal GDPR. Puoi accettare, rifiutare o
              personalizzare la tua scelta. Maggiori informazioni nella{" "}
              <Link to="/cookie" className="underline hover:text-signal">
                Cookie Policy
              </Link>{" "}
              e nella{" "}
              <Link to="/privacy" className="underline hover:text-signal">
                Privacy Policy
              </Link>
              .
            </p>

            {showDetails && (
              <div className="mt-3 space-y-2 text-xs">
                <label className="flex items-start gap-2 rounded-lg border border-border p-2">
                  <input type="checkbox" checked disabled className="mt-1" />
                  <span>
                    <span className="font-medium">Necessari</span> — sempre attivi. Garantiscono il
                    funzionamento del sito.
                  </span>
                </label>
                <label className="flex items-start gap-2 rounded-lg border border-border p-2">
                  <input
                    type="checkbox"
                    checked={analytics}
                    onChange={(e) => setAnalytics(e.target.checked)}
                    className="mt-1"
                  />
                  <span>
                    <span className="font-medium">Analisi</span> — statistiche aggregate d&apos;uso
                    per migliorare il sito.
                  </span>
                </label>
                <label className="flex items-start gap-2 rounded-lg border border-border p-2">
                  <input
                    type="checkbox"
                    checked={marketing}
                    onChange={(e) => setMarketing(e.target.checked)}
                    className="mt-1"
                  />
                  <span>
                    <span className="font-medium">Marketing</span> — contenuti e comunicazioni
                    personalizzate.
                  </span>
                </label>
              </div>
            )}
          </div>

          <div className="flex w-full flex-col justify-center gap-2 sm:flex-row">
            <button
              ref={initialFocusRef}
              type="button"
              onClick={acceptAll}
              className="min-h-9 rounded-full bg-primary px-3 py-1.5 text-xs font-medium text-primary-foreground hover:opacity-90"
            >
              Accetta tutti
            </button>
            <button
              type="button"
              onClick={rejectAll}
              className="min-h-9 rounded-full border border-border bg-surface-1 px-3 py-1.5 text-xs font-medium text-foreground transition hover:bg-surface-2"
            >
              Rifiuta
            </button>
            {showDetails ? (
              <button
                type="button"
                onClick={saveChoices}
                className="min-h-9 rounded-full border border-border bg-surface-1 px-3 py-1.5 text-xs font-medium text-foreground transition hover:bg-surface-2"
              >
                Salva preferenze
              </button>
            ) : (
              <button
                type="button"
                onClick={() => setShowDetails(true)}
                className="min-h-9 rounded-full border border-border bg-surface-1 px-3 py-1.5 text-xs font-medium text-foreground transition hover:bg-surface-2"
              >
                Personalizza
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
