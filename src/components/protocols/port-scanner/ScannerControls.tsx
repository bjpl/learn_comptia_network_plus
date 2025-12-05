/**
 * Scanner Controls Component
 * Port range selection, scan type selection, and scan initiation
 */

import React from 'react';
import type { ScanType } from './types';

interface ScannerControlsProps {
  selectedScanType: ScanType;
  onScanTypeChange: (type: ScanType) => void;
  onStartScan: () => void;
  isScanning: boolean;
}

export const ScannerControls: React.FC<ScannerControlsProps> = React.memo(
  ({ selectedScanType, onScanTypeChange, onStartScan, isScanning }) => {
    return (
      <div className="scan-controls">
        <h3>Scan Configuration</h3>

        <div className="scan-type-selector">
          <label htmlFor="scan-type-select">Scan Type:</label>
          <select
            id="scan-type-select"
            value={selectedScanType}
            onChange={(e) => onScanTypeChange(e.target.value as ScanType)}
            disabled={isScanning}
          >
            <option value="tcp-connect">TCP Connect Scan (Non-Stealth)</option>
            <option value="syn-scan">SYN Scan (Stealth)</option>
            <option value="udp-scan">UDP Scan</option>
            <option value="ack-scan">ACK Scan (Firewall Detection)</option>
            <option value="banner-grab">Banner Grabbing</option>
          </select>
        </div>

        <button onClick={onStartScan} disabled={isScanning} className="scan-button">
          {isScanning ? '⟳ Scanning...' : '🚀 Start Scan'}
        </button>
      </div>
    );
  }
);

ScannerControls.displayName = 'ScannerControls';
