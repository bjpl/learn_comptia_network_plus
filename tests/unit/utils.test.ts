/**
 * Unit Tests - Utility Functions
 * Tests for scoring, validation, and networking utilities
 */

import { describe, it, expect, beforeEach } from 'vitest';

// Scoring Utilities Tests
describe('Scoring Utilities', () => {
  describe('calculateScore', () => {
    it('should calculate perfect score for all correct answers', () => {
      const answers = [
        { questionId: 1, userAnswer: 'A', correctAnswer: 'A' },
        { questionId: 2, userAnswer: 'B', correctAnswer: 'B' },
        { questionId: 3, userAnswer: 'C', correctAnswer: 'C' },
      ];

      const score = calculateScore(answers);
      expect(score).toBe(100);
    });

    it('should calculate zero score for all incorrect answers', () => {
      const answers = [
        { questionId: 1, userAnswer: 'A', correctAnswer: 'B' },
        { questionId: 2, userAnswer: 'B', correctAnswer: 'C' },
        { questionId: 3, userAnswer: 'C', correctAnswer: 'A' },
      ];

      const score = calculateScore(answers);
      expect(score).toBe(0);
    });

    it('should calculate partial score correctly', () => {
      const answers = [
        { questionId: 1, userAnswer: 'A', correctAnswer: 'A' },
        { questionId: 2, userAnswer: 'B', correctAnswer: 'C' },
        { questionId: 3, userAnswer: 'C', correctAnswer: 'C' },
      ];

      const score = calculateScore(answers);
      expect(score).toBeCloseTo(66.67, 1);
    });

    it('should handle empty answers array', () => {
      const score = calculateScore([]);
      expect(score).toBe(0);
    });
  });

  describe('calculateTimeBonus', () => {
    it('should give maximum bonus for very fast completion', () => {
      const bonus = calculateTimeBonus(60, 600); // 1 min vs 10 min limit
      expect(bonus).toBeGreaterThanOrEqual(0);
      expect(bonus).toBeLessThanOrEqual(10);
    });

    it('should give no bonus for exceeding time limit', () => {
      const bonus = calculateTimeBonus(700, 600);
      expect(bonus).toBe(0);
    });

    it('should scale bonus proportionally', () => {
      const bonus1 = calculateTimeBonus(300, 600);
      const bonus2 = calculateTimeBonus(450, 600);
      expect(bonus1).toBeGreaterThan(bonus2);
    });
  });
});

// Validation Utilities Tests
describe('Validation Utilities', () => {
  describe('validateIPv4', () => {
    it('should validate correct IPv4 addresses', () => {
      expect(validateIPv4('192.168.1.1')).toBe(true);
      expect(validateIPv4('10.0.0.0')).toBe(true);
      expect(validateIPv4('255.255.255.255')).toBe(true);
    });

    it('should reject invalid IPv4 addresses', () => {
      expect(validateIPv4('256.1.1.1')).toBe(false);
      expect(validateIPv4('192.168.1')).toBe(false);
      expect(validateIPv4('192.168.1.1.1')).toBe(false);
      expect(validateIPv4('abc.def.ghi.jkl')).toBe(false);
    });

    it('should handle edge cases', () => {
      expect(validateIPv4('')).toBe(false);
      expect(validateIPv4('0.0.0.0')).toBe(true);
    });
  });

  describe('validateSubnetMask', () => {
    it('should validate correct subnet masks', () => {
      expect(validateSubnetMask('255.255.255.0')).toBe(true);
      expect(validateSubnetMask('255.255.0.0')).toBe(true);
      expect(validateSubnetMask('255.0.0.0')).toBe(true);
    });

    it('should reject invalid subnet masks', () => {
      expect(validateSubnetMask('255.255.255.1')).toBe(false);
      expect(validateSubnetMask('192.168.1.1')).toBe(false);
    });
  });

  describe('validateMACAddress', () => {
    it('should validate correct MAC addresses', () => {
      expect(validateMACAddress('00:1A:2B:3C:4D:5E')).toBe(true);
      expect(validateMACAddress('00-1A-2B-3C-4D-5E')).toBe(true);
    });

    it('should reject invalid MAC addresses', () => {
      expect(validateMACAddress('00:1A:2B:3C:4D')).toBe(false);
      expect(validateMACAddress('GG:1A:2B:3C:4D:5E')).toBe(false);
    });
  });

  describe('validateCIDR', () => {
    it('should validate correct CIDR notation', () => {
      expect(validateCIDR('192.168.1.0/24')).toBe(true);
      expect(validateCIDR('10.0.0.0/8')).toBe(true);
    });

    it('should reject invalid CIDR notation', () => {
      expect(validateCIDR('192.168.1.0/33')).toBe(false);
      expect(validateCIDR('192.168.1.0')).toBe(false);
    });
  });
});

