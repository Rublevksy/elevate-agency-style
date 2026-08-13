import { useEffect, useRef, type RefObject } from "react";

/**
 * ELEVATE atmosphere — a restrained, depth-layered light field.
 *
 * Three parallax layers of drifting light points with short-range hairline
 * links, plus a slow-moving cool glow. Deliberately low-contrast: it is the air
 * in the room, never a particle demo. Mouse influence is a gentle bend, not an
 * explosion. Density and DPR are capped, work pauses offscreen, and the whole
 * thing can be dimmed from the outside via `intensityRef` so the cinematic
 * timeline can breathe with it.
 */
type Props = {
  className?: string;
  /** 0 → 1 multiplier applied every frame (scroll-driven). Defaults to 1. */
  intensityRef?: RefObject<number>;
  /** overall strength ceiling */
  strength?: number;
};

type Dot = { x: number; y: number; vx: number; vy: number; r: number; a: number; layer: number };

/**
 * A distant interface fragment: a hairline rectangle with one or two internal
 * rules, drifting in far depth. It reads as a piece of a UI dissolving into the
 * dark — the cue that this is a digital space, not outer space.
 */
type Fragment = {
  x: number;
  y: number;
  w: number;
  h: number;
  vx: number;
  vy: number;
  a: number;
  depth: number;
};

/**
 * A flowing light structure: a long, extremely thin curve that drifts through
 * the scene, brightest in its middle and dissolving into darkness at both ends.
 * Data stream, never lightning.
 */
type Stream = {
  /** normalised control points */
  p: { x: number; y: number }[];
  depth: number;
  speed: number;
  phase: number;
  alpha: number;
  width: number;
};

const LAYERS = [
  { depth: 0.28, size: 0.5, alpha: 0.16, link: 0 }, // far dust — no links
  { depth: 0.62, size: 0.9, alpha: 0.3, link: 96 }, // mid field
  { depth: 1, size: 1.35, alpha: 0.42, link: 128 }, // near flow
];


