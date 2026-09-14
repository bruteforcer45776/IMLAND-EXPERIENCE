/**
 * IMLAND badge icons — bollini circolari a colore pieno, ritagliati dal kit
 * ufficiale. Palette per sezione: viola = News, giallo = Community/Membri,
 * verde = Eventi/Territorio, azzurro = Radio, blu = Podcast.
 */

import { useRouterState } from "@tanstack/react-router";

import type { IconTone } from "@/components/brand-icons";

export const BADGE_NAMES = [
  // News (viola)
  "news",
  "articolo",
  "flash",
  "annuncio",
  "commento",
  // Community / Membri (giallo)
  "community",
  "profilo",
  "membri",
  "partner",
  "account",
  // Eventi / Territorio (verde)
  "calendario",
  "biglietto",
  "luogo",
  "cultura",
  "festa",
  // Radio (azzurro)
  "radio",
  "antenna",
  "cuffie",
  "onde",
  "microfono",
  // Podcast (blu)
  "podcast-mic",
  "play",
  "podcast",
  "podcast-cuffie",
  "waveform",
  // Aziende / Partner (ambra)
  "aziende",
  "materiali",
  "referente",
  // Prodotti verticali: Alert (rosso), Jobs (grigio), Terrain (marrone)
  // Kit ufficiale ritagliato dal master fornito dal team
  "alert",
  "sirena",
  "alert-pin",
  "scudo",
  "alert-phone",
  "jobs",
  "cv",
  "cerca-profilo",
  "stretta-mano",
  "crescita",
  "terrain",
  "negozio",
  "mappa",
  "bussola",
  "edificio",
] as const;

export type BadgeName = (typeof BADGE_NAMES)[number];

/** Tonalità disponibili come set completo di bollini ricolorati. */
const SECTION_TONES = [
  "alert",
  "jobs",
  "terrain",
  "member",
  "eventi",
  "news",
  "radio",
  "podcast",
  "aziende",
] as const;

type SectionTone = (typeof SECTION_TONES)[number];

/** Ogni pagina usa un solo colore: il bollino segue la verticale corrente. */
const TONE_BY_PATH: Array<[RegExp, SectionTone]> = [
  [/^\/alert/, "alert"],
  [/^\/jobs/, "jobs"],
  [/^\/terrain/, "terrain"],
  [/^\/member/, "member"],
  [/^\/eventi/, "eventi"],
  [/^\/news/, "news"],
  [/^\/radio/, "radio"],
  [/^\/podcast/, "podcast"],
  [/^\/(per-le-aziende|area-aziende)/, "aziende"],
];

function toneForPath(pathname: string): SectionTone | null {
  for (const [re, tone] of TONE_BY_PATH) {
    if (re.test(pathname)) return tone;
  }
  return null;
}

type Props = {
  name: BadgeName;
  /** Etichetta accessibile; se assente il bollino è decorativo. */
  alt?: string;
  className?: string;
  eager?: boolean;
  /** Forza una tonalità; di default segue la sezione della pagina. */
  tone?: SectionTone | "auto" | "none";
};

export function BadgeIcon({
  name,
  alt,
  className = "h-12 w-12",
  eager = false,
  tone = "auto",
}: Props) {
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const resolved = tone === "none" ? null : tone === "auto" ? toneForPath(pathname) : tone;
  return (
    <img
      src={resolved ? `/assets/badges/${resolved}/${name}.webp` : `/assets/badges/${name}.webp`}

      alt={alt ?? ""}
      aria-hidden={alt ? undefined : true}
      width={256}
      height={256}
      loading={eager ? "eager" : "lazy"}
      decoding="async"
      className={`shrink-0 select-none object-contain ${className}`}
    />
  );
}

/** Mappa i nomi del set icone brand sui bollini circolari equivalenti. */
const BADGE_BY_ICON: Record<string, BadgeName> = {
  microfono: "microfono",
  cuffie: "cuffie",
  onde_radio: "antenna",
  waveform: "onde",
  antenna_podcast: "podcast",
  nota_musicale: "waveform",
  play: "play",
  smartphone: "radio",
  globo: "onde",
  community: "community",
  profilo: "profilo",
  tessera_member: "account",
  stretta_mano: "community",
  cuore: "membri",
  ticket: "biglietto",
  calendario: "calendario",
  mappa: "luogo",
  pin: "luogo",
  bussola: "bussola",
  montagna: "terrain",
  negozio: "negozio",
  chiesa: "cultura",
  edificio: "edificio",
  faretto: "festa",
  coriandoli: "festa",
  megafono: "annuncio",
  fumetti: "commento",
  fumetto: "commento",
  messaggio: "commento",
  campanella: "flash",
  news: "news",
  giornale: "news",
  documento: "articolo",
};

export function badgeForIcon(name: string, fallback: BadgeName = "flash"): BadgeName {
  return BADGE_BY_ICON[name] ?? fallback;
}

/**
 * Il tono della card (banda laterale, bordo, CTA) segue sempre il colore del
 * bollino: rosso Alert, grigio Jobs, marrone Terrain, giallo Membri, verde
 * Eventi, viola News, azzurro Radio, blu Podcast, ambra Aziende.
 */
const TONE_BY_BADGE: Record<BadgeName, IconTone> = {
  alert: "alert",
  sirena: "alert",
  "alert-pin": "alert",
  scudo: "alert",
  "alert-phone": "alert",
  jobs: "jobs",
  cv: "jobs",
  "cerca-profilo": "jobs",
  "stretta-mano": "jobs",
  crescita: "jobs",
  terrain: "terrain",
  negozio: "terrain",
  mappa: "terrain",
  bussola: "terrain",
  edificio: "terrain",
  news: "news",
  articolo: "news",
  flash: "news",
  annuncio: "news",
  commento: "news",
  community: "member",
  profilo: "member",
  membri: "member",
  partner: "member",
  account: "member",
  calendario: "eventi",
  biglietto: "eventi",
  luogo: "eventi",
  cultura: "eventi",
  festa: "eventi",
  radio: "radio",
  antenna: "radio",
  cuffie: "radio",
  onde: "radio",
  microfono: "radio",
  "podcast-mic": "podcast",
  play: "podcast",
  podcast: "podcast",
  "podcast-cuffie": "podcast",
  waveform: "podcast",
  aziende: "aziende",
  materiali: "aziende",
  referente: "aziende",
};

export function toneForBadge(name: BadgeName): IconTone {
  return TONE_BY_BADGE[name] ?? "radio";
}
