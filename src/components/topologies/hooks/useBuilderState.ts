/**
 * Hook for managing topology builder state with undo/redo
 */

import { useState, useCallback } from 'react';
import type { BuilderDevice, BuilderConnection } from '../builder/types';

export const useBuilderState = () => {
  const [devices, setDevices] = useState<BuilderDevice[]>([]);
  const [connections, setConnections] = useState<BuilderConnection[]>([]);
  const [selectedDevice, setSelectedDevice] = useState<string | null>(null);
  const [dragging, setDragging] = useState<string | null>(null);
  const [connecting, setConnecting] = useState<string | null>(null);
  const [history, setHistory] = useState<
    Array<{ devices: BuilderDevice[]; connections: BuilderConnection[] }>
  >([]);
  const [historyIndex, setHistoryIndex] = useState(-1);

  const saveToHistory = useCallback(
    (devs: BuilderDevice[], conns: BuilderConnection[]) => {
      const newHistory = history.slice(0, historyIndex + 1);
      newHistory.push({ devices: devs, connections: conns });
      setHistory(newHistory);
      setHistoryIndex(newHistory.length - 1);
    },
    [history, historyIndex]
  );

  const undo = useCallback(() => {
    if (historyIndex > 0) {
      const prevState = history[historyIndex - 1];
      setDevices(prevState.devices);
      setConnections(prevState.connections);
      setHistoryIndex(historyIndex - 1);
    }
  }, [history, historyIndex]);

  const redo = useCallback(() => {
    if (historyIndex < history.length - 1) {
      const nextState = history[historyIndex + 1];
      setDevices(nextState.devices);
      setConnections(nextState.connections);
      setHistoryIndex(historyIndex + 1);
    }
  }, [history, historyIndex]);

  const clearCanvas = useCallback(() => {
    setDevices([]);
    setConnections([]);
    setSelectedDevice(null);
    setConnecting(null);
    saveToHistory([], []);
  }, [saveToHistory]);

  const canUndo = historyIndex > 0;
  const canRedo = historyIndex < history.length - 1;

  return {
    devices,
    setDevices,
    connections,
    setConnections,
    selectedDevice,
    setSelectedDevice,
    dragging,
    setDragging,
    connecting,
    setConnecting,
    saveToHistory,
    undo,
    redo,
    clearCanvas,
    canUndo,
    canRedo,
  };
};
