/**
 * IMLAND official icon set (50 glyphs).
 *
 * Generated from the official kit `IMLAND_Icone_SVG` — 24x24 grid, uniform
 * stroke, transparent background. Each glyph carries its official section
 * colour (Radio #16BFF2, Podcast #1646D8, Member #FFC400, Eventi #19C83A),
 * exposed through the design-system tokens `--color-icon-*`.
 *
 * Usage:
 *   <BrandIcon name="microfono" className="h-6 w-6" />        // official colour
 *   <BrandIcon name="microfono" tone="current" />              // inherits text colour
 *   <BrandIcon name="microfono" tone="member" />               // force a section tone
 */

import type { ReactNode, SVGProps } from "react";

export const ICON_TONES = {
  radio: "var(--color-icon-radio)",
  podcast: "var(--color-icon-podcast)",
  member: "var(--color-icon-member)",
  eventi: "var(--color-icon-eventi)",
  news: "var(--color-icon-news)",
  aziende: "var(--color-icon-aziende)",
  terrain: "var(--color-icon-terrain)",
  jobs: "var(--color-icon-jobs)",
  alert: "var(--color-icon-alert)",
  current: "currentColor",
} as const;

export type IconTone = keyof typeof ICON_TONES;

const TONE_BY_HEX: Record<string, IconTone> = {
  "#16BFF2": "radio",
  "#1646D8": "podcast",
  "#FFC400": "member",
  "#19C83A": "eventi",
};

type IconDef = { color: string; body: ReactNode };

