import { useEffect, useMemo, useRef, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Link } from "@tanstack/react-router";
import { ArrowRight, Layers3, MapPinned } from "lucide-react";
import "maplibre-gl/dist/maplibre-gl.css";
import maplibreWorkerUrl from "maplibre-gl/dist/maplibre-gl-worker.mjs?worker&url";

import { isSupabaseConfigured, supabase } from "@/integrations/supabase/client";

type MapPlace = {
  id: string;
  slug: string;
  name: string;
  category: string;
  comune: string;
  province: string | null;
  address: string | null;
  latitude: number;
  longitude: number;
};

const MAP_CENTER: [number, number] = [8.35, 45.55];
const MAP_STYLE = "https://tiles.openfreemap.org/styles/liberty";

function usePublishedPlaces() {
  return useQuery({
    queryKey: ["home", "imland-map", "published-places"],
    enabled: isSupabaseConfigured(),
    staleTime: 5 * 60_000,
    queryFn: async (): Promise<MapPlace[]> => {
      const { data, error } = await supabase
        .from("terrain_places")
        .select("id, slug, name, category, comune, province, address, latitude, longitude")
        .eq("status", "published")
        .not("latitude", "is", null)
        .not("longitude", "is", null)
        .order("plan", { ascending: false })
        .order("name", { ascending: true })
        .limit(300);

      if (error) throw error;

      return (data ?? []).flatMap((place) => {
        const latitude = Number(place.latitude);
        const longitude = Number(place.longitude);
        if (!Number.isFinite(latitude) || !Number.isFinite(longitude)) return [];
        return [{ ...place, latitude, longitude }];
      });
    },
  });
}

