/**
 * Enhanced Tooltip Overlay component
 */

import React from 'react';
import type { Tooltip } from '../hooks/useTooltip';

interface TooltipOverlayProps {
  tooltip: Tooltip | null;
}

export const TooltipOverlay = React.memo<TooltipOverlayProps>(({ tooltip }) => {
  if (!tooltip) return null;

  return (
    <div
      className="tooltip-overlay"
      style={{
        left: `${tooltip.position.x + 10}px`,
        top: `${tooltip.position.y + 10}px`,
      }}
      role="tooltip"
    >
      <div className="tooltip-content">
        <p className="tooltip-text">{tooltip.content}</p>
        {tooltip.examTip && (
          <div className="tooltip-exam-tip">
            <span className="exam-tip-icon">📝</span>
            <p className="exam-tip-text">{tooltip.examTip}</p>
          </div>
        )}
      </div>
      <div className="tooltip-arrow" />
    </div>
  );
});

TooltipOverlay.displayName = 'TooltipOverlay';
