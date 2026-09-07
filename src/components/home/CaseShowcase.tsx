/**
 * Client work — four projects, entered rather than listed.
 *
 * THE REVERSE ANGLE. Services puts the scene on the right and the type on the
 * left. This section mirrors it: scene left, type right. That is not variety for
 * its own sake — it is the one move a camera makes when it stops describing a
 * space and starts looking back at what came out of it, and it is what stops two
 * consecutive pinned acts from reading as the same slide deck twice. For the
 * same reason the cut between projects is a horizontal push while the cut
 * between services is a vertical wipe: same world, different verb.
 *
 * WHAT THIS REPLACED. A hover list beside a bordered, rounded pane containing
 * `ProjectVisual` — which draws its own browser chrome, traffic lights and a
 * fake URL bar. So the page's evidence was a picture of a website inside a
 * picture of a browser inside a card, at a size where none of it could be read,
 * and the story of each project was one sentence. The data was always richer
 * than the presentation.
 *
 * THE STORY IS THE DATA, NOT AN INVENTION. `src/lib/projects-i18n.ts` already
 * carries `problem`, `solution` and `work[]` for every project in all four
 * languages, and `t.ui.project*Eyebrow` already labels them — the project detail
 * route has been rendering exactly these fields all along. Nothing here is
 * written for the occasion and no i18n key was added: the section reveals, in
 * order, what the brief asks a case to communicate.
 *
 *   PROBLEM      what was wrong          project.problem
 *   INTERVENTION what ELEVATE changed    project.solution
 *   WORK         design / development    project.work[]
 *
 * NUMBERS ARE DELIBERATELY ABSENT. `results[]` and the headline `result` still
 * exist in the data and are still rendered on the project detail route; they are
 * not shown here. PRODUCT.md section 33 records that no source for those figures
 * exists anywhere in the repository — they arrived in a squash import — and the
 * owner ruled on 2026-09-05 that unverified figures must not be presented as
 * fact on the homepage. What remains is what is verified: real clients, real
 * domains, real live screenshots of the sites themselves.
 */
import { useState } from "react";
import { Link } from "@tanstack/react-router";
import { ArrowRight, ArrowUpRight } from "lucide-react";
import { motion, useMotionValueEvent, useTransform } from "framer-motion";
import { EASE, useAct, useMotionCapability } from "@/components/cinematic";
import { screenshotUrl } from "@/lib/projects";
import { useProjects, type LocalizedProject } from "@/lib/projects-i18n";
import { useT } from "@/lib/i18n";

/**
 * The act. Each project owns a little over a viewport of track — enough for its
 * three story beats to land one at a time rather than arriving as a block — and
 * the stage un-pins over the last one, which is the length the closing section
 * hands itself to.
 */
const CASES_VIEWPORTS = 5.6;
const CASES_PIN = (CASES_VIEWPORTS - 1) / CASES_VIEWPORTS;

/**
 * The scene box: a wide projection standing off the left edge, at the aspect
 * the screenshot service actually returns.
 *
 * It was a full-height portrait box first, requesting a 1440x1800 capture. The
 * service does not honour a portrait request — it returns a landscape frame —
 * so `object-cover` into a 4:5 box scaled the site to roughly twice its size and
 * showed a fragment of one heading. A website shown as an unreadable fragment is
 * not evidence of anything. At 16:10 the capture lands unscaled and the whole
 * page reads, which is the only reason the plate is here.
 */
const SCENE_SHOT: [number, number] = [1600, 1000];
const SCENE_WIDTH = `min(56%, calc(78svh * ${SCENE_SHOT[0] / SCENE_SHOT[1]}))`;

/** Where each story beat opens, in a project's own share of the track. */
const BEATS: ReadonlyArray<[number, number]> = [
  [0.12, 0.28],
  [0.36, 0.52],
  [0.6, 0.76],
];

/** The gate the project names roll through, in pixels. */
const NAME_GATE = 108;

