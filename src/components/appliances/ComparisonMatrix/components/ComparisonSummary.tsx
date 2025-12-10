import React from 'react';
import type { ComparisonDevice } from '../../appliances-types';
import { parseThroughput } from '../utils';

interface ComparisonSummaryProps {
  sortedDevices: ComparisonDevice[];
}

export const ComparisonSummary: React.FC<ComparisonSummaryProps> = ({ sortedDevices }) => {
  if (sortedDevices.length === 0) {
    return null;
  }

  const mostAffordable = sortedDevices.reduce((min, d) =>
    d.pricing.totalCostYear1 < min.pricing.totalCostYear1 ? d : min
  );

  const highestThroughput = sortedDevices.reduce((max, d) =>
    parseThroughput(d.specs.throughput) > parseThroughput(max.specs.throughput) ? d : max
  );

  return (
    <div className="mt-6 rounded bg-blue-50 p-4 dark:bg-blue-900">
      <h3 className="mb-2 font-semibold text-blue-900 dark:text-blue-100">Comparison Summary</h3>
      <p className="text-sm text-blue-800 dark:text-blue-200">
        Comparing {sortedDevices.length} device{sortedDevices.length !== 1 ? 's' : ''}. Most
        affordable (Year 1): <strong>{mostAffordable.name}</strong> at $
        {mostAffordable.pricing.totalCostYear1.toLocaleString()}. Highest throughput:{' '}
        <strong>{highestThroughput.name}</strong>.
      </p>
    </div>
  );
};
