/**
 * Services showcase — a rebuild of
 * references/01_HOME_DESKTOP_SCROLL_SERVICES_SHOWCASE.png.
 *
 * That reference is not a picture to hang on the page; it is a storyboard for a
 * behaviour. It shows a pinned left column — kicker, heading, and a vertical
 * progress rail numbered 01–05 — beside a stack of tilted service panels linked
 * by a drawn line. So this section pins the left column and drives the panel on
 * the right from scroll position: one continuous move through five services,
 * not five cards laid out in a grid.
 *
 * The five photographic plates are five takes of one room (same desk, window,
 * chair and light — see scripts/extract-ref-assets.mjs). Cutting between them
 * therefore reads as a camera change inside the scene the hero opened, which is
 * the whole point of the hero → services handoff.
 *
 * Order is fixed by the reference and matches t.ui.serviceStage exactly:
 * 01 Web, 02 SEO, 03 E-shop, 04 Branding, 05 Apps. Changing one without the
 * other silently mislabels every panel.
 */
import { useRef, useState } from "react";
import { Link } from "@tanstack/react-router";
import { ArrowRight, Check } from "lucide-react";
import {
  motion,
  type MotionValue,
  useMotionValueEvent,
  useReducedMotion,
  useScroll,
  useTransform,
} from "framer-motion";
import { SceneImage, type SceneName } from "@/components/media/SceneImage";
import { useT } from "@/lib/i18n";

const EASE = [0.22, 1, 0.36, 1] as const;

/** Scene plate + destination per service, in showcase order. */
const SERVICES: ReadonlyArray<{ scene: SceneName; route: string }> = [
  { scene: "svc-web", route: "/services/web" },
  { scene: "svc-seo", route: "/audit" },
  { scene: "svc-eshop", route: "/services/eshop" },
  { scene: "svc-branding", route: "/services/branding" },
  { scene: "svc-app", route: "/contact" },
];

