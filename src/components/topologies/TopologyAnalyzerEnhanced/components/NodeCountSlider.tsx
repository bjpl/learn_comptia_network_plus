/**
 * Node count slider component
 */

import React from 'react';

interface NodeCountSliderProps {
  nodeCount: number;
  onNodeCountChange: (count: number) => void;
  onShowTooltip: (id: string, content: string, examTip: string, event: React.MouseEvent) => void;
  onHideTooltip: () => void;
}

export const NodeCountSlider = React.memo<NodeCountSliderProps>(
  ({ nodeCount, onNodeCountChange, onShowTooltip, onHideTooltip }) => {
    return (
      <div className="node-count-card">
        <div className="slider-header">
          <label htmlFor="node-slider" className="slider-label">
            Number of Nodes: <strong className="slider-value">{nodeCount}</strong>
          </label>
          <div
            className="info-icon"
            onMouseEnter={(e) =>
              onShowTooltip(
                'nodes-tip',
                'Adjust the number of nodes to see how cabling requirements scale',
                'Exam Tip: Memorize cable formulas - Star: n, Mesh: n(n-1)/2',
                e
              )
            }
            onMouseLeave={onHideTooltip}
          >
            ℹ️
          </div>
        </div>
        <input
          type="range"
          id="node-slider"
          min="3"
          max="20"
          value={nodeCount}
          onChange={(e) => onNodeCountChange(Number(e.target.value))}
          className="slider"
          aria-label="Number of network nodes"
          aria-valuemin={3}
          aria-valuemax={20}
          aria-valuenow={nodeCount}
        />
        <div className="slider-markers">
          <span>3</span>
          <span>11</span>
          <span>20</span>
        </div>
      </div>
    );
  }
);

NodeCountSlider.displayName = 'NodeCountSlider';
