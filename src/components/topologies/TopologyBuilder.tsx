/**
 * TopologyBuilder Component
 * Interactive network topology design tool with drag-and-drop, validation, and templates
 */

import React, { useState, useCallback, useRef, useMemo } from 'react';

// Types
export type DeviceType =
  | 'router'
  | 'switch'
  | 'hub'
  | 'firewall'
  | 'server'
  | 'workstation'
  | 'wireless-ap'
  | 'cloud';

export type DetectedTopologyType = 'star' | 'mesh' | 'ring' | 'bus' | 'hybrid' | 'custom';

export interface BuilderDevice {
  id: string;
  type: DeviceType;
  label: string;
  position: { x: number; y: number };
  cost: number;
}

export interface BuilderConnection {
  id: string;
  sourceId: string;
  targetId: string;
  type: 'ethernet' | 'fiber' | 'wireless';
  length: number;
  cost: number;
}

export interface TopologyTemplate {
  id: string;
  name: string;
  description: string;
  devices: BuilderDevice[];
  connections: BuilderConnection[];
}

export interface ValidationIssue {
  id: string;
  severity: 'error' | 'warning' | 'info';
  type: 'spof' | 'redundancy' | 'performance' | 'cost' | 'best-practice';
  message: string;
  deviceId?: string;
}

interface TopologyBuilderProps {
  className?: string;
}

// Device specifications
const deviceSpecs: Record<DeviceType, { label: string; cost: number; icon: string }> = {
  router: { label: 'Router', cost: 500, icon: '🔀' },
  switch: { label: 'Switch', cost: 300, icon: '🔌' },
  hub: { label: 'Hub', cost: 100, icon: '⭕' },
  firewall: { label: 'Firewall', cost: 800, icon: '🛡️' },
  server: { label: 'Server', cost: 2000, icon: '🖥️' },
  workstation: { label: 'Workstation', cost: 1000, icon: '💻' },
  'wireless-ap': { label: 'Wireless AP', cost: 200, icon: '📡' },
  cloud: { label: 'Cloud', cost: 0, icon: '☁️' },
};

// Connection costs per meter
const connectionCosts: Record<BuilderConnection['type'], number> = {
  ethernet: 2,
  fiber: 5,
  wireless: 50,
};

