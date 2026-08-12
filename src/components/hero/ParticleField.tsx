import { useEffect, useRef } from "react";

/**
 * Subtle ELEVATE particle field — low-opacity blue dust with occasional
 * hairline connections, gentle mouse repulsion, DPR-capped and paused offscreen.
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
    const mouse = { x: -9999, y: -9999, r: 160 };

    const mobile = window.innerWidth < 768;
    const count = mobile ? 30 : 68;
    const linkDist = mobile ? 90 : 130;

    type P = { x: number; y: number; vx: number; vy: number; s: number; a: number };
    let dots: P[] = [];

    const seed = () => {
      dots = Array.from({ length: count }, () => ({
        x: Math.random() * w,
        y: Math.random() * h,
        vx: (Math.random() - 0.5) * 0.16,
        vy: (Math.random() - 0.5) * 0.16,
        s: 0.5 + Math.random() * 1.2,
        a: 0.1 + Math.random() * 0.35,
      }));
    };

    const resize = () => {
      const rect = canvas.getBoundingClientRect();
      w = rect.width;
      h = rect.height;
      canvas.width = Math.floor(w * dpr);
      canvas.height = Math.floor(h * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      seed();
    };
    resize();

    const draw = () => {
      ctx.clearRect(0, 0, w, h);

      for (const d of dots) {
        if (!reduced) {
          d.x += d.vx;
          d.y += d.vy;
          if (d.x < 0 || d.x > w) d.vx *= -1;
          if (d.y < 0 || d.y > h) d.vy *= -1;

          const dx = mouse.x - d.x;
          const dy = mouse.y - d.y;
          const dist = Math.hypot(dx, dy);
          if (dist < mouse.r && dist > 0.001) {
            const f = (mouse.r - dist) / mouse.r;
            d.x -= (dx / dist) * f * 1.6;
            d.y -= (dy / dist) * f * 1.6;
          }
        }
        ctx.beginPath();
        ctx.arc(d.x, d.y, d.s, 0, Math.PI * 2);
        ctx.fillStyle = `oklch(0.85 0.12 240 / ${d.a})`;
        ctx.fill();
      }

      // hairline connections — very faint
      ctx.lineWidth = 0.5;
      for (let a = 0; a < dots.length; a++) {
        for (let b = a + 1; b < dots.length; b++) {
          const p = dots[a]!;
          const q = dots[b]!;
          const dist = Math.hypot(p.x - q.x, p.y - q.y);
          if (dist < linkDist) {
            const o = (1 - dist / linkDist) * 0.12;
            ctx.strokeStyle = `oklch(0.8 0.12 240 / ${o})`;
            ctx.beginPath();
            ctx.moveTo(p.x, p.y);
            ctx.lineTo(q.x, q.y);
            ctx.stroke();
          }
        }
      }

      if (visible && !reduced) raf = requestAnimationFrame(draw);
    };
    raf = requestAnimationFrame(draw);

    const onMove = (e: PointerEvent) => {
      const rect = canvas.getBoundingClientRect();
      mouse.x = e.clientX - rect.left;
      mouse.y = e.clientY - rect.top;
    };
    const onLeave = () => {
      mouse.x = -9999;
      mouse.y = -9999;
    };

    const io = new IntersectionObserver(
      ([entry]) => {
        visible = !!entry?.isIntersecting;
        cancelAnimationFrame(raf);
        if (visible && !reduced) raf = requestAnimationFrame(draw);
      },
      { threshold: 0 },
    );
    io.observe(canvas);
    window.addEventListener("resize", resize);
    window.addEventListener("pointermove", onMove, { passive: true });
    window.addEventListener("pointerleave", onLeave);

    return () => {
      cancelAnimationFrame(raf);
      io.disconnect();
      window.removeEventListener("resize", resize);
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerleave", onLeave);
    };
  }, []);

  return <canvas ref={ref} aria-hidden className={className} />;
}
