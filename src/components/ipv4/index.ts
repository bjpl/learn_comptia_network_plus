/**
 * CompTIA Network+ - IPv4 Components Barrel Export
 * Components 17-18: IPv4 Addressing and Troubleshooting
 */

export { default as SubnetDesigner } from './SubnetDesigner';
export { default as IPv4Troubleshooting } from './IPv4Troubleshooting';
export { default as IPv4Troubleshooter } from './IPv4Troubleshooter';

export * from './ipv4-types';
export * from './ipv4-data';

// Component metadata for registration
export const ipv4Components = [
  {
    id: 'component-17',
    name: 'SubnetDesigner',
    title: 'Scenario-Based Subnet Designer',
    description: 'Interactive VLSM/CIDR subnet planning tool with 30+ real-world scenarios',
    category: 'IPv4 Addressing (LO 1.7)',
    topics: [
      'RFC 1918 Private Addressing',
      'APIPA (169.254.0.0/16)',
      'Loopback (127.0.0.0/8)',
      'VLSM (Variable Length Subnet Masking)',
      'CIDR (Classless Inter-Domain Routing)',
      'IP Address Classes (A/B/C/D/E)',
      'Public vs Private Addressing',
      'Subnet Efficiency Calculation',
      'Route Summarization',
      'Binary Subnet Calculation',
      'Network/Broadcast Address Identification',
    ],
    difficulty: 'intermediate',
    scenarioCount: 30,
    learningObjective: '1.7',
  },
  {
    id: 'component-18',
    name: 'IPv4Troubleshooting',
    title: 'IPv4 Troubleshooting Scenarios',
    description:
      'Interactive troubleshooting with 25+ scenarios, network diagrams, and diagnostic tools',
    category: 'IPv4 Troubleshooting (LO 1.7)',
    topics: [
      'APIPA Detection and Resolution',
      'NAT/PAT Configuration Issues',
      'IP Address Conflicts',
      'Subnet Mask Mismatches',
      'Default Gateway Problems',
      'DHCP Troubleshooting',
      'Routing Problems',
      'Multicast Address Misuse',
      'Loopback Assignment Errors',
      'Diagnostic Command Usage (ipconfig, ping, tracert, arp)',
      'Network Connectivity Testing',
      'Systematic Troubleshooting Methodology',
    ],
    difficulty: 'intermediate',
    scenarioCount: 25,
    learningObjective: '1.7',
  },
];

/**
 * Accessibility features implemented:
 * - ARIA labels on all interactive elements
 * - Keyboard navigation support with Tab/Enter/Space
 * - Screen reader friendly status messages
 * - High contrast mode support
 * - Focus indicators on all focusable elements
 * - Descriptive error messages
 */
