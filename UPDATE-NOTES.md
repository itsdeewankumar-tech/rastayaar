# RastaYaar update — 2 November 2026

This archive updates the supplied project source. It has not been deployed to rastayaar.com.

## Wider layout and free feedback configuration

- Hero text starts closer to the left edge on desktop. A wider container gives the search panel more usable space.
- Header navigation labels are larger and evenly distributed between the language control and Save Bus action, reducing the gap after Contact Us. The desktop header remains one row; mobile navigation wraps to its own scrollable row so links remain usable.
- Email and RastaYaar Facebook contact cards, icons, text and actions are larger. Footer contact links are also enlarged.
- Feedback is retained because it can run on Resend’s free transactional plan. As checked on 3 November 2026, that plan includes 100 emails/day and 3,000/month. Use the Free plan; a paid upgrade is not required within those limits. Do not enable paid overages if you want to keep it free. Other messages sent by the same account can consume its quota.
- The service is not unlimited, and sending stops/fails at quota limits rather than this app choosing a paid plan. Configure the free account, verify your existing sending domain and add the server variables described below. Without configuration, form delivery does not work and no success is claimed. The email/Facebook links remain available.

Pricing checked: https://www.resend.com/pricing?product=transactional

## Header, graphical help cards and direct feedback — 3 November 2026

- Privacy Policy and Route Disclaimer remain in the footer but are removed from the header. The larger bold teal Save Bus action is at the right end of the English header, separate from the main menu. Logo and main navigation are larger, with a compact language switch.
- The search panel receives a larger share of the hero layout. The two help cards use decorative SVG route-planning and saved-journey illustrations in both homepage locations; existing real bus photos remain unchanged.
- Contact Us has a bilingual on-site feedback form for general feedback, route problems/corrections, fare information and website issues. A visitor may omit name and reply email. Submissions go to the fixed address `rastayaar@gmail.com` via a server-only Resend integration. Visitor input cannot set recipients or send HTML.
- Server validation, bounded request bodies, same-origin checks, a honeypot, instance-local rate limits, provider timeout and idempotency keys are included. A failed request preserves the visitor's text and never claims success.
- Live mail delivery was **not tested**: no sending credentials were supplied. Provider tests are mocked and send no real email. Deploy with the server and set the two variables below before relying on form delivery.

### Activate feedback delivery

1. In your Resend account, verify a domain you control for sending (for example `rastayaar.com`) and add the provider's requested DNS records.
2. Create a sending API key and set `RESEND_API_KEY` as a server-only environment variable on your host.
3. Set `FEEDBACK_FROM_EMAIL` to an address on that verified domain, for example `RastaYaar <feedback@rastayaar.com>`. Do not use an unverified Gmail address as the sending identity. The recipient is already fixed to `rastayaar@gmail.com`.
4. Redeploy, submit a real test from Contact Us, and check both the inbox/spam folder and the provider's delivery status. No credentials belong in browser variables or source control.
5. Configure a distributed request limit at the host for `/api/feedback` before broad public use; the included in-process limit is per server instance.

Without these variables, the form returns a clear failure and preserves the message; email and Facebook contact links remain available. There is no database inbox or background queue. Provider acceptance is not a guarantee of inbox placement.

API reference: https://resend.com/docs/api-reference/emails/send-email

## Coloured steps and FAST interchange correction

- Journey step numbers use contrasting blue, purple and amber circles with bold white numbers.
- R-9 / N-5 connections prefer the owner-confirmed Shaheen Complex interchange over another shared stop when sparse saved stop counts differ slightly. FAST ↔ Sultanabad now includes R-9 ↔ N-5 at Shaheen Complex in both directions, with one bus change.
- The interchange preference is a small comparison allowance within that bus pair; it does not invent stops, distances or travel times.

## Readable journeys and practical connections — 3 November 2026

- Journey results now use large Board at / Get off at instructions, numbered bus steps, an explicit change-bus message and a clearly separate total fare. Stop lists remain expandable.
- Save Bus is a full-width flat blue button on journey results. All save-button and save-menu 3D, movement and raised-shadow effects have been removed.
- The owner-reported N-5 Metropole connection is recorded explicitly. Default balanced recommendations now prioritise the fewest bus changes and exclude extra-change alternatives when simpler saved journeys exist. Lowest-fare and fewest-stops preferences remain available for deliberate tradeoffs.
- CBM / IoBM ↔ Sultanabad regression checks now cover R-10 ↔ N-5 at Metropole with one change and without New Afridi. The connection is community-provided, not independently verified.
- A walking-distance check is offered for this Metropole connection. No nearby-stop merge or invented walking distance is used. Google credentials are still required for inline meters; a Google walking-directions link remains available without them.
- Helpful Plan a trip and Open saved buses cards fill the two positions beside BRT in both homepage card sections. These are clearly guidance cards, not extra bus services.
- Homepage hero proportions follow the reference; Plan a trip is slightly shorter and the search block remains spacious.
- The small shared-footer founder credit sits centered immediately above the public-information disclaimer. The separate coloured founder credit after the page content is preserved.

