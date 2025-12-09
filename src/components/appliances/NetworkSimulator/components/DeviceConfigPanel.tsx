import React from 'react';
import type { SimulatedDevice, DeviceConfig } from '../types';

interface DeviceConfigPanelProps {
  showConfigPanel: boolean;
  setShowConfigPanel: (show: boolean) => void;
  selectedDeviceData: SimulatedDevice | undefined;
  deviceConfig: DeviceConfig | null;
  setDeviceConfig: React.Dispatch<React.SetStateAction<DeviceConfig | null>>;
  updateDeviceConfig: () => void;
}

export const DeviceConfigPanel: React.FC<DeviceConfigPanelProps> = ({
  showConfigPanel,
  setShowConfigPanel,
  selectedDeviceData,
  deviceConfig,
  setDeviceConfig,
  updateDeviceConfig,
}) => {
  if (!showConfigPanel || !selectedDeviceData) return null;

  return (
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
          <label htmlFor="device-name" className="block text-sm font-medium">
            Device Name
          </label>
          <input
            id="device-name"
            type="text"
            value={deviceConfig?.name || ''}
            onChange={(e) =>
              setDeviceConfig(deviceConfig ? { ...deviceConfig, name: e.target.value } : null)
            }
            className="mt-1 w-full rounded border border-gray-300 px-2 py-1 text-sm"
          />
        </div>
        <div>
          <label htmlFor="device-throughput" className="block text-sm font-medium">
            Throughput
          </label>
          <input
            id="device-throughput"
            type="text"
            value={deviceConfig?.throughput || ''}
            onChange={(e) =>
              setDeviceConfig(deviceConfig ? { ...deviceConfig, throughput: e.target.value } : null)
            }
            className="mt-1 w-full rounded border border-gray-300 px-2 py-1 text-sm"
          />
        </div>
        <div>
          <label htmlFor="device-max-connections" className="block text-sm font-medium">
            Max Connections
          </label>
          <input
            id="device-max-connections"
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
  );
};
