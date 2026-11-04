import tripGuide from "@/assets/trip-guide.svg";
import savedGuide from "@/assets/saved-guide.svg";
import { Link } from "@tanstack/react-router";
import { useLanguage } from "./language";
export function JourneyHelpCard({
  kind,
  compact = false,
}: {
  kind: "plan" | "save";
  compact?: boolean;
}) {
  const { language } = useLanguage();
  const ur = language === "ur",
    plan = kind === "plan";
  const title = plan
    ? ur
      ? "اپنی منزل تک آسان راستہ"
      : "Not sure which bus to take?"
    : ur
      ? "روز کا سفر محفوظ کریں"
      : "Keep your everyday route handy";
  const body = plan
    ? ur
      ? "روانگی اور منزل لکھیں۔ کم بس تبدیلیوں اور کل اندازاً کرایے کے ساتھ سفر دیکھیں۔"
      : "Enter your start and destination. Compare practical journeys with fewer changes and a total fare estimate."
    : ur
      ? "روٹ یا سفر کے نیچے بس محفوظ کریں دبائیں۔ اگلی بار محفوظ فہرست سے کھولیں۔"
      : "Choose Save Bus on a route or journey. Open it from your saved list next time, without typing the stops again.";
  if (compact) {
    return (
      <Link
        to={plan ? "/plan" : "/saved"}
        className="surface-card hover-lift flex h-full items-center justify-between gap-3 p-5"
      >
        <div>
          <span
            aria-hidden="true"
            className={`inline-block size-2.5 rounded-full ${plan ? "bg-amber-500" : "bg-primary"}`}
          />
          <h3 className="mt-2 font-display font-semibold text-ink">{title}</h3>
          <p className="mt-1 text-xs text-muted-foreground">
            {plan
              ? ur
                ? "سفر تلاش کریں"
                : "Plan a trip"
              : ur
                ? "محفوظ بسیں کھولیں"
                : "Open saved buses"}
          </p>
        </div>
        <span aria-hidden="true" className="font-display text-2xl font-bold text-muted-foreground">
          {ur ? "←" : "→"}
        </span>
      </Link>
    );
  }
  return (
    <article className="surface-card flex h-full flex-col overflow-hidden">
      <img
        src={plan ? tripGuide : savedGuide}
        alt=""
        aria-hidden="true"
        width={640}
        height={360}
        loading="lazy"
        className={compact ? "h-28 w-full object-cover" : "h-48 w-full object-cover"}
      />
      <div className={`flex flex-1 flex-col ${compact ? "p-4" : "p-5"}`}>
        <h3 className="font-display text-lg font-bold text-ink">{title}</h3>
        {!compact && (
          <>
            <p className="mt-3 flex-1 text-base leading-7 text-muted-foreground">{body}</p>
            <p className="mt-4 text-sm leading-6 text-muted-foreground">
              {plan
                ? ur
                  ? "کہاں سے؟ ← کہاں تک؟ ← بس تلاش کریں"
                  : "From → To → Find buses"
                : ur
                  ? "یہ سہولت اسی براؤزر میں کام کرتی ہے۔"
                  : "Saved on this browser. No account needed."}
            </p>
          </>
        )}
        <Link
          to={plan ? "/plan" : "/saved"}
          className={`${compact ? "mt-3 text-sm text-primary" : "mt-6 rounded-xl bg-primary px-5 py-3 text-center text-base text-primary-foreground"} font-semibold`}
        >
          {plan
            ? ur
              ? "سفر تلاش کریں"
              : "Plan a trip"
            : ur
              ? "محفوظ بسیں کھولیں"
              : "Open saved buses"}{" "}
          →
        </Link>
      </div>
    </article>
  );
}
