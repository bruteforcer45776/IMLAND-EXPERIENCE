/**
 * Filo rouge dell'ecosistema IMLAND — timeline verticale che si accende
 * durante lo scroll. Ogni tappa ha il bollino della verticale e il colore
 * di appartenenza (Alert rosso, Terrain marrone, Eventi verde, Jobs grigio,
 * News viola, Radio azzurro, Podcast blu, Member giallo).
 */

import { useEffect, useRef, useState, type CSSProperties } from "react";
import { Link } from "@tanstack/react-router";

import { BadgeIcon, type BadgeName } from "@/components/badge-icon";
import { ICON_TONES, type IconTone } from "@/components/brand-icons";

type Step = {
  tone: IconTone;
  badge: BadgeName;
  service: string;
  title: string;
  desc: string;
  to: string;
};

const STEPS: Step[] = [
  {
    tone: "alert",
    badge: "alert",
    service: "Alert",
    title: "Tutto parte da una segnalazione.",
    desc: "Una persona o un'azienda segnala ciò che accade: un evento, una promozione, una novità, un problema sul territorio.",
    to: "/alert",
  },
  {
    tone: "terrain",
    badge: "mappa",
    service: "Terrain",
    title: "La segnalazione trova il suo luogo.",
    desc: "Attività, negozi e punti di interesse diventano schede sulla mappa del territorio, con promozioni e informazioni sempre aggiornate.",
    to: "/terrain",
  },
  {
    tone: "eventi",
    badge: "calendario",
    service: "Eventi",
    title: "Se è un evento, entra in calendario.",
    desc: "Date, luoghi e appuntamenti finiscono nel calendario condiviso e raggiungono chi vive quella zona.",
    to: "/eventi",
  },
  {
    tone: "jobs",
    badge: "jobs",
    service: "Jobs",
    title: "Se è un'opportunità, diventa lavoro.",
    desc: "Le aziende raccontano chi cercano e le persone del territorio trovano occasioni vere, vicino a casa.",
    to: "/jobs",
  },
  {
    tone: "news",
    badge: "news",
    service: "News",
    title: "Se fa notizia, diventa racconto.",
    desc: "La redazione verifica e trasforma le informazioni in articoli chiari, con le fonti sempre in evidenza.",
    to: "/news",
  },
  {
    tone: "radio",
    badge: "radio",
    service: "Radio",
    title: "La voce arriva in diretta.",
    desc: "Quello che accade sul territorio entra nella programmazione radiofonica e raggiunge chi ascolta ogni giorno.",
    to: "/radio",
  },
  {
    tone: "podcast",
    badge: "podcast",
    service: "Podcast",
    title: "Le storie restano nel tempo.",
    desc: "Interviste e approfondimenti diventano puntate da ascoltare quando si vuole e da far scoprire ad altri.",
    to: "/podcast",
  },
  {
    tone: "member",
    badge: "community",
    service: "Member",
    title: "La community chiude il cerchio.",
    desc: "Membri e aziende partner vivono l'ecosistema dall'interno: vantaggi, visibilità e relazioni sul territorio.",
    to: "/member",
  },
];

