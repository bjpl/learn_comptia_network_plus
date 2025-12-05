/**
 * Info Panel Component
 * Display topology information, validation, and hints
 */

import React, { useMemo } from 'react';
import type { BuilderDevice, BuilderConnection, ValidationIssue, DetectedTopologyType } from './types';

interface InfoPanelProps {
  detectedTopology: DetectedTopologyType;
  devices: BuilderDevice[];
  connections: BuilderConnection[];
  totalCost: { devices: number; connections: number; total: number };
  validationIssues: ValidationIssue[];
  showCost: boolean;
  showValidation: boolean;
  showHints: boolean;
}

export const InfoPanel: React.FC<InfoPanelProps> = React.memo(
  ({
    detectedTopology,
    devices,
    connections,
    totalCost,
    validationIssues,
    showCost,
    showValidation,
    showHints,
  }) => {
    const hints = useMemo(() => {
      const allHints = [
        {
          condition: devices.length === 0,
          message: 'Start by adding devices from the palette on the left',
        },
        {
          condition: devices.length > 0 && connections.length === 0,
          message: 'Click a device and then another to create connections',
        },
        {
          condition: detectedTopology === 'star',
          message:
            'Star topology detected: Simple but has a single point of failure at the central device',
        },
        {
          condition: detectedTopology === 'mesh',
          message: 'Mesh topology detected: Maximum redundancy but high cable costs',
        },
        {
          condition: detectedTopology === 'ring',
          message: 'Ring topology detected: Each device has exactly two connections',
        },
        {
          condition: validationIssues.some((i) => i.type === 'spof'),
          message: 'Consider adding redundant connections to eliminate single points of failure',
        },
        {
          condition: totalCost.total > 10000,
          message: 'High cost detected - consider optimizing device selection or cable routes',
        },
      ];

      return allHints.filter((h) => h.condition).map((h) => h.message);
    }, [devices, connections, detectedTopology, validationIssues, totalCost]);

    return (
      <div className="builder-info">
        {/* Topology Detection */}
        <div className="info-card">
          <h3>Detected Topology</h3>
          <div className="topology-badge topology-badge-large">{detectedTopology}</div>
          <div className="topology-stats">
            <div>
              <strong>Devices:</strong> {devices.length}
            </div>
            <div>
              <strong>Connections:</strong> {connections.length}
            </div>
          </div>
        </div>

        {/* Cost Summary */}
        {showCost && (
          <div className="info-card">
            <h3>Cost Summary</h3>
            <div className="cost-breakdown">
              <div className="cost-row">
                <span>Devices:</span>
                <span>${totalCost.devices.toLocaleString()}</span>
              </div>
              <div className="cost-row">
                <span>Cabling:</span>
                <span>${totalCost.connections.toLocaleString()}</span>
              </div>
              <div className="cost-row cost-total">
                <span>Total:</span>
                <span>${totalCost.total.toLocaleString()}</span>
              </div>
            </div>
          </div>
        )}

        {/* Validation Issues */}
        {showValidation && validationIssues.length > 0 && (
          <div className="info-card">
            <h3>Validation Issues</h3>
            <div className="validation-list">
              {validationIssues.map((issue) => (
                <div key={issue.id} className={`validation-issue severity-${issue.severity}`}>
                  <span className="issue-icon">
                    {issue.severity === 'error'
                      ? '❌'
                      : issue.severity === 'warning'
                        ? '⚠️'
                        : 'ℹ️'}
                  </span>
                  <span className="issue-message">{issue.message}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Educational Hints */}
        {showHints && hints.length > 0 && (
          <div className="info-card">
            <h3>💡 Best Practices</h3>
            <div className="hints-list">
              {hints.slice(0, 3).map((hint, idx) => (
                <div key={idx} className="hint-item">
                  {hint}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    );
  }
);

InfoPanel.displayName = 'InfoPanel';