export function CaseShowcase() {
  const { t } = useT();
  const projects = useProjects();
  const capability = useMotionCapability();
  const reduced = capability === "still";
  const [active, setActive] = useState(0);

  const count = projects.length;
  const act = useAct("cases", { viewports: CASES_VIEWPORTS, pin: CASES_PIN });
  const { ref, progress, enter } = act;

  const introY = useTransform(enter, [0, 1], [reduced ? 0 : 48, 0]);
  const introFade = useTransform(enter, [0, 0.6], [reduced ? 1 : 0.3, 1]);

  useMotionValueEvent(progress, "change", (p) => {
    const next = Math.min(count - 1, Math.max(0, Math.floor(p * count * 0.999)));
    setActive((prev) => (prev === next ? prev : next));
  });

  /**
   * Position inside the current project, 0 → 1. Derived rather than stored: it
   * is a pure function of the act's clock, so scrolling back plays the story
   * backwards by construction and there is no state to desynchronise.
   */
  const sub = useTransform(progress, (v) => {
    const s = Math.min(Math.max(v, 0), 0.99999) * count;
    return s - Math.floor(s);
  });

  const beat0 = useTransform(sub, BEATS[0], [0, 1]);
  const beat1 = useTransform(sub, BEATS[1], [0, 1]);
  const beat2 = useTransform(sub, BEATS[2], [0, 1]);
  const beat0Y = useTransform(beat0, [0, 1], [18, 0]);
  const beat1Y = useTransform(beat1, [0, 1], [18, 0]);
  const beat2Y = useTransform(beat2, [0, 1], [18, 0]);
  const beats = [
    { fade: beat0, y: beat0Y },
    { fade: beat1, y: beat1Y },
    { fade: beat2, y: beat2Y },
  ];
  /** The story's spine, drawn from the first beat opening to the last landing. */
  const spine = useTransform(sub, [BEATS[0][0], BEATS[2][1]], [0, 1]);

  // The camera keeps moving through the whole act, so a project that is holding
  // still on screen is never a frozen picture.
  const sceneDriftY = useTransform(progress, [0, 1], [reduced ? 0 : -22, reduced ? 0 : 22]);
  const railFill = useTransform(progress, [0, 1], [0, 1]);

  const jumpToBeat = (i: number) => {
    const el = ref.current;
    if (!el || typeof window === "undefined") return;
    const top = el.getBoundingClientRect().top + window.scrollY;
    const travel = el.offsetHeight - window.innerHeight;
    if (travel <= 0) return;
    window.scrollTo({
      top: top + ((i + 0.35) / count) * travel,
      behavior: reduced ? "auto" : "smooth",
    });
  };

  const current = projects[active];
  if (!current) return null;

  const labels = [t.ui.projectProblemEyebrow, t.ui.projectSolutionEyebrow, t.ui.projectWorkEyebrow];

  return (
    <section
      ref={ref}
      className="relative z-10 bg-[#0A0D13] lg:h-[560vh]"
      aria-label={t.ui.homeWorkTitle}
    >
      {/* ---- Desktop stage ---------------------------------------------- */}
      <div className="hidden lg:sticky lg:top-0 lg:block lg:h-svh lg:overflow-hidden">
        <motion.div style={{ y: introY, opacity: introFade }} className="absolute inset-0">
          {/* THE SCENE — the client's actual site, full height, no mockup and
              no chrome around it. `ProjectVisual` is deliberately not used
              here: it frames the screenshot in a drawn browser window, which
              is a picture of a browser rather than the work. The domain is
              stated in type on the other side of the frame, which is where a
              film puts a caption. */}
          <div
            aria-hidden
            style={{ width: SCENE_WIDTH }}
            className="absolute inset-y-0 left-0 flex items-center"
          >
            <motion.div
              style={{ y: sceneDriftY, aspectRatio: `${SCENE_SHOT[0]} / ${SCENE_SHOT[1]}` }}
              className="relative w-full"
            >
              <div className="absolute inset-0 overflow-hidden [mask-image:radial-gradient(112%_98%_at_0%_50%,#000_0%,#000_22%,transparent_96%)]">
                {projects.map((p, i) => (
                  <SceneReel key={p.slug} project={p} index={i} active={active} reduced={reduced} />
                ))}
              </div>
              {/* SEATING THE SITE IN THE ROOM.
                Real client sites are not all dark, and two of these four are
                mostly white. Dropped full-strength into a black film a white
                page does not read as work being shown — it reads as a hole
                punched in the frame, and everything around it loses its floor.
                So the projection is dimmed a quarter and its top and bottom
                dissolved: enough that the site still reads as itself and its
                own colour survives, not so much that it is lit like a lightbox
                in a dark room. The alternative — desaturating or heavily
                tinting it — would be misrepresenting the work, which is the one
                thing this section may never do. */}
              <div aria-hidden className="pointer-events-none absolute inset-0 bg-[#0A0D13]/25" />
              <div
                aria-hidden
                className="pointer-events-none absolute inset-x-0 top-0 h-[22%] bg-[linear-gradient(to_bottom,#0A0D13_0%,transparent_100%)]"
              />
              <div
                aria-hidden
                className="pointer-events-none absolute inset-x-0 bottom-0 h-[34%] bg-[linear-gradient(to_top,#0A0D13_0%,transparent_100%)]"
              />
            </motion.div>
          </div>

          {/* ---- The story, on the right ------------------------------------ */}
          <div className="container-luxe relative flex h-full flex-col items-end justify-between pt-[max(7.5rem,12svh)] pb-[8svh]">
            <div className="flex w-full max-w-[32rem] items-baseline gap-4 xl:max-w-[36rem]">
              <p className="label-micro flex items-center gap-3 text-white/55">
                <span aria-hidden className="size-[5px] rounded-full bg-primary" />
                {t.ui.homeWorkEyebrow}
              </p>
              <span className="label-micro tabular-nums text-white/25">
                {String(active + 1).padStart(2, "0")} / {String(count).padStart(2, "0")}
              </span>
            </div>

            <div className="w-full max-w-[32rem] xl:max-w-[36rem]">
              {/* The client's name, rolling on the cut. Bottom-aligned inside
                  the gate so a one-line name sits the same distance above the
                  line under it as a two-line one. */}
              <div
                className="relative overflow-hidden [mask-image:linear-gradient(to_bottom,transparent_0%,transparent_3%,#000_12%,#000_100%)]"
                style={{ height: NAME_GATE }}
              >
                {projects.map((p, i) => (
                  <motion.div
                    key={p.slug}
                    aria-hidden={i !== active}
                    initial={false}
                    animate={{ y: (i - active) * NAME_GATE }}
                    transition={reduced ? { duration: 0 } : { duration: 0.7, ease: EASE }}
                    className="absolute inset-x-0 top-0 flex h-full flex-col justify-end"
                  >
                    <span className="label-micro block text-primary">{p.category}</span>
                    <h3 className="heading-scene mt-2 text-[clamp(1.6rem,1.1rem+1.5vw,2.4rem)] text-white">
                      {p.name}
                    </h3>
                  </motion.div>
                ))}
              </div>

              <p className="mt-4 max-w-[46ch] text-[0.9375rem] leading-relaxed text-white/60">
                {current.description}
              </p>

              {/* THE STORY. Three beats, opened one at a time by position
                  inside this project's own stretch of track — the reader
                  descends through the project rather than reading a block. */}
              {/* The spine draws itself as the story opens, rather than
                  standing full-length beside two beats that have not arrived —
                  a rule running down past nothing reads as a layout that failed
                  to fill. It is the same device as the rails: a line that
                  reports where the reader is. */}
              <ol className="relative mt-8 space-y-6 pl-6">
                <span aria-hidden className="absolute inset-y-0 left-0 w-px bg-white/8" />
                <motion.span
                  aria-hidden
                  style={{ scaleY: reduced ? 1 : spine }}
                  className="absolute inset-y-0 left-0 w-px origin-top bg-white/20"
                />
                {[current.problem, current.solution, current.work.join(" · ")].map((body, i) => (
                  <motion.li
                    key={`${current.slug}-${i}`}
                    style={{
                      opacity: reduced ? 1 : beats[i].fade,
                      y: reduced ? 0 : beats[i].y,
                    }}
                    className="relative"
                  >
                    <span
                      aria-hidden
                      className="absolute -left-[1.6rem] top-[0.45rem] size-1.5 rounded-full bg-primary"
                    />
                    <p className="label-micro text-white/40">
                      {String(i + 1).padStart(2, "0")} — {labels[i]}
                    </p>
                    <p className="mt-2 max-w-[52ch] text-[0.9375rem] leading-relaxed text-white/70">
                      {body}
                    </p>
                  </motion.li>
                ))}
              </ol>

              <div className="mt-8 flex flex-wrap items-center gap-x-7 gap-y-3">
                <Link
                  to="/projects/$slug"
                  params={{ slug: current.slug }}
                  className="btn-primary text-sm"
                >
                  {t.ui.casesOpen}
                  <ArrowRight className="size-4" aria-hidden />
                </Link>
                <a
                  href={`https://${current.domain}`}
                  target="_blank"
                  rel="noreferrer noopener"
                  className="label-micro flex items-center gap-2 text-white/45 transition-colors hover:text-primary"
                >
                  {current.domain}
                  <ArrowUpRight className="size-3.5" aria-hidden />
                </a>
              </div>
            </div>

            {/* The rail, along the floor — the reader's position in the body of
                work, and a control that jumps to it. */}
            <div className="w-full max-w-[32rem] xl:max-w-[36rem]">
              <ol className="relative flex items-center">
                <span
                  aria-hidden
                  className="absolute inset-x-0 top-1/2 h-px -translate-y-1/2 bg-white/10"
                />
                <motion.span
                  aria-hidden
                  style={{ scaleX: reduced ? (active + 1) / count : railFill }}
                  className="absolute inset-x-0 top-1/2 h-px origin-left -translate-y-1/2 bg-primary shadow-[0_0_10px_oklch(0.65_0.18_255/0.6)]"
                />
                {projects.map((p, i) => {
                  const on = i === active;
                  return (
                    <li key={p.slug} className="relative min-w-0 flex-1">
                      <button
                        type="button"
                        onClick={() => jumpToBeat(i)}
                        aria-current={on ? "true" : undefined}
                        className="group flex w-full min-w-0 flex-col items-start gap-3 py-4 text-left focus-visible:outline-none"
                      >
                        <span className="sr-only">{p.name}</span>
                        <span
                          aria-hidden
                          className={`block size-2.5 rounded-full border transition-all duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] ${
                            on
                              ? "scale-125 border-primary bg-primary shadow-[0_0_0_5px_oklch(0.65_0.18_255/0.18)]"
                              : "border-white/25 bg-[#0A0D13] group-hover:border-primary/70 group-focus-visible:border-primary"
                          }`}
                        />
                        {/* `min-w-0` on both the item and the button, or the
                            flex item refuses to shrink below its text and the
                            four names run into one another instead of
                            truncating — which is what they did. */}
                        <span
                          aria-hidden
                          className={`label-micro block w-full truncate pr-3 transition-colors duration-500 ${
                            on ? "text-primary" : "text-white/25 group-hover:text-white/55"
                          }`}
                        >
                          {p.name}
                        </span>
                      </button>
                    </li>
                  );
                })}
              </ol>
              <Link
                to="/projects"
                className="mt-2 inline-flex items-center gap-2 text-sm font-medium text-white/60 underline-offset-8 transition-colors hover:text-white hover:underline"
              >
                {t.ui.homeWorkViewAll}
                <ArrowRight className="size-4" aria-hidden />
              </Link>
            </div>
          </div>
        </motion.div>
      </div>

      {/* ---- Mobile: the same story, scrolled ----------------------------- */}
      <div className="lg:hidden">
        <div className="container-luxe pt-24 pb-12">
          <p className="label-micro flex items-center gap-3 text-white/55">
            <span aria-hidden className="size-[5px] rounded-full bg-primary" />
            {t.ui.homeWorkEyebrow}
          </p>
          <h2 className="heading-scene mt-5 text-[clamp(1.9rem,1.3rem+1.9vw,2.9rem)] text-white">
            {t.ui.homeWorkTitle}
          </h2>
        </div>
        <ol>
          {projects.map((p, i) => (
            <li key={p.slug}>
              <MobileCase
                project={p}
                index={i}
                labels={labels}
                open={t.ui.casesOpen}
                reduced={reduced}
              />
            </li>
          ))}
        </ol>
        <div className="container-luxe pb-20">
          <Link
            to="/projects"
            className="inline-flex items-center gap-2 text-sm font-medium text-white/60 underline-offset-8 transition-colors hover:text-white hover:underline"
          >
            {t.ui.homeWorkViewAll}
            <ArrowRight className="size-4" aria-hidden />
          </Link>
        </div>
      </div>
    </section>
  );
}

