/**
 * Hook for managing port scanner state
 */

import { useState, useCallback } from 'react';
import type { ScanType, ScanResult, DefenseConfig } from '../port-scanner/types';
import { COMMON_PORTS } from '../port-scanner/data/portDefinitions';

export const useScanState = () => {
  const [selectedScanType, setSelectedScanType] = useState<ScanType>('syn-scan');
  const [scanning, setScanning] = useState(false);
  const [results, setResults] = useState<ScanResult[]>([]);
  const [selectedPort, setSelectedPort] = useState<number | null>(null);
  const [terminalOutput, setTerminalOutput] = useState<string[]>([
    '╔════════════════════════════════════════════════════════════════╗',
    '║     Enhanced Port Scanner Simulator - CompTIA Network+        ║',
    '║              Educational Security Training Tool                ║',
    '╚════════════════════════════════════════════════════════════════╝',
    '',
    '⚠️  DISCLAIMER: This is an EDUCATIONAL SIMULATOR only.',
    '   Real port scanning without authorization is ILLEGAL.',
    '   Use only on networks you own or have permission to test.',
    '',
  ]);

  const [defenseConfig, setDefenseConfig] = useState<DefenseConfig>({
    firewallEnabled: false,
    idsEnabled: false,
    rateLimitEnabled: false,
    portKnocking: false,
    rules: COMMON_PORTS.slice(0, 5).map((p: { port: number }) => ({
      id: `rule-${p.port}`,
      port: p.port,
      action: 'allow' as const,
      enabled: false,
    })),
  });

  const addTerminalOutput = useCallback((lines: string | string[]) => {
    const newLines = Array.isArray(lines) ? lines : [lines];
    setTerminalOutput((prev) => [...prev, ...newLines]);
  }, []);

  const resetResults = useCallback(() => {
    setResults([]);
    setSelectedPort(null);
  }, []);

  return {
    selectedScanType,
    setSelectedScanType,
    scanning,
    setScanning,
    results,
    setResults,
    selectedPort,
    setSelectedPort,
    defenseConfig,
    setDefenseConfig,
    terminalOutput,
    addTerminalOutput,
    resetResults,
  };
};
