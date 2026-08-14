import { useEffect, useRef } from "react";

/**
 * A single canvas grid field behind the devices. Dark navy, very low opacity;
 * it only really shows up where the cursor is, and a click sends a soft ripple
 * through the lattice. No DOM nodes, no autoplay pulsing.
 */
export function KineticGrid({ mobile }: { mobile: boolean }) {
  const canvas = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const el = canvas.current;
    if (!el) return;
    const ctx = el.getContext("2d");
    if (!ctx) return;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    const step = mobile ? 46 : 34;
    const mouse = { x: -9999, y: -9999 };
    const smooth = { x: -9999, y: -9999 };
    const ripples: { x: number; y: number; t: number }[] = [];
    let dpr = 1;
    let w = 0;
    let h = 0;

    const resize = () => {
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      const r = el.getBoundingClientRect();
      w = r.width;
      h = r.height;
      el.width = Math.floor(w * dpr);
      el.height = Math.floor(h * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    resize();

    const onMove = (e: PointerEvent) => {
      const r = el.getBoundingClientRect();
      mouse.x = e.clientX - r.left;
      mouse.y = e.clientY - r.top;
    };
    const onLeave = () => {
      mouse.x = -9999;
      mouse.y = -9999;
    };
    const onDown = (e: PointerEvent) => {
      const r = el.getBoundingClientRect();
      ripples.push({ x: e.clientX - r.left, y: e.clientY - r.top, t: performance.now() });
      if (ripples.length > 4) ripples.shift();
    };

    window.addEventListener("resize", resize);
    window.addEventListener("pointermove", onMove, { passive: true });
    window.addEventListener("pointerdown", onDown, { passive: true });
    window.addEventListener("pointerleave", onLeave);

    const R = mobile ? 150 : 230;
    let raf = 0;
    const draw = () => {
      const now = performance.now();
      smooth.x += (mouse.x - smooth.x) * (reduced ? 1 : 0.09);
      smooth.y += (mouse.y - smooth.y) * (reduced ? 1 : 0.09);
      ctx.clearRect(0, 0, w, h);

      for (let gx = step * 0.5; gx < w + step; gx += step) {
        for (let gy = step * 0.5; gy < h + step; gy += step) {
          let dx = 0;
          let dy = 0;
          let energy = 0;

          const mdx = gx - smooth.x;
          const mdy = gy - smooth.y;
          const md = Math.hypot(mdx, mdy);
          if (md < R) {
            const f = 1 - md / R;
            energy = f * f;
            const pull = energy * 9;
            dx -= (mdx / (md || 1)) * pull;
            dy -= (mdy / (md || 1)) * pull;
          }

          for (const rp of ripples) {
            const age = (now - rp.t) / 1000;
            if (age > 1.6) continue;
            const radius = age * 620;
            const d = Math.hypot(gx - rp.x, gy - rp.y);
            const band = Math.max(0, 1 - Math.abs(d - radius) / 90) * Math.max(0, 1 - age / 1.6);
            if (band > 0) {
              energy = Math.max(energy, band * 0.85);
              const a = Math.atan2(gy - rp.y, gx - rp.x);
              dx += Math.cos(a) * band * 7;
              dy += Math.sin(a) * band * 7;
            }
          }

          const x = gx + dx;
          const y = gy + dy;
          const base = 0.05;
          const size = 1 + energy * 1.5;

          if (energy > 0.06) {
            ctx.fillStyle = `rgba(96, 150, 255, ${0.1 + energy * 0.5})`;
            if (energy > 0.4) {
              ctx.shadowColor = "rgba(80, 140, 255, 0.55)";
              ctx.shadowBlur = energy * 12;
            }
          } else {
            ctx.fillStyle = `rgba(190, 210, 240, ${base})`;
          }
          ctx.beginPath();
          ctx.arc(x, y, size, 0, Math.PI * 2);
          ctx.fill();
          ctx.shadowBlur = 0;
        }
      }
      raf = requestAnimationFrame(draw);
    };
    raf = requestAnimationFrame(draw);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", resize);
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerdown", onDown);
      window.removeEventListener("pointerleave", onLeave);
    };
  }, [mobile]);

  return <canvas ref={canvas} aria-hidden className="absolute inset-0 h-full w-full opacity-70" />;
}
