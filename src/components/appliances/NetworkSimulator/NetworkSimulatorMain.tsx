import React, { useState } from 'react';
import type { NetworkSimulatorProps, NetworkConnection } from './types';
import { getTroubleshootingScenarios } from '../simulator-scenarios';
import { saveNetworkToFile } from './utils/networkStorage';
import { useSimulationState } from './hooks/useSimulationState';
import { useDeviceManagement } from './hooks/useDeviceManagement';
import { useConnectionManagement } from './hooks/useConnectionManagement';
import { useDeviceDragging } from './hooks/useDeviceDragging';
import { useKeyboardNavigation } from './hooks/useKeyboardNavigation';
import { useNetworkStorage } from './hooks/useNetworkStorage';
import { Toolbar } from './components/Toolbar';
import { ScenariosPanel } from './components/ScenariosPanel';
import { SaveLoadPanel } from './components/SaveLoadPanel';
import { DeviceConfigPanel } from './components/DeviceConfigPanel';
import { NetworkCanvas } from './components/NetworkCanvas';
import { InfoPanel } from './components/InfoPanel';
import { Instructions } from './components/Instructions';

const NetworkSimulatorMain: React.FC<NetworkSimulatorProps> = ({ initialDevices = [] }) => {
  const [devices, setDevices] = useState(initialDevices);
  const [connections, setConnections] = useState<NetworkConnection[]>([]);
  const [showScenarios, setShowScenarios] = useState(false);

  // Custom hooks for state management
  const { simulationState, toggleSimulation, resetSimulation } = useSimulationState(
    devices,
    connections,
    setDevices
  );

  const {
    selectedDevice,
    setSelectedDevice,
    showConfigPanel,
    setShowConfigPanel,
    deviceConfig,
    setDeviceConfig,
    addDevice,
    removeDevice,
    openDeviceConfig,
    updateDeviceConfig,
  } = useDeviceManagement(devices, setDevices, connections, setConnections);

  const { connecting, startConnection, completeConnection } = useConnectionManagement(
    connections,
    setConnections,
    setDevices
  );

  const { canvasRef, handleMouseDown, handleMouseMove, handleMouseUp } = useDeviceDragging(
    setDevices,
    setSelectedDevice,
    connecting
  );

  const { handleKeyDown } = useKeyboardNavigation(
    selectedDevice,
    devices,
    setSelectedDevice,
    setDevices,
    openDeviceConfig,
    removeDevice
  );

  const {
    savedNetworks,
    showSaveDialog,
    setShowSaveDialog,
    saveNetworkDesign,
    loadNetworkDesign,
    deleteNetworkDesign,
  } = useNetworkStorage(setDevices, setConnections, resetSimulation);

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

  const exportNetworkDesign = () => {
    saveNetworkToFile(devices, connections);
  };

  const selectedDeviceData = devices.find((d) => d.id === selectedDevice);

  return (
    <div
      className="rounded-lg bg-white p-6 shadow-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
      tabIndex={0}
      onKeyDown={handleKeyDown}
      role="application"
      aria-label="Network Architecture Simulator"
    >
      <Toolbar
        addDevice={addDevice}
        simulationState={simulationState}
        toggleSimulation={toggleSimulation}
        resetSimulation={resetSimulation}
        setShowScenarios={setShowScenarios}
        showScenarios={showScenarios}
        setShowSaveDialog={setShowSaveDialog}
        showSaveDialog={showSaveDialog}
        exportNetworkDesign={exportNetworkDesign}
      />

      <ScenariosPanel
        showScenarios={showScenarios}
        setShowScenarios={setShowScenarios}
        scenarios={troubleshootingScenarios}
        loadScenario={loadScenario}
      />

      <SaveLoadPanel
        showSaveDialog={showSaveDialog}
        setShowSaveDialog={setShowSaveDialog}
        saveNetworkDesign={(name) => saveNetworkDesign(name, devices, connections)}
        savedNetworks={savedNetworks}
        loadNetworkDesign={loadNetworkDesign}
        deleteNetworkDesign={deleteNetworkDesign}
      />

      <DeviceConfigPanel
        showConfigPanel={showConfigPanel}
        setShowConfigPanel={setShowConfigPanel}
        selectedDeviceData={selectedDeviceData}
        deviceConfig={deviceConfig}
        setDeviceConfig={setDeviceConfig}
        updateDeviceConfig={updateDeviceConfig}
      />

      <NetworkCanvas
        canvasRef={canvasRef}
        devices={devices}
        connections={connections}
        simulationState={simulationState}
        selectedDevice={selectedDevice}
        connecting={connecting}
        handleMouseDown={handleMouseDown}
        handleMouseMove={handleMouseMove}
        handleMouseUp={handleMouseUp}
        startConnection={startConnection}
        completeConnection={completeConnection}
        openDeviceConfig={openDeviceConfig}
        removeDevice={removeDevice}
      />

      <InfoPanel
        simulationState={simulationState}
        devices={devices}
        connections={connections}
        selectedDeviceData={selectedDeviceData}
      />

      <Instructions />
    </div>
  );
};

export default NetworkSimulatorMain;
