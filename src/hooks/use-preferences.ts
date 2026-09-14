import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/use-auth";

export type UserPreferences = {
  user_id: string;
  account_type: string;
  topics: string[];
  provinces: string[];
  listen_moment: string | null;
  formats: string[];
  goal: string | null;
  notify_new_episodes: boolean;
  completed_at: string | null;
};

export type PreferencesInput = Partial<Omit<UserPreferences, "user_id">>;

/** Preferenze raccolte in onboarding: guidano l'ordine dei contenuti proposti. */
export function usePreferences() {
  const { user } = useAuth();
  const qc = useQueryClient();

  const query = useQuery({
    queryKey: ["user-preferences", user?.id],
    enabled: Boolean(user?.id),
    queryFn: async () => {
      const { data, error } = await supabase
        .from("user_preferences")
        .select("*")
        .eq("user_id", user!.id)
        .maybeSingle();
      if (error) throw error;
      return (data ?? null) as UserPreferences | null;
    },
  });

  const save = useMutation({
    mutationFn: async (input: PreferencesInput) => {
      if (!user) throw new Error("Devi accedere");
      const { error } = await supabase
        .from("user_preferences")
        .upsert({ user_id: user.id, ...input }, { onConflict: "user_id" });
      if (error) throw error;
    },
    onSuccess: () => void qc.invalidateQueries({ queryKey: ["user-preferences"] }),
  });

  return {
    preferences: query.data ?? null,
    isLoading: query.isLoading,
    /** true solo quando sappiamo per certo che l'onboarding non è stato fatto. */
    needsOnboarding: Boolean(user) && !query.isLoading && !query.data?.completed_at,
    save,
  };
}
