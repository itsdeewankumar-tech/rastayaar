import { loadRouteData } from "./load-route-data.mjs";
import { readFile, writeFile } from "node:fs/promises";

const base = (process.env.SITE_URL || "https://www.rastayaar.com").replace(/\/$/, "");
if (!base || !/^https?:\/\//i.test(base)) {
  console.error(
    "Set SITE_URL to your real production origin, e.g. SITE_URL=https://your-domain.com",
  );
  process.exit(1);
}

const { ROUTES, AREAS } = await loadRouteData();
const blogSource = await readFile(new URL("../src/data/blogs.ts", import.meta.url), "utf8");
const blogSlugs = [...blogSource.matchAll(/slug:\s*"([^"]+)"/g)].map((m) => m[1]);
const slugify = (value) =>
  value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
const unique = (values) => [...new Set(values)];
const fixed = [
  "/",
  "/plan",
  "/routes",
  "/areas",
  "/blog",
  "/fares",
  "/about",
  "/contact",
  "/privacy",
  "/disclaimer",
];
const paths = unique([
  ...fixed,
  ...ROUTES.map((route) => `/routes/${route.slug}`),
  ...[
    "mini_bus",
    "coach",
    "named_route",
    "other",
    "red_bus",
    "ev_bus",
    "brt",
    "double_decker",
    "pink_bus",
    "local_bus",
  ].map((slug) => `/routes/${slug}`),
  ...AREAS.map((area) => `/areas/${area.slug}`),
  ...blogSlugs.map((slug) => `/blog/${slug}`),
]);
const xml = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${paths.map((path) => `  <url><loc>${base}${path.replace(/&/g, "&amp;")}</loc></url>`).join("\n")}\n</urlset>\n`;
await writeFile(new URL("../public/sitemap.xml", import.meta.url), xml);
const robotsPath = new URL("../public/robots.txt", import.meta.url);
const robots = await readFile(robotsPath, "utf8");
const withoutOldSitemap = robots.replace(/^Sitemap:.*\n?/gim, "").trimEnd();
await writeFile(robotsPath, `${withoutOldSitemap}\nSitemap: ${base}/sitemap.xml\n`);
console.log(`Wrote public/sitemap.xml with ${paths.length} URLs for ${base}`);