export function AetherField({ className = "", intensityRef, strength = 1 }: Props) {
  const ref = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const dpr = Math.min(window.devicePixelRatio || 1, 1.5);
    const mobile = window.innerWidth < 768;

    let w = 0;
    let h = 0;
    let raf = 0;
    let visible = true;
    let t = 0;

    const perLayer = mobile ? [14, 12, 10] : [34, 26, 20];
    const mouse = { x: -9999, y: -9999, tx: -9999, ty: -9999, r: mobile ? 110 : 190 };

    let dots: Dot[] = [];
    let streams: Stream[] = [];
    let fragments: Fragment[] = [];

    const seed = () => {
      dots = [];
      LAYERS.forEach((L, li) => {
        for (let i = 0; i < (perLayer[li] ?? 0); i++) {
          dots.push({
            x: Math.random() * w,
            y: Math.random() * h,
            vx: (Math.random() - 0.5) * 0.1 * L.depth,
            vy: (Math.random() - 0.5) * 0.08 * L.depth,
            r: L.size * (0.7 + Math.random() * 0.7),
            a: L.alpha * (0.5 + Math.random() * 0.6),
            layer: li,
          });
        }
      });

      // long, thin light paths — a handful only; they are architecture, not FX
      const count = mobile ? 3 : 6;
      streams = [];
      for (let i = 0; i < count; i++) {
        const depth = 0.25 + (i / count) * 0.75;
        const y0 = 0.12 + Math.random() * 0.76;
        streams.push({
          p: [
            { x: -0.18, y: y0 },
            { x: 0.2 + Math.random() * 0.2, y: y0 + (Math.random() - 0.5) * 0.4 },
            { x: 0.55 + Math.random() * 0.15, y: y0 + (Math.random() - 0.5) * 0.5 },
            { x: 1.18, y: 0.12 + Math.random() * 0.76 },
          ],
          depth,
          speed: 0.06 + depth * 0.16,
          phase: Math.random(),
          alpha: (0.05 + depth * 0.11) * (0.7 + Math.random() * 0.5),
          width: 0.4 + depth * 0.7,
        });
      }
    };


    const seedFragments = () => {
      const count = mobile ? 3 : 7;
      fragments = [];
      for (let i = 0; i < count; i++) {
        const depth = 0.2 + Math.random() * 0.5;
        const fw = (mobile ? 70 : 110) * (0.7 + depth);
        fragments.push({
          x: Math.random() * w,
          y: Math.random() * h,
          w: fw,
          h: fw * (0.5 + Math.random() * 0.22),
          vx: (Math.random() - 0.5) * 0.055 * depth,
          vy: (Math.random() - 0.5) * 0.035 * depth,
          a: 0.05 + depth * 0.06,
          depth,
        });
      }
    };

    const resize = () => {
      const rect = canvas.getBoundingClientRect();
      w = Math.max(1, rect.width);
      h = Math.max(1, rect.height);
      canvas.width = Math.floor(w * dpr);
      canvas.height = Math.floor(h * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      seed();
      seedFragments();
    };
    resize();

    const draw = () => {
      const k = Math.max(0, Math.min(1, intensityRef?.current ?? 1)) * strength;
      t += 0.0035;

      ctx.clearRect(0, 0, w, h);

      if (k > 0.01) {
        // Layer 2 — slow atmospheric light movement
        const gx = w * (0.5 + Math.sin(t * 0.7) * 0.16);
        const gy = h * (0.42 + Math.cos(t * 0.5) * 0.12);
        const glow = ctx.createRadialGradient(gx, gy, 0, gx, gy, Math.max(w, h) * 0.62);
        glow.addColorStop(0, `rgba(96,140,205,${0.05 * k})`);
        glow.addColorStop(0.45, `rgba(40,66,104,${0.026 * k})`);
        glow.addColorStop(1, "rgba(0,0,0,0)");
        ctx.fillStyle = glow;
        ctx.fillRect(0, 0, w, h);

        // Layer 1b — far interface fragments: hairline UI rectangles that drift
        // in deep space and dissolve into the dark
        for (const f of fragments) {
          if (!reduced) {
            f.x += f.vx;
            f.y += f.vy;
            if (f.x < -f.w) f.x = w + f.w;
            if (f.x > w + f.w) f.x = -f.w;
            if (f.y < -f.h) f.y = h + f.h;
            if (f.y > h + f.h) f.y = -f.h;
          }
          const o = f.a * k;
          if (o < 0.004) continue;
          ctx.lineWidth = 0.6;
          ctx.strokeStyle = `rgba(126,166,220,${o})`;
          ctx.strokeRect(f.x, f.y, f.w, f.h);
          ctx.fillStyle = `rgba(120,158,212,${o * 0.5})`;
          ctx.fillRect(f.x + f.w * 0.08, f.y + f.h * 0.16, f.w * 0.42, 1);
          ctx.fillRect(f.x + f.w * 0.08, f.y + f.h * 0.3, f.w * 0.24, 1);
          ctx.fillRect(f.x + f.w * 0.08, f.y + f.h * 0.72, f.w * 0.55, 1);
        }

        // Layer 2b — flowing light structures: thin curves that carry a slow
        // travelling brightness and dissolve into darkness at both ends
        const mx = mouse.x > -9000 ? (mouse.x / w - 0.5) : 0;
        const my = mouse.y > -9000 ? (mouse.y / h - 0.5) : 0;
        ctx.lineCap = "round";
        for (const s of streams) {
          const bendX = mx * 26 * s.depth;
          const bendY = my * 18 * s.depth;
          const sway = reduced ? 0 : Math.sin(t * (0.5 + s.depth) + s.phase * 7) * 0.028;
          const pts: { x: number; y: number }[] = [];
          const N = 26;
          for (let i = 0; i <= N; i++) {
            const u = i / N;
            const iu = 1 - u;
            const b0 = iu * iu * iu;
            const b1 = 3 * iu * iu * u;
            const b2 = 3 * iu * u * u;
            const b3 = u * u * u;
            const nx = s.p[0]!.x * b0 + s.p[1]!.x * b1 + s.p[2]!.x * b2 + s.p[3]!.x * b3;
            const ny =
              s.p[0]!.y * b0 + s.p[1]!.y * b1 + s.p[2]!.y * b2 + s.p[3]!.y * b3 +
              sway * Math.sin(u * Math.PI * 1.6 + s.phase * 6);
            pts.push({ x: nx * w + bendX, y: ny * h + bendY });
          }
          // travelling head position along the curve
          const head = ((t * s.speed + s.phase) % 1.35) - 0.175;
          ctx.lineWidth = s.width;
          for (let i = 0; i < N; i++) {
            const u = (i + 0.5) / N;
            // body: brightest mid-curve, fading to nothing at both extremes
            const body = Math.sin(u * Math.PI) ** 1.6;
            // pulse: a soft light that travels the path
            const dh = Math.abs(u - head);
            const pulse = dh < 0.16 ? (1 - dh / 0.16) ** 2 * 1.5 : 0;
            const o = s.alpha * k * body * (0.55 + pulse);
            if (o < 0.004) continue;
            ctx.strokeStyle = `rgba(${150 + pulse * 70},${185 + pulse * 50},${225 + pulse * 25},${Math.min(0.3, o)})`;
            ctx.beginPath();
            ctx.moveTo(pts[i]!.x, pts[i]!.y);
            ctx.lineTo(pts[i + 1]!.x, pts[i + 1]!.y);
            ctx.stroke();
          }
        }



        // ease mouse — the field follows lazily
        if (mouse.tx > -9000) {
          mouse.x = mouse.x < -9000 ? mouse.tx : mouse.x + (mouse.tx - mouse.x) * 0.05;
          mouse.y = mouse.y < -9000 ? mouse.ty : mouse.y + (mouse.ty - mouse.y) * 0.05;
        }

        // Layers 3 & 4 — flowing points with parallax
        for (const d of dots) {
          const L = LAYERS[d.layer]!;
          if (!reduced) {
            d.x += d.vx + Math.sin(t * 1.4 + d.y * 0.006) * 0.06 * L.depth;
            d.y += d.vy + Math.cos(t * 1.1 + d.x * 0.005) * 0.04 * L.depth;
            if (d.x < -20) d.x = w + 20;
            if (d.x > w + 20) d.x = -20;
            if (d.y < -20) d.y = h + 20;
            if (d.y > h + 20) d.y = -20;

            const dx = mouse.x - d.x;
            const dy = mouse.y - d.y;
            const dist = Math.hypot(dx, dy);
            if (dist < mouse.r && dist > 0.001) {
              const f = ((mouse.r - dist) / mouse.r) * L.depth;
              d.x -= (dx / dist) * f * 0.5;
              d.y -= (dy / dist) * f * 0.5;
            }
          }

          const near = Math.hypot(mouse.x - d.x, mouse.y - d.y);
          const lift = near < mouse.r ? 1 + (1 - near / mouse.r) * 0.7 : 1;
          ctx.beginPath();
          ctx.arc(d.x, d.y, d.r, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(176,204,240,${Math.min(0.5, d.a * lift * k)})`;
          ctx.fill();
        }

        // hairline links — only within the two nearer layers, short range
        ctx.lineWidth = 0.5;
        for (let a = 0; a < dots.length; a++) {
          const p = dots[a]!;
          const link = LAYERS[p.layer]!.link;
          if (!link) continue;
          for (let b = a + 1; b < dots.length; b++) {
            const q = dots[b]!;
            if (q.layer !== p.layer) continue;
            const dist = Math.hypot(p.x - q.x, p.y - q.y);
            if (dist < link) {
              const o = (1 - dist / link) * 0.075 * k;
              ctx.strokeStyle = `rgba(120,160,215,${o})`;
              ctx.beginPath();
              ctx.moveTo(p.x, p.y);
              ctx.lineTo(q.x, q.y);
              ctx.stroke();
            }
          }
        }
      }

        // depth fog — the edges of the world fall away into darkness so the
        // centre (and the device) always stays the brightest thing on screen
        const fog = ctx.createRadialGradient(w * 0.5, h * 0.46, Math.min(w, h) * 0.22, w * 0.5, h * 0.5, Math.max(w, h) * 0.78);
        fog.addColorStop(0, "rgba(5,7,11,0)");
        fog.addColorStop(1, `rgba(5,7,11,${0.72 * Math.max(0.4, k)})`);
        ctx.fillStyle = fog;
        ctx.fillRect(0, 0, w, h);
      }

      if (visible) raf = requestAnimationFrame(draw);
    };
    raf = requestAnimationFrame(draw);

    const onMove = (e: PointerEvent) => {
      const rect = canvas.getBoundingClientRect();
      mouse.tx = e.clientX - rect.left;
      mouse.ty = e.clientY - rect.top;
    };
    const onLeave = () => {
      mouse.tx = -9999;
      mouse.ty = -9999;
      mouse.x = -9999;
      mouse.y = -9999;
    };

    const io = new IntersectionObserver(
      ([entry]) => {
        const next = !!entry?.isIntersecting;
        if (next === visible) return;
        visible = next;
        cancelAnimationFrame(raf);
        if (visible) raf = requestAnimationFrame(draw);
      },
      { threshold: 0 },
    );
    io.observe(canvas);
    window.addEventListener("resize", resize);
    window.addEventListener("pointermove", onMove, { passive: true });
    window.addEventListener("pointerleave", onLeave);

    return () => {
      cancelAnimationFrame(raf);
      io.disconnect();
      window.removeEventListener("resize", resize);
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerleave", onLeave);
    };
  }, [intensityRef, strength]);

  return <canvas ref={ref} aria-hidden className={className} />;
}
