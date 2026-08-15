import { useEffect, useRef } from "react";

import { prefersReducedMotion, startFrameLoop } from "@/lib/raf";

/**
 * Animated fiber-optic light layer for the hero.
 *
 * It is drawn in the master artwork's coordinate space (1536x1024) and mapped
 * with the same "cover" transform as the <img>, so the light always flows along
 * the same band as in the reference. The laptop silhouette is punched out of the
 * layer (destination-out) so the ribbons read as passing *behind* the device.
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

type Ribbon = {
  /** cubic control points in master space */
  p: [number, number][];
  /** per-point vertical wander */
  amp: number[];
  width: number;
  core: number;
  alpha: number;
  speed: number;
  phase: number;
  /** 0 = white core, 1 = deep blue */
  tint: number;
  depth: number;
};

const RIBBONS: Ribbon[] = [
  {
    p: [
      [-140, 806],
      [420, 742],
      [900, 470],
      [1660, 322],
    ],
    amp: [10, 26, 34, 18],
    width: 54,
    core: 5,
    alpha: 0.5,
    speed: 0.09,
    phase: 0,
    tint: 0.15,
    depth: 1,
  },
  {
    p: [
      [-160, 726],
      [430, 690],
      [980, 402],
      [1680, 250],
    ],
    amp: [14, 30, 26, 22],
    width: 30,
    core: 2.4,
    alpha: 0.42,
    speed: 0.13,
    phase: 1.7,
    tint: 0.55,
    depth: 0.72,
  },
  {
    p: [
      [-120, 862],
      [400, 812],
      [1010, 560],
      [1700, 430],
    ],
    amp: [8, 22, 30, 24],
    width: 18,
    core: 1.6,
    alpha: 0.32,
    speed: 0.17,
    phase: 3.1,
    tint: 0.8,
    depth: 0.5,
  },
  {
    p: [
      [640, 620],
      [960, 470],
      [1240, 330],
      [1700, 214],
    ],
    amp: [12, 20, 18, 14],
    width: 26,
    core: 2.2,
    alpha: 0.4,
    speed: 0.11,
    phase: 2.2,
    tint: 0.3,
    depth: 0.85,
  },
  {
    p: [
      [700, 700],
      [1040, 610],
      [1300, 520],
      [1720, 470],
    ],
    amp: [10, 18, 22, 16],
    width: 16,
    core: 1.4,
    alpha: 0.28,
    speed: 0.2,
    phase: 4.4,
    tint: 0.7,
    depth: 0.6,
  },
];

const rgb = (tint: number) => {
  // white-blue core -> ELEVATE blue
  const r = Math.round(255 - 150 * tint);
  const g = Math.round(252 - 132 * tint);
  return `${r}, ${g}, 255`;
};

const cubic = (
  ctx: CanvasRenderingContext2D,
  pts: [number, number][],
) => {
  ctx.beginPath();
  ctx.moveTo(pts[0]![0], pts[0]![1]);
  ctx.bezierCurveTo(pts[1]![0], pts[1]![1], pts[2]![0], pts[2]![1], pts[3]![0], pts[3]![1]);
};

