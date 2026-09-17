/**
 * Hero editoriale IMLAND — usato dalle pagine senza grafica hero dedicata
 * (Contatti, FAQ, Chi siamo). Stessa gerarchia delle pagine con HeroBanner:
 * eyebrow con bollino di sezione, titolo display con keyword, sottotitolo,
 * CTA centrate su mobile e allineate a sinistra su desktop.
 * Nessun gradiente decorativo: colori pieni dai token di sezione.
 */

import type { ReactNode } from "react";
import { BadgeIcon, type BadgeName } from "./badge-icon";

type Props = {
  eyebrow: string;
  /** Titolo: usa <span className="im-gradient-text"> per la keyword. */
  title: ReactNode;
  subtitle?: ReactNode;
  /** Bollino circolare di sezione mostrato accanto all'eyebrow. */
  badge?: BadgeName;
  /** CTA della pagina. */
  children?: ReactNode;
  /** Colonna visiva opzionale (solo desktop). */
  aside?: ReactNode;
};

export function PageHero({ eyebrow, title, subtitle, badge, children, aside }: Props) {
  return (
    <section className="hero-frame section-atmosphere">
      <div
        className={`container-im hero-pad grid items-center gap-10 ${
          aside ? "lg:grid-cols-[1.2fr_1fr]" : ""
        }`}
      >
        <div className="text-center">
          <div className="flex items-center justify-center gap-3">
            {badge ? <BadgeIcon name={badge} className="h-11 w-11" eager /> : null}
            <p className="text-xs font-semibold uppercase tracking-wider text-signal">{eyebrow}</p>
          </div>
          <h1 className="mx-auto mt-4 max-w-3xl text-display-l">{title}</h1>
          {subtitle ? (
            <p className="mx-auto mt-5 max-w-2xl whitespace-pre-line text-lg text-muted-foreground">{subtitle}</p>
          ) : null}
          {children ? (
            <div className="mt-8 flex flex-wrap justify-center gap-3">{children}</div>
          ) : null}
        </div>
        {aside ? <div className="hidden justify-self-center lg:block">{aside}</div> : null}
      </div>
    </section>
  );
}
