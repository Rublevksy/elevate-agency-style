/**
 * Home hero — a rebuild of references/01_HOME_DESKTOP_HERO.png (desktop) and
 * references/05_HOME_MOBILE_HERO.png (mobile) as a live page.
 *
 * The rule that shapes every decision here: the reference is a SCENE, not a
 * product shot. It has an environment, a key light, a stone plinth, a luminous
 * arc, light waves crossing the frame and a lot of air around the device. So
 * the plate is laid full-bleed against the section's own black and allowed to
 * run off the right and bottom edges — never boxed, never rounded, never given
 * a border. Anything that reads as "a photo of a laptop inside a card" is the
 * failure mode this component exists to avoid.
 *
 * All typography is DOM. The plates from src/assets/refs/ carry no glyphs at
 * all, which is what lets one image serve CZ/EN/RU/UA and lets the page keep a
 * real <h1>.
 *
 * MOTION THESIS — the page has exactly one authored idea, and both this file
 * and ServicesShowcase.tsx serve it: a camera that never cuts to a new page.
 * It settles onto the lit device, the type is revealed under it, then on scroll
 * the camera pulls back and racks focus off the device — which is the moment
 * the services room takes over. Nothing here animates because it can:
 *
 *   - arrival    the plate settles from a slight push-in; type is uncovered
 *                line by line rather than floating up, because display type at
 *                this size reads as a title card, not as a list item;
 *   - departure  the scene loses focus and sinks while the copy recedes
 *                *faster* — the parallax split is what creates depth between a
 *                foreground caption and a background set;
 *   - feedback   the scroll cue is a real anchor and its loop stops the moment
 *                it leaves the viewport.
 */
import { useEffect, useRef } from "react";
import { Link } from "@tanstack/react-router";
import { ArrowRight, ArrowDown } from "lucide-react";
import {
  motion,
  useInView,
  useMotionTemplate,
  useMotionValue,
  useReducedMotion,
  useScroll,
  useSpring,
  useTransform,
} from "framer-motion";
import { SceneImage } from "@/components/media/SceneImage";
import { useT } from "@/lib/i18n";

/** The project's one easing curve. */
const EASE = [0.22, 1, 0.36, 1] as const;

/**
 * The camera. `PERSPECTIVE` is the focal length; the two Z values are where the
 * planes stand in front of it. `depth()` returns the transform that puts a
 * plane at a depth and pre-scales it by the exact inverse of the projection at
 * that depth, so a plane placed with it renders identically to no transform at
 * all until the rig moves.
 */
const PERSPECTIVE = 1400;
const Z_PLATE = -250;
const Z_ATMO = -800;
const depth = (z: number): React.CSSProperties => ({
  transform: `translateZ(${z}px) scale(${(PERSPECTIVE - z) / PERSPECTIVE})`,
});

/** The plate box, sized to the plate's own aspect and capped at 62% of frame. */
const PLATE_WIDTH = "min(62%, calc(100svh * 0.826))";

/**
 * The light layer never subtracts. At the trough of its cycle it contributes
 * nothing and the frame is exactly the approved one; at the peak it lifts the
 * arc and the rim by a sixth. Seventeen seconds is slow enough to be felt
 * rather than watched — this is a room breathing, not a pulse.
 */
const LIGHT_REST = 0;
const LIGHT_PEAK = 0.16;

/**
 * Beats of the arrival, in seconds. The whole sequence is capped at about a
 * second: a focal entrance may be authored (500-800ms per animate.md), but a
 * visitor must not be made to wait through choreography before they can read.
 */
const BEAT = {
  scene: 0,
  kicker: 0.18,
  headline: 0.3,
  headlineStep: 0.11,
  support: 0.68,
  supportStep: 0.07,
} as const;

