/**
 * Transformation tab component showing topology conversion animations
 */

import React from 'react';
import { transformationScenarios } from '../../topologies-data';
import type { TopologyTransformation } from '../../topologies-types';
import { TransformationControls } from './TransformationControls';
import { StepProgress } from './StepProgress';
import { VisualizationArea } from './VisualizationArea';
import { DetailedAnalysis } from './DetailedAnalysis';
import { BenefitsConsiderations } from './BenefitsConsiderations';

interface TransformationTabProps {
  selectedTransformation: TopologyTransformation;
  currentStep: number;
  isAnimating: boolean;
  showComparison: boolean;
  autoPlay: boolean;
  currentStepData: TopologyTransformation['steps'][0];
  onTransformationChange: (transformation: TopologyTransformation) => void;
  onStepChange: (step: number) => void;
  onPlayPause: () => void;
  onReset: () => void;
  onToggleComparison: () => void;
}

export const TransformationTab: React.FC<TransformationTabProps> = ({
  selectedTransformation,
  currentStep,
  isAnimating,
  showComparison,
  autoPlay,
  currentStepData,
  onTransformationChange,
  onStepChange,
  onPlayPause,
  onReset,
  onToggleComparison,
}) => {
  return (
    <>
      {/* Transformation Selection */}
      <div className="transformation-selection">
        <h3>Select Transformation Scenario</h3>
        <div className="scenario-buttons">
          {transformationScenarios.map((scenario) => (
            <button
              key={scenario.id}
              className={`scenario-btn ${selectedTransformation.id === scenario.id ? 'active' : ''}`}
              onClick={() => onTransformationChange(scenario)}
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

      <TransformationControls
        autoPlay={autoPlay}
        showComparison={showComparison}
        onPlayPause={onPlayPause}
        onReset={onReset}
        onToggleComparison={onToggleComparison}
      />

      <StepProgress
        transformation={selectedTransformation}
        currentStep={currentStep}
        isAnimating={isAnimating}
        onStepChange={onStepChange}
      />

      <VisualizationArea
        showComparison={showComparison}
        selectedTransformation={selectedTransformation}
        currentStep={currentStep}
        isAnimating={isAnimating}
        currentStepData={currentStepData}
      />

      <DetailedAnalysis analysis={selectedTransformation.analysis} />

      <BenefitsConsiderations
        benefits={selectedTransformation.benefits}
        considerations={selectedTransformation.considerations}
      />
    </>
  );
};
