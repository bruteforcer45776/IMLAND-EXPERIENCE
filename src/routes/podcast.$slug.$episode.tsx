import { useEffect, useState } from "react";
import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { SectionDecor } from "../components/decor";
import { useState as useState2 } from "react";
import { SpotlightCard } from "../components/spotlight-card";
import {
  podcastAudio,
  usePodcastAudio,
  fmtTime,
  PlayIcon,
  PodcastMiniPlayer,
  getSavedPosition,
  trackKey,
} from "../components/podcast-audio";

export const Route = createFileRoute("/podcast/$slug/$episode")({
  loader: async ({ params }) => {
    const { podcastPrograms } = await import("../data/podcast-programs");
    const program = podcastPrograms[params.slug];
    if (!program) throw notFound();
    const episode = program.episodes.find((e) => e.slug === params.episode);
    if (!episode) throw notFound();
    return { program, episode };
  },
  head: ({ loaderData }) => {
    const title = loaderData
      ? `${loaderData.episode.title} — ${loaderData.program.name}`
      : "Episodio — IMLAND";
    const desc = loaderData?.episode.subtitle ?? loaderData?.program.tagline ?? "Episodio IMLAND.";
    return {
      meta: [
        { title },
        { name: "description", content: desc },
        { property: "og:title", content: title },
        { property: "og:description", content: desc },
        ...(loaderData?.program.cover
          ? [{ property: "og:image", content: loaderData.program.cover }]
          : []),
      ],
    };
  },
  component: EpisodePage,
  notFoundComponent: () => (
    <div className="mx-auto max-w-3xl px-4 section-pad text-center">
      <h1 className="text-h1-im">Episodio non trovato</h1>
      <Link
        to="/podcast"
        className="mt-6 inline-block btn-blue rounded-full px-5 py-2.5 text-sm font-semibold"
      >
        Tutti i podcast
      </Link>
    </div>
  ),
});

