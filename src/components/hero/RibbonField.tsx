import { useEffect, useRef } from "react";
import { startFrameLoop, prefersReducedMotion } from "@/lib/raf";

type Ribbon = {
  /** control points in normalised canvas space (0..1) */
  pts: [number, number][];
  width: number;
  glow: number;
  speed: number;
  phase: number;
  amp: number;
  warm: number;
};

/**
 * The reference light language: large organic blue/white ribbons sweeping from
 * the lower left across the middle/right, plus one bright diagonal rising from
 * the upper right toward the device. Sharp white-blue cores, blue bloom, depth.
 */
const RIBBONS: Ribbon[] = [
  // dominant sweep, lower-left → right, bending up behind the device
  {
    pts: [
      [-0.05, 0.86],
      [0.28, 0.74],
      [0.58, 0.5],
      [0.86, 0.42],
      [1.08, 0.46],
    ],
    width: 5.2,
    glow: 1,
    speed: 0.16,
    phase: 0,
    amp: 0.02,
    warm: 1,
  },
  // second sweep, flatter and lower — depth layer
  {
    pts: [
      [-0.05, 0.95],
      [0.3, 0.87],
      [0.62, 0.68],
      [0.9, 0.6],
      [1.08, 0.62],
    ],
    width: 3,
    glow: 0.72,
    speed: -0.12,
    phase: 1.6,
    amp: 0.016,
    warm: 0.6,
  },
  // bright diagonal from the upper right down toward the device
  {
    pts: [
      [1.06, 0.05],
      [0.9, 0.2],
      [0.74, 0.36],
      [0.6, 0.52],
      [0.48, 0.66],
    ],
    width: 3.4,
    glow: 0.95,
    speed: 0.2,
    phase: 2.4,
    amp: 0.014,
    warm: 1,
  },
  // thin high arc over the device
  {
    pts: [
      [0.34, 0.5],
      [0.55, 0.3],
      [0.78, 0.24],
      [1.02, 0.3],
    ],
    width: 1.5,
    glow: 0.55,
    speed: -0.18,
    phase: 3.1,
    amp: 0.02,
    warm: 0.5,
  },
  // low filament hugging the floor
  {
    pts: [
      [0.1, 0.99],
      [0.42, 0.94],
      [0.72, 0.86],
      [1.04, 0.84],
    ],
    width: 1.1,
    glow: 0.42,
    speed: 0.1,
    phase: 4.2,
    amp: 0.01,
    warm: 0.8,
  },
];

/** Catmull-Rom sampling so the control points read as one organic curve. */
function sample(pts: [number, number][], u: number): [number, number] {
  const n = pts.length - 1;
  const t = Math.min(0.9999, Math.max(0, u)) * n;
  const i = Math.floor(t);
  const f = t - i;
  const p0 = pts[Math.max(0, i - 1)]!;
  const p1 = pts[i]!;
  const p2 = pts[Math.min(n, i + 1)]!;
  const p3 = pts[Math.min(n, i + 2)]!;
  const c = (a: number, b: number, cc: number, d: number) =>
    0.5 * (2 * b + (-a + cc) * f + (2 * a - 5 * b + 4 * cc - d) * f * f + (-a + 3 * b - 3 * cc + d) * f * f * f);
  return [c(p0[0], p1[0], p2[0], p3[0]), c(p0[1], p1[1], p2[1], p3[1])];
}

export function RibbonField({ className = "" }: { className?: string }) {
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

    const path = (r: Ribbon, t: number, offset: number) => {
      const steps = 74;
      ctx.beginPath();
      for (let i = 0; i <= steps; i++) {
        const u = i / steps;
        const [nx, ny] = sample(r.pts, u);
        const wob =
          Math.sin(u * 5.2 + t * r.speed * 2 + r.phase) * r.amp +
          Math.sin(u * 11 - t * r.speed * 1.3) * r.amp * 0.35;
        const x = nx * w + p.x * 9 * (0.4 + r.glow);
        const y = (ny + wob + offset) * h + p.y * 7 * (0.4 + r.glow) - p.s * h * 0.06;
        if (i === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      }
    };

    const drawRibbon = (r: Ribbon, t: number) => {
      const fade = 1 - p.s * 0.85;
      const k = Math.min(w, h) / 900;
      const stroke = (lw: number, color: string | CanvasGradient, offset = 0) => {
        path(r, t, offset);
        ctx.lineWidth = Math.max(0.6, lw * k);
        ctx.strokeStyle = color;
        ctx.stroke();
      };
      // atmospheric bloom
      stroke(r.width * 26, `rgba(18,74,205,${0.05 * r.glow * fade})`);
      stroke(r.width * 11, `rgba(38,110,245,${0.09 * r.glow * fade})`);
      stroke(r.width * 4.4, `rgba(70,140,255,${0.16 * r.glow * fade})`);
      // sharp white-blue core with travelling brightness
      const g = ctx.createLinearGradient(0, 0, w, h);
      const shift = (t * 0.06 + r.phase * 0.1) % 1;
      const core = (0.35 + 0.6 * r.glow) * fade;
      g.addColorStop(0, "rgba(60,130,255,0)");
      g.addColorStop(Math.max(0.01, shift * 0.5), `rgba(${150 + r.warm * 80},${195 + r.warm * 55},255,${core})`);
      g.addColorStop(Math.min(0.99, 0.45 + shift * 0.4), `rgba(244,250,255,${core * 1.2})`);
      g.addColorStop(1, "rgba(60,130,255,0)");
      stroke(Math.max(0.8, r.width * 0.42), g);
    };

    const draw = (t: number) => {
      p.x += (p.tx - p.x) * 0.045;
      p.y += (p.ty - p.y) * 0.045;
      const prog = Math.min(1, Math.max(0, window.scrollY / (window.innerHeight * 0.95)));
      p.s += (prog - p.s) * 0.12;
      ctx.clearRect(0, 0, w, h);
      ctx.globalCompositeOperation = "lighter";
      ctx.lineCap = "round";
      ctx.lineJoin = "round";
      for (const r of RIBBONS) drawRibbon(r, t);
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
