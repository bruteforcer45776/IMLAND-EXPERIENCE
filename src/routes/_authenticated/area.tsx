import { createFileRoute, Outlet, redirect } from "@tanstack/react-router";
import { supabase } from "@/integrations/supabase/client";

export const Route = createFileRoute("/_authenticated/area")({
  beforeLoad: async () => {
    const { data } = await supabase.auth.getUser();
    if (!data.user) throw redirect({ to: "/accedi" });

    const { data: profile, error: profileError } = await supabase
      .from("profiles")
      .select("membership_status")
      .eq("id", data.user.id)
      .maybeSingle();

    // Errore transitorio (rete/RLS): non distruggere la sessione, lascia riprovare
    if (profileError) {
      throw new Error("Impossibile verificare lo stato membership. Riprova tra poco.");
    }

    if (profile?.membership_status !== "active") {
      const { data: roles, error: rolesError } = await supabase
        .from("user_roles")
        .select("role")
        .eq("user_id", data.user.id);
      if (rolesError) {
        throw new Error("Impossibile verificare i permessi. Riprova tra poco.");
      }
      const isAdmin = Boolean(roles?.some((r) => r.role === "admin"));
      // Nessun logout: l'ascoltatore ha comunque la sua area personale
      if (!isAdmin) throw redirect({ to: "/ascoltatore" });
    }
  },
  component: () => <Outlet />,
});
