import {
  pointAt,
  rgbFor,
  sampleRibbon,
  tracePath,
  widthAt,
  type Ribbon,
} from "@/lib/hero-waves";

/**
 * Painting routine for ONE broad light stream.
 *
 * Layered cross-section, from the outside in:
 *   1. very wide, very faint atmospheric bloom
 *   2. mid halo
 *   3. the body of the stream (width breathes along its length)
 *   4. a few fine filaments travelling *inside* the stream
 *   5. a sharp white-blue core, present only on parts of the ribbon
 *   6. decent travelling highlights (light packets) with a short tail
 */

const bufX = new Float32Array(224);
const bufY = new Float32Array(224);

export type StreamOpts = {
  quality: number;
  alpha: number;
  pointerX: number;
  pointerY: number;
  /** floor reflection: no core / packets, wider and softer */
  reflection?: boolean;
};

export function drawStream(
  ctx: CanvasRenderingContext2D,
  r: Ribbon,
  time: number,
  drift: number,
  o: StreamOpts,
) {
  const color = rgbFor(r.tint);
  const a = r.alpha * o.alpha;
  ctx.lineCap = "round";
  ctx.lineJoin = "round";

  const n = sampleRibbon(r, time, drift, o.quality, bufX, bufY, 0, o.pointerX, o.pointerY);

  // 1–3 — bloom, halo, body. Wide soft passes read as a physical volume of light.
  const passes: [number, number][] = o.reflection
    ? [
        [3.2, 0.05],
        [1.7, 0.09],
        [0.9, 0.14],
      ]
    : [
        [3.4, 0.045],
        [2.1, 0.075],
        [1.25, 0.11],
        [0.7, 0.17],
      ];
  tracePath(ctx, bufX, bufY, n);
  for (const [k, alpha] of passes) {
    ctx.strokeStyle = `rgba(${color}, ${Math.min(1, a * alpha)})`;
    ctx.lineWidth = r.width * k;
    ctx.stroke();
  }

  // body with a breathing cross-section — drawn per segment so the width varies
  for (let i = 0; i < n; i++) {
    const t = i / n;
    ctx.beginPath();
    ctx.moveTo(bufX[i]!, bufY[i]!);
    ctx.lineTo(bufX[i + 1]!, bufY[i + 1]!);
    ctx.lineWidth = widthAt(r, t, time) * (o.reflection ? 0.9 : 0.55);
    ctx.strokeStyle = `rgba(${color}, ${a * (o.reflection ? 0.16 : 0.2)})`;
    ctx.stroke();
  }

  // 4 — fine filaments inside the stream
  for (let f = 0; f < r.fibers; f++) {
    const spread = ((f + 0.5) / r.fibers - 0.5) * r.width * 0.62;
    const wobble = Math.sin(time * (0.16 + f * 0.05) + f * 2.1 + r.phase) * r.width * 0.1;
    const m = sampleRibbon(r, time * (1 + f * 0.05), drift, o.quality * 0.8, bufX, bufY, spread + wobble, o.pointerX, o.pointerY);
    tracePath(ctx, bufX, bufY, m);
    ctx.lineWidth = Math.max(1, r.width * 0.045);
    ctx.strokeStyle = `rgba(${color}, ${a * (o.reflection ? 0.3 : 0.55)})`;
    ctx.stroke();
    ctx.lineWidth = Math.max(0.6, r.width * 0.016);
    ctx.strokeStyle = `rgba(238, 246, 255, ${a * (o.reflection ? 0.25 : 0.7)})`;
    ctx.stroke();
  }

  if (o.reflection) return;

  // 5 — sharp core, only where a slow travelling window opens it up
  const m = sampleRibbon(r, time, drift, o.quality, bufX, bufY, 0, o.pointerX, o.pointerY);
  for (let i = 0; i < m; i++) {
    const t = i / m;
    const win = Math.sin(t * Math.PI * 1.6 - time * 0.22 + r.phase);
    const k = Math.pow(Math.max(0, win), 5) * Math.pow(Math.sin(t * Math.PI), 0.6);
    if (k < 0.02) continue;
    ctx.beginPath();
    ctx.moveTo(bufX[i]!, bufY[i]!);
    ctx.lineTo(bufX[i + 1]!, bufY[i + 1]!);
    ctx.lineWidth = Math.max(1.1, r.width * 0.02);
    ctx.strokeStyle = `rgba(244, 250, 255, ${Math.min(0.95, a * 4.2 * k)})`;
    ctx.stroke();
    ctx.lineWidth = Math.max(3, r.width * 0.07);
    ctx.strokeStyle = `rgba(${color}, ${Math.min(0.5, a * 1.5 * k)})`;
    ctx.stroke();
  }

  // 6 — decent travelling highlights
  for (let i = 0; i < r.packets; i++) {
    const t = (time * (0.05 + r.speed * 0.2) + i / Math.max(1, r.packets) + r.phase * 0.11) % 1;
    const [x, y] = pointAt(bufX, bufY, m, t);
    const fade = Math.pow(Math.sin(t * Math.PI), 1.4);
    const rad = Math.max(14, r.width * 0.42);
    const g = ctx.createRadialGradient(x, y, 0, x, y, rad);
    g.addColorStop(0, `rgba(246, 251, 255, ${Math.min(0.6, 2.4 * a * fade)})`);
    g.addColorStop(0.34, `rgba(${color}, ${1.1 * a * fade})`);
    g.addColorStop(1, "rgba(0,0,0,0)");
    ctx.fillStyle = g;
    ctx.beginPath();
    ctx.arc(x, y, rad, 0, Math.PI * 2);
    ctx.fill();

    const [tx, ty] = pointAt(bufX, bufY, m, Math.max(0, t - 0.05));
    ctx.strokeStyle = `rgba(236, 245, 255, ${Math.min(0.35, 1.4 * a * fade)})`;
    ctx.lineWidth = Math.max(1, r.width * 0.02);
    ctx.beginPath();
    ctx.moveTo(tx, ty);
    ctx.lineTo(x, y);
    ctx.stroke();
  }
}
