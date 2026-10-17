import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight, BookOpen, Clock3 } from "lucide-react";
import { BLOG_POSTS } from "@/data/blogs";

export const Route = createFileRoute("/blog/")({
  head: () => ({
    meta: [
      { title: "RastaYaar Blog — Karachi Bus Guides & Travel Tips" },
      { name: "description", content: "Practical Karachi public transport guides, bus route explainers, and commuter tips from RastaYaar." },
      { property: "og:title", content: "RastaYaar Blog — Karachi Bus Guides & Travel Tips" },
      { property: "og:description", content: "Explore practical guides for getting around Karachi by public transport." },
    ],
  }),
  component: BlogIndex,
});

function BlogIndex() {
  return (
    <div>
      <section className="blog-hero relative isolate overflow-hidden">
        <div className="blog-hero-photo-overlay" aria-hidden="true" />
        <div className="container-page relative py-16 md:py-20">
          <span className="blog-kicker inline-flex items-center gap-2 rounded-full px-3 py-1.5 text-xs font-semibold uppercase tracking-[0.16em]">
            <BookOpen className="size-3.5" /> The RastaYaar Blog
          </span>
          <h1 className="blog-title mt-5 max-w-3xl font-display text-4xl font-bold leading-tight sm:text-5xl">
            Better journeys start with better information.
          </h1>
          <p className="blog-subtitle mt-5 max-w-2xl text-base leading-relaxed">
            Practical bus guides, Karachi travel tips, and simple advice to help you plan your next trip with more confidence.
          </p>
          <div className="blog-hero-pills mt-6 flex flex-wrap gap-2" aria-label="Blog topics">
            <span>🚌 Route guides</span><span>📍 Karachi stops</span>
          </div>
        </div>
      </section>

      <section className="blog-feature-strip" aria-label="RastaYaar features">
        <div className="container-page blog-feature-grid">
          <div className="blog-feature-card blog-feature-route"><span className="blog-feature-icon">↗</span><span className="blog-feature-label">ROUTE INTELLIGENCE</span><strong>Find a smarter way across Karachi.</strong><small>Direct buses, clear transfers, useful stop guidance.</small><i className="feature-route-line" aria-hidden="true" /></div>
          <div className="blog-feature-card blog-feature-local"><span className="blog-feature-icon">⌖</span><span className="blog-feature-label">LOCAL KNOW-HOW</span><strong>Know the stops before you go.</strong><small>Landmarks, campuses and neighbourhood guides.</small><div className="feature-stop-dots" aria-hidden="true"><b/><b/><b/><b/><b/></div></div>
          <div className="blog-feature-card blog-feature-learn"><span className="blog-feature-icon">✳</span><span className="blog-feature-label">COMMUTER PLAYBOOK</span><strong>Less guesswork. Better journeys.</strong><small>Practical explainers made for everyday travel.</small><span className="feature-orbit" aria-hidden="true" /></div>
        </div>
      </section>

      <section className="blog-content container-page py-12 md:py-16">
        <div className="mb-7 flex flex-wrap items-end justify-between gap-3">
          <div>
            <p className="text-sm font-semibold uppercase tracking-wider text-primary">Explore and learn</p>
            <h2 className="mt-1 font-display text-2xl font-bold text-ink sm:text-3xl">Latest articles</h2>
          </div>
          <p className="text-sm text-muted-foreground">{BLOG_POSTS.length} helpful reads</p>
        </div>
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {BLOG_POSTS.map((post) => (
            <article key={post.slug} className="blog-card surface-card group flex h-full flex-col overflow-hidden">
              <Link to="/blog/$slug" params={{ slug: post.slug }} className="block overflow-hidden">
                <img src={post.image} alt={post.imageAlt} loading="lazy" className="aspect-[16/10] w-full object-cover transition-transform duration-500 group-hover:scale-[1.03]" />
              </Link>
              <div className="flex flex-1 flex-col p-5">
                <div className="flex flex-wrap items-center gap-2 text-xs font-semibold">
                  <span className="rounded-full bg-primary/10 px-2.5 py-1 text-primary">{post.category}</span>
                  <span className="text-muted-foreground">{post.publishedAt}</span>
                </div>
                <h2 className="mt-4 font-display text-xl font-bold leading-snug text-ink">
                  <Link to="/blog/$slug" params={{ slug: post.slug }} className="transition-colors hover:text-primary">{post.title}</Link>
                </h2>
                <p className="mt-3 flex-1 text-sm leading-relaxed text-muted-foreground">{post.excerpt}</p>
                <div className="mt-5 flex items-center justify-between border-t border-border pt-4">
                  <span className="inline-flex items-center gap-1.5 text-xs text-muted-foreground"><Clock3 className="size-3.5" />{post.readTime}</span>
                  <Link to="/blog/$slug" params={{ slug: post.slug }} className="inline-flex items-center gap-1.5 text-sm font-semibold text-primary hover:gap-2.5">
                    Read article <ArrowRight className="size-4 blog-arrow-motion" />
                  </Link>
                </div>
              </div>
            </article>
          ))}
        </div>
        <div className="blog-cta mt-10 rounded-2xl border p-6 sm:p-8">
          <h2 className="font-display text-xl font-bold text-ink">Planning a journey right now?</h2>
          <p className="mt-2 max-w-2xl text-sm leading-relaxed text-muted-foreground">Browse the route guide to explore available bus routes and stops around Karachi. Always confirm current fares and service details locally.</p>
          <Link to="/routes" className="mt-4 inline-flex items-center gap-2 rounded-full bg-primary px-4 py-2.5 text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary/90">Explore bus routes <ArrowRight className="size-4 blog-arrow-motion" /></Link>
        </div>
      </section>
    </div>
  );
}
