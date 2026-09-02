import { Link } from "@tanstack/react-router";
import { Mail } from "lucide-react";
import { CATEGORY_META, type RouteCategory, type BusRoute } from "@/data/routes";
import logoUrl from "@/assets/rastayaar-logo-v2.png";

const NAV = [
  { to: "/", label: "Home" },
  { to: "/plan", label: "Plan Trip" },
  { to: "/routes", label: "Routes" },
  { to: "/areas", label: "Areas" },
  { to: "/fares", label: "Fares" },
  { to: "/about", label: "About" },
  { to: "/contact", label: "Contact" },
] as const;

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-50 border-b border-border/70 bg-surface/85 backdrop-blur-md">
      <div className="h-1 truck-stripe" />
      <div className="container-page flex h-16 items-center justify-between gap-4">
        <Link to="/" className="flex items-center gap-2.5">
          <img
            src={logoUrl}
            alt="RastaYaar — Karachi public transport route finder"
            className="h-11 w-auto"
          />
          <span className="sr-only">RastaYaar — Karachi Transport</span>
        </Link>
        <nav className="flex items-center gap-1 overflow-x-auto text-sm font-medium">
          {NAV.map((item) => (
            <Link
              key={item.to}
              to={item.to}
              activeOptions={{ exact: item.to === "/" }}
              className="rounded-full px-3 py-1.5 text-muted-foreground transition-colors hover:bg-secondary hover:text-secondary-foreground"
              activeProps={{ className: "bg-primary text-primary-foreground hover:bg-primary" }}
            >
              {item.label}
            </Link>
          ))}
        </nav>
      </div>
    </header>
  );
}

export function SiteFooter() {
  return (
    <footer className="mt-20 border-t border-border bg-secondary/40">
      <div className="container-page grid gap-8 py-12 sm:grid-cols-2 lg:grid-cols-4">
        <div>
          <p className="font-display text-lg font-bold text-ink">RastaYaar</p>
          <p className="mt-2 text-sm text-muted-foreground">
            Find Your Bus. Find Your Way. A community route guide for Karachi public transport.
          </p>
        </div>
        <div className="text-sm">
          <p className="font-display font-semibold text-ink">Explore</p>
          <ul className="mt-2 space-y-1.5 text-muted-foreground">
            {NAV.slice(1).map((n) => (
              <li key={n.to}>
                <Link to={n.to} className="transition-colors hover:text-primary">
                  {n.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>
        <div className="text-sm">
          <p className="font-display font-semibold text-ink">Fares at a glance</p>
          <ul className="mt-2 space-y-1.5 text-muted-foreground">
            <li>Mini bus / coach: Estimated Rs. 30 – 150</li>
            <li>EV Bus / Double Decker: Estimated Rs. 80</li>
            <li>Red Bus: Estimated Rs. 80 – 120</li>
          </ul>
        </div>
        <div className="text-sm">
          <p className="font-display font-semibold text-ink">Contact</p>
          <ul className="mt-2 space-y-2 text-muted-foreground">
            <li>
              <a
                href="mailto:rastayaar@gmail.com"
                className="inline-flex items-center gap-2 transition-colors hover:text-primary"
              >
                <Mail className="size-4" />
                rastayaar@gmail.com
              </a>
            </li>
          </ul>
        </div>
      </div>
      <div className="border-t border-border py-4 text-center text-xs text-muted-foreground">
        Karachi Public Transport Route Guide · For public information only
      </div>
    </footer>
  );
}

export function CategoryBadge({ category }: { category: RouteCategory }) {
  const meta = CATEGORY_META[category];
  return (
    <span
      className="inline-flex items-center rounded-full px-2.5 py-0.5 text-[11px] font-semibold uppercase tracking-wide"
      style={{
        color: `var(--${meta.token})`,
        backgroundColor: `color-mix(in oklch, var(--${meta.token}) 14%, transparent)`,
      }}
    >
      {meta.short}
    </span>
  );
}

export function RouteCard({ route }: { route: BusRoute }) {
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
        {route.stops[0]} → {route.stops[route.stops.length - 1]}
      </p>
      <div className="mt-auto flex items-center justify-between pt-1 text-xs text-muted-foreground">
        <span>{route.stops.length} stops</span>
        <span className="font-semibold text-accent-foreground">{meta.fare}</span>
      </div>
    </Link>
  );
}
