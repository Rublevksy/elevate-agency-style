import { motion, type MotionValue } from "framer-motion";

/**
 * ELEVATE arrow rendered as a metallic / holographic 3D object.
 * Shape follows the brand arrow (upward chevron + shaft, slight right lean).
 * Driven by scroll + pointer motion values from the hero scene.
 */
export function ArrowObject({
  scale,
  rotateY,
  rotateX,
  ringSpin,
}: {
  scale: MotionValue<number>;
  rotateY: MotionValue<number>;
  rotateX: MotionValue<number>;
  ringSpin: MotionValue<number>;
}) {
  return (
    <motion.div
      className="relative aspect-square w-[min(78vw,560px)]"
      style={{ scale, perspective: 1400 }}
    >
      {/* Atmospheric core glow */}
      <div
        aria-hidden
        className="absolute inset-[12%] rounded-full blur-[80px] opacity-70"
        style={{
          background:
            "radial-gradient(circle, oklch(0.65 0.19 262 / 0.55), oklch(0.5 0.22 292 / 0.28) 45%, transparent 70%)",
        }}
      />

      {/* Orbital rings */}
      <motion.div
        aria-hidden
        className="absolute inset-0"
        style={{ rotate: ringSpin, transformStyle: "preserve-3d" }}
      >
        {[
          { inset: "4%", rx: 74, ry: 22, tilt: -18 },
          { inset: "-4%", rx: 62, ry: 30, tilt: 26 },
          { inset: "14%", rx: 84, ry: 14, tilt: 8 },
        ].map((r, i) => (
          <div
            key={i}
            className="absolute"
            style={{
              inset: r.inset,
              transform: `rotateX(${r.tilt}deg)`,
              transformStyle: "preserve-3d",
            }}
          >
            <svg viewBox="0 0 200 200" className="h-full w-full overflow-visible">
              <ellipse
                cx="100"
                cy="100"
                rx={r.rx}
                ry={r.ry}
                fill="none"
                stroke={i === 1 ? "oklch(0.7 0.16 292 / 0.35)" : "oklch(0.75 0.14 255 / 0.3)"}
                strokeWidth="0.5"
              />
              <circle
                cx={100 + r.rx}
                cy="100"
                r="1.4"
                fill="oklch(0.9 0.12 255)"
                opacity="0.9"
              />
            </svg>
          </div>
        ))}
      </motion.div>

      {/* The arrow */}
      <motion.div
        className="absolute inset-0 grid place-items-center"
        style={{ rotateY, rotateX, transformStyle: "preserve-3d" }}
      >
        <svg
          viewBox="0 0 200 240"
          className="h-[74%] w-[74%] drop-shadow-[0_30px_80px_oklch(0.6_0.2_262/0.6)]"
          role="img"
          aria-label="ELEVATE"
        >
          <defs>
            <linearGradient id="arrowMetal" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="oklch(0.96 0.03 250)" />
              <stop offset="28%" stopColor="oklch(0.78 0.14 255)" />
              <stop offset="58%" stopColor="oklch(0.55 0.2 262)" />
              <stop offset="82%" stopColor="oklch(0.45 0.22 292)" />
              <stop offset="100%" stopColor="oklch(0.7 0.16 255)" />
            </linearGradient>
            <linearGradient id="arrowEdge" x1="0" y1="1" x2="1" y2="0">
              <stop offset="0%" stopColor="oklch(1 0 0 / 0)" />
              <stop offset="50%" stopColor="oklch(1 0 0 / 0.75)" />
              <stop offset="100%" stopColor="oklch(1 0 0 / 0)" />
            </linearGradient>
            <filter id="arrowSoft" x="-30%" y="-30%" width="160%" height="160%">
              <feGaussianBlur stdDeviation="1.1" />
            </filter>
          </defs>

          {/* depth copies for a solid 3D extrusion feel */}
          {[10, 7, 4].map((d, i) => (
            <g key={d} transform={`translate(${d * 0.6} ${d})`} opacity={0.16 - i * 0.03}>
              <path
                d="M96 226 L124 66 L140 66 L112 226 Z M64 226 L84 226 L112 60 L96 60 Z"
                fill="oklch(0.35 0.12 270)"
              />
            </g>
          ))}

          {/* shaft (two legs, slight right lean — brand geometry) */}
          <path
            d="M92 224 L118 70 L134 70 L108 224 Z"
            fill="url(#arrowMetal)"
          />
          <path
            d="M58 224 L78 224 L106 62 L90 62 Z"
            fill="url(#arrowMetal)"
            opacity="0.92"
          />
          {/* crossbar */}
          <rect x="76" y="168" width="52" height="7" rx="2" fill="url(#arrowMetal)" />
          {/* arrowhead */}
          <path
            d="M99 6 L152 66 L124 66 L124 92 L74 92 L74 66 L46 66 Z"
            fill="url(#arrowMetal)"
          />
          {/* specular edge */}
          <path
            d="M99 6 L152 66 L124 66 L124 92 L74 92 L74 66 L46 66 Z"
            fill="none"
            stroke="url(#arrowEdge)"
            strokeWidth="1.2"
            filter="url(#arrowSoft)"
          />
        </svg>
      </motion.div>

      {/* Light beam rising through the arrow */}
      <div
        aria-hidden
        className="absolute left-1/2 top-0 h-full w-[2px] -translate-x-1/2 opacity-60"
        style={{
          background:
            "linear-gradient(to bottom, transparent, oklch(0.9 0.12 255 / 0.7), transparent)",
        }}
      />
    </motion.div>
  );
}
