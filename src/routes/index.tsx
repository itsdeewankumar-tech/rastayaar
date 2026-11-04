import { AnimatedStat } from "@/components/animated-stat";
import { RevealGrid } from "@/components/reveal-grid";
import { JourneyHelpCard } from "@/components/journey-help-card";
import { TransportGuide } from "@/components/transport-guide";
import { FounderCredit } from "@/components/site-chrome";
import pinkBusImg from "@/assets/pink-bus.jpg";
import { useLanguage } from "@/components/language";
import { T } from "@/components/language";
import { createFileRoute, Link } from "@tanstack/react-router";
import heroImg from "@/assets/karachi-decorated-bus.jpg";
import redBusImg from "@/assets/red-bus-photo.jpg";
import evBusImg from "@/assets/ev-white-bus.jpg";
import otherBusImg from "@/assets/karachi-truck-art-bus.jpg";
import brtImg from "@/assets/brt-bus.jpg";
import localBusImg from "@/assets/local-bus-karachi.webp";
import doubleDeckerImg from "@/assets/double-decker-photo.jpg";
import { SearchPanel } from "@/components/search-panel";
import { ROUTES, AREAS, CATEGORY_META, CATEGORY_ORDER } from "@/data/routes";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "RastaYaar — Karachi Bus Routes & Public Transport" },
      { name: "robots", content: "index, follow, max-image-preview:large" },
      {
        name: "keywords",
        content:
          "Karachi bus routes, Karachi public transport, Karachi bus route finder, Karachi bus fares, Red Bus Karachi, EV Bus Karachi, Green Line Karachi, bus stops Karachi",
      },
      {
        name: "description",
        content:
          "Search any Karachi area and instantly see which mini bus, coach, Red Bus, EV Bus or BRT line passes through, with fare ranges.",
      },
      { property: "og:type", content: "website" },
      { property: "og:url", content: "https://www.rastayaar.com/" },
      { property: "og:image", content: "https://www.rastayaar.com/rastayaar-social.png" },
      {
        property: "og:image:alt",
        content: "RastaYaar — Karachi public transport and bus route finder",
      },
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
    fare: "Estimated Rs. 30 – 150",
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
    img: pinkBusImg,
    title: "Pink Bus — Women-only Service",
    body: "Women-only R-1, R-2, R-3, R-9 and R-10 services. Browse their stops and plan a journey.",
    fare: "Estimated Rs. 80 – 120",
    category: "pink_bus",
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
    fare: CATEGORY_META.brt.fare,
    category: "brt",
  },
] as const;