export function HeroScene() {
  const { t } = useT();
  const ref = useRef<HTMLElement>(null);
  const cueRef = useRef<HTMLAnchorElement>(null);
  const reduced = useReducedMotion();

  // The loop in the scroll cue is decorative continuity, not feedback, so it
  // must not keep running once it is off screen.
  const cueInView = useInView(cueRef, { amount: "some" });
  // The light cycle is ambient, not feedback: it must not keep running once the
  // scene has left the screen.
  const sceneInView = useInView(ref, { amount: 0.15 });

  // The departure. One scroll position drives every layer so they cannot
  // disagree; the differences between them are what read as depth.
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });
  // The camera itself: one translation and one dolly, for the whole rig. Every
  // difference between the planes falls out of their depth rather than being
  // dialled in separately, which is what makes it read as a camera and not as
  // four elements that happen to move at different speeds.
  const rigY = useTransform(scrollYProgress, [0, 1], [0, reduced ? 0 : 84]);
  const rigZ = useTransform(scrollYProgress, [0, 1], [0, reduced ? 0 : -330]);
  const sceneFade = useTransform(scrollYProgress, [0, 0.9], [1, reduced ? 1 : 0.12]);
  // The light goes down with the camera: as the set recedes it stops being lit.
  const lightScroll = useTransform(scrollYProgress, [0, 0.55], [1, reduced ? 1 : 0]);
  // Rack focus. Blur is the one expensive property in this section; it is bound
  // to a single element and only ever runs while the hero is on screen.
  const sceneBlurPx = useTransform(scrollYProgress, [0, 1], [0, reduced ? 0 : 7]);
  const sceneBlur = useMotionTemplate`blur(${sceneBlurPx}px)`;
  // The caption leaves faster than the set behind it — that difference is the
  // depth cue, not a decorative parallax.
  const copyY = useTransform(scrollYProgress, [0, 1], [0, reduced ? 0 : -110]);
  const copyScale = useTransform(scrollYProgress, [0, 1], [1, reduced ? 1 : 0.965]);
  const copyFade = useTransform(scrollYProgress, [0, 0.55], [1, reduced ? 1 : 0]);

  // Camera depth. The pointer moves the set and the caption by different
  // amounts and in opposite directions — the difference is the depth, and it is
  // kept small enough that it reads as the scene having volume rather than as
  // an effect. Fine pointers only: on touch there is no cursor to answer to.
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

  const plateX = useTransform(smoothX, [-1, 1], [16, -16]);
  const platePY = useTransform(smoothY, [-1, 1], [11, -11]);
  const copyPX = useTransform(smoothX, [-1, 1], [-9, 9]);
  const copyPY = useTransform(smoothY, [-1, 1], [-6, 6]);
  const microPX = useTransform(smoothX, [-1, 1], [-14, 14]);

  // The third depth. The small letterspaced elements — kicker, disciplines,
  // scroll cue — leave faster than the headline they surround, so the caption
  // itself has front and back rather than travelling as one flat card.
  const microY = useTransform(scrollYProgress, [0, 1], [0, reduced ? 0 : -46]);

  // Below lg the scene is a stacked band rather than a set behind the copy, so
  // it keeps the plain treatment: no rig, no depth planes, no light layer. A
  // perspective camera on a 390px band buys nothing and costs a composite.
  const mobileSceneY = useTransform(scrollYProgress, [0, 1], ["0%", reduced ? "0%" : "9%"]);
  const mobileSceneScale = useTransform(scrollYProgress, [0, 1], [1, reduced ? 1 : 1.08]);

  const disciplines = t.hero.sceneDisciplines;

  /** Supporting copy: shorter, quieter, and behind the headline in the order. */
  const support = (i: number) => ({
    initial: reduced ? undefined : { opacity: 0, y: 14 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.55, delay: BEAT.support + i * BEAT.supportStep, ease: EASE },
  });

  /** One headline line, uncovered from below rather than floated in. */
  const headlineLine = (i: number, children: React.ReactNode, accent = false) => (
    <span className="block overflow-hidden pb-[0.08em]">
      <motion.span
        initial={reduced ? undefined : { y: "108%" }}
        animate={{ y: "0%" }}
        transition={{
          duration: 0.85,
          delay: BEAT.headline + i * BEAT.headlineStep,
          ease: EASE,
        }}
        className={`block ${accent ? "text-primary" : ""}`}
      >
        {children}
      </motion.span>
    </span>
  );

  return (
    <section
      ref={ref}
      className="relative isolate min-h-[100svh] w-full overflow-hidden bg-[#0A0D13]"
    >
      {/* ---- The camera rig ------------------------------------------------
          Four nested elements, each with exactly one job, because combining any
          two of them breaks the depth:

            outer   mask, opacity and blur. All three are grouping properties —
                    put any of them on the rig and the browser flattens its
                    preserve-3d children back to 2D, silently, and the whole
                    camera stops being a camera. `filter: blur(0px)` is enough
                    to do it.
            stage   perspective, and nothing else.
            rig     the camera's own move: one translation, one dolly.
            planes  depth() puts each plane at its distance and pre-scales it by
                    (P - z) / P, the exact inverse of the projection there — so
                    at rest the frame renders pixel for pixel as it did flat.

          Nothing about the approved composition changes until the camera moves.
          When it does, the planes separate on their own: one translation of the
          rig displaces a near plane further across the screen than a far one,
          and pulls the near plane's scale down faster. That is real parallax
          rather than hand-tuned numbers pretending to be depth. */}
      <motion.div
        style={{ opacity: sceneFade, filter: sceneBlur }}
        className="pointer-events-none absolute inset-0 hidden lg:block lg:[mask-image:linear-gradient(to_bottom,#000_58%,transparent_86%)]"
      >
        <div className="absolute inset-0" style={{ perspective: `${PERSPECTIVE}px` }}>
          <motion.div
            style={{ y: rigY, z: rigZ }}
            className="absolute inset-0 [transform-style:preserve-3d]"
          >
            {/* Atmosphere — the furthest plane. Every recognisable edge is
                blurred out of it, so it can travel at its own rate without any
                risk of reading as a doubled image of the set in front. */}
            <div className="absolute inset-0" style={depth(Z_ATMO)}>
              <SceneImage
                name="hero-atmo"
                priority
                alt=""
                sizes="70vw"
                className="absolute inset-y-0 right-0 block"
                style={{ width: "min(80%, calc(100svh * 1.06))" }}
                imgClassName="h-full w-full object-cover opacity-60 [mask-image:radial-gradient(70%_60%_at_58%_45%,#000,transparent_80%)]"
              />
            </div>

            {/* The set, and the light registered on top of it. They share one
                plane on purpose: the blend has to composite against the
                photograph, and a 3D-transformed element is its own stacking
                context, so a light layer on its own plane would blend against
                nothing. Sharing the plane also guarantees the two boxes resolve
                their percentage width against the same parent — which is what
                keeps the light aligned to the pixel. */}
            <div className="absolute inset-0" style={depth(Z_PLATE)}>
              {/* The box is sized to the plate's own aspect (1400x1695 = 0.826)
                  and capped at 62% of the frame, so object-cover always fills
                  it exactly — which is what lets the left-edge mask land on the
                  photograph instead of on empty container, and the scene bleed
                  into the copy field instead of sitting in a box. */}
              <motion.div
                initial={reduced ? undefined : { opacity: 0, scale: 1.055 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 1.25, delay: BEAT.scene, ease: EASE }}
                className="absolute inset-y-0 right-0 origin-bottom-right"
                style={{ width: PLATE_WIDTH }}
              >
                {/* Pointer depth rides on its own layer so it composes with the
                    rig above instead of fighting it for the same channel. */}
                <motion.div style={{ x: plateX, y: platePY }} className="h-full w-full">
                  <SceneImage
                    name="hero-macbook"
                    priority
                    sizes="(min-width: 1280px) 58vw, 62vw"
                    alt=""
                    className="block h-full w-full"
                    imgClassName="h-full w-full object-cover object-right-bottom [mask-image:linear-gradient(to_right,transparent_0%,#000_24%)]"
                  />
                </motion.div>
              </motion.div>

              {/* Light. A matte derived from the photograph's own luminance, so
                  what brightens is exactly the arc, the lid rim, the engraving,
                  the waves and the speckle on the stone. It never moves — only
                  its intensity changes — and it never goes below zero, so the
                  scene is never lit differently from the reference, only at
                  times a little more. */}
              <motion.div
                style={{ opacity: lightScroll, width: PLATE_WIDTH }}
                className="absolute inset-y-0 right-0 mix-blend-screen"
              >
                <motion.div
                  initial={reduced ? undefined : { opacity: 0 }}
                  animate={
                    reduced || !sceneInView
                      ? { opacity: LIGHT_REST }
                      : { opacity: [LIGHT_REST, LIGHT_PEAK, LIGHT_REST] }
                  }
                  transition={
                    reduced || !sceneInView
                      ? { duration: 0.8, ease: EASE }
                      : { duration: 17, repeat: Infinity, ease: "easeInOut", delay: 1.1 }
                  }
                  className="h-full w-full"
                >
                  <motion.div style={{ x: plateX, y: platePY }} className="h-full w-full">
                    <SceneImage
                      name="hero-light"
                      alt=""
                      sizes="(min-width: 1280px) 58vw, 62vw"
                      className="block h-full w-full"
                      imgClassName="h-full w-full object-cover object-right-bottom [mask-image:linear-gradient(to_right,transparent_0%,#000_24%)]"
                    />
                  </motion.div>
                </motion.div>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </motion.div>

      {/* ---- Copy ----------------------------------------------------------
          Below lg the scene is not an underlay but the lower half of a stack,
          the way 05_HOME_MOBILE_HERO.png arranges it: copy on top, the phone
          standing on its stone underneath. Overlaying them on a narrow screen
          buries the CTA in the photograph. */}
      <div className="relative flex min-h-[100svh] flex-col lg:block">
        <motion.div
          style={{ y: copyY, scale: copyScale, opacity: copyFade }}
          className="container-luxe relative flex flex-none origin-left flex-col justify-center pt-24 pb-6 lg:min-h-[100svh] lg:pt-28 lg:pb-24"
        >
          <motion.div
            style={{ x: copyPX, y: copyPY }}
            className="max-w-[34rem] lg:max-w-[35rem] xl:max-w-[38rem]"
          >
            {/* Kicker with the reference's leading rule. The craft floor bans
              eyebrows by default; prompt.md ranks /references above it and the
              reference sets one, so it stays — a deliberate override. The rule
              draws itself, which is what makes the kicker read as the opening
              stroke of the sequence rather than as one more thing fading in. */}
            <motion.p
              style={{ y: microY, x: microPX }}
              className="label-micro flex items-center gap-4 text-white/55"
            >
              <motion.span
                aria-hidden
                initial={reduced ? undefined : { scaleX: 0 }}
                animate={{ scaleX: 1 }}
                transition={{ duration: 0.7, delay: BEAT.kicker, ease: EASE }}
                className="h-px w-10 origin-left bg-white/30"
              />
              <motion.span
                initial={reduced ? undefined : { opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5, delay: BEAT.kicker + 0.1, ease: EASE }}
              >
                {t.hero.sceneKicker}
              </motion.span>
            </motion.p>

            <h1 className="heading-scene mt-6 text-[clamp(1.8rem,1.05rem+2.2vw,2.95rem)] text-white lg:uppercase">
              {headlineLine(0, t.hero.sceneLine1)}
              {headlineLine(1, t.hero.sceneLine2)}
              {/* One accent line, never more: the blue is the scarcest thing in
                the reference and it stops meaning anything if it spreads. */}
              {headlineLine(2, t.hero.sceneAccent, true)}
            </h1>

            <motion.p
              {...support(0)}
              className="mt-5 max-w-[30rem] text-[0.9375rem] leading-relaxed text-white/60 sm:text-base lg:mt-7"
            >
              {t.hero.sceneSubtitle}
            </motion.p>

            <motion.ul
              {...support(1)}
              style={{ y: microY, x: microPX }}
              className="label-micro mt-6 flex flex-wrap items-center gap-x-3 gap-y-2 text-white/45 lg:mt-8"
            >
              {disciplines.map((d, i) => (
                <li key={d} className="flex items-center gap-3">
                  {i > 0 && <span aria-hidden className="size-[3px] rounded-full bg-primary/70" />}
                  {d}
                </li>
              ))}
            </motion.ul>

            <motion.div {...support(2)} className="mt-7 flex flex-wrap items-center gap-4 lg:mt-10">
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
            </motion.div>
          </motion.div>
        </motion.div>

        {/* mobile / small tablet scene — in flow, filling what the copy left */}
        <motion.div
          style={{ y: mobileSceneY, scale: mobileSceneScale, opacity: sceneFade }}
          className="pointer-events-none relative min-h-[40svh] flex-1 origin-bottom lg:hidden"
        >
          {/* Same box-fits-plate trick as the desktop branch, turned upright:
              the box takes the phone plate's own aspect so object-cover fills
              it exactly and the left-edge mask lands on the photograph rather
              than on empty container. Squeezing this portrait plate into a
              full-width band instead crops it so hard the phone stops reading
              as a phone. */}
          <motion.div
            initial={reduced ? undefined : { opacity: 0, y: 26, scale: 1.04 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 1.1, delay: BEAT.kicker, ease: EASE }}
            className="absolute inset-0 origin-bottom"
          >
            <SceneImage
              name="hero-iphone"
              priority
              sizes="60vw"
              alt=""
              className="absolute inset-y-0 right-0 block aspect-[720/1296] h-full"
              imgClassName="h-full w-full object-cover object-bottom [mask-image:linear-gradient(to_right,transparent_0%,#000_30%)]"
            />
          </motion.div>
        </motion.div>
      </div>

      {/* ---- Scroll cue ----------------------------------------------------
          Bottom-left vertical rule on desktop, exactly as the reference sets
          it; a round button on mobile, exactly as the mobile reference sets
          it. It is a real anchor to the section it points at. */}
      <motion.a
        ref={cueRef}
        href="#sluzby"
        style={{ opacity: copyFade, y: microY }}
        /* Clear of the services section, which is pulled up over the hero's
           last 14vh and paints opaque — parked at bottom-8 the cue sat behind
           it and only a sliver showed. */
        className="group absolute bottom-8 left-6 z-10 hidden items-end gap-3 md:left-10 lg:flex lg:bottom-[calc(14vh+1.5rem)]"
        aria-label={t.ui?.homeServicesTitle ?? "Services"}
      >
        <span className="label-micro text-white/45 transition-colors [writing-mode:vertical-rl] group-hover:text-white/80">
          Scroll
        </span>
        <span aria-hidden className="relative block h-24 w-px overflow-hidden bg-white/15">
          <motion.span
            className="absolute inset-x-0 top-0 block h-8 bg-primary"
            animate={reduced || !cueInView ? { y: "-100%" } : { y: ["-100%", "300%"] }}
            transition={
              reduced || !cueInView
                ? { duration: 0 }
                : { duration: 2.4, repeat: Infinity, ease: "easeInOut" }
            }
          />
        </span>
      </motion.a>

      <motion.a
        href="#sluzby"
        style={{ opacity: copyFade }}
        className="absolute bottom-8 left-1/2 z-10 flex size-11 -translate-x-1/2 items-center justify-center rounded-full border border-white/25 text-white/70 backdrop-blur-[2px] transition-colors hover:border-primary hover:text-primary lg:hidden"
        aria-label={t.ui?.homeServicesTitle ?? "Services"}
      >
        <ArrowDown className="size-4" aria-hidden />
      </motion.a>
    </section>
  );
}

export default HeroScene;
