/**
 * Topology Transformation Tool Component
 * Refactored modular structure - Main orchestrator
 *
 * Original size: 1791 lines
 * New size: ~185 lines (main component)
 * Additional files: 8 modules (hooks, components, utils)
 */

import React, { useState } from 'react';
import { transformationScenarios } from '../topologies-data';
import type { TopologyTransformation } from '../topologies-types';
import { useTransformAnimation } from './hooks/useTransformAnimation';
import { TransformationControls } from './components/TransformationControls';
import { StepProgress } from './components/StepProgress';
import { TransformationVisualization } from './components/TransformationVisualization';
import { TransformationAnalysis } from './components/TransformationAnalysis';
import { ComparisonMatrixTab } from './components/ComparisonMatrixTab';
import { ExamScenariosTab } from './components/ExamScenariosTab';
import { topologyTransformerStyles } from './utils/styles';

interface TopologyTransformerProps {
  className?: string;
}

export const TopologyTransformer: React.FC<TopologyTransformerProps> = ({ className = '' }) => {
  const [selectedTransformation, setSelectedTransformation] = useState<TopologyTransformation>(
    transformationScenarios[0]
  );
  const [showComparison, setShowComparison] = useState(false);
  const [activeTab, setActiveTab] = useState<'transform' | 'compare' | 'scenarios'>('transform');
  const [selectedScenario, setSelectedScenario] = useState<string | null>(null);

  const {
    currentStep,
    isAnimating,
    autoPlay,
    handleStepChange,
    handlePlayPause,
    handleReset,
  } = useTransformAnimation(selectedTransformation);

  const handleTransformationChange = (transformation: TopologyTransformation) => {
    setSelectedTransformation(transformation);
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
          <TransformationControls
            autoPlay={autoPlay}
            onPlayPause={handlePlayPause}
            onReset={handleReset}
            showComparison={showComparison}
            onToggleComparison={() => setShowComparison(!showComparison)}
          />

          {/* Step Progress */}
          <StepProgress
            transformation={selectedTransformation}
            currentStep={currentStep}
            isAnimating={isAnimating}
            onStepChange={handleStepChange}
          />

          {/* Main Visualization Area */}
          <div className="visualization-area">
            <TransformationVisualization
              transformation={selectedTransformation}
              currentStep={currentStepData}
              stepIndex={currentStep}
              totalSteps={selectedTransformation.steps.length}
              showComparison={showComparison}
              isAnimating={isAnimating}
            />
          </div>

          {/* Detailed Analysis */}
          <TransformationAnalysis transformation={selectedTransformation} />
        </>
      )}

      {/* TAB 2: Comparison Matrix */}
      {activeTab === 'compare' && <ComparisonMatrixTab />}

      {/* TAB 3: Exam Scenarios */}
      {activeTab === 'scenarios' && (
        <ExamScenariosTab
          selectedScenario={selectedScenario}
          onSelectScenario={setSelectedScenario}
        />
      )}

      <style>{topologyTransformerStyles}</style>
    </div>
  );
};

export default TopologyTransformer;
