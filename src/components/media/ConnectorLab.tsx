import { useState, useRef, Suspense } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, PerspectiveCamera, Grid } from '@react-three/drei';
import type * as THREE from 'three';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { RotateCw, ZoomIn, ZoomOut, Eye, Grid as GridIcon, Split, Info } from 'lucide-react';
import { CONNECTORS, T568A_LAYOUT, T568B_LAYOUT } from './media-data';
import { CONNECTOR_GEOMETRIES } from './connector-models';
import type { ConnectorType, ViewMode } from './media-types';

interface Connector3DProps {
  connectorId: ConnectorType;
  xrayMode: boolean;
  rotation: number;
}

function Connector3D({ connectorId, rotation }: Connector3DProps) {
  const groupRef = useRef<THREE.Group>(null);
  const geometry = CONNECTOR_GEOMETRIES[connectorId];

  useFrame(() => {
    if (groupRef.current) {
      groupRef.current.rotation.y = rotation;
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

export default function ConnectorLab() {
  const [selectedConnector, setSelectedConnector] = useState<ConnectorType>('RJ45');
  const [viewMode, setViewMode] = useState<ViewMode>('normal');
  const [xrayMode, setXrayMode] = useState(false);
  const [rotation, setRotation] = useState(0);
  const [zoom, setZoom] = useState(1);
  const [comparisonConnector, setComparisonConnector] = useState<ConnectorType>('RJ11');
  // Removed unused showPinLayout state
  const [wiringStandard, setWiringStandard] = useState<'T568A' | 'T568B'>('T568B');

  const connector = CONNECTORS.find((c) => c.id === selectedConnector);
  const comparisonConn = CONNECTORS.find((c) => c.id === comparisonConnector);

  const handleRotate = () => {
    setRotation((prev) => prev + Math.PI / 4);
  };

  const handleZoomIn = () => {
    setZoom((prev) => Math.min(prev + 0.2, 4));
  };

  const handleZoomOut = () => {
    setZoom((prev) => Math.max(prev - 0.2, 0.5));
  };

  const handleReset = () => {
    setRotation(0);
    setZoom(1);
  };

  const fiberConnectors = CONNECTORS.filter((c) => c.type === 'fiber');
  const copperConnectors = CONNECTORS.filter((c) => c.type === 'copper');
  const coaxialConnectors = CONNECTORS.filter((c) => c.type === 'coaxial');

  const pinLayout = wiringStandard === 'T568A' ? T568A_LAYOUT : T568B_LAYOUT;

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card>
        <CardHeader>
          <CardTitle>Connector Identification Laboratory</CardTitle>
          <CardDescription>
            Interactive 3D viewer for network connectors with X-ray mode and comparison tools
          </CardDescription>
        </CardHeader>
      </Card>

      {/* Main Content */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* 3D Viewer */}
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>
                  {viewMode === 'comparison' ? '3D Comparison View' : '3D Connector View'}
                </CardTitle>
                <div className="flex gap-2">
                  <Button
                    variant={viewMode === 'normal' ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setViewMode('normal')}
                  >
                    <Eye className="mr-1 h-4 w-4" />
                    Normal
                  </Button>
                  <Button
                    variant={viewMode === 'xray' ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => {
                      setViewMode('xray');
                      setXrayMode(true);
                    }}
                  >
                    <GridIcon className="mr-1 h-4 w-4" />
                    X-Ray
                  </Button>
                  <Button
                    variant={viewMode === 'comparison' ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setViewMode('comparison')}
                  >
                    <Split className="mr-1 h-4 w-4" />
                    Compare
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="rounded-lg bg-gray-100" style={{ height: '500px' }}>
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
                    {viewMode === 'comparison' ? (
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
                        <Connector3D
                          connectorId={selectedConnector}
                          xrayMode={xrayMode}
                          rotation={rotation}
                        />
                      </group>
                    )}
                  </Suspense>
                </Canvas>
              </div>

              {/* Controls */}
              <div className="mt-4 flex items-center justify-between">
                <div className="flex gap-2">
                  <Button variant="outline" size="sm" onClick={handleRotate}>
                    <RotateCw className="mr-1 h-4 w-4" />
                    Rotate
                  </Button>
                  <Button variant="outline" size="sm" onClick={handleZoomIn}>
                    <ZoomIn className="mr-1 h-4 w-4" />
                    Zoom In
                  </Button>
                  <Button variant="outline" size="sm" onClick={handleZoomOut}>
                    <ZoomOut className="mr-1 h-4 w-4" />
                    Zoom Out
                  </Button>
                  <Button variant="outline" size="sm" onClick={handleReset}>
                    Reset View
                  </Button>
                </div>
                <div className="text-sm text-gray-500">Zoom: {Math.round(zoom * 100)}%</div>
              </div>
            </CardContent>
          </Card>

          {/* Pin Layout (for RJ45/RJ11) */}
          {connector && connector.type === 'copper' && connector.pinLayout && (
            <Card className="mt-6">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle>Pin Layout - {connector.name}</CardTitle>
                  {connector.id === 'RJ45' && (
                    <div className="flex gap-2">
                      <Button
                        variant={wiringStandard === 'T568A' ? 'default' : 'outline'}
                        size="sm"
                        onClick={() => setWiringStandard('T568A')}
                      >
                        T568A
                      </Button>
                      <Button
                        variant={wiringStandard === 'T568B' ? 'default' : 'outline'}
                        size="sm"
                        onClick={() => setWiringStandard('T568B')}
                      >
                        T568B
                      </Button>
                    </div>
                  )}
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {/* Visual pin representation */}
                  <div className="flex justify-center gap-1 rounded-lg bg-gray-50 p-6">
                    {pinLayout.pins.map((pin) => (
                      <div key={pin.number} className="flex flex-col items-center gap-2">
                        <div
                          className="h-16 w-8 rounded"
                          style={{
                            backgroundColor: pin.color.includes('white')
                              ? `#${pin.color.split('-')[1]}33`
                              : pin.color,
                            border: '2px solid #333',
                          }}
                        />
                        <div className="font-mono text-xs">{pin.number}</div>
                      </div>
                    ))}
                  </div>

                  {/* Pin details table */}
                  <div className="grid grid-cols-8 gap-2">
                    {pinLayout.pins.map((pin) => (
                      <div key={pin.number} className="text-center">
                        <div className="mb-1 text-xs font-bold">Pin {pin.number}</div>
                        <div className="text-xs text-gray-600">{pin.color}</div>
                        <div className="mt-1 text-xs font-medium">{pin.function}</div>
                      </div>
                    ))}
                  </div>

                  {connector.id === 'RJ45' && (
                    <div className="rounded-lg bg-blue-50 p-3">
                      <div className="mb-2 text-sm font-medium">Wiring Standard Info:</div>
                      <p className="text-sm text-gray-700">
                        {wiringStandard === 'T568A'
                          ? 'T568A: Used in government installations and some commercial settings. Green pairs on pins 1-2.'
                          : 'T568B: Most common standard in commercial installations. Orange pairs on pins 1-2.'}
                      </p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Connector Selection Panel */}
        <div>
          <Card>
            <CardHeader>
              <CardTitle>Select Connector</CardTitle>
            </CardHeader>
            <CardContent>
              <Tabs defaultValue="all" className="w-full">
                <TabsList className="grid w-full grid-cols-4">
                  <TabsTrigger value="all">All</TabsTrigger>
                  <TabsTrigger value="fiber">Fiber</TabsTrigger>
                  <TabsTrigger value="copper">Copper</TabsTrigger>
                  <TabsTrigger value="coaxial">Coax</TabsTrigger>
                </TabsList>

                <TabsContent value="all" className="mt-4 space-y-2">
                  {CONNECTORS.map((conn) => (
                    <Button
                      key={conn.id}
                      variant={selectedConnector === conn.id ? 'default' : 'outline'}
                      className="w-full justify-start"
                      onClick={() => setSelectedConnector(conn.id)}
                    >
                      <Badge className="mr-2">{conn.type}</Badge>
                      {conn.name}
                    </Button>
                  ))}
                </TabsContent>

                <TabsContent value="fiber" className="mt-4 space-y-2">
                  {fiberConnectors.map((conn) => (
                    <Button
                      key={conn.id}
                      variant={selectedConnector === conn.id ? 'default' : 'outline'}
                      className="w-full justify-start"
                      onClick={() => setSelectedConnector(conn.id)}
                    >
                      {conn.name}
                    </Button>
                  ))}
                </TabsContent>

                <TabsContent value="copper" className="mt-4 space-y-2">
                  {copperConnectors.map((conn) => (
                    <Button
                      key={conn.id}
                      variant={selectedConnector === conn.id ? 'default' : 'outline'}
                      className="w-full justify-start"
                      onClick={() => setSelectedConnector(conn.id)}
                    >
                      {conn.name}
                    </Button>
                  ))}
                </TabsContent>

                <TabsContent value="coaxial" className="mt-4 space-y-2">
                  {coaxialConnectors.map((conn) => (
                    <Button
                      key={conn.id}
                      variant={selectedConnector === conn.id ? 'default' : 'outline'}
                      className="w-full justify-start"
                      onClick={() => setSelectedConnector(conn.id)}
                    >
                      {conn.name}
                    </Button>
                  ))}
                </TabsContent>
              </Tabs>

              {viewMode === 'comparison' && (
                <div className="mt-4 border-t pt-4">
                  <div className="mb-2 text-sm font-medium">Compare With:</div>
                  <select
                    value={comparisonConnector}
                    onChange={(e) => setComparisonConnector(e.target.value as ConnectorType)}
                    className="w-full rounded border p-2"
                  >
                    {CONNECTORS.filter((c) => c.id !== selectedConnector).map((conn) => (
                      <option key={conn.id} value={conn.id}>
                        {conn.name}
                      </option>
                    ))}
                  </select>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Connector Details */}
          {connector && (
            <Card className="mt-4">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Info className="h-5 w-5" />
                  Connector Details
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div>
                  <div className="text-sm font-medium">Type</div>
                  <Badge>{connector.type}</Badge>
                </div>

                <div>
                  <div className="mb-1 text-sm font-medium">Description</div>
                  <p className="text-sm text-gray-700">{connector.description}</p>
                </div>

                {connector.pinCount && (
                  <div>
                    <div className="text-sm font-medium">Pin Count</div>
                    <div className="text-sm text-gray-700">{connector.pinCount} pins</div>
                  </div>
                )}

                <div>
                  <div className="mb-1 text-sm font-medium">Typical Uses</div>
                  <ul className="list-inside list-disc space-y-1">
                    {connector.typicalUse.map((use, idx) => (
                      <li key={idx} className="text-sm text-gray-700">
                        {use}
                      </li>
                    ))}
                  </ul>
                </div>

                <div>
                  <div className="mb-1 text-sm font-medium">Key Features</div>
                  <div className="flex flex-wrap gap-1">
                    {connector.keyFeatures.map((feature, idx) => (
                      <Badge key={idx} variant="outline" className="text-xs">
                        {feature}
                      </Badge>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Comparison Details */}
          {viewMode === 'comparison' && comparisonConn && (
            <Card className="mt-4">
              <CardHeader>
                <CardTitle>Comparison Connector</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div>
                  <div className="text-sm font-medium">{comparisonConn.name}</div>
                  <Badge>{comparisonConn.type}</Badge>
                </div>
                <p className="text-sm text-gray-700">{comparisonConn.description}</p>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
