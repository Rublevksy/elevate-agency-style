/**
 * Pricing — the real prices, on the homepage, readable at a glance.
 *
 * The previous homepage left prices off on purpose (owner, 2026-09-05); the
 * rebuild brief brings them back as part of the experience, with one hard
 * rule: visual richness must never make the commercial information harder to
 * find. So all three prices are always visible at once, in the selector row, at
 * display size — the visitor never has to click to learn what something costs.
 * Selecting a plan loads its full scope into THE WINDOW beside it, the same
 * navigation grammar the rest of the page uses (address, load bar, paint).
 *
 * Every figure and line is `usePages(lang).pricingPages` — the data `/pricing`
 * renders — plus `servicesDesign.finalPrice` for graphic design. The
 * `results[]` arrays on those pages (+45 %, +120 %, …) are NOT shown: they have
 * no source in the repository (PRODUCT.md §33) and the brief forbids metrics.
 */
import { useState } from "react";
import { Link } from "@tanstack/react-router";
import { ArrowRight, Check } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
import { EASE, useReducedScene } from "@/components/cinematic";
import { useT } from "@/lib/i18n";
import { usePages, type PricingSlug } from "@/lib/pages-i18n";

const PLANS: PricingSlug[] = ["web", "eshop", "branding"];

export function PricingSection() {
  const { t, lang } = useT();
  const pages = usePages(lang);
  const reduced = useReducedScene();
  const [active, setActive] = useState<PricingSlug>("web");

  /** `role="tablist"` promises arrow-key movement; without this the pattern
   *  announces behaviour the implementation does not have. */
  const onTabKey = (e: React.KeyboardEvent) => {
    const i = PLANS.indexOf(active);
    const next =
      e.key === "ArrowRight"
        ? (i + 1) % PLANS.length
        : e.key === "ArrowLeft"
          ? (i + PLANS.length - 1) % PLANS.length
          : -1;
    if (next < 0) return;
    e.preventDefault();
    setActive(PLANS[next]);
    document.getElementById(`plan-tab-${PLANS[next]}`)?.focus();
  };
  const plan = pages.pricingPages[active];

  const rise = (i: number) => ({
    initial: reduced ? undefined : { opacity: 0, y: 24 },
    whileInView: { opacity: 1, y: 0 },
    viewport: { once: true, margin: "-12% 0px" },
    transition: { duration: 0.7, delay: i * 0.08, ease: EASE },
  });

  return (
    <section
      id="pricing"
      aria-labelledby="pricing-title"
      className="relative isolate overflow-hidden bg-[#0A0D13] py-20 lg:py-28"
    >
      {/* The portal's light, carried down the page as a glow rather than a
          second picture: the same blue, low and wide behind the window. */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(60%_50%_at_70%_55%,oklch(0.65_0.18_255/0.13),transparent_70%)]"
      />

      <div className="container-luxe">
        <motion.div {...rise(0)} className="max-w-[40rem]">
          <p className="label-micro flex items-center gap-4 text-white/60">
            <span aria-hidden className="h-px w-10 bg-white/30" />
            {pages.pricingIndex.eyebrow}
          </p>
          <h2
            id="pricing-title"
            className="heading-scene mt-5 text-[clamp(1.9rem,1.2rem+2.4vw,3.25rem)] text-white"
          >
            {pages.pricingIndex.title}
          </h2>
          <p className="mt-5 max-w-[36rem] text-base leading-relaxed text-white/65">
            {pages.pricingIndex.subtitle}
          </p>
        </motion.div>

        {/* ---- All three prices, always visible ---------------------------- */}
        <motion.div
          {...rise(1)}
          role="tablist"
          aria-label={pages.pricingIndex.sectionTitle}
          className="mt-14 grid grid-cols-1 border-t border-white/10 sm:grid-cols-3"
        >
          {PLANS.map((slug) => {
            const p = pages.pricingPages[slug];
            const on = slug === active;
            return (
              <button
                key={slug}
                type="button"
                role="tab"
                id={`plan-tab-${slug}`}
                aria-selected={on}
                aria-controls="plan-panel"
                tabIndex={on ? 0 : -1}
                onKeyDown={onTabKey}
                onClick={() => setActive(slug)}
                className={`group relative border-b border-white/10 py-6 text-left transition-colors duration-300 sm:border-b-0 sm:pr-6 ${
                  on ? "" : "hover:bg-white/[0.02]"
                }`}
              >
                <span
                  aria-hidden
                  className={`absolute -top-px left-0 h-[2px] bg-primary transition-all duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] ${
                    on ? "w-full" : "w-0 group-hover:w-10"
                  }`}
                />
                <span className={`label-micro block ${on ? "text-primary" : "text-white/55"}`}>
                  {p.eyebrow}
                </span>
                <span
                  className={`font-display mt-3 block text-[clamp(1.6rem,1.1rem+1.5vw,2.4rem)] leading-none font-extrabold tracking-tight tabular-nums transition-colors ${
                    on ? "text-white" : "text-white/60 group-hover:text-white/85"
                  }`}
                >
                  {p.price}
                </span>
                <span
                  className={`mt-3 block text-[0.9375rem] ${on ? "text-white/75" : "text-white/50"}`}
                >
                  {p.title}
                </span>
              </button>
            );
          })}
        </motion.div>

        {/* ---- The selected plan ------------------------------------------
            Deliberately NOT inside a BrowserWindow. Everywhere else on this
            page the window DEPICTS a website; here it would have been chrome
            wrapped around ELEVATE's own real, readable, interactive copy —
            a card with a title bar, which is the one shape DESIGN.md bans and
            which made the object mean two different things on one page. It
            also put a second window on screen at the pricing seams. */}
        <motion.div {...rise(2)} className="mt-10 lg:mt-12">
          <div>
            <div
              id="plan-panel"
              role="tabpanel"
              aria-labelledby={`plan-tab-${active}`}
              className="relative overflow-hidden border-t border-white/10"
            >
              <motion.span
                key={`bar-${active}`}
                aria-hidden
                initial={reduced ? false : { scaleX: 0, opacity: 1 }}
                animate={{ scaleX: 1, opacity: 0 }}
                transition={{
                  scaleX: { duration: 0.6, ease: EASE },
                  opacity: { duration: 0.3, delay: 0.6 },
                }}
                className="absolute inset-x-0 top-0 z-10 block h-[2px] origin-left bg-primary"
              />
              <AnimatePresence mode="wait" initial={false}>
                <motion.div
                  key={active}
                  initial={reduced ? false : { clipPath: "inset(0 0 100% 0)" }}
                  animate={{ clipPath: "inset(0 0 0% 0)" }}
                  exit={reduced ? undefined : { opacity: 0, transition: { duration: 0.12 } }}
                  transition={{ duration: 0.6, ease: EASE }}
                  className="grid grid-cols-1 gap-10 py-10 sm:py-12 lg:grid-cols-[1.05fr_1fr] lg:gap-16 lg:py-14"
                >
                  <div>
                    <p className="label-micro text-primary">{plan.eyebrow}</p>
                    <h3 className="font-display mt-4 text-[clamp(1.6rem,1.1rem+1.5vw,2.4rem)] leading-[1.05] font-extrabold tracking-tight text-white">
                      {plan.title}
                    </h3>
                    <p className="mt-5 max-w-[34rem] text-base leading-relaxed text-white/70">
                      {plan.description}
                    </p>
                    <p className="label-micro mt-8 text-white/50">
                      {pages.pricingDetail.bestForTitle}
                    </p>
                    <p className="mt-2 max-w-[34rem] text-[0.9375rem] leading-relaxed text-white/75">
                      {plan.bestFor}
                    </p>

                    <div className="mt-9 flex flex-wrap items-end gap-x-8 gap-y-5 border-t border-white/10 pt-7">
                      <div>
                        <span className="label-micro block text-white/50">
                          {pages.pricingDetail.priceLabel}
                        </span>
                        <span className="font-display mt-2 block text-[clamp(1.9rem,1.2rem+2.4vw,3.25rem)] leading-none font-extrabold tracking-tight text-white tabular-nums">
                          {plan.price}
                        </span>
                      </div>
                      <div className="flex flex-wrap items-center gap-x-6 gap-y-3">
                        <Link to={plan.path} className="btn-primary">
                          {pages.pricingIndex.viewPricing}
                          <ArrowRight className="size-4" aria-hidden />
                        </Link>
                        <a
                          href="#builder"
                          className="inline-flex min-h-11 items-center text-sm font-medium text-white/75 underline-offset-8 transition-colors hover:text-white hover:underline"
                        >
                          {pages.pricingDetail.finalCtaBtn}
                        </a>
                      </div>
                    </div>
                    <p className="mt-5 max-w-[34rem] text-[0.9375rem] leading-relaxed text-white/50">
                      {plan.note}
                    </p>
                  </div>

                  <div>
                    <p className="label-micro text-white/50">{pages.servicesEshop.includedLabel}</p>
                    <ul className="mt-5 divide-y divide-white/8 border-y border-white/8">
                      {plan.included.map((item, i) => (
                        <motion.li
                          key={item}
                          initial={reduced ? false : { opacity: 0, x: 12 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ duration: 0.5, delay: 0.15 + i * 0.05, ease: EASE }}
                          className="flex items-start gap-4 py-4"
                        >
                          <span className="mt-0.5 flex size-5 shrink-0 items-center justify-center rounded-full bg-primary/15 text-primary">
                            <Check className="size-3" strokeWidth={3} aria-hidden />
                          </span>
                          <span className="text-[0.9375rem] leading-relaxed text-white/85">
                            {item}
                          </span>
                        </motion.li>
                      ))}
                    </ul>
                  </div>
                </motion.div>
              </AnimatePresence>
            </div>
          </div>
        </motion.div>

        {/* ---- Everything else is priced on request — said once, plainly --- */}
        <motion.div
          {...rise(3)}
          className="mt-10 flex flex-col gap-6 border-t border-white/10 pt-8 lg:flex-row lg:items-center lg:justify-between"
        >
          <p className="text-[0.9375rem] text-white/70">
            <Link
              to="/services/design"
              className="inline-flex min-h-11 items-center font-medium text-white underline-offset-8 transition-colors hover:text-[oklch(0.78_0.19_253)] hover:underline"
            >
              {t.services.items[3].title}
            </Link>
            <span className="text-white/45"> · </span>
            <span className="font-medium text-white tabular-nums">
              {pages.servicesDesign.finalPrice}
            </span>
          </p>
          <p className="flex flex-wrap items-center gap-x-4 gap-y-2 text-[0.9375rem] text-white/65">
            <span>
              <span className="text-white">{pages.pricingIndex.notSure}</span>{" "}
              {pages.pricingIndex.notSureTitle}
            </span>
            <a
              href="#builder"
              className="inline-flex min-h-11 items-center gap-2 font-medium text-[oklch(0.78_0.19_253)] underline-offset-8 hover:underline"
            >
              {pages.pricingIndex.notSureCta}
              <ArrowRight className="size-4" aria-hidden />
            </a>
          </p>
        </motion.div>
      </div>
    </section>
  );
}

export default PricingSection;
