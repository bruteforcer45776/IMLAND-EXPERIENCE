import { supabase } from "@/integrations/supabase/client";
import type { Database } from "@/integrations/supabase/types";

/**
 * Collegamenti tra i contenuti dell'Hub.
 *
 * Un'informazione entra una sola volta e viene collegata dove serve: una
 * segnalazione può diventare un luogo, un'opportunità, una notizia, un evento
 * o una storia da ascoltare, e ogni passaggio resta tracciato.
 */

export type ContentKind = Database["public"]["Enums"]["content_kind"];
export type ContentRelation = Database["public"]["Tables"]["content_relations"]["Row"];

export const CONTENT_KIND_LABEL: Record<ContentKind, string> = {
  alert: "Segnalazione",
  place: "Luogo",
  job: "Opportunità",
  event: "Evento",
  news: "Notizia",
  radio_program: "Programma radio",
  radio_episode: "Puntata radio",
  podcast: "Podcast",
  podcast_episode: "Puntata podcast",
  organization: "Realtà",
  review: "Recensione",
};

/** Contenuti collegati a un contenuto, in entrambe le direzioni. */
export async function fetchRelations(kind: ContentKind, id: string) {
  const [outgoing, incoming] = await Promise.all([
    supabase.from("content_relations").select("*").eq("source_kind", kind).eq("source_id", id),
    supabase.from("content_relations").select("*").eq("target_kind", kind).eq("target_id", id),
  ]);
  if (outgoing.error) throw outgoing.error;
  if (incoming.error) throw incoming.error;

  return [
    ...(outgoing.data ?? []).map((r) => ({
      kind: r.target_kind,
      id: r.target_id,
      relation: r.relation,
    })),
    ...(incoming.data ?? []).map((r) => ({
      kind: r.source_kind,
      id: r.source_id,
      relation: r.relation,
    })),
  ];
}

/** Percorso pubblico di un contenuto collegato, quando esiste una pagina. */
export function relationHref(kind: ContentKind, id: string): string | null {
  switch (kind) {
    case "place":
      return `/terrain/${id}`;
    case "job":
      return `/jobs/${id}`;
    case "event":
      return `/eventi/${id}`;
    case "news":
      return `/news/${id}`;
    case "podcast":
    case "radio_program":
      return `/podcast/${id}`;
    case "radio_episode":
      return "/radio";
    case "alert":
      return "/alert/stato";
    default:
      return null;
  }
}

/** Un contenuto collegato, già pronto da mostrare. */
export type RelatedItem = {
  kind: ContentKind;
  id: string;
  relation: string;
  title: string;
  href: string | null;
};

const TONE_BY_KIND: Record<string, string> = {
  place: "terrain",
  job: "jobs",
  alert: "alert",
  news: "news",
  event: "eventi",
};

/** Tono colore di sezione per un contenuto collegato. */
export function relationTone(kind: ContentKind): string {
  return TONE_BY_KIND[kind] ?? "podcast";
}

type RawRelation = { kind: ContentKind; id: string; relation: string };

/**
 * Recupera titoli e percorsi pubblici dei contenuti collegati.
 * I contenuti non ancora pubblici restano fuori: le regole di accesso del
 * database non li restituiscono e vengono semplicemente ignorati.
 */
export async function resolveRelated(raw: RawRelation[]): Promise<RelatedItem[]> {
  const ids = (kind: ContentKind) =>
    Array.from(new Set(raw.filter((r) => r.kind === kind).map((r) => r.id)));

  const placeIds = ids("place");
  const jobIds = ids("job");
  const newsIds = ids("news");
  const eventIds = ids("event");

  const [places, jobs, news, events] = await Promise.all([
    placeIds.length
      ? supabase.from("terrain_places").select("id, name, slug").in("id", placeIds)
      : Promise.resolve({ data: [], error: null } as const),
    jobIds.length
      ? supabase.from("job_posts").select("id, title, slug").in("id", jobIds)
      : Promise.resolve({ data: [], error: null } as const),
    newsIds.length
      ? supabase.from("news_articles").select("id, title, slug").in("id", newsIds)
      : Promise.resolve({ data: [], error: null } as const),
    eventIds.length
      ? supabase.from("member_events").select("id, title").in("id", eventIds)
      : Promise.resolve({ data: [], error: null } as const),
  ]);

  const map = new Map<string, { title: string; href: string | null }>();
  for (const p of places.data ?? [])
    map.set(`place:${p.id}`, { title: p.name, href: `/terrain/${p.slug}` });
  for (const j of jobs.data ?? [])
    map.set(`job:${j.id}`, { title: j.title, href: `/jobs/${j.slug}` });
  for (const n of news.data ?? [])
    map.set(`news:${n.id}`, { title: n.title, href: `/news/${n.slug}` });
  for (const e of events.data ?? []) map.set(`event:${e.id}`, { title: e.title, href: "/eventi" });

  const seen = new Set<string>();
  const out: RelatedItem[] = [];
  for (const r of raw) {
    const key = `${r.kind}:${r.id}`;
    if (seen.has(key)) continue;
    const found = map.get(key);
    if (!found) continue;
    seen.add(key);
    out.push({
      kind: r.kind,
      id: r.id,
      relation: r.relation,
      title: found.title,
      href: found.href,
    });
  }
  return out;
}
