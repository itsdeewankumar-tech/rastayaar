# RastaYaar

**Find Your Bus. Find Your Way.**

RastaYaar is a free route finder for Karachi's public transport network — mini buses,
coaches, named fleets, Red Bus (Peoples Bus Service), EV Bus, BRT, and the Double
Decker line. Type an area, chowrangi, or landmark and instantly see every route that
passes through it, or search by bus number to see its full stop list and fare.

## Features

- **Search by area or bus number** — a single search box on the home page resolves
  either a place name ("Sultanabad", "Nagan Chorangi") or a route code ("D-1"), with
  typo-tolerant matching for common local spelling variants (`chorangi`/`chowrangi`,
  `malir`/`maleer`, etc.).
- **Trip planner** (`/plan`) — enter a starting point and a destination and get direct
  routes first, then the best one-transfer journeys through a shared stop, ranked by
  number of stops.
- **Route directory** (`/routes`) — every route, filterable by service type, with a
  live text filter across route codes and stop names. Each route has its own detail
  page with the complete ordered stop list.
- **Area directory** (`/areas`) — every stop and neighbourhood, grouped alphabetically
  and searchable. Each area's detail page lists every route serving it.
- **Fares** (`/fares`) — a plain-language breakdown of estimated fares by service type.
- **About / Contact** — project background and an email contact point.
- **SEO-friendly pages** — each route and area gets its own indexable, server-rendered
  page with route-specific title, description, and Open Graph tags.
- **Resilient error handling** — a friendly error boundary and 404 page on the client,
  plus server-side recovery for SSR failures so visitors never see a raw stack trace.
- **Mobile-first, bilingual-ready UI** — built with Tailwind CSS and shadcn/ui
  components, with category-coded colors (Red Bus, EV Bus, BRT, etc.) used
  consistently across the site.
