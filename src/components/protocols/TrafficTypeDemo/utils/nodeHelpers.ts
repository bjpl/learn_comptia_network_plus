/**
 * Utility functions for node positioning and management
 */

import type { Node } from '../types';

/**
 * Creates 10 nodes in a circular layout
 */
export const createCircularNodes = (
  centerX: number = 400,
  centerY: number = 300,
  radius: number = 250
): Node[] => {
  return Array.from({ length: 10 }, (_, i) => ({
    id: i,
    x: centerX + radius * Math.cos((i * 2 * Math.PI) / 10 - Math.PI / 2),
    y: centerY + radius * Math.sin((i * 2 * Math.PI) / 10 - Math.PI / 2),
    label: `Node ${i}`,
    active: false,
  }));
};
