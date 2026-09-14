import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";

import { BentoCard, BentoGrid } from "@/components/bento";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/use-auth";
import { formatHubDate } from "@/lib/hub";

export const Route = createFileRoute("/_authenticated/ascoltatore/candidature")({
  head: () => ({
    meta: [
      { title: "Le mie candidature — Area personale IMLAND" },
      { name: "description", content: "Le candidature che hai inviato alle aziende del territorio e il loro stato." },
      { property: "og:title", content: "Le mie candidature — Area personale IMLAND" },
      { property: "og:description", content: "Segui le tue candidature nel territorio." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: MyApplications,
});

const STATUS_LABEL: Record<string, string> = {
  sent: "Inviata",
  received: "Ricevuta",
  reviewing: "In valutazione",
  contacted: "Contattato",
  accepted: "Accettata",
  rejected: "Non selezionata",
  closed: "Chiusa",
};

function MyApplications() {
  const { user } = useAuth();

  const applications = useQuery({
    queryKey: ["jobs", "applications", "mine", user?.id ?? "guest"],
    enabled: Boolean(user),
    queryFn: async () => {
      const { data, error } = await supabase
        .from("job_applications")
        .select("*, job_posts(title, slug, company_name, comune)")
        .eq("user_id", user!.id)
        .order("created_at", { ascending: false });
      if (error) throw error;
      return data;
    },
  });

  const rows = applications.data ?? [];

  return (
    <div>
      <p className="text-xs font-semibold uppercase tracking-[0.18em] text-signal">Area personale</p>
      <h1 className="mt-2 text-h1-im">Le mie candidature.</h1>
      <p className="mt-3 max-w-2xl text-muted-foreground">
        Qui trovi le opportunità per cui ti sei proposto.
        <br />
        Il tuo curriculum resta privato: lo vede soltanto l'azienda a cui hai scritto.
      </p>

      {applications.isLoading ? (
        <p className="mt-8 text-sm text-muted-foreground">Carico le tue candidature…</p>
      ) : rows.length === 0 ? (
        <div className="mt-8 rounded-2xl border border-border p-6">
          <p className="text-sm text-muted-foreground">
            Non hai ancora inviato candidature.
            <br />
            Le opportunità del territorio si aggiornano ogni settimana.
          </p>
          <Link
            to="/jobs/offerte"
            className="mt-4 inline-flex rounded-full bg-primary px-6 py-2.5 text-sm font-medium text-primary-foreground"
          >
            Guarda le opportunità
          </Link>
        </div>
      ) : (
        <BentoGrid className="mt-8">
          {rows.map((a) => {
            const job = (a as { job_posts?: { title: string; slug: string; company_name: string; comune: string } | null })
              .job_posts;
            return (
              <BentoCard key={a.id} tone="jobs" span={6}>
                <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                  {STATUS_LABEL[a.status] ?? a.status} · {formatHubDate(a.created_at)}
                </p>
                <h2 className="mt-1 text-lg font-semibold">{job?.title ?? "Opportunità"}</h2>
                {job ? (
                  <p className="text-sm text-muted-foreground">
                    {job.company_name} · {job.comune}
                  </p>
                ) : null}
                {a.message ? <p className="mt-3 whitespace-pre-line text-sm">{a.message}</p> : null}
                {job?.slug ? (
                  <Link
                    to="/jobs/$slug"
                    params={{ slug: job.slug }}
                    className="mt-4 inline-flex text-sm font-medium underline"
                  >
                    Rivedi l'opportunità
                  </Link>
                ) : null}
              </BentoCard>
            );
          })}
        </BentoGrid>
      )}
    </div>
  );
}
