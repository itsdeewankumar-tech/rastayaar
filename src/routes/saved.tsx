import { createFileRoute, Link } from "@tanstack/react-router";
import { useSaved } from "@/components/saved-routes";
import { useLanguage } from "@/components/language";
import { getRoute, CATEGORY_META } from "@/data/routes";
export const Route = createFileRoute("/saved")({
  head: () => ({
    meta: [
      { title: "Saved Routes & Journeys — RastaYaar" },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: SavedPage,
});
function SavedPage() {
  const { items, ready, error, remove } = useSaved(),
    { t, place } = useLanguage();
  return (
    <div className="container-page py-12">
      <h1 className="text-4xl font-bold">{t("Saved routes & journeys")}</h1>
      <p className="mt-3 text-muted-foreground">
        {t("Saved on this browser. Open a journey to check it against the latest route records.")}
      </p>
      {error && <p role="status">{t(error)}</p>}
      {!ready ? (
        <p className="mt-8" role="status">
          {t("Loading saved routes…")}
        </p>
      ) : items.length === 0 ? (
        <div className="surface-card mt-8 p-6">
          <p>{t("No saved routes yet. Save a bus route or a journey after planning your trip.")}</p>
          <Link
            to="/plan"
            className="mt-4 inline-block rounded-xl bg-primary px-5 py-3 font-semibold text-primary-foreground"
          >
            {t("Plan a trip")}
          </Link>
        </div>
      ) : (
        <ul className="mt-6 grid gap-4 sm:grid-cols-2">
          {items.map((item) => {
            const route = item.kind === "route" ? getRoute(item.routeSlug) : undefined;
            return (
              <li key={item.id} className="surface-card p-5">
                <h2 className="text-lg font-bold">
                  {item.kind === "route"
                    ? route
                      ? `${route.code} · ${t(CATEGORY_META[route.category].label)}`
                      : t("Route no longer listed")
                    : `${place(item.from)} → ${place(item.walk || item.to)}`}
                </h2>
                {route && (
                  <p className="mt-2 text-sm">
                    {place(route.stops[0])} → {place(route.stops.at(-1))}
                  </p>
                )}
                <div className="mt-4 flex flex-wrap gap-3">
                  {route && (
                    <Link
                      to="/routes/$slug"
                      params={{ slug: route.slug }}
                      className="rounded-xl bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground"
                    >
                      {t("Open route")}
                    </Link>
                  )}
                  {item.kind === "trip" && (
                    <Link
                      to="/plan"
                      search={{
                        from: item.from,
                        to: item.to,
                        walk: item.walk,
                        preference: item.preference,
                        services: item.services,
                      }}
                      className="rounded-xl bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground"
                    >
                      {t("Open saved journey")}
                    </Link>
                  )}
                  <button
                    type="button"
                    onClick={() => remove(item.id)}
                    className="rounded-xl border px-4 py-2 text-sm"
                  >
                    {t("Remove")}
                  </button>
                </div>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
