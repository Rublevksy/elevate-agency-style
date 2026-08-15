import { useEffect, useRef } from "react";
import { startFrameLoop, prefersReducedMotion } from "@/lib/raf";

/**
 * RIBBON FIELD — procedural fiber-optic light ribbons.
 *
 * Each ribbon is a cubic Bézier chain drawn in three passes (outer bloom,
 * electric blue halo, white-hot core) on a 2D canvas with additive blending.
 * A travelling highlight head runs along every path at its own velocity and the
 * control points breathe slowly, so the ribbons read as physical light tubes
 * rather than a gradient. Depth is faked with per-layer speed + opacity, and the
 * whole field parallaxes gently against the pointer.
 */

type Ribbon = {
  /** normalised control points (0..1 of the viewport box) */
  pts: [number, number][];
  width: number;
  /** 0 = far (slow, dim), 1 = near */
  depth: number;
  speed: number;
  phase: number;
  hue: number;
  /** drawn in front of the device layer */
  front?: boolean;
};

const RIBBONS: Ribbon[] = [
  // far, wide sweeps behind the device
  { pts: [[-0.15, 0.62], [0.28, 0.38], [0.72, 0.72], [1.18, 0.42]], width: 2.2, depth: 0.15, speed: 0.055, phase: 0.1, hue: 212 },
  { pts: [[-0.12, 0.34], [0.3, 0.56], [0.68, 0.2], [1.15, 0.4]], width: 1.8, depth: 0.12, speed: 0.041, phase: 0.55, hue: 206 },
  { pts: [[-0.1, 0.8], [0.35, 0.62], [0.7, 0.86], [1.2, 0.6]], width: 2.0, depth: 0.2, speed: 0.048, phase: 0.8, hue: 218 },
  // mid layer — the defining ribbons around the machine
  { pts: [[-0.08, 0.52], [0.34, 0.3], [0.66, 0.62], [1.16, 0.3]], width: 3.4, depth: 0.5, speed: 0.075, phase: 0.25, hue: 210 },
  { pts: [[-0.06, 0.7], [0.4, 0.5], [0.74, 0.7], [1.14, 0.5]], width: 4.2, depth: 0.6, speed: 0.062, phase: 0.62, hue: 214 },
  { pts: [[-0.05, 0.44], [0.42, 0.66], [0.8, 0.34], [1.12, 0.56]], width: 2.8, depth: 0.45, speed: 0.088, phase: 0.4, hue: 202 },
  { pts: [[0.1, 0.94], [0.44, 0.74], [0.78, 0.9], [1.2, 0.72]], width: 3.0, depth: 0.55, speed: 0.05, phase: 0.9, hue: 216 },
  // near, low-opacity ribbons crossing in front
  { pts: [[-0.1, 0.24], [0.36, 0.44], [0.82, 0.14], [1.2, 0.32]], width: 5.5, depth: 0.9, speed: 0.115, phase: 0.15, hue: 208, front: true },
  { pts: [[-0.12, 0.88], [0.3, 0.98], [0.86, 0.66], [1.2, 0.84]], width: 6.5, depth: 0.95, speed: 0.098, phase: 0.7, hue: 212, front: true },
  { pts: [[-0.08, 0.58], [0.5, 0.86], [0.9, 0.5], [1.2, 0.66]], width: 4.6, depth: 0.85, speed: 0.13, phase: 0.35, hue: 220, front: true },
];

function bez(p: [number, number][], t: number): [number, number] {
  const u = 1 - t;
  const a = u * u * u, b = 3 * u * u * t, c = 3 * u * t * t, d = t * t * t;
  return [
    a * p[0][0] + b * p[1][0] + c * p[2][0] + d * p[3][0],
    a * p[0][1] + b * p[1][1] + c * p[2][1] + d * p[3][1],
  ];
}

