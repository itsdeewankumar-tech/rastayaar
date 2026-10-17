import { createFileRoute, Link } from "@tanstack/react-router";
import heroImg from "@/assets/karachi-decorated-bus.jpg";
import redBusImg from "@/assets/red-bus-new.jpg";
import evBusImg from "@/assets/ev-white-bus.jpg";
import otherBusImg from "@/assets/karachi-truck-art-bus.jpg";
import brtImg from "@/assets/brt-bus.jpg";
import localBusImg from "@/assets/local-bus-karachi.webp";
import doubleDeckerImg from "@/assets/double-decker-bus.png";
import { SearchPanel } from "@/components/search-panel";
import { ROUTES, AREAS, CATEGORY_META, CATEGORY_ORDER } from "@/data/routes";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "RastaYaar — Karachi Bus Routes & Public Transport" },
      { name: "robots", content: "index, follow, max-image-preview:large" },
      { name: "keywords", content: "Karachi bus routes, Karachi public transport, Karachi bus route finder, Karachi bus fares, Red Bus Karachi, EV Bus Karachi, Green Line Karachi, bus stops Karachi" },
      {
        name: "description",
        content:
          "Search any Karachi area and instantly see which mini bus, coach, Red Bus, EV Bus or BRT line passes through, with fare ranges.",
      },
      { property: "og:type", content: "website" },
      { property: "og:url", content: "https://www.rastayaar.com/" },
      { property: "og:image", content: "https://www.rastayaar.com/rastayaar-social.png" },
      { property: "og:image:alt", content: "RastaYaar — Karachi public transport and bus route finder" },
      { property: "og:title", content: "RastaYaar — Karachi Bus Routes & Public Transport" },
      {
        property: "og:description",
        content:
          "Karachi public transport route finder with bus routes, stops and estimated fares for minibuses, coaches, Red Bus, EV Bus and BRT.",
      },
    ],
    links: [{ rel: "canonical", href: "https://www.rastayaar.com/" }],
  }),
  component: Index,
});

const FLEET = [
  {
    img: redBusImg,
    title: "Karachi Red Bus — People's Bus Service",
    body: "Explore Karachi's Air-conditioned government buses, Red Bus routes R-1 to R-14, connecting major city corridors.",
    fare: "Estimated Rs. 80 – 120",
    category: "red_bus",
  },
  {
    img: localBusImg,
    title: "Local Bus (Mini Bus & Coach)",
    body: "The city's truck-art mini buses and coaches — the widest network, reaching almost every neighbourhood.",
    fare: "Estimated Rs. 20 – 200",
    category: "local_bus",
  },
  {
    img: doubleDeckerImg,
    title: "Double Decker Bus",
    body: "Experience Karachi's DD01 double-decker bus service connecting Model Colony and Tower.",
    fare: "Estimated Rs. 80",
    category: "double_decker",
  },
  {
    img: otherBusImg,
    title: "Other City Buses",
    body: "Classic Bedford truck-art buses and other city routes like 4-L, 9-C, 11-C, 20, 51 and 55.",
    fare: "Estimated Rs. 30 – 150",
    category: "other",
  },
  {
    img: evBusImg,
    title: "EV Bus (Electric Bus Service)",
    body: "Karachi's electric buses on EV-1 to EV-5 linking Malir Cantt, Bahria Town, DHA City and Numaish.",
    fare: "Estimated Rs. 80",
    category: "ev_bus",
  },
  {
    img: brtImg,
    title: "Green Line & Orange Line BRT",
    body: "Travel on Karachi's rapid transit network, from Surjani and Orangi towards Guru Mandir and Nagan.",
    fare: "Estimated Rs. 80 – 120",
    category: "brt",
  },
] as const;

