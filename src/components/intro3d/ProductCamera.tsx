import { useRef } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import { Quaternion, Vector3, type Group, type PerspectiveCamera } from "three";
import {
  CAMERA_FOV,
  CAM_TRACK,
  CAM_TRACK_MOBILE,
  DEVICE,
  HANDOFF_END,
  HANDOFF_START,
  HOLD_END,
  OPEN_END,
  ROTATION_END,
  SCREEN_APPROACH_END,
  easeCinematic,
  lerp,
  range,
  sampleTrack,
  smoothstep,
} from "./constants";

const DEG = Math.PI / 180;

/**
 * A real product-photography camera. Never a 360° spin: it orbits within a
 * narrow arc, then re-aims onto the display normal and physically dollies
 * forward through the screen plane. Driven entirely by scroll progress.
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

  useFrame((state) => {
    const cam = camera as PerspectiveCamera;
    const p = progress.current ?? 0;
    const key = sampleTrack(mobile ? CAM_TRACK_MOBILE : CAM_TRACK, p);
    const s = scratch.current;

    // distance at which the active display exactly covers the viewport
    const aspect = size.width / size.height;
    const halfTan = Math.tan((CAMERA_FOV * DEG) / 2);
    const activeW = DEVICE.W - 1.1;
    const activeH = DEVICE.H - 1.25;
    const coverDist = Math.min(activeW / (2 * halfTan * aspect), activeH / (2 * halfTan));
    // distance at which the WHOLE product comfortably fits the frame — the
    // orbit is expressed as a multiple of this, so framing holds on any aspect
    const fitDist = Math.max(
      (DEVICE.W * 1.45) / (2 * halfTan * aspect),
      (DEVICE.H * 2.2) / (2 * halfTan),
    );
    const orbitDist = key.k * fitDist;

    // where the camera looks: the closed device, then the display itself
    // as the lid rises the whole silhouette grows upward, so the aim point
    // climbs with it — the product stays centred instead of drifting off frame
    const lidOpen = smoothstep(ROTATION_END, OPEN_END, p);
    s.deckTarget.set(0, DEVICE.T * 0.7 + DEVICE.H * 0.34 * lidOpen, -DEVICE.D * 0.02);
    if (screenRef.current) {
      screenRef.current.getWorldPosition(s.screenPos);
      screenRef.current.getWorldQuaternion(s.q);
      s.normal.set(0, 0, 1).applyQuaternion(s.q).normalize();
    } else {
      s.screenPos.copy(s.deckTarget);
      s.normal.set(0, 0.3, 1).normalize();
    }

    const toScreen = smoothstep(OPEN_END - 0.12, HOLD_END + 0.06, p);
    s.target.copy(s.deckTarget).lerp(s.screenPos, toScreen);
    // while the whole product is in shot, aim a little below the display centre
    // so deck + lid sit balanced in frame; released as the dolly takes over
    const framing = 1 - easeCinematic(range(HOLD_END, HANDOFF_START, p));
    s.target.y -= DEVICE.H * 0.12 * framing * toScreen;

    // restrained orbit, with a hair of camera breathing while the lid is shut
    const drift = (1 - smoothstep(0, 0.14, p)) * (mobile ? 0 : 1);
    const t = state.clock.elapsedTime;
    const yaw = (key.yaw + Math.sin(t * 0.22) * 0.9 * drift) * DEG;
    const elev = (key.elev + Math.sin(t * 0.17 + 1.2) * 0.6 * drift) * DEG;

    s.orbit.set(
      Math.sin(yaw) * Math.cos(elev),
      Math.sin(elev),
      Math.cos(yaw) * Math.cos(elev),
    ).multiplyScalar(orbitDist).add(s.target);

    // ---- the dolly: physical forward movement along the display normal ----
    // slow start, smooth acceleration, gentle deceleration; at HANDOFF_END the
    // display exactly covers the viewport, so the fullscreen layer matches 1:1.
    const dolly = easeCinematic(range(HOLD_END, HANDOFF_END, p));
    const past = range(HANDOFF_END, SCREEN_APPROACH_END, p);
    const dist = lerp(orbitDist, coverDist, dolly) * (1 - past * 0.75);

    s.normalPos.copy(s.normal).multiplyScalar(dist).add(s.screenPos);

    // blend from the orbit rig onto the display normal early, so the final
    // stretch is pure straight-line travel with no lateral swing
    const aim = smoothstep(HOLD_END - 0.05, OPEN_END + 0.22, p);
    s.pos.copy(s.orbit).lerp(s.normalPos, aim);

    cam.position.copy(s.pos);
    cam.lookAt(s.target);
    cam.fov = CAMERA_FOV;
    cam.near = 0.15;
    cam.far = 400;
    cam.updateProjectionMatrix();
  });

  return null;
}
