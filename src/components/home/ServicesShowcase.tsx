/**
 * Services — the room the camera entered, in five takes.
 *
 * The hero ends square-on inside a lit screen. This section is what is on the
 * other side of it, so it is built with the hero's grammar and not with its own:
 * the scene runs full height against the section's black, the type stands in the
 * left half where the hero's headline stood, and the chapter changes by the
 * camera finding a different part of the room.
 *
 * WHAT THIS REPLACED, AND WHY. The previous build put the room inside a
 * rounded, bordered pane with browser chrome — traffic-light dots, a fake URL —
 * and gave it half of one grid column. Three things were wrong with it and only
 * the third is about taste:
 *
 *   1. It contradicted the shot before it. The hero spends four viewports
 *      pushing the camera INTO a screen; landing on a small framed rectangle
 *      puts the visitor straight back outside, looking at a picture of a
 *      website. The cut undid the shot that earned it.
 *   2. The photograph was ~300px wide inside it. The five plates are the
 *      approved art direction (ADR 0011) and they were being shown at thumbnail
 *      size behind glass.
 *   3. A bordered translucent card with a chrome bar is the generic product-page
 *      container the brief rules out by name.
 *
 * The wipe, the drift and the settle survived that rebuild unchanged — they were
 * never the problem. Only the box around them was.
 *
 * THE SHOT LIST, against `act.progress`:
 *
 *   p 0.00-0.09  the chapter card (kicker, heading, lead) rides up and out of
 *                frame, exactly as the hero's copy does, uncovering the rail.
 *                No scroll is reserved for it: the room is already there and the
 *                first service is already up, so this reads as the camera
 *                settling rather than as a slide being advanced.
 *   p 0.05-1.00  five takes of one room. Each cut is a clip-path wipe with a
 *                light edge riding its boundary, and the title in the left
 *                column rolls through a gate the same way the hero's titles do.
 *
 * Order is fixed by the reference and matches t.ui.serviceStage exactly:
 * 01 Web, 02 SEO, 03 E-shop, 04 Branding, 05 Apps. Changing one without the
 * other silently mislabels every panel.
 */
import { useState } from "react";
import { Link } from "@tanstack/react-router";
import { ArrowRight } from "lucide-react";
import { motion, type MotionValue, useMotionValueEvent, useTransform } from "framer-motion";
import {
  EASE,
  HERO_TAIL_MASK_START,
  useAct,
  useMotionCapability,
  useStageAct,
} from "@/components/cinematic";
import { SceneImage, type SceneName } from "@/components/media/SceneImage";
import { useT } from "@/lib/i18n";

/**
 * The act. Four and a bit viewports of track, of which the pane is pinned for
 * everything except its own last viewport — the pane is exactly one viewport
 * tall, so it un-pins when the section's bottom reaches the viewport's bottom.
 *
 * Declaring the pin honestly matters beyond this file: the register exists so a
 * neighbour can work out an overlap instead of being tuned against by hand, and
 * a section that declares a pin it does not have is the same lie as the magic
 * number this task removes. `act.progress` is then numerically the reading this
 * section always used — the rail, the wipe and `jumpToBeat` all keep their
 * meaning.
 */
const SERVICES_VIEWPORTS = 4.4;
const SERVICES_PIN = (SERVICES_VIEWPORTS - 1) / SERVICES_VIEWPORTS;

