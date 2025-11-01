/**
 * Topology Comparison Analyzer Component
 * Advanced topology analysis tool with SPOF detection, redundancy analysis, and exam scenarios
 */

import React, { useState, useMemo, useCallback } from 'react';
import { topologyDefinitions, threeTierModel, trafficFlowAnimations } from './topologies-data';
import type {
  TopologyType,
  TopologyDefinition,
  ComparisonMetrics,
  TrafficFlowType,
  TopologyNode,
  TopologyEdge,
} from './topologies-types';

interface TopologyAnalyzerProps {
  className?: string;
}

interface SPOFAnalysis {
  nodeId: string;
  label: string;
  isSPOF: boolean;
  impact: string;
  affectedNodes: string[];
  redundancy: number;
}

interface RedundancyMetrics {
  pathRedundancy: number;
  linkRedundancy: number;
  overallRedundancy: number;
  criticalPaths: string[];
}

interface ExamQuestion {
  id: string;
  difficulty: 'easy' | 'medium' | 'hard';
  question: string;
  options: string[];
  correctAnswer: number;
  explanation: string;
  topologyType: TopologyType;
}

export const TopologyAnalyzer: React.FC<TopologyAnalyzerProps> = ({ className = '' }) => {
  const [selectedTopologies, setSelectedTopologies] = useState<TopologyType[]>(['star', 'mesh']);
  const [nodeCount, setNodeCount] = useState(4);
  const [showTrafficFlow, setShowTrafficFlow] = useState(false);
  const [activeTrafficType, setActiveTrafficType] = useState<TrafficFlowType>('north-south');
  const [showThreeTier, setShowThreeTier] = useState(false);
  const [showAnalysis, setShowAnalysis] = useState(false);
  const [showExamQuestions, setShowExamQuestions] = useState(false);
  const [selectedQuestion, setSelectedQuestion] = useState<ExamQuestion | null>(null);
  const [userAnswers, setUserAnswers] = useState<Record<string, number>>({});

  const selectedTopologyData = useMemo(() => {
    return topologyDefinitions.filter((t) => selectedTopologies.includes(t.id));
  }, [selectedTopologies]);

  const comparisonMetrics = useMemo((): ComparisonMetrics[] => {
    return selectedTopologyData.map((topology) => {
      const chars = topology.characteristics;
      return {
        topology: topology.id,
        scores: {
          faultTolerance:
            chars.faultTolerance.level === 'very-high'
              ? 100
              : chars.faultTolerance.level === 'high'
                ? 75
                : chars.faultTolerance.level === 'medium'
                  ? 50
                  : 25,
          scalability:
            chars.scalability.level === 'high'
              ? 90
              : chars.scalability.level === 'medium'
                ? 60
                : 30,
          cost:
            chars.cost.initial === 'low'
              ? 90
              : chars.cost.initial === 'medium'
                ? 60
                : chars.cost.initial === 'high'
                  ? 30
                  : 10,
          performance: 100 - chars.trafficFlow.bottlenecks.length * 20,
          complexity: chars.scalability.limitations.length < 3 ? 80 : 40,
        },
        nodeCount: topology.nodes.length,
        edgeCount: topology.edges.length,
        avgPathLength: topology.edges.length / topology.nodes.length,
      };
    });
  }, [selectedTopologyData]);

  const calculateCables = (topology: TopologyDefinition) => {
    return topology.characteristics.cableRequirements.forNodes(nodeCount);
  };

  const toggleTopology = (topology: TopologyType) => {
    setSelectedTopologies((prev) =>
      prev.includes(topology) ? prev.filter((t) => t !== topology) : [...prev, topology].slice(-3)
    );
  };

  // SPOF Analysis: Identify single points of failure
  const analyzeSPOF = useCallback((topology: TopologyDefinition): SPOFAnalysis[] => {
    const analysis: SPOFAnalysis[] = [];

    topology.nodes.forEach((node) => {
      const connectedEdges = topology.edges.filter(
        (e) => e.source === node.id || e.target === node.id
      );
      const affectedNodes = connectedEdges.map((e) => (e.source === node.id ? e.target : e.source));
      const redundancy = connectedEdges.length;

      analysis.push({
        nodeId: node.id,
        label: node.label,
        isSPOF: redundancy === 1 && node.type !== 'host',
        impact: redundancy === 1 ? 'Critical' : redundancy === 2 ? 'High' : 'Low',
        affectedNodes,
        redundancy,
      });
    });

    return analysis;
  }, []);

  // Calculate redundancy metrics
  const analyzeRedundancy = useCallback((topology: TopologyDefinition): RedundancyMetrics => {
    const nodeCount = topology.nodes.length;
    const edgeCount = topology.edges.length;

    // Theoretical minimum edges for connectivity: n-1
    const minConnectivity = nodeCount - 1;
    const pathRedundancy =
      edgeCount > minConnectivity ? ((edgeCount - minConnectivity) / minConnectivity) * 100 : 0;

    // Link redundancy: percentage of redundant links
    const redundantLinks = topology.edges.filter((e) => e.type === 'redundant').length;
    const linkRedundancy = (redundantLinks / edgeCount) * 100;

    // Overall redundancy score
    const overallRedundancy = (pathRedundancy + linkRedundancy) / 2;

    // Find critical paths
    const criticalPaths: string[] = [];
    topology.nodes.forEach((node) => {
      const connections = topology.edges.filter(
        (e) => e.source === node.id || e.target === node.id
      );
      if (connections.length === 1) {
        criticalPaths.push(`${node.label} (1 connection)`);
      }
    });

    return {
      pathRedundancy: Math.round(pathRedundancy),
      linkRedundancy: Math.round(linkRedundancy),
      overallRedundancy: Math.round(overallRedundancy),
      criticalPaths,
    };
  }, []);

  // Generate exam questions for topology
  const generateExamQuestions = useCallback((): ExamQuestion[] => {
    const questions: ExamQuestion[] = [];

    selectedTopologyData.forEach((topology) => {
      if (topology.id === 'star') {
        questions.push({
          id: 'star-1',
          difficulty: 'easy',
          question: 'In a star topology, what happens when the central hub fails?',
          options: [
            'Only devices connected to that hub are affected',
            'The entire network becomes disconnected',
            'Other hubs in the network are unaffected',
            'Traffic automatically reroutes through backup links',
          ],
          correctAnswer: 1,
          explanation:
            'Star topologies have a single point of failure. When the central device fails, all nodes lose connectivity.',
          topologyType: 'star',
        });
      } else if (topology.id === 'mesh') {
        questions.push({
          id: 'mesh-1',
          difficulty: 'hard',
          question: 'How many cables are required for a full mesh topology with 6 nodes?',
          options: ['5', '6', '15', '30'],
          correctAnswer: 2,
          explanation:
            'Full mesh uses formula n(n-1)/2 = 6(5)/2 = 15 cables for direct connections between all nodes.',
          topologyType: 'mesh',
        });
      }
    });

    return questions;
  }, [selectedTopologyData]);

  return (
    <div className={`topology-analyzer ${className}`}>
      {/* Header */}
      <div className="analyzer-header">
        <h2>Network Topology Comparison Analyzer</h2>
        <p>
          Compare different network topologies based on cost, scalability, fault tolerance, and
          traffic patterns
        </p>
      </div>

      {/* Topology Selection */}
      <div className="topology-selection">
        <h3>Select Topologies to Compare (max 3)</h3>
        <div className="topology-buttons">
          {topologyDefinitions.map((topology) => (
            <button
              key={topology.id}
              className={`topology-btn ${selectedTopologies.includes(topology.id) ? 'active' : ''}`}
              onClick={() => toggleTopology(topology.id)}
              disabled={selectedTopologies.length >= 3 && !selectedTopologies.includes(topology.id)}
            >
              {topology.name}
            </button>
          ))}
        </div>
      </div>

      {/* Node Count Slider */}
      <div className="node-count-control">
        <label>Number of Nodes: {nodeCount}</label>
        <input
          type="range"
          min="3"
          max="20"
          value={nodeCount}
          onChange={(e) => setNodeCount(Number(e.target.value))}
          className="slider"
        />
      </div>

      {/* Comparison Grid */}
      <div className="comparison-grid">
        {selectedTopologyData.map((topology) => (
          <div key={topology.id} className="topology-card">
            <h3>{topology.name}</h3>
            <p className="description">{topology.description}</p>

            {/* Cable Requirements */}
            <div className="metric-section">
              <h4>Cable Requirements</h4>
              <div className="metric-value">
                <span className="formula">
                  {topology.characteristics.cableRequirements.formula}
                </span>
                <span className="calculation">
                  For {nodeCount} nodes: <strong>{calculateCables(topology)} cables</strong>
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
                  Maintenance:{' '}
                  <strong>{topology.characteristics.cost.maintenance.toUpperCase()}</strong>
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
        ))}
      </div>

      {/* Radar Chart Comparison */}
      <div className="radar-comparison">
        <h3>Overall Comparison</h3>
        <div className="comparison-table">
          <table>
            <thead>
              <tr>
                <th>Metric</th>
                {selectedTopologyData.map((t) => (
                  <th key={t.id}>{t.name}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {comparisonMetrics.length > 0 &&
                Object.keys(comparisonMetrics[0].scores).map((metric) => (
                  <tr key={metric}>
                    <td className="metric-name">{metric.replace(/([A-Z])/g, ' $1').trim()}</td>
                    {comparisonMetrics.map((cm) => (
                      <td key={cm.topology}>
                        <div className="score-bar">
                          <div
                            className="score-fill"
                            style={{
                              width: `${cm.scores[metric as keyof typeof cm.scores]}%`,
                            }}
                          >
                            {cm.scores[metric as keyof typeof cm.scores]}
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

      {/* Three-Tier Model Explorer */}
      <div className="three-tier-explorer">
        <button className="toggle-btn" onClick={() => setShowThreeTier(!showThreeTier)}>
          {showThreeTier ? 'Hide' : 'Show'} Three-Tier Model Details
        </button>

        {showThreeTier && (
          <div className="three-tier-details">
            <h3>Three-Tier Hierarchical Model</h3>

            {/* Core Layer */}
            <div className="layer-section core">
              <h4>{threeTierModel.layers.core.name}</h4>
              <div className="layer-content">
                <div className="subsection">
                  <h5>Functions</h5>
                  <ul>
                    {threeTierModel.layers.core.functions.map((func, idx) => (
                      <li key={idx}>{func}</li>
                    ))}
                  </ul>
                </div>
                <div className="subsection">
                  <h5>Requirements</h5>
                  <ul>
                    {threeTierModel.layers.core.requirements.map((req, idx) => (
                      <li key={idx}>{req}</li>
                    ))}
                  </ul>
                </div>
                <div className="subsection">
                  <h5>Typical Devices</h5>
                  <ul>
                    {threeTierModel.layers.core.devices.map((device, idx) => (
                      <li key={idx}>{device}</li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>

            {/* Distribution Layer */}
            <div className="layer-section distribution">
              <h4>{threeTierModel.layers.distribution.name}</h4>
              <div className="layer-content">
                <div className="subsection">
                  <h5>Responsibilities</h5>
                  <ul>
                    {threeTierModel.layers.distribution.responsibilities.map((resp, idx) => (
                      <li key={idx}>{resp}</li>
                    ))}
                  </ul>
                </div>
                <div className="subsection">
                  <h5>Features</h5>
                  <ul>
                    {threeTierModel.layers.distribution.features.map((feature, idx) => (
                      <li key={idx}>{feature}</li>
                    ))}
                  </ul>
                </div>
                <div className="subsection">
                  <h5>Typical Devices</h5>
                  <ul>
                    {threeTierModel.layers.distribution.devices.map((device, idx) => (
                      <li key={idx}>{device}</li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>

            {/* Access Layer */}
            <div className="layer-section access">
              <h4>{threeTierModel.layers.access.name}</h4>
              <div className="layer-content">
                <div className="subsection">
                  <h5>Characteristics</h5>
                  <ul>
                    {threeTierModel.layers.access.characteristics.map((char, idx) => (
                      <li key={idx}>{char}</li>
                    ))}
                  </ul>
                </div>
                <div className="subsection">
                  <h5>Functions</h5>
                  <ul>
                    {threeTierModel.layers.access.functions.map((func, idx) => (
                      <li key={idx}>{func}</li>
                    ))}
                  </ul>
                </div>
                <div className="subsection">
                  <h5>Typical Devices</h5>
                  <ul>
                    {threeTierModel.layers.access.devices.map((device, idx) => (
                      <li key={idx}>{device}</li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>

            {/* Collapsed Core */}
            <div className="collapsed-core-section">
              <h4>Collapsed Core Variation</h4>
              <p className="description">{threeTierModel.collapsedCore.description}</p>

              <div className="subsection">
                <h5>When to Use</h5>
                <ul>
                  {threeTierModel.collapsedCore.whenToUse.map((item, idx) => (
                    <li key={idx}>{item}</li>
                  ))}
                </ul>
              </div>

              <div className="benefits-limitations">
                <div className="benefits">
                  <h5>Benefits</h5>
                  <ul>
                    {threeTierModel.collapsedCore.benefits.map((benefit, idx) => (
                      <li key={idx}>{benefit}</li>
                    ))}
                  </ul>
                </div>
                <div className="limitations">
                  <h5>Limitations</h5>
                  <ul>
                    {threeTierModel.collapsedCore.limitations.map((limit, idx) => (
                      <li key={idx}>{limit}</li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Topology Analysis Section */}
      <div className="analysis-section-container">
        <button className="toggle-btn" onClick={() => setShowAnalysis(!showAnalysis)}>
          {showAnalysis ? 'Hide' : 'Show'} Detailed Topology Analysis
        </button>

        {showAnalysis && (
          <div className="analysis-details">
            <h3>Topology Analysis</h3>

            {selectedTopologyData.map((topology) => {
              const spofData = analyzeSPOF(topology);
              const redundancyData = analyzeRedundancy(topology);
              const spofCount = spofData.filter((s) => s.isSPOF).length;

              return (
                <div key={topology.id} className="topology-analysis">
                  <h4>{topology.name} - Detailed Analysis</h4>

                  {/* SPOF Analysis */}
                  <div className="spof-analysis">
                    <h5>Single Points of Failure (SPOF) Detection</h5>
                    <div className="spof-summary">
                      <div className="spof-badge">
                        <span className={`count ${spofCount === 0 ? 'safe' : 'critical'}`}>
                          {spofCount} SPOF{spofCount !== 1 ? 's' : ''}
                        </span>
                        <span className="label">Found</span>
                      </div>
                    </div>

                    {spofData.length > 0 && (
                      <div className="spof-details">
                        {spofData.map((spof) => (
                          <div
                            key={spof.nodeId}
                            className={`spof-item ${spof.isSPOF ? 'critical' : 'safe'}`}
                          >
                            <div className="spof-header">
                              <span className="node-label">{spof.label}</span>
                              <span className={`impact-badge ${spof.impact.toLowerCase()}`}>
                                {spof.impact} Risk
                              </span>
                            </div>
                            <div className="spof-info">
                              <div className="info-row">
                                <span className="label">Connections:</span>
                                <span className="value">{spof.redundancy}</span>
                              </div>
                              {spof.affectedNodes.length > 0 && (
                                <div className="info-row">
                                  <span className="label">Affects:</span>
                                  <span className="value">{spof.affectedNodes.join(', ')}</span>
                                </div>
                              )}
                              {spof.isSPOF && (
                                <div className="warning">
                                  This node is a single point of failure. Network interruption
                                  occurs if it fails.
                                </div>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Redundancy Metrics */}
                  <div className="redundancy-metrics">
                    <h5>Redundancy Analysis</h5>
                    <div className="metrics-grid">
                      <div className="metric-card">
                        <span className="label">Path Redundancy</span>
                        <span className="value">{redundancyData.pathRedundancy}%</span>
                        <span className="description">Extra paths beyond minimum</span>
                      </div>
                      <div className="metric-card">
                        <span className="label">Link Redundancy</span>
                        <span className="value">{redundancyData.linkRedundancy}%</span>
                        <span className="description">Redundant links</span>
                      </div>
                      <div className="metric-card">
                        <span className="label">Overall Score</span>
                        <span className="value">{redundancyData.overallRedundancy}%</span>
                        <span className="description">Combined redundancy</span>
                      </div>
                    </div>

                    {redundancyData.criticalPaths.length > 0 && (
                      <div className="critical-paths">
                        <h6>Critical Paths Identified</h6>
                        <ul>
                          {redundancyData.criticalPaths.map((path, idx) => (
                            <li key={idx}>{path}</li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Exam Questions Section */}
      <div className="exam-section-container">
        <button className="toggle-btn" onClick={() => setShowExamQuestions(!showExamQuestions)}>
          {showExamQuestions ? 'Hide' : 'Show'} Exam Questions
        </button>

        {showExamQuestions && (
          <div className="exam-details">
            <h3>CompTIA Network+ Exam Scenarios</h3>
            <p className="intro-text">Test your knowledge with topology-specific exam questions</p>

            {generateExamQuestions().length > 0 ? (
              <div className="questions-container">
                {generateExamQuestions().map((question) => {
                  const userAnswer = userAnswers[question.id];
                  const isAnswered = userAnswer !== undefined;
                  const isCorrect = isAnswered && userAnswer === question.correctAnswer;

                  return (
                    <div
                      key={question.id}
                      className={`question-card ${isAnswered ? (isCorrect ? 'correct' : 'incorrect') : ''}`}
                    >
                      <div className="question-header">
                        <span className="difficulty-badge">{question.difficulty}</span>
                        <span className="topology-tag">{question.topologyType}</span>
                      </div>

                      <p className="question-text">{question.question}</p>

                      <div className="options">
                        {question.options.map((option, idx) => (
                          <button
                            key={idx}
                            className={`option ${
                              userAnswer === idx
                                ? idx === question.correctAnswer
                                  ? 'selected-correct'
                                  : 'selected-wrong'
                                : idx === question.correctAnswer && isAnswered
                                  ? 'correct-answer'
                                  : ''
                            }`}
                            onClick={() => setUserAnswers({ ...userAnswers, [question.id]: idx })}
                          >
                            <span className="option-letter">{String.fromCharCode(65 + idx)}</span>
                            <span className="option-text">{option}</span>
                          </button>
                        ))}
                      </div>

                      {isAnswered && (
                        <div className={`feedback ${isCorrect ? 'correct' : 'incorrect'}`}>
                          <strong>{isCorrect ? 'Correct!' : 'Incorrect'}</strong>
                          <p>{question.explanation}</p>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            ) : (
              <p className="no-questions">Select topologies to see exam questions</p>
            )}
          </div>
        )}
      </div>

      {/* Traffic Flow Visualizer */}
      <div className="traffic-visualizer">
        <h3>Traffic Flow Visualizer</h3>
        <div className="traffic-controls">
          <button
            className={activeTrafficType === 'north-south' ? 'active' : ''}
            onClick={() => setActiveTrafficType('north-south')}
          >
            North-South Traffic
          </button>
          <button
            className={activeTrafficType === 'east-west' ? 'active' : ''}
            onClick={() => setActiveTrafficType('east-west')}
          >
            East-West Traffic
          </button>
          <button onClick={() => setShowTrafficFlow(!showTrafficFlow)}>
            {showTrafficFlow ? 'Stop' : 'Start'} Animation
          </button>
        </div>

        <div className="traffic-description">
          {activeTrafficType === 'north-south' ? (
            <div>
              <h4>North-South Traffic</h4>
              <p>
                Client-to-server communication flowing vertically through network layers. Typical
                for web requests, API calls, and external access.
              </p>
            </div>
          ) : (
            <div>
              <h4>East-West Traffic</h4>
              <p>
                Server-to-server communication flowing horizontally within data center. Dominant in
                modern microservices and distributed applications.
              </p>
            </div>
          )}
        </div>

        <div className="traffic-animations">
          {trafficFlowAnimations
            .filter((anim) => anim.type === activeTrafficType)
            .map((anim) => (
              <div key={anim.id} className="animation-item">
                <div className="animation-header">
                  <span className="name">{anim.name}</span>
                  <span className="duration">{anim.duration}ms</span>
                </div>
                <div className="path">
                  {anim.path.map((node, idx) => (
                    <React.Fragment key={idx}>
                      <span className="node" style={{ borderColor: anim.color }}>
                        {node}
                      </span>
                      {idx < anim.path.length - 1 && (
                        <span className="arrow" style={{ color: anim.color }}>
                          →
                        </span>
                      )}
                    </React.Fragment>
                  ))}
                </div>
                <p className="description">{anim.description}</p>
                {showTrafficFlow && (
                  <div
                    className="traffic-pulse"
                    style={{
                      backgroundColor: anim.color,
                      animationDuration: `${anim.duration}ms`,
                    }}
                  />
                )}
              </div>
            ))}
        </div>
      </div>

      <style>{`
        .topology-analyzer {
          padding: 2rem;
          max-width: 1400px;
          margin: 0 auto;
        }

        .analyzer-header {
          text-align: center;
          margin-bottom: 2rem;
        }

        .analyzer-header h2 {
          font-size: 2rem;
          color: #1f2937;
          margin-bottom: 0.5rem;
        }

        .analyzer-header p {
          color: #6b7280;
          font-size: 1rem;
        }

        .topology-selection {
          margin-bottom: 2rem;
        }

        .topology-selection h3 {
          margin-bottom: 1rem;
          color: #374151;
        }

        .topology-buttons {
          display: flex;
          flex-wrap: wrap;
          gap: 0.5rem;
        }

        .topology-btn {
          padding: 0.75rem 1.5rem;
          border: 2px solid #d1d5db;
          background: white;
          border-radius: 0.5rem;
          cursor: pointer;
          transition: all 0.2s;
        }

        .topology-btn:hover:not(:disabled) {
          border-color: #3b82f6;
          background: #eff6ff;
        }

        .topology-btn.active {
          border-color: #3b82f6;
          background: #3b82f6;
          color: white;
        }

        .topology-btn:disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }

        .node-count-control {
          margin-bottom: 2rem;
          padding: 1rem;
          background: #f9fafb;
          border-radius: 0.5rem;
        }

        .node-count-control label {
          display: block;
          margin-bottom: 0.5rem;
          font-weight: 600;
        }

        .slider {
          width: 100%;
          height: 8px;
          border-radius: 4px;
          background: #d1d5db;
          outline: none;
          -webkit-appearance: none;
        }

        .slider::-webkit-slider-thumb {
          -webkit-appearance: none;
          appearance: none;
          width: 20px;
          height: 20px;
          border-radius: 50%;
          background: #3b82f6;
          cursor: pointer;
        }

        .comparison-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
          gap: 1.5rem;
          margin-bottom: 2rem;
        }

        .topology-card {
          border: 1px solid #e5e7eb;
          border-radius: 0.5rem;
          padding: 1.5rem;
          background: white;
        }

        .topology-card h3 {
          color: #1f2937;
          margin-bottom: 0.5rem;
        }

        .topology-card > .description {
          color: #6b7280;
          font-size: 0.875rem;
          margin-bottom: 1rem;
        }

        .metric-section {
          margin-bottom: 1.5rem;
          padding-bottom: 1rem;
          border-bottom: 1px solid #f3f4f6;
        }

        .metric-section:last-child {
          border-bottom: none;
        }

        .metric-section h4 {
          color: #374151;
          font-size: 1rem;
          margin-bottom: 0.75rem;
        }

        .metric-value {
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
        }

        .formula {
          font-family: monospace;
          background: #f3f4f6;
          padding: 0.25rem 0.5rem;
          border-radius: 0.25rem;
        }

        .calculation {
          font-size: 0.875rem;
        }

        .tolerance-level,
        .scalability-info,
        .cost-levels {
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
          margin-bottom: 0.5rem;
        }

        .level {
          display: inline-block;
          padding: 0.25rem 0.75rem;
          border-radius: 0.25rem;
          font-size: 0.75rem;
          font-weight: 600;
          width: fit-content;
        }

        .level.very-high {
          background: #dcfce7;
          color: #166534;
        }

        .level.high {
          background: #dbeafe;
          color: #1e40af;
        }

        .level.medium {
          background: #fef3c7;
          color: #92400e;
        }

        .level.low {
          background: #fee2e2;
          color: #991b1b;
        }

        .cost-breakdown {
          margin-top: 0.5rem;
        }

        .breakdown-item {
          margin-bottom: 0.5rem;
        }

        .breakdown-item .label {
          display: block;
          font-size: 0.75rem;
          text-transform: capitalize;
          margin-bottom: 0.25rem;
        }

        .bar-container {
          background: #f3f4f6;
          border-radius: 0.25rem;
          overflow: hidden;
        }

        .bar {
          background: linear-gradient(90deg, #3b82f6, #2563eb);
          color: white;
          padding: 0.25rem 0.5rem;
          font-size: 0.75rem;
          font-weight: 600;
          text-align: right;
        }

        .traffic-split {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 0.5rem;
          margin-bottom: 0.5rem;
        }

        .traffic-item {
          padding: 0.5rem;
          border-radius: 0.25rem;
          display: flex;
          justify-content: space-between;
        }

        .traffic-item.north-south {
          background: #dbeafe;
          color: #1e40af;
        }

        .traffic-item.east-west {
          background: #d1fae5;
          color: #065f46;
        }

        .use-cases,
        .limitations ul,
        .bottlenecks ul {
          list-style: none;
          padding-left: 0;
        }

        .use-cases li,
        .limitations li,
        .bottlenecks li {
          padding-left: 1.5rem;
          position: relative;
          margin-bottom: 0.25rem;
          font-size: 0.875rem;
        }

        .use-cases li::before,
        .limitations li::before,
        .bottlenecks li::before {
          content: '•';
          position: absolute;
          left: 0.5rem;
          color: #3b82f6;
        }

        .radar-comparison {
          margin-bottom: 2rem;
          padding: 1.5rem;
          background: white;
          border: 1px solid #e5e7eb;
          border-radius: 0.5rem;
        }

        .comparison-table {
          overflow-x: auto;
        }

        table {
          width: 100%;
          border-collapse: collapse;
        }

        th,
        td {
          padding: 0.75rem;
          text-align: left;
          border-bottom: 1px solid #f3f4f6;
        }

        th {
          background: #f9fafb;
          font-weight: 600;
          color: #374151;
        }

        .metric-name {
          font-weight: 500;
          text-transform: capitalize;
        }

        .score-bar {
          background: #f3f4f6;
          border-radius: 0.25rem;
          overflow: hidden;
          height: 24px;
        }

        .score-fill {
          background: linear-gradient(90deg, #10b981, #059669);
          height: 100%;
          display: flex;
          align-items: center;
          justify-content: flex-end;
          padding-right: 0.5rem;
          color: white;
          font-size: 0.75rem;
          font-weight: 600;
          transition: width 0.3s ease;
        }

        .three-tier-explorer {
          margin-bottom: 2rem;
        }

        .toggle-btn {
          padding: 0.75rem 1.5rem;
          background: #3b82f6;
          color: white;
          border: none;
          border-radius: 0.5rem;
          cursor: pointer;
          font-weight: 600;
        }

        .toggle-btn:hover {
          background: #2563eb;
        }

        .three-tier-details {
          margin-top: 1rem;
          padding: 1.5rem;
          background: white;
          border: 1px solid #e5e7eb;
          border-radius: 0.5rem;
        }

        .layer-section {
          margin-bottom: 2rem;
          padding: 1rem;
          border-radius: 0.5rem;
        }

        .layer-section.core {
          background: #fef3c7;
          border-left: 4px solid #f59e0b;
        }

        .layer-section.distribution {
          background: #dbeafe;
          border-left: 4px solid #3b82f6;
        }

        .layer-section.access {
          background: #d1fae5;
          border-left: 4px solid #10b981;
        }

        .layer-content {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
          gap: 1rem;
          margin-top: 1rem;
        }

        .subsection h5 {
          color: #374151;
          margin-bottom: 0.5rem;
        }

        .subsection ul {
          list-style: none;
          padding-left: 0;
        }

        .subsection li {
          padding-left: 1.5rem;
          position: relative;
          margin-bottom: 0.25rem;
          font-size: 0.875rem;
        }

        .subsection li::before {
          content: '✓';
          position: absolute;
          left: 0.5rem;
          color: #10b981;
        }

        .collapsed-core-section {
          padding: 1rem;
          background: #f9fafb;
          border-radius: 0.5rem;
        }

        .benefits-limitations {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 1rem;
          margin-top: 1rem;
        }

        .benefits h5 {
          color: #059669;
        }

        .limitations h5 {
          color: #dc2626;
        }

        .traffic-visualizer {
          padding: 1.5rem;
          background: white;
          border: 1px solid #e5e7eb;
          border-radius: 0.5rem;
        }

        .traffic-controls {
          display: flex;
          gap: 0.5rem;
          margin-bottom: 1rem;
        }

        .traffic-controls button {
          padding: 0.5rem 1rem;
          border: 2px solid #d1d5db;
          background: white;
          border-radius: 0.5rem;
          cursor: pointer;
        }

        .traffic-controls button.active {
          border-color: #3b82f6;
          background: #3b82f6;
          color: white;
        }

        .traffic-description {
          margin-bottom: 1rem;
          padding: 1rem;
          background: #f9fafb;
          border-radius: 0.5rem;
        }

        .animation-item {
          margin-bottom: 1rem;
          padding: 1rem;
          border: 1px solid #e5e7eb;
          border-radius: 0.5rem;
          position: relative;
        }

        .animation-header {
          display: flex;
          justify-content: space-between;
          margin-bottom: 0.5rem;
        }

        .path {
          display: flex;
          align-items: center;
          flex-wrap: wrap;
          gap: 0.5rem;
          margin: 1rem 0;
        }

        .node {
          padding: 0.5rem 1rem;
          border: 2px solid;
          border-radius: 0.5rem;
          background: white;
          font-size: 0.875rem;
        }

        .arrow {
          font-size: 1.5rem;
          font-weight: bold;
        }

        .traffic-pulse {
          position: absolute;
          top: 0;
          left: 0;
          width: 4px;
          height: 100%;
          border-radius: 0.25rem;
          animation: pulse 2s ease-in-out infinite;
        }

        @keyframes pulse {
          0%,
          100% {
            opacity: 0.3;
          }
          50% {
            opacity: 1;
          }
        }

        /* Analysis Section Styles */
        .analysis-section-container,
        .exam-section-container {
          margin-bottom: 2rem;
        }

        .analysis-details,
        .exam-details {
          margin-top: 1rem;
          padding: 1.5rem;
          background: white;
          border: 1px solid #e5e7eb;
          border-radius: 0.5rem;
        }

        .topology-analysis {
          margin-bottom: 2rem;
          padding: 1.5rem;
          border: 1px solid #f3f4f6;
          border-radius: 0.5rem;
          background: #f9fafb;
        }

        .spof-analysis,
        .redundancy-metrics {
          margin-bottom: 1.5rem;
        }

        .spof-analysis h5,
        .redundancy-metrics h5 {
          color: #374151;
          margin-bottom: 1rem;
        }

        .spof-summary {
          display: flex;
          gap: 1rem;
          margin-bottom: 1rem;
        }

        .spof-badge {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 0.25rem;
          padding: 1rem;
          background: white;
          border-radius: 0.5rem;
          min-width: 120px;
          text-align: center;
        }

        .spof-badge .count {
          font-size: 1.75rem;
          font-weight: 700;
        }

        .spof-badge .count.safe {
          color: #059669;
        }

        .spof-badge .count.critical {
          color: #dc2626;
        }

        .spof-badge .label {
          font-size: 0.875rem;
          color: #6b7280;
        }

        .spof-details {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
          gap: 1rem;
        }

        .spof-item {
          padding: 1rem;
          border: 1px solid #e5e7eb;
          border-radius: 0.5rem;
          background: white;
        }

        .spof-item.critical {
          border-color: #dc2626;
          background: #fef2f2;
        }

        .spof-item.safe {
          border-color: #10b981;
          background: #f0fdf4;
        }

        .spof-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 0.75rem;
        }

        .node-label {
          font-weight: 600;
          color: #374151;
        }

        .impact-badge {
          font-size: 0.75rem;
          font-weight: 600;
          padding: 0.25rem 0.75rem;
          border-radius: 0.25rem;
        }

        .impact-badge.critical {
          background: #fecaca;
          color: #991b1b;
        }

        .impact-badge.high {
          background: #fed7aa;
          color: #92400e;
        }

        .impact-badge.low {
          background: #d1fae5;
          color: #065f46;
        }

        .spof-info {
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
        }

        .info-row {
          display: flex;
          gap: 0.5rem;
          font-size: 0.875rem;
        }

        .info-row .label {
          color: #6b7280;
          font-weight: 500;
        }

        .info-row .value {
          color: #374151;
          font-weight: 600;
        }

        .warning {
          margin-top: 0.5rem;
          padding: 0.75rem;
          background: #fecaca;
          border-left: 3px solid #dc2626;
          color: #7f1d1d;
          font-size: 0.875rem;
          border-radius: 0.25rem;
        }

        .metrics-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
          gap: 1rem;
          margin-bottom: 1rem;
        }

        .metric-card {
          padding: 1rem;
          background: white;
          border: 1px solid #e5e7eb;
          border-radius: 0.5rem;
          text-align: center;
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
        }

        .metric-card .label {
          font-size: 0.875rem;
          color: #6b7280;
          font-weight: 500;
        }

        .metric-card .value {
          font-size: 1.75rem;
          font-weight: 700;
          color: #3b82f6;
        }

        .metric-card .description {
          font-size: 0.75rem;
          color: #9ca3af;
        }

        .critical-paths {
          padding: 1rem;
          background: white;
          border: 1px solid #e5e7eb;
          border-radius: 0.5rem;
        }

        .critical-paths h6 {
          color: #374151;
          margin-bottom: 0.5rem;
          font-weight: 600;
        }

        .critical-paths ul {
          list-style: none;
          padding-left: 0;
        }

        .critical-paths li {
          padding: 0.25rem 0;
          color: #6b7280;
          font-size: 0.875rem;
          padding-left: 1.5rem;
          position: relative;
        }

        .critical-paths li::before {
          content: '⚠';
          position: absolute;
          left: 0;
          color: #f59e0b;
        }

        /* Exam Section Styles */
        .exam-details {
          padding: 1.5rem;
        }

        .intro-text {
          color: #6b7280;
          margin-bottom: 1.5rem;
          font-size: 0.95rem;
        }

        .questions-container {
          display: grid;
          gap: 1.5rem;
        }

        .question-card {
          padding: 1.5rem;
          border: 1px solid #e5e7eb;
          border-radius: 0.5rem;
          background: white;
        }

        .question-card.correct {
          border-color: #10b981;
          background: #f0fdf4;
        }

        .question-card.incorrect {
          border-color: #dc2626;
          background: #fef2f2;
        }

        .question-header {
          display: flex;
          gap: 0.5rem;
          margin-bottom: 1rem;
        }

        .difficulty-badge {
          display: inline-block;
          padding: 0.25rem 0.75rem;
          border-radius: 0.25rem;
          font-size: 0.75rem;
          font-weight: 600;
          text-transform: uppercase;
          background: #fef3c7;
          color: #92400e;
        }

        .difficulty-badge:has(+ .topology-tag) {
          margin-right: 0.5rem;
        }

        .topology-tag {
          display: inline-block;
          padding: 0.25rem 0.75rem;
          border-radius: 0.25rem;
          font-size: 0.75rem;
          font-weight: 600;
          text-transform: capitalize;
          background: #dbeafe;
          color: #1e40af;
        }

        .question-text {
          color: #1f2937;
          font-weight: 500;
          margin-bottom: 1rem;
          font-size: 0.95rem;
        }

        .options {
          display: grid;
          gap: 0.75rem;
          margin-bottom: 1rem;
        }

        .option {
          display: flex;
          align-items: flex-start;
          gap: 0.75rem;
          padding: 0.75rem 1rem;
          border: 2px solid #e5e7eb;
          background: white;
          border-radius: 0.5rem;
          cursor: pointer;
          transition: all 0.2s;
          text-align: left;
        }

        .option:hover {
          border-color: #3b82f6;
          background: #eff6ff;
        }

        .option.selected-correct {
          border-color: #10b981;
          background: #d1fae5;
          color: #065f46;
        }

        .option.selected-wrong {
          border-color: #dc2626;
          background: #fee2e2;
          color: #991b1b;
        }

        .option.correct-answer {
          border-color: #10b981;
          background: #d1fae5;
        }

        .option-letter {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          width: 24px;
          height: 24px;
          border-radius: 50%;
          font-weight: 600;
          background: rgba(59, 130, 246, 0.1);
          color: #3b82f6;
          flex-shrink: 0;
        }

        .option.selected-correct .option-letter,
        .option.correct-answer .option-letter {
          background: #10b981;
          color: white;
        }

        .option.selected-wrong .option-letter {
          background: #dc2626;
          color: white;
        }

        .option-text {
          flex: 1;
        }

        .feedback {
          margin-top: 1rem;
          padding: 1rem;
          border-radius: 0.5rem;
          font-size: 0.875rem;
        }

        .feedback.correct {
          background: #d1fae5;
          border-left: 3px solid #10b981;
          color: #065f46;
        }

        .feedback.incorrect {
          background: #fee2e2;
          border-left: 3px solid #dc2626;
          color: #991b1b;
        }

        .feedback p {
          margin-top: 0.5rem;
          margin-bottom: 0;
        }

        .no-questions {
          text-align: center;
          color: #9ca3af;
          padding: 2rem;
        }
      `}</style>
    </div>
  );
};

export default TopologyAnalyzer;
