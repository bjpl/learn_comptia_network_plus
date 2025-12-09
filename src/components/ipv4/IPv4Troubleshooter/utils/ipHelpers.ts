/**
 * IP address helper utilities
 */
import { parseIPAddress } from '../../../../utils/networking';

export const classifyIPAddress = (ip: string): string => {
  try {
    const info = parseIPAddress(ip);
    if (info.isLoopback) {
      return 'Loopback (127.0.0.0/8)';
    }
    if (info.isMulticast) {
      return 'Multicast (224.0.0.0/4)';
    }
    if (info.isPrivate) {
      return 'Private (RFC 1918)';
    }

    // Check for APIPA
    const octets = ip.split('.').map(Number);
    if (octets[0] === 169 && octets[1] === 254) {
      return 'APIPA (169.254.0.0/16)';
    }

    return `Public (Class ${info.class})`;
  } catch {
    return 'Invalid';
  }
};

export const areInSameSubnet = (
  ip: string,
  gateway: string,
  mask: string
): boolean => {
  const ipOctets = ip.split('.').map(Number);
  const gwOctets = gateway.split('.').map(Number);
  const maskOctets = mask.split('.').map(Number);

  for (let i = 0; i < 4; i++) {
    if ((ipOctets[i] & maskOctets[i]) !== (gwOctets[i] & maskOctets[i])) {
      return false;
    }
  }

  return true;
};
