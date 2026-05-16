"use client";

import { Canvas } from "@react-three/fiber";
import { Environment, PerspectiveCamera } from "@react-three/drei";
import { Suspense } from "react";
import { FallingFan } from "./FallingFan";

type FanSceneProps = {
  onImpact?: () => void;
};

export function FanScene({ onImpact }: FanSceneProps) {
  return (
    <Canvas
      className="absolute inset-0 z-[5]"
      shadows
      gl={{ antialias: true }}
      style={{ pointerEvents: "none" }}
    >
      <PerspectiveCamera makeDefault position={[0, 0.9, 5.2]} fov={48} />
      <ambientLight intensity={0.45} />
      <directionalLight position={[5, 10, 4]} intensity={1.6} castShadow />
      <spotLight
        position={[0, 8, 2]}
        angle={0.4}
        penumbra={0.5}
        intensity={2}
        castShadow
        color="#fef3c7"
      />

      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.01, 0]} receiveShadow>
        <planeGeometry args={[40, 40]} />
        <meshStandardMaterial color="#0f172a" roughness={0.85} />
      </mesh>

      <Suspense fallback={null}>
        <Environment preset="warehouse" />
        <FallingFan onImpact={onImpact} />
      </Suspense>
    </Canvas>
  );
}
