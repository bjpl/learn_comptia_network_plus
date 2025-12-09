/**
 * Main visualization area showing topology diagrams
 */

import React from 'react';
import type { TopologyTransformation } from '../../topologies-types';

interface VisualizationAreaProps {
  showComparison: boolean;
  selectedTransformation: TopologyTransformation;
  currentStep: number;
  isAnimating: boolean;
  currentStepData: TopologyTransformation['steps'][0];
}

export const VisualizationArea: React.FC<VisualizationAreaProps> = ({
  showComparison,
  selectedTransformation,
  currentStep,
  isAnimating,
  currentStepData,
}) => {
  return (
    <div className="visualization-area">
      {showComparison ? (
        /* Side-by-Side Comparison */
        <div className="side-by-side" role="region" aria-label="Before and after comparison">
          <div className="topology-view before">
            <h4>Before: {selectedTransformation.fromTopology}</h4>
            <div
              className="topology-diagram"
              role="img"
              aria-label={`${selectedTransformation.fromTopology} topology diagram`}
            >
              <div className="diagram-placeholder">
                <span className="topology-name">{selectedTransformation.fromTopology}</span>
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
              Step {currentStep + 1} of {selectedTransformation.steps.length}
            </div>
          </div>

          <div className="topology-view after">
            <h4>After: {selectedTransformation.toTopology}</h4>
            <div
              className="topology-diagram"
              role="img"
              aria-label={`${selectedTransformation.toTopology} topology diagram`}
            >
              <div className="diagram-placeholder">
                <span className="topology-name">{selectedTransformation.toTopology}</span>
                <div className="topology-icon" aria-hidden="true">
                  🔶
                </div>
              </div>
            </div>
          </div>

          {/* Screen reader description of comparison */}
          <div className="sr-only">
            Comparing {selectedTransformation.fromTopology} topology before transformation with{' '}
            {selectedTransformation.toTopology} topology after transformation. Currently showing
            step {currentStep + 1} of {selectedTransformation.steps.length}.
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
  );
};
