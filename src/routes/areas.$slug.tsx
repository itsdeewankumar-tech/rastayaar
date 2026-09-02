import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { getArea, CATEGORY_META, CATEGORY_ORDER } from "@/data/routes";
import { RouteCard } from "@/components/site-chrome";

export const Route = createFileRoute("/areas/$slug")({
  loader: ({ params }) => {
    const area = getArea(params.slug);
    if (!area) throw notFound();
    return { area };
  },
  head: ({ loaderData }) => {
    if (!loaderData) {
      return {
        meta: [{ title: "Area not found — RastaYaar" }, { name: "robots", content: "noindex" }],
      };
    }
    const { area } = loaderData;
    const title = `Buses from ${area.name}, Karachi — Routes & Fares | RastaYaar`;
    const desc = `${area.routes.length} bus routes serve ${area.name}: ${area.routes
      .slice(0, 8)
      .map((r) => r.code)
      .join(", ")}. See fares and full stop lists.`;
    return {
      meta: [
        { title },
        { name: "description", content: desc },
        { property: "og:title", content: title },
        { property: "og:description", content: desc },
      ],
    };
  },
  component: AreaDetail,
});

function AreaDetail() {
  const { area } = Route.useLoaderData();

  return (
    <div className="container-page py-12">
      <Link to="/areas" className="text-sm text-muted-foreground hover:text-primary">
        ← All areas
      </Link>

      <header className="surface-card mt-4 overflow-hidden">
        <div className="h-1.5 truck-stripe" />
        <div className="p-6">
          <h1 className="font-display text-3xl font-bold text-ink">{area.name}</h1>
          <p className="mt-1 text-muted-foreground">
            {area.routes.length} bus route{area.routes.length === 1 ? "" : "s"} pass through this
            area.
          </p>
          <div className="mt-4 flex flex-wrap gap-2 text-xs">
            {CATEGORY_ORDER.filter((c) => area.routes.some((r) => r.category === c)).map((c) => (
              <span
                key={c}
                className="rounded-full px-2.5 py-1 font-semibold"
                style={{
                  color: `var(--${CATEGORY_META[c].token})`,
                  backgroundColor: `color-mix(in oklch, var(--${CATEGORY_META[c].token}) 14%, transparent)`,
                }}
              >
                {CATEGORY_META[c].label} · {CATEGORY_META[c].fare}
              </span>
            ))}
          </div>
        </div>
      </header>

      <h2 className="mt-10 font-display text-xl font-bold text-ink">Buses serving {area.name}</h2>
      <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {area.routes.map((r) => (
          <RouteCard key={r.slug} route={r} />
        ))}
      </div>
    </div>
  );
}
