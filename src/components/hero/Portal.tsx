import type { RefObject } from "react";

/**
 * THE PORTAL — an ELEVATE-blue digital gateway that opens behind the display.
 *
 * Driven by two CSS variables written once per frame by the hero:
 *   --form  the field building up around / behind the screen (light first)
 *   --open  the gateway opening: rings expand, the aperture deepens, UI is pulled
 *
 * Depth is real: the well and the wide rings sit behind the device, the tight
 * aperture rim and the ejected fragments sit in front of it. Only opacity and
 * transform animate — the geometry is static, no canvas, no particle engine.
 */

/** concentric rings — radius, opacity, thickness, rotation, elliptical squash */
const RINGS = [
  { s: 0.44, o: 1, w: 1.5, rot: 24, ry: 0.93, blur: 0 },
  { s: 0.58, o: 0.78, w: 1, rot: -30, ry: 0.9, blur: 0 },
  { s: 0.74, o: 0.54, w: 1, rot: 16, ry: 0.86, blur: 0.4 },
  { s: 0.9, o: 0.36, w: 1, rot: -12, ry: 0.82, blur: 0.6 },
  { s: 1.08, o: 0.2, w: 1, rot: 8, ry: 0.78, blur: 1 },
];

/** thin light arcs / filaments crossing the gate */
const ARCS = [
  { s: 0.5, rot: 8, from: 200, span: 74, o: 0.9 },
  { s: 0.68, rot: -22, from: 20, span: 52, o: 0.62 },
  { s: 0.86, rot: 40, from: 140, span: 36, o: 0.44 },
  { s: 1.02, rot: -56, from: 300, span: 28, o: 0.3 },
];

/** UI fragments pulled through the glass — sizes vary, none is a plain square */
const FRAGMENTS = [
  { x: -46, y: -30, w: 13, h: 0.34, r: -12 },
  { x: 44, y: -22, w: 10, h: 0.7, r: 10 },
  { x: -40, y: 26, w: 9, h: 0.28, r: 8 },
  { x: 48, y: 20, w: 12, h: 0.6, r: -9 },
  { x: -30, y: -44, w: 8, h: 0.22, r: 7 },
  { x: 34, y: 40, w: 7, h: 0.9, r: -7 },
  { x: 58, y: -2, w: 6, h: 0.4, r: 5 },
  { x: -58, y: 4, w: 6, h: 0.5, r: -5 },
];