const ICONS: Record<string, IconDef> = {
  microfono: { color: "#16BFF2", body: <><rect x="9" y="3" width="6" height="11" rx="3"/><path d="M6.5 11a5.5 5.5 0 0 0 11 0M12 16.5V21M9 21h6"/></> },
  cuffie: { color: "#1646D8", body: <><path d="M4 13a8 8 0 0 1 16 0v6h-4v-6h4M4 13v6h4v-6H4"/></> },
  onde_radio: { color: "#16BFF2", body: <><circle cx="12" cy="12" r="1.5"/><path d="M8.5 8.5a5 5 0 0 0 0 7M15.5 8.5a5 5 0 0 1 0 7M5.5 5.5a9 9 0 0 0 0 13M18.5 5.5a9 9 0 0 1 0 13"/></> },
  play: { color: "#1646D8", body: <><circle cx="12" cy="12" r="9"/><path d="m10 8 6 4-6 4Z"/></> },
  pausa: { color: "#1646D8", body: <><circle cx="12" cy="12" r="9"/><path d="M9 8v8M15 8v8"/></> },
  volume: { color: "#16BFF2", body: <><path d="M4 10h4l5-4v12l-5-4H4zM16 9a4 4 0 0 1 0 6M18.5 6.5a8 8 0 0 1 0 11"/></> },
  equalizzatore: { color: "#16BFF2", body: <><path d="M5 18v-5M9 18V7M13 18V4M17 18v-8M21 18v-3"/></> },
  waveform: { color: "#1646D8", body: <><path d="M3 12h3l2-5 3 10 3-13 3 11 2-3h2"/></> },
  antenna_podcast: { color: "#16BFF2", body: <><circle cx="12" cy="12" r="2"/><path d="M8 8a6 6 0 0 0 0 8M16 8a6 6 0 0 1 0 8M5 5a10 10 0 0 0 0 14M19 5a10 10 0 0 1 0 14"/></> },
  speaker: { color: "#1646D8", body: <><rect x="5" y="3" width="14" height="18" rx="2"/><circle cx="12" cy="14" r="4"/><circle cx="12" cy="7" r="1"/></> },
  fumetto: { color: "#FFC400", body: <><path d="M4 5h16v11H9l-5 4z"/><path d="M8 10h8"/></> },
  fumetti: { color: "#FFC400", body: <><path d="M3 4h13v9H8l-4 3zM9 14h7l4 3V8h-2"/></> },
  messaggio: { color: "#FFC400", body: <><rect x="3" y="5" width="18" height="13" rx="3"/><path d="M7 9h10M7 13h7"/></> },
  campanella: { color: "#FFC400", body: <><path d="M6 16h12l-2-3V9a4 4 0 0 0-8 0v4zM10 19h4"/></> },
  megafono: { color: "#19C83A", body: <><path d="M4 10h4l10-5v14L8 14H4zM8 14l1 5h3l-1-4"/></> },
  aeroplanino: { color: "#19C83A", body: <><path d="m3 11 18-8-7 18-3-7zM11 14 21 3"/></> },
  email: { color: "#FFC400", body: <><rect x="3" y="5" width="18" height="14" rx="2"/><path d="m4 7 8 6 8-6"/></> },
  telefono: { color: "#FFC400", body: <><path d="M7 3h4l1 5-3 2a16 16 0 0 0 5 5l2-3 5 1v4c0 2-2 4-4 4A14 14 0 0 1 3 7c0-2 2-4 4-4"/></> },
  videocamera: { color: "#1646D8", body: <><rect x="3" y="6" width="13" height="12" rx="2"/><path d="m16 10 5-3v10l-5-3"/></> },
  live: { color: "#16BFF2", body: <><circle cx="12" cy="12" r="2"/><path d="M8 8a6 6 0 0 0 0 8M16 8a6 6 0 0 1 0 8M5 5a10 10 0 0 0 0 14M19 5a10 10 0 0 1 0 14"/></> },
  check: { color: "#FFC400", body: <><circle cx="12" cy="12" r="9"/><path d="m8 12 3 3 6-7"/></> },
  verificato: { color: "#FFC400", body: <><path d="m12 3 2 2 3-.3.7 2.8L20 9l-1 3 1 3-2.3 1.5-.7 2.8-3-.3-2 2-2-2-3 .3-.7-2.8L4 15l1-3-1-3 2.3-1.5L7 4.7l3 .3z"/><path d="m8.5 12 2.3 2.3 4.8-5"/></> },
  tessera_member: { color: "#FFC400", body: <><rect x="3" y="5" width="18" height="14" rx="2"/><circle cx="8" cy="11" r="2"/><path d="M5 16c1-3 5-3 6 0M14 9h4M14 13h4"/></> },
  profilo: { color: "#FFC400", body: <><circle cx="12" cy="12" r="8"/><circle cx="12" cy="9" r="3"/><path d="M6.5 18c1-5 10-5 11 0"/></> },
  community: { color: "#FFC400", body: <><circle cx="12" cy="8" r="3"/><circle cx="5" cy="11" r="2"/><circle cx="19" cy="11" r="2"/><path d="M7 20c0-5 10-5 10 0M2 19c0-3 4-4 6-2M22 19c0-3-4-4-6-2"/></> },
  cuore: { color: "#FFC400", body: <><path d="M20 5c-3-3-7-1-8 2-1-3-5-5-8-2-4 4 1 10 8 15 7-5 12-11 8-15z"/></> },
  stella: { color: "#FFC400", body: <><path d="m12 3 2.8 5.7 6.2.9-4.5 4.4 1.1 6.2-5.6-3-5.6 3 1.1-6.2L3 9.6l6.2-.9z"/></> },
  corona: { color: "#FFC400", body: <><path d="m4 8 4 4 4-7 4 7 4-4-2 11H6zM7 19h10"/></> },
  regalo: { color: "#FFC400", body: <><rect x="4" y="10" width="16" height="11" rx="1"/><path d="M12 10v11M3 7h18v4H3zM12 7c-5 0-5-5-2-5 2 0 2 3 2 5M12 7c5 0 5-5 2-5-2 0-2 3-2 5"/></> },
  stretta_mano: { color: "#FFC400", body: <><path d="m3 13 5-5 4 2 4-2 5 5-5 6-4-3-4 3zM8 8 5 5M16 8l3-3"/></> },
  calendario: { color: "#F0402E", body: <><rect x="3" y="5" width="18" height="16" rx="2"/><path d="M7 3v4M17 3v4M3 10h18M7 14h2M12 14h2M17 14h1M7 18h2M12 18h2"/></> },
  ticket: { color: "#19C83A", body: <><path d="M4 7h16v4a2 2 0 0 0 0 4v4H4v-4a2 2 0 0 0 0-4zM12 8v2M12 14v2M12 18v1"/></> },
  pin: { color: "#19C83A", body: <><path d="M20 10c0 6-8 11-8 11S4 16 4 10a8 8 0 1 1 16 0z"/><circle cx="12" cy="10" r="3"/></> },
  mappa: { color: "#19C83A", body: <><path d="m3 6 6-3 6 3 6-3v15l-6 3-6-3-6 3zM9 3v15M15 6v15"/></> },
  bussola: { color: "#19C83A", body: <><circle cx="12" cy="12" r="8"/><path d="m15.5 8.5-2 5-5 2 2-5z"/></> },
  orologio: { color: "#F0402E", body: <><circle cx="12" cy="12" r="8"/><path d="M12 7v6l4 2"/></> },
  faretto: { color: "#19C83A", body: <><path d="m8 4 8 3-3 8-8-3zM10 14l-2 6M14 15l3 5M3 20h18"/></> },
  nota_musicale: { color: "#1646D8", body: <><path d="M9 18V6l10-2v12M9 9l10-2"/><circle cx="6" cy="18" r="3"/><circle cx="16" cy="16" r="3"/></> },
  fotocamera: { color: "#1646D8", body: <><rect x="3" y="6" width="18" height="14" rx="2"/><path d="m8 6 2-3h4l2 3"/><circle cx="12" cy="13" r="4"/></> },
  coriandoli: { color: "#19C83A", body: <><path d="m4 20 5-10 5 5zM14 4v3M19 6l-2 2M20 12h-3M8 4l1 2M15 12l3 3"/></> },
  nuvola: { color: "#19C83A", body: <><path d="M6 19h12a4 4 0 0 0 0-8 6 6 0 0 0-11-2 5 5 0 0 0-1 10z"/></> },
  sole: { color: "#19C83A", body: <><circle cx="12" cy="12" r="4"/><path d="M12 2v3M12 19v3M2 12h3M19 12h3M5 5l2 2M17 17l2 2M19 5l-2 2M7 17l-2 2"/></> },
  montagna: { color: "#19C83A", body: <><path d="m3 20 7-13 3 5 2-3 6 11zM8 11l2 2 2-2"/></> },
  edificio: { color: "#19C83A", body: <><path d="M4 21V7h10v14M14 11h6v10M7 10h2M7 14h2M7 18h2M11 10h1M11 14h1M17 14h1M17 18h1M2 21h20"/></> },
  chiesa: { color: "#19C83A", body: <><path d="M5 21V9l7-5 7 5v12M12 2v4M10 3h4M9 21v-6h6v6M8 11h2M14 11h2"/></> },
  italia: { color: "#19C83A", body: <><path d="M9 3l5 1-1 4 3 3-2 3 4 2-2 3-4-2-2 4-3-2 2-5-3-3 2-3z"/></> },
  link: { color: "#1646D8", body: <><path d="m9 15-2 2a4 4 0 0 1-6-6l4-4a4 4 0 0 1 6 0M15 9l2-2a4 4 0 0 1 6 6l-4 4a4 4 0 0 1-6 0M8 12h8"/></> },
  qr_code: { color: "#1646D8", body: <><path d="M3 3h7v7H3zM14 3h7v7h-7zM3 14h7v7H3zM15 14h2v2h-2zM19 14h2v4h-2zM14 19h4v2h-4zM8 8H5V5h3zM19 8h-3V5h3zM8 19H5v-3h3z"/></> },
  smartphone: { color: "#1646D8", body: <><rect x="6" y="2" width="12" height="20" rx="2"/><path d="M10 5h4M11 19h2"/></> },
  globo: { color: "#1646D8", body: <><circle cx="12" cy="12" r="8"/><path d="M3 12h18M12 3c5 5 5 13 0 18M12 3c-5 5-5 13 0 18"/></> },
};

