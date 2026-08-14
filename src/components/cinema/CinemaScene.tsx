import { type RefObject } from "react";
import { Canvas } from "@react-three/fiber";
import { ElevateEngine } from "./ElevateEngine";
import { Atmosphere } from "./Atmosphere";
import { CameraRig } from "./CameraRig";

/**
 * One canvas, one camera, one scroll-driven shot. Loaded lazily on the client
 * only so the heavy 3D work never blocks first paint or SSR.
 */
export default function CinemaScene({
  progressRef,
  pointerRef,
  mobile,
}: {
  progressRef: RefObject<number>;
  pointerRef: RefObject<{ x: number; y: number }>;
  mobile: boolean;
}) {
  return (
    <Canvas
      dpr={mobile ? [1, 1.3] : [1, 1.7]}
      gl={{ antialias: !mobile, powerPreference: "high-performance", alpha: false }}
      camera={{ position: [0, 2.5, 17], fov: 40, near: 0.05, far: 120 }}
      onCreated={({ gl, scene }) => {
        gl.setClearColor("#04060a", 1);
        scene.fog = null;
      }}
    >
      <ambientLight intensity={0.22} color="#8fb0e0" />
      <directionalLight position={[6, 8, 6]} intensity={1.4} color="#cfe0ff" />
      <directionalLight position={[-8, -3, -6]} intensity={0.5} color="#3f6fc0" />
      <pointLight position={[0, 0, 0]} intensity={mobile ? 6 : 12} distance={16} color="#5b93f0" />
      <spotLight position={[0, 12, -4]} angle={0.7} penumbra={1} intensity={2.2} color="#7ea6ee" />

      <CameraRig progressRef={progressRef} pointerRef={pointerRef} />
      <Atmosphere progressRef={progressRef} pointerRef={pointerRef} mobile={mobile} />
      <ElevateEngine progressRef={progressRef} pointerRef={pointerRef} mobile={mobile} />
    </Canvas>
  );
}
