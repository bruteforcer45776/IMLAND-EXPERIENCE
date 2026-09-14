import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { toast } from "sonner";

import { useHubModeration } from "@/hooks/use-hub";
import { ALERT_STATUS_LABEL, HUB_STATUS_LABEL, formatHubDate } from "@/lib/hub";

export const Route = createFileRoute("/_authenticated/admin/hub")({
  head: () => ({
    meta: [
      { title: "Moderazione TERRAIN, JOBS e ALERT — Amministrazione" },
      {
        name: "description",
        content:
          "Verifica e pubblica schede del territorio, annunci di lavoro e segnalazioni dei cittadini.",
      },
      { property: "og:title", content: "Moderazione TERRAIN, JOBS e ALERT" },
      { property: "og:description", content: "Area riservata alla redazione IMLAND." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: AdminHub,
});

type Tab = "places" | "jobs" | "alerts";

const PLACE_STATES = ["pending", "published", "rejected", "suspended", "archived"] as const;
const ALERT_STATES = [
  "received",
  "in_review",
  "verified",
  "published",
  "rejected",
  "closed",
] as const;

function AdminHub() {
  const mod = useHubModeration();
  const [tab, setTab] = useState<Tab>("places");
  const [note, setNote] = useState<Record<string, string>>({});

  const tabs: { key: Tab; label: string; count: number }[] = [
    { key: "places", label: "Schede TERRAIN", count: (mod.places.data ?? []).length },
    { key: "jobs", label: "Annunci JOBS", count: (mod.jobs.data ?? []).length },
    { key: "alerts", label: "Segnalazioni ALERT", count: (mod.alerts.data ?? []).length },
  ];

  return (
    <div>
      <h1 className="text-h2-im">Moderazione dell'Hub territoriale.</h1>
      <p className="mt-3 max-w-2xl text-muted-foreground">
        Qui verifichi ciò che arriva dal territorio prima che diventi pubblico.
        <br />
        Nulla viene cancellato: gli elementi non attivi passano in archivio.
      </p>

      <div className="mt-6 flex flex-wrap gap-2">
        {tabs.map((t) => (
          <button
            key={t.key}
            type="button"
            onClick={() => setTab(t.key)}
            className={`rounded-full px-4 py-2 text-sm font-medium ${
              tab === t.key ? "bg-primary text-primary-foreground" : "border border-border"
            }`}
          >
            {t.label} ({t.count})
          </button>
        ))}
      </div>

      <div className="mt-8 space-y-4">
        {tab === "places" &&
          (mod.places.isLoading ? (
            <p className="text-sm text-muted-foreground">Carico le schede…</p>
          ) : (mod.places.data ?? []).length === 0 ? (
            <p className="text-sm text-muted-foreground">Nessuna scheda proposta.</p>
          ) : (
            (mod.places.data ?? []).map((p) => (
              <article key={p.id} className="rounded-2xl border border-border p-5">
                <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                  {p.category} · {p.comune}
                </p>
                <h2 className="mt-1 text-lg font-semibold">{p.name}</h2>
                <p className="mt-1 text-sm text-muted-foreground">
                  {HUB_STATUS_LABEL[p.status] ?? p.status} · {formatHubDate(p.created_at)}
                </p>
                {p.description && <p className="mt-3 text-sm">{p.description}</p>}
                <input
                  value={note[p.id] ?? ""}
                  onChange={(e) => setNote((n) => ({ ...n, [p.id]: e.target.value }))}
                  placeholder="Nota per chi ha proposto la scheda"
                  maxLength={500}
                  className="mt-4 h-10 w-full rounded-xl border border-border bg-background px-3 text-sm"
                />
                <div className="mt-3 flex flex-wrap gap-2">
                  {PLACE_STATES.map((s) => (
                    <button
                      key={s}
                      type="button"
                      disabled={mod.setPlaceStatus.isPending}
                      onClick={() =>
                        mod.setPlaceStatus.mutate(
                          { id: p.id, status: s, note: note[p.id] },
                          { onSuccess: () => toast.success("Scheda aggiornata.") },
                        )
                      }
                      className="rounded-full border border-border px-4 py-1.5 text-sm"
                    >
                      {HUB_STATUS_LABEL[s]}
                    </button>
                  ))}
                </div>
              </article>
            ))
          ))}

        {tab === "jobs" &&
          (mod.jobs.isLoading ? (
            <p className="text-sm text-muted-foreground">Carico gli annunci…</p>
          ) : (mod.jobs.data ?? []).length === 0 ? (
            <p className="text-sm text-muted-foreground">Nessun annuncio da verificare.</p>
          ) : (
            (mod.jobs.data ?? []).map((j) => (
              <article key={j.id} className="rounded-2xl border border-border p-5">
                <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                  {j.company_name} · {j.comune}
                </p>
                <h2 className="mt-1 text-lg font-semibold">{j.title}</h2>
                <p className="mt-1 text-sm text-muted-foreground">
                  {HUB_STATUS_LABEL[j.status] ?? j.status} · scadenza {formatHubDate(j.expires_at)}
                </p>
                <p className="mt-3 line-clamp-4 text-sm">{j.description}</p>
                <input
                  value={note[j.id] ?? ""}
                  onChange={(e) => setNote((n) => ({ ...n, [j.id]: e.target.value }))}
                  placeholder="Nota per l'azienda"
                  maxLength={500}
                  className="mt-4 h-10 w-full rounded-xl border border-border bg-background px-3 text-sm"
                />
                <div className="mt-3 flex flex-wrap gap-2">
                  {PLACE_STATES.map((s) => (
                    <button
                      key={s}
                      type="button"
                      disabled={mod.setJobStatus.isPending}
                      onClick={() =>
                        mod.setJobStatus.mutate(
                          { id: j.id, status: s, note: note[j.id] },
                          { onSuccess: () => toast.success("Annuncio aggiornato.") },
                        )
                      }
                      className="rounded-full border border-border px-4 py-1.5 text-sm"
                    >
                      {HUB_STATUS_LABEL[s]}
                    </button>
                  ))}
                </div>
              </article>
            ))
          ))}

        {tab === "alerts" &&
          (mod.alerts.isLoading ? (
            <p className="text-sm text-muted-foreground">Carico le segnalazioni…</p>
          ) : (mod.alerts.data ?? []).length === 0 ? (
            <p className="text-sm text-muted-foreground">Nessuna segnalazione ricevuta.</p>
          ) : (
            (mod.alerts.data ?? []).map((a) => (
              <article key={a.id} className="rounded-2xl border border-border p-5">
                <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                  {a.code} · {a.category} · {a.comune}
                </p>
                <h2 className="mt-1 text-lg font-semibold">{a.title}</h2>
                <p className="mt-1 text-sm text-muted-foreground">
                  {ALERT_STATUS_LABEL[a.status] ?? a.status} · {formatHubDate(a.created_at)}
                </p>
                <p className="mt-3 whitespace-pre-line text-sm">{a.body}</p>
                {a.contact_email && (
                  <p className="mt-2 text-sm text-muted-foreground">Contatto: {a.contact_email}</p>
                )}
                <input
                  value={note[a.id] ?? ""}
                  onChange={(e) => setNote((n) => ({ ...n, [a.id]: e.target.value }))}
                  placeholder="Nota visibile a chi ha segnalato"
                  maxLength={500}
                  className="mt-4 h-10 w-full rounded-xl border border-border bg-background px-3 text-sm"
                />
                <div className="mt-3 flex flex-wrap gap-2">
                  {ALERT_STATES.map((s) => (
                    <button
                      key={s}
                      type="button"
                      disabled={mod.setAlertStatus.isPending}
                      onClick={() =>
                        mod.setAlertStatus.mutate(
                          { id: a.id, status: s, note: note[a.id] },
                          { onSuccess: () => toast.success("Segnalazione aggiornata.") },
                        )
                      }
                      className="rounded-full border border-border px-4 py-1.5 text-sm"
                    >
                      {ALERT_STATUS_LABEL[s]}
                    </button>
                  ))}
                </div>
              </article>
            ))
          ))}
      </div>
    </div>
  );
}
