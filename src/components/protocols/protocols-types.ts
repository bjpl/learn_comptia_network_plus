/**
 * TypeScript type definitions for protocols and ports
 */

export type ProtocolType = 'TCP' | 'UDP' | 'TCP/UDP' | 'ICMP' | 'GRE' | 'IPSec';

export type SecurityLevel = 'insecure' | 'secure' | 'optional';

export interface ProtocolPort {
  number: number;
  description: string;
}

export interface Protocol {
  id: string;
  name: string;
  fullName: string;
  ports: ProtocolPort[];
  type: ProtocolType;
  security: SecurityLevel;
  description: string;
  useCase: string;
  securityImplications: string;
  commonVulnerabilities: string[];
  bestPractices: string[];
  alternativeTo?: string;
}

export interface IPProtocol {
  id: string;
  name: string;
  number: number;
  description: string;
  useCase: string;
  characteristics: string[];
}

export interface TrafficType {
  id: string;
  name: string;
  description: string;
  characteristics: string[];
  useCases: string[];
  example: string;
  visual: {
    sourceNodes: number[];
    destinationNodes: number[];
    pathStyle: 'single' | 'multiple' | 'shortest' | 'all';
  };
}

export interface ScanResult {
  port: number;
  state: 'open' | 'closed' | 'filtered';
  service: string;
  version: string;
  protocol: ProtocolType;
  risk: 'low' | 'medium' | 'high' | 'critical';
  recommendations: string[];
}

export interface VirtualNetwork {
  id: string;
  name: string;
  description: string;
  services: ScanResult[];
  difficulty: 'easy' | 'medium' | 'hard';
}

export interface FlashCard {
  id: string;
  protocolId: string;
  question: string;
  answer: string;
  hints: string[];
  requiresExplanation: boolean;
  explanationPrompt?: string;
  minimumWords?: number;
}

export interface TrafficAnimationState {
  activeType: string;
  animating: boolean;
  packets: Array<{
    id: string;
    from: number;
    to: number;
    progress: number;
  }>;
}

export interface ScannerState {
  scanning: boolean;
  currentPort: number;
  results: ScanResult[];
  selectedPort?: number;
}
