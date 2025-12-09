import { useState, useCallback } from 'react';
import { deviceTemplates } from '../../appliances-data';
import type { SimulatedDevice, NetworkConnection, DeviceConfig } from '../types';

export function useDeviceManagement(
  devices: SimulatedDevice[],
  setDevices: React.Dispatch<React.SetStateAction<SimulatedDevice[]>>,
  connections: NetworkConnection[],
  setConnections: React.Dispatch<React.SetStateAction<NetworkConnection[]>>
) {
  const [selectedDevice, setSelectedDevice] = useState<string | null>(null);
  const [showConfigPanel, setShowConfigPanel] = useState(false);
  const [deviceConfig, setDeviceConfig] = useState<DeviceConfig | null>(null);

  const addDevice = useCallback(
    (type: SimulatedDevice['type']) => {
      const newDevice: SimulatedDevice = {
        id: `device-${Date.now()}`,
        name: `${type.charAt(0).toUpperCase() + type.slice(1)} ${devices.length + 1}`,
        type,
        category: 'physical',
        position: {
          x: 100 + ((devices.length * 50) % 500),
          y: 100 + Math.floor(devices.length / 10) * 100,
        },
        specs: deviceTemplates[type as keyof typeof deviceTemplates]?.defaultSpecs || {
          throughput: '1 Gbps',
          maxConnections: 1000,
          powerConsumption: '50W',
          redundancy: false,
          hotSwappable: false,
        },
        status: 'active',
        connections: [],
        currentLoad: 0,
        maxLoad: 100,
      };

      setDevices([...devices, newDevice]);
    },
    [devices, setDevices]
  );

  const removeDevice = useCallback(
    (deviceId: string) => {
      const remainingConnections = connections.filter(
        (conn) => conn.sourceId !== deviceId && conn.targetId !== deviceId
      );

      setConnections(remainingConnections);
      setDevices(devices.filter((d) => d.id !== deviceId));

      if (selectedDevice === deviceId) {
        setSelectedDevice(null);
      }
    },
    [connections, devices, selectedDevice, setConnections, setDevices]
  );

  const openDeviceConfig = useCallback(
    (deviceId: string) => {
      const device = devices.find((d) => d.id === deviceId);
      if (device) {
        setDeviceConfig({
          name: device.name,
          throughput: device.specs.throughput,
          maxConnections: device.specs.maxConnections,
          redundancy: device.specs.redundancy,
        });
        setSelectedDevice(deviceId);
        setShowConfigPanel(true);
      }
    },
    [devices]
  );

  const updateDeviceConfig = () => {
    if (!selectedDevice || !deviceConfig) {
      return;
    }

    setDevices((prevDevices) =>
      prevDevices.map((device) =>
        device.id === selectedDevice
          ? {
              ...device,
              name: deviceConfig.name,
              specs: {
                ...device.specs,
                throughput: deviceConfig.throughput,
                maxConnections: deviceConfig.maxConnections,
                redundancy: deviceConfig.redundancy,
              },
            }
          : device
      )
    );

    setShowConfigPanel(false);
  };

  return {
    selectedDevice,
    setSelectedDevice,
    showConfigPanel,
    setShowConfigPanel,
    deviceConfig,
    setDeviceConfig,
    addDevice,
    removeDevice,
    openDeviceConfig,
    updateDeviceConfig,
  };
}
