import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/privacy")({
  head: () => ({
    meta: [
      { title: "Privacy Policy — RastaYaar" },
      { name: "description", content: "Read how RastaYaar handles website usage, contact messages, analytics, maps and advertising technologies." },
    ],
  }),
  component: PrivacyPage,
});

function PrivacyPage() {
  return (
    <article className="container-page prose prose-slate max-w-3xl py-12">
      <h1 className="font-display text-4xl font-bold text-ink">Privacy Policy</h1>
      <p className="text-sm text-muted-foreground">Last updated: 14 October 2026</p>
      <p>RastaYaar is a public-information guide to Karachi public transport. This page explains the general ways information may be handled when you use the website. Review and update this policy to reflect the services you actually enable before launch.</p>
      <h2>Information you provide</h2>
      <p>If you contact us by email or a contact form, we receive the information you choose to send. The trip planner processes the origin and destination you enter to search the route records in the website.</p>
      <h2>Analytics and technical information</h2>
      <p>The deployed website may use analytics or performance measurement tools to understand page visits, technical errors and site performance. Those providers may process technical information such as pages visited, device/browser details and approximate location according to their own policies. Remove or update this section if analytics tools change.</p>
      <h2>Maps and external links</h2>
      <p>When you open Google Maps or another external website, that provider's privacy policy and settings apply. If an embedded map is enabled, your browser may connect to that provider while the page is open.</p>
      <h2>Advertising and cookies</h2>
      <p>If RastaYaar is approved for Google AdSense or another advertising service, third-party vendors may use cookies or similar technologies to serve, measure or personalize ads as allowed by your settings and applicable law. The final policy must disclose the actual advertising products used and provide any consent controls required for visitors' locations.</p>
      <h2>Your choices</h2>
      <p>You can avoid submitting personal details in route searches and use your browser settings to manage cookies. For questions about this policy, contact <a href="mailto:rastayaar@gmail.com">rastayaar@gmail.com</a>.</p>
      <h2>Policy updates</h2>
      <p>This policy may change as the site evolves. Publish only statements that accurately describe the live website and its enabled integrations.</p>
    </article>
  );
}
