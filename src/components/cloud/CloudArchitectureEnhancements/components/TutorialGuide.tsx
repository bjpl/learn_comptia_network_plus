/**
 * Tutorial Guide Component
 */

import React from 'react';
import { tutorialSteps } from '../../cloud-learning-utils';
import { calculateProgress } from '../utils/styleHelpers';
import type { TutorialGuideProps } from '../types';

export const TutorialGuide: React.FC<TutorialGuideProps> = ({
  currentStep,
  onNext,
  onPrev,
  onClose,
}) => {
  const step = tutorialSteps[currentStep];
  const progress = calculateProgress(currentStep, tutorialSteps.length);

  return (
    <div className="tutorial-guide">
      <div className="tutorial-progress">
        <div className="progress-bar" style={{ width: `${progress}%` }} />
      </div>

      <div className="tutorial-header">
        <div>
          <div className="step-number">
            Step {step.step} of {tutorialSteps.length}
          </div>
          <h3>{step.title}</h3>
        </div>
        <button onClick={onClose} className="close-btn" title="Exit Tutorial">
          ×
        </button>
      </div>

      <div className="tutorial-content">
        <p className="tutorial-description">{step.description}</p>
        <div className="tutorial-help">
          <span className="help-icon">💡</span>
          <p>{step.helpText}</p>
        </div>
        <div className="tutorial-action">
          <strong>Your Task:</strong>
          <p>{step.action}</p>
        </div>
      </div>

      <div className="tutorial-navigation">
        <button onClick={onPrev} disabled={currentStep === 0} className="nav-btn prev">
          ← Previous
        </button>
        <span className="step-indicator">
          {currentStep + 1} / {tutorialSteps.length}
        </span>
        {currentStep < tutorialSteps.length - 1 ? (
          <button onClick={onNext} className="nav-btn next">
            Next →
          </button>
        ) : (
          <button onClick={onClose} className="nav-btn finish">
            Finish Tutorial
          </button>
        )}
      </div>

      <style>{`
        .tutorial-guide {
          position: fixed;
          bottom: 24px;
          left: 50%;
          transform: translateX(-50%);
          width: 550px;
          background: white;
          border: 2px solid #3b82f6;
          border-radius: 16px;
          box-shadow: 0 12px 40px rgba(0,0,0,0.25);
          z-index: 200;
          animation: tutorialSlideUp 0.3s ease-out;
        }

        @keyframes tutorialSlideUp {
          from {
            opacity: 0;
            transform: translateX(-50%) translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateX(-50%) translateY(0);
          }
        }

        .tutorial-progress {
          height: 4px;
          background: #e5e7eb;
          border-radius: 16px 16px 0 0;
          overflow: hidden;
        }

        .progress-bar {
          height: 100%;
          background: linear-gradient(90deg, #3b82f6 0%, #10b981 100%);
          transition: width 0.3s ease;
        }

        .tutorial-header {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          padding: 20px 24px 16px;
          border-bottom: 2px solid #e5e7eb;
        }

        .step-number {
          font-size: 11px;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 0.5px;
          color: #3b82f6;
          margin-bottom: 6px;
        }

        .tutorial-header h3 {
          margin: 0;
          color: #111827;
          font-size: 20px;
          font-weight: 700;
        }

        .close-btn {
          background: #f3f4f6;
          border: none;
          width: 36px;
          height: 36px;
          border-radius: 8px;
          font-size: 24px;
          cursor: pointer;
          color: #6b7280;
          transition: all 0.2s;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .close-btn:hover {
          background: #e5e7eb;
          color: #111827;
          transform: scale(1.05);
        }

        .tutorial-content {
          padding: 20px 24px;
        }

        .tutorial-description {
          color: #374151;
          font-size: 14px;
          line-height: 1.6;
          margin: 0 0 16px 0;
        }

        .tutorial-help {
          background: #dbeafe;
          border-left: 3px solid #3b82f6;
          border-radius: 8px;
          padding: 12px;
          display: flex;
          gap: 10px;
          margin-bottom: 16px;
        }

        .help-icon {
          font-size: 18px;
          flex-shrink: 0;
          line-height: 1.4;
        }

        .tutorial-help p {
          margin: 0;
          color: #1e40af;
          font-size: 13px;
          line-height: 1.5;
        }

        .tutorial-action {
          background: #f0fdf4;
          border: 2px solid #86efac;
          border-radius: 8px;
          padding: 12px;
        }

        .tutorial-action strong {
          display: block;
          color: #065f46;
          font-size: 12px;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 0.5px;
          margin-bottom: 6px;
        }

        .tutorial-action p {
          margin: 0;
          color: #047857;
          font-size: 13px;
          font-weight: 600;
        }

        .tutorial-navigation {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 16px 24px;
          border-top: 2px solid #e5e7eb;
          background: #f9fafb;
          border-radius: 0 0 16px 16px;
        }

        .nav-btn {
          padding: 10px 20px;
          border: none;
          border-radius: 8px;
          font-size: 14px;
          font-weight: 700;
          cursor: pointer;
          transition: all 0.2s;
        }

        .nav-btn.prev {
          background: #f3f4f6;
          color: #374151;
        }

        .nav-btn.prev:hover:not(:disabled) {
          background: #e5e7eb;
          transform: translateX(-2px);
        }

        .nav-btn.next,
        .nav-btn.finish {
          background: linear-gradient(135deg, #3b82f6 0%, #2563eb 100%);
          color: white;
        }

        .nav-btn.next:hover,
        .nav-btn.finish:hover {
          background: linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%);
          box-shadow: 0 6px 16px rgba(59, 130, 246, 0.4);
          transform: translateX(2px);
        }

        .nav-btn:disabled {
          opacity: 0.4;
          cursor: not-allowed;
        }

        .step-indicator {
          font-size: 13px;
          font-weight: 600;
          color: #6b7280;
        }
      `}</style>
    </div>
  );
};
