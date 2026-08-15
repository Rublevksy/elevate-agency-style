import { useEffect, useRef } from "react";

import { drawStream } from "@/components/hero/drawStream";
import { RIBBONS, STAGE_H, STAGE_W } from "@/lib/hero-waves";
import { prefersReducedMotion, startFrameLoop } from "@/lib/raf";

/**
 * Living glossy floor.
 *
 * A near-black wet surface: the same light streams are re-sampled (identical
 * time base, so the reflection can never drift), mirrored, vertically squashed,
 * blurred and rippled with a slow horizontal distortion. Subtle by design.
 */
export function FloorGlass({
  className,
  progress,
}: {
  className?: string;
  progress?: { current: number };
}) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d", { alpha: true });
    if (!ctx) return;

    const reduced = prefersReducedMotion();
    let dpr = 1;
    let vw = 0;
    let vh = 0;
    let mobile = false;

    const resize = () => {
      const rect = canvas.getBoundingClientRect();
      vw = rect.width;
      vh = rect.height;
      mobile = window.innerWidth < 820;
      dpr = Math.min(window.devicePixelRatio || 1, mobile ? 1 : 1.25);
      canvas.width = Math.max(1, Math.round(vw * dpr));
      canvas.height = Math.max(1, Math.round(vh * dpr));
    };
    resize();
    window.addEventListener("resize", resize);

    const start = performance.now();
    const draw = () => {
      const time = reduced ? 4 : (performance.now() - start) / 1000;
      const p = progress?.current ?? 0;
      const drift = Math.sin(time * 0.06) * 1.5;

      ctx.setTransform(1, 0, 0, 1, 0, 0);
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      const sx = vw / STAGE_W;
      ctx.save();
      ctx.setTransform(sx * dpr, 0, 0, sx * dpr, 0, 0);
      ctx.globalCompositeOperation = "lighter";
      ctx.filter = mobile ? "blur(8px)" : "blur(22px)";

      // mirror around the horizon, squashed for perspective
      const horizon = STAGE_H * 0.02;
      ctx.translate(0, horizon);
      ctx.scale(1, -0.44);
      ctx.translate(0, -STAGE_H * 0.86);

      const list = mobile ? RIBBONS.slice(0, 2) : RIBBONS.slice(0, 4);
      for (const r of list) {
        // slow horizontal ripple so the reflection deforms like a wet surface
        const ripple = Math.sin(time * 0.5 + r.phase) * 16;
        drawStream(ctx, r, time, drift, {
          quality: mobile ? 0.4 : 0.6,
          alpha: (mobile ? 0.2 : 0.3) * (1 - p * 0.4),
          pointerX: ripple - p * 30,
          pointerY: 0,
          reflection: true,
        });
      }
      ctx.filter = "none";
      ctx.restore();
    };

    if (reduced) {
      draw();
      return () => window.removeEventListener("resize", resize);
    }
    const stop = startFrameLoop(draw, canvas);
    return () => {
      stop();
      window.removeEventListener("resize", resize);
    };
  }, [progress]);

  return <canvas ref={canvasRef} aria-hidden="true" className={className} />;
}
