/**
 * The opening act: hero + the five services, one stage, ONE window.
 *
 * WHAT THE VISITOR SEES
 *   Rest     The portal (two cyan arcs over a wet floor) with a real browser
 *            window standing in it, showing ELEVATE's real client sites — it
 *            cycles through all four, each one loading like a page does. The
 *            headline, CTAs and disciplines sit to the left in real type.
 *   Scroll   The copy leaves, the window squares up to camera and comes
 *            forward, and then NAVIGATES: the address changes to
 *            elevateit.cz/services/web, the load bar runs, the old page blanks
 *            and the Web service page paints in. From there the same window
 *            navigates through all five services, each a page with its own
 *            evidence, while the service's real name, description, price and
 *            CTA take the left column.
 *   Release  After the fifth service the stage lets go and the page continues.
 *
 * WHY HERO AND SERVICES ARE ONE ACT: see `home-tokens.ts`. Two pinned sections
 * joined by an overlap always had a frame with two windows in it; one stage
 * cannot. This is condition 2 of PROTO_GATE.md, met by construction.
 *
 * Mobile is its own composition (stacked, the window static in the portal,
 * services as a list in `ServicesShowcase`). Under prefers-reduced-motion the
 * track, the pin and the services phase are dropped in CSS (`motion-reduce:`),
 * so the hero is a still first screen and `ServicesShowcase` carries the five
 * services — the full information, no frozen scroll.
 */
import { useEffect, useState } from "react";
import { Link } from "@tanstack/react-router";
import { ArrowRight } from "lucide-react";
import {
  motion,
  useMotionValue,
  useMotionValueEvent,
  useSpring,
  useTransform,
  type MotionValue,
} from "framer-motion";
import { BEAT, EASE, PERSPECTIVE, useAct, useMotionCapability } from "@/components/cinematic";
import { SceneImage } from "@/components/media/SceneImage";
import { useT } from "@/lib/i18n";
import { useProjects } from "@/lib/projects-i18n";
import { BrowserWindow } from "./BrowserWindow";
import { CLIENT_SITES, WorkImage, clientSite } from "./client-work";
import { SERVICE_COUNT, ServiceCopy } from "./service-copy";
import { CutText, LoadBar, NavLayer, useLoadBar } from "./window-nav";
import { PortalAir, PortalAtmosphere, PortalGlow, WindowHalo } from "./PortalLight";
import {
  AppStage,
  BrandBoard,
  ClientFold,
  SeoInspector,
  ShopScene,
  WebServicePage,
} from "./window-pages";
import { HERO_PIN, HERO_VIEWPORTS, INTRO_VP, NAV, STOP_VP, at, stopStart } from "./home-tokens";

/** When the window's address changes to stop `i` (past the last: never). */
const swapAt = (i: number) => (i < SERVICE_COUNT ? at(stopStart(i) - NAV.swap) : 2);

/** How long each client site stays in the resting window. */
const CYCLE_MS = 4200;

/**
 * The plate's box: the portal frame at its own aspect, as wide as the screen
 * (or as tall, whichever binds first), standing on the bottom edge with the
 * arch's right foot just inside the right edge. The window is positioned in
 * THIS box's percentages, so it stands inside the arch at every viewport shape
 * instead of drifting against it.
 */
const BOX_W = "min(100vw, 179.1svh)";
const BOX_STYLE: React.CSSProperties = {
  width: BOX_W,
  left: `calc(98.5vw - 0.89 * ${BOX_W})`,
  bottom: 0,
};

/** Where each page's address and tab come from, in stop order. */
const STOP_ADDRESS = [
  "elevateit.cz/services/web",
  clientSite("biodent-clinic").domain,
  clientSite("exclusive-beauty").domain,
  "elevateit.cz/services/branding",
  "elevateit.cz/services",
];

