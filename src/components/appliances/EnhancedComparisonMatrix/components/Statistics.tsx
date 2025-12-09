import React from 'react';

interface StatisticsProps {
  totalDevices: number;
  filteredCount: number;
  selectedCount: number;
}

const Statistics: React.FC<StatisticsProps> = ({ totalDevices, filteredCount, selectedCount }) => {
  return (
    <div className="rounded-lg bg-white p-4 shadow-lg dark:bg-gray-800">
      <h3 className="mb-3 font-semibold text-gray-900 dark:text-gray-100">Statistics</h3>
      <div className="space-y-2 text-sm">
        <div className="flex justify-between">
          <span className="text-gray-700 dark:text-gray-300">Total Devices:</span>
          <span className="font-semibold text-gray-900 dark:text-gray-100">{totalDevices}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-gray-700 dark:text-gray-300">Filtered:</span>
          <span className="font-semibold text-gray-900 dark:text-gray-100">{filteredCount}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-gray-700 dark:text-gray-300">Comparing:</span>
          <span className="font-semibold text-gray-900 dark:text-gray-100">
            {selectedCount} / 5
          </span>
        </div>
      </div>
    </div>
  );
};

export default Statistics;