/** One reel: the project's live site, pushed in from the side on the cut. */
function SceneReel({
  project,
  index,
  active,
  reduced,
}: {
  project: LocalizedProject;
  index: number;
  active: number;
  reduced: boolean;
}) {
  const on = index === active;
  return (
    <motion.div
      aria-hidden={!on}
      initial={false}
      animate={{
        x: `${(index - active) * 46}%`,
        opacity: on ? 1 : 0,
        scale: on ? 1 : 1.08,
        filter: on ? "blur(0px)" : "blur(8px)",
      }}
      transition={{
        duration: reduced ? 0 : 0.9,
        ease: EASE,
        opacity: { duration: reduced ? 0 : 0.45, ease: EASE },
      }}
      className="absolute inset-0"
      style={{ zIndex: on ? 2 : 1 }}
    >
      <img
        src={screenshotUrl(`https://${project.domain}`, 1600, 1000)}
        alt=""
        loading={index === 0 ? "eager" : "lazy"}
        decoding="async"
        className="h-full w-full object-cover object-top"
      />
    </motion.div>
  );
}

/** Mobile: the picture is the frame, the story stands under it on black. */
function MobileCase({
  project,
  index,
  labels,
  open,
  reduced,
}: {
  project: LocalizedProject;
  index: number;
  labels: string[];
  open: string;
  reduced: boolean;
}) {
  const body = [project.problem, project.solution, project.work.join(" · ")];
  return (
    <motion.article
      initial={reduced ? false : { opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true, margin: "-10% 0px" }}
      transition={{ duration: 0.7, ease: EASE }}
      className="relative pb-16"
    >
      <div className="relative h-[52svh] overflow-hidden">
        <img
          src={screenshotUrl(`https://${project.domain}`, 1600, 1000)}
          alt=""
          loading="lazy"
          decoding="async"
          className="h-full w-full object-cover object-top"
        />
        {/* Seated the same way the desktop projection is, and for the same
            reason: two of these four sites are mostly white, and a white page at
            full strength against this black reads as a hole rather than as work
            being shown. Dimmed a quarter, dissolved at the top so it does not
            butt into the case above in a hard line, and grounded at the bottom
            so the type that follows stands on black. */}
        <div aria-hidden className="absolute inset-0 bg-[#0A0D13]/25" />
        <div
          aria-hidden
          className="absolute inset-0 bg-[linear-gradient(to_bottom,#0A0D13_0%,transparent_18%)]"
        />
        <div
          aria-hidden
          className="absolute inset-0 bg-[linear-gradient(to_top,#0A0D13_0%,transparent_55%)]"
        />
      </div>
      <div className="container-luxe -mt-10 relative">
        <span className="label-micro block text-primary">{project.category}</span>
        <h3 className="heading-scene mt-2 text-[clamp(1.5rem,1.1rem+2.2vw,2rem)] text-white">
          {project.name}
        </h3>
        <p className="mt-3 max-w-[44ch] text-[0.9375rem] leading-relaxed text-white/60">
          {project.description}
        </p>
        <ol className="mt-6 space-y-5 border-l border-white/10 pl-5">
          {body.map((b, i) => (
            <li key={i}>
              <p className="label-micro text-white/40">
                {String(i + 1).padStart(2, "0")} — {labels[i]}
              </p>
              <p className="mt-1.5 text-[0.9375rem] leading-relaxed text-white/70">{b}</p>
            </li>
          ))}
        </ol>
        <div className="mt-6 flex flex-wrap items-center gap-x-6 gap-y-3">
          <Link
            to="/projects/$slug"
            params={{ slug: project.slug }}
            className="btn-primary text-sm"
          >
            {open}
            <ArrowRight className="size-4" aria-hidden />
          </Link>
          <a
            href={`https://${project.domain}`}
            target="_blank"
            rel="noreferrer noopener"
            className="label-micro flex items-center gap-2 text-white/45"
          >
            {project.domain}
            <ArrowUpRight className="size-3.5" aria-hidden />
          </a>
        </div>
      </div>
      <span className="sr-only">{index + 1}</span>
    </motion.article>
  );
}

export default CaseShowcase;
