/**
 * Scan controls component
 */

import React from 'react';
import type { ScanType } from '../types';

interface ScanControlsProps {
  selectedScanType: ScanType;
  scanning: boolean;
  onScanTypeChange: (scanType: ScanType) => void;
  onStartScan: () => void;
}

export const ScanControls: React.FC<ScanControlsProps> = ({
  selectedScanType,
  scanning,
  onScanTypeChange,
  onStartScan,
}) => {
  return (
    <div className="scan-controls">
      <h3>Scan Configuration</h3>

      <div className="scan-type-selector">
        <label htmlFor="scan-type-select">Scan Type:</label>
        <select
          id="scan-type-select"
          value={selectedScanType}
          onChange={(e) => onScanTypeChange(e.target.value as ScanType)}
          disabled={scanning}
        >
          <option value="tcp-connect">TCP Connect Scan (Non-Stealth)</option>
          <option value="syn-scan">SYN Scan (Stealth)</option>
          <option value="udp-scan">UDP Scan</option>
          <option value="ack-scan">ACK Scan (Firewall Detection)</option>
          <option value="banner-grab">Banner Grabbing</option>
        </select>
      </div>

      <button onClick={onStartScan} disabled={scanning} className="scan-button">
        {scanning ? '⟳ Scanning...' : '🚀 Start Scan'}
      </button>
    </div>
  );
};
