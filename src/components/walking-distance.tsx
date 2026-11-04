import { useEffect, useRef, useState } from "react";
import { useLanguage } from "./language";
export function WalkingDistance({ from, to }: { from: string; to: string }) {
  const { language, t, place } = useLanguage();
  const [result, setResult] = useState<{
      meters: number;
      minutes: number;
      warnings: string[];
    } | null>(null),
    [busy, setBusy] = useState(false),
    [error, setError] = useState(false);
  const controller = useRef<AbortController | null>(null);
  useEffect(() => {
    setResult(null);
    setError(false);
    setBusy(false);
    return () => controller.current?.abort();
  }, [from, to, language]);
  async function check() {
    controller.current?.abort();
    const active = new AbortController();
    controller.current = active;
    setBusy(true);
    setError(false);
    try {
      const response = await fetch("/api/transport/walk", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ from, to, language }),
        signal: active.signal,
      });
      if (!response.ok) throw new Error();
      const data = await response.json();
      if (!active.signal.aborted) setResult(data);
    } catch {
      if (!active.signal.aborted) setError(true);
    } finally {
      if (!active.signal.aborted) setBusy(false);
    }
  }
  const href = `https://www.google.com/maps/dir/?api=1&origin=${encodeURIComponent(from + ", Karachi")}&destination=${encodeURIComponent(to + ", Karachi")}&travelmode=walking`;
  return (
    <div className="mt-3 rounded-xl border border-border p-3 text-sm" aria-live="polite">
      <p className="font-semibold">
        {t("Walking distance")}: {place(from)} → {place(to)}
      </p>
      {result ? (
        <>
          <p className="mt-2">
            Google Maps:{" "}
            <b>
              {result.meters} {t("meters")}
            </b>{" "}
            · ~{result.minutes} {t("minutes")}
          </p>
          <p>{t("Walk or arrange a ride based on your needs.")}</p>
          {result.warnings.map((w, i) => (
            <p key={i} className="mt-1">
              {w}
            </p>
          ))}
        </>
      ) : (
        <button
          type="button"
          onClick={check}
          disabled={busy}
          className="mt-2 rounded-lg border px-3 py-2 disabled:opacity-60"
        >
          {t(busy ? "Searching…" : "Check walking distance")}
        </button>
      )}
      {error && (
        <p className="mt-2">{t("Distance unavailable; open walking directions for this stop.")}</p>
      )}
      <a href={href} target="_blank" rel="noopener noreferrer" className="mt-2 block underline">
        {t("Open walking directions")}
      </a>
    </div>
  );
}