export function RibbonField({ layer = "back", className = "" }: { layer?: "back" | "front"; className?: string }) {
  const ref = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d", { alpha: true });
    if (!ctx) return;

    const set = RIBBONS.filter((r) => (layer === "front" ? r.front : !r.front));
    let w = 0, h = 0, dpr = 1;
    const resize = () => {
      const rect = canvas.getBoundingClientRect();
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      w = rect.width; h = rect.height;
      canvas.width = Math.round(w * dpr);
      canvas.height = Math.round(h * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    resize();
    window.addEventListener("resize", resize);

    const pointer = { x: 0, y: 0, tx: 0, ty: 0 };
    const onMove = (e: PointerEvent) => {
      pointer.tx = (e.clientX / window.innerWidth - 0.5) * 2;
      pointer.ty = (e.clientY / window.innerHeight - 0.5) * 2;
    };
    window.addEventListener("pointermove", onMove, { passive: true });

    const reduced = prefersReducedMotion();
    const start = performance.now();

    const drawPath = (p: [number, number][], px: number, py: number) => {
      ctx.beginPath();
      const [x0, y0] = bez(p, 0);
      ctx.moveTo(x0 * w + px, y0 * h + py);
      const STEPS = 46;
      for (let i = 1; i <= STEPS; i++) {
        const [x, y] = bez(p, i / STEPS);
        ctx.lineTo(x * w + px, y * h + py);
      }
    };

    const paint = () => {
      const time = reduced ? 0 : (performance.now() - start) / 1000;
      pointer.x += (pointer.tx - pointer.x) * 0.045;
      pointer.y += (pointer.ty - pointer.y) * 0.045;

      ctx.clearRect(0, 0, w, h);
      ctx.globalCompositeOperation = "lighter";
      ctx.lineCap = "round";

      for (const r of set) {
        // slow organic deformation of the interior control points
        const pts = r.pts.map((pt, i) => {
          if (i === 0 || i === 3) return pt;
          const k = time * r.speed * 2.4 + r.phase * 6.283 + i;
          return [pt[0] + Math.cos(k) * 0.02 * r.depth, pt[1] + Math.sin(k * 0.8) * 0.028] as [number, number];
        }) as [number, number][];

        const px = pointer.x * (6 + r.depth * 34);
        const py = pointer.y * (4 + r.depth * 22);
        const near = r.depth;

        // 1 — outer bloom
        ctx.save();
        ctx.filter = `blur(${(10 + near * 26).toFixed(1)}px)`;
        ctx.strokeStyle = `hsla(${r.hue}, 100%, 58%, ${(0.1 + near * 0.14).toFixed(3)})`;
        ctx.lineWidth = r.width * (7 + near * 8);
        drawPath(pts, px, py);
        ctx.stroke();
        ctx.restore();

        // 2 — electric halo
        ctx.save();
        ctx.filter = `blur(${(2.5 + near * 6).toFixed(1)}px)`;
        ctx.strokeStyle = `hsla(${r.hue}, 100%, 63%, ${(0.3 + near * 0.22).toFixed(3)})`;
        ctx.lineWidth = r.width * 2.1;
        drawPath(pts, px, py);
        ctx.stroke();
        ctx.restore();

        // 3 — white-hot core
        ctx.save();
        ctx.strokeStyle = `hsla(${r.hue - 4}, 100%, 92%, ${(0.42 + near * 0.3).toFixed(3)})`;
        ctx.lineWidth = Math.max(0.7, r.width * 0.44);
        drawPath(pts, px, py);
        ctx.stroke();
        ctx.restore();

        // 4 — travelling highlight head along the path
        const t = ((time * r.speed + r.phase) % 1 + 1) % 1;
        const SEG = 18;
        ctx.save();
        ctx.filter = `blur(${(1.5 + near * 4).toFixed(1)}px)`;
        for (let i = 0; i < SEG; i++) {
          const t0 = t - (i / SEG) * 0.22;
          const t1 = t0 - 0.22 / SEG;
          if (t1 < 0 || t0 > 1) continue;
          const [ax, ay] = bez(pts, t0);
          const [bx, by] = bez(pts, t1);
          const fade = 1 - i / SEG;
          ctx.strokeStyle = `hsla(${r.hue - 10}, 100%, ${88 + fade * 10}%, ${(fade * (0.35 + near * 0.4)).toFixed(3)})`;
          ctx.lineWidth = r.width * (0.8 + fade * 1.5);
          ctx.beginPath();
          ctx.moveTo(ax * w + px, ay * h + py);
          ctx.lineTo(bx * w + px, by * h + py);
          ctx.stroke();
        }
        ctx.restore();
      }
      ctx.globalCompositeOperation = "source-over";
    };

    if (reduced) {
      paint();
      return () => {
        window.removeEventListener("resize", resize);
        window.removeEventListener("pointermove", onMove);
      };
    }

    const stop = startFrameLoop(paint, canvas);
    return () => {
      stop();
      window.removeEventListener("resize", resize);
      window.removeEventListener("pointermove", onMove);
    };
  }, [layer]);

  return (
    <canvas
      ref={ref}
      aria-hidden
      className={`pointer-events-none absolute inset-0 h-full w-full ${className}`}
    />
  );
}
