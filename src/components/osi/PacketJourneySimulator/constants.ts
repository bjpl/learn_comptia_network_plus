import type { OSILayerNumber } from './types';

export const LAYER_COLORS: Record<OSILayerNumber, string> = {
  7: '#E91E63',
  6: '#9C27B0',
  5: '#673AB7',
  4: '#2196F3',
  3: '#00BCD4',
  2: '#4CAF50',
  1: '#FFC107',
};

export const LAYER_NAMES: Record<OSILayerNumber, string> = {
  7: 'Application',
  6: 'Presentation',
  5: 'Session',
  4: 'Transport',
  3: 'Network',
  2: 'Data Link',
  1: 'Physical',
};

export const MTU_SIZES = {
  ethernet: { size: 1500, description: 'Standard Ethernet MTU' },
  pppoe: { size: 1492, description: 'PPPoE (Ethernet minus 8 bytes)' },
  jumbo: { size: 9000, description: 'Jumbo frames' },
  minimal: { size: 576, description: 'IPv4 minimum MTU' },
} as const;

export const HEADER_SIZES = {
  ipHeader: 20,
  tcpHeader: 20,
  udpHeader: 8,
  ethernetHeader: 18,
} as const;
