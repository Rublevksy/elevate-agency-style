/**
 * /proto hero — candidate 6 ("the browser-portal") proved inside a real page.
 *
 * This is deliberately NOT a rebuild of `HeroScene`. The production hero's
 * shot list spends four viewports pushing the camera physically INTO a
 * glowing screen (see `HeroScene.tsx`'s own header comment) — which is
 * exactly why `ServicesShowcase.tsx` documents, by name, that a bordered
 * browser-chrome panel after it "puts the visitor straight back outside,
 * looking at a picture of a website" and undoes the shot that earned it.
 *
 * This prototype has a different premise, given directly by the owner: the
 * browser window IS the hero object, not something the camera flies into.
 * Real, DOM-drawn browser chrome — traffic dots, a real address bar reading
 * the real domain, layered UI panels — is the explicit brief this time, not
 * the thing `ServicesShowcase` was built to avoid repeating. That tension is
 * real and is disclosed here rather than silently resolved: this is a
 * prototype route, isolated from the shipping page, precisely so this
 * question can be judged on its own rendered result instead of by rule.
 *
 * What IS reused, because it is genuinely load-bearing and not hero-specific:
 * `useAct`/`useMotionCapability` (the one scroll reading and the one motion
 * gate), `EASE`/`PERSPECTIVE`/`depth()` (the camera math), and every word of
 * copy — `t.hero.*` is the real, shipping ELEVATE headline, not new text.
 */
import { useEffect, useRef } from "react";
import { Link } from "@tanstack/react-router";
import { ArrowRight } from "lucide-react";
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import {
  BEAT,
  EASE,
  PERSPECTIVE,
  Z_ATMO,
  Z_LIGHT_FRONT,
  Z_PLATE,
  depth,
  useAct,
  useMotionCapability,
} from "@/components/cinematic";
import { useT } from "@/lib/i18n";
import { Logo } from "@/components/Logo";
import { ProtoCandidate6Image } from "./ProtoImage";
import {
  PROTO_HERO_PIN,
  PROTO_HERO_VIEWPORTS,
  PROTO_TAIL_MASK_END,
  PROTO_TAIL_MASK_START,
} from "./proto-tokens";

const TAIL_MASK_VARS = {
  "--tail-start": `${(PROTO_TAIL_MASK_START * 100).toFixed(2)}%`,
  "--tail-end": `${(PROTO_TAIL_MASK_END * 100).toFixed(2)}%`,
} as React.CSSProperties;

/**
 * The browser-chrome panel — the one new UI element this prototype adds.
 *
 * Dots are neutral white, never red/amber/green: `PRODUCT.md`'s one-accent
 * rule (the brand blue is the only chromatic colour anywhere on the page)
 * applies to drawn UI exactly as much as to a generated plate, and coloured
 * traffic lights would be a second and third hue for no reason. The address
 * bar reads the real domain — never invented copy, never a fake path.
 */
function BrowserChrome({
  path,
  children,
  className,
}: {
  path: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div
      className={`overflow-hidden rounded-2xl border border-white/12 bg-white/[0.04] shadow-[0_40px_120px_-40px_oklch(0_0_0/0.8),0_0_0_1px_oklch(1_0_0/0.02)] backdrop-blur-2xl ${className ?? ""}`}
    >
      <div className="flex items-center gap-2 border-b border-white/8 bg-white/[0.03] px-4 py-3">
        <span className="size-2 rounded-full bg-white/25" />
        <span className="size-2 rounded-full bg-white/25" />
        <span className="size-2 rounded-full bg-white/25" />
        <div className="ml-3 flex h-6 flex-1 items-center rounded-full bg-black/30 px-3">
          {/* white/45 measured too low-contrast for the one string in the
              hero whose whole job is proving authenticity — Assessment A,
              P2. white/70 keeps it quiet next to the headline while
              actually reading as the real domain, not a placeholder. */}
          <span className="truncate font-mono text-[11px] tracking-wide text-white/70">{path}</span>
        </div>
      </div>
      {children}
    </div>
  );
}

