/**
 * Exam scenarios tab for practice with network design questions
 */

import React, { useState } from 'react';
import { examScenarios } from '../constants/examScenarios';
import { topologyDefinitions } from '../../topologies-data';

export const ScenariosTab: React.FC = () => {
  const [selectedScenario, setSelectedScenario] = useState<string | null>(null);

  return (
    <div className="exam-scenarios-tab">
      <h3>Network Design Exam Scenarios</h3>
      <p className="tab-intro">
        Practice selecting the correct topology for different business requirements
      </p>

      {/* Scenario Selector */}
      <div className="scenario-list">
        {examScenarios.map((scenario) => (
          <div
            key={scenario.id}
            className={`scenario-card ${selectedScenario === scenario.id ? 'selected' : ''}`}
            onClick={() => setSelectedScenario(scenario.id)}
          >
            <div className="scenario-header">
              <h4>{scenario.title}</h4>
              <span className="scenario-id">{scenario.id}</span>
            </div>
            <div className="scenario-summary">
              <strong>Recommended:</strong>{' '}
              {scenario.recommendedTopology.replace('-', ' ').toUpperCase()}
            </div>
          </div>
        ))}
      </div>

      {/* Selected Scenario Details */}
      {selectedScenario && (
        <div className="scenario-details">
          {examScenarios.map((scenario) =>
            scenario.id === selectedScenario ? (
              <div key={scenario.id} className="scenario-content">
                <div className="detail-section">
                  <h3>{scenario.title}</h3>
                  <p className="description">{scenario.explanation}</p>
                </div>

                <div className="requirements-section">
                  <div className="subsection">
                    <h4>Requirements</h4>
                    <ul>
                      {scenario.requirements.map((req, idx) => (
                        <li key={idx}>
                          <span className="icon">✓</span> {req}
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="subsection">
                    <h4>Constraints</h4>
                    <ul>
                      {scenario.constraints.map((constraint, idx) => (
                        <li key={idx}>
                          <span className="icon">⚠</span> {constraint}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                <div className="recommendation-box">
                  <h4>Recommended Topology</h4>
                  <div className="topology-recommendation">
                    <span className="topology-badge">
                      {scenario.recommendedTopology.toUpperCase()}
                    </span>
                  </div>
                </div>

                <div className="exam-tip-box">
                  <h4>Exam Tip</h4>
                  <p>{scenario.examTip}</p>
                </div>
              </div>
            ) : null
          )}
        </div>
      )}

      {/* Quick Reference Table */}
      <div className="quick-reference">
        <h3>Quick Reference: Topology Selection Guide</h3>
        <div className="reference-table">
          <div className="table-header">
            <div className="table-cell">Topology</div>
            <div className="table-cell">Best For</div>
            <div className="table-cell">Key Limit</div>
            <div className="table-cell">Cable Formula</div>
          </div>
          {topologyDefinitions.map((topo) => (
            <div key={topo.id} className="table-row">
              <div className="table-cell">
                <strong>{topo.name}</strong>
              </div>
              <div className="table-cell">{topo.useCases[0]}</div>
              <div className="table-cell">
                {topo.characteristics.scalability.maxNodes === 'unlimited'
                  ? 'Unlimited'
                  : `Max ${topo.characteristics.scalability.maxNodes} nodes`}
              </div>
              <div className="table-cell">
                <code>{topo.characteristics.cableRequirements.formula}</code>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
