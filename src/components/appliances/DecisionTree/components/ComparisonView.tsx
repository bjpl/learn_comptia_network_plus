import React from 'react';
import type { ComparisonViewProps } from '../types';

export const ComparisonView: React.FC<ComparisonViewProps> = ({ data, onClose }) => (
  <div className="space-y-4 rounded-lg bg-gradient-to-br from-yellow-50 to-orange-50 p-6 dark:from-yellow-900 dark:to-orange-900">
    <div className="flex items-center justify-between">
      <h3 className="text-lg font-bold text-gray-800 dark:text-gray-100">Device Comparison</h3>
      <button
        onClick={onClose}
        className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
      >
        Close
      </button>
    </div>

    <table className="w-full text-sm">
      <thead>
        <tr className="border-b-2 border-gray-300 dark:border-gray-600">
          <th className="px-2 py-2 text-left font-semibold text-gray-900 dark:text-gray-100">
            Device
          </th>
          <th className="px-2 py-2 text-left font-semibold text-gray-900 dark:text-gray-100">
            Category
          </th>
          <th className="px-2 py-2 text-right font-semibold text-gray-900 dark:text-gray-100">
            Year 1 Cost
          </th>
          <th className="px-2 py-2 text-left font-semibold text-gray-900 dark:text-gray-100">
            Throughput
          </th>
        </tr>
      </thead>
      <tbody>
        {data.devices.map((device) => (
          <tr
            key={device.id}
            className="border-b border-gray-200 hover:bg-white dark:border-gray-600 dark:hover:bg-gray-700"
          >
            <td className="px-2 py-2 font-medium text-gray-800 dark:text-gray-100">
              {device.name}
            </td>
            <td className="px-2 py-2 text-gray-600 dark:text-gray-400">{device.category}</td>
            <td className="px-2 py-2 text-right text-gray-600 dark:text-gray-400">
              ${device.pricing.totalCostYear1.toLocaleString()}
            </td>
            <td className="px-2 py-2 text-gray-600 dark:text-gray-400">
              {device.specs.throughput}
            </td>
          </tr>
        ))}
      </tbody>
    </table>

    <div className="rounded-lg bg-white p-4 dark:bg-gray-800">
      <p className="whitespace-pre-line text-sm text-gray-700 dark:text-gray-200">
        {data.comparison}
      </p>
    </div>
  </div>
);
