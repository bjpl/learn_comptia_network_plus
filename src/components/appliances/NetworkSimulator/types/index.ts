import type {
  SimulatedDevice,
  NetworkConnection,
  SimulationState,
  TrafficFlow,
  SimulationAlert,
} from '../../appliances-types';

export type {
  SimulatedDevice,
  NetworkConnection,
  SimulationState,
  TrafficFlow,
  SimulationAlert,
};

export interface DeviceConfig {
  name: string;
  throughput: string;
  maxConnections: number;
  redundancy: boolean;
}

export interface SavedNetwork {
  id: string;
  name: string;
  timestamp: number;
  devices: SimulatedDevice[];
  connections: NetworkConnection[];
}

export interface NetworkSimulatorProps {
  initialDevices?: SimulatedDevice[];
}

export interface DeviceTypeOption {
  value: SimulatedDevice['type'];
  label: string;
}
