/**
 * Home hero — the opening shot of one continuous product film.
 *
 * It is built from references/01_HOME_DESKTOP_HERO.png (desktop) and
 * references/05_HOME_MOBILE_HERO.png (mobile), and the rule that shapes every
 * decision is unchanged: the reference is a SCENE, not a product shot. It has
 * an environment, a key light, a stone plinth, a luminous arc, light crossing
 * the frame and a lot of air around the device. So the scene is laid full-bleed
 * against the section's own black and allowed to run off the right and bottom
 * edges — never boxed, never rounded, never given a border. Anything that reads
 * as "a photo of a laptop inside a card" is the failure mode this file exists
 * to avoid.
 *
 * All typography is DOM. The plates carry no glyphs at all, which is what lets
 * one image serve CZ/EN/RU/UA and lets the page keep a real <h1>.
 *
 * ---------------------------------------------------------------------------
 * THE SHOT LIST
 *
 * The section registers one act on the page's timeline and pins its stage for
 * the first two thirds of it. Every beat below is timed against that pinned
 * window (`p` = `act.progress`), not against the section, so the choreography
 * cannot drift when the section's height changes:
 *
 *   SHOT 01  rest          p 0.00      the still plate, lit; type uncovered
 *                                      line by line; light filaments drifting;
 *                                      the camera answering the pointer.
 *   SHOT 02  camera move   p 0.05-0.55 the match cut into the clip, then the
 *                                      dolly: the rig pushes in, the laptop
 *                                      turns (real footage, not a CSS fake),
 *                                      the copy recedes faster than the set —
 *                                      that difference IS the depth.
 *   SHOT 03  the cut       p 0.62-1.00 the light does not fade, it travels: one
 *                                      streak crosses the frame while the set
 *                                      racks out of focus and sinks, and the
 *                                      services room rises into the space it
 *                                      leaves (ServicesShowcase's own entry
 *                                      transform picks the move up from here).
 *
 * Nothing here animates because it can. Under prefers-reduced-motion the rig,
 * the clip and the drift are all skipped and the approved still frame is what
 * remains — a complete hero, not a broken one.
 */
import { useEffect, useRef } from "react";
import { Link } from "@tanstack/react-router";
import { ArrowRight, ArrowDown } from "lucide-react";
import {
  motion,
  useInView,
  useMotionTemplate,
  useMotionValue,
  useSpring,
  useTransform,
  type MotionValue,
} from "framer-motion";
import { SceneImage } from "@/components/media/SceneImage";
import {
  BEAT,
  EASE,
  HERO_TAIL_MASK_END,
  HERO_TAIL_MASK_START,
  PERSPECTIVE,
  Z_ATMO,
  Z_LIGHT_BACK,
  Z_LIGHT_FRONT,
  Z_PLATE,
  depth,
  useAct,
  useMotionCapability,
} from "@/components/cinematic";
import { HeroCameraPlate } from "./HeroCameraPlate";
import { HeroLightField } from "./HeroLightField";
import { useT } from "@/lib/i18n";

/**
 * The act. Three viewports of track, the stage pinned for the first two — so
 * the pinned window is the first two thirds, and `act.progress` is the `p` the
 * whole shot list has always been cut against. The numbers live here rather
 * than in a local `useScroll` so the services room can ask how long the hero
 * runs instead of being tuned against it by hand.
 */
const HERO_VIEWPORTS = 3;
const HERO_PIN = 2 / 3;

/**
 * The tail mask, as two custom properties rather than two literals in the
 * class. The percentages are not this file's to choose: the services room sizes
 * its overlap against them, so they are read from the foundation — see
 * HERO_TAIL_MASK_START. The `lg:` gate stays on the class, where it was.
 */
const HERO_TAIL_MASK_VARS = {
  "--tail-start": `${(HERO_TAIL_MASK_START * 100).toFixed(2)}%`,
  "--tail-end": `${(HERO_TAIL_MASK_END * 100).toFixed(2)}%`,
} as React.CSSProperties;

/** The plate box, sized to the plate's own aspect (1400x1738) and capped. */
const PLATE_WIDTH = "min(62%, calc(100svh * 0.806))";

