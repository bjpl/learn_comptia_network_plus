/**
 * Hook for managing scan state
 */

import { useState, useRef, useEffect } from 'react';
import type { ScanType, ScanResult, DefenseConfig } from '../types';
import { COMMON_PORTS } from '../data/portDefinitions';
import { INITIAL_TERMINAL_OUTPUT } from '../constants';

export const useScanState = () => {
  const [selectedScanType, setSelectedScanType] = useState<ScanType>('syn-scan');
  const [scanning, setScanning] = useState(false);
  const [results, setResults] = useState<ScanResult[]>([]);
  const [selectedPort, setSelectedPort] = useState<number | null>(null);
  const [showDisclaimer, setShowDisclaimer] = useState(true);
  const [terminalOutput, setTerminalOutput] = useState<string[]>(INITIAL_TERMINAL_OUTPUT);
  const [defenseConfig, setDefenseConfig] = useState<DefenseConfig>({
    firewallEnabled: false,
    idsEnabled: false,
    rateLimitEnabled: false,
    portKnocking: false,
    rules: COMMON_PORTS.slice(0, 5).map((p) => ({
      id: `rule-${p.port}`,
      port: p.port,
      action: 'allow',
      enabled: false,
    })),
  });

  const terminalRef = useRef<HTMLDivElement>(null);

  // Auto-scroll terminal
  useEffect(() => {
    if (terminalRef.current) {
      terminalRef.current.scrollTop = terminalRef.current.scrollHeight;
    }
  }, [terminalOutput]);

  const addTerminalOutput = (lines: string | string[]) => {
    const newLines = Array.isArray(lines) ? lines : [lines];
    setTerminalOutput((prev) => [...prev, ...newLines]);
  };

  return {
    selectedScanType,
    setSelectedScanType,
    scanning,
    setScanning,
    results,
    setResults,
    selectedPort,
    setSelectedPort,
    showDisclaimer,
    setShowDisclaimer,
    terminalOutput,
    addTerminalOutput,
    defenseConfig,
    setDefenseConfig,
    terminalRef,
  };
};
