"use client";

import { useFrame } from "@react-three/fiber";
import { useRef } from "react";
import type { Group } from "three";

const GRAVITY = 28;
const FLOOR_Y = 0;
const BLADE_SPIN = 22;
const FAN_SCALE = 2.8;
const START_Y = 14;
const GUARD_SPOKES = 14;

type FallingFanProps = {
  onImpact?: () => void;
};

function FanGuard({ z, radius }: { z: number; radius: number }) {
  return (
    <group position={[0, 0, z]}>
      <mesh>
        <torusGeometry args={[radius, 0.022, 10, 48]} />
        <meshStandardMaterial color="#a8b4c4" metalness={0.85} roughness={0.15} />
      </mesh>
      {Array.from({ length: GUARD_SPOKES }, (_, i) => {
        const angle = (i * Math.PI * 2) / GUARD_SPOKES;
        return (
          <mesh key={i} rotation={[0, 0, angle]} position={[0, 0, 0]}>
            <mesh position={[radius * 0.5, 0, 0]}>
              <boxGeometry args={[radius, 0.018, 0.018]} />
              <meshStandardMaterial color="#94a3b8" metalness={0.8} roughness={0.2} />
            </mesh>
          </mesh>
        );
      })}
    </group>
  );
}

function DeskFanModel({ bladesRef }: { bladesRef: React.RefObject<Group | null> }) {
  return (
    <group>
      {/* Weighted base */}
      <mesh position={[0, 0.06, 0]} castShadow>
        <cylinderGeometry args={[0.5, 0.55, 0.12, 32]} />
        <meshStandardMaterial color="#1f2937" metalness={0.35} roughness={0.55} />
      </mesh>
      <mesh position={[0, 0.13, 0]} rotation={[Math.PI / 2, 0, 0]} castShadow>
        <torusGeometry args={[0.52, 0.03, 12, 48]} />
        <meshStandardMaterial color="#374151" metalness={0.5} roughness={0.4} />
      </mesh>

      {/* Control knobs */}
      <mesh position={[-0.18, 0.14, 0.22]} castShadow>
        <cylinderGeometry args={[0.04, 0.04, 0.05, 12]} />
        <meshStandardMaterial color="#6b7280" metalness={0.6} roughness={0.35} />
      </mesh>
      <mesh position={[0.18, 0.14, 0.22]} castShadow>
        <cylinderGeometry args={[0.035, 0.035, 0.04, 12]} />
        <meshStandardMaterial color="#6b7280" metalness={0.6} roughness={0.35} />
      </mesh>

      {/* Neck */}
      <mesh position={[0, 0.42, -0.02]} castShadow>
        <cylinderGeometry args={[0.055, 0.065, 0.38, 16]} />
        <meshStandardMaterial color="#4b5563" metalness={0.55} roughness={0.4} />
      </mesh>

      {/* Head — tilted slightly up like a real desk fan */}
      <group position={[0, 0.72, 0.04]} rotation={[-0.22, 0, 0]}>
        {/* Motor housing (rear dome) */}
        <mesh position={[0, 0, -0.14]} castShadow>
          <cylinderGeometry args={[0.44, 0.4, 0.16, 32]} />
          <meshStandardMaterial color="#e2e8f0" metalness={0.65} roughness={0.25} />
        </mesh>
        <mesh position={[0, 0, -0.22]} castShadow>
          <sphereGeometry args={[0.38, 24, 16, 0, Math.PI * 2, 0, Math.PI / 2]} />
          <meshStandardMaterial color="#cbd5e1" metalness={0.6} roughness={0.3} />
        </mesh>

        {/* Rear guard */}
        <FanGuard z={-0.2} radius={0.44} />

        {/* Center hub */}
        <mesh position={[0, 0, 0.02]} castShadow>
          <cylinderGeometry args={[0.09, 0.09, 0.06, 20]} />
          <meshStandardMaterial color="#111827" metalness={0.7} roughness={0.2} />
        </mesh>

        {/* Spinning blades */}
        <group ref={bladesRef} position={[0, 0, 0.04]}>
          {[0, 1, 2].map((i) => (
            <group key={i} rotation={[0, 0, (i * Math.PI * 2) / 3]}>
              <mesh position={[0.2, 0, 0]} rotation={[0.35, 0, 0]} castShadow>
                <boxGeometry args={[0.4, 0.035, 0.14]} />
                <meshStandardMaterial color="#64748b" metalness={0.45} roughness={0.4} />
              </mesh>
            </group>
          ))}
        </group>

        {/* Front guard */}
        <FanGuard z={0.2} radius={0.46} />

        {/* Front badge ring */}
        <mesh position={[0, 0, 0.21]}>
          <torusGeometry args={[0.12, 0.015, 8, 24]} />
          <meshStandardMaterial color="#475569" metalness={0.7} roughness={0.3} />
        </mesh>
      </group>
    </group>
  );
}

export function FallingFan({ onImpact }: FallingFanProps) {
  const root = useRef<Group>(null);
  const blades = useRef<Group>(null);
  const y = useRef(START_Y);
  const velocity = useRef(0);
  const landed = useRef(false);
  const impactFired = useRef(false);

  useFrame((_, delta) => {
    if (blades.current) {
      blades.current.rotation.z += delta * BLADE_SPIN;
    }

    if (!root.current || landed.current) return;

    velocity.current -= GRAVITY * delta;
    y.current += velocity.current * delta;

    if (y.current <= FLOOR_Y) {
      y.current = FLOOR_Y;
      if (velocity.current < -5) {
        velocity.current *= -0.28;
      } else {
        landed.current = true;
        velocity.current = 0;
        if (!impactFired.current) {
          impactFired.current = true;
          onImpact?.();
        }
      }
    }

    root.current.position.y = y.current;
  });

  return (
    <group ref={root} position={[0, START_Y, 0]} scale={FAN_SCALE}>
      <DeskFanModel bladesRef={blades} />
    </group>
  );
}
