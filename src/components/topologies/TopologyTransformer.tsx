/**
 * Topology Transformation Tool Component
 * Animated diagram showing network topology transformations
 */

import React, { useState, useEffect } from 'react';
import { transformationScenarios } from './topologies-data';
import type { TopologyTransformation } from './topologies-types';

interface TopologyTransformerProps {
  className?: string;
}

export const TopologyTransformer: React.FC<TopologyTransformerProps> = ({ className = '' }) => {
  const [selectedTransformation, setSelectedTransformation] = useState<TopologyTransformation>(
    transformationScenarios[0]
  );
  const [currentStep, setCurrentStep] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);
  const [showComparison, setShowComparison] = useState(false);
  const [autoPlay, setAutoPlay] = useState(false);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (autoPlay && isAnimating) {
      interval = setInterval(() => {
        setCurrentStep((prev) => {
          if (prev >= selectedTransformation.steps.length - 1) {
            setAutoPlay(false);
            setIsAnimating(false);
            return prev;
          }
          return prev + 1;
        });
      }, 3000);
    }
    return () => clearInterval(interval);
  }, [autoPlay, isAnimating, selectedTransformation]);

  const handleTransformationChange = (transformation: TopologyTransformation) => {
    setSelectedTransformation(transformation);
    setCurrentStep(0);
    setIsAnimating(false);
    setAutoPlay(false);
  };

  const handleStepChange = (step: number) => {
    setCurrentStep(step);
    setIsAnimating(true);
  };

  const handlePlayPause = () => {
    if (isAnimating && autoPlay) {
      setAutoPlay(false);
    } else {
      setIsAnimating(true);
      setAutoPlay(true);
    }
  };

  const handleReset = () => {
    setCurrentStep(0);
    setIsAnimating(false);
    setAutoPlay(false);
  };

  const currentStepData = selectedTransformation.steps[currentStep];

  return (
    <div className={`topology-transformer ${className}`}>
      {/* Header */}
      <div className="transformer-header">
        <h2>Network Topology Transformation Tool</h2>
        <p>Visualize and analyze how network topologies transform from one type to another</p>
      </div>

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
      <div className="animation-controls">
        <button className="control-btn" onClick={handlePlayPause}>
          {autoPlay ? '⏸ Pause' : '▶ Play'}
        </button>
        <button className="control-btn" onClick={handleReset}>
          ↺ Reset
        </button>
        <button className="control-btn" onClick={() => setShowComparison(!showComparison)}>
          {showComparison ? '👁 Hide' : '👁 Show'} Comparison
        </button>
      </div>

      {/* Step Progress */}
      <div className="step-progress">
        <div className="progress-bar">
          <div
            className="progress-fill"
            style={{
              width: `${((currentStep + 1) / selectedTransformation.steps.length) * 100}%`,
            }}
          />
        </div>
        <div className="step-buttons">
          {selectedTransformation.steps.map((step, idx) => (
            <button
              key={step.id}
              className={`step-btn ${currentStep === idx ? 'active' : ''} ${
                currentStep > idx ? 'completed' : ''
              }`}
              onClick={() => handleStepChange(idx)}
            >
              <span className="step-number">{idx + 1}</span>
              <span className="step-title">{step.title}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Main Visualization Area */}
      <div className="visualization-area">
        {showComparison ? (
          /* Side-by-Side Comparison */
          <div className="side-by-side">
            <div className="topology-view before">
              <h4>Before: {selectedTransformation.fromTopology}</h4>
              <div className="topology-diagram">
                <div className="diagram-placeholder">
                  <span className="topology-name">{selectedTransformation.fromTopology}</span>
                  <div className="topology-icon">🔷</div>
                </div>
              </div>
            </div>

            <div className="transformation-arrow">
              <div className="arrow-icon">→</div>
              <div className="step-indicator">
                Step {currentStep + 1} of {selectedTransformation.steps.length}
              </div>
            </div>

            <div className="topology-view after">
              <h4>After: {selectedTransformation.toTopology}</h4>
              <div className="topology-diagram">
                <div className="diagram-placeholder">
                  <span className="topology-name">{selectedTransformation.toTopology}</span>
                  <div className="topology-icon">🔶</div>
                </div>
              </div>
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

      {/* Detailed Analysis */}
      <div className="detailed-analysis">
        <h3>Transformation Analysis</h3>

        <div className="analysis-grid">
          {/* Redundancy Analysis */}
          <div className="analysis-section">
            <h4>Redundancy Impact</h4>
            <div className="analysis-item">
              <span className="label">Before:</span>
              <span className="value">{selectedTransformation.analysis.redundancy.before}</span>
            </div>
            <div className="analysis-item">
              <span className="label">After:</span>
              <span className="value">{selectedTransformation.analysis.redundancy.after}</span>
            </div>
            <div className="analysis-item highlight">
              <span className="label">Change:</span>
              <span className="value">{selectedTransformation.analysis.redundancy.change}</span>
            </div>
          </div>

          {/* Traffic Patterns Analysis */}
          <div className="analysis-section">
            <h4>Traffic Patterns</h4>
            <div className="analysis-item">
              <span className="label">Before:</span>
              <span className="value">
                {selectedTransformation.analysis.trafficPatterns.before}
              </span>
            </div>
            <div className="analysis-item">
              <span className="label">After:</span>
              <span className="value">{selectedTransformation.analysis.trafficPatterns.after}</span>
            </div>
            <div className="analysis-item highlight">
              <span className="label">Improvement:</span>
              <span className="value">
                {selectedTransformation.analysis.trafficPatterns.improvement}
              </span>
            </div>
          </div>

          {/* Scalability Analysis */}
          <div className="analysis-section">
            <h4>Scalability</h4>
            <div className="analysis-item">
              <span className="label">Before:</span>
              <span className="value">{selectedTransformation.analysis.scalability.before}</span>
            </div>
            <div className="analysis-item">
              <span className="label">After:</span>
              <span className="value">{selectedTransformation.analysis.scalability.after}</span>
            </div>
            <div className="analysis-item highlight">
              <span className="label">Improvement:</span>
              <span className="value">
                {selectedTransformation.analysis.scalability.improvement}
              </span>
            </div>
          </div>

          {/* Cost Analysis */}
          <div className="analysis-section">
            <h4>Cost Impact</h4>
            <div className="analysis-item">
              <span className="label">Before:</span>
              <span className="value">{selectedTransformation.analysis.cost.before}</span>
            </div>
            <div className="analysis-item">
              <span className="label">After:</span>
              <span className="value">{selectedTransformation.analysis.cost.after}</span>
            </div>
            <div className="analysis-item highlight">
              <span className="label">Change:</span>
              <span className="value">{selectedTransformation.analysis.cost.change}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Benefits and Considerations */}
      <div className="benefits-considerations">
        <div className="benefits">
          <h4>Benefits</h4>
          <ul>
            {selectedTransformation.benefits.map((benefit, idx) => (
              <li key={idx}>
                <span className="icon">✓</span>
                {benefit}
              </li>
            ))}
          </ul>
        </div>

        <div className="considerations">
          <h4>Considerations</h4>
          <ul>
            {selectedTransformation.considerations.map((consideration, idx) => (
              <li key={idx}>
                <span className="icon">⚠</span>
                {consideration}
              </li>
            ))}
          </ul>
        </div>
      </div>

      <style>{`
        .topology-transformer {
          padding: 2rem;
          max-width: 1400px;
          margin: 0 auto;
        }

        .transformer-header {
          text-align: center;
          margin-bottom: 2rem;
        }

        .transformer-header h2 {
          font-size: 2rem;
          color: #1f2937;
          margin-bottom: 0.5rem;
        }

        .transformer-header p {
          color: #6b7280;
          font-size: 1rem;
        }

        .transformation-selection {
          margin-bottom: 2rem;
        }

        .transformation-selection h3 {
          margin-bottom: 1rem;
          color: #374151;
        }

        .scenario-buttons {
          display: flex;
          flex-wrap: wrap;
          gap: 0.5rem;
        }

        .scenario-btn {
          padding: 0.75rem 1.5rem;
          border: 2px solid #d1d5db;
          background: white;
          border-radius: 0.5rem;
          cursor: pointer;
          display: flex;
          align-items: center;
          gap: 0.5rem;
          transition: all 0.2s;
        }

        .scenario-btn:hover {
          border-color: #3b82f6;
          background: #eff6ff;
        }

        .scenario-btn.active {
          border-color: #3b82f6;
          background: #3b82f6;
          color: white;
        }

        .scenario-btn .from,
        .scenario-btn .to {
          text-transform: capitalize;
        }

        .scenario-btn .arrow {
          font-weight: bold;
        }

        .transformation-info {
          padding: 1.5rem;
          background: white;
          border: 1px solid #e5e7eb;
          border-radius: 0.5rem;
          margin-bottom: 2rem;
        }

        .transformation-info h3 {
          color: #1f2937;
          margin-bottom: 0.5rem;
        }

        .transformation-info .description {
          color: #6b7280;
        }

        .animation-controls {
          display: flex;
          gap: 0.5rem;
          margin-bottom: 1.5rem;
        }

        .control-btn {
          padding: 0.75rem 1.5rem;
          background: #3b82f6;
          color: white;
          border: none;
          border-radius: 0.5rem;
          cursor: pointer;
          font-weight: 600;
          transition: background 0.2s;
        }

        .control-btn:hover {
          background: #2563eb;
        }

        .step-progress {
          margin-bottom: 2rem;
        }

        .progress-bar {
          height: 8px;
          background: #e5e7eb;
          border-radius: 4px;
          overflow: hidden;
          margin-bottom: 1rem;
        }

        .progress-fill {
          height: 100%;
          background: linear-gradient(90deg, #3b82f6, #2563eb);
          transition: width 0.5s ease;
        }

        .step-buttons {
          display: flex;
          gap: 0.5rem;
          overflow-x: auto;
        }

        .step-btn {
          padding: 0.75rem 1rem;
          border: 2px solid #d1d5db;
          background: white;
          border-radius: 0.5rem;
          cursor: pointer;
          display: flex;
          flex-direction: column;
          align-items: flex-start;
          min-width: 150px;
          transition: all 0.2s;
        }

        .step-btn:hover {
          border-color: #3b82f6;
        }

        .step-btn.active {
          border-color: #3b82f6;
          background: #eff6ff;
        }

        .step-btn.completed {
          background: #d1fae5;
          border-color: #10b981;
        }

        .step-number {
          font-weight: 600;
          color: #3b82f6;
          margin-bottom: 0.25rem;
        }

        .step-title {
          font-size: 0.875rem;
          color: #374151;
        }

        .visualization-area {
          margin-bottom: 2rem;
          padding: 2rem;
          background: white;
          border: 1px solid #e5e7eb;
          border-radius: 0.5rem;
        }

        .side-by-side {
          display: grid;
          grid-template-columns: 1fr auto 1fr;
          gap: 2rem;
          align-items: center;
        }

        .topology-view h4 {
          text-align: center;
          margin-bottom: 1rem;
          color: #374151;
        }

        .transformation-arrow {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 0.5rem;
        }

        .arrow-icon {
          font-size: 3rem;
          color: #3b82f6;
        }

        .step-indicator {
          font-size: 0.875rem;
          color: #6b7280;
          text-align: center;
        }

        .single-view {
          max-width: 800px;
          margin: 0 auto;
        }

        .current-step h4 {
          color: #1f2937;
          margin-bottom: 0.5rem;
        }

        .step-description {
          color: #6b7280;
          margin-bottom: 2rem;
        }

        .topology-diagram {
          margin-bottom: 2rem;
        }

        .diagram-placeholder {
          height: 300px;
          background: linear-gradient(135deg, #f3f4f6 0%, #e5e7eb 100%);
          border: 2px dashed #d1d5db;
          border-radius: 0.5rem;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          gap: 1rem;
          position: relative;
          overflow: hidden;
        }

        .diagram-placeholder.animating::before {
          content: '';
          position: absolute;
          top: -50%;
          left: -50%;
          width: 200%;
          height: 200%;
          background: linear-gradient(
            45deg,
            transparent 30%,
            rgba(59, 130, 246, 0.1) 50%,
            transparent 70%
          );
          animation: shimmer 2s infinite;
        }

        @keyframes shimmer {
          0% {
            transform: translateX(-100%) translateY(-100%) rotate(45deg);
          }
          100% {
            transform: translateX(100%) translateY(100%) rotate(45deg);
          }
        }

        .topology-name {
          font-size: 1.5rem;
          font-weight: 600;
          color: #374151;
          text-transform: capitalize;
          z-index: 1;
        }

        .topology-icon {
          font-size: 4rem;
          z-index: 1;
        }

        .step-changes {
          padding: 1.5rem;
          background: #f9fafb;
          border-radius: 0.5rem;
        }

        .step-changes h5 {
          color: #374151;
          margin-bottom: 1rem;
        }

        .changes-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
          gap: 1rem;
        }

        .change-item {
          display: flex;
          flex-direction: column;
          gap: 0.25rem;
        }

        .change-item .label {
          font-size: 0.875rem;
          color: #6b7280;
        }

        .change-item .value {
          font-weight: 600;
          text-transform: capitalize;
        }

        .change-item .value.increase {
          color: #059669;
        }

        .change-item .value.decrease {
          color: #dc2626;
        }

        .change-item .value.maintain,
        .change-item .value.improve {
          color: #3b82f6;
        }

        .change-item .value.reduce {
          color: #f59e0b;
        }

        .detailed-analysis {
          margin-bottom: 2rem;
          padding: 1.5rem;
          background: white;
          border: 1px solid #e5e7eb;
          border-radius: 0.5rem;
        }

        .detailed-analysis h3 {
          margin-bottom: 1.5rem;
          color: #1f2937;
        }

        .analysis-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
          gap: 1.5rem;
        }

        .analysis-section {
          padding: 1rem;
          background: #f9fafb;
          border-radius: 0.5rem;
        }

        .analysis-section h4 {
          color: #374151;
          margin-bottom: 1rem;
          padding-bottom: 0.5rem;
          border-bottom: 2px solid #e5e7eb;
        }

        .analysis-item {
          display: flex;
          flex-direction: column;
          gap: 0.25rem;
          margin-bottom: 0.75rem;
        }

        .analysis-item .label {
          font-size: 0.75rem;
          color: #6b7280;
          font-weight: 600;
        }

        .analysis-item .value {
          font-size: 0.875rem;
          color: #374151;
        }

        .analysis-item.highlight {
          padding: 0.75rem;
          background: #eff6ff;
          border-left: 3px solid #3b82f6;
          border-radius: 0.25rem;
        }

        .analysis-item.highlight .value {
          font-weight: 600;
          color: #1e40af;
        }

        .benefits-considerations {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 2rem;
        }

        .benefits,
        .considerations {
          padding: 1.5rem;
          border-radius: 0.5rem;
        }

        .benefits {
          background: #d1fae5;
          border: 1px solid #10b981;
        }

        .considerations {
          background: #fef3c7;
          border: 1px solid #f59e0b;
        }

        .benefits h4 {
          color: #065f46;
          margin-bottom: 1rem;
        }

        .considerations h4 {
          color: #92400e;
          margin-bottom: 1rem;
        }

        .benefits ul,
        .considerations ul {
          list-style: none;
          padding: 0;
        }

        .benefits li,
        .considerations li {
          display: flex;
          align-items: flex-start;
          gap: 0.5rem;
          margin-bottom: 0.75rem;
          font-size: 0.875rem;
        }

        .benefits .icon {
          color: #059669;
          font-weight: bold;
        }

        .considerations .icon {
          color: #f59e0b;
          font-weight: bold;
        }

        @media (max-width: 768px) {
          .side-by-side {
            grid-template-columns: 1fr;
          }

          .transformation-arrow {
            transform: rotate(90deg);
          }

          .benefits-considerations {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
    </div>
  );
};

export default TopologyTransformer;
