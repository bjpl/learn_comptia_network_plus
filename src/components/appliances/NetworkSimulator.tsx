import React, { useState, useCallback, useRef, useEffect } from 'react';
import type {
  SimulatedDevice,
  NetworkConnection,
  SimulationState,
  TrafficFlow,
  SimulationAlert,
  TroubleshootingScenario,
} from './appliances-types';

import { deviceTemplates } from './appliances-data';
import { getTroubleshootingScenarios } from './simulator-scenarios';

interface DeviceConfig {
  name: string;
  throughput: string;
  maxConnections: number;
  redundancy: boolean;
}

interface SavedNetwork {
  id: string;
  name: string;
  timestamp: number;
  devices: SimulatedDevice[];
  connections: NetworkConnection[];
}

interface NetworkSimulatorProps {
  initialDevices?: SimulatedDevice[];
}

const NetworkSimulator: React.FC<NetworkSimulatorProps> = ({ initialDevices = [] }) => {
  const canvasRef = useRef<HTMLDivElement>(null);
  const [devices, setDevices] = useState<SimulatedDevice[]>(initialDevices);
  const [connections, setConnections] = useState<NetworkConnection[]>([]);
  const [selectedDevice, setSelectedDevice] = useState<string | null>(null);
  const [dragging, setDragging] = useState<string | null>(null);
  const [connecting, setConnecting] = useState<string | null>(null);
  const [showConfigPanel, setShowConfigPanel] = useState(false);
  const [showSaveDialog, setShowSaveDialog] = useState(false);
  const [showScenarios, setShowScenarios] = useState(false);
  const [savedNetworks, setSavedNetworks] = useState<SavedNetwork[]>([]);
  const [deviceConfig, setDeviceConfig] = useState<DeviceConfig | null>(null);
  const [simulationState, setSimulationState] = useState<SimulationState>({
    isRunning: false,
    time: 0,
    trafficFlows: [],
    alerts: [],
  });

  const deviceTypeOptions: Array<{ value: SimulatedDevice['type']; label: string }> = [
    { value: 'router', label: 'Router' },
    { value: 'switch', label: 'Switch' },
    { value: 'firewall-stateful', label: 'Firewall' },
    { value: 'load-balancer', label: 'Load Balancer' },
    { value: 'wireless-controller', label: 'Wireless Controller' },
  ];

  // Add device to canvas
  const addDevice = useCallback(
    (type: SimulatedDevice['type']) => {
      const newDevice: SimulatedDevice = {
        id: `device-${Date.now()}`,
        name: `${type.charAt(0).toUpperCase() + type.slice(1)} ${devices.length + 1}`,
        type,
        category: 'physical',
        position: {
          x: 100 + ((devices.length * 50) % 500),
          y: 100 + Math.floor(devices.length / 10) * 100,
        },
        specs: deviceTemplates[type as keyof typeof deviceTemplates]?.defaultSpecs || {
          throughput: '1 Gbps',
          maxConnections: 1000,
          powerConsumption: '50W',
          redundancy: false,
          hotSwappable: false,
        },
        status: 'active',
        connections: [],
        currentLoad: 0,
        maxLoad: 100,
      };

      setDevices([...devices, newDevice]);
    },
    [devices]
  );

  // Handle device dragging
  const handleMouseDown = (deviceId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (connecting) {
      return;
    }

    setDragging(deviceId);
    setSelectedDevice(deviceId);
  };

  const handleMouseMove = useCallback(
    (e: React.MouseEvent) => {
      if (!dragging || !canvasRef.current) {
        return;
      }

      const rect = canvasRef.current.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      setDevices((prevDevices) =>
        prevDevices.map((device) =>
          device.id === dragging
            ? {
                ...device,
                position: {
                  x: Math.max(0, Math.min(x, rect.width - 80)),
                  y: Math.max(0, Math.min(y, rect.height - 80)),
                },
              }
            : device
        )
      );
    },
    [dragging]
  );

  const handleMouseUp = useCallback(() => {
    setDragging(null);
  }, []);

  // Connection handling
  const startConnection = (deviceId: string) => {
    if (connecting === deviceId) {
      setConnecting(null);
    } else {
      setConnecting(deviceId);
    }
  };

  const completeConnection = (targetId: string) => {
    if (!connecting || connecting === targetId) {
      setConnecting(null);
      return;
    }

    // Check if connection already exists
    const exists = connections.some(
      (conn) =>
        (conn.sourceId === connecting && conn.targetId === targetId) ||
        (conn.sourceId === targetId && conn.targetId === connecting)
    );

    if (!exists) {
      const newConnection: NetworkConnection = {
        id: `conn-${Date.now()}`,
        sourceId: connecting,
        targetId,
        type: 'ethernet',
        bandwidth: '1 Gbps',
        latency: 1,
        trafficLoad: 0,
      };

      setConnections([...connections, newConnection]);

      // Update device connections
      setDevices((prevDevices) =>
        prevDevices.map((device) => {
          if (device.id === connecting || device.id === targetId) {
            return {
              ...device,
              connections: [...device.connections, newConnection.id],
            };
          }
          return device;
        })
      );
    }

    setConnecting(null);
  };

  // Remove device
  const removeDevice = (deviceId: string) => {
    // Remove connections
    // Remove connections associated with device

    const remainingConnections = connections.filter(
      (conn) => conn.sourceId !== deviceId && conn.targetId !== deviceId
    );

    setConnections(remainingConnections);
    setDevices(devices.filter((d) => d.id !== deviceId));

    if (selectedDevice === deviceId) {
      setSelectedDevice(null);
    }
  };

  // Simulation logic
  const toggleSimulation = () => {
    setSimulationState((prev) => ({
      ...prev,
      isRunning: !prev.isRunning,
    }));
  };

  const resetSimulation = () => {
    setSimulationState({
      isRunning: false,
      time: 0,
      trafficFlows: [],
      alerts: [],
    });

    setDevices((prevDevices) =>
      prevDevices.map((device) => ({
        ...device,
        currentLoad: 0,
        status: 'active',
      }))
    );

    setConnections((prevConnections) =>
      prevConnections.map((conn) => ({
        ...conn,
        trafficLoad: 0,
      }))
    );
  };

  // Simulation tick
  useEffect(() => {
    if (!simulationState.isRunning) {
      return;
    }

    const interval = setInterval(() => {
      setSimulationState((prev) => {
        const newTime = prev.time + 1;
        const newFlows: TrafficFlow[] = [];
        const newAlerts: SimulationAlert[] = [...prev.alerts];

        // Generate random traffic
        if (devices.length > 1 && Math.random() > 0.5) {
          const sourceDevice = devices[Math.floor(Math.random() * devices.length)];
          const targetDevice = devices.filter((d) => d.id !== sourceDevice.id)[
            Math.floor(Math.random() * (devices.length - 1))
          ];

          if (targetDevice) {
            const flowPath = findPath(sourceDevice.id, targetDevice.id, connections, devices);

            if (flowPath.length > 0) {
              newFlows.push({
                id: `flow-${Date.now()}`,
                sourceDeviceId: sourceDevice.id,
                targetDeviceId: targetDevice.id,
                connectionIds: flowPath,
                protocol: ['HTTP', 'SSH', 'FTP', 'DNS'][Math.floor(Math.random() * 4)],
                bandwidth: Math.random() * 100,
                color: `hsl(${Math.random() * 360}, 70%, 50%)`,
                animated: true,
              });
            }
          }
        }

        // Update device loads
        setDevices((prevDevices) =>
          prevDevices.map((device) => {
            const deviceFlows = newFlows.filter(
              (flow) => flow.sourceDeviceId === device.id || flow.targetDeviceId === device.id
            );

            const load = Math.min(
              100,
              (device.currentLoad || 0) +
                deviceFlows.reduce((sum, flow) => sum + flow.bandwidth / 10, 0)
            );

            let status: SimulatedDevice['status'] = 'active';
            if (load > 90) {
              status = 'error';
              newAlerts.push({
                id: `alert-${Date.now()}`,
                severity: 'critical',
                message: `${device.name} is overloaded (${load.toFixed(0)}%)`,
                deviceId: device.id,
                timestamp: newTime,
              });
            } else if (load > 70) {
              status = 'warning';
            }

            return {
              ...device,
              currentLoad: load * 0.95, // Decay load over time
              status,
            };
          })
        );

        // Keep only recent alerts
        const recentAlerts = newAlerts.filter((alert) => newTime - alert.timestamp < 10);

        return {
          ...prev,
          time: newTime,
          trafficFlows: newFlows,
          alerts: recentAlerts.slice(-5),
        };
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [simulationState.isRunning, devices, connections]);

  // Find path between devices using BFS
  const findPath = (
    sourceId: string,
    targetId: string,
    conns: NetworkConnection[],
    _devs: SimulatedDevice[]
  ): string[] => {
    const queue: Array<{ deviceId: string; path: string[] }> = [{ deviceId: sourceId, path: [] }];
    const visited = new Set<string>([sourceId]);

    while (queue.length > 0) {
      const current = queue.shift()!;

      if (current.deviceId === targetId) {
        return current.path;
      }

      const neighborConnections = conns.filter(
        (conn) => conn.sourceId === current.deviceId || conn.targetId === current.deviceId
      );

      for (const conn of neighborConnections) {
        const nextDeviceId = conn.sourceId === current.deviceId ? conn.targetId : conn.sourceId;

        if (!visited.has(nextDeviceId)) {
          visited.add(nextDeviceId);
          queue.push({
            deviceId: nextDeviceId,
            path: [...current.path, conn.id],
          });
        }
      }
    }

    return [];
  };

  const getDeviceIcon = (type: string) => {
    return deviceTemplates[type as keyof typeof deviceTemplates]?.icon || '📦';
  };

  const getStatusColor = (status: SimulatedDevice['status']) => {
    switch (status) {
      case 'active':
        return 'border-green-500 bg-green-50';
      case 'warning':
        return 'border-yellow-500 bg-yellow-50';
      case 'error':
        return 'border-red-500 bg-red-50';
      case 'inactive':
        return 'border-gray-300 bg-gray-50';
    }
  };

  // Configuration Panel Management
  const openDeviceConfig = (deviceId: string) => {
    const device = devices.find((d) => d.id === deviceId);
    if (device) {
      setDeviceConfig({
        name: device.name,
        throughput: device.specs.throughput,
        maxConnections: device.specs.maxConnections,
        redundancy: device.specs.redundancy,
      });
      setSelectedDevice(deviceId);
      setShowConfigPanel(true);
    }
  };

  const updateDeviceConfig = () => {
    if (!selectedDevice || !deviceConfig) {
      return;
    }

    setDevices((prevDevices) =>
      prevDevices.map((device) =>
        device.id === selectedDevice
          ? {
              ...device,
              name: deviceConfig.name,
              specs: {
                ...device.specs,
                throughput: deviceConfig.throughput,
                maxConnections: deviceConfig.maxConnections,
                redundancy: deviceConfig.redundancy,
              },
            }
          : device
      )
    );

    setShowConfigPanel(false);
  };

  // Save/Load Network Designs
  const saveNetworkDesign = (name: string) => {
    const newSave: SavedNetwork = {
      id: `save-${Date.now()}`,
      name,
      timestamp: Date.now(),
      devices: JSON.parse(JSON.stringify(devices)),
      connections: JSON.parse(JSON.stringify(connections)),
    };

    setSavedNetworks([...savedNetworks, newSave]);
    setShowSaveDialog(false);
  };

  const loadNetworkDesign = (saveId: string) => {
    const saved = savedNetworks.find((s) => s.id === saveId);
    if (saved) {
      setDevices(JSON.parse(JSON.stringify(saved.devices)));
      setConnections(JSON.parse(JSON.stringify(saved.connections)));
      resetSimulation();
    }
  };

  const deleteNetworkDesign = (saveId: string) => {
    setSavedNetworks(savedNetworks.filter((s) => s.id !== saveId));
  };

  const exportNetworkDesign = () => {
    const data = {
      devices,
      connections,
      timestamp: new Date().toISOString(),
    };

    const element = document.createElement('a');
    element.setAttribute(
      'href',
      `data:text/plain;charset=utf-8,${encodeURIComponent(JSON.stringify(data, null, 2))}`
    );
    element.setAttribute('download', `network-design-${Date.now()}.json`);
    element.style.display = 'none';
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  // Get troubleshooting scenarios
  const troubleshootingScenarios = getTroubleshootingScenarios();

  const loadScenario = (scenarioId: string) => {
    const scenario = troubleshootingScenarios.find((s) => s.id === scenarioId);
    if (scenario) {
      const setup = scenario.setup();
      setDevices(setup.devices);
      setConnections(setup.connections);
      resetSimulation();
      setShowScenarios(false);
    }
  };

  const selectedDeviceData = devices.find((d) => d.id === selectedDevice);

  return (
    <div className="rounded-lg bg-white p-6 shadow-lg">
      <h2 className="mb-4 text-2xl font-bold">Network Architecture Simulator</h2>

      {/* Toolbar */}
      <div className="mb-4 flex flex-wrap items-center gap-2">
        <div className="flex flex-wrap gap-2">
          {deviceTypeOptions.map((option) => (
            <button
              key={option.value}
              onClick={() => addDevice(option.value)}
              className="rounded bg-blue-500 px-3 py-2 text-sm text-white hover:bg-blue-600"
              title={`Add ${option.label}`}
            >
              {getDeviceIcon(option.value)} {option.label}
            </button>
          ))}
        </div>

        <div className="flex flex-wrap gap-2 lg:ml-auto">
          <button
            onClick={toggleSimulation}
            className={`rounded px-4 py-2 font-medium ${
              simulationState.isRunning
                ? 'bg-red-500 text-white hover:bg-red-600'
                : 'bg-green-500 text-white hover:bg-green-600'
            }`}
          >
            {simulationState.isRunning ? '⏸ Pause' : '▶ Start'} Simulation
          </button>
          <button
            onClick={resetSimulation}
            className="rounded bg-gray-500 px-4 py-2 text-white hover:bg-gray-600"
          >
            🔄 Reset
          </button>
          <button
            onClick={() => setShowScenarios(!showScenarios)}
            className="rounded bg-purple-500 px-4 py-2 text-white hover:bg-purple-600"
            title="Load troubleshooting scenarios"
          >
            📋 Scenarios
          </button>
          <button
            onClick={() => setShowSaveDialog(!showSaveDialog)}
            className="rounded bg-amber-500 px-4 py-2 text-white hover:bg-amber-600"
            title="Save/Load network designs"
          >
            💾 Save/Load
          </button>
          <button
            onClick={exportNetworkDesign}
            className="rounded bg-cyan-500 px-4 py-2 text-white hover:bg-cyan-600"
            title="Export network as JSON"
          >
            📤 Export
          </button>
        </div>
      </div>

      {/* Troubleshooting Scenarios Panel */}
      {showScenarios && (
        <div className="mb-4 rounded border border-purple-300 bg-purple-50 p-4">
          <div className="mb-3 flex items-center justify-between">
            <h3 className="font-semibold">Network Troubleshooting Scenarios</h3>
            <button
              onClick={() => setShowScenarios(false)}
              className="text-gray-500 hover:text-gray-700"
            >
              ×
            </button>
          </div>
          <div className="space-y-2">
            {troubleshootingScenarios.map((scenario) => (
              <div key={scenario.id} className="rounded bg-white p-3">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="font-medium">{scenario.name}</p>
                    <p className="text-sm text-gray-600">{scenario.description}</p>
                    <p className="mt-1 text-xs text-blue-600">Issue: {scenario.expectedIssue}</p>
                    <p className="text-xs text-green-600">Hint: {scenario.hint}</p>
                  </div>
                  <button
                    onClick={() => loadScenario(scenario.id)}
                    className="rounded bg-purple-500 px-3 py-1 text-sm text-white hover:bg-purple-600"
                  >
                    Load
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Save/Load Panel */}
      {showSaveDialog && (
        <div className="mb-4 rounded border border-amber-300 bg-amber-50 p-4">
          <div className="mb-3 flex items-center justify-between">
            <h3 className="font-semibold">Save & Load Networks</h3>
            <button
              onClick={() => setShowSaveDialog(false)}
              className="text-gray-500 hover:text-gray-700"
            >
              ×
            </button>
          </div>

          {/* Save Network */}
          <div className="mb-4 rounded bg-white p-3">
            <p className="mb-2 text-sm font-medium">Save Current Design</p>
            <div className="flex gap-2">
              <input
                type="text"
                placeholder="Network name"
                id="save-name"
                className="flex-1 rounded border border-gray-300 px-2 py-1 text-sm"
              />
              <button
                onClick={() => {
                  const name = (document.getElementById('save-name') as HTMLInputElement)?.value;
                  if (name) {
                    saveNetworkDesign(name);
                    (document.getElementById('save-name') as HTMLInputElement).value = '';
                  }
                }}
                className="rounded bg-green-500 px-3 py-1 text-sm text-white hover:bg-green-600"
              >
                Save
              </button>
            </div>
          </div>

          {/* Load Networks */}
          {savedNetworks.length > 0 && (
            <div className="rounded bg-white p-3">
              <p className="mb-2 text-sm font-medium">Saved Designs</p>
              <div className="space-y-2">
                {savedNetworks.map((saved) => (
                  <div
                    key={saved.id}
                    className="flex items-center justify-between rounded border border-gray-200 p-2"
                  >
                    <div className="text-sm">
                      <p className="font-medium">{saved.name}</p>
                      <p className="text-xs text-gray-500">
                        {new Date(saved.timestamp).toLocaleString()}
                      </p>
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={() => loadNetworkDesign(saved.id)}
                        className="rounded bg-blue-500 px-2 py-1 text-xs text-white hover:bg-blue-600"
                      >
                        Load
                      </button>
                      <button
                        onClick={() => deleteNetworkDesign(saved.id)}
                        className="rounded bg-red-500 px-2 py-1 text-xs text-white hover:bg-red-600"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Device Configuration Panel */}
      {showConfigPanel && selectedDeviceData && (
        <div className="mb-4 rounded border border-blue-300 bg-blue-50 p-4">
          <div className="mb-3 flex items-center justify-between">
            <h3 className="font-semibold">Device Configuration: {selectedDeviceData.name}</h3>
            <button
              onClick={() => setShowConfigPanel(false)}
              className="text-gray-500 hover:text-gray-700"
            >
              ×
            </button>
          </div>
          <div className="space-y-3">
            <div>
              <label className="block text-sm font-medium">Device Name</label>
              <input
                type="text"
                value={deviceConfig?.name || ''}
                onChange={(e) =>
                  setDeviceConfig(deviceConfig ? { ...deviceConfig, name: e.target.value } : null)
                }
                className="mt-1 w-full rounded border border-gray-300 px-2 py-1 text-sm"
              />
            </div>
            <div>
              <label className="block text-sm font-medium">Throughput</label>
              <input
                type="text"
                value={deviceConfig?.throughput || ''}
                onChange={(e) =>
                  setDeviceConfig(
                    deviceConfig ? { ...deviceConfig, throughput: e.target.value } : null
                  )
                }
                className="mt-1 w-full rounded border border-gray-300 px-2 py-1 text-sm"
              />
            </div>
            <div>
              <label className="block text-sm font-medium">Max Connections</label>
              <input
                type="number"
                value={deviceConfig?.maxConnections || 0}
                onChange={(e) =>
                  setDeviceConfig(
                    deviceConfig
                      ? { ...deviceConfig, maxConnections: parseInt(e.target.value, 10) }
                      : null
                  )
                }
                className="mt-1 w-full rounded border border-gray-300 px-2 py-1 text-sm"
              />
            </div>
            <div className="flex items-center">
              <input
                type="checkbox"
                checked={deviceConfig?.redundancy || false}
                onChange={(e) =>
                  setDeviceConfig(
                    deviceConfig ? { ...deviceConfig, redundancy: e.target.checked } : null
                  )
                }
                className="rounded border-gray-300"
              />
              <label className="ml-2 text-sm font-medium">Enable Redundancy</label>
            </div>
            <div className="flex gap-2 pt-2">
              <button
                onClick={updateDeviceConfig}
                className="rounded bg-green-500 px-4 py-2 text-sm text-white hover:bg-green-600"
              >
                Update
              </button>
              <button
                onClick={() => setShowConfigPanel(false)}
                className="rounded bg-gray-500 px-4 py-2 text-sm text-white hover:bg-gray-600"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Canvas */}
      <div
        ref={canvasRef}
        className="relative overflow-hidden rounded-lg border-2 border-gray-300 bg-gray-50"
        style={{ height: '500px' }}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
      >
        {/* Connections */}
        <svg className="pointer-events-none absolute inset-0 h-full w-full">
          {connections.map((conn) => {
            const sourceDevice = devices.find((d) => d.id === conn.sourceId);
            const targetDevice = devices.find((d) => d.id === conn.targetId);

            if (!sourceDevice || !targetDevice) {
              return null;
            }

            const isAnimated = simulationState.trafficFlows.some((flow) =>
              flow.connectionIds.includes(conn.id)
            );

            return (
              <g key={conn.id}>
                <line
                  x1={sourceDevice.position.x + 40}
                  y1={sourceDevice.position.y + 40}
                  x2={targetDevice.position.x + 40}
                  y2={targetDevice.position.y + 40}
                  stroke={isAnimated ? '#3b82f6' : '#9ca3af'}
                  strokeWidth={isAnimated ? 3 : 2}
                  strokeDasharray={isAnimated ? '5,5' : '0'}
                  className={isAnimated ? 'animate-pulse' : ''}
                />
                <text
                  x={(sourceDevice.position.x + targetDevice.position.x) / 2 + 40}
                  y={(sourceDevice.position.y + targetDevice.position.y) / 2 + 30}
                  className="fill-gray-600 text-xs"
                  textAnchor="middle"
                >
                  {conn.bandwidth}
                </text>
              </g>
            );
          })}
        </svg>

        {/* Devices */}
        {devices.map((device) => (
          <div
            key={device.id}
            className={`absolute flex h-20 w-20 cursor-move flex-col items-center justify-center rounded-lg border-2 text-center shadow-md transition-all ${getStatusColor(
              device.status
            )} ${selectedDevice === device.id ? 'ring-4 ring-blue-500' : ''} ${
              connecting === device.id ? 'ring-4 ring-green-500' : ''
            }`}
            style={{
              left: `${device.position.x}px`,
              top: `${device.position.y}px`,
            }}
            onMouseDown={(e) => handleMouseDown(device.id, e)}
            onClick={(e) => {
              e.stopPropagation();
              if (connecting && connecting !== device.id) {
                completeConnection(device.id);
              }
            }}
          >
            <div className="text-2xl">{getDeviceIcon(device.type)}</div>
            <div className="w-full truncate px-1 text-xs font-medium">{device.name}</div>

            {/* Load indicator */}
            {device.currentLoad !== undefined && device.currentLoad > 0 && (
              <div className="absolute bottom-1 left-1 right-1 h-1 rounded bg-gray-200">
                <div
                  className={`h-full rounded ${
                    device.currentLoad > 90
                      ? 'bg-red-500'
                      : device.currentLoad > 70
                        ? 'bg-yellow-500'
                        : 'bg-green-500'
                  }`}
                  style={{ width: `${device.currentLoad}%` }}
                />
              </div>
            )}

            {/* Connection button */}
            <button
              className="absolute -right-2 -top-2 h-6 w-6 rounded-full bg-blue-500 text-xs text-white hover:bg-blue-600"
              onClick={(e) => {
                e.stopPropagation();
                startConnection(device.id);
              }}
              title="Create connection"
            >
              🔗
            </button>

            {/* Configuration button */}
            <button
              className="absolute bottom-1 right-1 h-5 w-5 rounded-full bg-indigo-500 text-xs text-white hover:bg-indigo-600"
              onClick={(e) => {
                e.stopPropagation();
                openDeviceConfig(device.id);
              }}
              title="Configure device"
            >
              ⚙
            </button>

            {/* Delete button */}
            <button
              className="absolute -left-2 -top-2 h-6 w-6 rounded-full bg-red-500 text-xs text-white hover:bg-red-600"
              onClick={(e) => {
                e.stopPropagation();
                removeDevice(device.id);
              }}
              title="Delete device"
            >
              ×
            </button>
          </div>
        ))}

        {connecting && (
          <div className="absolute left-2 top-2 rounded border border-green-500 bg-green-100 px-3 py-1 text-sm">
            Click on another device to connect
          </div>
        )}
      </div>

      {/* Info Panel */}
      <div className="mt-4 grid grid-cols-1 gap-4 md:grid-cols-3">
        {/* Simulation Stats */}
        <div className="rounded bg-gray-50 p-4">
          <h3 className="mb-2 font-semibold">Simulation Stats</h3>
          <div className="space-y-1 text-sm">
            <p>Time: {simulationState.time}s</p>
            <p>Devices: {devices.length}</p>
            <p>Connections: {connections.length}</p>
            <p>Active Flows: {simulationState.trafficFlows.length}</p>
          </div>
        </div>

        {/* Selected Device Info */}
        <div className="rounded bg-gray-50 p-4">
          <h3 className="mb-2 font-semibold">Device Details</h3>
          {selectedDeviceData ? (
            <div className="space-y-1 text-sm">
              <p className="font-medium">{selectedDeviceData.name}</p>
              <p>Type: {selectedDeviceData.type}</p>
              <p>Status: {selectedDeviceData.status}</p>
              <p>Load: {selectedDeviceData.currentLoad?.toFixed(1)}%</p>
              <p>Throughput: {selectedDeviceData.specs.throughput}</p>
              <p>Connections: {selectedDeviceData.connections.length}</p>
            </div>
          ) : (
            <p className="text-sm text-gray-500">Select a device to view details</p>
          )}
        </div>

        {/* Alerts */}
        <div className="rounded bg-gray-50 p-4">
          <h3 className="mb-2 font-semibold">Alerts</h3>
          <div className="max-h-24 space-y-1 overflow-y-auto text-sm">
            {simulationState.alerts.length > 0 ? (
              simulationState.alerts.map((alert) => (
                <div
                  key={alert.id}
                  className={`rounded p-2 ${
                    alert.severity === 'critical'
                      ? 'bg-red-100 text-red-800'
                      : alert.severity === 'warning'
                        ? 'bg-yellow-100 text-yellow-800'
                        : 'bg-blue-100 text-blue-800'
                  }`}
                >
                  {alert.message}
                </div>
              ))
            ) : (
              <p className="text-gray-500">No alerts</p>
            )}
          </div>
        </div>
      </div>

      {/* Instructions */}
      <div className="mt-4 rounded bg-blue-50 p-4">
        <h4 className="mb-2 text-sm font-semibold">💡 How to use:</h4>
        <ul className="list-inside list-disc space-y-1 text-sm text-gray-700">
          <li>Click device type buttons to add devices to the canvas</li>
          <li>Drag devices to reposition them</li>
          <li>Click the 🔗 button on a device, then click another device to create a connection</li>
          <li>Click Start Simulation to see traffic flows and device loads</li>
          <li>Watch for alerts when devices become overloaded</li>
        </ul>
      </div>
    </div>
  );
};

export default NetworkSimulator;
