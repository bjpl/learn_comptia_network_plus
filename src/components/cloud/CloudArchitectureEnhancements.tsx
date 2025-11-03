/**
 * Enhanced UI Components for Cloud Architecture Designer
 * Provides tooltips, templates, cost estimation, and tutorial features
 */

import React, { useState } from 'react';
import type { ArchitectureDesign, ArchitectureComponent } from './cloud-types';
import {
  cloudTooltips,
  architectureTemplates,
  estimateArchitectureCost,
  analyzeSecurityHints,
  tutorialSteps,
  type Tooltip,
  type ArchitectureTemplate,
} from './cloud-learning-utils';

/**
 * Tooltip Component - Shows contextual help when hovering over components
 */
interface TooltipPopupProps {
  tooltip: Tooltip;
  position: { x: number; y: number };
}

export const TooltipPopup: React.FC<TooltipPopupProps> = ({ tooltip, position }) => {
  return (
    <div
      className="tooltip-popup"
      style={{
        position: 'fixed',
        left: position.x,
        top: position.y,
        zIndex: 1000,
      }}
    >
      <div className="tooltip-header">
        <span className="tooltip-icon">💡</span>
        <h4>{tooltip.title}</h4>
      </div>
      <p className="tooltip-description">{tooltip.description}</p>
      {tooltip.learnMore && (
        <div className="tooltip-section">
          <strong>Why?</strong>
          <p>{tooltip.learnMore}</p>
        </div>
      )}
      {tooltip.example && (
        <div className="tooltip-section example">
          <strong>Example:</strong>
          <p>{tooltip.example}</p>
        </div>
      )}
      {tooltip.bestPractice && (
        <div className="tooltip-section best-practice">
          <strong>Best Practice:</strong>
          <p>{tooltip.bestPractice}</p>
        </div>
      )}

      <style>{`
        .tooltip-popup {
          background: linear-gradient(135deg, #ffffff 0%, #f9fafb 100%);
          border: 2px solid #3b82f6;
          border-radius: 12px;
          padding: 16px;
          max-width: 350px;
          box-shadow: 0 12px 32px rgba(0,0,0,0.2);
          animation: tooltipFadeIn 0.2s ease-out;
        }

        @keyframes tooltipFadeIn {
          from {
            opacity: 0;
            transform: translateY(-8px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .tooltip-header {
          display: flex;
          align-items: center;
          gap: 8px;
          margin-bottom: 12px;
          padding-bottom: 10px;
          border-bottom: 2px solid #e5e7eb;
        }

        .tooltip-icon {
          font-size: 20px;
          line-height: 1;
        }

        .tooltip-header h4 {
          margin: 0;
          color: #111827;
          font-size: 15px;
          font-weight: 700;
        }

        .tooltip-description {
          color: #374151;
          font-size: 13px;
          line-height: 1.5;
          margin: 0 0 12px 0;
        }

        .tooltip-section {
          margin-top: 12px;
          padding: 10px;
          background: #f3f4f6;
          border-radius: 8px;
          border-left: 3px solid #6b7280;
        }

        .tooltip-section.example {
          background: #dbeafe;
          border-left-color: #3b82f6;
        }

        .tooltip-section.best-practice {
          background: #d1fae5;
          border-left-color: #10b981;
        }

        .tooltip-section strong {
          display: block;
          color: #111827;
          font-size: 11px;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 0.5px;
          margin-bottom: 4px;
        }

        .tooltip-section p {
          margin: 0;
          color: #374151;
          font-size: 12px;
          line-height: 1.4;
        }
      `}</style>
    </div>
  );
};

/**
 * Template Selection Panel
 */
interface TemplatesPanelProps {
  onSelectTemplate: (template: ArchitectureTemplate) => void;
  onClose: () => void;
}

