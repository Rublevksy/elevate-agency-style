/**
 * ONE source of truth for the hero light-stream geometry.
 *
 * The hero light is a handful of BROAD organic ribbons (not a bundle of thin
 * lines): each ribbon is a centreline re-sampled every frame, where the wave
 * phase depends on the position along the ribbon, so the shape genuinely
 * travels left → right instead of the whole curve wobbling in sync.
 *
 * Both the main light layer and the glossy floor reflection sample the exact
 * same functions, so the reflection can never drift out of sync.
 */

/** Virtual stage size — the whole scene is composed in this space and "cover" mapped. */
export const STAGE_W = 1536;
export const STAGE_H = 1024;

export type Ribbon = {
  x0: number;
  y0: number;
  x1: number;
  y1: number;
  /** baseline bow in stage px (positive bows upward) */
  bow: number;
  /** cross-section width of the stream */
  width: number;
  /** primary travelling wave */
  amp: number;
  freq: number;
  speed: number;
  /** slower swell */
  amp2: number;
  freq2: number;
  speed2: number;
  phase: number;
  /** base brightness (kept low — the scene is luxurious and dark) */
  alpha: number;
  /** 0 = white, 1 = deep ELEVATE blue */
  tint: number;
  /** parallax depth, 1 = closest */
  depth: number;
  /** inner fine filaments inside the stream */
  fibers: number;
  /** decent travelling highlights */
  packets: number;
  samples: number;
};

export const RIBBONS: Ribbon[] = [
  {
    x0: -320, y0: 905, x1: 1880, y1: 288,
    bow: 168, width: 300, amp: 60, freq: 1.15, speed: 0.13,
    amp2: 40, freq2: 0.5, speed2: 0.05, phase: 0.4,
    alpha: 0.15, tint: 0.16, depth: 1, fibers: 4, packets: 3, samples: 168,
  },
  {
    x0: -280, y0: 782, x1: 1840, y1: 232,
    bow: 128, width: 208, amp: 52, freq: 1.5, speed: 0.17,
    amp2: 34, freq2: 0.62, speed2: 0.06, phase: 2.1,
    alpha: 0.13, tint: 0.44, depth: 0.86, fibers: 3, packets: 2, samples: 152,
  },
  {
    x0: -360, y0: 968, x1: 1900, y1: 452,
    bow: 196, width: 156, amp: 46, freq: 0.95, speed: 0.1,
    amp2: 30, freq2: 0.42, speed2: 0.04, phase: 4.3,
    alpha: 0.1, tint: 0.72, depth: 0.68, fibers: 3, packets: 2, samples: 140,
  },
  {
    x0: -240, y0: 690, x1: 1820, y1: 196,
    bow: 96, width: 118, amp: 38, freq: 1.85, speed: 0.21,
    amp2: 26, freq2: 0.74, speed2: 0.07, phase: 5.5,
    alpha: 0.085, tint: 0.3, depth: 0.55, fibers: 2, packets: 1, samples: 128,
  },
  {
    x0: -300, y0: 852, x1: 1860, y1: 556,
    bow: 74, width: 92, amp: 30, freq: 2.3, speed: 0.26,
    amp2: 20, freq2: 0.9, speed2: 0.09, phase: 1.2,
    alpha: 0.07, tint: 0.62, depth: 0.44, fibers: 2, packets: 1, samples: 112,
  },
];

export const rgbFor = (tint: number) => {
  const r = Math.round(255 - 155 * tint);
  const g = Math.round(251 - 128 * tint);
  return `${r}, ${g}, 255`;
};

/**
 * Sample a ribbon centreline into caller-owned buffers.
 * `offset` shifts the centreline across the ribbon (used for inner filaments).
 */
export function sampleRibbon(
  r: Ribbon,
  time: number,
  drift: number,
  quality: number,
  bufX: Float32Array,
  bufY: Float32Array,
  offset = 0,
  px = 0,
  py = 0,
) {
  const n = Math.max(40, Math.min(bufX.length - 2, Math.round(r.samples * quality)));
  const dx = r.x1 - r.x0;
  const dy = r.y1 - r.y0;
  const len = Math.hypot(dx, dy) || 1;
  const nx = -dy / len;
  const ny = dx / len;

  for (let i = 0; i <= n; i++) {
    const t = i / n;
    const bx = r.x0 + dx * t;
    const by = r.y0 + dy * t - Math.sin(t * Math.PI) * r.bow;
    // travelling waves: phase advances along the ribbon
    const w1 = Math.sin(t * Math.PI * 2 * r.freq - time * r.speed * Math.PI * 2 + r.phase);
    const w2 = Math.sin(t * Math.PI * 2 * r.freq2 - time * r.speed2 * Math.PI * 2 + r.phase * 1.7 + drift);
    const w3 = Math.sin(t * Math.PI * 2 * r.freq * 2.7 - time * r.speed * Math.PI * 3.3 + r.phase * 0.6);
    const env = Math.pow(Math.sin(Math.max(0, Math.min(1, t)) * Math.PI), 0.5);
    const off = (w1 * r.amp + w2 * r.amp2 + w3 * r.amp * 0.16) * env + offset;
    bufX[i] = bx + nx * off + px * r.depth;
    bufY[i] = by + ny * off + py * r.depth + drift * 5 * r.depth;
  }
  return n;
}

/** Cross-section width along the ribbon — the stream breathes instead of being a tube. */
export function widthAt(r: Ribbon, t: number, time: number) {
  const b = 0.72 + 0.34 * Math.sin(t * Math.PI * 2 * 0.8 - time * r.speed * Math.PI * 1.6 + r.phase);
  return r.width * Math.max(0.28, b) * Math.pow(Math.sin(Math.max(0.001, Math.min(0.999, t)) * Math.PI), 0.35);
}

/** Smooth polyline through samples using midpoint quadratics. */
export function tracePath(ctx: CanvasRenderingContext2D, bufX: Float32Array, bufY: Float32Array, n: number) {
  ctx.beginPath();
  ctx.moveTo(bufX[0]!, bufY[0]!);
  for (let i = 1; i < n; i++) {
    const mx = (bufX[i]! + bufX[i + 1]!) / 2;
    const my = (bufY[i]! + bufY[i + 1]!) / 2;
    ctx.quadraticCurveTo(bufX[i]!, bufY[i]!, mx, my);
  }
  ctx.lineTo(bufX[n]!, bufY[n]!);
}

export function pointAt(bufX: Float32Array, bufY: Float32Array, n: number, t: number): [number, number] {
  const f = Math.min(n - 1e-3, Math.max(0, t * n));
  const i = Math.floor(f);
  const k = f - i;
  return [bufX[i]! + (bufX[i + 1]! - bufX[i]!) * k, bufY[i]! + (bufY[i + 1]! - bufY[i]!) * k];
}
