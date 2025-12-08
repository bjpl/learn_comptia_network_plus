/**
 * TopologyComparison Component
 * Overall comparison table with radar chart metrics
 */

import React from 'react';
import type { TopologyDefinition, ComparisonMetrics } from '../../topologies-types';

interface TopologyComparisonProps {
  selectedTopologyData: TopologyDefinition[];
  comparisonMetrics: ComparisonMetrics[];
}

export const TopologyComparison: React.FC<TopologyComparisonProps> = ({
  selectedTopologyData,
  comparisonMetrics,
}) => {
  return (
    <div className="radar-comparison">
      <h3>Overall Comparison</h3>
      <div className="comparison-table">
        <table>
          <thead>
            <tr>
              <th>Metric</th>
              {selectedTopologyData.map((t) => (
                <th key={t.id}>{t.name}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {comparisonMetrics.length > 0 &&
              Object.keys(comparisonMetrics[0].scores).map((metric) => (
                <tr key={metric}>
                  <td className="metric-name">{metric.replace(/([A-Z])/g, ' $1').trim()}</td>
                  {comparisonMetrics.map((cm) => (
                    <td key={cm.topology}>
                      <div className="score-bar">
                        <div
                          className="score-fill"
                          style={{
                            width: `${cm.scores[metric as keyof typeof cm.scores]}%`,
                          }}
                        >
                          {cm.scores[metric as keyof typeof cm.scores]}
                        </div>
                      </div>
                    </td>
                  ))}
                </tr>
              ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
