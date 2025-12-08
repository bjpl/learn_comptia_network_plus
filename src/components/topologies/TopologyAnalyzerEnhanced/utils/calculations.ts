/**
 * Utility functions for topology calculations
 */

import type { TopologyDefinition } from '../../topologies-types';

export const calculateCables = (topology: TopologyDefinition, nodeCount: number): number => {
  return topology.characteristics.cableRequirements.forNodes(nodeCount);
};
