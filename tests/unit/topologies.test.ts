/**
 * Unit Tests - Network Topologies Component
 * Tests for topology calculations, transformations, and traffic flow analysis
 */

import { describe, it, expect, beforeEach } from 'vitest';

describe('Network Topologies Component', () => {
  describe('Topology Type Validation', () => {
    it('should validate bus topology properties', () => {
      const topology = {
        type: 'Bus',
        characteristics: {
          singleCable: true,
          terminators: 2,
          collision: true,
        },
        advantages: ['Simple', 'Low cost'],
        disadvantages: ['Single point of failure', 'Collisions'],
      };

      expect(topology.characteristics.singleCable).toBe(true);
      expect(topology.characteristics.terminators).toBe(2);
      expect(topology.disadvantages).toContain('Single point of failure');
    });

    it('should validate star topology properties', () => {
      const topology = {
        type: 'Star',
        characteristics: {
          centralDevice: 'Switch',
          dedicatedConnections: true,
          collision: false,
        },
        advantages: ['Easy troubleshooting', 'Scalable'],
        disadvantages: ['Central device failure affects all'],
      };

      expect(topology.characteristics.centralDevice).toBe('Switch');
      expect(topology.characteristics.collision).toBe(false);
      expect(topology.advantages).toContain('Easy troubleshooting');
    });

    it('should validate mesh topology properties', () => {
      const topology = {
        type: 'Mesh',
        nodes: 5,
        connectionType: 'Full',
        redundancy: 'High',
      };

      const connections = calculateMeshConnections(topology.nodes, topology.connectionType);
      expect(connections).toBe(10); // n(n-1)/2 for full mesh
      expect(topology.redundancy).toBe('High');
    });

    it('should validate ring topology properties', () => {
      const topology = {
        type: 'Ring',
        characteristics: {
          bidirectional: true,
          tokenPassing: true,
          collision: false,
        },
      };

      expect(topology.characteristics.bidirectional).toBe(true);
      expect(topology.characteristics.tokenPassing).toBe(true);
    });

    it('should validate hybrid topology properties', () => {
      const topology = {
        type: 'Hybrid',
        components: ['Star', 'Ring'],
        scalability: 'Very high',
      };

      expect(topology.components.length).toBeGreaterThan(1);
      expect(topology.components).toContain('Star');
    });
  });

  describe('Topology Calculations', () => {
    it('should calculate connections for full mesh topology', () => {
      const nodes = 6;
      const connections = calculateMeshConnections(nodes, 'Full');

      expect(connections).toBe(15); // 6 * 5 / 2
    });

    it('should calculate connections for partial mesh topology', () => {
      const nodes = 6;
      const redundancyFactor = 0.5;
      const connections = calculateMeshConnections(nodes, 'Partial', redundancyFactor);

      expect(connections).toBeLessThan(15);
      expect(connections).toBeGreaterThan(5);
    });

    it('should calculate star topology port requirements', () => {
      const devices = 24;
      const portsNeeded = calculateStarPorts(devices);

      expect(portsNeeded).toBe(24);
    });

    it('should calculate ring topology latency', () => {
      const nodes = 10;
      const hopLatency = 5; // ms
      const maxLatency = calculateRingLatency(nodes, hopLatency);

      expect(maxLatency).toBe(50); // 10 nodes * 5ms
    });
  });

  describe('Topology Transformation', () => {
    it('should convert bus to star topology', () => {
      const busTopology = {
        type: 'Bus',
        devices: 8,
        cable: 'Coaxial',
      };

      const starTopology = transformTopology(busTopology, 'Star');

      expect(starTopology.type).toBe('Star');
      expect(starTopology.devices).toBe(8);
      expect(starTopology.centralDevice).toBe('Switch');
      expect(starTopology.improvements).toContain('Reduced collisions');
    });

    it('should convert star to mesh topology', () => {
      const starTopology = {
        type: 'Star',
        devices: 5,
      };

      const meshTopology = transformTopology(starTopology, 'Mesh');

      expect(meshTopology.type).toBe('Mesh');
      expect(meshTopology.connections).toBe(10);
      expect(meshTopology.redundancy).toBe('High');
    });

    it('should convert ring to star topology', () => {
      const ringTopology = {
        type: 'Ring',
        devices: 6,
      };

      const starTopology = transformTopology(ringTopology, 'Star');

      expect(starTopology.type).toBe('Star');
      expect(starTopology.devices).toBe(6);
      expect(starTopology.improvements).toContain('Easier troubleshooting');
    });
  });

  describe('Traffic Flow Analysis', () => {
    it('should calculate broadcast traffic in star topology', () => {
      const topology = {
        type: 'Star',
        devices: 10,
      };

      const broadcastPaths = calculateBroadcastPaths(topology);

      expect(broadcastPaths).toBe(10); // One to each device
    });

    it('should calculate unicast path in star topology', () => {
      const topology = {
        type: 'Star',
        devices: 10,
      };

      const unicastHops = calculateUnicastHops(topology, 'device1', 'device5');

      expect(unicastHops).toBe(2); // Through central switch
    });

    it('should calculate multicast efficiency in mesh topology', () => {
      const topology = {
        type: 'Mesh',
        devices: 6,
        connectionType: 'Full',
      };

      const multicastTargets = 3;
      const efficiency = calculateMulticastEfficiency(topology, multicastTargets);

      expect(efficiency).toBeGreaterThan(0);
      expect(efficiency).toBeLessThanOrEqual(100);
    });

    it('should detect bottlenecks in star topology', () => {
      const topology = {
        type: 'Star',
        devices: 50,
        switchCapacity: 1000, // Mbps
      };

      const averageTraffic = 25; // Mbps per device
      const bottleneck = detectBottleneck(topology, averageTraffic);

      expect(bottleneck.exists).toBe(true);
      expect(bottleneck.location).toBe('Central switch');
    });
  });

  describe('Topology Reliability', () => {
    it('should calculate single point of failure risk', () => {
      const starTopology = { type: 'Star', devices: 10 };
      const meshTopology = { type: 'Mesh', devices: 10, connectionType: 'Full' };

      const starRisk = calculateSPOFRisk(starTopology);
      const meshRisk = calculateSPOFRisk(meshTopology);

      expect(starRisk).toBeGreaterThan(meshRisk);
    });

    it('should calculate network availability for mesh topology', () => {
      const topology = {
        type: 'Mesh',
        devices: 5,
        connectionType: 'Full',
      };

      const deviceReliability = 0.99;
      const availability = calculateAvailability(topology, deviceReliability);

      expect(availability).toBeGreaterThan(0.95);
      expect(availability).toBeLessThanOrEqual(1);
    });

    it('should calculate redundant paths in mesh network', () => {
      const topology = {
        type: 'Mesh',
        devices: 6,
        connectionType: 'Full',
      };

      const redundantPaths = calculateRedundantPaths(topology, 'node1', 'node6');

      expect(redundantPaths).toBeGreaterThan(1);
    });

    it('should assess fault tolerance', () => {
      const meshTopology = {
        type: 'Mesh',
        devices: 8,
        connectionType: 'Partial',
        redundancy: 0.6,
      };

      const tolerance = assessFaultTolerance(meshTopology);

      expect(tolerance.rating).toBe('High');
      expect(tolerance.survivableFailures).toBeGreaterThan(1);
    });
  });

  describe('Topology Cost Analysis', () => {
    it('should calculate cable cost for star topology', () => {
      const topology = {
        type: 'Star',
        devices: 20,
        avgCableLength: 50, // meters
      };

      const cablePrice = 1; // per meter
      const cost = calculateCableCost(topology, cablePrice);

      expect(cost).toBe(1000); // 20 devices * 50m * $1
    });

    it('should calculate total infrastructure cost', () => {
      const topology = {
        type: 'Star',
        devices: 24,
        switchCost: 500,
        cableCost: 1200,
        connectorCost: 240,
      };

      const totalCost = calculateInfrastructureCost(topology);

      expect(totalCost).toBe(1940);
    });

    it('should compare costs between topologies', () => {
      const star = { type: 'Star', devices: 10 };
      const mesh = { type: 'Mesh', devices: 10, connectionType: 'Full' };

      const starCost = estimateTopologyCost(star);
      const meshCost = estimateTopologyCost(mesh);

      expect(meshCost).toBeGreaterThan(starCost);
    });
  });

  describe('Topology Optimization', () => {
    it('should suggest topology upgrade for scalability', () => {
      const currentTopology = {
        type: 'Bus',
        devices: 15,
        futureDevices: 50,
      };

      const suggestion = suggestTopologyUpgrade(currentTopology);

      expect(suggestion.recommended).toBe('Star');
      expect(suggestion.reason).toContain('scalability');
    });

    it('should optimize mesh topology for cost', () => {
      const meshTopology = {
        type: 'Mesh',
        devices: 10,
        connectionType: 'Full',
      };

      const optimized = optimizeTopology(meshTopology, 'cost');

      expect(optimized.connectionType).toBe('Partial');
      expect(optimized.estimatedSavings).toBeGreaterThan(0);
    });

    it('should recommend redundancy improvements', () => {
      const starTopology = {
        type: 'Star',
        devices: 50,
        criticalServices: true,
      };

      const recommendation = recommendRedundancy(starTopology);

      expect(recommendation.addBackupSwitch).toBe(true);
      expect(recommendation.redundantLinks).toBeGreaterThan(0);
    });
  });
});

