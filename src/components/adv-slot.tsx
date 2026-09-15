import { useEffect, useState } from "react";
import type { CSSProperties } from "react";
import { Link } from "@tanstack/react-router";
import { ArrowRight, Megaphone } from "lucide-react";

/**
 * Spazio pubblicitario del sito: tre banner (alto, medio, basso),
 * ognuno con tre slide a rotazione. Colori pieni, nessun gradiente.
 */
export type AdvPosition = "alto" | "medio" | "basso";

type Slide = { bg: string; fg: string; title: string; body: string; cta: string };

const SLIDES: Record<AdvPosition, Slide[]> = {
  alto: [
    {
      bg: "var(--color-surface-radio)",
      fg: "#ffffff",
      title: "QUESTO SPAZIO PUÒ ESSERE TUO",
      body: "Il tuo brand in apertura della home, davanti a tutta la community del territorio.",
      cta: "Diventa Partner",
    },
    {
      bg: "var(--im-yellow)",
      fg: "#111111",
      title: "QUESTO SPAZIO PUÒ ESSERE TUO",
      body: "Spot in radio, presenza online e visibilità negli eventi IMLAND.",
      cta: "Scopri i pacchetti",
    },
    {
      bg: "var(--color-surface-podcast)",
      fg: "#ffffff",
      title: "QUESTO SPAZIO PUÒ ESSERE TUO",
      body: "Racconta la tua attività a chi vive e ascolta il Piemonte ogni giorno.",
      cta: "Parliamone",
    },
  ],
  medio: [
    {
      bg: "var(--color-surface-eventi)",
      fg: "#ffffff",
      title: "QUESTO SPAZIO PUÒ ESSERE TUO",
      body: "Il tuo messaggio tra le sezioni più lette della home.",
      cta: "Diventa Partner",
    },
    {
      bg: "var(--color-surface-news)",
      fg: "#ffffff",
      title: "QUESTO SPAZIO PUÒ ESSERE TUO",
      body: "Uno spazio dedicato alla tua azienda, dentro un hub territoriale indipendente.",
      cta: "Scopri i pacchetti",
    },
    {
      bg: "var(--color-surface-radio)",
      fg: "#ffffff",
      title: "QUESTO SPAZIO PUÒ ESSERE TUO",
      body: "Comunica con chi ama il territorio: radio, podcast, eventi e news.",
      cta: "Parliamone",
    },
  ],
  basso: [
    {
      bg: "var(--color-surface-podcast)",
      fg: "#ffffff",
      title: "QUESTO SPAZIO PUÒ ESSERE TUO",
      body: "Chiudi la visita del lettore con il tuo brand in evidenza.",
      cta: "Diventa Partner",
    },
    {
      bg: "var(--im-yellow)",
      fg: "#111111",
      title: "QUESTO SPAZIO PUÒ ESSERE TUO",
      body: "Entra nella rete Member IMLAND e fatti conoscere sul territorio.",
      cta: "Scopri i pacchetti",
    },
    {
      bg: "var(--color-surface-eventi)",
      fg: "#ffffff",
      title: "QUESTO SPAZIO PUÒ ESSERE TUO",
      body: "Un unico spazio, tutte le voci del Piemonte nord-orientale.",
      cta: "Parliamone",
    },
  ],
};

export function AdvSlot({ position }: { position: AdvPosition }) {
  const slides = SLIDES[position];
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const id = window.setInterval(() => setIndex((i) => (i + 1) % slides.length), 6000);
    return () => window.clearInterval(id);
  }, [slides.length]);

  const slide = slides[index]!;

  return (
    <section
      className="home-adv-slot"
      aria-label={`Spazio pubblicitario ${position}`}
      style={{ "--adv-bg": slide.bg, color: slide.fg } as CSSProperties}
    >
      <div
        className="relative mx-auto w-full max-w-[1200px] overflow-hidden px-5 py-6 md:px-8 md:py-8"
      >
        <div className="grid gap-4 text-center md:grid-cols-[1fr_auto] md:items-center md:text-left">
          <div className="mx-auto md:mx-0">
            <span
              className="inline-flex items-center gap-2 rounded-full px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.16em]"
              style={{
                background: slide.fg === "#111111" ? "rgba(0,0,0,0.12)" : "rgba(0,0,0,0.28)",
              }}
            >
              <Megaphone className="h-3 w-3" />
              Spazio pubblicitario
            </span>
            <h2 className="mt-2 font-display text-lg font-extrabold uppercase tracking-tight md:text-2xl">
              {slide.title}
            </h2>
            <p className="mt-1.5 max-w-2xl text-sm md:text-base" style={{ opacity: 0.92 }}>
              {slide.body}
            </p>
          </div>
          <Link
            to="/member"
            className="mx-auto inline-flex h-11 items-center justify-center gap-2 rounded-full px-5 text-sm font-semibold transition-opacity hover:opacity-90 md:mx-0"
            style={{ background: slide.fg, color: slide.bg }}
          >
            {slide.cta}
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>

        <div className="mt-4 flex items-center justify-center gap-2 md:justify-start">
          {slides.map((s, i) => (
            <button
              key={s.body}
              type="button"
              onClick={() => setIndex(i)}
              aria-label={`Slide ${i + 1} di ${slides.length}`}
              aria-current={i === index}
              className="h-2 rounded-full transition-all"
              style={{
                width: i === index ? "1.5rem" : "0.5rem",
                background: slide.fg,
                opacity: i === index ? 1 : 0.45,
              }}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
