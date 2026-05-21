import { createFileRoute, Link, notFound, useNavigate } from "@tanstack/react-router";
import { useEffect } from "react";
import { ArrowLeft, ArrowRight, Clock } from "lucide-react";
import {
  INSIGHTS,
  getInsightByAnySlug,
  getInsightById,
  type ResolvedInsight,
} from "@/lib/insights";
import { useT, type Lang } from "@/lib/i18n";

export const Route = createFileRoute("/insights/$slug")({
  loader: ({ params }) => {
    const post = getInsightByAnySlug(params.slug);
    if (!post) throw notFound();
    return { post };
  },
  head: ({ params, loaderData }) => {
    const post = loaderData?.post;
    if (!post) {
      return { meta: [{ title: "Insight — ElevateIT" }] };
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
        mainEntity: post.faq.map((f: { q: string; a: string }) => ({
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
      <p className="text-xs uppercase tracking-[0.25em] text-primary mb-4">404</p>
      <h1 className="text-3xl md:text-5xl font-bold text-foreground mb-8">
        404
      </h1>
      <Link to="/insights" className="btn-outline inline-flex">
        <ArrowLeft className="h-4 w-4" />
        Insights
      </Link>
    </div>
  ),
});

const LOCALE_MAP: Record<Lang, string> = {
  CZ: "cs-CZ",
  EN: "en-GB",
  RU: "ru-RU",
  UA: "uk-UA",
};

const READ_LABEL: Record<Lang, string> = {
  CZ: "min čtení",
  EN: "min read",
  RU: "мин чтения",
  UA: "хв читання",
};

const FAQ_LABEL: Record<Lang, string> = {
  CZ: "Časté dotazy",
  EN: "Frequently asked",
  RU: "Частые вопросы",
  UA: "Часті питання",
};

const BACK_LABEL: Record<Lang, string> = {
  CZ: "Všechny insights",
  EN: "All insights",
  RU: "Все статьи",
  UA: "Усі статті",
};

const RELATED_LABEL: Record<Lang, string> = {
  CZ: "Související",
  EN: "Related",
  RU: "Похожее",
  UA: "Схоже",
};

const CTA_TITLE: Record<Lang, string> = {
  CZ: "Chcete vědět, jak si stojí váš web?",
  EN: "Want to know where your website stands?",
  RU: "Хотите узнать, как обстоят дела с вашим сайтом?",
  UA: "Хочете дізнатися, як справи з вашим сайтом?",
};

const CTA_DESC: Record<Lang, string> = {
  CZ: "Pošlete nám URL a do 48 hodin dostanete konkrétní pohled na UX, výkon a konverzní potenciál.",
  EN: "Send us the URL — within 48 hours you'll receive a concrete take on UX, performance and conversion potential.",
  RU: "Пришлите URL — в течение 48 часов получите конкретный взгляд на UX, скорость и конверсионный потенциал.",
  UA: "Надішліть URL — упродовж 48 годин отримаєте конкретний погляд на UX, швидкість і конверсійний потенціал.",
};

const CTA_BTN: Record<Lang, string> = {
  CZ: "Získat audit zdarma",
  EN: "Get a free audit",
  RU: "Получить бесплатный аудит",
  UA: "Отримати безкоштовний аудит",
};

function InsightPage() {
  const navigate = useNavigate();
  const { lang, t } = useT();
  const { post } = Route.useLoaderData() as { post: ResolvedInsight };

  // When user switches language, swap the URL slug to the matching locale slug.
  useEffect(() => {
    const insight = INSIGHTS.find((i) => i.id === post.id);
    if (!insight) return;
    const localized = insight.i18n[lang];
    if (localized && localized.slug !== post.slug) {
      navigate({
        to: "/insights/$slug",
        params: { slug: localized.slug },
        replace: true,
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [lang]);

  // Re-resolve the post into the active language for instant rerender even
  // before the URL swap completes.
  const active = getInsightById(post.id, lang) ?? post;

  const related = (active.related ?? [])
    .map((id) => getInsightById(id, lang))
    .filter((i): i is ResolvedInsight => Boolean(i));

  const formatter = new Intl.DateTimeFormat(LOCALE_MAP[lang], {
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
            {BACK_LABEL[lang]}
          </Link>

          <p className="text-[11px] uppercase tracking-[0.25em] text-primary mb-5">
            {active.category}
          </p>
          <h1 className="text-4xl md:text-6xl font-bold text-foreground tracking-tight leading-[1.05] mb-8">
            {active.title}
          </h1>
          <div className="flex items-center gap-4 text-xs text-muted-foreground mb-12">
            <span>{formatter.format(new Date(active.publishedAt))}</span>
            <span className="h-1 w-1 rounded-full bg-border" />
            <span className="flex items-center gap-1.5">
              <Clock className="h-3.5 w-3.5" />
              {active.readingMinutes} {READ_LABEL[lang]}
            </span>
          </div>

          <p className="text-lg md:text-xl text-foreground leading-relaxed mb-16 border-l-2 border-primary pl-6">
            {active.lead}
          </p>

          <div className="space-y-14">
            {active.sections.map((s, i) => (
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

          {active.faq && active.faq.length > 0 && (
            <section className="mt-20 pt-12 border-t border-border">
              <h2 className="text-2xl md:text-3xl font-bold text-foreground tracking-tight mb-8">
                {FAQ_LABEL[lang]}
              </h2>
              <div className="space-y-6">
                {active.faq.map((f) => (
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
              {t.audit.navLink}
            </p>
            <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-4">
              {CTA_TITLE[lang]}
            </h2>
            <p className="text-sm text-muted-foreground max-w-md mx-auto mb-7">
              {CTA_DESC[lang]}
            </p>
            <Link to="/audit" className="btn-primary inline-flex">
              {CTA_BTN[lang]}
              <ArrowRight className="h-4 w-4" />
            </Link>
          </aside>
        </div>
      </article>

      {related.length > 0 && (
        <section className="py-20 md:py-28 border-t border-border bg-surface/30">
          <div className="container-luxe max-w-5xl">
            <p className="text-[11px] uppercase tracking-[0.25em] text-muted-foreground mb-8">
              {RELATED_LABEL[lang]}
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {related.map((r) => (
                <Link
                  key={r.id}
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