/**
 * THE JOIN.
 *
 * A sticky act spends its last stretch of track physically travelling up out of
 * frame — `viewports * (1 - pin)` of it — and that travel is the only length
 * this section may hand itself to. The services room rises through the last
 * fraction of the hero's departure, so the two are moving at once instead of
 * queueing: that is what makes them one camera move.
 *
 * It is a FRACTION of a length the hero declares, never a number in `vh`. The
 * old `-mt-[42vh]` was tuned against one screen height and against a mask in
 * the hero it could not see; change the hero's track and it silently became
 * wrong. This cannot: ask the register, and if the hero is not on this route
 * (every other page) the answer is zero and the section is an ordinary one.
 *
 * The same length is the ramp of the section's ground, and that equality is the
 * mechanism. The ground used to be an opaque fill starting at the section's
 * edge, which cut the hero's still-lit set in a hard horizontal line — the seam.
 * Ramped across exactly the overlap, the ground arrives at the rate the hero's
 * own tail mask leaves, so the set fades out through the same band the room
 * fades in. Nothing is hidden: the hero's tail is still played, still racked
 * out of focus, and is now visible while it happens.
 */
const JOIN_OF_HERO_DEPARTURE = 1 - HERO_TAIL_MASK_START;

/**
 * The room's box, anchored to the right edge and sized to the plates' own
 * aspect (594x886), so `object-cover` fills it exactly and the left-edge mask
 * lands on photograph rather than on empty container.
 *
 * `108svh` rather than `100svh` on purpose: letting the plate run a little past
 * the top and bottom edges is what stops it reading as a picture standing in
 * the section, and buys the width that makes the room enveloping instead of
 * adjacent. It is the hero's own PLATE_WIDTH construction, one step closer in —
 * which is the correct relationship, because the camera has just moved inside.
 */
const ROOM_ASPECT = 594 / 886;
const ROOM_WIDTH = `min(64%, calc(108svh * ${ROOM_ASPECT}))`;

/** Scene plate + destination per service, in showcase order. */
const SERVICES: ReadonlyArray<{ scene: SceneName; route: string }> = [
  { scene: "svc-web", route: "/services/web" },
  { scene: "svc-seo", route: "/audit" },
  { scene: "svc-eshop", route: "/services/eshop" },
  { scene: "svc-branding", route: "/services/branding" },
  { scene: "svc-app", route: "/contact" },
];

/** How much of the pinned window the chapter card takes to leave. */
const CARD_OUT = 0.09;

/** The gate the service titles roll through, in pixels. */
const TITLE_GATE = 132;

