import { Children, type ReactNode } from "react";
import { cn } from "@/lib/utils";

type HeroBannerProps = {
  /** URL della grafica hero (1600x900) */
  src: string;
  alt: string;
  /** CTA della pagina: mostrate centrate sotto il blocco di testo della grafica */
  children?: ReactNode;
  /** Claim breve mostrato immediatamente sopra le CTA. */
  claim?: string;
  /** Variante visiva del claim. */
  claimClassName?: string;
  priority?: boolean;
  /** posizione verticale delle CTA sopra la grafica (desktop) */
  ctaTop?: string;
  className?: string;
  /** Rimuove il padding-bottom e unisce la hero alla sezione sottostante */
  flush?: boolean;
  /** Testo dell'H1 accessibile (default: alt della grafica) */
  heading?: string;
  /** Colore pieno del verticale: sfondo della hero full screen su mobile */
  mobileBg?: string;
  /** Grafica verticale 9:16 dedicata al mobile */
  srcMobile?: string;
  /** posizione verticale delle CTA sopra la grafica verticale (mobile) */
  mobileCtaTop?: string;
};

/**
 * Hero grafica a tutta larghezza: la headline fa parte dell'immagine
 * (metà sinistra su desktop, in alto sul mobile) e le CTA restano sempre
 * centrate sotto il testo.
 * Mobile: grafica verticale 9:16 dedicata, full screen e full-bleed.
 * Desktop: 16:9 full-bleed con CTA sovrapposte sotto il testo.
 */
export function HeroBanner({
  src,
  alt,
  children,
  claim,
  claimClassName,
  priority = true,
  ctaTop = "63%",
  className,
  flush,
  heading,
  mobileBg = "#101114",
  srcMobile,
  mobileCtaTop,
}: HeroBannerProps) {
  // Mobile: massimo 2 CTA nella fascia bianca
  const mobileCtas = Children.toArray(children).filter(Boolean).slice(0, 2);

  return (
    <section
      className={cn("hero-frame hero-banner relative isolate bg-white", flush && "!mb-0", className)}
    >
      {/* La headline è parte della grafica: la esponiamo come H1 accessibile */}
      <h1 className="sr-only">{heading ?? alt}</h1>

      {/* Mobile: grafica verticale full screen, fascia bianca in basso con le CTA */}
      <div
        className="relative md:hidden"
        style={{ height: "min(760px, calc(100svh - 92px))", backgroundColor: mobileBg }}
      >
        <img
          src={srcMobile ?? src}
          alt={alt}
          loading={priority ? "eager" : "lazy"}
          fetchPriority={priority ? "high" : "auto"}
          decoding="async"
          className={cn("absolute inset-0 h-full w-full", "object-cover object-top")}
        />
        {!mobileCtaTop && (
          <div
            className="pointer-events-none absolute inset-x-0 bottom-0 h-[25%]"
            style={{
              background:
                "linear-gradient(to top, #ffffff 0%, #ffffff 45%, rgba(255,255,255,0.85) 65%, rgba(255,255,255,0) 100%)",
            }}
          />
        )}
        {(
          <div
            className={cn(
              "hero-banner__content hero-banner__content--mobile absolute inset-x-0 flex px-6",
              mobileCtaTop ? "items-start" : "items-start",
            )}
            style={mobileCtaTop ? { top: mobileCtaTop } : undefined}
          >
            <div className="mx-auto flex w-full max-w-[320px] flex-col items-stretch gap-3">
              {claim ? <p className={cn("hero-cta-claim", claimClassName)}>{claim}</p> : null}
              <div className="flex flex-col items-stretch gap-3 [&>*]:w-full [&>*]:justify-center">
                {mobileCtas}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Desktop: grafica 16:9 full-bleed, CTA sovrapposte sotto il testo */}
      <div className="relative mx-auto hidden w-full md:block">
        <img
          src={src}
          alt=""
          aria-hidden
          width={1600}
          height={900}
          loading={priority ? "eager" : "lazy"}
          fetchPriority={priority ? "high" : "auto"}
          decoding="async"
          className="block w-full object-cover object-top"
          style={{ height: "min(56.25vw, calc(100vh - 74px))" }}
        />
        {<div className="pointer-events-none absolute inset-0">
          <div className="hero-banner__content hero-banner__content--desktop absolute inset-x-0 px-[4%]" style={{ top: ctaTop }}>
            <div className="pointer-events-auto flex flex-col items-center gap-3">
              {claim ? <p className={cn("hero-cta-claim", claimClassName)}>{claim}</p> : null}
              <div className="flex flex-wrap items-center justify-center gap-3">
                {children}
              </div>
            </div>
          </div>
        </div>}
      </div>
    </section>
  );
}
