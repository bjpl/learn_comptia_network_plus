/**
 * Type definitions for IPv6Planner component
 */

export interface IPv6Question {
  id: string;
  question: string;
  options: string[];
  correct: number;
  explanation: string;
  category: 'format' | 'types' | 'subnetting' | 'transition';
}

export interface SubnettingResult {
  network: string;
  prefix: string;
  hostBits: number;
  hostsPerSubnet: number;
  firstHost: string;
  lastHost: string;
  broadcast: string;
}

export type TabType = 'migration' | 'fundamentals' | 'subnetting' | 'practice';

export type MigrationMethod = 'dual-stack' | 'tunneling' | 'nat64' | 'hybrid';

export interface MethodInfo {
  name: string;
  description: string;
  pros: string[];
  cons: string[];
  complexity: 'low' | 'medium' | 'high' | 'critical';
}

export type MethodInfoMap = Record<MigrationMethod, MethodInfo>;
