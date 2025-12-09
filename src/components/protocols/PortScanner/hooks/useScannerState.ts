/**
 * Hook for managing scanner state
 */

import { useState } from 'react';
import type { ScannerState } from '../types';

export const useScannerState = () => {
  const [state, setState] = useState<ScannerState>({
    scanning: false,
    currentPort: 0,
    results: [],
    selectedPort: undefined,
  });

  const startScanning = () => {
    setState({
      scanning: true,
      currentPort: 0,
      results: [],
      selectedPort: undefined,
    });
  };

  const updateScanProgress = (port: number, service: any) => {
    setState((prev) => ({
      ...prev,
      currentPort: port,
      results: [...prev.results, service],
    }));
  };

  const completeScan = () => {
    setState((prev) => ({ ...prev, scanning: false }));
  };

  return { state, startScanning, updateScanProgress, completeScan };
};
