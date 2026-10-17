import { useEffect, useRef } from "react";

type RouteLeg = { code: string; stops: string[]; color: string };

type Props = { from: string; to: string; legs: RouteLeg[] };

type LatLng = [number, number];

// Coordinates are maintained explicitly. Do not invent positions for unmapped stops.
// Expand this registry as verified stop coordinates become available.
const STOP_COORDS: Record<string, LatLng> = {
  "sultanabad": [24.8668, 67.0125],
  "tower": [24.8508, 67.0090],
  "maskan": [24.9417, 67.1137],
  "muskan gate": [24.9417, 67.1137],
  "maskan gate": [24.9417, 67.1137],
  "al-asif square": [24.9826, 67.0664],
  "al asif square": [24.9826, 67.0664],
  "scout colony": [24.9692, 67.0736],
  "new sabzi mandi": [25.0055, 67.0718],
  "sohrab goth": [24.9875, 67.0660],
  "nipa chorangi": [24.9238, 67.0976],
  "nipa": [24.9238, 67.0976],
  "gulshan chorangi": [24.9200, 67.0880],
  "urdu college": [24.9168, 67.0838],
  "hasan square": [24.8915, 67.0857],
  "essa nagri": [24.8894, 67.0795],
  "ghareebabad": [24.9025, 67.0555],
  "liaqatabad 10": [24.9117, 67.0460],
  "no.4": [24.9150, 67.0400],
  "petrol pump": [24.9184, 67.0337],
  "nazimabad 2": [24.9232, 67.0202],
  "habib bank": [24.9250, 67.0135],
  "sadar": [24.8554, 67.0208],
  "jail chorangi": [24.8777, 67.0638],
  "new town": [24.8795, 67.0647],
  "numaish": [24.8740, 67.0322],
  "taj complex": [24.8648, 67.0272],
  "reagal": [24.8580, 67.0252],
  "civil hospital": [24.8740, 67.0130],
  "light house": [24.8587, 67.0150],
  "city court": [24.8615, 67.0097],
  "boulton market": [24.8565, 67.0095],
  "jama cloth": [24.8560, 67.0182],
  "plaza": [24.8610, 67.0240],
  "airport": [24.9065, 67.1608],
  "star gate": [24.8850, 67.1602],
  "drigh road": [24.8830, 67.1132],
  "karsaz": [24.8777, 67.0960],
  "national stadium": [24.8930, 67.0820],
  "university": [24.9410, 67.1145],
  "safari park": [24.9280, 67.0952],
  "mosmiat": [24.9470, 67.1168],
  "safora goth": [24.9565, 67.1385],
  "saforah goth": [24.9565, 67.1385],
  "water pump": [24.9415, 67.0648],
  "ayesha manzil": [24.9260, 67.0650],
  "karimabad": [24.9167, 67.0658],
  "board office": [24.9308, 67.0333],
  "sakhi hasan": [24.9563, 67.0340],
  "nagan chorangi": [24.9705, 67.0570],
  "korangi crossing": [24.8312, 67.1218],
  "qayoomabad": [24.8348, 67.0905],
  "defence mor": [24.8460, 67.0725],
  "nursery": [24.8665, 67.0645],
  "tariq road": [24.8732, 67.0648],
};

function key(value: string) {
  return value.toLowerCase().replace(/[^a-z0-9. ]/g, " ").replace(/\s+/g, " ").trim();
}

function loadLeaflet(): Promise<void> {
  return new Promise((resolve, reject) => {
    if (typeof window === "undefined") return resolve();
    const w = window as Window & { L?: any };
    if (w.L) return resolve();
    if (!document.querySelector('link[data-rastayaar-leaflet="css"]')) {
      const link = document.createElement("link");
      link.rel = "stylesheet";
      link.href = "https://unpkg.com/leaflet@1.9.4/dist/leaflet.css";
      link.dataset.rastayaarLeaflet = "css";
      document.head.appendChild(link);
    }
    const existing = document.querySelector('script[data-rastayaar-leaflet="js"]') as HTMLScriptElement | null;
    if (existing) {
      existing.addEventListener("load", () => resolve(), { once: true });
      existing.addEventListener("error", () => reject(new Error("Could not load map library")), { once: true });
      if (w.L) resolve();
      return;
    }
    const script = document.createElement("script");
    script.src = "https://unpkg.com/leaflet@1.9.4/dist/leaflet.js";
    script.async = true;
    script.dataset.rastayaarLeaflet = "js";
    script.onload = () => resolve();
    script.onerror = () => reject(new Error("Could not load map library"));
    document.head.appendChild(script);
  });
}

