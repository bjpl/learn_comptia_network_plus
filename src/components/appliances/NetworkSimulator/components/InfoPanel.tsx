import React from 'react';
import type { SimulatedDevice, NetworkConnection, SimulationState } from '../types';

interface InfoPanelProps {
  simulationState: SimulationState;
  devices: SimulatedDevice[];
  connections: NetworkConnection[];
  selectedDeviceData: SimulatedDevice | undefined;
}

export const InfoPanel: React.FC<InfoPanelProps> = ({
  simulationState,
  devices,
  connections,
  selectedDeviceData,
}) => {
  return (
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
  );
};
