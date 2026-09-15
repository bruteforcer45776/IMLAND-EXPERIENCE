import { Link } from "@tanstack/react-router";
import { Download, Smartphone } from "lucide-react";
import bannerBg from "@/assets/download-app-banner.png.asset.json";

export function DownloadAppBanner({ children }: { children?: React.ReactNode }) {
  return (
    <section className="home-color-band relative overflow-hidden bg-signal text-signal-foreground">
      <div className="container-im relative px-5 py-10 md:px-10 md:py-14">
        <img
          src={bannerBg.url}
          alt=""
          aria-hidden="true"
          loading="lazy"
          decoding="async"
          className="pointer-events-none absolute inset-y-0 right-0 h-full w-full object-contain object-right opacity-90 md:opacity-100"
        />
        <div className="pointer-events-none absolute inset-0 bg-signal/70 md:bg-transparent" />
        <div className="relative z-10 grid gap-6 text-center md:grid-cols-[1.4fr_auto] md:items-center md:text-left">
          <div className="mx-auto md:mx-0">
            <div className="inline-flex items-center gap-2 rounded-full bg-background/15 px-3 py-1 text-xs font-semibold uppercase tracking-wider">
              <Smartphone className="h-3.5 w-3.5" />
              Web App
            </div>
            <h2 className="mt-4 text-h2-im">Scarica IMLAND sul tuo dispositivo</h2>
            <p className="mt-3 max-w-xl text-sm text-signal-foreground/85 md:text-base">
              Installa la nostra web app su iPhone, Android, Mac, Windows o Linux. Nessun app store,
              niente aggiornamenti manuali: sempre l'ultima versione, un tocco per aprirla.
            </p>
            <div className="mt-6">
              <div className="flex flex-wrap items-center justify-center gap-3 md:justify-start">
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
                  className="side-blue inline-flex items-center gap-2 rounded-full border border-background/40 px-6 py-3 text-sm font-semibold hover:bg-background/15"
                >
                  Come funziona
                </Link>
              </div>
            </div>
          </div>
          {children && (
            <div className="relative z-10 flex justify-center md:justify-end">{children}</div>
          )}
        </div>
      </div>
    </section>
  );
}