export type BrandIconName = keyof typeof ICONS;

export type BrandIconProps = Omit<SVGProps<SVGSVGElement>, "color"> & {
  name: BrandIconName;
  /** Colour tone; defaults to the glyph official section colour. */
  tone?: IconTone;
  /** Legacy flag: render with currentColor. */
  plain?: boolean;
};

export function BrandIcon({ name, tone, plain, style, ...props }: BrandIconProps) {
  const def = ICONS[name];
  const resolved: IconTone = plain ? "current" : (tone ?? TONE_BY_HEX[def.color] ?? "radio");
  return (
    <svg
      viewBox="0 0 24 24"
      xmlns="http://www.w3.org/2000/svg"
      role="img"
      aria-hidden={props["aria-label"] ? undefined : true}
      fill="none"
      stroke="currentColor"
      strokeWidth={1.8}
      strokeLinecap="round"
      strokeLinejoin="round"
      style={{ color: ICON_TONES[resolved], ...style }}
      {...props}
    >
      {def.body}
    </svg>
  );
}

function make(name: BrandIconName) {
  const C = (props: Omit<BrandIconProps, "name">) => <BrandIcon name={name} {...props} />;
  C.displayName = `Icon_${String(name)}`;
  return C;
}

/* Named exports kept stable for existing call sites. */
export const IconMicrofono = make("microfono");
export const IconCuffie = make("cuffie");
export const IconOndaAudio = make("waveform");
export const IconEqualizzatore = make("equalizzatore");
export const IconFumetti = make("fumetti");
export const IconFumetto = make("fumetto");
export const IconPlayVoce = make("play");
export const IconPausa = make("pausa");
export const IconScintillaVoce = make("stella");
export const IconRadio = make("onde_radio");
export const IconAntennaPodcast = make("antenna_podcast");
export const IconLive = make("live");
export const IconCalendario = make("calendario");
export const IconTicket = make("ticket");
export const IconCommunity = make("community");
export const IconProfilo = make("profilo");
export const IconTessera = make("tessera_member");
export const IconTerritorio = make("pin");
export const IconMappa = make("mappa");
export const IconNews = make("messaggio");
export const IconPreferiti = make("cuore");
export const IconNotifiche = make("campanella");
export const IconMegafono = make("megafono");
export const IconEmail = make("email");
export const IconSmartphone = make("smartphone");
export const IconQrCode = make("qr_code");
export const IconGlobo = make("globo");
export const IconMontagna = make("montagna");
export const IconItalia = make("italia");
export const IconVerificato = make("verificato");
export const IconCorona = make("corona");
export const IconRegalo = make("regalo");
export const IconStrettaMano = make("stretta_mano");
export const IconNotaMusicale = make("nota_musicale");
export const IconSpeaker = make("speaker");
export const IconVolume = make("volume");

/** Convenience map for data-driven lists. */
export const brandIcons = {
  microfono: IconMicrofono,
  cuffie: IconCuffie,
  onda: IconOndaAudio,
  fumetti: IconFumetti,
  play: IconPlayVoce,
  scintilla: IconScintillaVoce,
  radio: IconRadio,
  calendario: IconCalendario,
  community: IconCommunity,
  territorio: IconTerritorio,
  news: IconNews,
  preferiti: IconPreferiti,
  notifiche: IconNotifiche,
} as const;

export const iconNames = Object.keys(ICONS) as BrandIconName[];
