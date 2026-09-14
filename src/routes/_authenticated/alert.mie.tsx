import { createFileRoute, redirect } from "@tanstack/react-router";

/** Il vecchio percorso resta valido e porta alla nuova area personale. */
export const Route = createFileRoute("/_authenticated/alert/mie")({
  beforeLoad: () => {
    throw redirect({ to: "/ascoltatore/segnalazioni", replace: true });
  },
});
