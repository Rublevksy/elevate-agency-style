import { useEffect, useRef } from "react";

type Point = readonly [number, number];
type Ribbon = {
  points: readonly [Point, Point, Point, Point];
  width: number;
  depth: number;
  phase: number;
};

const RIBBONS: readonly Ribbon[] = [
  { points: [[-0.08, 0.66], [0.23, 0.47], [0.61, 0.54], [1.08, 0.25]], width: 1.35, depth: 0.42, phase: 0.2 },
  { points: [[-0.12, 0.75], [0.30, 0.58], [0.57, 0.73], [1.10, 0.42]], width: 1.7, depth: 0.67, phase: 1.1 },
  { points: [[0.08, 0.88], [0.36, 0.65], [0.77, 0.72], [1.11, 0.54]], width: 1.15, depth: 0.36, phase: 2.3 },
  { points: [[-0.10, 0.42], [0.27, 0.54], [0.67, 0.28], [1.08, 0.36]], width: 1.05, depth: 0.31, phase: 3.4 },
  { points: [[0.18, 1.02], [0.44, 0.78], [0.72, 0.95], [1.13, 0.66]], width: 1.9, depth: 0.78, phase: 4.1 },
  { points: [[0.30, 0.08], [0.58, 0.22], [0.70, 0.50], [1.12, 0.18]], width: 1.25, depth: 0.5, phase: 5.2 },
  { points: [[0.48, -0.10], [0.64, 0.26], [0.84, 0.28], [1.10, 0.12]], width: 0.9, depth: 0.24, phase: 0.8 },
  { points: [[-0.05, 0.57], [0.34, 0.34], [0.69, 0.61], [1.10, 0.46]], width: 1.4, depth: 0.58, phase: 2.8 },
];

function pathFor(ctx: CanvasRenderingContext2D, ribbon: Ribbon, w: number, h: number, time: number, px: number, py: number) {
  const p = ribbon.points.map(([x, y], index) => {
    if (index === 0 || index === 3) return [x * w + px, y * h + py] as Point;
    const wave = Math.sin(time * (0.16 + ribbon.depth * 0.07) + ribbon.phase + index);
    return [(x + wave * 0.008 * ribbon.depth) * w + px, (y + wave * 0.012) * h + py] as Point;
  });
  ctx.beginPath();
  ctx.moveTo(p[0][0], p[0][1]);
  ctx.bezierCurveTo(p[1][0], p[1][1], p[2][0], p[2][1], p[3][0], p[3][1]);
}

export function RibbonField() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d", { alpha: true });
    if (!canvas || !ctx) return;

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const pointer = { x: 0, y: 0, tx: 0, ty: 0 };
    let width = 0;
    let height = 0;
    let frame = 0;
    let last = 0;
    let visible = document.visibilityState === "visible";

    const resize = () => {
      const rect = canvas.getBoundingClientRect();
      const dpr = Math.min(window.devicePixelRatio || 1, 1.25);
      width = rect.width;
      height = rect.height;
      canvas.width = Math.round(width * dpr);
      canvas.height = Math.round(height * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };

    const paint = (now = 0) => {
      if (!reduced && now - last < 32) {
        frame = requestAnimationFrame(paint);
        return;
      }
      last = now;
      pointer.x += (pointer.tx - pointer.x) * 0.035;
      pointer.y += (pointer.ty - pointer.y) * 0.035;
      ctx.clearRect(0, 0, width, height);
      ctx.lineCap = "round";
      ctx.globalCompositeOperation = "lighter";
      const time = reduced ? 0 : now / 1000;

      for (const ribbon of RIBBONS) {
        const px = pointer.x * (3 + ribbon.depth * 7);
        const py = pointer.y * (2 + ribbon.depth * 5);

        pathFor(ctx, ribbon, width, height, time, px, py);
        ctx.strokeStyle = `rgba(21, 91, 255, ${0.12 + ribbon.depth * 0.08})`;
        ctx.lineWidth = ribbon.width * (8 + ribbon.depth * 5);
        ctx.stroke();

        pathFor(ctx, ribbon, width, height, time, px, py);
        ctx.strokeStyle = `rgba(27, 118, 255, ${0.48 + ribbon.depth * 0.16})`;
        ctx.lineWidth = ribbon.width * 2.6;
        ctx.stroke();

        pathFor(ctx, ribbon, width, height, time, px, py);
        ctx.strokeStyle = `rgba(232, 246, 255, ${0.76 + ribbon.depth * 0.18})`;
        ctx.lineWidth = Math.max(0.7, ribbon.width * 0.58);
        ctx.stroke();
      }
      ctx.globalCompositeOperation = "source-over";
      if (!reduced && visible) frame = requestAnimationFrame(paint);
    };

    const move = (event: PointerEvent) => {
      pointer.tx = event.clientX / window.innerWidth - 0.5;
      pointer.ty = event.clientY / window.innerHeight - 0.5;
    };
    const visibility = () => {
      visible = document.visibilityState === "visible";
      cancelAnimationFrame(frame);
      if (visible && !reduced) frame = requestAnimationFrame(paint);
    };

    resize();
    paint();
    window.addEventListener("resize", resize, { passive: true });
    window.addEventListener("pointermove", move, { passive: true });
    document.addEventListener("visibilitychange", visibility);
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("resize", resize);
      window.removeEventListener("pointermove", move);
      document.removeEventListener("visibilitychange", visibility);
    };
  }, []);

  return <canvas ref={canvasRef} aria-hidden className="pointer-events-none absolute inset-0 h-full w-full" />;
}