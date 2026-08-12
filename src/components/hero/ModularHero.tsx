import { useMemo, useRef, useState } from "react";
import { Link } from "@tanstack/react-router";
import {
  AnimatePresence,
  motion,
  useMotionValue,
  useReducedMotion,
  useScroll,
  useSpring,
  useTransform,
} from "framer-motion";
import { ArrowUpRight, X } from "lucide-react";
import markAsset from "@/assets/elevate-mark-transparent.png.asset.json";
import { screenshotUrl } from "@/lib/projects";
import { useProjects } from "@/lib/projects-i18n";
import { useT, type Lang } from "@/lib/i18n";

/* ------------------------------------------------------------------ *
 * Copy — short, editorial, four languages.
 * ------------------------------------------------------------------ */
const COPY: Record<
  Lang,
  {
    eyebrow: string;
    line1: string;
    line2: string;
    note: string;
    start: string;
    work: string;
    system: string;
    disciplines: string;
    ask: string;
    live: string;
    labels: string[];
    kinds: string[];
  }
> = {
  CZ: {
    eyebrow: "Digitální studio · Praha",
    line1: "Digitální produkty",
    line2: "pro moderní byznys.",
    note: "Strategie, design a vývoj v jednom systému.",
    start: "Start project",
    work: "Vybrané projekty",
    system: "Systém ELEVATE",
    disciplines: "Disciplíny",
    ask: "Co potřebujete?",
    live: "Živý náhled",
    labels: ["E-commerce", "Weby", "Webové aplikace", "Branding", "Digitální produkty"],
    kinds: ["Web", "E-commerce", "Webová aplikace", "Branding", "Něco jiného"],
  },
  EN: {
    eyebrow: "Digital studio · Prague",
    line1: "Digital products",
    line2: "for modern business.",
    note: "Strategy, design and engineering in one system.",
    start: "Start project",
    work: "Selected work",
    system: "The ELEVATE system",
    disciplines: "Disciplines",
    ask: "What do you need?",
    live: "Live preview",
    labels: ["E-commerce", "Websites", "Web apps", "Branding", "Digital products"],
    kinds: ["Website", "E-commerce", "Web application", "Branding", "Something else"],
  },
  RU: {
    eyebrow: "디digital студия · Прага",
    line1: "Цифровые продукты",
    line2: "для современного бизнеса.",
    note: "Стратегия, дизайн и разработка в одной системе.",
    start: "Начать проект",
    work: "Избранные проекты",
    system: "Система ELEVATE",
    disciplines: "Направления",
    ask: "Что вам нужно?",
    live: "Живой превью",
    labels: ["E-commerce", "Сайты", "Веб-приложения", "Брендинг", "Цифровые продукты"],
    kinds: ["Сайт", "Интернет-магазин", "Веб-приложение", "Брендинг", "Другое"],
  },
  UA: {
    eyebrow: "Диджитал студія · Прага",
    line1: "Цифрові продукти",
    line2: "для сучасного бізнесу.",
    note: "Стратегія, дизайн і розробка в одній системі.",
    start: "Почати проєкт",
    work: "Вибрані проєкти",
    system: "Система ELEVATE",
    disciplines: "Напрями",
    ask: "Що вам потрібно?",
    live: "Живий перегляд",
    labels: ["E-commerce", "Сайти", "Вебзастосунки", "Брендинг", "Цифрові продукти"],
    kinds: ["Сайт", "Інтернет-магазин", "Вебзастосунок", "Брендинг", "Інше"],
  },
};

// Discipline → project slug + module signature (how the canvas rearranges).
const TRACKS = [
  { slug: "exclusive-beauty", cols: 3, rows: 2, chrome: "shop" },
  { slug: "biodent-clinic", cols: 2, rows: 3, chrome: "site" },
  { slug: "euromotors", cols: 4, rows: 2, chrome: "app" },
  { slug: "psk-olymp-praha", cols: 2, rows: 2, chrome: "brand" },
  { slug: "nhome-praha", cols: 3, rows: 3, chrome: "site" },
] as const;

