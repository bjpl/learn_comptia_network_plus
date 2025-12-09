/**
 * Utility functions for difficulty styling
 */

export const getDifficultyColor = (difficulty: string): string => {
  switch (difficulty) {
    case 'intermediate':
      return 'bg-blue-500';
    case 'advanced':
      return 'bg-orange-500';
    case 'expert':
      return 'bg-red-500';
    default:
      return 'bg-gray-500';
  }
};
