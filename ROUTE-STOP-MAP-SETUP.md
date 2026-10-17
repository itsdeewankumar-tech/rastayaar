# RastaYaar route-stop map (Option 2)

The Plan page includes an interactive Leaflet map using OpenStreetMap tiles. It is shown below the route options and draws colored route legs, clickable dots for stops with registered coordinates, and a complete ordered list of stops for the selected recommended journey. The list marks stops that still need coordinates.

## Run locally

1. Open this project folder in VS Code.
2. In Terminal, run `npm install`.
3. Run `npm run dev`.
4. Open the localhost URL printed in the terminal and visit `/plan`.

No Google Maps API key is needed for this map. It needs an internet connection to load Leaflet from unpkg and OpenStreetMap tiles.

## Coordinate data accuracy

Stop names are maintained in `src/data/routes.ts`; the map coordinate registry is `STOP_COORDS` in `src/components/route-stop-map.tsx`. Add a stop coordinate only after checking the actual stop location on a reliable map or field source. Do not estimate coordinates merely from the name. The map currently shows dots only for stops in that registry. The connecting lines are straight visual connectors, not official road-following route geometry.

OpenStreetMap map tiles are provided under the OpenStreetMap tile usage policy and attribution is shown on the map. For a public/high-traffic deployment, use a tile provider suitable for production and follow its usage terms.