export function ServicesShowcase() {
  const { t } = useT();
  const capability = useMotionCapability();
  const reduced = capability === "still";
  const [active, setActive] = useState(0);

  const items = t.ui.serviceStage.slice(0, SERVICES.length);
  const count = SERVICES.length;

  const act = useAct("services", { viewports: SERVICES_VIEWPORTS, pin: SERVICES_PIN });
  const { ref, progress, enter } = act;

  // Ask the neighbour rather than being tuned against it. `undefined` here is
  // not an error — it is every route that has no hero — and it resolves to no
  // overlap and an ordinary opaque ground.
  const hero = useStageAct("hero");
  const heroDeparture = hero ? hero.viewports * (1 - hero.pin) : 0;
  const join = `${(JOIN_OF_HERO_DEPARTURE * heroDeparture * 100).toFixed(2)}vh`;

  // The arrival, read from the same clock as everything else. The hero hands
  // over to this: as the hero's set loses focus and sinks, this one rises the
  // last few pixels into place, so the two sections read as one camera move
  // rather than as two pages meeting at a seam.
  const introY = useTransform(enter, [0, 1], [reduced ? 0 : 54, 0]);
  const introScale = useTransform(enter, [0, 1], [reduced ? 1 : 0.975, 1]);
  const introFade = useTransform(enter, [0, 0.65], [reduced ? 1 : 0.35, 1]);
  const handoffGlow = useTransform(enter, [0, 0.55, 1], [0, reduced ? 0 : 1, 0]);

  // The chapter card leaves the way the hero's headline leaves: upward, a
  // little faster than the scene behind it, and gone before the reader has to
  // choose between reading it and reading the service.
  const cardY = useTransform(progress, [0, CARD_OUT], [0, reduced ? 0 : -96]);
  const cardFade = useTransform(progress, [0, CARD_OUT], [1, reduced ? 1 : 0]);
  // ...and what it uncovers arrives just behind it, never at the same instant.
  const listFade = useTransform(progress, [CARD_OUT * 0.55, CARD_OUT * 1.5], [0, 1]);

  // The camera's own move through the room. It runs CONTINUOUSLY across the
  // whole section rather than resetting at each service, because the five
  // plates are one room: a drift that restarted on every cut would announce
  // the cut and turn the room back into five pictures. The wipe changes what
  // we are looking at; this keeps the camera moving while it happens.
  const sceneDriftY = useTransform(progress, [0, 1], [reduced ? 0 : 26, reduced ? 0 : -26]);
  const sceneDriftX = useTransform(progress, [0, 1], [reduced ? 0 : -14, reduced ? 0 : 14]);
  // One slow push-in across the whole act, so the room keeps closing on the
  // reader even while a given take is holding still.
  const roomScale = useTransform(progress, [0, 1], [1, reduced ? 1 : 1.05]);

  // One scroll position drives both the rail and the window. The rail reads the
  // continuous value; the window reads the stepped one, so the change of take is
  // decisive while the thread down the left stays smooth.
  useMotionValueEvent(progress, "change", (p) => {
    const next = Math.min(count - 1, Math.max(0, Math.floor(p * count * 0.999)));
    setActive((prev) => (prev === next ? prev : next));
  });

  // scaleY rather than an animated height: a transform is composited and does
  // not force layout on every scroll frame.
  const railFill = useTransform(progress, [0, 1], [0, 1]);

  /**
   * The rail is a control, not an ornament: clicking a beat drives the page to
   * the scroll position that beat owns. Without this the numbers are a picture
   * of navigation rather than navigation, and the section is unreachable by
   * keyboard except by scrolling through all five.
   */
  const jumpToBeat = (i: number) => {
    const el = ref.current;
    if (!el || typeof window === "undefined") return;
    const top = el.getBoundingClientRect().top + window.scrollY;
    const travel = el.offsetHeight - window.innerHeight;
    if (travel <= 0) return;
    window.scrollTo({
      top: top + ((i + 0.5) / count) * travel,
      behavior: reduced ? "auto" : "smooth",
    });
  };

  return (
    <section
      ref={ref}
      id="sluzby"
      /* Pulled up into the tail of the hero on wide screens by exactly the
         computed join — see JOIN_OF_HERO_DEPARTURE. The custom property carries
         the one length; the `lg:` prefixes keep the whole join off the stacked
         mobile layout, where there is no pinned hero to hand anything over. */
      style={{ "--join": join } as React.CSSProperties}
      className="relative z-10 lg:h-[440vh] lg:[margin-top:calc(-1*var(--join))]"
      aria-label={t.ui.homeServicesTitle}
    >
      {/* The room's own ground, and the reason there is no seam. It is a layer
          rather than the section's `background` because a background cannot be
          ramped: it would arrive all at once at the section's edge and cut the
          hero's lit set in a hard line. Ramped across the join, it reaches full
          strength exactly where the overlap ends — and below `lg`, where there
          is no overlap, the ramp has zero length and it is simply opaque. */}
      <div
        aria-hidden
        className="absolute inset-0 -z-10 bg-[#0A0D13] lg:[mask-image:linear-gradient(to_bottom,transparent_0,#000_var(--join))]"
      />
      {/* Light carried across the cut. It exists only during the handoff and is
          gone by the time the section settles, so it can never read as a
          decorative gradient parked behind the content. */}
      <motion.div
        aria-hidden
        style={{ opacity: handoffGlow }}
        className="pointer-events-none absolute inset-x-0 top-0 hidden lg:block lg:[height:var(--join)]"
      >
        {/* Masked top and bottom for the same reason the ground is ramped: a
            radial gradient is brightest at its origin, so parked on the
            section's own edge it draws that edge in light instead of hiding
            it. Faded in and out across the join, the light has no edge at all
            — it swells in the middle of the hand-over and is gone by the end. */}
        <div className="h-full w-full bg-[radial-gradient(120%_100%_at_70%_10%,oklch(0.65_0.18_255/0.13),transparent_65%)] [mask-image:linear-gradient(to_bottom,transparent_0%,#000_50%,transparent_100%)]" />
      </motion.div>

      {/* ---- Desktop stage ------------------------------------------------
          The sticky element carries no transform of its own: a transformed
          ancestor becomes the containing block for position:sticky and the
          pinning silently stops working. Everything that moves lives inside. */}
      <div className="hidden lg:sticky lg:top-0 lg:block lg:h-svh lg:overflow-hidden">
        <motion.div
          style={{ y: introY, scale: introScale, opacity: introFade }}
          className="absolute inset-0 origin-bottom"
        >
          {/* THE ROOM. Full height, right-anchored, bleeding off three edges —
              the section's own black is the only frame it gets. */}
          <motion.div
            aria-hidden
            style={{ width: ROOM_WIDTH, scale: roomScale }}
            className="absolute inset-y-0 right-0 origin-[70%_50%]"
          >
            {/* The fade is applied here, once, to the whole room: put on each
                take instead it makes every layer transparent down its left side
                and the take underneath shows through beside the current one.
                ONE radial, anchored on the right edge, rather than a linear
                left ramp. A linear ramp leaves the plate's top and bottom edges
                square, and with a lit monitor in the corner of every take that
                square edge reads as the seam of a pasted rectangle — which is
                exactly what a full-bleed room must not have. An ellipse has no
                straight edge anywhere, so the room dissolves into the section's
                own black on every side. It is also deliberately a single mask:
                Chrome aliases `-webkit-mask-composite` onto `mask-composite`,
                so two intersected masks silently resolve to the wrong operator
                (the same trap already documented on the mobile hero plate). */}
            <div className="absolute inset-0 overflow-hidden [mask-image:radial-gradient(100%_135%_at_100%_50%,#000_0%,#000_30%,transparent_97%)]">
              {SERVICES.map((service, i) => (
                <SceneLayer
                  key={service.scene}
                  scene={service.scene}
                  index={i}
                  active={active}
                  reduced={reduced}
                  driftY={sceneDriftY}
                  driftX={sceneDriftX}
                />
              ))}
              {/* The cut, made visible. A light edge rides the wipe boundary
                  bottom-to-top, so the change of take reads as the same
                  luminous arc that crossed the hero passing through this room
                  — one film, not five pictures. Remounted on `active` so it
                  replays per cut. */}
              {!reduced && (
                <motion.div
                  key={`sweep-${active}`}
                  initial={{ top: "100%", opacity: 0 }}
                  animate={{ top: "-18%", opacity: [0, 1, 0.85, 0] }}
                  transition={{ duration: 0.95, ease: EASE, times: [0, 0.22, 0.6, 1] }}
                  className="pointer-events-none absolute inset-x-0 z-10 h-[18%]"
                >
                  <div className="h-px w-full bg-[linear-gradient(to_right,transparent,oklch(0.95_0.05_240/0.9),oklch(0.78_0.19_253/0.7),transparent)]" />
                  <div className="h-full w-full bg-[linear-gradient(to_top,oklch(0.78_0.19_253/0.22),transparent_75%)]" />
                </motion.div>
              )}
            </div>
            {/* THE FLOOR — and it is not decoration.
                Two things need the lower half of every plate gone, and they
                agree on where.

                The first is legal and non-negotiable. The shared 594x886 crop
                box (ADR 0011) puts a third-party trademark and a screenful of
                baked Czech marketing copy into `svc-eshop` — a shoe carrying a
                swoosh, "PREMIUM KOLEKCE", "KOUPIT NYNÍ". CLAUDE.md states the
                crop leaves the mark outside the frame; measured against the
                actual asset that is simply false, and it cannot be fixed by
                moving `top`, because with a box 886 tall there is no offset
                that excludes source row ~809. It went unnoticed only because
                the previous build showed the plate ~300px wide inside a card,
                where that band happened to fall outside. Full height, it is
                unmissable. PRODUCT.md forbids both the mark and invented
                metrics, and CLAUDE.md prescribes the remedy by name: defects in
                a reference are cured by cropping.

                The second is compositional, and it is why this reads as a gain
                rather than a patch. All five plates put the mascot's head and
                the room in their top half and hardware in their bottom half, so
                one cut line serves every take — the same band of one room, five
                times, which is exactly the claim ADR 0011 makes for them. The
                figure emerges out of the section's own black instead of
                standing on a visible plate edge.

                It is a painted scrim rather than a second mask because Chrome
                aliases `-webkit-mask-composite`, so intersecting two masks
                silently resolves to the wrong operator. */}
            <div
              aria-hidden
              className="pointer-events-none absolute inset-0 bg-[linear-gradient(to_top,#0A0D13_0%,#0A0D13_46%,transparent_82%)]"
            />
            {/* The room's own light, sitting in front of the plate and behind
                the type — the section's share of the hero's arc, so the two
                rooms are lit by the same source. Additive, so its floor is
                "no change". */}
            <div className="pointer-events-none absolute inset-0 mix-blend-screen">
              <div className="absolute inset-0 bg-[radial-gradient(60%_45%_at_28%_18%,oklch(0.65_0.18_255/0.16),transparent_70%)]" />
            </div>
          </motion.div>

          {/* ---- The type, standing in the room ----------------------------
              Three bands over the full height rather than one centred block:
              the slate at the top says which reel this is, the chapter sits on
              the eye-line, and the rail runs along the floor. Centred, the
              column left a screen of empty black above and below it and read as
              a caption floating beside a photograph. */}
          {/* The top band clears the fixed nav explicitly. At `8svh` the slate
              sat underneath it and simply could not be read. */}
          <div className="container-luxe relative flex h-full flex-col justify-between pt-[max(7.5rem,12svh)] pb-[8svh]">
            {/* The slate. It does NOT leave with the chapter card: something has
                to hold the top of the frame once the heading has gone, and a
                reel label is what a film puts there. */}
            <motion.div style={{ opacity: listFade }} className="flex items-baseline gap-4">
              <p className="label-micro flex items-center gap-3 text-white/55">
                <span aria-hidden className="size-[5px] rounded-full bg-primary" />
                {t.ui.showcaseKicker}
              </p>
              <span className="label-micro tabular-nums text-white/25">
                {String(active + 1).padStart(2, "0")} / {String(count).padStart(2, "0")}
              </span>
            </motion.div>

            <div className="relative max-w-[30rem] xl:max-w-[34rem]">
              {/* The chapter card. Present at rest, gone by the time the first
                  service has to be read — the hero's own handling of copy. */}
              <motion.div
                style={{ y: cardY, opacity: cardFade }}
                className="absolute inset-x-0 bottom-full mb-10 origin-left"
              >
                <h2 className="heading-scene text-[clamp(1.9rem,1.3rem+1.9vw,2.9rem)] text-white">
                  {t.ui.showcaseTitle} <span className="text-primary">{t.ui.showcaseAccent}</span>
                </h2>
                <p className="mt-4 max-w-sm text-[0.9375rem] leading-relaxed text-white/55">
                  {t.ui.showcaseSub}
                </p>
              </motion.div>

              <motion.div style={{ opacity: listFade }}>
                {/* The chapter, rolling through a gate. Every title is mounted
                    and parked a whole gate away from the opening, so the one on
                    screen is at full contrast against the black rather than at
                    whatever a cross-fade happened to leave — the argument the
                    hero's titles already settled.

                    The mask opens with a HARD transparent band rather than
                    ramping straight out of zero. Parked exactly one gate away,
                    the outgoing title's last pixel row lands flush on the gate's
                    top edge, where a ramp starting at 0% is still a hair above
                    fully transparent — so the descenders of the previous chapter
                    printed as a row of faint dashes above the current one
                    (measured at 57/255 against a 14/255 ground). Three percent
                    of dead transparency removes it without changing the travel,
                    so the roll stays exactly complementary. */}
                <div
                  className="relative overflow-hidden [mask-image:linear-gradient(to_bottom,transparent_0%,transparent_3%,#000_12%,#000_100%)]"
                  style={{ height: TITLE_GATE }}
                >
                  {items.map((item, i) => (
                    <motion.div
                      key={item.title}
                      aria-hidden={i !== active}
                      initial={false}
                      animate={{ y: (i - active) * TITLE_GATE }}
                      transition={reduced ? { duration: 0 } : { duration: 0.7, ease: EASE }}
                      /* Bottom-aligned inside the gate, so a one-line title sits
                         the same distance above the tag as a two-line one and
                         the block never opens a hole under short headings. The
                         gate is still a full step tall, so the roll stays
                         complementary: what leaves the top is exactly what
                         arrives at the bottom. */
                      className="absolute inset-x-0 top-0 flex h-full flex-col justify-end"
                    >
                      <span className="label-micro block tabular-nums text-primary">
                        {String(i + 1).padStart(2, "0")}
                      </span>
                      <h3 className="heading-scene mt-2 text-[clamp(1.6rem,1.1rem+1.5vw,2.4rem)] text-white">
                        {item.title}
                      </h3>
                    </motion.div>
                  ))}
                </div>

                {/* Tag and capabilities, read as one line of supporting text
                    rather than as a bordered strip of ticked boxes. */}
                <div className="mt-4 min-h-[4.5rem]">
                  <motion.p
                    key={`tag-${active}`}
                    initial={reduced ? false : { opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.45, delay: reduced ? 0 : 0.18, ease: EASE }}
                    className="text-[0.9375rem] leading-relaxed text-white/60"
                  >
                    {items[active].tag}
                  </motion.p>
                  <motion.ul
                    key={`caps-${active}`}
                    initial={reduced ? false : { opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.45, delay: reduced ? 0 : 0.26, ease: EASE }}
                    className="label-micro mt-3 flex flex-wrap items-center gap-x-3 gap-y-2 text-white/40"
                  >
                    {t.ui.showcaseBullets[active].map((b, i) => (
                      <li key={b} className="flex items-center gap-3">
                        {i > 0 && (
                          <span aria-hidden className="size-[3px] rounded-full bg-primary/70" />
                        )}
                        {b}
                      </li>
                    ))}
                  </motion.ul>
                </div>

                <div className="mt-7">
                  <Link to={SERVICES[active].route} className="btn-primary text-sm">
                    {t.ui.homeServicesLearn}
                    <ArrowRight className="size-4" aria-hidden />
                  </Link>
                </div>
              </motion.div>
            </div>

            {/* The rail, running along the floor of the frame. Numbers here are
                not decoration — they are the reader's position in a sequence,
                which is the one case the craft floor allows section numbering.
                Laid horizontally rather than stacked: vertical, it repeated all
                five titles the chapter block was already stating, and the
                section said everything twice. */}
            <motion.div style={{ opacity: listFade }} className="max-w-[30rem] xl:max-w-[34rem]">
              <ol className="relative flex items-center gap-0">
                <span
                  aria-hidden
                  className="absolute inset-x-0 top-1/2 h-px -translate-y-1/2 bg-white/10"
                />
                <motion.span
                  aria-hidden
                  // Under reduced motion the rail still reports position — it
                  // just reports it in steps instead of sliding. Filling it to
                  // 100% would say "finished" wherever the reader actually is.
                  style={{ scaleX: reduced ? (active + 1) / count : railFill }}
                  className="absolute inset-x-0 top-1/2 h-px origin-left -translate-y-1/2 bg-primary shadow-[0_0_10px_oklch(0.65_0.18_255/0.6)]"
                />
                {items.map((item, i) => {
                  const on = i === active;
                  return (
                    <li key={item.title} className="relative flex-1">
                      <button
                        type="button"
                        onClick={() => jumpToBeat(i)}
                        aria-current={on ? "true" : undefined}
                        className="group flex w-full flex-col items-start gap-3 py-4 text-left focus-visible:outline-none"
                      >
                        <span className="sr-only">{item.title}</span>
                        <span
                          aria-hidden
                          className={`block size-2.5 rounded-full border transition-all duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] ${
                            on
                              ? "scale-125 border-primary bg-primary shadow-[0_0_0_5px_oklch(0.65_0.18_255/0.18)]"
                              : "border-white/25 bg-[#0A0D13] group-hover:border-primary/70 group-focus-visible:border-primary"
                          }`}
                        />
                        <span
                          aria-hidden
                          className={`label-micro tabular-nums transition-colors duration-500 ${
                            on ? "text-primary" : "text-white/25 group-hover:text-white/55"
                          }`}
                        >
                          {String(i + 1).padStart(2, "0")}
                        </span>
                      </button>
                    </li>
                  );
                })}
              </ol>
            </motion.div>
          </div>
        </motion.div>
      </div>

      {/* ---- Mobile: the same room, scrolled rather than pinned -------------
          Not the desktop stage shrunk. Each service is a full-bleed frame with
          its type standing on the picture, which is the mobile hero's own
          composition (05_HOME_MOBILE_HERO.png) continued — a stack of bordered
          cards would be a different site below `lg`. */}
      <div className="lg:hidden">
        <div className="container-luxe pt-24 pb-14">
          <p className="label-micro flex items-center gap-3 text-white/55">
            <span aria-hidden className="size-[5px] rounded-full bg-primary" />
            {t.ui.showcaseKicker}
          </p>
          <h2 className="heading-scene mt-5 text-[clamp(1.9rem,1.3rem+1.9vw,2.9rem)] text-white">
            {t.ui.showcaseTitle} <span className="text-primary">{t.ui.showcaseAccent}</span>
          </h2>
        </div>
        <ol>
          {SERVICES.map((service, i) => (
            <li key={service.scene}>
              <MobileScene
                item={items[i]}
                scene={service.scene}
                route={service.route}
                index={i}
                learn={t.ui.homeServicesLearn}
                bullets={t.ui.showcaseBullets[i]}
                reduced={reduced}
              />
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}

/**
 * One take of the room, on mobile: the picture is the frame, and the type
 * stands on it behind a scrim that is dark exactly where the words are.
 */
function MobileScene({
  item,
  scene,
  route,
  index,
  learn,
  bullets,
  reduced,
}: {
  item: { title: string; tag: string };
  scene: SceneName;
  route: string;
  index: number;
  learn: string;
  bullets: readonly string[];
  reduced: boolean;
}) {
  return (
    <motion.article
      initial={reduced ? false : { opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true, margin: "-12% 0px" }}
      transition={{ duration: 0.7, ease: EASE }}
      className="relative min-h-[78svh] overflow-hidden"
    >
      <SceneImage
        name={scene}
        alt=""
        priority={index === 0}
        sizes="100vw"
        className="absolute inset-0 block h-full w-full"
        imgClassName="h-full w-full object-cover object-[50%_18%]"
      />
      {/* The floor, at the same cut line the desktop room uses and for the same
          two reasons: it takes the third-party mark and the baked Czech screen
          copy in `svc-eshop` out of frame, and it lands the words on black
          instead of on a busy picture. Mobile is not exempt from either. */}
      <div
        aria-hidden
        className="absolute inset-0 bg-[linear-gradient(to_top,#0A0D13_0%,#0A0D13_46%,transparent_82%)]"
      />
      <div className="container-luxe relative flex min-h-[78svh] flex-col justify-end pb-14 pt-24">
        <span className="label-micro block tabular-nums text-primary">
          {String(index + 1).padStart(2, "0")}
        </span>
        <h3 className="heading-scene mt-2 text-[clamp(1.5rem,1.1rem+2.2vw,2rem)] text-white">
          {item.title}
        </h3>
        <p className="mt-3 max-w-[34ch] text-[0.9375rem] leading-relaxed text-white/65">
          {item.tag}
        </p>
        <ul className="label-micro mt-4 flex flex-wrap items-center gap-x-3 gap-y-2 text-white/45">
          {bullets.map((b, i) => (
            <li key={b} className="flex items-center gap-3">
              {i > 0 && <span aria-hidden className="size-[3px] rounded-full bg-primary/70" />}
              {b}
            </li>
          ))}
        </ul>
        <div className="mt-6 self-start">
          <Link to={route} className="btn-primary text-sm">
            {learn}
            <ArrowRight className="size-4" aria-hidden />
          </Link>
        </div>
      </div>
    </motion.article>
  );
}

/**
 * One take of the room.
 *
 * Layers are stacked in index order and revealed with a wipe rather than a
 * cross-fade: a dissolve between two photographs of the same room reads as a
 * ghost, while a wipe reads as the camera arriving somewhere. The wipe runs
 * bottom-to-top because that is the direction the rail travels, so the picture
 * agrees with the progress line beside it. Scrolling back plays the same wipe
 * in reverse, uncovering the take underneath.
 */
function SceneLayer({
  scene,
  index,
  active,
  reduced,
  driftY,
  driftX,
}: {
  scene: SceneName;
  index: number;
  active: number;
  reduced: boolean;
  driftY: MotionValue<number>;
  driftX: MotionValue<number>;
}) {
  const shown = index <= active;
  return (
    <motion.div
      aria-hidden={index !== active}
      initial={false}
      animate={{
        clipPath: shown ? "inset(0% 0% 0% 0%)" : "inset(100% 0% 0% 0%)",
        opacity: shown ? 1 : 0,
      }}
      transition={{
        duration: reduced ? 0 : 0.85,
        ease: EASE,
        opacity: { duration: reduced ? 0 : 0.3, ease: EASE },
      }}
      className="absolute inset-0"
      style={{ zIndex: index }}
    >
      <motion.div style={{ y: driftY, x: driftX }} className="absolute inset-0">
        {/* The cut is a camera arriving, not a picture being swapped.
            The take is revealed already pushed in, offset, and out of focus,
            then settles: scale and position resolve while the lens finds it.
            All three are one-shots tied to the change — nothing keeps moving
            once the reader has stopped. Direction alternates with the index so
            consecutive cuts do not feel like the same move repeated. */}
        <motion.div
          initial={false}
          animate={{
            scale: index === active ? 1.04 : 1.13,
            x: index === active ? 0 : index % 2 === 0 ? 26 : -26,
            y: index === active ? 0 : 20,
            filter: index === active ? "blur(0px)" : "blur(7px)",
          }}
          transition={{
            duration: reduced ? 0 : 1.15,
            ease: EASE,
            filter: { duration: reduced ? 0 : 0.8, ease: EASE },
          }}
          className="absolute inset-0 origin-[60%_40%]"
        >
          <SceneImage
            name={scene}
            alt=""
            priority={index === 0}
            sizes="(min-width: 1024px) 46vw, 100vw"
            className="absolute inset-0 block h-full w-full"
            imgClassName="h-full w-full object-cover object-[50%_16%]"
          />
        </motion.div>
      </motion.div>
    </motion.div>
  );
}

export default ServicesShowcase;
