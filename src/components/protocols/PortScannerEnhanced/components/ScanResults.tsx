/**
 * Scan results component
 */

import React from 'react';
import type { ScanResult } from '../types';

interface ScanResultsProps {
  results: ScanResult[];
  selectedPort: number | null;
  onPortSelect: (port: number) => void;
}

export const ScanResults: React.FC<ScanResultsProps> = ({
  results,
  selectedPort,
  onPortSelect,
}) => {
  if (results.length === 0) {
    return null;
  }

  return (
    <div className="results-panel">
      <h3>Scan Results - Click for Details</h3>
      <div className="results-grid" role="list" aria-label="Port scan results">
        {results.map((result) => (
          <div
            key={result.port}
            className={`result-card ${selectedPort === result.port ? 'selected' : ''} state-${result.state}`}
            onClick={() => onPortSelect(result.port)}
            role="listitem button"
            tabIndex={0}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                onPortSelect(result.port);
              }
            }}
            aria-label={`Port ${result.port}, ${result.service}, state: ${result.state}${result.detected ? ', detection alert' : ''}`}
            aria-pressed={selectedPort === result.port}
          >
            <div className="result-port">Port {result.port}</div>
            <div className="result-service">{result.service}</div>
            <div className={`result-state state-${result.state}`}>{result.state.toUpperCase()}</div>
            {result.detected && (
              <div className="detected-badge" aria-label="Detected by IDS">
                🚨
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};
