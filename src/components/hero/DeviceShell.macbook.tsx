import { motion } from "framer-motion";
import type { HeroSceneStyle } from "./useHeroScroll";
import type { ScreenFrame } from "./DeviceHero";
// The former asset here was the whole reference poster, Czech headline baked
// into the raster — one language hardcoded into an image on a four-language
// site, and a second copy of the page's own H1. It also lived outside git.
// This is the text-free plate cut by scripts/extract-ref-assets.mjs.
import macbookPhoto from "@/assets/refs/hero-macbook.jpg";
import { ScreenMockup } from "./ScreenMockup";

interface DeviceShellProps {
  scene: HeroSceneStyle;
  frames: ScreenFrame[];
  logoUrl: string;
}

/**
 * Desktop hero object. At rest, the real reference photo (a genuine premium MacBook render —
 * material/lighting/reflection no CSS shape can fake) owns the moment; scrolling crossfades
 * into an open, CSS-3D-composed shell carrying live screen content. The outer motion.div
 * carries the scroll-driven transform (translate/rotate/scale) from `useHeroScroll`, shared by
 * both layers; the inner motion.div carries a separate idle-float loop so the two transforms
 * compose instead of colliding on the same node.
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
          className="relative grid w-[min(78vw,720px)]"
          animate={scene.reducedMotion ? undefined : { y: [0, -8, 0] }}
          transition={
            scene.reducedMotion ? undefined : { duration: 6, repeat: Infinity, ease: "easeInOut" }
          }
        >
          {/* photo layer — the real reference render, owns the resting moment */}
          <motion.div
            className="shadow-contact relative col-start-1 row-start-1 aspect-[16/11] overflow-hidden rounded-[22px]"
            style={{ opacity: scene.photo.opacity }}
          >
            <img
              src={macbookPhoto}
              alt="ELEVATE — MacBook, prémiová prezentace"
              className="h-full w-full object-cover"
              style={{ objectPosition: "70% 55%" }}
              draggable={false}
            />
            <div className="pointer-events-none absolute inset-0 rounded-[22px] shadow-[inset_0_0_0_1px_oklch(1_0_0_/_0.08)]" />
          </motion.div>

          {/* shell layer — CSS-built open device, takes over once scrolling starts */}
          <motion.div className="col-start-1 row-start-1" style={{ opacity: scene.shell.opacity }}>
            {/* lid / screen panel */}
            <div className="shadow-contact relative aspect-[16/10.2] overflow-hidden rounded-[22px] border border-white/10 bg-gradient-to-b from-[oklch(0.24_0.02_260)] to-[oklch(0.14_0.02_260)]">
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
                <div className="absolute inset-0">
                  {frames.map((frame, i) => (
                    <motion.div
                      key={frame.title}
                      className="absolute inset-0"
                      style={{ opacity: scene.frameOpacities[i] }}
                    >
                      {i === 0 ? (
                        <div className="flex h-full w-full flex-col items-center justify-center gap-3 px-[8%] text-center">
                          <img
                            src={logoUrl}
                            alt="ELEVATE"
                            className="h-8 w-auto select-none md:h-10"
                            draggable={false}
                          />
                        </div>
                      ) : (
                        <ScreenMockup index={i} title={frame.title} tag={frame.tag} />
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
