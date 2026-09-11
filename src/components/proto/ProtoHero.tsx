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
import {
  motion,
  useMotionTemplate,
  useMotionValue,
  useSpring,
  useTransform,
  type MotionValue,
} from "framer-motion";
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
import { ProtoCandidate6Image } from "./ProtoImage";
import { ProtoPhoneMock, ProtoSiteHome, ProtoSiteService } from "./ProtoSiteMock";
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
 *
 * The dots are deliberately small, dim and `aria-hidden`, and the whole
 * chrome row is `select-none` with no hover, focus or cursor affordance
 * anywhere: the critique's sharpest point was that DOM chrome sets a
 * stronger interactivity expectation than a picture of chrome does, so a
 * stress-tester clicks a dot and gets silence. They now read as the texture
 * that says "screen" rather than as controls that promise a state change.
 */
export function BrowserChrome({
  path,
  children,
  className,
}: {
  /** A node, not a string, so the address can change while the window
   *  navigates (see the hero's page-load beat). */
  path: React.ReactNode;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    // Opaque, not glass. The chrome bar used to be `bg-white/[0.03]` over a
    // backdrop-blur, which let the plate's own bright drawn browser show
    // through it: the independent critique measured the address text at a
    // 2.55:1 median contrast on desktop — the one string whose job is to
    // prove the domain is real, failing AA — and the bar read two-toned where
    // the plate's frame sat behind it. A real browser's chrome is a solid
    // surface; so is this one now.
    <div
      className={`overflow-hidden rounded-2xl border border-white/12 bg-[#0b0f18] shadow-[0_40px_120px_-40px_oklch(0_0_0/0.8),0_0_0_1px_oklch(1_0_0/0.02)] ${className ?? ""}`}
    >
      <div className="flex items-center gap-2 border-b border-white/8 bg-[#0f1420] px-4 py-2.5 select-none">
        <span aria-hidden className="size-1.5 rounded-full bg-white/18" />
        <span aria-hidden className="size-1.5 rounded-full bg-white/18" />
        <span aria-hidden className="size-1.5 rounded-full bg-white/18" />
        <div className="relative ml-3 flex h-6 flex-1 items-center rounded-full bg-black/40 px-3">
          <span className="relative block h-4 w-full truncate font-mono text-[11px] leading-4 tracking-wide text-white/75">
            {path}
          </span>
        </div>
      </div>
      {children}
    </div>
  );
}

/** The gate the service titles roll through, in pixels. Travel equals this
 *  height exactly — that equality is the mechanism, not a coincidence. */
const ROLL_GATE = 150;
const ROLL_TRANSIT = 0.028;

