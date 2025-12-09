/**
 * Connection handling hook
 */

import { useCallback } from 'react';
import { useCloudDesignerStore } from '../../stores/cloudDesignerStore';

export const useConnectionHandlers = (
  handleCreateConnection: (fromId: string, toId: string) => void
) => {
  const design = useCloudDesignerStore((state) => state.design);
  const connectionState = useCloudDesignerStore((state) => state.connectionState);
  const setConnectionState = useCloudDesignerStore((state) => state.setConnectionState);

  const handleConnectionModeToggle = useCallback(
    (componentId: string) => {
      if (connectionState.isConnecting && connectionState.fromId === componentId) {
        setConnectionState({ isConnecting: false, fromId: null, cursorX: 0, cursorY: 0 });
      } else if (connectionState.isConnecting && connectionState.fromId) {
        handleCreateConnection(connectionState.fromId, componentId);
        setConnectionState({ isConnecting: false, fromId: null, cursorX: 0, cursorY: 0 });
      } else {
        const component = design.components.find((c) => c.id === componentId);
        if (!component) return;
        setConnectionState({
          isConnecting: true,
          fromId: componentId,
          cursorX: component.x + component.width / 2,
          cursorY: component.y + component.height / 2,
        });
      }
    },
    [connectionState, design.components, handleCreateConnection, setConnectionState]
  );

  return { handleConnectionModeToggle };
};
