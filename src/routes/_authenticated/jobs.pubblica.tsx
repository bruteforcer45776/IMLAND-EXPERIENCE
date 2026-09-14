import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { toast } from "sonner";

import { BentoGrid, BentoCard } from "../../components/bento";
import {
  useCreateJob,
  useGeolocation,
  useMyJobs,
  useMyPlaces,
  useReceivedApplications,
} from "@/hooks/use-hub";
import {
  HUB_COMUNI,
  HUB_PROVINCES,
  HUB_STATUS_LABEL,
  JOB_CONTRACTS,
  JOB_SECTORS,
  formatHubDate,
} from "@/lib/hub";

export const Route = createFileRoute("/_authenticated/jobs/pubblica")({
  head: () => ({
    meta: [
      { title: "Pubblica un'opportunità di lavoro — JOBS" },
      {
        name: "description",
        content:
          "Pubblica un'offerta di lavoro, un tirocinio o un percorso di formazione. I dati della tua attività arrivano dalla scheda TERRAIN.",
      },
      { property: "og:title", content: "Pubblica un'opportunità di lavoro — JOBS" },
      { property: "og:description", content: "Trova la tua prossima opportunità." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: PublishJob,
});

const defaultExpiry = () => {
  const d = new Date();
  d.setDate(d.getDate() + 30);
  return d.toISOString().slice(0, 10);
};

function PublishJob() {
  const create = useCreateJob();
  const mine = useMyJobs();
  const received = useReceivedApplications();
  const places = useMyPlaces();
  const geo = useGeolocation();

  const [form, setForm] = useState({
    companyName: "",
    title: "",
    sector: "",
    contractType: "",
    description: "",
    requirements: "",
    comune: "",
    province: "",
    salaryRange: "",
    applyEmail: "",
    expiresAt: defaultExpiry(),
  });

  const set =
    (key: keyof typeof form) =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) =>
      setForm((f) => ({ ...f, [key]: e.target.value }));

  /** Un'attività già presente su TERRAIN non deve reinserire i propri dati. */
  const prefillFromPlace = (placeId: string) => {
    const place = (places.data ?? []).find((p) => p.id === placeId);
    if (!place) return;
    setForm((f) => ({
      ...f,
      companyName: place.name,
      comune: place.comune,
      province: place.province ?? "",
      applyEmail: place.email ?? f.applyEmail,
    }));
    toast.success("Dati importati dalla tua scheda del territorio.");
  };

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.companyName.trim() || !form.title.trim() || !form.sector || !form.contractType || !form.comune) {
      toast.error("Compila attività, ruolo, settore, contratto e Comune.");
      return;
    }
    if (form.description.trim().length < 20) {
      toast.error("Descrivi l'opportunità con almeno venti caratteri.");
      return;
    }
    create.mutate(
      {
        companyName: form.companyName.trim(),
        title: form.title.trim(),
        sector: form.sector,
        contractType: form.contractType,
        description: form.description.trim(),
        requirements: form.requirements.trim() || null,
        comune: form.comune,
        province: form.province || null,
        salaryRange: form.salaryRange.trim() || null,
        applyEmail: form.applyEmail.trim() || null,
        expiresAt: new Date(`${form.expiresAt}T23:59:00`).toISOString(),
        latitude: geo.coords?.lat ?? null,
        longitude: geo.coords?.lon ?? null,
      },
      {
        onSuccess: () => {
          toast.success("Annuncio inviato. Lo pubblichiamo dopo la verifica.");
          setForm((f) => ({ ...f, title: "", description: "", requirements: "", salaryRange: "" }));
        },
      },
    );
  };

  return (
    <div className="container-im section-pad-sm">
      <p className="text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">JOBS</p>
      <h1 className="mt-2 text-h1-im">Pubblica un'opportunità.</h1>
      <p className="mt-3 max-w-2xl text-muted-foreground">
        Racconta il ruolo che cerchi: i dati della tua attività arrivano dalla scheda del territorio.
        <br />
        Ogni annuncio ha una data di scadenza e resta collegato alla tua realtà.
      </p>

      {(places.data ?? []).length > 0 && (
        <div className="mt-6 rounded-2xl border border-border bg-muted/40 p-4">
          <p className="text-sm font-medium">Importa i dati da una tua scheda TERRAIN</p>
          <div className="mt-3 flex flex-wrap gap-2">
            {(places.data ?? []).map((p) => (
              <button
                key={p.id}
                type="button"
                onClick={() => prefillFromPlace(p.id)}
                className="rounded-full border border-border px-4 py-2 text-sm"
              >
                {p.name}
              </button>
            ))}
          </div>
        </div>
      )}

      <form onSubmit={onSubmit} className="mt-8 grid gap-4 md:grid-cols-2">
        <label className="space-y-1.5">
          <span className="text-sm font-medium">Attività *</span>
          <input value={form.companyName} onChange={set("companyName")} maxLength={120} required className="h-11 w-full rounded-xl border border-border bg-background px-4 text-sm" />
        </label>
        <label className="space-y-1.5">
          <span className="text-sm font-medium">Ruolo cercato *</span>
          <input value={form.title} onChange={set("title")} maxLength={140} required className="h-11 w-full rounded-xl border border-border bg-background px-4 text-sm" />
        </label>
        <label className="space-y-1.5">
          <span className="text-sm font-medium">Settore *</span>
          <select value={form.sector} onChange={set("sector")} required className="h-11 w-full rounded-xl border border-border bg-background px-4 text-sm">
            <option value="">Scegli il settore</option>
            {JOB_SECTORS.map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>
        </label>
        <label className="space-y-1.5">
          <span className="text-sm font-medium">Tipo di contratto *</span>
          <select value={form.contractType} onChange={set("contractType")} required className="h-11 w-full rounded-xl border border-border bg-background px-4 text-sm">
            <option value="">Scegli il contratto</option>
            {JOB_CONTRACTS.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
        </label>
        <label className="space-y-1.5">
          <span className="text-sm font-medium">Comune *</span>
          <select value={form.comune} onChange={set("comune")} required className="h-11 w-full rounded-xl border border-border bg-background px-4 text-sm">
            <option value="">Scegli il Comune</option>
            {HUB_COMUNI.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
        </label>
        <label className="space-y-1.5">
          <span className="text-sm font-medium">Provincia</span>
          <select value={form.province} onChange={set("province")} className="h-11 w-full rounded-xl border border-border bg-background px-4 text-sm">
            <option value="">—</option>
            {HUB_PROVINCES.map((p) => (
              <option key={p} value={p}>
                {p}
              </option>
            ))}
          </select>
        </label>
        <label className="space-y-1.5 md:col-span-2">
          <span className="text-sm font-medium">Descrizione *</span>
          <textarea value={form.description} onChange={set("description")} rows={6} maxLength={5000} required className="w-full rounded-xl border border-border bg-background px-4 py-3 text-sm" />
        </label>
        <label className="space-y-1.5 md:col-span-2">
          <span className="text-sm font-medium">Requisiti</span>
          <textarea value={form.requirements} onChange={set("requirements")} rows={4} maxLength={3000} className="w-full rounded-xl border border-border bg-background px-4 py-3 text-sm" />
        </label>
        <label className="space-y-1.5">
          <span className="text-sm font-medium">Retribuzione indicativa</span>
          <input value={form.salaryRange} onChange={set("salaryRange")} maxLength={120} className="h-11 w-full rounded-xl border border-border bg-background px-4 text-sm" />
        </label>
        <label className="space-y-1.5">
          <span className="text-sm font-medium">Email per le candidature</span>
          <input type="email" value={form.applyEmail} onChange={set("applyEmail")} maxLength={255} className="h-11 w-full rounded-xl border border-border bg-background px-4 text-sm" />
        </label>
        <label className="space-y-1.5">
          <span className="text-sm font-medium">Scadenza *</span>
          <input type="date" value={form.expiresAt} onChange={set("expiresAt")} required className="h-11 w-full rounded-xl border border-border bg-background px-4 text-sm" />
        </label>

        <div className="md:col-span-2 flex flex-wrap items-center gap-3">
          <button type="button" onClick={geo.request} className="rounded-full border border-border px-4 py-2 text-sm font-medium">
            {geo.coords ? "Posizione registrata" : geo.loading ? "Cerco la posizione…" : "Usa la posizione della sede"}
          </button>
          <button type="submit" disabled={create.isPending} className="rounded-full bg-primary px-6 py-3 text-sm font-medium text-primary-foreground disabled:opacity-60">
            {create.isPending ? "Invio…" : "Invia l'annuncio"}
          </button>
        </div>
      </form>

      <h2 className="mt-14 text-h3-im">I tuoi annunci</h2>
      {mine.isLoading ? (
        <p className="mt-3 text-sm text-muted-foreground">Carico i tuoi annunci…</p>
      ) : (mine.data ?? []).length === 0 ? (
        <p className="mt-3 text-sm text-muted-foreground">
          Non hai ancora pubblicato annunci.
          <br />
          Il primo annuncio arriva online subito dopo la verifica.
        </p>
      ) : (
        <BentoGrid className="mt-6">
          {(mine.data ?? []).map((job) => {
            const expired = new Date(job.expires_at).getTime() < Date.now();
            const apps = (received.data ?? []).filter((a) => a.job_id === job.id);
            return (
              <BentoCard key={job.id} tone="jobs" span={3}>
                <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                  {job.sector} · {job.contract_type}
                </p>
                <h3 className="mt-1 text-lg font-semibold">{job.title}</h3>
                <p className="mt-2 text-sm text-muted-foreground">
                  {expired ? "Scaduto" : HUB_STATUS_LABEL[job.status] ?? job.status} · scadenza {formatHubDate(job.expires_at)}
                </p>
                <p className="mt-1 text-sm text-muted-foreground">
                  {apps.length === 0 ? "Nessuna candidatura ricevuta" : `${apps.length} candidature ricevute`}
                </p>
                {job.status === "published" && (
                  <Link to="/jobs/$slug" params={{ slug: job.slug }} className="mt-3 inline-flex text-sm underline">
                    Vedi l'annuncio pubblico
                  </Link>
                )}
                {apps.length > 0 && (
                  <ul className="mt-3 space-y-1 text-sm">
                    {apps.map((a) => (
                      <li key={a.id}>
                        {a.full_name} · <a href={`mailto:${a.email}`} className="underline">{a.email}</a>
                      </li>
                    ))}
                  </ul>
                )}
              </BentoCard>
            );
          })}
        </BentoGrid>
      )}
    </div>
  );
}