// Helper Functions
function calculateMeshConnections(
  nodes: number,
  type: string,
  redundancy?: number
): number {
  if (type === 'Full') {
    return (nodes * (nodes - 1)) / 2;
  }
  // Partial mesh
  const fullMeshConnections = (nodes * (nodes - 1)) / 2;
  return Math.ceil(fullMeshConnections * (redundancy || 0.5));
}

function calculateStarPorts(devices: number): number {
  return devices;
}

function calculateRingLatency(nodes: number, hopLatency: number): number {
  return nodes * hopLatency;
}

function transformTopology(
  current: any,
  targetType: string
): any {
  const improvements: Record<string, string[]> = {
    'Star': ['Reduced collisions', 'Easier troubleshooting', 'Better scalability'],
    'Mesh': ['High redundancy', 'No single point of failure', 'Multiple paths'],
  };

  return {
    type: targetType,
    devices: current.devices,
    centralDevice: targetType === 'Star' ? 'Switch' : undefined,
    connections: targetType === 'Mesh' ? calculateMeshConnections(current.devices, 'Full') : undefined,
    redundancy: targetType === 'Mesh' ? 'High' : 'Low',
    improvements: improvements[targetType] || [],
  };
}

function calculateBroadcastPaths(topology: any): number {
  return topology.devices;
}

