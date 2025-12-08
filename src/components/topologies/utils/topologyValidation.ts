/**
 * Topology validation utilities
 */

import type {
  BuilderDevice,
  BuilderConnection,
  ValidationIssue,
  DetectedTopologyType,
} from '../builder/types';

export const detectTopologyType = (
  devices: BuilderDevice[],
  connections: BuilderConnection[]
): DetectedTopologyType => {
  if (devices.length < 2) {
    return 'custom';
  }

  const connectionCount = connections.length;
  const deviceCount = devices.length;

  // Check for star topology
  const connectionCounts = devices.map(
    (d) => connections.filter((c) => c.sourceId === d.id || c.targetId === d.id).length
  );
  const maxConnections = Math.max(...connectionCounts);
  const centralDevices = connectionCounts.filter((c) => c === maxConnections).length;

  if (
    centralDevices === 1 &&
    maxConnections === deviceCount - 1 &&
    connectionCount === deviceCount - 1
  ) {
    return 'star';
  }

  // Check for mesh topology
  const maxPossibleConnections = (deviceCount * (deviceCount - 1)) / 2;
  if (connectionCount === maxPossibleConnections) {
    return 'mesh';
  }

  // Check for ring topology
  if (connectionCount === deviceCount && connectionCounts.every((c) => c === 2)) {
    return 'ring';
  }

  // Check for bus topology (linear chain)
  if (
    connectionCount === deviceCount - 1 &&
    connectionCounts.filter((c) => c === 1).length === 2
  ) {
    return 'bus';
  }

  return connectionCount > 0 ? 'hybrid' : 'custom';
};

export const validateTopology = (
  devices: BuilderDevice[],
  connections: BuilderConnection[]
): ValidationIssue[] => {
  const issues: ValidationIssue[] = [];

  // Check for single points of failure
  devices.forEach((device) => {
    const connCount = connections.filter(
      (c) => c.sourceId === device.id || c.targetId === device.id
    ).length;

    if (connCount > 3 && device.type !== 'switch' && device.type !== 'router') {
      issues.push({
        id: `spof-${device.id}`,
        severity: 'error',
        type: 'spof',
        message: `${device.label} is a single point of failure with ${connCount} connections`,
        deviceId: device.id,
      });
    }

    // Check for isolated devices
    if (connCount === 0 && devices.length > 1) {
      issues.push({
        id: `isolated-${device.id}`,
        severity: 'warning',
        type: 'redundancy',
        message: `${device.label} is not connected to the network`,
        deviceId: device.id,
      });
    }

    // Check for devices with only one connection (no redundancy)
    if (connCount === 1 && (device.type === 'server' || device.type === 'router')) {
      issues.push({
        id: `single-conn-${device.id}`,
        severity: 'warning',
        type: 'redundancy',
        message: `${device.label} lacks redundant connections`,
        deviceId: device.id,
      });
    }
  });

  // Check for inefficient hub usage
  const hubs = devices.filter((d) => d.type === 'hub');
  if (hubs.length > 0) {
    issues.push({
      id: 'hub-warning',
      severity: 'info',
      type: 'best-practice',
      message: 'Hubs create collision domains - consider using switches instead',
    });
  }

  // Check for missing firewall
  const hasFirewall = devices.some((d) => d.type === 'firewall');
  const hasRouter = devices.some((d) => d.type === 'router');
  if (hasRouter && !hasFirewall && devices.length > 3) {
    issues.push({
      id: 'no-firewall',
      severity: 'warning',
      type: 'best-practice',
      message: 'Consider adding a firewall for network security',
    });
  }

  return issues;
};

export const calculateTotalCost = (
  devices: BuilderDevice[],
  connections: BuilderConnection[]
) => {
  const deviceCost = devices.reduce((sum, device) => sum + device.cost, 0);
  const connectionCost = connections.reduce((sum, conn) => sum + conn.cost, 0);
  return { devices: deviceCost, connections: connectionCost, total: deviceCost + connectionCost };
};
