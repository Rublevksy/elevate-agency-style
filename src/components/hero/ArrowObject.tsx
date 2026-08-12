import { motion, type MotionValue } from "framer-motion";
import markAsset from "@/assets/elevate-mark-transparent.png.asset.json";

/**
 * The official ELEVATE mark treated as a premium 3D object:
 * depth extrusion (stacked copies), electric blue illumination,
 * edge lighting, a slow light sweep and an orbital system around it.
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
      className="relative aspect-square w-[min(66vw,440px)]"
      style={{ scale, perspective: 1600 }}
    >
      {/* Atmospheric core glow — ELEVATE blue */}
      <motion.div
        aria-hidden
        className="absolute inset-[14%] rounded-full blur-[90px]"
        animate={{ opacity: [0.45, 0.7, 0.45] }}
        transition={{ duration: 9, repeat: Infinity, ease: "easeInOut" }}
        style={{
          background:
            "radial-gradient(circle, oklch(0.72 0.17 240 / 0.6), oklch(0.55 0.2 250 / 0.25) 48%, transparent 72%)",
        }}
      />

      {/* Orbital system — behind the mark */}
      <Rings ringSpin={ringSpin} />

      {/* The real ELEVATE mark */}
      <motion.div
        className="absolute inset-0 grid place-items-center"
        style={{ rotateY, rotateX, transformStyle: "preserve-3d" }}
      >
        <motion.div
          className="relative h-[72%] w-[72%]"
          animate={{ y: [-8, 8, -8] }}
          transition={{ duration: 11, repeat: Infinity, ease: "easeInOut" }}
        >
          {/* depth extrusion copies */}
          {[9, 6, 3].map((d, i) => (
            <img
              key={d}
              aria-hidden
              src={markAsset.url}
              alt=""
              className="absolute inset-0 h-full w-full object-contain"
              style={{
                transform: `translate3d(${d * -0.5}px, ${d}px, ${-d}px)`,
                filter: `brightness(0.25) saturate(1.4) blur(${0.4 + i * 0.5}px)`,
                opacity: 0.34 - i * 0.08,
              }}
            />
          ))}

          {/* the mark itself — untouched geometry */}
          <img
            src={markAsset.url}
            alt="ELEVATE"
            className="relative h-full w-full object-contain"
            style={{
              filter:
                "drop-shadow(0 0 26px oklch(0.7 0.18 245 / 0.55)) drop-shadow(0 26px 70px oklch(0.55 0.2 250 / 0.5))",
            }}
          />

          {/* light sweep across the surface, masked to the mark */}
          <div
            aria-hidden
            className="pointer-events-none absolute inset-0 overflow-hidden"
            style={{
              WebkitMaskImage: `url(${markAsset.url})`,
              maskImage: `url(${markAsset.url})`,
              WebkitMaskSize: "contain",
              maskSize: "contain",
              WebkitMaskRepeat: "no-repeat",
              maskRepeat: "no-repeat",
              WebkitMaskPosition: "center",
              maskPosition: "center",
            }}
          >
            <motion.div
              className="absolute -inset-y-1/2 w-1/3"
              animate={{ x: ["-140%", "340%"] }}
              transition={{ duration: 7.5, repeat: Infinity, ease: "easeInOut", repeatDelay: 2.5 }}
              style={{
                background:
                  "linear-gradient(100deg, transparent, oklch(1 0 0 / 0.55), transparent)",
                filter: "blur(6px)",
              }}
            />
          </div>
        </motion.div>
      </motion.div>

      {/* Orbital arc passing in front */}
      <motion.div
        aria-hidden
        className="absolute inset-[-2%]"
        style={{ rotate: ringSpin }}
      >
        <svg viewBox="0 0 200 200" className="h-full w-full overflow-visible">
          <defs>
            <linearGradient id="orbitFront" x1="0" y1="0" x2="1" y2="0">
              <stop offset="0%" stopColor="oklch(0.85 0.14 240 / 0)" />
              <stop offset="50%" stopColor="oklch(0.85 0.14 240 / 0.55)" />
              <stop offset="100%" stopColor="oklch(0.85 0.14 240 / 0)" />
            </linearGradient>
          </defs>
          <g transform="rotate(-14 100 100)">
            <ellipse
              cx="100"
              cy="100"
              rx="80"
              ry="26"
              fill="none"
              stroke="url(#orbitFront)"
              strokeWidth="0.6"
            />
            <circle cx="180" cy="100" r="1.5" fill="oklch(0.92 0.11 240)" />
          </g>
        </svg>
      </motion.div>
    </motion.div>
  );
}

function Rings({ ringSpin }: { ringSpin: MotionValue<number> }) {
  return (
    <motion.div
      aria-hidden
      className="absolute inset-0"
      style={{ rotate: ringSpin, transformStyle: "preserve-3d" }}
    >
      {[
        { inset: "2%", rx: 76, ry: 20, tilt: -20 },
        { inset: "-6%", rx: 64, ry: 30, tilt: 24 },
        { inset: "16%", rx: 86, ry: 12, tilt: 6 },
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
              stroke={
                i === 1
                  ? "oklch(0.78 0.13 235 / 0.3)"
                  : "oklch(0.8 0.12 245 / 0.26)"
              }
              strokeWidth="0.5"
            />
            <circle
              cx={100 + r.rx}
              cy="100"
              r="1.3"
              fill="oklch(0.93 0.1 240)"
              opacity="0.9"
            />
          </svg>
        </div>
      ))}
    </motion.div>
  );
}
