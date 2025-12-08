/**
 * SPOFAnalysisPanel Component
 * Single Points of Failure analysis display
 */

import React from 'react';
import type { SPOFAnalysis } from '../types';

interface SPOFAnalysisPanelProps {
  topologyName: string;
  spofData: SPOFAnalysis[];
}

export const SPOFAnalysisPanel: React.FC<SPOFAnalysisPanelProps> = ({ topologyName, spofData }) => {
  const spofCount = spofData.filter((s) => s.isSPOF).length;

  return (
    <div className="spof-analysis" role="region" aria-label="Single Points of Failure analysis">
      <h5>Single Points of Failure (SPOF) Detection</h5>

      {/* Screen reader summary */}
      <div className="sr-only" aria-live="polite">
        {topologyName} topology analysis: {spofCount} single point
        {spofCount !== 1 ? 's' : ''} of failure detected.{' '}
        {spofCount === 0
          ? 'This topology has good redundancy.'
          : spofCount === 1
            ? 'One critical node identified.'
            : `${spofCount} critical nodes identified.`}
      </div>

      <div className="spof-summary">
        <div
          className="spof-badge"
          role="status"
          aria-label={`${spofCount} single points of failure found`}
        >
          <span className={`count ${spofCount === 0 ? 'safe' : 'critical'}`}>
            {spofCount} SPOF{spofCount !== 1 ? 's' : ''}
          </span>
          <span className="label">Found</span>
        </div>
      </div>

      {spofData.length > 0 && (
        <div className="spof-details">
          {spofData.map((spof) => (
            <div key={spof.nodeId} className={`spof-item ${spof.isSPOF ? 'critical' : 'safe'}`}>
              <div className="spof-header">
                <span className="node-label">{spof.label}</span>
                <span className={`impact-badge ${spof.impact.toLowerCase()}`}>{spof.impact} Risk</span>
              </div>
              <div className="spof-info">
                <div className="info-row">
                  <span className="label">Connections:</span>
                  <span className="value">{spof.redundancy}</span>
                </div>
                {spof.affectedNodes.length > 0 && (
                  <div className="info-row">
                    <span className="label">Affects:</span>
                    <span className="value">{spof.affectedNodes.join(', ')}</span>
                  </div>
                )}
                {spof.isSPOF && (
                  <div className="warning">
                    This node is a single point of failure. Network interruption occurs if it fails.
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
