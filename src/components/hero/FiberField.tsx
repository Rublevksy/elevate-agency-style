import { useEffect, useRef } from "react";

import { prefersReducedMotion, startFrameLoop } from "@/lib/raf";

/**
 * Living fiber-optic light layer for the hero.
 *
 * Every strand is re-sampled each frame along a parametric baseline and each
 * sample is displaced by a *travelling* wave — the phase depends on the sample's
 * position along the strand, not only on time — so the shape genuinely flows
 * left to right instead of the whole curve wobbling in sync.
 *
 * Drawn in the master artwork coordinate space (1536x1024) with the same
 * "cover" mapping as the <img>; the laptop silhouette is punched out
 * (destination-out) so the light reads as passing behind the device.
 */

const W = 1536;
const H = 1024;

/** Laptop silhouette in master coordinates, grown slightly so light never leaks onto the shell. */
const LAPTOP: [number, number][] = [
  [778, 280],
  [1288, 316],
  [1318, 356],
  [1312, 722],
  [1428, 780],
  [1426, 834],
  [694, 812],
  [586, 752],
  [690, 694],
];

type Strand = {
  /** baseline: start / end in master space (flows left-bottom -> right-top) */
  x0: number;
  y0: number;
  x1: number;
  y1: number;
  /** baseline bow (px, positive = bows up) */
  bow: number;
  /** primary travelling wave */
  amp: number;
  freq: number;
  speed: number;
  /** secondary slower swell */
  amp2: number;
  freq2: number;
  speed2: number;
  phase: number;
  /** stroke widths */
  width: number;
  core: number;
  alpha: number;
  /** 0 = white, 1 = deep ELEVATE blue */
  tint: number;
  depth: number;
  packets: number;
  samples: number;
};

const rand = (seed: number) => {
  const x = Math.sin(seed * 127.1 + 311.7) * 43758.5453;
  return x - Math.floor(x);
};

/** A deep bundle: a few dominant strands, each accompanied by close parallel siblings. */
const buildStrands = (): Strand[] => {
  const bundles = [
    { y0: 812, y1: 318, bow: 120, width: 52, core: 4.2, alpha: 0.5, tint: 0.12, amp: 46, siblings: 5 },
    { y0: 730, y1: 248, bow: 96, width: 30, core: 2.4, alpha: 0.42, tint: 0.5, amp: 38, siblings: 4 },
    { y0: 870, y1: 432, bow: 140, width: 20, core: 1.7, alpha: 0.32, tint: 0.78, amp: 34, siblings: 4 },
    { y0: 640, y1: 214, bow: 74, width: 24, core: 2.1, alpha: 0.36, tint: 0.28, amp: 30, siblings: 3 },
    { y0: 700, y1: 470, bow: 62, width: 15, core: 1.3, alpha: 0.26, tint: 0.68, amp: 26, siblings: 3 },
  ];

  const out: Strand[] = [];
  bundles.forEach((b, bi) => {
    for (let s = 0; s < b.siblings; s++) {
      const r1 = rand(bi * 7.3 + s * 1.9);
      const r2 = rand(bi * 3.1 + s * 5.7);
      const r3 = rand(bi * 11.7 + s * 2.3);
      const main = s === 0;
      const spread = (s - (b.siblings - 1) / 2) * (b.width * 0.55);
      out.push({
        x0: -220 - r1 * 160,
        y0: b.y0 + spread + (r2 - 0.5) * 22,
        x1: 1780 + r2 * 140,
        y1: b.y1 + spread * 0.7 + (r3 - 0.5) * 26,
        bow: b.bow * (0.8 + r1 * 0.5),
        amp: b.amp * (main ? 1 : 0.62 + r2 * 0.5),
        freq: 1.5 + r1 * 1.4,
        speed: 0.22 + r3 * 0.16 + bi * 0.02,
        amp2: b.amp * (0.5 + r3 * 0.4),
        freq2: 0.55 + r2 * 0.5,
        speed2: 0.07 + r1 * 0.06,
        phase: r1 * Math.PI * 2 + s * 0.7,
        width: main ? b.width : b.width * (0.35 + r2 * 0.35),
        core: main ? b.core : b.core * (0.4 + r3 * 0.4),
        alpha: main ? b.alpha : b.alpha * (0.3 + r2 * 0.35),
        tint: Math.min(1, Math.max(0, b.tint + (r3 - 0.5) * 0.35)),
        depth: main ? 1 : 0.5 + r1 * 0.4,
        packets: main ? 4 : r2 > 0.55 ? 2 : 0,
        samples: main ? 150 : 96,
      });
    }
  });
  return out;
};

