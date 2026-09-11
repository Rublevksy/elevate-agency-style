/**
 * The five services — one definition, read by both renderings of them: the
 * pinned desktop stage inside `HeroScene` and the stacked list in
 * `ServicesShowcase` (phones, and desktop under prefers-reduced-motion).
 *
 * Order and names are `t.ui.serviceStage` (four languages, already shipping).
 * Routes are the ones the services act has always linked. Descriptions and
 * prices come only from `usePages(lang)`:
 *
 *   Web       servicesWeb.intro       pricingPages.web.price       od 5 000 Kč
 *   SEO       — (no page of its own; its CTA is the free audit)     —
 *   E-shop    servicesEshop.intro     pricingPages.eshop.price     od 15 000 Kč
 *   Branding  servicesBranding.intro  pricingPages.branding.price  2 000 Kč
 *   Apps      — (no page of its own; its CTA is contact)            —
 *
 * SEO and Apps have no price in the application data, so none is shown — a
 * price is never inferred. (`t.pricing.plans` still carries an older START
 * 10 000 / BUSINESS 25 000 table; `/pricing` does not use it and neither does
 * this page. Recorded in docs/creative-rebuild/HOMEPAGE_BUILD.md.)
 */
import { Link } from "@tanstack/react-router";
import { ArrowRight } from "lucide-react";
import { useT } from "@/lib/i18n";
import { usePages, type PricingSlug } from "@/lib/pages-i18n";

type ServiceRoute =
  | "/services/web"
  | "/audit"
  | "/services/eshop"
  | "/services/branding"
  | "/contact";

export const SERVICE_META: ReadonlyArray<{
  route: ServiceRoute;
  pricing: PricingSlug | null;
  intro: "servicesWeb" | "servicesEshop" | "servicesBranding" | null;
}> = [
  { route: "/services/web", pricing: "web", intro: "servicesWeb" },
  { route: "/audit", pricing: null, intro: null },
  { route: "/services/eshop", pricing: "eshop", intro: "servicesEshop" },
  { route: "/services/branding", pricing: "branding", intro: "servicesBranding" },
  { route: "/contact", pricing: null, intro: null },
];

export const SERVICE_COUNT = SERVICE_META.length;

export function useService(index: number) {
  const { t, lang } = useT();
  const pages = usePages(lang);
  const meta = SERVICE_META[index];
  const stage = t.ui.serviceStage[index];
  return {
    title: stage.title,
    tag: stage.tag,
    intro: meta.intro ? pages[meta.intro].intro : null,
    bullets: t.ui.showcaseBullets[index] ?? [],
    price: meta.pricing ? pages.pricingPages[meta.pricing].price : null,
    pricingPath: meta.pricing ? pages.pricingPages[meta.pricing].path : null,
    route: meta.route,
    cta: meta.route === "/contact" ? pages.common.getQuote : t.ui.homeServicesLearn,
    priceLabel: t.nav.pricing,
    viewPricing: pages.common.viewPricing,
  };
}

/**
 * One service, in real page type. `size="stage"` is the pinned desktop column
 * (it shares a slot with four siblings, so its height is bounded); `"list"` is
 * the stacked rendering.
 */
export function ServiceCopy({ index, size = "stage" }: { index: number; size?: "stage" | "list" }) {
  const { t } = useT();
  const s = useService(index);
  const stage = size === "stage";

  return (
    <div>
      <p className="label-micro flex items-baseline gap-3">
        <span className="text-primary tabular-nums">{String(index + 1).padStart(2, "0")}</span>
        <span className="text-white/45 tabular-nums">
          / {String(SERVICE_COUNT).padStart(2, "0")}
        </span>
        <span aria-hidden className="h-px w-8 self-center bg-white/20" />
        <span className="text-white/60">{t.nav.services}</span>
      </p>
      <h2
        className={`font-display mt-4 font-extrabold tracking-[-0.02em] text-balance text-white ${
          stage
            ? "text-[clamp(1.9rem,1.2rem+2.4vw,3.25rem)] leading-[1.02]"
            : "text-[clamp(1.6rem,1.1rem+1.5vw,2.4rem)] leading-[1.04]"
        }`}
      >
        {s.title}
      </h2>
      <p className="label-micro mt-4 text-[oklch(0.78_0.19_253)]">{s.tag}</p>
      {s.intro && (
        <p
          className={`mt-4 max-w-[30rem] text-[0.9375rem] leading-relaxed text-white/65 ${
            stage ? "line-clamp-3" : ""
          }`}
        >
          {s.intro}
        </p>
      )}
      <ul className="mt-5 flex flex-wrap gap-2">
        {s.bullets.map((b) => (
          <li
            key={b}
            className="rounded-full border border-white/12 bg-white/[0.03] px-3.5 py-1 text-[0.9375rem] text-white/75"
          >
            {b}
          </li>
        ))}
      </ul>
      <div className="mt-7 flex flex-wrap items-end gap-x-8 gap-y-5">
        {s.price && (
          <div>
            <span className="label-micro block text-white/50">{s.priceLabel}</span>
            <span className="font-display mt-1.5 block text-[clamp(1.6rem,1.1rem+1.5vw,2.4rem)] leading-none font-extrabold tracking-tight text-white tabular-nums">
              {s.price}
            </span>
          </div>
        )}
        <div className="flex flex-wrap items-center gap-x-6 gap-y-3">
          <Link to={s.route} className="btn-primary">
            {s.cta}
            <ArrowRight className="size-4" aria-hidden />
          </Link>
          {s.pricingPath && (
            <Link
              to={s.pricingPath}
              className="text-sm font-medium text-white/70 underline-offset-8 transition-colors hover:text-white hover:underline"
            >
              {s.viewPricing}
            </Link>
          )}
        </div>
      </div>
    </div>
  );
}