export function ServicesShowcase() {
  const { t } = useT();
  const ref = useRef<HTMLElement>(null);
  const reduced = useReducedMotion();
  const [active, setActive] = useState(0);

  const items = t.ui.serviceStage.slice(0, SERVICES.length);
  const count = SERVICES.length;

  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end end"] });

  // A second read of the same section, taken while it is still arriving. The
  // hero hands over to this: as the hero's set loses focus and sinks, this one
  // rises the last few pixels into place, so the two sections read as one
  // camera move rather than as two pages meeting at a seam.
  const { scrollYProgress: entry } = useScroll({
    target: ref,
    offset: ["start end", "start start"],
  });
  const introY = useTransform(entry, [0, 1], [reduced ? 0 : 54, 0]);
  const introScale = useTransform(entry, [0, 1], [reduced ? 1 : 0.975, 1]);
  const introFade = useTransform(entry, [0, 0.65], [reduced ? 1 : 0.35, 1]);
  const handoffGlow = useTransform(entry, [0, 0.55, 1], [0, reduced ? 0 : 1, 0]);

  // The camera's own move through the room. It runs CONTINUOUSLY across the
  // whole section rather than resetting at each service, because the five
  // plates are one room: a drift that restarted on every cut would announce
  // the cut and turn the room back into five pictures. The wipe changes what
  // we are looking at; this keeps the camera moving while it happens.
  const sceneDriftY = useTransform(scrollYProgress, [0, 1], [reduced ? 0 : 26, reduced ? 0 : -26]);
  const sceneDriftX = useTransform(scrollYProgress, [0, 1], [reduced ? 0 : -14, reduced ? 0 : 14]);

  // One scroll position drives both the rail and the window. The rail reads the
  // continuous value; the window reads the stepped one, so the change of take is
  // decisive while the thread down the left stays smooth.
  useMotionValueEvent(scrollYProgress, "change", (p) => {
    const next = Math.min(count - 1, Math.max(0, Math.floor(p * count * 0.999)));
    setActive((prev) => (prev === next ? prev : next));
  });

  // scaleY rather than an animated height: a transform is composited and does
  // not force layout on every scroll frame.
  const railFill = useTransform(scrollYProgress, [0, 1], [0, 1]);

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
      /* Pulled up into the tail of the hero on wide screens. The hero's set is
         losing focus and sinking through exactly this band, so the services
         room rises into the space it vacates instead of waiting for it to
         finish — that overlap is what makes the two read as one camera move
         rather than as two sections meeting at a seam. */
      className="relative z-10 bg-[#0A0D13] lg:-mt-[14vh] lg:h-[440vh]"
      aria-label={t.ui.homeServicesTitle}
    >
      {/* Light carried across the cut. It exists only during the handoff and is
          gone by the time the section settles, so it can never read as a
          decorative gradient parked behind the content. */}
      <motion.div
        aria-hidden
        style={{ opacity: handoffGlow }}
        className="pointer-events-none absolute inset-x-0 top-0 hidden h-[45vh] lg:block"
      >
        <div className="h-full w-full bg-[radial-gradient(120%_100%_at_70%_0%,oklch(0.65_0.18_255/0.13),transparent_65%)]" />
      </motion.div>

      <div className="lg:sticky lg:top-0 lg:flex lg:h-screen lg:items-center lg:overflow-hidden">
        {/* The intro transform lives here, on the grid, and never on the sticky
            wrapper above it: a transformed ancestor becomes the containing
            block for position:sticky and the pinning silently stops working. */}
        <motion.div
          style={{ y: introY, scale: introScale, opacity: introFade }}
          className="container-luxe grid w-full gap-12 py-24 lg:grid-cols-[minmax(0,19rem)_minmax(0,1fr)] lg:items-center lg:gap-14 lg:py-0 xl:grid-cols-[minmax(0,21rem)_minmax(0,1fr)] xl:gap-20"
        >
          {/* ---- Pinned narrative column ---------------------------------- */}
          <div>
            <p className="label-micro flex items-center gap-3 text-white/55">
              <span aria-hidden className="size-[5px] rounded-full bg-primary" />
              {t.ui.showcaseKicker}
            </p>
            <h2 className="heading-scene mt-5 text-[clamp(1.9rem,1.3rem+1.9vw,2.9rem)] text-white">
              {t.ui.showcaseTitle} <span className="text-primary">{t.ui.showcaseAccent}</span>
            </h2>
            <p className="mt-4 max-w-sm text-[0.9375rem] leading-relaxed text-white/55">
              {t.ui.showcaseSub}
            </p>

            {/* The rail. Numbers here are not decoration — they are the
                reader's position in a sequence, which is the one case the
                craft floor allows section numbering. */}
            <ol className="relative mt-10 hidden lg:block">
              <span
                aria-hidden
                className="absolute left-[11px] top-3 bottom-6 w-0.5 -translate-x-px rounded bg-white/10"
              />
              <motion.span
                aria-hidden
                // Under reduced motion the rail still reports position — it
                // just reports it in steps instead of sliding. Filling it to
                // 100% would say "finished" wherever the reader actually is.
                style={{ scaleY: reduced ? (active + 1) / count : railFill }}
                className="absolute left-[11px] top-3 bottom-6 w-0.5 origin-top -translate-x-px rounded bg-primary shadow-[0_0_10px_oklch(0.65_0.18_255/0.6)]"
              />
              {items.map((item, i) => {
                const on = i === active;
                return (
                  <li key={item.title}>
                    <button
                      type="button"
                      onClick={() => jumpToBeat(i)}
                      aria-current={on ? "true" : undefined}
                      className="group relative flex min-h-[3.75rem] w-full gap-5 py-2.5 pl-8 text-left focus-visible:outline-none"
                    >
                      <span
                        aria-hidden
                        className={`absolute left-[7px] top-[1.15rem] size-2.5 rounded-full border transition-all duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] ${
                          on
                            ? "scale-125 border-primary bg-primary shadow-[0_0_0_5px_oklch(0.65_0.18_255/0.18)]"
                            : "border-white/25 bg-[#0A0D13] group-hover:border-primary/70 group-focus-visible:border-primary"
                        }`}
                      />
                      <span
                        className={`label-micro pt-[3px] tabular-nums transition-colors duration-500 ${
                          on ? "text-primary" : "text-white/30 group-hover:text-white/55"
                        }`}
                      >
                        {String(i + 1).padStart(2, "0")}
                      </span>
                      <span className="min-w-0">
                        <span
                          className={`block text-[0.95rem] font-semibold leading-snug transition-colors duration-500 ${
                            on
                              ? "text-white"
                              : "text-white/40 group-hover:text-white/70 group-focus-visible:text-white/70 group-focus-visible:underline group-focus-visible:decoration-primary group-focus-visible:underline-offset-4"
                          }`}
                        >
                          {item.title}
                        </span>
                        {/* Always rendered, so the rows keep a constant rhythm as
                            the active item changes; only its ink comes and goes. */}
                        <span
                          className={`mt-0.5 block truncate text-[0.8125rem] leading-snug transition-opacity duration-500 ${
                            on ? "text-white/55 opacity-100" : "opacity-0"
                          }`}
                        >
                          {item.tag}
                        </span>
                      </span>
                    </button>
                  </li>
                );
              })}
            </ol>
          </div>

          {/* ---- The window ------------------------------------------------
              The frame does not move. It is the window we are looking through,
              not the subject, and while it slid and tilted away on every cut
              the section read as a deck of cards being dealt no matter how much
              depth was put on the movement. Now the pane, its chrome and its
              foot stay nailed in place and the ROOM behind the glass changes:
              the five plates are five takes of one room at the same focal
              length and eye-line, so wiping between them reads as the camera
              finding a different part of the same space. */}
          <div className="hidden lg:block">
            <div className="relative h-[clamp(26rem,64vh,38rem)] w-full [perspective:1600px]">
              <article className="absolute inset-0 flex flex-col overflow-hidden rounded-2xl border border-white/10 bg-white/[0.025] shadow-[0_40px_90px_-40px_rgb(0_0_0/0.9)] [transform:rotateY(-6deg)_rotateX(1.5deg)]">
                {/* Window chrome, as the reference frames every service screen. */}
                <div className="flex items-center gap-2.5 border-b border-white/8 px-5 py-3">
                  <span aria-hidden className="size-2 rounded-full bg-white/18" />
                  <span aria-hidden className="size-2 rounded-full bg-white/12" />
                  <span aria-hidden className="size-2 rounded-full bg-white/12" />
                  <span className="label-micro ml-3 tabular-nums text-white/35">
                    {String(active + 1).padStart(2, "0")} — elevateit.cz
                  </span>
                </div>

                <div className="grid min-h-0 flex-1 grid-cols-[1.05fr_0.95fr]">
                  <div className="flex flex-col justify-center gap-4 p-6 lg:p-8">
                    <PanelCopy
                      key={`copy-${active}`}
                      item={items[active]}
                      route={SERVICES[active].route}
                      learn={t.ui.homeServicesLearn}
                      reduced={!!reduced}
                    />
                  </div>

                  {/* The room behind the glass. The left-edge fade is applied
                      here, once, to the whole window: put on each take instead
                      it makes every layer transparent down its left side and
                      the take underneath shows through beside the current one. */}
                  <div className="relative overflow-hidden [mask-image:linear-gradient(to_right,transparent_0%,#000_16%)]">
                    {SERVICES.map((service, i) => (
                      <SceneLayer
                        key={service.scene}
                        scene={service.scene}
                        index={i}
                        active={active}
                        reduced={!!reduced}
                        driftY={sceneDriftY}
                        driftX={sceneDriftX}
                      />
                    ))}
                  </div>
                </div>

                <ul className="grid grid-cols-3 gap-y-2 border-t border-white/8 px-6 py-4 lg:px-8">
                  {t.ui.showcaseBullets[active].map((b, i) => (
                    <motion.li
                      key={`${active}-${b}`}
                      initial={reduced ? false : { opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.4, delay: 0.24 + i * 0.06, ease: EASE }}
                      className="label-micro flex items-start gap-2.5 text-white/45"
                    >
                      <Check className="size-3.5 shrink-0 text-primary" aria-hidden />
                      <span className="leading-tight">{b}</span>
                    </motion.li>
                  ))}
                </ul>
              </article>
            </div>
          </div>

          {/* ---- Mobile: the same sequence, scrolled rather than pinned ----- */}
          <ol className="space-y-8 lg:hidden">
            {SERVICES.map((service, i) => (
              <li key={service.scene}>
                <motion.div
                  initial={reduced ? false : { opacity: 0, y: 28 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-15% 0px" }}
                  transition={{ duration: 0.7, ease: EASE }}
                >
                  <ServicePanel
                    item={items[i]}
                    scene={service.scene}
                    route={service.route}
                    index={i}
                    learn={t.ui.homeServicesLearn}
                    bullets={t.ui.showcaseBullets[i]}
                    eager={false}
                    active
                    reduced={!!reduced}
                  />
                </motion.div>
              </li>
            ))}
          </ol>
        </motion.div>
      </div>
    </section>
  );
}

function ServicePanel({
  item,
  scene,
  route,
  index,
  learn,
  bullets,
  eager,
  active,
  reduced,
  drift,
}: {
  item: { title: string; tag: string };
  scene: SceneName;
  route: string;
  index: number;
  learn: string;
  bullets: readonly string[];
  eager: boolean;
  active: boolean;
  reduced: boolean;
  /** Scroll position within this service's beat, as a small vertical offset. */
  drift?: MotionValue<number>;
}) {
  /**
   * Inside the panel the copy arrives just behind the cut, in reading order.
   * These are supporting beats, not an authored entrance, so they are short —
   * the panel has finished moving before the last line lands.
   */
  const line = (i: number) => ({
    initial: false as const,
    animate: reduced || active ? { opacity: 1, y: 0 } : { opacity: 0, y: 10 },
    transition: {
      duration: 0.42,
      delay: active && !reduced ? 0.16 + i * 0.06 : 0,
      ease: EASE,
    },
  });

  return (
    <article className="flex h-full flex-col overflow-hidden rounded-2xl border border-white/10 bg-white/[0.025] shadow-[0_40px_90px_-40px_rgb(0_0_0/0.9)]">
      {/* Window chrome, as the reference frames every service screen. */}
      <div className="flex items-center gap-2.5 border-b border-white/8 px-5 py-3">
        <span aria-hidden className="size-2 rounded-full bg-white/18" />
        <span aria-hidden className="size-2 rounded-full bg-white/12" />
        <span aria-hidden className="size-2 rounded-full bg-white/12" />
        <span className="label-micro ml-3 text-white/35 tabular-nums">
          {String(index + 1).padStart(2, "0")} — elevateit.cz
        </span>
      </div>

      <div className="grid min-h-0 flex-1 grid-cols-1 sm:grid-cols-[1.05fr_0.95fr]">
        <div className="flex flex-col justify-center gap-4 p-6 lg:p-8">
          <motion.h3
            {...line(0)}
            className="heading-scene text-[clamp(1.4rem,1rem+1.1vw,2rem)] text-white"
          >
            {item.title}
          </motion.h3>
          <motion.p {...line(1)} className="text-[0.9375rem] leading-relaxed text-white/55">
            {item.tag}
          </motion.p>
          <motion.div {...line(2)} className="mt-1 self-start">
            <Link to={route} className="btn-primary text-sm">
              {learn}
              <ArrowRight className="size-4" aria-hidden />
            </Link>
          </motion.div>
        </div>

        {/* The room. Real photography, never a CSS approximation of one.
            On the cut the plate settles forward out of a slight push-in — a
            one-shot tied to the change, not a perpetual ken-burns loop, so
            nothing keeps moving once the reader has stopped. */}
        <div className="relative min-h-[14rem] overflow-hidden">
          <motion.div
            initial={false}
            animate={{ scale: reduced || active ? 1.07 : 1.12 }}
            transition={{ duration: active && !reduced ? 1.15 : 0, ease: EASE }}
            style={drift ? { y: drift } : undefined}
            className="absolute inset-0 origin-center"
          >
            <SceneImage
              name={scene}
              alt=""
              priority={eager}
              sizes="(min-width: 1024px) 30vw, 45vw"
              className="absolute inset-0 block h-full w-full"
              imgClassName="h-full w-full object-cover object-[50%_20%] sm:[mask-image:linear-gradient(to_right,transparent_0%,#000_16%)]"
            />
          </motion.div>
        </div>
      </div>

      {/* Capability strip. One repeated mark rather than a different icon per
          row: three unrelated glyphs at this size read as noise, and the craft
          floor asks for a single consistent stroke. */}
      <ul className="grid grid-cols-1 gap-y-2 border-t border-white/8 px-6 py-4 sm:grid-cols-3 lg:px-8">
        {bullets.map((b, i) => (
          <motion.li
            key={b}
            {...line(3 + i)}
            className="label-micro flex items-start gap-2.5 text-white/45"
          >
            <Check className="size-3.5 shrink-0 text-primary" aria-hidden />
            {/* Wraps rather than truncates: the longest RU/UA labels overrun a
                third of the strip, and a label cut mid-word reads as a bug. */}
            <span className="leading-tight">{b}</span>
          </motion.li>
        ))}
      </ul>
    </article>
  );
}

/**
 * One take of the room, behind the glass.
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
        <SceneImage
          name={scene}
          alt=""
          priority={index === 0}
          sizes="(min-width: 1024px) 30vw, 45vw"
          className="absolute inset-0 block h-full w-full"
          imgClassName="h-full w-full scale-[1.12] object-cover object-[50%_20%]"
        />
      </motion.div>
    </motion.div>
  );
}

/** The caption inside the window. Remounted per service, so it re-reads. */
function PanelCopy({
  item,
  route,
  learn,
  reduced,
}: {
  item: { title: string; tag: string };
  route: string;
  learn: string;
  reduced: boolean;
}) {
  const line = (i: number) => ({
    initial: reduced ? false : { opacity: 0, y: 12 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.45, delay: reduced ? 0 : 0.18 + i * 0.07, ease: EASE },
  });
  return (
    <>
      <motion.h3
        {...line(0)}
        className="heading-scene text-[clamp(1.4rem,1rem+1.1vw,2rem)] text-white"
      >
        {item.title}
      </motion.h3>
      <motion.p {...line(1)} className="text-[0.9375rem] leading-relaxed text-white/55">
        {item.tag}
      </motion.p>
      <motion.div {...line(2)} className="mt-1 self-start">
        <Link to={route} className="btn-primary text-sm">
          {learn}
          <ArrowRight className="size-4" aria-hidden />
        </Link>
      </motion.div>
    </>
  );
}

export default ServicesShowcase;
