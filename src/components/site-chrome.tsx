import founderPortrait from "@/assets/deewan-kumar-founder.png";
import footerFacebookIcon from "@/assets/facebook-footer-icon.png";

import { T } from "@/components/language";
import { useLanguage } from "./language";
import { Link } from "@tanstack/react-router";
import { Mail, Bookmark } from "lucide-react";
import { CATEGORY_META, type RouteCategory, type BusRoute } from "@/data/routes";
import logoUrl from "@/assets/rastayaar-logo-v2.png";

const NAV = [
  { to: "/", label: "Home" },
  { to: "/plan", label: "Plan Trip" },
  { to: "/saved", label: "Save Bus" },
  { to: "/routes", label: "Bus Routes" },
  { to: "/areas", label: "Areas" },
  { to: "/blog", label: "Blogs" },
  { to: "/fares", label: "Fares" },
  { to: "/about", label: "About Us" },
  { to: "/contact", label: "Contact Us" },
  { to: "/privacy", label: "Privacy Policy" },
  { to: "/disclaimer", label: "Route Disclaimer" },
] as const;

export function SiteHeader() {
  const { t, language, setLanguage } = useLanguage();
  return (
    <header className="sticky top-0 z-50 border-b border-border/70 bg-surface/85 backdrop-blur-md">
      <div className="h-1 truck-stripe" />
      <div className="container-page header-layout flex min-h-16 items-center justify-between gap-3 py-2">
        <Link to="/" className="flex shrink-0 items-center gap-2.5">
          <img
            src={logoUrl}
            alt="RastaYaar — Karachi public transport route finder"
            title="RastaYaar logo"
            width={240}
            height={80}
            loading="eager"
            className="h-14 w-auto max-w-[28vw] object-contain"
          />
          <span className="sr-only">
            {""}
            <T>{"RastaYaar — Karachi Transport"}</T>
            {""}
          </span>
        </Link>
        <button
          type="button"
          onClick={() => setLanguage(language === "en" ? "ur" : "en")}
          aria-label="Switch language / زبان تبدیل کریں"
          className="inline-flex min-h-11 shrink-0 items-center rounded-full border border-primary/25 bg-secondary/60 px-4 py-1.5 text-lg font-semibold text-primary"
        >
          {language === "en" ? "اردو" : "English"}
        </button>
        <nav
          aria-label={t("Main navigation")}
          className="main-nav flex min-w-0 flex-1 items-center justify-center gap-1 overflow-x-auto text-base font-medium lg:text-lg"
        >
          {NAV.filter((item) => !["/privacy", "/disclaimer", "/saved"].includes(item.to)).map(
            (item) => (
              <Link
                key={item.to}
                to={item.to}
                activeOptions={{ exact: item.to === "/" }}
                className={`inline-flex min-h-10 shrink-0 items-center whitespace-nowrap rounded-full px-1.5 py-2 text-ink transition-colors hover:bg-secondary hover:text-secondary-foreground ${item.to === "/saved" ? "save-bus-link font-semibold text-primary" : ""}`}
                activeProps={{ className: "bg-primary text-primary-foreground hover:bg-primary" }}
              >
                {t(item.label)}
              </Link>
            ),
          )}
        </nav>
        <Link
          to="/saved"
          className="header-save-cta inline-flex min-h-12 shrink-0 items-center justify-center gap-2 rounded-xl bg-primary px-5 py-2.5 text-lg font-bold text-primary-foreground transition-colors hover:bg-primary/90"
        >
          <Bookmark aria-hidden="true" className="size-5" />
          {t("Save Bus")}
        </Link>
      </div>
    </header>
  );
}

export function SiteFooter() {
  const { t, place, language, setLanguage } = useLanguage();
  return (
    <footer className="mt-20 border-t border-border bg-secondary/40">
      <div className="container-page grid gap-8 py-12 sm:grid-cols-2 lg:grid-cols-4">
        <div>
          <p className="font-display text-lg font-bold text-ink">
            {""}
            <T>{"RastaYaar"}</T>
            {""}
          </p>
          <p className="mt-2 text-sm text-muted-foreground">
            {""}
            <T>
              {
                "Find Your Bus. Find Your Way. A community route guide for Karachi public transport."
              }
            </T>{" "}
          </p>
        </div>
        <div className="text-sm">
          <p className="font-display font-semibold text-ink">
            {""}
            <T>{"Explore"}</T>
            {""}
          </p>
          <button
            type="button"
            onClick={() => setLanguage(language === "en" ? "ur" : "en")}
            aria-label="Switch language / زبان تبدیل کریں"
            className="mb-3 mt-3 language-switch inline-flex min-h-10 shrink-0 items-center rounded-full border border-primary/25 bg-secondary/60 px-3 py-1.5 text-sm font-semibold text-primary"
          >
            <span>{language === "en" ? "اردو" : "English"}</span>
          </button>
          <ul className="mt-2 space-y-1.5 text-muted-foreground">
            {NAV.slice(1).map((n) => (
              <li key={n.to}>
                <Link to={n.to} className="transition-colors hover:text-primary">
                  {t(n.label)}
                </Link>
              </li>
            ))}
          </ul>
        </div>
        <div className="text-sm">
          <p className="font-display font-semibold text-ink">
            {""}
            <T>{"Fares at a glance"}</T>
            {""}
          </p>
          <ul className="mt-2 space-y-1.5 text-muted-foreground">
            <li>
              {""}
              <T>{"Mini bus / coach: Estimated Rs. 30 – 150"}</T>
              {""}
            </li>
            <li>
              {""}
              <T>{"EV Bus / Double Decker: Estimated Rs. 80"}</T>
              {""}
            </li>
            <li>
              {""}
              <T>{"Red Bus: Estimated Rs. 80 – 120"}</T>
              {""}
            </li>
          </ul>
        </div>
        <div className="text-base">
          <p className="font-display font-semibold text-ink">
            {""}
            <T>{"Contact"}</T>
            {""}
          </p>
          <div className="mt-3">
            <FacebookLink />
          </div>
          <ul className="mt-4 space-y-2 text-muted-foreground">
            <li>
              <a
                href="mailto:rastayaar@gmail.com"
                className="inline-flex items-center gap-2 transition-colors hover:text-primary"
              >
                <Mail className="size-5" />
                {""}
                <T>{"rastayaar@gmail.com"}</T>{" "}
              </a>
            </li>
          </ul>
        </div>
      </div>

      <div className="border-t border-border py-5">
        <div className="container-page">
          <div
            dir="ltr"
            className="mt-4 flex flex-wrap items-center justify-between gap-3 text-xs text-muted-foreground"
          >
            <p dir="auto" className="text-left">
              <T>{"© 2026 RastaYaar. All rights reserved."}</T>
            </p>
            <p dir="auto">
              <Link to="/privacy" className="underline underline-offset-2">
                <T>{"Privacy Policy"}</T>
              </Link>{" "}
              ·{" "}
              <Link to="/disclaimer" className="underline underline-offset-2">
                <T>{"Route data disclaimer"}</T>
              </Link>
            </p>
          </div>
          <p className="mt-5 text-center text-sm font-semibold text-primary">
            {t("Founder")}: <bdi>Deewan Kumar</bdi>
          </p>
          <p className="mt-2 text-center text-xs text-muted-foreground">
            <T>{"For public information only. Route details and fares may change."}</T>
          </p>
        </div>
      </div>
    </footer>
  );
}

