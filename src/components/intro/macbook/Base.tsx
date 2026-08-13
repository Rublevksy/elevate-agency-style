import { Keyboard } from "./Keyboard";
import { ALU, GRAIN, SHEEN } from "./material";
import type { IntroGeometry } from "../useIntroGeometry";

/**
 * The deck: a separate physical body hinged at y=0 and extending toward the
 * viewer. Includes the keyboard well, trackpad and front-edge thickness.
 */
export function Base({ geo }: { geo: IntroGeometry }) {
  const { W, D, T } = geo;
  return (
    <>
      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          width: W,
          height: D,
          borderRadius: `${W * 0.006}px ${W * 0.006}px ${W * 0.022}px ${W * 0.022}px`,
          backgroundImage: `${SHEEN}, ${GRAIN}, ${ALU}`,
          boxShadow: `0 ${T * 1.6}px ${T * 4}px rgba(0,0,0,.85), inset 0 1px 0 rgba(255,255,255,.22), inset 0 0 0 1px rgba(255,255,255,.06)`,
          transformStyle: "preserve-3d",
        }}
      >
        {/* speaker grilles */}
        <div
          aria-hidden
          style={{
            position: "absolute",
            inset: "9% 3.2% auto 3.2%",
            height: "44%",
            borderRadius: W * 0.004,
            background:
              "repeating-linear-gradient(90deg, rgba(255,255,255,.06) 0 1px, transparent 1px 4px)",
            opacity: 0.55,
          }}
        />
        <Keyboard W={W} />
      </div>

      {/* front edge thickness */}
      <div
        style={{
          position: "absolute",
          top: D,
          left: 0,
          width: W,
          height: T,
          backgroundImage: `${SHEEN}, linear-gradient(180deg, #3c4249 0%, #14171c 100%)`,
          borderRadius: `0 0 ${W * 0.022}px ${W * 0.022}px`,
          boxShadow: "inset 0 1px 0 rgba(255,255,255,.25)",
          transform: "rotateX(-90deg)",
          transformOrigin: "50% 0%",
        }}
      />
    </>
  );
}
