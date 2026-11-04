import { useRef, useState } from "react";
import { useLanguage } from "./language";
export function FeedbackForm() {
  const { language } = useLanguage(),
    ur = language === "ur";
  const [busy, setBusy] = useState(false),
    [status, setStatus] = useState<"" | "success" | "invalid" | "rate" | "failed">("");
  const attempt = useRef<{ payload: string; id: string } | null>(null);
  const field =
    "mt-2 w-full rounded-xl border border-border bg-surface px-4 py-3 text-base font-normal outline-none focus:border-primary focus:ring-2 focus:ring-primary/20";
  async function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (busy) return;
    const form = event.currentTarget,
      data = new FormData(form);
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
    if (attempt.current?.payload !== payload)
      attempt.current = { payload, id: crypto.randomUUID() };
    setBusy(true);
    setStatus("");
    try {
      const response = await fetch("/api/feedback", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...values, id: attempt.current!.id }),
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
        ["feedback", "Ø¹Ø§Ù… Ø±Ø§Ø¦Û’"],
        ["route_problem", "Ø±ÙˆÙ¹ Ú©Ø§ Ù…Ø³Ø¦Ù„Û Ø¨ØªØ§Ø¦ÛŒÚº"],
        ["route_correction", "Ø±ÙˆÙ¹ Ú©ÛŒ Ø¯Ø±Ø³ØªÚ¯ÛŒ ØªØ¬ÙˆÛŒØ² Ú©Ø±ÛŒÚº"],
        ["fare", "Ú©Ø±Ø§ÛŒÛ’ Ú©ÛŒ Ù…Ø¹Ù„ÙˆÙ…Ø§Øª"],
        ["website", "ÙˆÛŒØ¨ Ø³Ø§Ø¦Ù¹ Ú©Ø§ Ù…Ø³Ø¦Ù„Û"],
      ]
    : [
        ["feedback", "General feedback"],
        ["route_problem", "Report a route problem"],
        ["route_correction", "Suggest a route correction"],
        ["fare", "Fare information"],
        ["website", "Website problem"],
      ];
  return (
    <section className="surface-card w-full p-5 sm:p-8" aria-labelledby="feedback-title">
      <h2 id="feedback-title" className="text-2xl font-bold text-ink">
        {ur
          ? "Ø§Ù¾Ù†ÛŒ Ø±Ø§Ø¦Û’ ÛŒØ§ Ø±ÙˆÙ¹ Ú©Ø§ Ù…Ø³Ø¦Ù„Û ÛŒÛØ§Úº Ù„Ú©Ú¾ÛŒÚº"
          : "Write your feedback or report a route"}
      </h2>
      <p className="mt-3 text-base leading-7 text-muted-foreground">
        {ur
          ? "Ø§ÛŒ Ù…ÛŒÙ„ Ø§ÛŒÙ¾ Ú©Ú¾ÙˆÙ„Ù†Û’ Ú©ÛŒ Ø¶Ø±ÙˆØ±Øª Ù†ÛÛŒÚºÛ” Ù†ÛŒÚ†Û’ Ù¾ÛŒØºØ§Ù… Ù„Ú©Ú¾ÛŒÚº Ø§ÙˆØ± Ø¨Ú¾ÛŒØ¬ÛŒÚºÛ” Ø¬ÙˆØ§Ø¨ Ú†Ø§ÛÛŒÛ’ ØªÙˆ Ø§Ù¾Ù†Ø§ Ø§ÛŒ Ù…ÛŒÙ„ Ù¾ØªÛ Ø¨Ú¾ÛŒ Ù„Ú©Ú¾ÛŒÚºÛ”"
          : "No email app needed. Write your message below and send it here. Add your email only if you would like a reply."}
      </p>
      <form onSubmit={submit} className="mt-6 grid gap-5 sm:grid-cols-2">
        <label className="text-sm font-semibold">
          {ur ? "Ø¢Ù¾ Ú©Ø§ Ù†Ø§Ù… (Ø§Ø®ØªÛŒØ§Ø±ÛŒ)" : "Your name (optional)"}
          <input name="name" maxLength={80} autoComplete="name" className={field} />
        </label>
        <label className="text-sm font-semibold">
          {ur
            ? "Ø¬ÙˆØ§Ø¨ Ú©Û’ Ù„ÛŒÛ’ Ø§ÛŒ Ù…ÛŒÙ„ (Ø§Ø®ØªÛŒØ§Ø±ÛŒ)"
            : "Email for a reply (optional)"}
          <input name="email" type="email" maxLength={254} autoComplete="email" className={field} />
        </label>
        <label className="text-sm font-semibold">
          {ur ? "Ù¾ÛŒØºØ§Ù… Ú©ÛŒ Ù‚Ø³Ù…" : "What would you like to share?"}
          <select name="category" className={field}>
            {options.map(([value, label]) => (
              <option key={value} value={value}>
                {label}
              </option>
            ))}
          </select>
        </label>
        <label className="text-sm font-semibold">
          {ur ? "Ø¨Ø³ Ù†Ù…Ø¨Ø± ÛŒØ§ Ø§Ø³Ù¹Ø§Ù¾ (Ø§Ø®ØªÛŒØ§Ø±ÛŒ)" : "Bus number or stop (optional)"}
          <input
            name="route"
            maxLength={100}
            placeholder={
              ur ? "Ù…Ø«Ù„Ø§Ù‹ Ø§ÛŒÙ† 5ØŒ Ø´Ø§ÛÛŒÙ† Ú©Ù…Ù¾Ù„ÛŒÚ©Ø³" : "e.g. N-5, Shaheen Complex"
            }
            className={field}
          />
        </label>
        <label className="text-sm font-semibold sm:col-span-2">
          {ur ? "Ø¢Ù¾ Ú©Ø§ Ù¾ÛŒØºØ§Ù…" : "Your message"}
          <textarea
            name="message"
            required
            minLength={10}
            maxLength={5000}
            rows={6}
            placeholder={
              ur
                ? "Ù…Ø³Ø¦Ù„ÛØŒ Ø¯Ø±Ø³Øª Ø±ÙˆÙ¹ ÛŒØ§ Ø§Ù¾Ù†ÛŒ ØªØ¬ÙˆÛŒØ² Ù„Ú©Ú¾ÛŒÚºÛ”"
                : "Tell us what happened, what needs correcting, or your suggestion."
            }
            className={field}
          />
          <span className="mt-1 block text-xs font-normal text-muted-foreground">
            {ur
              ? "Ú©Ù… Ø§Ø² Ú©Ù… 10 Ø­Ø±ÙˆÙÛ” Ø°Ø§ØªÛŒ ÛŒØ§ Ø­Ø³Ø§Ø³ Ù…Ø¹Ù„ÙˆÙ…Ø§Øª Ø´Ø§Ù…Ù„ Ù†Û Ú©Ø±ÛŒÚºÛ”"
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
            ? "Ù¾ÛŒØºØ§Ù… Ø¨Ú¾ÛŒØ¬Ù†Û’ Ù¾Ø± Ø¢Ù¾ Ú©ÛŒ Ø¯Ø±Ø¬ Ù…Ø¹Ù„ÙˆÙ…Ø§Øª Ø±Ø§Ø³ØªÛ ÛŒØ§Ø± Ú©ÛŒ Ù¹ÛŒÙ… Ú©Ùˆ Ø§ÛŒ Ù…ÛŒÙ„ Ú©Û’ Ø°Ø±ÛŒØ¹Û’ Ù…ÙˆØµÙˆÙ„ ÛÙˆÚº Ú¯ÛŒÛ”"
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
              ? "Ø¨Ú¾ÛŒØ¬Ø§ Ø¬Ø§ Ø±ÛØ§ ÛÛ’â€¦"
              : "Sendingâ€¦"
            : ur
              ? "Ù¾ÛŒØºØ§Ù… Ø¨Ú¾ÛŒØ¬ÛŒÚº"
              : "Send feedback"}
        </button>
        {status && (
          <p
            role="status"
            aria-live="polite"
            className={`rounded-xl p-4 text-sm leading-6 sm:col-span-2 ${status === "success" ? "bg-secondary text-primary" : "bg-amber-50 text-amber-950"}`}
          >
            {status === "success"
              ? ur
                ? "Ø´Ú©Ø±ÛŒÛ! Ø¢Ù¾ Ú©Ø§ Ù¾ÛŒØºØ§Ù… Ø±Ø§Ø³ØªÛ ÛŒØ§Ø± Ú©Ùˆ Ø¬Ù…Ø¹ ÛÙˆÚ¯ÛŒØ§ ÛÛ’Û”"
                : "Thank you! Your message has been submitted to RastaYaar."
              : status === "rate"
                ? ur
                  ? "Ú©Ú†Ú¾ Ø¯ÛŒØ± Ø§Ù†ØªØ¸Ø§Ø± Ú©Ø±Ú©Û’ Ø¯ÙˆØ¨Ø§Ø±Û Ú©ÙˆØ´Ø´ Ú©Ø±ÛŒÚºÛ” Ø¢Ù¾ Ú©Ø§ Ù…ØªÙ† ÛŒÛÛŒÚº Ù…ÙˆØ¬ÙˆØ¯ ÛÛ’Û”"
                  : "Please wait a few minutes before trying again. Your text is still here."
                : status === "invalid"
                  ? ur
                    ? "Ø§ÛŒ Ù…ÛŒÙ„ Ø§ÙˆØ± Ù¾ÛŒØºØ§Ù… Ú†ÛŒÚ© Ú©Ø±ÛŒÚºÛ” Ú©Ù… Ø§Ø² Ú©Ù… 10 Ø­Ø±ÙˆÙ Ú©Ø§ Ù¾ÛŒØºØ§Ù… Ù„Ú©Ú¾ÛŒÚºÛ”"
                    : "Check your email address and enter a message of at least 10 characters."
                  : ur
                    ? "Ù¾ÛŒØºØ§Ù… Ù†ÛÛŒÚº Ø¨Ú¾ÛŒØ¬Ø§ Ø¬Ø§ Ø³Ú©Ø§Û” Ø¢Ù¾ Ú©Ø§ Ù…ØªÙ† Ù…ÙˆØ¬ÙˆØ¯ ÛÛ’Ø› Ø¯ÙˆØ¨Ø§Ø±Û Ú©ÙˆØ´Ø´ Ú©Ø±ÛŒÚº ÛŒØ§ Ù†ÛŒÚ†Û’ Ø±Ø§Ø¨Ø·Û’ Ú©Û’ Ø¯ÙˆØ³Ø±Û’ Ø·Ø±ÛŒÙ‚Û’ Ø§Ø³ØªØ¹Ù…Ø§Ù„ Ú©Ø±ÛŒÚºÛ”"
                    : "Your message could not be sent. Your text is still here. Try again or use the contact links below."}
          </p>
        )}
      </form>
    </section>
  );
}
