/**
 * CompTIA Network+ - IPv4 Component Type Definitions
 */

import type { SubnetInfo } from '../../types';

// ============================================================================
// Subnet Design Types
// ============================================================================

export interface SubnetRequirement {
  id: string;
  name: string;
  hostsNeeded: number;
  description?: string;
}

export interface SubnetAllocation extends SubnetInfo {
  id: string;
  name: string;
  hostsNeeded: number;
  efficiency: number;
  wastedAddresses: number;
}

export interface SubnetScenario {
  id: string;
  title: string;
  description: string;
  baseNetwork: string;
  requirements: SubnetRequirement[];
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  category: 'office' | 'enterprise' | 'isp' | 'datacenter';
  hints?: string[];
  solution?: SubnetAllocation[];
}

export interface SubnetDesignResult {
  allocations: SubnetAllocation[];
  totalEfficiency: number;
  totalWasted: number;
  hasOverlaps: boolean;
  errors: string[];
  warnings: string[];
}

// ============================================================================
// Troubleshooting Types
// ============================================================================

export type ProblemType =
  | 'apipa'
  | 'private_routing'
  | 'multicast_host'
  | 'loopback_interface'
  | 'network_address'
  | 'broadcast_address'
  | 'subnet_mismatch'
  | 'duplicate_ip'
  | 'wrong_gateway';

export interface DiagnosticOutput {
  command: string;
  output: string;
  timestamp: string;
}

export interface NetworkDevice {
  id: string;
  name: string;
  type: 'host' | 'router' | 'switch' | 'server';
  ipAddress: string;
  subnetMask: string;
  gateway?: string;
  status: 'online' | 'offline' | 'error';
  x: number;
  y: number;
}

export interface NetworkConnection {
  from: string;
  to: string;
  status: 'ok' | 'degraded' | 'down';
  label?: string;
}

export interface TroubleshootingScenario {
  id: string;
  title: string;
  description: string;
  problemType: ProblemType;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  devices: NetworkDevice[];
  connections: NetworkConnection[];
  diagnosticOutputs: DiagnosticOutput[];
  symptoms: string[];
  expectedBehavior: string;
  actualBehavior: string;
  hints?: string[];
  solution?: TroubleshootingStep[];
}

export interface TroubleshootingStep {
  id: string;
  stepNumber: number;
  description: string;
  action: string;
  expectedResult: string;
  explanation: string;
  diagnostic?: DiagnosticOutput;
}

export interface TroubleshootingResult {
  steps: TroubleshootingStep[];
  problemIdentified: boolean;
  rootCause: string;
  resolution: string;
  preventiveMeasures: string[];
}

// ============================================================================
// IPv4 Address Types
// ============================================================================

export interface AddressClassification {
  address: string;
  class: 'A' | 'B' | 'C' | 'D' | 'E' | 'Unknown';
  type: 'public' | 'private' | 'apipa' | 'loopback' | 'multicast' | 'reserved';
  rfc?: string;
  description: string;
  usability: 'routable' | 'non-routable' | 'special-use';
}

export interface VLSMAllocation {
  requirement: SubnetRequirement;
  subnet: SubnetInfo;
  allocated: boolean;
  overlap?: boolean;
}