// Pre-built templates
const templates: TopologyTemplate[] = [
  {
    id: 'small-office',
    name: 'Small Office',
    description: 'Basic star topology for small office (5-10 users)',
    devices: [
      {
        id: 'd1',
        type: 'router',
        label: 'Gateway Router',
        position: { x: 300, y: 150 },
        cost: 500,
      },
      {
        id: 'd2',
        type: 'switch',
        label: 'Main Switch',
        position: { x: 300, y: 250 },
        cost: 300,
      },
      {
        id: 'd3',
        type: 'workstation',
        label: 'Workstation 1',
        position: { x: 150, y: 350 },
        cost: 1000,
      },
      {
        id: 'd4',
        type: 'workstation',
        label: 'Workstation 2',
        position: { x: 300, y: 350 },
        cost: 1000,
      },
      {
        id: 'd5',
        type: 'server',
        label: 'File Server',
        position: { x: 450, y: 350 },
        cost: 2000,
      },
    ],
    connections: [
      { id: 'c1', sourceId: 'd1', targetId: 'd2', type: 'ethernet', length: 5, cost: 10 },
      { id: 'c2', sourceId: 'd2', targetId: 'd3', type: 'ethernet', length: 20, cost: 40 },
      { id: 'c3', sourceId: 'd2', targetId: 'd4', type: 'ethernet', length: 15, cost: 30 },
      { id: 'c4', sourceId: 'd2', targetId: 'd5', type: 'ethernet', length: 25, cost: 50 },
    ],
  },
  {
    id: 'enterprise',
    name: 'Enterprise Network',
    description: 'Redundant two-tier network with distribution and access layers',
    devices: [
      {
        id: 'd1',
        type: 'router',
        label: 'Core Router 1',
        position: { x: 250, y: 100 },
        cost: 500,
      },
      {
        id: 'd2',
        type: 'router',
        label: 'Core Router 2',
        position: { x: 450, y: 100 },
        cost: 500,
      },
      {
        id: 'd3',
        type: 'firewall',
        label: 'Firewall',
        position: { x: 350, y: 50 },
        cost: 800,
      },
      {
        id: 'd4',
        type: 'switch',
        label: 'Distribution SW 1',
        position: { x: 200, y: 250 },
        cost: 300,
      },
      {
        id: 'd5',
        type: 'switch',
        label: 'Distribution SW 2',
        position: { x: 500, y: 250 },
        cost: 300,
      },
      {
        id: 'd6',
        type: 'switch',
        label: 'Access SW 1',
        position: { x: 150, y: 400 },
        cost: 300,
      },
      {
        id: 'd7',
        type: 'switch',
        label: 'Access SW 2',
        position: { x: 350, y: 400 },
        cost: 300,
      },
      {
        id: 'd8',
        type: 'switch',
        label: 'Access SW 3',
        position: { x: 550, y: 400 },
        cost: 300,
      },
    ],
    connections: [
      { id: 'c1', sourceId: 'd3', targetId: 'd1', type: 'fiber', length: 10, cost: 50 },
      { id: 'c2', sourceId: 'd3', targetId: 'd2', type: 'fiber', length: 10, cost: 50 },
      { id: 'c3', sourceId: 'd1', targetId: 'd2', type: 'fiber', length: 15, cost: 75 },
      { id: 'c4', sourceId: 'd1', targetId: 'd4', type: 'fiber', length: 20, cost: 100 },
      { id: 'c5', sourceId: 'd1', targetId: 'd5', type: 'fiber', length: 30, cost: 150 },
      { id: 'c6', sourceId: 'd2', targetId: 'd4', type: 'fiber', length: 30, cost: 150 },
      { id: 'c7', sourceId: 'd2', targetId: 'd5', type: 'fiber', length: 20, cost: 100 },
      { id: 'c8', sourceId: 'd4', targetId: 'd6', type: 'ethernet', length: 25, cost: 50 },
      { id: 'c9', sourceId: 'd4', targetId: 'd7', type: 'ethernet', length: 25, cost: 50 },
      { id: 'c10', sourceId: 'd5', targetId: 'd7', type: 'ethernet', length: 25, cost: 50 },
      { id: 'c11', sourceId: 'd5', targetId: 'd8', type: 'ethernet', length: 25, cost: 50 },
    ],
  },
  {
    id: 'datacenter',
    name: 'Data Center (Spine-Leaf)',
    description: 'Modern spine-and-leaf architecture for east-west traffic',
    devices: [
      { id: 'd1', type: 'switch', label: 'Spine 1', position: { x: 250, y: 100 }, cost: 300 },
      { id: 'd2', type: 'switch', label: 'Spine 2', position: { x: 450, y: 100 }, cost: 300 },
      { id: 'd3', type: 'switch', label: 'Leaf 1', position: { x: 150, y: 250 }, cost: 300 },
      { id: 'd4', type: 'switch', label: 'Leaf 2', position: { x: 350, y: 250 }, cost: 300 },
      { id: 'd5', type: 'switch', label: 'Leaf 3', position: { x: 550, y: 250 }, cost: 300 },
      {
        id: 'd6',
        type: 'server',
        label: 'Server Rack 1',
        position: { x: 150, y: 380 },
        cost: 2000,
      },
      {
        id: 'd7',
        type: 'server',
        label: 'Server Rack 2',
        position: { x: 350, y: 380 },
        cost: 2000,
      },
      {
        id: 'd8',
        type: 'server',
        label: 'Server Rack 3',
        position: { x: 550, y: 380 },
        cost: 2000,
      },
    ],
    connections: [
      { id: 'c1', sourceId: 'd1', targetId: 'd3', type: 'fiber', length: 15, cost: 75 },
      { id: 'c2', sourceId: 'd1', targetId: 'd4', type: 'fiber', length: 20, cost: 100 },
      { id: 'c3', sourceId: 'd1', targetId: 'd5', type: 'fiber', length: 30, cost: 150 },
      { id: 'c4', sourceId: 'd2', targetId: 'd3', type: 'fiber', length: 30, cost: 150 },
      { id: 'c5', sourceId: 'd2', targetId: 'd4', type: 'fiber', length: 20, cost: 100 },
      { id: 'c6', sourceId: 'd2', targetId: 'd5', type: 'fiber', length: 15, cost: 75 },
      { id: 'c7', sourceId: 'd3', targetId: 'd6', type: 'fiber', length: 10, cost: 50 },
      { id: 'c8', sourceId: 'd4', targetId: 'd7', type: 'fiber', length: 10, cost: 50 },
      { id: 'c9', sourceId: 'd5', targetId: 'd8', type: 'fiber', length: 10, cost: 50 },
    ],
  },
];