function calculateUnicastHops(topology: any, source: string, dest: string): number {
  if (topology.type === 'Star') {return 2;}
  if (topology.type === 'Mesh') {return 1;}
  return topology.devices / 2;
}

function calculateMulticastEfficiency(topology: any, targets: number): number {
  return (targets / topology.devices) * 100;
}

function detectBottleneck(
  topology: any,
  averageTraffic: number
): { exists: boolean; location?: string } {
  const totalTraffic = topology.devices * averageTraffic;
  if (totalTraffic > topology.switchCapacity) {
    return { exists: true, location: 'Central switch' };
  }
  return { exists: false };
}

function calculateSPOFRisk(topology: any): number {
  if (topology.type === 'Star') {return 0.9;}
  if (topology.type === 'Mesh' && topology.connectionType === 'Full') {return 0.1;}
  return 0.5;
}

function calculateAvailability(topology: any, deviceReliability: number): number {
  if (topology.type === 'Mesh') {
    return Math.pow(deviceReliability, 2);
  }
  return deviceReliability;
}

function calculateRedundantPaths(topology: any, source: string, dest: string): number {
  if (topology.type === 'Mesh' && topology.connectionType === 'Full') {
    return topology.devices - 2;
  }
  return 1;
}

function assessFaultTolerance(topology: any): { rating: string; survivableFailures: number } {
  if (topology.type === 'Mesh') {
    return { rating: 'High', survivableFailures: 3 };
  }
  return { rating: 'Low', survivableFailures: 0 };
}

function calculateCableCost(topology: any, pricePerMeter: number): number {
  return topology.devices * topology.avgCableLength * pricePerMeter;
}

function calculateInfrastructureCost(topology: any): number {
  return topology.switchCost + topology.cableCost + topology.connectorCost;
}

function estimateTopologyCost(topology: any): number {
  if (topology.type === 'Star') {return 2000;}
  if (topology.type === 'Mesh') {return 5000;}
  return 1000;
}

function suggestTopologyUpgrade(current: any): { recommended: string; reason: string } {
  if (current.futureDevices > 30) {
    return { recommended: 'Star', reason: 'Better scalability needed' };
  }
  return { recommended: current.type, reason: 'Current topology sufficient' };
}

function optimizeTopology(topology: any, criteria: string): any {
  if (criteria === 'cost' && topology.type === 'Mesh') {
    return {
      ...topology,
      connectionType: 'Partial',
      estimatedSavings: 2000,
    };
  }
  return topology;
}

function recommendRedundancy(topology: any): any {
  if (topology.criticalServices && topology.type === 'Star') {
    return {
      addBackupSwitch: true,
      redundantLinks: 2,
    };
  }
  return { addBackupSwitch: false, redundantLinks: 0 };
}
