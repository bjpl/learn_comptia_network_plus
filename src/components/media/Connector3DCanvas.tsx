/**
 * Connector 3D Canvas Component
 * Separated Three.js canvas component for better code splitting
 */

import { useRef, Suspense } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, PerspectiveCamera, Grid } from '@react-three/drei';
import * as THREE from 'three';
import { CONNECTOR_GEOMETRIES } from './connector-models';
import type { ConnectorType } from './media-types';

interface Connector3DProps {
  connectorId: ConnectorType;
  xrayMode: boolean;
  rotation: number;
}

function Connector3D({ connectorId, xrayMode, rotation }: Connector3DProps) {
  const groupRef = useRef<THREE.Group>(null);
  const geometry = CONNECTOR_GEOMETRIES[connectorId];

  useFrame(() => {
    if (groupRef.current) {
      groupRef.current.rotation.y = rotation;

      // Apply X-Ray effect to all meshes in the group
      groupRef.current.traverse((child) => {
        if (child instanceof THREE.Mesh && child.material) {
          const material = child.material as THREE.MeshStandardMaterial;
          if (xrayMode) {
            material.transparent = true;
            material.opacity = 0.3;
            material.wireframe = true;
            material.emissive.setHex(0x00ff00);
            material.emissiveIntensity = 0.2;
          } else {
            material.transparent = false;
            material.opacity = 1;
            material.wireframe = false;
            material.emissive.setHex(0x000000);
            material.emissiveIntensity = 0;
          }
          material.needsUpdate = true;
        }
      });
    }
  });

  if (!geometry) {
    return null;
  }

  const connectorGroup = geometry.createGeometry();

  return (
    <group ref={groupRef}>
      <primitive object={connectorGroup} />
    </group>
  );
}

interface Connector3DCanvasProps {
  selectedConnector: ConnectorType;
  comparisonConnector?: ConnectorType;
  viewMode: 'normal' | 'xray' | 'comparison';
  xrayMode: boolean;
  rotation: number;
  zoom: number;
}

export function Connector3DCanvas({
  selectedConnector,
  comparisonConnector,
  viewMode,
  xrayMode,
  rotation,
  zoom,
}: Connector3DCanvasProps) {
  return (
    <Canvas>
      <PerspectiveCamera makeDefault position={[0, 0, 10]} />
      <OrbitControls enableZoom enablePan enableRotate />

      {/* Lighting */}
      <ambientLight intensity={0.5} />
      <directionalLight position={[10, 10, 5]} intensity={1} />
      <directionalLight position={[-10, -10, -5]} intensity={0.5} />
      <pointLight position={[0, 5, 0]} intensity={0.5} />

      {/* Grid */}
      <Grid
        args={[20, 20]}
        cellSize={1}
        cellColor="#888888"
        sectionColor="#444444"
        fadeDistance={30}
      />

      <Suspense fallback={null}>
        {viewMode === 'comparison' && comparisonConnector ? (
          <>
            <group position={[-4, 0, 0]} scale={zoom}>
              <Connector3D
                connectorId={selectedConnector}
                xrayMode={xrayMode}
                rotation={rotation}
              />
            </group>
            <group position={[4, 0, 0]} scale={zoom}>
              <Connector3D
                connectorId={comparisonConnector}
                xrayMode={xrayMode}
                rotation={rotation}
              />
            </group>
          </>
        ) : (
          <group scale={zoom}>
            <Connector3D connectorId={selectedConnector} xrayMode={xrayMode} rotation={rotation} />
          </group>
        )}
      </Suspense>
    </Canvas>
  );
}

export default Connector3DCanvas;
