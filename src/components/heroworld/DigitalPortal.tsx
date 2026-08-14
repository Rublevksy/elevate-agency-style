import { useEffect, useRef, type RefObject } from "react";

/**
 * DigitalPortal — the interface core.
 *
 * A dimensional glass object built from a handful of GPU-composited planes at
 * different depths inside one perspective space: a machined outer frame, two
 * suspended glass surfaces carrying live interface geometry, a rim-lit aperture
 * and a controlled bloom behind it. It reacts to cursor proximity (tilt +
 * parallax) and recedes slightly with scroll. No autoplay loops.
 */
type Props = {
  className?: string;
  progressRef?: RefObject<number>;
};

export function DigitalPortal({ className = "", progressRef }: Props) {
  const scene = useRef<HTMLDivElement>(null);
  const core = useRef<HTMLDivElement>(null);
  const near = useRef<HTMLDivElement>(null);
  const far = useRef<HTMLDivElement>(null);
  const bloom = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const m = { x: 0, y: 0, tx: 0, ty: 0 };
    let raf = 0;

    const onMove = (e: PointerEvent) => {
      m.tx = e.clientX / window.innerWidth - 0.5;
      m.ty = 0.5 - e.clientY / window.innerHeight;
    };

    const draw = () => {
      m.x += (m.tx - m.x) * 0.055;
      m.y += (m.ty - m.y) * 0.055;
      const p = progressRef?.current ?? 0;
      const depth = Math.min(1, p * 1.6);

      if (core.current) {
        core.current.style.transform =
          `rotateX(${m.y * 7}deg) rotateY(${m.x * 11}deg) translate3d(${m.x * 10}px, ${-m.y * 8}px, ${-depth * 90}px) scale(${1 - depth * 0.06})`;
      }
      if (near.current) {
        near.current.style.transform = `translate3d(${m.x * 26}px, ${-m.y * 18}px, 120px)`;
      }
      if (far.current) {
        far.current.style.transform = `translate3d(${m.x * -12}px, ${-m.y * -8}px, -160px)`;
      }
      if (bloom.current) {
        bloom.current.style.opacity = String(0.55 + (1 - Math.abs(m.x) - Math.abs(m.y) * 0.5) * 0.25);
      }
      raf = requestAnimationFrame(draw);
    };
    raf = requestAnimationFrame(draw);
    window.addEventListener("pointermove", onMove, { passive: true });
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("pointermove", onMove);
    };
  }, [progressRef]);

  return (
    <div ref={scene} aria-hidden className={`pointer-events-none select-none ${className}`}>
      <div className="absolute inset-0 flex items-center justify-center [perspective:1400px]">
        {/* controlled bloom behind the object */}
        <div
          ref={bloom}
          className="absolute h-[62vmin] w-[62vmin] rounded-full blur-[70px]"
          style={{
            background:
              "radial-gradient(circle, oklch(0.62 0.16 258 / 0.34) 0%, oklch(0.42 0.12 258 / 0.14) 42%, transparent 72%)",
          }}
        />

        <div ref={core} className="relative h-[54vmin] w-[54vmin] will-change-transform [transform-style:preserve-3d]">
          {/* far glass surface: faint architectural grid */}
          <div
            ref={far}
            className="absolute inset-[-8%] rounded-[2.2rem] border border-primary/10 will-change-transform"
            style={{
              background:
                "linear-gradient(150deg, oklch(0.24 0.03 258 / 0.14), transparent 55%), repeating-linear-gradient(90deg, oklch(0.7 0.02 258 / 0.05) 0 1px, transparent 1px 44px), repeating-linear-gradient(0deg, oklch(0.7 0.02 258 / 0.05) 0 1px, transparent 1px 44px)",
            }}
          />

          {/* machined frame */}
          <div
            className="absolute inset-0 rounded-[1.9rem] border border-foreground/12"
            style={{
              background:
                "linear-gradient(155deg, oklch(0.30 0.02 258 / 0.30), oklch(0.16 0.02 258 / 0.10) 42%, oklch(0.10 0.02 258 / 0.05))",
              boxShadow:
                "inset 0 1px 0 oklch(1 0 0 / 0.10), inset 0 0 60px oklch(0.30 0.10 258 / 0.18), 0 40px 120px -40px oklch(0.05 0.02 258 / 0.9)",
              backdropFilter: "blur(6px)",
            }}
          />

          {/* aperture: rim-lit inner opening with a soft blue core */}
          <div className="absolute inset-[14%] rounded-[1.3rem] overflow-hidden">
            <div
              className="absolute inset-0"
              style={{
                background:
                  "radial-gradient(120% 90% at 30% 15%, oklch(0.45 0.10 258 / 0.30), transparent 60%), linear-gradient(200deg, oklch(0.12 0.02 258 / 0.85), oklch(0.06 0.01 258 / 0.95))",
              }}
            />
            {/* thin technical lines: horizon + measure marks */}
            <div className="absolute inset-x-0 top-1/2 h-px bg-gradient-to-r from-transparent via-primary/45 to-transparent" />
            <div className="absolute inset-y-0 left-1/2 w-px bg-gradient-to-b from-transparent via-foreground/12 to-transparent" />
            <div className="absolute left-[10%] right-[10%] top-[22%] h-px bg-foreground/[0.07]" />
            <div className="absolute left-[10%] right-[42%] top-[30%] h-px bg-foreground/[0.07]" />
            <div className="absolute left-[10%] right-[26%] bottom-[24%] h-px bg-foreground/[0.07]" />
            {/* rim light */}
            <div
              className="absolute inset-0 rounded-[1.3rem]"
              style={{ boxShadow: "inset 0 0 0 1px oklch(0.72 0.14 258 / 0.35), inset 0 0 40px oklch(0.55 0.14 258 / 0.16)" }}
            />
          </div>

          {/* near glass fragments: small interface surfaces catching the key light */}
          <div ref={near} className="absolute inset-0 will-change-transform">
            <div
              className="absolute left-[-9%] top-[26%] h-[16%] w-[26%] rounded-xl border border-foreground/12"
              style={{
                background: "linear-gradient(140deg, oklch(0.30 0.03 258 / 0.34), oklch(0.12 0.02 258 / 0.14))",
                boxShadow: "0 20px 50px -30px oklch(0.05 0.02 258 / 0.9), inset 0 1px 0 oklch(1 0 0 / 0.08)",
                backdropFilter: "blur(4px)",
              }}
            >
              <span className="absolute left-3 top-3 h-px w-8 bg-primary/50" />
              <span className="absolute left-3 top-5 h-px w-12 bg-foreground/12" />
            </div>
            <div
              className="absolute right-[-7%] bottom-[22%] h-[13%] w-[22%] rounded-xl border border-foreground/12"
              style={{
                background: "linear-gradient(140deg, oklch(0.28 0.03 258 / 0.30), oklch(0.11 0.02 258 / 0.12))",
                boxShadow: "0 20px 50px -30px oklch(0.05 0.02 258 / 0.9), inset 0 1px 0 oklch(1 0 0 / 0.07)",
                backdropFilter: "blur(4px)",
              }}
            >
              <span className="absolute left-3 top-3 h-px w-10 bg-foreground/14" />
              <span className="absolute left-3 top-5 h-px w-6 bg-primary/45" />
            </div>
            {/* single light trail passing in front of the core */}
            <div className="absolute left-[-18%] top-[62%] h-px w-[52%] bg-gradient-to-r from-transparent via-primary/35 to-transparent" />
          </div>
        </div>
      </div>
    </div>
  );
}
