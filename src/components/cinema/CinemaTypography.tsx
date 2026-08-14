import { useEffect, useRef, type RefObject } from "react";
import { easeCine, stage } from "./progress";

/**
 * Minimal cinematic typography: the eyebrow settles first, the statement builds
 * line by line, then the whole block drifts out of the composition so the world
 * becomes dominant. Scroll-driven only, no autoplay, fully reversible.
 */
const LINES = ["Tvoříme digitální řešení,", "která posouvají byznys."];

export function CinemaTypography({ progressRef }: { progressRef: RefObject<number> }) {
  const eyebrow = useRef<HTMLParagraphElement>(null);
  const lines = useRef<HTMLSpanElement[]>([]);
  const support = useRef<HTMLDivElement>(null);
  const block = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let raf = 0;
    const tick = () => {
      const p = progressRef.current ?? 0;

      /* long, soft exit — never a sudden opacity change */
      const out = easeCine(stage(p, 0.28, 0.56));
      if (block.current) {
        block.current.style.opacity = String(1 - out);
        block.current.style.transform = `translate3d(${-out * 5}vw, ${-out * 9}vh, 0)`;
        block.current.style.filter = `blur(${out * 9}px)`;
      }

      if (eyebrow.current) {
        const a = easeCine(stage(p, 0, 0.05));
        eyebrow.current.style.opacity = String(0.12 + a * 0.88);
        eyebrow.current.style.letterSpacing = `${0.5 - a * 0.08}em`;
      }

      lines.current.forEach((el, i) => {
        if (!el) return;
        const from = 0.04 + i * 0.075;
        const a = easeCine(stage(p, from, from + 0.11));
        el.style.transform = `translate3d(0, ${(1 - a) * 100}%, 0)`;
        el.style.opacity = String(a);
      });

      if (support.current) {
        const a = easeCine(stage(p, 0.19, 0.3));
        support.current.style.opacity = String(a);
        support.current.style.transform = `translate3d(0, ${(1 - a) * 16}px, 0)`;
      }

      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [progressRef]);

  return (
    <div ref={block} className="max-w-[46rem] will-change-transform">
      <p
        ref={eyebrow}
        className="mb-7 flex items-center gap-3 font-mono text-[9px] uppercase text-primary/75 md:mb-9"
        style={{ letterSpacing: "0.5em", opacity: 0 }}
      >
        <span aria-hidden className="h-px w-10 bg-primary/40" />
        Elevate · Digital Studio · Praha
      </p>

      <h1 className="text-[clamp(2.1rem,4.6vw,4rem)] font-light leading-[1.06] tracking-[-0.04em] text-foreground">
        {LINES.map((l, i) => (
          <span key={l} className="block overflow-hidden pb-[0.08em]">
            <span
              ref={(el) => {
                if (el) lines.current[i] = el;
              }}
              className="block will-change-transform"
              style={{ opacity: 0, transform: "translate3d(0,100%,0)" }}
            >
              {i === 1 ? <span className="text-primary">{l}</span> : l}
            </span>
          </span>
        ))}
      </h1>

      <div ref={support} className="mt-8 flex items-start gap-4 md:mt-10" style={{ opacity: 0 }}>
        <span aria-hidden className="mt-2 h-8 w-px shrink-0 bg-gradient-to-b from-primary/60 to-transparent" />
        <p className="max-w-xs text-[0.78rem] leading-[1.8] text-muted-foreground md:text-[0.82rem]">
          Weby, e-shopy a digitální produkty
          <br className="hidden md:block" /> od strategie po vývoj.
        </p>
      </div>
    </div>
  );
}