function RollCard({
  progress,
  index,
  start,
  span,
  title,
  tag,
}: {
  progress: MotionValue<number>;
  index: number;
  start: number;
  span: number;
  title: string;
  tag: string;
}) {
  const end = start + span;
  const y = useTransform(
    progress,
    [start - ROLL_TRANSIT, start, end - ROLL_TRANSIT, end],
    [ROLL_GATE, 0, 0, -ROLL_GATE],
  );
  // SEQUENTIAL visibility, not a cross-fade. The pure-travel roll left
  // readable debris in the gate whenever a scroll paused mid-transit — the
  // independent critique measured clipped diacritics at the gate edge, an
  // orphan tag line with no title, and one card's tag above the next card's
  // title. The leaving card is gone by the half-way point of its transit and
  // the arriving one only appears after it, so two headings are never
  // legible in the gate at once. That is not the cross-fade this project
  // rejected (two titles dissolving through each other on one origin):
  // here the two never overlap in time at all.
  const half = ROLL_TRANSIT / 2;
  const opacity = useTransform(
    progress,
    [start - half, start, end - ROLL_TRANSIT, end - half],
    [0, 1, 1, 0],
  );

  return (
    <motion.div style={{ y, opacity }} className="absolute inset-0 flex flex-col justify-center">
      <span className="label-micro block text-primary">{String(index + 1).padStart(2, "0")}</span>
      {/* One line in CZ and EN; in RU three of five titles wrap to two
          lines (UA one), measured at 92.6px — still inside the gate's
          fade-free band, so they are allowed to wrap rather than being
          shrunk further. */}
      <span className="heading-scene mt-2 block text-[clamp(1rem,0.7rem+0.7vw,1.35rem)] leading-[1.2] text-white uppercase">
        {title}
      </span>
      {/* white/60, not /45: at /45 the tag lines measured 3.97-4.53:1
          against the rendered backdrop, under AA for 11px text. */}
      <span className="label-micro mt-2.5 block text-white/60">{tag}</span>
    </motion.div>
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
  // The approach is anchored to the window's RIGHT edge (see `origin-right`
  // below), so the growth runs leftward into the space the copy has already
  // vacated instead of off the right side of the screen. Scaled around its
  // own centre it overflowed the viewport and clipped the service strip —
  // found by screenshot at mid-scroll, not by reading the numbers.
  const panelScale = useTransform(p, [0, 1], [1, reduced ? 1 : 1.16]);
  const panelZ = useTransform(p, [0, 1], [0, reduced ? 0 : 90]);
  const panelY = useTransform(p, [0, 1], [0, reduced ? 0 : -28]);
  // The window squares up to camera as it approaches: it starts very
  // slightly off-axis, which is what makes it read as an object standing in
  // the scene rather than a rectangle pasted onto it, and resolves to flat
  // exactly as it arrives. Small on purpose — past ~4deg the mock's own
  // type starts to smear on the far edge.
  const panelRotate = useTransform(p, [0, 1], [reduced ? 0 : -3.2, 0]);
  // The satellite separates OUTWARD from the window, down and to the left.
  // It first drove up and inward, which put the phone on top of the
  // window's own headline and CTA at mid-scroll — the two layers collided
  // instead of parting. Moving it the other way opens a real gap between
  // the planes, which is what "layers begin separating" has to look like.
  const phoneY = useTransform(p, [0, 1], [0, reduced ? 0 : 24]);
  const phoneX = useTransform(p, [0, 1], [0, reduced ? 0 : -32]);
  const phoneScale = useTransform(p, [0, 1], [1, reduced ? 1 : 1.06]);
  // The phone leaves before the handoff, not with the panel: hanging below
  // the window, it sat directly over the service section's "01 / Weby, které"
  // heading as that heading rose into the frame (seen at scroll 1150).
  const phoneFade = useTransform(p, [0.62, 0.78], [1, reduced ? 1 : 0]);

  // THE PAGE LOAD — the hero window navigates to the service it is about to
  // hand over to.
  //
  // The critique's sharpest P1: hero -> service was two different windows,
  // one fading in place while an unrelated one rose below it, which reads as
  // a screenshot gallery rather than one experience. The fix is the one
  // transition a web studio actually owns: the window NAVIGATES. The address
  // changes to `/services/web`, a load bar runs along the top, and the
  // service page paints in top-down over the landing page. By the time the
  // service section rises, it is showing the page this window already
  // loaded — the same page, docked, not a second window.
  //
  // Web grammar, not film grammar: nothing here is a cross-dissolve.
  const navReveal = useTransform(p, [0.55, 0.72], [100, reduced ? 100 : 0]);
  const navClip = useMotionTemplate`inset(0 0 ${navReveal}% 0)`;
  const loadBar = useTransform(p, [0.55, 0.72], [0, reduced ? 0 : 1]);
  const loadBarFade = useTransform(
    p,
    [0.54, 0.56, 0.72, 0.76],
    [0, reduced ? 0 : 1, reduced ? 0 : 1, 0],
  );
  // The address is a hard cut at the moment the new page starts painting,
  // the way a real address bar changes — not a dissolve between two URLs.
  const urlHome = useTransform(p, [0.555, 0.56], [1, reduced ? 1 : 0]);
  const urlService = useTransform(p, [0.555, 0.56], [0, reduced ? 0 : 1]);

  // THE TITLE ROLL — what fills the left column once the copy has gone.
  //
  // Without it the back half of the pinned window is ~45% empty backdrop:
  // the brief's "density stays high" fails exactly where the scroll is
  // longest. This is HeroScene's own title-gate mechanism (see its
  // HeroTitleCard: travel equals gate height, so outgoing and incoming
  // cards exactly complement and the gate is never empty and never
  // doubled), against the same five real service names, in the column the
  // headline just vacated. No new keys, no invented copy.
  const rollIn = 0.34;
  const rollOut = 0.86;
  const rollSpan = (rollOut - rollIn) / 5;

  // The backdrop recedes as the window advances. It used to brighten and
  // grow alongside it, which put the plate's OWN drawn browser shape in
  // direct competition with the real DOM window in front of it — two
  // windows, one frame. A near plane that comes forward while the far one
  // dims is the whole of depth; doing both at the same rate is a poster.
  const backdropScale = useTransform(p, [0, 1], [1, reduced ? 1 : 1.03]);
  // The backdrop is GONE before the panel starts to fade, not merely dimmed.
  // It used to bottom out at 0.38 while the panel dissolved over it — and
  // what a dissolving panel uncovers is candidate 6's own drawn browser,
  // full of blurred placeholder blocks: the exact "chrome around emptiness"
  // flaw the previous iteration was built to remove, brought straight back
  // in the handoff and end frame (independent critique, P0; at 1080 the
  // blocks also double-exposed through the fading mock's headline). With the
  // plate at zero by p 0.78 and the panel only starting to go at 0.82, the
  // plate's window is never on screen uncovered.
  const sceneFade = useTransform(p, [0, 0.45, 0.78], [1, reduced ? 1 : 0.82, reduced ? 1 : 0]);
  // The chrome panel needs its OWN fade, all the way to 0 across the same
  // tail-mask window the backdrop uses — found by Assessment A's browser
  // evidence, not by inspection: the panel is a sibling outside the
  // backdrop's masked wrapper, so without this it never dims and instead
  // gets a hard rectangular clip from the section's own `overflow-hidden`
  // boundary as it scrolls past, and a leftover shard is what was still
  // on screen at the same time as the next section's own panel.
  // Deliberately NOT the backdrop's tail-mask window. Tied to
  // PROTO_TAIL_MASK_START the panel was down to ~59% opacity at p 0.74 —
  // still the main event on screen, and semi-transparent enough that the
  // plate's bright laptop bled through the mock's own headline. The
  // backdrop may start receding early; the interface may not. It holds
  // solid through the whole approach and dissolves only as the section
  // physically leaves.
  const panelFade = useTransform(p, [0.82, 1], [1, reduced ? 1 : 0]);

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
  // The satellite answers the pointer harder than the window it overlaps —
  // it is the nearer plane, and a nearer plane must displace further or the
  // two read as one sticker. Same reasoning as HeroScene's light-front vs
  // plate split.
  const phonePX = useTransform(smoothX, [-1, 1], [40, -40]);
  const backdropPX = useTransform(smoothX, [-1, 1], [8, -8]);
  const backdropPY = useTransform(smoothY, [-1, 1], [5, -5]);

  const disciplines = t.hero.sceneDisciplines;

  // The reveal wrapper clips — that is how each line is uncovered from below.
  // With only bottom padding it also clipped the TOP of Czech capitals:
  // measured by pixel diff against `overflow: visible`, a 3px band was cut
  // off Á / Í / Ř / Š on every line of the H1. The top padding moves the clip
  // edge above the diacritics and the matching negative margin cancels it
  // out of the layout, so the lines sit exactly where they did.
  const headlineLine = (i: number, children: React.ReactNode, accent = false) => (
    <span className="-mt-[0.16em] block overflow-hidden pt-[0.16em] pb-[0.08em]">
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
      /* The track exists only to give the camera something to play against.
         Under prefers-reduced-motion every transform is zeroed, so the track
         was 1.4 viewports of a frozen sticky frame the visitor had to scroll
         through for nothing (both critique passes found it). The
         `motion-reduce:` variants drop the track and the pin in CSS — not via
         `capability`, which resolves after mount and would shift the layout
         on load for everyone else. It is the same media query `still`
         reads, so the two can never disagree. */
      className="relative isolate w-full bg-[#0A0D13] lg:h-[var(--proto-track)] motion-reduce:lg:h-auto"
    >
      <div className="relative flex min-h-[100svh] flex-col overflow-hidden lg:sticky lg:top-0 lg:block lg:h-[100svh] motion-reduce:lg:relative">
        {/* ---- Backdrop: candidate 6, full-bleed right, never boxed ------- */}
        <motion.div
          style={{ opacity: sceneFade, ...TAIL_MASK_VARS }}
          className="pointer-events-none absolute inset-0 lg:[mask-image:linear-gradient(to_bottom,#000_var(--tail-start),transparent_var(--tail-end))]"
        >
          <div className="absolute inset-0" style={{ perspective: `${PERSPECTIVE}px` }}>
            <div className="absolute inset-0 [transform-style:preserve-3d]">
              {/* Desktop only: a blur-2xl pass over a full-bleed 2400px plate
                  is the most expensive paint on the page, and on a phone it
                  sits under an opaque stack where it cannot be seen. */}
              <div className="absolute inset-0 hidden lg:block" style={depth(Z_ATMO)}>
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
                    /* Anchored right of centre so the plate's bright laptop
                       edge stays out of the left column: both the headline
                       at rest and the title roll mid-scroll sit on it, and
                       at 66% the bright edge ran straight under the type.
                       Same reasoning as HeroScene confining its plate to
                       the right 62% of the frame. */
                    imgClassName="h-full w-full object-cover [mask-image:radial-gradient(76%_74%_at_73%_46%,#000,transparent_88%)]"
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
          {/* Capped against the panel, not against the container. The copy
              lives in `container-luxe` while the panel is positioned from
              the right, so they share no grid — at 38rem the copy box ran
              under the window at 1440 (the RU headline's comma touched its
              edge) and at 1024 the window sat on top of the H1 and subtitle.
              These caps are paired with the panel widths below, per
              breakpoint, so the two always clear each other. */}
          <div className="max-w-[34rem] lg:max-w-[28rem] xl:max-w-[34rem]">
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

            {/* white/60: at /45 this row measured 3.39:1 median over the
                plate — under AA for small caps. */}
            <ul className="label-micro mt-6 flex flex-wrap items-center gap-x-3 gap-y-2 text-white/60 lg:mt-8">
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

        {/* ---- The title roll ---------------------------------------------
            Desktop only, and absent entirely under `still`: five names
            stacked motionless on a photograph is not the same thing as a
            roll, and the static frame is already a complete hero.
            `aria-hidden` because these five are the same five the service
            section below names with a real link — this is the camera's
            caption, not the page's content. */}
        {!reduced && (
          <div
            aria-hidden
            className="pointer-events-none absolute inset-0 z-[5] hidden items-center lg:flex"
          >
            <div className="container-luxe w-full">
              <div
                className="relative max-w-[26rem] overflow-hidden [mask-image:linear-gradient(to_bottom,transparent_0%,#000_14%,#000_86%,transparent_100%)]"
                style={{ height: ROLL_GATE }}
              >
                {t.ui.serviceStage.map((s, i) => (
                  <RollCard
                    key={s.title}
                    progress={p}
                    index={i}
                    start={rollIn + i * rollSpan}
                    span={rollSpan}
                    title={s.title}
                    tag={s.tag}
                  />
                ))}
              </div>
            </div>
          </div>
        )}

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
            style={{ scale: panelScale, z: panelZ, y: panelY, rotateY: panelRotate }}
            initial={reduced ? undefined : { opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.15, ease: EASE }}
            // 26rem at `lg`, 34 at `xl`, 38 only from `2xl`: paired with the
            // copy caps above so the window and the headline never overlap.
            className="relative w-[26rem] origin-right [transform-style:preserve-3d] xl:w-[34rem] 2xl:w-[38rem]"
          >
            {/* Pointer depth lives on its own nested layer — combining a
                scroll-driven `y` and a pointer-driven `y` on one element
                is the bug HeroScene's plate/copy split exists to avoid: one
                motion value silently wins and the other stops applying. */}
            <motion.div style={{ x: panelPX, y: panelPY }}>
              <BrowserChrome
                path={
                  <>
                    <motion.span style={{ opacity: urlHome }} className="absolute inset-0">
                      elevateit.cz
                    </motion.span>
                    <motion.span style={{ opacity: urlService }} className="absolute inset-0">
                      elevateit.cz/services/web
                    </motion.span>
                  </>
                }
              >
                {/* 16:10 — a real viewport proportion, so the thing behind
                    the glass is a screen rather than a panel that happens
                    to have a chrome bar on top of it. */}
                <div className="relative aspect-[16/10] overflow-hidden">
                  <ProtoSiteHome />
                  {/* The old page unloads the instant the address changes —
                      the way a real browser blanks before it paints. Without
                      this the landing page stayed under the wipe edge, and a
                      scroll paused mid-load showed its service strip sliced
                      through the glyphs below the new page: debris, not a
                      page loading (found by zooming the 900px frame). */}
                  <motion.div
                    aria-hidden
                    style={{ opacity: urlService }}
                    className="absolute inset-0 bg-[#0d1220]"
                  />
                  {/* The next page, painting in top-down onto the blank screen. */}
                  <motion.div style={{ clipPath: navClip }} className="absolute inset-0">
                    <ProtoSiteService />
                  </motion.div>
                  {/* The load bar — the browser's own "a page is arriving". */}
                  <motion.span
                    aria-hidden
                    style={{ scaleX: loadBar, opacity: loadBarFade }}
                    className="absolute inset-x-0 top-0 block h-[2px] origin-left bg-primary"
                  />
                </div>
              </BrowserChrome>
            </motion.div>

            {/* The satellite, on its own nearer plane and its own clock: two
                viewports of the same site is the shortest way a web studio
                says "responsive", and the rate difference between this and
                the window behind it is what separates the layers on scroll
                rather than moving the whole composition as one flat card.

                It hangs from the window's lower edge instead of sitting on
                it: overlapping the window's corner, it covered 100% of the
                strip's "01" and 39% of the mock's own button (measured), so
                the service list read as starting at "02". Hung below, it
                still overlaps the window's edge and shadow — the depth
                survives — and covers no text. `xl` and up only: at `lg` the
                window is narrower and the phone ran into the copy column. */}
            <motion.div
              style={{ x: phoneX, y: phoneY, scale: phoneScale, opacity: phoneFade }}
              initial={reduced ? undefined : { opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, delay: 0.4, ease: EASE }}
              className="absolute top-[calc(100%-0.75rem)] left-8 hidden w-[7.5rem] xl:block 2xl:w-[8.5rem]"
            >
              {/* Pointer depth on its own nested layer, same reason as the
                  window above: one `x` per element, never two. */}
              <motion.div style={{ x: phonePX }}>
                <ProtoPhoneMock />
              </motion.div>
            </motion.div>
          </motion.div>
        </motion.div>

        {/* ---- Mobile: its own stacked composition, not the desktop scaled
            down. Chrome panel first (smaller, static), copy beneath it. */}
        <div className="relative flex flex-1 flex-col justify-end px-6 pb-10 pt-6 lg:hidden">
          {/* No plate of its own: the full-bleed backdrop above already sits
              behind this stack, and a third copy of the same 2400px image
              underneath the window was pure decode cost. */}
          <div className="relative mb-8 w-full">
            {/* Mobile gets the same real interface, in its `compact` cut —
                fewer nav items, no body paragraph — because at ~300px the
                full desktop mock's supporting copy is below legible size.
                Same site, composed for this screen: the brief's own rule
                that mobile is its own composition, not a scaled desktop. */}
            <div className="relative">
              <BrowserChrome path="elevateit.cz" className="mx-auto max-w-[19rem]">
                {/* 16:12: tall enough for the compact cut (nav, kicker,
                    headline, buttons, plate) without clipping; the compact
                    cut drops the five-service strip deliberately — see
                    ProtoSiteHome. */}
                <div className="aspect-[16/12]">
                  <ProtoSiteHome compact />
                </div>
              </BrowserChrome>
            </div>
          </div>

          {/* white/75: /55 measured 3.42:1 median where the pale plate sits
              behind it on phones. */}
          <p className="label-micro text-white/75">{t.hero.sceneKicker}</p>
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
