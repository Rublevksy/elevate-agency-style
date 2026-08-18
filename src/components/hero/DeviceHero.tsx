import { useRef } from "react";
import { motion } from "framer-motion";
import { translations, type Lang } from "@/lib/i18n";
import logoUrl from "@/assets/elevate-logo.svg";
import {
  HERO_SCREEN_FRAME_COUNT,
  useHeroScroll,
  type DeviceHeroVariant,
  type HeroSceneStyle,
} from "./useHeroScroll";
import { DeviceShellMacbook } from "./DeviceShell.macbook";
import { DeviceShellIphone } from "./DeviceShell.iphone";

export interface DeviceHeroProps {
  variant: DeviceHeroVariant;
  lang: Lang;
}

export interface ScreenFrame {
  title: string;
  tag?: string;
}

/**
 * Cinematic hero: a MacBook (desktop) or iPhone (mobile) object driven by one
 * `scrollYProgress` (see `useHeroScroll`). Owns its own scroll track and background —
 * mount it in place of the old `Hero3DCube` slot.
 */
export function DeviceHero({ variant, lang }: DeviceHeroProps) {
  const heroRef = useRef<HTMLElement>(null);
  const scene = useHeroScroll(heroRef, variant);
  const frames = buildScreenFrames(lang);
  const isIphone = variant === "iphone";
  const Shell = isIphone ? DeviceShellIphone : DeviceShellMacbook;

  return (
    <section
      ref={heroRef}
      aria-label="ELEVATE — Digital Studio"
      className="relative isolate bg-background"
      style={{ height: isIphone ? "170vh" : "220vh" }}
    >
      <div className="sticky top-0 flex h-screen items-center justify-center overflow-hidden">
        <HeroBackdrop scene={scene} />

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          className="relative flex h-full w-full items-center justify-center"
        >
          <Shell scene={scene} frames={frames} logoUrl={logoUrl} />
        </motion.div>

        {!scene.reducedMotion && (
          <span
            aria-hidden
            className="absolute bottom-8 left-1/2 -translate-x-1/2 text-[10px] uppercase tracking-[0.35em] text-muted-foreground/70"
          >
            Scroll
          </span>
        )}
      </div>
    </section>
  );
}

function buildScreenFrames(lang: Lang): ScreenFrame[] {
  const dict = translations[lang];
  const services = dict.ui.serviceStage.slice(0, HERO_SCREEN_FRAME_COUNT - 1);
  return [{ title: "ELEVATE" }, ...services];
}

/**
 * Hero background: one glowing SVG arc + up to two blur blobs (existing `blur-[140px]`
 * intensity, reused not reinvented) + a low-opacity static particle field. Never more than
 * three layers move at once ("velmi controlled", R28); iphone drops one blob to stay light.
 */
function HeroBackdrop({ scene }: { scene: HeroSceneStyle }) {
  return (
    <div aria-hidden className="pointer-events-none absolute inset-0">
      <div className="absolute inset-0 grid-bg opacity-20 [mask-image:radial-gradient(ellipse_at_center,black_15%,transparent_70%)]" />

      <motion.div
        className="absolute left-1/2 top-1/2 h-72 w-72 -translate-x-1/2 -translate-y-1/2 rounded-full bg-primary/20 blur-[140px]"
        style={{
          opacity: scene.backgroundBlobA.opacity,
          transform: scene.backgroundBlobA.transform,
        }}
      />
      {scene.backgroundBlobB && (
        <motion.div
          className="absolute bottom-0 right-0 h-64 w-64 rounded-full bg-primary/15 blur-[140px]"
          style={{
            opacity: scene.backgroundBlobB.opacity,
            transform: scene.backgroundBlobB.transform,
          }}
        />
      )}

      <motion.svg
        viewBox="0 0 800 400"
        className="absolute left-1/2 top-1/2 h-[60vh] w-[90vw] max-w-[900px] -translate-x-1/2 -translate-y-1/2"
        style={{ opacity: scene.backgroundArc.opacity }}
      >
        <path
          d="M 40 320 C 220 40, 580 40, 760 320"
          fill="none"
          stroke="var(--primary-glow-strong)"
          strokeWidth={1.5}
          strokeLinecap="round"
          filter="blur(2px)"
        />
      </motion.svg>

      <div className="absolute inset-0 opacity-30" style={{ boxShadow: PARTICLE_FIELD }} />
    </div>
  );
}

// ~12 static particle dots via box-shadow (no canvas/WebGL) — low opacity, no animation.
const PARTICLE_FIELD = [
  "12vw 18vh 0 0 oklch(1 0 0 / 0.5)",
  "82vw 24vh 0 0 oklch(1 0 0 / 0.4)",
  "22vw 62vh 0 0 oklch(1 0 0 / 0.35)",
  "68vw 70vh 0 0 oklch(1 0 0 / 0.4)",
  "48vw 12vh 0 0 oklch(1 0 0 / 0.3)",
  "8vw 48vh 0 0 oklch(1 0 0 / 0.3)",
  "90vw 52vh 0 0 oklch(1 0 0 / 0.35)",
  "34vw 84vh 0 0 oklch(1 0 0 / 0.3)",
  "60vw 38vh 0 0 oklch(1 0 0 / 0.3)",
  "76vw 8vh 0 0 oklch(1 0 0 / 0.35)",
  "16vw 76vh 0 0 oklch(1 0 0 / 0.3)",
  "54vw 90vh 0 0 oklch(1 0 0 / 0.3)",
].join(", ");
