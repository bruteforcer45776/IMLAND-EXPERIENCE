import { createFileRoute, Outlet } from "@tanstack/react-router";

import { ListenerShell } from "@/components/listener/listener-shell";
import { PodcastMiniPlayer } from "@/components/podcast-audio";
import { useListenerProgressSync } from "@/hooks/use-listener";
import { useOnboardingGate } from "@/hooks/use-onboarding-gate";

export const Route = createFileRoute("/_authenticated/ascoltatore")({
  component: ListenerLayout,
});

function ListenerLayout() {
  // Salva il tempo di ascolto sul database mentre l'ascoltatore naviga.
  useListenerProgressSync();
  useOnboardingGate();
  return (
    <ListenerShell>
      <Outlet />
      <PodcastMiniPlayer />
    </ListenerShell>
  );
}
