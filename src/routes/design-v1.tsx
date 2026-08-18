import { useEffect, useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { useT } from "@/lib/i18n";
import { DeviceHero } from "@/components/hero/DeviceHero";
import { ScreenMockup } from "@/components/hero/ScreenMockup";
import { ExploreSwitcher } from "@/components/design-explore/ExploreSwitcher";

/**
 * /design-v1 — "Reference-led premium studio". Direct continuation of the
 * already-approved production visual system, not a new one: reuses
 * `DeviceHero`/`useHeroScroll` as-is for the hero (per ticket 02 — the one
 * V-route allowed this reuse), then builds its own simplified service/proof/
 * CTA sections on the same principles (device screen mockup, quiet numbers,
 * restrained blue accent). Self-contained — does not import ServiceStage,
 * Contact, Nav or Footer.
 */
export const Route = createFileRoute("/design-v1")({
  component: DesignV1Page,
  head: () => ({
    meta: [
      { title: "V1 — Reference-led premium studio — ELEVATE design exploration" },
      { name: "robots", content: "noindex, nofollow" },
    ],
  }),
});

const EASE = [0.22, 1, 0.36, 1] as const;
const FOCUS_RING =
  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-background";

function DesignV1Page() {
  const { lang } = useT();

  return (
    <div className="min-h-screen bg-background text-foreground">
      <ExploreSwitcher active="design-v1" />

      <HeroWithHeadline lang={lang} />
      <ServiceShowcase />
      <ProofStrip />
      <ClosingCta />
    </div>
  );
}

/**
 * Hero = the real `DeviceHero` scroll scene, unmodified, with the reference
 * kicker + white headline + one blue accent line overlaid at the top of the
 * initial viewport — the textual half of the two clean references this
 * direction is literally built from. Overlay is absolute (not sticky) on
 * purpose: it belongs to the resting/opening moment, the device itself keeps
 * owning the scroll-driven transform underneath.
 */
function HeroWithHeadline({ lang }: { lang: Parameters<typeof DeviceHero>[0]["lang"] }) {
  const { t } = useT();
  const reducedMotion = useReducedMotion();

  return (
    <div className="relative">
      <div className="hidden md:block">
        <DeviceHero variant="macbook" lang={lang} />
      </div>
      <div className="md:hidden">
        <DeviceHero variant="iphone" lang={lang} />
      </div>

      <div className="pointer-events-none absolute inset-x-0 top-0 z-20 flex flex-col items-center px-6 pt-24 text-center md:pt-20">
        <motion.div
          initial={reducedMotion ? undefined : { opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: EASE }}
          className="inline-flex min-w-0 max-w-full items-center gap-2 rounded-full border border-border px-2.5 py-1 text-[11px] uppercase tracking-[0.15em] text-muted-foreground sm:px-3 sm:tracking-[0.3em]"
        >
          <span aria-hidden className="h-1.5 w-1.5 shrink-0 rounded-full bg-primary" />
          <span className="min-w-0 whitespace-normal">{t.hero.tag}</span>
        </motion.div>

        <motion.h1
          initial={reducedMotion ? undefined : { opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.1, ease: EASE }}
          className="heading-display mt-5 min-w-0 max-w-3xl text-balance text-foreground"
        >
          {t.hero.title1} <span className="text-primary">{t.hero.title2}</span>
        </motion.h1>

        <motion.p
          initial={reducedMotion ? undefined : { opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2, ease: EASE }}
          className="mt-4 min-w-0 max-w-md text-sm text-muted-foreground md:text-base"
        >
          {t.hero.subtitle}
        </motion.p>

        <motion.div
          initial={reducedMotion ? undefined : { opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.3, ease: EASE }}
          className="pointer-events-auto mt-8 flex w-full flex-wrap justify-center gap-4"
        >
          <Link to="/contact" className={`btn-primary group ${FOCUS_RING}`}>
            {t.hero.cta1}
            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
          </Link>
          <Link to="/projects" className={`btn-outline ${FOCUS_RING}`}>
            {t.hero.cta2}
          </Link>
        </motion.div>
      </div>
    </div>
  );
}

const AUTO_ADVANCE_MS = 5200;

/**
 * Own, simplified take on ServiceStage's composition idea (device screen +
 * synced list, not icon+heading+text cards) — reuses the hero's real
 * `ScreenMockup` device content instead of reinventing a card grid.
 * Auto-advances, pauses on hover/focus/after first click, gated by
 * `prefers-reduced-motion` — same UX contract as the production section,
 * independently implemented.
 */
function ServiceShowcase() {
  const { t } = useT();
  const items = t.ui.serviceStage;
  const reducedMotion = useReducedMotion();
  const [active, setActive] = useState(0);
  const [paused, setPaused] = useState(false);

  useEffect(() => {
    if (paused || reducedMotion) return;
    const id = window.setInterval(() => {
      setActive((i) => (i + 1) % items.length);
    }, AUTO_ADVANCE_MS);
    return () => window.clearInterval(id);
  }, [paused, reducedMotion, items.length]);

  return (
    <section
      className="border-t border-border py-24 md:py-32"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      <div className="container-luxe">
        <p className="mb-10 text-xs uppercase tracking-[0.3em] text-primary md:mb-14">
          {t.ui.homeServicesEyebrow}
        </p>

        <div className="grid grid-cols-1 items-center gap-10 md:grid-cols-[minmax(0,280px)_1fr] md:gap-16">
          <div role="tablist" aria-label={t.ui.homeServicesTitle} className="flex flex-col gap-1">
            {items.map((item, i) => {
              const isActive = i === active;
              return (
                <button
                  key={item.title}
                  type="button"
                  role="tab"
                  id={`v1-service-tab-${i}`}
                  aria-controls={`v1-service-panel-${i}`}
                  aria-selected={isActive}
                  onClick={() => {
                    setActive(i);
                    setPaused(true);
                  }}
                  onFocus={() => setPaused(true)}
                  onBlur={() => setPaused(false)}
                  className={`flex items-center gap-3 rounded-lg px-4 py-3 text-left transition-colors duration-300 ${FOCUS_RING} ${
                    isActive
                      ? "bg-surface text-foreground"
                      : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  <span
                    className={`grid h-7 w-7 shrink-0 place-items-center rounded-full border font-mono text-[11px] transition-colors duration-300 ${
                      isActive
                        ? "border-primary bg-primary text-primary-foreground"
                        : "border-border text-muted-foreground"
                    }`}
                  >
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <span className="text-sm font-semibold md:text-base">{item.title}</span>
                </button>
              );
            })}
          </div>

          <div
            role="tabpanel"
            id={`v1-service-panel-${active}`}
            aria-labelledby={`v1-service-tab-${active}`}
            className="shadow-contact relative aspect-[16/10] w-full overflow-hidden rounded-[20px] border border-white/10 bg-gradient-to-b from-[oklch(0.24_0.02_260)] to-[oklch(0.14_0.02_260)] p-[3%]"
          >
            <div className="relative h-full w-full overflow-hidden rounded-[12px] bg-[oklch(0.10_0.015_260)]">
              <div
                aria-hidden
                className="pointer-events-none absolute inset-0"
                style={{
                  backgroundImage:
                    "radial-gradient(circle at 50% 20%, oklch(0.65 0.18 255 / 0.25), transparent 65%)",
                }}
              />
              <AnimatePresence mode="wait">
                <motion.div
                  key={active}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: reducedMotion ? 0 : 0.4, ease: EASE }}
                  className="absolute inset-0"
                >
                  <ScreenMockup
                    index={active + 1}
                    title={items[active].title}
                    tag={items[active].tag}
                  />
                </motion.div>
              </AnimatePresence>
              <div
                aria-hidden
                className="pointer-events-none absolute inset-0 rounded-[12px] shadow-[inset_0_0_0_1px_oklch(1_0_0_/_0.06),inset_0_1px_20px_oklch(0.65_0.18_255_/_0.12)]"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

/**
 * `t.trust`/`t.results` numbers read as one quiet flowing line, not
 * icon+heading+text cards or a hero-metric grid.
 */
function ProofStrip() {
  const { t } = useT();
  const items = t.results.items;

  return (
    <section className="border-t border-border py-20 md:py-28">
      <div className="container-luxe">
        <p className="max-w-3xl text-lg leading-relaxed text-muted-foreground md:text-xl">
          {items.map((item, i) => (
            <span key={item.l}>
              <span className="font-semibold text-primary">{item.n}</span> {item.l}
              {i < items.length - 1 ? " · " : ""}
            </span>
          ))}
        </p>
        <p className="mt-6 text-sm uppercase tracking-[0.25em] text-primary">{t.trust.response}</p>
      </div>
    </section>
  );
}

function ClosingCta() {
  const { t } = useT();

  return (
    <section className="border-t border-border py-24 md:py-32">
      <div className="container-luxe">
        <div className="shadow-ambient relative overflow-hidden rounded-2xl border border-border bg-surface p-10 text-center md:p-20">
          <div
            aria-hidden
            className="pointer-events-none absolute -top-32 left-1/2 h-72 w-72 -translate-x-1/2 rounded-full bg-primary/20 blur-[140px]"
          />
          <div
            aria-hidden
            className="pointer-events-none absolute inset-0 grid-bg opacity-20 [mask-image:radial-gradient(ellipse_at_center,black_30%,transparent_70%)]"
          />
          <div className="relative">
            <h2 className="heading-display-sm text-foreground">{t.cta.title}</h2>
            <p className="mx-auto mt-5 max-w-xl text-base text-muted-foreground md:text-lg">
              {t.cta.subtitle}
            </p>
            <Link
              to="/contact"
              className={`btn-primary group mx-auto mt-10 inline-flex ${FOCUS_RING}`}
            >
              {t.hero.cta1}
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
