import React from 'react';
import type { SimulatedDevice, SimulationState } from '../types';
import { DEVICE_TYPE_OPTIONS, KEYBOARD_SHORTCUTS } from '../utils/constants';
import { getDeviceIcon } from '../utils/deviceHelpers';

interface ToolbarProps {
  addDevice: (type: SimulatedDevice['type']) => void;
  simulationState: SimulationState;
  toggleSimulation: () => void;
  resetSimulation: () => void;
  setShowScenarios: (show: boolean) => void;
  showScenarios: boolean;
  setShowSaveDialog: (show: boolean) => void;
  showSaveDialog: boolean;
  exportNetworkDesign: () => void;
}

export const Toolbar: React.FC<ToolbarProps> = ({
  addDevice,
  simulationState,
  toggleSimulation,
  resetSimulation,
  setShowScenarios,
  showScenarios,
  setShowSaveDialog,
  showSaveDialog,
  exportNetworkDesign,
}) => {
  return (
    <>
      <div className="mb-2 flex items-center justify-between">
        <h2 className="text-2xl font-bold">Network Architecture Simulator</h2>
        <button
          className="rounded bg-gray-200 px-3 py-1 text-sm hover:bg-gray-300"
          onClick={() => {
            alert('Keyboard Shortcuts:\n\n' + KEYBOARD_SHORTCUTS.join('\n'));
          }}
          title="Show keyboard shortcuts"
        >
          ⌨️ Shortcuts
        </button>
      </div>

      <div className="mb-4 flex flex-wrap items-center gap-2">
        <div className="flex flex-wrap gap-2">
          {DEVICE_TYPE_OPTIONS.map((option) => (
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
    </>
  );
};
