/**
 * Custom Hook: useConnectionDrawing
 * Manages connection line drawing logic for Cloud Architecture Designer
 *
 * Features:
 * - Start connection from a component
 * - Track cursor position during connection drawing
 * - Complete connection to target component
 * - Cancel connection on escape or invalid target
 * - Auto-generate connection IDs
 */

import { useState, useCallback, useEffect } from 'react';
import type { Connection, ArchitectureDesign } from '../cloud-types';

type ConnectionState = {
  isConnecting: boolean;
  fromId: string | null;
  cursorX: number;
  cursorY: number;
};

interface UseConnectionDrawingParams {
  design: ArchitectureDesign;
  canvasRef: React.RefObject<HTMLDivElement>;
  zoom: number;
  onUpdateDesign: (design: ArchitectureDesign) => void;
}

interface UseConnectionDrawingReturn {
  connectionState: ConnectionState;
  handleConnectionStart: (componentId: string) => void;
  handleConnectionMove: (e: React.MouseEvent) => void;
  handleConnectionEnd: (targetId: string) => void;
  cancelConnection: () => void;
}

/**
 * Hook for managing connection drawing between components
 */
export function useConnectionDrawing({
  design,
  canvasRef,
  zoom,
  onUpdateDesign,
}: UseConnectionDrawingParams): UseConnectionDrawingReturn {
  const [connectionState, setConnectionState] = useState<ConnectionState>({
    isConnecting: false,
    fromId: null,
    cursorX: 0,
    cursorY: 0,
  });

  /**
   * Start drawing a connection from a component
   */
  const handleConnectionStart = useCallback((componentId: string) => {
    setConnectionState({
      isConnecting: true,
      fromId: componentId,
      cursorX: 0,
      cursorY: 0,
    });
  }, []);

  /**
   * Track cursor position during connection drawing
   */
  const handleConnectionMove = useCallback((e: React.MouseEvent) => {
    if (!connectionState.isConnecting || !canvasRef.current) {
      return;
    }

    const rect = canvasRef.current.getBoundingClientRect();
    const x = (e.clientX - rect.left) / zoom;
    const y = (e.clientY - rect.top) / zoom;

    setConnectionState((prev) => ({
      ...prev,
      cursorX: x,
      cursorY: y,
    }));
  }, [connectionState.isConnecting, canvasRef, zoom]);

  /**
   * Complete connection to target component
   */
  const handleConnectionEnd = useCallback((targetId: string) => {
    if (!connectionState.isConnecting || !connectionState.fromId) {
      return;
    }

    // Prevent self-connection
    if (connectionState.fromId === targetId) {
      cancelConnection();
      return;
    }

    // Check if connection already exists
    const connectionExists = design.connections.some(
      (conn) =>
        (conn.from === connectionState.fromId && conn.to === targetId) ||
        (conn.from === targetId && conn.to === connectionState.fromId)
    );

    if (connectionExists) {
      cancelConnection();
      return;
    }

    // Create new connection
    const newConnection: Connection = {
      id: `conn-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      from: connectionState.fromId,
      to: targetId,
      type: 'network', // Default to network type
      label: undefined,
    };

    // Update design with new connection
    const updatedDesign: ArchitectureDesign = {
      ...design,
      connections: [...design.connections, newConnection],
      metadata: {
        ...design.metadata,
        modified: new Date(),
      },
    };

    onUpdateDesign(updatedDesign);

    // Reset connection state
    setConnectionState({
      isConnecting: false,
      fromId: null,
      cursorX: 0,
      cursorY: 0,
    });
  }, [connectionState, design, onUpdateDesign]);

  /**
   * Cancel the current connection drawing
   */
  const cancelConnection = useCallback(() => {
    setConnectionState({
      isConnecting: false,
      fromId: null,
      cursorX: 0,
      cursorY: 0,
    });
  }, []);

  /**
   * Handle escape key to cancel connection
   */
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && connectionState.isConnecting) {
        cancelConnection();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [connectionState.isConnecting, cancelConnection]);

  return {
    connectionState,
    handleConnectionStart,
    handleConnectionMove,
    handleConnectionEnd,
    cancelConnection,
  };
}
