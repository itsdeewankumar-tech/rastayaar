import { SaveButton, savedRoute } from "@/components/saved-routes";
import { T } from "@/components/language";
import { useLanguage } from "@/components/language";

import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import {
  getRoute,
  CATEGORY_META,
  CATEGORY_ORDER,
  slugify,
  ROUTES,
  scoreMatch,
  type RouteCategory,
} from "@/data/routes";
import { CategoryBadge, RouteCard } from "@/components/site-chrome";

type CategorySlug = RouteCategory | "local_bus";

const LOCAL_BUS_CATEGORIES: RouteCategory[] = ["mini_bus", "coach", "named_route"];

function isCategorySlug(slug: string): slug is CategorySlug {
  return slug === "local_bus" || (CATEGORY_ORDER as string[]).includes(slug);
}

export const Route = createFileRoute("/routes/$slug")({
  loader: ({ params }) => {
    if (isCategorySlug(params.slug)) {
      return { kind: "category" as const, category: params.slug };
    }

    const route = getRoute(params.slug);
    if (!route) throw notFound();

    return { kind: "route" as const, route };
  },

  head: ({ loaderData }) => {
    if (!loaderData) {
      return {
        meta: [{ title: "Page not found — RastaYaar" }, { name: "robots", content: "noindex" }],
      };
    }

    if (loaderData.kind === "category") {
      const category = loaderData.category;
      const label = category === "local_bus" ? "Local Bus" : CATEGORY_META[category].label;
      const title = `${label} Routes in Karachi — RastaYaar`;
      const description = `Explore ${label} routes in Karachi, including bus stops and route details.`;

      return {
        meta: [
          { title },
          { name: "description", content: description },
          { property: "og:title", content: title },
          { property: "og:description", content: description },
        ],
      };
    }

    const { route } = loaderData;
    const meta = CATEGORY_META[route.category];
    const title = `${route.code} Bus Route — Stops & Fare | RastaYaar`;
    const desc = `${route.code} (${meta.label}) runs from ${
      route.stops[0]
    } to ${route.stops[route.stops.length - 1]} via ${
      route.stops.length
    } stops. Fare ${meta.fare}.`;

    return {
      meta: [
        { title },
        { name: "description", content: desc },
        { property: "og:title", content: title },
        { property: "og:description", content: desc },
      ],
    };
  },

  component: RoutePage,
});

function RoutePage() {
  const data = Route.useLoaderData();

  if (data.kind === "category") {
    return <CategoryPage category={data.category} />;
  }

  return <RouteDetail route={data.route} />;
}

