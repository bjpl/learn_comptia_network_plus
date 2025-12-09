/**
 * Exam scenarios for topology selection practice
 */

import type { ExamScenario } from '../types';

export const examScenarios: ExamScenario[] = [
  {
    id: 'scenario1',
    title: 'High-Availability Server Farm',
    requirements: [
      'Maximum uptime',
      'Mission-critical applications',
      'Small network (5-10 devices)',
    ],
    constraints: ['Budget available for redundancy', 'Can afford high maintenance complexity'],
    recommendedTopology: 'mesh',
    explanation:
      'Mesh topology provides multiple paths and eliminates single points of failure, ideal for mission-critical systems.',
    examTip:
      'Remember: Mesh cables = n(n-1)/2. For 4 nodes = 6 cables. Great for critical systems but not scalable.',
  },
  {
    id: 'scenario2',
    title: 'Small Office Network',
    requirements: ['Basic connectivity', 'Easy management', '10-20 devices'],
    constraints: ['Limited budget', 'One IT person'],
    recommendedTopology: 'star',
    explanation:
      'Star topology is simple, affordable, and easy to manage. Perfect for small deployments.',
    examTip:
      'Star is the most common topology today. Single point of failure at switch, but simplicity wins for SMB.',
  },
  {
    id: 'scenario3',
    title: 'Multi-Building Campus Network',
    requirements: ['Large scale', 'Scalability', 'Multiple floors/buildings'],
    constraints: ['Existing infrastructure', 'Mixed equipment'],
    recommendedTopology: 'three-tier',
    explanation:
      'Three-tier provides scalability with core, distribution, and access layers. Standard enterprise design.',
    examTip:
      'Classic Enterprise topology. Remember: Core (speed), Distribution (routing policies), Access (user connections).',
  },
  {
    id: 'scenario4',
    title: 'Modern Data Center',
    requirements: [
      'East-west traffic optimization',
      'Virtual machine migration',
      'High scalability',
    ],
    constraints: ['Need server-to-server efficiency', 'Virtualization environment'],
    recommendedTopology: 'spine-and-leaf',
    explanation:
      'Spine-and-leaf is optimized for data center traffic patterns with equal-cost paths.',
    examTip:
      'Modern architecture for data centers and clouds. Optimized for east-west (server-to-server) traffic, not north-south.',
  },
  {
    id: 'scenario5',
    title: 'Multiple Branch Offices',
    requirements: ['Connect remote sites to HQ', 'Cost-effective WAN', 'Centralized management'],
    constraints: ['Existing WAN infrastructure', 'Branch sites with limited IT'],
    recommendedTopology: 'hub-and-spoke',
    explanation:
      'Hub-and-spoke is ideal for WAN with all remote sites connected through headquarters.',
    examTip:
      'Classic WAN design. Hub = single point of failure. Spokes communicate through hub = inefficient branch-to-branch.',
  },
  {
    id: 'scenario6',
    title: 'Growing SMB Needing Scalability',
    requirements: ['Plan for growth', 'Some redundancy', 'Cost control'],
    constraints: ['Current 50-200 devices', 'May expand to 300+'],
    recommendedTopology: 'collapsed-core',
    explanation:
      'Collapsed-core combines core and distribution layers for efficiency while maintaining scalability.',
    examTip:
      'Practical choice for SMBs. Reduces core from 3 tiers to 2. Saves cost but still provides decent redundancy.',
  },
];
