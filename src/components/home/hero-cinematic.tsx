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
    <section className="home-split-hero grid min-h-[560px] overflow-hidden bg-white lg:grid-cols-[.9fr_1.1fr]">
      <div className="hero-editorial relative z-10 flex items-center px-6 py-12 md:px-10 lg:px-14">
        <div className="hero-editorial__copy w-full max-w-xl">
          <p className="hero-editorial__label">Territori · idee · persone · storie</p>
          <h1 className="text-display-l max-w-4xl text-left text-ink-950">Dai voce al tuo <span>territorio</span></h1>
          <p className="mt-5 max-w-xl text-left text-body-l font-medium leading-relaxed text-ink-950">Radio, podcast, eventi e persone che raccontano Vercelli, Novara, Biella e il Verbano-Cusio-Ossola.</p>
          <div className="mt-9 flex flex-wrap items-center justify-start gap-3">
            <Link to="/radio" className="group inline-flex h-12 items-center gap-2.5 rounded-full btn-blue px-7 text-[15px]">Ascolta la diretta <Play className="h-4 w-4 fill-current" /></Link>
            <Link to="/scarica-app" className="inline-flex h-12 items-center gap-2 rounded-full border border-black/15 bg-white px-6 text-[15px] font-semibold text-ink-950">Scarica l'app <Download size={18} /></Link>
            <Link to="/chi-siamo" className="inline-flex h-12 items-center gap-2 rounded-full border border-black/15 bg-white px-6 text-[15px] font-semibold text-ink-950">Scopri IMLAND <ArrowRight size={18} /></Link>
          </div>
        </div>
      </div>

      <div className="hero-visual relative min-h-[360px] overflow-hidden rounded-[2rem_0_0_2rem] lg:min-h-[560px]">
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
              className="h-full w-full object-cover object-center"
            />
          </picture>
        ))}
        <div className="hero-editorial__aside absolute right-5 top-5 z-20 hidden items-center gap-3 rounded-[24px] bg-white/95 px-4 py-3 shadow-lg md:flex">
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
      </div>
    </section>
  );
}
