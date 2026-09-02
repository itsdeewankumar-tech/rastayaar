import { ROUTES, type BusRoute } from "@/data/routes";

export interface DirectPlan {
  kind: "direct";
  route: BusRoute;
  from: string;
  to: string;
  hops: number;
}

export interface TransferPlan {
  kind: "transfer";
  first: BusRoute;
  second: BusRoute;
  from: string;
  interchange: string;
  to: string;
  hops: number;
}

export type Plan = DirectPlan | TransferPlan;

const idx = (route: BusRoute, stop: string) =>
  route.stops.findIndex((s) => s.toLowerCase() === stop.toLowerCase());

export function planTrip(from: string, to: string, limit = 12): Plan[] {
  if (!from || !to || from.toLowerCase() === to.toLowerCase()) return [];

  const direct: DirectPlan[] = [];
  for (const route of ROUTES) {
    const a = idx(route, from);
    const b = idx(route, to);
    if (a >= 0 && b >= 0) {
      direct.push({ kind: "direct", route, from, to, hops: Math.abs(b - a) });
    }
  }
  direct.sort((x, y) => x.hops - y.hops);
  if (direct.length >= limit) return direct.slice(0, limit);

  const fromRoutes = ROUTES.filter((r) => idx(r, from) >= 0 && idx(r, to) < 0);
  const toRoutes = ROUTES.filter((r) => idx(r, to) >= 0 && idx(r, from) < 0);

  const transfers: TransferPlan[] = [];
  const seen = new Set<string>();
  for (const first of fromRoutes) {
    const firstSet = new Set(first.stops.map((s) => s.toLowerCase()));
    for (const second of toRoutes) {
      let best: { stop: string; hops: number } | null = null;
      for (const stop of second.stops) {
        if (!firstSet.has(stop.toLowerCase())) continue;
        const hops =
          Math.abs(idx(first, stop) - idx(first, from)) +
          Math.abs(idx(second, to) - idx(second, stop));
        if (!best || hops < best.hops) best = { stop, hops };
      }
      if (best) {
        const key = `${first.slug}|${second.slug}`;
        if (seen.has(key)) continue;
        seen.add(key);
        transfers.push({
          kind: "transfer",
          first,
          second,
          from,
          interchange: best.stop,
          to,
          hops: best.hops,
        });
      }
    }
  }
  transfers.sort((x, y) => x.hops - y.hops);

  return [...direct, ...transfers].slice(0, limit);
}