export function ImLandMap() {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const mapRef = useRef<import("maplibre-gl").Map | null>(null);
  const markersRef = useRef<import("maplibre-gl").Marker[]>([]);
  const [mapReady, setMapReady] = useState(false);
  const [activeCategory, setActiveCategory] = useState("Tutte");
  const { data = [], isLoading, isError } = usePublishedPlaces();

  const categories = useMemo(
    () => ["Tutte", ...Array.from(new Set(data.map((place) => place.category))).sort()],
    [data],
  );
  const visiblePlaces = useMemo(
    () =>
      activeCategory === "Tutte"
        ? data
        : data.filter((place) => place.category === activeCategory),
    [activeCategory, data],
  );

  useEffect(() => {
    let cancelled = false;
    void (async () => {
      const maplibre = await import("maplibre-gl");
      if (cancelled || !containerRef.current || mapRef.current) return;
      maplibre.setWorkerUrl(maplibreWorkerUrl);

      const map = new maplibre.Map({
        container: containerRef.current,
        style: MAP_STYLE,
        center: MAP_CENTER,
        zoom: 7.7,
        minZoom: 6,
        maxZoom: 17,
        attributionControl: false,
      });
      map.addControl(new maplibre.NavigationControl({ showCompass: false }), "bottom-right");
      map.addControl(
        new maplibre.AttributionControl({ compact: true, customAttribution: "IMLAND Map" }),
        "bottom-left",
      );
      map.scrollZoom.disable();
      map.once("load", () => {
        if (!cancelled) setMapReady(true);
      });
      mapRef.current = map;
    })();

    return () => {
      cancelled = true;
      markersRef.current.forEach((marker) => marker.remove());
      markersRef.current = [];
      mapRef.current?.remove();
      mapRef.current = null;
    };
  }, []);

  useEffect(() => {
    const map = mapRef.current;
    if (!mapReady || !map) return;

    markersRef.current.forEach((marker) => marker.remove());
    markersRef.current = [];

    void (async () => {
      const maplibre = await import("maplibre-gl");
      const bounds = new maplibre.LngLatBounds();

      visiblePlaces.forEach((place) => {
        const markerElement = document.createElement("button");
        markerElement.type = "button";
        markerElement.className = "imland-map-marker";
        markerElement.setAttribute("aria-label", `Apri ${place.name} sulla mappa`);
        markerElement.appendChild(document.createElement("span"));

        const popupContent = document.createElement("article");
        popupContent.className = "imland-map-popup";
        const category = document.createElement("p");
        category.className = "imland-map-popup__category";
        category.textContent = place.category;
        const title = document.createElement("h3");
        title.textContent = place.name;
        const address = document.createElement("p");
        address.textContent = [place.address, place.comune, place.province]
          .filter(Boolean)
          .join(" · ");
        const link = document.createElement("a");
        link.href = `/terrain/${encodeURIComponent(place.slug)}`;
        link.textContent = "Apri la scheda →";
        popupContent.append(category, title, address, link);

        const marker = new maplibre.Marker({ element: markerElement, anchor: "bottom" })
          .setLngLat([place.longitude, place.latitude])
          .setPopup(
            new maplibre.Popup({ offset: 22, closeButton: false, maxWidth: "280px" }).setDOMContent(
              popupContent,
            ),
          )
          .addTo(map);
        markersRef.current.push(marker);
        bounds.extend([place.longitude, place.latitude]);
      });

      if (visiblePlaces.length > 0) {
        map.fitBounds(bounds, { padding: 70, maxZoom: 12, duration: 700 });
      } else {
        map.easeTo({ center: MAP_CENTER, zoom: 7.7, duration: 600 });
      }
    })();
  }, [mapReady, visiblePlaces]);

  return (
    <section id="imland-map" className="imland-map-card" aria-labelledby="imland-map-title">
      <div className="imland-map-card__intro">
        <div>
          <p className="imland-map-card__eyebrow">
            <MapPinned aria-hidden /> IMLAND Map
          </p>
          <h2 id="imland-map-title">Il territorio, tutto in un punto.</h2>
          <p>
            Esplora Member, attività e luoghi selezionati: scegli una categoria e apri ogni
            segnaposto per scoprire chi anima il territorio.
          </p>
        </div>
        <Link to="/terrain" className="imland-map-card__cta">
          Esplora il territorio <ArrowRight aria-hidden />
        </Link>
      </div>

      <div className="imland-map-card__filters" aria-label="Filtra i luoghi per categoria">
        <span>
          <Layers3 aria-hidden /> Categorie
        </span>
        <div>
          {categories.map((category) => (
            <button
              key={category}
              type="button"
              aria-pressed={activeCategory === category}
              onClick={() => setActiveCategory(category)}
            >
              {category}
            </button>
          ))}
        </div>
        <strong>
          {isLoading
            ? "Caricamento…"
            : `${visiblePlaces.length} ${visiblePlaces.length === 1 ? "luogo" : "luoghi"}`}
        </strong>
      </div>

      <div className="imland-map-card__canvas-wrap">
        <div className="imland-map-card__fallback" aria-hidden>
          <span className="imland-map-card__city imland-map-card__city--biella">Biella</span>
          <span className="imland-map-card__city imland-map-card__city--vercelli">Vercelli</span>
          <span className="imland-map-card__city imland-map-card__city--novara">Novara</span>
          <span className="imland-map-card__city imland-map-card__city--vco">Verbano · Cusio · Ossola</span>
        </div>
        <div
          ref={containerRef}
          className="imland-map-card__canvas"
          role="region"
          aria-label="Mappa interattiva delle attività IMLAND"
        />
        {!isLoading && (isError || !isSupabaseConfigured()) ? (
          <div className="imland-map-card__notice">
            La mappa è pronta. I segnaposti appariranno quando il collegamento dati sarà attivo.
          </div>
        ) : null}
        {!isLoading && !isError && isSupabaseConfigured() && data.length === 0 ? (
          <div className="imland-map-card__notice">
            Le prime attività con posizione verificata compariranno qui.
          </div>
        ) : null}
      </div>
    </section>
  );
}
