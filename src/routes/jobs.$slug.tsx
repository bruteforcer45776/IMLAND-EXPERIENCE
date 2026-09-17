import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { Bookmark, Building2, CalendarClock, MapPin, Navigation } from "lucide-react";
import { toast } from "sonner";

import { canonical } from "../lib/seo";
import { BentoGrid, BentoCard } from "../components/bento";
import { useAuth } from "@/hooks/use-auth";
import { useApplyToJob, useJob, useJobSaves, useMyApplication } from "@/hooks/use-hub";
import { formatHubDate } from "@/lib/hub";
import { RelatedContent } from "@/components/related-content";
import { LegalConsent } from "@/components/legal-consent";

export const Route = createFileRoute("/jobs/$slug")({
  head: ({ params }) => ({
    meta: [
      { title: "Opportunità di lavoro nel territorio — JOBS IMLAND" },
      {
        name: "description",
        content:
          "Dettaglio di un'opportunità pubblicata da un'attività del territorio: ruolo, requisiti, sede e candidatura con CV.",
      },
      { property: "og:title", content: "Opportunità di lavoro nel territorio — JOBS IMLAND" },
      { property: "og:description", content: "Trova la tua prossima opportunità." },
      { property: "og:type", content: "article" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
    links: [canonical(`/jobs/${params.slug}`)],
  }),
  component: JobDetail,
});

function JobDetail() {
  const { slug } = Route.useParams();
  const { user, profile } = useAuth();
  const { data: job, isLoading, isError, refetch } = useJob(slug);
  const saves = useJobSaves();
  const application = useMyApplication(job?.id);
  const apply = useApplyToJob();

  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [message, setMessage] = useState("");
  const [cv, setCv] = useState<File | null>(null);
  const [privacyAccepted, setPrivacyAccepted] = useState(false);

  if (isLoading) {
    return (
      <div className="container-im section-pad-sm">
        <p className="text-muted-foreground">Carico l'opportunità…</p>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="container-im section-pad-sm">
        <h1 className="text-h1-im">Opportunità non disponibile.</h1>
        <button
          type="button"
          onClick={() => void refetch()}
          className="mt-6 inline-flex rounded-full bg-primary px-6 py-3 text-sm text-primary-foreground"
        >
          Riprova
        </button>
      </div>
    );
  }

  if (!job) {
    return (
      <div className="container-im section-pad-sm">
        <h1 className="text-h1-im">Questa opportunità non esiste.</h1>
        <p className="mt-3 text-muted-foreground">
          L'annuncio non è pubblicato oppure è scaduto.
          <br />
          Le candidature restano valide solo entro la data indicata dall'azienda.
        </p>
        <Link
          to="/jobs/offerte"
          className="mt-6 inline-flex rounded-full bg-primary px-6 py-3 text-sm text-primary-foreground"
        >
          Vedi le opportunità aperte
        </Link>
      </div>
    );
  }

  const expired = new Date(job.expires_at).getTime() < Date.now();
  const alreadyApplied = Boolean(application.data);

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!fullName.trim() || !email.trim()) {
      toast.error("Inserisci nome e email per candidarti.");
      return;
    }
    apply.mutate(
      {
        jobId: job.id,
        fullName: fullName.trim(),
        email: email.trim(),
        phone: phone.trim() || null,
        message: message.trim() || null,
        cv,
      },
      {
        onSuccess: () => {
          toast.success("Candidatura inviata. L'azienda ti risponderà direttamente.");
          setMessage("");
          setCv(null);
        },
      },
    );
  };

  return (
    <div className="container-im section-pad-sm">
      <Link to="/jobs/offerte" className="text-sm text-muted-foreground underline">
        ← Tutte le opportunità
      </Link>

      <div className="mt-4 flex flex-wrap items-start justify-between gap-4">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">
            {job.sector} · {job.contract_type}
          </p>
          <h1 className="mt-2 text-h1-im">{job.title}</h1>
          <p className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-1 text-muted-foreground">
            <span className="flex items-center gap-1.5">
              <Building2 size={16} /> {job.company_name}
            </span>
            <span className="flex items-center gap-1.5">
              <MapPin size={16} /> {job.comune}
              {job.province ? ` (${job.province})` : ""}
            </span>
            <span className="flex items-center gap-1.5">
              <CalendarClock size={16} /> Entro il {formatHubDate(job.expires_at)}
            </span>
          </p>
        </div>
        {user ? (
          <button
            type="button"
            onClick={() => saves.toggle.mutate(job.id)}
            disabled={saves.toggle.isPending}
            className="inline-flex items-center gap-2 rounded-full border border-border px-5 py-2.5 text-sm font-medium"
          >
            <Bookmark size={16} fill={saves.ids.has(job.id) ? "currentColor" : "none"} />
            {saves.ids.has(job.id) ? "Salvata" : "Salva l'opportunità"}
          </button>
        ) : (
          <Link
            to="/accedi"
            className="inline-flex items-center gap-2 rounded-full border border-border px-5 py-2.5 text-sm font-medium"
          >
            <Bookmark size={16} /> Accedi per salvare
          </Link>
        )}
      </div>

      <BentoGrid className="mt-10">
        <BentoCard tone="jobs" span={4}>
          <h2 className="text-lg font-semibold">Di cosa si tratta</h2>
          <p className="mt-3 whitespace-pre-line text-sm leading-relaxed">{job.description}</p>
          {job.requirements && (
            <>
              <h3 className="mt-6 font-medium">Requisiti richiesti</h3>
              <p className="mt-2 whitespace-pre-line text-sm leading-relaxed text-muted-foreground">
                {job.requirements}
              </p>
            </>
          )}
        </BentoCard>

        <BentoCard tone="jobs" span={2}>
          <h2 className="text-lg font-semibold">In sintesi</h2>
          <dl className="mt-3 space-y-2 text-sm">
            <div>
              <dt className="text-muted-foreground">Contratto</dt>
              <dd className="font-medium">{job.contract_type}</dd>
            </div>
            <div>
              <dt className="text-muted-foreground">Settore</dt>
              <dd className="font-medium">{job.sector}</dd>
            </div>
            {job.salary_range && (
              <div>
                <dt className="text-muted-foreground">Retribuzione indicata</dt>
                <dd className="font-medium">{job.salary_range}</dd>
              </div>
            )}
            <div>
              <dt className="text-muted-foreground">Sede</dt>
              <dd className="font-medium">{job.comune}</dd>
            </div>
          </dl>
          <a
            href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
              `${job.company_name}, ${job.comune}`,
            )}`}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-4 inline-flex items-center gap-2 text-sm font-medium underline"
          >
            <Navigation size={15} /> Dove si trova
          </a>
          <Link to="/terrain/luoghi" className="mt-3 block text-sm underline">
            Scopri l'attività sul territorio
          </Link>
        </BentoCard>

        <BentoCard tone="jobs" span={6}>
          <h2 className="text-lg font-semibold">Candidati</h2>
          {expired ? (
            <p className="mt-2 text-sm text-muted-foreground">
              Le candidature per questa opportunità sono chiuse.
              <br />
              Guarda le altre opportunità aperte nel territorio.
            </p>
          ) : !user ? (
            <>
              <p className="mt-2 text-sm text-muted-foreground">
                Per candidarti serve un account IMLAND.
                <br />
                Ti permette di allegare il CV e di seguire le tue candidature.
              </p>
              <Link
                to="/accedi"
                className="mt-4 inline-flex rounded-full bg-primary px-5 py-2.5 text-sm font-medium text-primary-foreground"
              >
                Accedi e candidati
              </Link>
            </>
          ) : alreadyApplied ? (
            <p className="mt-2 text-sm text-muted-foreground">
              Ti sei già candidato a questa opportunità il{" "}
              {formatHubDate(application.data?.created_at)}.
              <br />
              L'azienda ti contatterà con i riferimenti che hai lasciato.
            </p>
          ) : (
            <form onSubmit={onSubmit} className="mt-4 grid gap-4 md:grid-cols-2">
              <label className="space-y-1.5">
                <span className="text-sm font-medium">Nome e cognome *</span>
                <input
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  maxLength={120}
                  required
                  className="h-11 w-full rounded-xl border border-border bg-background px-4 text-sm"
                />
              </label>
              <label className="space-y-1.5">
                <span className="text-sm font-medium">Email *</span>
                <input
                  type="email"
                  value={email || profile?.email || ""}
                  onChange={(e) => setEmail(e.target.value)}
                  maxLength={255}
                  required
                  className="h-11 w-full rounded-xl border border-border bg-background px-4 text-sm"
                />
              </label>
              <label className="space-y-1.5">
                <span className="text-sm font-medium">Telefono</span>
                <input
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  maxLength={40}
                  className="h-11 w-full rounded-xl border border-border bg-background px-4 text-sm"
                />
              </label>
              <label className="space-y-1.5">
                <span className="text-sm font-medium">CV (PDF o Word, max 5 MB)</span>
                <input
                  type="file"
                  accept=".pdf,.doc,.docx"
                  onChange={(e) => setCv(e.target.files?.[0] ?? null)}
                  className="h-11 w-full rounded-xl border border-border bg-background px-3 py-2 text-sm"
                />
              </label>
              <label className="space-y-1.5 md:col-span-2">
                <span className="text-sm font-medium">Messaggio per l'azienda</span>
                <textarea
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  rows={4}
                  maxLength={2000}
                  className="w-full rounded-xl border border-border bg-background px-4 py-3 text-sm"
                />
              </label>
              <div className="md:col-span-2">
                <LegalConsent
                  id="job-application-privacy"
                  checked={privacyAccepted}
                  onChange={setPrivacyAccepted}
                  includeTerms
                />
              </div>
              <div className="md:col-span-2">
                <button
                  type="submit"
                  disabled={apply.isPending || !privacyAccepted}
                  className="inline-flex rounded-full bg-primary px-6 py-3 text-sm font-medium text-primary-foreground disabled:opacity-60"
                >
                  {apply.isPending ? "Invio…" : "Invia la candidatura"}
                </button>
              </div>
            </form>
          )}
        </BentoCard>
      </BentoGrid>

      <RelatedContent kind="job" id={job.id} />
    </div>
  );
}
