import { ContactShadows, Environment, Lightformer } from "@react-three/drei";

/**
 * Controlled dark-studio lighting: soft top box light, two rim strips along the
 * aluminium edges, one cool fill. No neon, no glows, no particles.
 */
export function Lighting() {
  return (
    <>
      <ambientLight intensity={0.55} />
      <directionalLight position={[18, 26, 14]} intensity={2.6} color="#dfe8f5" />
      <directionalLight position={[-22, 10, -12]} intensity={1.3} color="#9fb6d4" />

      {/* local environment — built from lightformers, no remote HDRI fetch */}
      <Environment resolution={256} frames={1} background={false}>
        <color attach="background" args={["#05070a"]} />
        <Lightformer form="rect" intensity={7} position={[0, 16, 4]} rotation={[-Math.PI / 2, 0, 0]} scale={[40, 30, 1]} color="#eaf1fb" />
        <Lightformer form="rect" intensity={2.2} position={[0, 6, 22]} rotation={[0, 0, 0]} scale={[36, 20, 1]} color="#c3d2e6" />
        <Lightformer form="rect" intensity={5} position={[-14, 4, 4]} rotation={[0, Math.PI / 2.4, 0]} scale={[16, 6, 1]} color="#b9cbe4" />
        <Lightformer form="rect" intensity={4.2} position={[14, 3, -4]} rotation={[0, -Math.PI / 2.4, 0]} scale={[16, 5, 1]} color="#8fa6c4" />
        <Lightformer form="circle" intensity={1.4} position={[0, -6, 10]} scale={10} color="#3c4a5e" />
      </Environment>

      <spotLight position={[0, 34, 26]} angle={0.6} penumbra={1} intensity={220} color="#e8f0fb" distance={90} />

      <ContactShadows
        position={[0, 0.002, 0]}
        opacity={0.6}
        scale={70}
        blur={2.6}
        far={12}
        resolution={512}
        color="#000000"
      />
    </>
  );
}
