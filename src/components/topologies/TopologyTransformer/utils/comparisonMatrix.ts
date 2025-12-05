/**
 * Topology comparison matrix data
 */

import type { TopologyType } from '../../topologies-types';

export interface TopologyComparison {
  topology: TopologyType;
  pros: string[];
  cons: string[];
  costScore: number; // 1-10 (1=most expensive, 10=cheapest)
  redundancyScore: number; // 1-10 (1=least redundant, 10=most redundant)
  scalabilityScore: number; // 1-10
  complexity: number; // 1-10 (1=simplest, 10=most complex)
}

export const comparisonMatrix: TopologyComparison[] = [
  {
    topology: 'mesh',
    pros: [
      'Maximum redundancy',
      'No single point of failure',
      'Direct paths between devices',
      'Excellent for critical systems',
    ],
    cons: [
      'Exponential cabling costs',
      'Complex configuration',
      'Difficult to manage',
      'Not scalable',
    ],
    costScore: 1,
    redundancyScore: 10,
    scalabilityScore: 2,
    complexity: 9,
  },
  {
    topology: 'star',
    pros: ['Simple design', 'Easy to manage', 'Low cabling cost', 'Easy troubleshooting'],
    cons: [
      'Single point of failure',
      'Central switch bottleneck',
      'Limited scalability',
      'Performance degrades with load',
    ],
    costScore: 9,
    redundancyScore: 2,
    scalabilityScore: 4,
    complexity: 2,
  },
  {
    topology: 'spine-and-leaf',
    pros: [
      'Scalable design',
      'Optimized for data centers',
      'Equal-cost paths',
      'No oversubscription',
    ],
    cons: [
      'Higher initial cost',
      'Requires planning',
      'More complex setup',
      'Overkill for small networks',
    ],
    costScore: 3,
    redundancyScore: 8,
    scalabilityScore: 9,
    complexity: 8,
  },
  {
    topology: 'three-tier',
    pros: ['Highly scalable', 'Clear layer separation', 'Good redundancy', 'Proven design'],
    cons: ['Complex management', 'Higher latency', 'More hardware needed', 'Many cables needed'],
    costScore: 4,
    redundancyScore: 7,
    scalabilityScore: 8,
    complexity: 7,
  },
  {
    topology: 'hub-and-spoke',
    pros: [
      'Cost-effective for WAN',
      'Centralized management',
      'Simple architecture',
      'Easy to add branches',
    ],
    cons: [
      'Hub is single point of failure',
      'Inefficient branch-to-branch',
      'Hub can become bottleneck',
      'Not optimized for modern traffic',
    ],
    costScore: 8,
    redundancyScore: 2,
    scalabilityScore: 5,
    complexity: 3,
  },
  {
    topology: 'hybrid',
    pros: [
      'Combines best of multiple topologies',
      'Flexible design',
      'Customizable',
      'Adaptable to needs',
    ],
    cons: [
      'Complex to manage',
      'Harder to troubleshoot',
      'Custom solutions required',
      'No standard design',
    ],
    costScore: 5,
    redundancyScore: 6,
    scalabilityScore: 7,
    complexity: 9,
  },
  {
    topology: 'point-to-point',
    pros: [
      'Direct connections',
      'Predictable performance',
      'Simple for small networks',
      'No shared resources',
    ],
    cons: [
      'Only works for 2 devices',
      'Not truly a network',
      'No shared services',
      'Impractical at scale',
    ],
    costScore: 6,
    redundancyScore: 1,
    scalabilityScore: 1,
    complexity: 1,
  },
  {
    topology: 'collapsed-core',
    pros: [
      'Cost-effective than 3-tier',
      'Still scalable',
      'Simplified management',
      'Good for SMBs',
    ],
    cons: [
      'Limited redundancy',
      'Potential bottleneck',
      'Less flexible than 3-tier',
      'Growth limitations',
    ],
    costScore: 7,
    redundancyScore: 4,
    scalabilityScore: 6,
    complexity: 5,
  },
];
