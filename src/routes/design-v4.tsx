import { useRef } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import {
  motion,
  useMotionValue,
  useReducedMotion,
  useScroll,
  useSpring,
  useTransform,
} from "framer-motion";
import { useT } from "@/lib/i18n";
import { Logo } from "@/components/Logo";
import { ExploreSwitcher } from "@/components/design-explore/ExploreSwitcher";

/**
 * /design-v4 — "Experimental premium technology studio" exploration
 * direction (ticket 05 / spec §V4).
 *
 * Thesis: the studio's engineering discipline shows up in the page's own
 * form — an asymmetric technical grid and a monospace "console" that
 * carries real data, not a smooth centered marketing composition. This is
 * the direction spec.md flags as closest to the banned generic "dark-tech
 * gradient" trap (R33/R36), so the two guardrails baked into the layout
 * below are load-bearing, not decoration:
 *   1. No hero centering — title block and console-readout are unequal
 *      grid modules, offset from each other, never a mirrored 2-column hero.
 *   2. No uniform panels — the services grid is one large demo module plus
 *      four differently-sized compact modules on an explicit column/row
 *      template, not a 5x1 or repeated equal-card grid.
 * Saturation stays inside specific panels/accents (corner tags, one filled
 * tile, the scan line) — the background itself is never gradient-washed.
 *
 * Self-contained: no imports from src/components/hero/**, production
 * sections, or other design-v* routes. All copy comes from useT() —
 * nothing new is invented beyond UI chrome (module ids, terminal prompts).
 */
export const Route = createFileRoute("/design-v4")({
  component: DesignV4Page,
  head: () => ({
    meta: [
      { title: "V4 — Experimental premium technology studio — ELEVATE" },
      { name: "robots", content: "noindex, nofollow" },
    ],
    links: [
      { rel: "preconnect", href: "https://fonts.googleapis.com" },
      { rel: "preconnect", href: "https://fonts.gstatic.com", crossOrigin: "anonymous" },
      {
        rel: "stylesheet",
        href: "https://fonts.googleapis.com/css2?family=Syne:wght@700;800&family=Space+Mono:wght@400;700&display=swap",
      },
    ],
  }),
});

const DISPLAY_FONT = '"Syne", "Inter", ui-sans-serif, system-ui, sans-serif';
const MONO_FONT = '"Space Mono", "IBM Plex Mono", ui-monospace, SFMono-Regular, monospace';
/** Second cool technical tone (spec §V4 "Committed→Full palette") — same
 * oklch family as --primary, shifted lighter/cyaner for data highlights.
 * Kept local to this route, not a new global token. */
const SIGNAL = "oklch(0.80 0.14 205)";

