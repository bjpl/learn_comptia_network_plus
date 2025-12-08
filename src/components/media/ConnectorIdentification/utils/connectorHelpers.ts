/**
 * Helper utilities for connector identification
 */

import type { Pin } from '../../media-types';

/**
 * Check if wiring order is correct
 */
export function checkWiringOrder(
  draggedWires: Pin[],
  correctPins: Pin[]
): boolean {
  return draggedWires.every(
    (wire, idx) => wire.number === correctPins[idx].number
  );
}

/**
 * Shuffle array
 */
export function shuffleArray<T>(array: T[]): T[] {
  return [...array].sort(() => Math.random() - 0.5);
}

/**
 * Calculate percentage
 */
export function calculatePercentage(current: number, total: number): number {
  if (total === 0) return 0;
  return Math.round((current / total) * 100);
}

/**
 * Get pin color style
 */
export function getPinColorStyle(color: string): {
  backgroundColor: string;
  border: string;
} {
  const backgroundColor = color.includes('white')
    ? `#${color.split('-')[1] || 'cccccc'}33`
    : color === 'unused'
      ? '#cccccc'
      : color;

  return {
    backgroundColor,
    border: '2px solid #333',
  };
}