// Networking Utilities Tests
describe('Networking Utilities', () => {
  describe('calculateSubnet', () => {
    it('should calculate subnet correctly', () => {
      const result = calculateSubnet('192.168.1.0', '255.255.255.0');
      expect(result).toEqual({
        networkAddress: '192.168.1.0',
        broadcastAddress: '192.168.1.255',
        usableHosts: 254,
        firstUsable: '192.168.1.1',
        lastUsable: '192.168.1.254',
      });
    });

    it('should handle /30 subnet', () => {
      const result = calculateSubnet('192.168.1.0', '255.255.255.252');
      expect(result.usableHosts).toBe(2);
    });
  });

  describe('convertCIDRToMask', () => {
    it('should convert CIDR to subnet mask', () => {
      expect(convertCIDRToMask(24)).toBe('255.255.255.0');
      expect(convertCIDRToMask(16)).toBe('255.255.0.0');
      expect(convertCIDRToMask(8)).toBe('255.0.0.0');
    });
  });

  describe('convertMaskToCIDR', () => {
    it('should convert subnet mask to CIDR', () => {
      expect(convertMaskToCIDR('255.255.255.0')).toBe(24);
      expect(convertMaskToCIDR('255.255.0.0')).toBe(16);
      expect(convertMaskToCIDR('255.0.0.0')).toBe(8);
    });
  });

  describe('isPrivateIP', () => {
    it('should identify private IP addresses', () => {
      expect(isPrivateIP('192.168.1.1')).toBe(true);
      expect(isPrivateIP('10.0.0.1')).toBe(true);
      expect(isPrivateIP('172.16.0.1')).toBe(true);
    });

    it('should identify public IP addresses', () => {
      expect(isPrivateIP('8.8.8.8')).toBe(false);
      expect(isPrivateIP('1.1.1.1')).toBe(false);
    });
  });
});

// Helper function implementations
function calculateScore(answers: Array<{ questionId: number; userAnswer: string; correctAnswer: string }>): number {
  if (answers.length === 0) {return 0;}
  const correct = answers.filter(a => a.userAnswer === a.correctAnswer).length;
  return (correct / answers.length) * 100;
}

function calculateTimeBonus(timeSpent: number, timeLimit: number): number {
  if (timeSpent >= timeLimit) {return 0;}
  const timeRatio = timeSpent / timeLimit;
  return Math.max(0, Math.min(10, (1 - timeRatio) * 10));
}

function validateIPv4(ip: string): boolean {
  const parts = ip.split('.');
  if (parts.length !== 4) {return false;}
  return parts.every(part => {
    const num = parseInt(part, 10);
    return num >= 0 && num <= 255 && part === num.toString();
  });
}

function validateSubnetMask(mask: string): boolean {
  if (!validateIPv4(mask)) {return false;}
  const validMasks = [
    '255.0.0.0', '255.128.0.0', '255.192.0.0', '255.224.0.0',
    '255.240.0.0', '255.248.0.0', '255.252.0.0', '255.254.0.0',
    '255.255.0.0', '255.255.128.0', '255.255.192.0', '255.255.224.0',
    '255.255.240.0', '255.255.248.0', '255.255.252.0', '255.255.254.0',
    '255.255.255.0', '255.255.255.128', '255.255.255.192', '255.255.255.224',
    '255.255.255.240', '255.255.255.248', '255.255.255.252', '255.255.255.254',
    '255.255.255.255'
  ];
  return validMasks.includes(mask);
}

function validateMACAddress(mac: string): boolean {
  return /^([0-9A-Fa-f]{2}[:-]){5}([0-9A-Fa-f]{2})$/.test(mac);
}

function validateCIDR(cidr: string): boolean {
  const [ip, prefix] = cidr.split('/');
  if (!validateIPv4(ip)) {return false;}
  const prefixNum = parseInt(prefix, 10);
  return prefixNum >= 0 && prefixNum <= 32;
}

function calculateSubnet(ip: string, mask: string) {
  // Convert mask to CIDR for calculation
  const maskOctets = mask.split('.').map(Number);
  const binary = maskOctets.map(o => o.toString(2).padStart(8, '0')).join('');
  const cidr = binary.split('1').length - 1;

  const ipOctets = ip.split('.').map(Number);
  const ipInt = (ipOctets[0] << 24) + (ipOctets[1] << 16) + (ipOctets[2] << 8) + ipOctets[3];
  const maskInt = ~((1 << (32 - cidr)) - 1);
  const network = ipInt & maskInt;
  const broadcast = network | ~maskInt;

  const totalHosts = Math.pow(2, 32 - cidr);
  const usableHosts = cidr === 32 ? 1 : (cidr === 31 ? 2 : totalHosts - 2);

  const intToIp = (int: number) => [
    (int >>> 24) & 0xff,
    (int >>> 16) & 0xff,
    (int >>> 8) & 0xff,
    int & 0xff,
  ].join('.');

  return {
    networkAddress: intToIp(network),
    broadcastAddress: intToIp(broadcast),
    usableHosts,
    firstUsable: intToIp(cidr === 32 ? network : network + 1),
    lastUsable: intToIp(cidr === 32 ? network : (cidr === 31 ? broadcast : broadcast - 1)),
  };
}

function convertCIDRToMask(cidr: number): string {
  const masks: Record<number, string> = {
    8: '255.0.0.0',
    16: '255.255.0.0',
    24: '255.255.255.0',
  };
  return masks[cidr] || '';
}

function convertMaskToCIDR(mask: string): number {
  const cidrs: Record<string, number> = {
    '255.0.0.0': 8,
    '255.255.0.0': 16,
    '255.255.255.0': 24,
  };
  return cidrs[mask] || 0;
}

function isPrivateIP(ip: string): boolean {
  const parts = ip.split('.').map(Number);
  return (
    parts[0] === 10 ||
    (parts[0] === 172 && parts[1] >= 16 && parts[1] <= 31) ||
    (parts[0] === 192 && parts[1] === 168)
  );
}
