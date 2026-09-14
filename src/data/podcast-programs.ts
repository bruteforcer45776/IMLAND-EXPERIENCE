export type PodcastEpisode = {
  slug: string;
  title: string;
  subtitle: string | null;
  audio: string;
  cover: string;
  date: string | null;
  duration?: string;
};

export type PodcastProgram = {
  slug: string;
  name: string;
  tagline: string;
  cat: string;
  cover: string;
  sourceUrl: string;
  rssUrl: string;
  publishedEpisodes: number;
  episodes: PodcastEpisode[];
};

const feed = (slug: string) => `https://imlandradio.it/podcastfilter/${slug}/feed/`;
const source = (slug: string) => `https://imlandradio.it/podcastfilter/${slug}/`;

export const podcastPrograms: Record<string, PodcastProgram> = {
  "carta-canta-import": {
    slug: "carta-canta-import",
    name: "Carta Canta Import",
    tagline: "Libri, autori e storie culturali dal territorio IMLAND.",
    cat: "Cultura",
    cover: "",
    sourceUrl: source("carta-canta-import"),
    rssUrl: feed("carta-canta-import"),
    publishedEpisodes: 22,
    episodes: [],
  },
  "istruzioni-per-l-uso-import": {
    slug: "istruzioni-per-l-uso-import",
    name: "Istruzioni per l'uso import",
    tagline: "Conversazioni pratiche con professionisti, imprese e voci del territorio.",
    cat: "Business",
    cover: "",
    sourceUrl: source("istruzioni-per-l-uso-import"),
    rssUrl: feed("istruzioni-per-l-uso-import"),
    publishedEpisodes: 18,
    episodes: [],
  },
  "stuzzicaziende-import": {
    slug: "stuzzicaziende-import",
    name: "Stuzzicaziende Import",
    tagline: "Aziende locali raccontate attraverso persone, filiere e scelte d'impresa.",
    cat: "Business",
    cover: "",
    sourceUrl: source("stuzzicaziende-import"),
    rssUrl: feed("stuzzicaziende-import"),
    publishedEpisodes: 15,
    episodes: [],
  },
  "terra-di-diamaanti-import": {
    slug: "terra-di-diamaanti-import",
    name: "Terra di Diamanti Import",
    tagline: "Storie e luoghi del territorio, tra cultura locale e identita piemontese.",
    cat: "Cultura",
    cover: "",
    sourceUrl: source("terra-di-diamaanti-import"),
    rssUrl: feed("terra-di-diamaanti-import"),
    publishedEpisodes: 13,
    episodes: [],
  },
  stuzzicaziende: {
    slug: "stuzzicaziende",
    name: "Stuzzicaziende",
    tagline: "Imprese, artigiani e attivita del territorio in formato intervista.",
    cat: "Business",
    cover: "",
    sourceUrl: source("stuzzicaziende"),
    rssUrl: feed("stuzzicaziende"),
    publishedEpisodes: 12,
    episodes: [],
  },
  "andrea-todaro": {
    slug: "andrea-todaro",
    name: "Andrea Todaro",
    tagline: "Educazione finanziaria e temi pratici affrontati con Andrea Todaro.",
    cat: "Business",
    cover: "",
    sourceUrl: source("andrea-todaro"),
    rssUrl: feed("andrea-todaro"),
    publishedEpisodes: 8,
    episodes: [],
  },
  "terra-di-diamanti": {
    slug: "terra-di-diamanti",
    name: "Terra di Diamanti",
    tagline: "Racconti, territorio e identita locale dal Piemonte nord-orientale.",
    cat: "Cultura",
    cover: "",
    sourceUrl: source("terra-di-diamanti"),
    rssUrl: feed("terra-di-diamanti"),
    publishedEpisodes: 8,
    episodes: [],
  },
  "mirabilis-2": {
    slug: "mirabilis-2",
    name: "MIRABILIS",
    tagline: "Percorsi e racconti dedicati alle meraviglie del territorio.",
    cat: "Cultura",
    cover: "",
    sourceUrl: source("mirabilis-2"),
    rssUrl: feed("mirabilis-2"),
    publishedEpisodes: 7,
    episodes: [],
  },
  mirabilis: {
    slug: "mirabilis",
    name: "mirabilis",
    tagline: "Racconti territoriali e approfondimenti in formato podcast.",
    cat: "Cultura",
    cover: "",
    sourceUrl: source("mirabilis"),
    rssUrl: feed("mirabilis"),
    publishedEpisodes: 6,
    episodes: [],
  },
  "assaggi-import": {
    slug: "assaggi-import",
    name: "Assaggi Import",
    tagline: "Sapori, produttori e cultura dell'assaggio raccontati da IMLAND.",
    cat: "Cibo",
    cover: "",
    sourceUrl: source("assaggi-import"),
    rssUrl: feed("assaggi-import"),
    publishedEpisodes: 5,
    episodes: [],
  },
  "grigliata-mista-import": {
    slug: "grigliata-mista-import",
    name: "Grigliata Mista Import",
    tagline: "Voci, storie e attualita del territorio in forma diretta.",
    cat: "Lifestyle",
    cover: "",
    sourceUrl: source("grigliata-mista-import"),
    rssUrl: feed("grigliata-mista-import"),
    publishedEpisodes: 5,
    episodes: [],
  },
  tedx: {
    slug: "tedx",
    name: "TedX",
    tagline: "Idee e protagonisti collegati al mondo TEDx nel territorio.",
    cat: "Cultura",
    cover: "",
    sourceUrl: source("tedx"),
    rssUrl: feed("tedx"),
    publishedEpisodes: 4,
    episodes: [],
  },
  "grigliata-mista": {
    slug: "grigliata-mista",
    name: "Grigliata Mista",
    tagline: "Attualita, associazioni e storie locali raccontate senza filtri.",
    cat: "Lifestyle",
    cover: "",
    sourceUrl: source("grigliata-mista"),
    rssUrl: feed("grigliata-mista"),
    publishedEpisodes: 3,
    episodes: [],
  },
  "im-weekend-import": {
    slug: "im-weekend-import",
    name: "IM WEEKEND import",
    tagline: "Eventi, serate e idee per vivere il weekend nel territorio.",
    cat: "Weekend",
    cover: "",
    sourceUrl: source("im-weekend-import"),
    rssUrl: feed("im-weekend-import"),
    publishedEpisodes: 3,
    episodes: [],
  },
  assaggi: {
    slug: "assaggi",
    name: "Assaggi",
    tagline: "Cibo, vino, produttori e percorsi del gusto.",
    cat: "Cibo",
    cover: "",
    sourceUrl: source("assaggi"),
    rssUrl: feed("assaggi"),
    publishedEpisodes: 2,
    episodes: [],
  },
  "schema-libero-import": {
    slug: "schema-libero-import",
    name: "Schema Libero Import",
    tagline: "Sport, campi e protagonisti raccontati dal territorio.",
    cat: "Lifestyle",
    cover: "",
    sourceUrl: source("schema-libero-import"),
    rssUrl: feed("schema-libero-import"),
    publishedEpisodes: 2,
    episodes: [],
  },
  imweekend: {
    slug: "imweekend",
    name: "IMWEEKEND",
    tagline: "Agenda e racconti per il fine settimana IMLAND.",
    cat: "Weekend",
    cover: "",
    sourceUrl: source("imweekend"),
    rssUrl: feed("imweekend"),
    publishedEpisodes: 1,
    episodes: [],
  },
  "schema-libero": {
    slug: "schema-libero",
    name: "Schema Libero",
    tagline: "Il territorio visto dal bordo campo.",
    cat: "Lifestyle",
    cover: "",
    sourceUrl: source("schema-libero"),
    rssUrl: feed("schema-libero"),
    publishedEpisodes: 1,
    episodes: [],
  },
  speciali: {
    slug: "speciali",
    name: "Speciali",
    tagline: "Puntate speciali, dirette ed eventi raccontati da IMLAND.",
    cat: "Cultura",
    cover: "",
    sourceUrl: source("speciali"),
    rssUrl: feed("speciali"),
    publishedEpisodes: 1,
    episodes: [],
  },
};

export const podcastProgramList: PodcastProgram[] = Object.values(podcastPrograms);
