/**
 * Hook for port analysis logic
 */

import type { ScanType, ScanResult, DefenseConfig } from '../types';
import { COMMON_PORTS } from '../data/portDefinitions';
import { SCAN_EXPLANATIONS } from '../constants';
import { simulatePacketExchange, determinePortState } from '../utils/scanCalculations';

export const usePortAnalysis = () => {
  const performScan = async (
    scanType: ScanType,
    defenseConfig: DefenseConfig,
    onProgress: (result: ScanResult) => void,
    addTerminalOutput: (lines: string | string[]) => void
  ): Promise<ScanResult[]> => {
    const scanInfo = SCAN_EXPLANATIONS[scanType];

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

      const exchanges = simulatePacketExchange(scanType, portInfo.port, isFiltered);
      const state = determinePortState(scanType, exchanges, isFiltered);
      const wasDetected = defenseConfig.idsEnabled && exchanges.some((e) => e.detected);

      const banner =
        scanType === 'banner-grab' && state === 'open' ? portInfo.banner : undefined;

      const result: ScanResult = {
        port: portInfo.port,
        state,
        service: portInfo.service,
        banner,
        scanType,
        exchanges,
        detected: wasDetected,
      };

      scanResults.push(result);
      onProgress(result);

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

    addTerminalOutput([
      `════════════════════════════════════════════════════════════`,
      '',
      `Scan Complete: ${scanResults.length} ports scanned`,
      `Detection Events: ${scanResults.filter((r) => r.detected).length}`,
      ``,
      `Click on any port for detailed packet analysis`,
      '',
    ]);

    return scanResults;
  };

  return { performScan };
};
