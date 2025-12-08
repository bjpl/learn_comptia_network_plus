/**
 * Constants for IPv6Planner component
 */

import type { MethodInfoMap } from './types';

export const METHOD_INFO: MethodInfoMap = {
  'dual-stack': {
    name: 'Dual Stack',
    description: 'Run IPv4 and IPv6 simultaneously on all network devices',
    pros: [
      'Maximum compatibility with legacy systems',
      'Gradual transition without disruption',
      'Native IPv6 performance where supported',
    ],
    cons: [
      'Doubled address management overhead',
      'Requires IPv6 support on all devices',
      'Indefinite IPv4 maintenance costs',
    ],
    complexity: 'medium',
  },
  tunneling: {
    name: 'Tunneling (6to4, Teredo, ISATAP)',
    description: 'Encapsulate IPv6 traffic within IPv4 packets',
    pros: [
      'Works across IPv4-only infrastructure',
      'Enables IPv6 without infrastructure upgrade',
      'Multiple tunnel types for different scenarios',
    ],
    cons: [
      'Performance overhead from encapsulation',
      'MTU issues and fragmentation',
      'Complex troubleshooting',
    ],
    complexity: 'high',
  },
  nat64: {
    name: 'NAT64 Translation',
    description: 'Translate between IPv6-only and IPv4-only networks',
    pros: [
      'Enable IPv6-only internal networks',
      'Simplified address management',
      'Reduced IPv4 dependency',
    ],
    cons: [
      'Application compatibility issues',
      'IPsec incompatibility',
      'Central gateway bottleneck',
    ],
    complexity: 'high',
  },
  hybrid: {
    name: 'Hybrid Approach',
    description: 'Combine multiple migration methods strategically',
    pros: [
      'Optimized for specific use cases',
      'Flexibility for complex environments',
      'Balanced trade-offs',
    ],
    cons: ['Increased complexity', 'Higher management overhead', 'Requires careful planning'],
    complexity: 'critical',
  },
};
