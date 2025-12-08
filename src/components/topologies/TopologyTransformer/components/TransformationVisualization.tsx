/**
 * Main visualization area for topology transformation
 */

import React from 'react';
import type { TopologyTransformation, TransformationStep } from '../../topologies-types';

interface TransformationVisualizationProps {
  transformation: TopologyTransformation;
  currentStep: TransformationStep;
  stepIndex: number;
  totalSteps: number;
  showComparison: boolean;
  isAnimating: boolean;
}

export const TransformationVisualization = React.memo<TransformationVisualizationProps>(
  ({ transformation, currentStep, stepIndex, totalSteps, showComparison, isAnimating }) => {
    if (showComparison) {
      return (
        <div className="side-by-side" role="region" aria-label="Before and after comparison">
          <div className="topology-view before">
            <h4>Before: {transformation.fromTopology}</h4>
            <div
              className="topology-diagram"
              role="img"
              aria-label={`${transformation.fromTopology} topology diagram`}
            >
              <div className="diagram-placeholder">
                <span className="topology-name">{transformation.fromTopology}</span>
                <div className="topology-icon" aria-hidden="true">
                  🔷
                </div>
              </div>
            </div>
          </div>

          <div className="transformation-arrow" role="presentation">
            <div className="arrow-icon" aria-hidden="true">
              →
            </div>
            <div className="step-indicator" aria-live="polite">
              Step {stepIndex + 1} of {totalSteps}
            </div>
          </div>

          <div className="topology-view after">
            <h4>After: {transformation.toTopology}</h4>
            <div
              className="topology-diagram"
              role="img"
              aria-label={`${transformation.toTopology} topology diagram`}
            >
              <div className="diagram-placeholder">
                <span className="topology-name">{transformation.toTopology}</span>
                <div className="topology-icon" aria-hidden="true">
                  🔶
                </div>
              </div>
            </div>
          </div>

          <div className="sr-only">
            Comparing {transformation.fromTopology} topology before transformation with{' '}
            {transformation.toTopology} topology after transformation. Currently showing step{' '}
            {stepIndex + 1} of {totalSteps}.
          </div>
        </div>
      );
    }

    return (
      <div className="single-view">
        <div className="current-step">
          <h4>{currentStep.title}</h4>
          <p className="step-description">{currentStep.description}</p>

          <div className="topology-diagram">
            <div className={`diagram-placeholder ${isAnimating ? 'animating' : ''}`}>
              <span className="topology-name">
                {stepIndex === 0
                  ? transformation.fromTopology
                  : stepIndex === totalSteps - 1
                    ? transformation.toTopology
                    : 'Transitioning...'}
              </span>
              <div className="topology-icon">
                {stepIndex === 0 ? '🔷' : stepIndex === totalSteps - 1 ? '🔶' : '🔄'}
              </div>
            </div>
          </div>

          <div className="step-changes">
            <h5>Changes in This Step</h5>
            <div className="changes-grid">
              {currentStep.changes.redundancy && (
                <div className="change-item">
                  <span className="label">Redundancy:</span>
                  <span className={`value ${currentStep.changes.redundancy}`}>
                    {currentStep.changes.redundancy}
                  </span>
                </div>
              )}
              {currentStep.changes.trafficPattern && (
                <div className="change-item">
                  <span className="label">Traffic Pattern:</span>
                  <span className="value">{currentStep.changes.trafficPattern}</span>
                </div>
              )}
              {currentStep.changes.scalability && (
                <div className="change-item">
                  <span className="label">Scalability:</span>
                  <span className={`value ${currentStep.changes.scalability}`}>
                    {currentStep.changes.scalability}
                  </span>
                </div>
              )}
              {currentStep.changes.cost && (
                <div className="change-item">
                  <span className="label">Cost:</span>
                  <span className={`value ${currentStep.changes.cost}`}>
                    {currentStep.changes.cost}
                  </span>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  }
);

TransformationVisualization.displayName = 'TransformationVisualization';