export const TopologyBuilder: React.FC<TopologyBuilderProps> = ({ className = '' }) => {
  const canvasRef = useRef<HTMLDivElement>(null);
  const [devices, setDevices] = useState<BuilderDevice[]>([]);
  const [connections, setConnections] = useState<BuilderConnection[]>([]);
  const [selectedDevice, setSelectedDevice] = useState<string | null>(null);
  const [dragging, setDragging] = useState<string | null>(null);
  const [connecting, setConnecting] = useState<string | null>(null);
  const [showTemplates, setShowTemplates] = useState(false);
  const [showValidation, setShowValidation] = useState(false);
  const [showCost, setShowCost] = useState(true);
  const [showHints, setShowHints] = useState(true);
  const [history, setHistory] = useState<
    Array<{ devices: BuilderDevice[]; connections: BuilderConnection[] }>
  >([]);
  const [historyIndex, setHistoryIndex] = useState(-1);

  // Add device to canvas
  const addDevice = useCallback(
    (type: DeviceType) => {
      const newDevice: BuilderDevice = {
        id: `device-${Date.now()}`,
        type,
        label: `${deviceSpecs[type].label} ${devices.length + 1}`,
        position: {
          x: 300 + ((devices.length * 80) % 400),
          y: 200 + Math.floor(devices.length / 5) * 100,
        },
        cost: deviceSpecs[type].cost,
      };

      const newDevices = [...devices, newDevice];
      setDevices(newDevices);
      saveToHistory(newDevices, connections);
    },
    [devices, connections]
  );

  // Save state to history for undo/redo
  const saveToHistory = useCallback(
    (devs: BuilderDevice[], conns: BuilderConnection[]) => {
      const newHistory = history.slice(0, historyIndex + 1);
      newHistory.push({ devices: devs, connections: conns });
      setHistory(newHistory);
      setHistoryIndex(newHistory.length - 1);
    },
    [history, historyIndex]
  );

  // Undo
  const undo = useCallback(() => {
    if (historyIndex > 0) {
      const prevState = history[historyIndex - 1];
      setDevices(prevState.devices);
      setConnections(prevState.connections);
      setHistoryIndex(historyIndex - 1);
    }
  }, [history, historyIndex]);

  // Redo
  const redo = useCallback(() => {
    if (historyIndex < history.length - 1) {
      const nextState = history[historyIndex + 1];
      setDevices(nextState.devices);
      setConnections(nextState.connections);
      setHistoryIndex(historyIndex + 1);
    }
  }, [history, historyIndex]);

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

      setDevices((prev) =>
        prev.map((device) =>
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
    if (dragging) {
      saveToHistory(devices, connections);
    }
    setDragging(null);
  }, [dragging, devices, connections, saveToHistory]);

  // Connection handling
  const startConnection = (deviceId: string) => {
    if (connecting === deviceId) {
      setConnecting(null);
    } else {
      setConnecting(deviceId);
    }
  };

  // Delete device
  const deleteDevice = (deviceId: string) => {
    const newDevices = devices.filter((d) => d.id !== deviceId);
    const newConnections = connections.filter(
      (c) => c.sourceId !== deviceId && c.targetId !== deviceId
    );
    setDevices(newDevices);
    setConnections(newConnections);
    setSelectedDevice(null);
    saveToHistory(newDevices, newConnections);
  };

  // Delete connection
  const deleteConnection = (connId: string) => {
    const newConnections = connections.filter((c) => c.id !== connId);
    setConnections(newConnections);
    saveToHistory(devices, newConnections);
  };

  // Load template
  const loadTemplate = (template: TopologyTemplate) => {
    setDevices(template.devices);
    setConnections(template.connections);
    setShowTemplates(false);
    saveToHistory(template.devices, template.connections);
  };

  // Clear canvas
  const clearCanvas = () => {
    setDevices([]);
    setConnections([]);
    setSelectedDevice(null);
    setConnecting(null);
    saveToHistory([], []);
  };

  // Detect topology type
  const detectedTopology = useMemo((): DetectedTopologyType => {
    if (devices.length < 2) {
      return 'custom';
    }

    const connectionCount = connections.length;
    const deviceCount = devices.length;

    // Check for star topology
    const connectionCounts = devices.map(
      (d) => connections.filter((c) => c.sourceId === d.id || c.targetId === d.id).length
    );
    const maxConnections = Math.max(...connectionCounts);
    const centralDevices = connectionCounts.filter((c) => c === maxConnections).length;

    if (
      centralDevices === 1 &&
      maxConnections === deviceCount - 1 &&
      connectionCount === deviceCount - 1
    ) {
      return 'star';
    }

    // Check for mesh topology
    const maxPossibleConnections = (deviceCount * (deviceCount - 1)) / 2;
    if (connectionCount === maxPossibleConnections) {
      return 'mesh';
    }

    // Check for ring topology
    if (connectionCount === deviceCount && connectionCounts.every((c) => c === 2)) {
      return 'ring';
    }

    // Check for bus topology (linear chain)
    if (
      connectionCount === deviceCount - 1 &&
      connectionCounts.filter((c) => c === 1).length === 2
    ) {
      return 'bus';
    }

    // Hybrid or custom
    return connectionCount > 0 ? 'hybrid' : 'custom';
  }, [devices, connections]);

  // Validation
  const validationIssues = useMemo((): ValidationIssue[] => {
    const issues: ValidationIssue[] = [];

    // Check for single points of failure
    devices.forEach((device) => {
      const connCount = connections.filter(
        (c) => c.sourceId === device.id || c.targetId === device.id
      ).length;

      if (connCount > 3 && device.type !== 'switch' && device.type !== 'router') {
        issues.push({
          id: `spof-${device.id}`,
          severity: 'error',
          type: 'spof',
          message: `${device.label} is a single point of failure with ${connCount} connections`,
          deviceId: device.id,
        });
      }

      // Check for isolated devices
      if (connCount === 0 && devices.length > 1) {
        issues.push({
          id: `isolated-${device.id}`,
          severity: 'warning',
          type: 'redundancy',
          message: `${device.label} is not connected to the network`,
          deviceId: device.id,
        });
      }

      // Check for devices with only one connection (no redundancy)
      if (connCount === 1 && (device.type === 'server' || device.type === 'router')) {
        issues.push({
          id: `single-conn-${device.id}`,
          severity: 'warning',
          type: 'redundancy',
          message: `${device.label} lacks redundant connections`,
          deviceId: device.id,
        });
      }
    });

    // Check for inefficient hub usage
    const hubs = devices.filter((d) => d.type === 'hub');
    if (hubs.length > 0) {
      issues.push({
        id: 'hub-warning',
        severity: 'info',
        type: 'best-practice',
        message: 'Hubs create collision domains - consider using switches instead',
      });
    }

    // Check for missing firewall
    const hasFirewall = devices.some((d) => d.type === 'firewall');
    const hasRouter = devices.some((d) => d.type === 'router');
    if (hasRouter && !hasFirewall && devices.length > 3) {
      issues.push({
        id: 'no-firewall',
        severity: 'warning',
        type: 'best-practice',
        message: 'Consider adding a firewall for network security',
      });
    }

    return issues;
  }, [devices, connections]);

  // Cost calculation
  const totalCost = useMemo(() => {
    const deviceCost = devices.reduce((sum, device) => sum + device.cost, 0);
    const connectionCost = connections.reduce((sum, conn) => sum + conn.cost, 0);
    return { devices: deviceCost, connections: connectionCost, total: deviceCost + connectionCost };
  }, [devices, connections]);

  // Export topology
  const exportTopology = () => {
    const topology = {
      name: 'Custom Topology',
      devices,
      connections,
      detectedType: detectedTopology,
      cost: totalCost,
      created: new Date().toISOString(),
    };

    const blob = new Blob([JSON.stringify(topology, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `topology-${Date.now()}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  // Educational hints
  const hints = useMemo(() => {
    const allHints = [
      {
        condition: devices.length === 0,
        message: 'Start by adding devices from the palette on the left',
      },
      {
        condition: devices.length > 0 && connections.length === 0,
        message: 'Click a device and then another to create connections',
      },
      {
        condition: detectedTopology === 'star',
        message:
          'Star topology detected: Simple but has a single point of failure at the central device',
      },
      {
        condition: detectedTopology === 'mesh',
        message: 'Mesh topology detected: Maximum redundancy but high cable costs',
      },
      {
        condition: detectedTopology === 'ring',
        message: 'Ring topology detected: Each device has exactly two connections',
      },
      {
        condition: validationIssues.some((i) => i.type === 'spof'),
        message: 'Consider adding redundant connections to eliminate single points of failure',
      },
      {
        condition: totalCost.total > 10000,
        message: 'High cost detected - consider optimizing device selection or cable routes',
      },
    ];

    return allHints.filter((h) => h.condition).map((h) => h.message);
  }, [devices, connections, detectedTopology, validationIssues, totalCost]);

  return (
    <div className={`topology-builder ${className}`}>
      {/* Header */}
      <div className="builder-header">
        <div className="header-content">
          <h2>Network Topology Builder</h2>
          <p>Design and validate network topologies with drag-and-drop</p>
        </div>

        <div className="header-actions">
          <button onClick={() => setShowTemplates(!showTemplates)} className="btn btn-secondary">
            Templates
          </button>
          <button onClick={clearCanvas} className="btn btn-outline" disabled={devices.length === 0}>
            Clear
          </button>
          <button onClick={undo} className="btn btn-outline" disabled={historyIndex <= 0}>
            Undo
          </button>
          <button
            onClick={redo}
            className="btn btn-outline"
            disabled={historyIndex >= history.length - 1}
          >
            Redo
          </button>
          <button
            onClick={exportTopology}
            className="btn btn-primary"
            disabled={devices.length === 0}
          >
            Export
          </button>
        </div>
      </div>

      <div className="builder-layout">
        {/* Device Palette */}
        <div className="device-palette">
          <h3>Devices</h3>
          <div className="palette-grid">
            {(Object.keys(deviceSpecs) as DeviceType[]).map((type) => (
              <button
                key={type}
                onClick={() => addDevice(type)}
                className="palette-item"
                title={`${deviceSpecs[type].label} - $${deviceSpecs[type].cost}`}
              >
                <span className="device-icon">{deviceSpecs[type].icon}</span>
                <span className="device-label">{deviceSpecs[type].label}</span>
                <span className="device-cost">${deviceSpecs[type].cost}</span>
              </button>
            ))}
          </div>

          {/* Connection Types */}
          <h3 style={{ marginTop: '2rem' }}>Connection</h3>
          <div className="connection-types">
            <div className="connection-type">
              <strong>Ethernet:</strong> ${connectionCosts.ethernet}/m
            </div>
            <div className="connection-type">
              <strong>Fiber:</strong> ${connectionCosts.fiber}/m
            </div>
            <div className="connection-type">
              <strong>Wireless:</strong> ${connectionCosts.wireless}/setup
            </div>
          </div>

          {/* Toggle Options */}
          <div className="palette-options">
            <label>
              <input
                type="checkbox"
                checked={showCost}
                onChange={(e) => setShowCost(e.target.checked)}
              />
              Show Costs
            </label>
            <label>
              <input
                type="checkbox"
                checked={showValidation}
                onChange={(e) => setShowValidation(e.target.checked)}
              />
              Show Validation
            </label>
            <label>
              <input
                type="checkbox"
                checked={showHints}
                onChange={(e) => setShowHints(e.target.checked)}
              />
              Show Hints
            </label>
          </div>
        </div>

        {/* Canvas */}
        <div className="builder-main">
          <div
            ref={canvasRef}
            className="topology-canvas"
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
            onMouseLeave={handleMouseUp}
          >
            {/* Draw connections */}
            <svg className="connections-layer">
              {connections.map((conn) => {
                const source = devices.find((d) => d.id === conn.sourceId);
                const target = devices.find((d) => d.id === conn.targetId);
                if (!source || !target) {
                  return null;
                }

                const x1 = source.position.x + 40;
                const y1 = source.position.y + 40;
                const x2 = target.position.x + 40;
                const y2 = target.position.y + 40;

                return (
                  <g key={conn.id}>
                    <line
                      x1={x1}
                      y1={y1}
                      x2={x2}
                      y2={y2}
                      className={`connection connection-${conn.type}`}
                      strokeWidth="2"
                      onClick={() => deleteConnection(conn.id)}
                      style={{ cursor: 'pointer' }}
                    />
                    {showCost && (
                      <text
                        x={(x1 + x2) / 2}
                        y={(y1 + y2) / 2}
                        className="connection-label"
                        textAnchor="middle"
                      >
                        ${conn.cost}
                      </text>
                    )}
                  </g>
                );
              })}

              {/* Draw temporary connection line */}
              {connecting && (
                <line
                  x1={(devices.find((d) => d.id === connecting)?.position.x ?? 0) + 40}
                  y1={(devices.find((d) => d.id === connecting)?.position.y ?? 0) + 40}
                  x2={(devices.find((d) => d.id === connecting)?.position.x ?? 0) + 40}
                  y2={(devices.find((d) => d.id === connecting)?.position.y ?? 0) + 40}
                  className="connection-temp"
                  strokeWidth="2"
                  strokeDasharray="5,5"
                />
              )}
            </svg>

            {/* Draw devices */}
            {devices.map((device) => {
              const hasIssue = validationIssues.some((i) => i.deviceId === device.id);
              return (
                <div
                  key={device.id}
                  className={`canvas-device ${selectedDevice === device.id ? 'selected' : ''} ${hasIssue ? 'has-issue' : ''}`}
                  style={{
                    left: device.position.x,
                    top: device.position.y,
                    cursor: dragging === device.id ? 'grabbing' : 'grab',
                  }}
                  onMouseDown={(e) => handleMouseDown(device.id, e)}
                >
                  <div className="device-icon-large">{deviceSpecs[device.type].icon}</div>
                  <div className="device-info">
                    <div className="device-name">{device.label}</div>
                    {showCost && <div className="device-cost-badge">${device.cost}</div>}
                  </div>
                  <div className="device-actions">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        startConnection(device.id);
                      }}
                      className={`btn-connect ${connecting === device.id ? 'active' : ''}`}
                      title="Connect"
                    >
                      🔗
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        deleteDevice(device.id);
                      }}
                      className="btn-delete"
                      title="Delete"
                    >
                      ×
                    </button>
                  </div>
                </div>
              );
            })}

            {/* Empty state */}
            {devices.length === 0 && (
              <div className="canvas-empty">
                <div className="empty-icon">🏗️</div>
                <h3>Start Building</h3>
                <p>Add devices from the palette to begin designing your network topology</p>
              </div>
            )}
          </div>

          {/* Info Panel */}
          <div className="builder-info">
            {/* Topology Detection */}
            <div className="info-card">
              <h3>Detected Topology</h3>
              <div className="topology-badge topology-badge-large">{detectedTopology}</div>
              <div className="topology-stats">
                <div>
                  <strong>Devices:</strong> {devices.length}
                </div>
                <div>
                  <strong>Connections:</strong> {connections.length}
                </div>
              </div>
            </div>

            {/* Cost Summary */}
            {showCost && (
              <div className="info-card">
                <h3>Cost Summary</h3>
                <div className="cost-breakdown">
                  <div className="cost-row">
                    <span>Devices:</span>
                    <span>${totalCost.devices.toLocaleString()}</span>
                  </div>
                  <div className="cost-row">
                    <span>Cabling:</span>
                    <span>${totalCost.connections.toLocaleString()}</span>
                  </div>
                  <div className="cost-row cost-total">
                    <span>Total:</span>
                    <span>${totalCost.total.toLocaleString()}</span>
                  </div>
                </div>
              </div>
            )}

            {/* Validation Issues */}
            {showValidation && validationIssues.length > 0 && (
              <div className="info-card">
                <h3>Validation Issues</h3>
                <div className="validation-list">
                  {validationIssues.map((issue) => (
                    <div key={issue.id} className={`validation-issue severity-${issue.severity}`}>
                      <span className="issue-icon">
                        {issue.severity === 'error'
                          ? '❌'
                          : issue.severity === 'warning'
                            ? '⚠️'
                            : 'ℹ️'}
                      </span>
                      <span className="issue-message">{issue.message}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Educational Hints */}
            {showHints && hints.length > 0 && (
              <div className="info-card">
                <h3>💡 Best Practices</h3>
                <div className="hints-list">
                  {hints.slice(0, 3).map((hint, idx) => (
                    <div key={idx} className="hint-item">
                      {hint}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Templates Modal */}
      {showTemplates && (
        <div className="modal-overlay" onClick={() => setShowTemplates(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>Load Template</h2>
              <button onClick={() => setShowTemplates(false)} className="modal-close">
                ×
              </button>
            </div>
            <div className="templates-grid">
              {templates.map((template) => (
                <div key={template.id} className="template-card">
                  <h3>{template.name}</h3>
                  <p>{template.description}</p>
                  <div className="template-stats">
                    <span>{template.devices.length} devices</span>
                    <span>{template.connections.length} connections</span>
                  </div>
                  <button onClick={() => loadTemplate(template)} className="btn btn-primary">
                    Load Template
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      <style>{`
        .topology-builder {
          min-height: 100vh;
          background: linear-gradient(to bottom, #f8fafc 0%, #e2e8f0 100%);
        }

        .builder-header {
          background: white;
          border-bottom: 1px solid #e2e8f0;
          padding: 1.5rem 2rem;
          display: flex;
          justify-content: space-between;
          align-items: center;
          box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
        }

        .header-content h2 {
          margin: 0 0 0.25rem 0;
          font-size: 1.75rem;
          color: #1e293b;
        }

        .header-content p {
          margin: 0;
          color: #64748b;
          font-size: 0.95rem;
        }

        .header-actions {
          display: flex;
          gap: 0.75rem;
        }

        .builder-layout {
          display: flex;
          height: calc(100vh - 120px);
        }

        .device-palette {
          width: 250px;
          background: white;
          border-right: 1px solid #e2e8f0;
          padding: 1.5rem;
          overflow-y: auto;
        }

        .device-palette h3 {
          margin: 0 0 1rem 0;
          font-size: 1.1rem;
          color: #1e293b;
        }

        .palette-grid {
          display: grid;
          grid-template-columns: 1fr;
          gap: 0.75rem;
        }

        .palette-item {
          background: #f8fafc;
          border: 2px solid #e2e8f0;
          border-radius: 8px;
          padding: 0.75rem;
          cursor: pointer;
          transition: all 0.2s;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 0.25rem;
        }

        .palette-item:hover {
          background: #e0f2fe;
          border-color: #0ea5e9;
          transform: translateY(-2px);
        }

        .device-icon {
          font-size: 1.5rem;
        }

        .device-label {
          font-size: 0.85rem;
          font-weight: 600;
          color: #334155;
        }

        .device-cost {
          font-size: 0.75rem;
          color: #64748b;
        }

        .connection-types {
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
          margin-top: 1rem;
        }

        .connection-type {
          font-size: 0.85rem;
          color: #475569;
        }

        .palette-options {
          margin-top: 2rem;
          display: flex;
          flex-direction: column;
          gap: 0.75rem;
        }

        .palette-options label {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          font-size: 0.9rem;
          color: #475569;
          cursor: pointer;
        }

        .builder-main {
          flex: 1;
          display: flex;
          flex-direction: column;
          position: relative;
        }

        .topology-canvas {
          flex: 1;
          position: relative;
          background:
            linear-gradient(90deg, #e2e8f0 1px, transparent 1px),
            linear-gradient(0deg, #e2e8f0 1px, transparent 1px);
          background-size: 20px 20px;
          overflow: hidden;
        }

        .connections-layer {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          pointer-events: none;
        }

        .connections-layer line {
          pointer-events: all;
        }

        .connection {
          stroke: #64748b;
        }

        .connection-ethernet {
          stroke: #0ea5e9;
        }

        .connection-fiber {
          stroke: #8b5cf6;
        }

        .connection-wireless {
          stroke: #10b981;
          stroke-dasharray: 5, 5;
        }

        .connection-temp {
          stroke: #94a3b8;
        }

        .connection-label {
          fill: #475569;
          font-size: 12px;
          font-weight: 600;
        }

        .canvas-device {
          position: absolute;
          width: 80px;
          height: 80px;
          background: white;
          border: 2px solid #cbd5e1;
          border-radius: 12px;
          padding: 0.5rem;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
          transition: all 0.2s;
          user-select: none;
        }

        .canvas-device:hover {
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
          z-index: 10;
        }

        .canvas-device.selected {
          border-color: #0ea5e9;
          box-shadow: 0 0 0 3px rgba(14, 165, 233, 0.2);
        }

        .canvas-device.has-issue {
          border-color: #ef4444;
        }

        .device-icon-large {
          font-size: 2rem;
        }

        .device-info {
          text-align: center;
          margin-top: 0.25rem;
        }

        .device-name {
          font-size: 0.7rem;
          font-weight: 600;
          color: #334155;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
          max-width: 70px;
        }

        .device-cost-badge {
          font-size: 0.65rem;
          color: #64748b;
        }

        .device-actions {
          position: absolute;
          top: -10px;
          right: -10px;
          display: flex;
          gap: 0.25rem;
          opacity: 0;
          transition: opacity 0.2s;
        }

        .canvas-device:hover .device-actions {
          opacity: 1;
        }

        .btn-connect,
        .btn-delete {
          width: 24px;
          height: 24px;
          border-radius: 50%;
          border: 1px solid #cbd5e1;
          background: white;
          cursor: pointer;
          font-size: 0.85rem;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: all 0.2s;
        }

        .btn-connect:hover {
          background: #0ea5e9;
          border-color: #0ea5e9;
          color: white;
        }

        .btn-connect.active {
          background: #10b981;
          border-color: #10b981;
          color: white;
        }

        .btn-delete:hover {
          background: #ef4444;
          border-color: #ef4444;
          color: white;
        }

        .canvas-empty {
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          text-align: center;
          color: #94a3b8;
        }

        .empty-icon {
          font-size: 4rem;
          margin-bottom: 1rem;
        }

        .builder-info {
          background: white;
          border-top: 1px solid #e2e8f0;
          padding: 1.5rem;
          display: flex;
          gap: 1.5rem;
          overflow-x: auto;
        }

        .info-card {
          flex: 1;
          min-width: 250px;
          background: #f8fafc;
          border: 1px solid #e2e8f0;
          border-radius: 8px;
          padding: 1rem;
        }

        .info-card h3 {
          margin: 0 0 1rem 0;
          font-size: 1rem;
          color: #1e293b;
        }

        .topology-badge {
          display: inline-block;
          padding: 0.5rem 1rem;
          background: #0ea5e9;
          color: white;
          border-radius: 6px;
          font-weight: 600;
          text-transform: uppercase;
          font-size: 0.85rem;
        }

        .topology-badge-large {
          font-size: 1.1rem;
          padding: 0.75rem 1.5rem;
        }

        .topology-stats {
          margin-top: 1rem;
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
          font-size: 0.9rem;
          color: #475569;
        }

        .cost-breakdown {
          display: flex;
          flex-direction: column;
          gap: 0.75rem;
        }

        .cost-row {
          display: flex;
          justify-content: space-between;
          font-size: 0.9rem;
          color: #475569;
        }

        .cost-total {
          font-weight: 700;
          font-size: 1.1rem;
          color: #1e293b;
          padding-top: 0.75rem;
          border-top: 2px solid #cbd5e1;
        }

        .validation-list {
          display: flex;
          flex-direction: column;
          gap: 0.75rem;
        }

        .validation-issue {
          display: flex;
          align-items: flex-start;
          gap: 0.5rem;
          padding: 0.75rem;
          border-radius: 6px;
          font-size: 0.85rem;
        }

        .severity-error {
          background: #fee2e2;
          color: #991b1b;
        }

        .severity-warning {
          background: #fef3c7;
          color: #92400e;
        }

        .severity-info {
          background: #dbeafe;
          color: #1e40af;
        }

        .issue-icon {
          flex-shrink: 0;
        }

        .hints-list {
          display: flex;
          flex-direction: column;
          gap: 0.75rem;
        }

        .hint-item {
          padding: 0.75rem;
          background: #e0f2fe;
          border-left: 3px solid #0ea5e9;
          border-radius: 4px;
          font-size: 0.85rem;
          color: #0c4a6e;
        }

        .modal-overlay {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: rgba(0, 0, 0, 0.5);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 1000;
        }

        .modal-content {
          background: white;
          border-radius: 12px;
          max-width: 800px;
          max-height: 80vh;
          overflow-y: auto;
          box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1);
        }

        .modal-header {
          padding: 1.5rem;
          border-bottom: 1px solid #e2e8f0;
          display: flex;
          justify-content: space-between;
          align-items: center;
        }

        .modal-header h2 {
          margin: 0;
          font-size: 1.5rem;
        }

        .modal-close {
          background: none;
          border: none;
          font-size: 2rem;
          cursor: pointer;
          color: #94a3b8;
          line-height: 1;
        }

        .modal-close:hover {
          color: #475569;
        }

        .templates-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
          gap: 1.5rem;
          padding: 1.5rem;
        }

        .template-card {
          background: #f8fafc;
          border: 2px solid #e2e8f0;
          border-radius: 8px;
          padding: 1.5rem;
          display: flex;
          flex-direction: column;
          gap: 1rem;
        }

        .template-card h3 {
          margin: 0;
          font-size: 1.1rem;
          color: #1e293b;
        }

        .template-card p {
          margin: 0;
          font-size: 0.9rem;
          color: #64748b;
          flex: 1;
        }

        .template-stats {
          display: flex;
          gap: 1rem;
          font-size: 0.85rem;
          color: #475569;
        }

        .btn {
          padding: 0.5rem 1rem;
          border-radius: 6px;
          font-weight: 600;
          cursor: pointer;
          border: none;
          transition: all 0.2s;
          font-size: 0.9rem;
        }

        .btn:disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }

        .btn-primary {
          background: #0ea5e9;
          color: white;
        }

        .btn-primary:hover:not(:disabled) {
          background: #0284c7;
        }

        .btn-secondary {
          background: #64748b;
          color: white;
        }

        .btn-secondary:hover:not(:disabled) {
          background: #475569;
        }

        .btn-outline {
          background: white;
          color: #475569;
          border: 2px solid #cbd5e1;
        }

        .btn-outline:hover:not(:disabled) {
          background: #f8fafc;
          border-color: #94a3b8;
        }
      `}</style>
    </div>
  );
};

export default TopologyBuilder;
