import { programs, allEpisodes } from "./podcast-derived";
import { partnerLogos } from "./partner-logos";
import { upcomingEvents, pastEvents } from "./events";
import { curatedNews } from "./curated-news";
import { memberWall } from "../routes/member";

export type SearchKind =
  "podcast" | "episodio" | "evento" | "news" | "member" | "luogo" | "lavoro" | "partner" | "pagina";

export type SearchItem = {
  kind: SearchKind;
  title: string;
  subtitle: string;
  /** Etichetta breve (categoria, territorio, canale…) */
  meta?: string;
  /** Link interno statico (es. "/radio") */
  to?: string;
  /** Link interno dinamico */
  route?: { path: "podcast" | "episodio" | "evento"; slug: string; episode?: string };
  /** Link esterno (partner) */
  href?: string | null;
  tags?: string[];
};

const pages: SearchItem[] = [
  {
    kind: "pagina",
    title: "Radio",
    subtitle: "La diretta 24 ore su 24, palinsesto e conduttori.",
    to: "/radio",
  },
  {
    kind: "pagina",
    title: "Offerte di lavoro",
    subtitle: "Opportunità professionali pubblicate dalle realtà del territorio.",
    to: "/jobs",
    tags: ["lavoro", "candidature", "aziende"],
  },
  {
    kind: "pagina",
    title: "Mappa del territorio",
    subtitle: "Luoghi, attività e segnalazioni verificate sul territorio.",
    to: "/terrain",
    tags: ["mappa", "attività", "luoghi", "territorio"],
  },
  {
    kind: "pagina",
    title: "Segnalazioni territoriali",
    subtitle: "Invia e consulta segnalazioni utili per la comunità.",
    to: "/alert",
    tags: ["segnalazioni", "territorio", "comunità"],
  },
  {
    kind: "pagina",
    title: "My Podcast",
    subtitle: "Produzione di podcast su misura per aziende e organizzazioni.",
    to: "/my-podcast",
    tags: ["produzione", "podcast", "aziende"],
  },
  {
    kind: "pagina",
    title: "Privacy Policy",
    subtitle: "Informazioni sul trattamento dei dati personali.",
    to: "/privacy",
  },
  {
    kind: "pagina",
    title: "Termini e condizioni",
    subtitle: "Condizioni di utilizzo dei servizi IMLAND Experience.",
    to: "/termini",
  },
  {
    kind: "pagina",
    title: "Cookie Policy",
    subtitle: "Informazioni sui cookie e gestione delle preferenze.",
    to: "/cookie",
  },
  {
    kind: "pagina",
    title: "Podcast",
    subtitle: "Tutti i canali e gli episodi on demand.",
    to: "/podcast",
  },
  {
    kind: "pagina",
    title: "Eventi",
    subtitle: "Calendario, format e radio in piazza.",
    to: "/eventi",
  },
  {
    kind: "pagina",
    title: "News",
    subtitle: "Le notizie del territorio, aggiornate ogni giorno.",
    to: "/news",
  },
  {
    kind: "pagina",
    title: "Membri ufficiali",
    subtitle: "Vantaggi, pacchetti e aziende partner.",
    to: "/member",
  },
  {
    kind: "pagina",
    title: "Chi siamo",
    subtitle: "Manifesto, storia e team di IMLAND Experience.",
    to: "/chi-siamo",
  },
  {
    kind: "pagina",
    title: "Contatti",
    subtitle: "Scrivici, chiamaci o proponi una collaborazione.",
    to: "/contatti",
  },
  { kind: "pagina", title: "FAQ", subtitle: "Le risposte alle domande più frequenti.", to: "/faq" },
  {
    kind: "pagina",
    title: "Scarica l'app",
    subtitle: "Ascolta IMLAND Radio da smartphone e smart speaker.",
    to: "/scarica-app",
  },
  {
    kind: "pagina",
    title: "Brand e loghi",
    subtitle: "Linee guida, colori e asset ufficiali.",
    to: "/brand",
  },
];

/** Indice unico di ricerca: podcast, episodi, eventi, partner e pagine. */
export const searchIndex: SearchItem[] = [
  ...pages,
  ...programs.map<SearchItem>((p) => ({
    kind: "podcast",
    title: p.name,
    subtitle: p.tagline,
    meta: p.cat,
    route: { path: "podcast", slug: p.slug },
  })),
  ...allEpisodes.map<SearchItem>(({ ep, program }) => ({
    kind: "episodio",
    title: ep.title,
    subtitle: ep.subtitle ?? program.tagline,
    meta: program.name,
    route: { path: "episodio", slug: program.slug, episode: ep.slug },
  })),
  ...[...upcomingEvents, ...pastEvents].map<SearchItem>((e) => ({
    kind: "evento",
    title: e.title,
    subtitle: e.summary,
    meta: `${e.territory} · ${e.category}`,
    route: { path: "evento", slug: e.slug },
  })),
  ...partnerLogos.map<SearchItem>((p) => ({
    kind: "partner",
    title: p.name,
    subtitle: "Azienda membro di IMLAND Experience.",
    meta: "Member",
    href: p.href ?? null,
  })),
  ...curatedNews.map<SearchItem>((article) => ({
    kind: "news",
    title: article.title,
    subtitle: article.summary,
    meta: `${article.source} · ${article.province} · ${article.category}`,
    href: article.url,
    tags: [article.province, article.category, article.source],
  })),
  ...memberWall.map<SearchItem>((member) => ({
    kind: "member",
    title: member.name,
    subtitle: member.desc,
    meta: `${member.category} · ${member.addresses.map((address) => `${address.label} ${address.address}`).join(" · ")}`,
    to: "/member",
    tags: [
      member.category,
      ...member.addresses.flatMap((address) => [address.label, address.address]),
    ],
  })),
];

