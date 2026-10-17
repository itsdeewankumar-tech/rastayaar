import { ROUTES, normalize, type BusRoute } from "@/data/routes";

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
  originWalk?: { from: string; to: string; note: string };
  destinationWalk?: { from: string; to: string; note: string };
}

// Explicit aliases for common Karachi landmark, campus and spelling variants.
// Keep aliases conservative so unrelated places are not silently merged.
const STOP_ALIASES: Record<string, string> = {
  "cbm": "iobm",
  "cbm university": "iobm",
  "cbm campus": "iobm",
  "cbm iobm": "iobm",
  "cbm korangi": "iobm",
  "iobm": "iobm",
  "iobm university": "iobm",
  "institute of business management": "iobm",
  "institute business management": "iobm",
  "korangi creek iobm": "iobm",
  "iba karachi": "maskan",
  "iba main campus": "maskan",
  "iba university road": "maskan",
  "iba main campus university road": "maskan",
  "iba karachi main campus": "maskan",
  "muskan gate": "maskan",
  "maskan gate": "maskan",
  "nipa chowrangi": "nipa chorangi",
  "nipa chowrangi stop": "nipa chorangi",
  "qayumabad": "qayoomabad",
  "saforah goth": "safora goth",
  "university road": "university",
  "lighthouse": "light house",
  "light house karachi": "light house",
  "tower karachi": "tower",
  "saddar karachi": "saddar",
  // Common short forms used in real searches.
  "sultanbad": "sultanabad",
  "sultan abad": "sultanabad",
  "fast": "fast university",
  "fast university karachi": "fast university",
  "fast university main campus": "fast university",
  "fast nuces": "fast university",
  "nuces": "fast university",
  "tower stop": "tower",
  "tower bus stop": "tower",
};

function stopKey(stop: string) {
  const normalized = normalize(stop)
    .replace(/\b(karachi|pakistan|station|terminal|bus stop|stop)\b/g, "")
    .replace(/\s+/g, " ")
    .trim();
  return STOP_ALIASES[normalized] ?? normalized;
}

const indexOfStop = (route: BusRoute, stop: string) => {
  const target = stopKey(stop);
  return route.stops.findIndex((candidate) => stopKey(candidate) === target);
};

function stopsBetween(route: BusRoute, from: string, to: string) {
  const fromIndex = indexOfStop(route, from);
  const toIndex = indexOfStop(route, to);
  if (fromIndex < 0 || toIndex < 0) return [];
  const segment = route.stops.slice(Math.min(fromIndex, toIndex), Math.max(fromIndex, toIndex) + 1);
  return fromIndex <= toIndex ? segment : segment.reverse();
}

/**
 * Search direct journeys and connected journeys with up to three bus legs.
 * This uses a stop-to-routes index so it doesn't compare every route with every other route.
 * Results are based on saved records, not live service or timetable data.
 */
export type TripPreference = "balanced" | "fewest-transfers" | "less-walking" | "lower-fare";

// Do not silently replace a requested origin with a distant interchange.
// Sultanabad is present in the saved N-5 and MashAllah stop sequences, so search it directly.