function CategoryPage({ category }: { category: CategorySlug }) {
  const { t } = useLanguage();
  const [q, setQ] = useState("");

  const list = useMemo(() => {
    let items =
      category === "local_bus"
        ? ROUTES.filter((r) => LOCAL_BUS_CATEGORIES.includes(r.category))
        : ROUTES.filter((r) => r.category === category);

    if (q.trim()) {
      items = items
        .map((r) => ({
          route: r,
          score: Math.max(
            scoreMatch(r.code, q),
            ...r.stops.map((s) => (scoreMatch(s, q) > 40 ? 40 : 0)),
          ),
        }))
        .filter((x) => x.score > 0)
        .sort((a, b) => b.score - a.score)
        .map((x) => x.route);
    }

    return items;
  }, [category, q]);

  const label =
    category === "local_bus" ? "Local Bus (Mini Bus & Coach)" : CATEGORY_META[category].label;

  return (
    <div className="container-page py-12">
      <Link to="/routes" search={{}} className="text-sm text-muted-foreground hover:text-primary">
        {""}
        <T>{"← All routes"}</T>{" "}
      </Link>

      <h1 className="mt-4 font-display text-4xl font-bold text-ink">{t(label)}</h1>

      <p className="mt-2 max-w-2xl text-muted-foreground">
        {list.length} {""}
        <T>{"routes found in this category."}</T>{" "}
      </p>

      <div className="mt-6 flex flex-wrap gap-2">
        <Link
          to="/routes"
          search={{}}
          className="rounded-full border border-border px-3 py-1.5 text-sm hover:border-primary"
        >
          {""}
          <T>{"All routes"}</T>{" "}
        </Link>

        {CATEGORY_ORDER.map((key) => (
          <Link
            key={key}
            to="/routes/$slug"
            params={{ slug: key }}
            className={`rounded-full border px-3 py-1.5 text-sm transition-colors hover:border-primary ${
              category === key
                ? "border-primary bg-primary text-primary-foreground"
                : "border-border"
            }`}
          >
            {t(CATEGORY_META[key].label)}
          </Link>
        ))}

        <Link
          to="/routes/$slug"
          params={{ slug: "local_bus" }}
          className={`rounded-full border px-3 py-1.5 text-sm transition-colors hover:border-primary ${
            category === "local_bus"
              ? "border-primary bg-primary text-primary-foreground"
              : "border-border"
          }`}
        >
          {""}
          <T>{"Local Bus"}</T>{" "}
        </Link>
      </div>

      <input
        value={q}
        onChange={(event) => setQ(event.target.value)}
        placeholder={t("Search by bus number or stop...")}
        className="mt-6 w-full max-w-md rounded-xl border border-border bg-surface px-4 py-3 text-sm outline-none focus:border-primary"
      />

      {list.length > 0 ? (
        <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {list.map((route) => (
            <RouteCard key={route.slug} route={route} />
          ))}
        </div>
      ) : (
        <p className="mt-8 text-muted-foreground">
          {""}
          <T>{"No routes found. Try another search."}</T>{" "}
        </p>
      )}
    </div>
  );
}

