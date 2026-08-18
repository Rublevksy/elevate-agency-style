import { ArrowUpRight, Check, Clock, MessageCircle, Sparkles } from "lucide-react";
import { Link } from "@tanstack/react-router";
import { getPricingList } from "@/lib/pricing";
import { useT } from "@/lib/i18n";
import { usePages } from "@/lib/pages-i18n";
import { SectionHeading } from "./SectionHeading";

export function Pricing() {
  const { lang } = useT();
  const pages = usePages(lang);
  const list = getPricingList(lang);
  const c = pages.common;
  const i = pages.pricingIndex;

  return (
    <section id="pricing" className="py-28 md:py-36 border-t border-border bg-surface/30">
      <div className="container-luxe">
        <SectionHeading eyebrow={i.eyebrow} title={i.sectionTitle} subtitle={i.sectionSubtitle} />

        <div className="space-y-5">
          {list.map((offer, idx) => (
            <article
              key={offer.slug}
              className="group relative overflow-hidden rounded-xl border border-border bg-background/70 hover:border-primary/45 transition-all"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-primary/10 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
              <div className="relative grid lg:grid-cols-12 gap-8 p-7 md:p-10 items-center">
                <div className="lg:col-span-1 text-4xl font-bold text-primary/70 font-mono">0{idx + 1}</div>
                <div className="lg:col-span-5">
                  <p className="text-xs uppercase tracking-[0.25em] text-primary mb-3">{offer.eyebrow}</p>
                  <h3 className="text-3xl md:text-4xl font-bold text-foreground tracking-tight mb-4">{offer.title}</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed max-w-xl">{offer.description}</p>
                </div>
                <ul className="lg:col-span-3 grid gap-2">
                  {offer.included.slice(0, 3).map((item) => (
                    <li key={item} className="flex items-start gap-2 text-sm text-foreground/85">
                      <Check className="h-4 w-4 text-primary mt-0.5 shrink-0" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
                <div className="lg:col-span-3 lg:text-right">
                  <div className="text-3xl font-bold text-foreground mb-4">{offer.price}</div>
                  <Link to={offer.path} className="btn-primary group/btn">
                    {i.viewPricing}
                    <ArrowUpRight className="h-4 w-4 transition-transform group-hover/btn:translate-x-0.5 group-hover/btn:-translate-y-0.5" />
                  </Link>
                </div>
              </div>
            </article>
          ))}
        </div>

        <div className="mt-14 rounded-xl border border-primary/30 bg-gradient-to-br from-primary/10 via-surface to-transparent p-8 md:p-12 text-center relative overflow-hidden">
          <div className="absolute inset-0 grid-bg opacity-20 [mask-image:radial-gradient(ellipse_at_center,black,transparent_70%)]" />
          <div className="relative">
            <p className="text-xs uppercase tracking-[0.25em] text-primary mb-4">{i.notSure}</p>
            <h3 className="text-3xl md:text-4xl font-bold text-foreground tracking-tight max-w-2xl mx-auto mb-4">
              {i.notSureTitle}
            </h3>
            <p className="text-muted-foreground max-w-xl mx-auto mb-8">{i.notSureText}</p>
            <div className="flex flex-wrap items-center justify-center gap-3 mb-8 text-xs text-muted-foreground">
              <span className="inline-flex items-center gap-2 rounded-full border border-border bg-surface/60 px-4 py-2">
                <MessageCircle className="h-3.5 w-3.5 text-primary" /> {c.consultation}
              </span>
              <span className="inline-flex items-center gap-2 rounded-full border border-border bg-surface/60 px-4 py-2">
                <Clock className="h-3.5 w-3.5 text-primary" /> {c.reply24h}
              </span>
              <span className="inline-flex items-center gap-2 rounded-full border border-border bg-surface/60 px-4 py-2">
                <Sparkles className="h-3.5 w-3.5 text-primary" /> {c.individual}
              </span>
            </div>
            <Link to="/contact" className="btn-outline">{i.notSureCta}</Link>
          </div>
        </div>
      </div>
    </section>
  );
}