const pointOn = (pts: [number, number][], t: number): [number, number] => {
  const u = 1 - t;
  const b0 = u * u * u;
  const b1 = 3 * u * u * t;
  const b2 = 3 * u * t * t;
  const b3 = t * t * t;
  return [
    b0 * pts[0]![0] + b1 * pts[1]![0] + b2 * pts[2]![0] + b3 * pts[3]![0],
    b0 * pts[0]![1] + b1 * pts[1]![1] + b2 * pts[2]![1] + b3 * pts[3]![1],
  ];
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
    const pointer = { x: 0, y: 0, tx: 0, ty: 0 };
    let scroll = 0;

    const resize = () => {
      const rect = canvas.getBoundingClientRect();
      vw = rect.width;
      vh = rect.height;
      dpr = Math.min(window.devicePixelRatio || 1, 1.6);
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

    const drawRibbon = (r: Ribbon, time: number, mirror: boolean) => {
      const px = pointer.x * 14 * r.depth;
      const py = pointer.y * 10 * r.depth;
      const pts = r.p.map((pt, i) => {
        const wob = Math.sin(time * r.speed * 2 * Math.PI + r.phase + i * 1.35);
        const wob2 = Math.cos(time * r.speed * 1.31 * Math.PI + r.phase * 1.7 + i);
        const y = pt[1] + wob * r.amp[i]! + wob2 * r.amp[i]! * 0.4 + py;
        return [pt[0] + wob2 * r.amp[i]! * 0.8 + px, mirror ? 1636 - y : y] as [number, number];
      });

      const color = rgb(r.tint);
      const a = mirror ? r.alpha * 0.16 : r.alpha;

      // bloom passes: wide + soft, then tight core
      const passes: [number, number][] = [
        [r.width * 2.6, 0.08],
        [r.width * 1.4, 0.16],
        [r.width * 0.7, 0.3],
        [r.core * 2.2, 0.55],
        [r.core, 1],
      ];
      ctx.lineCap = "round";
      for (const [w, k] of passes) {
        ctx.strokeStyle = `rgba(${color}, ${Math.min(1, a * k)})`;
        ctx.lineWidth = w;
        cubic(ctx, pts);
        ctx.stroke();
      }

      if (mirror) return;
      // travelling light packets along the fiber
      for (let i = 0; i < 3; i++) {
        const t = ((time * (0.05 + r.speed * 0.35) + i / 3 + r.phase * 0.11) % 1.15) - 0.075;
        if (t < 0 || t > 1) continue;
        const [x, y] = pointOn(pts, t);
        const fade = Math.sin(Math.min(1, Math.max(0, t)) * Math.PI);
        const rad = r.width * 0.9;
        const g = ctx.createRadialGradient(x, y, 0, x, y, rad);
        g.addColorStop(0, `rgba(235, 245, 255, ${0.5 * fade * r.alpha * 2})`);
        g.addColorStop(0.35, `rgba(${color}, ${0.18 * fade})`);
        g.addColorStop(1, "rgba(0,0,0,0)");
        ctx.fillStyle = g;
        ctx.beginPath();
        ctx.arc(x, y, rad, 0, Math.PI * 2);
        ctx.fill();
      }
    };

    const punchLaptop = () => {
      ctx.globalCompositeOperation = "destination-out";
      // levý sloupec s textem zůstává čistý — světlo se do něj jen měkce vytrácí
      const fade = ctx.createLinearGradient(0, 0, 720, 0);
      fade.addColorStop(0, "rgba(0,0,0,1)");
      fade.addColorStop(0.42, "rgba(0,0,0,0.86)");
      fade.addColorStop(1, "rgba(0,0,0,0)");
      ctx.fillStyle = fade;
      ctx.fillRect(-200, -200, 920, H + 400);
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

      ctx.setTransform(1, 0, 0, 1, 0, 0);
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // same "cover" mapping as the master <img>
      const scale = Math.max(vw / W, vh / H);
      const ox = (vw - W * scale) / 2;
      const oy = (vh - H * scale) / 2;
      ctx.setTransform(scale * dpr, 0, 0, scale * dpr, ox * dpr, oy * dpr - scroll * 90 * dpr);

      ctx.globalCompositeOperation = "lighter";
      // floor reflection first, very subtle
      ctx.save();
      ctx.beginPath();
      ctx.rect(-200, 828, W + 400, 260);
      ctx.clip();
      ctx.filter = "blur(9px)";
      for (const r of RIBBONS) drawRibbon(r, time, true);
      ctx.filter = "none";
      ctx.restore();

      for (const r of RIBBONS) drawRibbon(r, time, false);

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