function RouteDetail({ route }: { route: (typeof ROUTES)[number] }) {
  const { t, place, language } = useLanguage();
  const [reverse, setReverse] = useState(false);
  const stops = reverse ? [...route.stops].reverse() : route.stops;
  const meta = CATEGORY_META[route.category];

  const related = ROUTES.filter(
    (r) => r.slug !== route.slug && r.stops.some((s) => route.stops.includes(s)),
  ).slice(0, 6);

  return (
    <div className="container-page py-12">
      <Link to="/routes" search={{}} className="text-sm text-muted-foreground hover:text-primary">
        {""}
        <T>{"← All routes"}</T>{" "}
      </Link>

      <header className="surface-card mt-4 overflow-hidden">
        <div className="h-1.5 truck-stripe" />
        <div className="flex flex-wrap items-center gap-4 p-6">
          <span
            className="rounded-xl px-4 py-2 font-display text-2xl font-bold text-primary-foreground"
            style={{ backgroundColor: `var(--${meta.token})` }}
          >
            {route.code}
          </span>

          <div>
            <div className="flex items-center gap-2">
              <h1 className="font-display text-2xl font-bold text-ink">{t(meta.label)}</h1>
              <CategoryBadge category={route.category} />
            </div>

            <p className="text-sm text-muted-foreground">
              {place(stops[0])} → {place(stops[stops.length - 1])} · {route.stops.length} {""}
              <T>{"stops"}</T>{" "}
            </p>
          </div>

          <div className="ml-auto rounded-xl bg-secondary px-4 py-2 text-center">
            <p className="text-[11px] uppercase tracking-wide text-muted-foreground">
              {""}
              <T>{"Fare"}</T>{" "}
            </p>
            <p className="font-display text-lg font-bold text-primary">{t(meta.fare)}</p>
          </div>
        </div>
      </header>

      <div className="mt-5">
        <SaveButton item={savedRoute(route.slug)} />
      </div>
      <h2 className="mt-10 font-display text-xl font-bold text-ink">
        {""}
        <T>{"Route stops"}</T>{" "}
      </h2>

      {route.dataNote && (
        <p className="mt-3 rounded-xl border border-border p-3 text-sm">
          <strong>{t("Community route update")}: </strong>
          {t(route.dataNote)}
        </p>
      )}
      {route.planningEnabled !== false && (
        <button
          type="button"
          onClick={() => setReverse(!reverse)}
          className="mt-3 rounded-xl border border-border px-4 py-2 text-sm"
        >
          {t(reverse ? "Outbound direction" : "Return direction")}
        </button>
      )}
      {route.planningEnabled === false && (
        <p className="mt-2 text-sm">
          {t("Endpoint information only; full stop sequence pending.")}
        </p>
      )}
      <ol className="mt-4 grid gap-x-8 sm:grid-cols-2 lg:grid-cols-3">
        {stops.map((stop, i) => (
          <li key={`${stop}-${i}`} className="relative flex gap-3 pb-4 pl-1">
            <span className="relative flex flex-col items-center">
              <span
                className="mt-1.5 size-3 shrink-0 rounded-full border-2 border-surface"
                style={{ backgroundColor: `var(--${meta.token})` }}
              />
              {i < route.stops.length - 1 && <span className="w-px flex-1 bg-border" />}
            </span>

            <Link
              to="/areas/$slug"
              params={{ slug: slugify(stop) }}
              className="text-sm transition-colors hover:text-primary"
            >
              <span className="mr-1.5 text-xs text-muted-foreground">{i + 1}.</span>
              {place(stop)}
            </Link>
          </li>
        ))}
      </ol>

      <section className="surface-card mt-8 space-y-3 p-5 text-sm leading-7">
        <h2 className="font-display text-xl font-bold">{t("About this bus route")}</h2>
        {["R-5", "R-6", "R-7"].includes(route.code) &&
          (language === "ur" ? (
            <>
              {route.code === "R-5" && (
                <p>
                  ریڈ بس R-5 کراچی میں سرجانی سے مسرور تک کا درج شدہ روٹ ہے۔ اس کے راستے میں نیو
                  کراچی، شفیق موڑ، ضیاء الدین چورنگی، کے ڈی اے چورنگی، موسیٰ کالونی، منگھوپیر، سائٹ
                  ایریا اور گل بائی شامل ہیں۔ یہ روٹ کراچی کے ان علاقوں کے درمیان سفر کی معلومات
                  فراہم کرتا ہے۔
                </p>
              )}
              {route.code === "R-6" && (
                <p>
                  ریڈ بس R-6 گلشنِ بہار اورنگی ٹاؤن سے سنگر چورنگی تک کا درج شدہ روٹ ہے۔ اس کے اہم
                  مقامات میں بنارس، پاپوش نگر، سائٹ ایریا، گولیمار، گارڈن، پی آئی بی، جیل روڈ،
                  بہادرآباد، بلوچ کالونی، محمودآباد، منظور کالونی اور ڈی ایچ اے فیز 1 شامل ہیں۔
                </p>
              )}
              {route.code === "R-7" && (
                <p>
                  ریڈ بس R-7 موسمیات سے گلشنِ غازی تک کا درج شدہ روٹ ہے۔ اس کے راستے میں ڈاؤ
                  یونیورسٹی، سپارکو، گلزارِ ہجری، گلشنِ اقبال، موکا چوک، شیپرونر، کٹی پہاڑی اور
                  اورنگی شامل ہیں۔ یہ روٹ کراچی کے مختلف رہائشی علاقوں کو آپس میں ملانے والی سفری
                  معلومات فراہم کرتا ہے۔
                </p>
              )}
            </>
          ) : (
            <>
              {route.code === "R-5" && (
                <p>
                  Karachi Red Bus R-5 is listed as a route from Surjani to Masroor via New Karachi,
                  Shafiq Mor, Ziauddin Chowrangi, KDA Chowrangi, Mosa Colony, Mangopir, SITE Area
                  and Gulbai. This route information helps passengers explore public transport
                  connections between northern Karachi and Masroor.
                </p>
              )}
              {route.code === "R-6" && (
                <p>
                  Karachi Red Bus R-6 is listed from Gulshan-e-Bihar Orangi Town to Singer
                  Chowrangi. Its recorded corridor includes Orangi Town, Banaras, Paposh Nagar, SITE
                  Area, Golimar, Garden, PIB, Jail Road, Bahadurabad, Baloch Colony, Mehmoodabad,
                  Manzoor Colony and DHA Phase 1. Explore the listed stops to understand connections
                  across Karachi.
                </p>
              )}
              {route.code === "R-7" && (
                <p>
                  Karachi Red Bus R-7 is listed from Mosamiyat to Gulshan-e-Ghazi G7 Stop via Dow
                  University, Suparco, Gulzar-e-Hijri, Gulshan-e-Iqbal, Muqa Chowk, Shepowner, Kati
                  Pahari and Orangi. Passengers can explore its recorded route locations when
                  planning public transport journeys across Karachi.
                </p>
              )}
            </>
          ))}
        {language === "ur" ? (
          <>
            <p>
              {route.code} کراچی کی {t(meta.label)} سروس ہے۔ اس صفحے پر {place(route.stops[0])} سے{" "}
              {place(route.stops[route.stops.length - 1])} تک دستیاب اسٹاپ درج ہیں۔
            </p>
            <p>
              کراچی میں مقامی بس سے سفر کے لیے اپنے قریبی اسٹاپ کا نام اور بس کا نمبر دیکھیں۔ اس روٹ
              پر {route.stops.length} درج مقامات ہیں۔
            </p>
            <p>
              اہم مقامات میں {route.stops.slice(1, 5).map(place).join("، ")} شامل ہیں۔ سفر کی سمت کے
              مطابق اسٹاپ کی ترتیب دیکھیں۔
            </p>
            <p>
              درج کرایہ ایک اندازہ ہے۔ اصل کرایہ فاصلے اور سروس کے مطابق مختلف ہو سکتا ہے؛ کنڈکٹر سے
              تصدیق کریں۔
            </p>
            <p>
              راستہ یار کے سفر پلانر میں کم کرایے، کم اسٹاپ اور کم بس تبدیلیوں کے لحاظ سے کراچی پبلک
              ٹرانسپورٹ کے راستوں کا موازنہ کریں۔
            </p>
          </>
        ) : (
          <>
            <p>
              {""}
              <T>{"The"}</T> {route.code} {meta.label} {""}
              <T>
                {"listing is part of RastaYaar’s Karachi public transport guide, connecting"}
              </T>{" "}
              {route.stops[0]} {""}
              <T>{"and"}</T> {route.stops[route.stops.length - 1]} {""}
              <T>{"in the available route records."}</T>
              {""}
            </p>
            <p>
              {""}
              <T>{"For this Karachi local bus route, the directory lists"}</T> {route.stops.length}{" "}
              {""}
              <T>
                {
                  "locations. Use the numbered stops to find a boarding point near your area and check the direction before boarding."
                }
              </T>
              {""}
            </p>
            <p>
              {""}
              <T>{"Recorded places along"}</T> {route.code} {""}
              <T>{"include"}</T> {route.stops.slice(1, 5).join(", ") || route.stops[0]}
              {""}
              <T>
                {
                  ". The list describes saved route information rather than live bus positions or a timetable."
                }
              </T>
              {""}
            </p>
            <p>
              {""}
              <T>{"The fare shown for this Karachi bus service is"}</T> {meta.fare.toLowerCase()}
              {""}
              <T>
                {
                  ". Your actual local transport fare depends on the journey and current operator charges; confirm it with the conductor."
                }
              </T>
              {""}
            </p>
            <p>
              {""}
              <T>
                {
                  "Use the RastaYaar trip planner to compare bus routes in Karachi by estimated total fare, number of stops and bus changes. Connecting services below can help you explore onward public transport options."
                }
              </T>
              {""}
            </p>
          </>
        )}
      </section>

      <section
        className="surface-card mt-6 space-y-4 p-6 text-base leading-8"
        aria-label={
          language === "ur"
            ? "مقامی ٹرانسپورٹ کے مزید راستے"
            : "More Karachi local transport options"
        }
      >
        <h2 className="text-2xl font-bold">
          {language === "ur"
            ? `${route.code} اور کراچی کی مقامی ٹرانسپورٹ`
            : `${route.code} and local transport in Karachi`}
        </h2>
        <p>
          {language === "ur"
            ? `${route.code} کے اس روٹ کو کراچی بس روٹس کے سفر پلانر میں اپنی روانگی اور منزل کے ساتھ ملائیں۔ ${place(route.stops[0])} سے ${place(route.stops.at(-1))} تک درج مقامات دیکھیں اور کم کرایے، کم اسٹاپ یا کم بس تبدیلیوں کی ترجیح منتخب کریں۔ درست روٹ اور سمت کے لیے صرف بس نمبر پر انحصار نہ کریں۔`
            : `Use this ${route.code} listing with the Karachi bus routes planner to check your starting point and destination. Its recorded corridor connects ${route.stops[0]} and ${route.stops.at(-1)}. Compare local transport by estimated fare, recorded stops and bus changes, then confirm the direction and boarding point for your particular journey.`}
        </p>
        <p>
          {language === "ur"
            ? "مقامی ٹرانسپورٹ کی دوسری اقسام دیکھنے کے لیے ریڈ بس روٹ فہرست، گرین بس روٹس کے لیے گرین لائن بی آر ٹی، یا W 11 منی بس کی معلومات کھولیں۔ یہ مختلف بس سروسز کی فہرستیں ہیں؛ ہر سروس اس صفحے کے تمام مقامات سے نہیں گزرتی۔ پسندیدہ روٹ کو بس محفوظ کریں کے بٹن سے دوبارہ دیکھنے کے لیے محفوظ کر سکتے ہیں۔"
            : "Explore other Karachi bus services through the Red Bus route directory, Green Line BRT for green bus routes, or the W 11 mini bus listing. These are separate local transport services with their own stops; they do not all follow the same corridor. Save a useful route with Save Bus so you can reopen its details during your regular public transport journeys."}
        </p>
        <div className="flex flex-wrap gap-3 font-semibold text-primary">
          <Link
            to="/routes/$slug"
            params={{ slug: "red_bus" }}
            className="rounded-xl border px-4 py-2"
          >
            {language === "ur" ? "ریڈ بس روٹس" : "Red Bus routes"}
          </Link>
          <Link
            to="/routes/$slug"
            params={{ slug: "green-line" }}
            className="rounded-xl border px-4 py-2"
          >
            {language === "ur" ? "گرین لائن" : "Green bus routes"}
          </Link>
          <Link
            to="/routes/$slug"
            params={{ slug: "w-11" }}
            className="rounded-xl border px-4 py-2"
          >
            W 11 / W-11
          </Link>
          <Link to="/plan" className="rounded-xl bg-primary px-4 py-2 text-primary-foreground">
            {t("Plan a trip")}
          </Link>
        </div>
      </section>

      {related.length > 0 && (
        <>
          <h2 className="mt-8 font-display text-xl font-bold text-ink">
            {""}
            <T>{"Connecting buses"}</T>{" "}
          </h2>

          <div className="mt-3 flex flex-wrap gap-2">
            {related.map((r) => (
              <Link
                key={r.slug}
                to="/routes/$slug"
                params={{ slug: r.slug }}
                className="rounded-full border border-border bg-surface px-3 py-1.5 text-sm font-semibold transition-colors hover:border-primary hover:text-primary"
              >
                {r.code}
              </Link>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