- **Traffic analytics** — [Vercel Analytics](https://vercel.com/docs/analytics) is
  wired in (`src/routes/__root.tsx`) and activates automatically once deployed on
  Vercel; view page views, visitors, and top pages from your project's Analytics tab
  in the Vercel dashboard. No setup, account, or extra cost on the free tier.

All route, stop, and fare data is static and hand-curated in
[`src/data/routes.ts`](src/data/routes.ts) — there is no backend or database; the
whole site is server-rendered from that dataset at request time (and can be
pre-rendered/cached at the edge).

## Analytics

[Vercel Web Analytics](https://vercel.com/docs/analytics) is wired in via
`<Analytics />` in `src/routes/__root.tsx` — no setup needed. Once deployed on
Vercel, open the **Analytics** tab on the project in your Vercel dashboard to see
page views, visitor counts, and top pages. It's free on the Hobby plan within
Vercel's usage limits (tens of thousands of events/month), and does nothing in
local development.

> Fares shown throughout the site are estimates for planning purposes and can change;
> conductors announce the current rate on board.

## Tech stack

| Layer                         | Technology                                                                                         |
| ----------------------------- | -------------------------------------------------------------------------------------------------- |
| Framework                     | [TanStack Start](https://tanstack.com/start) (SSR) on [React 19](https://react.dev)                |
| Routing                       | [TanStack Router](https://tanstack.com/router) (file-based, in `src/routes/`)                      |
| Data fetching                 | [TanStack Query](https://tanstack.com/query)                                                       |
| Styling                       | [Tailwind CSS v4](https://tailwindcss.com) + [shadcn/ui](https://ui.shadcn.com) (Radix primitives) |
| Build tool                    | [Vite 8](https://vite.dev)                                                                         |
| Server build / deploy adapter | [Nitro](https://nitro.build) (targets Vercel by default — see `vite.config.ts`)                    |
| Language                      | TypeScript (strict mode)                                                                           |
| Linting / formatting          | ESLint + Prettier                                                                                  |
| Package manager               | bun (bun.lock) — npm/pnpm/yarn also work                                                           |

## Project structure

```
src/
├── assets/            Images used across the site (hero, fleet photos, logo)
├── components/
│   ├── ui/             shadcn/ui primitives (button, card, dialog, ...)
│   ├── search-panel.tsx      Home page area/route search
│   ├── area-picker.tsx       Autocomplete input used by the trip planner
│   └── site-chrome.tsx       Header, footer, route/category badges
├── data/
│   └── routes.ts        The route + stop dataset, plus search/matching helpers
├── lib/
│   ├── trip-planner.ts        Direct + one-transfer journey search
│   ├── error-capture.ts       Captures the original error for SSR 500s
│   ├── error-page.ts          Static fallback HTML for unrecoverable errors
│   ├── error-reporting.ts     Client-side error boundary reporting hook
│   └── utils.ts
├── routes/              File-based routes (TanStack Router)
│   ├── __root.tsx        App shell: header/footer, error & 404 boundaries
│   ├── index.tsx          Home
│   ├── plan.tsx            Trip planner
│   ├── routes.index.tsx    Route directory
│   ├── routes.$slug.tsx    Route detail
│   ├── areas.index.tsx     Area directory
│   ├── areas.$slug.tsx     Area detail
│   ├── fares.tsx
│   ├── about.tsx
│   └── contact.tsx
├── router.tsx            Router + QueryClient setup
├── server.ts             SSR server entry (wraps TanStack Start's handler)
├── start.ts              Server middleware (error handling, CSRF)
└── styles.css            Tailwind entry + design tokens
```

## Getting started

**Requirements:** Node.js 20+ and a package manager (bun, npm, pnpm, or yarn).

```sh
git clone <your-repository-url>
cd rastayaar
bun install      # or: npm install / pnpm install / yarn install
bun run dev      # or: npm run dev
```

The dev server runs at `http://localhost:8080`.

### Available scripts

| Command     | Description                                                         |
| ----------- | ------------------------------------------------------------------- |
| `dev`       | Start the Vite dev server with HMR                                  |
| `build`     | Production build (outputs a deployable server bundle via Nitro)     |
| `build:dev` | Build in development mode (unminified, for debugging a build issue) |
| `preview`   | Serve the last production build locally                             |
| `lint`      | Run ESLint                                                          |
| `format`    | Format the codebase with Prettier                                   |

## Deploying to Vercel

The build is already configured to produce Vercel's native output format (via
Nitro's `vercel` preset in `vite.config.ts`), so no `vercel.json` or extra build
settings are required.

1. Push this repository to your own GitHub/GitLab/Bitbucket account.
2. In the [Vercel dashboard](https://vercel.com/new), import the repository.
3. Vercel auto-detects the `build` command and `dist`/`.vercel/output` — accept the
   defaults and deploy.
4. You'll get a free `your-project.vercel.app` subdomain automatically; no custom
   domain is required to go live.
5. Open your project → **Analytics** tab → **Enable**. The tracking code is already
   in the app; this just turns on data collection for it. Numbers usually appear
   within a few minutes of your first real visit.

Alternatively, from the project root with the [Vercel CLI](https://vercel.com/docs/cli):

```sh
npx vercel        # first deploy, follow the prompts
npx vercel --prod # subsequent production deploys
```

## Adding or correcting route data

All route and stop data lives in [`src/data/routes.ts`](src/data/routes.ts) as a
single array of `{ code, category, stops }` entries, with stops written as a single
`·`-separated string in order from origin to terminus. Areas, slugs, and search
indexes are derived automatically from that array — you only ever need to edit the
route list itself:

```ts
{
  code: "N-5",
  category: "mini_bus",
  stops: "Sohrab Goth · ... · Sultanabad · ... · Tower",
},
```

## License

No license has been set for this project yet — add one (e.g. MIT) if you plan to
open it up for outside contributions.

## Contact

Questions, corrections, or feedback: **rastayaar@gmail.com**
