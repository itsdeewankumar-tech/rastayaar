import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/disclaimer")({
  head: () => ({
    meta: [
      { title: "Route Data Disclaimer — RastaYaar" },
      { name: "description", content: "Understand how RastaYaar sources bus route information, estimates fares and labels external transit directions for Karachi." },
    ],
  }),
  component: DisclaimerPage,
});

function DisclaimerPage() {
  return (
    <article className="container-page max-w-3xl py-12">
      <h1 className="font-display text-4xl font-bold text-ink">Route Data Disclaimer</h1>
      <p className="mt-2 text-sm text-muted-foreground">Last updated: 14 October 2026</p>
      <div className="mt-6 space-y-4 leading-7 text-muted-foreground">
        <p>RastaYaar is an independent public-transport information project. It is not an official government transport service and is not affiliated with Google, IoBM, or any bus operator.</p>
        <p>Route records may be incomplete, outdated, misspelled, or based on community-supplied information. A route listed on this site is not a guarantee that the service is currently operating, follows the exact displayed order, or stops at every listed location today.</p>
        <p>Fare ranges, stop counts, interchange suggestions and travel order are estimates. We do not currently provide live vehicle tracking or guarantee real-time arrival times. Confirm routes, fares and service availability with operators or local staff before travelling.</p>
        <p>External map and search results are provided by third parties and are not verified by RastaYaar. Their availability and information may differ from the local route database.</p>
        <p>To report an incorrect route or suggest a correction, email <a className="font-semibold text-primary underline" href="mailto:rastayaar@gmail.com">rastayaar@gmail.com</a> and include the route code, stop name and supporting details where possible.</p>
      </div>
    </article>
  );
}
