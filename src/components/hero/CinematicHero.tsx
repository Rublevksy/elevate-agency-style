import { useRef } from "react";
import { Link } from "@tanstack/react-router";
import {
  motion,
  useScroll,
  useSpring,
  useTransform,
  useMotionValue,
  useReducedMotion,
  type MotionValue,
} from "framer-motion";
import { ArrowDown, ArrowUpRight } from "lucide-react";
import { ArrowObject } from "./ArrowObject";
import { ParticleField } from "./ParticleField";
import { ProjectVisual } from "@/lib/projects";
import { useProjects } from "@/lib/projects-i18n";

/**
 * Scroll-controlled cinematic hero.
 * One sticky scene, five states driven by scroll progress:
 * 01 arrow at rest → 02 camera closes in → 03 interface previews emerge →
 * 04 previews become real projects → 05 hand-off into SERVICES.
 */
export function CinematicHero() {
  const wrap = useRef<HTMLDivElement | null>(null);
  const reduced = useReducedMotion();
  const projects = useProjects().slice(0, 4);

  const { scrollYProgress } = useScroll({
    target: wrap,
    offset: ["start start", "end end"],
  });
  const p = useSpring(scrollYProgress, { stiffness: 90, damping: 24, mass: 0.4 });

  // Pointer parallax
  const mx = useMotionValue(0);
  const my = useMotionValue(0);
  const px = useSpring(mx, { stiffness: 60, damping: 18 });
  const py = useSpring(my, { stiffness: 60, damping: 18 });

  const sceneX = useTransform(px, [-1, 1], [26, -26]);
  const sceneY = useTransform(py, [-1, 1], [18, -18]);

  const scale = useTransform(p, [0, 0.35, 0.7, 1], [0.94, 1.22, 1.04, 0.8]);
  const rotateY = useTransform(px, [-1, 1], [reduced ? 0 : -14, reduced ? 0 : 14]);
  const tiltX = useTransform(py, [-1, 1], [8, -8]);
  const ringSpin = useTransform(p, [0, 1], [0, reduced ? 0 : 200]);

  const headlineOpacity = useTransform(p, [0, 0.16], [1, 0]);
  const headlineY = useTransform(p, [0, 0.16], [0, -40]);
  const headlineBlur = useTransform(p, [0, 0.16], ["blur(0px)", "blur(10px)"]);

  const workOpacity = useTransform(p, [0.62, 0.76, 0.92, 1], [0, 1, 1, 0.2]);
  const workY = useTransform(p, [0.62, 0.8], [60, 0]);

  const nextOpacity = useTransform(p, [0.9, 1], [0, 1]);
  const vignette = useTransform(p, [0, 0.5, 1], [0.35, 0.7, 0.45]);

  return (
    <div ref={wrap} className="relative h-[420vh] md:h-[500vh]">
      <div
        className="sticky top-0 h-[100svh] overflow-hidden"
        onPointerMove={(e) => {
          if (reduced) return;
          const r = e.currentTarget.getBoundingClientRect();
          mx.set(((e.clientX - r.left) / r.width) * 2 - 1);
          my.set(((e.clientY - r.top) / r.height) * 2 - 1);
        }}
      >
        {/* Depth backdrop */}
        <div className="absolute inset-0 bg-background" />
        <div className="absolute inset-0 grid-bg opacity-[0.16] [mask-image:radial-gradient(ellipse_at_center,black_10%,transparent_65%)]" />
        <motion.div
          aria-hidden
          className="absolute inset-0"
          style={{
            opacity: vignette,
            background:
              "radial-gradient(ellipse at 50% 55%, oklch(0.34 0.13 245 / 0.4), transparent 62%)",
          }}
        />
        <ParticleField className="absolute inset-0 h-full w-full" />

        {/* Scene */}
        <motion.div
          className="absolute inset-0 grid place-items-center"
          style={{ x: sceneX, y: sceneY }}
        >
          <ArrowObject scale={scale} rotateY={rotateY} rotateX={tiltX} ringSpin={ringSpin} />
        </motion.div>


        {/* STATE 01 — headline */}
        <motion.div
          className="absolute inset-x-0 bottom-[9vh] px-6 md:bottom-[12vh]"
          style={{ opacity: headlineOpacity, y: headlineY, filter: headlineBlur }}
        >
          <div className="mx-auto max-w-5xl text-center">
            <p className="mb-5 text-[10px] uppercase tracking-[0.4em] text-muted-foreground">
              Digital studio · Praha
            </p>
            <h1 className="mx-auto max-w-3xl text-[clamp(1.9rem,5.4vw,3.6rem)] font-semibold leading-[1.02] tracking-[-0.03em] text-foreground">
              Tvoříme digitální zážitky,
              <span className="block text-muted-foreground">které posouvají byznys.</span>
            </h1>

            <div className="mt-9 flex flex-col items-center justify-center gap-3 sm:flex-row sm:gap-5">
              <Link
                to="/contact"
                className="magnetic group inline-flex items-center gap-2 rounded-full border border-primary/40 bg-primary/10 px-6 py-3 text-[11px] font-semibold uppercase tracking-[0.22em] text-foreground backdrop-blur-md transition-all hover:border-primary hover:bg-primary/20"
              >
                Start project
                <ArrowUpRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
              </Link>
              <a
                href="#services"
                className="group inline-flex items-center gap-2 px-2 py-3 text-[11px] uppercase tracking-[0.22em] text-muted-foreground transition-colors hover:text-foreground"
              >
                Explore Elevate
                <ArrowDown className="h-3.5 w-3.5 transition-transform group-hover:translate-y-0.5" />
              </a>
            </div>
          </div>
        </motion.div>

        {/* STATE 04 — previews become real projects */}
        <motion.div
          className="absolute inset-x-0 bottom-[8vh] px-6"
          style={{ opacity: workOpacity, y: workY }}
        >
          <div className="mx-auto max-w-6xl">
            <p className="mb-5 text-center text-[10px] uppercase tracking-[0.4em] text-muted-foreground">
              Selected work
            </p>
            <div className="grid grid-cols-2 gap-3 md:grid-cols-4 md:gap-5">
              {projects.map((project) => (
                <Link
                  key={project.slug}
                  to="/projects/$slug"
                  params={{ slug: project.slug }}
                  className="group relative overflow-hidden rounded-xl border border-border bg-surface/60 backdrop-blur-md transition-all hover:border-primary/50"
                >
                  <div className="relative aspect-[4/3] overflow-hidden">
                    <div className="absolute inset-0 transition-transform duration-700 group-hover:scale-110">
                      <ProjectVisual project={project} />
                    </div>
                    <div className="absolute inset-0 bg-gradient-to-t from-background via-background/20 to-transparent" />
                  </div>
                  <div className="flex items-center justify-between gap-2 px-3 py-2.5">
                    <span className="truncate text-[11px] font-medium text-foreground">
                      {project.name}
                    </span>
                    <span className="text-[9px] uppercase tracking-[0.2em] text-primary">
                      {project.category}
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </motion.div>

        {/* STATE 05 — hand-off */}
        <motion.div
          aria-hidden
          className="absolute inset-x-0 bottom-6 text-center"
          style={{ opacity: nextOpacity }}
        >
          <span className="text-[10px] uppercase tracking-[0.45em] text-muted-foreground">
            Services ↓
          </span>
        </motion.div>

        {/* scroll hint */}
        <motion.div
          aria-hidden
          className="absolute left-6 bottom-6 hidden md:block"
          style={{ opacity: headlineOpacity }}
        >
          <div className="h-16 w-px bg-gradient-to-b from-transparent via-primary/60 to-transparent" />
        </motion.div>
      </div>
    </div>
  );
}

function PreviewCard({
  spread,
  x,
  y,
  r,
}: {
  spread: MotionValue<number>;
  x: number;
  y: number;
  r: number;
}) {
  const tx = useTransform(spread, (v) => `calc(-50% + ${x * v}vw)`);
  const ty = useTransform(spread, (v) => `calc(-50% + ${y * v}vh)`);
  return (
    <motion.div
      className="absolute left-1/2 top-1/2 w-[190px] rounded-lg border border-border bg-surface/60 p-3 backdrop-blur-xl"
      style={{
        x: tx,
        y: ty,
        rotate: r,
        boxShadow: "0 30px 70px -30px oklch(0.55 0.2 268 / 0.7)",
      }}
    >
      <div className="mb-2 flex gap-1">
        <span className="h-1 w-1 rounded-full bg-foreground/30" />
        <span className="h-1 w-1 rounded-full bg-foreground/30" />
        <span className="h-1 w-1 rounded-full bg-foreground/30" />
      </div>
      <div className="h-1.5 w-2/3 rounded-full bg-foreground/20" />
      <div className="mt-1.5 h-1.5 w-1/3 rounded-full bg-foreground/10" />
      <div className="mt-3 h-14 rounded-md bg-gradient-to-br from-primary/25 to-transparent" />
    </motion.div>
  );
}
