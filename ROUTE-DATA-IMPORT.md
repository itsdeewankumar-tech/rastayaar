# Route data status

## Active journey-planner dataset

- The active dataset contains the original **71 routes** in `src/data/routes.ts`.
- The project homepage and route pages derive their route count from `ROUTES.length`; the active count therefore remains aligned with the data.
- The project includes eight fleet categories. The stops/areas count is calculated from the active route dataset.
- The estimated fare range is informational and is not a guarantee of current operator fares.

## Excluded reference records

An additional 316 route entries imported from a supplied route list were removed from the active dataset because their current operating status and stop order had not been independently verified. They should not appear in trip-planner results unless they are verified and intentionally added back. Route numbers alone were not used to determine which entries to remove; the original 71-route dataset was preserved.

The attached historical PDF is not evidence that a service is operating today. Do not label a route as currently operating without recent supporting confirmation.

## Trip-planner ranking

Journey results prioritize practical options, including fewer transfers and fewer stops. Among similarly practical options, the planner favors variety across available fleet categories and route choices. This diversification is a tie-breaker only; it should not move a clearly less practical journey ahead of a substantially better one.
