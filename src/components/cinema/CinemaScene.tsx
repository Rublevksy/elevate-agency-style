import { type RefObject } from "react";
import { Canvas } from "@react-three/fiber";
import { Environment, Lightformer } from "@react-three/drei";
import { ElevatePlanet } from "./ElevatePlanet";
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
      dpr={mobile ? [1, 1.3] : [1, 1.75]}
      gl={{ antialias: !mobile, powerPreference: "high-performance", alpha: false }}
      camera={{ position: [0, 1.9, 15], fov: 38, near: 0.05, far: 160 }}
      onCreated={({ gl, scene }) => {
        gl.setClearColor("#04060a", 1);
        scene.fog = null;
      }}
    >
      {/* cinematic key / fill / rim: deep shadow regions, cool white highlight */}
      <ambientLight intensity={0.1} color="#7f9fd0" />
      <directionalLight position={[7, 5.5, 6]} intensity={2.4} color="#e6efff" />
      <directionalLight position={[-9, -2.5, -5]} intensity={0.5} color="#2f5da8" />
      <directionalLight position={[-5, 3, -8]} intensity={1.15} color="#6f9ff0" />

      {/* studio reflections generated in-engine: real specular on the surface */}
      <Environment resolution={mobile ? 128 : 256} frames={1}>
        <color attach="background" args={["#04060a"]} />
        <Lightformer form="rect" intensity={4} color="#cfe2ff" scale={[12, 3, 1]} position={[0, 6, -8]} rotation={[0.3, 0, 0]} />
        <Lightformer form="rect" intensity={2} color="#4a7fd6" scale={[10, 8, 1]} position={[-9, 1, 4]} rotation={[0, Math.PI / 2.2, 0]} />
        <Lightformer form="rect" intensity={1.4} color="#8fb2e8" scale={[8, 6, 1]} position={[9, -2, 2]} rotation={[0, -Math.PI / 2.2, 0]} />
        <Lightformer form="circle" intensity={3} color="#ffffff" scale={4} position={[5, 5, 6]} />
      </Environment>

      <CameraRig progressRef={progressRef} pointerRef={pointerRef} />
      <Atmosphere progressRef={progressRef} pointerRef={pointerRef} mobile={mobile} />
      <ElevatePlanet progressRef={progressRef} pointerRef={pointerRef} mobile={mobile} />
    </Canvas>
  );
}
