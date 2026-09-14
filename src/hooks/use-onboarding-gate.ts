import { useEffect } from "react";
import { useNavigate } from "@tanstack/react-router";

import { usePreferences } from "@/hooks/use-preferences";

/**
 * Porta chi non ha ancora completato l'onboarding alla schermata di benvenuto,
 * così le preferenze sono disponibili per organizzare i contenuti.
 */
export function useOnboardingGate() {
  const navigate = useNavigate();
  const { needsOnboarding } = usePreferences();

  useEffect(() => {
    if (needsOnboarding) void navigate({ to: "/benvenuto", replace: true });
  }, [needsOnboarding, navigate]);
}
