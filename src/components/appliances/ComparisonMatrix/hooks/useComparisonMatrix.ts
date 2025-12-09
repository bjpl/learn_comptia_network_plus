import { useState, useMemo } from 'react';
import { networkDevices } from '../../appliances-data';
import type { SortField, SortDirection, FilterCategory } from '../types';
import { parseThroughput } from '../utils';

export const useComparisonMatrix = (initialDevices: string[] = []) => {
  const [selectedDeviceIds, setSelectedDeviceIds] = useState<string[]>(
    initialDevices.length > 0 ? initialDevices : networkDevices.slice(0, 3).map((d) => d.id)
  );
  const [sortField, setSortField] = useState<SortField>('name');
  const [sortDirection, setSortDirection] = useState<SortDirection>('asc');
  const [filterCategory, setFilterCategory] = useState<FilterCategory>('all');
  const [filterType, setFilterType] = useState<string>('all');

  const selectedDevices = useMemo(
    () => networkDevices.filter((d) => selectedDeviceIds.includes(d.id)),
    [selectedDeviceIds]
  );

  const availableDevices = useMemo(() => {
    let filtered = networkDevices.filter((d) => !selectedDeviceIds.includes(d.id));

    if (filterCategory !== 'all') {
      filtered = filtered.filter((d) => d.category === filterCategory);
    }

    if (filterType !== 'all') {
      filtered = filtered.filter((d) => d.type === filterType);
    }

    return filtered;
  }, [selectedDeviceIds, filterCategory, filterType]);

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  const sortedDevices = useMemo(() => {
    const devices = [...selectedDevices];

    devices.sort((a, b) => {
      let aVal: string | number;
      let bVal: string | number;

      switch (sortField) {
        case 'name':
          aVal = a.name.toLowerCase();
          bVal = b.name.toLowerCase();
          break;
        case 'cost1yr':
          aVal = a.pricing.totalCostYear1;
          bVal = b.pricing.totalCostYear1;
          break;
        case 'cost5yr':
          aVal = a.pricing.totalCost5Years;
          bVal = b.pricing.totalCost5Years;
          break;
        case 'maxConnections':
          aVal = a.specs.maxConnections;
          bVal = b.specs.maxConnections;
          break;
        case 'throughput':
          aVal = parseThroughput(a.specs.throughput);
          bVal = parseThroughput(b.specs.throughput);
          break;
        default:
          return 0;
      }

      if (aVal < bVal) {
        return sortDirection === 'asc' ? -1 : 1;
      }
      if (aVal > bVal) {
        return sortDirection === 'asc' ? 1 : -1;
      }
      return 0;
    });

    return devices;
  }, [selectedDevices, sortField, sortDirection]);

  const addDevice = (deviceId: string) => {
    setSelectedDeviceIds([...selectedDeviceIds, deviceId]);
  };

  const removeDevice = (deviceId: string) => {
    setSelectedDeviceIds(selectedDeviceIds.filter((id) => id !== deviceId));
  };

  const uniqueTypes = Array.from(new Set(networkDevices.map((d) => d.type)));

  return {
    selectedDevices,
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
  };
};
