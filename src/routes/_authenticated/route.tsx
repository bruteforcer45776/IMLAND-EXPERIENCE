import { createFileRoute, Outlet, redirect } from "@tanstack/react-router";
import { supabase } from "@/integrations/supabase/client";

export const Route = createFileRoute("/_authenticated")({
  ssr: false,
  beforeLoad: async () => {
    const { data, error } = await supabase.auth.getUser();
    if (error || !data.user) throw redirect({ to: "/accedi" });
    // La verifica membership vive sul sottoalbero /area: gli ascoltatori
    // autenticati hanno la loro area dedicata (/ascoltatore).
    return { user: data.user };
  },
  component: () => <Outlet />,
});
