/**
 * Individual topology card component with all metrics
 */

import React from 'react';
import type { TopologyDefinition } from '../../topologies-types';
import { calculateCables } from '../utils/calculations';

interface TopologyCardProps {
  topology: TopologyDefinition;
  nodeCount: number;
  onShowTooltip: (id: string, content: string, examTip: string, event: React.MouseEvent) => void;
  onHideTooltip: () => void;
  onAnalyze: (topology: TopologyDefinition) => void;
}

export const TopologyCard = React.memo<TopologyCardProps>(
  ({ topology, nodeCount, onShowTooltip, onHideTooltip, onAnalyze }) => {
    const cables = calculateCables(topology, nodeCount);

    return (
      <div
        className="topology-card-enhanced"
        role="article"
        aria-labelledby={`topology-${topology.id}-title`}
      >
        <div className="card-header-gradient">
          <h3 id={`topology-${topology.id}-title`} className="card-title-main">
            {topology.name}
          </h3>
          <div className="card-icon">🔷</div>
        </div>

        <p className="card-description">{topology.description}</p>

        {/* Cable Requirements */}
        <div className="metric-section-enhanced">
          <div className="metric-header">
            <h4>Cable Requirements</h4>
            <span
              className="exam-badge"
              onMouseEnter={(e) =>
                onShowTooltip(
                  `cables-${topology.id}`,
                  'Cabling formula is essential for exam calculations',
                  `Exam Tip: ${topology.characteristics.cableRequirements.example}`,
                  e
                )
              }
              onMouseLeave={onHideTooltip}
            >
              📝 Exam
            </span>
          </div>
          <div className="metric-value-enhanced">
            <div className="formula-box">
              <span className="formula-label">Formula:</span>
              <code className="formula-code">
                {topology.characteristics.cableRequirements.formula}
              </code>
            </div>
            <div className="calculation-result">
              <span className="result-label">For {nodeCount} nodes:</span>
              <span className="result-value">{cables} cables</span>
            </div>
          </div>
        </div>

        {/* Fault Tolerance */}
        <div className="metric-section-enhanced">
          <div className="metric-header">
            <h4>Fault Tolerance</h4>
            <span
              className={`status-indicator ${topology.characteristics.faultTolerance.level}`}
              aria-label={`Fault tolerance level: ${topology.characteristics.faultTolerance.level}`}
            />
          </div>
          <div className="tolerance-level-enhanced">
            <span className={`level-badge ${topology.characteristics.faultTolerance.level}`}>
              {topology.characteristics.faultTolerance.level.toUpperCase()}
            </span>
            <div className="spof-indicator">
              <span className="spof-label">Single Point of Failure:</span>
              <strong
                className={
                  topology.characteristics.faultTolerance.singlePointOfFailure
                    ? 'spof-yes'
                    : 'spof-no'
                }
              >
                {topology.characteristics.faultTolerance.singlePointOfFailure ? 'Yes ⚠️' : 'No ✓'}
              </strong>
            </div>
          </div>
          <p className="metric-description">{topology.characteristics.faultTolerance.description}</p>
        </div>

        {/* Scalability */}
        <div className="metric-section-enhanced">
          <h4 className="metric-header">Scalability</h4>
          <div className="scalability-info-enhanced">
            <div className="scalability-stats">
              <div className="stat-item">
                <span className="stat-label">Level:</span>
                <span className="stat-value">
                  {topology.characteristics.scalability.level.toUpperCase()}
                </span>
              </div>
              <div className="stat-item">
                <span className="stat-label">Max Nodes:</span>
                <span className="stat-value">
                  {topology.characteristics.scalability.maxNodes === 'unlimited'
                    ? 'Unlimited ∞'
                    : topology.characteristics.scalability.maxNodes}
                </span>
              </div>
            </div>
            <div className="scalability-bar">
              <div
                className={`bar-fill ${topology.characteristics.scalability.level}`}
                style={{
                  width: `${
                    topology.characteristics.scalability.level === 'high'
                      ? 90
                      : topology.characteristics.scalability.level === 'medium'
                        ? 60
                        : 30
                  }%`,
                }}
              />
            </div>
          </div>
          <div className="limitations-box">
            <strong>Limitations:</strong>
            <ul className="limitations-list">
              {topology.characteristics.scalability.limitations.map((limit, idx) => (
                <li key={idx}>
                  <span className="limit-icon">⚠</span>
                  {limit}
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Cost Analysis */}
        <div className="metric-section-enhanced">
          <h4 className="metric-header">Cost Analysis</h4>
          <div className="cost-levels-enhanced">
            <div className="cost-badge">
              <span className="cost-label">Initial:</span>
              <span className={`cost-value ${topology.characteristics.cost.initial}`}>
                {topology.characteristics.cost.initial.toUpperCase()}
              </span>
            </div>
            <div className="cost-badge">
              <span className="cost-label">Maintenance:</span>
              <span className={`cost-value ${topology.characteristics.cost.maintenance}`}>
                {topology.characteristics.cost.maintenance.toUpperCase()}
              </span>
            </div>
          </div>
          <div className="cost-breakdown-enhanced">
            {Object.entries(topology.characteristics.cost.breakdown).map(([key, value]) => (
              <div key={key} className="breakdown-item-enhanced">
                <div className="breakdown-header">
                  <span className="breakdown-label">{key}</span>
                  <span className="breakdown-percentage">{value}%</span>
                </div>
                <div className="bar-container-enhanced">
                  <div className="bar-enhanced" style={{ width: `${value}%` }}>
                    <div className="bar-shine" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Traffic Flow */}
        <div className="metric-section-enhanced">
          <h4 className="metric-header">Traffic Flow Patterns</h4>
          <div className="traffic-split-enhanced">
            <div className="traffic-item-enhanced north-south">
              <span className="traffic-icon">⬆️</span>
              <span className="traffic-label">North-South:</span>
              <strong className="traffic-value">
                {topology.characteristics.trafficFlow.northSouth}%
              </strong>
              <div className="traffic-bar">
                <div
                  className="traffic-fill"
                  style={{ width: `${topology.characteristics.trafficFlow.northSouth}%` }}
                />
              </div>
            </div>
            <div className="traffic-item-enhanced east-west">
              <span className="traffic-icon">↔️</span>
              <span className="traffic-label">East-West:</span>
              <strong className="traffic-value">
                {topology.characteristics.trafficFlow.eastWest}%
              </strong>
              <div className="traffic-bar">
                <div
                  className="traffic-fill"
                  style={{ width: `${topology.characteristics.trafficFlow.eastWest}%` }}
                />
              </div>
            </div>
          </div>
          {topology.characteristics.trafficFlow.bottlenecks.length > 0 && (
            <div className="bottlenecks-enhanced">
              <strong className="bottleneck-header">Potential Bottlenecks:</strong>
              <ul className="bottleneck-list">
                {topology.characteristics.trafficFlow.bottlenecks.map((bottleneck, idx) => (
                  <li key={idx}>
                    <span className="bottleneck-icon">🚧</span>
                    {bottleneck}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>

        {/* Use Cases */}
        <div className="metric-section-enhanced">
          <h4 className="metric-header">Best Use Cases</h4>
          <ul className="use-cases-enhanced">
            {topology.useCases.map((useCase, idx) => (
              <li key={idx} className="use-case-item">
                <span className="use-case-icon">✓</span>
                <span className="use-case-text">{useCase}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Quick Action Buttons */}
        <div className="card-actions">
          <button
            className="action-btn primary"
            onClick={() => onAnalyze(topology)}
            aria-label={`Analyze ${topology.name} topology`}
          >
            <span className="btn-icon-small">🔍</span>
            Analyze SPOF
          </button>
        </div>
      </div>
    );
  }
);

TopologyCard.displayName = 'TopologyCard';
