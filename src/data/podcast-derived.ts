import { podcastProgramList } from "./podcast-programs";

export type ProgramCard = {
  name: string;
  cover: string;
  cat: string;
  tagline: string;
  episodes: string;
  slug: string;
  sourceUrl: string;
  rssUrl: string;
  publishedEpisodes: number;
};

/** Canali ufficiali IMLAND Radio con feed RSS diretto, dal più ricco al più leggero. */
export const programs: ProgramCard[] = podcastProgramList
  .sort((a, b) => b.publishedEpisodes - a.publishedEpisodes)
  .map((p) => ({
    name: p.name,
    cover: p.cover,
    cat: p.cat,
    tagline: p.tagline,
    episodes: `${p.publishedEpisodes} episod${p.publishedEpisodes === 1 ? "io" : "i"}`,
    slug: p.slug,
    sourceUrl: p.sourceUrl,
    rssUrl: p.rssUrl,
    publishedEpisodes: p.publishedEpisodes,
  }));

const dateKey = (d: string | null) => (d ? d.split("-").reverse().join("") : "");

/** Tutti gli episodi di tutti i canali, con il programma di appartenenza, dal più recente. */
export const allEpisodes = podcastProgramList
  .flatMap((p) => p.episodes.map((ep) => ({ ep, program: p })))
  .sort((a, b) => dateKey(b.ep.date).localeCompare(dateKey(a.ep.date)));

/** Ultimi episodi pubblicati su tutti i canali. */
export const latestEpisodes = allEpisodes.slice(0, 8);

export const totalEpisodes = podcastProgramList.reduce((n, p) => n + p.publishedEpisodes, 0);

/** Conteggio canali ed episodi per categoria, calcolato sui dati reali. */
export const categoryStats: Record<string, { programs: number; episodes: number }> = {};
for (const p of podcastProgramList) {
  const s = categoryStats[p.cat] ?? { programs: 0, episodes: 0 };
  s.programs += 1;
  s.episodes += p.publishedEpisodes;
  categoryStats[p.cat] = s;
}

/**
 * Una selezione per categoria firmata dalla redazione: l'episodio più recente
 * del canale con più puntate in ciascuna categoria. Nessun dato inventato,
 * solo un criterio editoriale sui dati reali.
 */
export const curatedEpisodes = programs
  .filter((p, i, arr) => arr.findIndex((x) => x.cat === p.cat) === i)
  .map((p) => allEpisodes.find((e) => e.program.slug === p.slug))
  .filter((x): x is (typeof allEpisodes)[number] => Boolean(x));
