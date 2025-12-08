/**
 * Type definitions for Topology Builder components
 */

export type DeviceType =
  | 'router'
  | 'switch'
  | 'hub'
  | 'firewall'
  | 'server'
  | 'workstation'
  | 'wireless-ap'
  | 'cloud';

export type DetectedTopologyType = 'star' | 'mesh' | 'ring' | 'bus' | 'hybrid' | 'custom';

export interface BuilderDevice {
  id: string;
  type: DeviceType;
  label: string;
  position: { x: number; y: number };
  cost: number;
}

export interface BuilderConnection {
  id: string;
  sourceId: string;
  targetId: string;
  type: 'ethernet' | 'fiber' | 'wireless';
  length: number;
  cost: number;
}

export interface TopologyTemplate {
  id: string;
  name: string;
  description: string;
  devices: BuilderDevice[];
  connections: BuilderConnection[];
}

export interface ValidationIssue {
  id: string;
  severity: 'error' | 'warning' | 'info';
  type: 'spof' | 'redundancy' | 'performance' | 'cost' | 'best-practice';
  message: string;
  deviceId?: string;
}

export interface DeviceSpec {
  label: string;
  cost: number;
  icon: string;
}

export type ConnectionType = 'ethernet' | 'fiber' | 'wireless';

export interface TopologyBuilderProps {
  className?: string;
}

export interface BuilderState {
  devices: BuilderDevice[];
  connections: BuilderConnection[];
  selectedDevice: string | null;
  dragging: string | null;
  connecting: string | null;
  showTemplates: boolean;
  showValidation: boolean;
  showCost: boolean;
  showHints: boolean;
  history: Array<{ devices: BuilderDevice[]; connections: BuilderConnection[] }>;
  historyIndex: number;
}

export interface CostSummary {
  devices: number;
  connections: number;
  total: number;
}
