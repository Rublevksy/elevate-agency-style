import { useRef } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import { PerspectiveCamera, Quaternion, Vector3 } from "three";
import { PHASE, easeFilm, lerp, range, smoothstep } from "./film";

/**
 * The camera is the animation. One continuous shot:
 *   00–18%  establishing frame, slightly high and off-axis
 *   18–40%  slow approach + gentle orbit: metal, keys, hinge read
 *   40–66%  settling square onto the display while products escape it
 *   66–100% dolly along the display normal, through the glass
 * The device never spins; nothing autoplays; the whole move reverses.
 */
export function FilmCamera({
  progress,
  pointer,
  screenRef,
  mobile,
}: {
  progress: React.RefObject<number>;
  pointer: React.RefObject<{ x: number; y: number }>;
  screenRef: React.RefObject<import("three").Group | null>;
  mobile: boolean;
}) {
  const { camera, size } = useThree();
  const smooth = useRef({ p: 0, mx: 0, my: 0 });
  const target = useRef(new Vector3(0, 9, -6));
  const normal = useRef(new Vector3(0, 0.18, 0.98));

  useFrame(() => {
    const p = progress.current ?? 0;
    smooth.current.p += (p - smooth.current.p) * 0.1;
    const m = pointer.current ?? { x: 0, y: 0 };
    smooth.current.mx += (m.x - smooth.current.mx) * 0.035;
    smooth.current.my += (m.y - smooth.current.my) * 0.035;
    const t = smooth.current.p;

    // live display frame, measured from the scene so the entry is exact
    const screen = screenRef.current;
    if (screen) {
      screen.getWorldPosition(target.current);
      normal.current.set(0, 0, 1).applyQuaternion(screen.getWorldQuaternion(new Quaternion()));
    }

    // distance at which the display exactly fills the frame width
    if (camera instanceof PerspectiveCamera) {
      const fov = lerp(mobile ? 34 : 30, 26, easeFilm(range(PHASE.APPROACH, PHASE.ENTER, t)));
      if (Math.abs(camera.fov - fov) > 0.01) {
        camera.fov = fov;
        camera.updateProjectionMatrix();
      }
    }
    const fovRad = ((camera as PerspectiveCamera).fov * Math.PI) / 180;
    const aspect = size.width / size.height;
    const fit = 31 / (2 * Math.tan(fovRad / 2) * Math.min(aspect, 1.9));

    // dolly: establishing → approach → through the glass
    const approach = easeFilm(range(0.02, PHASE.ENTER, t));
    const enter = easeFilm(range(PHASE.ENTER, 1, t));
    const dist = lerp(fit * (mobile ? 3.35 : 3.2), fit * 1.1, approach) * (1 - enter) + enter * -6;

    // orbit: a slow arc, decaying to dead-on before the entry
    const orbitAmp = 1 - smoothstep(PHASE.PRODUCTS_IN, PHASE.ENTER, t);
    const yaw = (lerp(-12, 13, easeFilm(range(0.04, PHASE.PRODUCTS_IN, t))) * orbitAmp * Math.PI) / 180;
    const elev = (lerp(mobile ? 13 : 16, 2.5, easeFilm(range(0.04, PHASE.ENTER, t))) * Math.PI) / 180;

    const px = Math.sin(yaw) * Math.cos(elev) * dist;
    const py = Math.sin(elev) * dist;
    const pz = Math.cos(yaw) * Math.cos(elev) * dist;

    // the device holds the lower right of frame while the typography owns the
    // left; it re-centres exactly as the camera commits to the display
    const frame = easeFilm(range(0.02, PHASE.PRODUCTS_IN, t));
    const bias = (1 - frame) * (mobile ? 0 : 15);
    // early on the whole product is framed, so the aim sits at device centre
    const drop = (1 - frame) * 4.5;



    // mouse parallax: the laptop is almost completely stable
    const par = 0.9 * orbitAmp;
    camera.position.set(
      target.current.x + px + smooth.current.mx * par,
      target.current.y + py - drop * 0.35 + smooth.current.my * par * 0.7,
      target.current.z + pz,
    );
    camera.lookAt(target.current.x - bias, target.current.y - drop, target.current.z);

  });

  return null;
}
