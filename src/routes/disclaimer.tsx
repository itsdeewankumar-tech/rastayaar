import { T } from "@/components/language";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/disclaimer")({
  head: () => ({
    meta: [
      { title: "Route Data Disclaimer — RastaYaar" },
      {
        name: "description",
        content:
          "Understand how RastaYaar sources bus route information, estimates fares and labels external transit directions for Karachi.",
      },
    ],
  }),
  component: DisclaimerPage,
});

function DisclaimerPage() {
  return (
    <article className="container-page max-w-3xl py-12">
      <h1 className="font-display text-4xl font-bold text-ink">
        {""}
        <T>{"Route Data Disclaimer"}</T>
        {""}
      </h1>
      <p className="mt-2 text-sm text-muted-foreground">
        {""}
        <T>{"Last updated: 2 November 2026"}</T>
        {""}
      </p>
      <div className="mt-6 space-y-4 leading-7 text-muted-foreground">
        <p>
          {""}
          <T>
            {
              "RastaYaar is an independent public-transport information project. It is not an official government transport service and is not affiliated with Google, IoBM, or any bus operator."
            }
          </T>
          {""}
        </p>
        <p>
          {""}
          <T>
            {
              "Route records may be incomplete, outdated, misspelled, or based on community-supplied information. A route listed on this site is not a guarantee that the service is currently operating, follows the exact displayed order, or stops at every listed location today."
            }
          </T>
          {""}
        </p>
        <p>
          {""}
          <T>
            {
              "Fare ranges, stop counts, interchange suggestions and travel order are estimates. We do not currently provide live vehicle tracking or guarantee real-time arrival times. Confirm routes, fares and service availability with operators or local staff before travelling."
            }
          </T>
          {""}
        </p>
        <p>
          {""}
          <T>
            {
              "External map and search results are provided by third parties and are not verified by RastaYaar. Their availability and information may differ from the local route database."
            }
          </T>
          {""}
        </p>
        <p>
          {""}
          <T>{"To report an incorrect route or suggest a correction, email"}</T>{" "}
          <a className="font-semibold text-primary underline" href="mailto:rastayaar@gmail.com">
            {""}
            <T>{"rastayaar@gmail.com"}</T>
            {""}
          </a>{" "}
          {""}
          <T>{"and include the route code, stop name and supporting details where possible."}</T>
          {""}
        </p>
      </div>
    </article>
  );
}
