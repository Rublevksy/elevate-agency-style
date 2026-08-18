import { motion } from "framer-motion";
import type { HeroSceneStyle } from "./useHeroScroll";
import type { ScreenFrame } from "./DeviceHero";

interface DeviceShellProps {
  scene: HeroSceneStyle;
  frames: ScreenFrame[];
  logoUrl: string;
}

/**
 * Desktop hero object — MacBook composed from layered CSS-3D panels (no raster photo).
 * The outer motion.div carries the scroll-driven transform (translate/rotate/scale) from
 * `useHeroScroll`; the inner motion.div carries a separate idle-float loop so the two
 * transforms compose instead of colliding on the same node.
 */
export function DeviceShellMacbook({ scene, frames, logoUrl }: DeviceShellProps) {
  return (
    <div className="relative z-10" style={{ perspective: "1600px" }}>
      <motion.div
        className="relative"
        style={{
          transform: scene.device.transform,
          opacity: scene.device.opacity,
          transformStyle: "preserve-3d",
        }}
      >
        <motion.div
          animate={scene.reducedMotion ? undefined : { y: [0, -8, 0] }}
          transition={
            scene.reducedMotion ? undefined : { duration: 6, repeat: Infinity, ease: "easeInOut" }
          }
        >
          {/* lid / screen panel */}
          <div className="shadow-contact relative aspect-[16/10.2] w-[min(78vw,720px)] overflow-hidden rounded-[22px] border border-white/10 bg-gradient-to-b from-[oklch(0.24_0.02_260)] to-[oklch(0.14_0.02_260)]">
            {/* bezel */}
            <div className="absolute inset-[3%] overflow-hidden rounded-[14px] bg-[oklch(0.10_0.015_260)]">
              {/* screen glow */}
              <motion.div
                className="absolute inset-0"
                style={{
                  opacity: scene.glow.opacity,
                  backgroundImage:
                    "radial-gradient(circle at 50% 35%, oklch(0.65 0.18 255 / 0.35), transparent 65%)",
                }}
              />

              {/* content frames — one scrollYProgress crossfade, no independent timers */}
              <div className="absolute inset-0 flex items-center justify-center px-[8%] text-center">
                {frames.map((frame, i) => (
                  <motion.div
                    key={frame.title}
                    className="absolute inset-0 flex flex-col items-center justify-center gap-3"
                    style={{ opacity: scene.frameOpacities[i] }}
                  >
                    {i === 0 ? (
                      <img
                        src={logoUrl}
                        alt="ELEVATE"
                        className="h-8 w-auto select-none md:h-10"
                        draggable={false}
                      />
                    ) : (
                      <>
                        <span className="text-[10px] uppercase tracking-[0.3em] text-primary">
                          0{i}
                        </span>
                        <p className="max-w-[80%] text-sm font-semibold text-foreground md:text-base">
                          {frame.title}
                        </p>
                        {frame.tag && (
                          <p className="max-w-[75%] text-[11px] text-muted-foreground md:text-xs">
                            {frame.tag}
                          </p>
                        )}
                      </>
                    )}
                  </motion.div>
                ))}
              </div>

              {/* rim light */}
              <div className="pointer-events-none absolute inset-0 rounded-[14px] shadow-[inset_0_0_0_1px_oklch(1_0_0_/_0.06),inset_0_1px_20px_oklch(0.65_0.18_255_/_0.12)]" />
            </div>
            {/* camera notch */}
            <div className="absolute left-1/2 top-[1.4%] h-1.5 w-1.5 -translate-x-1/2 rounded-full bg-black/60" />
          </div>

          {/* hinge */}
          <div className="mx-auto h-[10px] w-[92%] rounded-b-[6px] border-x border-b border-white/5 bg-gradient-to-b from-[oklch(0.22_0.02_260)] to-[oklch(0.12_0.02_260)]" />

          {/* base / keyboard deck */}
          <div className="shadow-contact relative mx-auto -mt-px h-[16px] w-full max-w-[min(80vw,742px)] rounded-b-[10px] border-x border-b border-white/5 bg-gradient-to-b from-[oklch(0.20_0.02_260)] to-[oklch(0.11_0.02_260)]">
            <div className="absolute left-1/2 top-0 h-[3px] w-[18%] -translate-x-1/2 rounded-b-full bg-black/40" />
          </div>
        </motion.div>
      </motion.div>

      {/* mirror reflection */}
      <motion.div
        aria-hidden
        className="pointer-events-none absolute left-1/2 top-full aspect-[16/6] w-[min(78vw,720px)] -translate-x-1/2 -translate-y-2 rounded-[22px]"
        style={{
          opacity: scene.reflection.opacity,
          transform: "scaleY(-1)",
          backgroundImage: "linear-gradient(to bottom, oklch(0.65 0.18 255 / 0.18), transparent)",
        }}
      />
    </div>
  );
}
