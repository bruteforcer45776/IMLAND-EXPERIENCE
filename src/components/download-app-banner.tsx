import { Link } from "@tanstack/react-router";
import { Download, Smartphone } from "lucide-react";

export function DownloadAppBanner({ children }: { children?: React.ReactNode }) {
  return (
    <section className="home-download-glass relative overflow-hidden">
      <div className="container-im px-5 py-10 text-center md:px-10 md:py-14">
        <div className="mx-auto flex max-w-3xl flex-col items-center">
          <div className="inline-flex h-14 w-14 items-center justify-center rounded-full border border-[var(--signal)]/25 bg-white/65 text-signal shadow-[0_12px_30px_rgb(1_29_104/12%)]">
            <Download className="h-6 w-6" aria-hidden="true" />
          </div>
          <div className="mt-5 inline-flex items-center gap-2 rounded-full border border-[var(--signal)]/20 bg-white/55 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-signal">
            <Smartphone className="h-3.5 w-3.5" />
            Web App
          </div>
          <h2 className="mt-4 text-h2-im">Scarica IMLAND sul tuo dispositivo</h2>
          <p className="mt-3 max-w-xl text-sm text-ink-600 md:text-base">
              Installa la nostra web app su iPhone, Android, Mac, Windows o Linux. Nessun app store,
              niente aggiornamenti manuali: sempre l'ultima versione, un tocco per aprirla.
          </p>
          <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
            <Link
              to="/scarica-app"
              className="inline-flex items-center gap-2 rounded-full btn-blue px-6 py-3 text-sm"
            >
              <Download className="h-4 w-4" />
              Scarica l'app
            </Link>
            <Link
              to="/scarica-app"
              hash="guida"
              className="inline-flex items-center gap-2 rounded-full border border-[var(--signal)]/25 bg-white/55 px-6 py-3 text-sm font-semibold text-signal transition-colors hover:bg-white"
            >
              Come funziona
            </Link>
          </div>
          {children && (
            <div className="mt-6 flex justify-center">{children}</div>
          )}
        </div>
      </div>
    </section>
  );
}
