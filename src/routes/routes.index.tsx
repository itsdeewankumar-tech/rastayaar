import { createFileRoute, Link } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import {
  ROUTES,
  CATEGORY_META,
  CATEGORY_ORDER,
  scoreMatch,
  type RouteCategory,
} from "@/data/routes";
import { RouteCard } from "@/components/site-chrome";

type Search = { type?: RouteCategory };

export const Route = createFileRoute("/routes/")({
  validateSearch: (search: Record<string, unknown>): Search => {
    const t = search["type"];
    return typeof t === "string" && (CATEGORY_ORDER as string[]).includes(t)
      ? { type: t as RouteCategory }
      : {};
  },
  head: () => ({
    meta: [
      { title: "All Karachi Bus Routes — RastaYaar" },
      {
        name: "description",
        content:
          "Complete list of Karachi bus routes: mini buses, coaches, named fleets, Red Bus, EV Bus and BRT lines with all stops.",
      },
      { property: "og:title", content: "All Karachi Bus Routes — RastaYaar" },
      {
        property: "og:description",
        content: "Every Karachi bus route and its stops, grouped by service type.",
      },
    ],
  }),
  component: RoutesIndex,
});

function RoutesIndex() {
  const { type } = Route.useSearch();
  const [q, setQ] = useState("");

  const list = useMemo(() => {
    let items = type ? ROUTES.filter((r) => r.category === type) : ROUTES;
    if (q.trim()) {
      items = items
        .map((r) => ({
          r,
          score: Math.max(
            scoreMatch(r.code, q),
            ...r.stops.map((s) => (scoreMatch(s, q) > 40 ? 40 : 0)),
          ),
        }))
        .filter((x) => x.score > 0)
        .sort((a, b) => b.score - a.score)
        .map((x) => x.r);
    }
    return items;
  }, [type, q]);

  return (
    <div className="container-page py-12">
      <h1 className="font-display text-4xl font-bold text-ink">All bus routes</h1>
      <p className="mt-2 max-w-2xl text-muted-foreground">
        {ROUTES.length} routes across mini buses, coaches, named fleets, Red Bus, EV Bus and BRT.
      </p>

      <div className="mt-6 flex flex-wrap items-center gap-2">
        <Link
          to="/routes"
          search={{}}
          className={`rounded-full border px-3.5 py-1.5 text-sm font-medium transition-colors ${
            !type ? "border-primary bg-primary text-primary-foreground" : "border-border bg-surface"
          }`}
        >
          All
        </Link>
        {CATEGORY_ORDER.map((c) => (
          <Link
            key={c}
            to="/routes"
            search={{ type: c }}
            className={`rounded-full border px-3.5 py-1.5 text-sm font-medium transition-colors ${
              type === c
                ? "border-primary bg-primary text-primary-foreground"
                : "border-border bg-surface hover:border-primary"
            }`}
          >
            {CATEGORY_META[c].label}
          </Link>
        ))}
      </div>

      <input
        value={q}
        onChange={(e) => setQ(e.target.value)}
        placeholder="Filter by bus number or stop…"
        className="mt-5 w-full max-w-md rounded-xl border border-border bg-surface px-4 py-2.5 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-ring/30"
      />

      <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {list.map((r) => (
          <RouteCard key={r.slug} route={r} />
        ))}
      </div>
      {list.length === 0 && (
        <p className="mt-10 text-muted-foreground">No routes matched that filter.</p>
      )}
    </div>
  );
}
