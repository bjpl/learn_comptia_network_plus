/**
 * TopologyCard Component
 * Individual topology card displaying detailed metrics
 */

import React from 'react';
import type { TopologyDefinition } from '../../topologies-types';
import { calculateCables } from '../utils/calculations';

interface TopologyCardProps {
  topology: TopologyDefinition;
  nodeCount: number;
}

export const TopologyCard: React.FC<TopologyCardProps> = ({ topology, nodeCount }) => {
  return (
    <div className="topology-card">
      <h3>{topology.name}</h3>
      <p className="description">{topology.description}</p>

      {/* Cable Requirements */}
      <div className="metric-section">
        <h4>Cable Requirements</h4>
        <div className="metric-value">
          <span className="formula">{topology.characteristics.cableRequirements.formula}</span>
          <span className="calculation">
            For {nodeCount} nodes: <strong>{calculateCables(topology, nodeCount)} cables</strong>
          </span>
        </div>
      </div>

      {/* Fault Tolerance */}
      <div className="metric-section">
        <h4>Fault Tolerance</h4>
        <div className="tolerance-level">
          <span className={`level ${topology.characteristics.faultTolerance.level}`}>
            {topology.characteristics.faultTolerance.level.toUpperCase()}
          </span>
          <div className="spof">
            Single Point of Failure:{' '}
            <strong>
              {topology.characteristics.faultTolerance.singlePointOfFailure ? 'Yes' : 'No'}
            </strong>
          </div>
        </div>
        <p className="description">{topology.characteristics.faultTolerance.description}</p>
      </div>

      {/* Scalability */}
      <div className="metric-section">
        <h4>Scalability</h4>
        <div className="scalability-info">
          <div className="level">
            Level: <strong>{topology.characteristics.scalability.level.toUpperCase()}</strong>
          </div>
          <div className="max-nodes">
            Max Nodes:{' '}
            <strong>
              {topology.characteristics.scalability.maxNodes === 'unlimited'
                ? 'Unlimited'
                : topology.characteristics.scalability.maxNodes}
            </strong>
          </div>
        </div>
        <div className="limitations">
          <strong>Limitations:</strong>
          <ul>
            {topology.characteristics.scalability.limitations.map((limit, idx) => (
              <li key={idx}>{limit}</li>
            ))}
          </ul>
        </div>
      </div>

      {/* Cost Breakdown */}
      <div className="metric-section">
        <h4>Cost Analysis</h4>
        <div className="cost-levels">
          <div>
            Initial: <strong>{topology.characteristics.cost.initial.toUpperCase()}</strong>
          </div>
          <div>
            Maintenance: <strong>{topology.characteristics.cost.maintenance.toUpperCase()}</strong>
          </div>
        </div>
        <div className="cost-breakdown">
          <div className="breakdown-chart">
            {Object.entries(topology.characteristics.cost.breakdown).map(([key, value]) => (
              <div key={key} className="breakdown-item">
                <span className="label">{key}</span>
                <div className="bar-container">
                  <div className="bar" style={{ width: `${value}%` }}>
                    {value}%
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Traffic Flow */}
      <div className="metric-section">
        <h4>Traffic Flow Patterns</h4>
        <div className="traffic-split">
          <div className="traffic-item north-south">
            <span>North-South:</span>
            <strong>{topology.characteristics.trafficFlow.northSouth}%</strong>
          </div>
          <div className="traffic-item east-west">
            <span>East-West:</span>
            <strong>{topology.characteristics.trafficFlow.eastWest}%</strong>
          </div>
        </div>
        <div className="bottlenecks">
          <strong>Potential Bottlenecks:</strong>
          <ul>
            {topology.characteristics.trafficFlow.bottlenecks.map((bottleneck, idx) => (
              <li key={idx}>{bottleneck}</li>
            ))}
          </ul>
        </div>
      </div>

      {/* Use Cases */}
      <div className="metric-section">
        <h4>Best Use Cases</h4>
        <ul className="use-cases">
          {topology.useCases.map((useCase, idx) => (
            <li key={idx}>{useCase}</li>
          ))}
        </ul>
      </div>
    </div>
  );
};
