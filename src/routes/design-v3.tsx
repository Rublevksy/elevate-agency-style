import { useEffect, useRef, useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { AnimatePresence, motion, useInView, useReducedMotion } from "framer-motion";
import { useT } from "@/lib/i18n";
import { Logo } from "@/components/Logo";
import { ExploreSwitcher } from "@/components/design-explore/ExploreSwitcher";

/**
 * /design-v3 — "Interactive product showcase" exploration direction.
 *
 * Thesis (ticket 04 / spec §V3): the interface IS the page content, not an
 * illustration next to text. One browser/device window dominates the first
 * screen; clicking or hovering a service tab replays the whole scene inside
 * the window (different mockup per service), not just a caption change.
 * Display typeface is Space Grotesk (own head() below) — deliberately not
 * Inter (V1) so the direction reads differently on sight.
 *
 * Self-contained: no imports from production sections (ServiceStage/Contact/
 * Nav/Footer) or from src/components/hero/** — the browser-chrome mockup
 * below is a fresh implementation, only inspired by ScreenMockup.tsx's
 * visual vocabulary (dots, stat chips, sparkline) as the spec instructs.
 */
export const Route = createFileRoute("/design-v3")({
  component: DesignV3Page,
  head: () => ({
    meta: [
      { title: "V3 — Interactive product showcase — ELEVATE" },
      { name: "robots", content: "noindex, nofollow" },
    ],
    links: [
      { rel: "preconnect", href: "https://fonts.googleapis.com" },
      { rel: "preconnect", href: "https://fonts.gstatic.com", crossOrigin: "anonymous" },
      {
        rel: "stylesheet",
        href: "https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@500;600;700&display=swap",
      },
    ],
  }),
});

const DISPLAY_FONT = '"Space Grotesk", "Inter", ui-sans-serif, system-ui, sans-serif';
const EASE = [0.22, 1, 0.36, 1] as const;
const AUTO_ADVANCE_MS = 5200;

function DesignV3Page() {
  const { t } = useT();
  const services = t.ui.serviceStage;
  const results = t.results.items;
  const reducedMotion = useReducedMotion();

  const [active, setActive] = useState(0);
  const [hovered, setHovered] = useState(false);
  const [interacted, setInteracted] = useState(false);

  useEffect(() => {
    if (hovered || interacted || reducedMotion) return;
    const id = window.setInterval(() => {
      setActive((i) => (i + 1) % services.length);
    }, AUTO_ADVANCE_MS);
    return () => window.clearInterval(id);
  }, [hovered, interacted, reducedMotion, services.length]);

  function selectService(index: number) {
    setActive(index);
    setInteracted(true);
  }

  const activeService = services[active];
  const Scene = SCENES[active % SCENES.length];

  return (
    <div className="min-h-screen bg-background text-foreground">
      <ExploreSwitcher active="design-v3" />

      {/* Hero + interactive showcase — one scene, not hero-then-separate-services */}
      <section className="relative overflow-hidden px-5 pb-20 pt-24 sm:px-8 md:pt-32">
        <div
          aria-hidden
          className="pointer-events-none absolute -top-40 right-0 h-[32rem] w-[32rem] rounded-full bg-primary/20 blur-3xl"
        />
        <div className="relative mx-auto max-w-[1400px]">
          <Logo className="mb-8 h-6 w-auto md:h-7" />

          <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
            <h1
              style={{ fontFamily: DISPLAY_FONT }}
              className="min-w-0 max-w-2xl text-3xl font-semibold leading-[1.08] tracking-tight sm:text-4xl md:text-5xl"
            >
              {t.hero.title1} <span className="text-primary">{t.hero.title2}</span>
            </h1>
            <p className="min-w-0 max-w-sm text-sm leading-relaxed text-muted-foreground md:text-base">
              {t.hero.tag}. {t.hero.subtitle}
            </p>
          </div>

          {/* Tabs — the interactive control surface. Native <button>s: Enter/Space
              already toggle onClick, Tab already moves focus — no custom key
              handling needed for keyboard support. */}
          <div
            role="tablist"
            aria-label={t.ui.homeServicesTitle}
            className="mt-10 flex flex-wrap gap-2 md:flex-nowrap md:overflow-x-auto"
          >
            {services.map((svc, index) => {
              const isActive = index === active;
              return (
                <motion.button
                  key={svc.title}
                  type="button"
                  role="tab"
                  id={`v3-tab-${index}`}
                  aria-controls={`v3-panel-${index}`}
                  aria-selected={isActive}
                  onClick={() => selectService(index)}
                  onMouseEnter={() => setHovered(true)}
                  onMouseLeave={() => setHovered(false)}
                  onFocus={() => setHovered(true)}
                  onBlur={() => setHovered(false)}
                  whileHover={reducedMotion ? undefined : { scale: 1.03 }}
                  whileTap={reducedMotion ? undefined : { scale: 0.98 }}
                  className={`relative shrink-0 whitespace-nowrap rounded-full px-4 py-2 text-xs font-medium tracking-tight transition-colors duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-background sm:text-sm ${
                    isActive
                      ? "text-primary-foreground"
                      : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  {isActive && (
                    <motion.span
                      layoutId="v3-active-tab"
                      className="absolute inset-0 rounded-full bg-primary"
                      transition={{ duration: reducedMotion ? 0 : 0.35, ease: EASE }}
                    />
                  )}
                  <span className="relative z-10">{svc.title}</span>
                </motion.button>
              );
            })}
          </div>

          {/* The window — dominant element of the first screen */}
          <div className="mt-8 md:mt-10">
            <BrowserChrome>
              <div
                role="tabpanel"
                id={`v3-panel-${active}`}
                aria-labelledby={`v3-tab-${active}`}
                tabIndex={-1}
                className="relative aspect-[4/3] w-full overflow-hidden sm:aspect-[16/10] md:aspect-[16/9]"
              >
                <AnimatePresence mode="wait" initial={false}>
                  <motion.div
                    key={active}
                    initial={{ opacity: 0, scale: reducedMotion ? 1 : 0.97 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: reducedMotion ? 1 : 1.02 }}
                    transition={{ duration: reducedMotion ? 0 : 0.4, ease: EASE }}
                    className="absolute inset-0"
                  >
                    <Scene
                      title={activeService.title}
                      tag={activeService.tag}
                      results={results}
                      ctaLabel={t.hero.cta1}
                    />
                  </motion.div>
                </AnimatePresence>
              </div>
            </BrowserChrome>
          </div>
        </div>
      </section>

      {/* Proof block — a second window-styled readout, not an icon-card grid */}
      <ProofSection results={results} title={t.results.title} reducedMotion={!!reducedMotion} />

      {/* CTA */}
      <section className="border-t border-border px-5 py-20 sm:px-8 md:py-28">
        <div className="mx-auto flex max-w-[1400px] flex-col gap-8 md:flex-row md:items-center md:justify-between">
          <div className="max-w-lg">
            <h2
              style={{ fontFamily: DISPLAY_FONT }}
              className="text-2xl font-semibold tracking-tight sm:text-3xl"
            >
              {t.cta.title}
            </h2>
            <p className="mt-3 text-sm text-muted-foreground md:text-base">{t.cta.subtitle}</p>
          </div>
          <Link
            to="/contact"
            className="inline-flex w-fit items-center gap-2 rounded-full bg-primary px-6 py-3.5 text-sm font-semibold text-primary-foreground transition-transform duration-200 hover:scale-[1.02] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-background"
          >
            {t.cta.btn}
          </Link>
        </div>
      </section>
    </div>
  );
}

/* ---------------------------------------------------------------------- */
/* Browser chrome — the shared "window" material for both the showcase    */
/* and the proof readout, so the whole page reads as one interactive      */
/* product with several modes, not a hero plus unrelated sections.        */
/* ---------------------------------------------------------------------- */

function BrowserChrome({ children }: { children: React.ReactNode }) {
  return (
    <div className="shadow-ambient relative w-full overflow-hidden rounded-2xl border border-border bg-surface/60">
      <div className="flex items-center gap-2 border-b border-border bg-background/40 px-4 py-2.5 sm:px-5">
        <span className="h-2 w-2 rounded-full bg-foreground/15" />
        <span className="h-2 w-2 rounded-full bg-foreground/15" />
        <span className="h-2 w-2 rounded-full bg-foreground/15" />
        <div className="ml-3 h-1.5 max-w-[10rem] flex-1 rounded-full bg-foreground/8" />
      </div>
      {children}
    </div>
  );
}

type SceneProps = {
  title: string;
  tag: string;
  results: readonly { n: string; l: string }[];
  ctaLabel: string;
};

/* 00 — Web: browser-in-window hero block with a real CTA pill */
function WebScene({ title, tag, ctaLabel }: SceneProps) {
  return (
    <div className="flex h-full flex-col justify-center gap-4 px-6 py-8 sm:px-10 md:px-14">
      <p
        style={{ fontFamily: DISPLAY_FONT }}
        className="max-w-md text-xl font-semibold leading-tight sm:text-2xl md:text-3xl"
      >
        {title}
      </p>
      <p className="max-w-sm text-xs text-muted-foreground sm:text-sm">{tag}</p>
      <div className="mt-2 inline-flex w-fit items-center rounded-full bg-primary px-4 py-2 text-xs font-semibold text-primary-foreground shadow-[0_0_24px_oklch(0.65_0.18_255/0.45)] sm:text-sm">
        {ctaLabel}
      </div>
      <div className="mt-4 grid max-w-md grid-cols-3 gap-2">
        <div className="h-10 rounded-lg bg-gradient-to-br from-primary/50 to-primary/10 sm:h-14" />
        <div className="h-10 rounded-lg bg-foreground/8 sm:h-14" />
        <div className="h-10 rounded-lg bg-gradient-to-br from-primary/25 to-transparent sm:h-14" />
      </div>
    </div>
  );
}

/* 01 — SEO: growth line + real result numbers, doubling as a preview of the proof language */
function SeoScene({ title, tag, results }: SceneProps) {
  return (
    <div className="flex h-full flex-col justify-center gap-4 px-6 py-8 sm:px-10 md:px-14">
      <p
        style={{ fontFamily: DISPLAY_FONT }}
        className="max-w-md text-xl font-semibold leading-tight sm:text-2xl md:text-3xl"
      >
        {title}
      </p>
      <p className="max-w-sm text-xs text-muted-foreground sm:text-sm">{tag}</p>
      <div className="mt-4 flex flex-wrap items-end gap-6">
        {results.slice(0, 3).map((r) => (
          <div key={r.l} className="flex flex-col gap-1">
            <span className="text-lg font-bold text-primary sm:text-xl">{r.n}</span>
            <span className="text-[10px] uppercase tracking-wide text-muted-foreground sm:text-xs">
              {r.l}
            </span>
          </div>
        ))}
        <svg viewBox="0 0 120 40" className="h-10 w-28 opacity-90 sm:h-12 sm:w-36" aria-hidden>
          <polyline
            points="0,34 20,28 40,22 60,24 80,10 100,6 120,2"
            fill="none"
            stroke="var(--primary-glow-strong)"
            strokeWidth={2}
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </div>
    </div>
  );
}

/* 02 — E-shop: product grid, no fabricated numbers */
function EshopScene({ title, tag }: SceneProps) {
  return (
    <div className="flex h-full flex-col justify-center gap-4 px-6 py-8 sm:px-10 md:px-14">
      <p
        style={{ fontFamily: DISPLAY_FONT }}
        className="max-w-md text-xl font-semibold leading-tight sm:text-2xl md:text-3xl"
      >
        {title}
      </p>
      <p className="max-w-sm text-xs text-muted-foreground sm:text-sm">{tag}</p>
      <div className="mt-3 grid max-w-md grid-cols-4 gap-2">
        {[0, 1, 2, 3].map((i) => (
          <div
            key={i}
            className="flex flex-col overflow-hidden rounded-lg border border-border bg-background/60"
          >
            <div className="relative aspect-square bg-gradient-to-br from-primary/45 via-primary/15 to-transparent">
              {i === 0 && (
                <span className="absolute right-1 top-1 h-1.5 w-1.5 rounded-full bg-primary" />
              )}
            </div>
            <div className="space-y-1 p-1.5">
              <div className="h-1 w-3/4 rounded-full bg-foreground/20" />
              <div className="h-1 w-1/2 rounded-full bg-primary/70" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

/* 03 — Branding: mark + palette + type sample */
function BrandScene({ title, tag }: SceneProps) {
  return (
    <div className="flex h-full flex-col justify-center gap-4 px-6 py-8 sm:px-10 md:px-14">
      <p
        style={{ fontFamily: DISPLAY_FONT }}
        className="max-w-md text-xl font-semibold leading-tight sm:text-2xl md:text-3xl"
      >
        {title}
      </p>
      <p className="max-w-sm text-xs text-muted-foreground sm:text-sm">{tag}</p>
      <div className="mt-3 flex max-w-md items-center gap-3">
        <div
          style={{ fontFamily: DISPLAY_FONT }}
          className="grid h-14 w-14 shrink-0 place-items-center rounded-xl border border-border bg-background/60 text-xl font-bold tracking-tighter sm:h-16 sm:w-16 sm:text-2xl"
        >
          E<span className="text-primary">.</span>
        </div>
        <div className="flex gap-1.5">
          <span className="h-8 w-8 rounded-lg bg-primary shadow-[0_0_16px_oklch(0.65_0.18_255/0.45)] sm:h-9 sm:w-9" />
          <span className="h-8 w-8 rounded-lg bg-foreground/70 sm:h-9 sm:w-9" />
          <span className="h-8 w-8 rounded-lg bg-primary/25 sm:h-9 sm:w-9" />
          <span className="h-8 w-8 rounded-lg border border-border sm:h-9 sm:w-9" />
        </div>
      </div>
    </div>
  );
}

/* 04 — App: phone-in-window inset */
function AppScene({ title, tag }: SceneProps) {
  return (
    <div className="flex h-full items-center justify-center gap-6 px-6 py-6 sm:justify-start sm:px-10 md:px-14">
      <div className="max-w-xs sm:max-w-sm">
        <p
          style={{ fontFamily: DISPLAY_FONT }}
          className="text-xl font-semibold leading-tight sm:text-2xl md:text-3xl"
        >
          {title}
        </p>
        <p className="mt-2 text-xs text-muted-foreground sm:text-sm">{tag}</p>
      </div>
      <div className="h-full max-h-52 w-24 shrink-0 rounded-[1.4rem] border-2 border-border bg-background/70 p-1.5 shadow-[0_0_28px_oklch(0.65_0.18_255/0.25)] sm:max-h-64 sm:w-32">
        <div className="flex h-full flex-col overflow-hidden rounded-[1rem] border border-border/70 bg-surface/60">
          <div className="mx-auto mt-1.5 h-1 w-6 rounded-full bg-foreground/20" />
          <div className="space-y-1.5 p-2">
            <div className="h-1.5 w-1/2 rounded-full bg-foreground/30" />
            <div className="h-6 rounded-md bg-gradient-to-br from-primary/50 to-primary/10 sm:h-8" />
            <div className="h-1 w-2/3 rounded-full bg-foreground/15" />
          </div>
          <div className="mt-auto flex items-center justify-around border-t border-border/70 py-1.5">
            <span className="h-1.5 w-1.5 rounded-full bg-primary" />
            <span className="h-1.5 w-1.5 rounded-full bg-foreground/20" />
            <span className="h-1.5 w-1.5 rounded-full bg-foreground/20" />
          </div>
        </div>
      </div>
    </div>
  );
}

const SCENES = [WebScene, SeoScene, EshopScene, BrandScene, AppScene];

/* ---------------------------------------------------------------------- */
/* Proof section — same window material, live count-up + sparkline,      */
/* no icon+heading+text cards.                                            */
/* ---------------------------------------------------------------------- */

function ProofSection({
  results,
  title,
  reducedMotion,
}: {
  results: readonly { n: string; l: string }[];
  title: string;
  reducedMotion: boolean;
}) {
  const ref = useRef<HTMLDivElement | null>(null);
  const inView = useInView(ref, { once: true, margin: "-10% 0px" });

  return (
    <section className="px-5 pb-20 sm:px-8 md:pb-28">
      <div className="mx-auto max-w-[1400px]">
        <h2
          style={{ fontFamily: DISPLAY_FONT }}
          className="mb-6 text-xl font-semibold tracking-tight sm:text-2xl"
        >
          {title}
        </h2>
        <BrowserChrome>
          <div
            ref={ref}
            className="grid grid-cols-2 gap-6 px-6 py-8 sm:px-10 md:grid-cols-4 md:py-10"
          >
            {results.map((r, i) => (
              <StatReadout
                key={r.l}
                n={r.n}
                l={r.l}
                active={inView}
                reducedMotion={reducedMotion}
                delay={i * 0.08}
              />
            ))}
          </div>
          <div className="border-t border-border px-6 pb-6 sm:px-10">
            <svg viewBox="0 0 300 60" className="h-10 w-full opacity-80 sm:h-14" aria-hidden>
              <polyline
                points="0,52 40,46 80,38 120,40 160,22 200,26 240,10 300,4"
                fill="none"
                stroke="var(--primary-glow-strong)"
                strokeWidth={2}
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </div>
        </BrowserChrome>
      </div>
    </section>
  );
}

function StatReadout({
  n,
  l,
  active,
  reducedMotion,
  delay,
}: {
  n: string;
  l: string;
  active: boolean;
  reducedMotion: boolean;
  delay: number;
}) {
  const match = n.match(/\d+/);
  const target = match ? parseInt(match[0], 10) : null;
  const prefix = match ? n.slice(0, match.index) : "";
  const suffix = match ? n.slice((match.index ?? 0) + match[0].length) : "";
  const [display, setDisplay] = useState(target === null || reducedMotion ? (target ?? 0) : 0);

  useEffect(() => {
    if (!active || target === null || reducedMotion) {
      if (target !== null) setDisplay(target);
      return;
    }
    let raf: number;
    const duration = 900;
    const start = performance.now() + delay * 1000;
    const tick = (now: number) => {
      const elapsed = now - start;
      if (elapsed < 0) {
        raf = requestAnimationFrame(tick);
        return;
      }
      const progress = Math.min(1, elapsed / duration);
      setDisplay(Math.round(target * progress));
      if (progress < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [active, target, reducedMotion, delay]);

  return (
    <div className="flex flex-col gap-1">
      <span
        style={{ fontFamily: DISPLAY_FONT }}
        className="text-2xl font-bold text-primary sm:text-3xl"
      >
        {target === null ? n : `${prefix}${display}${suffix}`}
      </span>
      <span className="text-[11px] leading-snug text-muted-foreground sm:text-xs">{l}</span>
    </div>
  );
}
