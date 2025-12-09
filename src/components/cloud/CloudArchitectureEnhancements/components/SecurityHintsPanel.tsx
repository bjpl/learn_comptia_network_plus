/**
 * Security Hints Panel
 */

import React from 'react';
import { analyzeSecurityHints } from '../../cloud-learning-utils';
import { getHintStyle } from '../utils/styleHelpers';
import type { SecurityPanelProps } from '../types';

export const SecurityHintsPanel: React.FC<SecurityPanelProps> = ({ design, onClose }) => {
  const hints = analyzeSecurityHints(design);

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
