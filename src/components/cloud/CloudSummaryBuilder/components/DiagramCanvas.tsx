/**
 * DiagramCanvas component - displays the scenario and user summary form
 */

import React from 'react';
import type { CloudScenario, CloudSummary, ScoreBreakdown, DeploymentModel, ServiceModel, ConnectivityMethod, ScalabilityType } from '../../cloud-types';

interface DiagramCanvasProps {
  selectedScenario: CloudScenario;
  userSummary: Partial<CloudSummary>;
  setUserSummary: React.Dispatch<React.SetStateAction<Partial<CloudSummary>>>;
  wordCount: number;
  score: ScoreBreakdown | null;
  showIdealSolution: boolean;
  onSubmit: () => void;
  onReset: () => void;
  onToggleIdealSolution: () => void;
}

export const DiagramCanvas: React.FC<DiagramCanvasProps> = ({
  selectedScenario,
  userSummary,
  setUserSummary,
  wordCount,
  score,
  showIdealSolution,
  onSubmit,
  onReset,
  onToggleIdealSolution,
}) => {
  return (
    <div className="content-grid">
      <div className="scenario-panel">
        <h3>{selectedScenario.title}</h3>
        <div className="scenario-metadata">
          <span className="badge">{selectedScenario.provider}</span>
        </div>
        <div className="scenario-description">
          {selectedScenario.description.split('\n\n').map((para, idx) => (
            <p key={idx}>{para.trim()}</p>
          ))}
        </div>
        <div className="scenario-requirements">
          <h4>Key Requirements:</h4>
          <ul>
            {selectedScenario.requirements.map((req, idx) => (
              <li key={idx}>{req}</li>
            ))}
          </ul>
        </div>
      </div>

      <div className="summary-panel">
        <div className="word-counter">
          <span
            className={`count ${wordCount > 100 ? 'warning' : wordCount > 150 ? 'error' : 'good'}`}
          >
            {wordCount} words
          </span>
          <span className="target">Target: ≤100 words</span>
        </div>

        <div className="summary-form">
          <div className="form-group">
            <label htmlFor="deployment-model">Deployment Model *</label>
            <select
              id="deployment-model"
              value={userSummary.deploymentModel || ''}
              onChange={(e) =>
                setUserSummary({
                  ...userSummary,
                  deploymentModel: e.target.value as DeploymentModel,
                })
              }
            >
              <option value="">Select...</option>
              <option value="Public">Public</option>
              <option value="Private">Private</option>
              <option value="Hybrid">Hybrid</option>
            </select>
            <input
              type="text"
              placeholder="Justification (concise)"
              value={userSummary.deploymentJustification || ''}
              onChange={(e) =>
                setUserSummary({ ...userSummary, deploymentJustification: e.target.value })
              }
            />
          </div>

          <div className="form-group">
            <label htmlFor="service-model">Service Model *</label>
            <select
              id="service-model"
              value={userSummary.serviceModel || ''}
              onChange={(e) =>
                setUserSummary({
                  ...userSummary,
                  serviceModel: e.target.value as ServiceModel,
                })
              }
            >
              <option value="">Select...</option>
              <option value="SaaS">SaaS (Software as a Service)</option>
              <option value="PaaS">PaaS (Platform as a Service)</option>
              <option value="IaaS">IaaS (Infrastructure as a Service)</option>
            </select>
            <input
              type="text"
              placeholder="Specific examples (comma separated)"
              value={userSummary.serviceExamples?.join(', ') || ''}
              onChange={(e) =>
                setUserSummary({
                  ...userSummary,
                  serviceExamples: e.target.value
                    .split(',')
                    .map((s) => s.trim())
                    .filter((s) => s),
                })
              }
            />
          </div>

          <div className="form-group">
            <label htmlFor="connectivity-method">Connectivity Method *</label>
            <select
              id="connectivity-method"
              value={userSummary.connectivityMethod || ''}
              onChange={(e) =>
                setUserSummary({
                  ...userSummary,
                  connectivityMethod: e.target.value as ConnectivityMethod,
                })
              }
            >
              <option value="">Select...</option>
              <option value="VPN">VPN</option>
              <option value="Direct Connect">Direct Connect (Dedicated)</option>
              <option value="Internet Gateway">Internet Gateway</option>
            </select>
            <input
              type="text"
              placeholder="Reasoning (concise)"
              value={userSummary.connectivityReasoning || ''}
              onChange={(e) =>
                setUserSummary({ ...userSummary, connectivityReasoning: e.target.value })
              }
            />
          </div>

          <div className="form-group">
            <label htmlFor="nfv-implementation">NFV Implementation</label>
            <input
              id="nfv-implementation"
              type="text"
              placeholder="How network functions are virtualized"
              value={userSummary.nfvImplementation || ''}
              onChange={(e) =>
                setUserSummary({ ...userSummary, nfvImplementation: e.target.value })
              }
            />
          </div>

          <div className="form-group">
            <label htmlFor="vpc-subnets">VPC Configuration</label>
            <input
              id="vpc-subnets"
              type="text"
              placeholder="Subnets (comma separated)"
              value={userSummary.vpcConfiguration?.subnets.join(', ') || ''}
              onChange={(e) =>
                setUserSummary({
                  ...userSummary,
                  vpcConfiguration: {
                    ...userSummary.vpcConfiguration!,
                    subnets: e.target.value
                      .split(',')
                      .map((s) => s.trim())
                      .filter((s) => s),
                  },
                })
              }
            />
            <input
              type="text"
              placeholder="Security groups (comma separated)"
              value={userSummary.vpcConfiguration?.securityGroups.join(', ') || ''}
              onChange={(e) =>
                setUserSummary({
                  ...userSummary,
                  vpcConfiguration: {
                    ...userSummary.vpcConfiguration!,
                    securityGroups: e.target.value
                      .split(',')
                      .map((s) => s.trim())
                      .filter((s) => s),
                  },
                })
              }
            />
          </div>

          <div className="form-group">
            <label htmlFor="gateway-usage">Cloud Gateways</label>
            <div className="checkbox-group">
              <label>
                <input
                  type="checkbox"
                  checked={userSummary.cloudGateways?.internetGateway || false}
                  onChange={(e) =>
                    setUserSummary({
                      ...userSummary,
                      cloudGateways: {
                        ...userSummary.cloudGateways!,
                        internetGateway: e.target.checked,
                      },
                    })
                  }
                />
                Internet Gateway
              </label>
              <label>
                <input
                  type="checkbox"
                  checked={userSummary.cloudGateways?.natGateway || false}
                  onChange={(e) =>
                    setUserSummary({
                      ...userSummary,
                      cloudGateways: {
                        ...userSummary.cloudGateways!,
                        natGateway: e.target.checked,
                      },
                    })
                  }
                />
                NAT Gateway
              </label>
            </div>
            <input
              id="gateway-usage"
              type="text"
              placeholder="Usage explanation"
              value={userSummary.cloudGateways?.usage || ''}
              onChange={(e) =>
                setUserSummary({
                  ...userSummary,
                  cloudGateways: { ...userSummary.cloudGateways!, usage: e.target.value },
                })
              }
            />
          </div>

          <div className="form-group">
            <label htmlFor="scalability-type">Scalability Features</label>
            <select
              id="scalability-type"
              value={userSummary.scalabilityFeatures?.type || 'Auto'}
              onChange={(e) =>
                setUserSummary({
                  ...userSummary,
                  scalabilityFeatures: {
                    ...userSummary.scalabilityFeatures!,
                    type: e.target.value as ScalabilityType,
                  },
                })
              }
            >
              <option value="Auto">Auto Scaling</option>
              <option value="Vertical">Vertical Scaling</option>
              <option value="Horizontal">Horizontal Scaling</option>
            </select>
            <input
              type="text"
              placeholder="Description (concise)"
              value={userSummary.scalabilityFeatures?.description || ''}
              onChange={(e) =>
                setUserSummary({
                  ...userSummary,
                  scalabilityFeatures: {
                    ...userSummary.scalabilityFeatures!,
                    description: e.target.value,
                  },
                })
              }
            />
          </div>

          <div className="form-group">
            <label htmlFor="elasticity-implementation">Elasticity Implementation</label>
            <input
              id="elasticity-implementation"
              type="text"
              placeholder="How resources automatically adjust"
              value={userSummary.elasticityImplementation || ''}
              onChange={(e) =>
                setUserSummary({ ...userSummary, elasticityImplementation: e.target.value })
              }
            />
          </div>

          <div className="form-group">
            <label htmlFor="multitenancy-considerations">Multitenancy Considerations</label>
            <input
              id="multitenancy-considerations"
              type="text"
              placeholder="Isolation and security (comma separated)"
              value={userSummary.multitenancyConsiderations?.join(', ') || ''}
              onChange={(e) =>
                setUserSummary({
                  ...userSummary,
                  multitenancyConsiderations: e.target.value
                    .split(',')
                    .map((s) => s.trim())
                    .filter((s) => s),
                })
              }
            />
          </div>
        </div>

        <div className="action-buttons">
          <button className="btn-primary" onClick={onSubmit}>
            Submit & Score
          </button>
          <button className="btn-secondary" onClick={onReset}>
            Reset
          </button>
          <button className="btn-secondary" onClick={onToggleIdealSolution}>
            {showIdealSolution ? 'Hide' : 'Show'} Ideal Solution
          </button>
        </div>

        {score && (
          <div className="score-panel">
            <h3>Your Score: {score.total}%</h3>
            <div className="score-breakdown">
              <div className="score-item">
                <span>Models & Concepts (40%):</span>
                <span className="score-value">{score.modelsAndConcepts}%</span>
              </div>
              <div className="score-item">
                <span>Conciseness (20%):</span>
                <span className="score-value">{score.conciseness}%</span>
              </div>
              <div className="score-item">
                <span>Coverage (40%):</span>
                <span className="score-value">{score.coverage}%</span>
              </div>
            </div>
            <div className="feedback">
              <h4>Feedback:</h4>
              <ul>
                {score.feedback.map((item, idx) => (
                  <li key={idx}>{item}</li>
                ))}
              </ul>
            </div>
          </div>
        )}

        {showIdealSolution && (
          <div className="ideal-solution">
            <h3>Ideal Solution</h3>
            <div className="solution-content">
              <p>
                <strong>Deployment:</strong> {selectedScenario.idealSolution.deploymentModel} -{' '}
                {selectedScenario.idealSolution.deploymentJustification}
              </p>
              <p>
                <strong>Service Model:</strong> {selectedScenario.idealSolution.serviceModel}
              </p>
              <p>
                <strong>Examples:</strong> {selectedScenario.idealSolution.serviceExamples.join('; ')}
              </p>
              <p>
                <strong>Connectivity:</strong> {selectedScenario.idealSolution.connectivityMethod} -{' '}
                {selectedScenario.idealSolution.connectivityReasoning}
              </p>
              <p>
                <strong>NFV:</strong> {selectedScenario.idealSolution.nfvImplementation}
              </p>
              <p>
                <strong>Gateways:</strong> {selectedScenario.idealSolution.cloudGateways.usage}
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
