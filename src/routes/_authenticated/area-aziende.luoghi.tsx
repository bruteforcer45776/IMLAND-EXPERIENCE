import { createFileRoute, Link } from "@tanstack/react-router";
import { MapPin, Plus } from "lucide-react";

import { BusinessShell } from "@/components/member/business-shell";
import { BentoCard, BentoGrid, BentoLinkCard } from "@/components/bento";
import { useMyPlaces } from "@/hooks/use-hub";
import { HUB_STATUS_LABEL } from "@/lib/hub";

export const Route = createFileRoute("/_authenticated/area-aziende/luoghi")({
  head: () => ({
    meta: [
      { title: "Le tue schede TERRAIN — Area Aziende IMLAND" },
      {
        name: "description",
        content: "Le schede della tua attività sulla mappa del territorio.",
      },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: BusinessPlaces,
});

function BusinessPlaces() {
  const places = useMyPlaces();
  const list = places.data ?? [];

  return (
    <BusinessShell
      title="Le tue schede TERRAIN"
      lead="La tua presenza sulla mappa del territorio: orari, contatti e recensioni."
    >
      <BentoGrid>
        <BentoLinkCard tone="aziende" span={2} to="/terrain/nuova">
          <Plus size={28} />
          <h2 className="mt-3 text-h3-im">Nuova scheda</h2>
          <p className="mt-2 text-muted-foreground">
            Inserisci i dati una volta.
            <br />
            La redazione la controlla prima della pubblicazione.
          </p>
        </BentoLinkCard>

        {places.isLoading ? (
          <BentoCard tone="aziende" span={4}>
            <p className="text-muted-foreground">Caricamento…</p>
          </BentoCard>
        ) : list.length === 0 ? (
          <BentoCard tone="aziende" span={4}>
            <p className="text-muted-foreground">
              Non hai ancora schede.
              <br />
              Quando ne crei una la trovi qui con il suo stato.
            </p>
          </BentoCard>
        ) : (
          list.map((p) => (
            <BentoCard key={p.id} tone="aziende" span={2}>
              <p className="text-xs font-semibold uppercase tracking-wider text-signal">
                {HUB_STATUS_LABEL[p.status] ?? p.status}
              </p>
              <h2 className="mt-2 text-h3-im">{p.name}</h2>
              <p className="mt-1 inline-flex items-center gap-1.5 text-sm text-muted-foreground">
                <MapPin size={15} /> {p.comune}
                {p.province ? ` (${p.province})` : ""}
              </p>
              {p.moderation_note && (
                <p className="mt-3 rounded-2xl bg-muted p-3 text-sm text-muted-foreground">
                  Nota della redazione: {p.moderation_note}
                </p>
              )}
              {p.status === "approved" && (
                <Link
                  to="/terrain/$slug"
                  params={{ slug: p.slug }}
                  className="mt-4 inline-flex text-[15px] font-semibold text-signal"
                >
                  Vedi la scheda pubblica
                </Link>
              )}
            </BentoCard>
          ))
        )}
      </BentoGrid>
    </BusinessShell>
  );
}
