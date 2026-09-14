import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/use-auth";
import { notifyError } from "@/lib/errors";
import { orgSlug, type OrgKind, type OrgMemberRole, type Organization } from "@/lib/org";

/**
 * Accesso all'identità unica delle realtà del territorio.
 *
 * Le persone (ascoltatori) non usano questi dati: servono a chi gestisce
 * un'attività, un'associazione o un ente dentro l'Hub.
 */

export type OrgWithRole = Organization & { role: OrgMemberRole };

/** Organizzazioni su cui l'utente ha un ruolo, con il ruolo effettivo. */
export function useMyOrganizations() {
  const { user } = useAuth();

  return useQuery({
    queryKey: ["organizations", "mine", user?.id ?? "guest"],
    enabled: Boolean(user),
    queryFn: async (): Promise<OrgWithRole[]> => {
      const [owned, joined] = await Promise.all([
        supabase.from("organizations").select("*").eq("owner_id", user!.id),
        supabase
          .from("organization_users")
          .select("role, accepted_at, organizations(*)")
          .eq("user_id", user!.id)
          .not("accepted_at", "is", null),
      ]);
      if (owned.error) throw owned.error;
      if (joined.error) throw joined.error;

      const map = new Map<string, OrgWithRole>();
      for (const org of owned.data ?? []) map.set(org.id, { ...org, role: "owner" });
      for (const row of joined.data ?? []) {
        const org = row.organizations as Organization | null;
        if (org && !map.has(org.id)) map.set(org.id, { ...org, role: row.role });
      }
      return [...map.values()].sort((a, b) => a.name.localeCompare(b.name));
    },
  });
}

export function useOrganization(slug: string | undefined) {
  return useQuery({
    queryKey: ["organizations", "detail", slug ?? ""],
    enabled: Boolean(slug),
    queryFn: async () => {
      const { data, error } = await supabase
        .from("organizations")
        .select("*")
        .eq("slug", slug!)
        .maybeSingle();
      if (error) throw error;
      return data;
    },
  });
}

export type OrganizationDraft = {
  name: string;
  kind: OrgKind;
  vatNumber: string | null;
  taxCode: string | null;
  contactName: string | null;
  contactEmail: string | null;
  contactPhone: string | null;
  comune: string | null;
  province: string | null;
  address: string | null;
  website: string | null;
  description: string | null;
};

/** Apre un account organizzazione: parte in verifica, non pubblica nulla. */
export function useCreateOrganization() {
  const { user } = useAuth();
  const qc = useQueryClient();

  return useMutation({
    mutationFn: async (draft: OrganizationDraft) => {
      if (!user) throw new Error("Devi accedere per registrare la tua realtà.");
      const { data, error } = await supabase
        .from("organizations")
        .insert({
          owner_id: user.id,
          name: draft.name,
          slug: orgSlug(draft.name),
          kind: draft.kind,
          vat_number: draft.vatNumber,
          tax_code: draft.taxCode,
          contact_name: draft.contactName,
          contact_email: draft.contactEmail,
          contact_phone: draft.contactPhone,
          comune: draft.comune,
          province: draft.province,
          address: draft.address,
          website: draft.website,
          description: draft.description,
          status: "org_verification",
          terms_accepted_at: new Date().toISOString(),
        })
        .select("id, slug")
        .single();
      if (error) throw error;
      return data;
    },
    onSuccess: () => void qc.invalidateQueries({ queryKey: ["organizations"] }),
    onError: (error) =>
      notifyError(error, { fallback: "Non è stato possibile registrare la tua realtà." }),
  });
}

export function useUpdateOrganization(orgId: string | undefined) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (patch: Partial<Organization>) => {
      if (!orgId) throw new Error("Organizzazione non disponibile.");
      const { error } = await supabase.from("organizations").update(patch).eq("id", orgId);
      if (error) throw error;
    },
    onSuccess: () => void qc.invalidateQueries({ queryKey: ["organizations"] }),
    onError: (error) =>
      notifyError(error, { fallback: "Non è stato possibile aggiornare i dati." }),
  });
}

