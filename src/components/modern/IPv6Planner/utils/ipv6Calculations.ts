/**
 * IPv6 calculation utilities
 */

import type { SubnettingResult } from '../types';

/**
 * Calculate IPv6 subnetting information
 */
export const calculateIPv6Subnetting = (input: string): SubnettingResult | null => {
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
};

/**
 * Format currency for display
 */
export const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(amount);
};

/**
 * Calculate risk severity based on probability and impact
 */
export const getRiskColor = (probability: string, impact: string): string => {
  const score =
    (probability === 'high' ? 3 : probability === 'medium' ? 2 : 1) +
    (impact === 'critical' ? 4 : impact === 'high' ? 3 : impact === 'medium' ? 2 : 1);
  if (score >= 6) {
    return 'bg-red-100 border-red-500';
  }
  if (score >= 4) {
    return 'bg-yellow-100 border-yellow-500';
  }
  return 'bg-green-100 border-green-500';
};
