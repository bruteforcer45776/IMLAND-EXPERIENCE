export type PodcastEpisode = {
  slug: string;
  title: string;
  subtitle: string | null;
  audio: string;
  cover: string;
  date: string | null;
  duration?: string;
};

export type PodcastGroup = "podcast" | "my-podcast";

export type PodcastProgram = {
  slug: string;
  name: string;
  tagline: string;
  cat: string;
  cover: string;
  sourceUrl: string;
  rssUrl: string;
  publishedEpisodes: number;
  group: PodcastGroup;
  episodes: PodcastEpisode[];
};

const program = (
  slug: string,
  name: string,
  rssUrl: string,
  cat: string,
  tagline: string,
  publishedEpisodes: number,
  group: PodcastGroup = "podcast",
): PodcastProgram => ({
  slug,
  name,
  tagline,
  cat,
  cover: "",
  sourceUrl: rssUrl,
  rssUrl,
  publishedEpisodes,
  group,
  episodes: [],
});

/** Elenco ufficiale IMLAND, già ordinato per data dell'ultima pubblicazione. */
export const podcastPrograms: Record<string, PodcastProgram> = {
  assaggi: program("assaggi", "Assaggi", "https://podcast.imlandradio.it/podcast/imland-assaggi.xml", "Cibo", "Cibo, vino, produttori e percorsi del gusto.", 4),
  "carta-canta": program("carta-canta", "Carta Canta", "https://podcast.imlandradio.it/podcast/imland-cartacanta.xml", "Cultura", "Il podcast che legge tra le righe.", 21),
  "casual-nerd-stories": program("casual-nerd-stories", "Casual Nerd Stories", "https://podcast.imlandradio.it/podcast/imland-Casualnerdstories.xml", "Tecnologia", "Storie, cultura pop e immaginari nerd.", 1),
  "istruzioni-per-l-uso": program("istruzioni-per-l-uso", "Istruzioni per l'uso", "https://podcast.imlandradio.it/podcast/imland-istruzioni.xml", "Business", "Conversazioni pratiche con professionisti, imprese e voci del territorio.", 17),
  stuzzicaziende: program("stuzzicaziende", "Stuzzicaziende", "https://podcast.imlandradio.it/podcast/imland-stuzzicaziende.xml", "Business", "Aziende locali raccontate attraverso persone, filiere e scelte d'impresa.", 14),
  "terra-di-diamanti": program("terra-di-diamanti", "Terra di Diamanti", "https://podcast.imlandradio.it/podcast/imland-diamanti.xml", "Cultura", "Racconti, territorio e identità locale dal Piemonte nord-orientale.", 12),
  "grigliata-mista": program("grigliata-mista", "Grigliata Mista", "https://podcast.imlandradio.it/podcast/imland-grigliata.xml", "Lifestyle", "Voci, storie e attualità del territorio in forma diretta.", 4),
  mirabilis: program("mirabilis", "Mirabilis", "https://podcast.imlandradio.it/podcast/imland-Mirabilis.xml", "Cultura", "Mente, cura e futuro.", 5, "my-podcast"),
  "tedx-biella-2025": program("tedx-biella-2025", "TEDx Biella 2025", "https://podcast.imlandradio.it/podcast/imland-tedxbiella2025.xml", "Cultura", "Idee e protagonisti di TEDx Biella 2025.", 2, "my-podcast"),
};

export const podcastProgramList = Object.values(podcastPrograms);
export const editorialPodcastProgramList = podcastProgramList.filter((p) => p.group === "podcast");
export const myPodcastProgramList = podcastProgramList.filter((p) => p.group === "my-podcast");
