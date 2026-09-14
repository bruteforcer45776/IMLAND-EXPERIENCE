import { redirect } from "@tanstack/react-router";

import { supabase } from "@/integrations/supabase/client";

/**
 * Gate lato client per le route /admin/*: verifica la sessione con il server
 * (getUser) e il ruolo su user_roles. Gli errori transitori non distruggono la
 * sessione: vengono propagati all'errorComponent che permette di riprovare.
 */
export async function requireAdmin() {
  const { data, error } = await supabase.auth.getUser();
  if (error || !data.user) throw redirect({ to: "/accedi" });

  const { data: roles, error: rolesError } = await supabase
    .from("user_roles")
    .select("role")
    .eq("user_id", data.user.id);

  if (rolesError) {
    throw new Error("Impossibile verificare i permessi. Riprova tra poco.");
  }

  const isAdmin = Boolean(roles?.some((r) => r.role === "admin"));
  if (!isAdmin) throw redirect({ to: "/ascoltatore" });

  return { user: data.user, isAdmin: true as const };
}
