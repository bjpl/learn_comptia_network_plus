/**
 * Protocol Details Panel Component
 * Display detailed packet exchange information
 */

import React from 'react';
import type { ScanResult } from './types';

interface ProtocolDetailsPanelProps {
  result: ScanResult | undefined;
}

export const ProtocolDetailsPanel: React.FC<ProtocolDetailsPanelProps> = React.memo(
  ({ result }) => {
    if (!result) {
      return null;
    }

    return (
      <div className="packet-details">
        <div
          className="packet-exchange"
          role="region"
          aria-label={`Packet exchange details for port ${result.port}`}
        >
          <h4>Packet Exchange Analysis - Port {result.port}</h4>

          {/* Screen reader summary */}
          <div className="sr-only">
            Packet exchange for port {result.port}, {result.service}. {result.exchanges.length}{' '}
            steps total. Final state: {result.state}.
            {result.detected && ' This scan was detected by IDS.'}
          </div>

          <div className="exchange-timeline" role="list" aria-label="Packet exchange steps">
            {result.exchanges.map((exchange, idx) => (
              <div
                key={idx}
                className={`exchange-step ${exchange.source} ${exchange.detected ? 'detected' : ''}`}
                role="listitem"
                aria-label={`Step ${exchange.step}: ${exchange.source === 'scanner' ? 'Scanner' : 'Target'} sends ${exchange.type}. ${exchange.description}.${exchange.detected ? ' Detected and logged.' : ''}`}
              >
                <div className="step-number">Step {exchange.step}</div>
                <div className="step-content">
                  <div className="step-source">
                    {exchange.source === 'scanner' ? '📡 Scanner' : '🖥️ Target'}
                    {exchange.flags && <span className="flags"> [{exchange.flags.join(', ')}]</span>}
                  </div>
                  <div className="step-type">{exchange.type}</div>
                  <div className="step-description">{exchange.description}</div>
                  {exchange.detected && <div className="detection-badge">🚨 Logged/Detected</div>}
                </div>
              </div>
            ))}
          </div>

          <div className="exchange-summary">
            <h5>
              Scan Result:{' '}
              <span className={`state-${result.state}`}>{result.state.toUpperCase()}</span>
            </h5>
            {result.banner && (
              <div className="banner-info">
                <strong>Banner:</strong> {result.banner}
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }
);

ProtocolDetailsPanel.displayName = 'ProtocolDetailsPanel';
