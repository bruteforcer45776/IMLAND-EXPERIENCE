import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { SpotlightCard } from "../components/spotlight-card";
import { EpisodePlayButton, PodcastMiniPlayer } from "../components/podcast-audio";
import { PodcastFeedPlayer } from "../components/podcast-feed-player";
import { programs as allPrograms } from "../data/podcast-derived";
import {
  getPodcastCatalog,
  getPodcastFeedEpisodes,
} from "../lib/podcast-feed.functions";
import { canonical, jsonLd, podcastProgramLd } from "../lib/seo";

export const Route = createFileRoute("/podcast/$slug")({
  loader: async ({ params }) => {
    const { podcastPrograms } = await import("../data/podcast-programs");
    const program = podcastPrograms[params.slug];
    if (!program) throw notFound();
    const [episodes, catalog] = await Promise.all([
      program.episodes.length > 0
        ? Promise.resolve(program.episodes)
        : getPodcastFeedEpisodes({ data: { slug: program.slug, limit: 100 } }),
      getPodcastCatalog({ data: { group: program.group } }),
    ]);
    const programCover = catalog.find((item) => item.slug === program.slug)?.cover || program.cover;
    return { program, programCover, episodes };
  },
  head: ({ loaderData }) => {
    const p = loaderData?.program;
    const title = p ? `${p.name} — Podcast IMLAND` : "Podcast — IMLAND";
    const desc = p?.tagline ?? "Ascolta i podcast della community IMLAND.";
    return {
      meta: [
        { title },
        { name: "description", content: desc },
        { property: "og:title", content: title },
        { property: "og:description", content: desc },
        ...(loaderData?.programCover
          ? [{ property: "og:image", content: loaderData.programCover }]
          : []),
      ],
      links: p ? [canonical(`/podcast/${p.slug}`)] : [],
      scripts: p ? [jsonLd(podcastProgramLd(p))] : [],
    };
  },
  component: ProgramPage,
  notFoundComponent: () => (
    <div className="mx-auto max-w-3xl px-4 section-pad text-center">
      <h1 className="text-h1-im">Programma non trovato</h1>
      <p className="mt-3 text-muted-foreground">Torna alla lista dei podcast.</p>
      <Link
        to="/podcast"
        className="mt-6 inline-block btn-blue rounded-full px-5 py-2.5 text-sm font-semibold"
      >
        Tutti i podcast
      </Link>
    </div>
  ),
});

function formatDate(d: string | null) {
  if (!d) return "";
  const [dd, mm, yyyy] = d.split("-");
  return `${dd}/${mm}/${yyyy}`;
}

const PAGE_SIZE = 6;

