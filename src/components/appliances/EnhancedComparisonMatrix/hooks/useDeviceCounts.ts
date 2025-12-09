import { useMemo } from 'react';
import type { ComparisonDevice } from '../../appliances-types';
import type { DeviceCounts } from '../types';

export const useDeviceCounts = (devices: ComparisonDevice[]): DeviceCounts => {
  return useMemo(() => {
    const counts: DeviceCounts = {};
    devices.forEach((device) => {
      device.osiLayers?.forEach((layer) => {
        counts[layer] = (counts[layer] || 0) + 1;
      });
    });
    return counts;
  }, [devices]);
};
