/**
 * Custom hook for calculating comparison metrics
 */

import { useMemo } from 'react';
import type { TopologyDefinition, ComparisonMetrics } from '../../topologies-types';

export const useComparisonMetrics = (
  selectedTopologyData: TopologyDefinition[]
): ComparisonMetrics[] => {
  return useMemo(() => {
    return selectedTopologyData.map((topology) => {
      const chars = topology.characteristics;
      return {
        topology: topology.id,
        scores: {
          faultTolerance:
            chars.faultTolerance.level === 'very-high'
              ? 100
              : chars.faultTolerance.level === 'high'
                ? 75
                : chars.faultTolerance.level === 'medium'
                  ? 50
                  : 25,
          scalability:
            chars.scalability.level === 'high'
              ? 90
              : chars.scalability.level === 'medium'
                ? 60
                : 30,
          cost:
            chars.cost.initial === 'low'
              ? 90
              : chars.cost.initial === 'medium'
                ? 60
                : chars.cost.initial === 'high'
                  ? 30
                  : 10,
          performance: 100 - chars.trafficFlow.bottlenecks.length * 20,
          complexity: chars.scalability.limitations.length < 3 ? 80 : 40,
        },
        nodeCount: topology.nodes.length,
        edgeCount: topology.edges.length,
        avgPathLength: topology.edges.length / topology.nodes.length,
      };
    });
  }, [selectedTopologyData]);
};
