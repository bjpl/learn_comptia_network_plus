import React from 'react';
import type { ComparisonDevice } from '../../appliances-types';

interface ComparisonTableProps {
  selectedDevices: ComparisonDevice[];
  onRemoveDevice: (deviceId: string) => void;
}

const ComparisonTable: React.FC<ComparisonTableProps> = ({ selectedDevices, onRemoveDevice }) => {
  if (selectedDevices.length === 0) {
    return null;
  }

  return (
    <div className="rounded-lg bg-white p-6 shadow-lg dark:bg-gray-800">
      <h3 className="mb-4 text-lg font-semibold text-gray-900 dark:text-gray-100">
        Device Comparison
      </h3>
      <div className="overflow-x-auto">
        <table className="min-w-full border-collapse">
          <thead>
            <tr className="bg-gray-100 dark:bg-gray-700">
              <th className="border p-3 text-left font-semibold text-gray-900 dark:text-gray-100">
                Feature
              </th>
              {selectedDevices.map((device) => (
                <th key={device.id} className="min-w-[200px] border p-3">
                  <div className="flex items-start justify-between">
                    <div className="text-left">
                      <div className="font-bold text-gray-900 dark:text-gray-100">
                        {device.name}
                      </div>
                      <div className="text-xs text-gray-600 dark:text-gray-400">
                        {device.manufacturer}
                      </div>
                      <span className="mt-1 inline-block rounded bg-blue-100 px-2 py-1 text-xs font-medium text-blue-900 dark:bg-blue-900 dark:text-blue-100">
                        Layer {device.primaryOsiLayer}
                      </span>
                    </div>
                    <button
                      onClick={() => onRemoveDevice(device.id)}
                      className="ml-2 text-red-500 hover:text-red-700"
                      title="Remove from comparison"
                    >
                      ×
                    </button>
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {/* OSI Layer */}
            <tr className="bg-gray-50 dark:bg-gray-700">
              <td
                colSpan={selectedDevices.length + 1}
                className="border p-2 font-semibold text-gray-900 dark:text-gray-100"
              >
                OSI Layer Operation
              </td>
            </tr>
            <tr>
              <td className="border p-3 font-medium text-gray-900 dark:text-gray-100">
                Primary Layer
              </td>
              {selectedDevices.map((device) => (
                <td key={device.id} className="border p-3">
                  Layer {device.primaryOsiLayer}
                </td>
              ))}
            </tr>
            <tr>
              <td className="border p-3 font-medium text-gray-900 dark:text-gray-100">
                Description
              </td>
              {selectedDevices.map((device) => (
                <td key={device.id} className="border p-3 text-sm">
                  {device.osiLayerDescription}
                </td>
              ))}
            </tr>

            {/* Domains */}
            <tr className="bg-gray-50 dark:bg-gray-700">
              <td
                colSpan={selectedDevices.length + 1}
                className="border p-2 font-semibold text-gray-900 dark:text-gray-100"
              >
                Collision & Broadcast Domains
              </td>
            </tr>
            <tr>
              <td className="border p-3 font-medium text-gray-900 dark:text-gray-100">
                Collision Domains
              </td>
              {selectedDevices.map((device) => (
                <td key={device.id} className="border p-3">
                  <span className="capitalize">{device.collisionDomains}</span>
                </td>
              ))}
            </tr>
            <tr>
              <td className="border p-3 font-medium text-gray-900 dark:text-gray-100">
                Broadcast Domains
              </td>
              {selectedDevices.map((device) => (
                <td key={device.id} className="border p-3">
                  <span className="capitalize">{device.broadcastDomains}</span>
                </td>
              ))}
            </tr>

            {/* Specs */}
            <tr className="bg-gray-50 dark:bg-gray-700">
              <td
                colSpan={selectedDevices.length + 1}
                className="border p-2 font-semibold text-gray-900 dark:text-gray-100"
              >
                Performance Specifications
              </td>
            </tr>
            <tr>
              <td className="border p-3 font-medium text-gray-900 dark:text-gray-100">
                Throughput
              </td>
              {selectedDevices.map((device) => (
                <td key={device.id} className="border p-3">
                  {device.specs.throughput}
                </td>
              ))}
            </tr>
            <tr>
              <td className="border p-3 font-medium text-gray-900 dark:text-gray-100">Ports</td>
              {selectedDevices.map((device) => (
                <td key={device.id} className="border p-3">
                  {device.specs.portCount || 'N/A'}
                </td>
              ))}
            </tr>

            {/* Pricing */}
            <tr className="bg-gray-50 dark:bg-gray-700">
              <td
                colSpan={selectedDevices.length + 1}
                className="border p-2 font-semibold text-gray-900 dark:text-gray-100"
              >
                Pricing
              </td>
            </tr>
            <tr>
              <td className="border p-3 font-medium text-gray-900 dark:text-gray-100">
                Initial Cost
              </td>
              {selectedDevices.map((device) => (
                <td key={device.id} className="border p-3 font-semibold">
                  ${device.pricing.initialCost.toLocaleString()}
                </td>
              ))}
            </tr>

            {/* When to Use */}
            <tr className="bg-gray-50 dark:bg-gray-700">
              <td
                colSpan={selectedDevices.length + 1}
                className="border p-2 font-semibold text-gray-900 dark:text-gray-100"
              >
                Use Cases
              </td>
            </tr>
            <tr>
              <td className="border p-3 font-medium text-gray-900 dark:text-gray-100">
                When to Use
              </td>
              {selectedDevices.map((device) => (
                <td key={device.id} className="border p-3">
                  {device.whenToUse && device.whenToUse.length > 0 ? (
                    <ul className="list-inside list-disc text-sm">
                      {device.whenToUse.slice(0, 3).map((use, idx) => (
                        <li key={idx}>{use}</li>
                      ))}
                    </ul>
                  ) : (
                    <span className="text-sm text-gray-500 dark:text-gray-400">N/A</span>
                  )}
                </td>
              ))}
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ComparisonTable;
