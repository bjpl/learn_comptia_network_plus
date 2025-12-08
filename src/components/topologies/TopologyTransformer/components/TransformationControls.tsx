/**
 * Animation control buttons for topology transformation
 */

import React from 'react';

interface TransformationControlsProps {
  autoPlay: boolean;
  onPlayPause: () => void;
  onReset: () => void;
  showComparison: boolean;
  onToggleComparison: () => void;
}

export const TransformationControls = React.memo<TransformationControlsProps>(
  ({ autoPlay, onPlayPause, onReset, showComparison, onToggleComparison }) => {
    return (
      <div className="animation-controls">
        <button className="control-btn" onClick={onPlayPause}>
          {autoPlay ? '⏸ Pause' : '▶ Play'}
        </button>
        <button className="control-btn" onClick={onReset}>
          ↺ Reset
        </button>
        <button className="control-btn" onClick={onToggleComparison}>
          {showComparison ? '👁 Hide' : '👁 Show'} Comparison
        </button>
      </div>
    );
  }
);

TransformationControls.displayName = 'TransformationControls';
