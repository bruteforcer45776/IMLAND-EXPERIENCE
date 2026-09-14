import { createFileRoute, Link } from "@tanstack/react-router";
import { Star } from "lucide-react";

import { BentoCard, BentoGrid } from "@/components/bento";
import { useMyReviews } from "@/hooks/use-reviews";
import { formatHubDate } from "@/lib/hub";

export const Route = createFileRoute("/_authenticated/ascoltatore/recensioni")({
  head: () => ({
    meta: [
      { title: "Le mie recensioni — Area personale IMLAND" },
      { name: "description", content: "Le esperienze che hai raccontato sui luoghi e sulle attività del territorio." },
      { property: "og:title", content: "Le mie recensioni — Area personale IMLAND" },
      { property: "og:description", content: "Il tuo racconto aiuta chi cerca un posto di cui fidarsi." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: MyReviewsPage,
});

const STATUS_LABEL: Record<string, string> = {
  pending: "In verifica",
  approved: "Pubblicata",
  rejected: "Non pubblicata",
  hidden: "Nascosta",
};

function MyReviewsPage() {
  const reviews = useMyReviews();
  const rows = reviews.data ?? [];

  return (
    <div>
      <p className="text-xs font-semibold uppercase tracking-[0.18em] text-signal">Area personale</p>
      <h1 className="mt-2 text-h1-im">Le mie recensioni.</h1>
      <p className="mt-3 max-w-2xl text-muted-foreground">
        Ogni esperienza che racconti aiuta chi cerca un posto di cui fidarsi.
        <br />
        Prima di comparire online, ogni recensione passa dalla nostra verifica.
      </p>

      {reviews.isLoading ? (
        <p className="mt-8 text-sm text-muted-foreground">Carico le tue recensioni…</p>
      ) : rows.length === 0 ? (
        <div className="mt-8 rounded-2xl border border-border p-6">
          <p className="text-sm text-muted-foreground">
            Non hai ancora raccontato nessuna esperienza.
            <br />
            Apri la scheda di un luogo e lascia la tua valutazione.
          </p>
          <Link
            to="/terrain/luoghi"
            className="mt-4 inline-flex rounded-full bg-primary px-6 py-2.5 text-sm font-medium text-primary-foreground"
          >
            Esplora il territorio
          </Link>
        </div>
      ) : (
        <BentoGrid className="mt-8">
          {rows.map((r) => {
            const place = (r as { terrain_places?: { name: string; slug: string; comune: string } | null }).terrain_places;
            return (
              <BentoCard key={r.id} tone="terrain" span={6}>
                <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                  {STATUS_LABEL[r.status] ?? r.status} · {formatHubDate(r.created_at)}
                </p>
                <h2 className="mt-1 text-lg font-semibold">{place?.name ?? "Luogo del territorio"}</h2>
                {place?.comune ? <p className="text-sm text-muted-foreground">{place.comune}</p> : null}
                <p className="mt-2 inline-flex items-center gap-1 text-sm font-medium" aria-label={`${r.rating} su 5`}>
                  {Array.from({ length: r.rating }).map((_, i) => (
                    <Star key={i} size={15} className="fill-current" />
                  ))}
                </p>
                {r.body ? <p className="mt-3 whitespace-pre-line text-sm">{r.body}</p> : null}
                {r.moderation_note ? (
                  <p className="mt-3 rounded-xl border border-border p-4 text-sm">
                    <span className="font-medium">Nota della redazione: </span>
                    {r.moderation_note}
                  </p>
                ) : null}
                {place?.slug ? (
                  <Link
                    to="/terrain/$slug"
                    params={{ slug: place.slug }}
                    className="mt-4 inline-flex text-sm font-medium underline"
                  >
                    Apri la scheda
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
