import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { Bookmark, Briefcase, LocateFixed, MapPin, Search } from "lucide-react";

import { canonical } from "../lib/seo";
import { BentoGrid, BentoCard } from "../components/bento";
import { useAuth } from "@/hooks/use-auth";
import { useGeolocation, useJobSaves, useJobs } from "@/hooks/use-hub";
import { HUB_COMUNI, JOB_CONTRACTS, JOB_SECTORS, formatHubDate } from "@/lib/hub";

export const Route = createFileRoute("/jobs/offerte")({
  head: () => ({
    meta: [
      { title: "Offerte di lavoro e opportunità nel territorio — JOBS" },
      {
        name: "description",
        content:
          "Cerca lavoro, tirocini e formazione per settore, tipo di contratto, Comune o distanza. Le opportunità del territorio su JOBS IMLAND.",
      },
      { property: "og:title", content: "Offerte di lavoro e opportunità nel territorio — JOBS" },
      { property: "og:description", content: "Trova la tua prossima opportunità." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
    links: [canonical("/jobs/offerte")],
  }),
  component: JobsSearch,
});

function JobsSearch() {
  const { user } = useAuth();
  const [q, setQ] = useState("");
  const [sector, setSector] = useState("");
  const [contract, setContract] = useState("");
  const [comune, setComune] = useState("");
  const [radiusKm, setRadiusKm] = useState<number | null>(25);
  const geo = useGeolocation();
  const { jobs, isLoading, isError, refetch } = useJobs(
    { q, sector, contract, comune, radiusKm },
    geo.coords,
  );
  const saves = useJobSaves();

  return (
    <div className="jobs-inverted page-inverted">
      <div className="container-im section-pad-sm">
        <p className="text-xs font-semibold uppercase tracking-[0.18em] opacity-80">JOBS</p>
        <h1 className="mt-2 text-h1-im">Opportunità vicino a te.</h1>
        <p className="mt-3 max-w-2xl opacity-90">
          Lavoro, tirocini e formazione delle aziende del territorio.
          <br />
          Ogni annuncio è verificato e ha una data di scadenza.
        </p>

        <div className="mt-8 rounded-3xl bg-white p-5 text-foreground shadow-sm">
          <div className="grid gap-3 md:grid-cols-4">
            <label className="flex items-center gap-2 rounded-full border border-border px-4">
              <Search size={16} className="text-muted-foreground" />
              <input
                value={q}
                onChange={(e) => setQ(e.target.value)}
                maxLength={80}
                placeholder="Ruolo o azienda"
                aria-label="Cerca opportunità"
                className="h-11 w-full bg-transparent text-sm outline-none"
              />
            </label>
            <select
              value={sector}
              onChange={(e) => setSector(e.target.value)}
              aria-label="Settore"
              className="h-11 rounded-full border border-border bg-background px-4 text-sm"
            >
              <option value="">Tutti i settori</option>
              {JOB_SECTORS.map((s) => (
                <option key={s} value={s}>
                  {s}
                </option>
              ))}
            </select>
            <select
              value={contract}
              onChange={(e) => setContract(e.target.value)}
              aria-label="Tipo di contratto"
              className="h-11 rounded-full border border-border bg-background px-4 text-sm"
            >
              <option value="">Tutti i contratti</option>
              {JOB_CONTRACTS.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
            <select
              value={comune}
              onChange={(e) => setComune(e.target.value)}
              aria-label="Comune"
              className="h-11 rounded-full border border-border bg-background px-4 text-sm"
            >
              <option value="">Tutti i Comuni</option>
              {HUB_COMUNI.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          </div>

          <div className="mt-4 flex flex-wrap items-center gap-3">
            <button
              type="button"
              onClick={geo.coords ? geo.clear : geo.request}
              className="inline-flex items-center gap-2 rounded-full border border-border px-4 py-2 text-sm font-medium"
            >
              <LocateFixed size={15} />
              {geo.loading ? "Cerco la posizione…" : geo.coords ? "Non usare la posizione" : "Vicino a me"}
            </button>
            {geo.coords && (
              <select
                value={String(radiusKm ?? "")}
                onChange={(e) => setRadiusKm(e.target.value ? Number(e.target.value) : null)}
                aria-label="Distanza massima"
                className="h-10 rounded-full border border-border bg-background px-4 text-sm"
              >
                {[10, 25, 50, 100].map((km) => (
                  <option key={km} value={km}>
                    Entro {km} km
                  </option>
                ))}
                <option value="">Qualsiasi distanza</option>
              </select>
            )}
            {geo.error && <span className="text-sm text-muted-foreground">{geo.error}</span>}
            <Link
              to="/jobs/pubblica"
              className="ml-auto inline-flex rounded-full bg-primary px-5 py-2 text-sm font-medium text-primary-foreground"
            >
              Pubblica un annuncio
            </Link>
          </div>
        </div>

        <div className="mt-10">
          {isLoading ? (
            <p className="opacity-90">Carico le opportunità…</p>
          ) : isError ? (
            <div className="rounded-3xl bg-white p-6 text-foreground">
              <p className="font-medium">Non riusciamo a caricare le opportunità.</p>
              <button
                type="button"
                onClick={() => void refetch()}
                className="mt-3 inline-flex rounded-full bg-primary px-5 py-2 text-sm text-primary-foreground"
              >
                Riprova
              </button>
            </div>
          ) : jobs.length === 0 ? (
            <div className="rounded-3xl bg-white p-6 text-foreground">
              <p className="font-medium">Nessuna opportunità con questi filtri.</p>
              <p className="mt-2 text-sm text-muted-foreground">
                Prova a togliere qualche filtro o ad allargare la distanza.
                <br />
                Le nuove opportunità arrivano ogni settimana.
              </p>
            </div>
          ) : (
            <BentoGrid>
              {jobs.map((job) => (
                <BentoCard key={job.id} tone="jobs" span={3}>
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                        {job.sector} · {job.contract_type}
                      </p>
                      <h2 className="mt-1 text-lg font-semibold">
                        <Link to="/jobs/$slug" params={{ slug: job.slug }}>
                          {job.title}
                        </Link>
                      </h2>
                      <p className="mt-1 text-sm text-muted-foreground">{job.company_name}</p>
                    </div>
                    {user && (
                      <button
                        type="button"
                        aria-label={saves.ids.has(job.id) ? "Togli dai salvati" : "Salva l'opportunità"}
                        onClick={() => saves.toggle.mutate(job.id)}
                        className="rounded-full p-2 text-muted-foreground hover:text-foreground"
                      >
                        <Bookmark size={18} fill={saves.ids.has(job.id) ? "currentColor" : "none"} />
                      </button>
                    )}
                  </div>
                  <p className="mt-3 flex items-center gap-1.5 text-sm text-muted-foreground">
                    <MapPin size={14} /> {job.comune}
                    {job.distance != null ? ` · ${job.distance.toFixed(1)} km` : ""}
                  </p>
                  <p className="mt-1 flex items-center gap-1.5 text-sm text-muted-foreground">
                    <Briefcase size={14} /> Candidature entro il {formatHubDate(job.expires_at)}
                  </p>
                  <Link
                    to="/jobs/$slug"
                    params={{ slug: job.slug }}
                    className="mt-4 inline-flex text-sm font-medium underline"
                  >
                    Vedi e candidati
                  </Link>
                </BentoCard>
              ))}
            </BentoGrid>
          )}
        </div>
      </div>
    </div>
  );
}