export function ProtoHero() {
  const { t } = useT();
  const capability = useMotionCapability();
  const reduced = capability === "still";

  const act = useAct("proto-hero", { viewports: PROTO_HERO_VIEWPORTS, pin: PROTO_HERO_PIN });
  const { progress: p } = act;

  // The panel closes the distance across the pinned window — the one thing
  // in this scene that moves toward the camera, so scrolling reads as
  // approaching the window rather than as the page merely advancing.
  const panelScale = useTransform(p, [0, 1], [1, reduced ? 1 : 1.22]);
  const panelZ = useTransform(p, [0, 1], [0, reduced ? 0 : 140]);
  const panelY = useTransform(p, [0, 1], [0, reduced ? 0 : -36]);

  const backdropScale = useTransform(p, [0, 1], [1, reduced ? 1 : 1.08]);
  const sceneFade = useTransform(p, [0, PROTO_TAIL_MASK_START, 1], [1, 1, reduced ? 1 : 0.55]);
  // The chrome panel needs its OWN fade, all the way to 0 across the same
  // tail-mask window the backdrop uses — found by Assessment A's browser
  // evidence, not by inspection: the panel is a sibling outside the
  // backdrop's masked wrapper, so without this it never dims and instead
  // gets a hard rectangular clip from the section's own `overflow-hidden`
  // boundary as it scrolls past, and a leftover shard is what was still
  // on screen at the same time as the next section's own panel.
  const panelFade = useTransform(
    p,
    [PROTO_TAIL_MASK_START, PROTO_TAIL_MASK_END],
    [1, reduced ? 1 : 0],
  );

  const copyY = useTransform(p, [0, 0.5], [0, reduced ? 0 : -110]);
  const copyFade = useTransform(p, [0, 0.32], [1, reduced ? 1 : 0]);
  const copyScale = useTransform(p, [0, 0.5], [1, reduced ? 1 : 0.968]);

  // Pointer depth — the panel answers hardest, the backdrop barely at all;
  // that difference is what sells the gap between them as real air rather
  // than as two flat images stacked with z-index. Fine pointers only.
  const pointerX = useMotionValue(0);
  const pointerY = useMotionValue(0);
  const smoothX = useSpring(pointerX, { stiffness: 55, damping: 18, mass: 0.7 });
  const smoothY = useSpring(pointerY, { stiffness: 55, damping: 18, mass: 0.7 });

  useEffect(() => {
    if (reduced || typeof window === "undefined") return;
    if (!window.matchMedia("(pointer: fine)").matches) return;
    const onMove = (e: PointerEvent) => {
      pointerX.set((e.clientX / window.innerWidth) * 2 - 1);
      pointerY.set((e.clientY / window.innerHeight) * 2 - 1);
    };
    window.addEventListener("pointermove", onMove, { passive: true });
    return () => window.removeEventListener("pointermove", onMove);
  }, [reduced, pointerX, pointerY]);

  const panelPX = useTransform(smoothX, [-1, 1], [22, -22]);
  const panelPY = useTransform(smoothY, [-1, 1], [14, -14]);
  const backdropPX = useTransform(smoothX, [-1, 1], [8, -8]);
  const backdropPY = useTransform(smoothY, [-1, 1], [5, -5]);
  const chipsPX = useTransform(smoothX, [-1, 1], [-10, 10]);

  const disciplines = t.hero.sceneDisciplines;

  const headlineLine = (i: number, children: React.ReactNode, accent = false) => (
    <span className="block overflow-hidden pb-[0.08em]">
      <motion.span
        initial={reduced ? undefined : { y: "108%" }}
        animate={{ y: "0%" }}
        transition={{ duration: 0.85, delay: BEAT.headline + i * BEAT.headlineStep, ease: EASE }}
        className={`block ${accent ? "text-primary" : ""}`}
      >
        {children}
      </motion.span>
    </span>
  );

  return (
    <section
      ref={act.ref}
      style={
        { "--proto-track": `${(PROTO_HERO_VIEWPORTS * 100).toFixed(2)}svh` } as React.CSSProperties
      }
      className="relative isolate w-full bg-[#0A0D13] lg:h-[var(--proto-track)]"
    >
      <div className="relative flex min-h-[100svh] flex-col overflow-hidden lg:sticky lg:top-0 lg:block lg:h-[100svh]">
        {/* ---- Backdrop: candidate 6, full-bleed right, never boxed ------- */}
        <motion.div
          style={{ opacity: sceneFade, ...TAIL_MASK_VARS }}
          className="pointer-events-none absolute inset-0 lg:[mask-image:linear-gradient(to_bottom,#000_var(--tail-start),transparent_var(--tail-end))]"
        >
          <div className="absolute inset-0" style={{ perspective: `${PERSPECTIVE}px` }}>
            <div className="absolute inset-0 [transform-style:preserve-3d]">
              <div className="absolute inset-0" style={depth(Z_ATMO)}>
                <motion.div
                  style={{ scale: backdropScale, x: backdropPX, y: backdropPY }}
                  className="absolute inset-0"
                >
                  <ProtoCandidate6Image
                    priority
                    className="absolute inset-0 block h-full w-full"
                    imgClassName="h-full w-full object-cover opacity-[0.35] blur-2xl [mask-image:radial-gradient(75%_65%_at_62%_45%,#000,transparent_82%)]"
                  />
                </motion.div>
              </div>
              <div className="absolute inset-0" style={depth(Z_PLATE)}>
                <motion.div
                  initial={reduced ? undefined : { opacity: 0, scale: 1.05 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 1.2, ease: EASE }}
                  style={{ scale: backdropScale, x: backdropPX, y: backdropPY }}
                  className="absolute inset-0"
                >
                  <ProtoCandidate6Image
                    priority
                    className="absolute inset-0 block h-full w-full"
                    imgClassName="h-full w-full object-cover [mask-image:radial-gradient(88%_78%_at_66%_46%,#000,transparent_92%)]"
                  />
                </motion.div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* ---- Copy --------------------------------------------------------
            Same field as the production hero: kicker, three-line H1, one
            accent line, subtitle, disciplines, two CTAs — real strings,
            nothing invented for this prototype. */}
        <motion.div
          style={{ y: copyY, scale: copyScale, opacity: copyFade }}
          className="container-luxe relative z-10 hidden flex-none origin-left flex-col justify-center pt-28 pb-24 lg:flex lg:h-full"
        >
          <div className="max-w-[34rem] lg:max-w-[35rem] xl:max-w-[38rem]">
            <p className="label-micro flex items-center gap-4 text-white/55">
              <span aria-hidden className="h-px w-10 bg-white/30" />
              <span>{t.hero.sceneKicker}</span>
            </p>

            <h1 className="heading-scene mt-6 text-[clamp(1.8rem,1.05rem+2.2vw,2.95rem)] text-white lg:uppercase">
              {headlineLine(0, t.hero.sceneLine1)}
              {headlineLine(1, t.hero.sceneLine2)}
              {headlineLine(2, t.hero.sceneAccent, true)}
            </h1>

            <p className="mt-5 max-w-[30rem] text-[0.9375rem] leading-relaxed text-white/60 sm:text-base lg:mt-7">
              {t.hero.sceneSubtitle}
            </p>

            <ul className="label-micro mt-6 flex flex-wrap items-center gap-x-3 gap-y-2 text-white/45 lg:mt-8">
              {disciplines.map((d, i) => (
                <li key={d} className="flex items-center gap-3">
                  {i > 0 && <span aria-hidden className="size-[3px] rounded-full bg-primary/70" />}
                  {d}
                </li>
              ))}
            </ul>

            <div className="mt-7 flex flex-wrap items-center gap-4 lg:mt-10">
              <Link to="/contact" className="btn-primary">
                {t.hero.cta1}
                <ArrowRight className="size-4" aria-hidden />
              </Link>
              <Link
                to="/projects"
                className="text-sm font-medium text-white/70 underline-offset-8 transition-colors hover:text-white hover:underline"
              >
                {t.hero.cta2}
              </Link>
            </div>
          </div>
        </motion.div>

        {/* ---- The browser-chrome panel -------------------------------
            The one new interface element: a real, DOM-drawn browser window,
            not a picture of one. It sits over the portal's own opening in
            the backdrop and closes distance with the camera as the visitor
            scrolls, so the "window opening" the plate depicts becomes
            something the page is actually doing, not just showing. */}
        <motion.div
          style={{ perspective: `${PERSPECTIVE}px`, opacity: panelFade }}
          className="absolute inset-0 z-[6] hidden items-center justify-end pr-[6%] lg:flex"
        >
          <motion.div
            style={{ scale: panelScale, z: panelZ, y: panelY }}
            initial={reduced ? undefined : { opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.15, ease: EASE }}
            className="w-[30rem] xl:w-[34rem]"
          >
            {/* Pointer depth lives on its own nested layer — combining a
                scroll-driven `y` and a pointer-driven `y` on one element
                is the bug HeroScene's plate/copy split exists to avoid: one
                motion value silently wins and the other stops applying. */}
            <motion.div style={{ x: panelPX, y: panelPY }}>
              <BrowserChrome path="elevateit.cz">
                <div className="flex flex-col items-center gap-4 bg-gradient-to-b from-white/[0.06] to-transparent px-8 py-10">
                  <Logo className="h-6 w-auto opacity-90" />
                  <div
                    aria-hidden
                    className="h-px w-16 bg-gradient-to-r from-transparent via-primary to-transparent"
                  />
                  <span className="label-micro text-white/50">{t.hero.sceneKicker}</span>
                </div>
              </BrowserChrome>
            </motion.div>
          </motion.div>
        </motion.div>

        {/* ---- Disciplines chip strip — a second, nearer floating panel,
            depth(Z_LIGHT_FRONT) so it answers the pointer hardest of
            anything on screen. Real data, same five words as the headline
            column, just given a second, closer plane to live on. */}
        <motion.div
          style={{ x: chipsPX, opacity: panelFade }}
          className="pointer-events-none absolute bottom-[14%] right-[8%] z-[7] hidden lg:block"
        >
          <div className="rounded-full border border-white/10 bg-black/40 px-5 py-2.5 backdrop-blur-lg">
            <span className="label-micro text-white/55">{disciplines[0]}</span>
          </div>
        </motion.div>

        {/* ---- Mobile: its own stacked composition, not the desktop scaled
            down. Chrome panel first (smaller, static), copy beneath it. */}
        <div className="relative flex flex-1 flex-col justify-end px-6 pb-10 pt-6 lg:hidden">
          <div className="relative mb-8 w-full">
            <ProtoCandidate6Image
              priority
              className="absolute inset-0 block h-full w-full"
              imgClassName="h-full w-full rounded-3xl object-cover opacity-70 [mask-image:radial-gradient(120%_100%_at_50%_30%,#000,transparent_92%)]"
            />
            <div className="relative">
              <BrowserChrome path="elevateit.cz" className="mx-auto max-w-xs">
                <div className="flex flex-col items-center gap-3 px-6 py-8">
                  <Logo className="h-5 w-auto opacity-90" />
                  <span className="label-micro text-white/50">{t.hero.sceneKicker}</span>
                </div>
              </BrowserChrome>
            </div>
          </div>

          <p className="label-micro text-white/55">{t.hero.sceneKicker}</p>
          <h1 className="heading-scene mt-4 text-[clamp(1.7rem,1.1rem+2vw,2.4rem)] text-white uppercase">
            {t.hero.sceneLine1}
            <br />
            {t.hero.sceneLine2}
            <br />
            <span className="text-primary">{t.hero.sceneAccent}</span>
          </h1>
          <p className="mt-4 text-[0.9375rem] leading-relaxed text-white/60">
            {t.hero.sceneSubtitle}
          </p>
          <div className="mt-6 flex flex-wrap items-center gap-4">
            <Link to="/contact" className="btn-primary">
              {t.hero.cta1}
              <ArrowRight className="size-4" aria-hidden />
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}

export default ProtoHero;
