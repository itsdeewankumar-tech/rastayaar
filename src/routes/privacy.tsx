import { createFileRoute } from "@tanstack/react-router";
import { useLanguage } from "@/components/language";
export const Route = createFileRoute("/privacy")({
  head: () => ({
    meta: [
      { title: "Privacy Policy — RastaYaar" },
      {
        name: "description",
        content:
          "How RastaYaar handles route searches, Google services, language preferences, analytics and contact messages.",
      },
    ],
  }),
  component: PrivacyPage,
});
function PrivacyPage() {
  const { language, t } = useLanguage();
  const ur = language === "ur";
  const sections = ur
    ? [
        [
          "سفر کی تلاش",
          "محفوظ روٹس میں تلاش آپ کے براؤزر میں ہوتی ہے۔ اگر کوئی راستہ نہ ملے تو فعال ہونے کی صورت میں اے آئی تلاش کے لیے روانگی، منزل اور منتخب زبان ہمارے سرور کے ذریعے گوگل جیمنائی اور گوگل سرچ کو بھیجی جاتی ہے۔ تلاش میں ذاتی یا حساس معلومات شامل نہ کریں۔",
        ],
        [
          "پیدل راستے اور نقشے",
          "پیدل فاصلہ معلوم کرنے پر درج اسٹاپ، منزل اور زبان گوگل میپس روٹس سروس کو بھیجے جاتے ہیں۔ یہ فاصلے اندازے ہیں۔ نقشہ اوپن اسٹریٹ میپ ٹائلز اور لیف لیٹ کی فائلوں کے لیے بیرونی سرورز سے رابطہ کرتا ہے۔ بیرونی لنکس کھولنے پر متعلقہ سروس کی پالیسی لاگو ہوتی ہے۔",
        ],
        [
          "زبان کی ترجیح",
          "آپ کی زبان، محفوظ روٹس اور سفر کی تفصیلات اسی براؤزر کے لوکل اسٹوریج میں رہتی ہیں۔ یہ اکاؤنٹ سے ہم آہنگ نہیں ہوتیں۔ محفوظ روٹس کے صفحے سے اندراج ہٹائیں یا تمام معلومات کے لیے براؤزر کا سائٹ ڈیٹا صاف کریں۔",
        ],
        [
          "تجزیات اور تکنیکی معلومات",
          "اس منصوبے میں گوگل اینالیٹکس، ورسل اینالیٹکس اور اسپیڈ انسائٹس شامل ہیں۔ فعال ہونے پر یہ سروسز وزٹس، کارکردگی، براؤزر اور متعلقہ تکنیکی معلومات اپنی پالیسیوں کے مطابق استعمال کر سکتی ہیں۔ سرور عارضی طور پر درخواستوں کی تعداد محدود کرنے کے لیے نیٹ ورک شناخت استعمال کرتا ہے۔",
        ],
        [
          "رابطہ اور اختیارات",
          "فیڈبیک فارم میں درج نام، اختیاری ای میل، پیغام کی قسم، بس یا اسٹاپ اور آپ کا پیغام ریسینڈ کے ذریعے راستہ یار کو ای میل کیا جاتا ہے۔ یہ فارم معلومات کو براؤزر کے لوکل اسٹوریج میں محفوظ نہیں کرتا۔ ای میل کرنے پر بھی آپ کی بھیجی ہوئی معلومات ہمیں موصول ہوتی ہیں۔ اپنی کوکیز اور سائٹ ڈیٹا براؤزر کی سیٹنگز میں سنبھالیں۔ رازداری کے سوالات کے لیے rastayaar@gmail.com پر رابطہ کریں۔",
        ],
      ]
    : [
        [
          "Trip searches",
          "Saved-route planning runs in your browser. When no recorded journey is found, the optional AI fallback sends your entered origin, destination and selected language through our server to Google Gemini with Google Search, when configured. Do not include sensitive or personal details in search text. The general search panel also offers an explicit AI search button.",
        ],
        [
          "Walking directions and maps",
          "Requesting a walking distance sends your entered stop, destination and language to Google Maps Routes through our server. Distances are estimates. The route map connects to OpenStreetMap tile servers and loads Leaflet from a public CDN. Opening an external map or search link is governed by that provider’s policies.",
        ],
        [
          "Language preference",
          "Your English or Urdu choice and saved routes/journeys are stored in this browser’s local storage. Saved journeys include your entered stops, optional last-mile destination and preferred bus services. They do not sync to an account. Remove individual saved entries from the Saved page or clear this site’s browser data to remove them all.",
        ],
        [
          "Analytics and technical information",
          "This project includes Google Analytics, Vercel Analytics and Speed Insights. When enabled, these providers may process visits, performance, browser and technical information under their policies. The server temporarily counts requests using a network identifier to limit excessive requests.",
        ],
        [
          "Contact and choices",
          "Using the feedback form sends the name, optional reply email, feedback type, route/stop and message you enter through Resend to the RastaYaar inbox. These details are not saved to browser local storage by the form. Emailing us also provides the information you choose to send. Manage cookies and site data in your browser settings. Contact rastayaar@gmail.com with privacy questions.",
        ],
      ];
  return (
    <article className="container-page max-w-3xl space-y-5 py-12">
      <h1 className="text-4xl font-bold">{t("Privacy Policy")}</h1>
      <p className="text-sm text-muted-foreground">{t("Last updated: 3 November 2026")}</p>
      {sections.map(([heading, body]) => (
        <section key={heading}>
          <h2 className="text-xl font-semibold">{heading}</h2>
          <p className="mt-2 leading-7">{body}</p>
        </section>
      ))}
    </article>
  );
}
