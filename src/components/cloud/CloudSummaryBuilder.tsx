/**
 * Component 7: Cloud Concept Summary Card Builder
 * CompTIA Network+ Learning Objective 1.2
 *
 * Interactive workspace for reading cloud scenarios and creating structured summaries
 */

import React, { useState, useEffect } from 'react';
import { cloudScenarios } from './cloud-data';
import type {
  CloudScenario,
  CloudSummary,
  ScoreBreakdown,
  DeploymentModel,
  ServiceModel,
  ConnectivityMethod,
  ScalabilityType
} from './cloud-types';

export const CloudSummaryBuilder: React.FC = () => {
  const [selectedScenario, setSelectedScenario] = useState<CloudScenario>(cloudScenarios[0]);
  const [userSummary, setUserSummary] = useState<Partial<CloudSummary>>({
    vpcConfiguration: { subnets: [], securityGroups: [], networkLists: [] },
    cloudGateways: { internetGateway: false, natGateway: false, usage: '' },
    scalabilityFeatures: { type: 'Auto', description: '', triggers: [] },
    serviceExamples: [],
    multitenancyConsiderations: []
  });
  const [score, setScore] = useState<ScoreBreakdown | null>(null);
  const [wordCount, setWordCount] = useState(0);
  const [showIdealSolution, setShowIdealSolution] = useState(false);

  // Calculate word count for all text fields
  useEffect(() => {
    const texts = [
      userSummary.deploymentJustification || '',
      userSummary.connectivityReasoning || '',
      userSummary.nfvImplementation || '',
      userSummary.cloudGateways?.usage || '',
      userSummary.scalabilityFeatures?.description || '',
      userSummary.elasticityImplementation || ''
    ];

    const totalWords = texts.reduce((count, text) => {
      return count + text.trim().split(/\s+/).filter(word => word.length > 0).length;
    }, 0);

    setWordCount(totalWords);
  }, [userSummary]);

  const calculateScore = (): ScoreBreakdown => {
    const feedback: string[] = [];
    let modelsScore = 0;
    let concisenessScore = 0;
    let coverageScore = 0;

    const ideal = selectedScenario.idealSolution;

    // Models and Concepts (40%)
    let modelsPoints = 0;
    const maxModelsPoints = 5;

    if (userSummary.deploymentModel === ideal.deploymentModel) {
      modelsPoints++;
    } else {
      feedback.push(`Deployment model should be ${ideal.deploymentModel}`);
    }

    if (userSummary.serviceModel === ideal.serviceModel) {
      modelsPoints++;
    } else {
      feedback.push(`Service model should be ${ideal.serviceModel}`);
    }

    if (userSummary.connectivityMethod === ideal.connectivityMethod) {
      modelsPoints++;
    } else {
      feedback.push(`Connectivity method should be ${ideal.connectivityMethod}`);
    }

    if (userSummary.cloudGateways?.internetGateway === ideal.cloudGateways.internetGateway) {
      modelsPoints++;
    }

    if (userSummary.scalabilityFeatures?.type === ideal.scalabilityFeatures.type) {
      modelsPoints++;
    }

    modelsScore = (modelsPoints / maxModelsPoints) * 40;

    // Conciseness (20%) - target 100 words, penalty for going over
    if (wordCount <= 100) {
      concisenessScore = 20;
    } else if (wordCount <= 150) {
      concisenessScore = 15;
      feedback.push(`Word count is ${wordCount}. Aim for under 100 words for conciseness.`);
    } else if (wordCount <= 200) {
      concisenessScore = 10;
      feedback.push(`Word count is ${wordCount}. Too verbose - significantly reduce to under 100 words.`);
    } else {
      concisenessScore = 5;
      feedback.push(`Word count is ${wordCount}. Far too long - must be under 100 words.`);
    }

    // Coverage (40%) - check if all required elements are present
    let coveragePoints = 0;
    const maxCoveragePoints = 8;

    if (userSummary.deploymentJustification && userSummary.deploymentJustification.length > 10) {
      coveragePoints++;
    } else {
      feedback.push('Provide deployment model justification');
    }

    if (userSummary.serviceExamples && userSummary.serviceExamples.length > 0) {
      coveragePoints++;
    } else {
      feedback.push('Include specific service examples');
    }

    if (userSummary.connectivityReasoning && userSummary.connectivityReasoning.length > 10) {
      coveragePoints++;
    } else {
      feedback.push('Explain connectivity method reasoning');
    }

    if (userSummary.nfvImplementation && userSummary.nfvImplementation.length > 10) {
      coveragePoints++;
    } else {
      feedback.push('Describe NFV implementation');
    }

    if (userSummary.vpcConfiguration?.subnets && userSummary.vpcConfiguration.subnets.length > 0) {
      coveragePoints++;
    } else {
      feedback.push('Define VPC subnet configuration');
    }

    if (userSummary.cloudGateways?.usage && userSummary.cloudGateways.usage.length > 10) {
      coveragePoints++;
    } else {
      feedback.push('Explain cloud gateway usage');
    }

    if (userSummary.scalabilityFeatures?.description && userSummary.scalabilityFeatures.description.length > 10) {
      coveragePoints++;
    } else {
      feedback.push('Describe scalability features');
    }

    if (userSummary.multitenancyConsiderations && userSummary.multitenancyConsiderations.length > 0) {
      coveragePoints++;
    } else {
      feedback.push('Address multitenancy considerations');
    }

    coverageScore = (coveragePoints / maxCoveragePoints) * 40;

    const total = Math.round(modelsScore + concisenessScore + coverageScore);

    if (total >= 90) {feedback.unshift('Excellent summary!');}
    else if (total >= 80) {feedback.unshift('Good summary with minor improvements needed');}
    else if (total >= 70) {feedback.unshift('Adequate summary, several areas need improvement');}
    else {feedback.unshift('Summary needs significant improvement');}

    return {
      modelsAndConcepts: Math.round(modelsScore),
      conciseness: Math.round(concisenessScore),
      coverage: Math.round(coverageScore),
      total,
      feedback
    };
  };

  const handleSubmit = () => {
    const calculatedScore = calculateScore();
    setScore(calculatedScore);
  };

  const handleReset = () => {
    setUserSummary({
      vpcConfiguration: { subnets: [], securityGroups: [], networkLists: [] },
      cloudGateways: { internetGateway: false, natGateway: false, usage: '' },
      scalabilityFeatures: { type: 'Auto', description: '', triggers: [] },
      serviceExamples: [],
      multitenancyConsiderations: []
    });
    setScore(null);
    setShowIdealSolution(false);
  };

  const handleScenarioChange = (scenarioId: string) => {
    const scenario = cloudScenarios.find(s => s.id === scenarioId);
    if (scenario) {
      setSelectedScenario(scenario);
      handleReset();
    }
  };

  return (
    <div className="cloud-summary-builder">
      <div className="header">
        <h2>Cloud Concept Summary Card Builder</h2>
        <p>Read the scenario and create a concise summary covering all key cloud concepts</p>
      </div>

      <div className="scenario-selector">
        <label htmlFor="scenario-select">Select Scenario:</label>
        <select
          id="scenario-select"
          value={selectedScenario.id}
          onChange={(e) => handleScenarioChange(e.target.value)}
        >
          {cloudScenarios.map(scenario => (
            <option key={scenario.id} value={scenario.id}>
              {scenario.title} ({scenario.provider})
            </option>
          ))}
        </select>
      </div>

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
            <span className={`count ${wordCount > 100 ? 'warning' : wordCount > 150 ? 'error' : 'good'}`}>
              {wordCount} words
            </span>
            <span className="target">Target: ≤100 words</span>
          </div>

          <div className="summary-form">
            <div className="form-group">
              <label>Deployment Model *</label>
              <select
                value={userSummary.deploymentModel || ''}
                onChange={(e) => setUserSummary({...userSummary, deploymentModel: e.target.value as DeploymentModel})}
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
                onChange={(e) => setUserSummary({...userSummary, deploymentJustification: e.target.value})}
              />
            </div>

            <div className="form-group">
              <label>Service Model *</label>
              <select
                value={userSummary.serviceModel || ''}
                onChange={(e) => setUserSummary({...userSummary, serviceModel: e.target.value as ServiceModel})}
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
                onChange={(e) => setUserSummary({
                  ...userSummary,
                  serviceExamples: e.target.value.split(',').map(s => s.trim()).filter(s => s)
                })}
              />
            </div>

            <div className="form-group">
              <label>Connectivity Method *</label>
              <select
                value={userSummary.connectivityMethod || ''}
                onChange={(e) => setUserSummary({...userSummary, connectivityMethod: e.target.value as ConnectivityMethod})}
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
                onChange={(e) => setUserSummary({...userSummary, connectivityReasoning: e.target.value})}
              />
            </div>

            <div className="form-group">
              <label>NFV Implementation</label>
              <input
                type="text"
                placeholder="How network functions are virtualized"
                value={userSummary.nfvImplementation || ''}
                onChange={(e) => setUserSummary({...userSummary, nfvImplementation: e.target.value})}
              />
            </div>

            <div className="form-group">
              <label>VPC Configuration</label>
              <input
                type="text"
                placeholder="Subnets (comma separated)"
                value={userSummary.vpcConfiguration?.subnets.join(', ') || ''}
                onChange={(e) => setUserSummary({
                  ...userSummary,
                  vpcConfiguration: {
                    ...userSummary.vpcConfiguration!,
                    subnets: e.target.value.split(',').map(s => s.trim()).filter(s => s)
                  }
                })}
              />
              <input
                type="text"
                placeholder="Security groups (comma separated)"
                value={userSummary.vpcConfiguration?.securityGroups.join(', ') || ''}
                onChange={(e) => setUserSummary({
                  ...userSummary,
                  vpcConfiguration: {
                    ...userSummary.vpcConfiguration!,
                    securityGroups: e.target.value.split(',').map(s => s.trim()).filter(s => s)
                  }
                })}
              />
            </div>

            <div className="form-group">
              <label>Cloud Gateways</label>
              <div className="checkbox-group">
                <label>
                  <input
                    type="checkbox"
                    checked={userSummary.cloudGateways?.internetGateway || false}
                    onChange={(e) => setUserSummary({
                      ...userSummary,
                      cloudGateways: { ...userSummary.cloudGateways!, internetGateway: e.target.checked }
                    })}
                  />
                  Internet Gateway
                </label>
                <label>
                  <input
                    type="checkbox"
                    checked={userSummary.cloudGateways?.natGateway || false}
                    onChange={(e) => setUserSummary({
                      ...userSummary,
                      cloudGateways: { ...userSummary.cloudGateways!, natGateway: e.target.checked }
                    })}
                  />
                  NAT Gateway
                </label>
              </div>
              <input
                type="text"
                placeholder="Usage explanation"
                value={userSummary.cloudGateways?.usage || ''}
                onChange={(e) => setUserSummary({
                  ...userSummary,
                  cloudGateways: { ...userSummary.cloudGateways!, usage: e.target.value }
                })}
              />
            </div>

            <div className="form-group">
              <label>Scalability Features</label>
              <select
                value={userSummary.scalabilityFeatures?.type || 'Auto'}
                onChange={(e) => setUserSummary({
                  ...userSummary,
                  scalabilityFeatures: { ...userSummary.scalabilityFeatures!, type: e.target.value as ScalabilityType }
                })}
              >
                <option value="Auto">Auto Scaling</option>
                <option value="Vertical">Vertical Scaling</option>
                <option value="Horizontal">Horizontal Scaling</option>
              </select>
              <input
                type="text"
                placeholder="Description (concise)"
                value={userSummary.scalabilityFeatures?.description || ''}
                onChange={(e) => setUserSummary({
                  ...userSummary,
                  scalabilityFeatures: { ...userSummary.scalabilityFeatures!, description: e.target.value }
                })}
              />
            </div>

            <div className="form-group">
              <label>Elasticity Implementation</label>
              <input
                type="text"
                placeholder="How resources automatically adjust"
                value={userSummary.elasticityImplementation || ''}
                onChange={(e) => setUserSummary({...userSummary, elasticityImplementation: e.target.value})}
              />
            </div>

            <div className="form-group">
              <label>Multitenancy Considerations</label>
              <input
                type="text"
                placeholder="Isolation and security (comma separated)"
                value={userSummary.multitenancyConsiderations?.join(', ') || ''}
                onChange={(e) => setUserSummary({
                  ...userSummary,
                  multitenancyConsiderations: e.target.value.split(',').map(s => s.trim()).filter(s => s)
                })}
              />
            </div>
          </div>

          <div className="action-buttons">
            <button className="btn-primary" onClick={handleSubmit}>
              Submit & Score
            </button>
            <button className="btn-secondary" onClick={handleReset}>
              Reset
            </button>
            <button className="btn-secondary" onClick={() => setShowIdealSolution(!showIdealSolution)}>
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
                <p><strong>Deployment:</strong> {selectedScenario.idealSolution.deploymentModel} - {selectedScenario.idealSolution.deploymentJustification}</p>
                <p><strong>Service Model:</strong> {selectedScenario.idealSolution.serviceModel}</p>
                <p><strong>Examples:</strong> {selectedScenario.idealSolution.serviceExamples.join('; ')}</p>
                <p><strong>Connectivity:</strong> {selectedScenario.idealSolution.connectivityMethod} - {selectedScenario.idealSolution.connectivityReasoning}</p>
                <p><strong>NFV:</strong> {selectedScenario.idealSolution.nfvImplementation}</p>
                <p><strong>Gateways:</strong> {selectedScenario.idealSolution.cloudGateways.usage}</p>
              </div>
            </div>
          )}
        </div>
      </div>

      <style>{`
        .cloud-summary-builder {
          padding: 20px;
          max-width: 1400px;
          margin: 0 auto;
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
        }

        .header {
          text-align: center;
          margin-bottom: 30px;
        }

        .header h2 {
          color: #1f2937;
          margin-bottom: 10px;
        }

        .header p {
          color: #6b7280;
        }

        .scenario-selector {
          margin-bottom: 20px;
          display: flex;
          align-items: center;
          gap: 10px;
        }

        .scenario-selector select {
          flex: 1;
          padding: 10px;
          border: 1px solid #d1d5db;
          border-radius: 6px;
          font-size: 14px;
        }

        .content-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 20px;
        }

        .scenario-panel, .summary-panel {
          background: white;
          border: 1px solid #e5e7eb;
          border-radius: 8px;
          padding: 20px;
          max-height: 800px;
          overflow-y: auto;
        }

        .scenario-panel h3 {
          color: #1f2937;
          margin-bottom: 10px;
        }

        .scenario-metadata {
          margin-bottom: 15px;
        }

        .badge {
          display: inline-block;
          padding: 4px 12px;
          background: #3b82f6;
          color: white;
          border-radius: 12px;
          font-size: 12px;
          font-weight: 600;
        }

        .scenario-description p {
          margin-bottom: 15px;
          line-height: 1.6;
          color: #374151;
        }

        .scenario-requirements {
          margin-top: 20px;
          padding: 15px;
          background: #f9fafb;
          border-radius: 6px;
        }

        .scenario-requirements h4 {
          margin-bottom: 10px;
          color: #1f2937;
        }

        .scenario-requirements ul {
          list-style: none;
          padding: 0;
        }

        .scenario-requirements li {
          padding: 6px 0;
          color: #4b5563;
          position: relative;
          padding-left: 20px;
        }

        .scenario-requirements li:before {
          content: "✓";
          position: absolute;
          left: 0;
          color: #10b981;
          font-weight: bold;
        }

        .word-counter {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 12px;
          background: #f3f4f6;
          border-radius: 6px;
          margin-bottom: 20px;
        }

        .count {
          font-size: 18px;
          font-weight: 600;
        }

        .count.good { color: #10b981; }
        .count.warning { color: #f59e0b; }
        .count.error { color: #ef4444; }

        .target {
          font-size: 14px;
          color: #6b7280;
        }

        .summary-form {
          display: flex;
          flex-direction: column;
          gap: 15px;
        }

        .form-group label {
          display: block;
          font-weight: 600;
          color: #374151;
          margin-bottom: 6px;
          font-size: 14px;
        }

        .form-group input,
        .form-group select {
          width: 100%;
          padding: 8px 12px;
          border: 1px solid #d1d5db;
          border-radius: 6px;
          font-size: 14px;
          margin-bottom: 8px;
        }

        .form-group input:focus,
        .form-group select:focus {
          outline: none;
          border-color: #3b82f6;
          box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
        }

        .checkbox-group {
          display: flex;
          gap: 20px;
          margin-bottom: 8px;
        }

        .checkbox-group label {
          display: flex;
          align-items: center;
          gap: 6px;
          font-weight: normal;
          margin-bottom: 0;
        }

        .action-buttons {
          display: flex;
          gap: 10px;
          margin-top: 20px;
        }

        .btn-primary, .btn-secondary {
          flex: 1;
          padding: 12px;
          border: none;
          border-radius: 6px;
          font-weight: 600;
          cursor: pointer;
          font-size: 14px;
          transition: all 0.2s;
        }

        .btn-primary {
          background: #3b82f6;
          color: white;
        }

        .btn-primary:hover {
          background: #2563eb;
        }

        .btn-secondary {
          background: #e5e7eb;
          color: #374151;
        }

        .btn-secondary:hover {
          background: #d1d5db;
        }

        .score-panel {
          margin-top: 20px;
          padding: 20px;
          background: #f0f9ff;
          border: 2px solid #3b82f6;
          border-radius: 8px;
        }

        .score-panel h3 {
          color: #1e40af;
          margin-bottom: 15px;
          text-align: center;
        }

        .score-breakdown {
          display: flex;
          flex-direction: column;
          gap: 10px;
          margin-bottom: 15px;
        }

        .score-item {
          display: flex;
          justify-content: space-between;
          padding: 8px;
          background: white;
          border-radius: 4px;
        }

        .score-value {
          font-weight: 600;
          color: #3b82f6;
        }

        .feedback h4 {
          margin-bottom: 10px;
          color: #1f2937;
        }

        .feedback ul {
          list-style: none;
          padding: 0;
        }

        .feedback li {
          padding: 6px 0;
          color: #4b5563;
          position: relative;
          padding-left: 20px;
        }

        .feedback li:first-child {
          font-weight: 600;
          color: #1f2937;
        }

        .feedback li:first-child:before {
          content: "→";
          position: absolute;
          left: 0;
        }

        .feedback li:not(:first-child):before {
          content: "•";
          position: absolute;
          left: 0;
        }

        .ideal-solution {
          margin-top: 20px;
          padding: 20px;
          background: #f0fdf4;
          border: 2px solid #10b981;
          border-radius: 8px;
        }

        .ideal-solution h3 {
          color: #065f46;
          margin-bottom: 15px;
        }

        .solution-content p {
          margin-bottom: 10px;
          line-height: 1.6;
          color: #374151;
        }

        .solution-content strong {
          color: #065f46;
        }
      `}</style>
    </div>
  );
};

export default CloudSummaryBuilder;
