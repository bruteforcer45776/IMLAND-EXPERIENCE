export const eventTerritories = ["Vercelli", "Novara", "Biella", "Verbania"] as const;
export const eventCategories = ["Fiera", "Concerto", "Evento aziendale", "Community"] as const;

export type EventTerritory = (typeof eventTerritories)[number];
export type EventCategory = (typeof eventCategories)[number];

export type ImlandEvent = {
  slug: string;
  title: string;
  summary: string;
  /** ISO date, es. "2026-09-20T18:00:00+02:00" */
  start: string;
  /** ISO date di fine (opzionale) */
  end?: string;
  place: string;
  territory: EventTerritory;
  category: EventCategory;
  /** Programma della serata */
  program?: { time: string; label: string }[];
  organizers?: string[];
  /** Cross-link: podcast o news di racconto */
  related?: { label: string; to: string }[];
};

/**
 * Calendario eventi IMLAND.
 * Fonte unica per home, pagina eventi, dettaglio evento e ricerca globale:
 * aggiungendo qui una data, compare automaticamente in tutte le sezioni.
 * Vuoto = le pagine mostrano l'empty state curato, senza date inventate.
 */
export const imlandEvents: ImlandEvent[] = [];

const time = (e: ImlandEvent) => new Date(e.end ?? e.start).getTime();

export const upcomingEvents = imlandEvents
  .filter((e) => time(e) >= Date.now())
  .sort((a, b) => time(a) - time(b));

export const pastEvents = imlandEvents
  .filter((e) => time(e) < Date.now())
  .sort((a, b) => time(b) - time(a));

export const nextEvent: ImlandEvent | undefined = upcomingEvents[0];

export const findEvent = (slug: string) => imlandEvents.find((e) => e.slug === slug);

export function formatEventDate(iso: string) {
  return new Date(iso).toLocaleDateString("it-IT", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

export function formatEventTime(iso: string) {
  return new Date(iso).toLocaleTimeString("it-IT", { hour: "2-digit", minute: "2-digit" });
}

/** Link "Aggiungi al calendario" (Google Calendar). */
export function googleCalendarUrl(e: ImlandEvent) {
  const fmt = (iso: string) => new Date(iso).toISOString().replace(/[-:]|\.\d{3}/g, "");
  const end = e.end ?? new Date(new Date(e.start).getTime() + 2 * 3600_000).toISOString();
  const params = new URLSearchParams({
    action: "TEMPLATE",
    text: e.title,
    details: e.summary,
    location: `${e.place}, ${e.territory}`,
    dates: `${fmt(e.start)}/${fmt(end)}`,
  });
  return `https://calendar.google.com/calendar/render?${params.toString()}`;
}
