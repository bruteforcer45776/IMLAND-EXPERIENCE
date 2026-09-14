/**
 * IMLAND brand decor.
 *
 * Same visual language as the official gradient icon kit
 * (`src/components/brand-icons.tsx`): the IMLAND spectrum
 * blue -> cyan -> teal -> green -> yellow, rounded caps, generous radii.
 *
 * Purely presentational: no pointer events, hidden from assistive tech.
 */



/* ------------------------------------------------------------------ *
 * Divisori di sezione — libreria brand
 *
 * Forme estratte dal kit ufficiale (onde, fumetti, waveform, zigzag,
 * gradini, cupole, cerchi, intreccio, pillole, segnale radio) nei quattro
 * colori istituzionali, con un accento rosso appena percettibile usato
 * esclusivamente nei divisori (e nelle icone data).
 * ------------------------------------------------------------------ */

/** Colori sezione ufficiali. */
const C = {
  cyan: "#16BFF2",
  blue: "#1646D8",
  yellow: "#FFC400",
  green: "#19C83A",
  /** accento: solo divisori + icone data */
  red: "#F0402E",
} as const;

/** Spettro con la scintilla rossa, per i tratti dei divisori. */
const SPECTRUM_RED = [C.cyan, C.blue, C.red, C.yellow, C.green] as const;

/* Divisori di sezione rimossi: sfondi puliti, nessuna onda azzurra/gialla. */
export type DividerVariant = string;

/** No-op: i divisori a onda sono stati rimossi per mantenere i background puliti. */
export function WaveDivider(_props: {
  flip?: boolean;
  variant?: DividerVariant;
  className?: string;
}) {
  return null;
}

/** No-op: divisore verticale rimosso. */
export function VerticalDivider(_props: {
  variant?: DividerVariant;
  flip?: boolean;
  className?: string;
}) {
  return null;
}


/** Thin spectrum rule: removed — clean separators only. */
export function SpectrumRule(_props: { className?: string }) {
  return null;
}


/**
 * Sfondi puliti: i riempitivi di sezione (icone sfumate, bolle, glow) sono
 * stati rimossi. Il componente resta come no-op per compatibilità.
 */
export function SectionDecor(_props: {
  variant?: "default" | "warm" | "cool" | "bubbles" | "audio";
}) {
  return null;
}

/** Small colored dot row: removed — clean separators only. */
export function DotSeparator(_props: { className?: string }) {
  return null;
}

/** Sfondi puliti: nessuna colonna laterale di icone. No-op. */
export function PageRails(_props: { variant?: string; fixed?: boolean }) {
  return null;
}

/** Sfondi puliti: nessun riempitivo di sezione. No-op. */
export function SectionRails(_props: { variant?: string }) {
  return null;
}

/* ------------------------------------------------------------------ *
 * Neo-Bauhaus contemporaneo — pattern grafico modulare IMLAND
 *
 * Forme geometriche piatte (cerchi, semicerchi, archi, triangoli,
 * rettangoli, quarti di cerchio) nei colori istituzionali pieni:
 * blu, azzurro, verde, giallo, viola e bianco. Bordi nitidi,
 * nessuna texture, nessun 3D. Composizione dinamica a griglia.
 * ------------------------------------------------------------------ */

const BAUHAUS = {
  blue: "#1646D8",
  cyan: "#16BFF2",
  green: "#19C83A",
  yellow: "#FFC400",
  purple: "#7C3AED",
  white: "#FFFFFF",
} as const;

type BauhausShape =
  | "circle"
  | "semicircle-up"
  | "semicircle-down"
  | "quarter-tl"
  | "quarter-br"
  | "arch"
  | "triangle-up"
  | "triangle-down"
  | "rect"
  | "empty";

type BauhausTile = { shape: BauhausShape; color: keyof typeof BAUHAUS };

