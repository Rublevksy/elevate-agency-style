import { type RefObject } from "react";
import { Canvas } from "@react-three/fiber";
import { Environment, Lightformer } from "@react-three/drei";
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
      <ambientLight intensity={0.18} color="#8fb0e0" />
      <directionalLight position={[6, 8, 6]} intensity={1.1} color="#cfe0ff" />
      <directionalLight position={[-8, -3, -6]} intensity={0.45} color="#3f6fc0" />
      <pointLight position={[0, 0, 0]} intensity={mobile ? 1.2 : 2.2} distance={12} color="#5b93f0" />

      {/* studio reflections generated in-engine: gives the metal real specular */}
      <Environment resolution={mobile ? 128 : 256} frames={1}>
        <color attach="background" args={["#04060a"]} />
        <Lightformer form="rect" intensity={4} color="#cfe2ff" scale={[12, 3, 1]} position={[0, 6, -8]} rotation={[0.3, 0, 0]} />
        <Lightformer form="rect" intensity={2} color="#4a7fd6" scale={[10, 8, 1]} position={[-9, 1, 4]} rotation={[0, Math.PI / 2.2, 0]} />
        <Lightformer form="rect" intensity={1.4} color="#8fb2e8" scale={[8, 6, 1]} position={[9, -2, 2]} rotation={[0, -Math.PI / 2.2, 0]} />
        <Lightformer form="circle" intensity={3} color="#ffffff" scale={4} position={[3, 5, 6]} />
      </Environment>


      <CameraRig progressRef={progressRef} pointerRef={pointerRef} />
      <Atmosphere progressRef={progressRef} pointerRef={pointerRef} mobile={mobile} />
      <ElevateEngine progressRef={progressRef} pointerRef={pointerRef} mobile={mobile} />
    </Canvas>
  );
}
