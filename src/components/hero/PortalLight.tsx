import { useEffect, useRef } from "react";
import { startFrameLoop, prefersReducedMotion } from "@/lib/raf";

type Arc = {
  r: number; // radius factor of the ring
  span: number; // arc length in radians
  offset: number; // starting angle
  speed: number;
  width: number;
  glow: number;
  warm: number;
};

/** The blue "portal" ring of the reference: sweeping luminous arcs around the device. */
const ARCS: Arc[] = [
  { r: 1.0, span: 3.5, offset: 0.4, speed: 0.16, width: 3.4, glow: 1, warm: 1 },
  { r: 0.965, span: 2.6, offset: 2.6, speed: -0.13, width: 2.1, glow: 0.85, warm: 0.75 },
  { r: 1.045, span: 2.1, offset: 4.4, speed: 0.1, width: 1.6, glow: 0.7, warm: 0.55 },
  { r: 0.9, span: 1.7, offset: 1.2, speed: -0.2, width: 1.2, glow: 0.55, warm: 0.9 },
  { r: 1.1, span: 1.1, offset: 5.4, speed: 0.24, width: 0.9, glow: 0.45, warm: 0.4 },
  { r: 0.86, span: 0.8, offset: 3.4, speed: 0.3, width: 0.7, glow: 0.4, warm: 1 },
];

/** Horizontal light streaks flying to the right, as in the reference. */
const STREAKS = Array.from({ length: 26 }, (_, i) => ({
  y: (i % 13) / 12,
  len: 0.06 + ((i * 37) % 100) / 100 * 0.22,
  speed: 0.05 + ((i * 53) % 100) / 100 * 0.16,
  phase: ((i * 71) % 100) / 100,
  w: 0.8 + ((i * 29) % 100) / 100 * 2.2,
  a: 0.12 + ((i * 17) % 100) / 100 * 0.35,
}));

/**
 * Live light field for the hero: a bending fiber-optic ring behind the device
 * plus data streaks on the right. One canvas, one shared rAF loop, additive
 * blending, pointer + scroll reactive, paused off-screen.
 */
export function PortalLight({ className = "" }: { className?: string }) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d", { alpha: true });
    if (!ctx) return;

    let w = 0;
    let h = 0;
    const dpr = Math.min(window.devicePixelRatio || 1, 1.75);
    const resize = () => {
      const r = canvas.getBoundingClientRect();
      w = Math.max(1, r.width);
      h = Math.max(1, r.height);
      canvas.width = Math.round(w * dpr);
      canvas.height = Math.round(h * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    resize();
    const ro = new ResizeObserver(resize);
    ro.observe(canvas);

    const p = { x: 0, y: 0, tx: 0, ty: 0, s: 0 };
    const onPointer = (e: PointerEvent) => {
      p.tx = (e.clientX / window.innerWidth - 0.5) * 2;
      p.ty = (e.clientY / window.innerHeight - 0.5) * 2;
    };
    window.addEventListener("pointermove", onPointer, { passive: true });

    const ring = (a: Arc, t: number) => {
      const cx = w * 0.42 + p.x * 22;
      const cy = h * 0.46 + p.y * 16 - p.s * h * 0.06;
      const R = Math.min(w, h) * 0.42 * a.r * (1 + p.s * 0.16);
      const steps = 60;
      const rot = a.offset + t * a.speed;
      const draw = (lw: number, color: string | CanvasGradient) => {
        ctx.beginPath();
        for (let i = 0; i <= steps; i++) {
          const u = i / steps;
          const ang = rot + u * a.span;
          const wobble =
            1 + Math.sin(u * Math.PI * 2 + t * 0.5 + a.offset) * 0.02 + Math.sin(t * 0.3) * 0.012;
          const x = cx + Math.cos(ang) * R * wobble * 1.02;
          const y = cy + Math.sin(ang) * R * wobble * 1.16;
          if (i === 0) ctx.moveTo(x, y);
          else ctx.lineTo(x, y);
        }
        ctx.lineWidth = lw;
        ctx.strokeStyle = color;
        ctx.stroke();
      };
      const fade = 1 - p.s * 0.85;
      draw(a.width * 15, `rgba(22,86,225,${0.05 * a.glow * fade})`);
      draw(a.width * 5.5, `rgba(50,124,255,${0.14 * a.glow * fade})`);
      const g = ctx.createLinearGradient(cx - R, cy - R, cx + R, cy + R);
      const core = (0.3 + 0.55 * a.glow) * fade;
      g.addColorStop(0, "rgba(90,150,255,0)");
      g.addColorStop(0.35, `rgba(${170 + a.warm * 70},${205 + a.warm * 45},255,${core})`);
      g.addColorStop(0.7, `rgba(240,248,255,${core * 1.15})`);
      g.addColorStop(1, "rgba(70,130,255,0)");
      draw(Math.max(0.7, a.width * 0.5), g);
    };

    const streaks = (t: number) => {
      const fade = 1 - p.s * 0.9;
      for (const s of STREAKS) {
        const u = (s.phase + t * s.speed) % 1;
        const x0 = w * (0.6 + u * 0.45);
        const y = h * (0.14 + s.y * 0.74) + p.y * 10;
        const len = w * s.len * (1 - p.s * 0.4);
        const g = ctx.createLinearGradient(x0, y, x0 + len, y);
        g.addColorStop(0, "rgba(60,130,255,0)");
        g.addColorStop(0.5, `rgba(180,215,255,${s.a * fade})`);
        g.addColorStop(1, "rgba(60,130,255,0)");
        ctx.beginPath();
        ctx.moveTo(x0, y);
        ctx.lineTo(x0 + len, y);
        ctx.lineWidth = s.w;
        ctx.strokeStyle = g;
        ctx.stroke();
      }
    };

    const draw = (t: number) => {
      p.x += (p.tx - p.x) * 0.045;
      p.y += (p.ty - p.y) * 0.045;
      const prog = Math.min(1, Math.max(0, window.scrollY / (window.innerHeight * 0.95)));
      p.s += (prog - p.s) * 0.12;
      ctx.clearRect(0, 0, w, h);
      ctx.globalCompositeOperation = "lighter";
      ctx.lineCap = "round";
      for (const a of ARCS) ring(a, t);
      streaks(t);
      ctx.globalCompositeOperation = "source-over";
    };

    if (prefersReducedMotion()) {
      draw(0);
      return () => {
        ro.disconnect();
        window.removeEventListener("pointermove", onPointer);
      };
    }

    const start = performance.now();
    const stop = startFrameLoop(() => draw((performance.now() - start) / 1000), canvas);
    return () => {
      stop();
      ro.disconnect();
      window.removeEventListener("pointermove", onPointer);
    };
  }, []);

  return <canvas ref={canvasRef} aria-hidden className={`h-full w-full ${className}`} />;
}
