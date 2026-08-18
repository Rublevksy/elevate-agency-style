/**
 * /design-v2 — "Cinematic chapters".
 *
 * Not a page of sections: a film made of chapters. Every service scene from
 * src/assets/refs/ fills a whole screen through <RefImage>, the chapter text
 * stays pinned while the plate keeps moving, and chapters hand over to each
 * other with a scale + darken cut rather than a plain fade.
 *
 * Self-contained on purpose (spec §Границы и швы): directions do not reuse
 * each other's parts, and no production section is imported.
 */
import { useRef } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { motion, useReducedMotion, useScroll, useTransform, type MotionValue } from "framer-motion";
import { ArrowDown, ArrowRight } from "lucide-react";
import { Logo } from "@/components/Logo";
import { ExploreSwitcher } from "@/components/design-explore/ExploreSwitcher";
import { RefImage, type RefName } from "@/components/design-explore/RefImage";
import { useT } from "@/lib/i18n";

export const Route = createFileRoute("/design-v2")({
  component: DesignV2Page,
  head: () => ({
    meta: [
      { title: "V2 — Cinematic chapters — ELEVATE design exploration" },
      { name: "robots", content: "noindex, nofollow" },
    ],
    links: [
      { rel: "preconnect", href: "https://fonts.googleapis.com" },
      { rel: "preconnect", href: "https://fonts.gstatic.com", crossOrigin: "anonymous" },
      {
        rel: "stylesheet",
        href: "https://fonts.googleapis.com/css2?family=Newsreader:ital,opsz,wght@0,6..72,300;0,6..72,400;0,6..72,600;1,6..72,300&family=Space+Mono:wght@400;700&display=swap",
      },
    ],
  }),
});

/** Route-local display voice — the sitewide body voice stays Inter. */
const SERIF = "'Newsreader', Georgia, 'Times New Roman', serif";
const MONO = "'Space Mono', ui-monospace, SFMono-Regular, monospace";

/** Cinematic timing: slower and heavier than the site's standard curve. */
const CUT = [0.65, 0, 0.35, 1] as const;

/** t.ui.serviceStage order is [Weby, SEO, E-shopy, Branding, Aplikace]. */
const CHAPTER_PLATES: readonly RefName[] = [
  "svc-web",
  "svc-seo",
  "svc-eshop",
  "svc-branding",
  "svc-app",
];

function pad(n: number) {
  return String(n).padStart(2, "0");
}

