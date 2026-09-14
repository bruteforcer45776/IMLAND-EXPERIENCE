import { createFileRoute, Link } from "@tanstack/react-router";
import { Plus } from "lucide-react";

import { BusinessShell } from "@/components/member/business-shell";
import { BentoCard, BentoGrid, BentoLinkCard } from "@/components/bento";
import { useMyJobs, useReceivedApplications } from "@/hooks/use-hub";
import { HUB_STATUS_LABEL, formatHubDate } from "@/lib/hub";

export const Route = createFileRoute("/_authenticated/area-aziende/opportunita")({
  head: () => ({
    meta: [
      { title: "Le tue opportunità — Area Aziende IMLAND" },
      {
        name: "description",
        content: "Annunci pubblicati e candidature ricevute dalla tua realtà.",
      },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: BusinessJobs,
});

function BusinessJobs() {
  const jobs = useMyJobs();
  const applications = useReceivedApplications();
  const list = jobs.data ?? [];
  const apps = applications.data ?? [];

  return (
    <BusinessShell
      title="Le tue opportunità"
      lead="Le posizioni aperte della tua realtà e le persone che si sono candidate."
    >
      <BentoGrid>
        <BentoLinkCard tone="aziende" span={2} to="/jobs/pubblica">
          <Plus size={28} />
          <h2 className="mt-3 text-h3-im">Nuova opportunità</h2>
          <p className="mt-2 text-muted-foreground">
            Descrivi la posizione.
            <br />
            La redazione la controlla prima della pubblicazione.
          </p>
        </BentoLinkCard>

        {jobs.isLoading ? (
          <BentoCard tone="aziende" span={4}>
            <p className="text-muted-foreground">Caricamento…</p>
          </BentoCard>
        ) : list.length === 0 ? (
          <BentoCard tone="aziende" span={4}>
            <p className="text-muted-foreground">
              Non hai ancora annunci.
              <br />
              Quando ne pubblichi uno lo trovi qui con lo stato e le candidature.
            </p>
          </BentoCard>
        ) : (
          list.map((j) => {
            const count = apps.filter((a) => a.job_id === j.id).length;
            return (
              <BentoCard key={j.id} tone="aziende" span={2}>
                <p className="text-xs font-semibold uppercase tracking-wider text-signal">
                  {HUB_STATUS_LABEL[j.status] ?? j.status}
                </p>
                <h2 className="mt-2 text-h3-im">{j.title}</h2>
                <p className="mt-1 text-sm text-muted-foreground">
                  {j.comune} · {j.contract_type}
                </p>
                <p className="mt-2 text-sm">
                  {count === 0
                    ? "Nessuna candidatura"
                    : count === 1
                      ? "1 candidatura"
                      : `${count} candidature`}
                </p>
                {j.status === "approved" && (
                  <Link
                    to="/jobs/$slug"
                    params={{ slug: j.slug }}
                    className="mt-4 inline-flex text-[15px] font-semibold text-signal"
                  >
                    Vedi l'annuncio pubblico
                  </Link>
                )}
              </BentoCard>
            );
          })
        )}

        <BentoCard tone="aziende" span={6}>
          <h2 className="text-h3-im">Candidature ricevute</h2>
          {applications.isLoading ? (
            <p className="mt-3 text-muted-foreground">Caricamento…</p>
          ) : apps.length === 0 ? (
            <p className="mt-3 text-muted-foreground">
              Nessuna candidatura per ora.
              <br />
              Le riceverai qui, con nome e messaggio della persona.
            </p>
          ) : (
            <ul className="mt-4 space-y-2">
              {apps.map((a) => (
                <li key={a.id} className="rounded-2xl border border-border p-4 text-sm">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="font-semibold">{a.full_name}</span>
                    <span className="text-muted-foreground">
                      {a.job_posts?.title ?? "Opportunità"} · {formatHubDate(a.created_at)}
                    </span>
                  </div>
                  <p className="mt-1 text-muted-foreground">
                    {a.email}
                    {a.phone ? ` · ${a.phone}` : ""}
                  </p>
                  {a.message && <p className="mt-2">{a.message}</p>}
                </li>
              ))}
            </ul>
          )}
        </BentoCard>
      </BentoGrid>
    </BusinessShell>
  );
}
