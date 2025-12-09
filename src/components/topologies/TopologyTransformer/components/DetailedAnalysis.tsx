/**
 * Detailed analysis section showing transformation impact
 */

import React from 'react';
import type { TopologyTransformation } from '../../topologies-types';

interface DetailedAnalysisProps {
  analysis: TopologyTransformation['analysis'];
}

export const DetailedAnalysis: React.FC<DetailedAnalysisProps> = ({ analysis }) => {
  return (
    <div className="detailed-analysis">
      <h3>Transformation Analysis</h3>

      <div className="analysis-grid">
        {/* Redundancy Analysis */}
        <div className="analysis-section">
          <h4>Redundancy Impact</h4>
          <div className="analysis-item">
            <span className="label">Before:</span>
            <span className="value">{analysis.redundancy.before}</span>
          </div>
          <div className="analysis-item">
            <span className="label">After:</span>
            <span className="value">{analysis.redundancy.after}</span>
          </div>
          <div className="analysis-item highlight">
            <span className="label">Change:</span>
            <span className="value">{analysis.redundancy.change}</span>
          </div>
        </div>

        {/* Traffic Patterns Analysis */}
        <div className="analysis-section">
          <h4>Traffic Patterns</h4>
          <div className="analysis-item">
            <span className="label">Before:</span>
            <span className="value">{analysis.trafficPatterns.before}</span>
          </div>
          <div className="analysis-item">
            <span className="label">After:</span>
            <span className="value">{analysis.trafficPatterns.after}</span>
          </div>
          <div className="analysis-item highlight">
            <span className="label">Improvement:</span>
            <span className="value">{analysis.trafficPatterns.improvement}</span>
          </div>
        </div>

        {/* Scalability Analysis */}
        <div className="analysis-section">
          <h4>Scalability</h4>
          <div className="analysis-item">
            <span className="label">Before:</span>
            <span className="value">{analysis.scalability.before}</span>
          </div>
          <div className="analysis-item">
            <span className="label">After:</span>
            <span className="value">{analysis.scalability.after}</span>
          </div>
          <div className="analysis-item highlight">
            <span className="label">Improvement:</span>
            <span className="value">{analysis.scalability.improvement}</span>
          </div>
        </div>

        {/* Cost Analysis */}
        <div className="analysis-section">
          <h4>Cost Impact</h4>
          <div className="analysis-item">
            <span className="label">Before:</span>
            <span className="value">{analysis.cost.before}</span>
          </div>
          <div className="analysis-item">
            <span className="label">After:</span>
            <span className="value">{analysis.cost.after}</span>
          </div>
          <div className="analysis-item highlight">
            <span className="label">Change:</span>
            <span className="value">{analysis.cost.change}</span>
          </div>
        </div>
      </div>
    </div>
  );
};