function DesignV2Page() {
  return (
    <div className="bg-black text-white" style={{ fontFamily: "inherit" }}>
      <ExploreSwitcher active="design-v2" />
      <Opening />
      <Chapters />
      <Proof />
      <Finale />
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Opening frame — full-bleed plate, ken-burns push-in, words arriving */
/* ------------------------------------------------------------------ */

function Opening() {
  const { t } = useT();
  const reduced = useReducedMotion();
  const words = `${t.hero.title1} ${t.hero.title2}`.split(" ").filter(Boolean);

  return (
    <section className="relative h-screen w-full overflow-hidden">
      <motion.div
        className="absolute inset-0"
        initial={reduced ? false : { scale: 1 }}
        animate={reduced ? undefined : { scale: 1.05 }}
        transition={reduced ? undefined : { duration: 24, ease: "linear" }}
      >
        <RefImage
          name="hero-macbook"
          priority
          alt={t.hero.tag}
          className="block h-full w-full"
          imgClassName="h-full w-full origin-center scale-[1.05] object-cover object-[50%_70%] md:scale-[1.05] md:object-[50%_100%]"
          sizes="100vw"
        />
      </motion.div>

      {/* Scrim: readability, not decoration. */}
      <div
        aria-hidden="true"
        className="absolute inset-0"
        style={{
          background:
            "linear-gradient(to top, rgba(0,0,0,0.9) 0%, rgba(0,0,0,0.78) 30%, rgba(0,0,0,0.4) 54%, rgba(0,0,0,0.16) 72%, rgba(0,0,0,0.45) 100%)",
        }}
      />
      {/* Side scrim: anchors the text column, leaves the plate readable. */}
      <div
        aria-hidden="true"
        className="absolute inset-0"
        style={{
          background:
            "linear-gradient(to right, rgba(0,0,0,0.62) 0%, rgba(0,0,0,0.4) 34%, rgba(0,0,0,0.1) 64%, rgba(0,0,0,0) 84%)",
        }}
      />

      <div className="absolute inset-0 flex flex-col justify-between px-6 pb-10 pt-24 md:px-14 md:pb-14 md:pt-16">
        <div className="flex items-center justify-between gap-4">
          <Logo className="h-6 w-auto md:h-7" />
          <p
            className="text-right text-[0.6rem] uppercase leading-relaxed tracking-[0.3em] text-white/55 md:text-[0.7rem]"
            style={{ fontFamily: MONO }}
          >
            {t.hero.tag}
          </p>
        </div>

        <div className="mt-auto max-w-3xl pt-24">
          <h1
            className="text-[2.4rem] font-light leading-[1.03] tracking-[-0.02em] text-white md:text-[5rem]"
            style={{ fontFamily: SERIF }}
          >
            {words.map((word, i) => (
              <motion.span
                key={`${word}-${i}`}
                className="mr-[0.28em] inline-block"
                initial={reduced ? false : { opacity: 0, y: "0.5em", filter: "blur(6px)" }}
                animate={reduced ? undefined : { opacity: 1, y: 0, filter: "blur(0px)" }}
                transition={
                  reduced ? undefined : { duration: 0.9, delay: 0.25 + i * 0.13, ease: CUT }
                }
              >
                {word}
              </motion.span>
            ))}
          </h1>
          <motion.p
            className="mt-6 max-w-xl text-sm leading-relaxed text-white/65 md:mt-8 md:text-base"
            initial={reduced ? false : { opacity: 0 }}
            animate={reduced ? undefined : { opacity: 1 }}
            transition={reduced ? undefined : { duration: 1, delay: 0.4 + words.length * 0.13 }}
          >
            {t.hero.subtitle}
          </motion.p>
        </div>

        <div className="mt-8 flex items-end justify-between gap-6 md:mt-10">
          <span
            className="text-[0.6rem] uppercase tracking-[0.35em] text-white/45 md:text-[0.7rem]"
            style={{ fontFamily: MONO }}
          >
            {pad(0)} / {pad(CHAPTER_PLATES.length)}
          </span>
          <motion.span
            aria-hidden="true"
            className="flex items-center gap-2 text-[0.6rem] uppercase tracking-[0.3em] text-white/45"
            style={{ fontFamily: MONO }}
            animate={reduced ? undefined : { y: [0, 8, 0] }}
            transition={reduced ? undefined : { duration: 2.4, repeat: Infinity, ease: "easeInOut" }}
          >
            <ArrowDown className="h-3.5 w-3.5" strokeWidth={1.5} />
          </motion.span>
        </div>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/* Chapters — five full-frame plates, pinned text, cut-style handover  */
/* ------------------------------------------------------------------ */

function Chapters() {
  const { t } = useT();
  const reduced = useReducedMotion();
  const stage = t.ui.serviceStage;

  return (
    <div className="relative">
      {CHAPTER_PLATES.map((plate, i) => {
        const item = stage[i];
        if (!item) return null;
        return reduced ? (
          <StaticChapter key={plate} plate={plate} index={i} title={item.title} tag={item.tag} />
        ) : (
          <Chapter key={plate} plate={plate} index={i} title={item.title} tag={item.tag} />
        );
      })}
    </div>
  );
}

interface ChapterProps {
  plate: RefName;
  index: number;
  title: string;
  tag: string;
}

/**
 * One chapter = a 220vh scroll track whose inner layer is sticky, so the text
 * stays put on screen while the plate below it keeps travelling and the frame
 * scales/darkens on the way in and out — that is the "cut" between chapters.
 */
function Chapter({ plate, index, title, tag }: ChapterProps) {
  const ref = useRef<HTMLElement | null>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });

  // Frame: arrives pushed-in and bright, leaves pulled-back and dark — a cut.
  const frameScale = useTransform(scrollYProgress, [0, 0.5, 1], [1.14, 1, 0.9]);
  const frameDim = useTransform(scrollYProgress, [0, 0.2, 0.8, 1], [1, 0, 0, 1]);
  // Plate travels inside the frame while the text above it is pinned.
  const plateY = useTransform(scrollYProgress, [0, 1], ["-9%", "9%"]);
  const plateScale = useTransform(scrollYProgress, [0, 1], [1.16, 1.02]);
  const textOpacity = useTransform(scrollYProgress, [0.18, 0.34, 0.68, 0.84], [0, 1, 1, 0]);
  const textY = useTransform(scrollYProgress, [0.18, 0.34, 0.68, 0.84], [28, 0, 0, -28]);

  return (
    <section ref={ref} className="relative h-[220vh]">
      <div className="sticky top-0 h-screen overflow-hidden">
        <motion.div className="absolute inset-0" style={{ scale: frameScale }}>
          <motion.div className="absolute inset-[-10%]" style={{ y: plateY, scale: plateScale }}>
            <ChapterPlate plate={plate} title={title} />
          </motion.div>
        </motion.div>
        <ChapterScrim />
        <motion.div
          aria-hidden="true"
          className="absolute inset-0 bg-black"
          style={{ opacity: frameDim }}
        />
        <ChapterCaption
          index={index}
          title={title}
          tag={tag}
          opacity={textOpacity}
          y={textY}
        />
      </div>
    </section>
  );
}

function StaticChapter({ plate, index, title, tag }: ChapterProps) {
  return (
    <section className="relative min-h-screen overflow-hidden">
      <div className="absolute inset-0">
        <ChapterPlate plate={plate} title={title} />
      </div>
      <ChapterScrim />
      <ChapterCaption index={index} title={title} tag={tag} />
    </section>
  );
}

function ChapterPlate({ plate, title }: { plate: RefName; title: string }) {
  return (
    <RefImage
      name={plate}
      alt={title}
      className="block h-full w-full"
      imgClassName="h-full w-full object-cover object-[70%_center] md:object-[75%_center]"
      sizes="100vw"
    />
  );
}

function ChapterScrim() {
  return (
    <div
      aria-hidden="true"
      className="absolute inset-0"
      style={{
        background:
          "linear-gradient(90deg, rgba(0,0,0,0.95) 0%, rgba(0,0,0,0.82) 34%, rgba(0,0,0,0.28) 68%, rgba(0,0,0,0.55) 100%), linear-gradient(to top, rgba(0,0,0,0.8) 0%, rgba(0,0,0,0) 42%)",
      }}
    />
  );
}

function ChapterCaption({
  index,
  title,
  tag,
  opacity,
  y,
}: {
  index: number;
  title: string;
  tag: string;
  opacity?: MotionValue<number>;
  y?: MotionValue<number>;
}) {
  // One blue accent per chapter, and it is large: the leading clause of the
  // title. Everything after the first comma stays quiet.
  const [lead, ...rest] = title.split(",");
  const tail = rest.join(",").trim();

  return (
    <motion.div
      className="absolute inset-0 flex flex-col justify-center px-6 pt-24 md:px-14 md:pt-0"
      style={{ opacity, y }}
    >
      <div className="max-w-2xl">
        <span
          className="block text-[0.62rem] uppercase tracking-[0.4em] text-white/40 md:text-xs"
          style={{ fontFamily: MONO }}
        >
          {pad(index + 1)} / {pad(CHAPTER_PLATES.length)}
        </span>
        <h2
          className="mt-5 text-[2.4rem] font-light leading-[1.02] tracking-[-0.02em] md:mt-7 md:text-[5rem]"
          style={{ fontFamily: SERIF }}
        >
          <span className="text-primary">{lead}</span>
          {tail ? (
            <>
              <span className="text-white/85">,</span>
              <span className="block text-white/85">{tail}</span>
            </>
          ) : null}
        </h2>
        <p
          className="mt-6 max-w-md text-[0.72rem] uppercase leading-relaxed tracking-[0.22em] text-white/55 md:mt-8 md:text-xs"
          style={{ fontFamily: MONO }}
        >
          {tag}
        </p>
      </div>
    </motion.div>
  );
}

/* ------------------------------------------------------------------ */
/* Proof — typographic spread, no icons, no cards                      */
/* ------------------------------------------------------------------ */

function Proof() {
  const { t } = useT();
  return (
    <section className="relative border-t border-white/10 bg-black px-6 py-28 md:px-14 md:py-44">
      <div className="mx-auto max-w-5xl">
        <span
          className="block text-[0.62rem] uppercase tracking-[0.4em] text-white/40 md:text-xs"
          style={{ fontFamily: MONO }}
        >
          {t.results.eyebrow}
        </span>
        <h2
          className="mt-6 max-w-3xl text-[2.2rem] font-light leading-[1.05] tracking-[-0.02em] text-white md:text-[4.5rem]"
          style={{ fontFamily: SERIF }}
        >
          {t.results.title}
        </h2>
        <dl className="mt-16 md:mt-24">
          {t.results.items.map((item) => (
            <div
              key={item.l}
              className="flex flex-col gap-2 border-t border-white/10 py-8 md:flex-row md:items-baseline md:justify-between md:gap-10 md:py-12"
            >
              <dt
                className="text-[2rem] font-light leading-none tracking-[-0.02em] text-white md:text-[4rem]"
                style={{ fontFamily: SERIF }}
              >
                {item.n}
              </dt>
              <dd
                className="text-[0.7rem] uppercase tracking-[0.28em] text-white/50 md:text-right md:text-xs"
                style={{ fontFamily: MONO }}
              >
                {item.l}
              </dd>
            </div>
          ))}
        </dl>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/* Finale — last frame of the film                                     */
/* ------------------------------------------------------------------ */

function Finale() {
  const { t } = useT();
  const reduced = useReducedMotion();

  return (
    <section className="relative flex min-h-screen items-center overflow-hidden border-t border-white/10">
      <motion.div
        className="absolute inset-0"
        initial={reduced ? false : { scale: 1.1 }}
        whileInView={reduced ? undefined : { scale: 1 }}
        viewport={{ once: true, amount: 0.4 }}
        transition={reduced ? undefined : { duration: 2.4, ease: CUT }}
      >
        <RefImage
          name="hero-iphone"
          alt={t.hero.tag}
          className="block h-full w-full"
          imgClassName="h-full w-full object-cover object-center opacity-70"
          sizes="100vw"
        />
      </motion.div>
      <div
        aria-hidden="true"
        className="absolute inset-0"
        style={{
          background:
            "linear-gradient(to right, rgba(0,0,0,0.94) 0%, rgba(0,0,0,0.7) 45%, rgba(0,0,0,0.35) 100%)",
        }}
      />
      <div className="relative w-full px-6 py-28 md:px-14">
        <div className="mx-auto max-w-4xl">
          <h2
            className="text-[2.6rem] font-light leading-[1.02] tracking-[-0.02em] text-white md:text-[5.5rem]"
            style={{ fontFamily: SERIF }}
          >
            {t.cta.title}
          </h2>
          <p className="mt-6 max-w-lg text-sm leading-relaxed text-white/65 md:text-base">
            {t.cta.subtitle}
          </p>
          <Link
            to="/contact"
            className="group mt-12 inline-flex items-center gap-4 border-b border-primary pb-3 text-sm uppercase tracking-[0.28em] text-white transition-colors hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary md:text-base"
            style={{ fontFamily: MONO }}
          >
            {t.cta.btn}
            <ArrowRight
              className="h-4 w-4 transition-transform duration-500 group-hover:translate-x-1.5"
              strokeWidth={1.5}
            />
          </Link>
        </div>
      </div>
    </section>
  );
}
