/**
 * FONTE UNICA per loghi e colori di ogni sezione del sito.
 *
 * Aggiungi/modifica una sezione qui e tutto il resto si adatta
 * automaticamente: logo nell'header, attributo `data-section`,
 * variabili CSS (--signal, --horizon, --ring...) usate da CTA,
 * player, link e accenti in tutto il sito.
 */
import type { CSSProperties } from "react";

import logoDefault from "@/assets/imland-logo-home.webp.asset.json";
import logoRadio from "@/assets/imland-logo-radio-v2-opt.webp.asset.json";
import logoPodcast from "@/assets/imland-logo-podcast-v2-opt.webp.asset.json";
import logoMember from "@/assets/imland-logo-member-v2-opt.webp.asset.json";
import logoEventi from "@/assets/imland-logo-eventi-v2-opt.webp.asset.json";
import logoNews from "@/assets/imland-logo-news.png.asset.json";

export type SectionKey = "default" | "radio" | "podcast" | "member" | "eventi" | "news";

export type SectionTheme = {
  /** colore dominante: CTA, link, accenti */
  signal: string;
  /** variante scura AA-safe: sfondo dei bottoni con testo bianco */
  signalStrong: string;
  /** variante scura AA-safe: testo/icone del colore su fondo bianco */
  signalInk: string;
  /** testo/icone sopra il colore dominante */
  signalForeground: string;
  /** alone/glow chiaro del colore dominante */
  signalGlow: string;
  /** variante tenue per gradienti e bordi */
  horizon: string;
};

export type SectionConfig = {
  key: SectionKey;
  label: string;
  /** prefisso di route (null per il tema di default) */
  prefix: string | null;
  logo: { url: string; alt: string };
  theme: SectionTheme;
};

export const SECTIONS: SectionConfig[] = [
  {
    key: "radio",
    label: "Radio",
    prefix: "/radio",
    logo: { url: logoRadio.url, alt: "IMLAND RADIO" },
    theme: {
      signal: "#0aa2cf",
      signalStrong: "#077ea1",
      signalInk: "#076d8c",
      signalForeground: "#ffffff",
      signalGlow: "#bfeeff",
      horizon: "#7fdcf5",
    },
  },
  {
    key: "podcast",
    label: "Podcast",
    prefix: "/podcast",
    logo: { url: logoPodcast.url, alt: "IMLAND PODCAST" },
    theme: {
      signal: "#1646d8",
      signalStrong: "#1646d8",
      signalInk: "#1646d8",
      signalForeground: "#ffffff",
      signalGlow: "#c8d6ff",
      horizon: "#9db4ff",
    },
  },
  {
    key: "member",
    label: "Member",
    prefix: "/member",
    logo: { url: logoMember.url, alt: "IMLAND MEMBER" },
    theme: {
      signal: "#e0a800",
      signalStrong: "#e0a800",
      signalInk: "#8a6700",
      signalForeground: "#0b0c0f",
      signalGlow: "#ffe9a3",
      horizon: "#ffd75e",
    },
  },
  {
    key: "news",
    label: "News",
    prefix: "/news",
    logo: { url: logoNews.url, alt: "IMLAND NEWS" },
    theme: {
      signal: "#7c22e8",
      signalStrong: "#7c22e8",
      signalInk: "#6d1cce",
      signalForeground: "#ffffff",
      signalGlow: "#e6d6ff",
      horizon: "#b78dff",
    },
  },
  {
    key: "eventi",
    label: "Eventi",
    prefix: "/eventi",
    logo: { url: logoEventi.url, alt: "IMLAND EVENTI" },
    theme: {
      signal: "#12a531",
      signalStrong: "#0e8728",
      signalInk: "#0e7d25",
      signalForeground: "#ffffff",
      signalGlow: "#bdf3c8",
      horizon: "#7de094",
    },
  },
];


export const DEFAULT_SECTION: SectionConfig = {
  key: "default",
  label: "IMLAND Experience",
  prefix: null,
  logo: { url: logoDefault.url, alt: "IMLAND EXPERIENCE" },
  theme: {
    signal: "#1a73e8",
    signalStrong: "#1668d4",
    signalInk: "#1668d4",
    signalForeground: "#ffffff",
    signalGlow: "#d2e3fc",
    horizon: "#8ab4f8",
  },
};

/** Risolve la sezione a partire dal pathname corrente. */
export function getSectionConfig(pathname: string): SectionConfig {
  return (
    SECTIONS.find(
      (s) => s.prefix && (pathname === s.prefix || pathname.startsWith(`${s.prefix}/`)),
    ) ?? DEFAULT_SECTION
  );
}

/**
 * Variabili CSS da applicare al contenitore radice della pagina.
 * Espone sia i token storici (`--signal*`) sia la scala completa
 * `--service-*` del design system (base/soft/light/dark/accent/
 * on-color/border/hover/focus).
 */
export function sectionCssVars(section: SectionConfig): CSSProperties {
  const t = section.theme;
  return {
    "--signal": t.signal,
    "--signal-strong": t.signalStrong,
    "--signal-ink": t.signalInk,
    "--signal-foreground": t.signalForeground,
    "--signal-glow": t.signalGlow,
    "--horizon": t.horizon,
    "--ring": t.signal,

    "--service-base": t.signal,
    "--service-dark": t.signalStrong,
    "--service-accent": t.horizon,
    "--service-light": t.signalGlow,
    "--service-on-color": t.signalForeground,
    "--service-soft": `color-mix(in oklab, ${t.signal} 10%, var(--background))`,
    "--service-border": `color-mix(in oklab, ${t.signal} 28%, var(--background))`,
    "--service-hover": `color-mix(in oklab, ${t.signalStrong} 88%, black)`,
    "--service-focus": t.signal,
    "--service-ink": t.signalInk,
  } as CSSProperties;
}
