import { createFileRoute, Link } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { AreaPicker } from "@/components/area-picker";
import { planTrip } from "@/lib/trip-planner";
import { CATEGORY_META, getArea, slugify, type RouteCategory } from "@/data/routes";

export const Route = createFileRoute("/plan")({
  head: () => ({
    meta: [
      { title: "Plan a Bus Trip in Karachi — RastaYaar" },
      {
        name: "description",
        content:
          "Enter where you are and where you're going in Karachi and get direct buses or one-transfer routes with fares.",
      },
      { property: "og:title", content: "Plan a Bus Trip in Karachi — RastaYaar" },
      {
        property: "og:description",
        content: "Direct and one-change bus journeys between any two Karachi stops.",
      },
      { property: "og:url", content: "/plan" },
    ],
    links: [{ rel: "canonical", href: "/plan" }],
  }),
  component: PlanPage,
});

function fareFor(categories: RouteCategory[]) {
  return categories.map((c) => CATEGORY_META[c].fare).join(" + ");
}

function PlanPage() {
  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");
  const [submitted, setSubmitted] = useState<{ from: string; to: string } | null>(null);

  const plans = useMemo(
    () => (submitted ? planTrip(submitted.from, submitted.to) : []),
    [submitted],
  );

  const validFrom = !!getArea(slugify(from));
  const validTo = !!getArea(slugify(to));

  return (
    <div className="container-page py-12">
      <h1 className="font-display text-4xl font-bold text-ink">Plan your trip</h1>
      <p className="mt-2 max-w-2xl text-muted-foreground">
        Pick where you are and where you're headed. RastaYaar finds direct buses first, then
        one-change journeys through a common stop.
      </p>

      <form
        className="surface-card mt-6 grid gap-4 p-5 sm:grid-cols-[1fr_1fr_auto] sm:items-end"
        onSubmit={(e) => {
          e.preventDefault();
          setSubmitted({ from: from.trim(), to: to.trim() });
        }}
      >
        <AreaPicker
          id="from"
          label="From"
          value={from}
          onChange={setFrom}
          placeholder="e.g. Sultanabad"
        />
        <AreaPicker
          id="to"
          label="To"
          value={to}
          onChange={setTo}
          placeholder="e.g. Korangi Crossing"
        />
        <button
          type="submit"
          disabled={!validFrom || !validTo}
          className="rounded-xl bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground transition-transform enabled:hover:-translate-y-0.5 disabled:opacity-45"
        >
          Find buses
        </button>
      </form>

      {submitted && plans.length === 0 && (
        <p className="mt-8 text-muted-foreground">
          No direct or single-transfer bus found between {submitted.from} and {submitted.to}. Try a
          bigger nearby stop such as a chorangi or main road.
        </p>
      )}

      {plans.length > 0 && (
        <>
          <h2 className="mt-10 font-display text-xl font-bold text-ink">
            {plans.length} option{plans.length === 1 ? "" : "s"} from {submitted!.from} to{" "}
            {submitted!.to}
          </h2>
          <ul className="mt-4 space-y-3">
            {plans.map((p, i) => (
              <li key={i} className="surface-card hover-lift p-5">
                {p.kind === "direct" ? (
                  <div className="flex flex-wrap items-center gap-3">
                    <span className="rounded-full bg-cat-ev/15 px-2.5 py-0.5 text-[11px] font-bold uppercase tracking-wide text-cat-ev">
                      Direct
                    </span>
                    <Link
                      to="/routes/$slug"
                      params={{ slug: p.route.slug }}
                      className="rounded-lg px-3 py-1.5 font-display font-bold text-primary-foreground"
                      style={{ backgroundColor: `var(--${CATEGORY_META[p.route.category].token})` }}
                    >
                      {p.route.code}
                    </Link>
                    <span className="text-sm text-muted-foreground">
                      {p.from} → {p.to} · about {p.hops} stops ·{" "}
                      <span className="font-semibold text-primary">
                        {CATEGORY_META[p.route.category].fare}
                      </span>
                    </span>
                  </div>
                ) : (
                  <div className="flex flex-wrap items-center gap-3">
                    <span className="rounded-full bg-accent/20 px-2.5 py-0.5 text-[11px] font-bold uppercase tracking-wide text-accent-foreground">
                      1 change
                    </span>
                    <Link
                      to="/routes/$slug"
                      params={{ slug: p.first.slug }}
                      className="rounded-lg px-3 py-1.5 font-display font-bold text-primary-foreground"
                      style={{ backgroundColor: `var(--${CATEGORY_META[p.first.category].token})` }}
                    >
                      {p.first.code}
                    </Link>
                    <span className="text-sm text-muted-foreground">
                      to{" "}
                      <Link
                        to="/areas/$slug"
                        params={{ slug: slugify(p.interchange) }}
                        className="font-semibold text-ink hover:text-primary"
                      >
                        {p.interchange}
                      </Link>
                      , then
                    </span>
                    <Link
                      to="/routes/$slug"
                      params={{ slug: p.second.slug }}
                      className="rounded-lg px-3 py-1.5 font-display font-bold text-primary-foreground"
                      style={{
                        backgroundColor: `var(--${CATEGORY_META[p.second.category].token})`,
                      }}
                    >
                      {p.second.code}
                    </Link>
                    <span className="text-sm text-muted-foreground">
                      · about {p.hops} stops ·{" "}
                      <span className="font-semibold text-primary">
                        {fareFor([p.first.category, p.second.category])}
                      </span>
                    </span>
                  </div>
                )}
              </li>
            ))}
          </ul>
        </>
      )}
    </div>
  );
}
