import { deviceTemplates } from '../../appliances-data';
import type { SimulatedDevice } from '../types';

export function getDeviceIcon(type: string): string {
  return deviceTemplates[type as keyof typeof deviceTemplates]?.icon || '📦';
}

export function getStatusColor(status: SimulatedDevice['status']): string {
  switch (status) {
    case 'active':
      return 'border-green-500 bg-green-50';
    case 'warning':
      return 'border-yellow-500 bg-yellow-50';
    case 'error':
      return 'border-red-500 bg-red-50';
    case 'inactive':
      return 'border-gray-300 bg-gray-50';
  }
}
