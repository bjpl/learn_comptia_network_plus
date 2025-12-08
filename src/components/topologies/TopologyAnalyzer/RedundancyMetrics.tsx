/**
 * Redundancy Metrics component for TopologyAnalyzer
 */

import React from 'react';
import type { RedundancyMetrics as RedundancyMetricsType } from './types';

interface RedundancyMetricsProps {
  topologyName: string;
  redundancyData: RedundancyMetricsType;
}

export const RedundancyMetricsComponent: React.FC<RedundancyMetricsProps> = ({
  topologyName,
  redundancyData,
}) => {
  return (
    <div className="redundancy-metrics" role="region" aria-label="Redundancy metrics">
      <h5>Redundancy Analysis</h5>

      <div className="sr-only" aria-live="polite">
        Redundancy analysis for {topologyName}: Overall redundancy score{' '}
        {redundancyData.overallRedundancy} percent. Path redundancy {redundancyData.pathRedundancy}{' '}
        percent. Link redundancy {redundancyData.linkRedundancy} percent.
        {redundancyData.criticalPaths.length > 0 &&
          ` ${redundancyData.criticalPaths.length} critical paths identified.`}
      </div>

      <div className="metrics-grid">
        <div className="metric-card" role="group" aria-label="Path redundancy metric">
          <span className="label">Path Redundancy</span>
          <span className="value" aria-label={`${redundancyData.pathRedundancy} percent`}>
            {redundancyData.pathRedundancy}%
          </span>
          <span className="description">Extra paths beyond minimum</span>
        </div>
        <div className="metric-card" role="group" aria-label="Link redundancy metric">
          <span className="label">Link Redundancy</span>
          <span className="value" aria-label={`${redundancyData.linkRedundancy} percent`}>
            {redundancyData.linkRedundancy}%
          </span>
          <span className="description">Redundant links</span>
        </div>
        <div className="metric-card" role="group" aria-label="Overall redundancy score">
          <span className="label">Overall Score</span>
          <span className="value" aria-label={`${redundancyData.overallRedundancy} percent`}>
            {redundancyData.overallRedundancy}%
          </span>
          <span className="description">Combined redundancy</span>
        </div>
      </div>

      {redundancyData.criticalPaths.length > 0 && (
        <div className="critical-paths">
          <h6>Critical Paths Identified</h6>
          <ul>
            {redundancyData.criticalPaths.map((path, idx) => (
              <li key={idx}>{path}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};
