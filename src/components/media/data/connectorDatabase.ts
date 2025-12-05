/**
 * Connector Database
 * Centralized connector definitions and use case scenarios
 */

import type { ConnectorType } from '../media-types';

export interface UseCaseScenario {
  id: string;
  scenario: string;
  correctConnector: ConnectorType;
  incorrectConnectors: ConnectorType[];
  explanation: string;
}

export interface TerminationStep {
  id: number;
  title: string;
  description: string;
  tip: string;
  commonMistakes: string[];
}

export const TERMINATION_STEPS: TerminationStep[] = [
  {
    id: 1,
    title: 'Strip Outer Jacket',
    description: 'Remove 1-1.5 inches of the outer cable jacket using a cable stripper',
    tip: 'Be careful not to nick the inner wires',
    commonMistakes: ['Stripping too much jacket', 'Cutting into wire insulation', 'Uneven cuts'],
  },
  {
    id: 2,
    title: 'Untwist Wire Pairs',
    description: 'Carefully untwist the four pairs of wires, maintaining pair integrity',
    tip: 'Untwist only as much as necessary (about 0.5 inches)',
    commonMistakes: [
      'Untwisting too much (causes crosstalk)',
      'Damaging wire insulation',
      'Mixing up pairs',
    ],
  },
  {
    id: 3,
    title: 'Arrange Wires',
    description: 'Arrange wires in correct order according to T568A or T568B standard',
    tip: 'Double-check color order before proceeding',
    commonMistakes: ['Wrong color order', 'Mixing T568A and T568B', 'Crossed wires'],
  },
  {
    id: 4,
    title: 'Trim Wires',
    description: 'Trim wires to be even, leaving about 1/2 inch from jacket',
    tip: 'Use proper wire cutters for a clean, straight cut',
    commonMistakes: [
      'Uneven wire lengths',
      "Too short (won't reach pins)",
      "Too long (won't crimp properly)",
    ],
  },
  {
    id: 5,
    title: 'Insert into RJ45',
    description: 'Insert wires fully into RJ45 connector until they reach the end',
    tip: 'Ensure jacket enters connector for strain relief',
    commonMistakes: [
      'Wires not fully inserted',
      'Jacket not inside connector',
      'Wire order changed during insertion',
    ],
  },
  {
    id: 6,
    title: 'Crimp Connector',
    description: 'Use crimping tool to firmly crimp the RJ45 connector',
    tip: 'One firm squeeze is better than multiple partial crimps',
    commonMistakes: ['Partial crimp', 'Crimping at wrong angle', 'Insufficient pressure'],
  },
  {
    id: 7,
    title: 'Test Cable',
    description: 'Use cable tester to verify all pins are properly connected',
    tip: 'Test for continuity, shorts, and proper wiring',
    commonMistakes: ['Skipping testing', 'Not checking all pins', 'Ignoring intermittent failures'],
  },
];

export const USE_CASE_SCENARIOS: UseCaseScenario[] = [
  {
    id: 'uc1',
    scenario:
      'Connecting multiple servers in a datacenter rack with limited space and high density requirements',
    correctConnector: 'LC',
    incorrectConnectors: ['SC', 'ST', 'RJ45'],
    explanation:
      'LC connectors have a small form factor (half the size of SC), making them ideal for high-density datacenter applications. Their latch mechanism provides secure connections.',
  },
  {
    id: 'uc2',
    scenario: 'Standard office desktop computer connection to wall jack, 50 meters from switch',
    correctConnector: 'RJ45',
    incorrectConnectors: ['RJ11', 'LC', 'F-type'],
    explanation:
      'RJ45 is the standard Ethernet connector for copper twisted-pair cabling, supporting up to 100 meters and commonly used for desktop connections.',
  },
  {
    id: 'uc3',
    scenario: 'Connecting two buildings 2km apart on a campus with 10Gbps bandwidth requirements',
    correctConnector: 'LC',
    incorrectConnectors: ['RJ45', 'BNC', 'RJ11'],
    explanation:
      'Single-mode fiber with LC connectors can support 10Gbps over long distances (10km+), making it ideal for building-to-building connections.',
  },
  {
    id: 'uc4',
    scenario: 'Legacy multimode fiber installation from 1990s requiring bayonet-style connection',
    correctConnector: 'ST',
    incorrectConnectors: ['LC', 'SC', 'MPO'],
    explanation:
      'ST connectors with bayonet twist-lock mechanism were common in legacy installations and are still found in older multimode fiber systems.',
  },
  {
    id: 'uc5',
    scenario: 'Analog telephone connection for fax machine',
    correctConnector: 'RJ11',
    incorrectConnectors: ['RJ45', 'LC', 'BNC'],
    explanation:
      'RJ11 is the standard telephone connector with 6 positions, used for analog phone lines, fax machines, and modems.',
  },
  {
    id: 'uc6',
    scenario: 'Cable TV modem connection to service provider coaxial cable',
    correctConnector: 'F-type',
    incorrectConnectors: ['BNC', 'RJ45', 'RJ11'],
    explanation:
      'F-type connectors are threaded coaxial connectors used for cable TV and cable internet services, providing secure weather-resistant connections.',
  },
  {
    id: 'uc7',
    scenario: '40Gbps or 100Gbps spine-leaf datacenter connection using ribbon fiber cable',
    correctConnector: 'MPO',
    incorrectConnectors: ['LC', 'SC', 'ST'],
    explanation:
      'MPO (Multi-fiber Push On) connectors can handle 12 or 24 fibers simultaneously, making them ideal for high-bandwidth datacenter spine-leaf architectures.',
  },
  {
    id: 'uc8',
    scenario: 'Professional video camera BNC output to production switcher',
    correctConnector: 'BNC',
    incorrectConnectors: ['F-type', 'RJ45', 'LC'],
    explanation:
      'BNC connectors with bayonet mount provide quick, secure connections for professional video equipment and are commonly used in broadcast and security camera systems.',
  },
];
