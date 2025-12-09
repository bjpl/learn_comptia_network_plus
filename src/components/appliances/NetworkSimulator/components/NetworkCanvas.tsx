import React from 'react';
import type { SimulatedDevice, NetworkConnection, SimulationState } from '../types';
import { getDeviceIcon, getStatusColor } from '../utils/deviceHelpers';

interface NetworkCanvasProps {
  canvasRef: React.RefObject<HTMLDivElement>;
  devices: SimulatedDevice[];
  connections: NetworkConnection[];
  simulationState: SimulationState;
  selectedDevice: string | null;
  connecting: string | null;
  handleMouseDown: (deviceId: string, e: React.MouseEvent) => void;
  handleMouseMove: (e: React.MouseEvent) => void;
  handleMouseUp: () => void;
  startConnection: (deviceId: string) => void;
  completeConnection: (deviceId: string) => void;
  openDeviceConfig: (deviceId: string) => void;
  removeDevice: (deviceId: string) => void;
}

export const NetworkCanvas: React.FC<NetworkCanvasProps> = ({
  canvasRef,
  devices,
  connections,
  simulationState,
  selectedDevice,
  connecting,
  handleMouseDown,
  handleMouseMove,
  handleMouseUp,
  startConnection,
  completeConnection,
  openDeviceConfig,
  removeDevice,
}) => {
  return (
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
  );
};