export function planTrip(from: string, to: string, _legacyLimit = Number.POSITIVE_INFINITY, preference: TripPreference = "balanced"): TripPlan[] {
  if (!from.trim() || !to.trim() || stopKey(from) === stopKey(to)) return [];

  const routesByStop = new Map<string, Array<{ route: BusRoute; stop: string }>>();
  for (const route of ROUTES) {
    const routeSeen = new Set<string>();
    for (const stop of route.stops) {
      const key = stopKey(stop);
      if (!key || routeSeen.has(key)) continue;
      routeSeen.add(key);
      const matches = routesByStop.get(key) ?? [];
      matches.push({ route, stop });
      routesByStop.set(key, matches);
    }
  }

  const searchOrigin = from;
  const starts = ROUTES.filter((route) => indexOfStop(route, searchOrigin) >= 0);
  const results: TripPlan[] = [];
  const seen = new Set<string>();
  // Guard against combinatorial explosion in dense route networks. This keeps the UI
  // responsive while exploring a broad set of useful, distinct journey options.
  let exploredConnections = 0;
  const MAX_EXPLORED_CONNECTIONS = 9000;

  const savePlan = (legs: PlanLeg[]) => {
    if (!legs.length) return;
    const signature = legs.map((leg) => `${leg.route.slug}:${stopKey(leg.from)}>${stopKey(leg.to)}`).join('|');
    if (seen.has(signature)) return;
    // Deduplicate both exact stop sequences and repeated bus combinations. Without
    // this, the same two buses transferring at several adjacent stops flood the UI.
    const itinerarySignature = legs
      .flatMap((leg, index) => index ? leg.stops.slice(1) : leg.stops)
      .map(stopKey)
      .join('>');
    if (results.some((existing) =>
      existing.legs.flatMap((leg, index) => index ? leg.stops.slice(1) : leg.stops).map(stopKey).join('>') === itinerarySignature
    )) return;
    seen.add(signature);
    const hops = legs.reduce((sum, leg) => sum + Math.max(0, leg.stops.length - 1), 0);
    results.push({
      kind: legs.length === 1 ? 'direct' : legs.length === 2 ? 'transfer' : 'multi-transfer',
      legs,
      from,
      to,
      hops,
      changes: legs.length - 1,
    });
  };

  // Collect every direct option before exploring transfers so a large graph cannot crowd them out.
  for (const route of starts) {
    if (indexOfStop(route, to) < 0) continue;
    savePlan([{ route, from: searchOrigin, to, stops: stopsBetween(route, searchOrigin, to) }]);
  }

  // Prioritize the requested Sultanabad -> N-5 -> Shaheen Complex -> R-9 -> FAST connection.
  // Shaheen Complex is explicitly included in the saved N-5 sequence for this interchange.
  const normalizedCode = (code: string) => normalize(code).replace(/[^a-z0-9]/g, "");
  const originIsSultanabad = stopKey(from) === "sultanabad";
  const destinationIsFast = stopKey(to) === "fast university";
  if (originIsSultanabad && destinationIsFast) {
    const n5 = ROUTES.find((route) => normalizedCode(route.code) === "n5" && indexOfStop(route, from) >= 0 && indexOfStop(route, "Shaheen Complex") >= 0);
    const r9 = ROUTES.find((route) => normalizedCode(route.code) === "r9" && indexOfStop(route, "Shaheen Complex") >= 0 && indexOfStop(route, "FAST University") >= 0);
    if (n5 && r9) {
      savePlan([
        { route: n5, from, to: "Shaheen Complex", stops: stopsBetween(n5, from, "Shaheen Complex") },
        { route: r9, from: "Shaheen Complex", to, stops: stopsBetween(r9, "Shaheen Complex", to) },
      ]);
    }
  }

  const search = (route: BusRoute, boardAt: string, legs: PlanLeg[], usedSlugs: Set<string>) => {

    const destinationIndex = indexOfStop(route, to);
    const boardIndex = indexOfStop(route, boardAt);
    if (destinationIndex >= 0 && boardIndex >= 0) {
      const segment = stopsBetween(route, boardAt, to);
      if (segment.length > 0) savePlan([...legs, { route, from: boardAt, to, stops: segment }]);
    }
    if (legs.length >= 2 || boardIndex < 0) return; // current route would be leg 3; only check destination above.

    for (const interchange of route.stops) {
      if (exploredConnections >= MAX_EXPLORED_CONNECTIONS) return;
      const interchangeKey = stopKey(interchange);
      if (!interchangeKey || interchangeKey === stopKey(boardAt) || interchangeKey === stopKey(to)) continue;
      const firstSegment = stopsBetween(route, boardAt, interchange);
      if (firstSegment.length < 2) continue;

      const connectingRoutes = [...(routesByStop.get(interchangeKey) ?? [])].sort((a, b) => {
        const aReaches = indexOfStop(a.route, to) >= 0 ? 0 : 1;
        const bReaches = indexOfStop(b.route, to) >= 0 ? 0 : 1;
        return aReaches - bReaches;
      });
      for (const connection of connectingRoutes) {
        exploredConnections += 1;
        if (exploredConnections > MAX_EXPLORED_CONNECTIONS) return;
        if (usedSlugs.has(connection.route.slug)) continue;
        const nextLegs = [...legs, { route, from: boardAt, to: interchange, stops: firstSegment }];
        const nextUsed = new Set(usedSlugs);
        nextUsed.add(route.slug);
        search(connection.route, connection.stop, nextLegs, nextUsed);
      }
    }
  };

  for (const route of starts) {
    search(route, searchOrigin, [], new Set());
  }

  // Return only distinct bus combinations, ranked from most practical to least practical.
  // This prevents the same buses with different transfer points from flooding the UI.
  return rankPlans(results, preference).slice(0, 100);
}

