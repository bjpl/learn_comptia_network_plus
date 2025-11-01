/**
 * Troubleshooting scenarios for the Network Simulator
 * Provides pre-configured network setups for learning and practice
 */

import type {
  SimulatedDevice,
  NetworkConnection,
  TroubleshootingScenario,
} from './appliances-types';

export const getTroubleshootingScenarios = (): TroubleshootingScenario[] => [
  {
    id: 'scenario-1',
    name: 'Network Bottleneck',
    description: 'Identify and resolve a single point of failure',
    setup: () => {
      const router: SimulatedDevice = {
        id: 'router-main',
        name: 'Main Router',
        type: 'router',
        category: 'physical',
        position: { x: 250, y: 100 },
        specs: {
          throughput: '100 Mbps',
          maxConnections: 1000,
          powerConsumption: '50W',
          redundancy: false,
          hotSwappable: false,
        },
        status: 'active',
        connections: [],
        currentLoad: 0,
        maxLoad: 100,
      };

      const switches: SimulatedDevice[] = Array.from({ length: 3 }, (_, i) => ({
        id: `switch-${i}`,
        name: `Switch ${i + 1}`,
        type: 'switch',
        category: 'physical',
        position: { x: 100 + i * 150, y: 250 },
        specs: {
          throughput: '1 Gbps',
          maxConnections: 500,
          powerConsumption: '30W',
          redundancy: false,
          hotSwappable: false,
        },
        status: 'active',
        connections: [],
        currentLoad: 0,
        maxLoad: 100,
      }));

      const allDevices = [router, ...switches];
      const conns: NetworkConnection[] = switches.map((sw) => ({
        id: `conn-${sw.id}`,
        sourceId: router.id,
        targetId: sw.id,
        type: 'ethernet',
        bandwidth: '100 Mbps',
        latency: 1,
        trafficLoad: 0,
      }));

      return { devices: allDevices, connections: conns };
    },
    expectedIssue: 'The main router is a single point of failure',
    hint: 'Consider adding a backup router with redundancy enabled',
  },
  {
    id: 'scenario-2',
    name: 'Overloaded Device',
    description: 'Handle excessive traffic on a network device',
    setup: () => {
      const router: SimulatedDevice = {
        id: 'router-overload',
        name: 'Core Router',
        type: 'router',
        category: 'physical',
        position: { x: 250, y: 100 },
        specs: {
          throughput: '100 Mbps',
          maxConnections: 500,
          powerConsumption: '50W',
          redundancy: false,
          hotSwappable: false,
        },
        status: 'active',
        connections: [],
        currentLoad: 85,
        maxLoad: 100,
      };

      const server: SimulatedDevice = {
        id: 'server-main',
        name: 'Web Server',
        type: 'switch',
        category: 'physical',
        position: { x: 100, y: 250 },
        specs: {
          throughput: '1 Gbps',
          maxConnections: 1000,
          powerConsumption: '100W',
          redundancy: false,
          hotSwappable: false,
        },
        status: 'active',
        connections: [],
        currentLoad: 90,
        maxLoad: 100,
      };

      return {
        devices: [router, server],
        connections: [
          {
            id: 'conn-overload',
            sourceId: router.id,
            targetId: server.id,
            type: 'ethernet',
            bandwidth: '100 Mbps',
            latency: 2,
            trafficLoad: 95,
          },
        ],
      };
    },
    expectedIssue: 'Devices are operating near maximum capacity',
    hint: 'Consider upgrading throughput or adding load balancing',
  },
  {
    id: 'scenario-3',
    name: 'Redundancy Setup',
    description: 'Design a redundant network architecture',
    setup: () => {
      const primary: SimulatedDevice = {
        id: 'fw-primary',
        name: 'Firewall Primary',
        type: 'firewall-stateful',
        category: 'physical',
        position: { x: 150, y: 100 },
        specs: {
          throughput: '500 Mbps',
          maxConnections: 5000,
          powerConsumption: '75W',
          redundancy: true,
          hotSwappable: false,
        },
        status: 'active',
        connections: [],
        currentLoad: 0,
        maxLoad: 100,
      };

      const secondary: SimulatedDevice = {
        id: 'fw-secondary',
        name: 'Firewall Secondary',
        type: 'firewall-stateful',
        category: 'physical',
        position: { x: 350, y: 100 },
        specs: {
          throughput: '500 Mbps',
          maxConnections: 5000,
          powerConsumption: '75W',
          redundancy: true,
          hotSwappable: false,
        },
        status: 'active',
        connections: [],
        currentLoad: 0,
        maxLoad: 100,
      };

      const internalSwitch: SimulatedDevice = {
        id: 'switch-internal',
        name: 'Internal Switch',
        type: 'switch',
        category: 'physical',
        position: { x: 250, y: 250 },
        specs: {
          throughput: '1 Gbps',
          maxConnections: 1000,
          powerConsumption: '30W',
          redundancy: true,
          hotSwappable: false,
        },
        status: 'active',
        connections: [],
        currentLoad: 0,
        maxLoad: 100,
      };

      return {
        devices: [primary, secondary, internalSwitch],
        connections: [
          {
            id: 'conn-primary',
            sourceId: primary.id,
            targetId: internalSwitch.id,
            type: 'ethernet',
            bandwidth: '1 Gbps',
            latency: 1,
            trafficLoad: 0,
          },
          {
            id: 'conn-secondary',
            sourceId: secondary.id,
            targetId: internalSwitch.id,
            type: 'ethernet',
            bandwidth: '1 Gbps',
            latency: 1,
            trafficLoad: 0,
          },
        ],
      };
    },
    expectedIssue: 'No single point of failure - good design',
    hint: 'This is a recommended architecture for high availability',
  },
];
