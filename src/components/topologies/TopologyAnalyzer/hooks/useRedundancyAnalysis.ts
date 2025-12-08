/**
 * useRedundancyAnalysis Hook
 * Calculates redundancy metrics for network topologies
 */

import { useCallback } from 'react';
import type { TopologyDefinition } from '../../topologies-types';
import type { RedundancyMetrics } from '../types';

export const useRedundancyAnalysis = () => {
  const analyzeRedundancy = useCallback((topology: TopologyDefinition): RedundancyMetrics => {
    const nodeCount = topology.nodes.length;
    const edgeCount = topology.edges.length;

    // Theoretical minimum edges for connectivity: n-1
    const minConnectivity = nodeCount - 1;
    const pathRedundancy =
      edgeCount > minConnectivity ? ((edgeCount - minConnectivity) / minConnectivity) * 100 : 0;

    // Link redundancy: percentage of redundant links
    const redundantLinks = topology.edges.filter((e) => e.type === 'redundant').length;
    const linkRedundancy = (redundantLinks / edgeCount) * 100;

    // Overall redundancy score
    const overallRedundancy = (pathRedundancy + linkRedundancy) / 2;

    // Find critical paths
    const criticalPaths: string[] = [];
    topology.nodes.forEach((node) => {
      const connections = topology.edges.filter(
        (e) => e.source === node.id || e.target === node.id
      );
      if (connections.length === 1) {
        criticalPaths.push(`${node.label} (1 connection)`);
      }
    });

    return {
      pathRedundancy: Math.round(pathRedundancy),
      linkRedundancy: Math.round(linkRedundancy),
      overallRedundancy: Math.round(overallRedundancy),
      criticalPaths,
    };
  }, []);

  return { analyzeRedundancy };
};
