import type { SupabaseClient } from "@supabase/supabase-js";

import type { Database } from "@/integrations/supabase/types";

/**
 * Verifica lato server che il chiamante abbia il ruolo admin.
 * Usa il client autenticato dell'utente (RLS attive), non il service role.
 */
export async function assertAdmin(context: {
  supabase: SupabaseClient<Database>;
  userId: string;
}): Promise<void> {
  const { data, error } = await context.supabase
    .from("user_roles")
    .select("role")
    .eq("user_id", context.userId)
    .eq("role", "admin")
    .limit(1);

  if (error) throw new Error("Impossibile verificare i permessi. Riprova.");
  if (!data || data.length === 0) throw new Error("Forbidden: admin role required");
}
