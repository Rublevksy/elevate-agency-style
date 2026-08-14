import { useEffect, useRef, type RefObject } from "react";
import { easeCine, stage } from "./progress";

/**
 * The last beat of the shot: the artifact has dissolved and what remains is an
 * ELEVATE digital surface. This is also the architecture seam — each service
 * slot below can later be replaced by a real project interface.
 */
const SERVICES = ["Web", "E-commerce", "Digitální produkt", "Branding"];

export function InterfaceReveal({ progressRef }: { progressRef: RefObject<number> }) {
  const root = useRef<HTMLDivElement>(null);
  const items = useRef<HTMLDivElement[]>([]);

  useEffect(() => {
    let raf = 0;
    const tick = () => {
      const p = progressRef.current ?? 0;
      const a = easeCine(stage(p, 0.72, 0.97));
      if (root.current) {
        root.current.style.opacity = String(a);
        root.current.style.transform = `translate3d(0,0,0) scale(${0.96 + a * 0.04})`;
        root.current.style.filter = `blur(${(1 - a) * 14}px)`;
        root.current.style.pointerEvents = a > 0.85 ? "auto" : "none";
      }
      items.current.forEach((el, i) => {
        if (!el) return;
        const l = easeCine(stage(p, 0.76 + i * 0.035, 0.88 + i * 0.035));
        el.style.opacity = String(l);
        el.style.transform = `translate3d(0, ${(1 - l) * 26}px, 0)`;
      });
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [progressRef]);

  return (
    <div
      ref={root}
      className="absolute inset-0 z-20 flex flex-col justify-between px-7 py-24 will-change-transform md:px-[6.5vw] md:py-28"
      style={{ opacity: 0 }}
    >
      <div className="flex items-center justify-between font-mono text-[9px] uppercase tracking-[0.34em] text-muted-foreground">
        <span className="text-primary/80">Elevate · digital studio</span>
        <span>Praha</span>
      </div>

      <div>
        <p className="max-w-xl text-[clamp(1.4rem,3vw,2.6rem)] font-light leading-[1.15] tracking-[-0.03em] text-foreground">
          Navrhujeme a stavíme digitální prostředí, ve kterých se firmám <span className="text-primary">daří</span>.
        </p>

        <div className="mt-12 grid grid-cols-2 gap-px overflow-hidden rounded-xl border border-border/60 bg-border/40 md:grid-cols-4">
          {SERVICES.map((s, i) => (
            <div
              key={s}
              ref={(el) => {
                if (el) items.current[i] = el;
              }}
              className="group relative min-h-[8.5rem] bg-background/70 p-5 backdrop-blur-md will-change-transform"
              style={{ opacity: 0 }}
            >
              <span className="font-mono text-[9px] tracking-[0.3em] text-primary/70">
                0{i + 1}
              </span>
              <p className="mt-6 text-sm font-medium tracking-[-0.01em] text-foreground">{s}</p>
              {/* visual slot: replaced later by a real project interface */}
              <div className="mt-4 space-y-1.5" aria-hidden>
                <span className="block h-px w-2/3 bg-foreground/10" />
                <span className="block h-px w-1/2 bg-foreground/10" />
                <span className="block h-px w-5/6 bg-primary/25" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
