"use client";

import { useEffect, useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Environment, Lightformer, Sparkles } from "@react-three/drei";
import * as THREE from "three";

function RingPair() {
  const group = useRef(null);
  const pointer = useRef({ x: 0, y: 0 });
  const reducedMotion = useRef(false);

  useEffect(() => {
    const media = window.matchMedia("(prefers-reduced-motion: reduce)");
    const setMotionPreference = () => {
      reducedMotion.current = media.matches;
    };
    const handlePointer = (event) => {
      pointer.current.x = (event.clientX / window.innerWidth - 0.5) * 0.2;
      pointer.current.y = (event.clientY / window.innerHeight - 0.5) * 0.16;
    };

    setMotionPreference();
    media.addEventListener("change", setMotionPreference);
    window.addEventListener("pointermove", handlePointer, { passive: true });

    return () => {
      media.removeEventListener("change", setMotionPreference);
      window.removeEventListener("pointermove", handlePointer);
    };
  }, []);

  useFrame(({ clock }) => {
    if (!group.current) return;
    const t = clock.getElapsedTime();
    const scrollDrift = Math.min(window.scrollY / 4000, 0.12);
    const motion = reducedMotion.current ? 0 : 1;
    group.current.rotation.x = THREE.MathUtils.lerp(
      group.current.rotation.x,
      0.12 + pointer.current.y + scrollDrift,
      0.035
    );
    group.current.rotation.y = THREE.MathUtils.lerp(
      group.current.rotation.y,
      pointer.current.x + (Math.sin(t * 0.18) * 0.12 * motion),
      0.035
    );
    group.current.rotation.z = Math.sin(t * 0.22) * 0.035 * motion;
    group.current.position.y = Math.sin(t * 0.55) * 0.055 * motion;
  });

  return (
    <group ref={group} position={[0, 0, 0]}>
      <mesh position={[-0.48, 0, 0]} rotation={[0.2, 0.55, -0.55]}>
        <torusGeometry args={[0.82, 0.075, 12, 72]} />
        <meshStandardMaterial
          color="#e8b44c"
          metalness={1}
          roughness={0.17}
          envMapIntensity={1.8}
        />
      </mesh>
      <mesh position={[0.48, 0, 0.02]} rotation={[0.2, -0.55, 0.55]}>
        <torusGeometry args={[0.82, 0.075, 12, 72]} />
        <meshStandardMaterial
          color="#f3cf7a"
          metalness={1}
          roughness={0.2}
          envMapIntensity={1.8}
        />
      </mesh>
    </group>
  );
}

export default function Rings() {
  return (
    <div className="rings-canvas" aria-hidden="true">
      <Canvas
        dpr={[1, 2]}
        camera={{ position: [0, 0, 5.2], fov: 40 }}
        gl={{ alpha: true, antialias: true, powerPreference: "low-power" }}
      >
        <ambientLight intensity={0.55} />
        <directionalLight position={[2, 3, 4]} intensity={1.7} />
        <RingPair />
        <Sparkles
          count={36}
          scale={[4.2, 4.2, 1.8]}
          size={2.2}
          speed={0.18}
          opacity={0.7}
          color="#f2cb73"
        />
        <Environment resolution={128}>
          <Lightformer
            form="rect"
            intensity={3}
            position={[-3, 2, 2]}
            scale={[4, 3, 1]}
          />
          <Lightformer
            form="rect"
            intensity={2.5}
            position={[3, 1, 1]}
            scale={[2, 4, 1]}
          />
          <Lightformer
            form="ring"
            intensity={2}
            position={[0, 4, -2]}
            scale={3}
          />
        </Environment>
      </Canvas>
    </div>
  );
}
