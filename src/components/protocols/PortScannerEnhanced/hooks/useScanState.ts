/**
 * Custom hook for managing scan state
 */

import { useState } from 'react';
import type { ScanType, ScanResult, DefenseConfig } from '../types';
import { COMMON_PORTS, SCAN_EXPLANATIONS, INITIAL_TERMINAL_OUTPUT } from '../utils/constants';
import { simulatePacketExchange, determinePortState } from '../utils/scanSimulation';

export const useScanState = () => {
  const [selectedScanType, setSelectedScanType] = useState<ScanType>('syn-scan');
  const [scanning, setScanning] = useState(false);
  const [results, setResults] = useState<ScanResult[]>([]);
  const [selectedPort, setSelectedPort] = useState<number | null>(null);
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
  const [terminalOutput, setTerminalOutput] = useState<string[]>(INITIAL_TERMINAL_OUTPUT);

  const addTerminalOutput = (lines: string | string[]) => {
    const newLines = Array.isArray(lines) ? lines : [lines];
    setTerminalOutput((prev) => [...prev, ...newLines]);
  };

  const startScan = async () => {
    setScanning(true);
    setResults([]);

    const scanInfo = SCAN_EXPLANATIONS[selectedScanType];
    addTerminalOutput([
      '',
      `════════════════════════════════════════════════════════════`,
      `Starting ${scanInfo.name}`,
      `Stealth Level: ${scanInfo.stealth ? '🟢 HIGH' : '🔴 LOW'}`,
      `Detection Risk: ${scanInfo.detection}`,
      '',
      `Defense Status:`,
      `  Firewall: ${defenseConfig.firewallEnabled ? '🟢 ENABLED' : '🔴 DISABLED'}`,
      `  IDS/IPS: ${defenseConfig.idsEnabled ? '🟢 ENABLED' : '🔴 DISABLED'}`,
      `  Rate Limit: ${defenseConfig.rateLimitEnabled ? '🟢 ENABLED' : '🔴 DISABLED'}`,
      '',
      `PORT      STATE           SERVICE         DETECTION`,
      `════════════════════════════════════════════════════════════`,
    ]);

    const portsToScan = COMMON_PORTS.slice(0, 8);
    const scanResults: ScanResult[] = [];

    for (const portInfo of portsToScan) {
      await new Promise((resolve) => setTimeout(resolve, 500));

      // Check if port is filtered by firewall
      const rule = defenseConfig.rules.find((r) => r.port === portInfo.port);
      const isFiltered = !!(
        defenseConfig.firewallEnabled &&
        rule?.enabled &&
        rule.action === 'block'
      );

      const exchanges = simulatePacketExchange(selectedScanType, portInfo.port, isFiltered);
      const state = determinePortState(selectedScanType, exchanges, isFiltered);
      const wasDetected = defenseConfig.idsEnabled && exchanges.some((e) => e.detected);

      const banner =
        selectedScanType === 'banner-grab' && state === 'open' ? portInfo.banner : undefined;

      const result: ScanResult = {
        port: portInfo.port,
        state,
        service: portInfo.service,
        banner,
        scanType: selectedScanType,
        exchanges,
        detected: wasDetected,
      };

      scanResults.push(result);

      const stateStr = state.padEnd(15);
      const serviceStr = portInfo.service.padEnd(15);
      const detectionStr = wasDetected ? '🚨 DETECTED' : '✓ Stealth';

      addTerminalOutput(
        `${portInfo.port.toString().padEnd(10)}${stateStr}${serviceStr}${detectionStr}`
      );

      if (wasDetected && defenseConfig.idsEnabled) {
        addTerminalOutput(`  ⚠️  IDS Alert: Suspicious scan detected from scanner`);
      }
    }

    setResults(scanResults);

    addTerminalOutput([
      `════════════════════════════════════════════════════════════`,
      '',
      `Scan Complete: ${scanResults.length} ports scanned`,
      `Detection Events: ${scanResults.filter((r) => r.detected).length}`,
      ``,
      `Click on any port for detailed packet analysis`,
      '',
    ]);

    setScanning(false);
  };

  return {
    selectedScanType,
    setSelectedScanType,
    scanning,
    results,
    selectedPort,
    setSelectedPort,
    defenseConfig,
    setDefenseConfig,
    terminalOutput,
    startScan,
  };
};
