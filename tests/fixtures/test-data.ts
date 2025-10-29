/**
 * Shared test fixtures and mock data for CompTIA Network+ tests
 */

import type {
  ArchitectureComponent,
  ArchitectureDesign,
  Connection,
  ValidationResult
} from '../../src/components/cloud/cloud-types';
import type { FlashCard, Protocol } from '../../src/components/protocols/protocols-types';
import type { MediaOption, ScenarioRequirement } from '../../src/components/media/media-types';

// ============================================================================
// Cloud Architecture Test Data
// ============================================================================

export const mockCloudComponent: ArchitectureComponent = {
  id: 'test-component-1',
  type: 'service-layer',
  subtype: 'compute',
  name: 'Test Compute Instance',
  x: 100,
  y: 100,
  width: 200,
  height: 150,
  color: '#3b82f6',
  icon: '🖥️',
  properties: {
    instanceType: 't2.micro',
    region: 'us-east-1',
    autoScaling: true
  },
  connections: []
};

export const mockCloudConnection: Connection = {
  id: 'test-connection-1',
  from: 'test-component-1',
  to: 'test-component-2',
  type: 'network',
  label: 'Test Connection'
};

export const mockCloudDesign: ArchitectureDesign = {
  id: 'test-design-1',
  name: 'Test Cloud Architecture',
  description: 'Test architecture for unit tests',
  components: [mockCloudComponent],
  connections: [mockCloudConnection],
  metadata: {
    created: new Date('2025-01-01'),
    modified: new Date('2025-01-01'),
    author: 'Test User'
  }
};

export const mockValidationResult: ValidationResult = {
  valid: true,
  errors: [],
  warnings: [],
  score: 100
};

// ============================================================================
// Protocol Test Data
// ============================================================================

export const mockProtocol: Protocol = {
  id: 'test-http',
  name: 'HTTP',
  fullName: 'Hypertext Transfer Protocol',
  type: 'tcp',
  ports: [
    { number: 80, description: 'HTTP standard port' }
  ],
  security: 'insecure',
  useCase: 'Web traffic',
  securityImplications: 'Transmits data in plaintext',
  commonVulnerabilities: ['Man-in-the-middle attacks', 'Packet sniffing'],
  bestPractices: ['Use HTTPS instead', 'Implement proper authentication']
};

export const mockFlashCard: FlashCard = {
  id: 'test-card-1',
  protocolId: 'test-http',
  question: 'What port does HTTP use?',
  answer: 'HTTP uses port 80 for standard web traffic.',
  hints: ['Think about web browsers', 'It\'s a well-known port'],
  requiresExplanation: true,
  explanationPrompt: 'Explain why HTTP on port 80 is considered insecure.',
  minimumWords: 20
};

// ============================================================================
// Media Selection Test Data
// ============================================================================

export const mockMediaOption: MediaOption = {
  id: 'test-fiber',
  name: 'Single-Mode Fiber',
  type: 'fiber',
  standard: '1000BASE-LX',
  maxDistance: 10000,
  bandwidth: 1000,
  costPerMeter: 1.5,
  environmentalResistance: 'excellent',
  interference: 'none',
  specialFeatures: ['Long distance', 'High bandwidth']
};

export const mockScenarioRequirement: ScenarioRequirement = {
  id: 'test-scenario-1',
  title: 'Data Center Interconnect',
  description: 'Connect two data centers 5km apart',
  requiredDistance: 5000,
  requiredBandwidth: 1000,
  environment: 'outdoor',
  budgetPerMeter: 2.0,
  specialConditions: ['Weather resistant', 'Lightning protection']
};

// ============================================================================
// Assessment Test Data
// ============================================================================

