import { useState, useMemo, useCallback } from 'react';
import type { ComparisonDevice } from '../../appliances-types';

interface UseDeviceSelectionParams {
  devices: ComparisonDevice[];
  initialSelectedIds: string[];
}

export const useDeviceSelection = ({ devices, initialSelectedIds }: UseDeviceSelectionParams) => {
  const [selectedDeviceIds, setSelectedDeviceIds] = useState<string[]>(initialSelectedIds);
  const [selectedDevice, setSelectedDevice] = useState<ComparisonDevice | null>(null);

  const selectedDevices = useMemo(
    () => devices.filter((d) => selectedDeviceIds.includes(d.id)),
    [devices, selectedDeviceIds]
  );

  const addDevice = useCallback((deviceId: string) => {
    setSelectedDeviceIds((prev) => {
      if (prev.length < 5 && !prev.includes(deviceId)) {
        return [...prev, deviceId];
      }
      return prev;
    });
  }, []);

  const removeDevice = useCallback((deviceId: string) => {
    setSelectedDeviceIds((prev) => prev.filter((id) => id !== deviceId));
  }, []);

  const handleDeviceClick = useCallback(
    (deviceId: string) => {
      const device = devices.find((d) => d.id === deviceId);
      if (device) {
        setSelectedDevice(device);
        if (!selectedDeviceIds.includes(deviceId) && selectedDeviceIds.length < 5) {
          addDevice(deviceId);
        }
      }
    },
    [devices, selectedDeviceIds, addDevice]
  );

  const handleRecommendation = useCallback((deviceIds: string[]) => {
    setSelectedDeviceIds(deviceIds.slice(0, 5));
  }, []);

  return {
    selectedDeviceIds,
    setSelectedDeviceIds,
    selectedDevices,
    selectedDevice,
    setSelectedDevice,
    addDevice,
    removeDevice,
    handleDeviceClick,
    handleRecommendation,
  };
};
