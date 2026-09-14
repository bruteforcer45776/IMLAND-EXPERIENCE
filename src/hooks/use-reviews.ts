import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/use-auth";
import { notifyError } from "@/lib/errors";
import type { Database } from "@/integrations/supabase/types";

export type Review = Database["public"]["Tables"]["reviews"]["Row"];
export type OrgResponse = Database["public"]["Tables"]["organization_responses"]["Row"];

/**
 * Recensioni dei luoghi e delle attività.
 *
 * Le persone raccontano la loro esperienza; l'attività può rispondere.
 * La scheda ufficiale resta modificabile solo da chi la gestisce: un errore
 * si comunica con una segnalazione ALERT.
 */
export function usePlaceReviews(placeId: string | undefined) {
  const { user } = useAuth();
  const qc = useQueryClient();

  const list = useQuery({
    queryKey: ["reviews", "place", placeId ?? ""],
    enabled: Boolean(placeId),
    queryFn: async () => {
      const { data, error } = await supabase
        .from("reviews")
        .select("*, organization_responses(*)")
        .eq("place_id", placeId!)
        .order("created_at", { ascending: false });
      if (error) throw error;
      return data;
    },
  });

  const mine = (list.data ?? []).find((r) => r.user_id === user?.id) ?? null;

  const invalidate = () => void qc.invalidateQueries({ queryKey: ["reviews"] });

  const save = useMutation({
    mutationFn: async (input: { rating: number; body: string | null }) => {
      if (!user) throw new Error("GUEST");
      if (!placeId) throw new Error("Luogo non disponibile.");
      if (input.rating < 1 || input.rating > 5) throw new Error("Scegli da 1 a 5 stelle.");
      if (mine) {
        const { error } = await supabase
          .from("reviews")
          .update({
            rating: input.rating,
            body: input.body,
            status: "pending",
            edit_count: mine.edit_count + 1,
          })
          .eq("id", mine.id);
        if (error) throw error;
        return "updated" as const;
      }
      const { error } = await supabase.from("reviews").insert({
        place_id: placeId,
        user_id: user.id,
        rating: input.rating,
        body: input.body,
      });
      if (error) throw error;
      return "created" as const;
    },
    onSuccess: invalidate,
    onError: (error) =>
      notifyError(error, { fallback: "Non è stato possibile salvare la recensione." }),
  });

  const remove = useMutation({
    mutationFn: async () => {
      if (!mine) return;
      const { error } = await supabase.from("reviews").delete().eq("id", mine.id);
      if (error) throw error;
    },
    onSuccess: invalidate,
    onError: (error) =>
      notifyError(error, { fallback: "Non è stato possibile eliminare la recensione." }),
  });

  const report = useMutation({
    mutationFn: async (input: { reviewId: string; reason: string; note?: string }) => {
      if (!user) throw new Error("GUEST");
      const { error } = await supabase.from("review_reports").insert({
        review_id: input.reviewId,
        reporter_id: user.id,
        reason: input.reason,
        note: input.note ?? null,
      });
      if (error) throw error;
    },
    onError: (error) =>
      notifyError(error, { fallback: "Non è stato possibile inviare la segnalazione." }),
  });

  const approved = (list.data ?? []).filter((r) => r.status === "approved");
  const average =
    approved.length > 0
      ? Math.round((approved.reduce((sum, r) => sum + r.rating, 0) / approved.length) * 10) / 10
      : null;

  return { list, approved, average, mine, save, remove, report };
}

/** Le mie recensioni, per l'area personale. */
export function useMyReviews() {
  const { user } = useAuth();
  return useQuery({
    queryKey: ["reviews", "mine", user?.id ?? "guest"],
    enabled: Boolean(user),
    queryFn: async () => {
      const { data, error } = await supabase
        .from("reviews")
        .select("*, terrain_places(name, slug, comune)")
        .eq("user_id", user!.id)
        .order("created_at", { ascending: false });
      if (error) throw error;
      return data;
    },
  });
}

/** Risposta ufficiale dell'attività a una recensione. */
export function useReviewResponse(organizationId: string | undefined) {
  const qc = useQueryClient();
  const { user } = useAuth();

  return useMutation({
    mutationFn: async (input: { reviewId: string; body: string }) => {
      if (!organizationId) throw new Error("Organizzazione non disponibile.");
      const { error } = await supabase.from("organization_responses").upsert(
        {
          review_id: input.reviewId,
          organization_id: organizationId,
          author_id: user?.id ?? null,
          body: input.body,
        },
        { onConflict: "review_id" },
      );
      if (error) throw error;
    },
    onSuccess: () => void qc.invalidateQueries({ queryKey: ["reviews"] }),
    onError: (error) =>
      notifyError(error, { fallback: "Non è stato possibile pubblicare la risposta." }),
  });
}
