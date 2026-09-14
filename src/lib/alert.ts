/**
 * ALERT — la porta d'ingresso dell'Hub territoriale.
 *
 * Qui vivono le regole del flusso: le tipologie di segnalazione con i loro
 * campi specifici, gli stati che una segnalazione attraversa, i controlli
 * automatici prima dell'invio e i contenuti in cui può essere trasformata.
 * Una informazione entra una sola volta e poi viene distribuita dove serve.
 */

import type { Database } from "@/integrations/supabase/types";

export type AlertState = Database["public"]["Enums"]["alert_state"];

/* ------------------------------- STATI -------------------------------- */

export const ALERT_STATE_LABEL: Record<AlertState, string> = {
  draft: "Bozza",
  submitted: "Inviata",
  analyzing: "In analisi",
  needs_review: "In verifica",
  needs_information: "Servono informazioni",
  approved: "Verificata",
  transformed: "Diventata contenuto",
  published: "Pubblicata",
  rejected: "Non pubblicata",
  archived: "Archiviata",
};

export const ALERT_STATE_DESC: Record<AlertState, string> = {
  draft: "La tua segnalazione è salvata ma non è ancora arrivata alla redazione.",
  submitted: "Abbiamo ricevuto la segnalazione ed è in attesa di essere presa in carico.",
  analyzing: "Stiamo leggendo la segnalazione e raccogliendo i primi riscontri.",
  needs_review: "La redazione sta verificando le informazioni con le fonti disponibili.",
  needs_information: "Ci serve un dettaglio in più per procedere: puoi completare la segnalazione.",
  approved: "Le informazioni sono verificate: stiamo scegliendo dove pubblicarle.",
  transformed: "Dalla tua segnalazione è nato un contenuto del territorio.",
  published: "La segnalazione è diventata un contenuto pubblico.",
  rejected: "Non abbiamo potuto pubblicarla. Puoi inviarne una nuova con più dettagli.",
  archived: "La segnalazione è stata archiviata: resta conservata, senza altri aggiornamenti.",
};

/** Percorso tipico mostrato alle persone nella pagina di stato. */
export const ALERT_STATE_FLOW: AlertState[] = [
  "submitted",
  "analyzing",
  "needs_review",
  "approved",
  "published",
];

/** Stati che la redazione può assegnare a mano. */
export const ALERT_ADMIN_STATES: AlertState[] = [
  "submitted",
  "analyzing",
  "needs_review",
  "needs_information",
  "approved",
  "transformed",
  "published",
  "rejected",
  "archived",
];

/** Stato testuale storico mantenuto in `status`, per non rompere i dati esistenti. */
export const ALERT_STATE_STATUS: Record<AlertState, string> = {
  draft: "draft",
  submitted: "received",
  analyzing: "in_review",
  needs_review: "in_review",
  needs_information: "in_review",
  approved: "verified",
  transformed: "verified",
  published: "published",
  rejected: "rejected",
  archived: "closed",
};

export function isOpenState(state: AlertState): boolean {
  return !["published", "rejected", "archived"].includes(state);
}

/* ----------------------------- TIPOLOGIE ------------------------------ */

export type AlertFieldKind = "text" | "textarea" | "date" | "time" | "url" | "email" | "tel";

export type AlertField = {
  name: string;
  label: string;
  kind: AlertFieldKind;
  required?: boolean;
  help?: string;
};

/** Campi aggiuntivi per tipologia, salvati in `payload`. */
export const ALERT_TYPE_FIELDS: Record<string, AlertField[]> = {
  evento: [
    { name: "data", label: "Data", kind: "date", required: true },
    { name: "orario", label: "Orario", kind: "time" },
    { name: "luogo", label: "Dove si svolge", kind: "text", required: true },
    { name: "ingresso", label: "Ingresso o costo", kind: "text" },
    { name: "organizzatore", label: "Chi organizza", kind: "text" },
    { name: "riferimento", label: "Pagina o sito dell'evento", kind: "url" },
  ],
  "nuova-attivita": [
    { name: "nome", label: "Nome dell'attività", kind: "text", required: true },
    { name: "indirizzo", label: "Indirizzo", kind: "text", required: true },
    { name: "settore", label: "Che tipo di attività è", kind: "text" },
    { name: "apertura", label: "Data di apertura", kind: "date" },
    { name: "telefono", label: "Telefono", kind: "tel" },
    { name: "riferimento", label: "Sito o pagina social", kind: "url" },
  ],
  luogo: [
    { name: "nome", label: "Nome del luogo", kind: "text", required: true },
    { name: "indirizzo", label: "Indirizzo o come arrivare", kind: "text" },
    { name: "perche", label: "Perché merita di essere conosciuto", kind: "textarea" },
  ],
  "offerta-lavoro": [
    { name: "ruolo", label: "Ruolo ricercato", kind: "text", required: true },
    { name: "azienda", label: "Azienda", kind: "text", required: true },
    { name: "contratto", label: "Tipo di contratto", kind: "text" },
    { name: "candidature", label: "Email per candidarsi", kind: "email" },
  ],
  opportunita: [
    { name: "tipo", label: "Di che opportunità si tratta", kind: "text", required: true },
    { name: "scadenza", label: "Scadenza", kind: "date" },
    { name: "riferimento", label: "Link di riferimento", kind: "url" },
  ],
  problema: [
    { name: "dove", label: "Dove si trova il problema", kind: "text", required: true },
    { name: "da_quando", label: "Da quando", kind: "text" },
  ],
  "informazione-errata": [
    { name: "riferimento", label: "Link del contenuto da correggere", kind: "url", required: true },
    { name: "correzione", label: "Qual è l'informazione corretta", kind: "textarea", required: true },
  ],
  storia: [
    { name: "protagonista", label: "Chi è il protagonista", kind: "text", required: true },
    { name: "perche", label: "Perché è una storia da raccontare", kind: "textarea" },
  ],
  personaggio: [
    { name: "protagonista", label: "Di chi si tratta", kind: "text", required: true },
    { name: "perche", label: "Perché merita spazio", kind: "textarea" },
  ],
  "aggiornamento-attivita": [
    { name: "nome", label: "Nome dell'attività", kind: "text", required: true },
    { name: "cosa_cambia", label: "Cosa è cambiato", kind: "textarea", required: true },
  ],
  comunicato: [
    { name: "organizzazione", label: "Chi lo diffonde", kind: "text", required: true },
    { name: "riferimento", label: "Link al comunicato", kind: "url" },
  ],
  "proposta-news": [{ name: "riferimento", label: "Materiali o link utili", kind: "url" }],
  "proposta-radio": [
    { name: "referente", label: "Referente da contattare", kind: "text", required: true },
    { name: "riferimento", label: "Materiali o link utili", kind: "url" },
  ],
  "proposta-podcast": [
    { name: "referente", label: "Referente da contattare", kind: "text", required: true },
    { name: "riferimento", label: "Materiali o link utili", kind: "url" },
  ],
  collaborazione: [
    { name: "referente", label: "Referente", kind: "text", required: true },
    { name: "proposta", label: "Cosa proponi", kind: "textarea", required: true },
  ],
  assistenza: [{ name: "riferimento", label: "Riferimento o codice", kind: "text" }],
  notizia: [{ name: "riferimento", label: "Fonte o link utile", kind: "url" }],
  altro: [],
};

