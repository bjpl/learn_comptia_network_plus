/**
 * Type definitions for Port Scanner components
 */

export type ScanType = 'tcp-connect' | 'syn-scan' | 'udp-scan' | 'ack-scan' | 'banner-grab';
export type PortState = 'open' | 'closed' | 'filtered' | 'open|filtered' | 'unfiltered';

export interface PacketExchange {
  step: number;
  source: 'scanner' | 'target';
  flags?: string[];
  type: string;
  description: string;
  detected?: boolean;
}

export interface ScanResult {
  port: number;
  state: PortState;
  service: string;
  banner?: string;
  osFingerprint?: string;
  scanType: ScanType;
  exchanges: PacketExchange[];
  detected: boolean;
}

export interface FirewallRule {
  id: string;
  port: number;
  action: 'allow' | 'block' | 'rate-limit';
  enabled: boolean;
}

export interface DefenseConfig {
  firewallEnabled: boolean;
  idsEnabled: boolean;
  rateLimitEnabled: boolean;
  portKnocking: boolean;
  rules: FirewallRule[];
}

export interface ScanExplanation {
  name: string;
  stealth: boolean;
  description: string;
  steps: string[];
  detection: string;
  useCases: string[];
  pros: string[];
  cons: string[];
}

export interface PortInfo {
  port: number;
  service: string;
  banner: string;
  risk: 'low' | 'medium' | 'high' | 'critical';
}
