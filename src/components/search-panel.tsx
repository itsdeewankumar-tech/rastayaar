import { T } from "@/components/language";
import { ExternalSearch } from "./external-search";
import { useLanguage } from "./language";
import { useMemo, useState } from "react";
import { Link } from "@tanstack/react-router";
import { ROUTES, AREAS, CATEGORY_META, POPULAR_AREAS, scoreMatch, slugify } from "@/data/routes";
import { canonicalPlace } from "@/data/places";
import { CategoryBadge } from "@/components/site-chrome";

export function SearchPanel() {
  const { t, place, language } = useLanguage();
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

  const destinationRouteResults = useMemo(() => {
    if (query.trim().length < 2) return [];
    const destination = canonicalPlace(query);
    const isSachal = destination === "sachal goth";
    const isIba = destination === "iba";

    return ROUTES.map((route) => {
      const stop = route.stops.find((item) => canonicalPlace(item) === destination);

      const nearbySachalStop =
        isSachal && ["G-7", "Shiraz"].includes(route.code) ? "Mosmiat" : undefined;

      const nearbyIbaStop = isIba && route.code === "A-3" ? "Maskan" : undefined;

      return {
        route,
        stop: stop ?? nearbySachalStop ?? nearbyIbaStop,
        isNearbyIbaStop: Boolean(nearbyIbaStop),
      };
    })
      .filter((item) => item.stop)
      .filter(
        (item, index, all) =>
          all.findIndex((other) => other.route.slug === item.route.slug) === index,
      )
      .sort((a, b) => {
        const preferred = (code: string) =>
          destination === "ned university" || destination === "karachi university ku"
            ? code === "Shiraz"
              ? 0
              : 1
            : isSachal
              ? ["G-3", "G-7", "Shiraz"].includes(code)
                ? 0
                : 1
              : 0;
        return preferred(a.route.code) - preferred(b.route.code);
      })
      .slice(0, 8);
  }, [query]);

  const hasQuery = query.trim().length > 0;
  const empty =
    hasQuery &&
    areaResults.length === 0 &&
    routeResults.length === 0 &&
    destinationRouteResults.length === 0;

  return (
    <div className="surface-card p-5">
      <label htmlFor="area-search" className="sr-only">
        {""}
        <T>{"Search a Karachi area or bus number"}</T>{" "}
      </label>
      <div className="flex min-h-12 items-center gap-3 rounded-xl border border-border bg-muted/60 px-4 py-3 focus-within:border-primary focus-within:ring-2 focus-within:ring-ring/30">
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
          placeholder={t("Type an area — e.g. Sultanabad, Nagan Chorangi, Tower…")}
          className="min-w-0 w-full bg-transparent text-sm outline-none placeholder:text-muted-foreground"
          autoComplete="off"
        />
        {hasQuery && (
          <button
            onClick={() => setQuery("")}
            className="rounded-full px-2 py-0.5 text-xs font-semibold text-muted-foreground hover:bg-secondary"
          >
            {""}
            <T>{"Clear"}</T>{" "}
          </button>
        )}
      </div>

      {!hasQuery && (
        <div className="mt-4">
          <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
            {""}
            <T>{"Popular areas"}</T>{" "}
          </p>
          <div className="mt-2 flex flex-wrap gap-2">
            {POPULAR_AREAS.map((a) => (
              <Link
                key={place(a)}
                to="/areas/$slug"
                params={{ slug: slugify(a) }}
                className="rounded-full border border-border bg-surface px-3 py-1.5 text-sm transition-colors hover:border-primary hover:text-primary"
              >
                {place(a)}
              </Link>
            ))}
          </div>
        </div>
      )}

      {empty && (
        <p className="mt-4 text-sm text-muted-foreground">
          {""}
          <T>{"No area or bus matched “"}</T>
          {""}
          {query}
          {""}
          <T>{"”. Try a nearby landmark or a shorter spelling."}</T>{" "}
        </p>
      )}

      {empty && <ExternalSearch key={query + language} query={query} />}

      {destinationRouteResults.length > 0 && (
        <div className="mt-4">
          <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
            {t("Buses serving this destination")}
          </p>
          <div className="mt-2 space-y-2">
            {destinationRouteResults.map(({ route, stop, isNearbyIbaStop }) => (
              <Link
                key={`destination-${route.slug}`}
                to="/routes/$slug"
                params={{ slug: route.slug }}
                className="flex items-center justify-between gap-3 rounded-xl border border-border bg-surface px-3 py-2.5 transition-colors hover:border-primary"
              >
                <span className="flex items-center gap-2">
                  <span className="rounded-md bg-primary px-2 py-1 text-xs font-bold text-primary-foreground">
                    {route.code}
                  </span>
                  <span>
                    <span className="block text-sm font-medium text-ink">{place(stop)}</span>
                    {isNearbyIbaStop && (
                      <span className="block text-xs text-muted-foreground">
                        {t("Nearby stop for IBA Karachi")}
                      </span>
                    )}
                  </span>
                </span>
                <span className="text-xs text-muted-foreground">{t("View stops")}</span>
              </Link>
            ))}
          </div>
          {canonicalPlace(query) === "sachal goth" && (
            <p className="mt-2 text-xs leading-5 text-muted-foreground">
              {t(
                "G-3 lists Sachal Goth directly; G-7 and Shiraz have a nearby listed stop at Mosmiat.",
              )}
            </p>
          )}
        </div>
      )}

      {routeResults.length > 0 && (
        <div className="mt-4">
          <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
            {""}
            <T>{"Bus numbers"}</T>{" "}
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
                  <span className="font-display font-semibold text-ink">{place(area.name)}</span>
                  <span className="text-xs text-muted-foreground">
                    {area.routes.length} {""}
                    <T>{"bus"}</T>
                    {""}
                    {area.routes.length === 1 ? "" : "es"}
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
                      +{area.routes.length - 10} {""}
                      <T>{"more"}</T>{" "}
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
