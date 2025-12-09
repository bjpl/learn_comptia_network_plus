import React from 'react';
import type { DeviceCardProps } from '../types';

export const DeviceCard: React.FC<DeviceCardProps> = ({ device }) => (
  <div className="rounded-lg border-2 border-green-200 bg-white p-4 transition-colors hover:border-green-400 dark:border-green-700 dark:bg-gray-800">
    <div className="mb-2 flex items-start justify-between">
      <h5 className="font-bold text-gray-800 dark:text-gray-100">{device.name}</h5>
      <span
        className={`rounded px-2 py-1 text-xs font-medium ${
          device.category === 'physical'
            ? 'bg-blue-100 text-blue-800'
            : device.category === 'virtual'
              ? 'bg-green-100 text-green-800'
              : 'bg-purple-100 text-purple-800'
        }`}
      >
        {device.category}
      </span>
    </div>

    <p className="mb-3 text-xs text-gray-600 dark:text-gray-400">
      {device.manufacturer} - {device.model}
    </p>

    <div className="mb-3 space-y-2 text-xs text-gray-700 dark:text-gray-200">
      <div>
        <span className="font-medium">Throughput:</span> {device.specs.throughput}
      </div>
      <div>
        <span className="font-medium">Year 1 Cost:</span> $
        {device.pricing.totalCostYear1.toLocaleString()}
      </div>
      <div>
        <span className="font-medium">Connections:</span>{' '}
        {device.specs.maxConnections.toLocaleString()}
      </div>
    </div>

    <div className="text-xs text-gray-600 dark:text-gray-400">
      <p className="mb-1 font-medium text-gray-700 dark:text-gray-200">Best for:</p>
      <ul className="list-inside list-disc space-y-0.5">
        {device.useCase.slice(0, 2).map((use, idx) => (
          <li key={idx}>{use}</li>
        ))}
      </ul>
    </div>
  </div>
);