function Index() {
  const { t, place, language } = useLanguage();
  const stopCount = AREAS.length;
  const serviceCards = [
    {
      key: "local_bus",
      label: "Local Bus (Mini Bus & Coach)",
      fare: CATEGORY_META.mini_bus.fare,
      token: CATEGORY_META.mini_bus.token,
      count: ROUTES.filter((r) => ["mini_bus", "coach", "named_route"].includes(r.category)).length,
    },
    ...CATEGORY_ORDER.filter(
      (cat) => !["mini_bus", "coach", "named_route", "brt"].includes(cat),
    ).map((cat) => ({
      key: cat,
      label: CATEGORY_META[cat].label,
      fare: CATEGORY_META[cat].fare,
      token: CATEGORY_META[cat].token,
      count: ROUTES.filter((r) => r.category === cat).length,
    })),
    {
      key: "brt",
      label: "Green Line & Orange Line BRT",
      fare: CATEGORY_META.brt.fare,
      token: CATEGORY_META.brt.token,
      count: ROUTES.filter((r) => r.category === "brt").length,
    },
  ];

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
        <div className="container-page hero-layout relative grid gap-8 py-16 lg:grid-cols-[1.05fr_1fr] lg:items-center lg:gap-10 lg:py-24">
          <div className="animate-rise">
            <span className="inline-flex items-center gap-2 rounded-full border border-accent/50 bg-accent/15 px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-accent">
              {""}
              <T>{"Karachi Public Transport"}</T>{" "}
            </span>
            <h1 className="mt-5 font-display text-[clamp(2.5rem,4.2vw,4.25rem)] font-bold leading-[1.08] text-primary-foreground">
              <span className="block">
                {language === "ur" ? "راستہ یار — کراچی" : "RastaYaar — Karachi"}
              </span>
              <span className="block">{language === "ur" ? "بس روٹس" : "Bus Routes"}</span>
            </h1>
            <p className="mt-4 font-display text-2xl leading-snug text-accent xl:text-[1.75rem]">
              {""}
              <T>{"Bus Routes Karachi – Find Your Bus. Find Your Way."}</T>
              {""}
            </p>
            <p className="mt-5 text-base leading-relaxed text-primary-foreground/90">
              {""}
              <T>
                {
                  "Find bus routes in Karachi by area or destination. Explore Karachi minibuses, coaches, Red Bus, EV Bus, Green Line BRT, and other public transport routes, with estimated fares to help you plan your journey."
                }
              </T>{" "}
            </p>
            <div className="mt-7 flex flex-col gap-4">
              <Link
                to="/plan"
                className="plan-trip-cta group inline-flex w-full md:w-[84%] items-center justify-center gap-3 rounded-2xl bg-accent px-6 py-3.5 text-lg font-bold text-accent-foreground shadow-lg sm:text-xl"
              >
                {""}
                <span aria-hidden="true" className="text-2xl">
                  🚌
                </span>
                <T>{"Plan a trip"}</T>
                <span aria-hidden="true" className="transition-transform group-hover:translate-x-1">
                  →
                </span>{" "}
              </Link>
              <Link
                to="/routes"
                search={{}}
                className="browse-routes-cta inline-flex min-h-10 self-start items-center justify-center rounded-full border border-teal-100/80 bg-teal-50 px-5 py-2.5 text-sm font-semibold text-teal-900 shadow-sm transition-colors hover:bg-teal-100 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white"
              >
                {""}
                <T>{"Browse all routes"}</T>{" "}
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
          { n: CATEGORY_ORDER.length, l: "Fleet types" },
          { n: "Est. 30–150", l: "Local fare (Rs.)" },
        ].map((s) => (
          <div key={s.l} className="surface-card px-4 py-5 text-center">
            <p className="font-display text-3xl font-bold text-primary sm:text-4xl">
              <AnimatedStat value={s.n} />
            </p>
            <p className="mt-2 text-base font-medium text-muted-foreground sm:text-lg">{t(s.l)}</p>
          </div>
        ))}
      </section>

      <section className="container-page home-card-section mt-20">
        <RevealGrid className="contents">
          <h2 className="font-display text-3xl font-bold text-ink">
            {""}
            <T>{"Karachi Bus Routes & Public Transport"}</T>
            {""}
          </h2>
          <p className="mt-2 max-w-2xl text-muted-foreground">
            {""}
            <T>
              {
                "Explore Karachi bus routes, from traditional minibuses and coaches to double-decker buses, Red Bus, EV Bus and BRT services. Find routes by area or destination and check estimated fares with RastaYaar."
              }
            </T>{" "}
          </p>
        </RevealGrid>
        <RevealGrid className="fleet-grid mt-8">
          {FLEET.map((f) => (
            <Link
              key={f.category}
              to="/routes/$slug"
              params={{ slug: f.category }}
              className="surface-card hover-lift group flex h-full flex-col overflow-hidden transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
              aria-label={`View ${t(f.title)} routes`}
            >
              <img
                src={f.img}
                alt={t(f.title)}
                title={t(f.title)}
                loading="lazy"
                width={1024}
                height={768}
                className="h-48 w-full object-cover transition-transform duration-300 group-hover:scale-[1.02]"
              />
              <div className="flex flex-1 flex-col p-5">
                <h3 className="font-display text-lg font-semibold text-ink">{t(f.title)}</h3>
                <p className="mt-3 flex-1 text-base leading-7 text-muted-foreground">{t(f.body)}</p>
                <p className="mt-4 text-base font-semibold text-primary">
                  {""}
                  <T>{"Fare"}</T> {t(f.fare)}
                </p>
                <p className="mt-4 text-base font-semibold text-primary">
                  {""}
                  <T>{"View routes →"}</T>
                  {""}
                </p>
              </div>
            </Link>
          ))}
          <JourneyHelpCard kind="plan" />
          <JourneyHelpCard kind="save" />
        </RevealGrid>
      </section>

      <section className="container-page home-card-section mt-20">
        <RevealGrid className="contents">
          <h2 className="font-display text-3xl font-bold text-ink">
            {""}
            <T>{"Browse Karachi Bus Routes by Service"}</T>
            {""}
          </h2>
        </RevealGrid>

        <RevealGrid className="service-grid mt-6">
          {serviceCards.map((item) => (
            <Link
              key={item.key}
              to="/routes/$slug"
              params={{ slug: item.key }}
              className="surface-card hover-lift flex h-full items-center justify-between gap-3 p-5"
            >
              <div>
                <span
                  className="inline-block size-2.5 rounded-full"
                  style={{ backgroundColor: `var(--${item.token})` }}
                />
                <p className="mt-2 font-display font-semibold text-ink">{t(item.label)}</p>
                <p className="text-xs text-muted-foreground">{t(item.fare)}</p>
              </div>
              <span className="font-display text-2xl font-bold text-muted-foreground">
                {item.count}
              </span>
            </Link>
          ))}
          <JourneyHelpCard kind="plan" compact />
          <JourneyHelpCard kind="save" compact />
        </RevealGrid>
      </section>
      <RevealGrid className="contents">
        <TransportGuide />
        <FounderCredit />
      </RevealGrid>
    </div>
  );
}
