import { Link } from "@tanstack/react-router";
import { useState } from "react";
import { Paperclip, Trash2 } from "lucide-react";
import { toast } from "sonner";

import { BentoCard, BentoGrid } from "@/components/bento";
import {
  useAlertAttachments,
  useAlertHistory,
  useDeleteAlertDraft,
  useMyAlerts,
  useUploadAlertAttachment,
  type Alert,
} from "@/hooks/use-alerts";
import { ALERT_STATE_DESC, ALERT_STATE_LABEL, type AlertState } from "@/lib/alert";
import { formatHubDate } from "@/lib/hub";
import { RelatedContent } from "@/components/related-content";

/** Elenco delle segnalazioni della persona: bozze, invii, passaggi e allegati. */
export function MyAlertsPanel() {
  const alerts = useMyAlerts();
  const remove = useDeleteAlertDraft();
  const [open, setOpen] = useState<string | null>(null);

  const rows = alerts.data ?? [];
  const drafts = rows.filter((a) => a.state === "draft");
  const sent = rows.filter((a) => a.state !== "draft");

  return (
    <div>
      <div className="flex flex-wrap gap-3">
        <Link
          to="/alert/segnala"
          className="rounded-full bg-primary px-6 py-3 text-sm font-medium text-primary-foreground"
        >
          Nuova segnalazione
        </Link>
        <Link
          to="/alert/stato"
          className="rounded-full border border-border px-6 py-3 text-sm font-medium"
        >
          Cerca con il codice
        </Link>
      </div>

      {alerts.isLoading ? (
        <p className="mt-8 text-sm text-muted-foreground">Carico le tue segnalazioni…</p>
      ) : rows.length === 0 ? (
        <p className="mt-8 text-sm text-muted-foreground">
          Non hai ancora inviato segnalazioni.
          <br />
          Racconta cosa accade nel tuo Comune: verifichiamo noi.
        </p>
      ) : (
        <>
          {drafts.length > 0 && (
            <section className="mt-10">
              <h2 className="text-h3-im">Bozze da completare</h2>
              <BentoGrid className="mt-4">
                {drafts.map((a) => (
                  <BentoCard key={a.id} tone="alert" span={3}>
                    <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                      {a.category} · {a.comune}
                    </p>
                    <h3 className="mt-1 text-lg font-semibold">{a.title}</h3>
                    <p className="mt-2 text-sm text-muted-foreground">
                      Salvata il {formatHubDate(a.created_at)}
                    </p>
                    <div className="mt-4 flex flex-wrap gap-2">
                      <button
                        type="button"
                        disabled={remove.isPending}
                        onClick={() =>
                          remove.mutate(a.id, {
                            onSuccess: () => toast.success("Bozza eliminata."),
                          })
                        }
                        className="inline-flex items-center gap-2 rounded-full border border-border px-4 py-2 text-sm font-medium"
                      >
                        <Trash2 size={15} /> Elimina
                      </button>
                    </div>
                  </BentoCard>
                ))}
              </BentoGrid>
            </section>
          )}

          <section className="mt-10">
            <h2 className="text-h3-im">Segnalazioni inviate</h2>
            <div className="mt-4 space-y-4">
              {sent.map((a) => (
                <AlertRow
                  key={a.id}
                  alert={a}
                  open={open === a.id}
                  onToggle={() => setOpen(open === a.id ? null : a.id)}
                />
              ))}
              {sent.length === 0 && (
                <p className="text-sm text-muted-foreground">
                  Nessuna segnalazione inviata per ora.
                </p>
              )}
            </div>
          </section>
        </>
      )}
    </div>
  );
}

function AlertRow({
  alert,
  open,
  onToggle,
}: {
  alert: Alert;
  open: boolean;
  onToggle: () => void;
}) {
  const state = alert.state as AlertState;
  const history = useAlertHistory(open ? alert.id : null);
  const attachments = useAlertAttachments(open ? alert.id : null);
  const upload = useUploadAlertAttachment();

  return (
    <article className="rounded-2xl border border-border p-5">
      <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
        {alert.category} · {alert.comune} · {alert.code}
      </p>
      <h3 className="mt-1 text-lg font-semibold">{alert.title}</h3>
      <p className="mt-2 inline-flex rounded-full bg-primary px-4 py-1.5 text-sm font-medium text-primary-foreground">
        {ALERT_STATE_LABEL[state]}
      </p>
      <p className="mt-2 text-sm text-muted-foreground">{ALERT_STATE_DESC[state]}</p>
      {alert.moderation_note ? (
        <p className="mt-3 rounded-xl border border-border p-4 text-sm">
          <span className="font-medium">Nota della redazione: </span>
          {alert.moderation_note}
        </p>
      ) : null}

      <button type="button" onClick={onToggle} className="mt-4 text-sm underline">
        {open ? "Nascondi i dettagli" : "Mostra passaggi e allegati"}
      </button>

      <RelatedContent
        kind="alert"
        id={alert.id}
        title="Da questa segnalazione"
        description="Quello che è nato dal tuo racconto: una scheda del territorio, un'opportunità, un evento o una notizia."
      />

      {open && (
        <div className="mt-4 space-y-4">
          <div>
            <p className="text-sm font-medium">Passaggi</p>
            {history.isLoading ? (
              <p className="mt-1 text-sm text-muted-foreground">Carico lo storico…</p>
            ) : (
              <ol className="mt-2 space-y-1">
                {(history.data ?? []).map((h) => (
                  <li key={h.id} className="text-sm text-muted-foreground">
                    {formatHubDate(h.created_at)} — {ALERT_STATE_LABEL[h.to_state as AlertState]}
                  </li>
                ))}
              </ol>
            )}
          </div>

          <div>
            <p className="text-sm font-medium">Allegati</p>
            <ul className="mt-2 space-y-1">
              {(attachments.data ?? []).map((f) => (
                <li key={f.id} className="text-sm text-muted-foreground">
                  {f.storage_path.split("/").pop()} · {Math.round((f.size_bytes ?? 0) / 1024)} KB
                </li>
              ))}
              {(attachments.data ?? []).length === 0 && (
                <li className="text-sm text-muted-foreground">Nessun allegato.</li>
              )}
            </ul>
            <label className="mt-3 inline-flex cursor-pointer items-center gap-2 rounded-full border border-border px-4 py-2 text-sm font-medium">
              <Paperclip size={15} />
              {upload.isPending ? "Carico…" : "Aggiungi foto o PDF"}
              <input
                type="file"
                accept="image/jpeg,image/png,image/webp,application/pdf"
                className="hidden"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (!file) return;
                  upload.mutate(
                    { alertId: alert.id, file },
                    { onSuccess: () => toast.success("Allegato aggiunto.") },
                  );
                  e.target.value = "";
                }}
              />
            </label>
          </div>
        </div>
      )}
    </article>
  );
}
