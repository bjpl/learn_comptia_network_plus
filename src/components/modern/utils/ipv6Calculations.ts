/**
 * IPv6 Address Calculation Utilities
 * Pure functions for IPv6 address manipulation and subnetting
 */

export interface SubnettingResult {
  network: string;
  prefix: string;
  hostBits: number;
  hostsPerSubnet: number;
  firstHost: string;
  lastHost: string;
  broadcast: string;
}

/**
 * Calculate IPv6 subnetting information from address and prefix
 */
export function calculateIPv6Subnetting(input: string): SubnettingResult | null {
  const [address, prefixStr] = input.split('/');
  const prefix = parseInt(prefixStr, 10);

  if (isNaN(prefix) || prefix < 0 || prefix > 128) {
    return null;
  }

  const hostBits = 128 - prefix;
  const hostsPerSubnet = Math.pow(2, hostBits) - 1;

  return {
    network: address,
    prefix: `/${prefix}`,
    hostBits,
    hostsPerSubnet: Math.floor(hostsPerSubnet),
    firstHost: `${address}::1`,
    lastHost: `${address}::ffff:ffff:ffff:ffff`,
    broadcast: `${address}::ffff:ffff:ffff:ffff`,
  };
}

/**
 * Validate IPv6 address format
 */
export function isValidIPv6(address: string): boolean {
  const parts = address.split(':');
  if (parts.length < 3 || parts.length > 8) return false;

  // Check for double colon
  const doubleColonCount = (address.match(/::/g) || []).length;
  if (doubleColonCount > 1) return false;

  // Validate each part
  for (const part of parts) {
    if (part === '') continue; // Allow empty for ::
    if (!/^[0-9a-fA-F]{1,4}$/.test(part)) return false;
  }

  return true;
}

/**
 * Compress IPv6 address by removing leading zeros and consecutive zeros
 */
export function compressIPv6(address: string): string {
  // Remove leading zeros
  let compressed = address
    .split(':')
    .map((part) => part.replace(/^0+/, '') || '0')
    .join(':');

  // Replace longest sequence of zeros with ::
  const zeroSequences = compressed.match(/(:0)+/g) || [];
  if (zeroSequences.length > 0) {
    const longest = zeroSequences.reduce((a, b) => (a.length > b.length ? a : b));
    compressed = compressed.replace(longest, ':');
  }

  return compressed;
}

/**
 * Expand compressed IPv6 address to full notation
 */
export function expandIPv6(address: string): string {
  // Handle ::
  if (address.includes('::')) {
    const parts = address.split('::');
    const leftParts = parts[0] ? parts[0].split(':') : [];
    const rightParts = parts[1] ? parts[1].split(':') : [];
    const missingParts = 8 - leftParts.length - rightParts.length;
    const middle = Array(missingParts).fill('0000');

    const allParts = [...leftParts, ...middle, ...rightParts];
    return allParts.map((part) => part.padStart(4, '0')).join(':');
  }

  // Just pad each part
  return address
    .split(':')
    .map((part) => part.padStart(4, '0'))
    .join(':');
}

/**
 * Calculate number of subnets from prefix change
 */
export function calculateSubnetCount(oldPrefix: number, newPrefix: number): number {
  if (newPrefix <= oldPrefix) return 0;
  return Math.pow(2, newPrefix - oldPrefix);
}

/**
 * Format currency for budget displays
 */
export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
}
