import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { Star } from "lucide-react";
import { toast } from "sonner";

import { BusinessShell } from "@/components/member/business-shell";
import { BentoCard, BentoGrid } from "@/components/bento";
import { supabase } from "@/integrations/supabase/client";
import { useMyPlaces } from "@/hooks/use-hub";
import { useMyOrganizations } from "@/hooks/use-organizations";
import { useReviewResponse } from "@/hooks/use-reviews";
import { formatHubDate } from "@/lib/hub";
import { can } from "@/lib/org";

export const Route = createFileRoute("/_authenticated/area-aziende/recensioni")({
  head: () => ({
    meta: [
      { title: "Recensioni — Area Aziende IMLAND" },
      {
        name: "description",
        content: "Le esperienze delle persone sui tuoi luoghi e le tue risposte.",
      },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: BusinessReviews,
});

function BusinessReviews() {
  const orgs = useMyOrganizations();
  const org = orgs.data?.[0] ?? null;
  const places = useMyPlaces();
  const placeIds = (places.data ?? []).map((p) => p.id);
  const placeName = new Map((places.data ?? []).map((p) => [p.id, p.name]));

  const reviews = useQuery({
    queryKey: ["reviews", "org", placeIds.join(",")],
    enabled: placeIds.length > 0,
    queryFn: async () => {
      const { data, error } = await supabase
        .from("reviews")
        .select("*, organization_responses(*)")
        .in("place_id", placeIds)
        .eq("status", "approved")
        .order("created_at", { ascending: false });
      if (error) throw error;
      return data;
    },
  });

  const list = reviews.data ?? [];
  const canAnswer = can(org?.role, "answer_reviews");

  return (
    <BusinessShell
      title="Recensioni"
      lead="Le esperienze raccontate dalle persone. Puoi rispondere una volta a ogni recensione."
    >
      <BentoGrid>
        {places.isLoading || reviews.isLoading ? (
          <BentoCard tone="aziende" span={6}>
            <p className="text-muted-foreground">Caricamento…</p>
          </BentoCard>
        ) : list.length === 0 ? (
          <BentoCard tone="aziende" span={6}>
            <p className="text-muted-foreground">
              Nessuna recensione pubblicata sui tuoi luoghi.
              <br />
              Invita i tuoi clienti a raccontare la loro esperienza.
            </p>
          </BentoCard>
        ) : (
          list.map((r) => (
            <ReviewRow
              key={r.id}
              reviewId={r.id}
              rating={r.rating}
              body={r.body}
              createdAt={r.created_at}
              place={placeName.get(r.place_id ?? "") ?? "Luogo"}
              response={
                (r.organization_responses as { body: string }[] | null)?.[0]?.body ?? null
              }
              organizationId={org?.id}
              canAnswer={canAnswer}
            />
          ))
        )}
      </BentoGrid>
    </BusinessShell>
  );
}

function ReviewRow({
  reviewId,
  rating,
  body,
  createdAt,
  place,
  response,
  organizationId,
  canAnswer,
}: {
  reviewId: string;
  rating: number;
  body: string | null;
  createdAt: string;
  place: string;
  response: string | null;
  organizationId: string | undefined;
  canAnswer: boolean;
}) {
  const answer = useReviewResponse(organizationId);
  const [text, setText] = useState("");

  return (
    <BentoCard tone="aziende" span={3}>
      <div className="flex items-center gap-1 text-signal" aria-label={`${rating} su 5`}>
        {Array.from({ length: 5 }).map((_, i) => (
          <Star key={i} size={16} className={i < rating ? "fill-current" : "opacity-30"} />
        ))}
      </div>
      <p className="mt-2 text-sm text-muted-foreground">
        {place} · {formatHubDate(createdAt)}
      </p>
      {body && <p className="mt-3">{body}</p>}

      {response ? (
        <div className="mt-4 rounded-2xl bg-muted p-3 text-sm">
          <p className="font-semibold">La tua risposta</p>
          <p className="mt-1 text-muted-foreground">{response}</p>
        </div>
      ) : canAnswer && organizationId ? (
        <form
          className="mt-4 flex flex-col gap-2"
          onSubmit={(e) => {
            e.preventDefault();
            answer.mutate(
              { reviewId, body: text.trim() },
              {
                onSuccess: () => {
                  setText("");
                  toast.success("Risposta pubblicata.");
                },
              },
            );
          }}
        >
          <textarea
            required
            rows={3}
            placeholder="Rispondi con cura, a nome della tua realtà."
            className="w-full rounded-2xl border border-border bg-background px-4 py-2.5 text-sm outline-none focus:border-primary"
            value={text}
            onChange={(e) => setText(e.target.value)}
          />
          <button
            type="submit"
            disabled={answer.isPending}
            className="self-start rounded-full bg-primary px-5 py-2 text-sm font-semibold text-primary-foreground disabled:opacity-60"
          >
            {answer.isPending ? "Invio…" : "Pubblica la risposta"}
          </button>
        </form>
      ) : null}
    </BentoCard>
  );
}
