# Map implementation note

The Plan page now uses the dedicated RastaYaar route-stop map in `src/components/route-stop-map.tsx` (Leaflet + OpenStreetMap) instead of a Google Maps iframe. No Google Maps API key is needed to display this map. Google Maps links remain available as optional external links for checking live directions.

For setup and coordinate-data notes, see `ROUTE-STOP-MAP-SETUP.md`.
