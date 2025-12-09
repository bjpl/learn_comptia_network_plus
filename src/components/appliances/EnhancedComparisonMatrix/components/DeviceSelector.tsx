import React from 'react';
import type { ComparisonDevice } from '../../appliances-types';

interface DeviceSelectorProps {
  filteredDevices: ComparisonDevice[];
  selectedDeviceIds: string[];
  onAddDevice: (deviceId: string) => void;
}

const DeviceSelector: React.FC<DeviceSelectorProps> = ({
  filteredDevices,
  selectedDeviceIds,
  onAddDevice,
}) => {
  const availableDevices = filteredDevices.filter((d) => !selectedDeviceIds.includes(d.id));

  return (
    <div className="rounded-lg bg-white p-6 shadow-lg dark:bg-gray-800">
      <h3 className="mb-4 text-lg font-semibold text-gray-900 dark:text-gray-100">
        Available Devices ({filteredDevices.length})
      </h3>
      <div className="flex flex-wrap gap-2">
        {availableDevices.map((device) => (
          <button
            key={device.id}
            onClick={() => onAddDevice(device.id)}
            disabled={selectedDeviceIds.length >= 5}
            className="rounded-lg bg-blue-500 px-3 py-2 text-sm text-white hover:bg-blue-600 disabled:cursor-not-allowed disabled:opacity-50"
          >
            + {device.name}
            <span className="ml-2 text-xs opacity-75">(Layer {device.primaryOsiLayer})</span>
          </button>
        ))}
      </div>
      {selectedDeviceIds.length >= 5 && (
        <div className="mt-3 rounded bg-yellow-50 p-2 text-sm font-medium text-yellow-900 dark:bg-yellow-900 dark:text-yellow-100">
          Maximum 5 devices can be compared at once. Remove a device to add another.
        </div>
      )}
    </div>
  );
};

export default DeviceSelector;
