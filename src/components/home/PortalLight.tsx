/**
 * The portal, alive — its light as a thing in the room, not a thing in a photo.
 *
 * This is `HeroLightField`'s idea (unmounted since the camera hero was replaced;
 * kept per ADR 0003) carried to the current plate, with the same three rules:
 *
 *   1. It never invents a second arc. The arcs belong to the photograph. The
 *      breathing and the current running along them are drawn THROUGH
 *      `portal-light` — the plate's own luminance as alpha — so they are
 *      pixel-registered to the photographed neon and can never disagree with it.
 *   2. Additive only (screen), so at its trough the frame is the approved plate.
 *   3. Everything moves by transform or opacity, on a few composited layers,
 *      driven by CSS keyframes (see the `portal-*` utilities in styles.css) —
 *      no rAF loop, no per-frame filter. Scroll and pointer response come from
 *      the act's MotionValues, which the hero already owns.
 *
 * Four exports, because they live on four different planes of the hero rig:
 *   PortalAtmosphere  far plane, behind the plate: the blurred glow field
 *   PortalGlow        ON the plate (same transform): the arcs breathe, a current
 *                     runs along them and across their reflections on the floor
 *   PortalAir         in front of the plate, behind the window: slow filaments
 *                     through the fog band and a bloom inside the arch
 *   WindowHalo        behind THE WINDOW: the portal's light, carried by the
 *                     window after the handoff into the services
 *
 * Everything is `aria-hidden` and `pointer-events-none`.
 */
import { motion, type MotionValue } from "framer-motion";
import { SceneImage } from "@/components/media/SceneImage";
import portalLightUrl from "@/assets/refs/portal-light.webp";

type Mv = MotionValue<number> | number;

/** Far plane: the glow field, drifting slower than anything else in the frame. */
export function PortalAtmosphere({
  reduced,
  x = 0,
  y = 0,
  opacity = 1,
}: {
  reduced: boolean;
  x?: Mv;
  y?: Mv;
  opacity?: Mv;
}) {
  return (
    <motion.div
      aria-hidden
      style={{ x, y, opacity }}
      className="pointer-events-none absolute inset-[-6%]"
    >
      <div className={`absolute inset-0 ${reduced ? "" : "portal-atmo-drift"}`}>
        <SceneImage
          name="portal-atmo"
          alt=""
          sizes="50vw"
          className="absolute inset-0 block h-full w-full"
          imgClassName="h-full w-full object-cover opacity-70"
        />
      </div>
    </motion.div>
  );
}

/**
 * On the plate: rendered INSIDE the plate's own transform group, so it scales
 * and parallaxes exactly with the photograph it is lighting.
 */
export function PortalGlow({
  reduced,
  intensity = 1,
  current = true,
}: {
  reduced: boolean;
  /** Scroll-driven gain on the breathing light (the portal "charging"). */
  intensity?: Mv;
  /** The travelling current along the arcs. Off on phones. */
  current?: boolean;
}) {
  const mask = {
    WebkitMaskImage: `url(${portalLightUrl})`,
    maskImage: `url(${portalLightUrl})`,
    WebkitMaskSize: "100% 100%",
    maskSize: "100% 100%",
  } as React.CSSProperties;

  return (
    <motion.div
      aria-hidden
      style={{ opacity: intensity }}
      className="pointer-events-none absolute inset-0"
    >
      {/* The arcs breathe: their own light, added back on a slow cycle. */}
      <div
        className={`absolute inset-0 mix-blend-screen ${reduced ? "opacity-60" : "portal-breathe"}`}
      >
        <SceneImage
          name="portal-light"
          alt=""
          sizes="100vw"
          className="absolute inset-0 block h-full w-full"
          imgClassName="h-full w-full object-cover"
        />
      </div>

      {/* A current runs through the neon and across its reflections: a soft
          band of light, masked by the plate's own luminance, so it is only
          ever visible where the photograph is already lit. */}
      {current && !reduced && (
        <div className="absolute inset-0 overflow-hidden mix-blend-screen" style={mask}>
          <div className="portal-sweep absolute inset-y-0 left-0 w-[45%]">
            <div className="h-full w-full bg-[linear-gradient(100deg,transparent_0%,oklch(0.9_0.1_235/0.0)_20%,oklch(0.95_0.07_235/0.9)_50%,oklch(0.9_0.1_235/0.0)_80%,transparent_100%)]" />
          </div>
        </div>
      )}
    </motion.div>
  );
}

