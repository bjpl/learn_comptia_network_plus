/**
 * Component 12: Cloud Concept Summary Card Builder (Enhanced)
 * CompTIA Network+ Learning Objective 1.2
 *
 * Enhanced interactive workspace with:
 * - Key cloud terms and definitions
 * - Service comparison tool
 * - Use case matcher (deployment/service selection)
 * - Cost calculator basics
 * - Exam question practice
 *
 * Keeps under 700 lines with exam-focused content
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
  ScalabilityType,
} from './cloud-types';

// Cloud terminology and definitions
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

// Service model comparison matrix
const SERVICE_COMPARISON = [
  {
    aspect: 'What you manage',
    SaaS: 'Nothing - fully managed',
    PaaS: 'Code and data',
    IaaS: 'OS, middleware, runtime, data',
  },
  {
    aspect: 'Deployment flexibility',
    SaaS: 'None - pre-configured',
    PaaS: 'High within platform constraints',
    IaaS: 'Maximum flexibility',
  },
  {
    aspect: 'Cost model',
    SaaS: 'Per-user subscription',
    PaaS: 'Pay-per-use + reserved instances',
    IaaS: 'Pay-per-resource hourly/monthly',
  },
  {
    aspect: 'Best for',
    SaaS: 'Business applications, email',
    PaaS: 'Web apps, APIs, microservices',
    IaaS: 'Large infrastructure, customization',
  },
];

// Use case matcher
const USE_CASE_MATCHES = [
  {
    scenario: 'Company needs enterprise email and collaboration',
    deployment: 'Public',
    service: 'SaaS',
    examples: 'Microsoft 365, Google Workspace',
  },
  {
    scenario: 'Building containerized microservices API',
    deployment: 'Public',
    service: 'PaaS',
    examples: 'Azure App Service, Cloud Run',
  },
  {
    scenario: 'Legacy app requiring Windows Server OS',
    deployment: 'Any',
    service: 'IaaS',
    examples: 'EC2, Azure VMs',
  },
  {
    scenario: 'Healthcare system with data residency requirements',
    deployment: 'Private/Hybrid',
    service: 'Any',
    examples: 'On-premises + VPN to public cloud',
  },
  {
    scenario: 'Startup needing rapid scaling (0-1M users)',
    deployment: 'Public',
    service: 'PaaS',
    examples: 'Elastic load balancing + auto-scaling',
  },
  {
    scenario: 'Multi-tenant SaaS application',
    deployment: 'Public',
    service: 'PaaS + IaaS',
    examples: 'Microservices with managed DB',
  },
];

// Cost calculator data (simplified)
const COST_CALCULATOR_INPUTS = {
  'Small website': { compute: 50, storage: 5, bandwidth: 10, monthly: '65' },
  'Medium app': { compute: 300, storage: 100, bandwidth: 50, monthly: '450' },
  'Enterprise system': { compute: 2000, storage: 1000, bandwidth: 500, monthly: '3500' },
};

// Exam practice questions
const EXAM_QUESTIONS = [
  {
    id: 'q1',
    question:
      'A company needs to deploy applications but does not want to manage servers. Which service model is best?',
    options: ['SaaS', 'PaaS', 'IaaS', 'FaaS'],
    correct: 'PaaS',
    explanation:
      'PaaS provides a platform without server management - you deploy code and the platform handles infrastructure.',
  },
  {
    id: 'q2',
    question: 'What is the primary advantage of hybrid cloud for regulated industries?',
    options: [
      'Unlimited scalability',
      'Meeting data residency requirements',
      'Cost reduction',
      'Simplified management',
    ],
    correct: 'Meeting data residency requirements',
    explanation:
      'Hybrid clouds allow sensitive data to remain on-premises (meeting regulations) while using public cloud for other workloads.',
  },
  {
    id: 'q3',
    question: 'Which cloud concept allows automatic resource adjustment based on demand?',
    options: ['Scalability', 'Elasticity', 'Multitenancy', 'Virtualization'],
    correct: 'Elasticity',
    explanation:
      'Elasticity is automatic scaling based on real-time demand, while scalability is the capacity to handle increased load.',
  },
  {
    id: 'q4',
    question: 'In a multi-tenant cloud environment, how is customer data isolated?',
    options: [
      'Separate physical servers',
      'Separate cloud regions',
      'Logical separation through VPCs and security groups',
      'Only encryption',
    ],
    correct: 'Logical separation through VPCs and security groups',
    explanation:
      'Multi-tenant clouds use logical isolation (VPCs, network policies) to separate customer data in shared infrastructure.',
  },
];

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

  // Enhanced feature states
  const [activeTab, setActiveTab] = useState<
    'builder' | 'terms' | 'comparison' | 'usecase' | 'cost' | 'exam'
  >('builder');
  const [selectedTermCategory, setSelectedTermCategory] =
    useState<keyof typeof CLOUD_TERMS>('Deployment Models');
  const [selectedQuestion, setSelectedQuestion] = useState<string | null>(null);
  const [userAnswers, setUserAnswers] = useState<Record<string, string>>({});
  const [costProfile, setCostProfile] = useState<
    'Small website' | 'Medium app' | 'Enterprise system'
  >('Medium app');

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
      feedback.push(
        `Word count is ${wordCount}. Too verbose - significantly reduce to under 100 words.`
      );
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

    if (
      userSummary.scalabilityFeatures?.description &&
      userSummary.scalabilityFeatures.description.length > 10
    ) {
      coveragePoints++;
    } else {
      feedback.push('Describe scalability features');
    }

    if (
      userSummary.multitenancyConsiderations &&
      userSummary.multitenancyConsiderations.length > 0
    ) {
      coveragePoints++;
    } else {
      feedback.push('Address multitenancy considerations');
    }

    coverageScore = (coveragePoints / maxCoveragePoints) * 40;

    const total = Math.round(modelsScore + concisenessScore + coverageScore);

    if (total >= 90) {
      feedback.unshift('Excellent summary!');
    } else if (total >= 80) {
      feedback.unshift('Good summary with minor improvements needed');
    } else if (total >= 70) {
      feedback.unshift('Adequate summary, several areas need improvement');
    } else {
      feedback.unshift('Summary needs significant improvement');
    }

    return {
      modelsAndConcepts: Math.round(modelsScore),
      conciseness: Math.round(concisenessScore),
      coverage: Math.round(coverageScore),
      total,
      feedback,
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

  const handleQuestionAnswer = (questionId: string, answer: string) => {
    setUserAnswers({ ...userAnswers, [questionId]: answer });
  };

  const getQuestionScore = (questionId: string): boolean | null => {
    const answer = userAnswers[questionId];
    if (!answer) {
      return null;
    }
    const question = EXAM_QUESTIONS.find((q) => q.id === questionId);
    return question ? answer === question.correct : null;
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
                    <p>
                      <strong>Connectivity:</strong>{' '}
                      {selectedScenario.idealSolution.connectivityMethod} -{' '}
                      {selectedScenario.idealSolution.connectivityReasoning}
                    </p>
                    <p>
                      <strong>NFV:</strong> {selectedScenario.idealSolution.nfvImplementation}
                    </p>
                    <p>
                      <strong>Gateways:</strong>{' '}
                      {selectedScenario.idealSolution.cloudGateways.usage}
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

      {/* Service Comparison Tab */}
      {activeTab === 'comparison' && (
        <div className="tab-content">
          <div className="comparison-table">
            <table>
              <thead>
                <tr>
                  <th>Aspect</th>
                  <th>SaaS</th>
                  <th>PaaS</th>
                  <th>IaaS</th>
                </tr>
              </thead>
              <tbody>
                {SERVICE_COMPARISON.map((row, idx) => (
                  <tr key={idx}>
                    <td className="aspect-cell">
                      <strong>{row.aspect}</strong>
                    </td>
                    <td>{row.SaaS}</td>
                    <td>{row.PaaS}</td>
                    <td>{row.IaaS}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="comparison-note">
            <p>Use this matrix to quickly identify which service model best fits your use case.</p>
          </div>
        </div>
      )}

      {/* Use Case Matcher Tab */}
      {activeTab === 'usecase' && (
        <div className="tab-content">
          <div className="usecase-grid">
            {USE_CASE_MATCHES.map((usecase, idx) => (
              <div key={idx} className="usecase-card">
                <h4>Scenario:</h4>
                <p className="scenario-text">{usecase.scenario}</p>
                <div className="usecase-info">
                  <div className="usecase-item">
                    <span className="label">Deployment:</span>
                    <span className="value">{usecase.deployment}</span>
                  </div>
                  <div className="usecase-item">
                    <span className="label">Service:</span>
                    <span className="value">{usecase.service}</span>
                  </div>
                  <div className="usecase-item">
                    <span className="label">Examples:</span>
                    <span className="value">{usecase.examples}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Cost Calculator Tab */}
      {activeTab === 'cost' && (
        <div className="tab-content">
          <div className="cost-calculator">
            <h3>Cloud Cost Estimation</h3>
            <div className="cost-profile-selector">
              <label>Select a profile:</label>
              {Object.keys(COST_CALCULATOR_INPUTS).map((profile) => (
                <button
                  key={profile}
                  className={`profile-btn ${costProfile === profile ? 'active' : ''}`}
                  onClick={() => setCostProfile(profile as keyof typeof COST_CALCULATOR_INPUTS)}
                >
                  {profile}
                </button>
              ))}
            </div>
            <div className="cost-breakdown">
              <div className="cost-item">
                <span className="cost-label">Compute (CPU/Memory):</span>
                <span className="cost-value">
                  ${COST_CALCULATOR_INPUTS[costProfile].compute}/month
                </span>
              </div>
              <div className="cost-item">
                <span className="cost-label">Storage (GB):</span>
                <span className="cost-value">
                  ${COST_CALCULATOR_INPUTS[costProfile].storage}/month
                </span>
              </div>
              <div className="cost-item">
                <span className="cost-label">Bandwidth (TB):</span>
                <span className="cost-value">
                  ${COST_CALCULATOR_INPUTS[costProfile].bandwidth}/month
                </span>
              </div>
              <div className="cost-item total">
                <span className="cost-label">Total Estimated Cost:</span>
                <span className="cost-value">
                  ${COST_CALCULATOR_INPUTS[costProfile].monthly}/month
                </span>
              </div>
            </div>
            <div className="cost-note">
              <p>
                These are simplified estimates. Actual costs vary by provider, region, and usage
                patterns. Check AWS, Azure, or GCP cost calculators for detailed pricing.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Exam Practice Tab */}
      {activeTab === 'exam' && (
        <div className="tab-content">
          <div className="exam-practice">
            <h3>Exam Practice Questions</h3>
            <div className="exam-questions">
              {EXAM_QUESTIONS.map((q) => (
                <div
                  key={q.id}
                  className={`exam-question ${getQuestionScore(q.id) === true ? 'correct' : getQuestionScore(q.id) === false ? 'incorrect' : ''}`}
                >
                  <h4>{q.question}</h4>
                  <div className="exam-options">
                    {q.options.map((option) => (
                      <label key={option} className="exam-option">
                        <input
                          type="radio"
                          name={q.id}
                          value={option}
                          checked={userAnswers[q.id] === option}
                          onChange={() => handleQuestionAnswer(q.id, option)}
                        />
                        <span>{option}</span>
                      </label>
                    ))}
                  </div>
                  {userAnswers[q.id] && (
                    <div
                      className={`exam-feedback ${getQuestionScore(q.id) ? 'success' : 'error'}`}
                    >
                      <p>
                        <strong>{getQuestionScore(q.id) ? 'Correct!' : 'Incorrect.'}</strong>{' '}
                        {q.explanation}
                      </p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

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

        /* Tab Navigation Styles */
        .tab-navigation {
          display: flex;
          gap: 10px;
          margin-bottom: 30px;
          border-bottom: 2px solid #e5e7eb;
          overflow-x: auto;
        }

        .tab-button {
          padding: 12px 20px;
          background: none;
          border: none;
          border-bottom: 3px solid transparent;
          color: #6b7280;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.2s;
          white-space: nowrap;
        }

        .tab-button.active {
          color: #3b82f6;
          border-bottom-color: #3b82f6;
        }

        .tab-button:hover {
          color: #3b82f6;
        }

        .tab-content {
          background: white;
          border: 1px solid #e5e7eb;
          border-radius: 8px;
          padding: 30px;
          margin-top: 20px;
        }

        /* Terminology Styles */
        .term-selector {
          display: flex;
          gap: 10px;
          margin-bottom: 25px;
          flex-wrap: wrap;
        }

        .term-category-btn {
          padding: 10px 18px;
          background: #f3f4f6;
          border: 2px solid #d1d5db;
          border-radius: 6px;
          color: #374151;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.2s;
        }

        .term-category-btn.active {
          background: #3b82f6;
          border-color: #3b82f6;
          color: white;
        }

        .terminology-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
          gap: 20px;
        }

        .term-card {
          background: #f9fafb;
          border: 1px solid #e5e7eb;
          border-radius: 8px;
          padding: 20px;
          transition: all 0.2s;
        }

        .term-card:hover {
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
          transform: translateY(-2px);
        }

        .term-card h3 {
          color: #1f2937;
          margin-bottom: 12px;
          font-size: 16px;
        }

        .term-card p {
          color: #6b7280;
          line-height: 1.6;
          font-size: 14px;
        }

        /* Service Comparison Styles */
        .comparison-table {
          overflow-x: auto;
          margin-bottom: 20px;
        }

        .comparison-table table {
          width: 100%;
          border-collapse: collapse;
          background: white;
        }

        .comparison-table th {
          background: #3b82f6;
          color: white;
          padding: 15px;
          text-align: left;
          font-weight: 600;
        }

        .comparison-table td {
          padding: 15px;
          border-bottom: 1px solid #e5e7eb;
          color: #374151;
        }

        .comparison-table .aspect-cell {
          background: #f9fafb;
          font-weight: 600;
          width: 20%;
        }

        .comparison-note {
          background: #f0f9ff;
          border-left: 4px solid #3b82f6;
          padding: 15px;
          border-radius: 4px;
          color: #1e40af;
        }

        /* Use Case Matcher Styles */
        .usecase-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
          gap: 20px;
        }

        .usecase-card {
          background: white;
          border: 2px solid #dbeafe;
          border-radius: 8px;
          padding: 20px;
          transition: all 0.2s;
        }

        .usecase-card:hover {
          border-color: #3b82f6;
          box-shadow: 0 4px 12px rgba(59, 130, 246, 0.15);
        }

        .usecase-card h4 {
          color: #1f2937;
          margin-bottom: 10px;
          font-size: 14px;
        }

        .scenario-text {
          color: #374151;
          margin-bottom: 15px;
          font-style: italic;
          padding-bottom: 15px;
          border-bottom: 1px solid #e5e7eb;
        }

        .usecase-info {
          display: flex;
          flex-direction: column;
          gap: 10px;
        }

        .usecase-item {
          display: flex;
          flex-direction: column;
          gap: 5px;
        }

        .usecase-item .label {
          font-weight: 600;
          color: #6b7280;
          font-size: 12px;
          text-transform: uppercase;
        }

        .usecase-item .value {
          color: #3b82f6;
          font-weight: 600;
        }

        /* Cost Calculator Styles */
        .cost-calculator {
          max-width: 600px;
          margin: 0 auto;
        }

        .cost-calculator h3 {
          color: #1f2937;
          margin-bottom: 25px;
          text-align: center;
        }

        .cost-profile-selector {
          display: flex;
          flex-direction: column;
          gap: 10px;
          margin-bottom: 30px;
        }

        .cost-profile-selector label {
          font-weight: 600;
          color: #374151;
          margin-bottom: 5px;
        }

        .cost-profile-selector .profile-btn {
          padding: 12px;
          background: #f3f4f6;
          border: 2px solid #d1d5db;
          border-radius: 6px;
          cursor: pointer;
          font-weight: 600;
          transition: all 0.2s;
        }

        .cost-profile-selector .profile-btn.active {
          background: #10b981;
          border-color: #10b981;
          color: white;
        }

        .cost-breakdown {
          background: #f9fafb;
          border-radius: 8px;
          padding: 20px;
          margin-bottom: 20px;
        }

        .cost-item {
          display: flex;
          justify-content: space-between;
          padding: 12px 0;
          border-bottom: 1px solid #e5e7eb;
          color: #374151;
        }

        .cost-item.total {
          border: none;
          font-weight: 600;
          font-size: 16px;
          color: #1f2937;
          padding-top: 15px;
          margin-top: 10px;
          border-top: 2px solid #d1d5db;
        }

        .cost-label {
          color: #6b7280;
        }

        .cost-value {
          font-weight: 600;
          color: #10b981;
        }

        .cost-item.total .cost-value {
          color: #1f2937;
          font-size: 18px;
        }

        .cost-note {
          background: #fef3c7;
          border-left: 4px solid #f59e0b;
          padding: 15px;
          border-radius: 4px;
          color: #92400e;
          font-size: 13px;
        }

        .cost-note p {
          margin: 0;
          line-height: 1.6;
        }

        /* Exam Practice Styles */
        .exam-practice h3 {
          color: #1f2937;
          margin-bottom: 25px;
          text-align: center;
        }

        .exam-questions {
          display: flex;
          flex-direction: column;
          gap: 25px;
        }

        .exam-question {
          background: white;
          border: 2px solid #e5e7eb;
          border-radius: 8px;
          padding: 20px;
          transition: all 0.2s;
        }

        .exam-question.correct {
          border-color: #10b981;
          background: #f0fdf4;
        }

        .exam-question.incorrect {
          border-color: #ef4444;
          background: #fef2f2;
        }

        .exam-question h4 {
          color: #1f2937;
          margin-bottom: 15px;
          font-size: 15px;
          line-height: 1.6;
        }

        .exam-options {
          display: flex;
          flex-direction: column;
          gap: 10px;
          margin-bottom: 15px;
        }

        .exam-option {
          display: flex;
          align-items: center;
          gap: 10px;
          padding: 10px;
          border-radius: 6px;
          cursor: pointer;
          transition: all 0.2s;
        }

        .exam-option:hover {
          background: #f3f4f6;
        }

        .exam-option input[type='radio'] {
          cursor: pointer;
          width: 18px;
          height: 18px;
        }

        .exam-option span {
          color: #374151;
          font-weight: 500;
        }

        .exam-feedback {
          padding: 12px;
          border-radius: 6px;
          margin-top: 10px;
        }

        .exam-feedback.success {
          background: #d1fae5;
          color: #065f46;
          border-left: 4px solid #10b981;
        }

        .exam-feedback.error {
          background: #fee2e2;
          color: #7f1d1d;
          border-left: 4px solid #ef4444;
        }

        .exam-feedback p {
          margin: 0;
          line-height: 1.6;
          font-size: 14px;
        }

        @media (max-width: 768px) {
          .tab-navigation {
            flex-wrap: wrap;
          }

          .terminology-grid {
            grid-template-columns: 1fr;
          }

          .usecase-grid {
            grid-template-columns: 1fr;
          }

          .comparison-table {
            font-size: 13px;
          }

          .comparison-table th,
          .comparison-table td {
            padding: 10px 8px;
          }

          .cost-profile-selector .profile-btn {
            padding: 10px;
            font-size: 13px;
          }
        }
      `}</style>
    </div>
  );
};

export default CloudSummaryBuilder;
