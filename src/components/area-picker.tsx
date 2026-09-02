import { useMemo, useRef, useState } from "react";
import { AREAS, scoreMatch } from "@/data/routes";

export function AreaPicker({
  id,
  label,
  value,
  onChange,
  placeholder,
}: {
  id: string;
  label: string;
  value: string;
  onChange: (v: string) => void;
  placeholder: string;
}) {
  const [query, setQuery] = useState(value);
  const [open, setOpen] = useState(false);
  const blurTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const results = useMemo(() => {
    if (query.trim().length < 2) return [];
    return AREAS.map((a) => ({ a, score: scoreMatch(a.name, query) }))
      .filter((x) => x.score > 0 && x.a.name.toLowerCase() !== query.trim().toLowerCase())
      .sort((x, y) => y.score - x.score || y.a.routes.length - x.a.routes.length)
      .slice(0, 7)
      .map((x) => x.a);
  }, [query]);

  return (
    <div className="relative">
      <label
        htmlFor={id}
        className="text-xs font-semibold uppercase tracking-wide text-muted-foreground"
      >
        {label}
      </label>
      <input
        id={id}
        value={query}
        onChange={(e) => {
          setQuery(e.target.value);
          onChange(e.target.value);
          setOpen(true);
        }}
        onFocus={() => setOpen(true)}
        onBlur={() => {
          blurTimer.current = setTimeout(() => setOpen(false), 140);
        }}
        placeholder={placeholder}
        autoComplete="off"
        className="mt-1 w-full rounded-xl border border-border bg-surface px-4 py-2.5 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-ring/30"
      />
      {open && results.length > 0 && (
        <ul className="absolute z-30 mt-1 max-h-64 w-full overflow-auto rounded-xl border border-border bg-card p-1 shadow-lg">
          {results.map((a) => (
            <li key={a.slug}>
              <button
                type="button"
                onMouseDown={(e) => e.preventDefault()}
                onClick={() => {
                  if (blurTimer.current) clearTimeout(blurTimer.current);
                  setQuery(a.name);
                  onChange(a.name);
                  setOpen(false);
                }}
                className="flex w-full items-center justify-between gap-3 rounded-lg px-3 py-2 text-left text-sm hover:bg-secondary"
              >
                <span>{a.name}</span>
                <span className="text-xs text-muted-foreground">{a.routes.length} buses</span>
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
