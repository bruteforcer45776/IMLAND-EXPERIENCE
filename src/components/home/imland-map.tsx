import { useEffect, useMemo, useRef, useState } from "react";
import { Link } from "@tanstack/react-router";
import { ArrowRight, Layers3, MapPinned } from "lucide-react";
import "maplibre-gl/dist/maplibre-gl.css";
import maplibreWorkerUrl from "maplibre-gl/dist/maplibre-gl-worker.mjs?worker&url";

import { memberWall } from "@/routes/member";

const MAP_CENTER: [number, number] = [8.35, 45.55];
const MAP_STYLE = "https://tiles.openfreemap.org/styles/liberty";

export function ImLandMap() {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const mapRef = useRef<import("maplibre-gl").Map | null>(null);
  const markersRef = useRef<import("maplibre-gl").Marker[]>([]);
  const [mapReady, setMapReady] = useState(false);
  const [activeCategory, setActiveCategory] = useState("Tutte");

  const locatedMembers = useMemo(
    () =>
      memberWall.flatMap((member) =>
        member.addresses.flatMap((location) =>
          location.coordinates ? [{ ...location, coordinates: location.coordinates, member }] : [],
        ),
      ),
    [],
  );

  const categories = useMemo(
    () => ["Tutte", ...Array.from(new Set(locatedMembers.map(({ member }) => member.category))).sort()],
    [locatedMembers],
  );
  const visibleLocations = useMemo(
    () =>
      activeCategory === "Tutte"
        ? locatedMembers
        : locatedMembers.filter(({ member }) => member.category === activeCategory),
    [activeCategory, locatedMembers],
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
      mapRef.current = map;
      map.once("load", () => setMapReady(true));
    })();

    return () => {
      cancelled = true;
      markersRef.current.forEach((marker) => marker.remove());
      markersRef.current = [];
      mapRef.current?.remove();
      mapRef.current = null;
      setMapReady(false);
    };
  }, []);

  useEffect(() => {
    const map = mapRef.current;
    if (!map || !mapReady) return;

    markersRef.current.forEach((marker) => marker.remove());
    markersRef.current = [];

    void import("maplibre-gl").then((maplibre) => {
      if (!mapRef.current) return;
      const bounds = new maplibre.LngLatBounds();

      markersRef.current = visibleLocations.map(({ member, label, address, coordinates }) => {
        const markerButton = document.createElement("button");
        markerButton.type = "button";
        markerButton.className = "imland-map-marker";
        markerButton.setAttribute("aria-label", `Apri ${member.name}, ${label}`);

        const markerImage = document.createElement("img");
        markerImage.src = member.cover;
        markerImage.alt = "";
        markerButton.append(markerImage);

        const popupContent = document.createElement("article");
        popupContent.className = "imland-map-popup";

        const popupImage = document.createElement("img");
        popupImage.className = "imland-map-popup__image";
        popupImage.src = member.cover;
        popupImage.alt = "";

        const popupCopy = document.createElement("div");
        const popupCategory = document.createElement("p");
        popupCategory.className = "imland-map-popup__category";
        popupCategory.textContent = member.category;
        const popupTitle = document.createElement("h3");
        popupTitle.textContent = member.name;
        const popupLabel = document.createElement("strong");
        popupLabel.textContent = label;
        const popupAddress = document.createElement("p");
        popupAddress.textContent = address;
        popupCopy.append(popupCategory, popupTitle, popupLabel, popupAddress);

        if (member.url) {
          const popupLink = document.createElement("a");
          popupLink.href = member.url;
          popupLink.target = "_blank";
          popupLink.rel = "noopener noreferrer";
          popupLink.textContent = "Scopri il Member →";
          popupCopy.append(popupLink);
        }
        popupContent.append(popupImage, popupCopy);

        const popup = new maplibre.Popup({ offset: 30, closeButton: true, maxWidth: "320px" })
          .setDOMContent(popupContent);
        const marker = new maplibre.Marker({ element: markerButton, anchor: "bottom" })
          .setLngLat(coordinates)
          .setPopup(popup)
          .addTo(map);
        bounds.extend(coordinates);
        return marker;
      });

      if (!bounds.isEmpty()) {
        map.fitBounds(bounds, { padding: 74, maxZoom: 11.6, duration: 700 });
      }
    });

    return () => {
      markersRef.current.forEach((marker) => marker.remove());
      markersRef.current = [];
    };
  }, [mapReady, visibleLocations]);

  return (
    <section id="imland-map" className="imland-map-card" aria-labelledby="imland-map-title">
      <div className="imland-map-card__intro">
        <div>
          <p className="imland-map-card__eyebrow">
            <MapPinned aria-hidden /> IMLAND Map
          </p>
          <h2 id="imland-map-title">Il territorio, tutto in un punto.</h2>
          <p>
            Esplora le aziende, i professionisti e le associazioni della rete IMLAND Member.
            Scegli una categoria e apri direttamente la realtà che vuoi conoscere.
          </p>
        </div>
        <Link to="/member" hash="member-wall" className="imland-map-card__cta">
          Tutti i Member <ArrowRight aria-hidden />
        </Link>
      </div>

      <div className="imland-map-card__filters" aria-label="Filtra i Member per categoria">
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
          {visibleLocations.length} {visibleLocations.length === 1 ? "sede" : "sedi"}
        </strong>
      </div>

      <p className="imland-map-card__notice">
        La mappa mostra solo le sedi con coordinate cartografiche già verificate. Tutti gli
        indirizzi disponibili, comprese le sedi multiple, sono riportati nelle schede Member.
      </p>

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
          aria-label="Mappa della rete IMLAND Member"
        />
        <div className="imland-map-card__map-hint" aria-live="polite">
          <strong>{visibleLocations.length} sedi verificate</strong>
          <span>Tocca una foto sulla mappa per vedere Member, indirizzo e link.</span>
        </div>
      </div>
    </section>
  );
}