export function HeroScene() {
  const { t } = useT();
  const projects = useProjects();
  const capability = useMotionCapability();
  const reduced = capability === "still";

  const act = useAct("hero", { viewports: HERO_VIEWPORTS, pin: HERO_PIN });
  const { progress: p } = act;

  // ---- The resting window's client cycle ---------------------------------
  const [site, setSite] = useState(0);
  const [prevSite, setPrevSite] = useState<number | null>(null);
  const [scrolled, setScrolled] = useState(false);
  const [hovered, setHovered] = useState(false);
  const [activeStop, setActiveStop] = useState(-1);
  // Keyboard focus on the (still faded) service rail shows it: its buttons are
  // tab stops from the top of the page, and focus must never land on nothing.
  const [railFocused, setRailFocused] = useState(false);
  // Once the visitor picks a client site, the cycle stops for good — the
  // pause mechanism an auto-advancing slideshow owes them (WCAG 2.2.2).
  const [picked, setPicked] = useState(false);

  useMotionValueEvent(p, "change", (v) => {
    setScrolled(v > 0.004);
    let stop = -1;
    for (let i = 0; i < SERVICE_COUNT; i++) if (v >= at(stopStart(i) - NAV.swap)) stop = i;
    setActiveStop(stop);
  });

  const go = (i: number) => {
    setSite((cur) => {
      if (cur !== i) setPrevSite(cur);
      return i;
    });
  };

  useEffect(() => {
    if (reduced || scrolled || hovered || picked) return;
    const id = window.setInterval(() => {
      if (document.hidden) return;
      setSite((cur) => {
        setPrevSite(cur);
        return (cur + 1) % CLIENT_SITES.length;
      });
    }, CYCLE_MS);
    return () => window.clearInterval(id);
  }, [reduced, scrolled, hovered, picked]);

  const current = CLIENT_SITES[site];
  const currentProject = projects.find((x) => x.slug === current.slug);

  // ---- Pointer depth (fine pointers only) --------------------------------
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
  const winPX = useTransform(smoothX, [-1, 1], [16, -16]);
  const winPY = useTransform(smoothY, [-1, 1], [10, -10]);
  const platePX = useTransform(smoothX, [-1, 1], [9, -9]);
  const platePY = useTransform(smoothY, [-1, 1], [5, -5]);
  const phonePX = useTransform(smoothX, [-1, 1], [30, -30]);
  // Depth, by rate: the far glow field barely answers the pointer, the plate a
  // little, the air in front of it more, the window most. The difference in
  // rates between planes is what reads as space rather than as a flat poster.
  const atmoPX = useTransform(smoothX, [-1, 1], [4, -4]);
  const atmoPY = useTransform(smoothY, [-1, 1], [2, -2]);
  const airPX = useTransform(smoothX, [-1, 1], [20, -20]);
  const airPY = useTransform(smoothY, [-1, 1], [9, -9]);

  // ---- Scroll: the hero beat ---------------------------------------------
  const R = (v: number, rest: number) => (reduced ? rest : v);
  // The headline holds until the window actually navigates (its address
  // changes at 0.93 viewports) and hands straight over to the first service's
  // copy. Leaving earlier emptied the left half of the frame for ~150px of
  // scroll — the "is it still loading?" frame the independent review landed on.
  const copyY = useTransform(p, [at(0.2), at(0.95)], [0, R(-120, 0)]);
  const copyFade = useTransform(p, [at(0.55), at(0.92)], [1, R(0, 1)]);
  const copyScale = useTransform(p, [at(0.2), at(0.95)], [1, R(0.97, 1)]);

  // The window squares up and comes forward across the intro. It grows from
  // its LEFT edge, into the free margin on the right: growing leftward ran it
  // into the service column that is about to arrive there.
  const winRotateY = useTransform(p, [0, at(0.85)], [R(-9, 0), 0]);
  const winRotateZ = useTransform(p, [0, at(0.85)], [R(-0.8, 0), 0]);
  const winScale = useTransform(p, [0, at(0.85)], [1, R(1.15, 1)]);
  const winY = useTransform(p, [0, at(0.85)], [0, R(-26, 0)]);

  // The plate pushes in slowly for the whole act and dims once the window is
  // the subject — one lit world under every service, never switched off.
  const plateScale = useTransform(p, [0, 1], [1, R(1.12, 1)]);
  const plateDim = useTransform(p, [0, at(1.0), 1], [1, R(0.55, 1), R(0.45, 1)]);

  // THE LIGHT TRANSFER — hero → services as one transformation, not a jump.
  // As the window squares up the portal charges (its own light brightens);
  // as the window navigates to the first service the portal dims while a halo
  // behind the window carries its light through all five services. One light
  // source, handed from the world to the website. (A glint across the glass
  // was tried and removed: on dark UI it read as a pale slab, not light.)
  const glowGain = useTransform(
    p,
    [0, at(0.75), at(1.05), 1],
    [0.72, R(1, 0.72), R(0.32, 0.72), R(0.26, 0.72)],
  );
  const bloomGain = useTransform(p, [0, at(0.7), at(1.0)], [1, 1, R(0.2, 1)]);
  const haloOn = useTransform(p, [at(0.72), at(1.02)], [0, R(1, 0)]);

  const phoneFade = useTransform(p, [at(0.25), at(0.6)], [1, R(0, 1)]);
  const phoneY = useTransform(p, [0, at(0.6)], [0, R(40, 0)]);
  const captionFade = useTransform(p, [0, at(0.3)], [1, R(0, 1)]);

  // ---- Scroll: the navigations -------------------------------------------
  // One load bar for all five navigations: it runs from `lead` before each page
  // begins to `paint` after, and is invisible in between.
  const bar = useLoadBar(
    p,
    Array.from({ length: SERVICE_COUNT }, (_, i): [number, number] => [
      at(stopStart(i) - NAV.lead),
      at(stopStart(i) + NAV.paint),
    ]),
    reduced,
  );

  // The resting address/tab (the client cycle) until the first navigation.
  const firstSwap = at(stopStart(0) - NAV.swap);
  const heroAddr = useTransform(p, [firstSwap - 0.0004, firstSwap], [1, R(0, 1)]);

  // ---- Scroll: the services phase ----------------------------------------
  const railFade = useTransform(p, [at(INTRO_VP - 0.05), at(INTRO_VP + 0.1)], [0, 1]);

  // Where each page's own internal motion runs (0..1 within the stop).
  // Each scene plays across most of its stop, so its build → reveal → resolve
  // beats are paced by the visitor's scroll rather than finished in a flick.
  const webOpen = useWithin(p, 0, 0.06, STOP_VP - 0.08, reduced);
  const seoOpen = useWithin(p, 1, 0.06, STOP_VP - 0.08, reduced);
  const shopOpen = useWithin(p, 2, 0.06, STOP_VP - 0.06, reduced);
  const brandOpen = useWithin(p, 3, 0.06, STOP_VP - 0.08, reduced);
  const appOpen = useWithin(p, 4, 0.04, STOP_VP - 0.04, reduced);

  // The five service pages are not needed for the first screen: they mount on
  // the first scroll or once the browser is idle, so the hero's first paint
  // decodes the portal and one client capture — not eight more images.
  const [armed, setArmed] = useState(false);
  useEffect(() => {
    if (scrolled) setArmed(true);
  }, [scrolled]);
  useEffect(() => {
    const id = window.setTimeout(() => setArmed(true), 2500);
    return () => window.clearTimeout(id);
  }, []);

  const pages: React.ReactNode[] = [
    <WebServicePage key="web" open={webOpen} />,
    <SeoInspector key="seo" site={clientSite("biodent-clinic")} open={seoOpen} />,
    <ShopScene key="shop" site={clientSite("exclusive-beauty")} open={shopOpen} />,
    <BrandBoard key="brand" open={brandOpen} />,
    <AppStage key="app" open={appOpen} />,
  ];
  const tabs = [
    t.ui.serviceStage[0].title,
    clientSite("biodent-clinic").tabTitle,
    clientSite("exclusive-beauty").tabTitle,
    t.ui.serviceStage[3].title,
    t.nav.services,
  ];

  const jumpTo = (i: number) => {
    const el = act.ref.current;
    if (!el) return;
    const top = el.getBoundingClientRect().top + window.scrollY;
    window.scrollTo({ top: top + (stopStart(i) + 0.3) * window.innerHeight, behavior: "smooth" });
  };

  // The reveal wrapper clips; top padding + matching negative margin keeps the
  // clip edge above Czech diacritics (measured: it cut 3px off Á/Í/Ř/Š).
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

  const workCaption = (
    <div className="flex flex-wrap items-center gap-x-4 gap-y-2">
      <span className="label-micro text-white/55">{t.ui.homeWorkEyebrow}</span>
      <div className="flex items-center gap-1.5" role="group" aria-label={t.ui.homeWorkEyebrow}>
        {CLIENT_SITES.map((c, i) => (
          <button
            key={c.slug}
            type="button"
            onClick={() => {
              go(i);
              setPicked(true);
            }}
            aria-label={c.name}
            aria-pressed={i === site}
            className="group relative flex h-11 min-w-11 items-center justify-center"
          >
            <span
              className={`block h-[3px] rounded-full transition-all duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] ${
                i === site ? "w-8 bg-primary" : "w-4 bg-white/25 group-hover:bg-white/50"
              }`}
            />
          </button>
        ))}
      </div>
      <span className="text-sm text-white/80">
        <span className="font-medium text-white">{current.name}</span>
        {currentProject && <span className="text-white/50"> · {currentProject.category}</span>}
      </span>
    </div>
  );

  /** The client cycle, as window content: each site loads over the last. */
  const cycleLayers = CLIENT_SITES.map((c, i) => {
    const on = i === site;
    const under = i === prevSite && !on;
    return (
      <motion.div
        key={c.slug}
        initial={false}
        animate={{ clipPath: on || under ? "inset(0 0 0% 0)" : "inset(0 0 100% 0)" }}
        transition={{ duration: on && !reduced ? 0.75 : 0, ease: EASE }}
        style={{ zIndex: on ? 2 : under ? 1 : 0 }}
        className="absolute inset-0"
      >
        <ClientFold site={c} priority={i === 0} />
      </motion.div>
    );
  });

  return (
    <section
      ref={act.ref}
      aria-label={t.hero.sceneKicker}
      style={{ "--hero-track": `${(HERO_VIEWPORTS * 100).toFixed(2)}svh` } as React.CSSProperties}
      className="relative isolate w-full bg-[#0A0D13] xl:h-[var(--hero-track)] motion-reduce:xl:h-auto"
    >
      <div className="relative overflow-hidden xl:sticky xl:top-0 xl:h-[100svh] motion-reduce:xl:relative">
        {/* ================= DESKTOP STAGE (lg+) ================= */}
        <div className="relative hidden h-full xl:block">
          {/* ---- The portal plate, and the window standing in it ---------- */}
          <div className="pointer-events-none absolute inset-0">
            <div className="absolute aspect-[2400/1340]" style={BOX_STYLE}>
              <motion.div
                style={{ opacity: plateDim }}
                className="absolute inset-0 [mask-image:radial-gradient(95%_105%_at_60%_62%,#000_58%,transparent_100%)]"
              >
                <PortalAtmosphere reduced={reduced} x={atmoPX} y={atmoPY} />
                <motion.div
                  initial={reduced ? undefined : { opacity: 0, scale: 1.06 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 1.3, ease: EASE }}
                  className="absolute inset-0"
                >
                  <motion.div
                    style={{ scale: plateScale, x: platePX, y: platePY }}
                    className="absolute inset-0 origin-[60%_70%]"
                  >
                    <SceneImage
                      name="portal"
                      alt=""
                      priority
                      sizes="100vw"
                      className="absolute inset-0 block h-full w-full"
                      imgClassName="h-full w-full object-cover"
                    />
                    {/* Same transform group as the plate: the light is the
                        photograph's own, so it must never drift off it. */}
                    <PortalGlow reduced={reduced} intensity={glowGain} />
                  </motion.div>
                </motion.div>
                <PortalAir reduced={reduced} x={airPX} y={airPY} bloom={bloomGain} />
              </motion.div>
            </div>
          </div>
          {/* The ground the copy stands on: the plate darkens toward the left
              column and the top of the frame, so the headline is on black, not
              on the arc. A painted layer, not a second mask (Chrome aliases two
              mask layers into the wrong composite operator). */}
          <div
            aria-hidden
            className="pointer-events-none absolute inset-0 bg-[linear-gradient(90deg,#0A0D13_0%,#0A0D13e6_26%,#0A0D1300_52%),linear-gradient(to_bottom,#0A0D13_0%,#0A0D1300_22%,#0A0D1300_82%,#0A0D13_100%)]"
          />

          {/* ---- THE WINDOW ------------------------------------------------ */}
          <div className="absolute aspect-[2400/1340]" style={BOX_STYLE}>
            <motion.div
              style={{ perspective: `${PERSPECTIVE}px` }}
              className="absolute bottom-[23%] left-[40.5%] w-[37%] xl:left-[38.5%] xl:w-[39.5%]"
            >
              <WindowHalo reduced={reduced} opacity={haloOn} />
              <motion.div
                initial={reduced ? undefined : { opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 1, delay: 0.2, ease: EASE }}
              >
                <motion.div
                  style={{ rotateY: winRotateY, rotate: winRotateZ, scale: winScale, y: winY }}
                  className="origin-[0%_60%] [transform-style:preserve-3d]"
                >
                  <motion.div
                    style={{ x: winPX, y: winPY }}
                    onPointerEnter={() => setHovered(true)}
                    onPointerLeave={() => setHovered(false)}
                    className="pointer-events-auto"
                  >
                    <BrowserWindow
                      tab={
                        <>
                          <motion.span
                            style={{ opacity: heroAddr }}
                            className="absolute inset-0 truncate"
                          >
                            {current.tabTitle}
                          </motion.span>
                          {!reduced &&
                            tabs.map((tab, i) => (
                              <CutText
                                key={i}
                                p={p}
                                from={swapAt(i)}
                                to={swapAt(i + 1)}
                                className="absolute inset-0 truncate"
                              >
                                {tab}
                              </CutText>
                            ))}
                        </>
                      }
                      address={
                        <>
                          <motion.span style={{ opacity: heroAddr }} className="absolute inset-0">
                            {current.domain}
                          </motion.span>
                          {!reduced &&
                            STOP_ADDRESS.map((addr, i) => (
                              <CutText
                                key={addr}
                                p={p}
                                from={swapAt(i)}
                                to={swapAt(i + 1)}
                                className="absolute inset-0"
                              >
                                {addr}
                              </CutText>
                            ))}
                        </>
                      }
                    >
                      <div className="relative aspect-[16/10] overflow-hidden bg-white">
                        {/* The client cycle is its own stacking context, below
                            every page the window navigates to. */}
                        <div className="absolute inset-0 isolate">{cycleLayers}</div>
                        {/* Not under reduced motion: there is no pinned stage
                            then, so `progress` still advances as the hero
                            scrolls past and the window swapped to service pages
                            under a caption naming a client (final gate). The
                            stacked ServicesShowcase carries the services. */}
                        {armed &&
                          !reduced &&
                          pages.map((page, i) => (
                            <NavLayer
                              key={i}
                              p={p}
                              swap={swapAt(i)}
                              painted={at(stopStart(i) + NAV.paint)}
                            >
                              {page}
                            </NavLayer>
                          ))}
                        {/* The resting cycle's own load bar, per site change. */}
                        {!reduced && (
                          <motion.span
                            key={`bar-${site}`}
                            aria-hidden
                            initial={{ scaleX: 0, opacity: 1 }}
                            animate={{ scaleX: 1, opacity: 0 }}
                            transition={{
                              scaleX: { duration: 0.75, ease: EASE },
                              opacity: { duration: 0.3, delay: 0.75 },
                            }}
                            className="absolute inset-x-0 top-0 z-30 block h-[2px] origin-left bg-primary"
                          />
                        )}
                        <LoadBar bar={bar} />
                      </div>
                    </BrowserWindow>
                  </motion.div>

                  {/* The same site at phone width — the nearer plane. */}
                  <motion.div
                    style={{ opacity: phoneFade, y: phoneY }}
                    className="absolute -bottom-[12%] -left-[9%] hidden w-[19%] xl:block"
                  >
                    <motion.div
                      style={{ x: phonePX }}
                      className="relative aspect-[1/2] overflow-hidden rounded-[1.1rem] border-[5px] border-[#05070c] bg-white shadow-[0_30px_70px_-20px_oklch(0_0_0/0.95)]"
                    >
                      {CLIENT_SITES.map((c, i) => (
                        <motion.div
                          key={c.slug}
                          initial={false}
                          animate={{ opacity: i === site ? 1 : 0 }}
                          transition={{ duration: reduced ? 0 : 0.5, delay: reduced ? 0 : 0.2 }}
                          className="absolute inset-0"
                        >
                          <WorkImage
                            site={c}
                            kind="mobile"
                            alt=""
                            sizes="140px"
                            className="absolute inset-0 block h-full w-full"
                            imgClassName="h-full w-full object-cover object-top"
                          />
                        </motion.div>
                      ))}
                    </motion.div>
                  </motion.div>
                </motion.div>
              </motion.div>
              {/* Which client this is — under the window it describes. */}
              <motion.div
                style={{ opacity: captionFade }}
                className="absolute top-full right-0 mt-16 flex justify-end"
              >
                {workCaption}
              </motion.div>
            </motion.div>
          </div>

          {/* ---- Hero copy ------------------------------------------------- */}
          <motion.div
            style={{ y: copyY, scale: copyScale, opacity: copyFade }}
            className="pointer-events-none container-luxe relative z-10 flex h-full origin-left flex-col justify-center pt-24"
          >
            <div className="pointer-events-auto max-w-[28.5rem] xl:max-w-[34rem]">
              <p className="label-micro flex items-center gap-4 text-white/60">
                <span aria-hidden className="h-px w-10 bg-white/30" />
                <span>{t.hero.sceneKicker}</span>
              </p>
              <h1 className="heading-scene mt-6 text-[clamp(1.8rem,1.05rem+2.2vw,2.95rem)] text-white uppercase">
                {headlineLine(0, t.hero.sceneLine1)}
                {headlineLine(1, t.hero.sceneLine2)}
                {headlineLine(2, t.hero.sceneAccent, true)}
              </h1>
              <motion.p
                initial={reduced ? undefined : { opacity: 0, y: 14 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7, delay: BEAT.support, ease: EASE }}
                className="mt-7 max-w-[29rem] text-base leading-relaxed text-white/70"
              >
                {t.hero.sceneSubtitle}
              </motion.p>
              <motion.div
                initial={reduced ? undefined : { opacity: 0, y: 14 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7, delay: BEAT.support + BEAT.supportStep, ease: EASE }}
                className="mt-9 flex flex-wrap items-center gap-x-7 gap-y-4"
              >
                <Link to="/contact" className="btn-primary">
                  {t.hero.cta1}
                  <ArrowRight className="size-4" aria-hidden />
                </Link>
                <a
                  href="#work"
                  className="inline-flex min-h-11 items-center text-sm font-medium text-white/75 underline-offset-8 transition-colors hover:text-white hover:underline"
                >
                  {t.hero.cta2}
                </a>
              </motion.div>
              <motion.ul
                initial={reduced ? undefined : { opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{
                  duration: 0.7,
                  delay: BEAT.support + BEAT.supportStep * 2,
                  ease: EASE,
                }}
                className="label-micro mt-10 flex flex-wrap items-center gap-x-3 gap-y-2 text-white/60"
              >
                {t.hero.sceneDisciplines.map((d, i) => (
                  <li key={d} className="flex items-center gap-3">
                    {i > 0 && (
                      <span aria-hidden className="size-[3px] rounded-full bg-primary/70" />
                    )}
                    {d}
                  </li>
                ))}
              </motion.ul>
            </div>
          </motion.div>

          {/* ---- The services phase (motion only) ---------------------------
              The same column the headline vacated. Each service's copy arrives
              once its page has started to paint, and is gone before the next
              navigation begins — sequential, never two headings at once. */}
          <div className="pointer-events-none absolute inset-0 z-10 flex items-center motion-reduce:hidden">
            <div className="container-luxe w-full pt-20">
              <div className="relative h-[30rem] max-w-[27rem] xl:max-w-[31rem]">
                {Array.from({ length: SERVICE_COUNT }, (_, i) => (
                  <ServiceSlot key={i} p={p} i={i} reduced={reduced}>
                    <ServiceCopy index={i} />
                  </ServiceSlot>
                ))}
              </div>
            </div>
          </div>

          {/* ---- The service rail: where you are, and a way to jump ------- */}
          <motion.nav
            aria-label={t.nav.services}
            style={{ opacity: railFocused ? 1 : railFade }}
            onFocus={() => setRailFocused(true)}
            onBlur={(e) => {
              if (!e.currentTarget.contains(e.relatedTarget as Node)) setRailFocused(false);
            }}
            className="absolute inset-x-0 bottom-0 z-20 motion-reduce:hidden"
          >
            <div className="container-luxe">
              <ol className="flex border-t border-white/10">
                {t.ui.serviceStage.map((s, i) => (
                  <li key={s.title} className="flex-1">
                    <button
                      type="button"
                      onClick={() => jumpTo(i)}
                      aria-current={activeStop === i ? "step" : undefined}
                      className={`group relative w-full py-4 pr-3 text-left transition-colors duration-300 ${
                        activeStop === i ? "text-white" : "text-white/70 hover:text-white"
                      }`}
                    >
                      <span
                        aria-hidden
                        className={`absolute -top-px left-0 h-[2px] bg-primary transition-all duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] ${
                          activeStop === i ? "w-full" : "w-0"
                        }`}
                      />
                      <span className="label-micro block tabular-nums text-primary">
                        {String(i + 1).padStart(2, "0")}
                      </span>
                      <span className="mt-1 block truncate text-sm">{s.title}</span>
                    </button>
                  </li>
                ))}
              </ol>
            </div>
          </motion.nav>
        </div>

        {/* ================= MOBILE (below lg) =================
            Its own composition: the portal and the window first, standing
            still, then the copy. No pinned track exists below lg. */}
        <div className="relative flex min-h-[100svh] flex-col justify-center pt-20 pb-12 xl:hidden">
          {/* Stacked on phones; TWO COLUMNS from `md`. Stacked, a 1024x768
              laptop got the portal and the window in its first screen and the
              studio's own headline and CTA below the fold. */}
          <div className="container-luxe grid grid-cols-1 items-center gap-8 md:grid-cols-[1fr_1.05fr] md:gap-10 lg:gap-14">
            {/* The portal frames the window here too: the plate is cropped to
                the arch (wider than the phone, centred on it) and the window
                stands inside it at three-quarter width, so the arcs read around
                it instead of disappearing behind it. */}
            <div className="relative order-1 -mx-6 aspect-[10/9] overflow-hidden sm:aspect-[16/10] md:order-2 md:mx-0 md:aspect-[4/3.2] md:overflow-visible">
              {/* One wrapper carries the crop, the translate and the mask, and
                  both the plate and its light fill it — so the breathing light
                  stays registered to the photographed arcs at every width.
                  From md the plate is wider than its column and bleeds into the
                  gutter and past the screen edge: held inside the column, the
                  window covered the arch and the mask left one faint arc. */}
              <div className="pointer-events-none absolute inset-y-0 left-1/2 w-[178%] -translate-x-[57%] sm:w-full sm:-translate-x-1/2 md:inset-y-[-14%] md:w-[190%] md:-translate-x-[52%] md:[mask-image:radial-gradient(42%_54%_at_50%_50%,#000_64%,transparent_100%)]">
                <SceneImage
                  name="portal"
                  alt=""
                  priority
                  sizes="100vw"
                  className="absolute inset-0 block h-full w-full"
                  imgClassName="h-full w-full object-cover"
                />
                {/* Breathing only below xl — the travelling current is a
                    masked, animated layer, kept for capable desktops. */}
                <PortalGlow
                  reduced={reduced}
                  intensity={0.8}
                  current={capability === "cinematic"}
                />
              </div>
              <div
                aria-hidden
                className="absolute inset-0 bg-[linear-gradient(to_bottom,#0A0D13_0%,#0A0D1300_28%,#0A0D1300_70%,#0A0D13_100%)] md:hidden"
              />
              <div className="absolute inset-x-0 bottom-[17%] flex justify-center px-6 md:bottom-[10%] md:px-0">
                <div className="relative w-[74%] max-w-[22rem] md:w-[80%] md:max-w-[26rem]">
                  <BrowserWindow compact address={current.domain}>
                    <div className="relative aspect-[16/10] overflow-hidden bg-white">
                      <div className="absolute inset-0 isolate">{cycleLayers}</div>
                    </div>
                  </BrowserWindow>
                  <div className="absolute -right-3 -bottom-7 aspect-[1/2] w-[24%] overflow-hidden rounded-[0.8rem] border-4 border-[#05070c] bg-white shadow-[0_20px_50px_-15px_oklch(0_0_0/0.95)]">
                    <WorkImage
                      site={current}
                      kind="mobile"
                      alt=""
                      sizes="90px"
                      className="absolute inset-0 block h-full w-full"
                      imgClassName="h-full w-full object-cover object-top"
                    />
                  </div>
                </div>
              </div>
            </div>

            <div className="relative z-10 order-2 mt-2 md:order-1 md:mt-0">
              <p className="label-micro text-white/70">{t.hero.sceneKicker}</p>
              <h1 className="heading-scene mt-3 text-[clamp(1.9rem,1.2rem+2.4vw,3.25rem)] text-white uppercase">
                {t.hero.sceneLine1}
                <br />
                {t.hero.sceneLine2}
                <br />
                <span className="text-primary">{t.hero.sceneAccent}</span>
              </h1>
              <p className="mt-4 text-[0.9375rem] leading-relaxed text-white/70">
                {t.hero.sceneSubtitle}
              </p>
              <div className="mt-6 flex flex-wrap items-center gap-x-6 gap-y-4">
                <Link to="/contact" className="btn-primary">
                  {t.hero.cta1}
                  <ArrowRight className="size-4" aria-hidden />
                </Link>
                <a
                  href="#work"
                  className="inline-flex min-h-11 items-center text-sm font-medium text-white/75 underline-offset-8 hover:underline"
                >
                  {t.hero.cta2}
                </a>
              </div>
              {/* The client caption sits AFTER the studio's own headline here:
                stacked, it was naming a client before ELEVATE. */}
              <div className="mt-8">{workCaption}</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

/**
 * A service's copy in the left column. It rises in once its page has started
 * painting and leaves before the next navigation — so the column is never
 * holding two services, and never a heading without its page.
 */
function ServiceSlot({
  p,
  i,
  reduced,
  children,
}: {
  p: MotionValue<number>;
  i: number;
  reduced: boolean;
  children: React.ReactNode;
}) {
  const s = stopStart(i);
  const last = i === SERVICE_COUNT - 1;
  const inA = at(s - 0.02);
  const inB = at(s + 0.06);
  const outA = last ? 2 : at(stopStart(i + 1) - 0.1);
  const outB = last ? 2.1 : at(stopStart(i + 1) - 0.04);
  const y = useTransform(p, [inA, inB, outA, outB], [reduced ? 0 : 48, 0, 0, reduced ? 0 : -48]);
  const opacity = useTransform(p, [inA, inB, outA, outB], [0, 1, 1, 0]);
  const events = useTransform(p, (v) => (v > inA && v < outB ? "auto" : "none"));
  const visibility = useTransform(p, (v) =>
    v > inA - 0.001 && v < outB + 0.001 ? "visible" : "hidden",
  );
  return (
    <motion.div
      style={{ y, opacity, pointerEvents: events, visibility }}
      className="absolute inset-0 flex items-center"
    >
      <div className="w-full">{children}</div>
    </motion.div>
  );
}

/** Progress 0..1 across one stretch of stop `i` (in viewports from its start). */
function useWithin(p: MotionValue<number>, i: number, a: number, b: number, reduced: boolean) {
  return useTransform(p, [at(stopStart(i) + a), at(stopStart(i) + b)], [reduced ? 1 : 0, 1]);
}

export default HeroScene;
