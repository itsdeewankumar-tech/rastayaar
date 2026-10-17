import { createFileRoute, Link } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { AreaPicker } from "@/components/area-picker";
import { RouteStopMap } from "@/components/route-stop-map";
import { planTrip } from "@/lib/trip-planner";
import { CATEGORY_META, type RouteCategory } from "@/data/routes";

export const Route = createFileRoute("/plan")({
  head: () => ({
    meta: [
      { title: "Plan a Bus Trip in Karachi — RastaYaar" },
      {
        name: "description",
        content:
          "Find Karachi bus routes between neighbourhoods, universities and landmarks. Compare direct buses and journeys with up to two transfers.",
      },
      { property: "og:title", content: "Plan a Bus Trip in Karachi — RastaYaar" },
      {
        property: "og:description",
        content: "Karachi public transport trip planner with direct routes and connected journeys using up to three buses.",
      },
      { property: "og:url", content: "/plan" },
    ],
    links: [{ rel: "canonical", href: "/plan" }],
  }),
  component: PlanPage,
});

function fareRange(categories: RouteCategory[]) {
  const ranges = categories.map((category) => {
    const values = CATEGORY_META[category].fare.match(/\d+/g)?.map(Number) ?? [];
    return { min: values[0] ?? 0, max: values.length > 1 ? values[1] : (values[0] ?? 0) };
  });
  const min = ranges.reduce((sum, range) => sum + range.min, 0);
  const max = ranges.reduce((sum, range) => sum + range.max, 0);
  return min === max ? `Estimated total: Rs. ${min}` : `Estimated total: Rs. ${min}–${max}`;
}

function fareFor(categories: RouteCategory[]) {
  return `${categories.map((c) => CATEGORY_META[c].fare).join(" + ")} (${fareRange(categories)})`;
}

function mapsUrl(origin: string, destination: string, mode: "transit" | "walking") {
  return `https://www.google.com/maps/dir/?api=1&origin=${encodeURIComponent(`${origin}, Karachi, Pakistan`)}&destination=${encodeURIComponent(`${destination}, Karachi, Pakistan`)}&travelmode=${mode}&hl=en`;
}

// Only add walking access for explicit, nearby aliases. Do not invent long walks
// to unrelated interchanges such as Tower when the user's destination is elsewhere.
const NEARBY_DESTINATION_ACCESS: Record<string, { stop: string; destination: string }> = {
  "iba karachi": { stop: "Maskan", destination: "IBA Karachi (Main Campus / University Road)" },
  "iba main campus": { stop: "Maskan", destination: "IBA Karachi Main Campus" },
  "iba university road": { stop: "Maskan", destination: "IBA Karachi Main Campus" },
  "iba main campus university road": { stop: "Maskan", destination: "IBA Karachi Main Campus" },
  "iba karachi main campus": { stop: "Maskan", destination: "IBA Karachi Main Campus" },
  "muskan gate": { stop: "Maskan", destination: "Muskan Gate" },
  "maskan gate": { stop: "Maskan", destination: "Maskan Gate" },
};

function accessKey(value: string) {
  return value.toLowerCase().replace(/[^a-z0-9 ]/g, " ").replace(/\s+/g, " ").trim();
}

function getNearbyWalkNote(value: string, side: "origin" | "destination") {
  const access = NEARBY_DESTINATION_ACCESS[accessKey(value)];
  if (!access) return null;
  return side === "origin"
    ? `Walk from ${access.destination} to ${access.stop} to board the bus`
    : `Take the bus to ${access.stop}, then walk to ${access.destination}`;
}


