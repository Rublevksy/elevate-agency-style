import { useEffect, useRef, type RefObject } from "react";
import { easeCine, stage } from "./progress";

/**
 * Editorial typography that participates in the shot: the statement builds
 * line by line, the supporting line follows, then the whole block travels out
 * of the composition so the artifact becomes dominant. Scroll-driven only.
 */
const LINES = ["Tvoříme", "digitální světy", "pro váš byznys."];

export function CinemaTypography({ progressRef }: { progressRef: RefObject<number> }) {
  const eyebrow = useRef<HTMLParagraphElement>(null);
  const lines = useRef<HTMLSpanElement[]>([]);
  const support = useRef<HTMLDivElement>(null);
  const block = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let raf = 0;
    const tick = () => {
      const p = progressRef.current ?? 0;

      const out = easeCine(stage(p, 0.24, 0.42));
      if (block.current) {
        block.current.style.opacity = String(1 - out);
        block.current.style.transform = `translate3d(${-out * 6}vw, ${-out * 12}vh, 0)`;
        block.current.style.filter = `blur(${out * 10}px)`;
      }

      if (eyebrow.current) {
        const a = stage(p, 0, 0.015);
        eyebrow.current.style.opacity = String(0.15 + a * 0.85);
      }

      lines.current.forEach((el, i) => {
        if (!el) return;
        const from = i * 0.045;
        const a = easeCine(stage(p, from, from + 0.075));
        el.style.transform = `translate3d(0, ${(1 - a) * 100}%, 0)`;
        el.style.opacity = String(a);
      });

      if (support.current) {
        const a = easeCine(stage(p, 0.13, 0.21));
        support.current.style.opacity = String(a);
        support.current.style.transform = `translate3d(0, ${(1 - a) * 18}px, 0)`;
      }

      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [progressRef]);

  return (
    <div ref={block} className="will-change-transform">
      <p
        ref={eyebrow}
        className="mb-7 flex items-center gap-3 font-mono text-[9px] uppercase tracking-[0.42em] text-primary/75 md:mb-9"
      >
        <span aria-hidden className="h-px w-10 bg-primary/40" />
        Digitální studio · Praha
      </p>

      <h1 className="text-[clamp(2.6rem,7vw,6.4rem)] font-light leading-[0.96] tracking-[-0.045em] text-foreground">
        {LINES.map((l, i) => (
          <span key={l} className="block overflow-hidden pb-[0.06em]">
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

      <div
        ref={support}
        className="mt-9 flex items-start gap-4 md:mt-12"
        style={{ opacity: 0 }}
      >
        <span aria-hidden className="mt-2 h-9 w-px shrink-0 bg-gradient-to-b from-primary/60 to-transparent" />
        <p className="max-w-xs text-[0.78rem] leading-[1.8] text-muted-foreground md:max-w-sm md:text-[0.82rem]">
          Weby, e-shopy a digitální produkty,
          <br className="hidden md:block" /> které pomáhají firmám růst.
        </p>
      </div>
    </div>
  );
}
