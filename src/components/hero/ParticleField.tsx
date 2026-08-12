import { useEffect, useRef } from "react";

/**
 * Lightweight canvas particle field — atmospheric dust + light trails.
 * GPU-friendly, DPR-capped, pauses when offscreen or when reduced motion is on.
 */
export function ParticleField({ className = "" }: { className?: string }) {
  const ref = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const dpr = Math.min(window.devicePixelRatio || 1, 1.6);
    let w = 0;
    let h = 0;
    let raf = 0;
    let visible = true;

    const count = window.innerWidth < 768 ? 34 : 70;
    const dots = Array.from({ length: count }, () => ({
      x: Math.random(),
      y: Math.random(),
      z: 0.3 + Math.random() * 0.7,
      s: 0.4 + Math.random() * 1.4,
      v: 0.00006 + Math.random() * 0.00022,
      a: 0.12 + Math.random() * 0.5,
    }));

    const resize = () => {
      const rect = canvas.getBoundingClientRect();
      w = rect.width;
      h = rect.height;
      canvas.width = Math.floor(w * dpr);
      canvas.height = Math.floor(h * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    resize();

    const draw = (time: number) => {
      ctx.clearRect(0, 0, w, h);
      for (const d of dots) {
        if (!reduced) d.y -= d.v * 16;
        if (d.y < -0.05) d.y = 1.05;
        const drift = reduced ? 0 : Math.sin(time * 0.0004 + d.x * 12) * 6;
        const px = d.x * w + drift;
        const py = d.y * h;
        const r = d.s * d.z;
        ctx.beginPath();
        ctx.arc(px, py, r, 0, Math.PI * 2);
        ctx.fillStyle = `oklch(0.85 0.12 255 / ${d.a * d.z})`;
        ctx.fill();
      }
      if (visible && !reduced) raf = requestAnimationFrame(draw);
    };
    raf = requestAnimationFrame(draw);

    const io = new IntersectionObserver(
      ([entry]) => {
        visible = !!entry?.isIntersecting;
        if (visible && !reduced) {
          cancelAnimationFrame(raf);
          raf = requestAnimationFrame(draw);
        } else {
          cancelAnimationFrame(raf);
        }
      },
      { threshold: 0 },
    );
    io.observe(canvas);
    window.addEventListener("resize", resize);

    return () => {
      cancelAnimationFrame(raf);
      io.disconnect();
      window.removeEventListener("resize", resize);
    };
  }, []);

  return <canvas ref={ref} aria-hidden className={className} />;
}
