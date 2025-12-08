/**
 * Topology Calculations Utilities
 * Helper functions for topology calculations
 */

import type { TopologyDefinition } from '../../topologies-types';

/**
 * Calculate cable requirements for a topology based on node count
 */
export const calculateCables = (topology: TopologyDefinition, nodeCount: number): number => {
  return topology.characteristics.cableRequirements.forNodes(nodeCount);
};
