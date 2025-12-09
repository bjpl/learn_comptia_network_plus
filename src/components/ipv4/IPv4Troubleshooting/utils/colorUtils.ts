/**
 * Utility functions for color mapping based on difficulty and problem types
 */

import type { DifficultyColor, ProblemTypeColor } from '../types';

export const getDifficultyColor = (difficulty: string): DifficultyColor => {
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

export const getProblemTypeColor = (type: string): ProblemTypeColor => {
  const colorMap: Record<string, 'error' | 'warning' | 'info' | 'success'> = {
    apipa: 'warning',
    private_routing: 'info',
    multicast_host: 'error',
    loopback_interface: 'error',
    network_address: 'error',
    broadcast_address: 'error',
    subnet_mismatch: 'warning',
    duplicate_ip: 'error',
    wrong_gateway: 'warning',
  };
  return colorMap[type] || 'default';
};
