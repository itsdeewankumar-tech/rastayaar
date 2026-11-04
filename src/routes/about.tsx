import { AnimatedStat } from "@/components/animated-stat";
import { useLanguage } from "@/components/language";
import { FounderCredit } from "@/components/site-chrome";
import { T } from "@/components/language";
import { createFileRoute, Link } from "@tanstack/react-router";
import { Bus, MapPin, Route as RouteIcon, Wallet, Search, Users } from "lucide-react";
import heroImg from "@/assets/karachi-decorated-bus.jpg";
import localBusImg from "@/assets/local-bus-karachi.webp";
import doubleDeckerImg from "@/assets/double-decker-photo.jpg";
import redBusImg from "@/assets/red-bus-photo.jpg";
import evBusImg from "@/assets/ev-white-bus.jpg";
import otherBusImg from "@/assets/karachi-truck-art-bus.jpg";
import brtImg from "@/assets/brt-bus.jpg";
import { ROUTES, AREAS, CATEGORY_ORDER } from "@/data/routes";

export const Route = createFileRoute("/about")({
  head: () => ({
    meta: [
      { title: "About RastaYaar — Karachi Bus Route Guide" },
      {
        name: "description",
        content:
          "RastaYaar is a free Karachi public transport route guide covering mini buses, coaches, named fleets, Red Bus, EV Bus and BRT lines — with stops, areas and fares.",
      },
      { property: "og:title", content: "About RastaYaar — Karachi Bus Route Guide" },
      {
        property: "og:description",
        content: "Why RastaYaar exists, what it covers, and where its route data comes from.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: About,
});

const VALUES = [
  {
    icon: Search,
    title: "Search by your area",
    body: "Type Sultanabad, Nagan Chorangi or Korangi Crossing and see every bus that stops there — mini bus, Red Bus, EV or BRT together in one list.",
  },
  {
    icon: RouteIcon,
    title: "Complete stop lists",
    body: "Each route page shows the full stop sequence end to end, so you know exactly where to board and where to get off.",
  },
  {
    icon: Wallet,
    title: "Honest fare ranges",
    body: "Local mini bus and coach Estimated Rs. 30 – 150, EV Bus and Double Decker Estimated Rs. 80, Red Bus Estimated Rs. 80 – 120 — so nobody overcharges you.",
  },
  {
    icon: Users,
    title: "Built for everyday riders",
    body: "Students, workers and visitors who just need one clear answer: which bus goes there, and what will it cost?",
  },
];

const GALLERY = [
  { img: localBusImg, label: "Truck-art mini bus" },
  { img: redBusImg, label: "Red Bus (Peoples Bus Service)" },
  { img: doubleDeckerImg, label: "Double Decker Bus" },
  { img: otherBusImg, label: "Classic Bedford city bus" },
  { img: evBusImg, label: "Electric EV Bus" },
  { img: brtImg, label: "BRT Green & Orange Line" },
];

function About() {
  const { t } = useLanguage();
  return (
    <div className="readable-page">
      <section className="relative overflow-hidden">
        <img
          src={heroImg}
          alt="Decorated Karachi mini bus on a busy city road"
          width={1920}
          height={1088}
          className="absolute inset-0 size-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-ink/92 via-ink/78 to-ink/40" />
        <div className="container-page relative py-20 md:py-24">
          <span className="inline-flex items-center gap-2 rounded-full border border-accent/50 bg-accent/15 px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-accent">
            {""}
            <T>{"About the RastaYaar"}</T>{" "}
          </span>
          <h1 className="mt-5 max-w-5xl font-display text-4xl font-bold leading-tight text-primary-foreground sm:text-5xl lg:text-6xl">
            {""}
            <T>{"Karachi moves on buses. Now the map moves with you."}</T>{" "}
          </h1>
          <p className="about-introduction mt-5 max-w-3xl text-lg leading-relaxed text-primary-foreground/90">
            {""}
            <T>
              {
                "RastaYaar collects the city's scattered route knowledge — the kind you usually get by asking a conductor — into one searchable guide covering every service in the city."
              }
            </T>{" "}
          </p>
        </div>
      </section>

      <section className="container-page -mt-8 relative grid grid-cols-2 gap-3 sm:grid-cols-4">
        {[
          { n: ROUTES.length, l: "Routes mapped" },
          { n: AREAS.length, l: "Stops & areas" },
          { n: CATEGORY_ORDER.length, l: "Fleet types" },
          { n: "Est. 30–150", l: "Local fare (Rs.)" },
        ].map((s) => (
          <div key={s.l} className="surface-card px-4 py-5 text-center">
            <p className="about-stat-number font-display font-bold text-primary">
              <AnimatedStat value={s.n} />
            </p>
            <p className="mt-1 text-xs text-muted-foreground">{t(s.l)}</p>
          </div>
        ))}
      </section>

      <section className="container-page mt-20 grid gap-10 md:grid-cols-[1.15fr_1fr] md:items-center">
        <div className="space-y-4 text-muted-foreground">
          <h2 className="font-display text-3xl font-bold text-ink">
            {""}
            <T>{"Why RastaYaar exists"}</T>
            {""}
          </h2>
          <p>
            {""}
            <T>
              {
                "There has never been a single, simple place to check which bus goes where in Karachi. Route boards are hand-painted, numbers change, and the only reliable source has always been word of mouth. RastaYaar turns that shared knowledge into something you can search in seconds."
              }
            </T>{" "}
          </p>
          <p>
            {""}
            <T>
              {
                "Coverage includes mini buses, coach buses, named fleet routes (Mashriq, Muslim, Marwat, Bilal and more), Red Bus (Peoples Bus Service), Double Decker Bus, EV buses, and the BRT Green and Orange Lines —"
              }
            </T>{" "}
            <strong className="text-ink">
              {ROUTES.length} {""}
              <T>{"routes"}</T>
              {""}
            </strong>{" "}
            {""}
            <T>{"across"}</T>{" "}
            <strong className="text-ink">
              {AREAS.length} {""}
              <T>{"stops and areas"}</T>
              {""}
            </strong>
            .
          </p>
          <p>
            {""}
            <T>
              {
                "The trip planner goes one step further: pick where you are and where you're going, and it works out the direct bus — or the single transfer that gets you there — with the fare you should expect for the whole journey."
              }
            </T>{" "}
          </p>
          <div className="flex flex-wrap gap-3 pt-2">
            <Link
              to="/routes"
              search={{}}
              className="rounded-full bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground transition-transform hover:-translate-y-0.5"
            >
              {""}
              <T>{"Browse all routes"}</T>{" "}
            </Link>
            <Link
              to="/plan"
              className="rounded-full border border-border px-5 py-2.5 text-sm font-semibold text-ink transition-colors hover:bg-secondary"
            >
              {""}
              <T>{"Plan a trip"}</T>{" "}
            </Link>
          </div>
        </div>
        <img
          src={localBusImg}
          alt="Colourful hand-painted Karachi mini bus with passengers boarding"
          loading="lazy"
          width={1920}
          height={1440}
          className="surface-card h-80 w-full object-cover"
        />
      </section>

      <section className="container-page mt-20">
        <h2 className="font-display text-3xl font-bold text-ink">
          {""}
          <T>{"What you get"}</T>
          {""}
        </h2>
        <div className="mt-8 grid gap-5 sm:grid-cols-2">
          {VALUES.map((v) => (
            <article key={t(v.title)} className="surface-card hover-lift flex gap-4 p-5">
              <span className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-secondary text-primary">
                <v.icon className="size-5" />
              </span>
              <div>
                <h3 className="font-display text-lg font-semibold text-ink">{t(v.title)}</h3>
                <p className="mt-1.5 text-sm text-muted-foreground">{t(v.body)}</p>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="container-page mt-20">
        <h2 className="font-display text-3xl font-bold text-ink">
          {""}
          <T>{"Every service in the city"}</T>
          {""}
        </h2>
        <p className="mt-2 max-w-2xl text-muted-foreground">
          {""}
          <T>
            {
              "From hand-painted truck-art mini buses to double decker and air-conditioned rapid transit."
            }
          </T>{" "}
        </p>
        <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {GALLERY.map((g) => (
            <figure key={t(g.label)} className="surface-card hover-lift overflow-hidden">
              <img
                src={g.img}
                alt={t(g.label)}
                loading="lazy"
                width={1024}
                height={768}
                className="h-40 w-full object-cover"
              />
              <figcaption className="flex items-center gap-2 p-3 text-sm text-muted-foreground">
                <Bus className="size-4 text-primary" />
                {t(g.label)}
              </figcaption>
            </figure>
          ))}
        </div>
      </section>

      <section className="container-page mt-20">
        <div className="surface-card flex flex-col gap-3 p-6 sm:flex-row sm:items-center sm:justify-between">
          <p className="flex items-start gap-3 text-xs text-muted-foreground sm:max-w-2xl">
            <MapPin className="mt-0.5 size-4 shrink-0 text-primary" />
            {""}
            <T>
              {
                "Route data is compiled from the Karachi Public Transport Route Guide and community input, for public information only. Timings, routes and fares can change without notice — please verify with the conductor before travelling."
              }
            </T>{" "}
          </p>
          <Link
            to="/contact"
            className="shrink-0 rounded-full bg-accent px-5 py-2.5 text-center text-sm font-semibold text-accent-foreground transition-transform hover:-translate-y-0.5"
          >
            {""}
            <T>{"Report a correction"}</T>{" "}
          </Link>
        </div>
      </section>
      <FounderCredit />
    </div>
  );
}
