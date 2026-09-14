import { Link } from "@tanstack/react-router";
import { Play, ArrowRight, Download } from "lucide-react";
import heroBg from "@/assets/piemonte-skyline.webp.asset.json";
import { streamingPlatforms } from "@/components/streaming-banner";

export function HeroCinematic() {
  return (
    <section className="relative isolate flex min-h-[86vh] flex-col overflow-hidden bg-white md:min-h-[92vh]">
      {/* Sfondo hero: skyline Piemonte, intero e ancorato in basso */}
      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-[55%] md:h-[72%]">
        <img
          src={heroBg.url}
          alt=""
          aria-hidden
          width={774}
          height={322}
          loading="eager"
          fetchPriority="high"
          decoding="async"
          className="h-full w-full object-contain object-bottom md:object-cover"
        />
      </div>
      {/* Scrim bianco in alto per leggibilità del copy */}
      <div
        className="pointer-events-none absolute inset-0"
        style={{ background: "linear-gradient(180deg, rgba(255,255,255,1) 0%, rgba(255,255,255,0.98) 30%, rgba(255,255,255,0.92) 52%, rgba(255,255,255,0.72) 66%, rgba(255,255,255,0.28) 84%, rgba(255,255,255,0) 100%)" }}
        aria-hidden
      />


      <div className="relative z-10 mx-auto flex w-full max-w-[1280px] flex-1 flex-col items-center justify-center px-4 pb-16 pt-4 text-center md:px-10 md:pt-6 md:pb-24">
        <span className="inline-flex items-center gap-2 rounded-full border border-border bg-white px-4 py-1.5 text-[13px] font-semibold text-ink-600 shadow-sm">
          <span className="relative flex h-2 w-2">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-im-green opacity-75" />
            <span className="relative inline-flex h-2 w-2 rounded-full bg-im-green" />
          </span>
          Radio, podcast ed eventi del territorio
        </span>

        <h1 className="text-display-l mt-6 max-w-4xl text-ink-950">
          Dai voce al tuo{" "}
          <span className="im-gradient-text">territorio</span>
        </h1>

        <p className="mt-6 max-w-xl text-body-l text-ink-600">
          Radio, podcast, eventi e persone che raccontano Vercelli, Novara,
          Biella e il Verbano-Cusio-Ossola.
        </p>

        <div className="mt-9 flex flex-wrap items-center justify-center gap-3">
          <Link
            to="/radio"
            className="group inline-flex h-12 items-center gap-2.5 rounded-full btn-blue px-7 text-[15px]"
          >
            Ascolta la diretta
            <span className="flex h-6 w-6 items-center justify-center rounded-full bg-white/20">
              <Play className="h-3 w-3 fill-white text-white" />
            </span>
          </Link>
          <Link
            to="/scarica-app"
            className="inline-flex h-12 items-center gap-2 rounded-full border border-border bg-white px-6 text-[15px] font-semibold text-ink-800 transition-colors hover:bg-muted"
          >
            Scarica l'app
            <Download size={18} className="text-ink-400" />
          </Link>
          <Link
            to="/chi-siamo"
            className="inline-flex h-12 items-center gap-2 rounded-full border border-border bg-white px-6 text-[15px] font-semibold text-ink-800 transition-colors hover:bg-muted"
          >
            Scopri IMLAND
            <ArrowRight size={18} className="text-ink-400" />
          </Link>
        </div>

        <p className="mt-8 text-[13px] text-ink-400">
          Diretta radio 24/7 · Podcast on demand · Eventi dal vivo
        </p>
      </div>

      {/* Piattaforme di streaming — in basso a destra */}
      <div className="absolute bottom-6 right-6 z-20 hidden items-center gap-3 rounded-full border border-border bg-white/90 px-4 py-2 shadow-sm backdrop-blur-sm md:flex">
        <span className="text-xs font-semibold uppercase tracking-wider text-ink-600">
          Ascoltaci su:
        </span>
        <div className="flex items-center gap-2">
          {streamingPlatforms.map((p) => (
            <a
              key={p.name}
              href={p.url}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={p.name}
              className="h-6 w-6 transition-transform hover:scale-110"
            >
              <img src={p.icon} alt={p.name} className="h-full w-full" loading="lazy" />
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}
