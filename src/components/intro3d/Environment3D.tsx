import { useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { AdditiveBlending, CanvasTexture, type Group, type MeshBasicMaterial, type PointLight, type Points } from "three";
import { CLOSED_END, DEVICE, OPEN_END, ROTATION_END, clamp01, range, smoothstep } from "./constants";

/**
 * The environment the product lives in: pure suspended space. No floor, no
 * platform, no horizon — only atmospheric haze and a whisper of dust, so the
 * device reads as floating. The deep gradient and light field behind it are
 * composited in the DOM layers underneath the transparent canvas.
 */
export function Environment3D({ stage }: { stage: React.RefObject<number> }) {
  return (
    <group>
      <Haze stage={stage} />
      <Dust />
      <ContactSmudge stage={stage} />
    </group>
  );
}

/* ---------------- atmospheric haze ---------------- */

function Haze({ stage }: { stage: React.RefObject<number> }) {
  const group = useRef<Group>(null);
  const tex = useMemo(() => {
    if (typeof document === "undefined") return null;
    const c = document.createElement("canvas");
    c.width = c.height = 128;
    const ctx = c.getContext("2d")!;
    const g = ctx.createRadialGradient(64, 64, 0, 64, 64, 64);
    g.addColorStop(0, "rgba(140,175,220,0.42)");
    g.addColorStop(0.3, "rgba(70,105,150,0.09)");
    g.addColorStop(1, "rgba(0,0,0,0)");
    ctx.fillStyle = g;
    ctx.fillRect(0, 0, 128, 128);
    return new CanvasTexture(c);
  }, []);

  useFrame((state) => {
    const p = stage.current ?? 0;
    // the environment breathes: cool light lifts slightly as the lid opens
    const lift = smoothstep(CLOSED_END, OPEN_END, p);
    const g = group.current;
    if (!g) return;
    g.children.forEach((child, i) => {
      const m = (child as unknown as { material: { opacity: number } }).material;
      const base = i === 0 ? 0.16 : 0.075;
      m.opacity = base * (0.55 + lift * 0.75);
      child.position.x += Math.sin(state.clock.elapsedTime * 0.05 + i) * 0.004;
    });
  });

  if (!tex) return null;

  return (
    <group ref={group}>
      <mesh position={[-14, DEVICE.H * 1.5, -52]} scale={[68, 40, 1]}>
        <planeGeometry />
        <meshBasicMaterial
          map={tex}
          transparent
          opacity={0.16}
          blending={AdditiveBlending}
          depthWrite={false}
        />
      </mesh>
      <mesh position={[36, DEVICE.H * 0.9, -26]} rotation={[0, -0.5, 0]} scale={[40, 26, 1]}>
        <planeGeometry />
        <meshBasicMaterial
          map={tex}
          transparent
          opacity={0.08}
          blending={AdditiveBlending}
          depthWrite={false}
        />
      </mesh>
      <mesh position={[-38, DEVICE.H * 0.5, -16]} rotation={[0, 0.6, 0]} scale={[34, 22, 1]}>
        <planeGeometry />
        <meshBasicMaterial
          map={tex}
          transparent
          opacity={0.07}
          blending={AdditiveBlending}
          depthWrite={false}
        />
      </mesh>
    </group>
  );
}

/* ---------------- suspended atmosphere beneath the device ---------------- */

/**
 * NOT a floor. A single very soft radial smudge far below the chassis that
 * reads as atmosphere gathering under a floating object — it has no edge, no
 * horizon and no reflection, so no platform is ever implied.
 */
function ContactSmudge({ stage }: { stage: React.RefObject<number> }) {
  const mat = useRef<MeshBasicMaterial>(null);
  const tex = useMemo(() => {
    if (typeof document === "undefined") return null;
    const c = document.createElement("canvas");
    c.width = c.height = 128;
    const ctx = c.getContext("2d")!;
    const g = ctx.createRadialGradient(64, 64, 0, 64, 64, 64);
    g.addColorStop(0, "rgba(0,0,0,0.75)");
    g.addColorStop(0.45, "rgba(0,0,0,0.22)");
    g.addColorStop(1, "rgba(0,0,0,0)");
    ctx.fillStyle = g;
    ctx.fillRect(0, 0, 128, 128);
    return new CanvasTexture(c);
  }, []);

  useFrame(() => {
    const p = stage.current ?? 0;
    if (mat.current) mat.current.opacity = 0.5 * (1 - smoothstep(0.72, 0.9, p));
  });

  if (!tex) return null;
  return (
    <mesh position={[0, -1.4, DEVICE.D * 0.05]} rotation={[-Math.PI / 2, 0, 0]} scale={[DEVICE.W * 1.5, DEVICE.D * 1.6, 1]}>
      <planeGeometry />
      <meshBasicMaterial ref={mat} map={tex} transparent opacity={0.5} depthWrite={false} />
    </mesh>
  );
}

/* ---------------- barely-there dust ---------------- */

function Dust() {
  const ref = useRef<Points>(null);
  const positions = useMemo(() => {
    const n = 220;
    const arr = new Float32Array(n * 3);
    for (let i = 0; i < n; i++) {
      arr[i * 3] = (Math.random() - 0.5) * 150;
      arr[i * 3 + 1] = Math.random() * 55 + 1;
      arr[i * 3 + 2] = (Math.random() - 0.5) * 110 - 6;
    }
    return arr;
  }, []);

  useFrame((state) => {
    if (ref.current) ref.current.rotation.y = state.clock.elapsedTime * 0.008;
  });

  return (
    <points ref={ref}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
      </bufferGeometry>
      <pointsMaterial
        size={0.16}
        sizeAttenuation
        color="#9db4d0"
        transparent
        opacity={0.34}
        blending={AdditiveBlending}
        depthWrite={false}
      />
    </points>
  );
}

/**
 * Light emitted BY the display: off while the lid is shut, dominant once the
 * interface is live. This is what makes the screen feel like a light source.
 */
export function ScreenLight({ stage }: { stage: React.RefObject<number> }) {
  const ref = useRef<PointLight>(null);
  useFrame(() => {
    const p = stage.current ?? 0;
    const on = smoothstep(ROTATION_END, OPEN_END, p);
    const bloom = clamp01(on + range(OPEN_END, 1, p) * 0.6);
    if (ref.current) ref.current.intensity = 260 * bloom;
  });
  return (
    <pointLight
      ref={ref}
      position={[0, DEVICE.H * 0.75, DEVICE.D * 0.35]}
      color="#8fb4e6"
      distance={70}
      decay={1.6}
      intensity={0}
    />
  );
}
