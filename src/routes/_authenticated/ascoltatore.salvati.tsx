import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { Bookmark, MapPin } from "lucide-react";

import { BentoCard, BentoGrid } from "@/components/bento";
import { useJobSaves, useTerrainFavorites } from "@/hooks/use-hub";
import { formatHubDate } from "@/lib/hub";

export const Route = createFileRoute("/_authenticated/ascoltatore/salvati")({
  head: () => ({
    meta: [
      { title: "Luoghi e opportunità salvate — Area personale IMLAND" },
      { name: "description", content: "I luoghi del territorio e le opportunità di lavoro che hai messo da parte." },
      { property: "og:title", content: "Luoghi e opportunità salvate — Area personale IMLAND" },
      { property: "og:description", content: "Tutto quello che hai messo da parte, in un posto solo." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: SavedPage,
});

type Tab = "luoghi" | "opportunita";

function SavedPage() {
  const [tab, setTab] = useState<Tab>("luoghi");
  const places = useTerrainFavorites();
  const jobs = useJobSaves();

  return (
    <div>
      <p className="text-xs font-semibold uppercase tracking-[0.18em] text-signal">Area personale</p>
      <h1 className="mt-2 text-h1-im">Quello che hai salvato.</h1>
      <p className="mt-3 max-w-2xl text-muted-foreground">
        I luoghi da visitare e le opportunità da valutare restano qui.
        <br />
        Puoi tornarci quando vuoi.
      </p>

      <div className="mt-6 flex flex-wrap gap-2">
        {(
          [
            ["luoghi", `Luoghi (${(places.list.data ?? []).length})`],
            ["opportunita", `Opportunità (${(jobs.list.data ?? []).length})`],
          ] as const
        ).map(([value, label]) => (
          <button
            key={value}
            type="button"
            onClick={() => setTab(value)}
            className={`rounded-full px-4 py-2 text-sm font-semibold ${
              tab === value ? "bg-signal text-white" : "border border-border bg-card"
            }`}
          >
            {label}
          </button>
        ))}
      </div>

      {tab === "luoghi" ? (
        places.list.isLoading ? (
          <p className="mt-8 text-sm text-muted-foreground">Carico i luoghi salvati…</p>
        ) : (places.list.data ?? []).length === 0 ? (
          <EmptyState
            text="Non hai ancora salvato nessun luogo."
            actionLabel="Esplora il territorio"
            to="/terrain/luoghi"
          />
        ) : (
          <BentoGrid className="mt-8">
            {(places.list.data ?? []).map((row) => {
              const place = row.terrain_places;
              if (!place) return null;
              return (
                <BentoCard key={row.place_id} tone="terrain" span={4}>
                  <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">{place.category}</p>
                  <h2 className="mt-1 text-lg font-semibold">{place.name}</h2>
                  <p className="mt-1 inline-flex items-center gap-1 text-sm text-muted-foreground">
                    <MapPin size={14} /> {place.comune}
                    {place.province ? ` (${place.province})` : ""}
                  </p>
                  <div className="mt-4 flex flex-wrap gap-2">
                    <Link
                      to="/terrain/$slug"
                      params={{ slug: place.slug }}
                      className="rounded-full bg-primary px-4 py-2 text-sm font-medium text-primary-foreground"
                    >
                      Apri la scheda
                    </Link>
                    <button
                      type="button"
                      disabled={places.toggle.isPending}
                      onClick={() => places.toggle.mutate(row.place_id)}
                      className="rounded-full border border-border px-4 py-2 text-sm font-medium"
                    >
                      Rimuovi
                    </button>
                  </div>
                </BentoCard>
              );
            })}
          </BentoGrid>
        )
      ) : jobs.list.isLoading ? (
        <p className="mt-8 text-sm text-muted-foreground">Carico le opportunità salvate…</p>
      ) : (jobs.list.data ?? []).length === 0 ? (
        <EmptyState
          text="Non hai ancora salvato nessuna opportunità."
          actionLabel="Guarda le opportunità"
          to="/jobs/offerte"
        />
      ) : (
        <BentoGrid className="mt-8">
          {(jobs.list.data ?? []).map((row) => {
            const job = row.job_posts;
            if (!job) return null;
            return (
              <BentoCard key={row.job_id} tone="jobs" span={4}>
                <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                  {job.sector} · {job.contract_type}
                </p>
                <h2 className="mt-1 text-lg font-semibold">{job.title}</h2>
                <p className="mt-1 text-sm text-muted-foreground">
                  {job.company_name} · {job.comune}
                </p>
                <p className="mt-1 text-sm text-muted-foreground">Salvata il {formatHubDate(row.created_at)}</p>
                <div className="mt-4 flex flex-wrap gap-2">
                  <Link
                    to="/jobs/$slug"
                    params={{ slug: job.slug }}
                    className="rounded-full bg-primary px-4 py-2 text-sm font-medium text-primary-foreground"
                  >
                    Apri l'opportunità
                  </Link>
                  <button
                    type="button"
                    disabled={jobs.toggle.isPending}
                    onClick={() => jobs.toggle.mutate(row.job_id)}
                    className="rounded-full border border-border px-4 py-2 text-sm font-medium"
                  >
                    Rimuovi
                  </button>
                </div>
              </BentoCard>
            );
          })}
        </BentoGrid>
      )}
    </div>
  );
}

function EmptyState({ text, actionLabel, to }: { text: string; actionLabel: string; to: string }) {
  return (
    <div className="mt-8 rounded-2xl border border-border p-6">
      <p className="inline-flex items-center gap-2 text-sm text-muted-foreground">
        <Bookmark size={15} /> {text}
      </p>
      <Link
        to={to}
        className="mt-4 inline-flex rounded-full bg-primary px-6 py-2.5 text-sm font-medium text-primary-foreground"
      >
        {actionLabel}
      </Link>
    </div>
  );
}
