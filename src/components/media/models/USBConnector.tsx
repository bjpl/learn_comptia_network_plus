/**
 * USB Connector 3D Models (USB-A, USB-C)
 * Interactive 3D visualizations with rotation, zoom, and labels
 */

import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { Text } from '@react-three/drei';
import type * as THREE from 'three';

interface USBConnectorProps {
  type: 'USB-A' | 'USB-C';
  rotation?: number;
  autoRotate?: boolean;
  showLabels?: boolean;
  scale?: number;
}

export function USBConnector({
  type,
  rotation = 0,
  autoRotate = false,
  showLabels = false,
  scale = 1
}: USBConnectorProps) {
  const groupRef = useRef<THREE.Group>(null);

  useFrame((state) => {
    if (groupRef.current && autoRotate) {
      groupRef.current.rotation.y = state.clock.getElapsedTime() * 0.5;
    } else if (groupRef.current) {
      groupRef.current.rotation.y = rotation;
    }
  });

  const renderUSBA = () => (
    <>
      {/* Main body */}
      <mesh position={[0, 0, 0]}>
        <boxGeometry args={[1.5, 0.8, 2.5]} />
        <meshStandardMaterial
          color="#CCCCCC"
          roughness={0.3}
          metalness={0.7}
        />
      </mesh>

      {/* Connector housing */}
      <mesh position={[0, 0, 1.5]}>
        <boxGeometry args={[1.2, 0.5, 1]} />
        <meshStandardMaterial
          color="#404040"
          roughness={0.4}
          metalness={0.5}
        />
      </mesh>

      {/* Pins (simplified as blocks) */}
      <mesh position={[0, -0.1, 1.8]}>
        <boxGeometry args={[0.8, 0.15, 0.3]} />
        <meshStandardMaterial
          color="#FFD700"
          roughness={0.2}
          metalness={0.9}
        />
      </mesh>

      {/* USB trident symbol */}
      <mesh position={[0, 0.5, 0]}>
        <cylinderGeometry args={[0.05, 0.05, 0.6, 16]} />
        <meshStandardMaterial
          color="#333333"
          roughness={0.3}
        />
      </mesh>
    </>
  );

  const renderUSBC = () => (
    <>
      {/* Main body (oval/rounded) */}
      <mesh position={[0, 0, 0]}>
        <boxGeometry args={[0.9, 0.35, 2.5]} />
        <meshStandardMaterial
          color="#CCCCCC"
          roughness={0.3}
          metalness={0.7}
        />
      </mesh>

      {/* Rounded edges (simplified) */}
      <mesh position={[0, 0.175, 0]} rotation={[0, 0, Math.PI / 2]}>
        <cylinderGeometry args={[0.175, 0.175, 0.9, 32]} />
        <meshStandardMaterial
          color="#CCCCCC"
          roughness={0.3}
          metalness={0.7}
        />
      </mesh>
      <mesh position={[0, -0.175, 0]} rotation={[0, 0, Math.PI / 2]}>
        <cylinderGeometry args={[0.175, 0.175, 0.9, 32]} />
        <meshStandardMaterial
          color="#CCCCCC"
          roughness={0.3}
          metalness={0.7}
        />
      </mesh>

      {/* Connector opening */}
      <mesh position={[0, 0, 1.5]}>
        <boxGeometry args={[0.7, 0.25, 0.8]} />
        <meshStandardMaterial
          color="#404040"
          roughness={0.4}
          metalness={0.5}
        />
      </mesh>

      {/* Pins (24-pin arrangement simplified) */}
      <mesh position={[0, 0.05, 1.7]}>
        <boxGeometry args={[0.5, 0.08, 0.3]} />
        <meshStandardMaterial
          color="#FFD700"
          roughness={0.2}
          metalness={0.9}
        />
      </mesh>
      <mesh position={[0, -0.05, 1.7]}>
        <boxGeometry args={[0.5, 0.08, 0.3]} />
        <meshStandardMaterial
          color="#FFD700"
          roughness={0.2}
          metalness={0.9}
        />
      </mesh>
    </>
  );

  return (
    <group ref={groupRef} scale={scale}>
      {type === 'USB-A' && renderUSBA()}
      {type === 'USB-C' && renderUSBC()}

      {/* Label */}
      {showLabels && (
        <Text
          position={[0, 1.5, 0]}
          fontSize={0.3}
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
