import { useRef } from "react";
import { ContactShadows, Environment, Lightformer } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import type { DirectionalLight } from "three";
import { CLOSED_END, OPEN_END, lerp, smoothstep } from "./constants";

/**
 * Controlled dark-studio lighting: soft top box light, two rim strips along the
 * aluminium edges, one cool fill. The cool side light lifts slightly as the lid
 * opens so the environment supports the story. No neon, no glows.
 */
export function Lighting({ stage }: { stage: React.RefObject<number> }) {
  const cool = useRef<DirectionalLight>(null);

  useFrame(() => {
    const p = stage.current ?? 0;
    const lift = smoothstep(CLOSED_END, OPEN_END, p);
    if (cool.current) cool.current.intensity = lerp(1.05, 1.9, lift);
  });

  return (
    <>
      <ambientLight intensity={0.3} />
      <directionalLight position={[18, 26, 14]} intensity={2.5} color="#dfe8f5" />
      <directionalLight ref={cool} position={[-22, 10, -12]} intensity={1.05} color="#9fb6d4" />

      {/* local environment — built from lightformers, no remote HDRI fetch */}
      <Environment resolution={256} frames={1} background={false}>
        <color attach="background" args={["#05070a"]} />
        <Lightformer form="rect" intensity={7} position={[0, 16, 4]} rotation={[-Math.PI / 2, 0, 0]} scale={[40, 30, 1]} color="#eaf1fb" />
        <Lightformer form="rect" intensity={2.2} position={[0, 6, 22]} rotation={[0, 0, 0]} scale={[36, 20, 1]} color="#c3d2e6" />
        {/* narrow strips: these are what draw the machined edge highlights */}
        <Lightformer form="rect" intensity={9} position={[-16, 5, 6]} rotation={[0, Math.PI / 2.2, 0]} scale={[18, 1.6, 1]} color="#dce7f6" />
        <Lightformer form="rect" intensity={7} position={[16, 4, -5]} rotation={[0, -Math.PI / 2.2, 0]} scale={[18, 1.3, 1]} color="#a8bedd" />
        <Lightformer form="circle" intensity={1.3} position={[0, -6, 10]} scale={10} color="#33415a" />
      </Environment>

      <spotLight position={[0, 34, 26]} angle={0.6} penumbra={1} intensity={170} color="#e8f0fb" distance={60} />

      <ContactShadows
        position={[0, 0.004, 0]}
        opacity={0.72}
        scale={62}
        blur={2.2}
        far={11}
        resolution={512}
        color="#000000"
      />
    </>
  );
}
