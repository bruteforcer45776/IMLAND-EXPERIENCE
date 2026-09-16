import { ChevronLeft, ChevronRight } from "lucide-react";
import { useEffect, useState } from "react";

const slides = [
  { city: "Vercelli", desktop: "/hero-carousel/vercelli-desktop.png", mobile: "/hero-carousel/vercelli-mobile.png", desktopPosition: "50% 24%", mobilePosition: "50% 12%" },
  { city: "Verbania", desktop: "/hero-carousel/verbania-desktop.png", mobile: "/hero-carousel/verbania-mobile.png", desktopPosition: "50% 24%", mobilePosition: "50% 10%" },
  { city: "Novara", desktop: "/hero-carousel/novara-desktop.png", mobile: "/hero-carousel/novara-mobile.png", desktopPosition: "50% 20%", mobilePosition: "50% 9%" },
  { city: "Biella", desktop: "/hero-carousel/biella-desktop.png", mobile: "/hero-carousel/biella-mobile.png", desktopPosition: "50% 22%", mobilePosition: "50% 10%" },
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
    <section className="home-unified-hero relative min-h-[620px] overflow-hidden bg-sky-500 md:min-h-[680px]" aria-label="Territori IMLAND" aria-roledescription="carosello">
      {slides.map((slide, index) => (
        <picture key={slide.city} className={`absolute inset-0 transition-opacity duration-700 motion-reduce:transition-none ${index === active ? "z-10 opacity-100" : "pointer-events-none opacity-0"}`} aria-hidden={index !== active}>
          <source media="(max-width: 639px) and (orientation: portrait)" srcSet={slide.mobile} />
          <img src={slide.desktop} alt={index === active ? `IMLAND ${slide.city}` : ""} width={1672} height={941} loading={index === 0 ? "eager" : "lazy"} fetchPriority={index === 0 ? "high" : "auto"} decoding="async" className="hero-territory-image h-full w-full object-cover" style={{ "--hero-desktop-position": slide.desktopPosition, "--hero-mobile-position": slide.mobilePosition } as React.CSSProperties} />
        </picture>
      ))}
      <div className="absolute inset-x-4 bottom-28 z-20 flex items-center justify-between gap-4 md:inset-x-8 md:bottom-7">
        <button type="button" onClick={() => select(active - 1)} className="grid h-11 w-11 place-items-center rounded-full border border-white/70 bg-black/35 text-white shadow-lg backdrop-blur-md transition hover:bg-black/55 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white" aria-label="Territorio precedente"><ChevronLeft className="h-5 w-5" aria-hidden /></button>
        <div className="flex items-center gap-2 rounded-full border border-white/60 bg-black/35 px-3 py-2 backdrop-blur-md">
          {slides.map((slide, index) => <button key={slide.city} type="button" onClick={() => select(index)} className={`h-2.5 rounded-full transition-all motion-reduce:transition-none ${index === active ? "w-7 bg-white" : "w-2.5 bg-white/55 hover:bg-white/80"}`} aria-label={`Mostra ${slide.city}`} aria-current={index === active ? "true" : undefined} />)}
        </div>
        <button type="button" onClick={() => select(active + 1)} className="grid h-11 w-11 place-items-center rounded-full border border-white/70 bg-black/35 text-white shadow-lg backdrop-blur-md transition hover:bg-black/55 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white" aria-label="Territorio successivo"><ChevronRight className="h-5 w-5" aria-hidden /></button>
      </div>
    </section>
  );
}
