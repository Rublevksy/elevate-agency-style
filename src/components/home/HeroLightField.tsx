/**
 * The hero's light, as a thing in the room rather than a thing in the photo.
 *
 * The plate and the clip both carry their own baked light — the arc, the rim on
 * the lid, the speckle on the stone. What they cannot do is spill past their
 * own edges, and that is exactly what makes a photograph sit *in* a page
 * instead of the page sitting inside a room. So this layer draws light that
 * crosses the whole stage, including the empty half where the type lives: a few
 * slow filaments drifting through the space, and a bloom where the arc meets
 * the device.
 *
 * Three rules keep it from becoming decoration:
 *
 *   1. It never invents a second arc. The arc belongs to the photography; this
 *      layer only makes the air around it move, so the two can never disagree.
 *   2. It is additive only — screen blending, never a dark wash — so at its
 *      trough the frame is exactly the approved one.
 *   3. Everything that moves, moves by transform or opacity alone, on a handful
 *      of composited layers, with the blur baked into the layer instead of
 *      re-filtered per frame.
 *
 * The trail is the exception, and it is the point of SHOT 03: at the end of the
 * hero's scroll the light does not fade out, it *travels* — one streak crossing
 * the frame toward the services room, which is the cut.
 */
import { motion, useTransform, type MotionValue } from "framer-motion";

export interface HeroLightFieldProps {
  /** Pinned-stage progress, 0 at rest → 1 at the hand-off. */
  progress: MotionValue<number>;
  reduced: boolean;
  /** Back layer sits behind the device plane, front layer in front of it. */
  layer: "back" | "front";
  pointerX: MotionValue<number>;
  pointerY: MotionValue<number>;
}

/** Filament geometry: one gentle wave per strand, in a 1200x900 stage box. */
const STRANDS_BACK = [
  { d: "M -200 585 C 140 520, 430 655, 760 575 S 1240 505, 1440 560", w: 1.6, o: 0.5, s: 0 },
  { d: "M -200 640 C 180 700, 470 560, 800 640 S 1250 700, 1440 630", w: 1.1, o: 0.36, s: -7 },
  { d: "M -200 700 C 200 640, 520 760, 880 690 S 1260 620, 1440 680", w: 0.9, o: 0.28, s: -14 },
];
const STRANDS_FRONT = [
  { d: "M -200 760 C 230 815, 560 690, 900 775 S 1270 840, 1440 780", w: 1.3, o: 0.3, s: -4 },
  { d: "M -200 835 C 260 780, 600 890, 960 820 S 1280 760, 1440 815", w: 0.8, o: 0.2, s: -11 },
];

export function HeroLightField({
  progress,
  reduced,
  layer,
  pointerX,
  pointerY,
}: HeroLightFieldProps) {
  const back = layer === "back";
  const strands = back ? STRANDS_BACK : STRANDS_FRONT;

  // Light rises as the camera pushes in, then goes out with the set. The room
  // is lit while we are in it and dark once we have left.
  const fieldFade = useTransform(
    progress,
    [0, 0.3, 0.6, 1],
    reduced ? [1, 1, 1, 1] : [0.85, 1, 0.75, 0],
  );

  // The bloom where the arc lands. It answers scroll rather than looping on its
  // own clock, so it reads as the light responding to the camera. It is gone by
  // the time shot B pushes past the device — beyond it there is no arc to bloom.
  const bloomLift = useTransform(progress, [0, 0.4, 0.7], reduced ? [1, 1, 1] : [0.75, 1.2, 0]);

  // The streak rides shot B — the move past the device — so the drawn light and
  // the filmed light travel together instead of arguing. It exists only during
  // the cut, so it can never be mistaken for a gradient parked on the page.
  const trailShift = useTransform(progress, [0.5, 0.92], ["-38%", "46%"]);
  const trailFade = useTransform(progress, [0.5, 0.64, 0.85, 0.94], [0, 0.9, 0.5, 0]);

  return (
    <motion.div
      aria-hidden
      style={{ opacity: fieldFade, x: pointerX, y: pointerY }}
      className="pointer-events-none absolute inset-0 mix-blend-screen"
    >
      <svg
        viewBox="0 0 1200 900"
        preserveAspectRatio="xMidYMid slice"
        className="absolute inset-0 h-full w-full hero-light-blur"
      >
        <defs>
          <linearGradient id={`hero-strand-${layer}`} x1="0" x2="1" y1="0" y2="0">
            <stop offset="0%" stopColor="oklch(0.78 0.19 253)" stopOpacity="0" />
            <stop offset="22%" stopColor="oklch(0.86 0.13 245)" stopOpacity="0.85" />
            <stop offset="58%" stopColor="oklch(0.95 0.05 240)" stopOpacity="1" />
            <stop offset="88%" stopColor="oklch(0.78 0.19 253)" stopOpacity="0.35" />
            <stop offset="100%" stopColor="oklch(0.78 0.19 253)" stopOpacity="0" />
          </linearGradient>
        </defs>
        {strands.map((strand, i) => (
          <g
            key={strand.d}
            className={reduced ? undefined : "hero-strand"}
            style={
              reduced
                ? undefined
                : { animationDuration: `${26 + i * 9}s`, animationDelay: `${strand.s}s` }
            }
          >
            <path
              d={strand.d}
              fill="none"
              stroke={`url(#hero-strand-${layer})`}
              strokeWidth={strand.w}
              strokeLinecap="round"
              opacity={strand.o}
            />
          </g>
        ))}
      </svg>

      {/* The bloom belongs to the back layer only: light gathers behind the
          object it is lighting, never in front of it. */}
      {back && (
        <motion.div
          style={{ opacity: bloomLift }}
          className={`absolute right-[16%] top-[14%] h-[42vh] w-[42vh] -translate-y-1/2 rounded-full blur-[90px] ${
            reduced ? "" : "hero-bloom"
          }`}
        >
          <div className="h-full w-full rounded-full bg-[radial-gradient(circle,oklch(0.78_0.19_253/0.5),transparent_68%)]" />
        </motion.div>
      )}

      {/* SHOT 03 — the trail that becomes the cut into the services room. */}
      {back && !reduced && (
        <motion.div
          style={{ y: trailShift, opacity: trailFade }}
          className="absolute inset-x-[-20%] top-[46%] h-[26vh] -rotate-[9deg]"
        >
          <div className="h-px w-full bg-[linear-gradient(to_right,transparent,oklch(0.86_0.13_245/0.9)_38%,oklch(0.95_0.05_240)_52%,oklch(0.78_0.19_253/0.6)_70%,transparent)]" />
          <div className="mt-[-14vh] h-[28vh] w-full bg-[radial-gradient(60%_50%_at_52%_50%,oklch(0.78_0.19_253/0.28),transparent_70%)] blur-2xl" />
        </motion.div>
      )}
    </motion.div>
  );
}

export default HeroLightField;
