/**
 * Bento grid IMLAND — griglia modulare a 6 colonne con card dal bordo
 * animato. Nessun gradiente decorativo: il colore di sezione è pieno
 * (token `--color-icon-*`) e viene esposto alla card come `--bento-tone`.
 *
 * Uso:
 *   <BentoGrid>
 *     <BentoCard tone="radio" span={3}>…</BentoCard>
 *     <BentoCard tone="podcast" span={3}>…</BentoCard>
 *   </BentoGrid>
 */

import type { HTMLAttributes, AnchorHTMLAttributes, CSSProperties, ReactNode } from "react";
import { Link } from "@tanstack/react-router";
import { ICON_TONES, type IconTone } from "@/components/brand-icons";

export type BentoTone = IconTone;

/** Colonne occupate su desktop (griglia a 6 colonne). */
export type BentoSpan = 2 | 3 | 4 | 6;

const SPAN_CLASS: Record<BentoSpan, string> = {
  2: "lg:col-span-2",
  3: "lg:col-span-3",
  4: "lg:col-span-4",
  6: "sm:col-span-2 lg:col-span-6",
};

export function BentoGrid({ className = "", children, ...props }: HTMLAttributes<HTMLDivElement>) {
  return (
    <div className={`bento-grid ${className}`} {...props}>
      {children}
    </div>
  );
}

type BaseProps = {
  tone?: BentoTone;
  span?: BentoSpan;
  className?: string;
  style?: CSSProperties;
  children: ReactNode;
};

function toneStyle(tone: BentoTone | undefined, style?: CSSProperties): CSSProperties {
  return {
    ...(tone ? ({ "--bento-tone": ICON_TONES[tone] } as CSSProperties) : null),
    ...style,
  };
}

export function BentoCard({
  tone,
  span = 3,
  className = "",
  style,
  children,
  ...props
}: BaseProps & Omit<HTMLAttributes<HTMLDivElement>, "children" | "style" | "className">) {
  return (
    <div
      className={`bento-card p-5 sm:p-6 ${SPAN_CLASS[span]} ${className}`}
      style={toneStyle(tone, style)}
      {...props}
    >
      {children}
    </div>
  );
}

/** Variante cliccabile: stessa card, navigazione interna. */
export function BentoLinkCard({
  tone,
  span = 3,
  className = "",
  style,
  to,
  params,
  children,
}: BaseProps & {
  to: string;
  params?: Record<string, string>;
}) {
  return (
    <Link
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      to={to as any}
      params={params as never}
      className={`bento-card p-5 sm:p-6 no-underline ${SPAN_CLASS[span]} ${className}`}
      style={toneStyle(tone, style)}
    >
      {children}
    </Link>
  );
}

/** Variante cliccabile per link esterni. */
export function BentoAnchorCard({
  tone,
  span = 3,
  className = "",
  style,
  children,
  ...props
}: BaseProps & Omit<AnchorHTMLAttributes<HTMLAnchorElement>, "children" | "style" | "className">) {
  return (
    <a
      className={`bento-card p-5 sm:p-6 no-underline ${SPAN_CLASS[span]} ${className}`}
      style={toneStyle(tone, style)}
      {...props}
    >
      {children}
    </a>
  );
}
