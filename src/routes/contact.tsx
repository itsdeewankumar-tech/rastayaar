import { createFileRoute } from "@tanstack/react-router";
import { Mail } from "lucide-react";

export const Route = createFileRoute("/contact")({
  head: () => ({
    meta: [
      { title: "Contact RastaYaar — Karachi Route Guide" },
      {
        name: "description",
        content:
          "Get in touch with RastaYaar for route questions, corrections or feedback by email.",
      },
      { property: "og:title", content: "Contact RastaYaar — Karachi Route Guide" },
      {
        property: "og:description",
        content: "Have questions about a Karachi bus route? Reach out by email.",
      },
    ],
  }),
  component: Contact,
});

function Contact() {
  return (
    <div className="container-page py-12 md:py-16">
      <div className="mx-auto max-w-2xl text-center">
        <h1 className="font-display text-4xl font-bold text-ink">Contact Us</h1>
        <p className="mt-3 text-muted-foreground">
          Have questions about a route? Want to report outdated information? We're here to help.
        </p>
      </div>

      <div className="mt-10 flex justify-center">
        <a
          href="mailto:rastayaar@gmail.com"
          className="surface-card hover-lift flex w-full max-w-sm flex-col items-center p-6 text-center"
        >
          <span className="grid size-12 place-items-center rounded-full bg-primary/10 text-primary">
            <Mail className="size-6" />
          </span>
          <p className="mt-4 font-display font-semibold text-ink">Email</p>
          <p className="mt-1 text-sm text-muted-foreground">rastayaar@gmail.com</p>
          <span className="mt-4 inline-flex items-center rounded-full bg-primary px-4 py-1.5 text-sm font-semibold text-primary-foreground transition-transform hover:-translate-y-0.5">
            Send Email
          </span>
        </a>
      </div>
    </div>
  );
}
