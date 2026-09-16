import { useEffect, useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight, Mic2, Radio, Settings2 } from "lucide-react";

import { canonical } from "../lib/seo";
import { PageRails } from "../components/decor";
import { PodcastFeedPlayer } from "../components/podcast-feed-player";
import { PodcastMiniPlayer } from "../components/podcast-audio";
import { myPodcastProgramList } from "../data/podcast-programs";
import {
  getPodcastCatalog,
  type PodcastCatalogItem,
} from "../lib/podcast-feed.functions";

export const Route = createFileRoute("/my-podcast")({
  head: () => ({
    meta: [
      { title: "My Podcast — Un progetto completamente tuo | IMLAND" },
      {
        name: "description",
        content:
          "Podcast su misura per aziende e organizzazioni: dall’idea alla registrazione, produzione e pubblicazione con IMLAND.",
      },
    ],
    links: [canonical("/my-podcast")],
  }),
  component: MyPodcastPage,
});

function MyPodcastPage() {
  const [catalog, setCatalog] = useState<PodcastCatalogItem[]>([]);

  useEffect(() => {
    let active = true;
    getPodcastCatalog({ data: { group: "my-podcast" } })
      .then((items) => active && setCatalog(items))
      .catch(() => active && setCatalog([]));
    return () => {
      active = false;
    };
  }, []);

  const catalogBySlug = new Map(catalog.map((item) => [item.slug, item]));
  const orderBySlug = new Map(catalog.map((item, index) => [item.slug, index]));
  const projects = myPodcastProgramList
    .map((program) => ({
      ...program,
      cover: catalogBySlug.get(program.slug)?.cover || program.cover,
      publishedEpisodes:
        catalogBySlug.get(program.slug)?.publishedEpisodes ?? program.publishedEpisodes,
    }))
    .sort(
      (a, b) =>
        (orderBySlug.get(a.slug) ?? Number.MAX_SAFE_INTEGER) -
        (orderBySlug.get(b.slug) ?? Number.MAX_SAFE_INTEGER),
    );

  return (
    <>
      <PageRails variant="podcast" />
      <main className="my-podcast-page container-im section-pad">
        <section className="mx-auto max-w-4xl text-center">
          <p className="text-sm font-bold uppercase tracking-[0.16em] text-signal">My Podcast</p>
          <h1 className="mt-4 text-display-m text-ink-950">Un progetto completamente tuo</h1>
          <p className="mx-auto mt-5 max-w-2xl text-lg text-ink-700">
            Se un’azienda o un’organizzazione vuole raccontarsi attraverso un progetto
            completamente proprio, IMLAND mette a disposizione microfoni, studio, competenze e
            produzione.
          </p>
        </section>

        <section className="mx-auto mt-10 grid max-w-5xl gap-4 md:grid-cols-3">
          {[
            {
              icon: Mic2,
              title: "Idea e registrazione",
              text: "Costruiamo il format e registriamo il progetto con il supporto dello studio.",
            },
            {
              icon: Settings2,
              title: "Produzione",
              text: "Seguiamo il podcast dall’idea alla lavorazione, con un percorso su misura.",
            },
            {
              icon: Radio,
              title: "Pubblicazione",
              text: "Prepariamo il progetto per la pubblicazione e la distribuzione concordata.",
            },
          ].map(({ icon: Icon, title, text }) => (
            <article
              key={title}
              className="flex h-full flex-col items-center rounded-2xl border border-border bg-white p-6 text-center"
            >
              <Icon className="h-7 w-7 text-signal" aria-hidden />
              <h2 className="mt-4 text-xl font-bold text-ink-950">{title}</h2>
              <p className="mt-2 text-base text-ink-700">{text}</p>
            </article>
          ))}
        </section>

        <section className="mx-auto mt-12 max-w-5xl">
          <div className="flex flex-wrap items-end justify-between gap-4">
            <div>
              <h2 className="text-h2-im text-ink-950">Progetti My Podcast</h2>
              <p className="mt-2 text-sm text-ink-700">
                Puntate, copertine e date sono aggiornate automaticamente dai feed ufficiali.
              </p>
            </div>
            <span className="text-sm font-semibold text-ink-700">
              {projects.reduce((sum, item) => sum + item.publishedEpisodes, 0)} puntate
            </span>
          </div>

          <div className="mt-7 grid gap-5 md:grid-cols-2">
            {projects.map((program) => (
              <article
                key={program.slug}
                className="overflow-hidden rounded-3xl border border-border bg-white shadow-sm"
              >
                {program.cover ? (
                  <img
                    src={program.cover}
                    alt={`Copertina di ${program.name}`}
                    className="aspect-square w-full object-cover"
                  />
                ) : (
                  <div className="flex aspect-square items-center justify-center bg-signal text-3xl font-bold text-white">
                    {program.name.slice(0, 2).toUpperCase()}
                  </div>
                )}
                <div className="p-6">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <h3 className="text-2xl font-bold text-ink-950">{program.name}</h3>
                      <p className="mt-2 text-sm text-ink-700">{program.tagline}</p>
                    </div>
                    <span className="shrink-0 rounded-full bg-signal/10 px-3 py-1 text-xs font-bold text-signal">
                      {program.publishedEpisodes} puntate
                    </span>
                  </div>
                  <div className="mt-5">
                    <PodcastFeedPlayer
                      slug={program.slug}
                      name={program.name}
                      cover={program.cover}
                    />
                  </div>
                  <Link
                    to="/podcast/$slug"
                    params={{ slug: program.slug }}
                    className="mt-5 inline-flex min-h-11 items-center gap-2 rounded-full border border-border px-5 py-2.5 text-sm font-semibold text-ink-950"
                  >
                    Tutte le puntate <ArrowRight className="h-4 w-4" />
                  </Link>
                </div>
              </article>
            ))}
          </div>
        </section>

        <section className="mx-auto mt-10 max-w-3xl rounded-2xl bg-white p-7 text-center md:p-10">
          <h2 className="text-h2-im text-ink-950">Vuoi creare il tuo podcast?</h2>
          <Link
            to="/contatti"
            className="btn-blue mt-7 inline-flex min-h-11 items-center gap-2 rounded-full px-6 py-3 text-sm"
          >
            Proponi il tuo podcast <ArrowRight className="h-4 w-4" />
          </Link>
        </section>
      </main>
      <PodcastMiniPlayer />
    </>
  );
}
