import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { ArrowLeft, ArrowRight, Clock } from "lucide-react";
import { getInsight, INSIGHTS, type Insight } from "@/lib/insights";

export const Route = createFileRoute("/insights/$slug")({
  loader: ({ params }) => {
    const post = getInsight(params.slug);
    if (!post) throw notFound();
    return { post };
  },
  head: ({ params, loaderData }) => {
    const post = loaderData?.post;
    if (!post) {
      return {
        meta: [{ title: "Insight — ElevateIT" }],
      };
    }
    const url = `https://elevateit.cz/insights/${params.slug}`;
    const ld: Record<string, unknown>[] = [
      {
        "@context": "https://schema.org",
        "@type": "Article",
        headline: post.title,
        description: post.excerpt,
        datePublished: post.publishedAt,
        dateModified: post.publishedAt,
        inLanguage: "cs-CZ",
        author: { "@type": "Organization", name: "ElevateIT" },
        publisher: {
          "@type": "Organization",
          name: "ElevateIT",
          logo: {
            "@type": "ImageObject",
            url: "https://elevateit.cz/android-chrome-512x512.png",
          },
        },
        mainEntityOfPage: { "@type": "WebPage", "@id": url },
        url,
      },
      {
        "@context": "https://schema.org",
        "@type": "BreadcrumbList",
        itemListElement: [
          { "@type": "ListItem", position: 1, name: "Insights", item: "https://elevateit.cz/insights" },
          { "@type": "ListItem", position: 2, name: post.title, item: url },
        ],
      },
    ];
    if (post.faq && post.faq.length) {
      ld.push({
        "@context": "https://schema.org",
        "@type": "FAQPage",
        mainEntity: post.faq.map((f) => ({
          "@type": "Question",
          name: f.q,
          acceptedAnswer: { "@type": "Answer", text: f.a },
        })),
      });
    }
    return {
      meta: [
        { title: `${post.title} — ElevateIT Insights` },
        { name: "description", content: post.excerpt },
        { property: "og:title", content: post.title },
        { property: "og:description", content: post.excerpt },
        { property: "og:url", content: url },
        { property: "og:type", content: "article" },
        { property: "article:published_time", content: post.publishedAt },
        { property: "article:section", content: post.category },
        { name: "twitter:title", content: post.title },
        { name: "twitter:description", content: post.excerpt },
      ],
      links: [{ rel: "canonical", href: url }],
      scripts: ld.map((data) => ({
        type: "application/ld+json",
        children: JSON.stringify(data),
      })),
    };
  },
  component: InsightPage,
  notFoundComponent: () => (
    <div className="page-top container-luxe">
      <p className="text-xs uppercase tracking-[0.25em] text-primary mb-4">Insight nenalezen</p>
      <h1 className="text-3xl md:text-5xl font-bold text-foreground mb-8">
        Tenhle článek neexistuje.
      </h1>
      <Link to="/insights" className="btn-outline inline-flex">
        <ArrowLeft className="h-4 w-4" />
        Všechny insights
      </Link>
    </div>
  ),
});

function InsightPage() {
  const { post } = Route.useLoaderData() as { post: Insight };
  const related = (post.related ?? [])
    .map((s) => INSIGHTS.find((i) => i.slug === s))
    .filter((i): i is NonNullable<typeof i> => Boolean(i));
  const formatter = new Intl.DateTimeFormat("cs-CZ", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  return (
    <>
      <article className="page-top pb-20 md:pb-28">
        <div className="container-luxe max-w-3xl">
          <Link
            to="/insights"
            className="inline-flex items-center gap-2 text-xs uppercase tracking-[0.22em] text-muted-foreground hover:text-primary transition-colors mb-10"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            Všechny insights
          </Link>

          <p className="text-[11px] uppercase tracking-[0.25em] text-primary mb-5">
            {post.category}
          </p>
          <h1 className="text-4xl md:text-6xl font-bold text-foreground tracking-tight leading-[1.05] mb-8">
            {post.title}
          </h1>
          <div className="flex items-center gap-4 text-xs text-muted-foreground mb-12">
            <span>{formatter.format(new Date(post.publishedAt))}</span>
            <span className="h-1 w-1 rounded-full bg-border" />
            <span className="flex items-center gap-1.5">
              <Clock className="h-3.5 w-3.5" />
              {post.readingMinutes} min čtení
            </span>
          </div>

          <p className="text-lg md:text-xl text-foreground leading-relaxed mb-16 border-l-2 border-primary pl-6">
            {post.lead}
          </p>

          <div className="space-y-14">
            {post.sections.map((s, i) => (
              <section key={i}>
                <h2 className="text-2xl md:text-3xl font-bold text-foreground tracking-tight mb-6">
                  {s.heading}
                </h2>
                <div className="space-y-5">
                  {s.paragraphs.map((p, j) => (
                    <p key={j} className="text-base md:text-lg text-muted-foreground leading-relaxed">
                      {p}
                    </p>
                  ))}
                </div>
                {s.list && (
                  <ul className="mt-6 space-y-3">
                    {s.list.map((it) => (
                      <li
                        key={it}
                        className="flex items-start gap-3 text-base text-foreground leading-relaxed"
                      >
                        <span className="mt-2.5 h-1.5 w-1.5 rounded-full bg-primary shrink-0" />
                        {it}
                      </li>
                    ))}
                  </ul>
                )}
              </section>
            ))}
          </div>

          {post.faq && post.faq.length > 0 && (
            <section className="mt-20 pt-12 border-t border-border">
              <h2 className="text-2xl md:text-3xl font-bold text-foreground tracking-tight mb-8">
                Časté dotazy
              </h2>
              <div className="space-y-6">
                {post.faq.map((f) => (
                  <div key={f.q} className="p-6 rounded-xl border border-border bg-surface/40">
                    <h3 className="text-base font-bold text-foreground mb-2">{f.q}</h3>
                    <p className="text-sm text-muted-foreground leading-relaxed">{f.a}</p>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* Inline CTA */}
          <aside className="mt-20 p-10 rounded-2xl border border-primary/30 bg-surface/60 text-center">
            <p className="text-[11px] uppercase tracking-[0.25em] text-primary mb-3">
              Audit zdarma
            </p>
            <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-4">
              Chcete vědět, jak si stojí váš web?
            </h2>
            <p className="text-sm text-muted-foreground max-w-md mx-auto mb-7">
              Pošlete nám URL a do 48 hodin dostanete konkrétní pohled na UX, výkon a konverzní potenciál. Bez závazku.
            </p>
            <Link to="/audit" className="btn-primary inline-flex">
              Získat audit zdarma
              <ArrowRight className="h-4 w-4" />
            </Link>
          </aside>
        </div>
      </article>

      {related.length > 0 && (
        <section className="py-20 md:py-28 border-t border-border bg-surface/30">
          <div className="container-luxe max-w-5xl">
            <p className="text-[11px] uppercase tracking-[0.25em] text-muted-foreground mb-8">
              Související
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {related.map((r) => (
                <Link
                  key={r.slug}
                  to="/insights/$slug"
                  params={{ slug: r.slug }}
                  className="group p-8 rounded-xl border border-border bg-background/60 transition-all hover:border-primary/40"
                >
                  <p className="text-[11px] uppercase tracking-[0.22em] text-primary mb-4">
                    {r.category}
                  </p>
                  <h3 className="text-lg font-bold text-foreground group-hover:text-primary transition-colors">
                    {r.title}
                  </h3>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}
    </>
  );
}