export const mockIntegratedScenario = {
  id: 'test-scenario-1',
  title: 'Small Business Network Design',
  description: 'Design a complete network for a growing startup',
  difficulty: 'intermediate' as const,
  estimatedTime: 45,
  totalPoints: 100,
  learningObjectives: ['1.1', '1.2', '1.3'],
  context: {
    company: 'TechStart Inc.',
    locations: 2,
    users: 50,
    requirements: [
      'High availability',
      'Secure remote access',
      'Cloud integration'
    ]
  },
  phases: [
    {
      id: 'phase-1',
      title: 'Network Planning',
      description: 'Plan the overall network architecture',
      order: 1,
      assessmentPoints: [
        {
          loId: '1.1',
          loCode: '1.1',
          description: 'Design network topology',
          maxScore: 25,
          criteria: [
            'Identify appropriate topology',
            'Justify topology choice',
            'Consider scalability'
          ]
        }
      ],
      hints: ['Consider star topology', 'Think about growth']
    }
  ]
};

// ============================================================================
// User Progress Test Data
// ============================================================================

export const mockUserProgress = {
  userId: 'test-user-1',
  componentsCompleted: ['cloud-designer', 'port-trainer'],
  domainsCompleted: ['domain-1'],
  totalTimeSpent: 3600,
  lastAccessed: new Date('2025-01-15'),
  overallProgress: 50,
  domainProgress: new Map([
    ['domain-1', 100],
    ['domain-2', 50]
  ]),
  achievements: [
    {
      id: 'first-component',
      title: 'Getting Started',
      description: 'Complete your first component',
      icon: '🎯',
      earnedDate: new Date('2025-01-10')
    }
  ],
  streak: 5
};

// ============================================================================
// Store Test Data
// ============================================================================

export const mockStoreState = {
  progress: {
    completedComponents: ['component-1', 'component-2'],
    componentScores: {
      'component-1': 85,
      'component-2': 92
    },
    totalScore: 88.5,
    lastActivity: new Date('2025-01-15')
  },
  theme: { mode: 'light' as const },
  currentPath: '/cloud-designer',
  isLoading: false
};

// ============================================================================
// Network Topology Test Data
// ============================================================================

export const mockTopologyData = {
  mesh: {
    name: 'Mesh Topology',
    nodes: 5,
    connections: 10,
    redundancy: 'high',
    cost: 'high',
    bestFor: ['Data centers', 'Critical infrastructure']
  },
  star: {
    name: 'Star Topology',
    nodes: 6,
    connections: 5,
    redundancy: 'low',
    cost: 'low',
    bestFor: ['Small offices', 'Home networks']
  }
};

// ============================================================================
// IPv4 Test Data
// ============================================================================

export const mockSubnetScenario = {
  network: '192.168.1.0',
  cidr: 24,
  requiredSubnets: 4,
  hostsPerSubnet: 50,
  solution: [
    {
      subnet: '192.168.1.0/26',
      range: '192.168.1.1 - 192.168.1.62',
      broadcast: '192.168.1.63',
      hosts: 62
    },
    {
      subnet: '192.168.1.64/26',
      range: '192.168.1.65 - 192.168.1.126',
      broadcast: '192.168.1.127',
      hosts: 62
    }
  ]
};

// ============================================================================
// Modern Network Test Data
// ============================================================================

export const mockIPv6Config = {
  address: '2001:0db8:85a3:0000:0000:8a2e:0370:7334',
  compressed: '2001:db8:85a3::8a2e:370:7334',
  prefix: '2001:db8:85a3::/64',
  type: 'global unicast',
  scope: 'global'
};

export const mockSDNConfig = {
  controller: {
    type: 'OpenFlow',
    version: '1.5',
    management: '192.168.1.100'
  },
  switches: [
    {
      id: 'sw1',
      dpid: '00:00:00:00:00:00:00:01',
      ports: 24,
      flows: 100
    }
  ]
};

// ============================================================================
// Test Utilities
// ============================================================================

export function createMockUser(overrides = {}) {
  return {
    id: 'test-user',
    name: 'Test User',
    email: 'test@example.com',
    ...overrides
  };
}

export function createMockScore(correct: number, total: number) {
  return {
    correct,
    total,
    percentage: Math.round((correct / total) * 100)
  };
}

export function createMockTimestamp(daysAgo: number = 0) {
  const date = new Date();
  date.setDate(date.getDate() - daysAgo);
  return date;
}

export function wait(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms));
}
