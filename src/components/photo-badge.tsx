import type { LucideIcon } from "lucide-react";

export type BadgeTone = "radio" | "podcast" | "member" | "eventi" | "news";

/**
 * Bollino grafico (come quello giallo sulla foto della community in home).
 * Colore pieno della sezione, nessun gradiente: si usa in alto a sinistra
 * dei blocchi immagine per dare coerenza a tutte le pagine.
 */
const TONES: Record<BadgeTone, { bg: string; fg: string }> = {
  radio: { bg: "var(--color-icon-radio)", fg: "#ffffff" },
  podcast: { bg: "var(--color-icon-podcast)", fg: "#ffffff" },
  member: { bg: "var(--im-yellow)", fg: "#111111" },
  eventi: { bg: "var(--color-icon-eventi)", fg: "#ffffff" },
  news: { bg: "var(--color-icon-news)", fg: "#ffffff" },
};

type PhotoBadgeProps = {
  icon: LucideIcon;
  tone?: BadgeTone;
  /** etichetta accessibile: se assente il bollino è decorativo */
  label?: string;
  /** posizione: fuori dall'angolo (default) oppure interna */
  inset?: boolean;
  className?: string;
};

export function PhotoBadge({
  icon: Icon,
  tone = "member",
  label,
  inset = false,
  className = "",
}: PhotoBadgeProps) {
  const t = TONES[tone];
  return (
    <div
      {...(label ? { role: "img", "aria-label": label } : { "aria-hidden": true })}
      className={`absolute z-10 flex h-14 w-14 items-center justify-center rounded-2xl shadow-[var(--elevation-2)] ${
        inset ? "left-4 top-4" : "-left-4 -top-4"
      } ${className}`}
      style={{ background: t.bg, color: t.fg }}
    >
      <Icon className="h-6 w-6" />
    </div>
  );
}
