import { Link } from "@tanstack/react-router";
import { ArrowRight, ArrowUpRight, MapPin } from "lucide-react";
import { motion, useMotionValueEvent, useTransform, type MotionValue } from "framer-motion";
import { useState } from "react";
import { EASE, useAct, useMotionCapability } from "@/components/cinematic";
import { PROJECT_MAP_POINTS } from "@/lib/project-map";
import type { ProjectSlug } from "@/lib/projects";
import { useProjects } from "@/lib/projects-i18n";
import { useT } from "@/lib/i18n";
import { CLIENT_SITES, WorkImage } from "./client-work";
import { PragueMapScene } from "./PragueMapScene";

const INTRO_VP = 0.25;
const CASE_VP = 0.92;
const TAIL_VP = 0.25;
const COUNT = PROJECT_MAP_POINTS.length;
const PINNED_VP = INTRO_VP + COUNT * CASE_VP + TAIL_VP;
const VIEWPORTS = PINNED_VP + 1;
const PIN = PINNED_VP / VIEWPORTS;
const at = (vp: number) => vp / PINNED_VP;
const caseStart = (index: number) => INTRO_VP + index * CASE_VP;

export function CaseShowcase() {
  const { t } = useT();
  const projects = useProjects();
  const reduced = useMotionCapability() === "still";
  const act = useAct("cases", { viewports: VIEWPORTS, pin: PIN });
  const [activeIndex, setActiveIndex] = useState(0);

  useMotionValueEvent(act.progress, "change", (value) => {
    const next = Math.min(
      COUNT - 1,
      Math.max(0, Math.floor((value * PINNED_VP - INTRO_VP + CASE_VP * 0.35) / CASE_VP)),
    );
    setActiveIndex(next);
  });

  const jumpTo = (slug: ProjectSlug) => {
    const index = PROJECT_MAP_POINTS.findIndex((point) => point.slug === slug);
    const section = act.ref.current;
    if (index < 0 || !section) return;
    const top = section.getBoundingClientRect().top + window.scrollY;
    window.scrollTo({
      top: top + (caseStart(index) + 0.22) * window.innerHeight,
      behavior: reduced ? "auto" : "smooth",
    });
  };

  const header = (
    <div>
      <p className="label-micro flex items-center gap-4 text-muted-foreground">
        <span aria-hidden className="h-px w-10 bg-primary/70" />
        {t.ui.homeWorkEyebrow}
      </p>
      <h2 className="heading-scene mt-5 max-w-[18ch] text-[clamp(2rem,4vw,4.2rem)] text-foreground">
        {t.ui.homeWorkTitle}
      </h2>
      <p className="mt-5 max-w-[34rem] text-base leading-relaxed text-muted-foreground">
        {t.ui.mapSchematic}
      </p>
    </div>
  );

  return (
    <section
      ref={act.ref}
      id="work"
      aria-labelledby="work-title"
      style={{ "--cases-track": `${VIEWPORTS * 100}svh` } as React.CSSProperties}
      className="relative isolate bg-background xl:h-[var(--cases-track)] motion-reduce:xl:h-auto"
    >
      <h2 id="work-title" className="sr-only">
        {t.ui.homeWorkEyebrow}
      </h2>
      <div className="hidden overflow-hidden xl:sticky xl:top-0 xl:block xl:h-[100svh] motion-reduce:xl:hidden">
        <div className="container-luxe grid h-full grid-cols-[0.78fr_1.22fr] items-center gap-14 pt-24 pb-20">
          <div className="relative z-20">
            {header}
            <div className="relative mt-10 h-[23rem]">
              {PROJECT_MAP_POINTS.map((point, index) => {
                const project = projects.find((item) => item.slug === point.slug);
                const site = CLIENT_SITES.find((item) => item.slug === point.slug);
                if (!project || !site) return null;
                return (
                  <ProjectBeat
                    key={point.slug}
                    progress={act.progress}
                    index={index}
                    reduced={reduced}
                  >
                    <ProjectCard
                      project={project}
                      site={site}
                      index={index}
                      pendingLabel={t.ui.mapLocationPending}
                    />
                  </ProjectBeat>
                );
              })}
            </div>
          </div>
          <div className="relative h-[72svh] min-h-[38rem]">
            <PragueMapScene
              progress={act.progress}
              activeSlug={PROJECT_MAP_POINTS[activeIndex]?.slug}
              interactive
              onSelect={jumpTo}
              label={t.ui.mapSceneLabel}
            />
          </div>
        </div>
      </div>

      <div className="container-luxe py-24 xl:hidden motion-reduce:xl:block motion-reduce:xl:py-32">
        {header}
        <div className="relative mt-10 aspect-[5/4] min-h-[19rem] overflow-hidden border-y border-border md:aspect-[16/9]">
          <PragueMapScene activeSlug={PROJECT_MAP_POINTS[0]?.slug} label={t.ui.mapSceneLabel} />
        </div>
        <div className="mt-12 space-y-14">
          {PROJECT_MAP_POINTS.map((point, index) => {
            const project = projects.find((item) => item.slug === point.slug);
            const site = CLIENT_SITES.find((item) => item.slug === point.slug);
            if (!project || !site) return null;
            return (
              <article
                key={point.slug}
                className="grid gap-6 border-t border-border pt-6 md:grid-cols-[0.9fr_1.1fr] md:items-center"
              >
                <ProjectCard
                  project={project}
                  site={site}
                  index={index}
                  pendingLabel={t.ui.mapLocationPending}
                />
                <div className="relative aspect-[16/10] overflow-hidden bg-surface shadow-ambient">
                  <WorkImage
                    site={site}
                    kind="desktop"
                    alt={`${site.name} — ${site.domain}`}
                    sizes="(min-width: 768px) 52vw, 100vw"
                    className="absolute inset-0 block h-full w-full"
                    imgClassName="h-full w-full object-cover object-top"
                  />
                </div>
              </article>
            );
          })}
        </div>
        <Link
          to="/projects"
          className="mt-14 inline-flex min-h-11 items-center gap-2 text-sm font-medium text-muted-foreground hover:text-foreground"
        >
          {t.ui.homeWorkViewAll}
          <ArrowRight className="size-4" aria-hidden />
        </Link>
      </div>
    </section>
  );
}

