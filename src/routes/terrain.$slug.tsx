import { createFileRoute, Link } from "@tanstack/react-router";
import { Globe, Heart, Mail, MapPin, Navigation, Phone } from "lucide-react";

import { canonical } from "../lib/seo";
import { BentoGrid, BentoCard } from "../components/bento";
import { useAuth } from "@/hooks/use-auth";
import { usePlace, useTerrainFavorites } from "@/hooks/use-hub";
import { HUB_STATUS_LABEL, formatHubDate, mapsUrl } from "@/lib/hub";
import { RelatedContent } from "@/components/related-content";

export const Route = createFileRoute("/terrain/$slug")({
  head: ({ params }) => ({
    meta: [
      { title: `Scheda luogo — TERRAIN IMLAND` },
      {
        name: "description",
        content:
          "Scheda di un luogo del territorio su TERRAIN: contatti, posizione, indicazioni e collegamenti con gli altri servizi IMLAND.",
      },
      { property: "og:title", content: "Scheda luogo — TERRAIN IMLAND" },
      { property: "og:description", content: "Tutto il territorio, vicino a te." },
      { property: "og:type", content: "article" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
    links: [canonical(`/terrain/${params.slug}`)],
  }),
  component: PlaceDetail,
});

function PlaceDetail() {
  const { slug } = Route.useParams();
  const { user } = useAuth();
  const { data: place, isLoading, isError, refetch } = usePlace(slug);
  const favorites = useTerrainFavorites();

  if (isLoading) {
    return (
      <div className="container-im section-pad-sm">
        <p className="text-muted-foreground">Carico la scheda…</p>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="container-im section-pad-sm">
        <h1 className="text-h1-im">Scheda non disponibile.</h1>
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

  if (!place) {
    return (
      <div className="container-im section-pad-sm">
        <h1 className="text-h1-im">Questa scheda non esiste.</h1>
        <p className="mt-3 text-muted-foreground">
          Il luogo che cerchi non è pubblicato o è stato archiviato.
          <br />
          Torna alla ricerca per scoprire il resto del territorio.
        </p>
        <Link
          to="/terrain/luoghi"
          className="mt-6 inline-flex rounded-full bg-primary px-6 py-3 text-sm text-primary-foreground"
        >
          Cerca nel territorio
        </Link>
      </div>
    );
  }

  const isFavorite = favorites.ids.has(place.id);

  return (
    <div className="container-im section-pad-sm">
      <Link to="/terrain/luoghi" className="text-sm text-muted-foreground underline">
        ← Tutti i luoghi
      </Link>

      <div className="mt-4 flex flex-wrap items-start justify-between gap-4">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">
            {place.category}
          </p>
          <h1 className="mt-2 text-h1-im">{place.name}</h1>
          <p className="mt-3 flex items-center gap-1.5 text-muted-foreground">
            <MapPin size={16} /> {place.address ? `${place.address}, ` : ""}
            {place.comune}
            {place.province ? ` (${place.province})` : ""}
          </p>
        </div>
        {user ? (
          <button
            type="button"
            onClick={() => favorites.toggle.mutate(place.id)}
            disabled={favorites.toggle.isPending}
            className="inline-flex items-center gap-2 rounded-full border border-border px-5 py-2.5 text-sm font-medium"
          >
            <Heart size={16} fill={isFavorite ? "currentColor" : "none"} />
            {isFavorite ? "Nei preferiti" : "Salva nei preferiti"}
          </button>
        ) : (
          <Link
            to="/accedi"
            className="inline-flex items-center gap-2 rounded-full border border-border px-5 py-2.5 text-sm font-medium"
          >
            <Heart size={16} /> Accedi per salvare
          </Link>
        )}
      </div>

      {place.description && (
        <p className="mt-6 max-w-3xl text-lg leading-relaxed">{place.description}</p>
      )}

      <BentoGrid className="mt-10">
        <BentoCard tone="terrain" span={3}>
          <h2 className="text-lg font-semibold">Contatti</h2>
          <ul className="mt-3 space-y-2 text-sm">
            {place.phone && (
              <li className="flex items-center gap-2">
                <Phone size={15} />
                <a href={`tel:${place.phone}`} className="underline">
                  {place.phone}
                </a>
              </li>
            )}
            {place.email && (
              <li className="flex items-center gap-2">
                <Mail size={15} />
                <a href={`mailto:${place.email}`} className="underline">
                  {place.email}
                </a>
              </li>
            )}
            {place.website && (
              <li className="flex items-center gap-2">
                <Globe size={15} />
                <a href={place.website} target="_blank" rel="noopener noreferrer" className="underline">
                  Sito web
                </a>
              </li>
            )}
            {!place.phone && !place.email && !place.website && (
              <li className="text-muted-foreground">Nessun contatto pubblico indicato.</li>
            )}
          </ul>
        </BentoCard>

        <BentoCard tone="terrain" span={3}>
          <h2 className="text-lg font-semibold">Come arrivare</h2>
          <p className="mt-2 text-sm text-muted-foreground">
            Apri le indicazioni stradali verso questo luogo.
            <br />
            Funziona anche dal telefono, con la tua posizione attuale.
          </p>
          <a
            href={mapsUrl(place)}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-4 inline-flex items-center gap-2 rounded-full bg-primary px-5 py-2.5 text-sm font-medium text-primary-foreground"
          >
            <Navigation size={15} /> Indicazioni stradali
          </a>
        </BentoCard>

        <BentoCard tone="terrain" span={6}>
          <h2 className="text-lg font-semibold">Stato della scheda</h2>
          <p className="mt-2 text-sm text-muted-foreground">
            Stato: {HUB_STATUS_LABEL[place.status] ?? place.status}.
            <br />
            Ultima verifica: {formatHubDate(place.verified_at)}.
          </p>
          <div className="mt-4 flex flex-wrap gap-3 text-sm">
            <Link to="/alert/segnala" className="rounded-full border border-border px-4 py-2 font-medium">
              Segnala un errore
            </Link>
            <Link to="/jobs/offerte" className="rounded-full border border-border px-4 py-2 font-medium">
              Opportunità in zona
            </Link>
            <Link to="/eventi" className="rounded-full border border-border px-4 py-2 font-medium">
              Eventi del territorio
            </Link>
          </div>
        </BentoCard>
      </BentoGrid>

      <RelatedContent kind="place" id={place.id} />
    </div>
  );
}
