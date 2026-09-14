import { programs, allEpisodes } from "./podcast-derived";
import { partnerLogos } from "./partner-logos";
import { upcomingEvents, pastEvents } from "./events";

export type SearchKind = "podcast" | "episodio" | "evento" | "partner" | "pagina";

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
};

const pages: SearchItem[] = [
  { kind: "pagina", title: "Radio", subtitle: "La diretta 24 ore su 24, palinsesto e conduttori.", to: "/radio" },
  { kind: "pagina", title: "Podcast", subtitle: "Tutti i canali e gli episodi on demand.", to: "/podcast" },
  { kind: "pagina", title: "Eventi", subtitle: "Calendario, format e radio in piazza.", to: "/eventi" },
  { kind: "pagina", title: "News", subtitle: "Le notizie del territorio, aggiornate ogni giorno.", to: "/news" },
  { kind: "pagina", title: "Membri ufficiali", subtitle: "Vantaggi, pacchetti e aziende partner.", to: "/member" },
  { kind: "pagina", title: "Chi siamo", subtitle: "Manifesto, storia e team di IMLAND Experience.", to: "/chi-siamo" },
  { kind: "pagina", title: "Contatti", subtitle: "Scrivici, chiamaci o proponi una collaborazione.", to: "/contatti" },
  { kind: "pagina", title: "FAQ", subtitle: "Le risposte alle domande più frequenti.", to: "/faq" },
  { kind: "pagina", title: "Scarica l'app", subtitle: "Ascolta IMLAND Radio da smartphone e smart speaker.", to: "/scarica-app" },
  { kind: "pagina", title: "Brand e loghi", subtitle: "Linee guida, colori e asset ufficiali.", to: "/brand" },
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
  ...allEpisodes.slice(0, 160).map<SearchItem>(({ ep, program }) => ({
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
];

const normalize = (s: string) =>
  s
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "");

/** Ricerca globale su tutti i contenuti: podcast, episodi, eventi, partner, pagine. */
export function searchAll(query: string, limit = 40): SearchItem[] {
  const q = normalize(query.trim());
  if (q.length < 2) return [];
  const terms = q.split(/\s+/);
  const scored: { item: SearchItem; score: number }[] = [];

  for (const item of searchIndex) {
    const title = normalize(item.title);
    const haystack = normalize(`${item.title} ${item.subtitle} ${item.meta ?? ""}`);
    if (!terms.every((t) => haystack.includes(t))) continue;
    let score = 0;
    if (title.startsWith(q)) score += 6;
    if (title.includes(q)) score += 3;
    if (item.kind === "pagina") score += 2;
    if (item.kind === "podcast" || item.kind === "evento") score += 1;
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
  partner: "Azienda partner",
  pagina: "Sezione",
};
