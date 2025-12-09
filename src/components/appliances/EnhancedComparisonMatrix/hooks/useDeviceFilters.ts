import { useMemo } from 'react';
import type { ComparisonDevice } from '../../appliances-types';

interface UseDeviceFiltersParams {
  devices: ComparisonDevice[];
  selectedLayers: number[];
  searchTerm: string;
}

export const useDeviceFilters = ({
  devices,
  selectedLayers,
  searchTerm,
}: UseDeviceFiltersParams) => {
  const filteredDevices = useMemo(() => {
    let filtered = devices;

    // Filter by OSI layer
    if (selectedLayers.length > 0) {
      filtered = filtered.filter((device) =>
        device.osiLayers?.some((layer) => selectedLayers.includes(layer))
      );
    }

    // Filter by search term
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter(
        (device) =>
          device.name.toLowerCase().includes(term) ||
          device.type.toLowerCase().includes(term) ||
          device.examFocus?.some((focus) => focus.toLowerCase().includes(term)) ||
          device.whenToUse?.some((use) => use.toLowerCase().includes(term))
      );
    }

    return filtered;
  }, [devices, selectedLayers, searchTerm]);

  return { filteredDevices };
};
