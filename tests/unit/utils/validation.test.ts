/**
 * Unit Tests - Network Validation Utilities
 * Comprehensive tests for network-related input validation
 */

import { describe, it, expect } from 'vitest';
import {
  validateIPv4,
  validateIPv6,
  validateCIDR,
  validateSubnetMask,
  validatePort,
  validateMACAddress,
  validateURL,
  validateInput,
} from '../../../src/utils/validation';
import type { ValidationResult, ValidationConstraints } from '../../../src/types';

describe('Network Validation Utilities', () => {
  // ============================================================================
  // IPv4 Validation Tests
  // ============================================================================

  describe('validateIPv4', () => {
    describe('Valid Addresses', () => {
      it('should validate standard IPv4 addresses', () => {
        const validIPs = [
          '192.168.1.1',
          '10.0.0.1',
          '172.16.0.1',
          '8.8.8.8',
          '1.1.1.1',
        ];

        validIPs.forEach((ip) => {
          const result = validateIPv4(ip);
          expect(result.isValid).toBe(true);
          expect(result.errors).toHaveLength(0);
        });
      });

      it('should validate edge case valid addresses', () => {
        // Note: 255.255.255.254 removed as 255.x.x.x addresses are now invalid
        const edgeIPs = ['0.0.0.0', '127.0.0.1'];

        edgeIPs.forEach((ip) => {
          const result = validateIPv4(ip);
          expect(result.isValid).toBe(true);
        });
      });
    });

    describe('Invalid Addresses', () => {
      it('should reject out of range octets', () => {
        const result = validateIPv4('256.1.1.1');
        expect(result.isValid).toBe(false);
        expect(result.errors[0]).toContain('out of range');
      });

      it('should reject invalid formats', () => {
        const invalidIPs = [
          '192.168.1',
          '192.168.1.1.1',
          'abc.def.ghi.jkl',
          '192.168.1.256',
          '192.168.-1.1',
        ];

        invalidIPs.forEach((ip) => {
          const result = validateIPv4(ip);
          expect(result.isValid).toBe(false);
        });
      });

      it('should reject first octet of 255', () => {
        const result = validateIPv4('255.1.1.1');
        expect(result.isValid).toBe(false);
        expect(result.errors[0]).toContain('first octet cannot be 255');
      });
    });

    describe('Warnings and Suggestions', () => {
      it('should warn about loopback addresses', () => {
        const result = validateIPv4('127.0.0.1');
        expect(result.isValid).toBe(true);
        expect(result.warnings).toContain('Loopback address (127.0.0.0/8)');
      });

      it('should warn about network address starting with 0', () => {
        const result = validateIPv4('0.0.0.1');
        expect(result.warnings).toContain('Address starts with 0 (network address)');
      });

      it('should reject broadcast address (255 in first octet)', () => {
        const result = validateIPv4('255.255.255.255');
        expect(result.isValid).toBe(false);
        expect(result.errors[0]).toContain('first octet cannot be 255');
      });

      it('should suggest private IP ranges', () => {
        const privateIPs = [
          { ip: '10.0.0.1', range: 'RFC 1918' },
          { ip: '172.16.0.1', range: 'RFC 1918' },
          { ip: '192.168.1.1', range: 'RFC 1918' },
        ];

        privateIPs.forEach(({ ip }) => {
          const result = validateIPv4(ip);
          expect(result.suggestions).toContain('This is a private IP address (RFC 1918)');
        });
      });

      it('should warn about leading zeros', () => {
        const result = validateIPv4('192.168.001.1');
        expect(result.warnings?.some((w) => w.includes('leading zeros'))).toBe(true);
      });
    });

    describe('Special Cases', () => {
      it('should validate all private IP ranges', () => {
        const privateRanges = [
          '10.0.0.0', // Class A private
          '10.255.255.255',
          '172.16.0.0', // Class B private start
          '172.31.255.255', // Class B private end
          '192.168.0.0', // Class C private
          '192.168.255.255',
        ];

        privateRanges.forEach((ip) => {
          const result = validateIPv4(ip);
          expect(result.suggestions).toContain('This is a private IP address (RFC 1918)');
        });
      });
    });
  });

  // ============================================================================
  // IPv6 Validation Tests
  // ============================================================================

  describe('validateIPv6', () => {
    describe('Valid Addresses', () => {
      it('should validate full IPv6 addresses', () => {
        const validIPs = [
          '2001:0db8:0000:0000:0000:0000:0000:0001',
          '2001:db8::1',
          'fe80::1',
          '::1',
          '::',
        ];

        validIPs.forEach((ip) => {
          const result = validateIPv6(ip);
          expect(result.isValid).toBe(true);
        });
      });

      it('should validate compressed notation', () => {
        const compressedIPs = [
          '2001:db8::8a2e:370:7334',
          'fe80::',
          '::ffff:192.0.2.1',
        ];

        compressedIPs.forEach((ip) => {
          const result = validateIPv6(ip);
          expect(result.isValid).toBe(true);
        });
      });
    });

    describe('Invalid Addresses', () => {
      it('should reject malformed IPv6 addresses', () => {
        const invalidIPs = [
          'gggg::1',
          '2001:db8::1::2', // Double compression
          '192.168.1.1', // IPv4
          'not-an-ip',
        ];

        invalidIPs.forEach((ip) => {
          const result = validateIPv6(ip);
          expect(result.isValid).toBe(false);
        });
      });

      it('should reject multiple :: compressions', () => {
        const result = validateIPv6('2001::db8::1');
        expect(result.isValid).toBe(false);
        expect(result.errors).toContain('Multiple :: compressions are not allowed');
      });
    });

    describe('Special Addresses', () => {
      it('should identify loopback address', () => {
        const result = validateIPv6('::1');
        expect(result.isValid).toBe(true);
        expect(result.warnings).toContain('Loopback address');
      });

      it('should identify link-local addresses', () => {
        const result = validateIPv6('fe80::1');
        expect(result.isValid).toBe(true);
        expect(result.suggestions).toContain('Link-local address');
      });

      it('should identify multicast addresses', () => {
        const result = validateIPv6('ff02::1');
        expect(result.isValid).toBe(true);
        expect(result.suggestions).toContain('Multicast address');
      });

      it('should identify unspecified address', () => {
        const result = validateIPv6('::');
        expect(result.isValid).toBe(true);
        expect(result.warnings).toContain('Unspecified address (all zeros)');
      });
    });
  });

  // ============================================================================
  // CIDR Notation Tests
  // ============================================================================

  describe('validateCIDR', () => {
    describe('Valid CIDR', () => {
      it('should validate standard CIDR notation', () => {
        const validCIDRs = [
          '192.168.1.0/24',
          '10.0.0.0/8',
          '172.16.0.0/16',
          '192.168.1.0/32',
        ];

        validCIDRs.forEach((cidr) => {
          const result = validateCIDR(cidr);
          expect(result.isValid).toBe(true);
        });
      });
    });

    describe('Invalid CIDR', () => {
      it('should reject invalid format', () => {
        const result = validateCIDR('192.168.1.0');
        expect(result.isValid).toBe(false);
        expect(result.errors[0]).toContain('Invalid CIDR format');
      });

      it('should reject invalid prefix length', () => {
        const invalidCIDRs = ['192.168.1.0/33', '192.168.1.0/-1', '192.168.1.0/abc'];

        invalidCIDRs.forEach((cidr) => {
          const result = validateCIDR(cidr);
          expect(result.isValid).toBe(false);
        });
      });

      it('should reject invalid IP part', () => {
        const result = validateCIDR('256.1.1.1/24');
        expect(result.isValid).toBe(false);
      });
    });

    describe('Network Size Suggestions', () => {
      it('should identify Class C network (/24)', () => {
        const result = validateCIDR('192.168.1.0/24');
        expect(result.suggestions).toContain('Class C network (256 addresses)');
      });

      it('should identify Class B network (/16)', () => {
        const result = validateCIDR('172.16.0.0/16');
        expect(result.suggestions).toContain('Class B network (65,536 addresses)');
      });

      it('should identify Class A network (/8)', () => {
        const result = validateCIDR('10.0.0.0/8');
        expect(result.suggestions).toContain('Class A network (16,777,216 addresses)');
      });

      it('should warn about host address (/32)', () => {
        const result = validateCIDR('192.168.1.1/32');
        expect(result.warnings).toContain('Host address (/32) - single IP');
      });

      it('should identify point-to-point links', () => {
        const result31 = validateCIDR('192.168.1.0/31');
        expect(result31.suggestions).toContain('Point-to-point link (/31) - RFC 3021');

        const result30 = validateCIDR('192.168.1.0/30');
        expect(result30.suggestions).toContain('Point-to-point link (/30) - 2 usable hosts');
      });
    });
  });

  // ============================================================================
  // Subnet Mask Validation Tests
  // ============================================================================

  describe('validateSubnetMask', () => {
    describe('Valid Subnet Masks', () => {
      it('should validate standard subnet masks', () => {
        const validMasks = [
          '255.255.255.0',
          '255.255.0.0',
          '255.0.0.0',
          '255.255.255.128',
          '255.255.255.252',
        ];

        validMasks.forEach((mask) => {
          const result = validateSubnetMask(mask);
          expect(result.isValid).toBe(true);
        });
      });
    });

    describe('Invalid Subnet Masks', () => {
      it('should reject non-contiguous masks', () => {
        const result = validateSubnetMask('255.255.1.0');
        expect(result.isValid).toBe(false);
        expect(result.errors[0]).toContain('contiguous 1 bits');
      });

      it('should reject invalid IP format', () => {
        const result = validateSubnetMask('256.255.255.0');
        expect(result.isValid).toBe(false);
      });

      it('should reject all zeros', () => {
        const result = validateSubnetMask('0.0.0.0');
        expect(result.isValid).toBe(false);
        expect(result.errors[0]).toContain('cannot be all zeros');
      });
    });

    describe('Warnings', () => {
      it('should warn about /32 mask', () => {
        const result = validateSubnetMask('255.255.255.255');
        expect(result.warnings).toContain('Subnet mask is /32 (single host)');
      });
    });
  });

  // ============================================================================
  // Port Validation Tests
  // ============================================================================

  describe('validatePort', () => {
    describe('Valid Ports', () => {
      it('should validate port numbers as integers', () => {
        const validPorts = [80, 443, 8080, 3000, 22, 21];

        validPorts.forEach((port) => {
          const result = validatePort(port);
          expect(result.isValid).toBe(true);
        });
      });

      it('should validate port numbers as strings', () => {
        const validPorts = ['80', '443', '8080'];

        validPorts.forEach((port) => {
          const result = validatePort(port);
          expect(result.isValid).toBe(true);
        });
      });

      it('should validate port 0 and 65535 (boundaries)', () => {
        expect(validatePort(0).isValid).toBe(true);
        expect(validatePort(65535).isValid).toBe(true);
      });
    });

    describe('Invalid Ports', () => {
      it('should reject out of range ports', () => {
        expect(validatePort(-1).isValid).toBe(false);
        expect(validatePort(65536).isValid).toBe(false);
        expect(validatePort(100000).isValid).toBe(false);
      });

      it('should reject non-numeric strings', () => {
        const result = validatePort('abc');
        expect(result.isValid).toBe(false);
        expect(result.errors).toContain('Port must be a valid number');
      });
    });

    describe('Port Categories', () => {
      it('should identify well-known ports (0-1023)', () => {
        const result = validatePort(80);
        expect(result.suggestions).toContain('Well-known port (0-1023) - requires elevated privileges');
      });

      it('should identify registered ports (1024-49151)', () => {
        const result = validatePort(8080);
        expect(result.suggestions).toContain('Registered port (1024-49151)');
      });

      it('should identify dynamic/private ports (49152-65535)', () => {
        const result = validatePort(50000);
        expect(result.suggestions).toContain('Dynamic/private port (49152-65535)');
      });
    });

    describe('Common Services', () => {
      it('should identify common HTTP services', () => {
        expect(validatePort(80).suggestions).toContain('Common service: HTTP');
        expect(validatePort(443).suggestions).toContain('Common service: HTTPS');
        expect(validatePort(8080).suggestions).toContain('Common service: HTTP Alternate');
      });

      it('should identify FTP services', () => {
        expect(validatePort(20).suggestions).toContain('Common service: FTP Data');
        expect(validatePort(21).suggestions).toContain('Common service: FTP Control');
      });

      it('should identify email services', () => {
        expect(validatePort(25).suggestions).toContain('Common service: SMTP');
        expect(validatePort(110).suggestions).toContain('Common service: POP3');
        expect(validatePort(143).suggestions).toContain('Common service: IMAP');
      });

      it('should identify network services', () => {
        expect(validatePort(22).suggestions).toContain('Common service: SSH');
        expect(validatePort(53).suggestions).toContain('Common service: DNS');
        expect(validatePort(67).suggestions).toContain('Common service: DHCP Server');
        expect(validatePort(3389).suggestions).toContain('Common service: RDP');
      });
    });
  });

  // ============================================================================
  // MAC Address Validation Tests
  // ============================================================================

  describe('validateMACAddress', () => {
    describe('Valid Formats', () => {
      it('should validate colon-separated format', () => {
        const result = validateMACAddress('00:1A:2B:3C:4D:5E');
        expect(result.isValid).toBe(true);
      });

      it('should validate dash-separated format', () => {
        const result = validateMACAddress('00-1A-2B-3C-4D-5E');
        expect(result.isValid).toBe(true);
      });

      it('should validate no separator format', () => {
        const result = validateMACAddress('001A2B3C4D5E');
        expect(result.isValid).toBe(true);
      });

      it('should accept lowercase hex digits', () => {
        const result = validateMACAddress('aa:bb:cc:dd:ee:ff');
        expect(result.isValid).toBe(true);
      });
    });

    describe('Invalid Formats', () => {
      it('should reject invalid formats', () => {
        const invalidMACs = [
          '00:1A:2B:3C:4D', // Too short
          'GG:1A:2B:3C:4D:5E', // Invalid hex
          '00:1A:2B:3C:4D:5E:FF', // Too long
          '00.1A.2B.3C.4D.5E', // Dots not supported
        ];

        invalidMACs.forEach((mac) => {
          const result = validateMACAddress(mac);
          expect(result.isValid).toBe(false);
        });
      });
    });

    describe('Special Addresses', () => {
      it('should identify broadcast MAC', () => {
        const result = validateMACAddress('FF:FF:FF:FF:FF:FF');
        expect(result.isValid).toBe(true);
        expect(result.warnings).toContain('Broadcast MAC address');
      });

      it('should identify multicast MAC addresses', () => {
        const result = validateMACAddress('01:00:5E:00:00:01');
        expect(result.isValid).toBe(true);
        expect(result.suggestions).toContain('Multicast MAC address');
      });

      it('should identify locally administered addresses', () => {
        const result = validateMACAddress('02:00:00:00:00:01');
        expect(result.isValid).toBe(true);
        expect(result.suggestions).toContain('Locally administered MAC address');
      });

      it('should identify universally administered addresses', () => {
        const result = validateMACAddress('00:1A:2B:3C:4D:5E');
        expect(result.isValid).toBe(true);
        expect(result.suggestions).toContain('Universally administered MAC address (OUI assigned)');
      });
    });
  });

  // ============================================================================
  // URL Validation Tests
  // ============================================================================

  describe('validateURL', () => {
    describe('Valid URLs', () => {
      it('should validate HTTPS URLs', () => {
        const result = validateURL('https://example.com');
        expect(result.isValid).toBe(true);
      });

      it('should validate HTTP URLs', () => {
        const result = validateURL('http://example.com');
        expect(result.isValid).toBe(true);
      });

      it('should validate FTP URLs', () => {
        const result = validateURL('ftp://ftp.example.com');
        expect(result.isValid).toBe(true);
      });

      it('should validate URLs with paths', () => {
        const result = validateURL('https://example.com/path/to/resource');
        expect(result.isValid).toBe(true);
      });

      it('should validate URLs with query parameters', () => {
        const result = validateURL('https://example.com?param=value');
        expect(result.isValid).toBe(true);
      });

      it('should validate URLs with ports', () => {
        const result = validateURL('https://example.com:8080');
        expect(result.isValid).toBe(true);
      });
    });

    describe('Invalid URLs', () => {
      it('should reject malformed URLs', () => {
        const invalidURLs = [
          'not a url',
          'ht!tp://example.com',
          'https://',
        ];

        invalidURLs.forEach((url) => {
          const result = validateURL(url);
          expect(result.isValid).toBe(false);
        });
      });

      it('should reject URLs with invalid ports', () => {
        const result = validateURL('https://example.com:99999');
        expect(result.isValid).toBe(false);
      });

      it('should reject URLs without hostname', () => {
        const result = validateURL('https://');
        expect(result.isValid).toBe(false);
      });
    });

    describe('Warnings and Suggestions', () => {
      it('should suggest HTTPS for HTTP URLs', () => {
        const result = validateURL('http://example.com');
        expect(result.suggestions).toContain('Consider using HTTPS for security');
      });

      it('should warn about unusual protocols', () => {
        const result = validateURL('custom://example.com');
        expect(result.warnings?.some((w) => w.includes('Unusual protocol'))).toBe(true);
      });

      it('should suggest using domain instead of IP', () => {
        const result = validateURL('https://192.168.1.1');
        expect(result.suggestions).toContain('URL uses IP address instead of domain name');
      });
    });
  });

  // ============================================================================
  // Generic Input Validation Tests
  // ============================================================================

  describe('validateInput', () => {
    describe('Required Field Validation', () => {
      it('should validate required fields', () => {
        const constraints: ValidationConstraints = { required: true };

        expect(validateInput('', constraints).isValid).toBe(false);
        expect(validateInput(null, constraints).isValid).toBe(false);
        expect(validateInput(undefined, constraints).isValid).toBe(false);
        expect(validateInput('value', constraints).isValid).toBe(true);
      });

      it('should allow empty values for optional fields', () => {
        const constraints: ValidationConstraints = { required: false };

        expect(validateInput('', constraints).isValid).toBe(true);
        expect(validateInput(null, constraints).isValid).toBe(true);
      });
    });

    describe('String Length Validation', () => {
      it('should validate minimum length', () => {
        const constraints: ValidationConstraints = { minLength: 5 };

        expect(validateInput('test', constraints).isValid).toBe(false);
        expect(validateInput('test1', constraints).isValid).toBe(true);
        expect(validateInput('testing', constraints).isValid).toBe(true);
      });

      it('should validate maximum length', () => {
        const constraints: ValidationConstraints = { maxLength: 10 };

        expect(validateInput('test', constraints).isValid).toBe(true);
        expect(validateInput('test12345', constraints).isValid).toBe(true);
        expect(validateInput('test123456', constraints).isValid).toBe(false);
      });

      it('should validate both min and max length', () => {
        const constraints: ValidationConstraints = { minLength: 5, maxLength: 10 };

        expect(validateInput('test', constraints).isValid).toBe(false);
        expect(validateInput('testing', constraints).isValid).toBe(true);
        expect(validateInput('testing123', constraints).isValid).toBe(false);
      });
    });

    describe('Number Range Validation', () => {
      it('should validate minimum value', () => {
        const constraints: ValidationConstraints = { min: 10 };

        expect(validateInput(5, constraints).isValid).toBe(false);
        expect(validateInput(10, constraints).isValid).toBe(true);
        expect(validateInput(15, constraints).isValid).toBe(true);
      });

      it('should validate maximum value', () => {
        const constraints: ValidationConstraints = { max: 100 };

        expect(validateInput(50, constraints).isValid).toBe(true);
        expect(validateInput(100, constraints).isValid).toBe(true);
        expect(validateInput(150, constraints).isValid).toBe(false);
      });
    });

    describe('Pattern Validation', () => {
      it('should validate against regex pattern', () => {
        const constraints: ValidationConstraints = { pattern: /^\d{3}-\d{3}-\d{4}$/ };

        expect(validateInput('123-456-7890', constraints).isValid).toBe(true);
        expect(validateInput('1234567890', constraints).isValid).toBe(false);
        expect(validateInput('abc-def-ghij', constraints).isValid).toBe(false);
      });

      it('should validate email pattern', () => {
        const constraints: ValidationConstraints = {
          pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/
        };

        expect(validateInput('test@example.com', constraints).isValid).toBe(true);
        expect(validateInput('invalid-email', constraints).isValid).toBe(false);
      });
    });

    describe('Custom Validator', () => {
      it('should use custom validator function', () => {
        const constraints: ValidationConstraints = {
          customValidator: (value) => {
            return typeof value === 'string' && value.toLowerCase() === 'valid';
          },
        };

        expect(validateInput('valid', constraints).isValid).toBe(true);
        expect(validateInput('VALID', constraints).isValid).toBe(true);
        expect(validateInput('invalid', constraints).isValid).toBe(false);
      });
    });

    describe('Combined Validation', () => {
      it('should apply multiple constraints', () => {
        const constraints: ValidationConstraints = {
          required: true,
          minLength: 8,
          maxLength: 20,
          pattern: /^[a-zA-Z0-9]+$/,
        };

        expect(validateInput('', constraints).isValid).toBe(false);
        expect(validateInput('test', constraints).isValid).toBe(false); // Too short
        expect(validateInput('test1234', constraints).isValid).toBe(true);
        expect(validateInput('test@1234', constraints).isValid).toBe(false); // Invalid char
        expect(validateInput('a'.repeat(25), constraints).isValid).toBe(false); // Too long
      });
    });
  });

  // ============================================================================
  // Edge Cases and Security Tests
  // ============================================================================

  describe('Security and Edge Cases', () => {
    it('should handle SQL injection attempts in IP validation', () => {
      const maliciousInputs = [
        "'; DROP TABLE users; --",
        '1.1.1.1 OR 1=1',
        "192.168.1.1'; DELETE FROM *; --",
      ];

      maliciousInputs.forEach((input) => {
        const result = validateIPv4(input);
        expect(result.isValid).toBe(false);
      });
    });

    it('should handle very long inputs gracefully', () => {
      const longString = 'a'.repeat(10000);

      expect(validateIPv4(longString).isValid).toBe(false);
      expect(validatePort(longString).isValid).toBe(false);
      expect(validateMACAddress(longString).isValid).toBe(false);
    });

    it('should handle special characters safely', () => {
      const specialChars = ['<script>', '&lt;', '%00', '\x00', '\n', '\r'];

      specialChars.forEach((char) => {
        const result = validateIPv4(char);
        expect(result.isValid).toBe(false);
      });
    });

    it('should handle unicode characters', () => {
      expect(validateIPv4('192.168.♥.1').isValid).toBe(false);
      expect(validatePort('80♥0').isValid).toBe(false);
    });
  });
});
