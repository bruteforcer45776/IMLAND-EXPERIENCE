import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { useState } from "react";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { SpotlightCard } from "../components/spotlight-card";
import { EpisodePlayButton, PodcastMiniPlayer } from "../components/podcast-audio";
import { programs as allPrograms } from "../data/podcast-derived";

export const Route = createFileRoute("/podcast/$slug")({
  loader: async ({ params }) => {
    const { podcastPrograms } = await import("../data/podcast-programs");
    const program = podcastPrograms[params.slug];
    if (!program) throw notFound();
    return { program };
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
        ...(p?.cover ? [{ property: "og:image", content: p.cover }] : []),
      ],
    };
  },
  component: ProgramPage,
  notFoundComponent: () => (
    <div className="mx-auto max-w-3xl px-4 section-pad text-center">
      <h1 className="text-h1-im">Programma non trovato</h1>
      <p className="mt-3 text-muted-foreground">Torna alla lista dei podcast.</p>
      <Link to="/podcast" className="mt-6 inline-block btn-blue rounded-full px-5 py-2.5 text-sm font-semibold">
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
  const { program } = Route.useLoaderData();
  const [visible, setVisible] = useState(PAGE_SIZE);

  const dates = program.episodes.map((e: (typeof program.episodes)[number]) => e.date).filter(Boolean) as string[];
  const toTime = (d: string) => { const [dd, mm, yyyy] = d.split("-"); return new Date(`${yyyy}-${mm}-${dd}`).getTime(); };
  const sortedDates = [...dates].sort((a, b) => toTime(a) - toTime(b));
  const firstDate = sortedDates[0] ? formatDate(sortedDates[0]) : null;
  const lastDate = sortedDates[sortedDates.length - 1] ? formatDate(sortedDates[sortedDates.length - 1]) : null;

  const related = allPrograms.filter((p) => p.cat === program.cat && p.slug !== program.slug).slice(0, 3);

  return (
    <>
      <section className="section-atmosphere">
        <div className="container-im grid gap-8 hero-pad md:grid-cols-[280px_1fr]">
          <div className="relative aspect-square w-full overflow-hidden rounded-3xl border border-border bg-signal flex items-center justify-center">
            <img loading="lazy" decoding="async" src={program.cover} alt={`Copertina ${program.name}`} className="h-full w-full object-contain" />
          </div>
          <div className="flex flex-col justify-center">
            <p className="text-xs font-semibold uppercase tracking-wider text-signal">Podcast · {program.cat}</p>
            <h1 className="mt-3 text-display-l">{program.name}</h1>
            <p className="mt-4 max-w-2xl text-lg text-muted-foreground">{program.tagline}</p>
            <p className="mt-6 text-sm text-muted-foreground">
              {program.episodes.length} episod{program.episodes.length === 1 ? "io" : "i"} disponibil{program.episodes.length === 1 ? "e" : "i"}
              {firstDate && lastDate && firstDate !== lastDate ? ` · pubblicati tra il ${firstDate} e il ${lastDate}` : firstDate ? ` · dal ${firstDate}` : ""}
            </p>
            <div className="mt-6">
              <Link to="/podcast" className="inline-flex items-center gap-1 text-sm font-semibold text-signal hover:underline">
                <ArrowLeft className="inline h-4 w-4" /> Tutti i podcast
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section className="container-im section-canvas section-pad-sm">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <h2 className="text-h2-im">Episodi</h2>
          <span className="text-xs text-muted-foreground">{Math.min(visible, program.episodes.length)} di {program.episodes.length} mostrati</span>
        </div>
        <div className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {program.episodes.slice(0, visible).map((ep: (typeof program.episodes)[number], i: number) => (
            <div key={ep.slug} className="relative">
            <Link
              to="/podcast/$slug/$episode"
              params={{ slug: program.slug, episode: ep.slug }}
              className="group block focus:outline-none focus-visible:ring-2 focus-visible:ring-signal focus-visible:ring-offset-2 rounded-3xl"
            >
              <SpotlightCard className="flex h-full flex-col overflow-hidden glass-panel rounded-3xl transition-all hover:-translate-y-0.5 hover:shadow-lg">
                <div className="relative aspect-square w-full overflow-hidden bg-signal flex items-center justify-center">
                  <img src={program.cover} alt={ep.title} loading="lazy" className="h-full w-full object-contain transition-transform duration-300 group-hover:scale-105" />
                  <span className="absolute inset-0 flex items-center justify-center bg-background/40 opacity-0 transition-opacity group-hover:opacity-100">
                    <span className="flex h-12 w-12 items-center justify-center rounded-full bg-signal text-white shadow-lg [&>svg]:text-white">
                      <svg viewBox="0 0 24 24" className="h-5 w-5 fill-current"><path d="M8 5v14l11-7z" /></svg>
                    </span>
                  </span>
                </div>
                <div className="flex flex-1 flex-col p-5">
                  <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                    Ep. {program.episodes.length - i} {ep.date ? `· ${formatDate(ep.date)}` : ""}
                  </p>
                  <h3 className="mt-2 text-h3-im">{ep.title}</h3>
                  {ep.subtitle && <p className="mt-2 line-clamp-2 text-sm text-muted-foreground">{ep.subtitle}</p>}
                  <div className="mt-auto flex items-center justify-between pt-5">
                    <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-signal">
                      Apri episodio <ArrowRight className="inline h-4 w-4" />
                    </span>
                    <span className="text-xs text-muted-foreground">{ep.duration ?? ""}</span>
                  </div>
                </div>
              </SpotlightCard>
            </Link>
            <div className="absolute bottom-4 right-4">
              <EpisodePlayButton
                track={{
                  audio: ep.audio,
                  title: ep.title,
                  program: program.name,
                  programSlug: program.slug,
                  episodeSlug: ep.slug,
                  cover: program.cover,
                }}
              />
            </div>
            </div>
          ))}
          {program.episodes.length === 0 && (
            <p className="col-span-full rounded-3xl border border-dashed border-border p-10 text-center text-sm text-muted-foreground">
              Nessun episodio ancora disponibile.
            </p>
          )}
        </div>
        {visible < program.episodes.length && (
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
          <p className="text-xs font-semibold uppercase tracking-wider text-signal">Ti potrebbe interessare</p>
          <h2 className="mt-2 text-h2-im">Altri programmi <span className="im-gradient-text">{program.cat}.</span></h2>
          <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {related.map((p) => (
              <Link key={p.slug} to="/podcast/$slug" params={{ slug: p.slug }} className="block focus:outline-none focus-visible:ring-2 focus-visible:ring-signal focus-visible:ring-offset-2 rounded-3xl">
                <SpotlightCard className="flex h-full items-center gap-4 glass-panel rounded-3xl p-4 transition-all hover:-translate-y-0.5 hover:shadow-lg">
                  <img src={p.cover} alt="" loading="lazy" className="h-16 w-16 shrink-0 rounded-2xl object-cover" />
                  <div className="min-w-0">
                    <h3 className="truncate text-sm font-semibold">{p.name}</h3>
                    <p className="mt-1 line-clamp-2 text-xs text-muted-foreground">{p.tagline}</p>
                    <p className="mt-1 text-xs font-semibold uppercase tracking-wider text-muted-foreground">{p.episodes}</p>
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
