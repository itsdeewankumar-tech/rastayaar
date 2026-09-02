import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { getRoute, CATEGORY_META, slugify, ROUTES } from "@/data/routes";
import { CategoryBadge } from "@/components/site-chrome";

export const Route = createFileRoute("/routes/$slug")({
  loader: ({ params }) => {
    const route = getRoute(params.slug);
    if (!route) throw notFound();
    return { route };
  },
  head: ({ loaderData }) => {
    if (!loaderData) {
      return {
        meta: [{ title: "Route not found — RastaYaar" }, { name: "robots", content: "noindex" }],
      };
    }
    const { route } = loaderData;
    const meta = CATEGORY_META[route.category];
    const title = `${route.code} Bus Route — Stops & Fare | RastaYaar`;
    const desc = `${route.code} (${meta.label}) runs from ${route.stops[0]} to ${
      route.stops[route.stops.length - 1]
    } via ${route.stops.length} stops. Fare ${meta.fare}.`;
    return {
      meta: [
        { title },
        { name: "description", content: desc },
        { property: "og:title", content: title },
        { property: "og:description", content: desc },
      ],
    };
  },
  component: RouteDetail,
});

function RouteDetail() {
  const { route } = Route.useLoaderData();
  const meta = CATEGORY_META[route.category];
  const related = ROUTES.filter(
    (r) => r.slug !== route.slug && r.stops.some((s) => route.stops.includes(s)),
  ).slice(0, 6);

  return (
    <div className="container-page py-12">
      <Link to="/routes" search={{}} className="text-sm text-muted-foreground hover:text-primary">
        ← All routes
      </Link>

      <header className="surface-card mt-4 overflow-hidden">
        <div className="h-1.5 truck-stripe" />
        <div className="flex flex-wrap items-center gap-4 p-6">
          <span
            className="rounded-xl px-4 py-2 font-display text-2xl font-bold text-primary-foreground"
            style={{ backgroundColor: `var(--${meta.token})` }}
          >
            {route.code}
          </span>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="font-display text-2xl font-bold text-ink">{meta.label}</h1>
              <CategoryBadge category={route.category} />
            </div>
            <p className="text-sm text-muted-foreground">
              {route.stops[0]} → {route.stops[route.stops.length - 1]} · {route.stops.length} stops
            </p>
          </div>
          <div className="ml-auto rounded-xl bg-secondary px-4 py-2 text-center">
            <p className="text-[11px] uppercase tracking-wide text-muted-foreground">Fare</p>
            <p className="font-display text-lg font-bold text-primary">{meta.fare}</p>
          </div>
        </div>
      </header>

      <h2 className="mt-10 font-display text-xl font-bold text-ink">Route stops</h2>
      <ol className="mt-4 grid gap-x-8 sm:grid-cols-2 lg:grid-cols-3">
        {route.stops.map((stop, i) => (
          <li key={`${stop}-${i}`} className="relative flex gap-3 pb-4 pl-1">
            <span className="relative flex flex-col items-center">
              <span
                className="mt-1.5 size-3 shrink-0 rounded-full border-2 border-surface"
                style={{ backgroundColor: `var(--${meta.token})` }}
              />
              {i < route.stops.length - 1 && <span className="w-px flex-1 bg-border" />}
            </span>
            <Link
              to="/areas/$slug"
              params={{ slug: slugify(stop) }}
              className="text-sm transition-colors hover:text-primary"
            >
              <span className="mr-1.5 text-xs text-muted-foreground">{i + 1}.</span>
              {stop}
            </Link>
          </li>
        ))}
      </ol>

      {related.length > 0 && (
        <>
          <h2 className="mt-8 font-display text-xl font-bold text-ink">Connecting buses</h2>
          <div className="mt-3 flex flex-wrap gap-2">
            {related.map((r) => (
              <Link
                key={r.slug}
                to="/routes/$slug"
                params={{ slug: r.slug }}
                className="rounded-full border border-border bg-surface px-3 py-1.5 text-sm font-semibold transition-colors hover:border-primary hover:text-primary"
              >
                {r.code}
              </Link>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
