import type { RefObject } from "react";

/**
 * THE PORTAL — an ELEVATE-blue digital gateway that opens behind the display.
 *
 * Everything is driven by two CSS variables written once per frame by the hero:
 *   --form  the field building up around / behind the screen (light first)
 *   --open  the gateway opening: rings expand, depth deepens, fragments are pulled
 *
 * Only opacity and transform are animated. The geometry is static, there is no
 * canvas, no particle engine and no per-element JS.
 */

/** concentric rings — different scale, opacity, thickness and rotation */
const RINGS = [
  { s: 0.52, o: 0.95, w: 1.4, rot: 26, blur: 0 },
  { s: 0.66, o: 0.7, w: 1, rot: -34, blur: 0 },
  { s: 0.82, o: 0.5, w: 1, rot: 18, blur: 0.4 },
  { s: 1.0, o: 0.3, w: 1, rot: -14, blur: 0.6 },
];

/** thin light arcs / filaments crossing the gate */
const ARCS = [
  { s: 0.58, rot: 8, from: 200, span: 76, o: 0.85 },
  { s: 0.74, rot: -22, from: 20, span: 54, o: 0.6 },
  { s: 0.92, rot: 40, from: 140, span: 38, o: 0.42 },
];

/** a handful of digital motes drawn into the gate (no particle spam) */
const MOTES = [
  { x: -34, y: -20, s: 1 },
  { x: 30, y: -30, s: 0.8 },
  { x: 40, y: 16, s: 1.1 },
  { x: -26, y: 30, s: 0.9 },
  { x: 8, y: -40, s: 0.7 },
  { x: -44, y: 6, s: 0.8 },
  { x: 20, y: 38, s: 0.7 },
];

/** UI fragments pulled through the glass */
const FRAGMENTS = [
  { x: -46, y: -30, w: 12, r: -14 },
  { x: 44, y: -22, w: 9, r: 12 },
  { x: -40, y: 26, w: 8, r: 10 },
  { x: 48, y: 20, w: 11, r: -10 },
  { x: -30, y: -44, w: 7, r: 8 },
  { x: 34, y: 40, w: 7, r: -8 },
  { x: 56, y: -2, w: 6, r: 6 },
  { x: -56, y: 4, w: 6, r: -6 },
];