export const TemplatesPanel: React.FC<TemplatesPanelProps> = ({ onSelectTemplate, onClose }) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('All');

  const categories = ['All', 'Web', 'Data', 'Enterprise', 'Serverless', 'Hybrid'];
  const filteredTemplates =
    selectedCategory === 'All'
      ? architectureTemplates
      : architectureTemplates.filter((t) => t.category === selectedCategory);

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'Beginner':
        return '#10b981';
      case 'Intermediate':
        return '#f59e0b';
      case 'Advanced':
        return '#ef4444';
      default:
        return '#6b7280';
    }
  };

  return (
    <div className="templates-panel">
      <div className="panel-header">
        <div>
          <h3>Architecture Templates</h3>
          <p className="panel-subtitle">Start with proven patterns</p>
        </div>
        <button onClick={onClose} className="close-btn" title="Close">
          ×
        </button>
      </div>

      <div className="category-filters">
        {categories.map((cat) => (
          <button
            key={cat}
            className={`category-filter ${selectedCategory === cat ? 'active' : ''}`}
            onClick={() => setSelectedCategory(cat)}
          >
            {cat}
          </button>
        ))}
      </div>

      <div className="templates-grid">
        {filteredTemplates.map((template) => (
          <div key={template.id} className="template-card">
            <div className="template-header">
              <span className="template-icon">{template.icon}</span>
              <div className="template-meta">
                <span
                  className="difficulty-badge"
                  style={{ background: getDifficultyColor(template.difficulty) + '20', color: getDifficultyColor(template.difficulty) }}
                >
                  {template.difficulty}
                </span>
                <span className="cost-badge">{template.estimatedCost}</span>
              </div>
            </div>
            <h4>{template.name}</h4>
            <p className="template-description">{template.description}</p>

            <div className="learning-objectives">
              <strong>You'll Learn:</strong>
              <ul>
                {template.learningObjectives.slice(0, 3).map((obj, idx) => (
                  <li key={idx}>{obj}</li>
                ))}
              </ul>
            </div>

            <button
              className="use-template-btn"
              onClick={() => onSelectTemplate(template)}
            >
              Use This Template
            </button>
          </div>
        ))}
      </div>

      <style>{`
        .templates-panel {
          position: fixed;
          right: 0;
          top: 80px;
          width: 650px;
          max-height: calc(100vh - 100px);
          background: white;
          border-left: 2px solid #e5e7eb;
          overflow-y: auto;
          padding: 24px;
          box-shadow: -4px 0 20px rgba(0,0,0,0.15);
          z-index: 100;
          animation: slideInRight 0.3s ease-out;
        }

        @keyframes slideInRight {
          from {
            transform: translateX(100%);
            opacity: 0;
          }
          to {
            transform: translateX(0);
            opacity: 1;
          }
        }

        .panel-header {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          margin-bottom: 24px;
          padding-bottom: 16px;
          border-bottom: 3px solid #3b82f6;
        }

        .panel-header h3 {
          margin: 0 0 4px 0;
          color: #111827;
          font-size: 22px;
          font-weight: 700;
        }

        .panel-subtitle {
          margin: 0;
          color: #6b7280;
          font-size: 14px;
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

        .category-filters {
          display: flex;
          gap: 8px;
          margin-bottom: 24px;
          flex-wrap: wrap;
        }

        .category-filter {
          padding: 8px 16px;
          background: #f3f4f6;
          border: 2px solid #e5e7eb;
          border-radius: 8px;
          cursor: pointer;
          font-size: 13px;
          font-weight: 600;
          color: #374151;
          transition: all 0.2s;
        }

        .category-filter:hover {
          background: #e5e7eb;
          transform: translateY(-1px);
        }

        .category-filter.active {
          background: #3b82f6;
          border-color: #3b82f6;
          color: white;
          box-shadow: 0 4px 8px rgba(59, 130, 246, 0.3);
        }

        .templates-grid {
          display: grid;
          grid-template-columns: 1fr;
          gap: 20px;
        }

        .template-card {
          border: 2px solid #e5e7eb;
          border-radius: 12px;
          padding: 20px;
          background: linear-gradient(135deg, #ffffff 0%, #f9fafb 100%);
          transition: all 0.2s;
        }

        .template-card:hover {
          border-color: #3b82f6;
          box-shadow: 0 8px 20px rgba(59, 130, 246, 0.15);
          transform: translateY(-3px);
        }

        .template-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 12px;
        }

        .template-icon {
          font-size: 32px;
          line-height: 1;
        }

        .template-meta {
          display: flex;
          gap: 8px;
          flex-wrap: wrap;
        }

        .difficulty-badge,
        .cost-badge {
          padding: 4px 10px;
          border-radius: 6px;
          font-size: 11px;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 0.3px;
        }

        .cost-badge {
          background: #dbeafe;
          color: #1e40af;
        }

        .template-card h4 {
          margin: 0 0 8px 0;
          color: #111827;
          font-size: 18px;
          font-weight: 700;
        }

        .template-description {
          color: #6b7280;
          font-size: 13px;
          line-height: 1.5;
          margin: 0 0 16px 0;
        }

        .learning-objectives {
          background: #f0fdf4;
          border: 1px solid #86efac;
          border-radius: 8px;
          padding: 12px;
          margin-bottom: 16px;
        }

        .learning-objectives strong {
          display: block;
          color: #065f46;
          font-size: 12px;
          font-weight: 700;
          margin-bottom: 8px;
        }

        .learning-objectives ul {
          list-style: none;
          padding: 0;
          margin: 0;
        }

        .learning-objectives li {
          padding: 4px 0 4px 20px;
          position: relative;
          color: #047857;
          font-size: 12px;
          line-height: 1.4;
        }

        .learning-objectives li:before {
          content: '✓';
          position: absolute;
          left: 0;
          color: #10b981;
          font-weight: 700;
        }

        .use-template-btn {
          width: 100%;
          padding: 12px;
          background: linear-gradient(135deg, #3b82f6 0%, #2563eb 100%);
          color: white;
          border: none;
          border-radius: 8px;
          font-size: 14px;
          font-weight: 700;
          cursor: pointer;
          transition: all 0.2s;
        }

        .use-template-btn:hover {
          background: linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%);
          box-shadow: 0 6px 16px rgba(59, 130, 246, 0.4);
          transform: translateY(-2px);
        }

        .use-template-btn:active {
          transform: translateY(0);
        }
      `}</style>
    </div>
  );
};