export function RouteStopMap({ from, to, legs }: Props) {
  const mapNode = useRef<HTMLDivElement>(null);
  const mapRef = useRef<any>(null);
  const layerRef = useRef<any>(null);
  const stopNames = legs.flatMap((leg) => leg.stops);
  const mapped = stopNames.map((name) => ({ name, coords: STOP_COORDS[key(name)] })).filter((x) => x.coords);
  const missing = [...new Set(stopNames.filter((name) => !STOP_COORDS[key(name)]))];

  useEffect(() => {
    let cancelled = false;
    loadLeaflet().then(() => {
      if (cancelled || !mapNode.current) return;
      const L = (window as Window & { L: any }).L;
      if (!mapRef.current) {
        mapRef.current = L.map(mapNode.current, { scrollWheelZoom: false });
        // Use OpenStreetMap's standard raster tiles directly: no CARTO API key is needed.
        // Keep visible attribution and follow the OSM tile usage policy; this is not an unlimited tile service.
        const tiles = L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
          maxZoom: 19,
          attribution: '&copy; <a href="https://www.openstreetmap.org/copyright" target="_blank" rel="noreferrer">OpenStreetMap contributors</a>',
        });
        tiles.addTo(mapRef.current);
      }
      const map = mapRef.current;
      if (layerRef.current) layerRef.current.remove();
      const group = L.featureGroup();
      const legsWithStops = legs.map((leg) => ({ ...leg, points: leg.stops.map((name) => ({ name, coords: STOP_COORDS[key(name)] })).filter((s) => s.coords) }));
      legsWithStops.forEach((leg) => {
        const points = leg.points.map((p) => p.coords);
        if (points.length > 1) L.polyline(points, { color: leg.color, weight: 5, opacity: 0.85 }).addTo(group);
        leg.points.forEach((point, index) => {
          const marker = L.circleMarker(point.coords, {
            radius: 6, color: "#ffffff", weight: 2, fillColor: leg.color, fillOpacity: 1,
          }).bindPopup(`<strong>${point.name}</strong><br/>Bus ${leg.code}<br/>Mapped stop ${index + 1} on this leg`);
          marker.addTo(group);
        });
      });
      group.addTo(map);
      layerRef.current = group;
      const bounds = group.getBounds();
      if (bounds.isValid()) map.fitBounds(bounds.pad(0.15), { maxZoom: 13 });
      else map.setView([24.9, 67.05], 11);
      setTimeout(() => map.invalidateSize(), 0);
    }).catch(() => {
      // The explanatory fallback remains visible if the map library cannot load.
    });
    return () => { cancelled = true; };
  }, [from, to, legs]);

  return (
    <section className="surface-card mt-8 overflow-hidden" aria-label="RastaYaar route stop map">
      <div className="p-5">
        <h2 className="font-display text-xl font-bold text-ink">Route stops on the map</h2>
        <p className="mt-1 text-sm text-muted-foreground">{from} → {to} · colored lines connect stops whose coordinates are currently mapped. Select a dot to see its stop name and bus.</p>
        <a
          className="mt-3 inline-flex items-center rounded-lg border border-border bg-surface px-3 py-2 text-sm font-semibold text-ink transition-colors hover:border-primary hover:text-primary"
          href={`https://www.google.com/maps/dir/?api=1&origin=${encodeURIComponent(`${from}, Karachi, Pakistan`)}&destination=${encodeURIComponent(`${to}, Karachi, Pakistan`)}&travelmode=transit&hl=en`}
          target="_blank"
          rel="noopener noreferrer"
          lang="en"
        >
          Open full map in English ↗
        </a>
        <div className="mt-3 flex flex-wrap gap-3 text-xs">
          {legs.map((leg) => <span key={leg.code} className="inline-flex items-center gap-2"><span className="inline-block h-2.5 w-2.5 rounded-full" style={{ backgroundColor: leg.color }} />Bus {leg.code}</span>)}
        </div>
      </div>
      <div ref={mapNode} className="h-[340px] w-full bg-secondary sm:h-[440px]" />
      <div className="border-t border-border px-5 py-4">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <h3 className="text-sm font-bold text-ink">Stops on this journey</h3>
          <span className="text-xs text-muted-foreground">{mapped.length} mapped dot(s) · {missing.length} need coordinates</span>
        </div>
        <p className="mt-1 text-xs leading-5 text-muted-foreground">
          Every stop in the selected route is listed below. A dot appears only when that stop has a registered coordinate; stops without verified coordinates are not placed at guessed locations. Lines are straight visual links between mapped stops, not verified road-following bus paths.
        </p>
        <div className="mt-3 space-y-4">
          {legs.map((leg) => (
            <div key={leg.code}>
              <p className="mb-2 text-xs font-bold uppercase tracking-wide text-muted-foreground">Bus {leg.code}</p>
              <ol className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
                {leg.stops.map((stop, index) => {
                  const hasCoordinates = Boolean(STOP_COORDS[key(stop)]);
                  return (
                    <li key={`${leg.code}-${index}-${stop}`} className="flex min-w-0 items-start gap-2 rounded-lg border border-border px-3 py-2 text-sm">
                      <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full text-[10px] font-bold text-white" style={{ backgroundColor: hasCoordinates ? leg.color : "#9ca3af" }}>{index + 1}</span>
                      <span className="min-w-0 flex-1">
                        <span className="block break-words text-ink">{stop}</span>
                        <span className="block text-[11px] text-muted-foreground">{hasCoordinates ? "Shown on map" : "Coordinate needed"}</span>
                      </span>
                    </li>
                  );
                })}
              </ol>
            </div>
          ))}
        </div>
        <p className="mt-4 text-xs leading-5 text-muted-foreground">
          {missing.length > 0 ? `${missing.length} stop(s) need coordinates before they can have map dots: ${[...new Set(missing)].slice(0, 12).join(", ")}${new Set(missing).size > 12 ? "…" : ""}.` : "All stops in this trip have registered coordinates."} Verify route details before travelling. Map tiles © OpenStreetMap contributors.
        </p>
      </div>
    </section>
  );
}
