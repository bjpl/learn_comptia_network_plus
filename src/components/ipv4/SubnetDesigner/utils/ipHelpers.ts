/**
 * IP address and subnet utility functions
 */

import { ipToInt } from '../../../../utils/networking';

/**
 * Convert IP address to binary format
 */
export const ipToBinary = (ip: string): string => {
  try {
    return ip
      .split('.')
      .map((octet) => parseInt(octet).toString(2).padStart(8, '0'))
      .join('.');
  } catch {
    return 'Invalid IP';
  }
};

/**
 * Convert subnet mask to CIDR notation
 */
export const maskToCidr = (mask: string): number => {
  const maskInt = ipToInt(mask);
  let cidr = 0;
  for (let i = 31; i >= 0; i--) {
    if ((maskInt & (1 << i)) !== 0) {
      cidr++;
    } else {
      break;
    }
  }
  return cidr;
};

/**
 * Copy text to clipboard
 */
export const copyToClipboard = (text: string): void => {
  navigator.clipboard.writeText(text).catch(() => {
    alert('Failed to copy to clipboard');
  });
};

/**
 * Get difficulty color based on difficulty level
 */
export const getDifficultyColor = (
  difficulty: string
): 'success' | 'warning' | 'error' | 'default' => {
  switch (difficulty) {
    case 'beginner':
      return 'success';
    case 'intermediate':
      return 'warning';
    case 'advanced':
      return 'error';
    default:
      return 'default';
  }
};
