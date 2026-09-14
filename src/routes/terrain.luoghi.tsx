import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { Heart, LocateFixed, MapPin, Search } from "lucide-react";

import { canonical } from "../lib/seo";
import { BentoGrid, BentoCard } from "../components/bento";
import { useGeolocation, usePlaces, useTerrainFavorites } from "@/hooks/use-hub";
import { useAuth } from "@/hooks/use-auth";
import { HUB_COMUNI, TERRAIN_CATEGORIES } from "@/lib/hub";

export const Route = createFileRoute("/terrain/luoghi")({
  head: () => ({
    meta: [
      { title: "Cerca luoghi e attività del territorio — TERRAIN" },
      {
        name: "description",
        content:
          "Cerca attività, luoghi e realtà del territorio per Comune, categoria o vicino a te. TERRAIN è la mappa dell'Hub IMLAND.",
      },
      { property: "og:title", content: "Cerca luoghi e attività del territorio — TERRAIN" },
      { property: "og:description", content: "Tutto il territorio, vicino a te." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
    links: [canonical("/terrain/luoghi")],
  }),
  component: TerrainSearch,
});

function TerrainSearch() {
  const { user } = useAuth();
  const [q, setQ] = useState("");
  const [category, setCategory] = useState("");
  const [comune, setComune] = useState("");
  const [radiusKm, setRadiusKm] = useState<number | null>(25);
  const geo = useGeolocation();
  const { places, isLoading, isError, refetch } = usePlaces(
    { q, category, comune, radiusKm },
    geo.coords,
  );
  const favorites = useTerrainFavorites();

  return (
    <div className="terrain-inverted page-inverted">
      <div className="container-im section-pad-sm">
        <p className="text-xs font-semibold uppercase tracking-[0.18em] opacity-80">TERRAIN</p>
        <h1 className="mt-2 text-h1-im">Cerca nel territorio.</h1>
        <p className="mt-3 max-w-2xl opacity-90">
          Filtra per Comune e categoria oppure usa la tua posizione.
          <br />
          Trovi soltanto schede verificate dalla redazione.
        </p>

        <div className="mt-8 rounded-3xl bg-white p-5 text-foreground shadow-sm">
          <div className="grid gap-3 md:grid-cols-4">
            <label className="md:col-span-2 flex items-center gap-2 rounded-full border border-border px-4">
              <Search size={16} className="text-muted-foreground" />
              <input
                value={q}
                onChange={(e) => setQ(e.target.value)}
                maxLength={80}
                placeholder="Nome o parola chiave"
                aria-label="Cerca per nome"
                className="h-11 w-full bg-transparent text-sm outline-none"
              />
            </label>
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
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              aria-label="Categoria"
              className="h-11 rounded-full border border-border bg-background px-4 text-sm"
            >
              <option value="">Tutte le categorie</option>
              {TERRAIN_CATEGORIES.map((c) => (
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
              {geo.loading
                ? "Cerco la posizione…"
                : geo.coords
                  ? "Non usare la posizione"
                  : "Vicino a me"}
            </button>
            {geo.coords && (
              <select
                value={String(radiusKm ?? "")}
                onChange={(e) => setRadiusKm(e.target.value ? Number(e.target.value) : null)}
                aria-label="Distanza massima"
                className="h-10 rounded-full border border-border bg-background px-4 text-sm"
              >
                {[5, 10, 25, 50].map((km) => (
                  <option key={km} value={km}>
                    Entro {km} km
                  </option>
                ))}
                <option value="">Qualsiasi distanza</option>
              </select>
            )}
            {geo.error && <span className="text-sm text-muted-foreground">{geo.error}</span>}
            <Link
              to="/terrain/nuova"
              className="ml-auto inline-flex rounded-full bg-primary px-5 py-2 text-sm font-medium text-primary-foreground"
            >
              Proponi una scheda
            </Link>
          </div>
        </div>

        <div className="mt-10">
          {isLoading ? (
            <p className="opacity-90">Carico i luoghi…</p>
          ) : isError ? (
            <div className="rounded-3xl bg-white p-6 text-foreground">
              <p className="font-medium">Non riusciamo a caricare i luoghi.</p>
              <button
                type="button"
                onClick={() => void refetch()}
                className="mt-3 inline-flex rounded-full bg-primary px-5 py-2 text-sm text-primary-foreground"
              >
                Riprova
              </button>
            </div>
          ) : places.length === 0 ? (
            <div className="rounded-3xl bg-white p-6 text-foreground">
              <p className="font-medium">Nessun luogo trovato con questi filtri.</p>
              <p className="mt-2 text-sm text-muted-foreground">
                Prova ad allargare la distanza o a cambiare Comune.
                <br />
                Puoi anche proporre tu una nuova scheda del territorio.
              </p>
            </div>
          ) : (
            <BentoGrid>
              {places.map((place) => (
                <BentoCard key={place.id} tone="terrain" span={2}>
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                        {place.category}
                      </p>
                      <h2 className="mt-1 text-lg font-semibold">
                        <Link to="/terrain/$slug" params={{ slug: place.slug }}>
                          {place.name}
                        </Link>
                      </h2>
                    </div>
                    {user && (
                      <button
                        type="button"
                        aria-label={
                          favorites.ids.has(place.id)
                            ? "Togli dai preferiti"
                            : "Salva nei preferiti"
                        }
                        onClick={() => favorites.toggle.mutate(place.id)}
                        className="rounded-full p-2 text-muted-foreground hover:text-foreground"
                      >
                        <Heart
                          size={18}
                          fill={favorites.ids.has(place.id) ? "currentColor" : "none"}
                        />
                      </button>
                    )}
                  </div>
                  <p className="mt-2 flex items-center gap-1.5 text-sm text-muted-foreground">
                    <MapPin size={14} /> {place.comune}
                    {place.distance != null ? ` · ${place.distance.toFixed(1)} km` : ""}
                  </p>
                  {place.description && (
                    <p className="mt-3 line-clamp-3 text-sm text-muted-foreground">
                      {place.description}
                    </p>
                  )}
                  <Link
                    to="/terrain/$slug"
                    params={{ slug: place.slug }}
                    className="mt-4 inline-flex text-sm font-medium underline"
                  >
                    Apri la scheda
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
