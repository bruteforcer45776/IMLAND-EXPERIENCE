import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { toast } from "sonner";
import { z } from "zod";

import { canonical } from "../lib/seo";
import { checkAlertStatus } from "@/lib/hub.functions";
import { formatHubDate } from "@/lib/hub";
import { ALERT_STATE_DESC, ALERT_STATE_FLOW, ALERT_STATE_LABEL, type AlertState } from "@/lib/alert";

const searchSchema = z.object({ code: z.string().optional() });

export const Route = createFileRoute("/alert/stato")({
  validateSearch: (search) => searchSchema.parse(search),
  head: () => ({
    meta: [
      { title: "Verifica lo stato della tua segnalazione — ALERT" },
      {
        name: "description",
        content:
          "Inserisci il codice della tua segnalazione ALERT per sapere se è in verifica, verificata o già diventata un contenuto pubblico.",
      },
      { property: "og:title", content: "Verifica lo stato della tua segnalazione — ALERT" },
      { property: "og:description", content: "Segnala ciò che accade." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
    links: [canonical("/alert/stato")],
  }),
  component: AlertStatus,
});

function AlertStatus() {
  const search = Route.useSearch();
  const [code, setCode] = useState(search.code ?? "");
  const check = useServerFn(checkAlertStatus);

  const lookup = useMutation({
    mutationFn: async (value: string) => check({ data: { code: value } }),
    onError: () => toast.error("Non è stato possibile verificare il codice."),
  });

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (code.trim().length < 4) {
      toast.error("Inserisci il codice completo della segnalazione.");
      return;
    }
    lookup.mutate(code.trim());
  };

  const result = lookup.data;
  const alert = result?.found ? result.alert : null;
  const state = (alert?.state ?? "submitted") as AlertState;
  const reached = new Set((result?.found ? result.history : []).map((h) => h.state));

  return (
    <div className="container-im section-pad-sm">
      <p className="text-xs font-semibold uppercase tracking-[0.18em] text-signal">ALERT</p>
      <h1 className="mt-2 text-h1-im">Come procede la tua segnalazione.</h1>
      <p className="mt-3 max-w-2xl text-muted-foreground">
        Inserisci il codice che ti abbiamo dato al momento dell'invio.
        <br />
        Ti mostriamo soltanto lo stato: nessun dato personale viene reso pubblico.
      </p>

      <form onSubmit={onSubmit} className="mt-8 flex flex-wrap gap-3">
        <input
          value={code}
          onChange={(e) => setCode(e.target.value.toUpperCase())}
          maxLength={20}
          placeholder="AL-XXXXXX"
          aria-label="Codice della segnalazione"
          className="h-12 w-full max-w-xs rounded-xl border border-border bg-background px-4 text-sm tracking-wider"
        />
        <button
          type="submit"
          disabled={lookup.isPending}
          className="rounded-full bg-primary px-6 py-3 text-sm font-medium text-primary-foreground disabled:opacity-60"
        >
          {lookup.isPending ? "Verifico…" : "Verifica"}
        </button>
      </form>

      {result && !result.found && (
        <div className="mt-8 rounded-2xl border border-border p-6">
          <p className="font-medium">Nessuna segnalazione con questo codice.</p>
          <p className="mt-2 text-sm text-muted-foreground">
            Controlla di aver copiato il codice completo.
            <br />
            Se non lo trovi più, puoi inviare una nuova segnalazione.
          </p>
          <Link to="/alert/segnala" className="mt-4 inline-flex text-sm underline">
            Invia una segnalazione
          </Link>
        </div>
      )}

      {alert && (
        <div className="mt-8 max-w-3xl rounded-2xl border border-border p-6">
          <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
            {alert.category} · {alert.comune}
          </p>
          <h2 className="mt-1 text-xl font-semibold">{alert.title}</h2>
          <p className="mt-3 inline-flex rounded-full bg-primary px-4 py-1.5 text-sm font-medium text-primary-foreground">
            {ALERT_STATE_LABEL[state]}
          </p>
          <p className="mt-3 text-sm text-muted-foreground">{ALERT_STATE_DESC[state]}</p>

          <ol className="mt-6 space-y-3">
            {ALERT_STATE_FLOW.map((s) => {
              const done = reached.has(s) || s === state;
              return (
                <li key={s} className="flex items-start gap-3">
                  <span
                    aria-hidden
                    className={`mt-1 h-3 w-3 shrink-0 rounded-full ${done ? "bg-primary" : "bg-border"}`}
                  />
                  <span className={`text-sm ${done ? "font-medium" : "text-muted-foreground"}`}>
                    {ALERT_STATE_LABEL[s]}
                  </span>
                </li>
              );
            })}
          </ol>

          {alert.moderation_note ? (
            <p className="mt-6 rounded-xl border border-border p-4 text-sm">
              <span className="font-medium">Nota della redazione: </span>
              {alert.moderation_note}
            </p>
          ) : null}

          <p className="mt-6 text-sm text-muted-foreground">
            Inviata il {formatHubDate(alert.submitted_at ?? alert.created_at)}.
            {alert.published_at ? ` Pubblicata il ${formatHubDate(alert.published_at)}.` : ""}
          </p>

        </div>

      )}
    </div>
  );
}
