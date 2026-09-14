import { useCallback, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/use-auth";
import { notifyError } from "@/lib/errors";

export type FavoriteInput = {
  item_id: string;
  item_type: string;
  label?: string | null;
  link_url?: string | null;
};

const favoriteKey = (itemId: string, itemType: string) => `${itemType}:${itemId}`;

export function useFavorites() {
  const { user } = useAuth();
  const qc = useQueryClient();
  const [pending, setPending] = useState<string[]>([]);

  const query = useQuery({
    queryKey: ["favorites", user?.id],
    enabled: Boolean(user?.id),
    retry: 2,
    queryFn: async () => {
      const { data, error } = await supabase
        .from("favorites")
        .select("*")
        .order("created_at", { ascending: false });
      if (error) throw error;
      return data ?? [];
    },
  });

  const toggle = useMutation({
    mutationFn: async (input: FavoriteInput) => {
      if (!user) throw new Error("GUEST");
      const existing = (query.data ?? []).find(
        (f) => f.item_id === input.item_id && f.item_type === input.item_type,
      );
      if (existing) {
        const { error } = await supabase.from("favorites").delete().eq("id", existing.id);
        if (error) throw error;
        return "removed" as const;
      }
      const { error } = await supabase.from("favorites").insert({
        user_id: user.id,
        item_id: input.item_id,
        item_type: input.item_type,
        label: input.label ?? null,
        link_url: input.link_url ?? null,
      });
      if (error) throw error;
      return "added" as const;
    },
    onMutate: (input) => {
      const key = favoriteKey(input.item_id, input.item_type);
      setPending((prev) => (prev.includes(key) ? prev : [...prev, key]));
    },
    onSettled: (_data, _error, input) => {
      const key = favoriteKey(input.item_id, input.item_type);
      setPending((prev) => prev.filter((k) => k !== key));
    },
    onSuccess: (result) => {
      void qc.invalidateQueries({ queryKey: ["favorites"] });
      toast.success(result === "added" ? "Salvato nei preferiti." : "Rimosso dai preferiti.");
    },
    onError: (error, input) => {
      if ((error as Error).message === "GUEST") {
        toast.error("Accedi per salvare i tuoi contenuti.", {
          action: { label: "Accedi", onClick: () => window.location.assign("/accedi") },
        });
        return;
      }
      notifyError(error, {
        fallback: "Non è stato possibile aggiornare i preferiti.",
        retry: () => toggle.mutate(input),
      });
    },
  });

  const isFavorite = useCallback(
    (item_id: string, item_type: string) =>
      (query.data ?? []).some((f) => f.item_id === item_id && f.item_type === item_type),
    [query.data],
  );

  const isPending = useCallback(
    (item_id: string, item_type: string) => pending.includes(favoriteKey(item_id, item_type)),
    [pending],
  );

  return {
    favorites: query.data ?? [],
    isLoading: query.isLoading,
    error: query.error,
    refetch: query.refetch,
    isFavorite,
    isPending,
    isMutating: toggle.isPending,
    toggle,
  };
}