export function Portal({ rootRef }: { rootRef: RefObject<HTMLDivElement | null> }) {
  return (
    <div
      ref={rootRef}
      aria-hidden
      className="pointer-events-none absolute inset-0 overflow-hidden"
      style={{ ["--form" as string]: 0, ["--open" as string]: 0 }}
    >
      {/* 01 — the depth: a deep blue radial well the gate opens into */}
      <div
        className="absolute left-1/2 top-1/2 h-[74vh] w-[74vh] rounded-full"
        style={{
          opacity: "calc(var(--form) * 0.35 + var(--open) * 0.65)",
          transform:
            "translate3d(-50%, -50%, 0) scale(calc(0.5 + var(--form) * 0.18 + var(--open) * 0.62))",
          background:
            "radial-gradient(circle, oklch(0.16 0.05 258 / 0.96) 0%, oklch(0.28 0.11 256 / 0.62) 38%, oklch(0.55 0.17 255 / 0.34) 62%, oklch(0.7 0.17 255 / 0.16) 78%, transparent 88%)",
          willChange: "opacity, transform",
        }}
      />

      {/* 02 — the horizon: a bright rim where the gate meets the room */}
      <div
        className="absolute left-1/2 top-1/2 h-[64vh] w-[64vh] rounded-full"
        style={{
          opacity: "calc(var(--form) * 0.5 + var(--open) * 0.5)",
          transform: "translate3d(-50%, -50%, 0) scale(calc(0.54 + var(--open) * 0.7))",
          background:
            "radial-gradient(closest-side, transparent 62%, oklch(0.86 0.1 246 / 0.55) 72%, oklch(0.62 0.18 256 / 0.2) 80%, transparent 92%)",
          filter: "blur(1px)",
          willChange: "opacity, transform",
        }}
      />

      {/* 03 — concentric rings */}
      {RINGS.map((r, i) => (
        <div
          key={`ring-${i}`}
          className="absolute left-1/2 top-1/2 h-[62vh] w-[62vh] rounded-full"
          style={{
            opacity: `calc((var(--form) * 0.45 + var(--open) * 0.55) * ${r.o})`,
            transform: `translate3d(-50%, -50%, 0) scale(calc(${r.s} * (0.62 + var(--form) * 0.1 + var(--open) * 0.52))) rotate(calc(var(--open) * ${r.rot}deg))`,
            border: `${r.w}px solid oklch(0.78 0.14 250 / 0.5)`,
            boxShadow: `0 0 ${18 + i * 10}px oklch(0.65 0.18 255 / 0.22), inset 0 0 ${14 + i * 8}px oklch(0.65 0.18 255 / 0.14)`,
            filter: r.blur ? `blur(${r.blur}px)` : undefined,
            willChange: "opacity, transform",
          }}
        />
      ))}

      {/* 04 — the energy band: one conic sweep locked to the gate */}
      <div
        className="absolute left-1/2 top-1/2 h-[62vh] w-[62vh] rounded-full"
        style={{
          opacity: "calc(var(--form) * 0.8)",
          transform:
            "translate3d(-50%, -50%, 0) scale(calc(0.7 + var(--form) * 0.12 + var(--open) * 0.62)) rotate(calc(var(--open) * 30deg))",
          background:
            "conic-gradient(from 210deg, transparent 0deg, oklch(0.7 0.17 255 / 0.7) 70deg, oklch(0.9 0.09 244 / 0.95) 128deg, oklch(0.6 0.18 258 / 0.5) 190deg, transparent 250deg)",
          maskImage: "radial-gradient(closest-side, transparent 70%, #000 79%, #000 93%, transparent 100%)",
          WebkitMaskImage: "radial-gradient(closest-side, transparent 70%, #000 79%, #000 93%, transparent 100%)",
          willChange: "opacity, transform",
        }}
      />

      {/* 05 — light filaments / arcs */}
      {ARCS.map((a, i) => (
        <div
          key={`arc-${i}`}
          className="absolute left-1/2 top-1/2 h-[62vh] w-[62vh] rounded-full"
          style={{
            opacity: `calc(var(--form) * ${a.o} * (0.4 + var(--open) * 0.6))`,
            transform: `translate3d(-50%, -50%, 0) scale(calc(${a.s} * (0.66 + var(--open) * 0.56))) rotate(calc(${a.rot}deg + var(--open) * ${i % 2 ? -46 : 46}deg))`,
            background: `conic-gradient(from ${a.from}deg, transparent 0deg, oklch(0.95 0.06 240 / 0.9) ${a.span * 0.5}deg, transparent ${a.span}deg)`,
            maskImage: "radial-gradient(closest-side, transparent 88%, #000 95%, transparent 100%)",
            WebkitMaskImage: "radial-gradient(closest-side, transparent 88%, #000 95%, transparent 100%)",
            willChange: "opacity, transform",
          }}
        />
      ))}

      {/* 06 — digital motes drawn inward */}
      {MOTES.map((m, i) => (
        <span
          key={`mote-${i}`}
          className="absolute left-1/2 top-1/2 rounded-full"
          style={{
            width: `${m.s * 4}px`,
            height: `${m.s * 4}px`,
            background: "oklch(0.95 0.06 242)",
            boxShadow: "0 0 10px oklch(0.75 0.15 250 / 0.9)",
            opacity: `calc(var(--form) * (1 - var(--open) * 0.9))`,
            transform: `translate3d(calc(-50% + ${m.x}vh * (1 - var(--open) * 0.92)), calc(-50% + ${m.y}vh * (1 - var(--open) * 0.92)), 0)`,
            willChange: "opacity, transform",
          }}
        />
      ))}

      {/* 07 — thin UI fragments pulled through the display */}
      {FRAGMENTS.map((f, i) => (
        <div
          key={`frag-${i}`}
          className="absolute left-1/2 top-1/2 rounded-[3px]"
          style={{
            width: `${f.w}vh`,
            height: `${f.w * 0.62}vh`,
            border: "1px solid oklch(0.7 0.16 252 / 0.45)",
            background: "linear-gradient(140deg, oklch(0.65 0.18 255 / 0.18), transparent 72%)",
            boxShadow: "0 0 18px oklch(0.65 0.18 255 / 0.2)",
            opacity: `calc(var(--form) * (1 - var(--open)))`,
            transform: `translate3d(calc(-50% + ${f.x}vh * (1 - var(--open) * 0.88)), calc(-50% + ${f.y}vh * (1 - var(--open) * 0.88)), 0) rotate(${f.r}deg) scale(calc(1 - var(--open) * 0.6))`,
            willChange: "opacity, transform",
          }}
        />
      ))}
    </div>
  );
}
