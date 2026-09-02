import { createFileRoute, Link } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { AREAS, CATEGORY_META, scoreMatch } from "@/data/routes";

export const Route = createFileRoute("/areas/")({
  head: () => ({
    meta: [
      { title: "Karachi Areas & Bus Stops — RastaYaar" },
      {
        name: "description",
        content:
          "Every area and stop served by Karachi public transport. Pick your area to see which buses pass through and what they cost.",
      },
      { property: "og:title", content: "Karachi Areas & Bus Stops — RastaYaar" },
      {
        property: "og:description",
        content: "Search Karachi neighbourhoods and stops to find the buses that serve them.",
      },
    ],
  }),
  component: AreasIndex,
});

function AreasIndex() {
  const [q, setQ] = useState("");

  const grouped = useMemo(() => {
    const list = q.trim() ? AREAS.filter((a) => scoreMatch(a.name, q) > 0) : AREAS;
    const map = new Map<string, typeof AREAS>();
    for (const a of list) {
      const letter = /[a-z]/i.test(a.name[0] ?? "") ? a.name[0]!.toUpperCase() : "#";
      if (!map.has(letter)) map.set(letter, []);
      map.get(letter)!.push(a);
    }
    return Array.from(map.entries()).sort(([a], [b]) => a.localeCompare(b));
  }, [q]);

  return (
    <div className="container-page py-12">
      <h1 className="font-display text-4xl font-bold text-ink">Areas & stops</h1>
      <p className="mt-2 max-w-2xl text-muted-foreground">
        {AREAS.length} areas, chowrangis, landmarks and stations across Karachi.
      </p>

      <input
        value={q}
        onChange={(e) => setQ(e.target.value)}
        placeholder="Search an area — Sultanabad, Korangi, Banaras…"
        className="mt-6 w-full max-w-md rounded-xl border border-border bg-surface px-4 py-2.5 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-ring/30"
      />

      <div className="mt-8 space-y-8">
        {grouped.map(([letter, items]) => (
          <section key={letter}>
            <h2 className="font-display text-sm font-bold uppercase tracking-[0.2em] text-primary">
              {letter}
            </h2>
            <div className="mt-3 grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
              {items.map((a) => (
                <Link
                  key={a.slug}
                  to="/areas/$slug"
                  params={{ slug: a.slug }}
                  className="surface-card hover-lift flex items-center justify-between gap-3 px-4 py-3"
                >
                  <span className="text-sm font-medium text-ink">{a.name}</span>
                  <span className="flex -space-x-1">
                    {a.routes.slice(0, 3).map((r) => (
                      <span
                        key={r.slug}
                        className="size-2.5 rounded-full ring-2 ring-card"
                        style={{ backgroundColor: `var(--${CATEGORY_META[r.category].token})` }}
                      />
                    ))}
                    <span className="pl-2 text-xs text-muted-foreground">{a.routes.length}</span>
                  </span>
                </Link>
              ))}
            </div>
          </section>
        ))}
      </div>
      {grouped.length === 0 && (
        <p className="mt-10 text-muted-foreground">No area matched that search.</p>
      )}
    </div>
  );
}
