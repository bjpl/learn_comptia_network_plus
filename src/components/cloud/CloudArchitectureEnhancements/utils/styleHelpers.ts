/**
 * Utility functions for styling and color management
 */

export const getDifficultyColor = (difficulty: string): string => {
  switch (difficulty) {
    case 'Beginner':
      return '#10b981';
    case 'Intermediate':
      return '#f59e0b';
    case 'Advanced':
      return '#ef4444';
    default:
      return '#6b7280';
  }
};

export const getHintStyle = (type: string) => {
  switch (type) {
    case 'critical':
      return { bg: '#fee2e2', border: '#ef4444', icon: '🚨' };
    case 'warning':
      return { bg: '#fef3c7', border: '#f59e0b', icon: '⚠️' };
    case 'info':
      return { bg: '#dbeafe', border: '#3b82f6', icon: 'ℹ️' };
    default:
      return { bg: '#f3f4f6', border: '#6b7280', icon: '📝' };
  }
};

export const calculateProgress = (currentStep: number, totalSteps: number): number => {
  return ((currentStep + 1) / totalSteps) * 100;
};
