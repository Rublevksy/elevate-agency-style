import { useEffect, useRef } from "react";
import { startFrameLoop, prefersReducedMotion } from "@/lib/raf";

type Ribbon = {
  depth: number; // 0 = far, 1 = near
  amp: number;
  wave: number;
  speed: number;
  phase: number;
  y: number;
  tilt: number;
  width: number;
  warm: number; // 0 = blue, 1 = white-hot core
};

const RIBBONS: Ribbon[] = [
  { depth: 0.12, amp: 0.10, wave: 1.5, speed: 0.055, phase: 0.0, y: 0.30, tilt: -0.16, width: 1.1, warm: 0.15 },
  { depth: 0.22, amp: 0.14, wave: 1.1, speed: 0.075, phase: 1.7, y: 0.62, tilt: 0.12, width: 1.4, warm: 0.2 },
  { depth: 0.34, amp: 0.09, wave: 1.8, speed: 0.095, phase: 3.1, y: 0.44, tilt: -0.07, width: 1.7, warm: 0.35 },
  { depth: 0.48, amp: 0.16, wave: 0.9, speed: 0.062, phase: 4.4, y: 0.74, tilt: 0.18, width: 2.2, warm: 0.5 },
  { depth: 0.60, amp: 0.12, wave: 1.35, speed: 0.11, phase: 2.2, y: 0.36, tilt: -0.2, width: 2.6, warm: 0.7 },
  { depth: 0.74, amp: 0.19, wave: 0.8, speed: 0.083, phase: 5.6, y: 0.68, tilt: 0.1, width: 3.2, warm: 0.85 },
  { depth: 0.86, amp: 0.13, wave: 1.15, speed: 0.13, phase: 0.9, y: 0.52, tilt: -0.12, width: 3.8, warm: 1 },
  { depth: 0.95, amp: 0.22, wave: 0.65, speed: 0.07, phase: 3.9, y: 0.82, tilt: 0.22, width: 4.4, warm: 0.9 },
];

/**
 * Animated fiber-optic light ribbons. 2D canvas, additive blending, one shared
 * rAF loop, paused when off-screen. Each ribbon is a continuously bending
 * sine-composite path drawn as three passes: outer bloom, blue glow, white core.
 */
export function LightWaves({ className = "" }: { className?: string }) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const pointer = useRef({ x: 0, y: 0, tx: 0, ty: 0 });

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

    const onPointer = (e: PointerEvent) => {
      pointer.current.tx = (e.clientX / window.innerWidth - 0.5) * 2;
      pointer.current.ty = (e.clientY / window.innerHeight - 0.5) * 2;
    };
    window.addEventListener("pointermove", onPointer, { passive: true });

    const reduced = prefersReducedMotion();

    const path = (r: Ribbon, t: number, px: number, py: number) => {
      ctx.beginPath();
      const steps = 44;
      const drift = px * 26 * (0.25 + r.depth);
      const lift = py * 18 * (0.25 + r.depth);
      for (let i = 0; i <= steps; i++) {
        const u = i / steps;
        const x = -0.12 * w + u * w * 1.24 + drift;
        const swirl =
          Math.sin(u * Math.PI * r.wave + t * r.speed + r.phase) * r.amp +
          Math.sin(u * Math.PI * (r.wave * 2.3) + t * r.speed * 1.6 + r.phase * 1.4) * r.amp * 0.32 +
          Math.cos(u * Math.PI * 0.6 - t * r.speed * 0.7) * r.amp * 0.18;
        const y = h * (r.y + swirl) + (u - 0.5) * h * r.tilt + lift;
        if (i === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      }
    };

    const stroke = (r: Ribbon, t: number, px: number, py: number) => {
      const near = 0.35 + r.depth * 0.65;
      // outer atmospheric bloom
      path(r, t, px, py);
      ctx.lineWidth = r.width * 11;
      ctx.strokeStyle = `rgba(28,96,235,${0.05 * near})`;
      ctx.stroke();
      // blue glow
      path(r, t, px, py);
      ctx.lineWidth = r.width * 4.2;
      ctx.strokeStyle = `rgba(58,130,255,${0.14 * near})`;
      ctx.stroke();
      // bright core
      path(r, t, px, py);
      ctx.lineWidth = Math.max(0.7, r.width * 0.62);
      const g = ctx.createLinearGradient(0, 0, w, 0);
      const a = (0.16 + 0.5 * r.depth) * (0.55 + 0.45 * r.warm);
      g.addColorStop(0, `rgba(120,175,255,0)`);
      g.addColorStop(0.28, `rgba(${180 + r.warm * 60}, ${210 + r.warm * 40}, 255, ${a})`);
      g.addColorStop(0.6, `rgba(235,245,255,${a * 1.25})`);
      g.addColorStop(1, `rgba(90,150,255,0)`);
      ctx.strokeStyle = g;
      ctx.stroke();
    };

    const draw = (t: number) => {
      const p = pointer.current;
      p.x += (p.tx - p.x) * 0.045;
      p.y += (p.ty - p.y) * 0.045;
      ctx.clearRect(0, 0, w, h);
      ctx.globalCompositeOperation = "lighter";
      ctx.lineCap = "round";
      for (const r of RIBBONS) stroke(r, t, p.x, p.y);
      ctx.globalCompositeOperation = "source-over";
    };

    if (reduced) {
      draw(0);
      return () => {
        ro.disconnect();
        window.removeEventListener("pointermove", onPointer);
      };
    }

    const start = performance.now();
    const stop = startFrameLoop(() => draw((performance.now() - start) / 1000 * 1.6), canvas);

    return () => {
      stop();
      ro.disconnect();
      window.removeEventListener("pointermove", onPointer);
    };
  }, []);

  return <canvas ref={canvasRef} aria-hidden className={`h-full w-full ${className}`} />;
}
