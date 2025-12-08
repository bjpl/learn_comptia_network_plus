/**
 * Enhanced comparison table component
 */

import React from 'react';
import type { TopologyDefinition, ComparisonMetrics } from '../../topologies-types';

interface ComparisonTableProps {
  selectedTopologyData: TopologyDefinition[];
  comparisonMetrics: ComparisonMetrics[];
  onShowTooltip: (id: string, content: string, examTip: string, event: React.MouseEvent) => void;
  onHideTooltip: () => void;
}

export const ComparisonTable = React.memo<ComparisonTableProps>(
  ({ selectedTopologyData, comparisonMetrics, onShowTooltip, onHideTooltip }) => {
    if (comparisonMetrics.length === 0) return null;

    return (
      <div className="radar-comparison-enhanced">
        <div className="comparison-header">
          <h3>Overall Comparison</h3>
          <div
            className="info-icon"
            onMouseEnter={(e) =>
              onShowTooltip(
                'comparison-tip',
                'Higher scores are better. Use this to compare tradeoffs.',
                'Exam Tip: Understand tradeoffs - high redundancy = high cost',
                e
              )
            }
            onMouseLeave={onHideTooltip}
          >
            ℹ️
          </div>
        </div>
        <div className="comparison-table-wrapper">
          <table className="comparison-table-enhanced" role="table">
            <thead>
              <tr>
                <th scope="col" className="metric-header-cell">
                  Metric
                </th>
                {selectedTopologyData.map((t) => (
                  <th key={t.id} scope="col" className="topology-header-cell">
                    {t.name}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {Object.keys(comparisonMetrics[0].scores).map((metric) => (
                <tr key={metric}>
                  <td className="metric-name-cell">{metric.replace(/([A-Z])/g, ' $1').trim()}</td>
                  {comparisonMetrics.map((cm) => (
                    <td key={cm.topology} className="score-cell">
                      <div className="score-bar-container">
                        <div
                          className="score-fill-enhanced"
                          style={{
                            width: `${cm.scores[metric as keyof typeof cm.scores]}%`,
                          }}
                        >
                          <span className="score-text">
                            {cm.scores[metric as keyof typeof cm.scores]}
                          </span>
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
  }
);

ComparisonTable.displayName = 'ComparisonTable';
