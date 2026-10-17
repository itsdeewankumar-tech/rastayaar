import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { ArrowLeft, ArrowRight, Clock3 } from "lucide-react";
import { getBlogPost, BLOG_POSTS } from "@/data/blogs";

export const Route = createFileRoute("/blog/$slug")({
  loader: ({ params }) => {
    const post = getBlogPost(params.slug);
    if (!post) throw notFound();
    return post;
  },
  head: ({ loaderData }) => ({
    meta: [
      { title: loaderData ? `${loaderData.title} — RastaYaar Blog` : "RastaYaar Blog" },
      { name: "description", content: loaderData?.excerpt ?? "Karachi public transport guides and travel tips from RastaYaar." },
      { property: "og:title", content: loaderData ? `${loaderData.title} — RastaYaar Blog` : "RastaYaar Blog" },
      { property: "og:description", content: loaderData?.excerpt ?? "Karachi public transport guides and travel tips from RastaYaar." },
    ],
  }),
  component: BlogArticle,
});

function BlogArticle() {
  const post = Route.useLoaderData();
  const relatedPosts = BLOG_POSTS.filter((item) => item.slug !== post.slug).slice(0, 2);

  return (
    <article>
      <div className="container-page pt-8">
        <Link to="/blog/" className="inline-flex items-center gap-2 text-sm font-semibold text-muted-foreground transition-colors hover:text-primary"><ArrowLeft className="size-4" /> All blog articles</Link>
      </div>
      <header className="container-page pb-8 pt-8 md:pb-10 md:pt-10">
        <div className="mx-auto max-w-3xl">
          <span className="rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold text-primary">{post.category}</span>
          <h1 className="mt-5 font-display text-3xl font-bold leading-tight text-ink sm:text-4xl md:text-5xl">{post.title}</h1>
          <p className="mt-5 text-lg leading-relaxed text-muted-foreground">{post.excerpt}</p>
          <div className="mt-5 flex flex-wrap items-center gap-3 text-sm text-muted-foreground">
            <span>{post.publishedAt}</span><span aria-hidden="true">·</span><span className="inline-flex items-center gap-1.5"><Clock3 className="size-4" />{post.readTime}</span>
          </div>
        </div>
      </header>
      <div className="container-page">
        <img src={post.image} alt={post.imageAlt} className="mx-auto aspect-[16/7] max-h-[460px] w-full max-w-5xl rounded-2xl object-cover" />
      </div>
      <div className="container-page grid gap-10 py-10 md:grid-cols-[minmax(0,1fr)_260px] md:gap-14 md:py-14">
        <div className="mx-auto w-full max-w-3xl md:mx-0">
          <p className="mb-8 text-lg leading-relaxed text-ink">{post.intro}</p>
          <div className="space-y-8">
            {post.sections.map((section) => (
              <section key={section.heading}>
                <h2 className="font-display text-2xl font-bold text-ink">{section.heading}</h2>
                {section.paragraphs?.map((paragraph) => <p key={paragraph} className="mt-3 text-base leading-7 text-muted-foreground">{paragraph}</p>)}
                {section.bullets && <ul className="mt-4 list-disc space-y-2 pl-5 text-base leading-7 text-muted-foreground">{section.bullets.map((bullet) => <li key={bullet}>{bullet}</li>)}</ul>}
              </section>
            ))}
          </div>
          <div className="mt-10 rounded-xl border border-border bg-secondary/40 p-5 text-sm leading-relaxed text-muted-foreground">
            <strong className="text-ink">Travel note:</strong> Route availability, stops, operating times, and fares may change. Confirm important details with transport staff or the relevant service provider before travelling.
          </div>
        </div>
        <aside className="h-fit rounded-2xl border border-border p-5 md:sticky md:top-24">
          <p className="font-display text-lg font-bold text-ink">Plan your next trip</p>
          <p className="mt-2 text-sm leading-relaxed text-muted-foreground">Explore route listings and area guides on RastaYaar before heading out.</p>
          <Link to="/routes" className="mt-4 inline-flex items-center gap-2 text-sm font-semibold text-primary hover:underline">Browse bus routes <ArrowRight className="size-4" /></Link>
          <Link to="/areas" className="mt-3 block text-sm font-semibold text-primary hover:underline">Explore areas</Link>
        </aside>
      </div>
      {relatedPosts.length > 0 && <section className="border-t border-border bg-secondary/30 py-10 md:py-14"><div className="container-page"><h2 className="font-display text-2xl font-bold text-ink">Keep reading</h2><div className="mt-5 grid gap-4 sm:grid-cols-2">{relatedPosts.map((related) => <Link key={related.slug} to="/blog/$slug" params={{ slug: related.slug }} className="surface-card flex items-center gap-4 p-4 transition-colors hover:border-primary"><img src={related.image} alt="" className="size-20 shrink-0 rounded-lg object-cover" /><div><p className="text-xs font-semibold text-primary">{related.category}</p><h3 className="mt-1 font-display font-bold text-ink">{related.title}</h3><span className="mt-2 inline-flex items-center gap-1 text-xs font-semibold text-primary">Read next <ArrowRight className="size-3.5" /></span></div></Link>)}</div></div></section>}
    </article>
  );
}
