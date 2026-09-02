import { type RefObject } from "react";
import {
  useMotionTemplate,
  useReducedMotion,
  useScroll,
  useTransform,
  type MotionValue,
} from "framer-motion";

export type DeviceHeroVariant = "macbook" | "iphone";

/** Number of on-screen content frames the scene always exposes (frame 0 is the resting ELEVATE frame). */
export const HERO_SCREEN_FRAME_COUNT = 4;

/** A style bag compatible with `motion.div`'s `style` prop — plain values or MotionValues mixed. */
export interface HeroLayerStyle {
  opacity: number | MotionValue<number>;
  transform?: string | MotionValue<string>;
}

export interface HeroSceneStyle {
  /** true when the visitor asked for reduced motion — scene renders as a single static, faded-in frame. */
  reducedMotion: boolean;
  /** Outer device stack (body + hinge + screen): scroll-driven translate/rotate/scale. */
  device: HeroLayerStyle;
  /** Mirror reflection beneath the device. */
  reflection: HeroLayerStyle;
  /** Screen glow / rim-light intensity. */
  glow: HeroLayerStyle;
  /** Background light arc. */
  backgroundArc: HeroLayerStyle;
  /** Background glow blobs (blob B is omitted on iphone — fewer parallax layers, R79). */
  backgroundBlobA: HeroLayerStyle;
  backgroundBlobB: HeroLayerStyle | null;
  /** Opacity per on-screen content frame, length === HERO_SCREEN_FRAME_COUNT. */
  frameOpacities: Array<number | MotionValue<number>>;
  /** The real reference photo (closed/branded device) — dominant at rest, dissolves early on scroll. */
  photo: HeroLayerStyle;
  /** The CSS-built open-screen shell carrying live content frames — takes over once scrolling starts. */
  shell: HeroLayerStyle;
}

const STAGES: number[] = [0, 0.15, 0.55, 0.85, 1];

/**
 * Maps one `scrollYProgress` (from `targetRef`'s scroll range) into the full set of style
 * objects DeviceHero needs — the only place raw `useScroll`/`useTransform` mechanics live.
 */
export function useHeroScroll(
  targetRef: RefObject<HTMLElement | null>,
  variant: DeviceHeroVariant,
): HeroSceneStyle {
  const prefersReducedMotion = Boolean(useReducedMotion());
  const isIphone = variant === "iphone";

  const { scrollYProgress } = useScroll({
    target: targetRef,
    offset: ["start start", "end start"],
  });

  // Desktop gets the full depth sequence; mobile gets a shallower, cheaper one (R79).
  const translateY = useTransform(
    scrollYProgress,
    STAGES,
    isIphone ? [24, 0, -8, -16, -90] : [48, 0, -14, -28, -160],
  );
  const rotateX = useTransform(
    scrollYProgress,
    STAGES,
    isIphone ? [4, 2, 0, 0, -4] : [10, 5, 0, -2, -8],
  );
  const rotateY = useTransform(
    scrollYProgress,
    STAGES,
    isIphone ? [-8, -3, 0, 0, 4] : [-20, -7, 0, 4, 12],
  );
  const scale = useTransform(
    scrollYProgress,
    STAGES,
    isIphone ? [0.9, 0.96, 1, 1.02, 0.75] : [0.84, 0.94, 1, 1.05, 0.68],
  );
  const deviceOpacity = useTransform(scrollYProgress, [0, 0.05, 0.9, 1], [1, 1, 1, 0]);
  const scrollTransform = useMotionTemplate`translateY(${translateY}px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale(${scale})`;

  const reflectionOpacity = useTransform(
    scrollYProgress,
    [0, 0.15, 0.85, 1],
    [0.12, 0.28, 0.28, 0],
  );
  const glowOpacity = useTransform(scrollYProgress, [0, 0.2, 0.6, 1], [0.3, 0.55, 0.85, 0.2]);
  const arcOpacity = useTransform(scrollYProgress, [0, 0.2, 0.8, 1], [0.5, 0.9, 0.6, 0]);

  const blobADrift = useTransform(scrollYProgress, [0, 1], [0, isIphone ? -12 : -24]);
  const blobBDrift = useTransform(scrollYProgress, [0, 1], [0, 30]);
  const blobATransform = useMotionTemplate`translateY(${blobADrift}px)`;
  const blobBTransform = useMotionTemplate`translateY(${blobBDrift}px)`;
  const blobOpacity = useTransform(scrollYProgress, [0, 0.5, 1], [0.5, 0.85, 0.3]);

  // Four content frames, always computed (stable hook order): frame 0 is the resting ELEVATE
  // frame, frames 1-3 hand off into the services that follow the hero (R37/R38).
  const frame0 = useTransform(scrollYProgress, [0, 0.22, 0.34], [1, 1, 0]);
  const frame1 = useTransform(scrollYProgress, [0.22, 0.34, 0.46, 0.58], [0, 1, 1, 0]);
  const frame2 = useTransform(scrollYProgress, [0.46, 0.58, 0.7, 0.82], [0, 1, 1, 0]);
  const frame3 = useTransform(scrollYProgress, [0.7, 0.82, 0.94], [0, 1, 1]);

  // The real reference photo owns the resting moment; the CSS-built open shell (live content
  // frames) takes over as the visitor starts scrolling. Same crossfade window both directions
  // so exactly one is ever dominant, never a visible gap or double-exposure.
  const photoOpacity = useTransform(scrollYProgress, [0, 0.12, 0.2], [1, 1, 0]);
  const shellOpacity = useTransform(scrollYProgress, [0, 0.12, 0.2], [0, 0, 1]);

  if (prefersReducedMotion) {
    return {
      reducedMotion: true,
      device: { transform: "none", opacity: 1 },
      reflection: { opacity: 0.18 },
      glow: { opacity: 0.5 },
      backgroundArc: { opacity: 0.5 },
      backgroundBlobA: { opacity: 0.4 },
      backgroundBlobB: isIphone ? null : { opacity: 0.28 },
      frameOpacities: [1, 0, 0, 0],
      photo: { opacity: 1 },
      shell: { opacity: 0 },
    };
  }

  return {
    reducedMotion: false,
    device: { transform: scrollTransform, opacity: deviceOpacity },
    reflection: { opacity: reflectionOpacity },
    glow: { opacity: glowOpacity },
    backgroundArc: { opacity: arcOpacity },
    backgroundBlobA: { opacity: blobOpacity, transform: blobATransform },
    backgroundBlobB: isIphone ? null : { opacity: blobOpacity, transform: blobBTransform },
    frameOpacities: [frame0, frame1, frame2, frame3],
    photo: { opacity: photoOpacity },
    shell: { opacity: shellOpacity },
  };
}
