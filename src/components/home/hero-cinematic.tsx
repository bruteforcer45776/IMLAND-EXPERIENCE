import { Link } from "@tanstack/react-router";
import { Play, ArrowRight, Download } from "lucide-react";
import { streamingPlatforms } from "@/components/streaming-banner";

const heroSlides = [
  {
    desktop: "/assets/hero-carousel/vercelli-desktop-1.webp",
    mobile: "/assets/hero-carousel/vercelli-mobile-1.webp",
  },
  {
    desktop: "/assets/hero-carousel/verbania-desktop-1.webp",
    mobile: "/assets/hero-carousel/verbania-mobile-1.webp",
  },
  {
    desktop: "/assets/hero-carousel/novara-desktop-1.webp",
    mobile: "/assets/hero-carousel/novara-mobile-1.webp",
  },
  {
    desktop: "/assets/hero-carousel/biella-desktop-1.webp",
    mobile: "/assets/hero-carousel/biella-mobile-1.webp",
  },
];

export function HeroCinematic() {
  return (
    <section className="relative isolate flex min-h-[680px] flex-col overflow-hidden bg-[#dce5ea] md:min-h-[640px] md:aspect-[1672/941] md:max-h-[calc(100svh-74px)]">
      <div className="pointer-events-none absolute inset-0">
        {heroSlides.map((slide, index) => (
          <picture
            key={slide.desktop}
            className="im-hero-slide absolute inset-0"
            style={{ animationDelay: `${index * 5}s` }}
          >
            <source media="(max-width: 767px)" srcSet={slide.mobile} />
            <img
              src={slide.desktop}
              alt=""
              aria-hidden
              width={1792}
              height={1024}
              loading={index === 0 ? "eager" : "lazy"}
              fetchPriority={index === 0 ? "high" : "auto"}
              decoding="async"
              className="h-full w-full object-contain object-center"
            />
          </picture>
        ))}
      </div>

      <div
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "linear-gradient(180deg, rgba(0,0,0,0.20) 0%, rgba(0,0,0,0.12) 45%, rgba(0,0,0,0.34) 78%, rgba(0,0,0,0.58) 100%)",
        }}
        aria-hidden
      />

      <div className="relative z-10 mx-auto flex w-full max-w-[1280px] flex-1 flex-col items-center justify-center px-4 pb-24 pt-8 text-center md:px-10 md:pb-28 md:pt-8">
        <div className="w-full max-w-3xl rounded-[28px] border border-white/20 bg-black/20 px-5 py-7 shadow-[0_24px_80px_rgba(0,0,0,0.28)] backdrop-blur-xl backdrop-saturate-[1.2] md:px-10 md:py-9">
        <h1 className="text-display-l max-w-4xl text-white [text-shadow:0_2px_14px_rgba(0,0,0,0.7)]">
          Dai voce al tuo <span>territorio</span>
        </h1>

        <p className="mx-auto mt-5 max-w-xl text-body-l font-medium leading-relaxed text-white/85">
          Radio, podcast, eventi e persone che raccontano Vercelli, Novara, Biella e il
          Verbano-Cusio-Ossola.
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
            className="inline-flex h-12 items-center gap-2 rounded-full border border-white/25 bg-black/20 px-6 text-[15px] font-semibold text-white transition-colors hover:bg-black/35"
          >
            Scarica l'app
            <Download size={18} className="text-white/75" />
          </Link>
          <Link
            to="/chi-siamo"
            className="inline-flex h-12 items-center gap-2 rounded-full border border-white/25 bg-black/20 px-6 text-[15px] font-semibold text-white transition-colors hover:bg-black/35"
          >
            Scopri IMLAND
            <ArrowRight size={18} className="text-ink-500" />
          </Link>
        </div>
        </div>
      </div>

      <div className="absolute bottom-6 right-6 z-20 hidden items-center gap-3 rounded-2xl border border-white/45 bg-white/92 px-4 py-3 shadow-lg backdrop-blur-sm md:flex">
        <span className="text-xs font-semibold uppercase tracking-wider text-ink-600">
          Ascoltaci anche su
        </span>
        <div className="flex items-center gap-2">
          {streamingPlatforms.map((p) => (
            <a
              key={p.name}
              href={p.url}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={p.name}
              className="flex h-8 w-8 items-center justify-center rounded-full bg-white p-1 transition-transform hover:scale-110"
            >
              <img src={p.icon} alt={p.name} className="h-full w-full object-contain" loading="lazy" />
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}
