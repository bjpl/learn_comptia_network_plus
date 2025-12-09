import React from 'react';
import type { PacketState, AnimationState } from '../../osi-types';
import { LAYER_NAMES } from '../../osi-data';

interface StatusDisplayProps {
  packetState: PacketState;
  animationState: AnimationState;
}

export const StatusDisplay: React.FC<StatusDisplayProps> = ({ packetState, animationState }) => {
  return (
    <div
      className="text-gray-800 dark:text-gray-200"
      style={{ marginTop: '10px', fontSize: '14px' }}
      role="status"
      aria-live="polite"
      aria-atomic="true"
    >
      <strong>Current Layer:</strong> Layer {packetState.currentLayer} (
      {LAYER_NAMES[packetState.currentLayer]}) |<strong> Direction:</strong>{' '}
      {packetState.direction === 'encapsulation'
        ? ' Encapsulation (Adding Headers)'
        : ' Decapsulation (Removing Headers)'}{' '}
      |<strong> Step:</strong> {animationState.currentStep}/14
    </div>
  );
};
