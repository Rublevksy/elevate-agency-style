import { useEffect, useRef } from "react";

/**
 * The seam between the cinematic device film and the service system.
 * Compact, editorial, scroll-driven: the device atmosphere dissolves upward
 * into one line that tells the visitor what ELEVATE actually builds.
 */
export function ServicesIntro() {
  const wrap = useRef<HTMLDivElement>(null);
  const inner = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = wrap.current;
    const box = inner.current;
    if (!el || !box) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      box.style.opacity = "1";
      box.style.transform = "none";
      box.style.filter = "none";
      return;
    }
    let raf = 0;
    const tick = () => {
      const r = el.getBoundingClientRect();
      // 0 → entering from below, 1 → centred, back to 0 → leaving upward
      const t = 1 - Math.min(1, Math.abs(r.top + r.height / 2 - window.innerHeight / 2) / (window.innerHeight * 0.7));
      const e = t * t * (3 - 2 * t);
      box.style.opacity = String(0.06 + e * 0.94);
      box.style.transform = `translate3d(0, ${((1 - e) * 26).toFixed(2)}px, 0) scale(${(0.985 + e * 0.015).toFixed(4)})`;
      box.style.filter = `blur(${((1 - e) * 6).toFixed(2)}px)`;
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, []);

  return (
    <div ref={wrap} className="relative py-[16vh] md:py-[22vh]">
      {/* the device atmosphere thinning out — light only, never a colour cut */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(60% 60% at 50% 30%, oklch(0.34 0.08 258 / 0.14) 0%, transparent 72%)",
        }}
      />
      <div className="container-luxe relative">
        <div ref={inner} className="max-w-3xl" style={{ opacity: 0, willChange: "transform, opacity, filter" }}>
          <p className="font-mono text-[10px] uppercase tracking-[0.4em] text-primary">Co pro vás můžeme udělat</p>
          <h2 className="mt-6 text-3xl font-medium leading-[1.06] tracking-[-0.035em] text-foreground md:text-[3.6vw]">
            Digitální řešení, která posouvají váš byznys.
          </h2>
          <div
            aria-hidden
            className="mt-10 h-px w-full max-w-md"
            style={{ background: "linear-gradient(90deg, oklch(0.65 0.18 255 / 0.55), transparent)" }}
          />
        </div>
      </div>
    </div>
  );
}