/** Sequenza modulare deterministica: si ripete a griglia su tutta la larghezza. */
const BAUHAUS_ROW: BauhausTile[] = [
  { shape: "quarter-tl", color: "cyan" },
  { shape: "semicircle-up", color: "yellow" },
  { shape: "triangle-down", color: "blue" },
  { shape: "circle", color: "green" },
  { shape: "arch", color: "purple" },
  { shape: "rect", color: "yellow" },
  { shape: "semicircle-down", color: "blue" },
  { shape: "quarter-br", color: "green" },
  { shape: "triangle-up", color: "cyan" },
  { shape: "empty", color: "white" },
  { shape: "circle", color: "purple" },
  { shape: "semicircle-up", color: "green" },
  { shape: "quarter-tl", color: "yellow" },
  { shape: "arch", color: "cyan" },
  { shape: "triangle-down", color: "purple" },
  { shape: "rect", color: "blue" },
];

function BauhausTileView({ shape, color }: BauhausTile) {
  const bg = BAUHAUS[color];
  const base = "h-full w-full";
  switch (shape) {
    case "circle":
      return <div className="grid h-full w-full place-items-center"><span className={`block aspect-square w-3/4 rounded-full ${base}`} style={{ background: bg }} /></div>;
    case "semicircle-up":
      return <div className="flex h-full w-full items-end justify-center"><span className="block aspect-[2/1] w-3/4 rounded-t-full" style={{ background: bg }} /></div>;
    case "semicircle-down":
      return <div className="flex h-full w-full items-start justify-center"><span className="block aspect-[2/1] w-3/4 rounded-b-full" style={{ background: bg }} /></div>;
    case "quarter-tl":
      return <span className={`block rounded-tl-full ${base}`} style={{ background: bg }} />;
    case "quarter-br":
      return <span className={`block rounded-br-full ${base}`} style={{ background: bg }} />;
    case "arch":
      return <div className="flex h-full w-full items-end justify-center"><span className="block h-full w-1/2 rounded-t-full" style={{ background: bg }} /></div>;
    case "triangle-up":
      return <span className={`block ${base}`} style={{ background: bg, clipPath: "polygon(50% 12%, 94% 100%, 6% 100%)" }} />;
    case "triangle-down":
      return <span className={`block ${base}`} style={{ background: bg, clipPath: "polygon(6% 0, 94% 0, 50% 88%)" }} />;
    case "rect":
      return <span className={`block ${base}`} style={{ background: bg }} />;
    default:
      return null;
  }
}

/** Striscia modulare Neo-Bauhaus: rimossa per mantenere i background puliti. */
export function BauhausStrip(_props: {
  className?: string;
  tone?: keyof typeof BAUHAUS;
  flip?: boolean;
}) {
  return null;
}

/* ------------------------------------------------------------------ *
 * Backdrop grafici — Neo-Bauhaus / Mid-Century / Memphis / Color block
 *
 * Tutti i componenti seguenti sono puramente decorativi: SVG vettoriale
 * piatto, bordi nitidi, nessuna texture e nessun 3D. Vanno inseriti come
 * primo figlio di un contenitore `relative overflow-hidden`.
 * ------------------------------------------------------------------ */

type BauhausColor = keyof typeof BAUHAUS;

/** Intreccio di nastri arrotondati: rimosso per mantenere i background puliti. */
export function BauhausRibbons(_props: {
  className?: string;
  opacity?: number;
  scale?: number;
  colors?: BauhausColor[];
}) {
  return null;
}

/** Griglia modulare Mid-Century: rimossa per mantenere i background puliti. */
export function BauhausGridPattern(_props: {
  className?: string;
  opacity?: number;
  scale?: number;
  colors?: BauhausColor[];
}) {
  return null;
}

/** Memphis Design: rimosso per mantenere i background puliti. */
export function MemphisConfetti(_props: {
  className?: string;
  opacity?: number;
  colors?: BauhausColor[];
}) {
  return null;
}

/** Color block: rimosso per mantenere i background puliti. */
export function ColorBlocks(_props: {
  className?: string;
  opacity?: number;
  colors?: BauhausColor[];
  position?: "bottom" | "top" | "right";
}) {
  return null;
}

/** Accento d'angolo Neo-Bauhaus: rimosso per mantenere i background puliti. */
export function BauhausCorner(_props: {
  className?: string;
  colors?: (keyof typeof BAUHAUS)[];
}) {
  return null;
}

/** Fascia pattern di pagina: rimossa per mantenere i background puliti. */
export function BauhausPatternBand(_props: {
  tone?: BauhausColor;
  className?: string;
  variant?: "ribbons" | "grid";
}) {
  return null;
}