/**
 * THE EXPOSITION LAYER — the camera's title cards.
 *
 * The copy is gone by `p 0.3`, shot A runs to 0.55 and shot B to 1.0, so the
 * back half of the pinned window used to be two viewports of scrolling during
 * which the page said nothing at all. What fills it is not a second block of
 * copy and not a row of cards: while the camera travels past the device and out
 * into the dark, the frame runs titles — one service at a time, number, name,
 * tag, in the left column the headline just vacated so the eye does not have to
 * jump.
 *
 * The five services are the ones already translated for the services room
 * (`t.ui.serviceStage`), in the same order. Nothing here is invented, and no
 * key was added: these are exactly the five things the hero is supposed to be
 * naming, and naming them twice in two different sets of words would be the
 * real defect.
 */
/**
 * The first card is already rolling in at `p 0.24`, while the headline is on
 * its last few percent of opacity, and is held by `0.27`. Started after the
 * copy has fully gone instead, the shot holds a wordless beat right at the
 * handover — which is the exact defect this layer exists to remove.
 */
const TITLES_IN = 0.27;
/**
 * The last card clears exactly as the stage un-pins at `p = 1` and starts
 * travelling up, so the closing title leaves with the camera instead of
 * blinking out a viewport of scroll early. Both boundaries are measured, not
 * guessed: at 1440x900 the band that used to be wordless is `p 0.24 … 0.96`.
 */
const TITLES_OUT = 0.98;
const TITLE_SPAN = (TITLES_OUT - TITLES_IN) / 5;

/**
 * The gate the titles roll through, in pixels, and how much of `p` one card
 * spends crossing it.
 *
 * The travel is exactly the gate's height, and that equality is the whole
 * mechanism: at any moment during a handover the outgoing card covers the top
 * of the gate by exactly as much as the incoming card covers the bottom. So the
 * gate is never empty and the two cards never overlap — which is the difference
 * between a title roll and a list, and the reason this is a roll rather than a
 * cross-fade. Two names dissolving through each other on one origin is
 * unreadable mush; it was tried first and the frame proved it.
 */
const TITLE_GATE = 180;
const TITLE_TRANSIT = 0.03;

function HeroTitleCard({
  progress,
  index,
  title,
  tag,
}: {
  progress: MotionValue<number>;
  index: number;
  title: string;
  tag: string;
}) {
  const start = TITLES_IN + index * TITLE_SPAN;
  const end = start + TITLE_SPAN;
  /**
   * Enter from below, hold, leave through the top. Clamped at both ends, so a
   * card that is not on is parked a full gate away and clipped out of sight —
   * no opacity anywhere, which is what keeps the held card at full contrast
   * against the black instead of at whatever a fade happened to leave.
   *
   * It is a pure transform of the act's clock: no state, no timer, no
   * whileInView. Scrolling back up runs the titles backwards by construction
   * (R21).
   */
  const y = useTransform(
    progress,
    [start - TITLE_TRANSIT, start, end - TITLE_TRANSIT, end],
    [TITLE_GATE, 0, 0, -TITLE_GATE],
  );

  return (
    <motion.div style={{ y }} className="absolute inset-0 flex flex-col justify-center">
      {/* The only blue left in the shot once the headline has gone. One accent,
          never two — the same rule the headline follows. */}
      <span className="label-micro block text-primary">{String(index + 1).padStart(2, "0")}</span>
      <span className="heading-scene mt-2.5 block text-[clamp(1.3rem,0.8rem+1.1vw,1.8rem)] text-white uppercase">
        {title}
      </span>
      <span className="label-micro mt-2.5 block text-white/45">{tag}</span>
    </motion.div>
  );
}

