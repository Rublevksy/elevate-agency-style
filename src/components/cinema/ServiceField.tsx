import { useEffect, useRef, type RefObject } from "react";
import { Link } from "@tanstack/react-router";
import { easeCine, stage } from "./progress";

/**
 * THE SERVICE FIELD — the last movement of the shot.
 *
 * The world becomes a digital environment and real ELEVATE service interfaces
 * physically enter the scene from different depth positions. These are windows
 * inside the environment (perspective, depth fog, parallax), not cards stacked
 * on a background. Strictly scroll-driven and fully reversible.
 */

type Slot = {
  n: string;
  name: string;
  claim: string;
  to: string;
  /** entry vector: x/y in vw/vh, z in px, plus resting composition offset */
  from: { x: number; y: number; z: number; ry: number };
  at: { x: number; y: number; z: number; ry: number };
  /** parallax weight — deeper windows move less */
  depth: number;
  start: number;
  preview: React.ReactNode;
};

const rule = (w: string, tone = "bg-foreground/12") => (
  <span className={`block h-px ${tone}`} style={{ width: w }} />
);

const SLOTS: Slot[] = [
  {
    n: "01",
    name: "Web",
    claim: "Weby, které prodávají.",
    to: "/services/web",
    from: { x: -34, y: 6, z: -520, ry: 22 },
    at: { x: -30, y: -4, z: 0, ry: 9 },
    depth: 1,
    start: 0.7,
    preview: (
      <div className="space-y-2">
        <div className="flex items-center gap-1.5">
          <span className="h-1.5 w-1.5 rounded-full bg-primary/70" />
          {rule("28%", "bg-foreground/20")}
          <span className="ml-auto block h-1.5 w-6 rounded-sm bg-primary/40" />
        </div>
        <div className="h-8 rounded-sm bg-gradient-to-r from-primary/25 to-transparent" />
        {rule("70%")}
        {rule("52%")}
        <div className="grid grid-cols-3 gap-1 pt-1">
          <span className="h-4 bg-foreground/8" />
          <span className="h-4 bg-foreground/8" />
          <span className="h-4 bg-primary/20" />
        </div>
      </div>
    ),
  },
  {
    n: "02",
    name: "E-commerce",
    claim: "E-shopy postavené na konverzi.",
    to: "/services/eshop",
    from: { x: 36, y: -8, z: -380, ry: -24 },
    at: { x: 28, y: 6, z: 40, ry: -10 },
    depth: 1.15,
    start: 0.76,
    preview: (
      <div className="space-y-2">
        <div className="grid grid-cols-2 gap-1.5">
          <span className="h-9 bg-foreground/10" />
          <span className="h-9 bg-foreground/8" />
        </div>
        <div className="flex items-center justify-between">
          {rule("34%", "bg-foreground/20")}
          <span className="block h-1.5 w-8 rounded-sm bg-primary/45" />
        </div>
        {rule("60%")}
        <div className="flex items-center gap-1 pt-0.5">
          <span className="h-3 w-12 rounded-sm bg-primary/30" />
          <span className="h-3 w-6 rounded-sm bg-foreground/10" />
        </div>
      </div>
    ),
  },
  {
    n: "03",
    name: "Digitální produkt",
    claim: "Dashboardy a systémy.",
    to: "/services/design",
    from: { x: 4, y: 16, z: -900, ry: 6 },
    at: { x: 2, y: 20, z: -260, ry: 3 },
    depth: 0.55,
    start: 0.82,
    preview: (
      <div className="space-y-2">
        <div className="flex items-end gap-1">
          {[9, 14, 7, 18, 12, 22, 16].map((h, i) => (
            <span
              key={i}
              className={i % 3 === 2 ? "w-1.5 bg-primary/50" : "w-1.5 bg-foreground/15"}
              style={{ height: `${h}px` }}
            />
          ))}
        </div>
        {rule("46%", "bg-foreground/20")}
        {rule("64%")}
        <div className="flex gap-1 pt-0.5">
          <span className="h-3 w-3 rounded-full border border-primary/40" />
          {rule("40%")}
        </div>
      </div>
    ),
  },
  {
    n: "04",
    name: "Branding",
    claim: "Identita, která zůstane.",
    to: "/services/branding",
    from: { x: -12, y: -26, z: -240, ry: 14 },
    at: { x: -8, y: -22, z: 110, ry: 6 },
    depth: 1.35,
    start: 0.88,
    preview: (
      <div className="space-y-2">
        <div className="flex gap-1">
          <span className="h-5 w-5 bg-primary/45" />
          <span className="h-5 w-5 bg-foreground/15" />
          <span className="h-5 w-5 bg-foreground/8" />
          <span className="h-5 w-5 border border-foreground/15" />
        </div>
        <span className="block font-mono text-[8px] tracking-[0.4em] text-foreground/45">ELEVATE</span>
        {rule("58%")}
        {rule("38%")}
      </div>
    ),
  },
];

