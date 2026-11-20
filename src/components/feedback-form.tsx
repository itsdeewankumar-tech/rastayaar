import { useRef, useState } from "react";
import { useLanguage } from "./language";

export function FeedbackForm() {
  const { language } = useLanguage();
  const ur = language === "ur";

  const [busy, setBusy] = useState(false);
  const [status, setStatus] = useState<"" | "success" | "invalid" | "rate" | "failed">("");

  const attempt = useRef<{ payload: string; id: string } | null>(null);

  const field =
    "mt-2 w-full rounded-xl border border-border bg-surface px-4 py-3 text-base font-normal outline-none focus:border-primary focus:ring-2 focus:ring-primary/20";

  async function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (busy) return;

    const form = event.currentTarget;
    const data = new FormData(form);

    const values = {
      name: String(data.get("name") ?? "").trim(),
      email: String(data.get("email") ?? "").trim(),
      category: String(data.get("category")),
      route: String(data.get("route") ?? "").trim(),
      message: String(data.get("message") ?? "").trim(),
      website: String(data.get("website") ?? ""),
    };

    if (values.message.length < 10) {
      setStatus("invalid");
      return;
    }

    const payload = JSON.stringify(values);

    if (attempt.current?.payload !== payload) {
      attempt.current = {
        payload,
        id: crypto.randomUUID(),
      };
    }

    setBusy(true);
    setStatus("");

    try {
      const response = await fetch("/api/feedback", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...values,
          id: attempt.current!.id,
        }),
        signal: AbortSignal.timeout(16000),
      });

      if (!response.ok) {
        setStatus(
          response.status === 429 ? "rate" : response.status === 400 ? "invalid" : "failed",
        );
        return;
      }

      const result = await response.json();

      if (!result.accepted) throw new Error();

      setStatus("success");
      form.reset();
      attempt.current = null;
    } catch {
      setStatus("failed");
    } finally {
      setBusy(false);
    }
  }

  const options = ur
    ? [
        ["feedback", "عام رائے"],
        ["route_problem", "روٹ کا مسئلہ بتائیں"],
        ["route_correction", "روٹ کی درستگی تجویز کریں"],
        ["fare", "کرائے کی معلومات"],
        ["website", "ویب سائٹ کا مسئلہ"],
      ]
    : [
        ["feedback", "General feedback"],
        ["route_problem", "Report a route problem"],
        ["route_correction", "Suggest a route correction"],
        ["fare", "Fare information"],
        ["website", "Website problem"],
      ];

  return (
    <section
      dir={ur ? "rtl" : "ltr"}
      lang={ur ? "ur" : "en"}
      className="surface-card w-full p-5 sm:p-8"
      aria-labelledby="feedback-title"
    >
      <h2 id="feedback-title" className="text-2xl font-bold text-ink">
        {ur ? "اپنی رائے یا روٹ کا مسئلہ یہاں لکھیں" : "Write your feedback or report a route"}
      </h2>

      <p className="mt-3 text-base leading-7 text-muted-foreground">
        {ur
          ? "ای میل ایپ کھولنے کی ضرورت نہیں۔ نیچے اپنا پیغام لکھیں اور بھیجیں۔ جواب چاہتے ہیں تو اپنا ای میل پتہ بھی درج کریں۔"
          : "No email app needed. Write your message below and send it here. Add your email only if you would like a reply."}
      </p>

      <form onSubmit={submit} className="mt-6 grid gap-5 sm:grid-cols-2">
        <label className="text-sm font-semibold">
          {ur ? "آپ کا نام (اختیاری)" : "Your name (optional)"}
          <input name="name" maxLength={80} autoComplete="name" className={field} />
        </label>

        <label className="text-sm font-semibold">
          {ur ? "جواب کے لیے ای میل (اختیاری)" : "Enter your Email for a reply (optional)"}
          <input
            name="email"
            type="email"
            maxLength={254}
            autoComplete="email"
            className={field}
            dir="ltr"
          />
        </label>

        <label className="text-sm font-semibold">
          {ur ? "پیغام کی قسم" : "What would you like to share?"}
          <select name="category" className={field}>
            {options.map(([value, label]) => (
              <option key={value} value={value}>
                {label}
              </option>
            ))}
          </select>
        </label>

        <label className="text-sm font-semibold">
          {ur ? "بس نمبر یا اسٹاپ (اختیاری)" : "Bus number or stop (optional)"}
          <input
            name="route"
            maxLength={100}
            placeholder={ur ? "مثلاً این 5، شاہین کمپلیکس" : "e.g. N-5, Shaheen Complex"}
            className={field}
            dir={ur ? "rtl" : "ltr"}
          />
        </label>

        <label className="text-sm font-semibold sm:col-span-2">
          {ur ? "آپ کا پیغام" : "Your message"}

          <textarea
            name="message"
            required
            minLength={10}
            maxLength={5000}
            rows={6}
            placeholder={
              ur
                ? "مسئلہ، درست روٹ یا اپنی تجویز لکھیں۔"
                : "Tell us what happened, what needs correcting, or your suggestion."
            }
            className={field}
            dir={ur ? "rtl" : "ltr"}
          />

          <span className="mt-1 block text-xs font-normal text-muted-foreground">
            {ur
              ? "کم از کم 10 حروف لکھیں۔ ذاتی یا حساس معلومات شامل نہ کریں۔"
              : "At least 10 characters. Please avoid sensitive personal information."}
          </span>
        </label>

        <div className="hidden" aria-hidden="true">
          <label>
            Website
            <input name="website" tabIndex={-1} autoComplete="off" />
          </label>
        </div>

        <p className="text-xs leading-6 text-muted-foreground sm:col-span-2">
          {ur
            ? "پیغام بھیجنے پر آپ کی درج کردہ معلومات راستہ یار کی ٹیم کو ای میل کے ذریعے موصول ہوں گی۔"
            : "Submitting sends the details you enter to the RastaYaar team by email."}
        </p>

        <button
          type="submit"
          disabled={busy}
          aria-busy={busy}
          className="min-h-12 rounded-xl bg-primary px-6 py-3 text-base font-bold text-primary-foreground disabled:opacity-60 sm:col-span-2"
        >
          {busy
            ? ur
              ? "بھیجا جا رہا ہے..."
              : "Sending..."
            : ur
              ? "پیغام بھیجیں"
              : "Send feedback"}
        </button>

        {status && (
          <p
            role="status"
            aria-live="polite"
            className={`rounded-xl p-4 text-sm leading-6 sm:col-span-2 ${
              status === "success" ? "bg-secondary text-primary" : "bg-amber-50 text-amber-950"
            }`}
          >
            {status === "success"
              ? ur
                ? "شکریہ! آپ کا پیغام راستہ یار کی ٹیم کو موصول ہو گیا ہے۔"
                : "Thank you! Your message has been submitted to RastaYaar."
              : status === "rate"
                ? ur
                  ? "براہِ کرم چند منٹ انتظار کریں اور دوبارہ کوشش کریں۔ آپ کا پیغام محفوظ ہے۔"
                  : "Please wait a few minutes before trying again. Your text is still here."
                : status === "invalid"
                  ? ur
                    ? "اپنا ای میل پتہ چیک کریں اور کم از کم 10 حروف کا پیغام لکھیں۔"
                    : "Check your email address and enter a message of at least 10 characters."
                  : ur
                    ? "آپ کا پیغام نہیں بھیجا جا سکا۔ آپ کا لکھا ہوا متن موجود ہے۔ دوبارہ کوشش کریں یا نیچے دیے گئے رابطے استعمال کریں۔"
                    : "Your message could not be sent. Your text is still here. Try again or use the contact links below."}
          </p>
        )}
      </form>
    </section>
  );
}