export function fieldsForType(slug: string | null | undefined): AlertField[] {
  if (!slug) return [];
  return ALERT_TYPE_FIELDS[slug] ?? [];
}

/* --------------------------- TRASFORMAZIONI --------------------------- */

export type TransformTarget = "place" | "job" | "event" | "news";

export const TRANSFORM_LABEL: Record<TransformTarget, string> = {
  place: "Luogo su TERRAIN",
  job: "Opportunità su JOBS",
  event: "Evento",
  news: "Notizia",
};

/** Destinazioni suggerite in base alla tipologia della segnalazione. */
export const TRANSFORM_SUGGESTIONS: Record<string, TransformTarget[]> = {
  evento: ["event", "news"],
  "nuova-attivita": ["place", "news"],
  luogo: ["place"],
  "offerta-lavoro": ["job"],
  opportunita: ["job", "news"],
  notizia: ["news"],
  storia: ["news"],
  personaggio: ["news"],
  comunicato: ["news"],
  "proposta-news": ["news"],
  problema: ["news"],
  "aggiornamento-attivita": ["place", "news"],
};

export function suggestedTargets(slug: string | null | undefined): TransformTarget[] {
  if (!slug) return ["news"];
  return TRANSFORM_SUGGESTIONS[slug] ?? ["news"];
}

/* -------------------------- CONTROLLI AUTOMATICI ---------------------- */

export type AlertCheck = { level: "error" | "warning"; message: string };

const SENSITIVE_WORDS = [
  "denuncia",
  "arrestato",
  "arrestata",
  "indagato",
  "indagata",
  "processo",
  "truffa",
  "violenza",
  "morto",
  "morta",
  "incidente mortale",
];

export type AlertDraftInput = {
  alertType: string;
  title: string;
  body: string;
  comune: string;
  province?: string | null;
  contactEmail?: string | null;
  payload?: Record<string, string>;
};

/**
 * Controlli automatici eseguiti prima dell'invio: bloccano gli errori veri
 * e segnalano ciò che rischia di rallentare la verifica della redazione.
 */
export function runAlertChecks(draft: AlertDraftInput): AlertCheck[] {
  const checks: AlertCheck[] = [];
  const title = draft.title.trim();
  const body = draft.body.trim();

  if (!draft.alertType) checks.push({ level: "error", message: "Scegli di cosa si tratta." });
  if (title.length < 5) checks.push({ level: "error", message: "Il titolo deve avere almeno 5 caratteri." });
  if (body.length < 20) checks.push({ level: "error", message: "Racconta cosa accade con almeno 20 caratteri." });
  if (!draft.comune) checks.push({ level: "error", message: "Indica il Comune a cui si riferisce." });

  for (const field of fieldsForType(draft.alertType)) {
    if (field.required && !(draft.payload?.[field.name] ?? "").trim()) {
      checks.push({ level: "error", message: `Compila il campo “${field.label}”.` });
    }
  }

  const letters = title.replace(/[^A-Za-zÀ-ÿ]/g, "");
  if (letters.length > 6 && letters === letters.toUpperCase()) {
    checks.push({ level: "warning", message: "Il titolo è tutto in maiuscolo: scrivilo in forma normale." });
  }
  if (/!{2,}|\?{2,}/.test(title)) {
    checks.push({ level: "warning", message: "Togli i punti esclamativi ripetuti dal titolo." });
  }
  if (body.length < 120) {
    checks.push({ level: "warning", message: "Più dettagli rendono la verifica più rapida." });
  }
  if (!draft.contactEmail) {
    checks.push({ level: "warning", message: "Senza un'email non possiamo ricontattarti per un chiarimento." });
  }
  const lower = `${title} ${body}`.toLowerCase();
  if (SENSITIVE_WORDS.some((w) => lower.includes(w))) {
    checks.push({
      level: "warning",
      message: "Il tema è delicato: verrà valutato da una persona della redazione prima di ogni pubblicazione.",
    });
  }
  return checks;
}

export function hasBlockingChecks(checks: AlertCheck[]): boolean {
  return checks.some((c) => c.level === "error");
}
