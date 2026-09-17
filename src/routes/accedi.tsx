import { createFileRoute, Link } from "@tanstack/react-router";
import { BellRing } from "lucide-react";

import { SectionDecor } from "@/components/decor";
import { EmailInterestForm } from "@/components/email-interest-form";

export const Route = createFileRoute("/accedi")({
  ssr: false,
  head: () => ({
    meta: [
      { title: "Area Utenti — IMLAND EXPERIENCE" },
      {
        name: "description",
        content:
          "L'Area Utenti IMLAND è in sviluppo. Lascia la tua email per essere avvisato non appena sarà disponibile.",
      },
      { name: "robots", content: "noindex" },
    ],
    links: [{ rel: "canonical", href: "/accedi" }],
  }),
  component: AccediPage,
});

function AccediPage() {
  return (
    <section className="section-atmosphere decor-host overflow-hidden">
      <SectionDecor variant="default" />
      <div className="mx-auto grid max-w-5xl items-center gap-10 px-4 section-pad md:grid-cols-2 md:px-8">
        <div className="text-center md:text-left">
          <span className="inline-flex items-center gap-2 rounded-full border border-border px-3.5 py-1.5 text-xs font-semibold uppercase tracking-wider text-primary">
            Area Utenti
          </span>
          <h1 className="mt-6 text-display-l">
            Una nuova esperienza <span className="font-semibold text-primary">IMLAND</span> sta
            arrivando.
          </h1>
          <p className="mx-auto mt-6 max-w-xl text-lg leading-8 text-muted-foreground md:mx-0">
            Stiamo preparando uno spazio più semplice e completo per vivere contenuti, vantaggi e
            iniziative del territorio.
          </p>
          <Link
            to="/"
            className="mt-6 inline-flex min-h-11 items-center font-semibold text-primary underline underline-offset-4"
          >
            Torna alla home
          </Link>
        </div>

        <div className="rounded-3xl border border-border bg-card p-6 text-center shadow-sm md:p-8">
          <BellRing className="mx-auto h-9 w-9 text-primary" aria-hidden />
          <h2 className="mt-5 text-2xl font-semibold uppercase leading-tight text-foreground md:text-3xl">
            Stiamo sviluppando al meglio l'Area Utenti per darvi un'ottima esperienza.
          </h2>
          <p className="mx-auto mt-4 max-w-lg text-base leading-7 text-muted-foreground">
            Vuoi essere avvisato non appena sarà disponibile? Inserisci la tua email.
          </p>
          <EmailInterestForm
            subject="Avviso disponibilità Area Utenti IMLAND"
            message="Desidero essere avvisato non appena l'Area Utenti IMLAND sarà disponibile."
            buttonLabel="Avvisami"
            consentLabel="Acconsento a ricevere l'avviso sulla disponibilità dell'Area Utenti IMLAND."
          />
        </div>
      </div>
    </section>
  );
}
