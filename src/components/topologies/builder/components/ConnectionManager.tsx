/**
 * Connection Manager Component
 * Handles connection creation and management UI
 */

import type React from 'react';
import type { BuilderConnection, BuilderDevice } from '../types';

interface ConnectionManagerProps {
  connections: BuilderConnection[];
  devices: BuilderDevice[];
  connecting: string | null;
  onStartConnection: (deviceId: string) => void;
  onDeleteConnection: (connId: string) => void;
  showCost: boolean;
}

export const ConnectionManager: React.FC<ConnectionManagerProps> = ({
  connections,
  devices,
  connecting,
  showCost,
}) => {
  // This component is primarily used for rendering connections within the canvas
  // The actual connection rendering is handled by BuilderCanvas
  // This is a placeholder for future connection management UI features

  return null;
};

ConnectionManager.displayName = 'ConnectionManager';
