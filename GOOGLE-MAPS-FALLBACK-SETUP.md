# Map setup (no API key)

The route-stop map uses Leaflet with OpenStreetMap standard raster tiles:

`https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png`

This tile URL does not require a CARTO or Google Maps API key. Keep the OpenStreetMap attribution visible. The public OpenStreetMap tile service is provided subject to its tile usage policy and is not an unlimited production CDN; for high traffic, choose a tile provider whose free tier and terms fit the site.

The route lines and markers are drawn by Leaflet from the coordinates in `src/components/route-stop-map.tsx`. A missing coordinate means a stop is not plotted; do not guess coordinates.
