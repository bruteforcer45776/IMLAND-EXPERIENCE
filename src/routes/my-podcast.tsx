import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight, Mic2, Radio, Settings2 } from "lucide-react";
import { canonical } from "../lib/seo";
import { PageRails } from "../components/decor";

export const Route = createFileRoute("/my-podcast")({
  head: () => ({
    meta: [
      { title: "My Podcast — Un progetto completamente tuo | IMLAND" },
      { name: "description", content: "Podcast su misura per aziende e organizzazioni: dall’idea alla registrazione, produzione e pubblicazione con IMLAND." },
    ],
    links: [canonical("/my-podcast")],
  }),
  component: MyPodcastPage,
});

function MyPodcastPage() {
  return (
    <>
      <PageRails variant="podcast" />
      <main className="my-podcast-page container-im section-pad">
        <section className="mx-auto max-w-4xl text-center">
          <p className="text-sm font-bold uppercase tracking-[0.16em] text-signal">My Podcast</p>
          <h1 className="mt-4 text-display-m text-ink-950">Un progetto completamente tuo</h1>
          <p className="mx-auto mt-5 max-w-2xl text-lg text-ink-700">
            Se un’azienda o un’organizzazione vuole raccontarsi attraverso un progetto completamente proprio, IMLAND mette a disposizione microfoni, studio, competenze e produzione.
          </p>
        </section>

        <section className="mx-auto mt-10 grid max-w-5xl gap-4 md:grid-cols-3">
          {[
            { icon: Mic2, title: "Idea e registrazione", text: "Costruiamo il format e registriamo il progetto con il supporto dello studio." },
            { icon: Settings2, title: "Produzione", text: "Seguiamo il podcast dall’idea alla lavorazione, con un percorso su misura." },
            { icon: Radio, title: "Pubblicazione", text: "Prepariamo il progetto per la pubblicazione e la distribuzione concordata." },
          ].map(({ icon: Icon, title, text }) => (
            <article key={title} className="flex h-full flex-col items-center rounded-2xl border border-border bg-white p-6 text-center">
              <Icon className="h-7 w-7 text-signal" aria-hidden />
              <h2 className="mt-4 text-xl font-bold text-ink-950">{title}</h2>
              <p className="mt-2 text-base text-ink-700">{text}</p>
            </article>
          ))}
        </section>

        <section className="mx-auto mt-10 max-w-3xl rounded-2xl bg-white p-7 text-center md:p-10">
          <p className="text-sm font-semibold text-ink-700">Progetti My Podcast</p>
          <h2 className="mt-2 text-h2-im text-ink-950">TEDx Biella · Biella Città Creativa</h2>
          <Link to="/contatti" className="btn-blue mt-7 inline-flex min-h-11 items-center gap-2 rounded-full px-6 py-3 text-sm">
            Proponi il tuo podcast <ArrowRight className="h-4 w-4" />
          </Link>
        </section>
      </main>
    </>
  );
}