const normalize = (s: string) =>
  s
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "");

const stopWords = new Set([
  "a",
  "al",
  "alla",
  "che",
  "chi",
  "come",
  "da",
  "di",
  "e",
  "gli",
  "il",
  "in",
  "la",
  "le",
  "mi",
  "ne",
  "per",
  "puoi",
  "serve",
  "sono",
  "su",
  "tra",
  "trova",
  "trovare",
  "un",
  "una",
  "uno",
  "vorrei",
]);

const memberAliases: Record<string, string[]> = {
  ristorante: ["ristorazione", "ristorante"],
  mangiare: ["ristorazione", "ristorante"],
  cena: ["ristorazione", "ristorante"],
  casa: ["immobiliare", "edilizia", "arredamento", "infissi", "tetti"],
  finestre: ["infissi", "serramenti"],
  serramenti: ["infissi", "serramenti"],
  tetto: ["tetti", "edilizia"],
  software: ["software", "tecnologia", "informatica"],
  informatica: ["software", "tecnologia", "informatica"],
  lavoro: ["hr", "lavoro"],
  ottico: ["ottica"],
  occhiali: ["ottica"],
  farmacia: ["parafarmacia", "salute"],
  benessere: ["wellness", "beauty", "salute"],
  auto: ["automotive", "ricambi"],
  macchina: ["automotive", "ricambi"],
  grafica: ["grafica", "stampa"],
  stampare: ["grafica", "stampa"],
  trasporto: ["logistica", "autotrasporti"],
  spedizione: ["logistica", "autotrasporti"],
  consulente: ["consulenza"],
  consulenza: ["consulenza"],
  evento: ["eventi", "musica", "live"],
  sport: ["sport", "padel"],
  arredare: ["arredamento", "design"],
  telefono: ["telecomunicazioni"],
};

function itemHaystack(item: SearchItem) {
  return normalize(
    `${item.title} ${item.subtitle} ${item.meta ?? ""} ${(item.tags ?? []).join(" ")}`,
  );
}

export function meaningfulTerms(query: string) {
  return normalize(query)
    .split(/[^a-z0-9]+/)
    .filter((term) => term.length > 2 && !stopWords.has(term));
}

export function searchByMeaningfulTerms(query: string, additions: SearchItem[] = [], limit = 8) {
  const terms = meaningfulTerms(query);
  if (!terms.length) return [];
  const scored = [...searchIndex, ...additions]
    .map((item) => {
      const haystack = itemHaystack(item);
      const score = terms.reduce((total, term) => total + (haystack.includes(term) ? 1 : 0), 0);
      return { item, score };
    })
    .filter(({ score }) => score > 0)
    .sort((a, b) => b.score - a.score);
  return scored.slice(0, limit).map(({ item }) => item);
}

export function recommendMembers(query: string, additions: SearchItem[] = [], limit = 3) {
  const rawTerms = meaningfulTerms(query);
  const terms = Array.from(new Set(rawTerms.flatMap((term) => memberAliases[term] ?? [term])));
  if (!terms.length) return [];
  return [...searchIndex, ...additions]
    .filter((item) => item.kind === "member" || item.kind === "luogo")
    .map((item) => {
      const haystack = itemHaystack(item);
      const score = terms.reduce((total, term) => total + (haystack.includes(term) ? 1 : 0), 0);
      return { item, score };
    })
    .filter(({ score }) => score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, limit)
    .map(({ item }) => item);
}

/** Ricerca globale su tutti i contenuti: podcast, episodi, eventi, partner, pagine. */
export function searchAll(query: string, limit = 40, additions: SearchItem[] = []): SearchItem[] {
  const q = normalize(query.trim());
  if (q.length < 2) return [];
  const terms = q.split(/\s+/);
  const scored: { item: SearchItem; score: number }[] = [];

  for (const item of [...searchIndex, ...additions]) {
    const title = normalize(item.title);
    const haystack = itemHaystack(item);
    if (!terms.every((t) => haystack.includes(t))) continue;
    let score = 0;
    if (title.startsWith(q)) score += 6;
    if (title.includes(q)) score += 3;
    if (item.kind === "pagina") score += 2;
    if (item.kind === "podcast" || item.kind === "evento" || item.kind === "member") score += 1;
    scored.push({ item, score });
  }

  return scored
    .sort((a, b) => b.score - a.score)
    .slice(0, limit)
    .map((s) => s.item);
}

export const searchKindLabel: Record<SearchKind, string> = {
  podcast: "Canale podcast",
  episodio: "Episodio",
  evento: "Evento",
  news: "Notizia",
  member: "Member sulla mappa",
  luogo: "Attività sulla mappa",
  lavoro: "Offerta di lavoro",
  partner: "Azienda partner",
  pagina: "Sezione",
};
