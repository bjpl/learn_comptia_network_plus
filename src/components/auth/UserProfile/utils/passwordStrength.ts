/**
 * Password strength utilities
 */

/**
 * Get color for password strength indicator
 */
export const getPasswordStrengthColor = (score: number): string => {
  const colors = ['#dc2626', '#f59e0b', '#eab308', '#84cc16', '#22c55e'];
  return colors[score] || colors[0];
};

/**
 * Get label for password strength
 */
export const getPasswordStrengthLabel = (score: number): string => {
  const labels = ['Very Weak', 'Weak', 'Fair', 'Good', 'Strong'];
  return labels[score] || labels[0];
};
