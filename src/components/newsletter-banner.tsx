import { BrandIcon } from "./brand-icons";
import { ColorBlocks, MemphisConfetti } from "./decor";

type Variant = "default" | "compact" | "dark";

export function NewsletterBanner({
  variant = "default",
  eyebrow = "Newsletter",
  title = "Resta aggiornato su IMLAND.",
  lead = "Radio, podcast, eventi e novità dalla community: una mail curata, niente spam.",
}: {
  variant?: Variant;
  eyebrow?: string;
  title?: string;
  lead?: string;
}) {
  const isCompact = variant === "compact";

  return (
    <section
      id="newsletter"
      className={
        isCompact
          ? "section-closing container-im bg-white section-pad-sm"
          : "section-closing container-im bg-white section-pad"
      }
    >
      <div className="relative overflow-hidden rounded-[32px] border border-border bg-white px-6 section-pad-sm sm:py-20 lg:px-8">
        <ColorBlocks
          className="!absolute bottom-0 left-0 top-auto h-32 w-full sm:h-44"
          opacity={0.12}
        />
        <MemphisConfetti opacity={0.1} />
        <div className="relative z-10 mx-auto max-w-2xl text-center">
          <p className="flex items-center justify-center gap-2 text-xs font-semibold uppercase tracking-wider text-signal">
            <BrandIcon name="email" className="h-4 w-4" aria-hidden />
            {eyebrow}
          </p>
          <h2
            className={`mt-3 font-display font-semibold tracking-tight text-foreground ${
              isCompact ? "text-3xl sm:text-4xl" : "text-3xl sm:text-4xl md:text-5xl"
            }`}
          >
            {title}
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-lg leading-8 text-muted-foreground">{lead}</p>

          <a
            href="mailto:info@imlandradio.com?subject=Iscrizione%20newsletter%20IMLAND"
            className="mx-auto mt-10 inline-flex min-h-12 items-center justify-center rounded-full bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground shadow-cta transition-all hover:brightness-110 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-signal"
          >
            Iscrivimi
          </a>
          <p className="mt-5 text-sm font-medium text-muted-foreground">
            Richiedi l'iscrizione direttamente alla redazione IMLAND.
          </p>
        </div>
      </div>
    </section>
  );
}
