/**
 * NetworkTooltip - Reusable Tooltip Component
 * Enhanced tooltip with Network+ exam tips integration
 *
 * Features:
 * - Position-aware rendering
 * - Exam tip callouts
 * - Fade-in animations
 * - Accessible ARIA attributes
 */

import React, { useEffect, useState } from 'react';

export interface NetworkTooltipProps {
  /** Main tooltip content */
  content: string;
  /** Optional Network+ exam-specific tip */
  examTip?: string;
  /** Tooltip position (x, y coordinates) */
  position: { x: number; y: number };
  /** Callback when tooltip should close */
  onClose?: () => void;
  /** Optional max width (default: 300px) */
  maxWidth?: number;
  /** Variant style */
  variant?: 'default' | 'exam' | 'warning' | 'info';
}

export const NetworkTooltip: React.FC<NetworkTooltipProps> = ({
  content,
  examTip,
  position,
  onClose,
  maxWidth = 300,
  variant = 'default',
}) => {
  const [adjustedPosition, setAdjustedPosition] = useState(position);

  // Adjust position to keep tooltip within viewport
  useEffect(() => {
    const tooltip = document.getElementById('network-tooltip');
    if (!tooltip) {
      return;
    }

    const rect = tooltip.getBoundingClientRect();
    const viewportWidth = window.innerWidth;
    const viewportHeight = window.innerHeight;

    let newX = position.x + 10;
    let newY = position.y + 10;

    // Adjust horizontal position if tooltip overflows
    if (newX + rect.width > viewportWidth - 20) {
      newX = position.x - rect.width - 10;
    }

    // Adjust vertical position if tooltip overflows
    if (newY + rect.height > viewportHeight - 20) {
      newY = position.y - rect.height - 10;
    }

    setAdjustedPosition({ x: newX, y: newY });
  }, [position]);

  // Get variant-specific colors
  const getVariantColors = () => {
    switch (variant) {
      case 'exam':
        return {
          bg: '#1f2937',
          border: '#fbbf24',
          tipBg: 'rgba(254, 243, 199, 0.2)',
          tipBorder: '#fbbf24',
        };
      case 'warning':
        return {
          bg: '#7f1d1d',
          border: '#ef4444',
          tipBg: 'rgba(254, 202, 202, 0.2)',
          tipBorder: '#ef4444',
        };
      case 'info':
        return {
          bg: '#1e3a8a',
          border: '#3b82f6',
          tipBg: 'rgba(191, 219, 254, 0.2)',
          tipBorder: '#3b82f6',
        };
      default:
        return {
          bg: '#1f2937',
          border: '#667eea',
          tipBg: 'rgba(102, 126, 234, 0.2)',
          tipBorder: '#667eea',
        };
    }
  };

  const colors = getVariantColors();

  return (
    <div
      id="network-tooltip"
      className="network-tooltip-overlay"
      style={{
        left: `${adjustedPosition.x}px`,
        top: `${adjustedPosition.y}px`,
      }}
      role="tooltip"
      aria-live="polite"
    >
      <div
        className="network-tooltip-content"
        style={{ maxWidth: `${maxWidth}px`, background: colors.bg }}
      >
        <p className="tooltip-text">{content}</p>
        {examTip && (
          <div
            className="tooltip-exam-tip"
            style={{
              background: colors.tipBg,
              borderLeftColor: colors.tipBorder,
            }}
          >
            <span className="exam-tip-icon">📝</span>
            <p className="exam-tip-text">{examTip}</p>
          </div>
        )}
        {onClose && (
          <button
            className="tooltip-close"
            onClick={onClose}
            aria-label="Close tooltip"
            type="button"
          >
            ×
          </button>
        )}
      </div>
      <div className="tooltip-arrow" style={{ background: colors.bg }} />

      <style>{`
        .network-tooltip-overlay {
          position: fixed;
          z-index: 9999;
          pointer-events: auto;
          animation: tooltip-fade-in 0.2s ease;
        }

        @keyframes tooltip-fade-in {
          from {
            opacity: 0;
            transform: translateY(-5px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .network-tooltip-content {
          color: white;
          padding: 1rem;
          border-radius: 0.5rem;
          box-shadow: 0 10px 40px rgba(0, 0, 0, 0.3);
          position: relative;
        }

        .tooltip-text {
          margin: 0 0 0.75rem 0;
          font-size: 0.875rem;
          line-height: 1.5;
        }

        .tooltip-text:last-child {
          margin-bottom: 0;
        }

        .tooltip-exam-tip {
          padding: 0.75rem;
          border-radius: 0.375rem;
          border-left: 3px solid;
          display: flex;
          align-items: flex-start;
          gap: 0.5rem;
        }

        .exam-tip-icon {
          flex-shrink: 0;
          font-size: 1rem;
        }

        .exam-tip-text {
          margin: 0;
          font-size: 0.8125rem;
          line-height: 1.5;
          color: #fde68a;
        }

        .tooltip-close {
          position: absolute;
          top: 0.25rem;
          right: 0.25rem;
          width: 24px;
          height: 24px;
          border: none;
          background: rgba(255, 255, 255, 0.2);
          color: white;
          border-radius: 50%;
          cursor: pointer;
          font-size: 1.25rem;
          line-height: 1;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: background 0.2s ease;
        }

        .tooltip-close:hover {
          background: rgba(255, 255, 255, 0.3);
        }

        .tooltip-arrow {
          position: absolute;
          bottom: -6px;
          left: 20px;
          width: 12px;
          height: 12px;
          transform: rotate(45deg);
        }

        /* Responsive adjustments */
        @media (max-width: 640px) {
          .network-tooltip-content {
            max-width: calc(100vw - 40px) !important;
          }
        }
      `}</style>
    </div>
  );
};

export default NetworkTooltip;
