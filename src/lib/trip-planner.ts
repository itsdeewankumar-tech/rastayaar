import { ROUTES, CATEGORY_META, type BusRoute } from "@/data/routes";
import { canonicalPlace } from "@/data/places";

export interface PlanLeg {
  route: BusRoute;
  from: string;
  to: string;
  stops: string[];
}
export interface TripPlan {
  kind: "direct" | "transfer" | "multi-transfer";
  legs: PlanLeg[];
  from: string;
  to: string;
  hops: number;
  changes: number;
  fare: { min: number; max: number };
  originWalk?: { from: string; to: string; note: string };
  destinationWalk?: { from: string; to: string; note: string };
}
export type TripPreference = "balanced" | "fewest-transfers" | "fewest-stops" | "lower-fare";
export function estimateFare(legs: PlanLeg[]) {
  return legs.reduce(
    (total, leg) => {
      const values = CATEGORY_META[leg.route.category].fare.match(/\d+/g)?.map(Number) ?? [0];
      return { min: total.min + (values[0] ?? 0), max: total.max + (values[1] ?? values[0] ?? 0) };
    },
    { min: 0, max: 0 },
  );
}
const routeIndexes = new Map(
  ROUTES.map((route) => {
    const stops = new Map<string, number>();
    route.stops.forEach((stop, i) => {
      const key = canonicalPlace(stop);
      if (!stops.has(key)) stops.set(key, i);
    });
    return [route, stops] as const;
  }),
);
const index = (route: BusRoute, stop: string) =>
  routeIndexes.get(route)?.get(canonicalPlace(stop)) ?? -1;
const sharedStops = new Map<string, string[]>();
function shared(a: BusRoute, b: BusRoute) {
  const key = a.slug + "|" + b.slug;
  let stops = sharedStops.get(key);
  if (!stops) {
    stops = a.stops.filter((stop) => index(b, stop) >= 0);
    sharedStops.set(key, stops);
  }
  return stops;
}
function segment(route: BusRoute, from: string, to: string): string[] {
  const a = index(route, from),
    b = index(route, to);
  if (a < 0 || b < 0 || a === b || (route.bidirectional === false && b < a)) return [];
  const stops = route.stops.slice(Math.min(a, b), Math.max(a, b) + 1);
  return a < b ? stops : stops.reverse();
}
export function rankPlans(plans: TripPlan[], preference: TripPreference): TripPlan[] {
  const score = (p: TripPlan) =>
    preference === "lower-fare"
      ? p.fare.min * 100000 + p.fare.max * 100 + p.changes * 10 + p.hops
      : preference === "fewest-stops"
        ? p.hops * 1000 + p.changes
        : preference === "fewest-transfers"
          ? p.changes * 10000 + p.hops
          : p.changes * 10000 + p.hops;
  const unique = new Map<string, TripPlan>();
  for (const p of plans) {
    const key = p.legs.map((l) => l.route.slug).join("|");
    const old = unique.get(key);
    if (!old || score(p) < score(old)) unique.set(key, p);
  }
  return [...unique.values()].sort(
    (a, b) => score(a) - score(b) || a.changes - b.changes || a.hops - b.hops,
  );
}

/** Both directions use the actual stop sequence. Search every one-change journey
 * before attempting two changes, so dense unrelated branches cannot starve it. */
