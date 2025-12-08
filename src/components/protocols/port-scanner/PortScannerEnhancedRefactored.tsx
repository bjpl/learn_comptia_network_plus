/**
 * Component #8: Enhanced Port Scanner Simulator (Refactored)
 * Educational port scanner for understanding network security concepts in CompTIA Network+
 *
 * REFACTORED: Main orchestrator component (<300 lines)
 * Logic extracted to hooks and subcomponents
 */

import React, { useState, useRef, useEffect } from 'react';
import { ScannerControls } from './ScannerControls';
import { ScanResultsTable } from './ScanResultsTable';
import { ProtocolDetailsPanel } from './ProtocolDetailsPanel';
import { ScanTypeInfo } from './ScanTypeInfo';
import { DefenseControls } from './DefenseControls';
import { useScanState } from '../hooks/useScanState';
import { usePortAnalysis } from '../hooks/usePortAnalysis';
import { COMMON_PORTS, SCAN_EXPLANATIONS } from './constants';
import type { ScanResult } from './types';
import './styles.css';

export const PortScannerEnhanced: React.FC = () => {
  const {
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
  } = useScanState();

  const { simulatePacketExchange, determinePortState } = usePortAnalysis();
  const [showDisclaimer, setShowDisclaimer] = useState(true);
  const terminalRef = useRef<HTMLDivElement>(null);

  // Auto-scroll terminal
  useEffect(() => {
    if (terminalRef.current) {
      terminalRef.current.scrollTop = terminalRef.current.scrollHeight;
    }
  }, [terminalOutput]);

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

  const selectedResult = results.find((r) => r.port === selectedPort);

  return (
    <div className="port-scanner-enhanced">
      {showDisclaimer && (
        <div className="disclaimer-modal">
          <div className="disclaimer-content">
            <h2>⚠️ EDUCATIONAL USE ONLY</h2>
            <div className="disclaimer-text">
              <p>
                <strong>IMPORTANT LEGAL NOTICE:</strong>
              </p>
              <p>This is a SIMULATED port scanner for EDUCATIONAL purposes only.</p>
              <p>Unauthorized port scanning is ILLEGAL and may violate:</p>
              <ul>
                <li>Computer Fraud and Abuse Act (CFAA)</li>
                <li>Your organization&apos;s acceptable use policy</li>
                <li>International cybersecurity laws</li>
              </ul>
              <p>
                <strong>Only scan networks you OWN or have WRITTEN PERMISSION to test.</strong>
              </p>
              <p>This simulator teaches Network+ concepts without performing real scans.</p>
            </div>
            <button onClick={() => setShowDisclaimer(false)} className="accept-button">
              I Understand - Continue to Educational Simulator
            </button>
          </div>
        </div>
      )}

      <div className="scanner-header">
        <h1>🔍 Enhanced Port Scanner Simulator</h1>
        <p className="subtitle">
          Learn network security scanning techniques - CompTIA Network+ Certification
        </p>
      </div>

      <div className="scanner-layout">
        <div className="left-panel">
          <ScannerControls
            selectedScanType={selectedScanType}
            onScanTypeChange={setSelectedScanType}
            onStartScan={startScan}
            isScanning={scanning}
          />

          <ScanTypeInfo scanType={selectedScanType} />
          <DefenseControls config={defenseConfig} onChange={setDefenseConfig} />
        </div>

        <div className="right-panel">
          <div
            className="terminal"
            ref={terminalRef}
            role="log"
            aria-label="Port scan terminal output"
            aria-live="polite"
            aria-atomic="false"
          >
            {terminalOutput.map((line, idx) => (
              <div key={idx} className="terminal-line">
                {line}
              </div>
            ))}
          </div>

          <ScanResultsTable
            results={results}
            selectedPort={selectedPort}
            onSelectPort={setSelectedPort}
          />

          {selectedResult && <ProtocolDetailsPanel result={selectedResult} />}

          <div className="exam-tips">
            <h3>📚 CompTIA Network+ Exam Tips</h3>
            <ul>
              <li>
                <strong>Security Implications:</strong> Open ports are potential attack vectors
              </li>
              <li>
                <strong>Common Services:</strong> Memorize standard ports (21=FTP, 22=SSH, 80=HTTP,
                443=HTTPS)
              </li>
              <li>
                <strong>Firewall vs ACL:</strong> Firewalls are stateful, ACLs are stateless
              </li>
              <li>
                <strong>Troubleshooting:</strong> Closed = service stopped, Filtered = firewall
                blocking
              </li>
              <li>
                <strong>Best Practices:</strong> Disable unnecessary services, use non-standard
                ports for security through obscurity
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PortScannerEnhanced;
