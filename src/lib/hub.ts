/**
 * Costanti e utilità condivise dei tre servizi operativi dell'Hub IMLAND:
 * TERRAIN (luoghi), JOBS (opportunità) e ALERT (segnalazioni).
 * Un solo sistema di utenti, categorie e stati per tutti e tre.
 */

export const HUB_PROVINCES = ["Vercelli", "Novara", "Biella", "Verbano-Cusio-Ossola"] as const;

export const HUB_COMUNI = [
  "Vercelli",
  "Borgosesia",
  "Gattinara",
  "Santhià",
  "Crescentino",
  "Trino",
  "Varallo",
  "Serravalle Sesia",
  "Novara",
  "Borgomanero",
  "Arona",
  "Trecate",
  "Galliate",
  "Oleggio",
  "Biella",
  "Cossato",
  "Vigliano Biellese",
  "Candelo",
  "Trivero",
  "Verbania",
  "Domodossola",
  "Omegna",
  "Stresa",
  "Cannobio",
] as const;

export const TERRAIN_CATEGORIES = [
  "Negozi e attività",
  "Ristoranti e locali",
  "Aziende e professionisti",
  "Associazioni",
  "Luoghi culturali",
  "Sport e benessere",
  "Servizi al cittadino",
] as const;

export const JOB_SECTORS = [
  "Industria e produzione",
  "Commercio e vendita",
  "Ristorazione e turismo",
  "Edilizia e impianti",
  "Logistica e trasporti",
  "Sanità e assistenza",
  "Ufficio e amministrazione",
  "Informatica e digitale",
  "Formazione e tirocini",
  "Agricoltura",
] as const;

export const JOB_CONTRACTS = [
  "Tempo indeterminato",
  "Tempo determinato",
  "Apprendistato",
  "Stage o tirocinio",
  "Part-time",
  "Stagionale",
  "Collaborazione",
] as const;

export const ALERT_CATEGORIES = [
  "Notizia dal territorio",
  "Evento o iniziativa",
  "Nuova attività",
  "Offerta o promozione",
  "Problema o disservizio",
  "Rettifica di un contenuto",
] as const;

/** Stati condivisi delle schede e degli annunci. */
export const HUB_STATUS_LABEL: Record<string, string> = {
  pending: "In revisione",
  published: "Pubblicato",
  rejected: "Non approvato",
  suspended: "Sospeso",
  archived: "Archiviato",
};

/** Stati di una segnalazione ALERT, dal più iniziale al finale. */
export const ALERT_STATUS_LABEL: Record<string, string> = {
  received: "Ricevuta",
  in_review: "In verifica",
  verified: "Verificata",
  published: "Pubblicata",
  rejected: "Non pubblicata",
  closed: "Chiusa",
};

export const ALERT_STATUS_DESC: Record<string, string> = {
  received: "Abbiamo ricevuto la tua segnalazione ed è in attesa di essere presa in carico.",
  in_review: "La redazione sta verificando le informazioni che ci hai inviato.",
  verified: "Le informazioni sono state verificate: stiamo decidendo dove pubblicarle.",
  published: "La segnalazione è diventata un contenuto pubblico del territorio.",
  rejected: "Non abbiamo potuto pubblicare la segnalazione. Puoi inviarne una nuova con più dettagli.",
  closed: "La segnalazione è stata chiusa: non sono previsti altri aggiornamenti.",
};

export function slugify(value: string): string {
  return value
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 60);
}

export function uniqueSlug(value: string): string {
  const base = slugify(value) || "scheda";
  return `${base}-${Math.random().toString(36).slice(2, 7)}`;
}

/** Distanza in km tra due coordinate (formula dell'emisfero). */
export function distanceKm(
  a: { lat: number; lon: number },
  b: { lat: number; lon: number },
): number {
  const R = 6371;
  const dLat = ((b.lat - a.lat) * Math.PI) / 180;
  const dLon = ((b.lon - a.lon) * Math.PI) / 180;
  const lat1 = (a.lat * Math.PI) / 180;
  const lat2 = (b.lat * Math.PI) / 180;
  const h =
    Math.sin(dLat / 2) ** 2 + Math.cos(lat1) * Math.cos(lat2) * Math.sin(dLon / 2) ** 2;
  return 2 * R * Math.asin(Math.sqrt(h));
}

export function formatHubDate(value: string | null | undefined): string {
  if (!value) return "—";
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return "—";
  return d.toLocaleDateString("it-IT", { day: "2-digit", month: "long", year: "numeric" });
}

export function mapsUrl(place: { address?: string | null; comune: string; name: string }): string {
  const query = [place.name, place.address, place.comune].filter(Boolean).join(", ");
  return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(query)}`;
}
