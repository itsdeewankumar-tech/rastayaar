import { useMemo, useState } from "react";
import { Link } from "@tanstack/react-router";
import { ROUTES, AREAS, CATEGORY_META, POPULAR_AREAS, scoreMatch, slugify } from "@/data/routes";
import { CategoryBadge } from "@/components/site-chrome";

export function SearchPanel() {
  const [query, setQuery] = useState("");

  const areaResults = useMemo(() => {
    if (query.trim().length < 2) return [];
    return AREAS.map((a) => ({ area: a, score: scoreMatch(a.name, query) }))
      .filter((x) => x.score > 0)
      .sort((a, b) => b.score - a.score || b.area.routes.length - a.area.routes.length)
      .slice(0, 8);
  }, [query]);

  const routeResults = useMemo(() => {
    if (query.trim().length < 1) return [];
    return ROUTES.map((r) => ({ route: r, score: scoreMatch(r.code, query) }))
      .filter((x) => x.score > 0)
      .sort((a, b) => b.score - a.score)
      .slice(0, 6);
  }, [query]);

  const hasQuery = query.trim().length > 0;
  const empty = hasQuery && areaResults.length === 0 && routeResults.length === 0;

  return (
    <div className="surface-card p-4 sm:p-5">
      <label htmlFor="area-search" className="sr-only">
        Search a Karachi area or bus number
      </label>
      <div className="flex items-center gap-3 rounded-xl border border-border bg-muted/60 px-4 py-3 focus-within:border-primary focus-within:ring-2 focus-within:ring-ring/30">
        <svg
          aria-hidden="true"
          viewBox="0 0 24 24"
          className="size-5 shrink-0 text-muted-foreground"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
        >
          <circle cx="11" cy="11" r="7" />
          <path d="m20 20-3.5-3.5" strokeLinecap="round" />
        </svg>
        <input
          id="area-search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Type an area — e.g. Sultanabad, Nagan Chorangi, Tower…"
          className="w-full bg-transparent text-base outline-none placeholder:text-muted-foreground"
          autoComplete="off"
        />
        {hasQuery && (
          <button
            onClick={() => setQuery("")}
            className="rounded-full px-2 py-0.5 text-xs font-semibold text-muted-foreground hover:bg-secondary"
          >
            Clear
          </button>
        )}
      </div>

      {!hasQuery && (
        <div className="mt-4">
          <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
            Popular areas
          </p>
          <div className="mt-2 flex flex-wrap gap-2">
            {POPULAR_AREAS.map((a) => (
              <Link
                key={a}
                to="/areas/$slug"
                params={{ slug: slugify(a) }}
                className="rounded-full border border-border bg-surface px-3 py-1.5 text-sm transition-colors hover:border-primary hover:text-primary"
              >
                {a}
              </Link>
            ))}
          </div>
        </div>
      )}

      {empty && (
        <p className="mt-4 text-sm text-muted-foreground">
          No area or bus matched “{query}”. Try a nearby landmark or a shorter spelling.
        </p>
      )}

      {routeResults.length > 0 && (
        <div className="mt-4">
          <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
            Bus numbers
          </p>
          <div className="mt-2 flex flex-wrap gap-2">
            {routeResults.map(({ route }) => (
              <Link
                key={route.slug}
                to="/routes/$slug"
                params={{ slug: route.slug }}
                className="flex items-center gap-2 rounded-full border border-border bg-surface px-3 py-1.5 text-sm font-semibold transition-colors hover:border-primary"
              >
                {route.code}
                <CategoryBadge category={route.category} />
              </Link>
            ))}
          </div>
        </div>
      )}

      {areaResults.length > 0 && (
        <ul className="mt-4 space-y-2">
          {areaResults.map(({ area }) => (
            <li key={area.slug}>
              <Link
                to="/areas/$slug"
                params={{ slug: area.slug }}
                className="block rounded-xl border border-border bg-surface p-3.5 transition-colors hover:border-primary"
              >
                <div className="flex items-center justify-between gap-3">
                  <span className="font-display font-semibold text-ink">{area.name}</span>
                  <span className="text-xs text-muted-foreground">
                    {area.routes.length} bus{area.routes.length === 1 ? "" : "es"}
                  </span>
                </div>
                <div className="mt-2 flex flex-wrap gap-1.5">
                  {area.routes.slice(0, 10).map((r) => (
                    <span
                      key={r.slug}
                      className="rounded-md px-2 py-0.5 text-[11px] font-semibold text-primary-foreground"
                      style={{ backgroundColor: `var(--${CATEGORY_META[r.category].token})` }}
                    >
                      {r.code}
                    </span>
                  ))}
                  {area.routes.length > 10 && (
                    <span className="text-[11px] text-muted-foreground">
                      +{area.routes.length - 10} more
                    </span>
                  )}
                </div>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
