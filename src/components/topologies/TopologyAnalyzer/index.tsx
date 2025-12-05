/**
 * TopologyAnalyzer main component (refactored)
 * Imports necessary data and sub-components, keeps main file under 500 lines
 */

import React, { useState, useMemo, useCallback } from 'react';
import { topologyDefinitions, threeTierModel, trafficFlowAnimations } from '../topologies-data';
import type {
  TopologyType,
  TopologyDefinition,
  ComparisonMetrics,
  TrafficFlowType,
} from '../topologies-types';
import { SPOFAnalysisComponent } from './SPOFAnalysis';
import { RedundancyMetricsComponent } from './RedundancyMetrics';
import { ExamQuestionsComponent } from './ExamQuestions';
import type { SPOFAnalysis, RedundancyMetrics, ExamQuestion } from './types';

interface TopologyAnalyzerProps {
  className?: string;
}

export const TopologyAnalyzer: React.FC<TopologyAnalyzerProps> = ({ className = '' }) => {
  const [selectedTopologies, setSelectedTopologies] = useState<TopologyType[]>(['star', 'mesh']);
  const [nodeCount, setNodeCount] = useState(4);
  const [showTrafficFlow, setShowTrafficFlow] = useState(false);
  const [activeTrafficType, setActiveTrafficType] = useState<TrafficFlowType>('north-south');
  const [showThreeTier, setShowThreeTier] = useState(false);
  const [showAnalysis, setShowAnalysis] = useState(false);
  const [showExamQuestions, setShowExamQuestions] = useState(false);
  const [userAnswers, setUserAnswers] = useState<Record<string, number>>({});

  const selectedTopologyData = useMemo(() => {
    return topologyDefinitions.filter((t) => selectedTopologies.includes(t.id));
  }, [selectedTopologies]);

  // Keyboard navigation handler
  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === 'Tab') {
        e.preventDefault();
        if (topologyDefinitions.length === 0) return;
        const currentIndex = topologyDefinitions.findIndex(
          (t) => t.id === selectedTopologies[selectedTopologies.length - 1]
        );
        const nextIndex = e.shiftKey
          ? (currentIndex - 1 + topologyDefinitions.length) % topologyDefinitions.length
          : (currentIndex + 1) % topologyDefinitions.length;
        const nextTopology = topologyDefinitions[nextIndex].id;
        if (!selectedTopologies.includes(nextTopology)) {
          toggleTopology(nextTopology);
        }
      }
      if (e.key === ' ') {
        e.preventDefault();
        if (selectedTopologies.length > 0) {
          toggleTopology(selectedTopologies[selectedTopologies.length - 1]);
        }
      }
      if (e.key === 'ArrowLeft' || e.key === 'ArrowRight') {
        e.preventDefault();
        const step = e.shiftKey ? 5 : 1;
        if (e.key === 'ArrowLeft') {
          setNodeCount((prev) => Math.max(3, prev - step));
        } else {
          setNodeCount((prev) => Math.min(20, prev + step));
        }
      }
      if (e.key >= '1' && e.key <= '9') {
        e.preventDefault();
        const num = parseInt(e.key, 10);
        setNodeCount(Math.max(3, Math.min(20, num)));
      }
    },
    [selectedTopologies, topologyDefinitions]
  );

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

  const analyzeRedundancy = useCallback((topology: TopologyDefinition): RedundancyMetrics => {
    const nodeCount = topology.nodes.length;
    const edgeCount = topology.edges.length;
    const minConnectivity = nodeCount - 1;
    const pathRedundancy =
      edgeCount > minConnectivity ? ((edgeCount - minConnectivity) / minConnectivity) * 100 : 0;
    const redundantLinks = topology.edges.filter((e) => e.type === 'redundant').length;
    const linkRedundancy = (redundantLinks / edgeCount) * 100;
    const overallRedundancy = (pathRedundancy + linkRedundancy) / 2;
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
    <div
      className={`topology-analyzer ${className}`}
      tabIndex={0}
      onKeyDown={handleKeyDown}
      role="application"
      aria-label="Network Topology Comparison Analyzer"
    >
      {/* Header and Selection UI */}
      <div className="analyzer-header">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
          <div>
            <h2>Network Topology Comparison Analyzer</h2>
            <p>
              Compare different network topologies based on cost, scalability, fault tolerance, and
              traffic patterns
            </p>
          </div>
          <button
            className="toggle-btn"
            onClick={() => {
              const shortcuts = [
                'Tab/Shift+Tab: Cycle topology selections',
                'Space: Toggle last selected topology',
                'Arrow Left/Right: Adjust node count (Shift for +/- 5)',
                '1-9: Set node count directly',
              ];
              alert('Keyboard Shortcuts:\n\n' + shortcuts.join('\n'));
            }}
            style={{ marginLeft: '1rem', fontSize: '0.875rem', padding: '0.5rem 1rem' }}
            title="Show keyboard shortcuts"
          >
            ⌨️ Shortcuts
          </button>
        </div>
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

      {/* SPOF and Redundancy Analysis */}
      {showAnalysis && (
        <div className="analysis-details">
          <h3>Topology Analysis</h3>
          {selectedTopologyData.map((topology) => {
            const spofData = analyzeSPOF(topology);
            const redundancyData = analyzeRedundancy(topology);
            return (
              <div key={topology.id} className="topology-analysis">
                <h4>{topology.name} - Detailed Analysis</h4>
                <SPOFAnalysisComponent topologyName={topology.name} spofData={spofData} />
                <RedundancyMetricsComponent
                  topologyName={topology.name}
                  redundancyData={redundancyData}
                />
              </div>
            );
          })}
        </div>
      )}

      {/* Exam Questions */}
      {showExamQuestions && (
        <ExamQuestionsComponent
          questions={generateExamQuestions()}
          userAnswers={userAnswers}
          onAnswerSelect={(questionId, answerIndex) =>
            setUserAnswers({ ...userAnswers, [questionId]: answerIndex })
          }
        />
      )}

      {/* Toggle buttons for analysis and exam questions sections would go here */}
      <div className="analysis-section-container">
        <button className="toggle-btn" onClick={() => setShowAnalysis(!showAnalysis)}>
          {showAnalysis ? 'Hide' : 'Show'} Detailed Topology Analysis
        </button>
      </div>

      <div className="exam-section-container">
        <button className="toggle-btn" onClick={() => setShowExamQuestions(!showExamQuestions)}>
          {showExamQuestions ? 'Hide' : 'Show'} Exam Questions
        </button>
      </div>
    </div>
  );
};

export default TopologyAnalyzer;
