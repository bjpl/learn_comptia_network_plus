/**
 * Network visualization canvas component
 */

import React from 'react';
import type { TrafficType } from '../../protocols-types';
import type { AnimationState } from '../types';

interface NetworkCanvasProps {
  canvasRef: React.RefObject<HTMLCanvasElement>;
  selectedType: TrafficType;
  animationState: AnimationState;
  onStartAnimation: () => void;
  onResetAnimation: () => void;
}

export const NetworkCanvas: React.FC<NetworkCanvasProps> = ({
  canvasRef,
  selectedType,
  animationState,
  onStartAnimation,
  onResetAnimation,
}) => {
  return (
    <div className="network-canvas-container">
      <canvas
        ref={canvasRef}
        width={800}
        height={600}
        className="network-canvas"
        role="img"
        aria-label={`Network visualization showing ${selectedType.name} traffic pattern with ${selectedType.visual.sourceNodes.length} source nodes and ${selectedType.visual.destinationNodes.length} destination nodes`}
      />

      {/* Screen reader description for canvas content */}
      <div className="sr-only" aria-live="polite" aria-atomic="true">
        {animationState.animating
          ? `Animating ${selectedType.name} traffic: ${animationState.packets.length} packets in transit from source nodes to destination nodes`
          : `Static view of ${selectedType.name} topology with 10 nodes arranged in a circle. Source nodes: ${selectedType.visual.sourceNodes.join(', ')}. Destination nodes: ${selectedType.visual.destinationNodes.join(', ')}`}
      </div>

      <div className="animation-controls" role="group" aria-label="Animation controls">
        <button
          onClick={onStartAnimation}
          className="control-btn start"
          aria-label={`Start ${selectedType.name} traffic animation`}
          disabled={animationState.animating}
        >
          Start Animation
        </button>
        <button
          onClick={onResetAnimation}
          className="control-btn reset"
          aria-label="Reset animation to initial state"
        >
          Reset
        </button>
      </div>

      {/* Keyboard navigation instructions */}
      <div className="sr-only">
        Use the buttons above to control the animation. Press Tab to navigate between traffic type
        selections and animation controls. Press Enter or Space to activate buttons.
      </div>

      <div className="legend">
        <div className="legend-item">
          <span className="legend-dot source"></span>
          <span>Source Node</span>
        </div>
        <div className="legend-item">
          <span className="legend-dot destination"></span>
          <span>Destination Node</span>
        </div>
        <div className="legend-item">
          <span className="legend-dot normal"></span>
          <span>Normal Node</span>
        </div>
      </div>
    </div>
  );
};
