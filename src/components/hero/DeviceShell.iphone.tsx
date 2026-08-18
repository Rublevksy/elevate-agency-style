import { motion } from "framer-motion";
import type { HeroSceneStyle } from "./useHeroScroll";
import type { ScreenFrame } from "./DeviceHero";

interface DeviceShellProps {
  scene: HeroSceneStyle;
  frames: ScreenFrame[];
  logoUrl: string;
}

/**
 * Mobile hero object — its own composition (unibody phone silhouette), not a scaled-down
 * MacBook. Fewer panels/layers than the desktop shell to stay lag-free on weaker devices
 * (R79): no separate hinge/base, no dynamic-notch decoration animation.
 */
export function DeviceShellIphone({ scene, frames, logoUrl }: DeviceShellProps) {
  return (
    <div className="relative z-10" style={{ perspective: "1200px" }}>
      <motion.div
        className="relative"
        style={{
          transform: scene.device.transform,
          opacity: scene.device.opacity,
          transformStyle: "preserve-3d",
        }}
      >
        <motion.div
          animate={scene.reducedMotion ? undefined : { y: [0, -6, 0] }}
          transition={
            scene.reducedMotion ? undefined : { duration: 5, repeat: Infinity, ease: "easeInOut" }
          }
        >
          {/* unibody */}
          <div className="shadow-contact relative aspect-[9/18.5] w-[min(46vw,260px)] overflow-hidden rounded-[38px] border border-white/10 bg-gradient-to-b from-[oklch(0.24_0.02_260)] to-[oklch(0.13_0.02_260)] p-[3%]">
            {/* screen */}
            <div className="relative h-full w-full overflow-hidden rounded-[28px] bg-[oklch(0.10_0.015_260)]">
              {/* dynamic island */}
              <div className="absolute left-1/2 top-[3%] h-[8px] w-[28%] -translate-x-1/2 rounded-full bg-black/70" />

              {/* screen glow */}
              <motion.div
                className="absolute inset-0"
                style={{
                  opacity: scene.glow.opacity,
                  backgroundImage:
                    "radial-gradient(circle at 50% 30%, oklch(0.65 0.18 255 / 0.32), transparent 65%)",
                }}
              />

              {/* content frames */}
              <div className="absolute inset-0 flex items-center justify-center px-[10%] text-center">
                {frames.map((frame, i) => (
                  <motion.div
                    key={frame.title}
                    className="absolute inset-0 flex flex-col items-center justify-center gap-2"
                    style={{ opacity: scene.frameOpacities[i] }}
                  >
                    {i === 0 ? (
                      <img
                        src={logoUrl}
                        alt="ELEVATE"
                        className="h-5 w-auto select-none"
                        draggable={false}
                      />
                    ) : (
                      <>
                        <span className="text-[9px] uppercase tracking-[0.28em] text-primary">
                          0{i}
                        </span>
                        <p className="max-w-[85%] text-xs font-semibold text-foreground">
                          {frame.title}
                        </p>
                      </>
                    )}
                  </motion.div>
                ))}
              </div>

              {/* rim light */}
              <div className="pointer-events-none absolute inset-0 rounded-[28px] shadow-[inset_0_0_0_1px_oklch(1_0_0_/_0.06),inset_0_1px_16px_oklch(0.65_0.18_255_/_0.1)]" />
            </div>
          </div>
        </motion.div>
      </motion.div>

      {/* mirror reflection */}
      <motion.div
        aria-hidden
        className="pointer-events-none absolute left-1/2 top-full aspect-[9/6] w-[min(46vw,260px)] -translate-x-1/2 -translate-y-1 rounded-[38px]"
        style={{
          opacity: scene.reflection.opacity,
          transform: "scaleY(-1)",
          backgroundImage: "linear-gradient(to bottom, oklch(0.65 0.18 255 / 0.16), transparent)",
        }}
      />
    </div>
  );
}