export function HeroScene() {
  const { t } = useT();
  const cueRef = useRef<HTMLAnchorElement>(null);
  // One reading of the machine for the whole page. `still` is the visitor's own
  // setting and nothing else; a thin machine lands in `motion` and loses only
  // the footage.
  const capability = useMotionCapability();
  const reduced = capability === "still";
  const cinematic = capability === "cinematic";

  // The loop in the scroll cue is decorative continuity, not feedback, so it
  // must not keep running once it is off screen.
  const cueInView = useInView(cueRef, { amount: "some" });

  const act = useAct("hero", { viewports: HERO_VIEWPORTS, pin: HERO_PIN });
  const { raw: scrollYProgress, progress: p } = act;

  // ---- The camera itself: one translation and one dolly, for the whole rig.
  // The rig's dolly is deliberately small, and it belongs to shot A only. The
  // footage is already pushing in on its own and the two compound: pushed to
  // the value the rig alone wanted, the laptop stops being a laptop and becomes
  // a black wall. Once shot B takes over the move is entirely the camera's, so
  // the rig holds still and lets the footage carry it.
  const rigY = useTransform(p, [0, 0.55, 1], [0, reduced ? 0 : 60, reduced ? 0 : 72]);
  const rigZ = useTransform(p, [0, 0.55, 1], [0, reduced ? 0 : 90, reduced ? 0 : 104]);
  const rigRotate = useTransform(p, [0, 0.55, 1], [0, reduced ? 0 : -3.4, reduced ? 0 : -4]);
  /**
   * The set dims at the end of the shot but never disappears.
   *
   * A sticky stage is pinned for everything except its last viewport, and that
   * last viewport is the stage physically travelling up out of frame. Faded to
   * nothing it left a whole screen of empty black between the hero and the
   * services room — the exit was being animated AND scrolled, so it happened
   * twice. The scroll already carries the set away; this only takes the light
   * off it.
   */
  const sceneFade = useTransform(p, [0, 0.94, 1], [1, 1, reduced ? 1 : 0.72]);
  // Rack focus. Blur is the one expensive property in this section; it is bound
  // to a single element and only ever runs while the hero is on screen. It
  // arrives late and stays shallow — this is a lens losing the subject at the
  // end of a shot, not a page being smeared.
  const sceneBlurPx = useTransform(p, [0.9, 1], [0, reduced ? 0 : 3]);
  const sceneBlur = useMotionTemplate`blur(${sceneBlurPx}px)`;

  // The caption leaves faster than the set behind it — that difference is the
  // depth cue, not a decorative parallax.
  // It is gone well before shot B: the move past the device is a camera beat,
  // and type riding through it would turn a shot back into a slide.
  const copyY = useTransform(p, [0, 0.55], [0, reduced ? 0 : -128]);
  const copyScale = useTransform(p, [0, 0.55], [1, reduced ? 1 : 0.962]);
  const copyFade = useTransform(p, [0, 0.3], [1, reduced ? 1 : 0]);
  // The third depth: the small letterspaced elements leave faster than the
  // headline they surround, so the caption itself has front and back.
  const microY = useTransform(p, [0, 0.55], [0, reduced ? 0 : -52]);

  // ---- Pointer depth. The set and the caption answer in opposite directions
  // and by different amounts; the difference is the volume of the room. Fine
  // pointers only — on touch there is no cursor to answer to.
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
  const lightBackX = useTransform(smoothX, [-1, 1], [9, -9]);
  const lightBackY = useTransform(smoothY, [-1, 1], [6, -6]);
  const lightFrontX = useTransform(smoothX, [-1, 1], [30, -30]);
  const lightFrontY = useTransform(smoothY, [-1, 1], [18, -18]);
  const copyPX = useTransform(smoothX, [-1, 1], [-9, 9]);
  const copyPY = useTransform(smoothY, [-1, 1], [-6, 6]);
  const microPX = useTransform(smoothX, [-1, 1], [-14, 14]);

  // Below lg the scene is a stacked band rather than a set behind the copy, so
  // it keeps the plain treatment: no rig, no depth planes, no clip. A
  // perspective camera on a 390px band buys nothing and costs a composite.
  const mobileSceneY = useTransform(scrollYProgress, [0, 1], ["0%", reduced ? "0%" : "9%"]);
  const mobileSceneScale = useTransform(scrollYProgress, [0, 1], [1, reduced ? 1 : 1.08]);

  const disciplines = t.hero.sceneDisciplines;
  /** The five services, in the services room's own order — no new keys (R25). */
  const credits = t.ui.serviceStage;

  // ---- The scroll cue outlives the copy.
  // It used to fade with `copyFade`, which left the second half of the pinned
  // window with no sign that scrolling was still driving anything. Now the
  // written hint leaves with the copy and the rule stays, refilled as a meter:
  // the cue stops saying "scroll" and starts saying "you are here in the act".
  // A position indicator is the one place numbering earns itself — the same
  // argument that numbers the rail in ServicesShowcase.
  const cueFade = useTransform(p, [0, TITLES_OUT, 1.1], [1, 1, reduced ? 1 : 0]);
  const cueMeter = useTransform(p, [0, 0.3], [0, reduced ? 0 : 1]);
  const cueFill = useTransform(p, [0, 1], [0, 1], { clamp: true });

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
      /* Two viewports on wide screens: one for the shot list, one for the hand
         off. No overflow-hidden here — it would make this element a scroll
         container and the stage below would silently stop pinning. */
      className="relative isolate w-full bg-[#0A0D13] lg:h-[300svh]"
    >
      <div className="relative flex min-h-[100svh] flex-col overflow-hidden lg:sticky lg:top-0 lg:block lg:h-[100svh]">
        {/* ---- The camera rig ----------------------------------------------
            Four nested elements, each with exactly one job, because combining
            any two of them breaks the depth:

              outer   mask, opacity and blur. All three are grouping properties —
                      put any of them on the rig and the browser flattens its
                      preserve-3d children back to 2D, silently, and the whole
                      camera stops being a camera. `filter: blur(0px)` is enough
                      to do it.
              stage   perspective, and nothing else.
              rig     the camera's own move: translation, dolly and a few
                      degrees of arc.
              planes  depth() puts each plane at its distance and pre-scales it,
                      so at rest the frame renders exactly as the approved one. */}
        <motion.div
          style={{ opacity: sceneFade, filter: sceneBlur, ...HERO_TAIL_MASK_VARS }}
          className="pointer-events-none absolute inset-0 hidden lg:block lg:[mask-image:linear-gradient(to_bottom,#000_var(--tail-start),transparent_var(--tail-end))]"
        >
          <div className="absolute inset-0" style={{ perspective: `${PERSPECTIVE}px` }}>
            <motion.div
              style={{ y: rigY, z: rigZ, rotateY: rigRotate }}
              className="absolute inset-0 [transform-style:preserve-3d]"
            >
              {/* Atmosphere — the furthest plane. Every recognisable edge is
                  blurred out of it, so it can travel at its own rate without
                  any risk of reading as a doubled image of the set in front. */}
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

              {/* Light behind the set: the filaments that pass BEHIND the
                  device, plus the bloom where the arc lands. */}
              <div className="absolute inset-0" style={depth(Z_LIGHT_BACK)}>
                <HeroLightField
                  progress={p}
                  reduced={reduced}
                  layer="back"
                  pointerX={lightBackX}
                  pointerY={lightBackY}
                />
              </div>

              {/* The set. Sized to the plate's own aspect and capped at 62% of
                  the frame, so object-cover always fills it exactly — which is
                  what lets the left-edge mask land on the photograph instead of
                  on empty container, and the scene bleed into the copy field
                  instead of sitting in a box. */}
              <div className="absolute inset-0" style={depth(Z_PLATE)}>
                <motion.div
                  initial={reduced ? undefined : { opacity: 0, scale: 1.055 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 1.25, delay: BEAT.scene, ease: EASE }}
                  className="absolute inset-y-0 right-0 origin-bottom-right"
                  style={{ width: PLATE_WIDTH }}
                >
                  <HeroCameraPlate
                    progress={p}
                    reduced={reduced}
                    cinematic={cinematic}
                    pointerX={plateX}
                    pointerY={platePY}
                  />
                </motion.div>
              </div>

              {/* Light in front of the set — the strands that cross between the
                  camera and the stone. Nearest plane, so it answers the pointer
                  hardest; that is what sells the air as having depth. */}
              <div className="absolute inset-0" style={depth(Z_LIGHT_FRONT)}>
                <HeroLightField
                  progress={p}
                  reduced={reduced}
                  layer="front"
                  pointerX={lightFrontX}
                  pointerY={lightFrontY}
                />
              </div>
            </motion.div>
          </div>
        </motion.div>

        {/* ---- Copy --------------------------------------------------------
            Below lg the scene is not an underlay but the lower half of a stack,
            the way 05_HOME_MOBILE_HERO.png arranges it: copy on top, the phone
            standing on its stone underneath. Overlaying them on a narrow screen
            buries the CTA in the photograph. */}
        <motion.div
          style={{ y: copyY, scale: copyScale, opacity: copyFade }}
          className="container-luxe relative flex flex-none origin-left flex-col justify-center pt-24 pb-6 lg:h-full lg:pt-28 lg:pb-24"
        >
          <motion.div
            style={{ x: copyPX, y: copyPY }}
            className="max-w-[34rem] lg:max-w-[35rem] xl:max-w-[38rem]"
          >
            {/* Kicker with the reference's leading rule. The rule draws itself,
                which is what makes the kicker read as the opening stroke of the
                sequence rather than as one more thing fading in. */}
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

        {/* ---- The exposition layer ---------------------------------------
            Desktop only: below lg the section is a stacked band with no pinned
            stage, so there is no travel for titles to ride and the mobile
            composition stays exactly as 05_HOME_MOBILE_HERO.png sets it.

            Under `still` the layer is absent entirely. The approved static
            frame is a finished hero, and five lines stacked motionless on a
            photograph is not the same thing as a title roll.

            aria-hidden: these five names are the same five the services room
            below states in full, with links. Read out here they would be a
            duplicate listing whose one-at-a-time meaning does not survive
            linearisation — this is the camera's caption, not the page's copy. */}
        {!reduced && (
          <div
            aria-hidden
            className="pointer-events-none absolute inset-0 z-[5] hidden items-center lg:flex"
          >
            <div className="container-luxe w-full">
              {/* The gate. Its soft top and bottom edges are why a card can be
                  clipped mid-word during a handover without the frame looking
                  broken: the card that is leaving dims as it climbs out, the
                  card arriving is already at full strength by the time it is
                  readable, and the eye follows the arriving one. */}
              <div
                className="relative max-w-[24rem] overflow-hidden [mask-image:linear-gradient(to_bottom,transparent_0%,#000_18%,#000_82%,transparent_100%)]"
                style={{ height: TITLE_GATE }}
              >
                {credits.map((c, i) => (
                  <HeroTitleCard key={c.title} progress={p} index={i} title={c.title} tag={c.tag} />
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ---- Mobile scene: its own composition, not a shrunk desktop ------
            05_HOME_MOBILE_HERO.png stands the phone on the same stone under the
            copy. The plate keeps its own aspect so object-cover fills the band
            exactly, and the live light runs across it too — the one piece of
            the desktop rig that is cheap enough to keep here, and the piece
            that stops the band reading as a flat picture. */}
        <motion.div
          style={{ y: mobileSceneY, scale: mobileSceneScale }}
          className="pointer-events-none relative min-h-[42svh] flex-1 origin-bottom lg:hidden"
        >
          <motion.div
            initial={reduced ? undefined : { opacity: 0, y: 26, scale: 1.04 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 1.1, delay: BEAT.kicker, ease: EASE }}
            className="absolute inset-0 origin-bottom"
          >
            <SceneImage
              name="hero-iphone"
              priority
              sizes="70vw"
              alt=""
              className="absolute inset-y-0 right-0 block aspect-[720/1290] h-full"
              /* Two masks, intersected: the left edge blends the scene into the
                 copy field, and the top edge stops the band starting on a hard
                 horizontal seam under the CTA — on a narrow screen that seam is
                 the whole width and reads as a cut-out pasted on the page. */
              imgClassName="h-full w-full object-cover object-bottom [mask-image:linear-gradient(to_right,transparent_0%,#000_30%),linear-gradient(to_bottom,transparent_0%,#000_15%)] [mask-composite:intersect] [-webkit-mask-composite:source-in]"
            />
          </motion.div>
          <div className="absolute inset-0">
            <HeroLightField
              progress={p}
              reduced={reduced}
              layer="front"
              pointerX={lightFrontX}
              pointerY={lightFrontY}
            />
          </div>
        </motion.div>

        {/* ---- Scroll cue --------------------------------------------------
            Bottom-left vertical rule on desktop, exactly as the reference sets
            it; a round button on mobile, exactly as the mobile reference sets
            it. It is a real anchor to the section it points at. */}
        <motion.a
          ref={cueRef}
          href="#sluzby"
          style={{ opacity: cueFade }}
          className="group absolute bottom-8 left-6 z-10 hidden items-end gap-3 md:left-10 lg:flex"
          aria-label={t.ui?.homeServicesTitle ?? "Services"}
        >
          <motion.span
            style={{ opacity: copyFade }}
            className="label-micro text-white/45 transition-colors [writing-mode:vertical-rl] group-hover:text-white/80"
          >
            Scroll
          </motion.span>
          <span aria-hidden className="relative block h-24 w-px overflow-hidden bg-white/15">
            {/* The invitation: a pip running the rule while the copy is up. */}
            <motion.span
              className="absolute inset-x-0 top-0 block h-8 bg-primary"
              style={{ opacity: copyFade }}
              animate={reduced || !cueInView ? { y: "-100%" } : { y: ["-100%", "300%"] }}
              transition={
                reduced || !cueInView
                  ? { duration: 0 }
                  : { duration: 2.4, repeat: Infinity, ease: "easeInOut" }
              }
            />
            {/* The meter: the same rule, filled to the act's position, taking
                over exactly as the invitation leaves. */}
            <motion.span
              className="absolute inset-x-0 top-0 block h-full origin-top bg-primary/80"
              style={{ scaleY: cueFill, opacity: cueMeter }}
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
      </div>
    </section>
  );
}

export default HeroScene;