const STRANDS = buildStrands();

const rgb = (tint: number) => {
  const r = Math.round(255 - 150 * tint);
  const g = Math.round(252 - 130 * tint);
  return `${r}, ${g}, 255`;
};

export function FiberField({ className }: { className?: string }) {
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
    let scroll = 0;

    const resize = () => {
      const rect = canvas.getBoundingClientRect();
      vw = rect.width;
      vh = rect.height;
      mobile = window.innerWidth < 820;
      dpr = Math.min(window.devicePixelRatio || 1, mobile ? 1.25 : 1.6);
      canvas.width = Math.max(1, Math.round(vw * dpr));
      canvas.height = Math.max(1, Math.round(vh * dpr));
    };
    resize();

    const onPointer = (e: PointerEvent) => {
      pointer.tx = (e.clientX / window.innerWidth - 0.5) * 2;
      pointer.ty = (e.clientY / window.innerHeight - 0.5) * 2;
    };
    const onScroll = () => {
      scroll = Math.min(1, window.scrollY / Math.max(1, window.innerHeight));
    };
    window.addEventListener("pointermove", onPointer, { passive: true });
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", resize);
    onScroll();

    /** reusable sample buffers — no allocation per frame */
    const bufX = new Float32Array(200);
    const bufY = new Float32Array(200);

    /**
     * Sample a strand into the buffers. Returns the sample count.
     * `drift` is the slow global atmosphere movement.
     */
    const sample = (s: Strand, time: number, drift: number, quality: number) => {
      const n = Math.max(48, Math.round(s.samples * quality));
      const dx = s.x1 - s.x0;
      const dy = s.y1 - s.y0;
      const len = Math.hypot(dx, dy) || 1;
      // unit normal of the baseline — displacement happens across the fiber
      const nx = -dy / len;
      const ny = dx / len;
      const px = pointer.x * 16 * s.depth;
      const py = pointer.y * 12 * s.depth;

      for (let i = 0; i <= n; i++) {
        const t = i / n;
        const bx = s.x0 + dx * t;
        const by = s.y0 + dy * t - Math.sin(t * Math.PI) * s.bow;
        // travelling wave: phase depends on position along the strand
        const w1 = Math.sin(t * Math.PI * 2 * s.freq - time * s.speed * Math.PI * 2 + s.phase);
        const w2 = Math.sin(t * Math.PI * 2 * s.freq2 - time * s.speed2 * Math.PI * 2 + s.phase * 1.7 + drift);
        const w3 = Math.sin(t * Math.PI * 2 * (s.freq * 2.3) - time * s.speed * Math.PI * 3.1 + s.phase * 0.6);
        // taper the displacement at both ends so strands enter/leave cleanly
        const env = Math.pow(Math.sin(Math.min(1, Math.max(0, t)) * Math.PI), 0.55);
        const off = (w1 * s.amp + w2 * s.amp2 + w3 * s.amp * 0.18) * env;
        bufX[i] = bx + nx * off + px;
        bufY[i] = by + ny * off + py + drift * 6 * s.depth;
      }
      return n;
    };

    /** smooth polyline through the samples using midpoint quadratics */
    const tracePath = (n: number) => {
      ctx.beginPath();
      ctx.moveTo(bufX[0]!, bufY[0]!);
      for (let i = 1; i < n; i++) {
        const mx = (bufX[i]! + bufX[i + 1]!) / 2;
        const my = (bufY[i]! + bufY[i + 1]!) / 2;
        ctx.quadraticCurveTo(bufX[i]!, bufY[i]!, mx, my);
      }
      ctx.lineTo(bufX[n]!, bufY[n]!);
    };

    const pointAt = (n: number, t: number): [number, number] => {
      const f = Math.min(n - 1e-3, Math.max(0, t * n));
      const i = Math.floor(f);
      const k = f - i;
      return [
        bufX[i]! + (bufX[i + 1]! - bufX[i]!) * k,
        bufY[i]! + (bufY[i + 1]! - bufY[i]!) * k,
      ];
    };

    const drawStrand = (s: Strand, time: number, drift: number, mirror: boolean) => {
      const quality = mirror || mobile ? 0.55 : 1;
      const n = sample(s, time, drift, quality);
      const color = rgb(s.tint);
      const a = mirror ? s.alpha * 0.14 : s.alpha;

      ctx.lineCap = "round";
      ctx.lineJoin = "round";
      const passes: [number, number][] = mirror
        ? [[s.width * 1.6, 0.2], [s.core * 2, 0.5]]
        : [
            [s.width * 3, 0.055],
            [s.width * 1.6, 0.12],
            [s.width * 0.8, 0.26],
            [s.core * 2.4, 0.5],
            [s.core, 1],
          ];
      tracePath(n);
      for (const [w, k] of passes) {
        ctx.strokeStyle = `rgba(${color}, ${Math.min(1, a * k)})`;
        ctx.lineWidth = w;
        ctx.stroke();
      }

      if (mirror || s.packets === 0) return;
      // light packets genuinely travelling along the spline, left -> right
      for (let i = 0; i < s.packets; i++) {
        const t = (time * (0.09 + s.speed * 0.28) + i / s.packets + s.phase * 0.13) % 1;
        const [x, y] = pointAt(n, t);
        const fade = Math.sin(t * Math.PI);
        const rad = Math.max(8, s.width * 0.85);
        const g = ctx.createRadialGradient(x, y, 0, x, y, rad);
        g.addColorStop(0, `rgba(240, 248, 255, ${Math.min(1, 0.8 * fade * s.alpha * 2)})`);
        g.addColorStop(0.3, `rgba(${color}, ${0.2 * fade})`);
        g.addColorStop(1, "rgba(0,0,0,0)");
        ctx.fillStyle = g;
        ctx.beginPath();
        ctx.arc(x, y, rad, 0, Math.PI * 2);
        ctx.fill();

        // short comet tail behind the packet
        const tail = Math.max(0, t - 0.035);
        const [tx, ty] = pointAt(n, tail);
        ctx.strokeStyle = `rgba(235, 245, 255, ${0.22 * fade * s.alpha * 2})`;
        ctx.lineWidth = Math.max(1, s.core * 1.4);
        ctx.beginPath();
        ctx.moveTo(tx, ty);
        ctx.lineTo(x, y);
        ctx.stroke();
      }
    };

    const punchLaptop = () => {
      ctx.globalCompositeOperation = "destination-out";
      // left text column stays clean — light only fades softly into it
      const fade = ctx.createLinearGradient(0, 0, 760, 0);
      fade.addColorStop(0, "rgba(0,0,0,1)");
      fade.addColorStop(0.44, "rgba(0,0,0,0.86)");
      fade.addColorStop(1, "rgba(0,0,0,0)");
      ctx.fillStyle = fade;
      ctx.fillRect(-260, -260, 1020, H + 520);
      ctx.filter = "blur(7px)";
      ctx.fillStyle = "rgba(0,0,0,1)";
      ctx.beginPath();
      ctx.moveTo(LAPTOP[0]![0], LAPTOP[0]![1]);
      for (let i = 1; i < LAPTOP.length; i++) ctx.lineTo(LAPTOP[i]![0], LAPTOP[i]![1]);
      ctx.closePath();
      ctx.fill();
      ctx.filter = "none";
      ctx.globalCompositeOperation = "source-over";
    };

    const start = performance.now();
    const draw = () => {
      const time = reduced ? 0 : (performance.now() - start) / 1000;
      pointer.x += (pointer.tx - pointer.x) * 0.045;
      pointer.y += (pointer.ty - pointer.y) * 0.045;
      // slow secondary atmosphere breathing
      const drift = Math.sin(time * 0.07) * 1.6;

      ctx.setTransform(1, 0, 0, 1, 0, 0);
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // same "cover" mapping as the master <img>
      const scale = Math.max(vw / W, vh / H);
      const ox = (vw - W * scale) / 2;
      const oy = (vh - H * scale) / 2;
      ctx.setTransform(scale * dpr, 0, 0, scale * dpr, ox * dpr, oy * dpr - scroll * 90 * dpr);

      ctx.globalCompositeOperation = "lighter";

      // living floor reflection, synced with the main waves
      if (!mobile) {
        ctx.save();
        ctx.beginPath();
        ctx.rect(-240, 828, W + 480, 250);
        ctx.clip();
        ctx.filter = "blur(10px)";
        ctx.translate(0, 1636);
        ctx.scale(1, -1);
        for (const s of STRANDS) if (s.depth > 0.75) drawStrand(s, time, drift, true);
        ctx.filter = "none";
        ctx.restore();
      }

      for (const s of STRANDS) drawStrand(s, time, drift, false);

      punchLaptop();
    };

    if (reduced) {
      draw();
      window.removeEventListener("pointermove", onPointer);
      return () => {
        window.removeEventListener("scroll", onScroll);
        window.removeEventListener("resize", resize);
      };
    }

    const stop = startFrameLoop(draw, canvas);
    return () => {
      stop();
      window.removeEventListener("pointermove", onPointer);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", resize);
    };
  }, []);

  return <canvas ref={canvasRef} aria-hidden="true" className={className} />;
}