export function Portal({ rootRef }: { rootRef: RefObject<HTMLDivElement | null> }) {
  return (
    <div
      ref={rootRef}
      aria-hidden
      className="pointer-events-none absolute inset-0 overflow-hidden"
      style={{ ["--form" as string]: 0, ["--open" as string]: 0 }}
    >
      {/* 01 — the well: a deep blue volume the gate opens into (behind the device) */}
      <div
        className="absolute left-1/2 top-1/2 h-[78vh] w-[78vh] rounded-full"
        style={{
          opacity: "calc(var(--form) * 0.4 + var(--open) * 0.6)",
          transform:
            "translate3d(-50%, -50%, 0) scaleY(0.9) scale(calc(0.46 + var(--form) * 0.2 + var(--open) * 0.66))",
          background:
            "radial-gradient(circle, oklch(0.1 0.03 258 / 0.99) 0%, oklch(0.2 0.08 256 / 0.8) 26%, oklch(0.42 0.15 256 / 0.5) 48%, oklch(0.66 0.18 255 / 0.28) 68%, oklch(0.8 0.12 248 / 0.1) 80%, transparent 90%)",
          willChange: "opacity, transform",
        }}
      />

      {/* 02 — the aperture rim: a hard bright edge where the gate cuts the room */}
      <div
        className="absolute left-1/2 top-1/2 h-[62vh] w-[62vh] rounded-full"
        style={{
          opacity: "calc(var(--form) * 0.45 + var(--open) * 0.55)",
          transform: "translate3d(-50%, -50%, 0) scaleY(0.88) scale(calc(0.5 + var(--open) * 0.72))",
          background:
            "radial-gradient(closest-side, transparent 66%, oklch(0.94 0.06 240 / 0.7) 73%, oklch(0.66 0.18 255 / 0.24) 82%, transparent 93%)",
          filter: "blur(0.6px)",
          willChange: "opacity, transform",
        }}
      />

      {/* 03 — concentric rings, elliptical so the gate reads as a plane in space */}
      {RINGS.map((r, i) => (
        <div
          key={`ring-${i}`}
          className="absolute left-1/2 top-1/2 h-[62vh] w-[62vh] rounded-full"
          style={{
            opacity: `calc((var(--form) * 0.5 + var(--open) * 0.5) * ${r.o})`,
            transform: `translate3d(-50%, -50%, 0) scaleY(${r.ry}) scale(calc(${r.s} * (0.6 + var(--form) * 0.12 + var(--open) * 0.56))) rotate(calc(var(--open) * ${r.rot}deg))`,
            border: `${r.w}px solid oklch(0.84 0.12 248 / 0.55)`,
            boxShadow: `0 0 ${16 + i * 9}px oklch(0.66 0.18 255 / 0.26), inset 0 0 ${12 + i * 7}px oklch(0.66 0.18 255 / 0.16)`,
            filter: r.blur ? `blur(${r.blur}px)` : undefined,
            willChange: "opacity, transform",
          }}
        />
      ))}

      {/* 04 — the energy band: one conic sweep locked to the gate */}
      <div
        className="absolute left-1/2 top-1/2 h-[62vh] w-[62vh] rounded-full"
        style={{
          opacity: "calc(var(--form) * 0.85)",
          transform:
            "translate3d(-50%, -50%, 0) scaleY(0.88) scale(calc(0.66 + var(--form) * 0.14 + var(--open) * 0.62)) rotate(calc(var(--open) * 34deg))",
          background:
            "conic-gradient(from 210deg, transparent 0deg, oklch(0.7 0.17 255 / 0.7) 66deg, oklch(0.95 0.07 242 / 0.98) 126deg, oklch(0.6 0.18 258 / 0.5) 188deg, transparent 250deg)",
          maskImage: "radial-gradient(closest-side, transparent 71%, #000 80%, #000 93%, transparent 100%)",
          WebkitMaskImage: "radial-gradient(closest-side, transparent 71%, #000 80%, #000 93%, transparent 100%)",
          willChange: "opacity, transform",
        }}
      />

      {/* 05 — light filaments / arcs */}
      {ARCS.map((a, i) => (
        <div
          key={`arc-${i}`}
          className="absolute left-1/2 top-1/2 h-[62vh] w-[62vh] rounded-full"
          style={{
            opacity: `calc(var(--form) * ${a.o} * (0.35 + var(--open) * 0.65))`,
            transform: `translate3d(-50%, -50%, 0) scaleY(0.86) scale(calc(${a.s} * (0.64 + var(--open) * 0.58))) rotate(calc(${a.rot}deg + var(--open) * ${i % 2 ? -50 : 50}deg))`,
            background: `conic-gradient(from ${a.from}deg, transparent 0deg, oklch(0.97 0.05 238 / 0.92) ${a.span * 0.5}deg, transparent ${a.span}deg)`,
            maskImage: "radial-gradient(closest-side, transparent 89%, #000 96%, transparent 100%)",
            WebkitMaskImage: "radial-gradient(closest-side, transparent 89%, #000 96%, transparent 100%)",
            willChange: "opacity, transform",
          }}
        />
      ))}

      {/* 06 — UI fragments ejected from the centre, in front of the device */}
      <div className="absolute inset-0 z-30">
        {FRAGMENTS.map((f, i) => (
          <div
            key={`frag-${i}`}
            className="absolute left-1/2 top-1/2 overflow-hidden rounded-[4px]"
            style={{
              width: `${f.w}vh`,
              height: `${f.w * f.h}vh`,
              border: "1px solid oklch(0.8 0.12 248 / 0.5)",
              background:
                "linear-gradient(142deg, oklch(0.3 0.08 256 / 0.72), oklch(0.12 0.03 258 / 0.5) 70%)",
              boxShadow: "0 14px 30px oklch(0.02 0.01 258 / 0.6), 0 0 20px oklch(0.66 0.18 255 / 0.22)",
              opacity: `calc(var(--form) * (1 - var(--open) * 0.85))`,
              transform: `translate3d(calc(-50% + ${f.x}vh * (0.25 + var(--open) * 0.95)), calc(-50% + ${f.y}vh * (0.25 + var(--open) * 0.95)), 0) rotate(${f.r}deg) scale(calc(0.5 + var(--open) * 0.7))`,
              willChange: "opacity, transform",
            }}
          >
            <span
              className="absolute left-[10%] top-[22%] h-[6%] w-[52%] rounded-full"
              style={{ background: "oklch(0.86 0.1 246 / 0.55)" }}
            />
            <span
              className="absolute left-[10%] top-[48%] h-[5%] w-[34%] rounded-full"
              style={{ background: "oklch(0.7 0.08 250 / 0.35)" }}
            />
          </div>
        ))}
      </div>
    </div>
  );
}
