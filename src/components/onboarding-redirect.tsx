import { useNavigate, useRouterState } from "@tanstack/react-router";

import { usePreferences } from "@/hooks/use-preferences";
import { OnboardingWizard } from "@/components/onboarding-wizard";

/** Percorsi dove l'onboarding non deve interrompere il flusso in corso. */
const SKIP_PREFIXES = [
  "/benvenuto",
  "/accedi",
  "/registrati",
  "/aggiorna-password",
  "/recupera-password",
  "/verifica",
  "/auth",
  "/admin",
];

/**
 * Chi accede per la prima volta (email o Google, da qualsiasi dispositivo)
 * vede subito le domande di benvenuto come overlay full-screen: non serve
 * nessun cambio di pagina, così funziona anche su iPhone e Android dove il
 * ritorno dal login può atterrare su qualsiasi percorso.
 */
export function OnboardingRedirect() {
  const navigate = useNavigate();
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const { needsOnboarding } = usePreferences();

  const skip = SKIP_PREFIXES.some((p) => pathname === p || pathname.startsWith(`${p}/`));
  if (skip || !needsOnboarding) return null;

  return (
    <OnboardingWizard
      onDone={(accountType) =>
        void navigate({ to: accountType === "azienda" ? "/area-aziende" : "/ascoltatore", replace: true })
      }
    />
  );
}
