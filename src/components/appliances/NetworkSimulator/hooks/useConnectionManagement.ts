import { useState } from 'react';
import type { SimulatedDevice, NetworkConnection } from '../types';

export function useConnectionManagement(
  connections: NetworkConnection[],
  setConnections: React.Dispatch<React.SetStateAction<NetworkConnection[]>>,
  setDevices: React.Dispatch<React.SetStateAction<SimulatedDevice[]>>
) {
  const [connecting, setConnecting] = useState<string | null>(null);

  const startConnection = (deviceId: string) => {
    if (connecting === deviceId) {
      setConnecting(null);
    } else {
      setConnecting(deviceId);
    }
  };

  const completeConnection = (targetId: string) => {
    if (!connecting || connecting === targetId) {
      setConnecting(null);
      return;
    }

    // Check if connection already exists
    const exists = connections.some(
      (conn) =>
        (conn.sourceId === connecting && conn.targetId === targetId) ||
        (conn.sourceId === targetId && conn.targetId === connecting)
    );

    if (!exists) {
      const newConnection: NetworkConnection = {
        id: `conn-${Date.now()}`,
        sourceId: connecting,
        targetId,
        type: 'ethernet',
        bandwidth: '1 Gbps',
        latency: 1,
        trafficLoad: 0,
      };

      setConnections([...connections, newConnection]);

      // Update device connections
      setDevices((prevDevices) =>
        prevDevices.map((device) => {
          if (device.id === connecting || device.id === targetId) {
            return {
              ...device,
              connections: [...device.connections, newConnection.id],
            };
          }
          return device;
        })
      );
    }

    setConnecting(null);
  };

  return {
    connecting,
    startConnection,
    completeConnection,
  };
}
