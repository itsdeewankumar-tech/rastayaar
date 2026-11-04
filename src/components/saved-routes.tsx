import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import { z } from "zod";
import { useLanguage } from "./language";
const KEY = "rastayaar-saved-v1";
const record = z.object({
  id: z.string().max(1000),
  kind: z.enum(["route", "trip"]),
  routeSlug: z.string().max(160).default(""),
  from: z.string().max(160).default(""),
  to: z.string().max(160).default(""),
  walk: z.string().max(160).default(""),
  services: z.string().max(600).default(""),
  preference: z
    .enum(["balanced", "fewest-transfers", "fewest-stops", "lower-fare"])
    .default("balanced"),
});
export type SavedItem = z.infer<typeof record>;
export function parseSaved(value: string | null): SavedItem[] {
  try {
    const parsed = z
      .array(record)
      .max(100)
      .safeParse(JSON.parse(value ?? "[]"));
    return parsed.success ? parsed.data : [];
  } catch {
    return [];
  }
}
const Context = createContext({
  items: [] as SavedItem[],
  ready: false,
  error: "",
  toggle: (_: SavedItem) => {},
  remove: (_: string) => {},
});
export function SavedProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<SavedItem[]>([]),
    [ready, setReady] = useState(false),
    [error, setError] = useState("");
  useEffect(() => {
    try {
      setItems(parseSaved(localStorage.getItem(KEY)));
    } catch {
      setError("Saving is unavailable in this browser.");
    }
    setReady(true);
    const changed = (e: StorageEvent) => {
      if (e.key === KEY) setItems(parseSaved(e.newValue));
    };
    window.addEventListener("storage", changed);
    return () => window.removeEventListener("storage", changed);
  }, []);
  function persist(next: SavedItem[]) {
    try {
      localStorage.setItem(KEY, JSON.stringify(next));
      setItems(next);
      setError("");
    } catch {
      setError("Saving is unavailable in this browser.");
    }
  }
  const remove = (id: string) => persist(items.filter((i) => i.id !== id));
  const toggle = (item: SavedItem) => {
    if (items.some((i) => i.id === item.id)) return remove(item.id);
    if (items.length >= 100) {
      setError("You can save up to 100 items. Remove one to save another.");
      return;
    }
    const valid = record.safeParse(item);
    if (valid.success) persist([...items, valid.data]);
  };
  return (
    <Context.Provider value={{ items, ready, error, toggle, remove }}>{children}</Context.Provider>
  );
}
export const useSaved = () => useContext(Context);
export function SaveButton({ item, wide = false }: { item: SavedItem; wide?: boolean }) {
  const { items, ready, error, toggle } = useSaved();
  const { t } = useLanguage();
  const saved = items.some((i) => i.id === item.id);
  return (
    <div>
      <button
        type="button"
        disabled={!ready}
        onClick={() => toggle(item)}
        aria-pressed={saved}
        aria-label={t(saved ? "Bus Saved — click to remove" : "Save Bus")}
        className={`save-bus-button inline-flex min-h-12 items-center justify-center gap-3 rounded-xl border-2 px-5 py-3 text-base font-bold transition-colors disabled:opacity-50 ${wide ? "w-full" : ""}`}
      >
        <span aria-hidden="true">{saved ? "★" : "☆"}</span> {t(saved ? "Bus Saved" : "Save Bus")}
      </button>
      {error && (
        <p role="status" className="mt-1 text-sm">
          {t(error)}
        </p>
      )}
    </div>
  );
}
export function savedRoute(slug: string): SavedItem {
  return {
    id: "route:" + slug,
    kind: "route",
    routeSlug: slug,
    from: "",
    to: "",
    walk: "",
    services: "",
    preference: "balanced",
  };
}
