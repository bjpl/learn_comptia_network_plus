/**
 * Topology Transformation Tool Component
 * Advanced topology conversion, comparison, and exam scenario analysis
 * Features: conversion tool, pros/cons analysis, cost/redundancy matrix, exam scenarios
 */

import React, { useState, useEffect } from 'react';
import { transformationScenarios, topologyDefinitions } from './topologies-data';
import type { TopologyTransformation, TopologyType, TopologyDefinition } from './topologies-types';

interface TopologyTransformerProps {
  className?: string;
}

// Exam scenario type for network design questions
interface ExamScenario {
  id: string;
  title: string;
  requirements: string[];
  constraints: string[];
  recommendedTopology: TopologyType;
  explanation: string;
  examTip: string;
}

// Enhanced comparison data structure
interface TopologyComparison {
  topology: TopologyType;
  pros: string[];
  cons: string[];
  costScore: number; // 1-10 (1=most expensive, 10=cheapest)
  redundancyScore: number; // 1-10 (1=least redundant, 10=most redundant)
  scalabilityScore: number; // 1-10
  complexity: number; // 1-10 (1=simplest, 10=most complex)
}

export const TopologyTransformer: React.FC<TopologyTransformerProps> = ({ className = '' }) => {
  const [selectedTransformation, setSelectedTransformation] = useState<TopologyTransformation>(
    transformationScenarios[0]
  );
  const [currentStep, setCurrentStep] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);
  const [showComparison, setShowComparison] = useState(false);
  const [autoPlay, setAutoPlay] = useState(false);
  const [activeTab, setActiveTab] = useState<'transform' | 'compare' | 'scenarios'>('transform');
  const [selectedScenario, setSelectedScenario] = useState<string | null>(null);

  // Exam scenarios for topology selection practice
  const examScenarios: ExamScenario[] = [
    {
      id: 'scenario1',
      title: 'High-Availability Server Farm',
      requirements: [
        'Maximum uptime',
        'Mission-critical applications',
        'Small network (5-10 devices)',
      ],
      constraints: ['Budget available for redundancy', 'Can afford high maintenance complexity'],
      recommendedTopology: 'mesh',
      explanation:
        'Mesh topology provides multiple paths and eliminates single points of failure, ideal for mission-critical systems.',
      examTip:
        'Remember: Mesh cables = n(n-1)/2. For 4 nodes = 6 cables. Great for critical systems but not scalable.',
    },
    {
      id: 'scenario2',
      title: 'Small Office Network',
      requirements: ['Basic connectivity', 'Easy management', '10-20 devices'],
      constraints: ['Limited budget', 'One IT person'],
      recommendedTopology: 'star',
      explanation:
        'Star topology is simple, affordable, and easy to manage. Perfect for small deployments.',
      examTip:
        'Star is the most common topology today. Single point of failure at switch, but simplicity wins for SMB.',
    },
    {
      id: 'scenario3',
      title: 'Multi-Building Campus Network',
      requirements: ['Large scale', 'Scalability', 'Multiple floors/buildings'],
      constraints: ['Existing infrastructure', 'Mixed equipment'],
      recommendedTopology: 'three-tier',
      explanation:
        'Three-tier provides scalability with core, distribution, and access layers. Standard enterprise design.',
      examTip:
        'Classic Enterprise topology. Remember: Core (speed), Distribution (routing policies), Access (user connections).',
    },
    {
      id: 'scenario4',
      title: 'Modern Data Center',
      requirements: [
        'East-west traffic optimization',
        'Virtual machine migration',
        'High scalability',
      ],
      constraints: ['Need server-to-server efficiency', 'Virtualization environment'],
      recommendedTopology: 'spine-and-leaf',
      explanation:
        'Spine-and-leaf is optimized for data center traffic patterns with equal-cost paths.',
      examTip:
        'Modern architecture for data centers and clouds. Optimized for east-west (server-to-server) traffic, not north-south.',
    },
    {
      id: 'scenario5',
      title: 'Multiple Branch Offices',
      requirements: ['Connect remote sites to HQ', 'Cost-effective WAN', 'Centralized management'],
      constraints: ['Existing WAN infrastructure', 'Branch sites with limited IT'],
      recommendedTopology: 'hub-and-spoke',
      explanation:
        'Hub-and-spoke is ideal for WAN with all remote sites connected through headquarters.',
      examTip:
        'Classic WAN design. Hub = single point of failure. Spokes communicate through hub = inefficient branch-to-branch.',
    },
    {
      id: 'scenario6',
      title: 'Growing SMB Needing Scalability',
      requirements: ['Plan for growth', 'Some redundancy', 'Cost control'],
      constraints: ['Current 50-200 devices', 'May expand to 300+'],
      recommendedTopology: 'collapsed-core',
      explanation:
        'Collapsed-core combines core and distribution layers for efficiency while maintaining scalability.',
      examTip:
        'Practical choice for SMBs. Reduces core from 3 tiers to 2. Saves cost but still provides decent redundancy.',
    },
  ];

  // Topology comparison matrix
  const comparisonMatrix: TopologyComparison[] = [
    {
      topology: 'mesh',
      pros: [
        'Maximum redundancy',
        'No single point of failure',
        'Direct paths between devices',
        'Excellent for critical systems',
      ],
      cons: [
        'Exponential cabling costs',
        'Complex configuration',
        'Difficult to manage',
        'Not scalable',
      ],
      costScore: 1,
      redundancyScore: 10,
      scalabilityScore: 2,
      complexity: 9,
    },
    {
      topology: 'star',
      pros: ['Simple design', 'Easy to manage', 'Low cabling cost', 'Easy troubleshooting'],
      cons: [
        'Single point of failure',
        'Central switch bottleneck',
        'Limited scalability',
        'Performance degrades with load',
      ],
      costScore: 9,
      redundancyScore: 2,
      scalabilityScore: 4,
      complexity: 2,
    },
    {
      topology: 'spine-and-leaf',
      pros: [
        'Scalable design',
        'Optimized for data centers',
        'Equal-cost paths',
        'No oversubscription',
      ],
      cons: [
        'Higher initial cost',
        'Requires planning',
        'More complex setup',
        'Overkill for small networks',
      ],
      costScore: 3,
      redundancyScore: 8,
      scalabilityScore: 9,
      complexity: 8,
    },
    {
      topology: 'three-tier',
      pros: ['Highly scalable', 'Clear layer separation', 'Good redundancy', 'Proven design'],
      cons: ['Complex management', 'Higher latency', 'More hardware needed', 'Many cables needed'],
      costScore: 4,
      redundancyScore: 7,
      scalabilityScore: 8,
      complexity: 7,
    },
    {
      topology: 'hub-and-spoke',
      pros: [
        'Cost-effective for WAN',
        'Centralized management',
        'Simple architecture',
        'Easy to add branches',
      ],
      cons: [
        'Hub is single point of failure',
        'Inefficient branch-to-branch',
        'Hub can become bottleneck',
        'Not optimized for modern traffic',
      ],
      costScore: 8,
      redundancyScore: 2,
      scalabilityScore: 5,
      complexity: 3,
    },
    {
      topology: 'hybrid',
      pros: [
        'Combines best of multiple topologies',
        'Flexible design',
        'Customizable',
        'Adaptable to needs',
      ],
      cons: [
        'Complex to manage',
        'Harder to troubleshoot',
        'Custom solutions required',
        'No standard design',
      ],
      costScore: 5,
      redundancyScore: 6,
      scalabilityScore: 7,
      complexity: 9,
    },
    {
      topology: 'point-to-point',
      pros: [
        'Direct connections',
        'Predictable performance',
        'Simple for small networks',
        'No shared resources',
      ],
      cons: [
        'Only works for 2 devices',
        'Not truly a network',
        'No shared services',
        'Impractical at scale',
      ],
      costScore: 6,
      redundancyScore: 1,
      scalabilityScore: 1,
      complexity: 1,
    },
    {
      topology: 'collapsed-core',
      pros: [
        'Cost-effective than 3-tier',
        'Still scalable',
        'Simplified management',
        'Good for SMBs',
      ],
      cons: [
        'Limited redundancy',
        'Potential bottleneck',
        'Less flexible than 3-tier',
        'Growth limitations',
      ],
      costScore: 7,
      redundancyScore: 4,
      scalabilityScore: 6,
      complexity: 5,
    },
  ];

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (autoPlay && isAnimating) {
      interval = setInterval(() => {
        setCurrentStep((prev) => {
          if (prev >= selectedTransformation.steps.length - 1) {
            setAutoPlay(false);
            setIsAnimating(false);
            return prev;
          }
          return prev + 1;
        });
      }, 3000);
    }
    return () => clearInterval(interval);
  }, [autoPlay, isAnimating, selectedTransformation]);

  const handleTransformationChange = (transformation: TopologyTransformation) => {
    setSelectedTransformation(transformation);
    setCurrentStep(0);
    setIsAnimating(false);
    setAutoPlay(false);
  };

  const handleStepChange = (step: number) => {
    setCurrentStep(step);
    setIsAnimating(true);
  };

  const handlePlayPause = () => {
    if (isAnimating && autoPlay) {
      setAutoPlay(false);
    } else {
      setIsAnimating(true);
      setAutoPlay(true);
    }
  };

  const handleReset = () => {
    setCurrentStep(0);
    setIsAnimating(false);
    setAutoPlay(false);
  };

  const currentStepData = selectedTransformation.steps[currentStep];

  return (
    <div className={`topology-transformer ${className}`}>
      {/* Header */}
      <div className="transformer-header">
        <h2>Network Topology Transformation Tool</h2>
        <p>Visualize topology conversions, compare characteristics, and practice exam scenarios</p>
      </div>

      {/* Tab Navigation */}
      <div className="tab-navigation">
        <button
          className={`tab-btn ${activeTab === 'transform' ? 'active' : ''}`}
          onClick={() => setActiveTab('transform')}
        >
          <span className="tab-icon">↔</span> Topology Conversions
        </button>
        <button
          className={`tab-btn ${activeTab === 'compare' ? 'active' : ''}`}
          onClick={() => setActiveTab('compare')}
        >
          <span className="tab-icon">⚖</span> Comparison Matrix
        </button>
        <button
          className={`tab-btn ${activeTab === 'scenarios' ? 'active' : ''}`}
          onClick={() => setActiveTab('scenarios')}
        >
          <span className="tab-icon">✓</span> Exam Scenarios
        </button>
      </div>

      {/* TAB 1: Transformation Scenarios */}
      {activeTab === 'transform' && (
        <>
          {/* Transformation Selection */}
          <div className="transformation-selection">
            <h3>Select Transformation Scenario</h3>
            <div className="scenario-buttons">
              {transformationScenarios.map((scenario) => (
                <button
                  key={scenario.id}
                  className={`scenario-btn ${selectedTransformation.id === scenario.id ? 'active' : ''}`}
                  onClick={() => handleTransformationChange(scenario)}
                >
                  <span className="from">{scenario.fromTopology}</span>
                  <span className="arrow">→</span>
                  <span className="to">{scenario.toTopology}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Current Transformation Info */}
          <div className="transformation-info">
            <h3>{selectedTransformation.name}</h3>
            <p className="description">{selectedTransformation.description}</p>
          </div>

          {/* Animation Controls */}
          <div className="animation-controls">
            <button className="control-btn" onClick={handlePlayPause}>
              {autoPlay ? '⏸ Pause' : '▶ Play'}
            </button>
            <button className="control-btn" onClick={handleReset}>
              ↺ Reset
            </button>
            <button className="control-btn" onClick={() => setShowComparison(!showComparison)}>
              {showComparison ? '👁 Hide' : '👁 Show'} Comparison
            </button>
          </div>

          {/* Step Progress */}
          <div className="step-progress">
            <div className="progress-bar">
              <div
                className="progress-fill"
                style={{
                  width: `${((currentStep + 1) / selectedTransformation.steps.length) * 100}%`,
                }}
              />
            </div>
            <div className="step-buttons">
              {selectedTransformation.steps.map((step, idx) => (
                <button
                  key={step.id}
                  className={`step-btn ${currentStep === idx ? 'active' : ''} ${
                    currentStep > idx ? 'completed' : ''
                  }`}
                  onClick={() => handleStepChange(idx)}
                >
                  <span className="step-number">{idx + 1}</span>
                  <span className="step-title">{step.title}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Main Visualization Area */}
          <div className="visualization-area">
            {showComparison ? (
              /* Side-by-Side Comparison */
              <div className="side-by-side">
                <div className="topology-view before">
                  <h4>Before: {selectedTransformation.fromTopology}</h4>
                  <div className="topology-diagram">
                    <div className="diagram-placeholder">
                      <span className="topology-name">{selectedTransformation.fromTopology}</span>
                      <div className="topology-icon">🔷</div>
                    </div>
                  </div>
                </div>

                <div className="transformation-arrow">
                  <div className="arrow-icon">→</div>
                  <div className="step-indicator">
                    Step {currentStep + 1} of {selectedTransformation.steps.length}
                  </div>
                </div>

                <div className="topology-view after">
                  <h4>After: {selectedTransformation.toTopology}</h4>
                  <div className="topology-diagram">
                    <div className="diagram-placeholder">
                      <span className="topology-name">{selectedTransformation.toTopology}</span>
                      <div className="topology-icon">🔶</div>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              /* Single View with Current Step */
              <div className="single-view">
                <div className="current-step">
                  <h4>{currentStepData.title}</h4>
                  <p className="step-description">{currentStepData.description}</p>

                  <div className="topology-diagram">
                    <div className={`diagram-placeholder ${isAnimating ? 'animating' : ''}`}>
                      <span className="topology-name">
                        {currentStep === 0
                          ? selectedTransformation.fromTopology
                          : currentStep === selectedTransformation.steps.length - 1
                            ? selectedTransformation.toTopology
                            : 'Transitioning...'}
                      </span>
                      <div className="topology-icon">
                        {currentStep === 0
                          ? '🔷'
                          : currentStep === selectedTransformation.steps.length - 1
                            ? '🔶'
                            : '🔄'}
                      </div>
                    </div>
                  </div>

                  <div className="step-changes">
                    <h5>Changes in This Step</h5>
                    <div className="changes-grid">
                      {currentStepData.changes.redundancy && (
                        <div className="change-item">
                          <span className="label">Redundancy:</span>
                          <span className={`value ${currentStepData.changes.redundancy}`}>
                            {currentStepData.changes.redundancy}
                          </span>
                        </div>
                      )}
                      {currentStepData.changes.trafficPattern && (
                        <div className="change-item">
                          <span className="label">Traffic Pattern:</span>
                          <span className="value">{currentStepData.changes.trafficPattern}</span>
                        </div>
                      )}
                      {currentStepData.changes.scalability && (
                        <div className="change-item">
                          <span className="label">Scalability:</span>
                          <span className={`value ${currentStepData.changes.scalability}`}>
                            {currentStepData.changes.scalability}
                          </span>
                        </div>
                      )}
                      {currentStepData.changes.cost && (
                        <div className="change-item">
                          <span className="label">Cost:</span>
                          <span className={`value ${currentStepData.changes.cost}`}>
                            {currentStepData.changes.cost}
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Detailed Analysis */}
          <div className="detailed-analysis">
            <h3>Transformation Analysis</h3>

            <div className="analysis-grid">
              {/* Redundancy Analysis */}
              <div className="analysis-section">
                <h4>Redundancy Impact</h4>
                <div className="analysis-item">
                  <span className="label">Before:</span>
                  <span className="value">{selectedTransformation.analysis.redundancy.before}</span>
                </div>
                <div className="analysis-item">
                  <span className="label">After:</span>
                  <span className="value">{selectedTransformation.analysis.redundancy.after}</span>
                </div>
                <div className="analysis-item highlight">
                  <span className="label">Change:</span>
                  <span className="value">{selectedTransformation.analysis.redundancy.change}</span>
                </div>
              </div>

              {/* Traffic Patterns Analysis */}
              <div className="analysis-section">
                <h4>Traffic Patterns</h4>
                <div className="analysis-item">
                  <span className="label">Before:</span>
                  <span className="value">
                    {selectedTransformation.analysis.trafficPatterns.before}
                  </span>
                </div>
                <div className="analysis-item">
                  <span className="label">After:</span>
                  <span className="value">
                    {selectedTransformation.analysis.trafficPatterns.after}
                  </span>
                </div>
                <div className="analysis-item highlight">
                  <span className="label">Improvement:</span>
                  <span className="value">
                    {selectedTransformation.analysis.trafficPatterns.improvement}
                  </span>
                </div>
              </div>

              {/* Scalability Analysis */}
              <div className="analysis-section">
                <h4>Scalability</h4>
                <div className="analysis-item">
                  <span className="label">Before:</span>
                  <span className="value">
                    {selectedTransformation.analysis.scalability.before}
                  </span>
                </div>
                <div className="analysis-item">
                  <span className="label">After:</span>
                  <span className="value">{selectedTransformation.analysis.scalability.after}</span>
                </div>
                <div className="analysis-item highlight">
                  <span className="label">Improvement:</span>
                  <span className="value">
                    {selectedTransformation.analysis.scalability.improvement}
                  </span>
                </div>
              </div>

              {/* Cost Analysis */}
              <div className="analysis-section">
                <h4>Cost Impact</h4>
                <div className="analysis-item">
                  <span className="label">Before:</span>
                  <span className="value">{selectedTransformation.analysis.cost.before}</span>
                </div>
                <div className="analysis-item">
                  <span className="label">After:</span>
                  <span className="value">{selectedTransformation.analysis.cost.after}</span>
                </div>
                <div className="analysis-item highlight">
                  <span className="label">Change:</span>
                  <span className="value">{selectedTransformation.analysis.cost.change}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Benefits and Considerations */}
          <div className="benefits-considerations">
            <div className="benefits">
              <h4>Benefits</h4>
              <ul>
                {selectedTransformation.benefits.map((benefit, idx) => (
                  <li key={idx}>
                    <span className="icon">✓</span>
                    {benefit}
                  </li>
                ))}
              </ul>
            </div>

            <div className="considerations">
              <h4>Considerations</h4>
              <ul>
                {selectedTransformation.considerations.map((consideration, idx) => (
                  <li key={idx}>
                    <span className="icon">⚠</span>
                    {consideration}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </>
      )}

      {/* TAB 2: Comparison Matrix */}
      {activeTab === 'compare' && (
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
              <span className="color redundancy"></span> <strong>Redundancy:</strong> 1=Least
              Redundant, 10=Most Redundant
            </div>
            <div className="legend-item">
              <span className="color scalability"></span> <strong>Scalability:</strong> 1=Not
              Scalable, 10=Highly Scalable
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
      )}

      {/* TAB 3: Exam Scenarios */}
      {activeTab === 'scenarios' && (
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
      )}

      <style>{`
        .topology-transformer {
          padding: 2rem;
          max-width: 1400px;
          margin: 0 auto;
        }

        .transformer-header {
          text-align: center;
          margin-bottom: 2rem;
        }

        /* Tab Navigation */
        .tab-navigation {
          display: flex;
          gap: 1rem;
          margin-bottom: 2rem;
          border-bottom: 2px solid #e5e7eb;
          flex-wrap: wrap;
        }

        .tab-btn {
          padding: 0.75rem 1.5rem;
          background: white;
          border: none;
          border-bottom: 3px solid transparent;
          cursor: pointer;
          font-weight: 600;
          color: #6b7280;
          transition: all 0.2s;
          display: flex;
          align-items: center;
          gap: 0.5rem;
        }

        .tab-btn:hover {
          color: #3b82f6;
          border-bottom-color: #3b82f6;
        }

        .tab-btn.active {
          color: #3b82f6;
          border-bottom-color: #3b82f6;
        }

        .tab-icon {
          font-size: 1.2rem;
        }

        .tab-intro {
          color: #6b7280;
          margin-bottom: 1.5rem;
          font-size: 0.95rem;
        }

        .transformer-header h2 {
          font-size: 2rem;
          color: #1f2937;
          margin-bottom: 0.5rem;
        }

        .transformer-header p {
          color: #6b7280;
          font-size: 1rem;
        }

        .transformation-selection {
          margin-bottom: 2rem;
        }

        .transformation-selection h3 {
          margin-bottom: 1rem;
          color: #374151;
        }

        .scenario-buttons {
          display: flex;
          flex-wrap: wrap;
          gap: 0.5rem;
        }

        .scenario-btn {
          padding: 0.75rem 1.5rem;
          border: 2px solid #d1d5db;
          background: white;
          border-radius: 0.5rem;
          cursor: pointer;
          display: flex;
          align-items: center;
          gap: 0.5rem;
          transition: all 0.2s;
        }

        .scenario-btn:hover {
          border-color: #3b82f6;
          background: #eff6ff;
        }

        .scenario-btn.active {
          border-color: #3b82f6;
          background: #3b82f6;
          color: white;
        }

        .scenario-btn .from,
        .scenario-btn .to {
          text-transform: capitalize;
        }

        .scenario-btn .arrow {
          font-weight: bold;
        }

        .transformation-info {
          padding: 1.5rem;
          background: white;
          border: 1px solid #e5e7eb;
          border-radius: 0.5rem;
          margin-bottom: 2rem;
        }

        .transformation-info h3 {
          color: #1f2937;
          margin-bottom: 0.5rem;
        }

        .transformation-info .description {
          color: #6b7280;
        }

        .animation-controls {
          display: flex;
          gap: 0.5rem;
          margin-bottom: 1.5rem;
        }

        .control-btn {
          padding: 0.75rem 1.5rem;
          background: #3b82f6;
          color: white;
          border: none;
          border-radius: 0.5rem;
          cursor: pointer;
          font-weight: 600;
          transition: background 0.2s;
        }

        .control-btn:hover {
          background: #2563eb;
        }

        .step-progress {
          margin-bottom: 2rem;
        }

        .progress-bar {
          height: 8px;
          background: #e5e7eb;
          border-radius: 4px;
          overflow: hidden;
          margin-bottom: 1rem;
        }

        .progress-fill {
          height: 100%;
          background: linear-gradient(90deg, #3b82f6, #2563eb);
          transition: width 0.5s ease;
        }

        .step-buttons {
          display: flex;
          gap: 0.5rem;
          overflow-x: auto;
        }

        .step-btn {
          padding: 0.75rem 1rem;
          border: 2px solid #d1d5db;
          background: white;
          border-radius: 0.5rem;
          cursor: pointer;
          display: flex;
          flex-direction: column;
          align-items: flex-start;
          min-width: 150px;
          transition: all 0.2s;
        }

        .step-btn:hover {
          border-color: #3b82f6;
        }

        .step-btn.active {
          border-color: #3b82f6;
          background: #eff6ff;
        }

        .step-btn.completed {
          background: #d1fae5;
          border-color: #10b981;
        }

        .step-number {
          font-weight: 600;
          color: #3b82f6;
          margin-bottom: 0.25rem;
        }

        .step-title {
          font-size: 0.875rem;
          color: #374151;
        }

        .visualization-area {
          margin-bottom: 2rem;
          padding: 2rem;
          background: white;
          border: 1px solid #e5e7eb;
          border-radius: 0.5rem;
        }

        .side-by-side {
          display: grid;
          grid-template-columns: 1fr auto 1fr;
          gap: 2rem;
          align-items: center;
        }

        .topology-view h4 {
          text-align: center;
          margin-bottom: 1rem;
          color: #374151;
        }

        .transformation-arrow {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 0.5rem;
        }

        .arrow-icon {
          font-size: 3rem;
          color: #3b82f6;
        }

        .step-indicator {
          font-size: 0.875rem;
          color: #6b7280;
          text-align: center;
        }

        .single-view {
          max-width: 800px;
          margin: 0 auto;
        }

        .current-step h4 {
          color: #1f2937;
          margin-bottom: 0.5rem;
        }

        .step-description {
          color: #6b7280;
          margin-bottom: 2rem;
        }

        .topology-diagram {
          margin-bottom: 2rem;
        }

        .diagram-placeholder {
          height: 300px;
          background: linear-gradient(135deg, #f3f4f6 0%, #e5e7eb 100%);
          border: 2px dashed #d1d5db;
          border-radius: 0.5rem;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          gap: 1rem;
          position: relative;
          overflow: hidden;
        }

        .diagram-placeholder.animating::before {
          content: '';
          position: absolute;
          top: -50%;
          left: -50%;
          width: 200%;
          height: 200%;
          background: linear-gradient(
            45deg,
            transparent 30%,
            rgba(59, 130, 246, 0.1) 50%,
            transparent 70%
          );
          animation: shimmer 2s infinite;
        }

        @keyframes shimmer {
          0% {
            transform: translateX(-100%) translateY(-100%) rotate(45deg);
          }
          100% {
            transform: translateX(100%) translateY(100%) rotate(45deg);
          }
        }

        .topology-name {
          font-size: 1.5rem;
          font-weight: 600;
          color: #374151;
          text-transform: capitalize;
          z-index: 1;
        }

        .topology-icon {
          font-size: 4rem;
          z-index: 1;
        }

        .step-changes {
          padding: 1.5rem;
          background: #f9fafb;
          border-radius: 0.5rem;
        }

        .step-changes h5 {
          color: #374151;
          margin-bottom: 1rem;
        }

        .changes-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
          gap: 1rem;
        }

        .change-item {
          display: flex;
          flex-direction: column;
          gap: 0.25rem;
        }

        .change-item .label {
          font-size: 0.875rem;
          color: #6b7280;
        }

        .change-item .value {
          font-weight: 600;
          text-transform: capitalize;
        }

        .change-item .value.increase {
          color: #059669;
        }

        .change-item .value.decrease {
          color: #dc2626;
        }

        .change-item .value.maintain,
        .change-item .value.improve {
          color: #3b82f6;
        }

        .change-item .value.reduce {
          color: #f59e0b;
        }

        .detailed-analysis {
          margin-bottom: 2rem;
          padding: 1.5rem;
          background: white;
          border: 1px solid #e5e7eb;
          border-radius: 0.5rem;
        }

        .detailed-analysis h3 {
          margin-bottom: 1.5rem;
          color: #1f2937;
        }

        .analysis-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
          gap: 1.5rem;
        }

        .analysis-section {
          padding: 1rem;
          background: #f9fafb;
          border-radius: 0.5rem;
        }

        .analysis-section h4 {
          color: #374151;
          margin-bottom: 1rem;
          padding-bottom: 0.5rem;
          border-bottom: 2px solid #e5e7eb;
        }

        .analysis-item {
          display: flex;
          flex-direction: column;
          gap: 0.25rem;
          margin-bottom: 0.75rem;
        }

        .analysis-item .label {
          font-size: 0.75rem;
          color: #6b7280;
          font-weight: 600;
        }

        .analysis-item .value {
          font-size: 0.875rem;
          color: #374151;
        }

        .analysis-item.highlight {
          padding: 0.75rem;
          background: #eff6ff;
          border-left: 3px solid #3b82f6;
          border-radius: 0.25rem;
        }

        .analysis-item.highlight .value {
          font-weight: 600;
          color: #1e40af;
        }

        .benefits-considerations {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 2rem;
        }

        .benefits,
        .considerations {
          padding: 1.5rem;
          border-radius: 0.5rem;
        }

        .benefits {
          background: #d1fae5;
          border: 1px solid #10b981;
        }

        .considerations {
          background: #fef3c7;
          border: 1px solid #f59e0b;
        }

        .benefits h4 {
          color: #065f46;
          margin-bottom: 1rem;
        }

        .considerations h4 {
          color: #92400e;
          margin-bottom: 1rem;
        }

        .benefits ul,
        .considerations ul {
          list-style: none;
          padding: 0;
        }

        .benefits li,
        .considerations li {
          display: flex;
          align-items: flex-start;
          gap: 0.5rem;
          margin-bottom: 0.75rem;
          font-size: 0.875rem;
        }

        .benefits .icon {
          color: #059669;
          font-weight: bold;
        }

        .considerations .icon {
          color: #f59e0b;
          font-weight: bold;
        }

        /* Comparison Matrix Tab */
        .comparison-matrix-tab {
          padding: 0;
        }

        .score-legend {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
          gap: 1rem;
          margin-bottom: 2rem;
          padding: 1.5rem;
          background: #f9fafb;
          border-radius: 0.5rem;
        }

        .legend-item {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          font-size: 0.875rem;
        }

        .legend-item .color {
          width: 16px;
          height: 16px;
          border-radius: 0.25rem;
        }

        .legend-item .color.cost {
          background: #f59e0b;
        }

        .legend-item .color.redundancy {
          background: #ef4444;
        }

        .legend-item .color.scalability {
          background: #10b981;
        }

        .legend-item .color.complexity {
          background: #8b5cf6;
        }

        .comparison-cards {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
          gap: 1.5rem;
          margin-bottom: 2rem;
        }

        .comparison-card {
          padding: 1.5rem;
          background: white;
          border: 1px solid #e5e7eb;
          border-radius: 0.5rem;
          box-shadow: 0 1px 3px rgba(0,0,0,0.1);
        }

        .comparison-card .topology-name {
          text-align: center;
          color: #1f2937;
          font-size: 1rem;
          margin-bottom: 1.5rem;
          padding-bottom: 1rem;
          border-bottom: 2px solid #e5e7eb;
        }

        .scores-section {
          margin-bottom: 1.5rem;
        }

        .score-row {
          display: grid;
          grid-template-columns: 80px 1fr 30px;
          gap: 0.75rem;
          align-items: center;
          margin-bottom: 1rem;
        }

        .score-label {
          font-size: 0.75rem;
          color: #6b7280;
          font-weight: 600;
        }

        .score-bar {
          height: 8px;
          background: #e5e7eb;
          border-radius: 4px;
          overflow: hidden;
        }

        .score-fill {
          height: 100%;
          transition: width 0.3s ease;
        }

        .score-fill.cost {
          background: #f59e0b;
        }

        .score-fill.redundancy {
          background: #ef4444;
        }

        .score-fill.scalability {
          background: #10b981;
        }

        .score-fill.complexity {
          background: #8b5cf6;
        }

        .score-value {
          font-weight: 600;
          color: #374151;
          text-align: right;
          font-size: 0.875rem;
        }

        .pros-cons {
          margin-bottom: 1rem;
        }

        .pros-cons h5 {
          font-size: 0.875rem;
          color: #374151;
          margin-bottom: 0.5rem;
          text-transform: uppercase;
        }

        .pros-list,
        .cons-list {
          list-style: none;
          padding: 0;
        }

        .pros-list li,
        .cons-list li {
          font-size: 0.75rem;
          color: #6b7280;
          margin-bottom: 0.5rem;
          display: flex;
          align-items: flex-start;
          gap: 0.5rem;
        }

        .pros-list li span,
        .cons-list li span {
          font-weight: 700;
          flex-shrink: 0;
        }

        .pros-list li span {
          color: #10b981;
        }

        .cons-list li span {
          color: #ef4444;
        }

        /* Exam Scenarios Tab */
        .exam-scenarios-tab {
          padding: 0;
        }

        .scenario-list {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
          gap: 1rem;
          margin-bottom: 2rem;
        }

        .scenario-card {
          padding: 1.5rem;
          background: white;
          border: 2px solid #e5e7eb;
          border-radius: 0.5rem;
          cursor: pointer;
          transition: all 0.2s;
        }

        .scenario-card:hover {
          border-color: #3b82f6;
          box-shadow: 0 4px 6px rgba(59, 130, 246, 0.1);
        }

        .scenario-card.selected {
          border-color: #3b82f6;
          background: #eff6ff;
        }

        .scenario-header {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          gap: 0.5rem;
          margin-bottom: 0.5rem;
        }

        .scenario-header h4 {
          color: #1f2937;
          font-size: 0.95rem;
          margin: 0;
        }

        .scenario-id {
          font-size: 0.7rem;
          background: #e5e7eb;
          padding: 0.25rem 0.5rem;
          border-radius: 0.25rem;
          color: #6b7280;
          white-space: nowrap;
        }

        .scenario-summary {
          font-size: 0.875rem;
          color: #3b82f6;
        }

        .scenario-details {
          padding: 2rem;
          background: white;
          border: 1px solid #e5e7eb;
          border-radius: 0.5rem;
          margin-bottom: 2rem;
        }

        .scenario-content {
          display: flex;
          flex-direction: column;
          gap: 1.5rem;
        }

        .detail-section h3 {
          color: #1f2937;
          margin-bottom: 0.5rem;
        }

        .detail-section .description {
          color: #6b7280;
          line-height: 1.6;
        }

        .requirements-section {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 2rem;
        }

        .subsection h4 {
          color: #374151;
          margin-bottom: 1rem;
        }

        .subsection ul {
          list-style: none;
          padding: 0;
        }

        .subsection li {
          display: flex;
          align-items: flex-start;
          gap: 0.5rem;
          margin-bottom: 0.75rem;
          font-size: 0.875rem;
          color: #6b7280;
        }

        .subsection .icon {
          flex-shrink: 0;
          font-weight: bold;
          color: #3b82f6;
        }

        .recommendation-box {
          padding: 1.5rem;
          background: #eff6ff;
          border: 2px solid #3b82f6;
          border-radius: 0.5rem;
        }

        .recommendation-box h4 {
          color: #1e40af;
          margin-bottom: 1rem;
        }

        .topology-recommendation {
          display: flex;
          justify-content: center;
        }

        .topology-badge {
          padding: 0.75rem 1.5rem;
          background: #3b82f6;
          color: white;
          border-radius: 0.5rem;
          font-weight: 600;
          font-size: 0.95rem;
        }

        .exam-tip-box {
          padding: 1rem;
          background: #fef3c7;
          border-left: 4px solid #f59e0b;
          border-radius: 0.25rem;
        }

        .exam-tip-box h4 {
          color: #92400e;
          margin-bottom: 0.5rem;
          font-size: 0.95rem;
        }

        .exam-tip-box p {
          color: #78350f;
          font-size: 0.875rem;
          margin: 0;
          line-height: 1.5;
        }

        .quick-reference {
          padding: 1.5rem;
          background: white;
          border: 1px solid #e5e7eb;
          border-radius: 0.5rem;
        }

        .quick-reference h3 {
          color: #1f2937;
          margin-bottom: 1.5rem;
        }

        .reference-table {
          overflow-x: auto;
        }

        .table-header,
        .table-row {
          display: grid;
          grid-template-columns: 150px 1fr 150px 120px;
          gap: 1rem;
          padding: 0.75rem;
          border-bottom: 1px solid #e5e7eb;
        }

        .table-header {
          background: #f9fafb;
          font-weight: 600;
          color: #374151;
          position: sticky;
          top: 0;
        }

        .table-row:hover {
          background: #f9fafb;
        }

        .table-cell {
          display: flex;
          align-items: center;
          font-size: 0.875rem;
          color: #6b7280;
        }

        .table-cell code {
          background: #f3f4f6;
          padding: 0.25rem 0.5rem;
          border-radius: 0.25rem;
          font-family: monospace;
          color: #1f2937;
        }

        @media (max-width: 768px) {
          .side-by-side {
            grid-template-columns: 1fr;
          }

          .transformation-arrow {
            transform: rotate(90deg);
          }

          .benefits-considerations {
            grid-template-columns: 1fr;
          }

          .comparison-cards {
            grid-template-columns: 1fr;
          }

          .scenario-list {
            grid-template-columns: 1fr;
          }

          .requirements-section {
            grid-template-columns: 1fr;
          }

          .table-header,
          .table-row {
            grid-template-columns: 1fr;
          }

          .table-cell {
            padding: 0.5rem 0;
          }

          .score-row {
            grid-template-columns: 70px 1fr 30px;
          }
        }
      `}</style>
    </div>
  );
};

export default TopologyTransformer;
