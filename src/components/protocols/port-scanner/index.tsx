/**
 * Component #8: Enhanced Port Scanner Simulator (Refactored)
 * Educational port scanner for understanding network security concepts in CompTIA Network+
 *
 * Features:
 * - Multiple scan type simulators (TCP Connect, SYN, UDP, ACK)
 * - Port state visualization (Open, Closed, Filtered, Open|Filtered)
 * - Stealth vs non-stealth comparison
 * - Service banner detection
 * - Defense mechanism simulation (Firewall, IDS, rate limiting)
 * - Ethical hacking disclaimer and educational focus
 */

import React from 'react';
import { useScanState } from './hooks/useScanState';
import { usePortAnalysis } from './hooks/usePortAnalysis';
import { ScannerControls } from './components/ScannerControls';
import { ScanResultsTable } from './components/ScanResultsTable';
import { ProtocolDetailsPanel } from './components/ProtocolDetailsPanel';
import { DefenseControls } from './components/DefenseControls';
import { ScanTypeInfo } from './components/ScanTypeInfo';
import { styles } from './styles';

export const PortScannerEnhancedRefactored: React.FC = () => {
  const {
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
  } = useScanState();

  const { performScan } = usePortAnalysis();

  const handleStartScan = async () => {
    setScanning(true);
    setResults([]);

    const scanResults = await performScan(
      selectedScanType,
      defenseConfig,
      (result) => {
        setResults((prev) => [...prev, result]);
      },
      addTerminalOutput
    );

    setResults(scanResults);
    setScanning(false);
  };

  const selectedResult = selectedPort ? results.find((r) => r.port === selectedPort) : null;

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
            scanning={scanning}
            onStartScan={handleStartScan}
          />

          <ScanTypeInfo scanType={selectedScanType} />

          <DefenseControls
            defenseConfig={defenseConfig}
            onDefenseConfigChange={setDefenseConfig}
          />
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
            onPortSelect={setSelectedPort}
            scanning={scanning}
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

      <style>{styles}</style>
    </div>
  );
};

export default PortScannerEnhancedRefactored;
