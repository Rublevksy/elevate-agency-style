import { useEffect, useRef } from "react";
import { startFrameLoop, prefersReducedMotion } from "@/lib/raf";

type Ribbon = {
  depth: number; // 0 = far, 1 = near
  speed: number;
  phase: number;
  amp: number;
  y: number;
  width: number;
  hue: number;
};

const RIBBONS: Ribbon[] = [
  { depth: 0.15, speed: 0.055, phase: 0.0, amp: 0.16, y: 0.28, width: 1.1, hue: 0.35 },
  { depth: 0.3, speed: 0.042, phase: 1.7, amp: 0.2, y: 0.42, width: 1.6, hue: 0.55 },
  { depth: 0.45, speed: 0.07, phase: 3.1, amp: 0.13, y: 0.6, width: 1.3, hue: 0.45 },
  { depth: 0.62, speed: 0.036, phase: 4.4, amp: 0.24, y: 0.74, width: 2.2, hue: 0.75 },
  { depth: 0.8, speed: 0.061, phase: 5.9, amp: 0.18, y: 0.52, width: 2.6, hue: 1.0 },
  { depth: 0.95, speed: 0.048, phase: 2.4, amp: 0.11, y: 0.66, width: 3.1, hue: 0.85 },
];

/**
 * Animated fiber-optic light ribbons — a small canvas layer that lives behind
 * the device. Bright blue/white cores with soft blue haloes, each ribbon on its
 * own depth and speed so the field drifts organically. Transform/paint only,
 * no layout reads, no scroll hijacking.
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
    const dpr = Math.min(window.devicePixelRatio || 1, 2);

    const resize = () => {
      const rect = canvas.getBoundingClientRect();
      w = Math.max(320, rect.width);
      h = Math.max(320, rect.height);
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
    const start = performance.now();

    const drawRibbon = (r: Ribbon, t: number) => {
      const px = pointer.current.x * (12 + r.depth * 34);
      const py = pointer.current.y * (8 + r.depth * 22);
      const baseY = h * r.y + py;
      const amp = h * r.amp;
      const steps = 26;

      ctx.beginPath();
      for (let i = 0; i <= steps; i++) {
        const u = i / steps;
        const x = -w * 0.12 + u * w * 1.24 + px;
        const swirl =
          Math.sin(u * 2.4 + t * r.speed + r.phase) * amp +
          Math.sin(u * 5.1 - t * r.speed * 1.7 + r.phase * 1.3) * amp * 0.34 +
          Math.cos(u * 1.2 + t * r.speed * 0.6) * amp * 0.2;
        const y = baseY + swirl * (0.35 + 0.65 * Math.sin(Math.PI * u));
        if (i === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      }

      const grad = ctx.createLinearGradient(0, 0, w, 0);
      grad.addColorStop(0, "rgba(56,132,255,0)");
      grad.addColorStop(0.22, `rgba(56,132,255,${0.45 * r.hue})`);
      grad.addColorStop(0.5, `rgba(140,196,255,${0.82 * r.hue})`);
      grad.addColorStop(0.78, `rgba(56,132,255,${0.45 * r.hue})`);
      grad.addColorStop(1, "rgba(56,132,255,0)");

      ctx.lineCap = "round";
      ctx.strokeStyle = grad;

      // outer halo
      ctx.globalAlpha = 0.2 + r.depth * 0.12;
      ctx.lineWidth = r.width * 13;
      ctx.stroke();
      // mid glow
      ctx.globalAlpha = 0.3;
      ctx.lineWidth = r.width * 5;
      ctx.stroke();
      // bright core
      ctx.globalAlpha = 0.9;
      ctx.lineWidth = r.width;
      ctx.strokeStyle = `rgba(198,226,255,${0.28 + r.hue * 0.34})`;
      ctx.stroke();
      ctx.globalAlpha = 1;
    };

    const frame = () => {
      const p = pointer.current;
      p.x += (p.tx - p.x) * 0.045;
      p.y += (p.ty - p.y) * 0.045;

      const t = reduced ? 0 : (performance.now() - start) / 1000;
      ctx.clearRect(0, 0, w, h);
      ctx.globalCompositeOperation = "lighter";
      for (const r of RIBBONS) drawRibbon(r, t);
      ctx.globalCompositeOperation = "source-over";
    };

    frame();
    const stop = reduced ? undefined : startFrameLoop(frame, canvas);

    return () => {
      stop?.();
      ro.disconnect();
      window.removeEventListener("pointermove", onPointer);
    };
  }, []);

  return <canvas ref={canvasRef} aria-hidden className={`h-full w-full ${className}`} />;
}