export function EcosystemFlow() {
  const wrapRef = useRef<HTMLDivElement | null>(null);
  const [progress, setProgress] = useState(0);
  const [active, setActive] = useState<number[]>([]);

  useEffect(() => {
    const el = wrapRef.current;
    if (!el) return;

    let frame = 0;
    const onScroll = () => {
      if (frame) return;
      frame = requestAnimationFrame(() => {
        frame = 0;
        const rect = el.getBoundingClientRect();
        const vh = window.innerHeight;
        const total = rect.height + vh * 0.4;
        const seen = vh * 0.75 - rect.top;
        setProgress(Math.min(1, Math.max(0, seen / total)));
      });
    };

    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      if (frame) cancelAnimationFrame(frame);
    };
  }, []);

  useEffect(() => {
    const nodes = wrapRef.current?.querySelectorAll<HTMLElement>("[data-step]");
    if (!nodes || nodes.length === 0) return;

    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          const idx = Number((entry.target as HTMLElement).dataset["step"]);
          setActive((prev) => (prev.includes(idx) ? prev : [...prev, idx]));
        });
      },
      { rootMargin: "0px 0px -25% 0px", threshold: 0.25 },
    );

    nodes.forEach((n) => io.observe(n));
    return () => io.disconnect();
  }, []);

  return (
    <section className="relative overflow-hidden bg-white section-pad">
      <div className="mx-auto w-full max-w-[1200px] px-4 md:px-8">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-black/55">
          Come funziona IMLAND
        </p>
        <h2 className="mt-3 text-h2-im">
          Un'informazione sola, tutto l'<span className="im-gradient-text">ecosistema</span>.
        </h2>
        <p className="mt-4 max-w-2xl text-base text-ink-600">
          Segui il filo: quello che nasce da una segnalazione attraversa tutti i servizi.
          <br />
          Ogni tappa ha il suo colore e il suo posto sul territorio.
        </p>

        <div ref={wrapRef} className="relative mt-14 pl-10 md:pl-0">
          {/* filo rouge */}
          <div
            aria-hidden
            className="pointer-events-none absolute left-[15px] top-0 h-full w-[3px] rounded-full bg-black/10 md:left-1/2 md:-translate-x-1/2"
          />
          <div
            aria-hidden
            className="pointer-events-none absolute left-[15px] top-0 w-[3px] origin-top rounded-full bg-black md:left-1/2 md:-translate-x-1/2"
            style={{
              height: `${progress * 100}%`,
              transition: "height 120ms linear",
            }}
          />

          <ol className="relative space-y-10 md:space-y-16">
            {STEPS.map((step, i) => {
              const on = active.includes(i);
              const left = i % 2 === 0;
              return (
                <li
                  key={step.service}
                  data-step={i}
                  className={`relative md:grid md:grid-cols-2 md:items-center md:gap-12 ${
                    on ? "opacity-100" : "opacity-0"
                  } translate-y-0 transition-all duration-700 ease-out`}
                  style={
                    {
                      "--bento-tone": ICON_TONES[step.tone],
                      transform: on ? "none" : "translateY(28px)",
                      transitionDelay: `${(i % 2) * 60}ms`,
                    } as CSSProperties
                  }
                >
                  {/* pallino sul filo */}
                  <span
                    aria-hidden
                    className="absolute -left-10 top-1/2 h-8 w-8 -translate-y-1/2 rounded-full border-4 border-white shadow-md md:left-1/2 md:-translate-x-1/2"
                    style={{ background: "var(--bento-tone)" }}
                  />

                  <div
                    className={
                      left
                        ? "md:col-start-1 md:row-start-1 md:justify-self-end md:pr-6"
                        : "md:col-start-2 md:row-start-1 md:justify-self-start md:pl-6"
                    }
                  >
                    <Link
                      // eslint-disable-next-line @typescript-eslint/no-explicit-any
                      to={step.to as any}
                      className="bento-card group block rounded-[28px] p-6 no-underline sm:p-7"
                      style={{ "--bento-tone": ICON_TONES[step.tone] } as CSSProperties}
                    >
                      <div className="flex items-center gap-4">
                        <BadgeIcon
                          name={step.badge}
                          tone={step.tone as never}
                          className="h-14 w-14"
                        />
                        <span className="text-xs font-semibold uppercase tracking-[0.18em] text-[var(--bento-tone)]">
                          {step.service}
                        </span>
                      </div>
                      <h3 className="mt-5 font-display text-lg font-bold leading-snug text-ink-950">
                        {step.title}
                      </h3>
                      <p className="mt-2 text-sm leading-relaxed text-ink-600">{step.desc}</p>
                      <span className="mt-5 inline-flex w-fit items-center rounded-full border border-current/20 bg-white/75 px-4 py-2 text-sm font-semibold text-[var(--bento-tone)]">
                        Scopri
                      </span>
                    </Link>
                  </div>
                </li>
              );
            })}
          </ol>
        </div>
      </div>
    </section>
  );
}