/** Collaboratori: inviti, ruoli e revoche. Solo proprietario e amministratore. */
export function useOrgTeam(orgId: string | undefined) {
  const qc = useQueryClient();

  const list = useQuery({
    queryKey: ["organizations", "team", orgId ?? ""],
    enabled: Boolean(orgId),
    queryFn: async () => {
      const { data, error } = await supabase
        .from("organization_users")
        .select("*")
        .eq("organization_id", orgId!)
        .order("created_at", { ascending: true });
      if (error) throw error;
      return data;
    },
  });

  const invalidate = () => void qc.invalidateQueries({ queryKey: ["organizations", "team"] });

  const invite = useMutation({
    mutationFn: async (input: { email: string; role: OrgMemberRole }) => {
      if (!orgId) throw new Error("Organizzazione non disponibile.");
      const { error } = await supabase.from("organization_users").insert({
        organization_id: orgId,
        invited_email: input.email.trim().toLowerCase(),
        role: input.role,
      });
      if (error) throw error;
    },
    onSuccess: invalidate,
    onError: (error) => notifyError(error, { fallback: "Invito non inviato." }),
  });

  const changeRole = useMutation({
    mutationFn: async (input: { id: string; role: OrgMemberRole }) => {
      const { error } = await supabase
        .from("organization_users")
        .update({ role: input.role })
        .eq("id", input.id);
      if (error) throw error;
    },
    onSuccess: invalidate,
    onError: (error) => notifyError(error, { fallback: "Ruolo non aggiornato." }),
  });

  const remove = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("organization_users").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: invalidate,
    onError: (error) => notifyError(error, { fallback: "Collaboratore non rimosso." }),
  });

  return { list, invite, changeRole, remove };
}

/** Richiesta di verifica dell'organizzazione, valutata dalla redazione. */
export function useRequestVerification(orgId: string | undefined) {
  const qc = useQueryClient();
  const { user } = useAuth();

  const list = useQuery({
    queryKey: ["organizations", "verifications", orgId ?? ""],
    enabled: Boolean(orgId),
    queryFn: async () => {
      const { data, error } = await supabase
        .from("organization_verifications")
        .select("*")
        .eq("organization_id", orgId!)
        .order("created_at", { ascending: false });
      if (error) throw error;
      return data;
    },
  });

  const request = useMutation({
    mutationFn: async (input: { note: string | null; documentPath: string | null }) => {
      if (!orgId) throw new Error("Organizzazione non disponibile.");
      const { error } = await supabase.from("organization_verifications").insert({
        organization_id: orgId,
        requested_by: user?.id ?? null,
        note: input.note,
        document_path: input.documentPath,
      });
      if (error) throw error;
    },
    onSuccess: () => void qc.invalidateQueries({ queryKey: ["organizations", "verifications"] }),
    onError: (error) =>
      notifyError(error, { fallback: "Non è stato possibile inviare la richiesta." }),
  });

  return { list, request };
}

/** Seguire attività, Comuni, categorie o canali. */
export function useFollows(targetKind?: string) {
  const { user } = useAuth();
  const qc = useQueryClient();

  const list = useQuery({
    queryKey: ["follows", user?.id ?? "guest", targetKind ?? "all"],
    enabled: Boolean(user),
    queryFn: async () => {
      let q = supabase.from("follows").select("*").order("created_at", { ascending: false });
      if (targetKind) q = q.eq("target_kind", targetKind);
      const { data, error } = await q;
      if (error) throw error;
      return data;
    },
  });

  const keys = new Set((list.data ?? []).map((r) => `${r.target_kind}:${r.target_id}`));

  const toggle = useMutation({
    mutationFn: async (input: { kind: string; id: string; label?: string }) => {
      if (!user) throw new Error("GUEST");
      const key = `${input.kind}:${input.id}`;
      if (keys.has(key)) {
        const { error } = await supabase
          .from("follows")
          .delete()
          .eq("user_id", user.id)
          .eq("target_kind", input.kind)
          .eq("target_id", input.id);
        if (error) throw error;
        return "removed" as const;
      }
      const { error } = await supabase.from("follows").insert({
        user_id: user.id,
        target_kind: input.kind,
        target_id: input.id,
        label: input.label ?? null,
      });
      if (error) throw error;
      return "added" as const;
    },
    onSuccess: () => void qc.invalidateQueries({ queryKey: ["follows"] }),
    onError: (error) => notifyError(error, { fallback: "Non è stato possibile aggiornare." }),
  });

  const isFollowing = (kind: string, id: string) => keys.has(`${kind}:${id}`);

  return { list, isFollowing, toggle };
}
