/**
 * Connection management hook
 */

import { useCallback } from 'react';
import type { BuilderDevice, BuilderConnection } from '../types';

export interface UseConnectionManagementProps {
  devices: BuilderDevice[];
  connections: BuilderConnection[];
  connecting: string | null;
  setConnecting: (id: string | null) => void;
  setConnections: (connections: BuilderConnection[]) => void;
  saveToHistory: (devices: BuilderDevice[], connections: BuilderConnection[]) => void;
}

export interface UseConnectionManagementReturn {
  startConnection: (deviceId: string) => void;
  deleteConnection: (connId: string) => void;
}

export function useConnectionManagement({
  devices,
  connections,
  connecting,
  setConnecting,
  setConnections,
  saveToHistory,
}: UseConnectionManagementProps): UseConnectionManagementReturn {
  const startConnection = useCallback(
    (deviceId: string) => {
      if (connecting === deviceId) {
        setConnecting(null);
      } else {
        setConnecting(deviceId);
      }
    },
    [connecting, setConnecting]
  );

  const deleteConnection = useCallback(
    (connId: string) => {
      const newConnections = connections.filter((c) => c.id !== connId);
      setConnections(newConnections);
      saveToHistory(devices, newConnections);
    },
    [connections, devices, setConnections, saveToHistory]
  );

  return {
    startConnection,
    deleteConnection,
  };
}