/** Filament geometry in the portal box's own coordinates (2400x1340). */
const STRANDS = [
  { d: "M -300 760 C 300 700, 700 820, 1200 760 S 2000 690, 2700 750", w: 2.4, o: 0.42, s: 0 },
  { d: "M -300 820 C 400 880, 900 740, 1400 815 S 2100 880, 2700 800", w: 1.6, o: 0.3, s: -9 },
  { d: "M -300 880 C 500 830, 1000 930, 1500 870 S 2150 820, 2700 880", w: 1.2, o: 0.22, s: -17 },
];

/** In front of the plate, behind the window: air moving through the fog band. */
export function PortalAir({
  reduced,
  x = 0,
  y = 0,
  bloom = 1,
}: {
  reduced: boolean;
  x?: Mv;
  y?: Mv;
  bloom?: Mv;
}) {
  return (
    <motion.div
      aria-hidden
      style={{ x, y }}
      className="pointer-events-none absolute inset-0 mix-blend-screen"
    >
      <svg
        viewBox="0 0 2400 1340"
        preserveAspectRatio="xMidYMid slice"
        className="hero-light-blur absolute inset-0 h-full w-full"
      >
        <defs>
          <linearGradient id="portal-strand" x1="0" x2="1" y1="0" y2="0">
            <stop offset="0%" stopColor="oklch(0.78 0.19 253)" stopOpacity="0" />
            <stop offset="25%" stopColor="oklch(0.86 0.13 245)" stopOpacity="0.8" />
            <stop offset="55%" stopColor="oklch(0.95 0.05 240)" stopOpacity="1" />
            <stop offset="85%" stopColor="oklch(0.78 0.19 253)" stopOpacity="0.3" />
            <stop offset="100%" stopColor="oklch(0.78 0.19 253)" stopOpacity="0" />
          </linearGradient>
        </defs>
        {STRANDS.map((strand, i) => (
          <g
            key={strand.d}
            className={reduced ? undefined : "hero-strand"}
            style={
              reduced
                ? undefined
                : { animationDuration: `${28 + i * 9}s`, animationDelay: `${strand.s}s` }
            }
          >
            <path
              d={strand.d}
              fill="none"
              stroke="url(#portal-strand)"
              strokeWidth={strand.w}
              strokeLinecap="round"
              opacity={strand.o}
            />
          </g>
        ))}
      </svg>

      {/* The bloom inside the arch, where the window will stand. Blur is baked
          into the gradient's own falloff, not a per-frame filter. */}
      <motion.div
        style={{ opacity: bloom }}
        className="absolute top-[34%] left-[58%] aspect-square w-[34%] -translate-x-1/2 -translate-y-1/2"
      >
        <div
          className={`h-full w-full rounded-full bg-[radial-gradient(circle,oklch(0.72_0.16_250/0.34),oklch(0.72_0.16_250/0.08)_42%,transparent_68%)] ${
            reduced ? "" : "portal-bloom"
          }`}
        />
      </motion.div>
    </motion.div>
  );
}

/**
 * Behind THE WINDOW. After the handoff the portal dims and the window carries
 * its light — the "transform, not jump" of the hero → services transition.
 */
export function WindowHalo({ reduced, opacity }: { reduced: boolean; opacity: Mv }) {
  return (
    <motion.div
      aria-hidden
      style={{ opacity }}
      className="pointer-events-none absolute inset-[-18%_-12%]"
    >
      <div
        className={`h-full w-full bg-[radial-gradient(50%_50%_at_50%_50%,oklch(0.72_0.16_250/0.3),oklch(0.72_0.16_250/0.1)_45%,transparent_72%)] ${
          reduced ? "" : "portal-breathe-slow"
        }`}
      />
    </motion.div>
  );
}
