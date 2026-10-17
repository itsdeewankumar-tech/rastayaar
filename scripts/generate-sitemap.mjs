import { readFile, writeFile } from 'node:fs/promises';

const base = (process.env.SITE_URL || '').replace(/\/$/, '');
if (!base || !/^https?:\/\//i.test(base)) {
  console.error('Set SITE_URL to your real production origin, e.g. SITE_URL=https://your-domain.com');
  process.exit(1);
}

const routesSource = await readFile(new URL('../src/data/routes.ts', import.meta.url), 'utf8');
const blogSource = await readFile(new URL('../src/data/blogs.ts', import.meta.url), 'utf8');
const routeBlock = routesSource.slice(routesSource.indexOf('const raw:'), routesSource.indexOf('export const ROUTES:'));
const routeCodes = [...routeBlock.matchAll(/code:\s*"([^"]+)"/g)].map((m) => m[1]);
const stopLists = [...routeBlock.matchAll(/stops:\s*"([^"]+)"/g)].flatMap((m) => m[1].split('·').map((s) => s.trim()).filter(Boolean));
const blogSlugs = [...blogSource.matchAll(/slug:\s*"([^"]+)"/g)].map((m) => m[1]);
const slugify = (value) => value.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
const unique = (values) => [...new Set(values)];
const fixed = ['/', '/plan', '/routes', '/areas', '/blog', '/fares', '/about', '/contact', '/privacy', '/disclaimer'];
const paths = unique([
  ...fixed,
  ...routeCodes.map((code) => `/routes/${slugify(code)}`),
  ...stopLists.map((stop) => `/areas/${slugify(stop)}`),
  ...blogSlugs.map((slug) => `/blog/${slug}`),
]);
const xml = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${paths.map((path) => `  <url><loc>${base}${path.replace(/&/g, '&amp;')}</loc></url>`).join('\n')}\n</urlset>\n`;
await writeFile(new URL('../public/sitemap.xml', import.meta.url), xml);
const robotsPath = new URL('../public/robots.txt', import.meta.url);
const robots = await readFile(robotsPath, 'utf8');
const withoutOldSitemap = robots.replace(/^Sitemap:.*\n?/gim, '').trimEnd();
await writeFile(robotsPath, `${withoutOldSitemap}\nSitemap: ${base}/sitemap.xml\n`);
console.log(`Wrote public/sitemap.xml with ${paths.length} URLs for ${base}`);
