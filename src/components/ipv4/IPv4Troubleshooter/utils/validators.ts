/**
 * IP configuration validation utilities
 */
import { parseIPAddress } from '../../../../utils/networking';
import { classifyIPAddress, areInSameSubnet } from './ipHelpers';
import type { ValidationResult } from '../types';

export const validateIPConfiguration = (
  ip: string,
  mask: string,
  gateway: string
): ValidationResult[] => {
  const results: ValidationResult[] = [];

  // Validate IP address
  try {
    parseIPAddress(ip);
    const classification = classifyIPAddress(ip);

    if (classification === 'Invalid') {
      results.push({ field: 'IP Address', status: 'invalid', message: 'Invalid IP format' });
    } else if (classification === 'Loopback (127.0.0.0/8)') {
      results.push({
        field: 'IP Address',
        status: 'warning',
        message: 'Loopback address detected - use only for testing',
      });
    } else if (classification === 'Multicast (224.0.0.0/4)') {
      results.push({
        field: 'IP Address',
        status: 'invalid',
        message: 'Multicast addresses cannot be assigned to hosts',
      });
    } else {
      results.push({ field: 'IP Address', status: 'valid', message: `Valid ${classification}` });
    }
  } catch {
    results.push({
      field: 'IP Address',
      status: 'invalid',
      message: 'Invalid IP address format',
    });
  }

  // Validate subnet mask
  try {
    const maskOctets = mask.split('.').map(Number);
    if (maskOctets.some((octet) => octet < 0 || octet > 255)) {
      results.push({
        field: 'Subnet Mask',
        status: 'invalid',
        message: 'Mask octets must be 0-255',
      });
    } else {
      results.push({ field: 'Subnet Mask', status: 'valid', message: 'Valid subnet mask' });
    }
  } catch {
    results.push({ field: 'Subnet Mask', status: 'invalid', message: 'Invalid mask format' });
  }

  // Validate gateway
  try {
    parseIPAddress(gateway);
    results.push({ field: 'Default Gateway', status: 'valid', message: 'Valid gateway address' });
  } catch {
    results.push({
      field: 'Default Gateway',
      status: 'invalid',
      message: 'Invalid gateway format',
    });
  }

  // Cross-check IP and gateway are in same subnet
  if (ip && gateway && mask) {
    if (!areInSameSubnet(ip, gateway, mask)) {
      results.push({
        field: 'Subnet Consistency',
        status: 'invalid',
        message: 'IP and gateway are not on the same subnet',
      });
    } else {
      results.push({
        field: 'Subnet Consistency',
        status: 'valid',
        message: 'IP and gateway are on the same subnet',
      });
    }
  }

  return results;
};
