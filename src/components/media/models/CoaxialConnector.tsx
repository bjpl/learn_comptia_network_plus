/**
 * Coaxial Connector 3D Models (F-type, BNC)
 * Interactive 3D visualizations with rotation, zoom, and labels
 */

import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { Text } from '@react-three/drei';
import * as THREE from 'three';

interface CoaxialConnectorProps {
  type: 'F-type' | 'BNC';
  rotation?: number;
  autoRotate?: boolean;
  showLabels?: boolean;
  scale?: number;
}

export function CoaxialConnector({
  type,
  rotation = 0,
  autoRotate = false,
  showLabels = false,
  scale = 1
}: CoaxialConnectorProps) {
  const groupRef = useRef<THREE.Group>(null);

  useFrame((state) => {
    if (groupRef.current && autoRotate) {
      groupRef.current.rotation.y = state.clock.getElapsedTime() * 0.5;
    } else if (groupRef.current) {
      groupRef.current.rotation.y = rotation;
    }
  });

  const renderFType = () => (
    <>
      {/* Main body (cylindrical with threads) */}
      <mesh rotation={[0, 0, Math.PI / 2]}>
        <cylinderGeometry args={[0.8, 0.8, 3, 32]} />
        <meshStandardMaterial
          color="#C0C0C0"
          roughness={0.3}
          metalness={0.8}
        />
      </mesh>

      {/* Thread rings (simplified representation) */}
      {[...Array(8)].map((_, i) => (
        <mesh
          key={i}
          rotation={[0, Math.PI / 2, 0]}
          position={[-1.2 + i * 0.3, 0, 0]}
        >
          <torusGeometry args={[0.85, 0.08, 8, 32]} />
          <meshStandardMaterial
            color="#A0A0A0"
            roughness={0.4}
            metalness={0.7}
          />
        </mesh>
      ))}

      {/* Center pin */}
      <mesh position={[2, 0, 0]} rotation={[0, 0, Math.PI / 2]}>
        <cylinderGeometry args={[0.15, 0.15, 1.5, 16]} />
        <meshStandardMaterial
          color="#FFD700"
          roughness={0.2}
          metalness={0.9}
        />
      </mesh>
    </>
  );

  const renderBNC = () => (
    <>
      {/* Main body */}
      <mesh rotation={[0, 0, Math.PI / 2]}>
        <cylinderGeometry args={[0.9, 0.9, 3.5, 32]} />
        <meshStandardMaterial
          color="#404040"
          roughness={0.3}
          metalness={0.7}
        />
      </mesh>

      {/* Bayonet pins */}
      <mesh position={[1.2, 1.1, 0]}>
        <boxGeometry args={[0.2, 0.6, 0.2]} />
        <meshStandardMaterial
          color="#888888"
          roughness={0.3}
          metalness={0.8}
        />
      </mesh>
      <mesh position={[1.2, -1.1, 0]}>
        <boxGeometry args={[0.2, 0.6, 0.2]} />
        <meshStandardMaterial
          color="#888888"
          roughness={0.3}
          metalness={0.8}
        />
      </mesh>

      {/* Center pin */}
      <mesh position={[2.3, 0, 0]} rotation={[0, 0, Math.PI / 2]}>
        <cylinderGeometry args={[0.15, 0.15, 1.2, 16]} />
        <meshStandardMaterial
          color="#FFD700"
          roughness={0.2}
          metalness={0.9}
        />
      </mesh>

      {/* Outer sleeve */}
      <mesh rotation={[0, 0, Math.PI / 2]} position={[0.5, 0, 0]}>
        <cylinderGeometry args={[1.1, 1.1, 1.5, 32]} />
        <meshStandardMaterial
          color="#606060"
          roughness={0.4}
          metalness={0.6}
          transparent
          opacity={0.8}
        />
      </mesh>
    </>
  );

  return (
    <group ref={groupRef} scale={scale}>
      {type === 'F-type' && renderFType()}
      {type === 'BNC' && renderBNC()}

      {/* Label */}
      {showLabels && (
        <Text
          position={[0, 2, 0]}
          fontSize={0.4}
          color="white"
          anchorX="center"
          anchorY="middle"
        >
          {type}
        </Text>
      )}
    </group>
  );
}
