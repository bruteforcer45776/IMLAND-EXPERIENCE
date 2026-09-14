import { createFileRoute, Outlet } from "@tanstack/react-router";

import { useOnboardingGate } from "@/hooks/use-onboarding-gate";

export const Route = createFileRoute("/_authenticated/area-aziende")({
  component: BusinessAreaLayout,
});

function BusinessAreaLayout() {
  useOnboardingGate();
  return <Outlet />;
}