export function ModularHero() {
  const { lang } = useT();
  const c = COPY[lang];
  const projects = useProjects();
  const reduced = useReducedMotion();
  const wrap = useRef<HTMLDivElement | null>(null);

  const [active, setActive] = useState(0);
  const [open, setOpen] = useState(false);

  const track = TRACKS[active];
  const project = useMemo(
    () => projects.find((p) => p.slug === track.slug) ?? projects[0],
    [projects, track.slug],
  );
  const satellites = useMemo(
    () => projects.filter((p) => p.slug !== track.slug).slice(0, 2),
    [projects, track.slug],
  );

  /* micro-parallax */
  const mx = useMotionValue(0);
  const my = useMotionValue(0);
  const px = useSpring(mx, { stiffness: 70, damping: 20 });
  const py = useSpring(my, { stiffness: 70, damping: 20 });
  const canvasX = useTransform(px, [-1, 1], reduced ? [0, 0] : [12, -12]);
  const canvasY = useTransform(py, [-1, 1], reduced ? [0, 0] : [8, -8]);
  const tilt = useTransform(px, [-1, 1], reduced ? [0, 0] : [3, -3]);

  /* scroll continuation — the hero hands itself to the next section */
  const { scrollYProgress } = useScroll({ target: wrap, offset: ["start start", "end start"] });
  const sp = useSpring(scrollYProgress, { stiffness: 90, damping: 26, mass: 0.4 });
  const canvasScale = useTransform(sp, [0, 1], [1, 0.86]);
  const canvasShift = useTransform(sp, [0, 1], ["0%", "-14%"]);
  const textShift = useTransform(sp, [0, 1], [0, -70]);
  const textFade = useTransform(sp, [0, 0.75], [1, 0]);
  const railShift = useTransform(sp, [0, 1], [0, 60]);

  return (
    <div ref={wrap} className="relative h-[168vh] md:h-[180vh]">
      <section
        className="sticky top-0 flex h-[100svh] flex-col overflow-hidden"
        onPointerMove={(e) => {
          if (reduced) return;
          const r = e.currentTarget.getBoundingClientRect();
          mx.set(((e.clientX - r.left) / r.width) * 2 - 1);
          my.set(((e.clientY - r.top) / r.height) * 2 - 1);
        }}
      >
        {/* atmosphere: one soft blue light, hairline grid, fine grain */}
        <div className="absolute inset-0 bg-background" />
        <div className="absolute -left-40 top-1/4 h-[34rem] w-[34rem] rounded-full bg-primary/10 blur-[160px]" />
        <div
          aria-hidden
          className="absolute inset-0 opacity-[0.05]"
          style={{
            backgroundImage:
              "linear-gradient(to right, currentColor 1px, transparent 1px), linear-gradient(to bottom, currentColor 1px, transparent 1px)",
            backgroundSize: "88px 88px",
            color: "oklch(0.75 0.02 250)",
            maskImage: "linear-gradient(to bottom, black, transparent 85%)",
          }}
        />
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 opacity-[0.35] mix-blend-soft-light"
          style={{
            backgroundImage:
              "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='140' height='140'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='2'/%3E%3C/filter%3E%3Crect width='140' height='140' filter='url(%23n)' opacity='0.35'/%3E%3C/svg%3E\")",
          }}
        />

        {/* ---------------- modular grid ---------------- */}
        <div className="container-luxe relative flex min-h-0 flex-1 flex-col pt-24 md:pt-28">
          <div className="grid min-h-0 flex-1 grid-cols-1 gap-8 lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.5fr)_minmax(0,0.7fr)] lg:gap-10">
            {/* LEFT — statement module */}
            <motion.div
              style={{ y: textShift, opacity: textFade }}
              className="flex flex-col justify-center lg:border-r lg:border-border/60 lg:pr-10"
            >
              <div className="mb-6 flex items-center gap-3">
                <img src={mark} alt="ELEVATE" className="h-7 w-auto" />
                <span className="h-px w-8 bg-border" />
                <span className="text-[10px] uppercase tracking-[0.35em] text-muted-foreground">
                  {c.eyebrow}
                </span>
              </div>
              <h1 className="text-[clamp(1.7rem,3.1vw,2.6rem)] font-semibold leading-[1.06] tracking-[-0.03em] text-foreground">
                {c.line1}
                <span className="block text-muted-foreground">{c.line2}</span>
              </h1>
              <p className="mt-5 max-w-xs text-sm leading-relaxed text-muted-foreground">{c.note}</p>

              <div className="mt-8 flex items-center gap-4">
                <button
                  type="button"
                  onClick={() => setOpen(true)}
                  className="group inline-flex items-center gap-2 rounded-full border border-primary/40 bg-primary/10 px-5 py-2.5 text-[11px] font-semibold uppercase tracking-[0.2em] text-foreground backdrop-blur-md transition-all hover:border-primary hover:bg-primary/20"
                >
                  {c.start}
                  <ArrowUpRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                </button>
                <Link
                  to="/projects"
                  className="text-[11px] uppercase tracking-[0.2em] text-muted-foreground transition-colors hover:text-foreground"
                >
                  {c.work}
                </Link>
              </div>
            </motion.div>

            {/* CENTER — living canvas */}
            <motion.div
              style={{ x: canvasX, y: canvasY, scale: canvasScale, translateY: canvasShift }}
              className="relative min-h-[38svh] flex-1"
            >
              <motion.div style={{ rotate: tilt }} className="absolute inset-0">
                {/* satellites */}
                {satellites.map((s, i) => (
                  <motion.div
                    key={s.slug}
                    layout
                    transition={{ type: "spring", stiffness: 120, damping: 20 }}
                    className={`absolute hidden overflow-hidden rounded-lg border border-border/70 bg-surface/70 shadow-[0_30px_70px_-40px_rgba(0,0,0,0.9)] backdrop-blur md:block ${
                      i === 0
                        ? "-right-2 top-2 h-24 w-40 lg:h-28 lg:w-48"
                        : "-left-4 bottom-2 h-20 w-32 lg:h-24 lg:w-40"
                    }`}
                  >
                    <img
                      src={screenshotUrl(s.url, 640, 420)}
                      alt={s.name}
                      loading="lazy"
                      className="h-full w-full object-cover object-top opacity-70"
                    />
                  </motion.div>
                ))}

                {/* dominant module */}
                <div className="absolute inset-x-0 top-0 mx-auto flex h-full max-w-2xl flex-col overflow-hidden rounded-xl border border-border bg-background/80 shadow-[0_60px_120px_-50px_rgba(0,0,0,0.95)] backdrop-blur">
                  <div className="flex items-center gap-2 border-b border-border/70 bg-surface/70 px-4 py-2.5">
                    <span className="h-2 w-2 rounded-full bg-primary/70" />
                    <span className="h-2 w-2 rounded-full bg-foreground/15" />
                    <span className="h-2 w-2 rounded-full bg-foreground/15" />
                    <span className="ml-3 truncate font-mono text-[10px] tracking-wide text-muted-foreground">
                      {project.domain}
                    </span>
                    <span className="ml-auto text-[9px] uppercase tracking-[0.25em] text-primary">
                      {c.labels[active]}
                    </span>
                  </div>

                  <div className="relative flex-1 overflow-hidden">
                    <AnimatePresence mode="popLayout">
                      <motion.img
                        key={project.slug}
                        src={screenshotUrl(project.url, 1600, 1000)}
                        alt={project.name}
                        initial={{ opacity: 0, scale: 1.06, filter: "blur(8px)" }}
                        animate={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
                        exit={{ opacity: 0, scale: 0.98 }}
                        transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
                        className="absolute inset-0 h-full w-full object-cover object-top"
                      />
                    </AnimatePresence>
                    <div className="absolute inset-0 bg-gradient-to-t from-background/70 via-transparent to-transparent" />

                    {/* module skeleton that rearranges per discipline */}
                    <motion.div
                      layout
                      className="absolute inset-x-4 bottom-4 grid gap-2"
                      style={{ gridTemplateColumns: `repeat(${track.cols}, minmax(0,1fr))` }}
                    >
                      {Array.from({ length: track.cols * track.rows }).map((_, i) => (
                        <motion.span
                          layout
                          key={i}
                          initial={{ opacity: 0, y: 8 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: i * 0.03, duration: 0.4 }}
                          className="h-1.5 rounded-full bg-primary/50"
                        />
                      ))}
                    </motion.div>
                  </div>

                  <div className="flex items-center justify-between border-t border-border/70 px-4 py-2.5">
                    <span className="text-[11px] font-medium text-foreground">{project.name}</span>
                    <Link
                      to="/projects/$slug"
                      params={{ slug: project.slug }}
                      className="inline-flex items-center gap-1 text-[10px] uppercase tracking-[0.2em] text-muted-foreground transition-colors hover:text-primary"
                    >
                      {c.live}
                      <ArrowUpRight className="h-3 w-3" />
                    </Link>
                  </div>
                </div>
              </motion.div>
            </motion.div>

            {/* RIGHT — selector module (desktop) */}
            <motion.div
              style={{ opacity: textFade }}
              className="hidden flex-col justify-center lg:flex lg:border-l lg:border-border/60 lg:pl-8"
            >
              <p className="mb-4 text-[10px] uppercase tracking-[0.3em] text-muted-foreground">
                {c.disciplines}
              </p>
              <ul className="space-y-1">
                {c.labels.map((label, i) => (
                  <li key={label}>
                    <button
                      type="button"
                      onMouseEnter={() => setActive(i)}
                      onFocus={() => setActive(i)}
                      onClick={() => setActive(i)}
                      className="group flex w-full items-center gap-3 py-2 text-left"
                    >
                      <span
                        className={`h-px transition-all duration-500 ${
                          active === i ? "w-8 bg-primary" : "w-3 bg-border group-hover:w-5"
                        }`}
                      />
                      <span
                        className={`text-[13px] tracking-tight transition-colors ${
                          active === i ? "text-foreground" : "text-muted-foreground"
                        }`}
                      >
                        {label}
                      </span>
                    </button>
                  </li>
                ))}
              </ul>
              <p className="mt-8 max-w-[15ch] text-[10px] uppercase leading-relaxed tracking-[0.25em] text-muted-foreground/70">
                {c.system}
              </p>
            </motion.div>
          </div>

          {/* BOTTOM — connected rail (mobile selector + desktop index) */}
          <motion.div style={{ y: railShift }} className="relative mt-6 pb-6">
            <div className="mb-3 h-px w-full bg-gradient-to-r from-transparent via-border to-transparent" />
            <div className="-mx-1 flex snap-x gap-2 overflow-x-auto pb-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
              {c.labels.map((label, i) => (
                <button
                  key={label}
                  type="button"
                  onMouseEnter={() => setActive(i)}
                  onClick={() => setActive(i)}
                  className={`relative shrink-0 snap-start rounded-full border px-4 py-2 text-[10px] uppercase tracking-[0.2em] transition-all duration-300 ${
                    active === i
                      ? "border-primary/60 bg-primary/10 text-foreground"
                      : "border-border bg-surface/40 text-muted-foreground hover:text-foreground"
                  }`}
                >
                  <span className="mr-2 font-mono text-[9px] text-primary/70">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  {label}
                </button>
              ))}
            </div>
          </motion.div>
        </div>

        {/* START PROJECT — configurator scaffold */}
        <AnimatePresence>
          {open && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 z-30 grid place-items-center bg-background/80 backdrop-blur-md"
            >
              <motion.div
                initial={{ opacity: 0, y: 18, scale: 0.98 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 10, scale: 0.98 }}
                transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
                className="relative w-[min(92vw,34rem)] rounded-2xl border border-border bg-surface/90 p-8"
              >
                <button
                  type="button"
                  onClick={() => setOpen(false)}
                  aria-label="Close"
                  className="absolute right-4 top-4 text-muted-foreground transition-colors hover:text-foreground"
                >
                  <X className="h-4 w-4" />
                </button>
                <p className="mb-6 text-[10px] uppercase tracking-[0.3em] text-muted-foreground">
                  {c.ask}
                </p>
                <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
                  {c.kinds.map((k) => (
                    <Link
                      key={k}
                      to="/contact"
                      onClick={() => setOpen(false)}
                      className="group flex items-center justify-between rounded-xl border border-border bg-background/60 px-4 py-3 text-[13px] text-foreground transition-all hover:border-primary/60 hover:bg-primary/10"
                    >
                      {k}
                      <ArrowUpRight className="h-3.5 w-3.5 text-muted-foreground transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:text-primary" />
                    </Link>
                  ))}
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </section>
    </div>
  );
}
