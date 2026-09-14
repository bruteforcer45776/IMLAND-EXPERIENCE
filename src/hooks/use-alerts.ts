import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/use-auth";
import { notifyError } from "@/lib/errors";
import { ALERT_STATE_STATUS, type AlertState } from "@/lib/alert";
import type { Database } from "@/integrations/supabase/types";

export type Alert = Database["public"]["Tables"]["territory_alerts"]["Row"];
export type AlertCategory = Database["public"]["Tables"]["alert_categories"]["Row"];
export type AlertHistoryRow = Database["public"]["Tables"]["alert_status_history"]["Row"];
export type AlertAttachment = Database["public"]["Tables"]["alert_attachments"]["Row"];

/** Codice pubblico con cui una persona ritrova la propria segnalazione. */
export function newAlertCode(): string {
  const alphabet = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  let code = "";
  for (let i = 0; i < 6; i += 1) code += alphabet[Math.floor(Math.random() * alphabet.length)];
  return `AL-${code}`;
}

/** Tipologie di segnalazione attive, filtrate per chi sta segnalando. */
export function useAlertCategories(audience: "user" | "org" = "user") {
  return useQuery({
    queryKey: ["alert", "categories", audience],
    staleTime: 10 * 60 * 1000,
    queryFn: async () => {
      const { data, error } = await supabase
        .from("alert_categories")
        .select("*")
        .eq("is_active", true)
        .in("audience", ["all", audience])
        .order("sort_order");
      if (error) throw error;
      return data as AlertCategory[];
    },
  });
}

/** Le segnalazioni di chi è collegato, bozze comprese. */
export function useMyAlerts() {
  const { user } = useAuth();
  return useQuery({
    queryKey: ["alert", "mine", user?.id ?? "guest"],
    enabled: Boolean(user),
    queryFn: async () => {
      const { data, error } = await supabase
        .from("territory_alerts")
        .select("*")
        .eq("reporter_id", user!.id)
        .order("created_at", { ascending: false });
      if (error) throw error;
      return data as Alert[];
    },
  });
}

export function useAlertHistory(alertId: string | null) {
  return useQuery({
    queryKey: ["alert", "history", alertId],
    enabled: Boolean(alertId),
    queryFn: async () => {
      const { data, error } = await supabase
        .from("alert_status_history")
        .select("*")
        .eq("alert_id", alertId!)
        .order("created_at", { ascending: true });
      if (error) throw error;
      return data as AlertHistoryRow[];
    },
  });
}

export function useAlertAttachments(alertId: string | null) {
  return useQuery({
    queryKey: ["alert", "attachments", alertId],
    enabled: Boolean(alertId),
    queryFn: async () => {
      const { data, error } = await supabase
        .from("alert_attachments")
        .select("*")
        .eq("alert_id", alertId!)
        .order("created_at", { ascending: true });
      if (error) throw error;
      return data as AlertAttachment[];
    },
  });
}

export type AlertDraftPayload = {
  id?: string | null;
  alertType: string;
  category: string;
  title: string;
  body: string;
  comune: string;
  province: string | null;
  latitude: number | null;
  longitude: number | null;
  contactEmail: string | null;
  payload: Record<string, string>;
};

/**
 * Salva o aggiorna una segnalazione di chi ha un account.
 * `state` decide se resta una bozza o parte verso la redazione.
 */
export function useSaveAlert() {
  const { user } = useAuth();
  const qc = useQueryClient();

  return useMutation({
    mutationFn: async ({
      draft,
      state,
    }: {
      draft: AlertDraftPayload;
      state: Extract<AlertState, "draft" | "submitted">;
    }) => {
      if (!user) throw new Error("GUEST");

      const values = {
        alert_type: draft.alertType,
        category: draft.category,
        title: draft.title.trim(),
        body: draft.body.trim(),
        comune: draft.comune,
        province: draft.province,
        latitude: draft.latitude,
        longitude: draft.longitude,
        contact_email: draft.contactEmail,
        payload: draft.payload,
        state,
        status: ALERT_STATE_STATUS[state],
        submitted_at: state === "submitted" ? new Date().toISOString() : null,
      };

      if (draft.id) {
        const { data, error } = await supabase
          .from("territory_alerts")
          .update(values)
          .eq("id", draft.id)
          .select("id, code, state")
          .single();
        if (error) throw error;
        return data;
      }

      const { data, error } = await supabase
        .from("territory_alerts")
        .insert({ ...values, code: newAlertCode(), reporter_id: user.id })
        .select("id, code, state")
        .single();
      if (error) throw error;
      return data;
    },
    onSuccess: () => void qc.invalidateQueries({ queryKey: ["alert", "mine"] }),
    onError: (error) =>
      notifyError(error, { fallback: "Non è stato possibile salvare la segnalazione." }),
  });
}

/** Elimina una bozza non ancora inviata. */
export function useDeleteAlertDraft() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("territory_alerts").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => void qc.invalidateQueries({ queryKey: ["alert", "mine"] }),
    onError: (error) => notifyError(error, { fallback: "Non è stato possibile eliminare la bozza." }),
  });
}

const MAX_ATTACHMENT_BYTES = 8 * 1024 * 1024;
const ALLOWED_ATTACHMENTS = ["image/jpeg", "image/png", "image/webp", "application/pdf"];

/** Allega una foto o un documento a una segnalazione. */
export function useUploadAlertAttachment() {
  const { user } = useAuth();
  const qc = useQueryClient();

  return useMutation({
    mutationFn: async ({ alertId, file }: { alertId: string; file: File }) => {
      if (!user) throw new Error("GUEST");
      if (file.size > MAX_ATTACHMENT_BYTES) throw new Error("Il file supera gli 8 MB.");
      if (!ALLOWED_ATTACHMENTS.includes(file.type)) {
        throw new Error("Puoi allegare immagini JPG, PNG, WEBP oppure un PDF.");
      }

      const ext = file.name.split(".").pop()?.toLowerCase() ?? "bin";
      const path = `${user.id}/${alertId}/${Date.now()}.${ext}`;
      const up = await supabase.storage.from("alert-attachments").upload(path, file, {
        contentType: file.type,
        upsert: false,
      });
      if (up.error) throw up.error;

      const { error } = await supabase.from("alert_attachments").insert({
        alert_id: alertId,
        storage_path: path,
        mime_type: file.type,
        size_bytes: file.size,
      });
      if (error) throw error;
      return path;
    },
    onSuccess: () => void qc.invalidateQueries({ queryKey: ["alert", "attachments"] }),
    onError: (error) => notifyError(error, { fallback: "Non è stato possibile allegare il file." }),
  });
}
