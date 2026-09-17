import { ChevronLeft, ChevronRight } from "lucide-react";
import { useEffect, useState } from "react";

const slides = [
  { city: "Vercelli", desktop: "/assets/hero-carousel/vercelli-desktop-1.webp", mobile: "/assets/hero-carousel/vercelli-mobile-1.webp", desktopPosition: "50% 24%", mobilePosition: "50% 12%" },
  { city: "Verbania", desktop: "/assets/hero-carousel/verbania-desktop-1.webp", mobile: "/assets/hero-carousel/verbania-mobile-1.webp", desktopPosition: "50% 24%", mobilePosition: "50% 10%" },
  { city: "Novara", desktop: "/assets/hero-carousel/novara-desktop-1.webp", mobile: "/assets/hero-carousel/novara-mobile-1.webp", desktopPosition: "50% 20%", mobilePosition: "50% 9%" },
  { city: "Biella", desktop: "/assets/hero-carousel/biella-desktop-1.webp", mobile: "/assets/hero-carousel/biella-mobile-1.webp", desktopPosition: "50% 22%", mobilePosition: "50% 10%" },
] as const;

export function HeroCinematic() {
  const [active, setActive] = useState(0);
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const timer = window.setInterval(() => setActive((current) => (current + 1) % slides.length), 6500);
    return () => window.clearInterval(timer);
  }, []);
  const select = (index: number) => setActive((index + slides.length) % slides.length);
  return (
    <section className="hero-frame home-unified-hero relative overflow-hidden bg-sky-500" aria-label="Territori IMLAND" aria-roledescription="carosello">
      {slides.map((slide, index) => (
        <picture key={slide.city} className={`absolute inset-0 transition-opacity duration-700 motion-reduce:transition-none ${index === active ? "z-10 opacity-100" : "pointer-events-none opacity-0"}`} aria-hidden={index !== active}>
          <source media="(max-width: 639px) and (orientation: portrait)" srcSet={slide.mobile} />
          <img src={slide.desktop} alt={index === active ? `IMLAND ${slide.city}` : ""} width={1672} height={941} loading={index === 0 ? "eager" : "lazy"} fetchPriority={index === 0 ? "high" : "auto"} decoding="async" className="hero-territory-image h-full w-full object-cover" style={{ "--hero-desktop-position": slide.desktopPosition, "--hero-mobile-position": slide.mobilePosition } as React.CSSProperties} />
        </picture>
      ))}
      <div className="hero-sand-overlay absolute inset-0 z-10" aria-hidden />
      <div className="pointer-events-none absolute inset-0 z-20 flex items-center justify-center px-5 py-20 text-center md:px-10">
        <div className="mx-auto flex max-w-5xl flex-col items-center text-white drop-shadow-[0_3px_18px_rgba(0,0,0,0.7)]">
          <h1 className="font-display text-[clamp(2.35rem,6vw,5.5rem)] font-extrabold uppercase leading-[0.98] tracking-[-0.035em] text-balance !text-white">
            DAI VOCE AL TUO TERRITORIO
          </h1>
          <p className="mt-7 font-display text-[clamp(1.2rem,2.6vw,2rem)] font-bold uppercase tracking-[0.08em] !text-white">
            RADIO · PODCAST · EVENTI
          </p>
          <p className="mt-5 font-keyword text-[clamp(1.35rem,2.6vw,2.2rem)] italic !text-white">
            Storie e racconti di persone e aziende
          </p>
          <p className="mt-8 max-w-4xl text-[clamp(.78rem,1.6vw,1.05rem)] font-bold uppercase leading-relaxed tracking-[0.12em] !text-white">
            VERCELLI · NOVARA · BIELLA · VERBANO CUSIO OSSOLA
          </p>
        </div>
      </div>
      <div className="absolute inset-x-4 bottom-28 z-30 flex items-center justify-between gap-4 md:inset-x-8 md:bottom-7">
        <button type="button" onClick={() => select(active - 1)} className="grid h-11 w-11 place-items-center rounded-full border border-white/70 bg-black/35 text-white shadow-lg backdrop-blur-md transition hover:bg-black/55 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white" aria-label="Territorio precedente"><ChevronLeft className="h-5 w-5" aria-hidden /></button>
        <div className="flex items-center gap-2 rounded-full border border-white/60 bg-black/35 px-3 py-2 backdrop-blur-md">
          {slides.map((slide, index) => <button key={slide.city} type="button" onClick={() => select(index)} className={`h-2.5 rounded-full transition-all motion-reduce:transition-none ${index === active ? "w-7 bg-white" : "w-2.5 bg-white/55 hover:bg-white/80"}`} aria-label={`Mostra ${slide.city}`} aria-current={index === active ? "true" : undefined} />)}
        </div>
        <button type="button" onClick={() => select(active + 1)} className="grid h-11 w-11 place-items-center rounded-full border border-white/70 bg-black/35 text-white shadow-lg backdrop-blur-md transition hover:bg-black/55 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white" aria-label="Territorio successivo"><ChevronRight className="h-5 w-5" aria-hidden /></button>
      </div>
    </section>
  );
}
