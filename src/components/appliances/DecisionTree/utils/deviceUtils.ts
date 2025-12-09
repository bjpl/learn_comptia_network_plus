import type { ComparisonDevice } from '../../appliances-types';
import { networkDevices } from '../../appliances-data';

export const getDeviceDetails = (deviceId: string): ComparisonDevice | undefined => {
  return networkDevices.find((d) => d.id === deviceId);
};

export const generateComparison = (devices: ComparisonDevice[]): string => {
  if (devices.length < 2) {
    return 'Need at least 2 devices to compare';
  }

  const costComparison = devices
    .sort((a, b) => a.pricing.totalCostYear1 - b.pricing.totalCostYear1)
    .map((d) => `${d.name}: $${d.pricing.totalCostYear1.toLocaleString()}/year`)
    .join(' | ');

  const performanceComparison = devices
    .sort((a, b) => {
      const aThroughput = parseInt(a.specs.throughput.split('-')[1] || '0');
      const bThroughput = parseInt(b.specs.throughput.split('-')[1] || '0');
      return bThroughput - aThroughput;
    })
    .map((d) => `${d.name}: ${d.specs.throughput}`)
    .join(' | ');

  return `Cost (per year): ${costComparison}\n\nThroughput: ${performanceComparison}`;
};
