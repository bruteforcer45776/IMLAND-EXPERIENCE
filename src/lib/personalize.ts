import { podcastProgramList, type PodcastProgram } from "@/data/podcast-programs";
import { allEpisodes, parseEpisodeDate, type EpisodeRef } from "@/lib/listener-catalog";

/** I temi dell'onboarding mappati sulle categorie del catalogo podcast. */
export const TOPIC_TO_CATEGORIES: Record<string, string[]> = {
  Business: ["Business"],
  Cultura: ["Cultura"],
  "Cibo e vino": ["Cibo"],
  Tecnologia: ["Tecnologia"],
  Lifestyle: ["Lifestyle"],
  "Weekend ed eventi": ["Weekend"],
  "Notizie del territorio": [],
  Musica: ["Lifestyle", "Weekend"],
};

function programScore(program: PodcastProgram, topics: string[]) {
  const cats = topics.flatMap((t) => TOPIC_TO_CATEGORIES[t] ?? []);
  const cat = (program as PodcastProgram & { cat?: string }).cat;
  let score = 0;
  if (cat && cats.includes(cat)) score += 10;
  score += Math.min(5, program.episodes.length / 10);
  return score;
}

/** Ordina i programmi mettendo davanti quelli coerenti con i temi scelti. */
export function rankPrograms(topics: string[]): PodcastProgram[] {
  return [...podcastProgramList].sort((a, b) => programScore(b, topics) - programScore(a, topics));
}

/** Puntate consigliate: prima i temi scelti, poi le più recenti. */
export function rankEpisodes(topics: string[], limit = 6): EpisodeRef[] {
  const cats = topics.flatMap((t) => TOPIC_TO_CATEGORIES[t] ?? []);
  return allEpisodes()
    .map((ref) => {
      const cat = (ref.program as PodcastProgram & { cat?: string }).cat;
      const date = parseEpisodeDate(ref.episode.date)?.getTime() ?? 0;
      return { ref, score: (cat && cats.includes(cat) ? 1 : 0) * 1e13 + date };
    })
    .sort((a, b) => b.score - a.score)
    .slice(0, limit)
    .map((r) => r.ref);
}
