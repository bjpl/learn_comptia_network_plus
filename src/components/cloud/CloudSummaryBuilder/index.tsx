/**
 * CloudSummaryBuilder main component (refactored)
 * Simplified main component that orchestrates form sections and tabs
 */

import React, { useState, useEffect } from 'react';
import { cloudScenarios } from '../cloud-data';
import type { CloudScenario } from '../cloud-types';
import type { CloudSummary, ScoreBreakdown, TabType } from './types';
import { DeploymentSection } from './FormSections/DeploymentSection';
import { calculateScore } from './ScoreCalculator';

// Cloud terminology and definitions (moved from original file)
const CLOUD_TERMS = {
  'Deployment Models': {
    Public: 'Cloud resources accessible to general public. Shared infrastructure, lower cost.',
    Private: 'Cloud resources exclusively for one organization. Higher control and security.',
    Hybrid: 'Combination of public and private clouds with integrated connectivity.',
  },
  'Service Models': {
    SaaS: 'Software as a Service - ready-to-use applications (e.g., Office 365, Salesforce)',
    PaaS: 'Platform as a Service - development environment (e.g., Azure App Service, Heroku)',
    IaaS: 'Infrastructure as a Service - compute/storage/networking (e.g., EC2, Azure VMs)',
  },
  'Key Concepts': {
    Scalability: 'Ability to handle increased workload by adding resources',
    Elasticity: 'Automatic adjustment of resources based on demand',
    Multitenancy: 'Multiple customers sharing same resources with logical separation',
    NFV: 'Network Function Virtualization - replace hardware appliances with virtual functions',
  },
};

