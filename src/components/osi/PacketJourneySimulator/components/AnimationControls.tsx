import React from 'react';
import type { AnimationState } from '../../osi-types';
import type { AnimationSpeed, Protocol } from '../types';

interface AnimationControlsProps {
  animationState: AnimationState;
  onTogglePlayPause: () => void;
  onReset: () => void;
  onChangeSpeed: (speed: AnimationSpeed) => void;
  onChangeProtocol: (protocol: Protocol) => void;
}

export const AnimationControls: React.FC<AnimationControlsProps> = ({
  animationState,
  onTogglePlayPause,
  onReset,
  onChangeSpeed,
  onChangeProtocol,
}) => {
  return (
    <div
      className="controls"
      style={{ display: 'flex', gap: '15px', marginTop: '15px', flexWrap: 'wrap' }}
    >
      <button
        onClick={onTogglePlayPause}
        style={{
          padding: '10px 20px',
          backgroundColor: animationState.isPlaying ? '#f44336' : '#4CAF50',
          color: 'white',
          border: 'none',
          borderRadius: '4px',
          cursor: 'pointer',
          fontWeight: 'bold',
        }}
        aria-label={animationState.isPlaying ? 'Pause animation' : 'Play animation'}
        aria-pressed={animationState.isPlaying}
      >
        {animationState.isPlaying ? '⏸ Pause' : '▶ Play'}
      </button>

      <button
        onClick={onReset}
        style={{
          padding: '10px 20px',
          backgroundColor: '#2196F3',
          color: 'white',
          border: 'none',
          borderRadius: '4px',
          cursor: 'pointer',
        }}
        aria-label="Reset animation to beginning"
      >
        🔄 Reset
      </button>

      <div style={{ display: 'flex', gap: '5px' }}>
        {[0.5, 1, 2].map((speed) => (
          <button
            key={speed}
            onClick={() => onChangeSpeed(speed as AnimationSpeed)}
            className={animationState.speed !== speed ? 'bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-gray-100' : ''}
            style={{
              padding: '10px 15px',
              backgroundColor: animationState.speed === speed ? '#FF9800' : undefined,
              color: animationState.speed === speed ? 'white' : undefined,
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer',
            }}
          >
            {speed}x
          </button>
        ))}
      </div>

      <div style={{ display: 'flex', gap: '5px' }}>
        {(['TCP', 'UDP'] as const).map((proto) => (
          <button
            key={proto}
            onClick={() => onChangeProtocol(proto)}
            className={animationState.protocol !== proto ? 'bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-gray-100' : ''}
            style={{
              padding: '10px 15px',
              backgroundColor: animationState.protocol === proto ? '#9C27B0' : undefined,
              color: animationState.protocol === proto ? 'white' : undefined,
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer',
            }}
          >
            {proto}
          </button>
        ))}
      </div>
    </div>
  );
};
