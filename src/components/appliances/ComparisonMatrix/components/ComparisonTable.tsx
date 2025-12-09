import React from 'react';
import type { SortField, SortDirection } from '../types';
import { getCategoryBadgeColor, getFeatureIcon } from '../utils';

interface NetworkDevice {
  id: string;
  name: string;
  model: string;
  category: string;
  manufacturer?: string;
  type: string;
  specs: {
    throughput: string;
    maxConnections: number;
    memoryGB?: number;
    powerConsumption: string;
  };
  features: {
    layer3Routing: boolean;
    vpnSupport: boolean;
    deepPacketInspection: boolean;
    highAvailability: boolean;
  };
  pricing: {
    initialCost: number;
    totalCostYear1: number;
    totalCost3Years: number;
    totalCost5Years: number;
  };
  useCase: string[];
  pros: string[];
  cons: string[];
}

interface ComparisonTableProps {
  sortedDevices: NetworkDevice[];
  sortField: SortField;
  sortDirection: SortDirection;
  onSort: (field: SortField) => void;
  onRemoveDevice: (deviceId: string) => void;
}

export const ComparisonTable: React.FC<ComparisonTableProps> = ({
  sortedDevices,
  sortField,
  sortDirection,
  onSort,
  onRemoveDevice,
}) => {
  return (
    <div className="overflow-x-auto">
      <table className="min-w-full border-collapse">
        <thead>
          <tr className="bg-gray-100 dark:bg-gray-700">
            <th className="border p-3 text-left font-semibold text-gray-900 dark:text-gray-100">
              Feature
            </th>
            {sortedDevices.map((device) => (
              <th key={device.id} className="min-w-[200px] border p-3 text-left">
                <div className="flex items-start justify-between">
                  <div>
                    <div className="font-bold text-gray-900 dark:text-gray-100">{device.name}</div>
                    <div className="text-xs text-gray-600 dark:text-gray-300">{device.model}</div>
                    <span
                      className={`mt-1 inline-block rounded px-2 py-1 text-xs ${getCategoryBadgeColor(device.category)}`}
                    >
                      {device.category}
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
          {/* Basic Info */}
          <tr className="bg-gray-50 dark:bg-gray-700">
            <td
              colSpan={sortedDevices.length + 1}
              className="border p-2 font-semibold text-gray-900 dark:text-gray-100"
            >
              Basic Information
            </td>
          </tr>
          <tr>
            <td className="border p-3 font-medium text-gray-900 dark:text-gray-100">
              Manufacturer
            </td>
            {sortedDevices.map((device) => (
              <td key={device.id} className="border p-3">
                {device.manufacturer || 'N/A'}
              </td>
            ))}
          </tr>
          <tr>
            <td className="border p-3 font-medium text-gray-900 dark:text-gray-100">Type</td>
            {sortedDevices.map((device) => (
              <td key={device.id} className="border p-3 capitalize">
                {device.type}
              </td>
            ))}
          </tr>

          {/* Performance Specs */}
          <tr className="bg-gray-50 dark:bg-gray-700">
            <td
              colSpan={sortedDevices.length + 1}
              className="border p-2 font-semibold text-gray-900 dark:text-gray-100"
            >
              Performance Specifications
            </td>
          </tr>
          <tr>
            <td
              className="cursor-pointer border p-3 font-medium text-gray-900 hover:bg-gray-50 dark:text-gray-100 dark:hover:bg-gray-600"
              onClick={() => onSort('throughput')}
            >
              Throughput {sortField === 'throughput' && (sortDirection === 'asc' ? '↑' : '↓')}
            </td>
            {sortedDevices.map((device) => (
              <td key={device.id} className="border p-3">
                {device.specs.throughput}
              </td>
            ))}
          </tr>
          <tr>
            <td
              className="cursor-pointer border p-3 font-medium text-gray-900 hover:bg-gray-50 dark:text-gray-100 dark:hover:bg-gray-600"
              onClick={() => onSort('maxConnections')}
            >
              Max Connections{' '}
              {sortField === 'maxConnections' && (sortDirection === 'asc' ? '↑' : '↓')}
            </td>
            {sortedDevices.map((device) => (
              <td key={device.id} className="border p-3">
                {device.specs.maxConnections.toLocaleString()}
              </td>
            ))}
          </tr>
          <tr>
            <td className="border p-3 font-medium text-gray-900 dark:text-gray-100">Memory</td>
            {sortedDevices.map((device) => (
              <td key={device.id} className="border p-3">
                {device.specs.memoryGB ? `${device.specs.memoryGB} GB` : 'N/A'}
              </td>
            ))}
          </tr>
          <tr>
            <td className="border p-3 font-medium text-gray-900 dark:text-gray-100">
              Power Consumption
            </td>
            {sortedDevices.map((device) => (
              <td key={device.id} className="border p-3">
                {device.specs.powerConsumption}
              </td>
            ))}
          </tr>

          {/* Features */}
          <tr className="bg-gray-50 dark:bg-gray-700">
            <td
              colSpan={sortedDevices.length + 1}
              className="border p-2 font-semibold text-gray-900 dark:text-gray-100"
            >
              Features
            </td>
          </tr>
          <tr>
            <td className="border p-3 font-medium text-gray-900 dark:text-gray-100">
              Layer 3 Routing
            </td>
            {sortedDevices.map((device) => (
              <td key={device.id} className="border p-3 text-center">
                {getFeatureIcon(device.features.layer3Routing)}
              </td>
            ))}
          </tr>
          <tr>
            <td className="border p-3 font-medium text-gray-900 dark:text-gray-100">
              VPN Support
            </td>
            {sortedDevices.map((device) => (
              <td key={device.id} className="border p-3 text-center">
                {getFeatureIcon(device.features.vpnSupport)}
              </td>
            ))}
          </tr>
          <tr>
            <td className="border p-3 font-medium text-gray-900 dark:text-gray-100">
              Deep Packet Inspection
            </td>
            {sortedDevices.map((device) => (
              <td key={device.id} className="border p-3 text-center">
                {getFeatureIcon(device.features.deepPacketInspection)}
              </td>
            ))}
          </tr>
          <tr>
            <td className="border p-3 font-medium text-gray-900 dark:text-gray-100">
              High Availability
            </td>
            {sortedDevices.map((device) => (
              <td key={device.id} className="border p-3 text-center">
                {getFeatureIcon(device.features.highAvailability)}
              </td>
            ))}
          </tr>

          {/* Pricing */}
          <tr className="bg-gray-50 dark:bg-gray-700">
            <td
              colSpan={sortedDevices.length + 1}
              className="border p-2 font-semibold text-gray-900 dark:text-gray-100"
            >
              Total Cost of Ownership
            </td>
          </tr>
          <tr>
            <td className="border p-3 font-medium text-gray-900 dark:text-gray-100">
              Initial Cost
            </td>
            {sortedDevices.map((device) => (
              <td key={device.id} className="border p-3">
                ${device.pricing.initialCost.toLocaleString()}
              </td>
            ))}
          </tr>
          <tr>
            <td
              className="cursor-pointer border p-3 font-medium text-gray-900 hover:bg-gray-50 dark:text-gray-100 dark:hover:bg-gray-600"
              onClick={() => onSort('cost1yr')}
            >
              Year 1 Total {sortField === 'cost1yr' && (sortDirection === 'asc' ? '↑' : '↓')}
            </td>
            {sortedDevices.map((device) => (
              <td key={device.id} className="border p-3 font-semibold">
                ${device.pricing.totalCostYear1.toLocaleString()}
              </td>
            ))}
          </tr>
          <tr>
            <td className="border p-3 font-medium text-gray-900 dark:text-gray-100">
              3-Year Total
            </td>
            {sortedDevices.map((device) => (
              <td key={device.id} className="border p-3">
                ${device.pricing.totalCost3Years.toLocaleString()}
              </td>
            ))}
          </tr>
          <tr>
            <td
              className="cursor-pointer border p-3 font-medium text-gray-900 hover:bg-gray-50 dark:text-gray-100 dark:hover:bg-gray-600"
              onClick={() => onSort('cost5yr')}
            >
              5-Year Total {sortField === 'cost5yr' && (sortDirection === 'asc' ? '↑' : '↓')}
            </td>
            {sortedDevices.map((device) => (
              <td key={device.id} className="border p-3 font-semibold">
                ${device.pricing.totalCost5Years.toLocaleString()}
              </td>
            ))}
          </tr>

          {/* Use Cases */}
          <tr className="bg-gray-50 dark:bg-gray-700">
            <td
              colSpan={sortedDevices.length + 1}
              className="border p-2 font-semibold text-gray-900 dark:text-gray-100"
            >
              Use Cases & Analysis
            </td>
          </tr>
          <tr>
            <td className="border p-3 font-medium text-gray-900 dark:text-gray-100">Best For</td>
            {sortedDevices.map((device) => (
              <td key={device.id} className="border p-3">
                <ul className="list-inside list-disc text-sm">
                  {device.useCase.map((use, idx) => (
                    <li key={idx}>{use}</li>
                  ))}
                </ul>
              </td>
            ))}
          </tr>
          <tr>
            <td className="border p-3 font-medium text-gray-900 dark:text-gray-100">Pros</td>
            {sortedDevices.map((device) => (
              <td key={device.id} className="border p-3">
                <ul className="list-inside list-disc text-sm text-green-700 dark:text-green-400">
                  {device.pros.slice(0, 3).map((pro, idx) => (
                    <li key={idx} className="text-green-700 dark:text-green-400">
                      {pro}
                    </li>
                  ))}
                </ul>
              </td>
            ))}
          </tr>
          <tr>
            <td className="border p-3 font-medium text-gray-900 dark:text-gray-100">Cons</td>
            {sortedDevices.map((device) => (
              <td key={device.id} className="border p-3">
                <ul className="list-inside list-disc text-sm text-red-700 dark:text-red-400">
                  {device.cons.slice(0, 3).map((con, idx) => (
                    <li key={idx} className="text-red-700 dark:text-red-400">
                      {con}
                    </li>
                  ))}
                </ul>
              </td>
            ))}
          </tr>
        </tbody>
      </table>
    </div>
  );
};
