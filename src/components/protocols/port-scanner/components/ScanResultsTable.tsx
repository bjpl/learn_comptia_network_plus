/**
 * Scan results table component
 */

import React from 'react';
import type { ScanResult } from '../types';

interface ScanResultsTableProps {
  results: ScanResult[];
  selectedPort: number | null;
  onPortSelect: (port: number) => void;
  scanning: boolean;
}

export const ScanResultsTable: React.FC<ScanResultsTableProps> = ({
  results,
  selectedPort,
  onPortSelect,
  scanning,
}) => {
  if (results.length === 0) {
    return null;
  }

  return (
    <>
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
    </>
  );
};
