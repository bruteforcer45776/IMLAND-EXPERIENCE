import { BrandIcon } from "./brand-icons";
import { ColorBlocks, MemphisConfetti } from "./decor";
import { useState } from "react";

type Variant = "default" | "compact" | "dark";

const subscribers = [
  {
    src: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=256&auto=format&fit=crop",
    alt: "Membro della community IMLAND",
  },
  {
    src: "https://images.unsplash.com/photo-1587397845856-e6cf49176c70?q=80&w=256&auto=format&fit=crop",
    alt: "Membro della community IMLAND",
  },
  {
    src: "https://images.unsplash.com/photo-1488426862026-3ee34a7d66df?q=80&w=256&h=256&auto=format&fit=facearea&facepad=2",
    alt: "Membro della community IMLAND",
  },
  {
    src: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?q=80&w=256&h=256&auto=format&fit=facearea&facepad=2",
    alt: "Membro della community IMLAND",
  },
];

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
  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);

  function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!email) return;
    setSent(true);
    setEmail("");
    setTimeout(() => setSent(false), 5000);
  }

  const isCompact = variant === "compact";

  return (
    <section
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

          <form onSubmit={submit} className="mx-auto mt-10 max-w-md">
            <div className="flex flex-col gap-4 sm:flex-row">
              <div className="flex-auto">
                <label htmlFor={`nl-${variant}`} className="sr-only">
                  Email
                </label>
                <input
                  id={`nl-${variant}`}
                  type="email"
                  name="email"
                  required
                  maxLength={255}
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="nome@dominio.it"
                  className="w-full rounded-md border-0 bg-background px-3.5 py-3 text-base text-foreground shadow-sm ring-1 ring-inset ring-border placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-inset focus:ring-signal sm:text-sm sm:leading-6"
                />
              </div>
              <button
                type="submit"
                className="flex-none rounded-md bg-primary px-5 py-3 text-sm font-semibold text-primary-foreground shadow-cta transition-all hover:brightness-110 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-signal"
              >
                Iscrivimi
              </button>
            </div>
          </form>

          {sent && (
            <p className="mx-auto mt-6 w-fit rounded-2xl bg-primary/10 px-4 py-3 text-center text-sm font-medium text-primary">
              Grazie! Ti abbiamo aggiunto alla newsletter.
            </p>
          )}

          <div className="mt-8 flex flex-col items-center justify-center gap-x-4 gap-y-3 sm:flex-row">
            <div
              className="flex flex-none items-center -space-x-2 rounded-full bg-surface-1 p-1.5 border border-border"
              role="group"
              aria-label="Foto membri della community"
            >
              {subscribers.map((s, i) => (
                <div key={i} className="relative -m-0.5 rounded-full bg-card p-0.5">
                  <span
                    aria-hidden="true"
                    className="absolute inset-0.5 h-8 w-8 rounded-full ring-1 ring-inset ring-black/10"
                  />
                  <img
                    alt={s.alt}
                    src={s.src}
                    className="relative h-8 w-8 rounded-full object-cover"
                    loading="lazy"
                  />
                </div>
              ))}
            </div>
            <p
              className="text-sm font-medium text-muted-foreground"
              aria-label="Più di 3.000 iscritti"
            >
              3.000+ già iscritti
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
