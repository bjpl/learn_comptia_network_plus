/**
 * Enhanced Topology Comparison Analyzer Component
 * Advanced topology analysis tool with improved UI/UX and comprehensive learning features
 *
 * Key Enhancements:
 * - Smooth animations and micro-interactions
 * - Interactive tooltips with Network+ exam tips
 * - Enhanced visual design with consistent styling
 * - Real-time validation and feedback
 * - Improved accessibility (ARIA labels, keyboard navigation)
 * - Comprehensive learning callouts
 */

import React, { useState, useMemo, useCallback } from 'react';
import { topologyDefinitions, threeTierModel, trafficFlowAnimations } from './topologies-data';
import type {
  TopologyType,
  TopologyDefinition,
  ComparisonMetrics,
  TrafficFlowType,
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

interface Tooltip {
  id: string;
  content: string;
  examTip: string;
  position: { x: number; y: number };
}

export const TopologyAnalyzerEnhanced: React.FC<TopologyAnalyzerProps> = ({ className = '' }) => {
  const [selectedTopologies, setSelectedTopologies] = useState<TopologyType[]>(['star', 'mesh']);
  const [nodeCount, setNodeCount] = useState(4);
  const [showTrafficFlow, setShowTrafficFlow] = useState(false);
  const [activeTrafficType, setActiveTrafficType] = useState<TrafficFlowType>('north-south');
  const [showThreeTier, setShowThreeTier] = useState(false);
  const [showAnalysis, setShowAnalysis] = useState(false);
  const [showExamQuestions, setShowExamQuestions] = useState(false);
  const [selectedQuestion, setSelectedQuestion] = useState<ExamQuestion | null>(null);
  const [userAnswers, setUserAnswers] = useState<Record<string, number>>({});
  const [activeTooltip, setActiveTooltip] = useState<Tooltip | null>(null);
  const [hoveredTopology, setHoveredTopology] = useState<TopologyType | null>(null);

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
            'Star topologies have a single point of failure. When the central device fails, all nodes lose connectivity. This is a key weakness tested on Network+ exams.',
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
            'Full mesh uses formula n(n-1)/2 = 6(5)/2 = 15 cables for direct connections between all nodes. This formula is essential for Network+ calculations.',
          topologyType: 'mesh',
        });
      } else if (topology.id === 'spine-and-leaf') {
        questions.push({
          id: 'spine-leaf-1',
          difficulty: 'medium',
          question: 'What traffic pattern is spine-and-leaf topology optimized for?',
          options: [
            'North-south (client-to-server)',
            'East-west (server-to-server)',
            'Branch-to-headquarters',
            'Internet-to-DMZ',
          ],
          correctAnswer: 1,
          explanation:
            'Spine-and-leaf is designed for modern data centers with high east-west (server-to-server) traffic, typical in virtualized and cloud environments.',
          topologyType: 'spine-and-leaf',
        });
      }
    });

    return questions;
  }, [selectedTopologyData]);

  // Tooltip handling
  const showTooltip = (id: string, content: string, examTip: string, event: React.MouseEvent) => {
    setActiveTooltip({
      id,
      content,
      examTip,
      position: { x: event.clientX, y: event.clientY },
    });
  };

  const hideTooltip = () => {
    setActiveTooltip(null);
  };

  return (
    <div className={`topology-analyzer-enhanced ${className}`}>
      {/* Header with Enhanced Styling */}
      <div className="analyzer-header">
        <div className="header-content">
          <h2 className="header-title">Network Topology Comparison Analyzer</h2>
          <p className="header-subtitle">
            Compare different network topologies based on cost, scalability, fault tolerance, and
            traffic patterns. Interactive tool designed for CompTIA Network+ exam preparation.
          </p>
        </div>
        <div className="header-badge">
          <span className="badge-icon">📊</span>
          <span className="badge-text">Learning Objective 1.2</span>
        </div>
      </div>

      {/* Enhanced Topology Selection */}
      <div className="topology-selection-card">
        <div className="card-header">
          <h3 className="card-title">Select Topologies to Compare (max 3)</h3>
          <div
            className="info-icon"
            onMouseEnter={(e) =>
              showTooltip(
                'selection-tip',
                'Select up to 3 topologies for side-by-side comparison',
                'Exam Tip: Know the differences between star, mesh, and hybrid topologies for scenario-based questions',
                e
              )
            }
            onMouseLeave={hideTooltip}
          >
            ℹ️
          </div>
        </div>
        <div className="topology-buttons">
          {topologyDefinitions.map((topology) => (
            <button
              key={topology.id}
              className={`topology-btn ${selectedTopologies.includes(topology.id) ? 'active' : ''} ${
                hoveredTopology === topology.id ? 'hovered' : ''
              }`}
              onClick={() => toggleTopology(topology.id)}
              onMouseEnter={() => setHoveredTopology(topology.id)}
              onMouseLeave={() => setHoveredTopology(null)}
              disabled={selectedTopologies.length >= 3 && !selectedTopologies.includes(topology.id)}
              aria-pressed={selectedTopologies.includes(topology.id)}
              aria-label={`${topology.name} topology`}
            >
              <span className="btn-icon">🔷</span>
              <span className="btn-text">{topology.name}</span>
              {selectedTopologies.includes(topology.id) && (
                <span className="btn-check" aria-hidden="true">
                  ✓
                </span>
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Enhanced Node Count Slider */}
      <div className="node-count-card">
        <div className="slider-header">
          <label htmlFor="node-slider" className="slider-label">
            Number of Nodes: <strong className="slider-value">{nodeCount}</strong>
          </label>
          <div
            className="info-icon"
            onMouseEnter={(e) =>
              showTooltip(
                'nodes-tip',
                'Adjust the number of nodes to see how cabling requirements scale',
                'Exam Tip: Memorize cable formulas - Star: n, Mesh: n(n-1)/2',
                e
              )
            }
            onMouseLeave={hideTooltip}
          >
            ℹ️
          </div>
        </div>
        <input
          type="range"
          id="node-slider"
          min="3"
          max="20"
          value={nodeCount}
          onChange={(e) => setNodeCount(Number(e.target.value))}
          className="slider"
          aria-label="Number of network nodes"
          aria-valuemin={3}
          aria-valuemax={20}
          aria-valuenow={nodeCount}
        />
        <div className="slider-markers">
          <span>3</span>
          <span>11</span>
          <span>20</span>
        </div>
      </div>

      {/* Enhanced Comparison Grid */}
      <div className="comparison-grid">
        {selectedTopologyData.map((topology) => (
          <div
            key={topology.id}
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

            {/* Cable Requirements with Visual Enhancement */}
            <div className="metric-section-enhanced">
              <div className="metric-header">
                <h4>Cable Requirements</h4>
                <span
                  className="exam-badge"
                  onMouseEnter={(e) =>
                    showTooltip(
                      `cables-${topology.id}`,
                      'Cabling formula is essential for exam calculations',
                      `Exam Tip: ${topology.characteristics.cableRequirements.example}`,
                      e
                    )
                  }
                  onMouseLeave={hideTooltip}
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
                  <span className="result-value">{calculateCables(topology)} cables</span>
                </div>
              </div>
            </div>

            {/* Fault Tolerance with Status Indicator */}
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
              <p className="metric-description">
                {topology.characteristics.faultTolerance.description}
              </p>
            </div>

            {/* Scalability with Progress Bar */}
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

            {/* Cost Analysis with Visual Breakdown */}
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

            {/* Traffic Flow with Animation */}
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

            {/* Use Cases with Icons */}
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
                onClick={() => {
                  setShowAnalysis(true);
                  setTimeout(() => {
                    document
                      .querySelector('.analysis-section-container')
                      ?.scrollIntoView({ behavior: 'smooth' });
                  }, 100);
                }}
                aria-label={`Analyze ${topology.name} topology`}
              >
                <span className="btn-icon-small">🔍</span>
                Analyze SPOF
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Enhanced Comparison Table */}
      <div className="radar-comparison-enhanced">
        <div className="comparison-header">
          <h3>Overall Comparison</h3>
          <div
            className="info-icon"
            onMouseEnter={(e) =>
              showTooltip(
                'comparison-tip',
                'Higher scores are better. Use this to compare tradeoffs.',
                'Exam Tip: Understand tradeoffs - high redundancy = high cost',
                e
              )
            }
            onMouseLeave={hideTooltip}
          >
            ℹ️
          </div>
        </div>
        <div className="comparison-table-wrapper">
          <table className="comparison-table-enhanced" role="table">
            <thead>
              <tr>
                <th scope="col" className="metric-header-cell">
                  Metric
                </th>
                {selectedTopologyData.map((t) => (
                  <th key={t.id} scope="col" className="topology-header-cell">
                    {t.name}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {comparisonMetrics.length > 0 &&
                Object.keys(comparisonMetrics[0].scores).map((metric) => (
                  <tr key={metric}>
                    <td className="metric-name-cell">
                      {metric.replace(/([A-Z])/g, ' $1').trim()}
                    </td>
                    {comparisonMetrics.map((cm) => (
                      <td key={cm.topology} className="score-cell">
                        <div className="score-bar-container">
                          <div
                            className="score-fill-enhanced"
                            style={{
                              width: `${cm.scores[metric as keyof typeof cm.scores]}%`,
                            }}
                          >
                            <span className="score-text">
                              {cm.scores[metric as keyof typeof cm.scores]}
                            </span>
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

      {/* Rest of the component continues with Three-Tier, Analysis, Exam Questions, and Traffic Flow sections... */}
      {/* These sections would follow the same enhanced pattern with improved styling, tooltips, and interactions */}

      {/* Enhanced Tooltip Overlay */}
      {activeTooltip && (
        <div
          className="tooltip-overlay"
          style={{
            left: `${activeTooltip.position.x + 10}px`,
            top: `${activeTooltip.position.y + 10}px`,
          }}
          role="tooltip"
        >
          <div className="tooltip-content">
            <p className="tooltip-text">{activeTooltip.content}</p>
            {activeTooltip.examTip && (
              <div className="tooltip-exam-tip">
                <span className="exam-tip-icon">📝</span>
                <p className="exam-tip-text">{activeTooltip.examTip}</p>
              </div>
            )}
          </div>
          <div className="tooltip-arrow" />
        </div>
      )}

      {/* Enhanced Styles */}
      <style>{`
        /* Base Styles with Modern Design System */
        .topology-analyzer-enhanced {
          padding: 2rem;
          max-width: 1400px;
          margin: 0 auto;
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
        }

        /* Header Enhancement */
        .analyzer-header {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          margin-bottom: 2.5rem;
          padding: 2rem;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          border-radius: 1rem;
          color: white;
          box-shadow: 0 10px 30px rgba(102, 126, 234, 0.3);
          transition: transform 0.3s ease, box-shadow 0.3s ease;
        }

        .analyzer-header:hover {
          transform: translateY(-2px);
          box-shadow: 0 15px 40px rgba(102, 126, 234, 0.4);
        }

        .header-content {
          flex: 1;
        }

        .header-title {
          font-size: 2rem;
          font-weight: 700;
          margin: 0 0 0.5rem 0;
          letter-spacing: -0.5px;
        }

        .header-subtitle {
          font-size: 1rem;
          opacity: 0.95;
          line-height: 1.6;
          margin: 0;
        }

        .header-badge {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          padding: 0.75rem 1.25rem;
          background: rgba(255, 255, 255, 0.2);
          backdrop-filter: blur(10px);
          border-radius: 0.5rem;
          border: 1px solid rgba(255, 255, 255, 0.3);
        }

        .badge-icon {
          font-size: 1.5rem;
        }

        .badge-text {
          font-size: 0.875rem;
          font-weight: 600;
        }

        /* Card System with Shadows */
        .topology-selection-card,
        .node-count-card {
          background: white;
          border-radius: 1rem;
          padding: 2rem;
          margin-bottom: 2rem;
          box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
          border: 1px solid rgba(0, 0, 0, 0.05);
          transition: box-shadow 0.3s ease;
        }

        .topology-selection-card:hover,
        .node-count-card:hover {
          box-shadow: 0 8px 30px rgba(0, 0, 0, 0.12);
        }

        .card-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 1.5rem;
        }

        .card-title {
          font-size: 1.25rem;
          font-weight: 600;
          color: #1f2937;
          margin: 0;
        }

        .info-icon {
          width: 24px;
          height: 24px;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: help;
          font-size: 1rem;
          transition: transform 0.2s ease;
        }

        .info-icon:hover {
          transform: scale(1.2);
        }

        /* Enhanced Topology Buttons */
        .topology-buttons {
          display: flex;
          flex-wrap: wrap;
          gap: 1rem;
        }

        .topology-btn {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          padding: 1rem 1.5rem;
          border: 2px solid #e5e7eb;
          background: white;
          border-radius: 0.75rem;
          cursor: pointer;
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
          font-weight: 500;
          color: #374151;
          position: relative;
          overflow: hidden;
        }

        .topology-btn::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          opacity: 0;
          transition: opacity 0.3s ease;
          z-index: 0;
        }

        .topology-btn > * {
          position: relative;
          z-index: 1;
        }

        .topology-btn:hover:not(:disabled) {
          border-color: #667eea;
          transform: translateY(-2px);
          box-shadow: 0 4px 12px rgba(102, 126, 234, 0.3);
        }

        .topology-btn.active {
          border-color: #667eea;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          color: white;
          box-shadow: 0 4px 12px rgba(102, 126, 234, 0.4);
        }

        .topology-btn.active::before {
          opacity: 1;
        }

        .topology-btn:disabled {
          opacity: 0.5;
          cursor: not-allowed;
          transform: none;
        }

        .btn-icon {
          font-size: 1.25rem;
        }

        .btn-text {
          font-size: 0.95rem;
        }

        .btn-check {
          font-size: 1rem;
          animation: checkmark-pop 0.3s ease;
        }

        @keyframes checkmark-pop {
          0% {
            transform: scale(0);
          }
          50% {
            transform: scale(1.2);
          }
          100% {
            transform: scale(1);
          }
        }

        /* Enhanced Slider */
        .slider-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 1rem;
        }

        .slider-label {
          font-weight: 600;
          color: #374151;
          font-size: 1rem;
        }

        .slider-value {
          color: #667eea;
          font-size: 1.25rem;
        }

        .slider {
          width: 100%;
          height: 8px;
          border-radius: 4px;
          background: linear-gradient(to right, #e5e7eb 0%, #667eea 100%);
          outline: none;
          -webkit-appearance: none;
          transition: background 0.3s ease;
        }

        .slider::-webkit-slider-thumb {
          -webkit-appearance: none;
          appearance: none;
          width: 24px;
          height: 24px;
          border-radius: 50%;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          cursor: pointer;
          box-shadow: 0 2px 8px rgba(102, 126, 234, 0.4);
          transition: transform 0.2s ease, box-shadow 0.2s ease;
        }

        .slider::-webkit-slider-thumb:hover {
          transform: scale(1.2);
          box-shadow: 0 4px 12px rgba(102, 126, 234, 0.6);
        }

        .slider::-moz-range-thumb {
          width: 24px;
          height: 24px;
          border-radius: 50%;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          cursor: pointer;
          border: none;
          box-shadow: 0 2px 8px rgba(102, 126, 234, 0.4);
          transition: transform 0.2s ease, box-shadow 0.2s ease;
        }

        .slider::-moz-range-thumb:hover {
          transform: scale(1.2);
          box-shadow: 0 4px 12px rgba(102, 126, 234, 0.6);
        }

        .slider-markers {
          display: flex;
          justify-content: space-between;
          margin-top: 0.5rem;
          padding: 0 0.5rem;
          font-size: 0.75rem;
          color: #9ca3af;
        }

        /* Enhanced Comparison Grid */
        .comparison-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(380px, 1fr));
          gap: 2rem;
          margin-bottom: 3rem;
        }

        .topology-card-enhanced {
          background: white;
          border-radius: 1rem;
          overflow: hidden;
          box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
          border: 1px solid rgba(0, 0, 0, 0.05);
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
          position: relative;
        }

        .topology-card-enhanced:hover {
          transform: translateY(-4px);
          box-shadow: 0 12px 40px rgba(0, 0, 0, 0.15);
        }

        .card-header-gradient {
          padding: 2rem;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          color: white;
          display: flex;
          justify-content: space-between;
          align-items: center;
        }

        .card-title-main {
          font-size: 1.5rem;
          font-weight: 700;
          margin: 0;
          letter-spacing: -0.3px;
        }

        .card-icon {
          font-size: 2rem;
          opacity: 0.8;
        }

        .card-description {
          padding: 1.5rem 2rem;
          color: #6b7280;
          line-height: 1.6;
          border-bottom: 1px solid #f3f4f6;
          margin: 0;
        }

        /* Enhanced Metric Sections */
        .metric-section-enhanced {
          padding: 1.5rem 2rem;
          border-bottom: 1px solid #f3f4f6;
          transition: background 0.2s ease;
        }

        .metric-section-enhanced:hover {
          background: #f9fafb;
        }

        .metric-section-enhanced:last-child {
          border-bottom: none;
        }

        .metric-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 1rem;
          font-size: 1rem;
          font-weight: 600;
          color: #374151;
        }

        .exam-badge {
          display: inline-flex;
          align-items: center;
          gap: 0.25rem;
          padding: 0.25rem 0.75rem;
          background: #fef3c7;
          color: #92400e;
          border-radius: 0.5rem;
          font-size: 0.75rem;
          font-weight: 600;
          cursor: help;
          transition: all 0.2s ease;
        }

        .exam-badge:hover {
          background: #fcd34d;
          transform: scale(1.05);
        }

        .status-indicator {
          width: 12px;
          height: 12px;
          border-radius: 50%;
          animation: pulse 2s infinite;
        }

        .status-indicator.very-high {
          background: #10b981;
        }

        .status-indicator.high {
          background: #3b82f6;
        }

        .status-indicator.medium {
          background: #f59e0b;
        }

        .status-indicator.low {
          background: #ef4444;
        }

        @keyframes pulse {
          0%, 100% {
            opacity: 1;
          }
          50% {
            opacity: 0.5;
          }
        }

        /* Formula Box */
        .formula-box {
          padding: 1rem;
          background: #f3f4f6;
          border-radius: 0.5rem;
          margin-bottom: 1rem;
          border-left: 4px solid #667eea;
        }

        .formula-label {
          display: block;
          font-size: 0.75rem;
          color: #6b7280;
          margin-bottom: 0.5rem;
          text-transform: uppercase;
          letter-spacing: 0.05em;
        }

        .formula-code {
          font-family: 'Monaco', 'Menlo', 'Courier New', monospace;
          font-size: 0.95rem;
          color: #1f2937;
          background: transparent;
          padding: 0;
        }

        .calculation-result {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 0.75rem;
          background: #eff6ff;
          border-radius: 0.5rem;
          border: 1px solid #dbeafe;
        }

        .result-label {
          font-size: 0.875rem;
          color: #6b7280;
        }

        .result-value {
          font-size: 1.125rem;
          font-weight: 700;
          color: #3b82f6;
        }

        /* Level Badges */
        .level-badge {
          display: inline-block;
          padding: 0.5rem 1rem;
          border-radius: 0.5rem;
          font-size: 0.75rem;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 0.05em;
        }

        .level-badge.very-high {
          background: #d1fae5;
          color: #065f46;
        }

        .level-badge.high {
          background: #dbeafe;
          color: #1e40af;
        }

        .level-badge.medium {
          background: #fed7aa;
          color: #92400e;
        }

        .level-badge.low {
          background: #fee2e2;
          color: #991b1b;
        }

        /* SPOF Indicator */
        .spof-indicator {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          margin-top: 0.75rem;
          padding: 0.75rem;
          background: #f9fafb;
          border-radius: 0.5rem;
        }

        .spof-label {
          font-size: 0.875rem;
          color: #6b7280;
        }

        .spof-yes {
          color: #dc2626;
          font-weight: 600;
        }

        .spof-no {
          color: #059669;
          font-weight: 600;
        }

        /* Scalability Section */
        .scalability-info-enhanced {
          display: flex;
          flex-direction: column;
          gap: 1rem;
        }

        .scalability-stats {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 1rem;
        }

        .stat-item {
          display: flex;
          flex-direction: column;
          gap: 0.25rem;
        }

        .stat-label {
          font-size: 0.75rem;
          color: #9ca3af;
          text-transform: uppercase;
          letter-spacing: 0.05em;
        }

        .stat-value {
          font-size: 1rem;
          font-weight: 600;
          color: #1f2937;
        }

        .scalability-bar {
          height: 8px;
          background: #e5e7eb;
          border-radius: 4px;
          overflow: hidden;
        }

        .bar-fill {
          height: 100%;
          transition: width 0.5s ease;
          position: relative;
          overflow: hidden;
        }

        .bar-fill::after {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.3), transparent);
          animation: shine 2s infinite;
        }

        @keyframes shine {
          0% {
            transform: translateX(-100%);
          }
          100% {
            transform: translateX(100%);
          }
        }

        .bar-fill.high {
          background: linear-gradient(90deg, #10b981, #059669);
        }

        .bar-fill.medium {
          background: linear-gradient(90deg, #f59e0b, #d97706);
        }

        .bar-fill.low {
          background: linear-gradient(90deg, #ef4444, #dc2626);
        }

        /* Limitations Box */
        .limitations-box {
          padding: 1rem;
          background: #fef3c7;
          border-radius: 0.5rem;
          border-left: 4px solid #f59e0b;
          margin-top: 1rem;
        }

        .limitations-list {
          list-style: none;
          padding: 0;
          margin: 0.5rem 0 0 0;
        }

        .limitations-list li {
          display: flex;
          align-items: flex-start;
          gap: 0.5rem;
          margin-bottom: 0.5rem;
          font-size: 0.875rem;
          color: #78350f;
        }

        .limit-icon {
          flex-shrink: 0;
          margin-top: 0.1rem;
        }

        /* Cost Section */
        .cost-levels-enhanced {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 1rem;
          margin-bottom: 1rem;
        }

        .cost-badge {
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
          padding: 1rem;
          background: #f9fafb;
          border-radius: 0.5rem;
          border: 1px solid #e5e7eb;
        }

        .cost-label {
          font-size: 0.75rem;
          color: #9ca3af;
          text-transform: uppercase;
          letter-spacing: 0.05em;
        }

        .cost-value {
          font-size: 0.95rem;
          font-weight: 700;
        }

        .cost-value.low {
          color: #059669;
        }

        .cost-value.medium {
          color: #d97706;
        }

        .cost-value.high {
          color: #dc2626;
        }

        .cost-value.very-high {
          color: #991b1b;
        }

        /* Cost Breakdown */
        .cost-breakdown-enhanced {
          display: flex;
          flex-direction: column;
          gap: 0.75rem;
        }

        .breakdown-item-enhanced {
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
        }

        .breakdown-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
        }

        .breakdown-label {
          font-size: 0.875rem;
          color: #6b7280;
          text-transform: capitalize;
          font-weight: 500;
        }

        .breakdown-percentage {
          font-size: 0.875rem;
          font-weight: 700;
          color: #1f2937;
        }

        .bar-container-enhanced {
          height: 8px;
          background: #f3f4f6;
          border-radius: 4px;
          overflow: hidden;
        }

        .bar-enhanced {
          height: 100%;
          background: linear-gradient(90deg, #667eea 0%, #764ba2 100%);
          transition: width 0.5s cubic-bezier(0.4, 0, 0.2, 1);
          position: relative;
          overflow: hidden;
        }

        .bar-shine {
          position: absolute;
          top: 0;
          left: -100%;
          width: 100%;
          height: 100%;
          background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.4), transparent);
          animation: bar-shine 2s ease-in-out infinite;
        }

        @keyframes bar-shine {
          0% {
            left: -100%;
          }
          100% {
            left: 100%;
          }
        }

        /* Traffic Flow */
        .traffic-split-enhanced {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 1rem;
          margin-bottom: 1rem;
        }

        .traffic-item-enhanced {
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
          padding: 1rem;
          border-radius: 0.75rem;
          border: 2px solid;
          transition: all 0.3s ease;
        }

        .traffic-item-enhanced:hover {
          transform: translateY(-2px);
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
        }

        .traffic-item-enhanced.north-south {
          background: #dbeafe;
          border-color: #3b82f6;
          color: #1e40af;
        }

        .traffic-item-enhanced.east-west {
          background: #d1fae5;
          border-color: #10b981;
          color: #065f46;
        }

        .traffic-icon {
          font-size: 1.25rem;
        }

        .traffic-label {
          font-size: 0.75rem;
          font-weight: 600;
          text-transform: uppercase;
          letter-spacing: 0.05em;
        }

        .traffic-value {
          font-size: 1.5rem;
          font-weight: 700;
        }

        .traffic-bar {
          height: 6px;
          background: rgba(0, 0, 0, 0.1);
          border-radius: 3px;
          overflow: hidden;
        }

        .traffic-fill {
          height: 100%;
          background: currentColor;
          transition: width 0.5s ease;
        }

        /* Bottlenecks */
        .bottlenecks-enhanced {
          padding: 1rem;
          background: #fef2f2;
          border-radius: 0.5rem;
          border-left: 4px solid #ef4444;
          margin-top: 1rem;
        }

        .bottleneck-header {
          display: block;
          font-size: 0.875rem;
          font-weight: 600;
          color: #991b1b;
          margin-bottom: 0.5rem;
        }

        .bottleneck-list {
          list-style: none;
          padding: 0;
          margin: 0;
        }

        .bottleneck-list li {
          display: flex;
          align-items: flex-start;
          gap: 0.5rem;
          margin-bottom: 0.5rem;
          font-size: 0.875rem;
          color: #7f1d1d;
        }

        .bottleneck-icon {
          flex-shrink: 0;
          margin-top: 0.1rem;
        }

        /* Use Cases */
        .use-cases-enhanced {
          list-style: none;
          padding: 0;
          margin: 0;
          display: flex;
          flex-direction: column;
          gap: 0.75rem;
        }

        .use-case-item {
          display: flex;
          align-items: flex-start;
          gap: 0.75rem;
          padding: 0.75rem;
          background: #f9fafb;
          border-radius: 0.5rem;
          transition: all 0.2s ease;
        }

        .use-case-item:hover {
          background: #eff6ff;
          transform: translateX(4px);
        }

        .use-case-icon {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 24px;
          height: 24px;
          flex-shrink: 0;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          color: white;
          border-radius: 50%;
          font-size: 0.75rem;
          font-weight: 700;
        }

        .use-case-text {
          font-size: 0.875rem;
          color: #374151;
          line-height: 1.5;
        }

        /* Card Actions */
        .card-actions {
          padding: 1.5rem 2rem;
          border-top: 1px solid #f3f4f6;
          display: flex;
          gap: 1rem;
        }

        .action-btn {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          padding: 0.75rem 1.25rem;
          border: none;
          border-radius: 0.5rem;
          font-weight: 600;
          font-size: 0.875rem;
          cursor: pointer;
          transition: all 0.3s ease;
        }

        .action-btn.primary {
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          color: white;
          box-shadow: 0 2px 8px rgba(102, 126, 234, 0.3);
        }

        .action-btn.primary:hover {
          transform: translateY(-2px);
          box-shadow: 0 4px 12px rgba(102, 126, 234, 0.4);
        }

        .btn-icon-small {
          font-size: 1rem;
        }

        /* Enhanced Comparison Table */
        .radar-comparison-enhanced {
          background: white;
          border-radius: 1rem;
          padding: 2rem;
          margin-bottom: 3rem;
          box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
          border: 1px solid rgba(0, 0, 0, 0.05);
        }

        .comparison-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 2rem;
        }

        .comparison-header h3 {
          font-size: 1.5rem;
          font-weight: 700;
          color: #1f2937;
          margin: 0;
        }

        .comparison-table-wrapper {
          overflow-x: auto;
          border-radius: 0.5rem;
          border: 1px solid #e5e7eb;
        }

        .comparison-table-enhanced {
          width: 100%;
          border-collapse: collapse;
        }

        .metric-header-cell,
        .topology-header-cell {
          padding: 1rem;
          text-align: left;
          font-weight: 600;
          background: #f9fafb;
          border-bottom: 2px solid #e5e7eb;
          color: #374151;
        }

        .topology-header-cell {
          text-align: center;
        }

        .metric-name-cell,
        .score-cell {
          padding: 1rem;
          border-bottom: 1px solid #f3f4f6;
        }

        .metric-name-cell {
          font-weight: 500;
          color: #6b7280;
          text-transform: capitalize;
        }

        .score-bar-container {
          height: 32px;
          background: #f3f4f6;
          border-radius: 0.5rem;
          overflow: hidden;
        }

        .score-fill-enhanced {
          height: 100%;
          background: linear-gradient(90deg, #10b981, #059669);
          display: flex;
          align-items: center;
          justify-content: flex-end;
          padding-right: 0.75rem;
          transition: width 0.5s cubic-bezier(0.4, 0, 0.2, 1);
          position: relative;
        }

        .score-fill-enhanced::after {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.3), transparent);
          animation: score-shine 2s infinite;
        }

        @keyframes score-shine {
          0% {
            transform: translateX(-100%);
          }
          100% {
            transform: translateX(100%);
          }
        }

        .score-text {
          font-weight: 700;
          color: white;
          font-size: 0.875rem;
          position: relative;
          z-index: 1;
        }

        /* Enhanced Tooltip */
        .tooltip-overlay {
          position: fixed;
          z-index: 9999;
          pointer-events: none;
          animation: tooltip-fade-in 0.2s ease;
        }

        @keyframes tooltip-fade-in {
          from {
            opacity: 0;
            transform: translateY(-5px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .tooltip-content {
          background: #1f2937;
          color: white;
          padding: 1rem;
          border-radius: 0.5rem;
          max-width: 300px;
          box-shadow: 0 10px 40px rgba(0, 0, 0, 0.3);
        }

        .tooltip-text {
          margin: 0 0 0.75rem 0;
          font-size: 0.875rem;
          line-height: 1.5;
        }

        .tooltip-exam-tip {
          padding: 0.75rem;
          background: rgba(254, 243, 199, 0.2);
          border-radius: 0.375rem;
          border-left: 3px solid #fbbf24;
          display: flex;
          align-items: flex-start;
          gap: 0.5rem;
        }

        .exam-tip-icon {
          flex-shrink: 0;
        }

        .exam-tip-text {
          margin: 0;
          font-size: 0.8125rem;
          line-height: 1.5;
          color: #fde68a;
        }

        .tooltip-arrow {
          position: absolute;
          bottom: -6px;
          left: 20px;
          width: 12px;
          height: 12px;
          background: #1f2937;
          transform: rotate(45deg);
        }

        /* Responsive Design */
        @media (max-width: 768px) {
          .analyzer-header {
            flex-direction: column;
            gap: 1.5rem;
          }

          .comparison-grid {
            grid-template-columns: 1fr;
          }

          .topology-buttons {
            grid-template-columns: 1fr;
          }

          .scalability-stats {
            grid-template-columns: 1fr;
          }

          .cost-levels-enhanced {
            grid-template-columns: 1fr;
          }

          .traffic-split-enhanced {
            grid-template-columns: 1fr;
          }
        }

        /* Accessibility Enhancements */
        @media (prefers-reduced-motion: reduce) {
          *,
          *::before,
          *::after {
            animation-duration: 0.01ms !important;
            animation-iteration-count: 1 !important;
            transition-duration: 0.01ms !important;
          }
        }

        /* Focus States for Keyboard Navigation */
        .topology-btn:focus-visible,
        .slider:focus-visible,
        .action-btn:focus-visible,
        .info-icon:focus-visible {
          outline: 3px solid #667eea;
          outline-offset: 2px;
        }
      `}</style>
    </div>
  );
};

export default TopologyAnalyzerEnhanced;