export function ServiceField({
  progressRef,
  pointerRef,
}: {
  progressRef: RefObject<number>;
  pointerRef: RefObject<{ x: number; y: number }>;
}) {
  const root = useRef<HTMLDivElement>(null);
  const items = useRef<HTMLAnchorElement[]>([]);
  const caption = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let raf = 0;
    const smooth = { mx: 0, my: 0 };

    const tick = () => {
      const p = progressRef.current ?? 0;
      const m = pointerRef.current ?? { x: 0, y: 0 };
      smooth.mx += (m.x - smooth.mx) * 0.045;
      smooth.my += (m.y - smooth.my) * 0.045;

      const field = easeCine(stage(p, 0.62, 0.74));
      if (root.current) {
        root.current.style.opacity = String(Math.min(1, field * 1.2));
        root.current.style.pointerEvents = field > 0.75 ? "auto" : "none";
      }
      if (caption.current) {
        const a = easeCine(stage(p, 0.6, 0.72));
        caption.current.style.opacity = String(a);
        caption.current.style.transform = `translate3d(0, ${(1 - a) * 22}px, 0)`;
      }

      SLOTS.forEach((s, i) => {
        const el = items.current[i];
        if (!el) return;
        const a = easeCine(stage(p, s.start, s.start + 0.13));
        const x = s.from.x + (s.at.x - s.from.x) * a + smooth.mx * 3.2 * s.depth;
        const y = s.from.y + (s.at.y - s.from.y) * a - smooth.my * 2.2 * s.depth;
        const z = s.from.z + (s.at.z - s.from.z) * a;
        const ry = s.from.ry + (s.at.ry - s.from.ry) * a + smooth.mx * 3 * s.depth;
        const rx = -smooth.my * 2.4 * s.depth;
        el.style.opacity = String(a);
        el.style.transform = `translate3d(${x}vw, ${y}vh, ${z}px) rotateY(${ry}deg) rotateX(${rx}deg)`;
        /* depth fog: distant windows stay soft, close windows resolve sharp */
        el.style.filter = `blur(${(1 - a) * 12 + Math.max(0, -z) * 0.006}px)`;
      });

      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [progressRef, pointerRef]);

  return (
    <div
      ref={root}
      aria-label="Služby ELEVATE"
      className="absolute inset-0 z-20"
      style={{ opacity: 0, perspective: "1400px", perspectiveOrigin: "50% 45%" }}
    >
      <div className="absolute inset-0 flex items-center justify-center" style={{ transformStyle: "preserve-3d" }}>
        {SLOTS.map((s, i) => (
          <Link
            key={s.n}
            to={s.to}
            ref={(el) => {
              if (el) items.current[i] = el as unknown as HTMLAnchorElement;
            }}
            className="group absolute w-[clamp(15rem,21vw,20rem)] border border-border/70 bg-background/55 backdrop-blur-xl transition-[border-color,box-shadow,background-color] duration-500 will-change-transform hover:border-primary/50 hover:bg-background/70 hover:shadow-[0_0_60px_-18px_oklch(0.62_0.15_255/0.55)]"
            style={{ opacity: 0, transformStyle: "preserve-3d" }}
          >
            {/* window chrome — a real product surface, not a card */}
            <span className="flex items-center gap-2 border-b border-border/60 px-3.5 py-2 font-mono text-[8px] uppercase tracking-[0.3em] text-muted-foreground">
              <span className="h-1 w-1 rounded-full bg-primary/70 transition-transform duration-500 group-hover:scale-150" />
              {s.n} — {s.name}
            </span>
            <span className="block px-3.5 pb-4 pt-3.5">
              <span className="block text-[0.82rem] font-medium tracking-[-0.01em] text-foreground">{s.claim}</span>
              <span className="mt-3.5 block rounded-sm border border-border/50 bg-background/60 p-2.5 transition-transform duration-500 group-hover:translate-y-[-2px]">
                {s.preview}
              </span>
            </span>
          </Link>
        ))}
      </div>

      <div
        ref={caption}
        className="pointer-events-none absolute inset-x-0 bottom-10 flex flex-col items-center gap-2 px-7 text-center will-change-transform"
        style={{ opacity: 0 }}
      >
        <span className="font-mono text-[8px] uppercase tracking-[0.42em] text-primary/70">Co pro vás stavíme</span>
        <p className="max-w-md text-[0.78rem] leading-[1.8] text-muted-foreground">
          Od strategie a designu až po vývoj a provoz — jedno prostředí, které pracuje pro váš byznys.
        </p>
      </div>
    </div>
  );
}
