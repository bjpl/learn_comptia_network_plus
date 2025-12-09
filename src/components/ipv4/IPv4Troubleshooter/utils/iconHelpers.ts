/**
 * Icon helper utilities
 */
import { Computer, Router, CloudQueue } from '@mui/icons-material';

export const getDeviceIcon = (type: string) => {
  switch (type) {
    case 'host':
      return Computer;
    case 'router':
      return Router;
    case 'server':
      return CloudQueue;
    default:
      return Computer;
  }
};

export const getStatusColor = (
  status: string
): 'success' | 'error' | 'default' | 'warning' => {
  switch (status) {
    case 'online':
      return 'success';
    case 'offline':
    case 'error':
      return 'error';
    default:
      return 'default';
  }
};

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
