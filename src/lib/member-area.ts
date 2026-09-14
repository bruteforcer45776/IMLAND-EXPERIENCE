export const PROVINCES = ["Vercelli", "Novara", "Biella", "Verbania"] as const;

export const INTERESTS = [
  "Musica",
  "Eventi",
  "Food",
  "Cultura",
  "Sport",
  "Podcast",
  "Nightlife",
  "Business",
  "Territorio",
] as const;

export const DISCOVERY_CATEGORIES = [
  "Eventi",
  "Attività convenzionate",
  "Locali",
  "Ristoranti",
  "Esperienze",
  "Cultura",
  "Musica",
  "Sport",
  "Luoghi",
  "Iniziative",
] as const;

export const PREVIEW_TYPES = [
  "Progetto",
  "Evento",
  "Podcast",
  "Intervista",
  "Programma Radio",
  "Video",
  "News",
  "Annuncio",
  "Collaborazione",
  "Contenuto esclusivo",
] as const;

export const BENEFIT_TYPES = [
  "Sconto",
  "Drink gratuito",
  "Ingresso ridotto",
  "2x1",
  "Sconto su servizio",
  "Accesso prioritario",
  "Promozione esclusiva IMLAND",
] as const;

export const EXCLUSIVE_TYPES = [
  "Podcast",
  "Puntata anticipata",
  "Intervista",
  "Video backstage",
  "Dietro le quinte",
  "Gallery",
  "News riservata",
  "Download",
  "Comunicazione",
] as const;

export const NOTIF_TYPES = [
  "Nuovo vantaggio",
  "Nuova anticipazione",
  "Nuovo evento",
  "Apertura prenotazioni",
  "Contenuto esclusivo",
  "Scadenza vantaggio",
  "Comunicazione",
] as const;

export const FAVORITE_TYPES = [
  "evento",
  "vantaggio",
  "podcast",
  "contenuto",
  "esperienza",
  "attività",
] as const;

export function formatDate(value?: string | null) {
  if (!value) return "—";
  return new Date(value).toLocaleDateString("it-IT", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  });
}

export function formatDateTime(value?: string | null) {
  if (!value) return "—";
  return new Date(value).toLocaleString("it-IT", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export function fullName(p?: { first_name?: string | null; last_name?: string | null } | null) {
  if (!p) return "Member";
  const name = `${p.first_name ?? ""} ${p.last_name ?? ""}`.trim();
  return name.length > 0 ? name : "Member";
}

export function isExpired(value?: string | null) {
  if (!value) return false;
  return new Date(value).getTime() < Date.now();
}
