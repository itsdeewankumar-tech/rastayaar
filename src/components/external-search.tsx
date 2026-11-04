import { useCallback, useEffect, useRef, useState } from "react";
import { useLanguage } from "./language";
type Result = {
  answer: string;
  sources: { uri: string; title: string }[];
  searchEntryPoint: string;
};
export function ExternalSearch({
  query,
  autoSearch = false,
}: {
  query: string;
  autoSearch?: boolean;
}) {
  const { language, t } = useLanguage();
  const [result, setResult] = useState<Result | null>(null),
    [loading, setLoading] = useState(false),
    [error, setError] = useState(false);
  const controller = useRef<AbortController | null>(null);
  const search = useCallback(async () => {
    controller.current?.abort();
    const active = new AbortController();
    controller.current = active;
    setLoading(true);
    setError(false);
    try {
      const response = await fetch("/api/transport/search", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ query, language }),
        signal: active.signal,
      });
      if (!response.ok) throw new Error();
      const data = await response.json();
      if (!active.signal.aborted) setResult(data);
    } catch {
      if (!active.signal.aborted) setError(true);
    } finally {
      if (!active.signal.aborted) setLoading(false);
    }
  }, [query, language]);
  useEffect(() => {
    setResult(null);
    setError(false);
    setLoading(false);
    if (autoSearch) void search();
    return () => controller.current?.abort();
  }, [search, autoSearch]);
  return (
    <section className="mt-4 rounded-xl border border-border bg-surface p-4" aria-live="polite">
      <h3 className="font-bold">{t("External search")}</h3>
      <p className="mt-1 text-sm text-muted-foreground">
        {t("External information: confirm service and fare before travelling.")}
      </p>
      <div className="mt-3 flex flex-wrap gap-3">
        <button
          type="button"
          disabled={loading}
          onClick={search}
          className="rounded-xl bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground disabled:opacity-60"
        >
          {t(loading ? "Searching the web…" : "Search Google with AI")}
        </button>
        <a
          target="_blank"
          rel="noopener noreferrer"
          className="rounded-xl border px-4 py-2 text-sm"
          href={`https://www.google.com/search?q=${encodeURIComponent(`Karachi public transport ${query}`)}`}
        >
          {t("Search Google")}
        </a>
      </div>
      {error && (
        <p role="status" className="mt-3 text-sm">
          {t("Web search is temporarily unavailable. Use Google below.")}
        </p>
      )}
      {result && (
        <div className="mt-4">
          <p className="whitespace-pre-wrap text-sm leading-7">{result.answer}</p>
          <h4 className="mt-3 font-semibold">{t("Sources")}</h4>
          <ul className="list-inside list-decimal text-sm">
            {result.sources.map((s, i) => (
              <li key={i}>
                <a href={s.uri} target="_blank" rel="noopener noreferrer" className="underline">
                  {s.title || s.uri}
                </a>
              </li>
            ))}
          </ul>
          {result.searchEntryPoint && (
            <iframe
              title={t("Google Search suggestions")}
              sandbox="allow-popups allow-popups-to-escape-sandbox"
              srcDoc={result.searchEntryPoint}
              className="mt-3 h-32 w-full border-0"
            />
          )}
        </div>
      )}
    </section>
  );
}
