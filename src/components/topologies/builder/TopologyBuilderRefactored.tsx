/**
 * TopologyBuilder Component (Refactored)
 * Interactive network topology design tool with drag-and-drop, validation, and templates
 *
 * REFACTORED: Main orchestrator component (<350 lines)
 * Logic extracted to hooks, utils, and subcomponents
 */

import React, { useState, useCallback, useMemo } from 'react';
import { DeviceToolbox } from './components/DeviceToolbox';
import { BuilderCanvas } from './components/BuilderCanvas';
import { InfoPanel } from './components/InfoPanel';
import { useBuilderState } from './hooks/useBuilderState';
import { detectTopologyType, validateTopology, calculateTotalCost } from './utils/topologyValidation';
import { deviceSpecs, templates } from './constants';
import type { DeviceType, TopologyTemplate, BuilderDevice } from './types';

interface TopologyBuilderProps {
  className?: string;
}

export const TopologyBuilder: React.FC<TopologyBuilderProps> = ({ className = '' }) => {
  const {
    devices,
    setDevices,
    connections,
    setConnections,
    selectedDevice,
    setSelectedDevice,
    dragging,
    setDragging,
    connecting,
    setConnecting,
    saveToHistory,
    undo,
    redo,
    clearCanvas,
    canUndo,
    canRedo,
  } = useBuilderState();

  const [showTemplates, setShowTemplates] = useState(false);
  const [showCost, setShowCost] = useState(true);
  const [showValidation, setShowValidation] = useState(false);
  const [showHints, setShowHints] = useState(true);

  // Add device to canvas
  const addDevice = useCallback(
    (type: DeviceType) => {
      const newDevice = {
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
    [devices, connections, setDevices, saveToHistory]
  );

  // Handle device dragging
  const handleMouseDown = (deviceId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (connecting) return;
    setDragging(deviceId);
    setSelectedDevice(deviceId);
  };

  const handleMouseMove = useCallback(
    (e: React.MouseEvent) => {
      if (!dragging) return;

      const canvas = e.currentTarget as HTMLElement;
      const rect = canvas.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      setDevices((prev: BuilderDevice[]) =>
        prev.map((device: BuilderDevice) =>
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
    [dragging, setDevices]
  );

  const handleMouseUp = useCallback(() => {
    if (dragging) {
      saveToHistory(devices, connections);
    }
    setDragging(null);
  }, [dragging, devices, connections, saveToHistory, setDragging]);

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

  // Computed values
  const detectedTopology = useMemo(
    () => detectTopologyType(devices, connections),
    [devices, connections]
  );

  const validationIssues = useMemo(
    () => validateTopology(devices, connections),
    [devices, connections]
  );

  const totalCost = useMemo(
    () => calculateTotalCost(devices, connections),
    [devices, connections]
  );

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
          <button onClick={undo} className="btn btn-outline" disabled={!canUndo}>
            Undo
          </button>
          <button onClick={redo} className="btn btn-outline" disabled={!canRedo}>
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
        <DeviceToolbox
          onAddDevice={addDevice}
          showCost={showCost}
          showValidation={showValidation}
          showHints={showHints}
          onToggleCost={setShowCost}
          onToggleValidation={setShowValidation}
          onToggleHints={setShowHints}
        />

        <div className="builder-main">
          <BuilderCanvas
            devices={devices}
            connections={connections}
            selectedDevice={selectedDevice}
            dragging={dragging}
            connecting={connecting}
            validationIssues={validationIssues}
            showCost={showCost}
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
            onStartConnection={startConnection}
            onDeleteDevice={deleteDevice}
            onDeleteConnection={deleteConnection}
            onDevicePositionChange={setDevices}
          />

          <InfoPanel
            detectedTopology={detectedTopology}
            devices={devices}
            connections={connections}
            totalCost={totalCost}
            validationIssues={validationIssues}
            showCost={showCost}
            showValidation={showValidation}
            showHints={showHints}
          />
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
    </div>
  );
};

export default TopologyBuilder;