## Current layout and content revision

- Homepage action hierarchy: Plan a trip is the orange primary action with a gentle glow and slightly shorter desktop width; the search panel has more space. Browse all routes is the compact rounded secondary action.

- Compact single-row desktop header, normal 16px base text and balanced page controls, following the earlier layout supplied by the owner.
- The single-row header contains a moderately larger logo, compact Urdu / English switch and navigation. Facebook stays outside the header.
- Save Bus actions use a contrasting flat blue colour with no movement or 3D effects.
- One combined Green Line & Orange Line BRT photo card, with seven fleet cards and seven service cards, with two clearly labelled help cards filling each final row on desktop. Pink Bus follows Double Decker. Both BRT route pages remain accessible through the BRT category.
- Facebook appears in the Contact Us page and footer contact area as “RastaYaar · Facebook”, using the owner-supplied icon and exact page link. It is separate from the founder credit and has no oversized badge.
- The page-content founder credit is centered on a filled colour panel; the shared footer uses a short centered line above the public-information disclaimer. Copyright stays left-aligned.
- The optional last-mile input remains removed. Previously added Oak Tower lookup and saved journey compatibility remain in place.
- The existing SEO guide, bilingual interface, route data and viability ranking are retained.

## Implemented

- English / Urdu interface switch with right-to-left layout and a remembered browser preference. Main navigation, planner, search controls, route descriptions, fare labels, directory labels and privacy page support Urdu. Common landmarks also have curated Urdu display names and input aliases. Proper names without a curated Urdu name and existing editorial blog articles retain their source wording.
- Shared place aliases in autocomplete, bus search, area listings and journey planning: CBM / IoBM, NIPA / NIPA Chorangi, NED, Saddar / Sadar, common Urdu inputs and spelling variants. R9 and R-9 searches now match. Muslim Coach / Muslim Cross finds the existing Muslim service.
- Bidirectional routing using the recorded stop sequence, explicit one-way support (`bidirectional: false`), complete direct and one-change exploration before a bounded two-change search, loop rejection, best interchange per service combination and elimination of dominated detours. Rankings: balanced (fewest bus changes first, then recorded stops), lowest estimated fare, fewest recorded stops, or fewest changes. Rankings are not travel-time predictions.
- Per-leg estimated fare ranges and the sum of every leg's minimum and maximum. These are category estimates inherited from the project, not verified current tariffs or distance-specific fares.
- Walking distance support through the main destination field. “Oak Tower” (or اوک ٹاور) uses Shaheen Complex as the community-requested alighting point; a full destination address is recommended to disambiguate similarly named buildings. The walking service returns Google's distance in meters and estimated minutes. No hardcoded or straight-line distance is presented as an exact walking distance.
- Imran mini bus: supplied Model Colony–Machli Chowk sequence, including Gulbai. “Shahrah-e-Faisal” is treated as the corridor, not an extra invented boarding stop.
- Community-supplied downtown sequence for Muslim, R-1, R-9, Ilyas and N-5: Shaheen Complex, Arts Council, Press Club, nearby Governor House, Zainab Market, Avari Tower and Mehran Hotel (reversed where required). The broader route retains its existing records. These are owner-reported changes, not a road or GPS survey; confirm one-way streets and exact boarding points before publishing as verified transport data.
- Masood's existing NIPA–NED connection is retained; separately labelled Shiraz and G-27 community-reported NIPA–NED segments are added without inventing their full routes. The original G-27 service record remains available.
- Pink R1 Khokhrapar–Dockyard, R2 Powerhouse–Indus Hospital, R3 Powerhouse–Nasir Jump, R9 Gulshan-e-Hadeed–Tower and R10 Numaish–Ibrahim Hyderi. Per the owner’s explicit follow-up instruction, these copy the complete matching Red Bus stop lists into independent Pink records, with the same R-1 / R-2 / R-3 / R-9 / R-10 display codes and separate page URLs. Each is labelled women-only. The planner includes them only when “Include women-only Pink Bus services” is selected. This is owner-provided routing data, not an independent confirmation of current Pink operations. The home-page Pink Bus photo card uses the owner’s attached real bus photo.
- Return-direction toggle on full route pages; numbered stops in travel order.
- Five readable route-specific paragraphs beneath each bus's stop list, with endpoints, landmarks, fares and journey-planning guidance. Relevant Karachi transport terms are used naturally. Search rankings cannot be guaranteed by keyword repetition.
- Sitemap generated from runtime route/area data, including new route and category pages; stop-variant area links resolve instead of producing missing pages.
- Server-only AI fallback with Google Search grounding, source links, Google's returned Search suggestions in a sandboxed frame, and a clear separation from the saved route graph. A submitted planner search with no result triggers this fallback automatically; the home search panel offers an explicit AI-search button. Ungrounded AI responses are rejected.
- Input validation, same-origin checks, timeouts, an instance-local request limit and clear unavailable-service fallbacks. For public paid API use, configure a distributed limit at the host and provider quotas as the in-process limit is not shared across server instances.
- TypeScript fixes for inherited map, blog and router typing errors.

