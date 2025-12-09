import React from 'react';
import type { FilterCategory } from '../types';

interface DeviceSelectorProps {
  filterCategory: FilterCategory;
  filterType: string;
  uniqueTypes: string[];
  availableDevices: Array<{ id: string; name: string }>;
  onFilterCategoryChange: (category: FilterCategory) => void;
  onFilterTypeChange: (type: string) => void;
  onAddDevice: (deviceId: string) => void;
}

export const DeviceSelector: React.FC<DeviceSelectorProps> = ({
  filterCategory,
  filterType,
  uniqueTypes,
  availableDevices,
  onFilterCategoryChange,
  onFilterTypeChange,
  onAddDevice,
}) => {
  return (
    <div className="mb-4">
      <h3 className="mb-2 text-lg font-semibold text-gray-900 dark:text-gray-100">
        Add Devices to Compare
      </h3>
      <div className="mb-3 flex gap-2">
        <select
          className="rounded border border-gray-300 bg-white px-3 py-2 text-gray-900 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-100"
          value={filterCategory}
          onChange={(e) => onFilterCategoryChange(e.target.value as FilterCategory)}
        >
          <option value="all">All Categories</option>
          <option value="physical">Physical</option>
          <option value="virtual">Virtual</option>
          <option value="cloud">Cloud</option>
        </select>

        <select
          className="rounded border border-gray-300 bg-white px-3 py-2 text-gray-900 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-100"
          value={filterType}
          onChange={(e) => onFilterTypeChange(e.target.value)}
        >
          <option value="all">All Types</option>
          {uniqueTypes.map((type) => (
            <option key={type} value={type}>
              {type.charAt(0).toUpperCase() + type.slice(1)}
            </option>
          ))}
        </select>
      </div>

      <div className="flex flex-wrap gap-2">
        {availableDevices.map((device) => (
          <button
            key={device.id}
            onClick={() => onAddDevice(device.id)}
            className="rounded bg-blue-500 px-3 py-1 text-sm text-white hover:bg-blue-600"
          >
            + {device.name}
          </button>
        ))}
      </div>
    </div>
  );
};
