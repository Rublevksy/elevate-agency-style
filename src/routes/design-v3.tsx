import { useCallback, useEffect, useRef, useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import {
  AnimatePresence,
  motion,
  useMotionValue,
  useMotionValueEvent,
  useReducedMotion,
  useScroll,
  useSpring,
  useTransform,
} from "framer-motion";
import { ArrowRight, Check, ShoppingCart, Search, Smartphone, Palette } from "lucide-react";

import { useT } from "@/lib/i18n";
import { Logo } from "@/components/Logo";
import { ExploreSwitcher } from "@/components/design-explore/ExploreSwitcher";
import { RefImage, type RefName } from "@/components/design-explore/RefImage";

/**
 * /design-v3 — "Studio desk" (interactive product showcase).
 *
 * The direction's whole idea lives in one seam: a single `active` index drives
 * three things at once — the real photographed mascot scene (RefImage), the
 * live DOM browser window next to it, and the accent caption. Nothing here is
 * scroll-narrated the way V1/V2 are; interaction (click / hover / keyboard)
 * leads, and scroll only keeps the window on screen long enough to also host
 * the proof panel *inside* the same interface.
 *
 * Self-contained by design: no production section is imported, and the file is
 * expected to be deleted wholesale when a direction is chosen.
 */
export const Route = createFileRoute("/design-v3")({
  component: DesignV3Page,
  head: () => ({
    meta: [
      { title: "V3 — Studio desk — ELEVATE design exploration" },
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

const EASE = [0.22, 1, 0.36, 1] as const;
const DISPLAY = { fontFamily: "'Space Grotesk', Inter, system-ui, sans-serif" } as const;
const FOCUS_RING =
  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-background";

/** Mascot scenes in the exact order of `t.ui.serviceStage`. */
const SCENES: readonly RefName[] = ["svc-web", "svc-seo", "svc-eshop", "svc-branding", "svc-app"];
const SERVICE_COUNT = SCENES.length;
const AUTOPLAY_MS = 4600;

function DesignV3Page() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <ExploreSwitcher active="design-v3" />
      <StudioDesk />
      <ClosingCta />
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* The desk: hero + tabs + sticky window + proof panel inside the window */
/* ------------------------------------------------------------------ */

function StudioDesk() {
  const { t } = useT();
  const reducedMotion = useReducedMotion();

  const [active, setActive] = useState(0);
  const [held, setHeld] = useState(false); // hover / focus inside the tablist
  const [interacted, setInteracted] = useState(false);
  const [showProof, setShowProof] = useState(false);

  const sectionRef = useRef<HTMLElement | null>(null);
  const tabRefs = useRef<Array<HTMLButtonElement | null>>([]);

  // Scroll only decides *when the window turns into the proof panel* — it never
  // drives the service switching, that stays interaction-led.
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end end"],
  });
  useMotionValueEvent(scrollYProgress, "change", (v) => {
    setShowProof(v > 0.62);
  });

  const autoplayPaused = reducedMotion || held || interacted || showProof;
  useEffect(() => {
    if (autoplayPaused) return;
    const id = window.setInterval(() => {
      setActive((i) => (i + 1) % SERVICE_COUNT);
    }, AUTOPLAY_MS);
    return () => window.clearInterval(id);
  }, [autoplayPaused]);

  const pick = useCallback((i: number) => {
    setActive(i);
    setInteracted(true);
  }, []);

  const onTabKeyDown = (e: React.KeyboardEvent<HTMLButtonElement>, i: number) => {
    let next: number | null = null;
    if (e.key === "ArrowRight" || e.key === "ArrowDown") next = (i + 1) % SERVICE_COUNT;
    if (e.key === "ArrowLeft" || e.key === "ArrowUp") next = (i - 1 + SERVICE_COUNT) % SERVICE_COUNT;
    if (e.key === "Home") next = 0;
    if (e.key === "End") next = SERVICE_COUNT - 1;
    if (next === null) return;
    e.preventDefault();
    pick(next);
    tabRefs.current[next]?.focus();
  };

  // Cursor parallax: two layers, deliberately opposite directions and different
  // amplitudes so the window and the mascot separate in depth.
  const px = useMotionValue(0);
  const py = useMotionValue(0);
  const spring = { stiffness: 90, damping: 18, mass: 0.6 };
  const sx = useSpring(px, spring);
  const sy = useSpring(py, spring);
  // Opposite signs + different amplitudes: the two layers must not travel
  // together, otherwise the parallax reads as one flat plate sliding.
  const winX = useTransform(sx, (v) => v * 16);
  const winY = useTransform(sy, (v) => v * 10);
  const macX = useTransform(sx, (v) => v * -30);
  const macY = useTransform(sy, (v) => v * -18);

  const onPointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (reducedMotion) return;
    const r = e.currentTarget.getBoundingClientRect();
    px.set((e.clientX - r.left) / r.width - 0.5);
    py.set((e.clientY - r.top) / r.height - 0.5);
  };
  const onPointerLeave = () => {
    px.set(0);
    py.set(0);
  };

  const service = t.ui.serviceStage[active];

  return (
    <section
      ref={sectionRef}
      className="relative md:h-[300vh]"
      aria-labelledby="v3-desk-title"
    >
      <div className="relative md:sticky md:top-0 md:flex md:h-screen md:flex-col md:justify-center">
        <div
          className="mx-auto w-full max-w-7xl px-5 pb-16 pt-28 sm:px-8 md:py-0"
          onPointerMove={onPointerMove}
          onPointerLeave={onPointerLeave}
        >
          {/* Compact headline — the window dominates, not the type. */}
          <div className="mb-6 flex flex-col gap-3 md:mb-8 md:flex-row md:items-end md:justify-between">
            <div className="min-w-0">
              <p className="mb-2 inline-flex items-center gap-2 text-[11px] uppercase tracking-[0.28em] text-muted-foreground">
                <span aria-hidden className="h-1.5 w-1.5 rounded-full bg-primary" />
                {t.hero.tag}
              </p>
              <h1
                id="v3-desk-title"
                style={DISPLAY}
                className="text-2xl font-bold leading-[1.1] tracking-tight sm:text-3xl lg:text-4xl"
              >
                {t.hero.title1} <span className="text-primary">{t.hero.title2}</span>
              </h1>
            </div>
            <Link
              to="/contact"
              className={`inline-flex shrink-0 items-center gap-2 rounded-full bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground transition-transform hover:scale-[1.02] ${FOCUS_RING}`}
            >
              {t.hero.cta1}
              <ArrowRight className="h-4 w-4" aria-hidden />
            </Link>
          </div>

          <div className="grid items-center gap-6 md:grid-cols-[minmax(0,1.55fr)_minmax(0,1fr)] md:gap-8">
            {/* ---- Live browser window (DOM, never an image) ---- */}
            <motion.div
              style={reducedMotion ? undefined : { x: winX, y: winY }}
              className="order-2 md:order-1"
            >
              <BrowserWindow
                active={active}
                showProof={showProof}
                labelledBy={`v3-tab-${active}`}
              />
            </motion.div>

            {/* ---- Real photographed mascot scene ---- */}
            <motion.div
              style={reducedMotion ? undefined : { x: macX, y: macY }}
              className="relative order-1 mx-auto w-full max-w-[380px] md:order-2 md:max-w-none"
            >
              <div className="relative aspect-[4/5] w-full overflow-hidden rounded-2xl border border-white/10 bg-black/40">
                <AnimatePresence mode="sync">
                  <motion.div
                    key={SCENES[active]}
                    initial={reducedMotion ? false : { opacity: 0, scale: 1.06 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={reducedMotion ? { opacity: 0 } : { opacity: 0, scale: 0.98 }}
                    transition={{ duration: 0.65, ease: EASE }}
                    className="absolute inset-0"
                  >
                    <RefImage
                      name={SCENES[active]}
                      alt={service.title}
                      priority={active === 0}
                      sizes="(max-width: 768px) 90vw, 32vw"
                      className="block h-full w-full"
                      imgClassName="h-full w-full object-cover object-top"
                    />
                  </motion.div>
                </AnimatePresence>
                {/* Feathered edge instead of a hard cut against the page. */}
                <div
                  aria-hidden
                  className="pointer-events-none absolute inset-0"
                  style={{
                    background:
                      "linear-gradient(to top, var(--background) 2%, transparent 38%), linear-gradient(to right, var(--background) 0%, transparent 14%)",
                  }}
                />
              </div>

              {/* Accent caption — the third thing that switches. */}
              <div className="mt-4 min-h-[4.5rem] md:mt-5">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={active}
                    initial={reducedMotion ? false : { opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={reducedMotion ? { opacity: 0 } : { opacity: 0, y: -8 }}
                    transition={{ duration: 0.35, ease: EASE }}
                  >
                    <p
                      style={DISPLAY}
                      className="text-lg font-semibold leading-snug text-foreground sm:text-xl"
                    >
                      {service.title}
                    </p>
                    <p className="mt-1 text-sm text-primary">{service.tag}</p>
                  </motion.div>
                </AnimatePresence>
              </div>
            </motion.div>
          </div>

          {/* ---- Five services = five tabs ---- */}
          <div
            role="tablist"
            aria-label={t.services.title}
            className="mt-6 flex snap-x gap-2 overflow-x-auto pb-1 md:mt-8 md:flex-wrap md:overflow-visible"
            onMouseEnter={() => setHeld(true)}
            onMouseLeave={() => setHeld(false)}
            onFocusCapture={() => setHeld(true)}
            onBlurCapture={() => setHeld(false)}
          >
            {t.ui.serviceStage.map((s, i) => {
              const isActive = i === active;
              return (
                <button
                  key={s.title}
                  ref={(el) => {
                    tabRefs.current[i] = el;
                  }}
                  type="button"
                  role="tab"
                  id={`v3-tab-${i}`}
                  aria-selected={isActive}
                  aria-controls="v3-window-panel"
                  tabIndex={isActive ? 0 : -1}
                  onClick={() => pick(i)}
                  onMouseEnter={() => setActive(i)}
                  onFocus={() => setActive(i)}
                  onKeyDown={(e) => onTabKeyDown(e, i)}
                  className={`snap-start whitespace-nowrap rounded-full border px-4 py-2 text-sm transition-colors ${FOCUS_RING} ${
                    isActive
                      ? "border-primary bg-primary/15 font-semibold text-foreground"
                      : "border-border text-muted-foreground hover:text-foreground"
                  }`}
                >
                  <span className="mr-2 text-[11px] tabular-nums text-primary">
                    0{i + 1}
                  </span>
                  {s.title}
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/* Browser window                                                      */
/* ------------------------------------------------------------------ */

function BrowserWindow({
  active,
  showProof,
  labelledBy,
}: {
  active: number;
  showProof: boolean;
  labelledBy: string;
}) {
  const { t } = useT();
  const reducedMotion = useReducedMotion();
  const service = t.ui.serviceStage[active];

  return (
    <div className="overflow-hidden rounded-xl border border-white/12 bg-[#0d1220] shadow-ambient">
      {/* Chrome */}
      <div className="flex items-center gap-3 border-b border-white/10 bg-white/[0.04] px-3 py-2.5">
        <div aria-hidden className="flex gap-1.5">
          <span className="h-2.5 w-2.5 rounded-full bg-white/25" />
          <span className="h-2.5 w-2.5 rounded-full bg-white/15" />
          <span className="h-2.5 w-2.5 rounded-full bg-white/15" />
        </div>
        <div className="flex min-w-0 flex-1 items-center gap-2 rounded-md bg-black/40 px-3 py-1.5">
          <span aria-hidden className="h-1.5 w-1.5 shrink-0 rounded-full bg-primary" />
          <span className="truncate text-[11px] text-muted-foreground">
            {showProof ? t.results.title : service.title}
          </span>
        </div>
        <Logo className="h-3.5 w-auto opacity-70" />
      </div>

      {/* Viewport */}
      <div
        id="v3-window-panel"
        role="tabpanel"
        aria-labelledby={labelledBy}
        className="relative min-h-[300px] sm:min-h-[360px] md:min-h-[400px]"
      >
        <AnimatePresence mode="wait">
          <motion.div
            key={showProof ? "proof" : `svc-${active}`}
            initial={reducedMotion ? false : { opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            exit={reducedMotion ? { opacity: 0 } : { opacity: 0, y: -10 }}
            transition={{ duration: 0.4, ease: EASE }}
            className="p-4 sm:p-6"
          >
            {showProof ? <ProofPanel /> : <ServiceScreen active={active} />}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}

function ServiceScreen({ active }: { active: number }) {
  switch (active) {
    case 0:
      return <WebScreen />;
    case 1:
      return <SeoScreen />;
    case 2:
      return <EshopScreen />;
    case 3:
      return <BrandingScreen />;
    default:
      return <AppScreen />;
  }
}

/** Neutral filler used where a real screen would show client artwork. */
function Block({ className = "" }: { className?: string }) {
  return <div aria-hidden className={`rounded bg-white/10 ${className}`} />;
}

/* --- 0 · Weby: a landing-page layout with a CTA --- */
function WebScreen() {
  const { t } = useT();
  return (
    <div>
      <div className="mb-4 flex items-center justify-between border-b border-white/10 pb-3">
        <Logo className="h-4 w-auto" />
        <div className="hidden gap-4 text-[11px] text-muted-foreground sm:flex">
          <span>{t.nav.home}</span>
          <span>{t.nav.services}</span>
          <span>{t.nav.work}</span>
          <span>{t.nav.contact}</span>
        </div>
      </div>
      <div className="grid gap-4 sm:grid-cols-[1.2fr_1fr] sm:items-center">
        <div>
          <p style={DISPLAY} className="text-xl font-bold leading-tight sm:text-2xl">
            {t.ui.serviceStage[0].title}
          </p>
          <p className="mt-2 text-xs text-muted-foreground">{t.ui.serviceStage[0].tag}</p>
          <span className="mt-4 inline-flex items-center gap-2 rounded-md bg-primary px-3 py-1.5 text-[11px] font-semibold text-primary-foreground">
            {t.services.learnMore}
            <ArrowRight className="h-3 w-3" aria-hidden />
          </span>
        </div>
        <div className="space-y-2">
          <Block className="h-20 w-full" />
          <div className="grid grid-cols-3 gap-2">
            <Block className="h-10" />
            <Block className="h-10" />
            <Block className="h-10" />
          </div>
        </div>
      </div>
      <div className="mt-4 grid gap-2 border-t border-white/10 pt-3 sm:grid-cols-3">
        {t.guarantee.items.map((g) => (
          <div key={g.t} className="flex items-start gap-2 text-[11px] text-muted-foreground">
            <Check className="mt-0.5 h-3 w-3 shrink-0 text-primary" aria-hidden />
            <span>{g.t}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

/* --- 1 · SEO: an analytics view with a drawn growth curve --- */
function SeoScreen() {
  const { t } = useT();
  const reducedMotion = useReducedMotion();
  return (
    <div>
      <div className="mb-3 flex items-center gap-2">
        <Search className="h-4 w-4 text-primary" aria-hidden />
        <p style={DISPLAY} className="text-sm font-semibold">
          {t.ui.serviceStage[1].title}
        </p>
      </div>
      <div className="rounded-lg border border-white/10 bg-black/30 p-3">
        <svg viewBox="0 0 400 150" className="h-40 w-full" role="img" aria-label={t.ui.serviceStage[1].tag}>
          {[30, 60, 90, 120].map((y) => (
            <line key={y} x1="0" y1={y} x2="400" y2={y} stroke="white" strokeOpacity="0.07" />
          ))}
          <motion.path
            d="M4 132 C 70 128, 96 104, 140 106 S 214 78, 250 66 S 330 40, 396 12"
            fill="none"
            stroke="var(--primary)"
            strokeWidth="2.5"
            strokeLinecap="round"
            initial={reducedMotion ? false : { pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ duration: 1.2, ease: EASE }}
          />
          {[
            [140, 106],
            [250, 66],
            [396, 12],
          ].map(([cx, cy]) => (
            <circle key={cx} cx={cx} cy={cy} r="3.5" fill="var(--primary)" />
          ))}
        </svg>
        <div className="mt-2 flex justify-between text-[10px] text-muted-foreground">
          {t.process.steps.map((s) => (
            <span key={s}>{s}</span>
          ))}
        </div>
      </div>
      <div className="mt-3 grid gap-2 sm:grid-cols-2">
        {t.why.items.slice(0, 2).map((w) => (
          <div key={w.t} className="rounded-md border border-white/10 px-3 py-2">
            <p className="text-[11px] font-semibold">{w.t}</p>
            <p className="text-[10px] text-muted-foreground">{w.d}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

/* --- 2 · E-shop: a product grid with a cart bar --- */
function EshopScreen() {
  const { t } = useT();
  return (
    <div>
      <div className="mb-3 flex items-center justify-between rounded-md bg-white/[0.04] px-3 py-2">
        <p style={DISPLAY} className="text-xs font-semibold">
          {t.ui.serviceStage[2].title}
        </p>
        <span className="inline-flex items-center gap-1.5 rounded-full bg-primary/20 px-2.5 py-1 text-[10px] text-primary">
          <ShoppingCart className="h-3 w-3" aria-hidden />
          {t.pricing.cta}
        </span>
      </div>
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        {[0, 1, 2, 3].map((i) => (
          <div key={i} className="rounded-lg border border-white/10 bg-black/30 p-2">
            <Block className="mb-2 aspect-square w-full" />
            <Block className="mb-1 h-2 w-4/5" />
            <Block className="h-2 w-1/2" />
          </div>
        ))}
      </div>
      <div className="mt-3 flex flex-wrap gap-2">
        {t.contact.services.map((s) => (
          <span
            key={s}
            className="rounded-full border border-white/10 px-2.5 py-1 text-[10px] text-muted-foreground"
          >
            {s}
          </span>
        ))}
      </div>
    </div>
  );
}

/* --- 3 · Branding: palette + mark + specimen --- */
function BrandingScreen() {
  const { t } = useT();
  return (
    <div className="grid gap-4 sm:grid-cols-[1fr_1.1fr]">
      <div className="rounded-lg border border-white/10 bg-black/40 p-5">
        <div className="flex items-center gap-2 text-[10px] uppercase tracking-[0.25em] text-muted-foreground">
          <Palette className="h-3.5 w-3.5 text-primary" aria-hidden />
          {t.ui.serviceStage[3].tag}
        </div>
        <div className="mt-6 flex items-center justify-center">
          <Logo className="h-10 w-auto" />
        </div>
        <div className="mt-6 grid grid-cols-5 gap-1.5">
          {[
            "var(--primary)",
            "var(--primary-glow)",
            "rgba(255,255,255,0.85)",
            "rgba(255,255,255,0.35)",
            "#0B0F1A",
          ].map((c) => (
            <div
              key={c}
              aria-hidden
              className="h-9 rounded border border-white/10"
              style={{ background: c }}
            />
          ))}
        </div>
      </div>
      <div className="space-y-3">
        <p style={DISPLAY} className="text-3xl font-bold leading-none tracking-tight">
          Aa
        </p>
        <p style={DISPLAY} className="text-sm font-semibold">
          {t.ui.serviceStage[3].title}
        </p>
        <div className="space-y-1.5">
          <Block className="h-2 w-full" />
          <Block className="h-2 w-11/12" />
          <Block className="h-2 w-8/12" />
        </div>
        <div className="flex gap-2 pt-1">
          {t.services.items.slice(0, 3).map((s) => (
            <span
              key={s.title}
              className="rounded border border-white/10 px-2 py-1 text-[10px] text-muted-foreground"
            >
              {s.title}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}

/* --- 4 · Aplikace: a phone frame with an app screen --- */
function AppScreen() {
  const { t } = useT();
  return (
    <div className="grid gap-4 sm:grid-cols-[auto_1fr] sm:items-center">
      <div className="mx-auto w-[160px] rounded-[1.6rem] border border-white/15 bg-black/60 p-2.5">
        <div className="mb-2 flex items-center gap-1.5">
          <Smartphone className="h-3 w-3 text-primary" aria-hidden />
          <Block className="h-1.5 w-10" />
        </div>
        <div className="space-y-2 rounded-[1.1rem] bg-white/[0.04] p-2.5">
          <Block className="h-14 w-full" />
          {[0, 1, 2].map((i) => (
            <div key={i} className="flex items-center gap-2">
              <Block className="h-6 w-6 rounded-full" />
              <div className="flex-1 space-y-1">
                <Block className="h-1.5 w-4/5" />
                <Block className="h-1.5 w-2/5" />
              </div>
            </div>
          ))}
          <div className="rounded-md bg-primary py-1.5 text-center text-[9px] font-semibold text-primary-foreground">
            {t.services.detailLabels.cta}
          </div>
        </div>
      </div>
      <div>
        <p style={DISPLAY} className="text-sm font-semibold">
          {t.ui.serviceStage[4].title}
        </p>
        <p className="mt-1 text-xs text-muted-foreground">{t.ui.serviceStage[4].tag}</p>
        <ul className="mt-3 space-y-2">
          {t.process.steps.map((s, i) => (
            <li key={s} className="flex items-center gap-2 text-[11px] text-muted-foreground">
              <span className="flex h-5 w-5 items-center justify-center rounded-full border border-primary/40 text-[9px] text-primary">
                {i + 1}
              </span>
              {s}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

/* --- Proof, rendered *inside* the same window (not a separate icon-card section) --- */
function ProofPanel() {
  const { t } = useT();
  const proof = [t.trust.years, t.trust.projects, t.trust.clients, t.trust.response];
  return (
    <div>
      <div className="mb-4 flex items-center justify-between">
        <p style={DISPLAY} className="text-sm font-semibold">
          {t.results.title}
        </p>
        <span className="text-[10px] uppercase tracking-[0.25em] text-muted-foreground">
          {t.about.eyebrow}
        </span>
      </div>
      <div className="grid gap-2 sm:grid-cols-2">
        {proof.map((line) => (
          <div
            key={line}
            className="flex items-center gap-2 rounded-md border border-white/10 bg-black/30 px-3 py-2.5 text-xs"
          >
            <Check className="h-3.5 w-3.5 shrink-0 text-primary" aria-hidden />
            <span>{line}</span>
          </div>
        ))}
      </div>
      <p className="mt-4 max-w-prose text-xs leading-relaxed text-muted-foreground">
        {t.about.body}
      </p>
      <div className="mt-4 grid gap-2 border-t border-white/10 pt-3 sm:grid-cols-3">
        {t.why.items.slice(0, 3).map((w) => (
          <p key={w.t} className="text-[11px] text-muted-foreground">
            <span className="text-foreground">{w.t}</span> — {w.d}
          </p>
        ))}
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */

function ClosingCta() {
  const { t } = useT();
  return (
    <section className="border-t border-white/10 px-5 py-20 text-center sm:px-8">
      <h2 style={DISPLAY} className="text-3xl font-bold tracking-tight sm:text-4xl">
        {t.cta.title}
      </h2>
      <p className="mx-auto mt-3 max-w-lg text-sm text-muted-foreground">{t.cta.subtitle}</p>
      <Link
        to="/contact"
        className={`mt-7 inline-flex items-center gap-2 rounded-full bg-primary px-7 py-3 text-sm font-semibold text-primary-foreground transition-transform hover:scale-[1.02] ${FOCUS_RING}`}
      >
        {t.cta.btn}
        <ArrowRight className="h-4 w-4" aria-hidden />
      </Link>
    </section>
  );
}