- Saved route and journey buttons, a dedicated Saved page and browser-local persistence with remove controls. Opening a saved journey fills the planner and shows its saved service combination first when still viable; it is recomputed against current records. Saved items do not sync across devices or accounts. Invalid stored data is ignored; blocked storage reports an error instead of claiming success.
- Larger homepage “Plan a trip” button with a bus icon, clear visual priority, gentle glow animation and reduced-motion support.

## Configure the live services

The application retains its TanStack Start / Vite / Nitro Vercel server setup. It must be deployed with the server, not as a static-only upload.

In your hosting environment, add these **server-only** variables (also documented in `.env.example`):

| Variable                | Purpose                                                                           |
| ----------------------- | --------------------------------------------------------------------------------- |
| `GEMINI_API_KEY`        | Gemini access with Google Search grounding enabled                                |
| `GEMINI_SEARCH_MODEL`   | A model ID currently supported by your Google account and Google Search grounding |
| `GOOGLE_ROUTES_API_KEY` | Google Maps Routes API access; enable that API and its required billing           |
| `SITE_URL`              | Production origin for sitemap generation; defaults to `https://www.rastayaar.com` |

Never prefix the three server service variables with `VITE_`. Keep secrets in your host's secret/environment settings; do not commit them. If the services are not configured, users still receive Google Search and Maps links, with a clear message instead of fabricated results. API use may incur provider charges.

The existing `VITE_GOOGLE_MAPS_EMBED_API_KEY` is a separate optional browser map key. It is not used for the new AI or walking endpoints.

Provider references:

- https://ai.google.dev/gemini-api/docs/generate-content/google-search
- https://developers.google.com/maps/documentation/routes/reference/rest/v2/TopLevel/computeRoutes

## Founder profile update

Home and About now replace the large founder credit with a responsive, warm peach profile card, passport-style rectangular portrait, the requested founder biography and an Urdu translation. The small footer credit remains unchanged.

Portrait asset: `src/assets/deewan-kumar-founder.png`. Created with the built-in image editing tool from the supplied photograph. Final prompt: “Use case: identity-preserve. Edit target: supplied portrait of Deewan Kumar. Asset: professional founder profile photograph for RastaYaar website. Replace only the building/gates background with a clean softly lit neutral light gray studio background with a very subtle teal tint. Preserve the exact person, face, facial features, skin tone, hairstyle, smile, black suit and white shirt unchanged. Natural realistic photography, no beautification, no reshaping, no added accessories, no text. Frame a centered chest-up portrait with space above hair, suitable for a circular profile crop. Keep his existing pose and appearance; change background only.”

## Install, check and build

Use Node 20 or newer (the supplied Nitro build selects Node 24 for Vercel).

```sh
npm ci
npm run typecheck
npm test
npm run build
```

Deploy the complete project through the same Vercel project that currently serves your live website. Set the three service variables, rebuild, then verify both configured integrations with your own credentials. Back up your current deployment and compare community route corrections before replacing production.

## Validation and remaining boundaries

`npm test` covers the reported Gulberg / Water Pump / F-11 / G-11 / NIPA / NED regressions, aliases, Urdu search, totals, ranking, Pink fleet copy and eligibility, Imran, downtown updates, area link compatibility and empty searches. Server tests use mocked Google responses to verify request payloads, sourced-answer handling, missing configuration and provider failures. No live paid API call was tested because credentials were not supplied.

The Urdu planner was checked in the browser, including a Gulberg → NIPA → NED result and its summed fare. Saving a route, persistence after refresh, saving a complete journey and reopening it without retyping were also checked in the browser. This is not an audit of every stop on every route. The map still uses the project's maintained coordinate registry and straight visual links; it does not infer accurate bus paths from proximity. Missing coordinates stay explicitly unmapped. Full GPS-based correction of the whole network needs verified stop coordinates, directional service data and local validation.

## Supplied bus image replacements

Red Bus now uses the supplied original photo `src/assets/red-bus-photo.jpg`; Double Decker uses `src/assets/double-decker-photo.jpg`. These replace the earlier transparent cutouts in Home, About and blog data. No image generation or background removal was applied to these replacements. Only the homepage hero desktop side padding was doubled from 3vw to 6vw; spacing below remains unchanged.
