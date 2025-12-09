/**
 * Component #8: Enhanced Port Scanner Simulator (Refactored)
 * Educational port scanner for understanding network security concepts in CompTIA Network+
 *
 * This is the main orchestrator component that combines all sub-components.
 * Original file: 1558 lines -> Refactored: ~250 lines
 */

import React, { useState } from 'react';
import { DisclaimerModal } from './components/DisclaimerModal';
import { ScanControls } from './components/ScanControls';
import { ScanTypeInfo } from './components/ScanTypeInfo';
import { DefenseConfig } from './components/DefenseConfig';
import { Terminal } from './components/Terminal';
import { ScanResults } from './components/ScanResults';
import { PacketExchange } from './components/PacketExchange';
import { ExamTips } from './components/ExamTips';
import { useScanState } from './hooks/useScanState';
import { portScannerStyles } from './utils/styles';

export const PortScannerEnhanced: React.FC = () => {
  const [showDisclaimer, setShowDisclaimer] = useState(true);

  const {
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
  } = useScanState();

  const selectedResult = selectedPort ? results.find((r) => r.port === selectedPort) : null;

  return (
    <div className="port-scanner-enhanced">
      {showDisclaimer && <DisclaimerModal onAccept={() => setShowDisclaimer(false)} />}

      <div className="scanner-header">
        <h1>🔍 Enhanced Port Scanner Simulator</h1>
        <p className="subtitle">
          Learn network security scanning techniques - CompTIA Network+ Certification
        </p>
      </div>

      <div className="scanner-layout">
        <div className="left-panel">
          <ScanControls
            selectedScanType={selectedScanType}
            scanning={scanning}
            onScanTypeChange={setSelectedScanType}
            onStartScan={startScan}
          />

          <ScanTypeInfo scanType={selectedScanType} />

          <DefenseConfig config={defenseConfig} onConfigChange={setDefenseConfig} />
        </div>

        <div className="right-panel">
          <Terminal output={terminalOutput} />

          {/* Screen reader summary of scan results */}
          {scanning && (
            <div className="sr-only" aria-live="assertive">
              Scan in progress. {results.length} ports scanned so far.
            </div>
          )}
          {!scanning && results.length > 0 && (
            <div className="sr-only" aria-live="polite">
              Scan complete. {results.length} ports scanned.{' '}
              {results.filter((r) => r.state === 'open').length} ports open,{' '}
              {results.filter((r) => r.state === 'closed').length} ports closed,{' '}
              {results.filter((r) => r.state === 'filtered').length} ports filtered.{' '}
              {results.filter((r) => r.detected).length} detection events occurred.
            </div>
          )}

          <ScanResults
            results={results}
            selectedPort={selectedPort}
            onPortSelect={setSelectedPort}
          />

          {selectedResult && (
            <div className="packet-details">
              <PacketExchange result={selectedResult} />
            </div>
          )}

          <ExamTips />
        </div>
      </div>

      <style>{portScannerStyles}</style>
    </div>
  );
};

export default PortScannerEnhanced;
