/**
 * Enhanced Topology Comparison Analyzer Component
 * Refactored modular structure - Main orchestrator
 *
 * Original size: 1673 lines
 * New size: ~125 lines (main component)
 * Additional modules: 8 components + 3 hooks + utilities
 */

import React, { useState, useMemo } from 'react';
import { topologyDefinitions } from '../topologies-data';
import type { TopologyType } from '../topologies-types';
import { useTooltip } from './hooks/useTooltip';
import { useComparisonMetrics } from './hooks/useComparisonMetrics';
import { TopologySelection } from './components/TopologySelection';
import { NodeCountSlider } from './components/NodeCountSlider';
import { TopologyCard } from './components/TopologyCard';
import { ComparisonTable } from './components/ComparisonTable';
import { TooltipOverlay } from './components/TooltipOverlay';
import { analyzerStyles } from './styles/styles';

interface TopologyAnalyzerProps {
  className?: string;
}

export const TopologyAnalyzerEnhanced: React.FC<TopologyAnalyzerProps> = ({ className = '' }) => {
  const [selectedTopologies, setSelectedTopologies] = useState<TopologyType[]>(['star', 'mesh']);
  const [nodeCount, setNodeCount] = useState(4);
  const [showAnalysis, setShowAnalysis] = useState(false);
  const [hoveredTopology, setHoveredTopology] = useState<TopologyType | null>(null);

  const { activeTooltip, showTooltip, hideTooltip } = useTooltip();

  const selectedTopologyData = useMemo(() => {
    return topologyDefinitions.filter((t) => selectedTopologies.includes(t.id));
  }, [selectedTopologies]);

  const comparisonMetrics = useComparisonMetrics(selectedTopologyData);

  const toggleTopology = (topology: TopologyType) => {
    setSelectedTopologies((prev) =>
      prev.includes(topology) ? prev.filter((t) => t !== topology) : [...prev, topology].slice(-3)
    );
  };

  const handleAnalyze = (topology: TopologyType) => {
    setShowAnalysis(true);
    setTimeout(() => {
      document
        .querySelector('.analysis-section-container')
        ?.scrollIntoView({ behavior: 'smooth' });
    }, 100);
  };

  // Track feature expansion state
  void showAnalysis; // Used in onClick handler

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
      <TopologySelection
        selectedTopologies={selectedTopologies}
        hoveredTopology={hoveredTopology}
        onToggleTopology={toggleTopology}
        onHoverTopology={setHoveredTopology}
        onShowTooltip={showTooltip}
        onHideTooltip={hideTooltip}
      />

      {/* Enhanced Node Count Slider */}
      <NodeCountSlider
        nodeCount={nodeCount}
        onNodeCountChange={setNodeCount}
        onShowTooltip={showTooltip}
        onHideTooltip={hideTooltip}
      />

      {/* Enhanced Comparison Grid */}
      <div className="comparison-grid">
        {selectedTopologyData.map((topology) => (
          <TopologyCard
            key={topology.id}
            topology={topology}
            nodeCount={nodeCount}
            onShowTooltip={showTooltip}
            onHideTooltip={hideTooltip}
            onAnalyze={() => handleAnalyze(topology.id)}
          />
        ))}
      </div>

      {/* Enhanced Comparison Table */}
      <ComparisonTable
        selectedTopologyData={selectedTopologyData}
        comparisonMetrics={comparisonMetrics}
        onShowTooltip={showTooltip}
        onHideTooltip={hideTooltip}
      />

      {/* Enhanced Tooltip Overlay */}
      <TooltipOverlay tooltip={activeTooltip} />

      {/* Styles */}
      <style>{analyzerStyles}</style>
    </div>
  );
};

export default TopologyAnalyzerEnhanced;