function EpisodePage() {
  const { program, episode } = Route.useLoaderData();
  const { track, playing: globalPlaying, time, duration } = usePodcastAudio();

  const currentTrack = {
    audio: episode.audio,
    title: episode.title,
    program: program.name,
    programSlug: program.slug,
    episodeSlug: episode.slug,
    cover: program.cover,
  };

  const isCurrent = Boolean(
    track && trackKey(track) === trackKey({ programSlug: program.slug, episodeSlug: episode.slug }),
  );
  const playing = isCurrent && globalPlaying;

  const [saved, setSaved] = useState(0);
  useEffect(() => {
    setSaved(getSavedPosition(episode.audio));
  }, [episode.audio, isCurrent, globalPlaying]);

  const t = isCurrent ? time : saved;
  const dur = isCurrent ? duration : 0;

  const toggle = () => podcastAudio.toggle(currentTrack);

  const seek = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (isCurrent) podcastAudio.seek(Number(e.target.value));
  };

  const idx = program.episodes.findIndex(
    (e: (typeof program.episodes)[number]) => e.slug === episode.slug,
  );
  const prev = idx > 0 ? program.episodes[idx - 1] : null;
  const next = idx < program.episodes.length - 1 ? program.episodes[idx + 1] : null;
  const others = program.episodes
    .filter((e: (typeof program.episodes)[number]) => e.slug !== episode.slug)
    .slice(0, 4);

  const [copied, setCopied] = useState2(false);
  const share = async () => {
    const url = typeof window !== "undefined" ? window.location.href : "";
    if (typeof navigator !== "undefined" && navigator.share) {
      try {
        await navigator.share({ title: episode.title, text: program.name, url });
        return;
      } catch {
        /* condivisione annullata */
      }
    }
    if (typeof navigator !== "undefined" && navigator.clipboard) {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <>
      <section className="section-focus decor-host overflow-hidden">
        <SectionDecor variant="warm" />
        <div className="mx-auto max-w-5xl px-4 py-10 md:px-8 md:py-14">
          <div className="text-sm text-muted-foreground">
            <Link to="/podcast" className="hover:underline">
              Podcast
            </Link>
            {" / "}
            <Link to="/podcast/$slug" params={{ slug: program.slug }} className="hover:underline">
              {program.name}
            </Link>
          </div>

          <SpotlightCard className="mt-6 grid items-center gap-8 glass-panel rounded-[36px] p-6 md:grid-cols-[280px_1fr] md:p-10">
            <div className="relative aspect-square w-full overflow-hidden rounded-3xl bg-signal flex items-center justify-center">
              <img
                loading="lazy"
                decoding="async"
                src={program.cover}
                alt={episode.title}
                className="h-full w-full object-contain"
              />
            </div>
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-signal">
                {program.name}
              </p>
              <h1 className="mt-3 text-h1-im">{episode.title}</h1>
              {episode.subtitle && (
                <p className="mt-3 text-base text-muted-foreground">{episode.subtitle}</p>
              )}

              <div className="mt-6 rounded-2xl bg-white/5 p-4">
                <div className="flex items-center gap-4">
                  <button
                    onClick={toggle}
                    aria-label={playing ? "Pausa" : "Riproduci"}
                    className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-signal text-white transition-transform hover:scale-105"
                  >
                    <PlayIcon playing={playing} className="h-5 w-5" />
                  </button>
                  <div className="flex-1">
                    <input
                      type="range"
                      min={0}
                      max={dur || 0}
                      value={t}
                      step={0.1}
                      onChange={seek}
                      className="w-full accent-signal"
                    />
                    <div className="mt-1 flex justify-between text-xs text-muted-foreground tabular-nums">
                      <span>{fmtTime(t)}</span>
                      <span>{fmtTime(dur)}</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="mt-4 flex flex-wrap gap-2">
                <a
                  href={episode.audio}
                  download
                  className="rounded-full glass-panel px-4 py-2 text-xs font-semibold hover:bg-muted"
                >
                  Scarica MP3
                </a>
                <button
                  onClick={share}
                  className="rounded-full glass-panel px-4 py-2 text-xs font-semibold hover:bg-muted"
                >
                  {copied ? "Link copiato ✓" : "Condividi"}
                </button>
                <Link
                  to="/podcast/$slug"
                  params={{ slug: program.slug }}
                  className="rounded-full glass-panel px-4 py-2 text-xs font-semibold hover:bg-muted"
                >
                  Tutti gli episodi
                </Link>
              </div>
            </div>
          </SpotlightCard>

          <div className="mt-8 grid gap-6 md:grid-cols-[1fr_320px]">
            <SpotlightCard className="glass-panel rounded-3xl p-6 md:p-8">
              <p className="text-xs font-semibold uppercase tracking-wider text-signal">
                Note dell'episodio
              </p>
              <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                {episode.subtitle ??
                  "Nessuna nota disponibile per questo episodio. Ascolta la puntata per scoprire i dettagli."}
              </p>
              {episode.date && (
                <p className="mt-4 text-xs text-muted-foreground">
                  Pubblicato il {episode.date.split("-").join("/")}
                </p>
              )}
            </SpotlightCard>

            {others.length > 0 && (
              <div>
                <p className="text-xs font-semibold uppercase tracking-wider text-signal">
                  Altri episodi di {program.name}
                </p>
                <ul className="mt-3 grid gap-2">
                  {others.map((e: (typeof program.episodes)[number]) => (
                    <li key={e.slug}>
                      <Link
                        to="/podcast/$slug/$episode"
                        params={{ slug: program.slug, episode: e.slug }}
                        className="block rounded-2xl glass-panel px-4 py-3 text-sm font-medium transition hover:bg-muted"
                      >
                        <span className="line-clamp-1">{e.title}</span>
                        {e.date && (
                          <span className="mt-0.5 block text-xs font-normal text-muted-foreground">
                            {e.date.split("-").join("/")}
                          </span>
                        )}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>

          <div className="mt-8 flex flex-wrap justify-between gap-3">
            {prev ? (
              <Link
                to="/podcast/$slug/$episode"
                params={{ slug: program.slug, episode: prev.slug }}
                className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground"
              >
                <ArrowLeft className="inline h-4 w-4" /> {prev.title}
              </Link>
            ) : (
              <span />
            )}
            {next ? (
              <Link
                to="/podcast/$slug/$episode"
                params={{ slug: program.slug, episode: next.slug }}
                className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground"
              >
                {next.title} <ArrowRight className="inline h-4 w-4" />
              </Link>
            ) : (
              <span />
            )}
          </div>
        </div>
      </section>
      <PodcastMiniPlayer />
    </>
  );
}
