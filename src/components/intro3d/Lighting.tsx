import { useRef } from "react";
import { Environment, Lightformer } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import type { DirectionalLight } from "three";
import { CLOSED_END, OPEN_END, lerp, smoothstep } from "./constants";

/**
 * Cinematic product lighting: one soft neutral key from above, a cool blue rim
 * along the far aluminium edge, and a broad reflected fill from the local
 * lightformer environment. Nothing glows; the light only reveals geometry.
 *
 * There is deliberately NO ground plane and no contact-shadow catcher — the
 * device is suspended, so a shadow surface would read as a platform. The only
 * thing beneath it is the atmospheric smudge drawn in Environment3D.
 */
export function Lighting({ stage }: { stage: React.RefObject<number> }) {
  const rim = useRef<DirectionalLight>(null);

  useFrame(() => {
    const p = stage.current ?? 0;
    const lift = smoothstep(CLOSED_END, OPEN_END, p);
    if (rim.current) rim.current.intensity = lerp(1.15, 2.1, lift);
  });

  return (
    <>
      <ambientLight intensity={0.2} />
      {/* soft neutral key */}
      <directionalLight position={[16, 28, 16]} intensity={1.55} color="#e6ecf6" />
      {/* cool blue rim, raking the far edge */}
      <directionalLight ref={rim} position={[-24, 9, -16]} intensity={1.15} color="#7fa4d8" />

      {/* local environment — reflections come from here, no remote HDRI fetch */}
      <Environment resolution={256} frames={1} background={false}>
        <color attach="background" args={["#05070a"]} />
        {/* broad top box light: the long soft highlight across the lid */}
        <Lightformer
          form="rect"
          intensity={3}
          position={[0, 16, 3]}
          rotation={[-Math.PI / 2, 0, 0]}
          scale={[44, 30, 1]}
          color="#eaf1fb"
        />
        <Lightformer form="rect" intensity={0.9} position={[0, 5, 24]} scale={[36, 20, 1]} color="#b9c9df" />
        {/* narrow strips: these draw the machined edge highlights */}
        <Lightformer
          form="rect"
          intensity={5}
          position={[-17, 5, 5]}
          rotation={[0, Math.PI / 2.1, 0]}
          scale={[20, 1.1, 1]}
          color="#dfe9f8"
        />
        <Lightformer
          form="rect"
          intensity={3.6}
          position={[17, 4, -4]}
          rotation={[0, -Math.PI / 2.1, 0]}
          scale={[20, 0.9, 1]}
          color="#8fabd2"
        />
        <Lightformer form="circle" intensity={0.9} position={[0, -8, 12]} scale={12} color="#2b3850" />
      </Environment>

      <spotLight position={[0, 30, 18]} angle={0.4} penumbra={1} intensity={95} color="#e8f0fb" distance={64} />
    </>
  );
}