function rankPlans(plans: TripPlan[], preference: TripPreference): TripPlan[] {
  const fareScore = (plan: TripPlan) => plan.legs.reduce((sum, leg) => {
    const nums = ({ red_bus: 80, ev_bus: 80, brt: 80, double_decker: 80, mini_bus: 30, coach: 30, named_route: 30, other: 30 } as const)[leg.route.category];
    return sum + nums;
  }, 0);
  const score = (plan: TripPlan) => {
    const walkPenalty = plan.originWalk ? 2 : 0;
    if (preference === "fewest-transfers") return plan.changes * 1000 + plan.hops + walkPenalty;
    if (preference === "less-walking") return plan.changes * 1000 + plan.hops + walkPenalty * 100;
    if (preference === "lower-fare") return fareScore(plan) * 10 + plan.changes * 100 + plan.hops + walkPenalty;
    // Balanced: strongly prefer fewer buses, then fewer stops and less walking.
    return plan.changes * 1000 + plan.hops + walkPenalty;
  };
  const unique = new Map<string, TripPlan>();
  for (const plan of plans) {
    // Treat suffix variants/duplicate records of the same bus code as the same
    // service for presentation. Keep the lowest-hop version of each combination.
    const key = plan.legs.map((leg) => `${normalize(leg.route.code).replace(/\s+/g, "").replace(/-/g, "")}:${leg.route.category}`).join("|");
    const existing = unique.get(key);
    if (!existing || score(plan) < score(existing)) unique.set(key, plan);
  }
  const sorted = [...unique.values()].sort(
    (a, b) => score(a) - score(b) || a.hops - b.hops ||
      a.legs.map((x) => x.route.code).join().localeCompare(b.legs.map((x) => x.route.code).join()),
  );

  // Keep the ranking practical first, but avoid filling the first screen with
  // nearly identical options when other verified fleet types are just as useful.
  // Diversity is only used among journeys with the same number of transfers and
  // within two stops of the best remaining option, so clearly better journeys
  // stay ahead of worse ones.
  const diversified: TripPlan[] = [];
  const remaining = [...sorted];
  while (remaining.length) {
    const best = remaining[0];
    const bestScore = score(best);
    const nearBest = remaining.filter((plan) =>
      plan.changes === best.changes && plan.hops <= best.hops + 2 && score(plan) <= bestScore + 2,
    );
    const recentCategories = diversified.slice(-2).map((plan) => plan.legs.map((leg) => leg.route.category));
    const recentSlugs = diversified.slice(-2).flatMap((plan) => plan.legs.map((leg) => leg.route.slug));
    const alternative = nearBest.find((plan) => {
      const categories = plan.legs.map((leg) => leg.route.category);
      const hasFreshCategory = categories.some((category) => !recentCategories.flat().includes(category));
      const hasFreshRoute = plan.legs.some((leg) => !recentSlugs.includes(leg.route.slug));
      return hasFreshCategory && hasFreshRoute;
    });
    const chosen = alternative ?? best;
    diversified.push(chosen);
    remaining.splice(remaining.indexOf(chosen), 1);
  }
  return diversified;
}
