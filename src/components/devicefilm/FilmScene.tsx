import { useRef } from "react";
import { Canvas } from "@react-three/fiber";
import { Environment, Lightformer } from "@react-three/drei";
import type { Group } from "three";
import { ACESFilmicToneMapping } from "three";
import { Laptop } from "./Laptop";
import { FilmCamera } from "./FilmCamera";

/**
 * One canvas, one camera, one scroll-driven shot. Product-commercial lighting:
 * a large soft key, a cool rim, and in-engine studio lightformers so the
 * aluminium and glass get real specular structure instead of flat shading.
 */
export default function FilmScene({
  progress,
  pointer,
  mobile,
}: {
  progress: React.RefObject<number>;
  pointer: React.RefObject<{ x: number; y: number }>;
  mobile: boolean;
}) {
  const screenRef = useRef<Group>(null);

  return (
    <Canvas
      dpr={mobile ? [1, 1.5] : [1, 2]}
      gl={{ antialias: true, alpha: true, powerPreference: "high-performance" }}
      camera={{ fov: mobile ? 34 : 30, position: [0, 12, 70], near: 0.1, far: 400 }}
      onCreated={({ gl }) => {
        gl.toneMapping = ACESFilmicToneMapping;
        gl.toneMappingExposure = 1.02;
      }}
      style={{ position: "absolute", inset: 0 }}
    >
      <ambientLight intensity={0.3} color="#8ea9d4" />
      <directionalLight position={[26, 34, 30]} intensity={3.4} color="#eef4ff" />
      <directionalLight position={[-34, 10, -18]} intensity={1.1} color="#3b6ec4" />
      <directionalLight position={[-16, 26, 26]} intensity={1.3} color="#b9cdf0" />
      {/* subtle blue rim: separates the graphite chassis from the dark environment */}
      <directionalLight position={[0, 6, -40]} intensity={1.5} color="#2f6ed0" />
      {/* restrained keyboard illumination — light spilling off the deck */}
      <pointLight position={[0, 6, 8]} intensity={mobile ? 12 : 22} distance={34} decay={2.2} color="#cfe0ff" />


      <Environment resolution={mobile ? 128 : 256} frames={1}>
        <color attach="background" args={["#05070c"]} />
        {/* the classic product-shot softbox above the device */}
        <Lightformer form="rect" intensity={5} color="#dbe7ff" scale={[42, 10, 1]} position={[0, 34, -14]} rotation={[0.42, 0, 0]} />
        {/* long side strips give the machined edges their highlight line */}
        <Lightformer form="rect" intensity={2.6} color="#7ea3dd" scale={[30, 16, 1]} position={[-34, 8, 12]} rotation={[0, Math.PI / 2.1, 0]} />
        <Lightformer form="rect" intensity={1.9} color="#a9c2e8" scale={[26, 14, 1]} position={[34, -2, 10]} rotation={[0, -Math.PI / 2.1, 0]} />
        <Lightformer form="circle" intensity={2.4} color="#ffffff" scale={12} position={[14, 20, 34]} />
      </Environment>

      <FilmCamera progress={progress} pointer={pointer} screenRef={screenRef} mobile={mobile} />
      <Laptop progress={progress} screenRef={screenRef} mobile={mobile} />
    </Canvas>
  );
}
