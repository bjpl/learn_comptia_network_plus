/**
 * Color utility functions for traffic types
 */

export const getPacketColor = (typeId: string): string => {
  const colors: Record<string, string> = {
    unicast: '#9b59b6',
    multicast: '#e67e22',
    anycast: '#16a085',
    broadcast: '#c0392b',
  };
  return colors[typeId] || '#3498db';
};
