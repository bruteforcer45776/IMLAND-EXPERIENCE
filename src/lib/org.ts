import type { Database } from "@/integrations/supabase/types";

/**
 * Identità unica delle realtà del territorio.
 *
 * Un'attività, un'associazione o un ente esiste una sola volta come
 * organizzazione: schede TERRAIN, annunci JOBS, eventi, recensioni e proposte
 * editoriali si collegano a quella stessa identità, senza duplicare i dati.
 */

export type OrgKind = Database["public"]["Enums"]["org_kind"];
export type OrgStatus = Database["public"]["Enums"]["org_status"];
export type OrgMemberRole = Database["public"]["Enums"]["org_member_role"];
export type Organization = Database["public"]["Tables"]["organizations"]["Row"];
export type OrganizationUser = Database["public"]["Tables"]["organization_users"]["Row"];

export const ORG_KINDS: { value: OrgKind; label: string }[] = [
  { value: "azienda", label: "Azienda" },
  { value: "associazione", label: "Associazione" },
  { value: "ente", label: "Ente o Comune" },
  { value: "organizzatore", label: "Organizzatore di eventi" },
  { value: "professionista", label: "Professionista" },
  { value: "altro", label: "Altro" },
];

export const ORG_STATUS_LABEL: Record<OrgStatus, string> = {
  draft: "Bozza",
  email_verification: "Verifica email",
  org_verification: "Verifica in corso",
  approved: "Verificata",
  limited: "Limitata",
  suspended: "Sospesa",
  archived: "Archiviata",
};

export const ORG_ROLE_LABEL: Record<OrgMemberRole, string> = {
  owner: "Proprietario",
  org_admin: "Amministratore",
  editor: "Editor",
  recruiter: "Recruiter",
  events: "Gestore eventi",
  analyst: "Analista",
  viewer: "Sola lettura",
};

/** Cosa può fare ogni ruolo aziendale. Le regole sono replicate anche in RLS. */
export type OrgAbility =
  | "manage_org"
  | "manage_team"
  | "manage_place"
  | "manage_jobs"
  | "manage_events"
  | "answer_reviews"
  | "view_stats"
  | "submit_alert";

const ABILITIES: Record<OrgMemberRole, OrgAbility[]> = {
  owner: [
    "manage_org",
    "manage_team",
    "manage_place",
    "manage_jobs",
    "manage_events",
    "answer_reviews",
    "view_stats",
    "submit_alert",
  ],
  org_admin: [
    "manage_org",
    "manage_team",
    "manage_place",
    "manage_jobs",
    "manage_events",
    "answer_reviews",
    "view_stats",
    "submit_alert",
  ],
  editor: ["manage_place", "answer_reviews", "view_stats", "submit_alert"],
  recruiter: ["manage_jobs", "view_stats", "submit_alert"],
  events: ["manage_events", "view_stats", "submit_alert"],
  analyst: ["view_stats"],
  viewer: [],
};

export function can(role: OrgMemberRole | null | undefined, ability: OrgAbility): boolean {
  if (!role) return false;
  return ABILITIES[role].includes(ability);
}

/** Un'organizzazione può pubblicare contenuti operativi solo se verificata. */
export function canPublish(org: Pick<Organization, "status"> | null | undefined): boolean {
  return org?.status === "approved";
}

export function orgSlug(name: string): string {
  const base = name
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 60);
  const suffix = Math.random().toString(36).slice(2, 6);
  return `${base || "organizzazione"}-${suffix}`;
}
