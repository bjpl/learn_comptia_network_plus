/**
 * TopologyAnalyzer Component - Main Orchestrator
 * Advanced topology analysis tool with SPOF detection, redundancy analysis, and exam scenarios
 */

import React, { useState, useMemo, useCallback } from 'react';
import { topologyDefinitions } from '../topologies-data';
import type { TopologyType } from '../topologies-types';
import type { TopologyAnalyzerProps } from './types';

// Hooks
import { useSPOFAnalysis } from './hooks/useSPOFAnalysis';
import { useRedundancyAnalysis } from './hooks/useRedundancyAnalysis';
import { useComparisonMetrics } from './hooks/useComparisonMetrics';

// Components
import { TopologyCard } from './components/TopologyCard';
import { TopologyComparison } from './components/TopologyComparison';
import { SPOFAnalysisPanel } from './components/SPOFAnalysisPanel';
import { RedundancyMetrics } from './components/RedundancyMetrics';
import { ExamQuestions } from './components/ExamQuestions';
import { TrafficFlowVisualization } from './components/TrafficFlowVisualization';
import { ThreeTierModel } from './components/ThreeTierModel';

// Data
import { generateExamQuestions } from './data/examQuestions';

// Styles
import './styles.css';

export const TopologyAnalyzer: React.FC<TopologyAnalyzerProps> = ({ className = '' }) => {
  const [selectedTopologies, setSelectedTopologies] = useState<TopologyType[]>(['star', 'mesh']);
  const [nodeCount, setNodeCount] = useState(4);
  const [showAnalysis, setShowAnalysis] = useState(false);
  const [showExamQuestions, setShowExamQuestions] = useState(false);

  // Hooks
  const { analyzeSPOF } = useSPOFAnalysis();
  const { analyzeRedundancy } = useRedundancyAnalysis();

  const selectedTopologyData = useMemo(() => {
    return topologyDefinitions.filter((t) => selectedTopologies.includes(t.id));
  }, [selectedTopologies]);

  const comparisonMetrics = useComparisonMetrics(selectedTopologyData);

  const examQuestions = useMemo(() => {
    return generateExamQuestions(selectedTopologyData);
  }, [selectedTopologyData]);

  const toggleTopology = (topology: TopologyType) => {
    setSelectedTopologies((prev) =>
      prev.includes(topology) ? prev.filter((t) => t !== topology) : [...prev, topology].slice(-3)
    );
  };

  // Keyboard navigation handler
  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      // Tab to cycle topology selections
      if (e.key === 'Tab') {
        e.preventDefault();
        if (topologyDefinitions.length === 0) {
          return;
        }
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

      // Space to toggle selection
      if (e.key === ' ') {
        e.preventDefault();
        if (selectedTopologies.length > 0) {
          toggleTopology(selectedTopologies[selectedTopologies.length - 1]);
        }
      }

      // Arrow keys for slider control
      if (e.key === 'ArrowLeft' || e.key === 'ArrowRight') {
        e.preventDefault();
        const step = e.shiftKey ? 5 : 1;
        if (e.key === 'ArrowLeft') {
          setNodeCount((prev) => Math.max(3, prev - step));
        } else {
          setNodeCount((prev) => Math.min(20, prev + step));
        }
      }

      // Number keys 1-9 to set node count
      if (e.key >= '1' && e.key <= '9') {
        e.preventDefault();
        const num = parseInt(e.key, 10);
        setNodeCount(Math.max(3, Math.min(20, num)));
      }
    },
    [selectedTopologies]
  );

  return (
    <div
      className={`topology-analyzer ${className}`}
      tabIndex={0}
      onKeyDown={handleKeyDown}
      role="application"
      aria-label="Network Topology Comparison Analyzer"
    >
      {/* Header */}
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

      {/* Comparison Grid */}
      <div className="comparison-grid">
        {selectedTopologyData.map((topology) => (
          <TopologyCard key={topology.id} topology={topology} nodeCount={nodeCount} />
        ))}
      </div>

      {/* Radar Chart Comparison */}
      <TopologyComparison
        selectedTopologyData={selectedTopologyData}
        comparisonMetrics={comparisonMetrics}
      />

      {/* Three-Tier Model Explorer */}
      <ThreeTierModel />

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

              return (
                <div key={topology.id} className="topology-analysis">
                  <h4>{topology.name} - Detailed Analysis</h4>

                  <SPOFAnalysisPanel topologyName={topology.name} spofData={spofData} />
                  <RedundancyMetrics topologyName={topology.name} redundancyData={redundancyData} />
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
            <ExamQuestions questions={examQuestions} />
          </div>
        )}
      </div>

      {/* Traffic Flow Visualizer */}
      <TrafficFlowVisualization />
    </div>
  );
};

export default TopologyAnalyzer;
