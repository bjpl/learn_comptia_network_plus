/**
 * Utility functions for score calculations
 */

export const calculateScore = (
  completedSteps: Set<number>,
  totalSteps: number,
  showHints: boolean
): number => {
  const stepPoints = 100 / (totalSteps || 1);
  const penaltyForHints = showHints ? 10 : 0;
  const score = Math.round(completedSteps.size * stepPoints - penaltyForHints);
  return Math.max(0, Math.min(100, score));
};