export function CategoryBadge({ category }: { category: RouteCategory }) {
  const { t, place, language, setLanguage } = useLanguage();
  const meta = CATEGORY_META[category];
  return (
    <span
      className="inline-flex items-center rounded-full px-2.5 py-0.5 text-[11px] font-semibold uppercase tracking-wide"
      style={{
        color: `var(--${meta.token})`,
        backgroundColor: `color-mix(in oklch, var(--${meta.token}) 14%, transparent)`,
      }}
    >
      {t(meta.short)}
    </span>
  );
}

export function RouteCard({ route }: { route: BusRoute }) {
  const { t, place, language, setLanguage } = useLanguage();
  const meta = CATEGORY_META[route.category];
  return (
    <Link
      to="/routes/$slug"
      params={{ slug: route.slug }}
      className="surface-card hover-lift group flex flex-col gap-3 p-5"
    >
      <div className="flex items-start justify-between gap-3">
        <span
          className="rounded-lg px-3 py-1.5 font-display text-base font-bold text-primary-foreground"
          style={{ backgroundColor: `var(--${meta.token})` }}
        >
          {route.code}
        </span>
        <CategoryBadge category={route.category} />
      </div>
      <p className="line-clamp-2 text-sm text-muted-foreground">
        {place(route.stops[0])} → {place(route.stops[route.stops.length - 1])}
      </p>
      <div className="mt-auto flex items-center justify-between pt-1 text-xs text-muted-foreground">
        <span>
          {route.stops.length} {""}
          <T>{"stops"}</T>
          {""}
        </span>
        <span className="font-semibold text-accent-foreground">{t(meta.fare)}</span>
      </div>
    </Link>
  );
}

export function FacebookLink() {
  const { t } = useLanguage();
  return (
    <a
      href="https://www.facebook.com/share/1FKjfzK2u6/"
      target="_blank"
      rel="noopener noreferrer"
      aria-label={t("Visit RastaYaar on Facebook")}
      className="inline-flex min-h-10 items-center gap-2 text-base text-muted-foreground underline-offset-4 hover:underline"
    >
      <img
        src={footerFacebookIcon}
        alt=""
        width={24}
        height={24}
        className="size-6 shrink-0 object-contain"
      />
      <span>
        RastaYaar <span className="font-normal">· Facebook</span>
      </span>
    </a>
  );
}
export function FounderCredit() {
  const { t } = useLanguage();
  return (
    <section className="container-page mt-12" aria-labelledby="founder-heading">
      <div className="flex flex-col items-center gap-6 rounded-2xl border border-[#efd1be] bg-[#fff2e9] px-6 py-8 text-center sm:flex-row sm:gap-8 sm:px-9 sm:text-start">
        <div className="h-36 w-28 shrink-0 overflow-hidden rounded-md border-4 border-white shadow-[0_0_0_1px_#efd1be]">
          <img
            src={founderPortrait}
            alt="Deewan Kumar, Founder of RastaYaar"
            width={112}
            height={144}
            loading="lazy"
            className="size-full origin-[50%_28%] scale-[2.2] object-cover"
          />
        </div>
        <div className="min-w-0">
          <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-primary">
            {t("Meet the founder")}
          </p>
          <h2
            id="founder-heading"
            className="mt-2 text-2xl font-bold tracking-tight text-[#152c36] sm:text-3xl"
          >
            <bdi>Deewan Kumar</bdi>
          </h2>
          <p className="mt-1 text-sm text-[#59666c]">{t("Founder, RastaYaar")}</p>
          <p className="mt-4 max-w-4xl text-sm leading-7 text-[#59666c]">
            {t(
              "Turning everyday commuting challenges into simple digital solutions, one journey at a time. Building a smarter, more accessible public transport experience for Karachi.",
            )}
          </p>
        </div>
      </div>
    </section>
  );
}