/**
 * Cost Estimation Panel
 */
interface CostPanelProps {
  design: ArchitectureDesign;
  onClose: () => void;
}

export const CostEstimationPanel: React.FC<CostPanelProps> = ({ design, onClose }) => {
  const estimate = estimateArchitectureCost(design);

  return (
    <div className="cost-panel">
      <div className="panel-header">
        <div>
          <h3>Cost Estimation</h3>
          <p className="panel-subtitle">Monthly cost projection</p>
        </div>
        <button onClick={onClose} className="close-btn" title="Close">
          ×
        </button>
      </div>

      <div className="cost-summary">
        <div className="cost-range">
          <div className="cost-label">Estimated Monthly Cost</div>
          <div className="cost-value">
            ${estimate.monthlyMin.toLocaleString()} - ${estimate.monthlyMax.toLocaleString()}
          </div>
          <div className="cost-note">
            Actual costs vary by usage, region, and service tier
          </div>
        </div>
      </div>

      <div className="cost-breakdown-section">
        <h4>Cost Breakdown</h4>
        <div className="breakdown-table">
          {estimate.breakdown.map((item, idx) => (
            <div key={idx} className="breakdown-row">
              <div className="breakdown-component">{item.component}</div>
              <div className="breakdown-cost">{item.cost}</div>
              <div className="breakdown-factor">{item.factor}</div>
            </div>
          ))}
        </div>
      </div>

      <div className="cost-recommendations">
        <h4>💰 Cost Optimization Tips</h4>
        <ul>
          {estimate.recommendations.map((rec, idx) => (
            <li key={idx}>{rec}</li>
          ))}
        </ul>
      </div>

      <style>{`
        .cost-panel {
          position: fixed;
          right: 0;
          top: 80px;
          width: 550px;
          max-height: calc(100vh - 100px);
          background: white;
          border-left: 2px solid #e5e7eb;
          overflow-y: auto;
          padding: 24px;
          box-shadow: -4px 0 20px rgba(0,0,0,0.15);
          z-index: 100;
          animation: slideInRight 0.3s ease-out;
        }

        .cost-summary {
          background: linear-gradient(135deg, #3b82f6 0%, #2563eb 100%);
          border-radius: 12px;
          padding: 24px;
          margin-bottom: 24px;
          color: white;
        }

        .cost-range {
          text-align: center;
        }

        .cost-label {
          font-size: 13px;
          font-weight: 600;
          text-transform: uppercase;
          letter-spacing: 0.5px;
          opacity: 0.9;
          margin-bottom: 8px;
        }

        .cost-value {
          font-size: 36px;
          font-weight: 800;
          margin-bottom: 8px;
          text-shadow: 0 2px 4px rgba(0,0,0,0.1);
        }

        .cost-note {
          font-size: 12px;
          opacity: 0.8;
        }

        .cost-breakdown-section h4,
        .cost-recommendations h4 {
          margin: 0 0 16px 0;
          color: #111827;
          font-size: 16px;
          font-weight: 700;
          padding-bottom: 10px;
          border-bottom: 2px solid #e5e7eb;
        }

        .breakdown-table {
          display: flex;
          flex-direction: column;
          gap: 12px;
          margin-bottom: 24px;
        }

        .breakdown-row {
          background: #f9fafb;
          border: 1px solid #e5e7eb;
          border-radius: 8px;
          padding: 12px;
        }

        .breakdown-component {
          font-weight: 700;
          color: #111827;
          font-size: 14px;
          margin-bottom: 4px;
        }

        .breakdown-cost {
          color: #3b82f6;
          font-size: 16px;
          font-weight: 700;
          margin-bottom: 4px;
        }

        .breakdown-factor {
          color: #6b7280;
          font-size: 11px;
        }

        .cost-recommendations {
          background: #fef3c7;
          border: 2px solid #fbbf24;
          border-radius: 12px;
          padding: 16px;
        }

        .cost-recommendations ul {
          list-style: none;
          padding: 0;
          margin: 0;
        }

        .cost-recommendations li {
          padding: 8px 0 8px 24px;
          position: relative;
          color: #78350f;
          font-size: 13px;
          line-height: 1.5;
        }

        .cost-recommendations li:before {
          content: '💡';
          position: absolute;
          left: 0;
        }
      `}</style>
    </div>
  );
};

