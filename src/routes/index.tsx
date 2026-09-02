import { createFileRoute, Link } from "@tanstack/react-router";
import heroImg from "@/assets/karachi-decorated-bus.jpg";
import redBusImg from "@/assets/red-bus.jpg";
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
      { title: "RastaYaar — Find Your Bus in Karachi" },
      {
        name: "description",
        content:
          "Search any Karachi area and instantly see which mini bus, coach, Red Bus, EV Bus or BRT line passes through, with fare ranges.",
      },
      { property: "og:title", content: "RastaYaar — Find Your Bus in Karachi" },
      {
        property: "og:description",
        content:
          "Karachi public transport route finder: 70+ routes, thousands of stops, fares for mini bus, Red Bus, EV Bus and BRT.",
      },
    ],
  }),
  component: Index,
});

const FLEET = [
  {
    img: redBusImg,
    title: "Red Bus (Peoples Bus Service)",
    body: "Air-conditioned government fleet running R-1 to R-14 across the city's main corridors.",
    fare: "Estimated Rs. 80 – 120",
  },
  {
    img: localBusImg,
    title: "Local Bus (Mini Bus & Coach)",
    body: "The city's truck-art mini buses and coaches — the widest network, reaching almost every neighbourhood.",
    fare: "Estimated Rs. 20 – 200",
  },
  {
    img: doubleDeckerImg,
    title: "Double Decker Bus",
    body: "Open-top double decker DD01 from Model Colony to Tower — a scenic ride through Karachi's landmarks.",
    fare: "Estimated Rs. 80",
  },
  {
    img: otherBusImg,
    title: "Other City Buses",
    body: "Classic Bedford truck-art buses and other city routes like 4-L, 9-C, 11-C, 20, 51 and 55.",
    fare: "Estimated Rs. 30 – 150",
  },
  {
    img: evBusImg,
    title: "EV Bus",
    body: "Electric buses on EV-1 to EV-5 linking Malir Cantt, Bahria Town, DHA City and Numaish.",
    fare: "Estimated Rs. 80",
  },
  {
    img: brtImg,
    title: "BRT Green & Orange Line",
    body: "Dedicated corridor rapid transit from Surjani and Orangi towards Guru Mandir and Nagan.",
    fare: "Estimated Rs. 80 – 120",
  },
];

function Index() {
  const stopCount = AREAS.length;

  return (
    <div>
      <section className="relative overflow-hidden">
        <img
          src={heroImg}
          alt="Decorated Karachi mini bus on a city road at golden hour"
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
              RastaYaar
            </h1>
            <p className="mt-3 font-display text-2xl text-accent">Find Your Bus. Find Your Way.</p>
            <p className="mt-5 max-w-xl text-base leading-relaxed text-primary-foreground/80">
              Type your area and instantly see every mini bus, coach, named fleet, Red Bus, EV Bus
              and BRT line that passes through it — along with the fare you should expect to pay.
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
        <h2 className="font-display text-3xl font-bold text-ink">Karachi's fleet</h2>
        <p className="mt-2 max-w-2xl text-muted-foreground">
          From truck-art mini buses to double decker, electric and rapid transit — every service in
          the city guide.
        </p>
        <div className="mt-8 grid gap-6 md:grid-cols-3">
          {FLEET.map((f) => (
            <article key={f.title} className="surface-card hover-lift overflow-hidden">
              <img
                src={f.img}
                alt={f.title}
                loading="lazy"
                width={1024}
                height={768}
                className="h-48 w-full object-cover"
              />
              <div className="p-5">
                <h3 className="font-display text-lg font-semibold text-ink">{f.title}</h3>
                <p className="mt-2 text-sm text-muted-foreground">{f.body}</p>
                <p className="mt-3 text-sm font-semibold text-primary">Fare {f.fare}</p>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="container-page mt-20">
        <h2 className="font-display text-3xl font-bold text-ink">Browse by service</h2>
        <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {CATEGORY_ORDER.map((cat) => {
            const meta = CATEGORY_META[cat];
            const count = ROUTES.filter((r) => r.category === cat).length;
            return (
              <Link
                key={cat}
                to="/routes"
                search={{ type: cat }}
                className="surface-card hover-lift flex items-center justify-between gap-3 p-5"
              >
                <div>
                  <span
                    className="inline-block size-2.5 rounded-full"
                    style={{ backgroundColor: `var(--${meta.token})` }}
                  />
                  <p className="mt-2 font-display font-semibold text-ink">{meta.label}</p>
                  <p className="text-xs text-muted-foreground">{meta.fare}</p>
                </div>
                <span className="font-display text-2xl font-bold text-muted-foreground">
                  {count}
                </span>
              </Link>
            );
          })}
        </div>
      </section>
    </div>
  );
}
