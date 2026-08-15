import type { RefObject } from "react";

/**
 * THE PORTAL — a controlled ELEVATE-blue energy field on the display plane.
 *
 * Two CSS variables drive everything: --form (the field building up around the
 * screen) and --open (the field opening and pulling everything through it).
 * Only opacity/transform are animated; the geometry itself is static.
 */
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
      {/* the ring: a single conic energy band around the display */}
      <div
        className="absolute left-1/2 top-1/2 h-[62vh] w-[62vh] rounded-full"
        style={{
          opacity: "calc(var(--form) * 0.9)",
          transform:
            "translate3d(-50%, -50%, 0) scale(calc(0.82 + var(--form) * 0.14 + var(--open) * 0.9)) rotate(calc(var(--open) * 28deg))",
          background:
            "conic-gradient(from 210deg, transparent 0deg, oklch(0.7 0.17 255 / 0.75) 70deg, oklch(0.86 0.1 245 / 0.95) 130deg, oklch(0.6 0.18 258 / 0.55) 190deg, transparent 250deg)",
          maskImage: "radial-gradient(closest-side, transparent 66%, #000 76%, #000 92%, transparent 100%)",
          WebkitMaskImage: "radial-gradient(closest-side, transparent 66%, #000 76%, #000 92%, transparent 100%)",
          filter: "blur(0.5px)",
          willChange: "opacity, transform",
        }}
      />
      {/* counter-rotating inner filament */}
      <div
        className="absolute left-1/2 top-1/2 h-[52vh] w-[52vh] rounded-full"
        style={{
          opacity: "calc(var(--form) * 0.6)",
          transform:
            "translate3d(-50%, -50%, 0) scale(calc(0.9 + var(--open) * 1.1)) rotate(calc(var(--open) * -40deg))",
          background:
            "conic-gradient(from 30deg, transparent 0deg, oklch(0.78 0.14 250 / 0.5) 60deg, transparent 150deg, oklch(0.7 0.16 255 / 0.35) 220deg, transparent 300deg)",
          maskImage: "radial-gradient(closest-side, transparent 78%, #000 88%, transparent 100%)",
          WebkitMaskImage: "radial-gradient(closest-side, transparent 78%, #000 88%, transparent 100%)",
          willChange: "opacity, transform",
        }}
      />

      {/* thin UI fragments drawn into the centre */}
      {FRAGMENTS.map((f, i) => (
        <div
          key={i}
          className="absolute left-1/2 top-1/2 rounded-[3px] border border-primary/40"
          style={{
            width: `${f.w}vh`,
            height: `${f.w * 0.62}vh`,
            background: "linear-gradient(140deg, oklch(0.65 0.18 255 / 0.16), transparent 70%)",
            boxShadow: "0 0 18px oklch(0.65 0.18 255 / 0.22)",
            opacity: `calc(var(--form) * (1 - var(--open)))`,
            transform: `translate3d(calc(-50% + ${f.x}vh * (1 - var(--open) * 0.86)), calc(-50% + ${f.y}vh * (1 - var(--open) * 0.86)), 0) rotate(${f.r}deg) scale(calc(1 - var(--open) * 0.55))`,
            willChange: "opacity, transform",
          }}
        />
      ))}
    </div>
  );
}
