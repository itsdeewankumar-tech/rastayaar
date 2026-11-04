import { Link } from "@tanstack/react-router";
import { type TripPlan, type TripPreference } from "@/lib/trip-planner";
import { CATEGORY_META } from "@/data/routes";
import { canonicalPlace } from "@/data/places";
import { useLanguage } from "./language";
import { SaveButton } from "./saved-routes";
import { WalkingDistance } from "./walking-distance";
export function JourneyResult({
  plan,
  rank,
  from,
  to,
  walk,
  preference,
}: {
  plan: TripPlan;
  rank: number;
  from: string;
  to: string;
  walk: string;
  preference: TripPreference;
}) {
  const { t, place, language } = useLanguage();
  const ur = language === "ur";
  const codes = plan.legs.map((l) => l.route.code).join(" → ");
  const metropoleConnection =
    plan.legs.some(
      (l) =>
        l.route.code === "N-5" &&
        (canonicalPlace(l.from) === "metropole" || canonicalPlace(l.to) === "metropole"),
    ) &&
    (canonicalPlace(from) === "sultanabad" || canonicalPlace(to) === "sultanabad");
  return (
    <li className="surface-card overflow-hidden">
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-border bg-secondary/40 px-5 py-5 sm:px-6">
        <div>
          <p className="text-sm font-semibold text-primary">
            {ur ? `راستہ ${rank + 1}` : `Journey ${rank + 1}`}
            {rank === 0 ? (ur ? " · پہلا تجویز کردہ راستہ" : " · First recommendation") : ""}
          </p>
          <h3 className="mt-1 text-xl font-bold text-ink">
            {ur
              ? `${plan.legs.length} بسیں · ${plan.changes === 0 ? "بس بدلنے کی ضرورت نہیں" : `${plan.changes} بار بس بدلیں`}`
              : `${plan.legs.length} ${plan.legs.length === 1 ? "bus" : "buses"} · ${plan.changes === 0 ? "No changes" : `${plan.changes} ${plan.changes === 1 ? "change" : "changes"}`}`}
          </h3>
          <p className="mt-2 text-base font-semibold text-ink">
            <bdi>{codes}</bdi>
          </p>
        </div>
        <div className="rounded-xl border border-primary/15 bg-surface px-4 py-3">
          <p className="text-sm text-muted-foreground">
            {ur ? "پورے سفر کا اندازاً کرایہ" : "Estimated total fare"}
          </p>
          <p className="mt-1 text-xl font-bold text-primary">
            <bdi>
              Rs. {plan.fare.min}–{plan.fare.max}
            </bdi>
          </p>
        </div>
      </div>
      <div className="p-5 sm:p-6">
        <ol className="space-y-4">
          {plan.legs.map((leg, index) => (
            <li key={index}>
              {index > 0 && (
                <p className="mb-4 rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-base leading-7 text-amber-950">
                  {ur
                    ? `${place(leg.from)} پر بس بدلیں۔ اب ${leg.route.code} میں سوار ہوں۔`
                    : `Change at ${place(leg.from)}. Next, board ${leg.route.code}.`}
                </p>
              )}
              <div className="rounded-xl border border-border p-4 sm:p-5">
                <div className="flex flex-wrap items-center gap-3">
                  <span
                    className="grid size-10 shrink-0 place-items-center rounded-full border-2 border-white text-lg font-bold text-white shadow-md"
                    style={{
                      backgroundColor: ["#1d4ed8", "#7c3aed", "#b45309"][index % 3] ?? "#1d4ed8",
                    }}
                  >
                    {index + 1}
                  </span>
                  <p className="text-lg font-bold">
                    {ur ? "یہ بس لیں" : "Take bus"}{" "}
                    <Link
                      to="/routes/$slug"
                      params={{ slug: leg.route.slug }}
                      className="ms-1 inline-block rounded-lg px-3 py-1.5 text-white"
                      style={{
                        backgroundColor: `var(--${CATEGORY_META[leg.route.category].token})`,
                      }}
                    >
                      <bdi>{leg.route.code}</bdi>
                    </Link>
                  </p>
                  <span className="text-sm text-muted-foreground">
                    {t(CATEGORY_META[leg.route.category].label)}
                  </span>
                </div>
                <div className="mt-4 grid gap-4 rounded-xl bg-muted/50 p-4 sm:grid-cols-2">
                  <div>
                    <p className="text-sm font-semibold text-muted-foreground">
                      {ur ? "یہاں سوار ہوں" : "Board at"}
                    </p>
                    <p className="mt-1 text-lg font-bold text-ink">{place(leg.from)}</p>
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-muted-foreground">
                      {ur ? "یہاں اتریں" : "Get off at"}
                    </p>
                    <p className="mt-1 text-lg font-bold text-ink">{place(leg.to)}</p>
                  </div>
                </div>
                <p className="mt-3 text-sm text-muted-foreground">
                  {ur ? "اس بس کا اندازاً کرایہ" : "This bus fare"}:{" "}
                  <strong className="text-ink">{t(CATEGORY_META[leg.route.category].fare)}</strong>
                </p>
                <details className="mt-3 text-base">
                  <summary className="cursor-pointer font-semibold text-primary">
                    {ur
                      ? `تمام ${leg.stops.length} درج اسٹاپ دیکھیں`
                      : `View all ${leg.stops.length} recorded stops`}
                  </summary>
                  <ol className="mt-3 list-inside list-decimal space-y-2 text-ink">
                    {leg.stops.map((s, j) => (
                      <li key={j}>{place(s)}</li>
                    ))}
                  </ol>
                </details>
              </div>
            </li>
          ))}
        </ol>
        {metropoleConnection && (
          <details className="mt-5 rounded-xl border border-border p-4">
            <summary className="cursor-pointer text-base font-semibold text-primary">
              {ur
                ? "این 5 کے بجائے پیدل جانا چاہتے ہیں؟ پہلے فاصلہ دیکھیں۔"
                : "Thinking of walking instead of N-5? Check the distance first."}
            </summary>
            <p className="mt-3 text-sm leading-6 text-muted-foreground">
              {ur
                ? "پیدل فاصلہ ابھی معلوم نہیں۔ گوگل پر راستہ اور پیدل گزرنے کی سہولت دیکھ کر فیصلہ کریں۔"
                : "Walking distance has not been verified. Check the route and pedestrian access before deciding."}
            </p>
            <WalkingDistance
              from={canonicalPlace(from) === "sultanabad" ? from : "Metropole"}
              to={canonicalPlace(from) === "sultanabad" ? "Metropole" : to}
            />
          </details>
        )}
        {walk && <WalkingDistance from={plan.legs.at(-1)!.to} to={walk} />}
        <div className="mt-5">
          <SaveButton
            wide
            item={{
              id: `trip:${canonicalPlace(from)}|${canonicalPlace(to)}|${walk}|${plan.legs.map((l) => l.route.slug).join("|")}`,
              kind: "trip",
              routeSlug: "",
              from,
              to,
              walk,
              services: plan.legs.map((l) => l.route.slug).join("|"),
              preference,
            }}
          />
        </div>
        <p className="mt-4 text-sm leading-6 text-muted-foreground">
          {t(
            "Route order and fares are estimates from community records. Confirm the boarding point and fare locally.",
          )}
        </p>
        <a
          className="mt-3 inline-block text-sm font-semibold text-primary underline"
          target="_blank"
          rel="noopener noreferrer"
          href={`https://www.google.com/maps/dir/?api=1&origin=${encodeURIComponent(from + ", Karachi")}&destination=${encodeURIComponent((walk || to) + ", Karachi")}&travelmode=transit`}
        >
          {t("Compare with Google Maps Transit")}
        </a>
      </div>
    </li>
  );
}
