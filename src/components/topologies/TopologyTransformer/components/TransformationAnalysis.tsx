/**
 * Detailed analysis and benefits/considerations component
 */

import React from 'react';
import type { TopologyTransformation } from '../../topologies-types';

interface TransformationAnalysisProps {
  transformation: TopologyTransformation;
}

export const TransformationAnalysis = React.memo<TransformationAnalysisProps>(
  ({ transformation }) => {
    return (
      <>
        {/* Detailed Analysis */}
        <div className="detailed-analysis">
          <h3>Transformation Analysis</h3>

          <div className="analysis-grid">
            {/* Redundancy Analysis */}
            <div className="analysis-section">
              <h4>Redundancy Impact</h4>
              <div className="analysis-item">
                <span className="label">Before:</span>
                <span className="value">{transformation.analysis.redundancy.before}</span>
              </div>
              <div className="analysis-item">
                <span className="label">After:</span>
                <span className="value">{transformation.analysis.redundancy.after}</span>
              </div>
              <div className="analysis-item highlight">
                <span className="label">Change:</span>
                <span className="value">{transformation.analysis.redundancy.change}</span>
              </div>
            </div>

            {/* Traffic Patterns Analysis */}
            <div className="analysis-section">
              <h4>Traffic Patterns</h4>
              <div className="analysis-item">
                <span className="label">Before:</span>
                <span className="value">{transformation.analysis.trafficPatterns.before}</span>
              </div>
              <div className="analysis-item">
                <span className="label">After:</span>
                <span className="value">{transformation.analysis.trafficPatterns.after}</span>
              </div>
              <div className="analysis-item highlight">
                <span className="label">Improvement:</span>
                <span className="value">{transformation.analysis.trafficPatterns.improvement}</span>
              </div>
            </div>

            {/* Scalability Analysis */}
            <div className="analysis-section">
              <h4>Scalability</h4>
              <div className="analysis-item">
                <span className="label">Before:</span>
                <span className="value">{transformation.analysis.scalability.before}</span>
              </div>
              <div className="analysis-item">
                <span className="label">After:</span>
                <span className="value">{transformation.analysis.scalability.after}</span>
              </div>
              <div className="analysis-item highlight">
                <span className="label">Improvement:</span>
                <span className="value">{transformation.analysis.scalability.improvement}</span>
              </div>
            </div>

            {/* Cost Analysis */}
            <div className="analysis-section">
              <h4>Cost Impact</h4>
              <div className="analysis-item">
                <span className="label">Before:</span>
                <span className="value">{transformation.analysis.cost.before}</span>
              </div>
              <div className="analysis-item">
                <span className="label">After:</span>
                <span className="value">{transformation.analysis.cost.after}</span>
              </div>
              <div className="analysis-item highlight">
                <span className="label">Change:</span>
                <span className="value">{transformation.analysis.cost.change}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Benefits and Considerations */}
        <div className="benefits-considerations">
          <div className="benefits">
            <h4>Benefits</h4>
            <ul>
              {transformation.benefits.map((benefit, idx) => (
                <li key={idx}>
                  <span className="icon">✓</span>
                  {benefit}
                </li>
              ))}
            </ul>
          </div>

          <div className="considerations">
            <h4>Considerations</h4>
            <ul>
              {transformation.considerations.map((consideration, idx) => (
                <li key={idx}>
                  <span className="icon">⚠</span>
                  {consideration}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </>
    );
  }
);

TransformationAnalysis.displayName = 'TransformationAnalysis';
