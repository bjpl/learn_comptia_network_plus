/**
 * Tooltip Component - Shows contextual help when hovering over components
 */

import React from 'react';
import type { TooltipPopupProps } from '../types';

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
