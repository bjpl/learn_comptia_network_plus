/**
 * Returns color classes based on drift severity
 */
export const getDriftSeverityColor = (severity: string): string => {
  switch (severity) {
    case 'critical':
      return 'bg-red-100 border-red-500 text-red-800';
    case 'high':
      return 'bg-orange-100 border-orange-500 text-orange-800';
    case 'medium':
      return 'bg-yellow-100 border-yellow-500 text-yellow-800';
    default:
      return 'bg-blue-100 border-blue-500 text-blue-800';
  }
};
