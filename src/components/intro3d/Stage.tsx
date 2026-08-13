import { useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import type { Group } from "three";
import { MathUtils } from "three";
import { DEVICE, OPEN_END, ROTATION_END, lerp, smoothstep } from "./constants";
import { Lighting } from "./Lighting";
import { MacBook3D } from "./macbook/MacBook3D";
import { ProductCamera } from "./ProductCamera";

/**
 * The 3D stage. Client-only (WebGL), lazily loaded by CinematicIntro.
 */
export default function Stage({
  progress,
  mobile,
}: {
  progress: React.RefObject<number>;
  mobile: boolean;
}) {
  const lidRef = useRef<Group>(null);
  const screenRef = useRef<Group>(null);
  const rootRef = useRef<Group>(null);

  return (
    <Canvas
      dpr={[1, mobile ? 1.6 : 2]}
      gl={{ antialias: true, powerPreference: "high-performance" }}
      camera={{ fov: 30, position: [0, 12, 60] }}
      shadows={false}
      style={{ position: "absolute", inset: 0 }}
    >
      <color attach="background" args={["#04060a"]} />
      <fog attach="fog" args={["#04060a", 90, 220]} />

      <Lighting />

      <Hinge progress={progress} lidRef={lidRef} rootRef={rootRef} />

      <MacBook3D ref={rootRef} lidRef={lidRef} screenRef={screenRef} progress={progress} />

      <ProductCamera progress={progress} screenRef={screenRef} mobile={mobile} />
    </Canvas>
  );
}

/** Hinge angle, derived from scroll progress. The chassis is never hidden —
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

