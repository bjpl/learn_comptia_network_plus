/**
 * ExamTipBadge - Reusable Exam Tip Badge Component
 * Consistent badge styling for Network+ exam tips
 *
 * Features:
 * - Multiple variants (formula, concept, scenario)
 * - Hover animations
 * - Optional tooltip integration
 * - Accessible labels
 */

import React, { useState } from 'react';
import NetworkTooltip from './NetworkTooltip';

export interface ExamTipBadgeProps {
  /** Exam tip content */
  tip: string;
  /** Visual variant */
  variant?: 'formula' | 'concept' | 'scenario' | 'warning';
  /** Additional context for tooltip */
  details?: string;
  /** Custom icon (optional) */
  icon?: string;
  /** Size variant */
  size?: 'small' | 'medium' | 'large';
  /** Callback when badge is clicked */
  onClick?: () => void;
}

export const ExamTipBadge: React.FC<ExamTipBadgeProps> = ({
  tip,
  variant = 'concept',
  details,
  icon,
  size = 'medium',
  onClick,
}) => {
  const [showTooltip, setShowTooltip] = useState(false);
  const [tooltipPosition, setTooltipPosition] = useState({ x: 0, y: 0 });

  // Get variant-specific styling
  const getVariantStyles = () => {
    switch (variant) {
      case 'formula':
        return {
          bg: '#dbeafe',
          color: '#1e40af',
          icon: icon || '📐',
          label: 'Formula',
        };
      case 'scenario':
        return {
          bg: '#d1fae5',
          color: '#065f46',
          icon: icon || '💼',
          label: 'Scenario',
        };
      case 'warning':
        return {
          bg: '#fee2e2',
          color: '#991b1b',
          icon: icon || '⚠️',
          label: 'Warning',
        };
      default:
        return {
          bg: '#fef3c7',
          color: '#92400e',
          icon: icon || '📝',
          label: 'Concept',
        };
    }
  };

  // Get size-specific styling
  const getSizeStyles = () => {
    switch (size) {
      case 'small':
        return {
          padding: '0.25rem 0.5rem',
          fontSize: '0.7rem',
          iconSize: '0.8rem',
        };
      case 'large':
        return {
          padding: '0.5rem 1rem',
          fontSize: '0.875rem',
          iconSize: '1.1rem',
        };
      default:
        return {
          padding: '0.375rem 0.75rem',
          fontSize: '0.75rem',
          iconSize: '0.95rem',
        };
    }
  };

  const variantStyles = getVariantStyles();
  const sizeStyles = getSizeStyles();

  const handleMouseEnter = (event: React.MouseEvent) => {
    if (details) {
      setTooltipPosition({ x: event.clientX, y: event.clientY });
      setShowTooltip(true);
    }
  };

  const handleMouseLeave = () => {
    setShowTooltip(false);
  };

  const handleClick = (event: React.MouseEvent) => {
    event.stopPropagation();
    if (onClick) {
      onClick();
    }
  };

  return (
    <>
      <span
        className="exam-tip-badge"
        style={{
          background: variantStyles.bg,
          color: variantStyles.color,
          padding: sizeStyles.padding,
          fontSize: sizeStyles.fontSize,
        }}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        onClick={onClick ? handleClick : undefined}
        role="button"
        tabIndex={0}
        aria-label={`${variantStyles.label} exam tip: ${tip}`}
        onKeyPress={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            if (onClick) {
              onClick();
            }
          }
        }}
      >
        <span className="badge-icon" style={{ fontSize: sizeStyles.iconSize }}>
          {variantStyles.icon}
        </span>
        <span className="badge-text">{tip}</span>
      </span>

      {showTooltip && details && (
        <NetworkTooltip
          content={tip}
          examTip={details}
          position={tooltipPosition}
          variant="exam"
        />
      )}

      <style>{`
        .exam-tip-badge {
          display: inline-flex;
          align-items: center;
          gap: 0.375rem;
          border-radius: 0.5rem;
          font-weight: 600;
          cursor: ${onClick || details ? 'pointer' : 'default'};
          transition: all 0.2s ease;
          white-space: nowrap;
          user-select: none;
        }

        .exam-tip-badge:hover {
          transform: scale(${onClick || details ? '1.05' : '1'});
          box-shadow: ${onClick || details ? '0 2px 8px rgba(0, 0, 0, 0.15)' : 'none'};
        }

        .exam-tip-badge:focus-visible {
          outline: 2px solid currentColor;
          outline-offset: 2px;
        }

        .badge-icon {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
        }

        .badge-text {
          line-height: 1;
        }

        /* Prevent text selection */
        .exam-tip-badge::selection {
          background: transparent;
        }
      `}</style>
    </>
  );
};

export default ExamTipBadge;
