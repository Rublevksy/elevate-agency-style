import { useEffect, useRef } from "react";

/**
 * Fiber-optic light field: a handful of thick Bézier ribbons drawn on ONE canvas
 * with a bright white-blue core and wide soft blue halos (additive blending).
 * Deterministic slow motion, paused when off-screen/hidden, frozen when the user
 * prefers reduced motion. No React state per frame.
 */

type Ribbon = {
  /** vertical anchors (0-1 of canvas) */
  y: number[];
  depth: number; // 0 = far/dim, 1 = near/bright
  speed: number;
  phase: number;
  amp: number;
  hue: number;
};

const RIBBONS: Ribbon[] = [
  { y: [0.72, 0.44, 0.3, 0.5], depth: 1, speed: 0.055, phase: 0.2, amp: 0.05, hue: 205 },
  { y: [0.34, 0.56, 0.66, 0.4], depth: 0.85, speed: 0.041, phase: 1.7, amp: 0.06, hue: 210 },
  { y: [0.86, 0.6, 0.72, 0.62], depth: 0.6, speed: 0.033, phase: 3.1, amp: 0.045, hue: 200 },
  { y: [0.2, 0.36, 0.24, 0.34], depth: 0.42, speed: 0.027, phase: 4.4, amp: 0.05, hue: 215 },
  { y: [0.58, 0.3, 0.52, 0.28], depth: 0.3, speed: 0.022, phase: 5.6, amp: 0.055, hue: 198 },
  { y: [0.5, 0.78, 0.46, 0.74], depth: 0.2, speed: 0.018, phase: 0.9, amp: 0.06, hue: 208 },
];

export function FiberField({ className = "" }: { className?: string }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");
    if (!canvas || !ctx) return;

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)");
    let w = 0;
    let h = 0;
    let raf = 0;
    let visible = true;
    let onScreen = true;
    let running = false;
    let t = 0;
    let last = 0;
    const pointer = { x: 0, y: 0, tx: 0, ty: 0 };

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 1.5);
      const rect = canvas.getBoundingClientRect();
      w = Math.max(1, Math.round(rect.width));
      h = Math.max(1, Math.round(rect.height));
      canvas.width = Math.round(w * dpr);
      canvas.height = Math.round(h * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      draw();
    };

    const drawRibbon = (r: Ribbon) => {
      const wobble = (i: number) => Math.sin(t * r.speed * 6 + r.phase + i * 1.35) * r.amp;
      const px = pointer.x * (8 + r.depth * 26);
      const py = pointer.y * (6 + r.depth * 18);

      const x0 = -0.12 * w + px;
      const x1 = 0.3 * w + px * 1.4;
      const x2 = 0.68 * w + px * 1.8;
      const x3 = 1.14 * w + px * 2.2;
      const ys = r.y.map((y, i) => (y + wobble(i)) * h + py);

      const core = 1.1 + r.depth * 2.2;
      const path = new Path2D();
      path.moveTo(x0, ys[0]);
      path.bezierCurveTo(x1, ys[1], x2, ys[2], x3, ys[3]);

      const grad = ctx.createLinearGradient(0, 0, w, 0);
      grad.addColorStop(0, `hsla(${r.hue}, 90%, 60%, 0)`);
      grad.addColorStop(0.28, `hsla(${r.hue}, 95%, 68%, 1)`);
      grad.addColorStop(0.6, `hsla(${r.hue - 6}, 100%, 88%, 1)`);
      grad.addColorStop(1, `hsla(${r.hue}, 90%, 60%, 0)`);

      ctx.lineCap = "round";
      // wide soft halo → tighter glow → bright core (fake bloom without filters)
      const layers: Array<[number, number]> = [
        [core * 16, 0.05 * r.depth],
        [core * 8, 0.09 * r.depth],
        [core * 3.6, 0.16 * r.depth],
        [core * 1.5, 0.3 * r.depth],
      ];
      ctx.strokeStyle = grad;
      for (const [width, alpha] of layers) {
        ctx.globalAlpha = alpha;
        ctx.lineWidth = width;
        ctx.stroke(path);
      }
      // white-blue core
      ctx.globalAlpha = 0.34 + r.depth * 0.5;
      ctx.lineWidth = core * 0.7;
      ctx.strokeStyle = `hsla(${r.hue - 10}, 100%, 96%, 1)`;
      ctx.stroke(path);
      ctx.globalAlpha = 1;
    };

    const draw = () => {
      ctx.clearRect(0, 0, w, h);
      ctx.globalCompositeOperation = "lighter";
      for (const r of RIBBONS) drawRibbon(r);
      ctx.globalCompositeOperation = "source-over";
    };

    const tick = (now: number) => {
      raf = requestAnimationFrame(tick);
      if (now - last < 1000 / 40) return;
      last = now;
      t += 0.016;
      pointer.x += (pointer.tx - pointer.x) * 0.05;
      pointer.y += (pointer.ty - pointer.y) * 0.05;
      draw();
    };

    const sync = () => {
      const should = visible && onScreen && !reduced.matches;
      if (should === running) return;
      running = should;
      if (should) raf = requestAnimationFrame(tick);
      else {
        cancelAnimationFrame(raf);
        draw();
      }
    };

    const onVis = () => {
      visible = document.visibilityState !== "hidden";
      sync();
    };
    const onPointer = (e: PointerEvent) => {
      pointer.tx = (e.clientX / window.innerWidth - 0.5) * 2;
      pointer.ty = (e.clientY / window.innerHeight - 0.5) * 2;
    };

    const io = new IntersectionObserver(
      ([entry]) => {
        onScreen = !!entry?.isIntersecting;
        sync();
      },
      { rootMargin: "10% 0px" },
    );
    io.observe(canvas);

    resize();
    window.addEventListener("resize", resize);
    window.addEventListener("pointermove", onPointer, { passive: true });
    document.addEventListener("visibilitychange", onVis);
    reduced.addEventListener("change", sync);
    sync();

    return () => {
      cancelAnimationFrame(raf);
      io.disconnect();
      window.removeEventListener("resize", resize);
      window.removeEventListener("pointermove", onPointer);
      document.removeEventListener("visibilitychange", onVis);
      reduced.removeEventListener("change", sync);
    };
  }, []);

  return <canvas ref={canvasRef} aria-hidden className={className} />;
}
