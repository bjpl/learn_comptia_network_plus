/**
 * Fiber Optic Connector 3D Models (SC, LC, ST, MTRJ)
 * Interactive 3D visualizations with rotation, zoom, and labels
 */

import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { Text } from '@react-three/drei';
import type * as THREE from 'three';

interface FiberConnectorProps {
  type: 'SC' | 'LC' | 'ST' | 'MTRJ';
  rotation?: number;
  autoRotate?: boolean;
  showLabels?: boolean;
  scale?: number;
}

export function FiberOpticConnector({
  type,
  rotation = 0,
  autoRotate = false,
  showLabels = false,
  scale = 1
}: FiberConnectorProps) {
  const groupRef = useRef<THREE.Group>(null);

  useFrame((state) => {
    if (groupRef.current && autoRotate) {
      groupRef.current.rotation.y = state.clock.getElapsedTime() * 0.5;
    } else if (groupRef.current) {
      groupRef.current.rotation.y = rotation;
    }
  });

  const renderSC = () => (
    <>
      {/* SC Main body (square) */}
      <mesh position={[0, 0, 0]}>
        <boxGeometry args={[2.5, 2.5, 4]} />
        <meshStandardMaterial
          color="#4a90e2"
          roughness={0.3}
          metalness={0.2}
        />
      </mesh>

      {/* Ferrule */}
      <mesh position={[0, 0, 2.5]} rotation={[0, 0, Math.PI / 2]}>
        <cylinderGeometry args={[0.125, 0.125, 1, 32]} />
        <meshStandardMaterial
          color="#CCCCCC"
          roughness={0.2}
          metalness={0.8}
        />
      </mesh>

      {/* Push-pull latch */}
      <mesh position={[0, 1.5, 0]}>
        <boxGeometry args={[1.5, 0.5, 3]} />
        <meshStandardMaterial
          color="#333333"
          roughness={0.4}
          metalness={0.3}
        />
      </mesh>
    </>
  );

  const renderLC = () => (
    <>
      {/* LC Main body (smaller, rectangular) */}
      <mesh position={[0, 0, 0]}>
        <boxGeometry args={[1.25, 1.8, 3.5]} />
        <meshStandardMaterial
          color="#4a90e2"
          roughness={0.3}
          metalness={0.2}
        />
      </mesh>

      {/* Ferrule */}
      <mesh position={[0, 0, 2]} rotation={[0, 0, Math.PI / 2]}>
        <cylinderGeometry args={[0.125, 0.125, 0.8, 32]} />
        <meshStandardMaterial
          color="#CCCCCC"
          roughness={0.2}
          metalness={0.8}
        />
      </mesh>

      {/* Latch mechanism */}
      <mesh position={[0, 1, 0]}>
        <boxGeometry args={[0.8, 0.3, 2.5]} />
        <meshStandardMaterial
          color="#666666"
          roughness={0.4}
          metalness={0.5}
        />
      </mesh>
    </>
  );

  const renderST = () => (
    <>
      {/* ST Main body (cylindrical) */}
      <mesh rotation={[0, 0, Math.PI / 2]}>
        <cylinderGeometry args={[1.5, 1.5, 4, 32]} />
        <meshStandardMaterial
          color="#4a90e2"
          roughness={0.3}
          metalness={0.2}
        />
      </mesh>

      {/* Bayonet pins */}
      <mesh position={[0, 1.8, 1]}>
        <boxGeometry args={[0.3, 0.8, 0.3]} />
        <meshStandardMaterial
          color="#888888"
          roughness={0.3}
          metalness={0.7}
        />
      </mesh>
      <mesh position={[0, 1.8, -1]}>
        <boxGeometry args={[0.3, 0.8, 0.3]} />
        <meshStandardMaterial
          color="#888888"
          roughness={0.3}
          metalness={0.7}
        />
      </mesh>

      {/* Ferrule */}
      <mesh position={[2.5, 0, 0]} rotation={[0, 0, Math.PI / 2]}>
        <cylinderGeometry args={[0.125, 0.125, 1, 32]} />
        <meshStandardMaterial
          color="#CCCCCC"
          roughness={0.2}
          metalness={0.8}
        />
      </mesh>
    </>
  );

  const renderMTRJ = () => (
    <>
      {/* MTRJ Main body (rectangular, similar to LC but wider) */}
      <mesh position={[0, 0, 0]}>
        <boxGeometry args={[1.8, 1.8, 3.5]} />
        <meshStandardMaterial
          color="#2c3e50"
          roughness={0.3}
          metalness={0.2}
        />
      </mesh>

      {/* Dual ferrules */}
      <mesh position={[0.4, 0, 2]} rotation={[0, 0, Math.PI / 2]}>
        <cylinderGeometry args={[0.125, 0.125, 0.8, 32]} />
        <meshStandardMaterial
          color="#CCCCCC"
          roughness={0.2}
          metalness={0.8}
        />
      </mesh>
      <mesh position={[-0.4, 0, 2]} rotation={[0, 0, Math.PI / 2]}>
        <cylinderGeometry args={[0.125, 0.125, 0.8, 32]} />
        <meshStandardMaterial
          color="#CCCCCC"
          roughness={0.2}
          metalness={0.8}
        />
      </mesh>

      {/* Latch */}
      <mesh position={[0, 1, 0]}>
        <boxGeometry args={[1.2, 0.3, 2.5]} />
        <meshStandardMaterial
          color="#666666"
          roughness={0.4}
          metalness={0.5}
        />
      </mesh>
    </>
  );

  return (
    <group ref={groupRef} scale={scale}>
      {type === 'SC' && renderSC()}
      {type === 'LC' && renderLC()}
      {type === 'ST' && renderST()}
      {type === 'MTRJ' && renderMTRJ()}

      {/* Label */}
      {showLabels && (
        <Text
          position={[0, 3, 0]}
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
