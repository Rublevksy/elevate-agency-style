import { useEffect, useRef } from "react";

import { drawStream } from "@/components/hero/drawStream";
import { RIBBONS, STAGE_H, STAGE_W } from "@/lib/hero-waves";
import { prefersReducedMotion, startFrameLoop } from "@/lib/raf";

/**
 * The hero light layer: a few BROAD organic light streams flowing diagonally
 * across the stage. Composed in the virtual stage space (1536x1024) and
 * "cover" mapped, so the composition matches the approved reference at any
 * viewport. Drawn additively on a near-black scene.
 *
 * The laptop is a sibling layer stacked above this canvas, so the light
 * naturally passes *behind* the device and never paints over its silhouette.
 */
export function FiberField({
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
    const pointer = { x: 0, y: 0, tx: 0, ty: 0 };

    const resize = () => {
      const rect = canvas.getBoundingClientRect();
      vw = rect.width;
      vh = rect.height;
      mobile = window.innerWidth < 820;
      dpr = Math.min(window.devicePixelRatio || 1, mobile ? 1.15 : 1.5);
      canvas.width = Math.max(1, Math.round(vw * dpr));
      canvas.height = Math.max(1, Math.round(vh * dpr));
    };
    resize();

    const onPointer = (e: PointerEvent) => {
      pointer.tx = (e.clientX / window.innerWidth - 0.5) * 2;
      pointer.ty = (e.clientY / window.innerHeight - 0.5) * 2;
    };
    window.addEventListener("pointermove", onPointer, { passive: true });
    window.addEventListener("resize", resize);

    const start = performance.now();
    const draw = () => {
      // the light keeps its own time loop, independent of scroll
      const time = reduced ? 4 : (performance.now() - start) / 1000;
      const p = progress?.current ?? 0;
      pointer.x += (pointer.tx - pointer.x) * 0.04;
      pointer.y += (pointer.ty - pointer.y) * 0.04;
      const drift = Math.sin(time * 0.06) * 1.5;

      ctx.setTransform(1, 0, 0, 1, 0, 0);
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      const scale = Math.max(vw / STAGE_W, vh / STAGE_H);
      const ox = (vw - STAGE_W * scale) / 2;
      // gentle scroll parallax of the whole light volume
      const oy = (vh - STAGE_H * scale) / 2 - p * 110;
      ctx.setTransform(scale * dpr, 0, 0, scale * dpr, ox * dpr, oy * dpr);
      ctx.globalCompositeOperation = "lighter";

      const list = mobile ? RIBBONS.slice(0, 3) : RIBBONS;
      for (const r of list) {
        drawStream(ctx, r, time, drift, {
          quality: mobile ? 0.55 : 1,
          alpha: 1 - p * 0.25,
          pointerX: pointer.x * 26 * r.depth - p * 40 * r.depth,
          pointerY: pointer.y * 18 * r.depth,
        });
      }

      // keep the editorial column clean: the light only fades softly into it
      ctx.globalCompositeOperation = "destination-out";
      const fade = ctx.createLinearGradient(0, 0, 700, 0);
      fade.addColorStop(0, "rgba(0,0,0,0.96)");
      fade.addColorStop(0.5, "rgba(0,0,0,0.7)");
      fade.addColorStop(1, "rgba(0,0,0,0)");
      ctx.fillStyle = fade;
      ctx.fillRect(-400, -400, 1100, STAGE_H + 800);
      ctx.globalCompositeOperation = "source-over";
    };

    if (reduced) {
      draw();
      window.removeEventListener("pointermove", onPointer);
      return () => window.removeEventListener("resize", resize);
    }

    const stop = startFrameLoop(draw, canvas);
    return () => {
      stop();
      window.removeEventListener("pointermove", onPointer);
      window.removeEventListener("resize", resize);
    };
  }, [progress]);

  return <canvas ref={canvasRef} aria-hidden="true" className={className} />;
}
