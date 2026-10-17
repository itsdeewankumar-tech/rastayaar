# RastaYaar Plan Search Update

## What changed

- Plan Trip accepts free-text start and destination names, even if they are not in the local stop database.
- When no local direct or one-transfer journey is found, the page offers external Google Maps transit directions, Google Search, and Bing Search links.
- The fallback labels external information clearly as unverified by RastaYaar.
- Stop matching normalizes common suffixes such as `Station`, `Terminal`, and `Stop`.
- Explicit CBM / IoBM / Institute of Business Management aliases allow the existing `CBM University` stop to match a user searching `IoBM`.

## Important limitation

This is a safe external-search fallback, not a private Google Search API integration or an AI-generated route engine. The website does not scrape Google's results. Google Maps and search pages open in a new tab and may provide their own transit suggestions. To display external search results directly inside RastaYaar, you would need a server-side search/geocoding provider integration, its applicable API credentials, and usage/privacy handling. Do not put secret API keys in client-side React code.

## Run locally

1. Extract this project.
2. Run `npm install` (or `bun install`) in the project directory.
3. Run `npm run dev`.
4. Open `/plan` and test both a known journey and a pair of stop names absent from the local data.

The source archive's bundled `node_modules` was not included in this update. Reinstall dependencies on your machine for your operating system.