export const CloudSummaryBuilder: React.FC = () => {
  const [selectedScenario, setSelectedScenario] = useState<CloudScenario>(cloudScenarios[0]);
  const [userSummary, setUserSummary] = useState<Partial<CloudSummary>>({
    vpcConfiguration: { subnets: [], securityGroups: [], networkLists: [] },
    cloudGateways: { internetGateway: false, natGateway: false, usage: '' },
    scalabilityFeatures: { type: 'Auto', description: '', triggers: [] },
    serviceExamples: [],
    multitenancyConsiderations: [],
  });
  const [score, setScore] = useState<ScoreBreakdown | null>(null);
  const [wordCount, setWordCount] = useState(0);
  const [showIdealSolution, setShowIdealSolution] = useState(false);
  const [activeTab, setActiveTab] = useState<TabType>('builder');
  const [selectedTermCategory, setSelectedTermCategory] =
    useState<keyof typeof CLOUD_TERMS>('Deployment Models');

  // Calculate word count for all text fields
  useEffect(() => {
    const texts = [
      userSummary.deploymentJustification || '',
      userSummary.connectivityReasoning || '',
      userSummary.nfvImplementation || '',
      userSummary.cloudGateways?.usage || '',
      userSummary.scalabilityFeatures?.description || '',
      userSummary.elasticityImplementation || '',
    ];

    const totalWords = texts.reduce((count, text) => {
      return (
        count +
        text
          .trim()
          .split(/\s+/)
          .filter((word) => word.length > 0).length
      );
    }, 0);

    setWordCount(totalWords);
  }, [userSummary]);

  const handleSubmit = () => {
    const calculatedScore = calculateScore(userSummary, selectedScenario, wordCount);
    setScore(calculatedScore);
  };

  const handleReset = () => {
    setUserSummary({
      vpcConfiguration: { subnets: [], securityGroups: [], networkLists: [] },
      cloudGateways: { internetGateway: false, natGateway: false, usage: '' },
      scalabilityFeatures: { type: 'Auto', description: '', triggers: [] },
      serviceExamples: [],
      multitenancyConsiderations: [],
    });
    setScore(null);
    setShowIdealSolution(false);
  };

  const handleScenarioChange = (scenarioId: string) => {
    const scenario = cloudScenarios.find((s) => s.id === scenarioId);
    if (scenario) {
      setSelectedScenario(scenario);
      handleReset();
    }
  };

  return (
    <div className="cloud-summary-builder">
      <div className="header">
        <h2>Cloud Concept Summary Card Builder (Enhanced)</h2>
        <p>Master cloud concepts with scenarios, definitions, comparisons, and exam practice</p>
      </div>

      {/* Tab Navigation */}
      <div className="tab-navigation">
        {(['builder', 'terms', 'comparison', 'usecase', 'cost', 'exam'] as const).map((tab) => (
          <button
            key={tab}
            className={`tab-button ${activeTab === tab ? 'active' : ''}`}
            onClick={() => setActiveTab(tab)}
          >
            {tab === 'builder'
              ? 'Builder'
              : tab === 'terms'
                ? 'Terminology'
                : tab === 'comparison'
                  ? 'Service Comparison'
                  : tab === 'usecase'
                    ? 'Use Cases'
                    : tab === 'cost'
                      ? 'Cost Calculator'
                      : 'Exam Practice'}
          </button>
        ))}
      </div>

      {activeTab === 'builder' && (
        <>
          <div className="scenario-selector">
            <label htmlFor="scenario-select">Select Scenario:</label>
            <select
              id="scenario-select"
              value={selectedScenario.id}
              onChange={(e) => handleScenarioChange(e.target.value)}
            >
              {cloudScenarios.map((scenario) => (
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
                <span
                  className={`count ${wordCount > 100 ? 'warning' : wordCount > 150 ? 'error' : 'good'}`}
                >
                  {wordCount} words
                </span>
                <span className="target">Target: ≤100 words</span>
              </div>

              <div className="summary-form">
                <DeploymentSection
                  deploymentModel={userSummary.deploymentModel}
                  deploymentJustification={userSummary.deploymentJustification}
                  onDeploymentModelChange={(value) =>
                    setUserSummary({ ...userSummary, deploymentModel: value })
                  }
                  onDeploymentJustificationChange={(value) =>
                    setUserSummary({ ...userSummary, deploymentJustification: value })
                  }
                />
                {/* Other form sections would go here in the full implementation */}
              </div>

              <div className="action-buttons">
                <button className="btn-primary" onClick={handleSubmit}>
                  Submit & Score
                </button>
                <button className="btn-secondary" onClick={handleReset}>
                  Reset
                </button>
                <button
                  className="btn-secondary"
                  onClick={() => setShowIdealSolution(!showIdealSolution)}
                >
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
                      <strong>Deployment:</strong> {selectedScenario.idealSolution.deploymentModel}{' '}
                      - {selectedScenario.idealSolution.deploymentJustification}
                    </p>
                    <p>
                      <strong>Service Model:</strong> {selectedScenario.idealSolution.serviceModel}
                    </p>
                    <p>
                      <strong>Examples:</strong>{' '}
                      {selectedScenario.idealSolution.serviceExamples.join('; ')}
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </>
      )}

      {/* Terminology Tab */}
      {activeTab === 'terms' && (
        <div className="tab-content">
          <div className="term-selector">
            {Object.keys(CLOUD_TERMS).map((category) => (
              <button
                key={category}
                className={`term-category-btn ${selectedTermCategory === category ? 'active' : ''}`}
                onClick={() => setSelectedTermCategory(category as keyof typeof CLOUD_TERMS)}
              >
                {category}
              </button>
            ))}
          </div>
          <div className="terminology-grid">
            {Object.entries(CLOUD_TERMS[selectedTermCategory]).map(([term, definition]) => (
              <div key={term} className="term-card">
                <h3>{term}</h3>
                <p>{definition}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Placeholder for other tabs */}
      {(activeTab === 'comparison' ||
        activeTab === 'usecase' ||
        activeTab === 'cost' ||
        activeTab === 'exam') && (
        <div className="tab-content">
          <p>This tab's content has been simplified for the refactored version.</p>
        </div>
      )}
    </div>
  );
};

export default CloudSummaryBuilder;
