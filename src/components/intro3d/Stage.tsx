import { useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import type { Group } from "three";
import { MathUtils } from "three";
import { DEVICE, OPEN_END, ROTATION_END, lerp, smoothstep } from "./constants";
import { Environment3D, ScreenLight } from "./Environment3D";
import { Lighting } from "./Lighting";
import { MacBook3D } from "./macbook/MacBook3D";
import { ProductCamera } from "./ProductCamera";

/**
 * The 3D stage. Client-only (WebGL), lazily loaded by CinematicIntro.
 * `stage` is the device timeline (forward, hold, mirrored exit); `progress` is
 * the master scroll timeline, used by the interface inside the display.
 */
export default function Stage({
  progress,
  stage,
  mobile,
}: {
  progress: React.RefObject<number>;
  stage: React.RefObject<number>;
  mobile: boolean;
}) {
  const lidRef = useRef<Group>(null);
  const screenRef = useRef<Group>(null);
  const rootRef = useRef<Group>(null);

  return (
    <Canvas
      dpr={[1, mobile ? 1.5 : 1.9]}
      gl={{ antialias: true, alpha: true, powerPreference: "high-performance" }}
      camera={{ fov: 30, position: [0, 12, 60] }}
      shadows={false}
      style={{ position: "absolute", inset: 0 }}
    >
      <fog attach="fog" args={["#05070b", 60, 180]} />

      <Environment3D stage={stage} />
      <Lighting stage={stage} />
      <ScreenLight stage={stage} />

      <Hinge progress={stage} lidRef={lidRef} rootRef={rootRef} />

      <MacBook3D ref={rootRef} lidRef={lidRef} screenRef={screenRef} progress={progress} stage={stage} />

      <ProductCamera progress={stage} screenRef={screenRef} mobile={mobile} />
    </Canvas>
  );
}

/** Hinge angle, derived from stage progress. The chassis is never hidden —
 *  it leaves the frame because the camera physically moves past it. */
function Hinge({
  progress,
  lidRef,
}: {
  progress: React.RefObject<number>;
  lidRef: React.RefObject<Group | null>;
  rootRef: React.RefObject<Group | null>;
}) {
  useFrame(() => {
    const p = progress.current ?? 0;
    const open = smoothstep(ROTATION_END, OPEN_END, p);
    const eased = open * open * (3 - 2 * open);
    const deg = lerp(DEVICE.LID_CLOSED_DEG, DEVICE.LID_OPEN_DEG, eased);
    if (lidRef.current) lidRef.current.rotation.x = MathUtils.degToRad(deg);
  });
  return null;
}
