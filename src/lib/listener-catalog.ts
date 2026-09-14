import {
  podcastProgramList,
  type PodcastEpisode,
  type PodcastProgram,
} from "@/data/podcast-programs";

export type EpisodeRef = { program: PodcastProgram; episode: PodcastEpisode };

const byEpisodeSlug = new Map<string, EpisodeRef>();
const byAudio = new Map<string, EpisodeRef>();

for (const program of podcastProgramList) {
  for (const episode of program.episodes) {
    byEpisodeSlug.set(episode.slug, { program, episode });
    byAudio.set(episode.audio, { program, episode });
  }
}

export function episodeBySlug(slug: string) {
  return byEpisodeSlug.get(slug) ?? null;
}

export function episodeByAudio(audio: string) {
  return byAudio.get(audio) ?? null;
}

export function allEpisodes(): EpisodeRef[] {
  return [...byEpisodeSlug.values()];
}

/** Le date del catalogo sono nel formato "DD-MM-YYYY". */
export function parseEpisodeDate(date: string | null | undefined): Date | null {
  if (!date) return null;
  const [d, m, y] = date.split("-").map(Number);
  if (!d || !m || !y) return null;
  const parsed = new Date(y, m - 1, d);
  return isNaN(parsed.getTime()) ? null : parsed;
}

export function formatEpisodeDate(date: string | null | undefined) {
  const parsed = parseEpisodeDate(date);
  if (!parsed) return "—";
  return parsed.toLocaleDateString("it-IT", { day: "2-digit", month: "long", year: "numeric" });
}

export function episodeLink(programSlug: string, episodeSlug: string) {
  return `/podcast/${programSlug}/${episodeSlug}`;
}
