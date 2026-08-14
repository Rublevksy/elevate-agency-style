import { useEffect, useRef } from "react";
import { PHASE, clamp01, easeFilm, range } from "./film";

/**
 * PHASE 01 typography. It sets the frame, then gets out of the way: as the
 * camera approaches the device the type clips away with a soft blur, never
 * competing with the product.
 */
export function HeroType({ progress }: { progress: React.RefObject<number> }) {
  const root = useRef<HTMLDivElement>(null);
  const lines = useRef<(HTMLElement | null)[]>([]);

  useEffect(() => {
    let raf = 0;
    const tick = () => {
      const p = progress.current ?? 0;
      const out = easeFilm(range(0.05, PHASE.APPROACH + 0.06, p));
      if (root.current) {
        root.current.style.opacity = String(1 - out);
        root.current.style.filter = `blur(${out * 12}px)`;
        root.current.style.transform = `translate3d(${-out * 5}vw, 0, 0)`;
      }
      lines.current.forEach((el, i) => {
        if (!el) return;
        const t = clamp01(1 - out * 1.1 + i * 0.02);
        el.style.transform = `translateY(${(1 - t) * 26}px)`;
        el.style.opacity = String(t);
      });
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [progress]);

  const setLine = (i: number) => (el: HTMLElement | null) => {
    lines.current[i] = el;
  };

  return (
    <div ref={root} className="pointer-events-none absolute inset-0 z-30 flex items-center px-7 md:px-[6vw]">
      <div className="max-w-[42rem]">
        <span ref={setLine(0)} className="block font-mono text-[10px] uppercase tracking-[0.42em] text-primary">
          Digitální studio · Praha
        </span>
        <h1
          ref={setLine(1)}
          className="mt-5 text-4xl font-medium leading-[1.02] tracking-[-0.035em] text-foreground md:text-[4.4vw]"
        >
          Tvoříme digitální
          <br />
          produkty pro váš
          <br />
          byznys.
        </h1>
        <p ref={setLine(2)} className="mt-6 max-w-md text-sm text-muted-foreground md:text-base">
          Weby, e-shopy a digitální produkty od strategie po vývoj.
        </p>
        <span
          ref={setLine(3)}
          className="mt-10 block font-mono text-[9px] uppercase tracking-[0.4em] text-muted-foreground/70"
        >
          Scroll to explore
        </span>
      </div>
    </div>
  );
}
