import { useEffect, useMemo, useRef, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import "leaflet/dist/leaflet.css";

import { isSupabaseConfigured, supabase } from "@/integrations/supabase/client";
import { ALERT_STATUS_LABEL, formatHubDate } from "@/lib/hub";

type MapPoint = {
  id: string;
  kind: "place" | "alert";
  title: string;
  subtitle: string;
  comune: string;
  lat: number;
  lon: number;
  href: string | null;
};

const CENTER: [number, number] = [45.55, 8.35];

/** Luoghi pubblicati e segnalazioni pubbliche con una posizione sulla mappa. */
function useMapPoints() {
  return useQuery({
    queryKey: ["terrain", "map", "points"],
    enabled: isSupabaseConfigured(),
    staleTime: 60_000,
    queryFn: async (): Promise<MapPoint[]> => {
      const [places, alerts] = await Promise.all([
        supabase
          .from("terrain_places")
          .select("id, slug, name, category, comune, latitude, longitude")
          .eq("status", "published")
          .not("latitude", "is", null)
          .limit(300),
        supabase
          .from("territory_alerts")
          .select("id, code, title, category, comune, status, created_at, latitude, longitude")
          .eq("state", "published")
          .not("latitude", "is", null)
          .limit(300),
      ]);
      if (places.error) throw places.error;
      if (alerts.error) throw alerts.error;

      const placePoints: MapPoint[] = (places.data ?? []).map((p) => ({
        id: `place-${p.id}`,
        kind: "place",
        title: p.name,
        subtitle: p.category ?? "Luogo del territorio",
        comune: p.comune,
        lat: Number(p.latitude),
        lon: Number(p.longitude),
        href: p.slug ? `/terrain/${p.slug}` : null,
      }));

      const alertPoints: MapPoint[] = (alerts.data ?? []).map((a) => ({
        id: `alert-${a.id}`,
        kind: "alert",
        title: a.title,
        subtitle: `${a.category ?? "Segnalazione"} · ${ALERT_STATUS_LABEL[a.status ?? ""] ?? "Pubblicata"} · ${formatHubDate(a.created_at)}`,
        comune: a.comune,
        lat: Number(a.latitude),
        lon: Number(a.longitude),
        href: "/alert",
      }));

      return [...placePoints, ...alertPoints];
    },
  });
}

type Filter = "all" | "alert" | "place";

export function TerrainLiveMap() {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const mapRef = useRef<import("leaflet").Map | null>(null);
  const layerRef = useRef<import("leaflet").LayerGroup | null>(null);
  const [ready, setReady] = useState(false);
  const [filter, setFilter] = useState<Filter>("all");
  const { data, isLoading } = useMapPoints();

  const points = useMemo(
    () => (data ?? []).filter((p) => (filter === "all" ? true : p.kind === filter)),
    [data, filter],
  );

  // La mappa vive solo nel browser: Leaflet viene caricato dopo l'idratazione.
  useEffect(() => {
    let cancelled = false;
    void (async () => {
      const L = await import("leaflet");
      if (cancelled || !containerRef.current || mapRef.current) return;
      const map = L.map(containerRef.current, {
        center: CENTER,
        zoom: 11,
        scrollWheelZoom: false,
        zoomControl: false,
      });
      L.tileLayer(
        "https://server.arcgisonline.com/ArcGIS/rest/services/Canvas/World_Light_Gray_Base/MapServer/tile/{z}/{y}/{x}",
        {
          attribution:
            '&copy; <a href="https://www.esri.com/">Esri</a> &mdash; Esri, DeLorme, NAVTEQ',
          maxZoom: 16,
        },
      ).addTo(map);
      L.control.zoom({ position: "bottomright" }).addTo(map);
      layerRef.current = L.layerGroup().addTo(map);
      mapRef.current = map;
      setReady(true);
    })();
    return () => {
      cancelled = true;
      mapRef.current?.remove();
      mapRef.current = null;
      layerRef.current = null;
    };
  }, []);

  useEffect(() => {
    if (!ready) return;
    void (async () => {
      const L = await import("leaflet");
      const layer = layerRef.current;
      const map = mapRef.current;
      if (!layer || !map) return;
      layer.clearLayers();

      points.forEach((p) => {
        const color = p.kind === "alert" ? "#FF0000" : "#A0522D";
        const icon = L.divIcon({
          className: "",
          html: `<span style="display:block;width:22px;height:22px;border-radius:9999px;background:${color};box-shadow:0 0 0 4px #fff,0 4px 14px rgba(0,0,0,.35)"></span>`,
          iconSize: [22, 22],
          iconAnchor: [11, 11],
        });
        const popup = `
          <div style="font-family:system-ui,-apple-system,sans-serif;line-height:1.35">
            <strong style="font-size:14px;display:block;color:#111">${p.title}</strong>
            <span style="font-size:12px;color:#666">${p.comune}</span>
            ${p.href ? `<br/><a href="${p.href}" style="font-size:12px;font-weight:600;color:${color};text-decoration:none">Apri la scheda &rarr;</a>` : ""}
          </div>
        `;
        L.marker([p.lat, p.lon], { icon })
          .addTo(layer)
          .bindPopup(popup, { maxWidth: 240, closeButton: false });
      });

      if (points.length > 0) {
        map.fitBounds(
          L.latLngBounds(points.map((p) => [p.lat, p.lon] as [number, number])).pad(0.25),
          { maxZoom: 13 },
        );
      } else {
        map.setView(CENTER, 11);
      }
    })();
  }, [points, ready]);

  const filters: { value: Filter; label: string }[] = [
    { value: "all", label: "Tutto" },
    { value: "alert", label: "Segnalazioni" },
    { value: "place", label: "Luoghi" },
  ];

  return (
    <div className="glass-panel overflow-hidden rounded-3xl">
      <div className="flex flex-wrap items-center gap-2 border-b border-black/10 p-4">
        {filters.map((f) => (
          <button
            key={f.value}
            type="button"
            onClick={() => setFilter(f.value)}
            className={`rounded-full px-4 py-2 text-xs font-semibold transition ${
              filter === f.value
                ? "bg-signal text-white"
                : "bg-foreground/5 text-foreground/70 hover:bg-foreground/10"
            }`}
          >
            {f.label}
          </button>
        ))}
        <span className="ml-auto text-xs text-muted-foreground">
          {isLoading
            ? "Carico la mappa…"
            : `${points.length} ${points.length === 1 ? "punto" : "punti"}`}
        </span>
      </div>
      <div className="relative">
        <div ref={containerRef} className="h-[420px] w-full md:h-[520px]" />
        {!isLoading && points.length === 0 ? (
          <div className="pointer-events-none absolute inset-x-4 bottom-4 rounded-2xl bg-background/90 p-4 text-sm text-muted-foreground shadow-lg">
            Ancora nessun punto pubblicato in questa vista. Le prime segnalazioni e le prime schede
            verificate compariranno qui.
          </div>
        ) : null}
      </div>
    </div>
  );
}

export default TerrainLiveMap;
