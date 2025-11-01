/**
 * Reusable 3D Connector Viewer Component
 * Lazy-loaded with accessibility and performance optimizations
 */

import { Suspense, useState, useCallback, useEffect } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, PerspectiveCamera, Environment } from '@react-three/drei';
import { Button } from '@/components/ui/button';
import { RotateCw, ZoomIn, ZoomOut, Eye, Maximize, Smartphone } from 'lucide-react';
import { RJ45Connector } from './models/RJ45Connector';
import { FiberOpticConnector } from './models/FiberOpticConnector';
import { CoaxialConnector } from './models/CoaxialConnector';
import { useDeviceDetection, getRenderSettings } from './hooks/useDeviceDetection';
import type { ConnectorType } from './media-types';

interface Connector3DViewerProps {
  connectorType: ConnectorType;
  autoRotate?: boolean;
  showLabels?: boolean;
  showControls?: boolean;
  height?: string;
  onToggleFullscreen?: () => void;
}

export default function Connector3DViewer({
  connectorType,
  autoRotate = false,
  showLabels = true,
  showControls = true,
  height = '400px',
  onToggleFullscreen
}: Connector3DViewerProps) {
  const [rotation, setRotation] = useState(0);
  const [zoom, setZoom] = useState(1);
  const [labels, setLabels] = useState(showLabels);
  const capabilities = useDeviceDetection();
  const renderSettings = getRenderSettings(capabilities);

  // Adjust initial zoom for mobile devices
  useEffect(() => {
    if (capabilities.isMobile) {
      setZoom(0.8);
    }
  }, [capabilities.isMobile]);

  const handleRotate = useCallback(() => {
    setRotation((prev) => prev + Math.PI / 4);
  }, []);

  const handleZoomIn = useCallback(() => {
    setZoom((prev) => Math.min(prev + 0.2, 3));
  }, []);

  const handleZoomOut = useCallback(() => {
    setZoom((prev) => Math.max(prev - 0.2, 0.5));
  }, []);

  const handleReset = useCallback(() => {
    setRotation(0);
    setZoom(1);
  }, []);

  const toggleLabels = useCallback(() => {
    setLabels((prev) => !prev);
  }, []);

  const renderConnector = () => {
    switch (connectorType) {
      case 'RJ45':
        return <RJ45Connector rotation={rotation} autoRotate={autoRotate} showLabels={labels} scale={zoom} />;
      case 'RJ11':
        return <RJ45Connector rotation={rotation} autoRotate={autoRotate} showLabels={labels} scale={zoom} />;
      case 'SC':
      case 'LC':
      case 'ST':
      case 'MPO':
        return <FiberOpticConnector type={connectorType as any} rotation={rotation} autoRotate={autoRotate} showLabels={labels} scale={zoom} />;
      case 'F-type':
      case 'BNC':
        return <CoaxialConnector type={connectorType as any} rotation={rotation} autoRotate={autoRotate} showLabels={labels} scale={zoom} />;
      default:
        return <RJ45Connector rotation={rotation} autoRotate={autoRotate} showLabels={labels} scale={zoom} />;
    }
  };

  return (
    <div className="relative">
      <div
        className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-lg overflow-hidden"
        style={{ height }}
        role="img"
        aria-label={`3D visualization of ${connectorType} connector`}
      >
        <Suspense
          fallback={
            <div className="w-full h-full flex items-center justify-center text-white">
              <div className="text-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto mb-4" />
                <p>Loading 3D model...</p>
              </div>
            </div>
          }
        >
          <Canvas
            dpr={renderSettings.dpr}
            shadows={renderSettings.shadows}
            gl={{ antialias: renderSettings.antialias }}
          >
            <PerspectiveCamera makeDefault position={[0, 0, 10]} />
            <OrbitControls
              enableZoom
              enablePan={!capabilities.isMobile}
              enableRotate
              autoRotate={autoRotate}
              autoRotateSpeed={capabilities.isLowEnd ? 1 : 2}
              enableDamping
              dampingFactor={0.05}
              touches={{
                ONE: 0, // TOUCH.ROTATE
                TWO: 2  // TOUCH.DOLLY_PAN
              }}
            />

            {/* Lighting - simplified for low-end devices */}
            <ambientLight intensity={0.5} />
            <directionalLight
              position={[10, 10, 5]}
              intensity={1}
              castShadow={renderSettings.shadows}
            />
            {!capabilities.isLowEnd && (
              <>
                <directionalLight position={[-10, -10, -5]} intensity={0.5} />
                <pointLight position={[0, 5, 0]} intensity={0.5} />
                <spotLight position={[0, 10, 0]} angle={0.3} intensity={0.5} />
              </>
            )}

            {/* Environment for better reflections - skip on low-end */}
            {!capabilities.isLowEnd && <Environment preset="city" />}

            {renderConnector()}
          </Canvas>
        </Suspense>
      </div>

      {/* Controls */}
      {showControls && (
        <div className="flex items-center justify-between mt-4 gap-2 flex-wrap">
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={handleRotate}
              aria-label="Rotate connector 45 degrees"
            >
              <RotateCw className="h-4 w-4 mr-1" />
              Rotate
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={handleZoomIn}
              aria-label="Zoom in"
            >
              <ZoomIn className="h-4 w-4 mr-1" />
              Zoom In
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={handleZoomOut}
              aria-label="Zoom out"
            >
              <ZoomOut className="h-4 w-4 mr-1" />
              Zoom Out
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={toggleLabels}
              aria-label={labels ? 'Hide labels' : 'Show labels'}
            >
              <Eye className="h-4 w-4 mr-1" />
              {labels ? 'Hide' : 'Show'} Labels
            </Button>
            <Button variant="outline" size="sm" onClick={handleReset} aria-label="Reset view">
              Reset
            </Button>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-500">Zoom: {Math.round(zoom * 100)}%</span>
            {onToggleFullscreen && (
              <Button
                variant="outline"
                size="sm"
                onClick={onToggleFullscreen}
                aria-label="Toggle fullscreen"
              >
                <Maximize className="h-4 w-4" />
              </Button>
            )}
          </div>
        </div>
      )}

      {/* Device info and keyboard shortcuts hint */}
      <div className="mt-2 space-y-1">
        {capabilities.isMobile && (
          <div className="flex items-center gap-2 text-xs text-blue-600">
            <Smartphone className="h-3 w-3" />
            <span>Mobile optimized mode active</span>
          </div>
        )}
        <div className="text-xs text-gray-500">
          <p>
            <strong>{capabilities.isMobile ? 'Touch:' : 'Keyboard:'}</strong>{' '}
            {capabilities.isMobile
              ? 'Single finger to rotate | Pinch to zoom'
              : 'Left click + drag to rotate | Right click + drag to pan | Scroll to zoom'}
          </p>
        </div>
      </div>
    </div>
  );
}
