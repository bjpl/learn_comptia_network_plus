/**
 * Comparison Matrix tab component
 */

import React from 'react';
import { comparisonMatrix } from '../utils/comparisonMatrix';

export const ComparisonMatrixTab = React.memo(() => {
  return (
    <div className="comparison-matrix-tab">
      <h3>Network Topology Comparison Matrix</h3>
      <p className="tab-intro">
        Compare key characteristics across all topology types using scoring system (1-10 scale)
      </p>

      {/* Score Legend */}
      <div className="score-legend">
        <div className="legend-item">
          <span className="color cost"></span> <strong>Cost Score:</strong> 1=Most Expensive,
          10=Cheapest
        </div>
        <div className="legend-item">
          <span className="color redundancy"></span> <strong>Redundancy:</strong> 1=Least Redundant,
          10=Most Redundant
        </div>
        <div className="legend-item">
          <span className="color scalability"></span> <strong>Scalability:</strong> 1=Not Scalable,
          10=Highly Scalable
        </div>
        <div className="legend-item">
          <span className="color complexity"></span> <strong>Complexity:</strong> 1=Simple,
          10=Complex
        </div>
      </div>

      {/* Comparison Cards */}
      <div className="comparison-cards">
        {comparisonMatrix.map((comparison) => (
          <div key={comparison.topology} className="comparison-card">
            <h4 className="topology-name">
              {comparison.topology.replace('-', ' ').toUpperCase()}
            </h4>

            {/* Scores Visualization */}
            <div className="scores-section">
              <div className="score-row">
                <span className="score-label">Cost (1-10)</span>
                <div className="score-bar">
                  <div
                    className="score-fill cost"
                    style={{ width: `${comparison.costScore * 10}%` }}
                  ></div>
                </div>
                <span className="score-value">{comparison.costScore}</span>
              </div>
              <div className="score-row">
                <span className="score-label">Redundancy</span>
                <div className="score-bar">
                  <div
                    className="score-fill redundancy"
                    style={{ width: `${comparison.redundancyScore * 10}%` }}
                  ></div>
                </div>
                <span className="score-value">{comparison.redundancyScore}</span>
              </div>
              <div className="score-row">
                <span className="score-label">Scalability</span>
                <div className="score-bar">
                  <div
                    className="score-fill scalability"
                    style={{ width: `${comparison.scalabilityScore * 10}%` }}
                  ></div>
                </div>
                <span className="score-value">{comparison.scalabilityScore}</span>
              </div>
              <div className="score-row">
                <span className="score-label">Complexity</span>
                <div className="score-bar">
                  <div
                    className="score-fill complexity"
                    style={{ width: `${comparison.complexity * 10}%` }}
                  ></div>
                </div>
                <span className="score-value">{comparison.complexity}</span>
              </div>
            </div>

            {/* Pros */}
            <div className="pros-cons">
              <h5>Pros</h5>
              <ul className="pros-list">
                {comparison.pros.map((pro, idx) => (
                  <li key={idx}>
                    <span>+</span> {pro}
                  </li>
                ))}
              </ul>
            </div>

            {/* Cons */}
            <div className="pros-cons">
              <h5>Cons</h5>
              <ul className="cons-list">
                {comparison.cons.map((con, idx) => (
                  <li key={idx}>
                    <span>-</span> {con}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
});

ComparisonMatrixTab.displayName = 'ComparisonMatrixTab';
