/**
 * Unit Tests - IPv4 Addressing Component
 * Tests for subnet calculations, VLSM, and IPv4 troubleshooting
 */

import { describe, it, expect, beforeEach } from 'vitest';
import {
  calculateSubnet,
  calculateVLSM,
  isIPInSubnet,
  splitNetwork,
  cidrToSubnetMask,
  subnetMaskToCIDR,
} from '../../src/utils/networking';

describe('IPv4 Addressing Component', () => {
  describe('Subnet Calculations', () => {
    it('should calculate /24 subnet correctly', () => {
      const result = calculateSubnet('192.168.1.0/24');

      expect(result.network).toBe('192.168.1.0');
      expect(result.broadcast).toBe('192.168.1.255');
      expect(result.firstHost).toBe('192.168.1.1');
      expect(result.lastHost).toBe('192.168.1.254');
      expect(result.usableHosts).toBe(254);
      expect(result.cidr).toBe(24);
      expect(result.subnetMask).toBe('255.255.255.0');
    });

    it('should calculate /26 subnet correctly', () => {
      const result = calculateSubnet('192.168.1.0/26');

      expect(result.network).toBe('192.168.1.0');
      expect(result.broadcast).toBe('192.168.1.63');
      expect(result.usableHosts).toBe(62);
      expect(result.cidr).toBe(26);
    });

    it('should calculate /30 subnet for point-to-point', () => {
      const result = calculateSubnet('10.0.0.0/30');

      expect(result.usableHosts).toBe(2);
      expect(result.firstHost).toBe('10.0.0.1');
      expect(result.lastHost).toBe('10.0.0.2');
      expect(result.broadcast).toBe('10.0.0.3');
    });

    it('should calculate /8 Class A network', () => {
      const result = calculateSubnet('10.0.0.0/8');

      expect(result.network).toBe('10.0.0.0');
      expect(result.subnetMask).toBe('255.0.0.0');
      expect(result.totalHosts).toBe(16777216);
    });

    it('should calculate /16 Class B network', () => {
      const result = calculateSubnet('172.16.0.0/16');

      expect(result.network).toBe('172.16.0.0');
      expect(result.subnetMask).toBe('255.255.0.0');
      expect(result.usableHosts).toBe(65534);
    });
  });

  describe('CIDR and Subnet Mask Conversion', () => {
    it('should convert CIDR to subnet mask', () => {
      expect(cidrToSubnetMask(24)).toBe('255.255.255.0');
      expect(cidrToSubnetMask(16)).toBe('255.255.0.0');
      expect(cidrToSubnetMask(8)).toBe('255.0.0.0');
      expect(cidrToSubnetMask(30)).toBe('255.255.255.252');
    });

    it('should convert subnet mask to CIDR', () => {
      expect(subnetMaskToCIDR('255.255.255.0')).toBe(24);
      expect(subnetMaskToCIDR('255.255.0.0')).toBe(16);
      expect(subnetMaskToCIDR('255.0.0.0')).toBe(8);
      expect(subnetMaskToCIDR('255.255.255.252')).toBe(30);
    });

    it('should handle edge case subnet masks', () => {
      expect(cidrToSubnetMask(32)).toBe('255.255.255.255');
      expect(cidrToSubnetMask(0)).toBe('0.0.0.0');
    });
  });

  describe('IP Address in Subnet Validation', () => {
    it('should confirm IP is in subnet', () => {
      expect(isIPInSubnet('192.168.1.50', '192.168.1.0/24')).toBe(true);
      expect(isIPInSubnet('192.168.1.1', '192.168.1.0/24')).toBe(true);
      expect(isIPInSubnet('192.168.1.254', '192.168.1.0/24')).toBe(true);
    });

    it('should confirm IP is not in subnet', () => {
      expect(isIPInSubnet('192.168.2.1', '192.168.1.0/24')).toBe(false);
      expect(isIPInSubnet('10.0.0.1', '192.168.1.0/24')).toBe(false);
    });

    it('should validate broadcast address', () => {
      const subnet = calculateSubnet('192.168.1.0/24');
      expect(isIPInSubnet(subnet.broadcast, '192.168.1.0/24')).toBe(true);
    });

    it('should validate network address', () => {
      const subnet = calculateSubnet('192.168.1.0/24');
      expect(isIPInSubnet(subnet.network, '192.168.1.0/24')).toBe(true);
    });
  });

  describe('VLSM Calculations', () => {
    it('should calculate VLSM for multiple subnet requirements', () => {
      const result = calculateVLSM('192.168.1.0/24', [50, 30, 12, 6]);

      expect(result.subnets).toHaveLength(4);
      expect(result.subnets[0].usableHosts).toBeGreaterThanOrEqual(50);
      expect(result.subnets[1].usableHosts).toBeGreaterThanOrEqual(30);
      expect(result.subnets[2].usableHosts).toBeGreaterThanOrEqual(12);
      expect(result.subnets[3].usableHosts).toBeGreaterThanOrEqual(6);
    });

    it('should optimize address space usage', () => {
      const result = calculateVLSM('10.0.0.0/24', [100, 50, 25]);

      expect(result.efficiency).toBeGreaterThan(70);
      expect(result.wastedAddresses).toBeLessThan(80);
    });

    it('should handle single large requirement', () => {
      const result = calculateVLSM('172.16.0.0/16', [16000]);

      expect(result.subnets).toHaveLength(1);
      expect(result.subnets[0].usableHosts).toBeGreaterThanOrEqual(16000);
    });

    it('should sort requirements from largest to smallest', () => {
      const result = calculateVLSM('192.168.0.0/22', [10, 50, 25, 100]);

      expect(result.subnets[0].usableHosts).toBeGreaterThanOrEqual(100);
      expect(result.subnets[1].usableHosts).toBeGreaterThanOrEqual(50);
      expect(result.subnets[2].usableHosts).toBeGreaterThanOrEqual(25);
      expect(result.subnets[3].usableHosts).toBeGreaterThanOrEqual(10);
    });
  });

  describe('Network Splitting', () => {
    it('should split /24 into four /26 subnets', () => {
      const subnets = splitNetwork('192.168.1.0/24', 26);

      expect(subnets).toHaveLength(4);
      expect(subnets[0]).toBe('192.168.1.0/26');
      expect(subnets[1]).toBe('192.168.1.64/26');
      expect(subnets[2]).toBe('192.168.1.128/26');
      expect(subnets[3]).toBe('192.168.1.192/26');
    });

    it('should split /16 into 256 /24 subnets', () => {
      const subnets = splitNetwork('172.16.0.0/16', 24);

      expect(subnets).toHaveLength(256);
      expect(subnets[0]).toBe('172.16.0.0/24');
      expect(subnets[255]).toBe('172.16.255.0/24');
    });

    it('should split network into /30 for point-to-point links', () => {
      const subnets = splitNetwork('10.0.0.0/28', 30);

      expect(subnets).toHaveLength(4);
      subnets.forEach(subnet => {
        const info = calculateSubnet(subnet);
        expect(info.usableHosts).toBe(2);
      });
    });
  });

  describe('IPv4 Troubleshooting Scenarios', () => {
    it('should detect subnet mismatch', () => {
      const deviceIP = '192.168.1.50';
      const deviceMask = '255.255.255.0';
      const gatewayIP = '192.168.2.1';

      const issue = detectSubnetIssue(deviceIP, deviceMask, gatewayIP);

      expect(issue.problem).toBe('Gateway not in same subnet');
      expect(issue.severity).toBe('critical');
    });

    it('should detect IP address conflict', () => {
      const devices = [
        { ip: '192.168.1.10', mac: 'AA:BB:CC:DD:EE:FF' },
        { ip: '192.168.1.10', mac: '11:22:33:44:55:66' },
      ];

      const conflict = detectIPConflict(devices);

      expect(conflict.hasConflict).toBe(true);
      expect(conflict.conflictingIP).toBe('192.168.1.10');
    });

    it('should detect broadcast address assignment', () => {
      const assignment = {
        ip: '192.168.1.255',
        subnet: '192.168.1.0/24',
      };

      const issue = validateIPAssignment(assignment);

      expect(issue.valid).toBe(false);
      expect(issue.reason).toContain('broadcast');
    });

    it('should detect network address assignment', () => {
      const assignment = {
        ip: '192.168.1.0',
        subnet: '192.168.1.0/24',
      };

      const issue = validateIPAssignment(assignment);

      expect(issue.valid).toBe(false);
      expect(issue.reason).toContain('network');
    });

    it('should validate correct IP assignment', () => {
      const assignment = {
        ip: '192.168.1.100',
        subnet: '192.168.1.0/24',
      };

      const issue = validateIPAssignment(assignment);

      expect(issue.valid).toBe(true);
    });
  });

  describe('Subnetting Practice Problems', () => {
    it('should determine number of subnets from borrowed bits', () => {
      const baseCIDR = 24;
      const newCIDR = 26;
      const borrowedBits = newCIDR - baseCIDR;
      const subnets = Math.pow(2, borrowedBits);

      expect(subnets).toBe(4);
    });

    it('should calculate hosts per subnet', () => {
      const cidr = 27;
      const hostBits = 32 - cidr;
      const hosts = Math.pow(2, hostBits) - 2;

      expect(hosts).toBe(30);
    });

    it('should find valid subnet for host count requirement', () => {
      const requiredHosts = 25;
      const cidr = findSubnetForHosts(requiredHosts);

      const subnet = calculateSubnet(`192.168.1.0/${cidr}`);
      expect(subnet.usableHosts).toBeGreaterThanOrEqual(requiredHosts);
    });
  });
});

