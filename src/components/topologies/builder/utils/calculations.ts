/**
 * Calculation utilities for topology builder
 */

import type { BuilderDevice, BuilderConnection, CostSummary } from '../types';

/**
 * Calculate total cost of devices and connections
 */
export function calculateTotalCost(
  devices: BuilderDevice[],
  connections: BuilderConnection[]
): CostSummary {
  const deviceCost = devices.reduce((sum, device) => sum + device.cost, 0);
  const connectionCost = connections.reduce((sum, conn) => sum + conn.cost, 0);
  return {
    devices: deviceCost,
    connections: connectionCost,
    total: deviceCost + connectionCost,
  };
}

/**
 * Calculate distance between two devices
 */
export function calculateDistance(
  pos1: { x: number; y: number },
  pos2: { x: number; y: number }
): number {
  const dx = pos2.x - pos1.x;
  const dy = pos2.y - pos1.y;
  return Math.sqrt(dx * dx + dy * dy);
}

/**
 * Constrain position within canvas bounds
 */
export function constrainPosition(
  x: number,
  y: number,
  width: number,
  height: number,
  deviceSize: number
): { x: number; y: number } {
  return {
    x: Math.max(0, Math.min(x, width - deviceSize)),
    y: Math.max(0, Math.min(y, height - deviceSize)),
  };
}
