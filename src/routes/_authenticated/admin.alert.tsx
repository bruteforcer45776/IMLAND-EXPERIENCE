import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { toast } from "sonner";

import { supabase } from "@/integrations/supabase/client";
import { notifyError } from "@/lib/errors";
import { adminSetAlertState, adminTransformAlert } from "@/lib/alert-admin.functions";
import {
  ALERT_ADMIN_STATES,
  ALERT_STATE_LABEL,
  TRANSFORM_LABEL,
  suggestedTargets,
  type AlertState,
  type TransformTarget,
} from "@/lib/alert";
import {
  HUB_PROVINCES,
  JOB_CONTRACTS,
  JOB_SECTORS,
  TERRAIN_CATEGORIES,
  formatHubDate,
} from "@/lib/hub";
import type { Alert } from "@/hooks/use-alerts";

export const Route = createFileRoute("/_authenticated/admin/alert")({
  head: () => ({
    meta: [
      { title: "Segnalazioni ALERT — Amministrazione" },
      {
        name: "description",
        content: "Verifica le segnalazioni del territorio e trasformale in contenuti.",
      },
      { property: "og:title", content: "Segnalazioni ALERT — Amministrazione" },
      { property: "og:description", content: "Area riservata alla redazione IMLAND." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: AdminAlert,
});

const inputClass = "h-10 w-full rounded-xl border border-border bg-background px-3 text-sm";

function AdminAlert() {
  const qc = useQueryClient();
  const [filter, setFilter] = useState<AlertState | "all">("submitted");
  const [note, setNote] = useState<Record<string, string>>({});
  const [transforming, setTransforming] = useState<string | null>(null);

  const setState = useServerFn(adminSetAlertState);

  const alerts = useQuery({
    queryKey: ["admin", "alerts"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("territory_alerts")
        .select("*")
        .neq("state", "draft")
        .order("created_at", { ascending: false })
        .limit(200);
      if (error) throw error;
      return data as Alert[];
    },
  });

  const changeState = useMutation({
    mutationFn: async (input: {
      id: string;
      state: AlertState;
      note?: string;
      assignToMe?: boolean;
    }) =>
      setState({
        data: {
          id: input.id,
          state: input.state as Exclude<AlertState, "draft">,
          note: input.note ?? null,
          assignToMe: input.assignToMe ?? false,
        },
      }),
    onSuccess: () => {
      toast.success("Segnalazione aggiornata.");
      void qc.invalidateQueries({ queryKey: ["admin", "alerts"] });
    },
    onError: (error) =>
      notifyError(error, { fallback: "Non è stato possibile aggiornare la segnalazione." }),
  });

  const rows = useMemo(
    () => (alerts.data ?? []).filter((a) => filter === "all" || a.state === filter),
    [alerts.data, filter],
  );

  return (
    <div>
      <h1 className="text-h2-im">Segnalazioni dal territorio.</h1>
      <p className="mt-3 max-w-2xl text-muted-foreground">
        Ogni segnalazione attraversa analisi, verifica e smistamento.
        <br />
        Nulla viene cancellato: da qui una segnalazione diventa un luogo, un'opportunità, un evento
        o una notizia.
      </p>

      <div className="mt-6 flex flex-wrap gap-2">
        {(["all", ...ALERT_ADMIN_STATES] as const).map((s) => (
          <button
            key={s}
            type="button"
            onClick={() => setFilter(s as AlertState | "all")}
            className={`rounded-full px-4 py-2 text-sm font-medium ${
              filter === s ? "bg-primary text-primary-foreground" : "border border-border"
            }`}
          >
            {s === "all" ? "Tutte" : ALERT_STATE_LABEL[s as AlertState]}
          </button>
        ))}
      </div>

      <div className="mt-8 space-y-4">
        {alerts.isLoading ? (
          <p className="text-sm text-muted-foreground">Carico le segnalazioni…</p>
        ) : rows.length === 0 ? (
          <p className="text-sm text-muted-foreground">Nessuna segnalazione in questo stato.</p>
        ) : (
          rows.map((a) => (
            <article key={a.id} className="rounded-2xl border border-border p-5">
              <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                {a.category} · {a.comune} · {a.code}
              </p>
              <h2 className="mt-1 text-lg font-semibold">{a.title}</h2>
              <p className="mt-1 text-sm text-muted-foreground">
                {ALERT_STATE_LABEL[a.state as AlertState]} ·{" "}
                {formatHubDate(a.submitted_at ?? a.created_at)}
                {a.contact_email ? ` · ${a.contact_email}` : ""}
              </p>
              <p className="mt-3 whitespace-pre-line text-sm">{a.body}</p>

              {a.payload && Object.keys(a.payload as Record<string, string>).length > 0 && (
                <dl className="mt-3 grid gap-2 sm:grid-cols-2">
                  {Object.entries(a.payload as Record<string, string>).map(([key, value]) => (
                    <div key={key}>
                      <dt className="text-xs uppercase tracking-wide text-muted-foreground">
                        {key.replace(/_/g, " ")}
                      </dt>
                      <dd className="text-sm">{value || "—"}</dd>
                    </div>
                  ))}
                </dl>
              )}

              <input
                value={note[a.id] ?? ""}
                onChange={(e) => setNote((n) => ({ ...n, [a.id]: e.target.value }))}
                placeholder="Nota per chi ha segnalato"
                maxLength={600}
                className="mt-4 h-10 w-full rounded-xl border border-border bg-background px-3 text-sm"
              />

              <div className="mt-3 flex flex-wrap gap-2">
                {ALERT_ADMIN_STATES.map((s) => (
                  <button
                    key={s}
                    type="button"
                    disabled={changeState.isPending}
                    onClick={() =>
                      changeState.mutate({
                        id: a.id,
                        state: s,
                        note: note[a.id],
                        assignToMe: s === "analyzing",
                      })
                    }
                    className="rounded-full border border-border px-4 py-1.5 text-sm"
                  >
                    {ALERT_STATE_LABEL[s]}
                  </button>
                ))}
              </div>

              <button
                type="button"
                onClick={() => setTransforming(transforming === a.id ? null : a.id)}
                className="mt-4 text-sm underline"
              >
                {transforming === a.id ? "Chiudi la trasformazione" : "Trasforma in contenuto"}
              </button>

              {transforming === a.id && (
                <TransformPanel alert={a} onDone={() => setTransforming(null)} />
              )}
            </article>
          ))
        )}
      </div>
    </div>
  );
}

function TransformPanel({ alert, onDone }: { alert: Alert; onDone: () => void }) {
  const qc = useQueryClient();
  const transform = useServerFn(adminTransformAlert);
  const payload = (alert.payload ?? {}) as Record<string, string>;
  const targets = suggestedTargets(alert.alert_type);

  const [target, setTarget] = useState<TransformTarget>(targets[0] ?? "news");
  const [form, setForm] = useState({
    title: alert.title,
    body: alert.body,
    comune: alert.comune,
    province: alert.province ?? "",
    address: payload["indirizzo"] ?? payload["luogo"] ?? "",
    category: TERRAIN_CATEGORIES[0] as string,
    companyName: payload["azienda"] ?? "",
    sector: JOB_SECTORS[0] as string,
    contractType: JOB_CONTRACTS[0] as string,
    startsAt: payload["data"] ?? "",
    venue: payload["luogo"] ?? "",
  });

  const run = useMutation({
    mutationFn: async () =>
      transform({
        data: {
          id: alert.id,
          target,
          title: form.title.trim(),
          body: form.body.trim(),
          comune: form.comune,
          province: form.province || null,
          address: form.address || null,
          category: form.category || null,
          companyName: form.companyName || null,
          sector: form.sector || null,
          contractType: form.contractType || null,
          startsAt: form.startsAt || null,
          venue: form.venue || null,
        },
      }),
    onSuccess: () => {
      toast.success("Contenuto creato e collegato alla segnalazione.");
      void qc.invalidateQueries({ queryKey: ["admin", "alerts"] });
      onDone();
    },
    onError: (error) =>
      notifyError(error, { fallback: "Non è stato possibile creare il contenuto." }),
  });

  return (
    <div className="mt-4 space-y-3 rounded-2xl border border-border p-4">
      <div className="flex flex-wrap gap-2">
        {(["place", "job", "event", "news"] as TransformTarget[]).map((t) => (
          <button
            key={t}
            type="button"
            onClick={() => setTarget(t)}
            className={`rounded-full px-4 py-1.5 text-sm font-medium ${
              target === t ? "bg-primary text-primary-foreground" : "border border-border"
            }`}
          >
            {TRANSFORM_LABEL[t]}
            {targets.includes(t) ? " ·" : ""}
          </button>
        ))}
      </div>

      <label className="block space-y-1">
        <span className="text-sm font-medium">Titolo</span>
        <input
          value={form.title}
          onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))}
          className={inputClass}
        />
      </label>
      <label className="block space-y-1">
        <span className="text-sm font-medium">Testo</span>
        <textarea
          value={form.body}
          onChange={(e) => setForm((f) => ({ ...f, body: e.target.value }))}
          rows={5}
          className="w-full rounded-xl border border-border bg-background px-3 py-2 text-sm"
        />
      </label>

      <div className="grid gap-3 sm:grid-cols-2">
        <label className="space-y-1">
          <span className="text-sm font-medium">Comune</span>
          <input
            value={form.comune}
            onChange={(e) => setForm((f) => ({ ...f, comune: e.target.value }))}
            className={inputClass}
          />
        </label>
        <label className="space-y-1">
          <span className="text-sm font-medium">Provincia</span>
          <select
            value={form.province}
            onChange={(e) => setForm((f) => ({ ...f, province: e.target.value }))}
            className={inputClass}
          >
            <option value="">—</option>
            {HUB_PROVINCES.map((p) => (
              <option key={p} value={p}>
                {p}
              </option>
            ))}
          </select>
        </label>

        {target === "place" && (
          <>
            <label className="space-y-1">
              <span className="text-sm font-medium">Categoria del luogo</span>
              <select
                value={form.category}
                onChange={(e) => setForm((f) => ({ ...f, category: e.target.value }))}
                className={inputClass}
              >
                {TERRAIN_CATEGORIES.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
            </label>
            <label className="space-y-1">
              <span className="text-sm font-medium">Indirizzo</span>
              <input
                value={form.address}
                onChange={(e) => setForm((f) => ({ ...f, address: e.target.value }))}
                className={inputClass}
              />
            </label>
          </>
        )}

        {target === "job" && (
          <>
            <label className="space-y-1">
              <span className="text-sm font-medium">Azienda</span>
              <input
                value={form.companyName}
                onChange={(e) => setForm((f) => ({ ...f, companyName: e.target.value }))}
                className={inputClass}
              />
            </label>
            <label className="space-y-1">
              <span className="text-sm font-medium">Settore</span>
              <select
                value={form.sector}
                onChange={(e) => setForm((f) => ({ ...f, sector: e.target.value }))}
                className={inputClass}
              >
                {JOB_SECTORS.map((s) => (
                  <option key={s} value={s}>
                    {s}
                  </option>
                ))}
              </select>
            </label>
            <label className="space-y-1">
              <span className="text-sm font-medium">Contratto</span>
              <select
                value={form.contractType}
                onChange={(e) => setForm((f) => ({ ...f, contractType: e.target.value }))}
                className={inputClass}
              >
                {JOB_CONTRACTS.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
            </label>
          </>
        )}

        {target === "event" && (
          <>
            <label className="space-y-1">
              <span className="text-sm font-medium">Data e ora</span>
              <input
                type="datetime-local"
                value={form.startsAt}
                onChange={(e) => setForm((f) => ({ ...f, startsAt: e.target.value }))}
                className={inputClass}
              />
            </label>
            <label className="space-y-1">
              <span className="text-sm font-medium">Luogo</span>
              <input
                value={form.venue}
                onChange={(e) => setForm((f) => ({ ...f, venue: e.target.value }))}
                className={inputClass}
              />
            </label>
          </>
        )}
      </div>

      <p className="text-sm text-muted-foreground">
        Il contenuto nasce da verificare e non pubblicato.
        <br />
        La pubblicazione resta una scelta della redazione.
      </p>

      <button
        type="button"
        disabled={run.isPending}
        onClick={() => run.mutate()}
        className="rounded-full bg-primary px-6 py-2.5 text-sm font-medium text-primary-foreground disabled:opacity-60"
      >
        {run.isPending ? "Creo il contenuto…" : `Crea ${TRANSFORM_LABEL[target].toLowerCase()}`}
      </button>
    </div>
  );
}