/**
 * Security Hints Panel
 */
interface SecurityPanelProps {
  design: ArchitectureDesign;
  onClose: () => void;
}

export const SecurityHintsPanel: React.FC<SecurityPanelProps> = ({ design, onClose }) => {
  const hints = analyzeSecurityHints(design);

  const getHintStyle = (type: string) => {
    switch (type) {
      case 'critical':
        return { bg: '#fee2e2', border: '#ef4444', icon: '🚨' };
      case 'warning':
        return { bg: '#fef3c7', border: '#f59e0b', icon: '⚠️' };
      case 'info':
        return { bg: '#dbeafe', border: '#3b82f6', icon: 'ℹ️' };
      default:
        return { bg: '#f3f4f6', border: '#6b7280', icon: '📝' };
    }
  };

  return (
    <div className="security-hints-panel">
      <div className="panel-header">
        <div>
          <h3>Security Analysis</h3>
          <p className="panel-subtitle">
            {hints.length === 0 ? 'No issues found' : `${hints.length} consideration(s) found`}
          </p>
        </div>
        <button onClick={onClose} className="close-btn" title="Close">
          ×
        </button>
      </div>

      {hints.length === 0 ? (
        <div className="no-hints">
          <span className="success-icon">✅</span>
          <h4>Great Work!</h4>
          <p>No security issues detected in your architecture.</p>
          <p className="hint-text">
            Continue following best practices and stay vigilant about security.
          </p>
        </div>
      ) : (
        <div className="hints-list">
          {hints.map((hint, idx) => {
            const style = getHintStyle(hint.type);
            return (
              <div
                key={idx}
                className="hint-card"
                style={{
                  background: style.bg,
                  borderLeft: `4px solid ${style.border}`,
                }}
              >
                <div className="hint-header">
                  <span className="hint-icon">{style.icon}</span>
                  <h4>{hint.title}</h4>
                  <span className="hint-type">{hint.type}</span>
                </div>
                <p className="hint-description">{hint.description}</p>
                <div className="hint-remediation">
                  <strong>How to Fix:</strong>
                  <p>{hint.remediation}</p>
                </div>
                {hint.affectedComponents && hint.affectedComponents.length > 0 && (
                  <div className="affected-components">
                    <strong>Affected Components:</strong>
                    <span>{hint.affectedComponents.length} component(s)</span>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      <style>{`
        .security-hints-panel {
          position: fixed;
          right: 0;
          top: 80px;
          width: 550px;
          max-height: calc(100vh - 100px);
          background: white;
          border-left: 2px solid #e5e7eb;
          overflow-y: auto;
          padding: 24px;
          box-shadow: -4px 0 20px rgba(0,0,0,0.15);
          z-index: 100;
          animation: slideInRight 0.3s ease-out;
        }

        .no-hints {
          text-align: center;
          padding: 40px 20px;
        }

        .success-icon {
          font-size: 64px;
          display: block;
          margin-bottom: 16px;
        }

        .no-hints h4 {
          margin: 0 0 12px 0;
          color: #111827;
          font-size: 20px;
          font-weight: 700;
        }

        .no-hints p {
          color: #6b7280;
          margin: 8px 0;
          font-size: 14px;
        }

        .hint-text {
          font-size: 12px;
          font-style: italic;
        }

        .hints-list {
          display: flex;
          flex-direction: column;
          gap: 16px;
        }

        .hint-card {
          border-radius: 12px;
          padding: 16px;
        }

        .hint-header {
          display: flex;
          align-items: center;
          gap: 8px;
          margin-bottom: 12px;
        }

        .hint-icon {
          font-size: 20px;
          line-height: 1;
        }

        .hint-header h4 {
          flex: 1;
          margin: 0;
          color: #111827;
          font-size: 15px;
          font-weight: 700;
        }

        .hint-type {
          padding: 2px 8px;
          background: rgba(0,0,0,0.1);
          border-radius: 4px;
          font-size: 10px;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }

        .hint-description {
          color: #374151;
          font-size: 13px;
          line-height: 1.5;
          margin: 0 0 12px 0;
        }

        .hint-remediation {
          background: rgba(255,255,255,0.7);
          border-radius: 8px;
          padding: 10px;
          margin-bottom: 12px;
        }

        .hint-remediation strong,
        .affected-components strong {
          display: block;
          color: #111827;
          font-size: 11px;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 0.5px;
          margin-bottom: 4px;
        }

        .hint-remediation p {
          margin: 0;
          color: #374151;
          font-size: 12px;
          line-height: 1.4;
        }

        .affected-components {
          background: rgba(0,0,0,0.05);
          border-radius: 6px;
          padding: 8px;
          display: flex;
          justify-content: space-between;
          align-items: center;
        }

        .affected-components span {
          font-size: 11px;
          font-weight: 600;
          color: #6b7280;
        }
      `}</style>
    </div>
  );
};

/**
 * Tutorial Guide Component
 */
interface TutorialGuideProps {
  currentStep: number;
  onNext: () => void;
  onPrev: () => void;
  onClose: () => void;
}

export const TutorialGuide: React.FC<TutorialGuideProps> = ({
  currentStep,
  onNext,
  onPrev,
  onClose,
}) => {
  const step = tutorialSteps[currentStep];
  const progress = ((currentStep + 1) / tutorialSteps.length) * 100;

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

/**
 * Help Icon for Library Items
 */
interface HelpIconProps {
  subtype: string;
  onShowTooltip: (tooltip: Tooltip, event: React.MouseEvent) => void;
}

export const HelpIcon: React.FC<HelpIconProps> = ({ subtype, onShowTooltip }) => {
  const tooltip = cloudTooltips[subtype];

  if (!tooltip) {
    return null;
  }

  return (
    <button
      className="help-icon-btn"
      onClick={(e) => {
        e.stopPropagation();
        onShowTooltip(tooltip, e);
      }}
      title="Learn more"
    >
      ?
      <style>{`
        .help-icon-btn {
          width: 20px;
          height: 20px;
          border-radius: 50%;
          background: #3b82f6;
          color: white;
          border: none;
          font-size: 12px;
          font-weight: 700;
          cursor: pointer;
          transition: all 0.2s;
          display: flex;
          align-items: center;
          justify-content: center;
          position: absolute;
          top: 10px;
          right: 10px;
          z-index: 10;
        }

        .help-icon-btn:hover {
          background: #2563eb;
          transform: scale(1.1);
          box-shadow: 0 4px 8px rgba(59, 130, 246, 0.4);
        }
      `}</style>
    </button>
  );
};
