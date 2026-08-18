import { useEffect, useRef, useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { motion, useInView, useReducedMotion } from "framer-motion";
import {
  ArrowRight,
  Gauge,
  MessagesSquare,
  Palette,
  Search,
  ShieldCheck,
  Smartphone,
  Sparkles,
  Target,
  TrendingUp,
  Users,
  Zap,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { useT } from "@/lib/i18n";
import { RefImage } from "@/components/design-explore/RefImage";
import type { RefName } from "@/components/design-explore/RefImage";
import { ExploreSwitcher } from "@/components/design-explore/ExploreSwitcher";

/**
 * /design-v1 — "Reference-led premium studio".
 *
 * The literal translation of two approved references into a working site:
 * `01_HOME_DESKTOP_HERO` (photo device right / living text left / drawn light
 * arc) and `01_HOME_DESKTOP_SCROLL_SERVICES_SHOWCASE` (numbered rail left /
 * staircase cascade of five mascot cards right, joined by drawn arrows).
 * Accuracy to those two pictures is the value of this direction — nothing here
 * invents its own composition.
 *
 * Every device and every mascot scene is a real photo through <RefImage>; CSS
 * only ever draws typography and interface *on top* of the photo, never an
 * imitation *of* one. All copy comes from useT().
 *
 * Self-contained: no ServiceStage / Contact / Nav / Footer / DeviceHero import.
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

/** Latin word row of the hero reference — a visual mark, not a business claim. */
const HERO_WORDS = ["DESIGN", "VÝKON", "STRATEGIE", "VÝSLEDKY"] as const;

/** Order mirrors t.ui.serviceStage: Weby, SEO, E-shopy, Značka, Aplikace. */
const SERVICE_SCENES: readonly RefName[] = [
  "svc-web",
  "svc-seo",
  "svc-eshop",
  "svc-branding",
  "svc-app",
];

const SERVICE_ROUTES = [
  "/services/web",
  "/audit",
  "/services/eshop",
  "/services",
  "/contact",
] as const;

/** Three icons per card, so the mini-feature row is never five identical rows. */
const SERVICE_ICONS: readonly (readonly [LucideIcon, LucideIcon, LucideIcon])[] = [
  [Gauge, Zap, Users],
  [Search, TrendingUp, Target],
  [TrendingUp, ShieldCheck, Sparkles],
  [Palette, Sparkles, MessagesSquare],
  [Smartphone, Gauge, ShieldCheck],
];

/** Staircase offsets of the cascade, read off the showcase reference. */
const CASCADE_STEP = ["lg:ml-0", "lg:ml-10", "lg:ml-20", "lg:ml-10", "lg:ml-0"] as const;

function DesignV1Page() {
  return (
    <div className="min-h-screen overflow-x-clip bg-background text-foreground">
      <ExploreSwitcher active="design-v1" />
      <HeroReference />
      <ServiceCascade />
      <ProofBlock />
      <ClosingCta />
    </div>
  );
}

/* ------------------------------------------------------------------ hero */

/**
 * The light arc of the reference exists twice: baked into the photograph, and
 * again as this SVG stroke drawn on top — brighter, sharper and animated. The
 * drawn one is what makes the still picture read as alive on load.
 */
function LightArc({ className, variant }: { className?: string; variant: "desktop" | "mobile" }) {
  const reduced = useReducedMotion();
  const d =
    variant === "desktop" ? "M 12 248 C 96 60, 300 -6, 588 118" : "M 8 232 C 70 70, 190 4, 292 96";

  return (
    <svg
      viewBox={variant === "desktop" ? "0 0 600 260" : "0 0 300 240"}
      fill="none"
      aria-hidden="true"
      className={className}
      preserveAspectRatio="none"
    >
      <defs>
        <linearGradient id={`arc-${variant}`} x1="0" y1="1" x2="1" y2="0">
          <stop offset="0%" stopColor="var(--primary)" stopOpacity="0" />
          <stop offset="45%" stopColor="var(--primary-glow-strong)" stopOpacity="0.9" />
          <stop offset="100%" stopColor="white" stopOpacity="0.95" />
        </linearGradient>
      </defs>
      <motion.path
        d={d}
        stroke={`url(#arc-${variant})`}
        strokeWidth={2.5}
        strokeLinecap="round"
        style={{ filter: "drop-shadow(0 0 12px var(--primary-glow))" }}
        initial={reduced ? { pathLength: 1, opacity: 1 } : { pathLength: 0, opacity: 0 }}
        animate={{ pathLength: 1, opacity: 1 }}
        transition={{ duration: reduced ? 0 : 2.1, ease: EASE, delay: reduced ? 0 : 0.35 }}
      />
    </svg>
  );
}

/** Vertical SCROLL label with a dot falling down the line, as in the reference. */
function ScrollCue({ label }: { label: string }) {
  const reduced = useReducedMotion();
  return (
    <div className="flex items-center gap-4 lg:flex-col lg:items-start lg:gap-3">
      <span
        className="text-[0.6rem] font-medium tracking-[0.4em] text-muted-foreground lg:[writing-mode:vertical-rl]"
        aria-hidden="true"
      >
        {label}
      </span>
      <div className="relative h-px w-24 overflow-hidden bg-border lg:h-24 lg:w-px">
        {!reduced && (
          <motion.span
            className="absolute left-0 top-0 h-full w-2 rounded-full bg-primary lg:h-2 lg:w-full"
            style={{ boxShadow: "0 0 10px var(--primary-glow-strong)" }}
            animate={{ x: ["-10%", "560%"], y: ["-10%", "560%"] }}
            transition={{ duration: 2.4, ease: "easeInOut", repeat: Infinity, repeatDelay: 0.5 }}
          />
        )}
      </div>
    </div>
  );
}

function HeroReference() {
  const { t } = useT();
  const reduced = useReducedMotion();

  const rise = (delay: number) => ({
    initial: reduced ? { opacity: 1, y: 0 } : { opacity: 0, y: 26 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: reduced ? 0 : 0.9, ease: EASE, delay: reduced ? 0 : delay },
  });

  return (
    <section className="relative isolate overflow-hidden">
      {/* photographic stage light — the images carry their own black, this only
          keeps their edges from ending in a visible seam */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 -z-10"
        style={{
          background:
            "radial-gradient(75% 60% at 78% 35%, color-mix(in oklch, var(--primary) 14%, transparent), transparent 70%)",
        }}
      />

      <div className="mx-auto grid max-w-[1500px] grid-cols-1 items-center gap-10 px-5 pb-16 pt-28 sm:px-8 lg:min-h-screen lg:grid-cols-[minmax(0,0.95fr)_minmax(0,1.15fr)] lg:gap-6 lg:px-12 lg:pb-0 lg:pt-0">
        {/* ---------- living text column ---------- */}
        <div className="relative z-10 max-w-xl lg:py-24">
          <motion.p {...rise(0.05)} className="flex items-center gap-4">
            <span className="hidden h-px w-10 bg-foreground/60 lg:block" aria-hidden="true" />
            <span
              className="inline-block size-1.5 rounded-full bg-primary lg:hidden"
              aria-hidden="true"
            />
            <span className="text-[0.65rem] font-medium uppercase tracking-[0.32em] text-muted-foreground sm:text-xs">
              {t.hero.tag}
            </span>
          </motion.p>

          <motion.h1
            {...rise(0.15)}
            className="mt-6 text-[clamp(2rem,0.6rem_+_6.2vw,4.6rem)] font-extrabold uppercase leading-[0.95] tracking-[-0.025em] lg:mt-8"
          >
            <span className="block">{t.hero.title1}</span>
            <span className="mt-1 block text-primary">{t.hero.title2}</span>
          </motion.h1>

          <motion.p
            {...rise(0.28)}
            className="mt-7 max-w-md text-sm leading-relaxed text-muted-foreground sm:text-base"
          >
            {t.hero.subtitle}
          </motion.p>

          <motion.ul
            {...rise(0.4)}
            className="mt-8 flex flex-wrap items-center gap-x-3 gap-y-2 text-[0.6rem] font-medium uppercase tracking-[0.3em] text-muted-foreground sm:text-[0.68rem]"
          >
            {HERO_WORDS.map((w, i) => (
              <li key={w} className="flex items-center gap-3">
                {i > 0 && <span className="size-1 rounded-full bg-primary" aria-hidden="true" />}
                <span>{w}</span>
              </li>
            ))}
          </motion.ul>

          <motion.div {...rise(0.5)} className="mt-10 flex flex-wrap items-center gap-4">
            <Link
              to="/contact"
              className={`hover-lift inline-flex items-center gap-2 rounded-full bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground ${FOCUS_RING}`}
            >
              {t.hero.cta1}
              <ArrowRight className="size-4" aria-hidden="true" />
            </Link>
          </motion.div>

          <motion.div {...rise(0.65)} className="mt-12 hidden lg:block">
            <ScrollCue label="SCROLL" />
          </motion.div>
        </div>

        {/* ---------- desktop: MacBook photograph + drawn arc ---------- */}
        <div className="relative hidden lg:block">
          <RefImage
            name="hero-macbook"
            priority
            sizes="(min-width: 1024px) 55vw, 100vw"
            alt={t.hero.title1}
            className="block"
            imgClassName="h-auto w-full select-none"
          />
          <LightArc
            variant="desktop"
            className="pointer-events-none absolute right-[3%] top-[1%] h-[26%] w-[54%]"
          />
          {/* soften the crop edges into the page instead of cutting them */}
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-0"
            style={{
              background:
                "linear-gradient(90deg, var(--background) 0%, color-mix(in oklch, var(--background) 55%, transparent) 12%, transparent 34%), linear-gradient(0deg, var(--background) 0%, transparent 26%), linear-gradient(270deg, var(--background) 0%, transparent 14%), linear-gradient(180deg, var(--background) 0%, transparent 22%)",
            }}
          />
        </div>

        {/* ---------- mobile: own layout, iPhone photograph below the text ---------- */}
        <div className="relative lg:hidden">
          <RefImage
            name="hero-iphone"
            priority
            sizes="100vw"
            alt={t.hero.title2}
            className="block"
            imgClassName="mx-auto h-auto w-[86%] max-w-sm select-none"
          />
          <LightArc
            variant="mobile"
            className="pointer-events-none absolute right-[4%] top-[2%] h-[26%] w-[52%]"
          />
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-0"
            style={{
              background:
                "linear-gradient(0deg, var(--background) 0%, transparent 26%), linear-gradient(90deg, var(--background) 0%, transparent 12%), linear-gradient(270deg, var(--background) 0%, transparent 12%), linear-gradient(180deg, var(--background) 0%, transparent 10%)",
            }}
          />
          <div className="mt-4 hidden justify-center">
            <ScrollCue label="SCROLL" />
          </div>
        </div>
      </div>
    </section>
  );
}

/* -------------------------------------------------------------- services */

/** Curved connector drawn from the previous card to the next, as in the reference. */
function CascadeArrow({ active }: { active: boolean }) {
  const reduced = useReducedMotion();
  return (
    <svg
      viewBox="0 0 120 120"
      fill="none"
      aria-hidden="true"
      className="pointer-events-none absolute -top-14 left-4 h-28 w-28 sm:left-10"
    >
      <motion.path
        d="M 12 4 C 12 62, 40 74, 96 92"
        stroke="var(--primary)"
        strokeWidth={2}
        strokeLinecap="round"
        initial={reduced ? { pathLength: 1 } : { pathLength: 0 }}
        animate={{ pathLength: active || reduced ? 1 : 0 }}
        transition={{ duration: reduced ? 0 : 0.8, ease: EASE }}
        style={{ filter: "drop-shadow(0 0 6px var(--primary-glow))" }}
      />
      <motion.path
        d="M 84 78 L 98 93 L 80 98"
        stroke="var(--primary)"
        strokeWidth={2}
        strokeLinecap="round"
        strokeLinejoin="round"
        initial={reduced ? { opacity: 1 } : { opacity: 0 }}
        animate={{ opacity: active || reduced ? 1 : 0 }}
        transition={{ duration: 0.3, ease: EASE, delay: reduced ? 0 : 0.7 }}
      />
    </svg>
  );
}

interface CascadeCardProps {
  index: number;
  onActive: (index: number) => void;
}

function CascadeCard({ index, onActive }: CascadeCardProps) {
  const { t } = useT();
  const reduced = useReducedMotion();
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { amount: 0.4, margin: "-20% 0px -30% 0px" });

  // Rail sync lives in an effect, not in render: onActive updates a sibling
  // component's state and React forbids that during another component's render.
  useEffect(() => {
    if (inView) onActive(index);
  }, [inView, index, onActive]);

  const service = t.ui.serviceStage[index];
  const icons = SERVICE_ICONS[index];
  const why = t.why.items;
  const features = [
    why[index % why.length],
    why[(index + 1) % why.length],
    why[(index + 2) % why.length],
  ];

  return (
    <div ref={ref} className={`relative ${CASCADE_STEP[index]}`}>
      {index > 0 && <CascadeArrow active={inView} />}

      <motion.article
        initial={reduced ? { opacity: 1, y: 0 } : { opacity: 0, y: 56 }}
        animate={inView || reduced ? { opacity: 1, y: 0 } : { opacity: 0, y: 56 }}
        transition={{ duration: reduced ? 0 : 0.8, ease: EASE, delay: reduced ? 0 : 0.1 }}
        className="shadow-ambient relative overflow-hidden rounded-2xl border border-border bg-surface/50 sm:rounded-3xl"
      >
        <div className="grid grid-cols-1 sm:grid-cols-[minmax(0,1fr)_minmax(0,0.85fr)]">
          {/* living DOM layer */}
          <div className="relative z-10 flex flex-col justify-center p-6 sm:p-8 lg:p-10">
            <span className="text-[0.6rem] font-medium uppercase tracking-[0.32em] text-primary">
              {String(index + 1).padStart(2, "0")}
            </span>
            <h3 className="mt-4 text-[clamp(1.5rem,0.9rem_+_1.3vw,2.2rem)] font-extrabold leading-tight tracking-[-0.02em]">
              {service.title}
            </h3>
            <p className="mt-3 max-w-sm text-sm leading-relaxed text-muted-foreground">
              {service.tag}
            </p>

            <Link
              to={SERVICE_ROUTES[index]}
              className={`hover-lift mt-6 inline-flex w-fit items-center gap-2 rounded-full bg-primary px-5 py-2.5 text-xs font-semibold text-primary-foreground sm:text-sm ${FOCUS_RING}`}
            >
              {t.services.learnMore}
              <ArrowRight className="size-4" aria-hidden="true" />
            </Link>

            <ul className="mt-8 flex flex-wrap gap-x-5 gap-y-3 border-t border-border pt-5">
              {features.map((f, i) => {
                const Icon = icons[i];
                return (
                  <li
                    key={f.t}
                    className="flex items-center gap-2 text-[0.6rem] font-medium uppercase tracking-[0.18em] text-muted-foreground"
                  >
                    <Icon className="size-3.5 text-primary" aria-hidden="true" />
                    {f.t}
                  </li>
                );
              })}
            </ul>
          </div>

          {/* real photographed mascot scene */}
          <div className="relative min-h-[240px] sm:min-h-[380px]">
            <RefImage
              name={SERVICE_SCENES[index]}
              sizes="(min-width: 640px) 40vw, 100vw"
              alt={service.title}
              className="absolute inset-0 block"
              imgClassName="h-full w-full object-cover object-top"
            />
            <div
              aria-hidden="true"
              className="pointer-events-none absolute inset-0"
              style={{
                background:
                  "linear-gradient(90deg, var(--surface) 0%, color-mix(in oklch, var(--surface) 40%, transparent) 38%, transparent 72%)",
              }}
            />
          </div>
        </div>
      </motion.article>
    </div>
  );
}

function ServiceCascade() {
  const { t } = useT();
  const [active, setActive] = useState(0);

  return (
    <section className="relative mx-auto max-w-[1500px] px-5 py-24 sm:px-8 lg:px-12 lg:py-36">
      <div className="grid grid-cols-1 gap-12 lg:grid-cols-[minmax(0,0.42fr)_minmax(0,1fr)] lg:gap-16">
        {/* ---------- numbered rail ---------- */}
        <div className="lg:sticky lg:top-28 lg:self-start">
          <p className="flex items-center gap-3 text-[0.65rem] font-medium uppercase tracking-[0.32em] text-muted-foreground">
            <span className="size-1.5 rounded-full bg-primary" aria-hidden="true" />
            {t.ui.homeServicesEyebrow}
          </p>
          <h2 className="mt-5 text-[clamp(1.9rem,0.9rem_+_2.2vw,3rem)] font-extrabold leading-[1.05] tracking-[-0.025em]">
            {t.ui.homeServicesTitle}
          </h2>
          <p className="mt-5 max-w-xs text-sm leading-relaxed text-muted-foreground">
            {t.about.body}
          </p>

          <ol className="relative mt-12 hidden border-l border-border pl-8 lg:block">
            {t.ui.serviceStage.map((s, i) => {
              const on = i === active;
              return (
                <li key={s.title} className="relative pb-10 last:pb-0">
                  <span
                    aria-hidden="true"
                    className={`absolute -left-[2.15rem] top-1.5 size-2.5 rounded-full transition-all duration-500 ${
                      on ? "bg-primary" : "bg-border"
                    }`}
                    style={on ? { boxShadow: "0 0 12px var(--primary-glow-strong)" } : undefined}
                  />
                  <span
                    className={`text-[0.62rem] font-medium tracking-[0.3em] transition-colors duration-500 ${
                      on ? "text-primary" : "text-muted-foreground/60"
                    }`}
                  >
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <p
                    className={`mt-1 text-sm font-semibold uppercase tracking-[0.14em] transition-colors duration-500 ${
                      on ? "text-foreground" : "text-muted-foreground/60"
                    }`}
                  >
                    {s.title}
                  </p>
                  <p
                    className={`mt-1 max-w-[14rem] text-xs leading-relaxed transition-opacity duration-500 ${
                      on
                        ? "text-muted-foreground opacity-100"
                        : "text-muted-foreground/60 opacity-70"
                    }`}
                  >
                    {s.tag}
                  </p>
                </li>
              );
            })}
          </ol>
        </div>

        {/* ---------- staircase cascade ---------- */}
        <div className="flex flex-col gap-16 sm:gap-20">
          {t.ui.serviceStage.map((s, i) => (
            <CascadeCard key={s.title} index={i} onActive={setActive} />
          ))}
        </div>
      </div>
    </section>
  );
}

/* ----------------------------------------------------------------- proof */

/** Quiet proof: type only, no icon+heading+text card grid. */
function ProofBlock() {
  const { t } = useT();
  const trust = [t.trust.years, t.trust.projects, t.trust.clients, t.trust.response];

  return (
    <section className="mx-auto max-w-[1500px] border-t border-border px-5 py-20 sm:px-8 lg:px-12">
      <p className="text-[0.65rem] font-medium uppercase tracking-[0.32em] text-muted-foreground">
        {t.results.eyebrow}
      </p>
      <h2 className="heading-display-sm mt-4 max-w-lg leading-tight">{t.results.title}</h2>

      <dl className="mt-12 grid grid-cols-2 gap-x-8 gap-y-10 lg:grid-cols-4">
        {t.results.items.map((item) => (
          <div key={item.l}>
            <dt className="text-2xl font-extrabold tracking-tight sm:text-3xl">{item.n}</dt>
            <dd className="mt-2 text-xs uppercase tracking-[0.18em] text-muted-foreground">
              {item.l}
            </dd>
          </div>
        ))}
      </dl>

      <ul className="mt-14 flex flex-wrap gap-x-8 gap-y-3 border-t border-border pt-6 text-[0.65rem] uppercase tracking-[0.22em] text-muted-foreground">
        {trust.map((item) => (
          <li key={item}>{item}</li>
        ))}
      </ul>
    </section>
  );
}

/* ------------------------------------------------------------------- cta */

/** The glowing framed bar that closes the showcase reference. */
function ClosingCta() {
  const { t } = useT();
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { amount: 0.5, once: true });
  const reduced = useReducedMotion();

  return (
    <section className="mx-auto max-w-[1500px] px-5 pb-28 pt-6 sm:px-8 lg:px-12">
      <motion.div
        ref={ref}
        initial={reduced ? { opacity: 1 } : { opacity: 0, y: 30 }}
        animate={inView || reduced ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
        transition={{ duration: reduced ? 0 : 0.8, ease: EASE }}
        className="relative flex flex-col items-start justify-between gap-8 rounded-2xl border border-primary/60 px-6 py-10 sm:rounded-3xl sm:px-10 lg:flex-row lg:items-center lg:px-14"
        style={{
          boxShadow:
            "0 0 0 1px color-mix(in oklch, var(--primary) 30%, transparent), 0 0 40px color-mix(in oklch, var(--primary) 22%, transparent), inset 0 0 60px color-mix(in oklch, var(--primary) 10%, transparent)",
        }}
      >
        <div>
          <h2 className="heading-display-sm leading-tight">{t.cta.title}</h2>
          <p className="mt-3 max-w-md text-sm text-muted-foreground">{t.cta.subtitle}</p>
        </div>
        <Link
          to="/contact"
          className={`hover-lift inline-flex shrink-0 items-center gap-2 rounded-full bg-primary px-7 py-3.5 text-sm font-semibold text-primary-foreground ${FOCUS_RING}`}
        >
          {t.cta.btn}
          <ArrowRight className="size-4" aria-hidden="true" />
        </Link>
      </motion.div>
    </section>
  );
}
