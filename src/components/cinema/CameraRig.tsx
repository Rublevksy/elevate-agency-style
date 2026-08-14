import { useRef, type RefObject } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import { PerspectiveCamera } from "three";
import { easeCine, lerp, stage } from "./progress";

/**
 * The scroll IS the camera. One continuous cinematic shot:
 *   0–20%   wide establishing frame, the world enters
 *   20–40%  slow approach, surface detail becomes readable
 *   40–55%  hero framing, gentle orbit across the terminator
 *   55–100% easing back and rising, opening space for the service field
 * Nothing autoplays; the whole move reverses perfectly.
 */
export function CameraRig({
  progressRef,
  pointerRef,
}: {
  progressRef: RefObject<number>;
  pointerRef: RefObject<{ x: number; y: number }>;
}) {
  const { camera } = useThree();
  const smooth = useRef({ p: 0, mx: 0, my: 0 });

  useFrame(() => {
    const target = progressRef.current ?? 0;
    /* soft inertial follow: slow acceleration, slow deceleration */
    smooth.current.p += (target - smooth.current.p) * 0.07;
    const m = pointerRef.current ?? { x: 0, y: 0 };
    smooth.current.mx += (m.x - smooth.current.mx) * 0.03;
    smooth.current.my += (m.y - smooth.current.my) * 0.03;

    const p = smooth.current.p;

    /* dolly: 15 → 6.2 (hero) → 10.5 (space for the interface layer) */
    const approach = easeCine(stage(p, 0.04, 0.55));
    const pullback = easeCine(stage(p, 0.66, 1));
    const dist = lerp(15, 6.2, approach) + pullback * 4.3;

    /* orbit: a slow arc across the lit edge, never a full spin */
    const orbit = lerp(-0.62, 0.5, easeCine(stage(p, 0.1, 0.78))) + pullback * 0.12;
    const elev = lerp(1.9, 0.35, easeCine(stage(p, 0.05, 0.6))) + pullback * 1.35;

    const px = Math.sin(orbit) * dist + smooth.current.mx * (0.9 - approach * 0.55);
    const pz = Math.cos(orbit) * dist;
    const py = elev + smooth.current.my * (0.7 - approach * 0.4);

    camera.position.set(px, py, pz);

    /* the world sits off-centre while the typography holds the left of frame */
    const bias = lerp(1.05, -0.15, easeCine(stage(p, 0.2, 0.7)));
    camera.lookAt(bias + smooth.current.mx * 0.2, py * 0.16 - pullback * 0.35, 0);

    if (camera instanceof PerspectiveCamera) {
      const fov = lerp(38, 52, easeCine(stage(p, 0.25, 1)));
      if (Math.abs(camera.fov - fov) > 0.01) {
        camera.fov = fov;
        camera.updateProjectionMatrix();
      }
    }
  });

  return null;
}
