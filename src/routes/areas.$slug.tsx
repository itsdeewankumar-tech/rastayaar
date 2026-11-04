import { useLanguage } from "@/components/language";
import { T } from "@/components/language";
import { createFileRoute, Link, notFound, redirect } from "@tanstack/react-router";
import { getArea, CATEGORY_META, CATEGORY_ORDER } from "@/data/routes";
import { RouteCard } from "@/components/site-chrome";

export const Route = createFileRoute("/areas/$slug")({
  loader: ({ params }) => {
    const area = getArea(params.slug);
    if (!area) throw notFound();

    if (area.slug !== params.slug) {
      throw redirect({
        to: "/areas/$slug",
        params: { slug: area.slug },
        statusCode: 301,
      });
    }

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
  const { t, place, language } = useLanguage();
  const { area } = Route.useLoaderData();

  return (
    <div className="container-page py-12">
      <Link to="/areas" className="text-sm text-muted-foreground hover:text-primary">
        {""}
        <T>{"← All areas"}</T>{" "}
      </Link>

      <header className="surface-card mt-4 overflow-hidden">
        <div className="h-1.5 truck-stripe" />
        <div className="p-6">
          <h1 className="font-display text-3xl font-bold text-ink">{place(area.name)}</h1>
          <p className="mt-1 text-muted-foreground">
            {area.routes.length} {""}
            <T>{"bus route"}</T>
            {""}
            {area.routes.length === 1 ? "" : "s"} {""}
            <T>{"pass through this area."}</T>{" "}
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
                {t(CATEGORY_META[c].label)} · {t(CATEGORY_META[c].fare)}
              </span>
            ))}
          </div>
        </div>
      </header>

      <h2 className="mt-10 font-display text-xl font-bold text-ink">
        {""}
        <T>{"Buses serving"}</T> {place(area.name)}
      </h2>
      <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {area.routes.map((r) => (
          <RouteCard key={r.slug} route={r} />
        ))}
      </div>
    </div>
  );
}
