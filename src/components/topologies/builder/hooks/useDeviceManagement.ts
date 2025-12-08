/**
 * Device management hook
 */

import { useCallback } from 'react';
import type { BuilderDevice, BuilderConnection, DeviceType } from '../types';
import { deviceSpecs, DEVICE_START_X, DEVICE_START_Y, DEVICE_GRID_OFFSET_X, DEVICE_GRID_OFFSET_Y, DEVICES_PER_ROW } from '../constants';

export interface UseDeviceManagementProps {
  devices: BuilderDevice[];
  connections: BuilderConnection[];
  setDevices: (devices: BuilderDevice[]) => void;
  setConnections: (connections: BuilderConnection[]) => void;
  setSelectedDevice: (id: string | null) => void;
  saveToHistory: (devices: BuilderDevice[], connections: BuilderConnection[]) => void;
}

export interface UseDeviceManagementReturn {
  addDevice: (type: DeviceType) => void;
  deleteDevice: (deviceId: string) => void;
}

export function useDeviceManagement({
  devices,
  connections,
  setDevices,
  setConnections,
  setSelectedDevice,
  saveToHistory,
}: UseDeviceManagementProps): UseDeviceManagementReturn {
  const addDevice = useCallback(
    (type: DeviceType) => {
      const newDevice: BuilderDevice = {
        id: `device-${Date.now()}`,
        type,
        label: `${deviceSpecs[type].label} ${devices.length + 1}`,
        position: {
          x: DEVICE_START_X + ((devices.length * DEVICE_GRID_OFFSET_X) % 400),
          y: DEVICE_START_Y + Math.floor(devices.length / DEVICES_PER_ROW) * DEVICE_GRID_OFFSET_Y,
        },
        cost: deviceSpecs[type].cost,
      };

      const newDevices = [...devices, newDevice];
      setDevices(newDevices);
      saveToHistory(newDevices, connections);
    },
    [devices, connections, setDevices, saveToHistory]
  );

  const deleteDevice = useCallback(
    (deviceId: string) => {
      const newDevices = devices.filter((d) => d.id !== deviceId);
      const newConnections = connections.filter(
        (c) => c.sourceId !== deviceId && c.targetId !== deviceId
      );
      setDevices(newDevices);
      setConnections(newConnections);
      setSelectedDevice(null);
      saveToHistory(newDevices, newConnections);
    },
    [devices, connections, setDevices, setConnections, setSelectedDevice, saveToHistory]
  );

  return {
    addDevice,
    deleteDevice,
  };
}