function PlanPage() {
  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");
  const [submitted, setSubmitted] = useState<{ from: string; to: string } | null>(null);
  const [isSearching, setIsSearching] = useState(false);
  const plans = useMemo(
    () => (submitted ? planTrip(submitted.from, submitted.to) : []),
    [submitted],
  );


  return (
    <div className="container-page py-12">
      <h1 className="font-display text-4xl font-bold text-ink">Plan your trip</h1>
      <p className="mt-2 max-w-2xl text-muted-foreground">
        Enter a Karachi area or landmark. RastaYaar ranks all matching recorded journeys from best to least suitable, with the strongest matches first and every available alternative below.
      </p>

      <form
        className="surface-card mt-6 grid gap-4 p-5 sm:grid-cols-[1fr_1fr_auto] sm:items-end"
        onSubmit={(e) => {
          e.preventDefault();
          const nextSearch = { from: from.trim(), to: to.trim() };
          if (!nextSearch.from || !nextSearch.to) return;
          setIsSearching(true);
          // Yield to the browser so the user sees feedback before route calculation.
          window.setTimeout(() => {
            setSubmitted(nextSearch);
            setIsSearching(false);
          }, 180);
        }}
      >
        <AreaPicker
          id="from"
          label="From"
          value={from}
          onChange={setFrom}
          placeholder="e.g. Sultanabad"
        />
        <AreaPicker
          id="to"
          label="To"
          value={to}
          onChange={setTo}
          placeholder="e.g. CBM / IoBM, Korangi Creek"
        />
        <button
          type="submit"
          disabled={!from.trim() || !to.trim() || isSearching}
          aria-busy={isSearching}
          className="inline-flex min-w-[124px] items-center justify-center gap-2 rounded-xl bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground transition-transform enabled:hover:-translate-y-0.5 disabled:cursor-wait disabled:opacity-70"
        >
          {isSearching ? (
            <><span aria-hidden="true" className="h-4 w-4 animate-spin rounded-full border-2 border-current border-r-transparent" /> Searching…</>
          ) : "Find buses"}
        </button>
      </form>


      {isSearching && (
        <section className="surface-card mt-8 p-5 sm:p-6" role="status" aria-live="polite" aria-atomic="true">
          <div className="flex items-start gap-4">
            <div className="trip-loading-badge" aria-hidden="true"><span>🚌</span></div>
            <div className="min-w-0 flex-1">
              <h2 className="font-display text-lg font-bold text-ink">Finding your bus routes<span className="loading-ellipsis" aria-hidden="true"><i>.</i><i>.</i><i>.</i></span></h2>
              <p className="mt-1 text-sm leading-6 text-muted-foreground">Checking recorded routes, possible connections and stop names for <strong>{from.trim()}</strong> to <strong>{to.trim()}</strong>.</p>
            </div>
          </div>
          <div className="trip-loading-track" aria-hidden="true">
            <span className="trip-loading-stop trip-loading-stop-start" />
            <span className="trip-loading-road" />
            <span className="trip-loading-bus">🚌</span>
            <span className="trip-loading-stop trip-loading-stop-end" />
          </div>
          <p className="mt-3 text-center text-xs font-medium text-muted-foreground">RastaYaar is preparing your journey options. Please wait…</p>
        </section>
      )}

      {!isSearching && submitted && plans.length === 0 && (
        <section className="surface-card mt-8 p-5 sm:p-6" aria-live="polite">
          <span className="inline-flex rounded-full bg-secondary px-3 py-1 text-xs font-semibold text-muted-foreground">
            No verified match in RastaYaar's route records
          </span>
          <h2 className="mt-3 font-display text-xl font-bold text-ink">
            Check live transit directions for this journey
          </h2>
          <p className="mt-2 max-w-2xl text-sm leading-6 text-muted-foreground">
            RastaYaar's own route list doesn't currently connect these two places. We've prepared
            the exact journey for Google Maps Transit below so you can check its available public
            transport options instead of having to type the stops again.
          </p>
          {import.meta.env.VITE_GOOGLE_MAPS_EMBED_API_KEY ? (
            <div className="mt-5 overflow-hidden rounded-xl border border-border">
              <iframe
                title={`Google Maps transit directions from ${submitted.from} to ${submitted.to}`}
                width="100%"
                height="420"
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                allowFullScreen
                src={`https://www.google.com/maps/embed/v1/directions?key=${encodeURIComponent(import.meta.env.VITE_GOOGLE_MAPS_EMBED_API_KEY)}&origin=${encodeURIComponent(`${submitted.from}, Karachi, Pakistan`)}&destination=${encodeURIComponent(`${submitted.to}, Karachi, Pakistan`)}&mode=transit&language=en`}
              />
            </div>
          ) : (
            <div className="mt-5 rounded-xl border border-border bg-secondary/40 p-4">
              <p className="text-sm font-semibold text-ink">Inline Google Maps results are not configured yet</p>
              <p className="mt-1 text-sm leading-6 text-muted-foreground">
                Use the one-click live directions now. To display Google's map inside this page, add a Google Maps Embed API key as VITE_GOOGLE_MAPS_EMBED_API_KEY in your local .env file and enable Maps Embed API for that key.
              </p>
            </div>
          )}
          <div className="mt-4 flex flex-wrap gap-3">
            <a
              href={mapsUrl(submitted.from, submitted.to, "transit")}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center rounded-xl bg-primary px-4 py-2.5 text-sm font-semibold text-primary-foreground transition-opacity hover:opacity-90"
            >
              Open live Google Maps transit directions
            </a>
            <a
              href={`https://www.google.com/search?q=${encodeURIComponent(`Karachi public transport bus from ${submitted.from} to ${submitted.to}`)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center rounded-xl border border-border bg-surface px-4 py-2.5 text-sm font-semibold text-ink transition-colors hover:border-primary"
            >
              Search web for this bus journey
            </a>
          </div>
          <p className="mt-3 text-xs leading-5 text-muted-foreground">
            External directions are provided by Google, not verified by RastaYaar. Google may not have transit data for every Karachi stop; check the suggested route and fare before travelling.
          </p>
        </section>
      )}

      {!isSearching && plans.length > 0 && (
        <>
          <h2 className="mt-10 font-display text-xl font-bold text-ink">
            Best {plans.length === 1 ? "journey" : `${plans.length} journeys`} for {submitted!.from} to {submitted!.to}
          </h2>
          <ul className="mt-4 space-y-3">
            {plans.map((plan, i) => (
              <li key={`${plan.legs.map((leg) => leg.route.slug).join('-')}-${i}`} className="surface-card hover-lift p-5">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="rounded-full bg-accent/15 px-2.5 py-1 text-[11px] font-bold uppercase tracking-wide text-accent-foreground">
                    {plan.changes === 0 ? (plan.originWalk ? "1 bus · walk to stop" : "Direct bus") : `${plan.changes} change${plan.changes === 1 ? "" : "s"}`}
                  </span>
                  <span className="text-sm text-muted-foreground">About {plan.hops} stop-to-stop hops</span>
                </div>
                {plan.originWalk && (
                  <div className="mt-3 rounded-lg border border-primary/20 bg-primary/5 px-3 py-2 text-sm text-ink">
                    <span className="font-semibold">Walk to boarding stop:</span> {plan.originWalk.note}
                  </div>
                )}
                <div className="mt-4 space-y-3">
                  {plan.legs.map((leg, legIndex) => (
                    <div key={`${leg.route.slug}-${legIndex}`} className="flex flex-wrap items-center gap-2">
                      <span className="text-xs font-semibold text-muted-foreground">{legIndex + 1}.</span>
                      <Link
                        to="/routes/$slug"
                        params={{ slug: leg.route.slug }}
                        className="rounded-lg px-3 py-1.5 font-display font-bold text-primary-foreground"
                        style={{ backgroundColor: `var(--${CATEGORY_META[leg.route.category].token})` }}
                      >
                        {leg.route.code}
                      </Link>
                      <span className="text-sm text-muted-foreground">{leg.from} → {leg.to}</span>
                      {legIndex < plan.legs.length - 1 && (
                        <span className="rounded-full border border-border px-2 py-1 text-xs text-muted-foreground">Change at {leg.to}</span>
                      )}
                    </div>
                  ))}
                </div>
                <p className="mt-3 text-sm text-ink">
                  <span className="font-semibold">Estimated fare:</span> {fareFor(plan.legs.map((leg) => leg.route.category))}
                </p>
                {(getNearbyWalkNote(submitted!.from, "origin") || getNearbyWalkNote(submitted!.to, "destination")) && (
                  <div className="mt-3 rounded-lg border border-primary/20 bg-primary/5 px-3 py-2 text-sm text-ink">
                    {getNearbyWalkNote(submitted!.from, "origin") && <p><span className="font-semibold">Walk to your boarding stop:</span> {getNearbyWalkNote(submitted!.from, "origin")}.</p>}
                    {getNearbyWalkNote(submitted!.to, "destination") && <p className="mt-1"><span className="font-semibold">Short walk at destination:</span> {getNearbyWalkNote(submitted!.to, "destination")}.</p>}
                  </div>
                )}
                <div className="mt-4 border-t border-border pt-3">
                  <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Stops in travel order</p>
                  <p className="mt-1 text-sm leading-6 text-ink">
                    {plan.legs.flatMap((leg, legIndex) => legIndex === 0 ? leg.stops : leg.stops.slice(1)).map((stop, stopIndex) => `${stopIndex + 1}. ${stop}`).join("  →  ")}
                  </p>
                  <div className="mt-3 flex flex-wrap gap-2">
                    <a href={mapsUrl(submitted!.from, submitted!.to, "transit")} target="_blank" rel="noopener noreferrer" className="rounded-lg border border-border px-3 py-2 text-xs font-semibold text-ink hover:border-primary">Compare with Google Maps Transit</a>
                  </div>
                  <p className="mt-2 text-xs text-muted-foreground">Route order and fares are estimates from RastaYaar's saved records, not live vehicle tracking. Confirm the route and fare locally before travelling.</p>
                </div>
              </li>
            ))}
          </ul>
        </>
      )}

      {!isSearching && submitted && plans.length > 0 && (() => {
        const best = plans[0];
        const legs = best.legs.map((leg, index) => ({
          code: leg.route.code,
          stops: leg.stops,
          color: ["#0f766e", "#2563eb", "#9333ea"][index % 3],
        }));
        return <RouteStopMap from={submitted.from} to={submitted.to} legs={legs} />;
      })()}
    </div>
  );
}
