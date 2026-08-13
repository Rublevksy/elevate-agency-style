import { ContactShadows, Environment, Lightformer } from "@react-three/drei";

/**
 * Controlled dark-studio lighting: soft top box light, two rim strips along the
 * aluminium edges, one cool fill. No neon, no glows, no particles.
 */
export function Lighting() {
  return (
    <>
      <ambientLight intensity={0.32} />
      <directionalLight position={[18, 26, 14]} intensity={1.1} color="#dfe8f5" />
      <directionalLight position={[-22, 10, -12]} intensity={0.45} color="#9fb6d4" />

      {/* local environment — built from lightformers, no remote HDRI fetch */}
      <Environment resolution={256} frames={1} background={false}>
        <color attach="background" args={["#05070a"]} />
        <Lightformer form="rect" intensity={4.2} position={[0, 12, 6]} rotation={[-Math.PI / 2.1, 0, 0]} scale={[22, 12, 1]} color="#eaf1fb" />
        <Lightformer form="rect" intensity={2.4} position={[-14, 4, 4]} rotation={[0, Math.PI / 2.4, 0]} scale={[16, 6, 1]} color="#b9cbe4" />
        <Lightformer form="rect" intensity={2.0} position={[14, 3, -4]} rotation={[0, -Math.PI / 2.4, 0]} scale={[16, 5, 1]} color="#8fa6c4" />
        <Lightformer form="circle" intensity={0.6} position={[0, -6, 10]} scale={10} color="#3c4a5e" />
      </Environment>

      <ContactShadows
        position={[0, 0.002, 0]}
        opacity={0.72}
        scale={70}
        blur={2.6}
        far={12}
        resolution={512}
        color="#000000"
      />
    </>
  );
}
