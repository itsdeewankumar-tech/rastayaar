
import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import {
  getRoute,
  CATEGORY_META,
  CATEGORY_ORDER,
  slugify,
  ROUTES,
  scoreMatch,
  type RouteCategory,
} from "@/data/routes";
import { CategoryBadge, RouteCard } from "@/components/site-chrome";

type CategorySlug = RouteCategory | "local_bus";

const LOCAL_BUS_CATEGORIES: RouteCategory[] = [
  "mini_bus",
  "coach",
  "named_route",
];

function isCategorySlug(slug: string): slug is CategorySlug {
  return slug === "local_bus" ||
    (CATEGORY_ORDER as string[]).includes(slug);
}

export const Route = createFileRoute("/routes/$slug")({
  loader: ({ params }) => {
    if (isCategorySlug(params.slug)) {
      return { kind: "category" as const, category: params.slug };
    }

    const route = getRoute(params.slug);
    if (!route) throw notFound();

    return { kind: "route" as const, route };
  },

  head: ({ loaderData }) => {
    if (!loaderData) {
      return {
        meta: [
          { title: "Page not found — RastaYaar" },
          { name: "robots", content: "noindex" },
        ],
      };
    }

    if (loaderData.kind === "category") {
      const category = loaderData.category;
      const label =
        category === "local_bus"
          ? "Local Bus"
          : CATEGORY_META[category].label;
      const title = `${label} Routes in Karachi — RastaYaar`;
      const description = `Explore ${label} routes in Karachi, including bus stops and route details.`;

      return {
        meta: [
          { title },
          { name: "description", content: description },
          { property: "og:title", content: title },
          { property: "og:description", content: description },
        ],
      };
    }

    const { route } = loaderData;
    const meta = CATEGORY_META[route.category];
    const title = `${route.code} Bus Route — Stops & Fare | RastaYaar`;
    const desc = `${route.code} (${meta.label}) runs from ${
      route.stops[0]
    } to ${route.stops[route.stops.length - 1]} via ${
      route.stops.length
    } stops. Fare ${meta.fare}.`;

    return {
      meta: [
        { title },
        { name: "description", content: desc },
        { property: "og:title", content: title },
        { property: "og:description", content: desc },
      ],
    };
  },

  component: RoutePage,
});

function RoutePage() {
  const data = Route.useLoaderData();

  if (data.kind === "category") {
    return <CategoryPage category={data.category} />;
  }

  return <RouteDetail route={data.route} />;
}

function CategoryPage({ category }: { category: CategorySlug }) {
  const [q, setQ] = useState("");

  const list = useMemo(() => {
    let items = category === "local_bus"
      ? ROUTES.filter((r) => LOCAL_BUS_CATEGORIES.includes(r.category))
      : ROUTES.filter((r) => r.category === category);

    if (q.trim()) {
      items = items
        .map((r) => ({
          route: r,
          score: Math.max(
            scoreMatch(r.code, q),
            ...r.stops.map((s) => scoreMatch(s, q) > 40 ? 40 : 0),
          ),
        }))
        .filter((x) => x.score > 0)
        .sort((a, b) => b.score - a.score)
        .map((x) => x.route);
    }

    return items;
  }, [category, q]);

  const label =
    category === "local_bus"
      ? "Local Bus (Mini Bus & Coach)"
      : CATEGORY_META[category].label;

  return (
    <div className="container-page py-12">
      <Link
        to="/routes"
        search={{}}
        className="text-sm text-muted-foreground hover:text-primary"
      >
        ← All routes
      </Link>

      <h1 className="mt-4 font-display text-4xl font-bold text-ink">
        {label}
      </h1>

      <p className="mt-2 max-w-2xl text-muted-foreground">
        {list.length} routes found in this category.
      </p>

      <div className="mt-6 flex flex-wrap gap-2">
        <Link
          to="/routes"
          search={{}}
          className="rounded-full border border-border px-3 py-1.5 text-sm hover:border-primary"
        >
          All routes
        </Link>

        {CATEGORY_ORDER.map((key) => (
          <Link
            key={key}
            to="/routes/$slug"
            params={{ slug: key }}
            className={`rounded-full border px-3 py-1.5 text-sm transition-colors hover:border-primary ${
              category === key
                ? "border-primary bg-primary text-primary-foreground"
                : "border-border"
            }`}
          >
            {CATEGORY_META[key].label}
          </Link>
        ))}

        <Link
          to="/routes/$slug"
          params={{ slug: "local_bus" }}
          className={`rounded-full border px-3 py-1.5 text-sm transition-colors hover:border-primary ${
            category === "local_bus"
              ? "border-primary bg-primary text-primary-foreground"
              : "border-border"
          }`}
        >
          Local Bus
        </Link>
      </div>

      <input
        value={q}
        onChange={(event) => setQ(event.target.value)}
        placeholder="Search by bus number or stop..."
        className="mt-6 w-full max-w-md rounded-xl border border-border bg-surface px-4 py-3 text-sm outline-none focus:border-primary"
      />

      {list.length > 0 ? (
        <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {list.map((route) => (
            <RouteCard key={route.slug} route={route} />
          ))}
        </div>
      ) : (
        <p className="mt-8 text-muted-foreground">
          No routes found. Try another search.
        </p>
      )}
    </div>
  );
}

function RouteDetail({ route }: { route: (typeof ROUTES)[number] }) {
  const meta = CATEGORY_META[route.category];

  const related = ROUTES.filter(
    (r) =>
      r.slug !== route.slug &&
      r.stops.some((s) => route.stops.includes(s)),
  ).slice(0, 6);

  return (
    <div className="container-page py-12">
      <Link
        to="/routes"
        search={{}}
        className="text-sm text-muted-foreground hover:text-primary"
      >
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
              <h1 className="font-display text-2xl font-bold text-ink">
                {meta.label}
              </h1>
              <CategoryBadge category={route.category} />
            </div>

            <p className="text-sm text-muted-foreground">
              {route.stops[0]} → {route.stops[route.stops.length - 1]} ·{" "}
              {route.stops.length} stops
            </p>
          </div>

          <div className="ml-auto rounded-xl bg-secondary px-4 py-2 text-center">
            <p className="text-[11px] uppercase tracking-wide text-muted-foreground">
              Fare
            </p>
            <p className="font-display text-lg font-bold text-primary">
              {meta.fare}
            </p>
          </div>
        </div>
      </header>

      <h2 className="mt-10 font-display text-xl font-bold text-ink">
        Route stops
      </h2>

      <ol className="mt-4 grid gap-x-8 sm:grid-cols-2 lg:grid-cols-3">
        {route.stops.map((stop, i) => (
          <li
            key={`${stop}-${i}`}
            className="relative flex gap-3 pb-4 pl-1"
          >
            <span className="relative flex flex-col items-center">
              <span
                className="mt-1.5 size-3 shrink-0 rounded-full border-2 border-surface"
                style={{ backgroundColor: `var(--${meta.token})` }}
              />
              {i < route.stops.length - 1 && (
                <span className="w-px flex-1 bg-border" />
              )}
            </span>

            <Link
              to="/areas/$slug"
              params={{ slug: slugify(stop) }}
              className="text-sm transition-colors hover:text-primary"
            >
              <span className="mr-1.5 text-xs text-muted-foreground">
                {i + 1}.
              </span>
              {stop}
            </Link>
          </li>
        ))}
      </ol>

      {related.length > 0 && (
        <>
          <h2 className="mt-8 font-display text-xl font-bold text-ink">
            Connecting buses
          </h2>

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
