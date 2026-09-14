import { podcastProgramList } from "./podcast-programs";

export type ProgramCard = {
  name: string;
  cover: string;
  cat: string;
  tagline: string;
  episodes: string;
  slug: string;
};

/** Canali con almeno un episodio, dal più ricco al più leggero. */
export const programs: ProgramCard[] = podcastProgramList
  .filter((p) => p.episodes.length > 0)
  .sort((a, b) => b.episodes.length - a.episodes.length)
  .map((p) => ({
    name: p.name,
    cover: p.cover,
    cat: p.cat,
    tagline: p.tagline,
    episodes: `${p.episodes.length} episod${p.episodes.length === 1 ? "io" : "i"}`,
    slug: p.slug,
  }));

const dateKey = (d: string | null) => (d ? d.split("-").reverse().join("") : "");

/** Tutti gli episodi di tutti i canali, con il programma di appartenenza, dal più recente. */
export const allEpisodes = podcastProgramList
  .flatMap((p) => p.episodes.map((ep) => ({ ep, program: p })))
  .sort((a, b) => dateKey(b.ep.date).localeCompare(dateKey(a.ep.date)));

/** Ultimi episodi pubblicati su tutti i canali. */
export const latestEpisodes = allEpisodes.slice(0, 8);

export const totalEpisodes = podcastProgramList.reduce((n, p) => n + p.episodes.length, 0);

/** Conteggio canali ed episodi per categoria, calcolato sui dati reali. */
export const categoryStats: Record<string, { programs: number; episodes: number }> = {};
for (const p of podcastProgramList) {
  if (p.episodes.length === 0) continue;
  const s = categoryStats[p.cat] ?? { programs: 0, episodes: 0 };
  s.programs += 1;
  s.episodes += p.episodes.length;
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
