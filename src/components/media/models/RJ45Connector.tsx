/**
 * Enhanced RJ45 Connector 3D Model
 * Interactive 3D visualization with rotation, zoom, and labels
 */

import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { Text } from '@react-three/drei';
import type * as THREE from 'three';

interface RJ45ConnectorProps {
  rotation?: number;
  autoRotate?: boolean;
  showLabels?: boolean;
  scale?: number;
}

export function RJ45Connector({
  rotation = 0,
  autoRotate = false,
  showLabels = false,
  scale = 1
}: RJ45ConnectorProps) {
  const groupRef = useRef<THREE.Group>(null);

  useFrame((state) => {
    if (groupRef.current && autoRotate) {
      groupRef.current.rotation.y = state.clock.getElapsedTime() * 0.5;
    } else if (groupRef.current) {
      groupRef.current.rotation.y = rotation;
    }
  });

  // Pin colors (T568B standard)
  const pinColors = [
    '#FFA500', // 1: orange-white
    '#FF8C00', // 2: orange
    '#90EE90', // 3: green-white
    '#0000FF', // 4: blue
    '#87CEEB', // 5: blue-white
    '#00FF00', // 6: green
    '#D2691E', // 7: brown-white
    '#8B4513'  // 8: brown
  ];

  // Pin labels for reference: ['TX+', 'TX-', 'RX+', 'Unused', 'Unused', 'RX-', 'Unused', 'Unused']

  return (
    <group ref={groupRef} scale={scale}>
      {/* Main transparent body */}
      <mesh position={[0, 0, 0]}>
        <boxGeometry args={[1.5, 2.2, 2.8]} />
        <meshStandardMaterial
          color="#CCCCCC"
          transparent
          opacity={0.6}
          roughness={0.3}
          metalness={0.1}
        />
      </mesh>

      {/* 8 pins with individual colors */}
      {pinColors.map((color, i) => (
        <group key={i}>
          <mesh position={[-0.525 + i * 0.15, -0.8, 0]}>
            <boxGeometry args={[0.15, 1.5, 0.1]} />
            <meshStandardMaterial
              color={color}
              roughness={0.4}
              metalness={0.6}
            />
          </mesh>

          {/* Pin labels */}
          {showLabels && (
            <Text
              position={[-0.525 + i * 0.15, -1.8, 0]}
              fontSize={0.15}
              color="white"
              anchorX="center"
              anchorY="middle"
            >
              {i + 1}
            </Text>
          )}
        </group>
      ))}

      {/* Latch mechanism */}
      <mesh position={[0, 1.25, 0]}>
        <boxGeometry args={[1.2, 0.3, 1.5]} />
        <meshStandardMaterial
          color="#666666"
          roughness={0.5}
          metalness={0.4}
        />
      </mesh>

      {/* Main label */}
      {showLabels && (
        <Text
          position={[0, 2.5, 0]}
          fontSize={0.3}
          color="white"
          anchorX="center"
          anchorY="middle"
        >
          RJ45
        </Text>
      )}
    </group>
  );
}
