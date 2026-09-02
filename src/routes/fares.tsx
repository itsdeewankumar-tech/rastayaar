import { createFileRoute } from "@tanstack/react-router";
import { CATEGORY_META, CATEGORY_ORDER, ROUTES } from "@/data/routes";

export const Route = createFileRoute("/fares")({
  head: () => ({
    meta: [
      { title: "Karachi Bus Fares 2026 — Mini Bus, Red Bus & EV | RastaYaar" },
      {
        name: "description",
        content:
          "Karachi bus fare guide: local mini bus and coach Rs. 30–150, EV Bus Rs. 80, Double Decker Rs. 80, Red Bus Rs. 80–120, BRT Green and Orange Line fares.",
      },
      { property: "og:title", content: "Karachi Bus Fares — RastaYaar" },
      {
        property: "og:description",
        content: "What each Karachi bus service costs, by fleet type.",
      },
    ],
  }),
  component: Fares,
});

function Fares() {
  return (
    <div className="container-page py-12">
      <h1 className="font-display text-4xl font-bold text-ink">Fares</h1>
      <p className="mt-2 max-w-2xl text-muted-foreground">
        Estimated fares for Karachi public transport. Local mini bus and coach fares depend on
        distance; government services charge a flat fare.
      </p>

      <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {CATEGORY_ORDER.map((c) => {
          const meta = CATEGORY_META[c];
          return (
            <div key={c} className="surface-card hover-lift p-5">
              <span
                className="inline-block size-2.5 rounded-full"
                style={{ backgroundColor: `var(--${meta.token})` }}
              />
              <h2 className="mt-2 font-display text-lg font-semibold text-ink">{meta.label}</h2>
              <p className="mt-1 font-display text-2xl font-bold text-primary">{meta.fare}</p>
              <p className="mt-2 text-xs text-muted-foreground">
                {ROUTES.filter((r) => r.category === c).length} routes in this guide
              </p>
            </div>
          );
        })}
      </div>

      <div className="surface-card mt-8 p-6">
        <h2 className="font-display text-lg font-semibold text-ink">How local fares work</h2>
        <ul className="mt-3 list-disc space-y-1.5 pl-5 text-sm text-muted-foreground">
          <li>Short hops on mini buses and coaches usually start around Estimated Rs. 30.</li>
          <li>Long, cross-city journeys on the same buses can reach Estimated Rs. 150.</li>
          <li>EV Bus is a flat Estimated Rs. 80 regardless of distance.</li>
          <li>
            Red Bus (Peoples Bus Service) is Estimated Rs. 80 – 120 depending on the corridor.
          </li>
          <li>Double Decker Bus (DD01) is a flat Estimated Rs. 80.</li>
          <li>Fares are estimated and can change; conductors announce the current rate.</li>
        </ul>
      </div>
    </div>
  );
}