export function planTrip(
  from: string,
  to: string,
  limit = 30,
  preference: TripPreference = "balanced",
  options: { includeWomenOnly?: boolean } = {},
): TripPlan[] {
  if (!from.trim() || !to.trim() || canonicalPlace(from) === canonicalPlace(to)) return [];
  const routes = ROUTES.filter(
    (r) => r.planningEnabled !== false && (r.category !== "pink_bus" || options.includeWomenOnly),
  );
  const starts = routes.filter((r) => index(r, from) >= 0);
  const ends = routes.filter((r) => index(r, to) >= 0);
  const bestByServices = new Map<string, TripPlan>();
  const save = (legs: PlanLeg[]) => {
    // Reject circles: repeated interchanges and travel back over an earlier stop.
    const keys = legs.flatMap((l, i) => (i ? l.stops.slice(1) : l.stops)).map(canonicalPlace);
    if (new Set(keys).size !== keys.length) return;
    const signature = legs.map((l) => l.route.slug).join("|");
    // Prefer the owner-confirmed Shaheen Complex interchange for R-9 / N-5.
    // A small transfer-quality allowance avoids choosing Metropole solely because
    // sparse stop lists differ by one recorded hop. Actual hops remain displayed.
    const interchangePenalty = (candidate: PlanLeg[]) =>
      candidate.length === 2 &&
      candidate.some((l) => l.route.code === "N-5") &&
      candidate.some((l) => l.route.code === "R-9") &&
      canonicalPlace(candidate[0]!.to) !== "shaheen complex"
        ? 4
        : 0;
    const existing = bestByServices.get(signature);
    if (
      existing &&
      existing.hops + interchangePenalty(existing.legs) <=
        keys.length - 1 + interchangePenalty(legs)
    )
      return;
    bestByServices.set(signature, {
      kind: legs.length === 1 ? "direct" : legs.length === 2 ? "transfer" : "multi-transfer",
      legs,
      from,
      to,
      hops: keys.length - 1,
      changes: legs.length - 1,
      fare: estimateFare(legs),
    });
  };
  const legCache = new Map<string, PlanLeg | null>();

  const leg = (r: BusRoute, a: string, b: string): PlanLeg | null => {
    const key = `${r.slug}|${canonicalPlace(a)}|${canonicalPlace(b)}`;

    if (legCache.has(key)) return legCache.get(key)!;

    const stops = segment(r, a, b);
    const result: PlanLeg | null = stops.length
      ? {
          route: r,
          from: stops[0]!,
          to: stops[stops.length - 1]!,
          stops,
        }
      : null;

    legCache.set(key, result);
    return result;
  };
  for (const a of starts) {
    const direct = leg(a, from, to);
    if (direct) save([direct]);
    for (const b of ends) {
      if (a.slug === b.slug) continue;
      for (const stop of shared(a, b)) {
        const x = leg(a, from, stop),
          y = leg(b, stop, to);
        if (x && y) save([x, y]);
      }
    }
  }
  // Two-transfer alternatives are bounded independently of the complete direct/one-transfer pass.
  let examined = 0;
  outer: for (const a of starts)
    for (const b of routes) {
      if (a.slug === b.slug) continue;
      for (const c of ends) {
        if (c.slug === a.slug || c.slug === b.slug) continue;
        for (const ab of shared(a, b))
          for (const bc of shared(b, c)) {
            if (++examined > 40000) break outer;
            const x = leg(a, from, ab),
              y = leg(b, ab, bc),
              z = leg(c, bc, to);
            if (x && y && z) save([x, y, z]);
          }
      }
    }
  const results = [...bestByServices.values()];
  const viable = results.filter(
    (p) =>
      !results.some(
        (other) =>
          other !== p &&
          other.changes <= p.changes &&
          other.hops <= p.hops &&
          other.fare.min <= p.fare.min &&
          other.fare.max <= p.fare.max &&
          (other.changes < p.changes ||
            other.hops < p.hops ||
            other.fare.min < p.fare.min ||
            other.fare.max < p.fare.max),
      ),
  );
  // Default recommendations avoid extra buses when a recorded simpler journey exists.
  // Fare/stop preferences remain available for deliberate tradeoffs.
  const minimumChanges = Math.min(...viable.map((plan) => plan.changes));
  const practical =
    preference === "balanced" || preference === "fewest-transfers"
      ? viable.filter((plan) => plan.changes === minimumChanges)
      : viable;
  return rankPlans(practical, preference).slice(0, Math.max(1, Math.min(limit, 100)));
}
