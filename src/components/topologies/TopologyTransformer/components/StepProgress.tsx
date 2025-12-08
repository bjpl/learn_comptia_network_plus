/**
 * Step progress visualization component
 */

import React from 'react';
import type { TopologyTransformation } from '../../topologies-types';

interface StepProgressProps {
  transformation: TopologyTransformation;
  currentStep: number;
  isAnimating: boolean;
  onStepChange: (step: number) => void;
}

export const StepProgress = React.memo<StepProgressProps>(
  ({ transformation, currentStep, isAnimating, onStepChange }) => {
    const currentStepData = transformation.steps[currentStep];

    return (
      <div className="step-progress" role="region" aria-label="Transformation progress">
        <div
          className="progress-bar"
          role="progressbar"
          aria-valuenow={currentStep + 1}
          aria-valuemin={1}
          aria-valuemax={transformation.steps.length}
          aria-label={`Step ${currentStep + 1} of ${transformation.steps.length}`}
        >
          <div
            className="progress-fill"
            style={{
              width: `${((currentStep + 1) / transformation.steps.length) * 100}%`,
            }}
          />
        </div>

        {/* Screen reader announcement */}
        <div className="sr-only" aria-live="assertive" aria-atomic="true">
          {isAnimating &&
            `Now showing step ${currentStep + 1} of ${transformation.steps.length}: ${currentStepData.title}`}
        </div>

        <div className="step-buttons" role="group" aria-label="Transformation steps">
          {transformation.steps.map((step, idx) => (
            <button
              key={step.id}
              className={`step-btn ${currentStep === idx ? 'active' : ''} ${
                currentStep > idx ? 'completed' : ''
              }`}
              onClick={() => onStepChange(idx)}
              aria-label={`Step ${idx + 1}: ${step.title}${currentStep === idx ? ' (current)' : currentStep > idx ? ' (completed)' : ''}`}
              aria-pressed={currentStep === idx}
            >
              <span className="step-number" aria-hidden="true">
                {idx + 1}
              </span>
              <span className="step-title">{step.title}</span>
            </button>
          ))}
        </div>
      </div>
    );
  }
);

StepProgress.displayName = 'StepProgress';
