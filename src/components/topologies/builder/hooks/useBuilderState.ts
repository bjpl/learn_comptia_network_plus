/**
 * Main state management hook for TopologyBuilder
 */

import { useState, useCallback } from 'react';
import type { BuilderDevice, BuilderConnection } from '../types';

export interface UseBuilderStateReturn {
  devices: BuilderDevice[];
  connections: BuilderConnection[];
  selectedDevice: string | null;
  dragging: string | null;
  connecting: string | null;
  showTemplates: boolean;
  showValidation: boolean;
  showCost: boolean;
  showHints: boolean;
  history: Array<{ devices: BuilderDevice[]; connections: BuilderConnection[] }>;
  historyIndex: number;
  setDevices: (devices: BuilderDevice[]) => void;
  setConnections: (connections: BuilderConnection[]) => void;
  setSelectedDevice: (id: string | null) => void;
  setDragging: (id: string | null) => void;
  setConnecting: (id: string | null) => void;
  setShowTemplates: (show: boolean) => void;
  setShowValidation: (show: boolean) => void;
  setShowCost: (show: boolean) => void;
  setShowHints: (show: boolean) => void;
  saveToHistory: (devices: BuilderDevice[], connections: BuilderConnection[]) => void;
  undo: () => void;
  redo: () => void;
  clearCanvas: () => void;
}

export function useBuilderState(): UseBuilderStateReturn {
  const [devices, setDevices] = useState<BuilderDevice[]>([]);
  const [connections, setConnections] = useState<BuilderConnection[]>([]);
  const [selectedDevice, setSelectedDevice] = useState<string | null>(null);
  const [dragging, setDragging] = useState<string | null>(null);
  const [connecting, setConnecting] = useState<string | null>(null);
  const [showTemplates, setShowTemplates] = useState(false);
  const [showValidation, setShowValidation] = useState(false);
  const [showCost, setShowCost] = useState(true);
  const [showHints, setShowHints] = useState(true);
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

  return {
    devices,
    connections,
    selectedDevice,
    dragging,
    connecting,
    showTemplates,
    showValidation,
    showCost,
    showHints,
    history,
    historyIndex,
    setDevices,
    setConnections,
    setSelectedDevice,
    setDragging,
    setConnecting,
    setShowTemplates,
    setShowValidation,
    setShowCost,
    setShowHints,
    saveToHistory,
    undo,
    redo,
    clearCanvas,
  };
}
