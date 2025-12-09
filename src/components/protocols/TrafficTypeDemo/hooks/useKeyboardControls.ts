/**
 * Hook for keyboard navigation controls
 */

import { useCallback } from 'react';
import type { TrafficType } from '../../protocols-types';
import { TRAFFIC_TYPES } from '../../protocols-data';

interface UseKeyboardControlsProps {
  selectedType: TrafficType;
  animating: boolean;
  onTypeChange: (type: TrafficType) => void;
  onStartAnimation: () => void;
  onResetAnimation: () => void;
}

export const useKeyboardControls = ({
  selectedType,
  animating,
  onTypeChange,
  onStartAnimation,
  onResetAnimation,
}: UseKeyboardControlsProps) => {
  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      // Space to play/pause animation
      if (e.key === ' ') {
        e.preventDefault();
        if (animating) {
          onResetAnimation();
        } else {
          onStartAnimation();
        }
      }

      // Arrow Left/Right to switch traffic types
      if (e.key === 'ArrowLeft' || e.key === 'ArrowRight') {
        e.preventDefault();
        const currentIndex = TRAFFIC_TYPES.findIndex((t) => t.id === selectedType.id);
        const nextIndex =
          e.key === 'ArrowLeft'
            ? (currentIndex - 1 + TRAFFIC_TYPES.length) % TRAFFIC_TYPES.length
            : (currentIndex + 1) % TRAFFIC_TYPES.length;
        onTypeChange(TRAFFIC_TYPES[nextIndex]);
        onResetAnimation();
      }

      // R to reset
      if (e.key === 'r' || e.key === 'R') {
        e.preventDefault();
        onResetAnimation();
      }
    },
    [animating, selectedType.id, onTypeChange, onStartAnimation, onResetAnimation]
  );

  return { handleKeyDown };
};
