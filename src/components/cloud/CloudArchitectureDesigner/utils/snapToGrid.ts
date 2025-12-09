/**
 * Utility function for grid snapping
 */

export const createSnapToGrid = (snapEnabled: boolean, gridSize: number) => {
  return (value: number): number => {
    if (!snapEnabled) return value;
    return Math.round(value / gridSize) * gridSize;
  };
};
