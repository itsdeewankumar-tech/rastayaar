import { FeedbackForm } from "@/components/feedback-form";
import facebookIcon from "@/assets/facebook-icon.png";
import { useLanguage } from "@/components/language";
import { T } from "@/components/language";
import { createFileRoute } from "@tanstack/react-router";
import { Mail } from "lucide-react";

export const Route = createFileRoute("/contact")({
  head: () => ({
    meta: [
      { title: "Contact RastaYaar — Karachi Route Guide" },
      {
        name: "description",
        content:
          "Send RastaYaar feedback or report a route directly on the website. You can also contact us by email or Facebook.",
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
  const { language } = useLanguage();
  return (
    <div className="container-page py-12 md:py-16">
      <div className="mx-auto max-w-2xl text-center">
        <h1 className="font-display text-4xl font-bold text-ink">
          {""}
          <T>{"Contact Us"}</T>
          {""}
        </h1>
        <p className="mt-3 text-muted-foreground">
          {""}
          <T>
            {
              "Have questions about a route? Want to report outdated information? We're here to help."
            }
          </T>{" "}
        </p>
      </div>

      <div className="mt-10 grid items-start gap-6 lg:grid-cols-[minmax(0,0.8fr)_minmax(0,1.2fr)] lg:gap-8">
        <div className="grid gap-6">
          <a
            href="https://www.facebook.com/share/1FKjfzK2u6/"
            target="_blank"
            rel="noopener noreferrer"
            className="surface-card hover-lift flex min-h-72 w-full flex-col items-center justify-center p-8 text-center"
          >
            <img
              src={facebookIcon}
              alt=""
              width={64}
              height={64}
              className="size-16 rounded-full object-cover"
            />
            <h2 className="mt-4 font-display text-xl font-bold text-ink">
              {language === "ur" ? "راستہ یار کا فیس بک پیج" : "RastaYaar Facebook page"}
            </h2>
            <p className="mt-2 break-words text-lg leading-7 text-muted-foreground">
              {language === "ur"
                ? "فیس بک پر راستہ یار سے رابطہ کریں۔"
                : "Connect with RastaYaar on Facebook."}
            </p>
            <span className="mt-4 inline-flex items-center rounded-full bg-[#1877f2] px-6 py-3 text-base font-semibold text-white">
              {language === "ur" ? "فیس بک پیج کھولیں" : "Visit Facebook page"}
            </span>
          </a>
          <a
            href="mailto:rastayaar@gmail.com"
            className="surface-card hover-lift flex min-h-72 w-full flex-col items-center justify-center p-8 text-center"
          >
            <span className="grid size-16 place-items-center rounded-full bg-primary/10 text-primary">
              <Mail className="size-8" />
            </span>
            <p className="mt-4 font-display text-xl font-bold text-ink">
              {""}
              <T>{"Email"}</T>
              {""}
            </p>
            <p className="mt-2 break-words text-lg leading-7 text-muted-foreground">
              {""}
              <T>{"rastayaar@gmail.com"}</T>
              {""}
            </p>
            <span className="mt-4 inline-flex items-center rounded-full bg-primary px-6 py-3 text-base font-semibold text-primary-foreground transition-transform hover:-translate-y-0.5">
              {""}
              <T>{"Send Email"}</T>{" "}
            </span>
          </a>
        </div>
        <FeedbackForm />
      </div>
    </div>
  );
}
