import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowUpRight, Clock } from "lucide-react";
import { INSIGHTS } from "@/lib/insights";
import { useT } from "@/lib/i18n";

export const Route = createFileRoute("/insights")({
  component: InsightsPage,
  head: () => ({
    meta: [
      { title: "Insights — ElevateIT" },
      {
        name: "description",
        content:
          "Pohled na moderní web design, UX, konverzi a digitální strategii. Otevřené názory bez marketingového balastu.",
      },
      { property: "og:title", content: "Insights — ElevateIT" },
      {
        property: "og:description",
        content:
          "Pohled na moderní web design, UX, konverzi a digitální strategii.",
      },
      { property: "og:url", content: "https://elevateit.cz/insights" },
    ],
    links: [{ rel: "canonical", href: "https://elevateit.cz/insights" }],
    scripts: [
      {
        type: "application/ld+json",
        children: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "Blog",
          name: "ElevateIT Insights",
          url: "https://elevateit.cz/insights",
          inLanguage: "cs-CZ",
          publisher: { "@type": "Organization", name: "ElevateIT" },
          blogPost: INSIGHTS.map((i) => ({
            "@type": "BlogPosting",
            headline: i.title,
            datePublished: i.publishedAt,
            url: `https://elevateit.cz/insights/${i.slug}`,
            description: i.excerpt,
          })),
        }),
      },
    ],
  }),
});

function InsightsPage() {
  const { lang, t } = useT();
  const locale = lang === "CZ" ? "cs-CZ" : lang === "EN" ? "en-GB" : lang === "RU" ? "ru-RU" : "uk-UA";
  const formatter = new Intl.DateTimeFormat(locale, {
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  return (
    <>
      <section className="page-top pb-12 md:pb-16 relative overflow-hidden">
        <div className="absolute inset-0 grid-bg opacity-30 [mask-image:radial-gradient(ellipse_at_top,black_10%,transparent_70%)]" />
        <div className="container-luxe relative max-w-3xl">
          <p className="text-xs uppercase tracking-[0.25em] text-primary mb-4">{t.insights.eyebrow}</p>
          <h1 className="text-5xl md:text-7xl font-bold tracking-tight text-foreground leading-[1.05]">
            {t.insights.h1}
          </h1>
          <p className="mt-8 text-lg md:text-xl text-muted-foreground leading-relaxed max-w-2xl">
            {t.insights.sub}
          </p>
        </div>
      </section>

      <section className="py-16 md:py-24 border-t border-border">
        <div className="container-luxe">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
            {INSIGHTS.map((i) => (
              <Link
                key={i.slug}
                to="/insights/$slug"
                params={{ slug: i.slug }}
                className="group flex flex-col p-8 rounded-xl border border-border bg-surface/40 backdrop-blur-sm transition-all duration-300 hover:border-primary/40 hover:-translate-y-1 hover:shadow-[0_25px_70px_-25px_rgba(59,130,246,0.45)]"
              >
                <p className="text-[11px] uppercase tracking-[0.22em] text-primary mb-5">
                  {i.category}
                </p>
                <h2 className="text-xl md:text-2xl font-bold text-foreground leading-snug mb-4 group-hover:text-primary transition-colors">
                  {i.title}
                </h2>
                <p className="text-sm text-muted-foreground leading-relaxed mb-8 flex-1">
                  {i.excerpt}
                </p>
                <div className="flex items-center justify-between text-xs text-muted-foreground">
                  <span className="flex items-center gap-2">
                    <Clock className="h-3.5 w-3.5" />
                    {i.readingMinutes} {t.insights.minutes} · {formatter.format(new Date(i.publishedAt))}
                  </span>
                  <ArrowUpRight className="h-4 w-4 text-primary transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
