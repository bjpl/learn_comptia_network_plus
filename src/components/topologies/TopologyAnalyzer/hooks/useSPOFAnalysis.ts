/**
 * useSPOFAnalysis Hook
 * Analyzes Single Points of Failure in network topologies
 */

import { useCallback } from 'react';
import type { TopologyDefinition } from '../../topologies-types';
import type { SPOFAnalysis } from '../types';

export const useSPOFAnalysis = () => {
  const analyzeSPOF = useCallback((topology: TopologyDefinition): SPOFAnalysis[] => {
    const analysis: SPOFAnalysis[] = [];

    topology.nodes.forEach((node) => {
      const connectedEdges = topology.edges.filter(
        (e) => e.source === node.id || e.target === node.id
      );
      const affectedNodes = connectedEdges.map((e) => (e.source === node.id ? e.target : e.source));
      const redundancy = connectedEdges.length;

      analysis.push({
        nodeId: node.id,
        label: node.label,
        isSPOF: redundancy === 1 && node.type !== 'host',
        impact: redundancy === 1 ? 'Critical' : redundancy === 2 ? 'High' : 'Low',
        affectedNodes,
        redundancy,
      });
    });

    return analysis;
  }, []);

  return { analyzeSPOF };
};
