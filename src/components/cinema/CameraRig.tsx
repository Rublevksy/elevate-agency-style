import { useRef, type RefObject } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import { PerspectiveCamera } from "three";
import { easeCine, lerp, stage } from "./progress";

/**
 * The scroll IS the camera. One continuous shot: wide establishing frame →
 * slow approach → arc around the artifact → straight travel through its core.
 * No cuts, no autoplay, perfectly reversible.
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
    smooth.current.p += (target - smooth.current.p) * 0.12;
    const m = pointerRef.current ?? { x: 0, y: 0 };
    smooth.current.mx += (m.x - smooth.current.mx) * 0.045;
    smooth.current.my += (m.y - smooth.current.my) * 0.045;

    const p = smooth.current.p;
    const e = easeCine(p);

    /* travel: far → through the core → out the other side */
    const dist = 17 * Math.pow(1 - e, 1.25) - 2.2 * stage(p, 0.9, 1);
    /* arc: rises and returns so the final approach is dead straight */
    const arc = Math.sin(stage(p, 0.12, 0.66) * Math.PI) * 0.9;
    const elev = lerp(2.5, 0.0, easeCine(Math.min(1, p / 0.82)));

    const px = Math.sin(arc) * dist + smooth.current.mx * (1.4 - e);
    const pz = Math.cos(arc) * dist;
    const py = elev + smooth.current.my * (0.9 - e * 0.8);

    camera.position.set(px, py, pz);
    /* artifact sits right of frame early, re-centres for the straight entry */
    const bias = -3.1 * (1 - easeCine(stage(p, 0.3, 0.72)));
    camera.lookAt(bias + smooth.current.mx * 0.25 * (1 - e), py * 0.22, 0);

    if (camera instanceof PerspectiveCamera) {
      const fov = lerp(40, 78, easeCine(stage(p, 0.35, 1)));
      if (Math.abs(camera.fov - fov) > 0.01) {
        camera.fov = fov;
        camera.updateProjectionMatrix();
      }
    }
  });

  return null;
}
