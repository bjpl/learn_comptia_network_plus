/**
 * Utility functions for time calculations
 */

export const getTimeElapsed = (startTime: number | null): string => {
  if (!startTime) {
    return '0:00';
  }
  const seconds = Math.floor((Date.now() - startTime) / 1000);
  const minutes = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${minutes}:${secs.toString().padStart(2, '0')}`;
};
