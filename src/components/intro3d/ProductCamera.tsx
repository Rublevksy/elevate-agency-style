import { useRef } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import { Quaternion, Vector3, type Group, type PerspectiveCamera } from "three";
import {
  CAMERA_FOV,
  CAM_TRACK,
  CAM_TRACK_MOBILE,
  DEVICE,
  HOLD_END,
  OPEN_END,
  SCREEN_APPROACH_END,
  lerp,
  sampleTrack,
  smoothstep,
} from "./constants";

const DEG = Math.PI / 180;

/**
 * A real product-photography camera. Never a 360° spin: it orbits within a
 * narrow arc, then re-aims onto the display normal and flies straight into the
 * screen plane. Driven entirely by scroll progress.
 */
export function ProductCamera({
  progress,
  screenRef,
  mobile,
}: {
  progress: React.RefObject<number>;
  screenRef: React.RefObject<Group | null>;
  mobile: boolean;
}) {
  const { camera, size } = useThree();
  const scratch = useRef({
    deckTarget: new Vector3(),
    target: new Vector3(),
    orbit: new Vector3(),
    normalPos: new Vector3(),
    pos: new Vector3(),
    screenPos: new Vector3(),
    normal: new Vector3(),
    q: new Quaternion(),
  });

  useFrame(() => {
    (window as any).__frames = ((window as any).__frames ?? 0) + 1;
    const cam = camera as PerspectiveCamera;
    const p = progress.current ?? 0;
    const key = sampleTrack(mobile ? CAM_TRACK_MOBILE : CAM_TRACK, p);
    const s = scratch.current;

    // distance at which the display exactly fills the viewport width
    const aspect = size.width / size.height;
    const fillDist = DEVICE.W / (2 * Math.tan((CAMERA_FOV * DEG) / 2) * aspect);
    const r = key.k * fillDist;

    // where the camera looks: the closed device, then the display itself
    s.deckTarget.set(0, DEVICE.T * 0.7, -DEVICE.D * 0.02);
    if (screenRef.current) {
      screenRef.current.getWorldPosition(s.screenPos);
      screenRef.current.getWorldQuaternion(s.q);
      s.normal.set(0, 0, 1).applyQuaternion(s.q).normalize();
    } else {
      s.screenPos.copy(s.deckTarget);
      s.normal.set(0, 0.3, 1).normalize();
    }

    const toScreen = smoothstep(OPEN_END, HOLD_END + 0.05, p);
    s.target.copy(s.deckTarget).lerp(s.screenPos, toScreen);

    // restrained orbit
    const yaw = key.yaw * DEG;
    const elev = key.elev * DEG;
    s.orbit.set(
      Math.sin(yaw) * Math.cos(elev),
      Math.sin(elev),
      Math.cos(yaw) * Math.cos(elev),
    ).multiplyScalar(r).add(s.target);

    // straight-on approach along the display normal
    s.normalPos.copy(s.normal).multiplyScalar(r).add(s.screenPos);

    const enter = smoothstep(HOLD_END - 0.03, SCREEN_APPROACH_END, p);
    s.pos.copy(s.orbit).lerp(s.normalPos, enter);

    cam.position.copy(s.pos);
    cam.lookAt(s.target);
    cam.fov = lerp(CAMERA_FOV, CAMERA_FOV + 4, enter);
    cam.near = 0.5;
    cam.far = 400;
    cam.updateProjectionMatrix();
    (window as unknown as Record<string, unknown>).__dbg = { p, k: key.k, pos: cam.position.toArray(), fill: fillDist };
  });

  return null;
}