function ProgramPage() {
  const { program, programCover, episodes: loadedEpisodes } = Route.useLoaderData();
  const [visible, setVisible] = useState(PAGE_SIZE);
  const [episodes, setEpisodes] = useState(loadedEpisodes);
  const [loadingEpisodes, setLoadingEpisodes] = useState(loadedEpisodes.length === 0);
  const [feedError, setFeedError] = useState(false);

  const reloadEpisodes = () => {
    setLoadingEpisodes(true);
    setFeedError(false);
    getPodcastFeedEpisodes({ data: { slug: program.slug, limit: 100 } })
      .then((items) => {
        setEpisodes(items);
        setFeedError(items.length === 0);
      })
      .catch(() => setFeedError(true))
      .finally(() => setLoadingEpisodes(false));
  };

  useEffect(() => {
    setEpisodes(loadedEpisodes);
    if (loadedEpisodes.length === 0) reloadEpisodes();
    else {
      setLoadingEpisodes(false);
      setFeedError(false);
    }
    // loadedEpisodes changes only when the route loader runs again.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [loadedEpisodes, program.slug]);

  const episodeCover = (ep: (typeof episodes)[number]) =>
    "image" in ep && ep.image ? ep.image : "cover" in ep && ep.cover ? ep.cover : programCover;

  const dates = episodes
    .map((e: (typeof program.episodes)[number]) => e.date)
    .filter(Boolean) as string[];
  const toTime = (d: string) => {
    const [dd, mm, yyyy] = d.split("-");
    return new Date(`${yyyy}-${mm}-${dd}`).getTime();
  };
  const sortedDates = [...dates].sort((a, b) => toTime(a) - toTime(b));
  const firstDate = sortedDates[0] ? formatDate(sortedDates[0]) : null;
  const lastDate = sortedDates[sortedDates.length - 1]
    ? formatDate(sortedDates[sortedDates.length - 1])
    : null;

  const related = allPrograms
    .filter((p) => p.cat === program.cat && p.slug !== program.slug)
    .slice(0, 3);

  return (
    <>
      <section className="hero-frame section-atmosphere overflow-hidden">
        <div className="container-im hero-pad">
          <Link
            to="/podcast"
            className="inline-flex items-center gap-1 text-sm font-semibold text-signal hover:underline"
          >
            <ArrowLeft className="inline h-4 w-4" /> Tutti i canali podcast
          </Link>

          <div className="mt-6 overflow-hidden rounded-[36px] border border-border bg-card shadow-2xl">
            <div className="relative min-h-[340px] md:min-h-[520px]">
              {programCover ? (
                <img
                  src={programCover}
                  alt={`Grafica del canale ${program.name}`}
                  className="absolute inset-0 h-full w-full object-cover"
                />
              ) : (
                <div className="absolute inset-0 bg-signal" />
              )}
              <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/35 to-black/10" />
              <div className="absolute inset-x-0 bottom-0 p-6 text-white md:p-10 lg:p-12">
                <p className="text-xs font-semibold uppercase tracking-wider text-white/75">
                  Canale podcast · {program.cat}
                </p>
                <h1 className="mt-3 max-w-4xl text-4xl font-bold leading-tight md:text-6xl">
                  {program.name}
                </h1>
                <p className="mt-4 max-w-2xl text-base text-white/80 md:text-lg">
                  {program.tagline}
                </p>
                <p className="mt-6 text-sm font-semibold text-white/80">
                  {episodes.length || program.publishedEpisodes} puntat
                  {(episodes.length || program.publishedEpisodes) === 1 ? "a" : "e"}
                  {firstDate && lastDate && firstDate !== lastDate
                    ? ` · pubblicate tra il ${firstDate} e il ${lastDate}`
                    : firstDate
                      ? ` · dal ${firstDate}`
                      : ""}
                </p>
              </div>
            </div>
            <div className="border-t border-border bg-background/80 p-5 md:p-6">
              <PodcastFeedPlayer
                slug={program.slug}
                name={program.name}
                cover={programCover}
                initialTrack={episodes[0] ?? null}
              />
            </div>
          </div>
        </div>
      </section>

      <section className="container-im section-canvas section-pad-sm">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-signal">
              Puntate del canale
            </p>
            <h2 className="mt-2 text-h2-im">Tutte le puntate di {program.name}.</h2>
          </div>
          <span className="text-xs text-muted-foreground">
            {loadingEpisodes
              ? "Caricamento episodi"
              : `${Math.min(visible, episodes.length)} di ${episodes.length} mostrati`}
          </span>
        </div>
        <div className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {episodes
            .slice(0, visible)
            .map((ep: (typeof episodes)[number], i: number) => (
              <div key={ep.slug} className="relative">
                <div className="group block focus:outline-none focus-visible:ring-2 focus-visible:ring-signal focus-visible:ring-offset-2 rounded-3xl">
                  <SpotlightCard className="flex h-full flex-col overflow-hidden glass-panel rounded-3xl transition-all hover:-translate-y-0.5 hover:shadow-lg">
                    <div className="relative aspect-square w-full overflow-hidden bg-signal flex items-center justify-center">
                      {episodeCover(ep) ? (
                        <img
                          src={episodeCover(ep)}
                          alt={ep.title}
                          loading="lazy"
                          className="h-full w-full object-contain transition-transform duration-300 group-hover:scale-105"
                        />
                      ) : (
                        <span className="px-6 text-center text-sm font-semibold text-white">
                          IMMAGINE IN ARRIVO
                        </span>
                      )}
                      <span className="absolute inset-0 flex items-center justify-center bg-background/40 opacity-0 transition-opacity group-hover:opacity-100">
                        <span className="flex h-12 w-12 items-center justify-center rounded-full bg-signal text-white shadow-lg [&>svg]:text-white">
                          <svg viewBox="0 0 24 24" className="h-5 w-5 fill-current">
                            <path d="M8 5v14l11-7z" />
                          </svg>
                        </span>
                      </span>
                    </div>
                    <div className="flex flex-1 flex-col p-5">
                      <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                        Puntata {episodes.length - i}{" "}
                        {ep.date ? `· ${formatDate(ep.date)}` : ""}
                      </p>
                      <h3 className="mt-2 text-h3-im">{ep.title}</h3>
                      {ep.subtitle && (
                        <p className="mt-2 line-clamp-2 text-sm text-muted-foreground">
                          {ep.subtitle}
                        </p>
                      )}
                      <div className="mt-auto flex items-center justify-between pt-5">
                        <Link
                          to="/podcast/$slug/$episode"
                          params={{ slug: program.slug, episode: ep.slug }}
                          className="inline-flex items-center gap-1.5 text-xs font-semibold text-signal"
                        >
                          Apri episodio <ArrowRight className="inline h-4 w-4" />
                        </Link>
                        <span className="text-xs text-muted-foreground">{ep.duration ?? ""}</span>
                      </div>
                    </div>
                  </SpotlightCard>
                </div>
                <div className="absolute bottom-4 right-4">
                  <EpisodePlayButton
                    track={{
                      audio: ep.audio,
                      title: ep.title,
                      program: program.name,
                      programSlug: program.slug,
                      episodeSlug: ep.slug,
                      cover: episodeCover(ep),
                    }}
                  />
                </div>
              </div>
            ))}
          {!loadingEpisodes && feedError && episodes.length === 0 && (
            <div className="col-span-full rounded-3xl border border-dashed border-border p-8 text-center">
              <p className="text-sm font-medium text-foreground">
                Non è stato possibile aggiornare le puntate dal feed in questo momento.
              </p>
              <button
                type="button"
                onClick={reloadEpisodes}
                className="mt-4 rounded-full bg-signal px-5 py-2.5 text-sm font-semibold text-white transition hover:brightness-95 focus:outline-none focus-visible:ring-2 focus-visible:ring-signal focus-visible:ring-offset-2"
              >
                Ricarica le puntate
              </button>
            </div>
          )}
          {loadingEpisodes && (
            <p className="col-span-full rounded-3xl border border-dashed border-border p-10 text-center text-sm text-muted-foreground">
              Caricamento degli episodi del canale…
            </p>
          )}
        </div>
        {visible < episodes.length && (
          <div className="mt-8 text-center">
            <button
              onClick={() => setVisible((v) => v + PAGE_SIZE)}
              className="rounded-full glass-panel px-6 py-3 text-sm font-semibold hover:bg-muted"
            >
              Mostra altri episodi
            </button>
          </div>
        )}
      </section>

      {related.length > 0 && (
        <section className="container-im section-focus section-pad-sm">
          <p className="text-xs font-semibold uppercase tracking-wider text-signal">
            Ti potrebbe interessare
          </p>
          <h2 className="mt-2 text-h2-im">
            Altri programmi <span className="im-gradient-text">{program.cat}.</span>
          </h2>
          <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {related.map((p) => (
              <Link
                key={p.slug}
                to="/podcast/$slug"
                params={{ slug: p.slug }}
                className="block focus:outline-none focus-visible:ring-2 focus-visible:ring-signal focus-visible:ring-offset-2 rounded-3xl"
              >
                <SpotlightCard className="flex h-full items-center gap-4 glass-panel rounded-3xl p-4 transition-all hover:-translate-y-0.5 hover:shadow-lg">
                  <span className="flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl bg-signal text-lg font-bold text-white">
                    {p.name.slice(0, 2).toUpperCase()}
                  </span>
                  <div className="min-w-0">
                    <h3 className="truncate text-sm font-semibold">{p.name}</h3>
                    <p className="mt-1 line-clamp-2 text-xs text-muted-foreground">{p.tagline}</p>
                    <p className="mt-1 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                      {p.episodes}
                    </p>
                  </div>
                </SpotlightCard>
              </Link>
            ))}
          </div>
        </section>
      )}

      <PodcastMiniPlayer />
    </>
  );
}
