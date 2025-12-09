import React from 'react';
import type { ComparisonMatrixProps } from './types';
import { useComparisonMatrix } from './hooks/useComparisonMatrix';
import { DeviceSelector, ComparisonTable, ComparisonSummary } from './components';

const ComparisonMatrix: React.FC<ComparisonMatrixProps> = ({ initialDevices = [] }) => {
  const {
    sortedDevices,
    availableDevices,
    uniqueTypes,
    sortField,
    sortDirection,
    filterCategory,
    filterType,
    setFilterCategory,
    setFilterType,
    handleSort,
    addDevice,
    removeDevice,
  } = useComparisonMatrix(initialDevices);

  return (
    <div className="rounded-lg bg-white p-6 shadow-lg">
      <div className="mb-6">
        <h2 className="mb-4 text-2xl font-bold text-gray-900 dark:text-gray-100">
          Network Appliance Comparison Matrix
        </h2>

        <DeviceSelector
          filterCategory={filterCategory}
          filterType={filterType}
          uniqueTypes={uniqueTypes}
          availableDevices={availableDevices}
          onFilterCategoryChange={setFilterCategory}
          onFilterTypeChange={setFilterType}
          onAddDevice={addDevice}
        />
      </div>

      <ComparisonTable
        sortedDevices={sortedDevices}
        sortField={sortField}
        sortDirection={sortDirection}
        onSort={handleSort}
        onRemoveDevice={removeDevice}
      />

      <ComparisonSummary sortedDevices={sortedDevices} />
    </div>
  );
};

export default ComparisonMatrix;
