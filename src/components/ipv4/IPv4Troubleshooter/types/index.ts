/**
 * Type definitions for IPv4 Troubleshooter
 */

export interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

export interface RoutingTableEntry {
  destination: string;
  netmask: string;
  gateway: string;
  interface: string;
  metric: number;
  status: 'valid' | 'invalid' | 'warning';
}

export interface ARPEntry {
  ipAddress: string;
  macAddress: string;
  interface: string;
  type: 'static' | 'dynamic' | 'invalid';
}

export interface ValidationResult {
  field: string;
  status: 'valid' | 'invalid' | 'warning';
  message: string;
}

export interface WizardStep {
  title: string;
  description: string;
  checks: string[];
}
