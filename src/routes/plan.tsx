import { JourneyResult } from "@/components/journey-result";
import { canonicalPlace } from "@/data/places";
import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { AreaPicker } from "@/components/area-picker";
import { RouteStopMap } from "@/components/route-stop-map";
import { planTrip, type TripPreference } from "@/lib/trip-planner";
import { useLanguage } from "@/components/language";
import { ExternalSearch } from "@/components/external-search";
type PlanSearch = {
  from?: string;
  to?: string;
  walk?: string;
  services?: string;
  preference?: TripPreference;
};
export const Route = createFileRoute("/plan")({
  validateSearch: (search: Record<string, unknown>): PlanSearch => {
    const valid: PlanSearch = {};
    for (const key of ["from", "to", "walk", "services"] as const)
      if (typeof search[key] === "string")
        valid[key] = search[key].slice(0, key === "services" ? 600 : 160);
    if (
      ["balanced", "fewest-transfers", "fewest-stops", "lower-fare"].includes(
        String(search["preference"]),
      )
    )
      valid.preference = search["preference"] as TripPreference;
    return valid;
  },
  head: () => ({
    meta: [
      { title: "Plan a Bus Trip in Karachi — RastaYaar" },
      {
        name: "description",
        content:
          "Compare Karachi bus journeys by fare, stops and transfers, with return routes and walking directions.",
      },
    ],
    links: [{ rel: "canonical", href: "https://www.rastayaar.com/plan" }],
  }),
  component: PlanPage,
});
const preferences: [TripPreference, string][] = [
  ["balanced", "Best balance"],
  ["lower-fare", "Lowest fare"],
  ["fewest-stops", "Fewest stops"],
  ["fewest-transfers", "Fewest changes"],
];
function PlanPage() {
  const { t, place, language } = useLanguage();
  const initial = Route.useSearch();
  const [from, setFrom] = useState(initial.from ?? ""),
    [to, setTo] = useState(initial.to ?? "");
  const [preference, setPreference] = useState<TripPreference>(initial.preference ?? "balanced");
  const [includeWomenOnly, setIncludeWomenOnly] = useState(
    initial.services?.includes("pink-") ?? false,
  );
  const [submitted, setSubmitted] = useState<{ from: string; to: string; walk: string } | null>(
    initial.from && initial.to
      ? { from: initial.from, to: initial.to, walk: initial.walk ?? "" }
      : null,
  );
  useEffect(() => {
    if (initial.from && initial.to) {
      setFrom(initial.from);
      setTo(initial.to);
      setPreference(initial.preference ?? "balanced");
      setIncludeWomenOnly(initial.services?.includes("pink-") ?? false);
      setSubmitted({ from: initial.from, to: initial.to, walk: initial.walk ?? "" });
    }
  }, [initial.from, initial.to, initial.walk, initial.preference, initial.services]);
  const plans = useMemo(() => {
    const found = submitted
      ? planTrip(submitted.from, submitted.to, initial.services ? 100 : 6, preference, {
          includeWomenOnly,
        })
      : [];
    const saved = found.find(
      (plan) => plan.legs.map((leg) => leg.route.slug).join("|") === initial.services,
    );
    return saved && preference === (initial.preference ?? "balanced")
      ? [saved, ...found.filter((p) => p !== saved)]
      : found;
  }, [submitted, preference, includeWomenOnly, initial.services, initial.preference]);
  return (
    <div className="container-page py-12">
      <h1 className="font-display text-4xl font-bold text-ink">{t("Plan your trip")}</h1>
      <p className="mt-2 max-w-2xl text-muted-foreground">
        {t("Enter a Karachi area or landmark. Compare journeys by fare, stops or bus changes.")}
      </p>
      <form
        className="surface-card mt-6 grid gap-4 p-5 sm:grid-cols-2"
        onSubmit={(e) => {
          e.preventDefault();
          const oak = canonicalPlace(to.trim().replace(/\s+karachi$/i, "")) === "oak tower";
          setSubmitted({
            from: from.trim(),
            to: oak ? "Shaheen Complex" : to.trim(),
            walk: oak ? to.trim() : "",
          });
        }}
      >
        <AreaPicker
          id="from"
          label="From"
          value={from}
          onChange={setFrom}
          placeholder={language === "ur" ? "مثلاً گلبرگ" : "e.g. Gulberg / Water Pump"}
        />
        <AreaPicker
          id="to"
          label="To"
          value={to}
          onChange={setTo}
          placeholder={
            language === "ur" ? "مثلاً نیپا یا این ای ڈی" : "e.g. NIPA, CBM / IoBM, Oak Tower"
          }
        />
        <label className="text-lg font-semibold sm:col-span-2">
          {t("Sort journeys")}
          <select
            value={preference}
            onChange={(e) => setPreference(e.target.value as TripPreference)}
            className="mt-1 w-full rounded-xl border bg-surface px-4 py-2.5"
          >
            {preferences.map(([v, label]) => (
              <option key={v} value={v}>
                {t(label)}
              </option>
            ))}
          </select>
        </label>
        <label className="pink-service-option flex cursor-pointer items-center gap-4 rounded-2xl border-2 border-pink-300 bg-pink-50 p-4 text-base font-semibold text-pink-950 sm:col-span-2">
          <input
            type="checkbox"
            className="size-5 shrink-0 accent-pink-700"
            checked={includeWomenOnly}
            onChange={(event) => setIncludeWomenOnly(event.target.checked)}
          />
          {t("Include women-only Pink Bus services")}
        </label>
        <button
          disabled={!from.trim() || !to.trim()}
          className="min-h-12 rounded-xl bg-primary px-5 py-3 text-base font-bold text-primary-foreground disabled:opacity-50 sm:col-span-2"
        >
          {t("Find buses")}
        </button>
      </form>
      {submitted && plans.length === 0 && (
        <section className="surface-card mt-8 p-5">
          <h2 className="font-semibold">{t("No recorded journey connects these places yet.")}</h2>
          <ExternalSearch
            key={`${submitted.from}|${submitted.to}|${language}`}
            autoSearch
            query={`Bus from ${submitted.from} to ${submitted.to} in Karachi`}
          />
        </section>
      )}
      {plans.length > 0 && (
        <>
          <h2 className="mt-8 text-xl font-bold">
            {place(submitted!.from)} → {place(submitted!.to)} · {plans.length}{" "}
            {language === "ur" ? "راستے" : "journeys"}
          </h2>
          <ul className="mt-4 space-y-4">
            {plans.map((plan, i) => (
              <JourneyResult
                key={plan.legs.map((l) => l.route.slug).join("|")}
                plan={plan}
                rank={i}
                from={submitted!.from}
                to={submitted!.to}
                walk={submitted!.walk}
                preference={preference}
              />
            ))}
          </ul>
          <RouteStopMap
            from={submitted!.from}
            to={submitted!.to}
            legs={plans[0]!.legs.map((leg, i) => ({
              code: leg.route.code,
              stops: leg.stops,
              color: ["#0f766e", "#2563eb", "#9333ea"][i % 3]!,
            }))}
          />
        </>
      )}
    </div>
  );
}
