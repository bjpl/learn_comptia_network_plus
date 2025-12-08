/**
 * Scan Results Table Component
 * Display scan results with sorting and filtering
 */

import React from 'react';
import type { ScanResult } from './types';

interface ScanResultsTableProps {
  results: ScanResult[];
  selectedPort: number | null;
  onSelectPort: (port: number) => void;
  showCost?: boolean;
}

export const ScanResultsTable: React.FC<ScanResultsTableProps> = React.memo(
  ({ results, selectedPort, onSelectPort, showCost = true }) => {
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
              onClick={() => onSelectPort(result.port)}
              role="listitem button"
              tabIndex={0}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault();
                  onSelectPort(result.port);
                }
              }}
              aria-label={`Port ${result.port}, ${result.service}, state: ${result.state}${result.detected ? ', detection alert' : ''}`}
              aria-pressed={selectedPort === result.port}
            >
              <div className="result-port">Port {result.port}</div>
              <div className="result-service">{result.service}</div>
              <div className={`result-state state-${result.state}`}>
                {result.state.toUpperCase()}
              </div>
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
  }
);

ScanResultsTable.displayName = 'ScanResultsTable';