function ProjectBeat({
  progress,
  index,
  reduced,
  children,
}: {
  progress: MotionValue<number>;
  index: number;
  reduced: boolean;
  children: React.ReactNode;
}) {
  const start = at(caseStart(index));
  const end = at(caseStart(index) + CASE_VP);
  const previous = index === 0 ? -0.1 : start - at(0.14);
  const next = index === COUNT - 1 ? 1.1 : end - at(0.08);
  const opacity = useTransform(progress, [previous, start, next, end], [0, 1, 1, 0]);
  const y = useTransform(
    progress,
    [previous, start, next, end],
    [reduced ? 0 : 30, 0, 0, reduced ? 0 : -26],
  );
  const visibility = useTransform(progress, (value) =>
    value >= previous && value <= end ? "visible" : "hidden",
  );
  return (
    <motion.div style={{ opacity, y, visibility }} className="absolute inset-0">
      {children}
    </motion.div>
  );
}

function ProjectCard({
  project,
  site,
  index,
  pendingLabel,
}: {
  project: ReturnType<typeof useProjects>[number];
  site: (typeof CLIENT_SITES)[number];
  index: number;
  pendingLabel: string;
}) {
  const { t } = useT();
  return (
    <div>
      <p className="label-micro flex items-center gap-3 text-muted-foreground">
        <span className="text-primary tabular-nums">{String(index + 1).padStart(2, "0")}</span>
        <span aria-hidden className="h-px w-8 bg-border" />
        {project.category}
      </p>
      <h3 className="heading-scene mt-4 text-[clamp(2rem,3.5vw,3.8rem)] text-foreground">
        {site.name}
      </h3>
      <p className="mt-4 max-w-[34rem] text-base leading-relaxed text-muted-foreground">
        {project.description}
      </p>
      <p className="mt-5 flex items-center gap-2 text-xs text-muted-foreground">
        <MapPin className="size-4 text-primary" aria-hidden />
        {pendingLabel}
      </p>
      <div className="mt-7 flex flex-wrap items-center gap-x-7 gap-y-4">
        <Link to="/projects/$slug" params={{ slug: site.slug }} className="btn-primary">
          {t.ui.casesOpen}
          <ArrowRight className="size-4" aria-hidden />
        </Link>
        <a
          href={site.url}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex min-h-11 items-center gap-2 text-sm font-medium text-muted-foreground hover:text-foreground"
        >
          {site.domain}
          <ArrowUpRight className="size-4" aria-hidden />
        </a>
      </div>
    </div>
  );
}

export default CaseShowcase;
