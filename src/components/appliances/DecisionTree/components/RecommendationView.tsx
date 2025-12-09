import React from 'react';
import type { RecommendationViewProps } from '../types';
import { DeviceCard } from './DeviceCard';

export const RecommendationView: React.FC<RecommendationViewProps> = ({
  currentNode,
  devices,
  onCompare,
  onExamScenario,
}) => (
  <div className="space-y-6 rounded-lg bg-gradient-to-br from-green-50 to-emerald-50 p-6 dark:from-green-900 dark:to-emerald-900">
    <div className="flex items-start space-x-4">
      <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-green-500 text-xl font-bold text-white">
        ✓
      </div>
      <div className="flex-1">
        <h3 className="mb-2 text-xl font-bold text-gray-800 dark:text-gray-100">
          Recommendation: {currentNode.text}
        </h3>
        <p className="text-gray-700 dark:text-gray-300">{currentNode.rationale}</p>
      </div>
    </div>

    {devices.length > 0 && (
      <div>
        <h4 className="mb-4 text-lg font-semibold text-gray-900 dark:text-gray-100">
          Recommended Devices:
        </h4>
        <div className="grid gap-4 md:grid-cols-2">
          {devices.map((device) => (
            <DeviceCard key={device.id} device={device} />
          ))}
        </div>
      </div>
    )}

    {devices.length > 1 && (
      <button
        onClick={onCompare}
        className="w-full rounded-lg bg-blue-500 px-4 py-3 font-medium text-white transition-colors hover:bg-blue-600"
      >
        Compare Devices
      </button>
    )}

    <button
      onClick={onExamScenario}
      className="w-full rounded-lg bg-purple-500 px-4 py-3 font-medium text-white transition-colors hover:bg-purple-600"
    >
      View Exam Scenarios
    </button>
  </div>
);
