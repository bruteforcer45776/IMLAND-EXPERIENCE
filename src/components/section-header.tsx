/**
 * Intestazione di sezione IMLAND — stessa gerarchia su tutte le pagine:
 * eyebrow (con bollino opzionale), titolo h2 con keyword, descrizione.
 */

import type { ReactNode } from "react";
import { BadgeIcon, type BadgeName } from "./badge-icon";

type Props = {
  eyebrow: string;
  title: ReactNode;
  description?: ReactNode;
  badge?: BadgeName;
  align?: "left" | "center";
  className?: string;
};

export function SectionHeader({
  eyebrow,
  title,
  description,
  badge,
  align = "left",
  className = "",
}: Props) {
  const centered = align === "center";
  return (
    <div className={`${centered ? "mx-auto max-w-2xl text-center" : "max-w-2xl"} ${className}`}>
      <div className={`flex items-center gap-3 ${centered ? "justify-center" : ""}`}>
        {badge ? <BadgeIcon name={badge} className="h-10 w-10" /> : null}
        <p className="text-xs font-semibold uppercase tracking-wider text-signal">{eyebrow}</p>
      </div>
      <h2 className="mt-3 text-h2-im">{title}</h2>
      {description ? <p className="mt-4 text-muted-foreground">{description}</p> : null}
    </div>
  );
}