function DesignV4Page() {
  const { t } = useT();
  const reducedMotion = useReducedMotion();
  const services = t.ui.serviceStage;
  const trustLines = [
    { label: "EXPERIENCE", value: t.trust.years },
    { label: "DELIVERED", value: t.trust.projects },
    { label: "CLIENTS", value: t.trust.clients },
    { label: "RESPONSE", value: t.trust.response },
  ];

  return (
    <div className="min-h-screen overflow-x-hidden bg-background text-foreground">
      <ExploreSwitcher active="design-v4" />

      {/* ---------------------------------------------------------------- */}
      {/* Hero — asymmetric: title block and console are unequal, offset   */}
      {/* grid modules, never a centered/mirrored pair.                    */}
      {/* ---------------------------------------------------------------- */}
      <section className="relative px-5 pb-16 pt-24 sm:px-8 md:pb-24 md:pt-28">
        <div className="mx-auto grid max-w-[1400px] grid-cols-1 gap-8 md:grid-cols-12 md:gap-6">
          <Logo className="col-span-full mb-2 h-6 w-auto md:h-7" />

          {/* Title module — left, not full-width, not centered */}
          <div className="min-w-0 md:col-span-7">
            <h1
              style={{ fontFamily: DISPLAY_FONT }}
              className="min-w-0 max-w-xl text-4xl font-extrabold leading-[1.02] tracking-tight sm:text-5xl md:text-6xl"
            >
              {t.hero.title1}
              <br />
              <span style={{ color: SIGNAL }}>{t.hero.title2}</span>
            </h1>
            <p className="mt-6 min-w-0 max-w-md text-sm leading-relaxed text-muted-foreground sm:text-base">
              {t.hero.subtitle}
            </p>
            <div className="mt-8 flex flex-wrap items-center gap-3">
              <Link
                to="/contact"
                className="inline-flex items-center gap-2 rounded-lg bg-primary px-5 py-3 text-sm font-semibold text-primary-foreground transition-transform duration-200 hover:scale-[1.02] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-background"
              >
                {t.hero.cta1}
              </Link>
              <span style={{ fontFamily: MONO_FONT }} className="text-xs text-muted-foreground">
                {t.hero.cta2}
              </span>
            </div>
          </div>

          {/* Console module — offset downward, unequal width, embedded as
              its own grid cell rather than a mirrored side panel. This is
              the "device/product presentation" of V4: the studio's own
              instrumentation, not a client device. */}
          <div className="md:col-span-5 md:col-start-8 md:mt-16">
            <ConsolePanel trustLines={trustLines} tag={t.hero.tag} />
          </div>
        </div>
      </section>

      {/* ---------------------------------------------------------------- */}
      {/* Services — unequal panel grid + scroll-synced scan line          */}
      {/* ---------------------------------------------------------------- */}
      <ServicesGrid
        services={services}
        heading={t.ui.homeServicesTitle}
        reducedMotion={!!reducedMotion}
      />

      {/* ---------------------------------------------------------------- */}
      {/* Proof — build log, not stat cards                                */}
      {/* ---------------------------------------------------------------- */}
      <BuildLog heading={t.results.title} items={t.results.items} />

      {/* ---------------------------------------------------------------- */}
      {/* CTA — terminal-framed                                            */}
      {/* ---------------------------------------------------------------- */}
      <section className="px-5 pb-24 pt-4 sm:px-8 md:pb-32">
        <div className="mx-auto max-w-[1400px]">
          <div
            style={{ fontFamily: MONO_FONT }}
            className="shadow-ambient overflow-hidden rounded-2xl border border-border bg-surface/70"
          >
            <div className="flex items-center gap-2 border-b border-border px-5 py-3 text-xs text-muted-foreground sm:px-8">
              <span style={{ color: SIGNAL }}>{">_"}</span>
              <span>elevate@studio:~$</span>
            </div>
            <div className="px-5 py-8 sm:px-8 md:py-10">
              <p className="text-xs text-muted-foreground sm:text-sm">$ run --contact</p>
              <h2
                style={{ fontFamily: DISPLAY_FONT }}
                className="mt-4 max-w-lg text-2xl font-extrabold tracking-tight sm:text-3xl md:text-4xl"
              >
                {t.cta.title}
              </h2>
              <p className="mt-3 max-w-md text-sm leading-relaxed text-muted-foreground sm:text-base">
                {t.cta.subtitle}
              </p>
              <Link
                to="/contact"
                className="mt-7 inline-flex items-center gap-2 rounded-lg bg-primary px-6 py-3.5 text-sm font-semibold text-primary-foreground transition-transform duration-200 hover:scale-[1.02] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-background"
              >
                <span aria-hidden="true">{"> "}</span>
                {t.cta.btn}
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

/* ---------------------------------------------------------------------- */
/* Console panel — hero's device/product presentation: a status readout   */
/* built entirely from real t.trust strings as log lines, not icon cards. */
/* ---------------------------------------------------------------------- */

function ConsolePanel({
  trustLines,
  tag,
}: {
  trustLines: { label: string; value: string }[];
  tag: string;
}) {
  return (
    <div
      style={{ fontFamily: MONO_FONT }}
      className="shadow-ambient relative overflow-hidden rounded-2xl border border-border bg-surface/70 text-xs sm:text-sm"
    >
      <div className="flex items-center justify-between gap-3 border-b border-border px-4 py-3 sm:px-5">
        <span className="tracking-wide text-muted-foreground">STUDIO STATUS</span>
        <span
          style={{ color: SIGNAL }}
          className="flex items-center gap-1.5 font-bold tracking-wide"
        >
          <span
            aria-hidden="true"
            className="h-1.5 w-1.5 rounded-full"
            style={{ backgroundColor: SIGNAL }}
          />
          ONLINE
        </span>
      </div>
      <div className="px-4 py-4 sm:px-5 sm:py-5">
        <p className="mb-4 leading-relaxed text-muted-foreground">{tag}</p>
        <dl className="space-y-2.5">
          {trustLines.map((line) => (
            <div key={line.label} className="flex items-baseline justify-between gap-3">
              <dt className="shrink-0 text-muted-foreground">
                <span style={{ color: SIGNAL }}>{"> "}</span>
                {line.label}
              </dt>
              <dd className="min-w-0 truncate text-right font-bold text-foreground">
                {line.value}
              </dd>
            </div>
          ))}
        </dl>
      </div>
    </div>
  );
}

/* ---------------------------------------------------------------------- */
/* Services — one large demo module + four unequal compact modules on an  */
/* explicit 6-col/3-row template, with a scroll-synced scan line.         */
/* ---------------------------------------------------------------------- */

type Service = { title: string; tag: string };

function ServicesGrid({
  services,
  heading,
  reducedMotion,
}: {
  services: readonly Service[];
  heading: string;
  reducedMotion: boolean;
}) {
  const gridRef = useRef<HTMLDivElement | null>(null);
  const { scrollYProgress } = useScroll({
    target: gridRef,
    offset: ["start 0.85", "end 0.15"],
  });
  const scanLeft = useTransform(scrollYProgress, [0, 1], ["0%", "100%"]);

  const [big, ...rest] = services;
  // Explicit, unequal placement — deliberately not a repeated cell size.
  const compactSpans = [
    "md:[grid-column:4/7] md:[grid-row:1/2]", // wide, short
    "md:[grid-column:4/6] md:[grid-row:2/4]", // medium, tall
    "md:[grid-column:6/7] md:[grid-row:2/3]", // small
    "md:[grid-column:6/7] md:[grid-row:3/4]", // small
  ];

  return (
    <section className="px-5 py-16 sm:px-8 md:py-24">
      <div className="mx-auto max-w-[1400px]">
        <h2
          style={{ fontFamily: DISPLAY_FONT }}
          className="mb-8 min-w-0 max-w-md text-2xl font-extrabold tracking-tight sm:text-3xl md:mb-10"
        >
          {heading}
        </h2>

        <div ref={gridRef} className="relative">
          {!reducedMotion && (
            <motion.div
              aria-hidden="true"
              className="pointer-events-none absolute inset-y-0 z-10 hidden w-px md:block"
              style={{
                left: scanLeft,
                background: `linear-gradient(to bottom, transparent, ${SIGNAL}, transparent)`,
                boxShadow: `0 0 12px ${SIGNAL}`,
              }}
            />
          )}

          <div className="grid grid-cols-1 gap-4 md:grid-cols-6 md:[grid-template-rows:repeat(3,minmax(8rem,1fr))] md:gap-4">
            <TechPanel
              id="MOD.01"
              reducedMotion={reducedMotion}
              className="md:[grid-column:1/4] md:[grid-row:1/4]"
              large
            >
              <p
                className="mb-3 text-[11px] tracking-wide text-muted-foreground"
                style={{ fontFamily: MONO_FONT }}
              >
                MOD.01 / PRIMARY
              </p>
              <p
                style={{ fontFamily: DISPLAY_FONT }}
                className="text-2xl font-extrabold leading-tight tracking-tight sm:text-3xl"
              >
                {big.title}
              </p>
              <p className="mt-3 max-w-xs text-sm leading-relaxed text-muted-foreground">
                {big.tag}
              </p>
              <div
                className="mt-auto pt-6 text-[11px] text-muted-foreground"
                style={{ fontFamily: MONO_FONT }}
              >
                <span style={{ color: SIGNAL }}>{"> "}</span>
                {"output = "}
                {big.tag}
              </div>
            </TechPanel>

            {rest.map((svc, i) => (
              <TechPanel
                key={svc.title}
                id={`MOD.0${i + 2}`}
                reducedMotion={reducedMotion}
                className={compactSpans[i]}
                filled={i === 0}
              >
                <p
                  className="mb-1.5 text-[10px] tracking-wide"
                  style={{
                    fontFamily: MONO_FONT,
                    color: i === 0 ? "var(--primary-foreground)" : "var(--muted-foreground)",
                    opacity: i === 0 ? 0.85 : 1,
                  }}
                >
                  MOD.0{i + 2}
                </p>
                <p
                  style={{ fontFamily: DISPLAY_FONT }}
                  className={`text-sm font-bold leading-snug tracking-tight sm:text-base ${
                    i === 0 ? "text-primary-foreground" : "text-foreground"
                  }`}
                >
                  {svc.title}
                </p>
                <p
                  className={`mt-1.5 text-xs leading-snug ${
                    i === 0 ? "text-primary-foreground/80" : "text-muted-foreground"
                  }`}
                >
                  {svc.tag}
                </p>
              </TechPanel>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

function TechPanel({
  id,
  className,
  reducedMotion,
  large,
  filled,
  children,
}: {
  id: string;
  className: string;
  reducedMotion: boolean;
  large?: boolean;
  filled?: boolean;
  children: React.ReactNode;
}) {
  const rx = useMotionValue(0);
  const ry = useMotionValue(0);
  const springX = useSpring(rx, { stiffness: 220, damping: 22 });
  const springY = useSpring(ry, { stiffness: 220, damping: 22 });

  function onPointerMove(e: React.PointerEvent<HTMLDivElement>) {
    if (reducedMotion) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const px = (e.clientX - rect.left) / rect.width - 0.5;
    const py = (e.clientY - rect.top) / rect.height - 0.5;
    ry.set(px * 6);
    rx.set(py * -6);
  }
  function reset() {
    rx.set(0);
    ry.set(0);
  }

  return (
    <motion.div
      role="group"
      aria-label={id}
      tabIndex={0}
      onPointerMove={onPointerMove}
      onPointerLeave={reset}
      onBlur={reset}
      style={
        reducedMotion
          ? undefined
          : { rotateX: springX, rotateY: springY, transformPerspective: 900 }
      }
      className={`${className} ${large ? "shadow-ambient" : "shadow-contact"} relative flex min-h-[8rem] flex-col overflow-hidden rounded-2xl border border-border p-5 outline-none transition-colors focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-background sm:p-6 ${
        large
          ? "bg-gradient-to-br from-primary/10 via-surface to-surface"
          : filled
            ? "bg-primary"
            : "bg-surface/60"
      }`}
    >
      {children}
    </motion.div>
  );
}

/* ---------------------------------------------------------------------- */
/* Build log — t.results rendered as monospace log lines, not stat cards. */
/* ---------------------------------------------------------------------- */

function BuildLog({
  heading,
  items,
}: {
  heading: string;
  items: readonly { n: string; l: string }[];
}) {
  return (
    <section className="border-t border-border px-5 py-16 sm:px-8 md:py-24">
      <div className="mx-auto max-w-[1400px]">
        <h2
          style={{ fontFamily: MONO_FONT }}
          className="mb-6 text-xs tracking-wide text-muted-foreground sm:text-sm"
        >
          {"// "}
          {heading}
        </h2>
        <div
          style={{ fontFamily: MONO_FONT }}
          className="shadow-contact overflow-hidden rounded-2xl border border-border bg-surface/50"
        >
          {items.map((item, i) => (
            <div
              key={item.l}
              className={`flex items-center justify-between gap-4 px-5 py-3.5 text-xs sm:px-8 sm:text-sm ${
                i !== items.length - 1 ? "border-b border-border/70" : ""
              }`}
            >
              <span className="flex min-w-0 items-center gap-2.5 text-muted-foreground">
                <span style={{ color: SIGNAL }} className="shrink-0 font-bold">
                  [OK]
                </span>
                <span className="truncate">{item.l}</span>
              </span>
              <span className="shrink-0 font-bold text-foreground">{item.n}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
