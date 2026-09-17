import { useEffect, useState } from "react";
import { Link } from "@tanstack/react-router";
import { Download, X, Smartphone } from "lucide-react";
import bannerBg from "../assets/download-app-bg.png.asset.json";
import { useModalA11y } from "@/hooks/use-modal-a11y";

const STORAGE_KEY = "imland-app-popup-seen";

export function DownloadAppPopup() {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (sessionStorage.getItem(STORAGE_KEY)) return;
    const t = window.setTimeout(() => setOpen(true), 9000);
    return () => window.clearTimeout(t);
  }, []);

  const close = () => {
    setOpen(false);
    try {
      sessionStorage.setItem(STORAGE_KEY, "1");
    } catch {
      /* ignore */
    }
  };

  const { dialogRef, initialFocusRef } = useModalA11y(open, close);

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-[110] flex items-center justify-center bg-black/70 p-4 backdrop-blur-md"
      onClick={close}
    >
      <div
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-label="Scarica l'app IMLAND"
        onClick={(e) => e.stopPropagation()}
        className="relative w-full max-w-sm overflow-hidden rounded-3xl border border-border bg-signal text-center text-signal-foreground shadow-2xl"
      >
        <img
          src={bannerBg.url}
          alt=""
          aria-hidden="true"
          loading="lazy"
          decoding="async"
          className="pointer-events-none absolute inset-y-0 right-0 h-full w-full object-contain object-right"
        />
        <div className="pointer-events-none absolute inset-0 bg-signal/75" />

        <div className="relative z-10 p-6">
          <button
            ref={initialFocusRef}
            type="button"
            onClick={close}
            aria-label="Chiudi"
            className="absolute right-4 top-4 inline-flex h-9 w-9 items-center justify-center rounded-full bg-ink/25 text-white transition hover:bg-ink/40"
          >
            <X className="h-4 w-4" />
          </button>

          <div className="h-40 md:h-48" aria-hidden="true" />

          <div className="mt-5 inline-flex items-center justify-center gap-2 rounded-full bg-ink/20 px-3 py-1 text-xs font-semibold uppercase tracking-wider">
            <Smartphone className="h-3.5 w-3.5" aria-hidden />
            App IMLAND
          </div>
          <h2 className="mt-3 text-h3-im pr-10">Scarica IMLAND sul tuo dispositivo</h2>
          <p className="mt-2 text-sm leading-relaxed text-signal-foreground/85">
            Installala su iPhone, Android o desktop.
            <br />
            Un tocco per aprirla, sempre l'ultima versione.
          </p>
          <div className="mt-6 flex flex-wrap items-center justify-center gap-2.5">
            <Link
              to="/scarica-app"
              onClick={close}
              className="inline-flex items-center gap-2 rounded-full bg-card px-5 py-2.5 text-sm font-semibold text-foreground shadow-lg transition hover:bg-surface-1"
            >
              <Download className="h-4 w-4" />
              Scarica l'app
            </Link>
            <button
              type="button"
              onClick={close}
              className="inline-flex items-center gap-2 rounded-full border border-white/35 px-5 py-2.5 text-sm font-semibold text-signal-foreground transition hover:bg-ink/15"
            >
              Più tardi
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
