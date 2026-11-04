import { Link } from "@tanstack/react-router";
import { useLanguage } from "./language";

/** Visible transport guidance, with search terms in context and useful internal links. */
export function TransportGuide() {
  const { language } = useLanguage();
  const ur = language === "ur";
  const sections = ur
    ? [
        [
          "کراچی بس روٹس کیسے تلاش کریں؟",
          "راستہ یار پر اپنے علاقے، منزل یا بس نمبر سے کراچی بس روٹس تلاش کریں۔ روانگی اور منزل لکھ کر براہِ راست بسوں اور بس بدلنے والے سفر کا موازنہ کریں۔ کراچی کی مقامی ٹرانسپورٹ میں ایک جگہ کے کئی نام ہو سکتے ہیں؛ اسی لیے نیپا، این ای ڈی اور سی بی ایم / آئی او بی ایم جیسے عام نام بھی تلاش میں شامل ہیں۔",
        ],
        [
          "ریڈ بس، پنک بس اور الیکٹرک بس",
          "ریڈ بس روٹ معلوم کرنے کے لیے متعلقہ R نمبر کھولیں اور ابتدائی مقام، آخری مقام اور درج اسٹاپ دیکھیں۔ پنک بس صرف خواتین کے لیے ہے اور سفر پلانر میں اس کا الگ انتخاب موجود ہے۔ الیکٹرک بس اور ڈبل ڈیکر کی معلومات بھی اسی رہنما میں ملتی ہیں۔ ہر سروس کی دستیابی اور کرایے کی سفر سے پہلے تصدیق کریں۔",
        ],
        [
          "گرین بس روٹس اور بی آر ٹی",
          "کراچی میں گرین بس روٹس تلاش کرنے والے مسافر گرین لائن بی آر ٹی کی اسٹاپ فہرست دیکھ سکتے ہیں۔ اورنج لائن کی الگ روٹ فہرست بھی دستیاب ہے۔ بی آر ٹی اسٹیشن تک پہنچنے کے لیے مقامی بس یا دوسری سواری کی ضرورت ہو سکتی ہے؛ صرف لائن کا نام دیکھنے کے بجائے اپنی منزل اور اسٹیشن کا مقام بھی ملائیں۔",
        ],
        [
          "مقامی بس، منی بس اور W 11",
          "کراچی کی مقامی ٹرانسپورٹ میں منی بسیں، کوچ اور نام والی بس سروسز اہم ہیں۔ W 11 یا W-11 جیسا بس نمبر لکھ کر اس کی درج فہرست کھولیں۔ راستے کی سمت دیکھیں اور اپنی منزل سے پہلے اترنے کا اسٹاپ جان لیں۔ کنڈکٹر سے موجودہ روٹ اور کرایہ پوچھنا خاص طور پر نئے مسافر کے لیے مفید ہے۔",
        ],
        [
          "کم کرایہ، کم اسٹاپ یا کم بس تبدیلیاں",
          "بہترین سفر ہر شخص کے لیے ایک جیسا نہیں ہوتا۔ سفر پلانر میں کم کرایہ، کم درج اسٹاپ یا کم بس تبدیلیوں کی ترجیح منتخب کریں۔ کئی بسیں لینے پر ہر بس کے اندازاً کرایے جمع کرکے مجموعی حد دکھائی جاتی ہے۔ یہ اوقاتِ آمد، ٹریفک یا سفر کے دورانیے کی ضمانت نہیں۔",
        ],
        [
          "روزمرہ سفر کے لیے بس محفوظ کریں",
          "یونیورسٹی، دفتر یا زینب مارکیٹ بار بار جانا ہو تو اپنا پسندیدہ روٹ یا پورا سفر Save Bus سے محفوظ کریں۔ محفوظ بس کے صفحے سے اسے دوبارہ کھولیں اور روانگی یا منزل دوبارہ لکھنے سے بچیں۔ یہ معلومات اسی براؤزر میں محفوظ رہتی ہیں؛ سفر کھولنے پر موجودہ روٹ ریکارڈ دوبارہ استعمال ہوتا ہے۔",
        ],
      ]
    : [
        [
          "Find Karachi bus routes by area or destination",
          "RastaYaar helps you explore Karachi bus routes using an area, landmark or bus number. Enter your starting point and destination to compare direct public bus services with journeys that need a transfer. Local transport in Karachi often uses several names for the same place, so familiar searches such as NIPA, NED and CBM / IoBM can lead to the same recorded stop.",
        ],
        [
          "Red Bus route, Pink Bus and electric bus guides",
          "Open a Red Bus route by its R number to check the recorded starting point, destination and stops. Pink Bus services are labelled women-only and have a separate option in the trip planner. Electric EV Bus and Double Decker services also have their own listings. Compare the correct service type, then confirm its current boarding point and fare before travelling.",
        ],
        [
          "Green bus routes and Karachi BRT connections",
          "If you are looking for green bus routes in Karachi, start with the Green Line BRT stop list. The Orange Line has a separate route page, making it easier to compare stations and onward connections. Reaching a BRT station may require a local bus or another ride. Check the station name against your destination rather than assuming every green bus follows the same route.",
        ],
        [
          "Local transport, mini buses and W 11",
          "Karachi local transport includes minibuses, coaches and named bus fleets as well as larger public services. Search a familiar Karachi bus number such as W 11 or W-11 to open its recorded route. Read the stop sequence in your direction of travel and identify where you need to get off. Ask the conductor about current service and charges, especially when using an unfamiliar local transport route.",
        ],
        [
          "Compare fare, stops and bus changes",
          "A useful public bus journey balances cost and convenience. Choose lowest fare, fewest recorded stops or fewest changes in the RastaYaar trip planner. For a journey using more than one Karachi bus, the estimated minimum and maximum fares of all buses are added together. These comparisons use saved route records and do not predict traffic, waiting times or live bus arrivals.",
        ],
        [
          "Save a bus for your regular Karachi journey",
          "For repeated journeys to university, work or Zainab Market, use Save Bus on a route page or journey result. Open it from the Save Bus menu next time instead of entering your stops again. Saved routes stay in this browser, and opening a saved journey checks it against the current route records. This keeps frequently used Karachi public transport information easy to find.",
        ],
      ];
  return (
    <section className="container-page mt-14" aria-labelledby="transport-guide-title">
      <h2
        id="transport-guide-title"
        className="font-display text-3xl font-bold text-ink sm:text-4xl"
      >
        {ur
          ? "کراچی پبلک ٹرانسپورٹ کی آسان رہنمائی"
          : "Your guide to Karachi bus routes & local transport"}
      </h2>
      <p className="mt-4 text-lg leading-8 text-muted-foreground">
        {ur
          ? "بس کا درست نمبر، مناسب اسٹاپ اور آسان تبدیلی جان کر سفر کی منصوبہ بندی کریں۔ مندرجہ ذیل رہنما کراچی کے روزمرہ مسافروں کے لیے تیار کیا گیا ہے۔"
          : "Find the right bus number, understand your boarding stop and compare practical connections. This guide brings Karachi public transport information together for students, workers, families and visitors planning an everyday journey."}
      </p>
      <div className="mt-7 grid grid-cols-1 gap-5">
        {sections.map(([title, body]) => (
          <article key={title} className="surface-card p-6 sm:p-8">
            <h3 className="text-xl font-bold text-ink sm:text-2xl">{title}</h3>
            <p className="mt-3 text-base leading-8 text-muted-foreground">{body}</p>
          </article>
        ))}
      </div>
      <div className="mt-6 flex flex-wrap gap-3 text-base font-semibold">
        <Link
          to="/routes/$slug"
          params={{ slug: "w-11" }}
          className="rounded-xl border bg-surface px-5 py-3 text-primary"
        >
          W 11 / W-11
        </Link>
        <Link
          to="/routes/$slug"
          params={{ slug: "green-line" }}
          className="rounded-xl border bg-surface px-5 py-3 text-primary"
        >
          {ur ? "گرین لائن اسٹاپ" : "Green Line stops"}
        </Link>
        <Link
          to="/routes/$slug"
          params={{ slug: "red_bus" }}
          className="rounded-xl border bg-surface px-5 py-3 text-primary"
        >
          {ur ? "ریڈ بس روٹس" : "Red Bus routes"}
        </Link>
        <Link to="/plan" className="rounded-xl bg-primary px-5 py-3 text-primary-foreground">
          {ur ? "اپنا سفر تلاش کریں" : "Find your journey"}
        </Link>
      </div>
    </section>
  );
}