function Index() {
  const stopCount = AREAS.length;

  return (
    <div>
      <section className="relative overflow-hidden">
        <img
          src={heroImg}
          alt="Decorated Karachi mini bus on a city road at golden hour"
          title="Karachi public transport bus"
          loading="eager"
          width={1920}
          height={1088}
          className="absolute inset-0 size-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-ink/92 via-ink/80 to-ink/40" />
        <div className="container-page relative grid gap-10 py-20 md:grid-cols-[1.05fr_1fr] md:items-center md:py-28">
          <div className="animate-rise">
            <span className="inline-flex items-center gap-2 rounded-full border border-accent/50 bg-accent/15 px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-accent">
              Karachi Public Transport
            </span>
            <h1 className="mt-5 font-display text-5xl font-bold leading-[1.05] text-primary-foreground sm:text-6xl">
              RastaYaar — Karachi Bus Routes
            </h1>
            <p className="mt-3 font-display text-2xl text-accent">Bus Routes Karachi – Find Your Bus. Find Your Way.</p>
            <p className="mt-5 max-w-xl text-base leading-relaxed text-primary-foreground/80">
         Find bus routes in Karachi by area or destination. Explore Karachi minibuses, coaches,
         Red Bus, EV Bus, Green Line BRT, and other public transport routes, with estimated fares to help you plan your journey.
            </p>
            <div className="mt-7 flex flex-wrap gap-3">
              <Link
                to="/plan"
                className="rounded-full bg-accent px-5 py-2.5 text-sm font-semibold text-accent-foreground transition-transform hover:-translate-y-0.5"
              >
                Plan a trip
              </Link>
              <Link
                to="/routes"
                search={{}}
                className="rounded-full border border-primary-foreground/40 px-5 py-2.5 text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary-foreground/10"
              >
                Browse all routes
              </Link>
            </div>
          </div>
          <div className="animate-rise">
            <SearchPanel />
          </div>
        </div>
      </section>

      <section className="container-page -mt-8 relative grid grid-cols-2 gap-3 sm:grid-cols-4">
        {[
          { n: ROUTES.length, l: "Routes mapped" },
          { n: stopCount, l: "Stops & areas" },
          { n: 8, l: "Fleet types" },
          { n: "Est. 30–150", l: "Local fare (Rs.)" },
        ].map((s) => (
          <div key={s.l} className="surface-card px-4 py-5 text-center">
            <p className="font-display text-2xl font-bold text-primary">{s.n}</p>
            <p className="mt-1 text-xs text-muted-foreground">{s.l}</p>
          </div>
        ))}
      </section>

      <section className="container-page mt-20">
        <h2 className="font-display text-3xl font-bold text-ink">Karachi Bus Routes & Public Transport</h2>
        <p className="mt-2 max-w-2xl text-muted-foreground">
          Explore Karachi bus routes, from traditional minibuses and coaches to double-decker buses, Red Bus,
          EV Bus and BRT services. Find routes by area or destination and check estimated fares with RastaYaar.
        </p>
        <div className="mt-8 grid gap-6 md:grid-cols-3">
          {FLEET.map((f) => (
            <Link
              key={f.title}
             to="/routes/$slug"
             params={{ slug: f.category }}
              className="surface-card hover-lift group block overflow-hidden transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
              aria-label={`View ${f.title} routes`}
            >
              <img
                src={f.img}
                alt={f.title}
                title={f.title}
                loading="lazy"
                width={1024}
                height={768}
                className="h-48 w-full object-cover transition-transform duration-300 group-hover:scale-[1.02]"
              />
              <div className="p-5">
                <h3 className="font-display text-lg font-semibold text-ink">{f.title}</h3>
                <p className="mt-2 text-sm text-muted-foreground">{f.body}</p>
                <p className="mt-3 text-sm font-semibold text-primary">Fare {f.fare}</p>
                <p className="mt-3 text-sm font-semibold text-primary">View routes →</p>
              </div>
            </Link>
          ))}
        </div>
      </section>

      <section className="container-page mt-20">
        <h2 className="font-display text-3xl font-bold text-ink">Browse Karachi Bus Routes by Service</h2>

<div className="mt-6 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">

          {[
            {
              key: "local_bus",
              label: "Local Bus (Mini Bus & Coach)",
              fare: "Estimated Rs. 20 – 200",
              token: CATEGORY_META.mini_bus.token,
              count: ROUTES.filter((r) =>
                ["mini_bus", "coach", "named_route"].includes(r.category)
              ).length,
            },
            ...CATEGORY_ORDER
              .filter((cat) => !["mini_bus", "coach", "named_route"].includes(cat))
              .map((cat) => ({
                key: cat,
                label: CATEGORY_META[cat].label,
                fare: CATEGORY_META[cat].fare,
                token: CATEGORY_META[cat].token,
                count: ROUTES.filter((r) => r.category === cat).length,
              })),
          ].map((item) => (
            <Link
              key={item.key}
             to="/routes/$slug"
            params={{ slug: item.key }}
              className="surface-card hover-lift flex items-center justify-between gap-3 p-5"
            >
              <div>
                <span
                  className="inline-block size-2.5 rounded-full"
                  style={{ backgroundColor: `var(--${item.token})` }}
                />
                <p className="mt-2 font-display font-semibold text-ink">{item.label}</p>
                <p className="text-xs text-muted-foreground">{item.fare}</p>
              </div>
              <span className="font-display text-2xl font-bold text-muted-foreground">{item.count}</span>
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}
