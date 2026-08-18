import { useRef, useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { motion, useReducedMotion, useScroll, useSpring, useTransform } from "framer-motion";
import { useT } from "@/lib/i18n";
import { Logo } from "@/components/Logo";
import { ExploreSwitcher } from "@/components/design-explore/ExploreSwitcher";
import { RefImage, type RefName } from "@/components/design-explore/RefImage";

/**
 * /design-v4 — "Аппаратная" / control room (ticket 05, spec §V4).
 *
 * Thesis: the page is the studio's instrument panel. The real photograph is
 * not merely displayed — it is *dissected* by technical annotation, so the
 * site demonstrates that the studio measures and assembles.
 *
 * This is the direction spec.md flags as nearest to the banned generic
 * dark-tech look, so three guardrails are load-bearing, not decoration:
 *   1. Hero is asymmetric — the title block and the console readout are
 *      unequal modules on a 12-column template, never mirrored halves.
 *   2. The services grid uses explicit, differing column/row spans — no
 *      repeating equal cell anywhere on the page.
 *   3. The background stays flat near-black; saturation lives only inside
 *      panels, the annotation strokes and the scan line.
 *
 * Self-contained: nothing imported from src/components/hero/**, production
 * sections, or sibling design-v* routes. All human-facing copy comes from
 * useT(); the only invented strings are machine chrome (module ids, prompt
 * glyphs), which carry no claims.
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
/**
 * Second cool technical tone (spec §V4 "Committed → Full palette"): same
 * family as --primary, shifted lighter/cyaner so data reads as instrument
 * output rather than as another brand accent. Local to this route.
 */
const SIGNAL = "oklch(0.82 0.13 205)";

/** Route order matches t.ui.serviceStage order (Weby, SEO, E-shopy, Značka, Aplikace). */
const SERVICE_SLOTS: { to: "/services" | "/services/web" | "/services/eshop" | "/services/branding"; ref: RefName; id: string }[] = [
  { to: "/services/web", ref: "svc-web", id: "MOD.01" },
  { to: "/services", ref: "svc-seo", id: "MOD.02" },
  { to: "/services/eshop", ref: "svc-eshop", id: "MOD.03" },
  { to: "/services/branding", ref: "svc-branding", id: "MOD.04" },
  { to: "/services", ref: "svc-app", id: "MOD.05" },
];

/**
 * Explicitly unequal grid placement (criterion: one large + compacts, never a
 * repeated cell). Columns are on a 12-track template at md and up.
 */
const SERVICE_LAYOUT = [
  "md:col-span-8 md:row-span-2", // large demonstrative module
  "md:col-span-5",
  "md:col-span-3",
  "md:col-span-7",
  "md:col-span-5",
];

export default function DesignV4Page() {
  return (
    <div
      className="relative min-h-screen overflow-x-hidden bg-[#050608] text-white"
      style={{ fontFamily: DISPLAY_FONT }}
    >
      <ExploreSwitcher active="design-v4" />
      <ScanLine />
      <HeroBay />
      <ServiceBay />
      <BuildLog />
      <TerminalCta />
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Scan line — the narrative thread. Travels the viewport as the page   */
/* scrolls; modules resolve as it passes them.                          */
/* ------------------------------------------------------------------ */

function ScanLine() {
  const reduced = useReducedMotion();
  const { scrollYProgress } = useScroll();
  const smooth = useSpring(scrollYProgress, { stiffness: 60, damping: 22, mass: 0.4 });
  const top = useTransform(smooth, [0, 1], ["6%", "94%"]);
  const opacity = useTransform(smooth, [0, 0.04, 0.9, 1], [0, 1, 1, 0]);
  if (reduced) return null;
  return (
    <motion.div
      aria-hidden="true"
      className="pointer-events-none fixed inset-x-0 z-40 h-px"
      style={{
        top,
        opacity,
        background: `linear-gradient(90deg, transparent, ${SIGNAL} 18%, ${SIGNAL} 82%, transparent)`,
        boxShadow: `0 0 18px ${SIGNAL}`,
      }}
    />
  );
}

/** Shared reveal for every module: enters as the scan line sweeps past it. */
function Module({
  children,
  className,
  delay = 0,
}: {
  children: React.ReactNode;
  className?: string;
  delay?: number;
}) {
  const reduced = useReducedMotion();
  return (
    <motion.div
      className={className}
      initial={reduced ? false : { opacity: 0, y: 26, filter: "blur(6px)" }}
      whileInView={reduced ? undefined : { opacity: 1, y: 0, filter: "blur(0px)" }}
      viewport={{ once: true, margin: "-12% 0px -12% 0px" }}
      transition={{ duration: 0.7, delay, ease: [0.22, 1, 0.36, 1] }}
    >
      {children}
    </motion.div>
  );
}

/* ------------------------------------------------------------------ */
/* Hero — the exhibit and its annotation                                */
/* ------------------------------------------------------------------ */

/**
 * Annotation geometry is expressed in the natural pixel space of
 * src/assets/refs/hero-macbook (1200×1137) and the overlay <svg> shares the
 * image's box and aspect ratio, so every vertex below stays glued to a real
 * feature of the photograph:
 *   lid top-left (150,162) · lid top-right (912,266) · lid bottom-right
 *   (1084,872) · base front-left (18,892) · base front corner (292,986) ·
 *   engraved logo centre (664,524).
 * If the crop in scripts/extract-ref-assets.mjs ever changes, these move.
 */
const LID_TL = { x: 150, y: 162 };
const LID_TR = { x: 912, y: 266 };
const LID_BR = { x: 1084, y: 872 };
const BASE_L = { x: 18, y: 892 };
const BASE_C = { x: 292, y: 986 };
const LOGO = { x: 664, y: 524 };

function HeroBay() {
  const { t } = useT();
  const reduced = useReducedMotion();
  const heroRef = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ["start start", "end start"],
  });
  const plateY = useTransform(scrollYProgress, [0, 1], [0, reduced ? 0 : -60]);

  const trustLines: [string, string][] = [
    ["YRS", t.trust.years],
    ["PRJ", t.trust.projects],
    ["GEO", t.trust.clients],
    ["SLA", t.trust.response],
  ];

  return (
    <section ref={heroRef} className="relative px-4 pb-16 pt-28 sm:px-6 md:pt-32 lg:px-10">
      {/* Asymmetric 12-track bay: title 5 tracks flush left, exhibit 7 tracks
          pushed right and one row lower — deliberately not two halves. */}
      <div className="mx-auto grid max-w-[1400px] grid-cols-1 gap-8 md:grid-cols-12 md:gap-6">
        <div className="md:col-span-5 md:pt-10">
          <Logo className="h-7 w-auto" />
          <p
            className="mt-8 text-[11px] uppercase tracking-[0.34em] text-white/45"
            style={{ fontFamily: MONO_FONT }}
          >
            {t.hero.tag}
          </p>
          <h1
            className="mt-5 text-[clamp(2.3rem,6vw,4.4rem)] font-extrabold leading-[0.98] tracking-tight"
            style={{ fontFamily: DISPLAY_FONT }}
          >
            {t.hero.title1}
            <br />
            <span style={{ color: SIGNAL }}>{t.hero.title2}</span>
          </h1>
          <p className="mt-6 max-w-md text-sm leading-relaxed text-white/60 sm:text-base">
            {t.hero.subtitle}
          </p>

          {/* Console readout — real t.trust values, nothing invented. */}
          <div
            className="mt-9 max-w-md border border-white/12 bg-white/[0.03]"
            style={{ fontFamily: MONO_FONT }}
          >
            <div className="flex items-center justify-between border-b border-white/10 px-3 py-2 text-[10px] uppercase tracking-[0.22em] text-white/40">
              <span>studio / readout</span>
              <span style={{ color: SIGNAL }}>● online</span>
            </div>
            <dl className="divide-y divide-white/[0.06]">
              {trustLines.map(([key, value], i) => (
                <motion.div
                  key={key}
                  className="flex items-baseline gap-3 px-3 py-2 text-[11px] sm:text-xs"
                  initial={reduced ? false : { opacity: 0, x: -8 }}
                  animate={reduced ? undefined : { opacity: 1, x: 0 }}
                  transition={{ delay: 0.9 + i * 0.14, duration: 0.4 }}
                >
                  <dt className="w-9 shrink-0 text-white/35">{key}</dt>
                  <dd className="text-white/80">{value}</dd>
                </motion.div>
              ))}
            </dl>
          </div>

          <div className="mt-8 flex flex-wrap gap-3">
            <Link
              to="/contact"
              className="border px-5 py-3 text-xs uppercase tracking-[0.2em] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/60"
              style={{ fontFamily: MONO_FONT, borderColor: SIGNAL, color: SIGNAL }}
            >
              {t.hero.cta1}
            </Link>
            <Link
              to="/projects"
              className="border border-white/15 px-5 py-3 text-xs uppercase tracking-[0.2em] text-white/70 transition-colors hover:border-white/40 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/60"
              style={{ fontFamily: MONO_FONT }}
            >
              {t.hero.cta2}
            </Link>
          </div>
        </div>

        <motion.div className="md:col-span-7 md:col-start-6" style={{ y: plateY }}>
          <ExhibitPlate />
        </motion.div>
      </div>
    </section>
  );
}

/** The photograph plus the drawn-on technical annotation (the WOW moment). */
function ExhibitPlate() {
  const reduced = useReducedMotion();
  const draw = (delay: number) =>
    reduced
      ? { initial: false as const, animate: undefined }
      : {
          initial: { pathLength: 0, opacity: 0 },
          animate: { pathLength: 1, opacity: 1 },
          transition: { pathLength: { duration: 1.1, delay, ease: "easeInOut" as const }, opacity: { duration: 0.2, delay } },
        };
  const label = (delay: number) =>
    reduced
      ? { initial: false as const, animate: undefined }
      : {
          initial: { opacity: 0 },
          animate: { opacity: 1 },
          transition: { duration: 0.5, delay },
        };

  return (
    <div className="relative">
      <RefImage
        name="hero-macbook"
        priority
        alt="MacBook na kamenné desce se světelným obloukem"
        className="block"
        imgClassName="h-auto w-full"
        sizes="(min-width: 768px) 58vw, 100vw"
      />
      {/* Soft edge blend so the dark photo meets the page without a visible seam. */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(120% 100% at 50% 45%, transparent 55%, rgba(5,6,8,0.55) 82%, #050608 100%)",
        }}
      />
      <svg
        aria-hidden="true"
        viewBox="0 0 1200 1137"
        preserveAspectRatio="xMidYMid meet"
        className="pointer-events-none absolute inset-0 h-full w-full"
        style={{ fontFamily: MONO_FONT }}
      >
        <g stroke={SIGNAL} fill="none" strokeWidth={2} vectorEffect="non-scaling-stroke">
          {/* Framing corners */}
          <motion.path d="M60 132 L60 76 L128 76" {...draw(0.25)} />
          <motion.path d="M1140 76 L1140 132" {...draw(0.3)} />
          <motion.path d="M60 1010 L60 1064 L128 1064" {...draw(0.35)} />
          <motion.path d="M1140 1064 L1072 1064" {...draw(0.4)} />

          {/* Lid top edge, traced onto the real silhouette */}
          <motion.path
            d={`M${LID_TL.x} ${LID_TL.y} L${LID_TR.x} ${LID_TR.y}`}
            {...draw(0.55)}
          />
          {/* Lid right edge down to the hinge corner */}
          <motion.path d={`M${LID_TR.x} ${LID_TR.y} L${LID_BR.x} ${LID_BR.y}`} {...draw(0.7)} />
          {/* Base front edge */}
          <motion.path d={`M${BASE_L.x} ${BASE_L.y} L${BASE_C.x} ${BASE_C.y}`} {...draw(0.85)} />

          {/* Leader from the top-left lid corner out to the frame */}
          <motion.path d={`M${LID_TL.x} ${LID_TL.y} L84 108`} {...draw(0.95)} strokeWidth={1} />
          {/* Leader from the hinge corner out to the right margin */}
          <motion.path
            d={`M${LID_BR.x} ${LID_BR.y} L1152 872`}
            {...draw(1.05)}
            strokeWidth={1}
          />
          {/* Dimension bar under the lid width with end ticks */}
          <motion.path d="M150 1096 L912 1096" {...draw(1.15)} strokeWidth={1} />
          <motion.path d="M150 1082 L150 1110 M912 1082 L912 1110" {...draw(1.2)} strokeWidth={1} />

          {/* Crosshair over the engraved mark */}
          <motion.path
            d={`M${LOGO.x - 74} ${LOGO.y} L${LOGO.x - 22} ${LOGO.y} M${LOGO.x + 22} ${LOGO.y} L${LOGO.x + 74} ${LOGO.y} M${LOGO.x} ${LOGO.y - 74} L${LOGO.x} ${LOGO.y - 26} M${LOGO.x} ${LOGO.y + 26} L${LOGO.x} ${LOGO.y + 74}`}
            {...draw(1.3)}
            strokeWidth={1}
          />
          <motion.circle
            cx={LOGO.x}
            cy={LOGO.y}
            r={94}
            {...draw(1.35)}
            strokeWidth={1}
            strokeDasharray="6 10"
            opacity={0.7}
          />
          {/* Leader taking the mark callout off the engraving, drawing-style */}
          <motion.path
            d={`M${LOGO.x - 68} ${LOGO.y - 68} L${LOGO.x - 156} ${LOGO.y - 156} L${LOGO.x - 250} ${LOGO.y - 156}`}
            {...draw(1.4)}
            strokeWidth={1}
          />
        </g>

        <g
          fill={SIGNAL}
          fontSize={20}
          letterSpacing="2"
          stroke="#050608"
          strokeWidth={5}
          strokeLinejoin="round"
          style={{ paintOrder: "stroke fill" }}
        >
          <motion.text x={92} y={96} {...label(1.5)}>
            REF-01 / LID
          </motion.text>
          {/* Sits above its own leader line (y=872) so the rule never crosses the glyphs */}
          <motion.text x={1160} y={840} textAnchor="end" {...label(1.6)}>
            HINGE 128°
          </motion.text>
          <motion.text x={531} y={1078} {...label(1.7)}>
            762 U
          </motion.text>
          {/* Parked at the end of its leader, clear of the engraved ELEVATE mark */}
          <motion.text x={LOGO.x - 164} y={LOGO.y - 168} textAnchor="end" {...label(1.8)}>
            MARK / OK
          </motion.text>
        </g>
      </svg>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Services — unequal modules plus the live channel                     */
/* ------------------------------------------------------------------ */

function ServiceBay() {
  const { t } = useT();
  const services = t.ui.serviceStage;
  const [channel, setChannel] = useState(0);
  const active = SERVICE_SLOTS[channel] ?? SERVICE_SLOTS[0];

  return (
    <section className="relative px-4 py-20 sm:px-6 md:py-28 lg:px-10">
      <div className="mx-auto max-w-[1400px]">
        <header className="flex flex-wrap items-end justify-between gap-4 border-b border-white/10 pb-5">
          <div>
            <p
              className="text-[11px] uppercase tracking-[0.32em] text-white/40"
              style={{ fontFamily: MONO_FONT }}
            >
              {t.ui.homeServicesEyebrow}
            </p>
            <h2
              className="mt-3 text-[clamp(1.7rem,3.6vw,2.9rem)] font-extrabold leading-tight"
              style={{ fontFamily: DISPLAY_FONT }}
            >
              {t.ui.homeServicesTitle}
            </h2>
          </div>
          <span
            className="text-[10px] uppercase tracking-[0.28em] text-white/30"
            style={{ fontFamily: MONO_FONT }}
          >
            BAY / 05 MODULES
          </span>
        </header>

        <div className="mt-8 grid grid-cols-1 gap-4 md:grid-cols-12">
          {/* Live channel — a real photographed scene, framed like a video tile. */}
          <Module className="md:col-span-4 md:row-span-2" delay={0}>
            <div className="relative h-full overflow-hidden border border-white/12 bg-white/[0.02]">
              <div
                className="flex items-center justify-between border-b border-white/10 px-3 py-2 text-[10px] uppercase tracking-[0.22em] text-white/45"
                style={{ fontFamily: MONO_FONT }}
              >
                <span>&gt; STUDIO / LIVE</span>
                <span className="flex items-center gap-1.5" style={{ color: SIGNAL }}>
                  <span className="inline-block h-1.5 w-1.5 rounded-full bg-current" />
                  REC
                </span>
              </div>
              <div className="relative aspect-[4/5] w-full overflow-hidden md:aspect-auto md:h-[calc(100%-2.25rem)]">
                <RefImage
                  key={active.ref}
                  name={active.ref}
                  alt={services[channel]?.title ?? ""}
                  className="block h-full w-full"
                  imgClassName="h-full w-full object-cover object-top"
                  sizes="(min-width: 768px) 32vw, 100vw"
                />
                <div
                  aria-hidden="true"
                  className="pointer-events-none absolute inset-0"
                  style={{
                    background:
                      "linear-gradient(180deg, transparent 55%, rgba(5,6,8,0.75) 100%)",
                  }}
                />
                <p
                  className="absolute bottom-3 left-3 right-3 text-[11px] leading-snug text-white/85"
                  style={{ fontFamily: MONO_FONT }}
                >
                  {services[channel]?.tag}
                </p>
              </div>
            </div>
          </Module>

          {services.map((service: { title: string; tag: string }, i: number) => {
            const slot = SERVICE_SLOTS[i];
            const large = i === 0;
            return (
              <Module key={slot.to} className={SERVICE_LAYOUT[i]} delay={0.08 * (i + 1)}>
                <Link
                  to={slot.to}
                  onMouseEnter={() => setChannel(i)}
                  onFocus={() => setChannel(i)}
                  className={`group flex h-full flex-col justify-between border p-5 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/60 ${
                    channel === i
                      ? "border-white/35 bg-white/[0.05]"
                      : "border-white/10 bg-white/[0.02] hover:border-white/30"
                  } ${large ? "min-h-[16rem] md:min-h-[19rem]" : "min-h-[10rem]"}`}
                >
                  <div
                    className="flex items-center justify-between text-[10px] uppercase tracking-[0.24em] text-white/35"
                    style={{ fontFamily: MONO_FONT }}
                  >
                    <span>{slot.id}</span>
                    <span style={{ color: channel === i ? SIGNAL : undefined }}>
                      {channel === i ? "ACTIVE" : "IDLE"}
                    </span>
                  </div>
                  <div className="mt-8">
                    <h3
                      className={`font-extrabold leading-tight ${
                        large
                          ? "text-[clamp(1.6rem,3vw,2.5rem)]"
                          : "text-[clamp(1.05rem,1.7vw,1.4rem)]"
                      }`}
                      style={{ fontFamily: DISPLAY_FONT }}
                    >
                      {service.title}
                    </h3>
                    <p
                      className={`mt-3 text-white/55 ${large ? "max-w-md text-sm sm:text-base" : "text-xs"}`}
                      style={{ fontFamily: MONO_FONT }}
                    >
                      {service.tag}
                    </p>
                    <span
                      className="mt-4 inline-block text-[10px] uppercase tracking-[0.24em] text-white/40 transition-colors group-hover:text-white"
                      style={{ fontFamily: MONO_FONT }}
                    >
                      {t.ui.homeServicesLearn} →
                    </span>
                  </div>
                </Link>
              </Module>
            );
          })}
        </div>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/* Build log — proof block as a monospace log, not icon cards           */
/* ------------------------------------------------------------------ */

function BuildLog() {
  const { t } = useT();
  return (
    <section className="relative px-4 py-20 sm:px-6 md:py-24 lg:px-10">
      <div className="mx-auto max-w-[1100px]">
        <p
          className="text-[11px] uppercase tracking-[0.32em] text-white/40"
          style={{ fontFamily: MONO_FONT }}
        >
          {t.results.eyebrow}
        </p>
        <h2
          className="mt-3 text-[clamp(1.6rem,3.4vw,2.6rem)] font-extrabold leading-tight"
          style={{ fontFamily: DISPLAY_FONT }}
        >
          {t.results.title}
        </h2>

        <div
          className="mt-8 border border-white/12 bg-white/[0.02]"
          style={{ fontFamily: MONO_FONT }}
        >
          <div className="border-b border-white/10 px-4 py-2 text-[10px] uppercase tracking-[0.22em] text-white/40">
            build.log
          </div>
          <ul className="divide-y divide-white/[0.06]">
            {t.results.items.map((item: { n: string; l: string }, i: number) => (
              <Module key={item.l} delay={0.1 * i}>
                <li className="flex flex-wrap items-baseline gap-x-4 gap-y-1 px-4 py-3 text-xs sm:text-sm">
                  <span className="text-white/30">
                    [{String(i + 1).padStart(2, "0")}]
                  </span>
                  <span className="font-bold" style={{ color: SIGNAL }}>
                    {item.n}
                  </span>
                  <span className="text-white/60">{item.l}</span>
                  <span className="ml-auto text-[10px] uppercase tracking-[0.2em] text-white/25">
                    ok
                  </span>
                </li>
              </Module>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/* CTA — terminal frame                                                 */
/* ------------------------------------------------------------------ */

function TerminalCta() {
  const { t } = useT();
  return (
    <section className="relative px-4 pb-28 pt-6 sm:px-6 lg:px-10">
      <Module className="mx-auto max-w-[1100px]">
        <div className="border" style={{ borderColor: "rgba(255,255,255,0.14)" }}>
          <div
            className="flex items-center justify-between border-b border-white/10 px-4 py-2 text-[10px] uppercase tracking-[0.22em] text-white/40"
            style={{ fontFamily: MONO_FONT }}
          >
            <span>elevate — session</span>
            <span style={{ color: SIGNAL }}>ready</span>
          </div>
          <div className="px-5 py-10 sm:px-10 sm:py-14">
            <p
              className="text-xs text-white/40"
              style={{ fontFamily: MONO_FONT }}
            >
              &gt; init contact
            </p>
            <h2
              className="mt-4 text-[clamp(1.8rem,4.4vw,3.2rem)] font-extrabold leading-tight"
              style={{ fontFamily: DISPLAY_FONT }}
            >
              {t.cta.title}
            </h2>
            <p className="mt-4 max-w-xl text-sm text-white/60 sm:text-base">{t.cta.subtitle}</p>
            <Link
              to="/contact"
              className="mt-8 inline-block border px-6 py-3.5 text-xs uppercase tracking-[0.2em] transition-colors hover:bg-white/[0.06] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/60"
              style={{ fontFamily: MONO_FONT, borderColor: SIGNAL, color: SIGNAL }}
            >
              {t.cta.btn}
            </Link>
          </div>
        </div>
      </Module>
    </section>
  );
}
