import { createFileRoute } from "@tanstack/react-router";

import { MyAlertsPanel } from "@/components/listener/my-alerts-panel";

export const Route = createFileRoute("/_authenticated/ascoltatore/segnalazioni")({
  head: () => ({
    meta: [
      { title: "Le mie segnalazioni — Area personale IMLAND" },
      { name: "description", content: "Le segnalazioni che hai inviato al territorio, il loro percorso e le bozze da completare." },
      { property: "og:title", content: "Le mie segnalazioni — Area personale IMLAND" },
      { property: "og:description", content: "Segui il percorso di ciò che hai segnalato." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: ListenerAlerts,
});

function ListenerAlerts() {
  return (
    <div>
      <p className="text-xs font-semibold uppercase tracking-[0.18em] text-signal">ALERT</p>
      <h1 className="mt-2 text-h1-im">Le mie segnalazioni.</h1>
      <p className="mt-3 max-w-2xl text-muted-foreground">
        Quello che racconti diventa un luogo, un'opportunità, un evento o una notizia.
        <br />
        Le bozze restano tue finché non decidi di inviarle.
      </p>
      <div className="mt-8">
        <MyAlertsPanel />
      </div>
    </div>
  );
}
