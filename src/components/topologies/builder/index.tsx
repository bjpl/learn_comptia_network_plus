/**
 * TopologyBuilder - Main Orchestrator (Refactored)
 */

import React, { useState, useCallback, useMemo } from 'react';
import { DeviceToolbox } from './components/DeviceToolbox';
import { BuilderCanvas } from './components/BuilderCanvas';
import { InfoPanel } from './components/InfoPanel';
import { useBuilderState } from './hooks/useBuilderState';
import { useDeviceManagement } from './hooks/useDeviceManagement';
import { useConnectionManagement } from './hooks/useConnectionManagement';
import { detectTopologyType, validateTopology, calculateTotalCost } from './utils/topologyValidation';
import { templates } from './data/deviceTypes';
import type { TopologyBuilderProps, TopologyTemplate, BuilderDevice } from './types';

export const TopologyBuilder: React.FC<TopologyBuilderProps> = ({ className = '' }) => {
  const builderState = useBuilderState();
  const {
    devices, connections, selectedDevice, dragging, connecting,
    setDevices, setConnections, setSelectedDevice, setDragging, setConnecting,
    saveToHistory, undo, redo, clearCanvas
  } = builderState;

  const [showTemplates, setShowTemplates] = useState(false);
  const [showCost, setShowCost] = useState(true);
  const [showValidation, setShowValidation] = useState(false);
  const [showHints, setShowHints] = useState(true);

  const { addDevice, deleteDevice } = useDeviceManagement({
    devices, connections, setDevices, setConnections, setSelectedDevice, saveToHistory
  });

  const { startConnection, deleteConnection } = useConnectionManagement({
    devices, connections, connecting, setConnecting, setConnections, saveToHistory
  });

  const handleMouseDown = useCallback((deviceId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (connecting) return;
    setDragging(deviceId);
    setSelectedDevice(deviceId);
  }, [connecting, setDragging, setSelectedDevice]);

  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    if (!dragging) return;
    const canvas = e.currentTarget as HTMLElement;
    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    setDevices((prev: BuilderDevice[]) => prev.map((device: BuilderDevice) => device.id === dragging
      ? { ...device, position: { x: Math.max(0, Math.min(x, rect.width - 80)), y: Math.max(0, Math.min(y, rect.height - 80)) } }
      : device
    ));
  }, [dragging, setDevices]);

  const handleMouseUp = useCallback(() => {
    if (dragging) saveToHistory(devices, connections);
    setDragging(null);
  }, [dragging, devices, connections, saveToHistory, setDragging]);

  const loadTemplate = useCallback((template: TopologyTemplate) => {
    setDevices(template.devices);
    setConnections(template.connections);
    setShowTemplates(false);
    saveToHistory(template.devices, template.connections);
  }, [setDevices, setConnections, saveToHistory]);

  const exportTopology = useCallback(() => {
    const topology = {
      name: 'Custom Topology', devices, connections,
      detectedType: detectTopologyType(devices, connections),
      cost: calculateTotalCost(devices, connections),
      created: new Date().toISOString()
    };
    const blob = new Blob([JSON.stringify(topology, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `topology-${Date.now()}.json`;
    a.click();
    URL.revokeObjectURL(url);
  }, [devices, connections]);

  const detectedTopology = useMemo(() => detectTopologyType(devices, connections), [devices, connections]);
  const validationIssues = useMemo(() => validateTopology(devices, connections), [devices, connections]);
  const totalCost = useMemo(() => calculateTotalCost(devices, connections), [devices, connections]);
  const canUndo = builderState.historyIndex > 0;
  const canRedo = builderState.historyIndex < builderState.history.length - 1;

  return (
    <div className={`topology-builder ${className}`}>
      <div className="builder-header">
        <div className="header-content">
          <h2>Network Topology Builder</h2>
          <p>Design and validate network topologies with drag-and-drop</p>
        </div>
        <div className="header-actions">
          <button onClick={() => setShowTemplates(!showTemplates)} className="btn btn-secondary">Templates</button>
          <button onClick={clearCanvas} className="btn btn-outline" disabled={devices.length === 0}>Clear</button>
          <button onClick={undo} className="btn btn-outline" disabled={!canUndo}>Undo</button>
          <button onClick={redo} className="btn btn-outline" disabled={!canRedo}>Redo</button>
          <button onClick={exportTopology} className="btn btn-primary" disabled={devices.length === 0}>Export</button>
        </div>
      </div>
      <div className="builder-layout">
        <DeviceToolbox
          onAddDevice={addDevice} showCost={showCost} showValidation={showValidation} showHints={showHints}
          onToggleCost={setShowCost} onToggleValidation={setShowValidation} onToggleHints={setShowHints}
        />
        <div className="builder-main">
          <BuilderCanvas
            devices={devices} connections={connections} selectedDevice={selectedDevice}
            dragging={dragging} connecting={connecting} validationIssues={validationIssues} showCost={showCost}
            onMouseDown={handleMouseDown} onMouseMove={handleMouseMove} onMouseUp={handleMouseUp}
            onStartConnection={startConnection} onDeleteDevice={deleteDevice}
            onDeleteConnection={deleteConnection} onDevicePositionChange={setDevices}
          />
          <InfoPanel
            detectedTopology={detectedTopology} devices={devices} connections={connections}
            totalCost={totalCost} validationIssues={validationIssues}
            showCost={showCost} showValidation={showValidation} showHints={showHints}
          />
        </div>
      </div>
      {showTemplates && (
        <div className="modal-overlay" onClick={() => setShowTemplates(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>Load Template</h2>
              <button onClick={() => setShowTemplates(false)} className="modal-close">×</button>
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
                  <button onClick={() => loadTemplate(template)} className="btn btn-primary">Load Template</button>
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
export type { DeviceType, DetectedTopologyType, BuilderDevice, BuilderConnection, TopologyTemplate, ValidationIssue, TopologyBuilderProps } from './types';