// Helper Functions
function detectSubnetIssue(
  deviceIP: string,
  mask: string,
  gatewayIP: string
): { problem: string; severity: string } {
  const cidr = subnetMaskToCIDR(mask);
  const deviceSubnet = calculateSubnet(`${deviceIP}/${cidr}`);

  if (!isIPInSubnet(gatewayIP, `${deviceSubnet.network}/${cidr}`)) {
    return { problem: 'Gateway not in same subnet', severity: 'critical' };
  }

  return { problem: 'None', severity: 'none' };
}

function detectIPConflict(
  devices: Array<{ ip: string; mac: string }>
): { hasConflict: boolean; conflictingIP?: string } {
  const ipMap = new Map<string, string>();

  for (const device of devices) {
    if (ipMap.has(device.ip) && ipMap.get(device.ip) !== device.mac) {
      return { hasConflict: true, conflictingIP: device.ip };
    }
    ipMap.set(device.ip, device.mac);
  }

  return { hasConflict: false };
}

function validateIPAssignment(assignment: {
  ip: string;
  subnet: string;
}): { valid: boolean; reason?: string } {
  const subnetInfo = calculateSubnet(assignment.subnet);

  if (assignment.ip === subnetInfo.network) {
    return { valid: false, reason: 'Cannot assign network address' };
  }

  if (assignment.ip === subnetInfo.broadcast) {
    return { valid: false, reason: 'Cannot assign broadcast address' };
  }

  if (!isIPInSubnet(assignment.ip, assignment.subnet)) {
    return { valid: false, reason: 'IP not in subnet range' };
  }

  return { valid: true };
}

function findSubnetForHosts(requiredHosts: number): number {
  // Find smallest subnet that can accommodate required hosts
  for (let cidr = 30; cidr >= 0; cidr--) {
    const hostBits = 32 - cidr;
    const availableHosts = Math.pow(2, hostBits) - 2;

    if (availableHosts >= requiredHosts) {
      return cidr;
    }
  }

  return 24; // Default fallback
}
