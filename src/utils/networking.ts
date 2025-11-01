/**
 * CompTIA Network+ Learning Platform - Networking Utilities
 * Comprehensive network calculation functions for subnetting, VLSM, and more
 */

import type { IPAddress, SubnetInfo, VLSMResult, PortInfo, NetworkProtocol } from '../types';
import { NetworkCalculationError } from '../types';

// ============================================================================
// IP Address Utilities
// ============================================================================

/**
 * Parse IP address and return detailed information
 *
 * @param ip - IP address string
 * @returns Detailed IP information
 *
 * @example
 * ```typescript
 * const info = parseIPAddress('192.168.1.1');
 * console.log(info.class); // "C"
 * console.log(info.isPrivate); // true
 * ```
 */
export function parseIPAddress(ip: string): IPAddress {
  const octets = ip.split('.').map(Number);

  if (octets.length !== 4 || octets.some((o) => isNaN(o) || o < 0 || o > 255)) {
    throw new NetworkCalculationError('Invalid IPv4 address', { ip });
  }

  const binary = octets.map((o) => o.toString(2).padStart(8, '0')).join('.');
  const decimal = octets;
  const firstOctet = octets[0];

  // Determine class
  let ipClass: 'A' | 'B' | 'C' | 'D' | 'E' | undefined;
  if (firstOctet >= 1 && firstOctet <= 126) {
    ipClass = 'A';
  } else if (firstOctet >= 128 && firstOctet <= 191) {
    ipClass = 'B';
  } else if (firstOctet >= 192 && firstOctet <= 223) {
    ipClass = 'C';
  } else if (firstOctet >= 224 && firstOctet <= 239) {
    ipClass = 'D';
  } else if (firstOctet >= 240 && firstOctet <= 255) {
    ipClass = 'E';
  }

  // Check special address types
  const isPrivate =
    firstOctet === 10 ||
    (firstOctet === 172 && octets[1] >= 16 && octets[1] <= 31) ||
    (firstOctet === 192 && octets[1] === 168);

  const isLoopback = firstOctet === 127;
  const isMulticast = firstOctet >= 224 && firstOctet <= 239;

  return {
    address: ip,
    version: 4,
    binary,
    decimal,
    isValid: true,
    isPrivate,
    isLoopback,
    isMulticast,
    class: ipClass,
  };
}

/**
 * Convert IP address to 32-bit integer
 *
 * @param ip - IP address string
 * @returns 32-bit integer representation
 */
export function ipToInt(ip: string): number {
  const octets = ip.split('.').map(Number);
  return (octets[0] << 24) + (octets[1] << 16) + (octets[2] << 8) + octets[3];
}

/**
 * Convert 32-bit integer to IP address
 *
 * @param int - 32-bit integer
 * @returns IP address string
 */
export function intToIp(int: number): string {
  return [(int >>> 24) & 0xff, (int >>> 16) & 0xff, (int >>> 8) & 0xff, int & 0xff].join('.');
}

// ============================================================================
// Subnet Calculations
// ============================================================================

/**
 * Calculate subnet information from CIDR
 *
 * @param cidr - CIDR notation (e.g., "192.168.1.0/24")
 * @returns Detailed subnet information
 *
 * @example
 * ```typescript
 * const subnet = calculateSubnet('192.168.1.0/24');
 * console.log(subnet.network); // "192.168.1.0"
 * console.log(subnet.broadcast); // "192.168.1.255"
 * console.log(subnet.usableHosts); // 254
 * ```
 */
export function calculateSubnet(cidr: string): SubnetInfo {
  const [ipStr, prefixStr] = cidr.split('/');
  const prefix = parseInt(prefixStr, 10);

  if (prefix < 0 || prefix > 32) {
    throw new NetworkCalculationError('Invalid CIDR prefix', { cidr });
  }

  const ip = ipToInt(ipStr);
  const mask = ~((1 << (32 - prefix)) - 1);
  const network = ip & mask;
  const broadcast = network | ~mask;

  const subnetMask = intToIp(mask);
  const wildcardMask = intToIp(~mask);
  const totalHosts = Math.pow(2, 32 - prefix);
  const usableHosts = prefix === 32 ? 1 : prefix === 31 ? 2 : totalHosts - 2;

  const firstHost = prefix === 32 ? network : network + 1;
  const lastHost = prefix === 32 ? network : prefix === 31 ? broadcast : broadcast - 1;

  return {
    network: intToIp(network),
    broadcast: intToIp(broadcast),
    firstHost: intToIp(firstHost),
    lastHost: intToIp(lastHost),
    subnetMask,
    cidr: prefix,
    wildcardMask,
    totalHosts,
    usableHosts,
    binary: {
      network: intToIp(network)
        .split('.')
        .map((o) => parseInt(o).toString(2).padStart(8, '0'))
        .join('.'),
      mask: subnetMask
        .split('.')
        .map((o) => parseInt(o).toString(2).padStart(8, '0'))
        .join('.'),
    },
  };
}

/**
 * Convert subnet mask to CIDR prefix
 *
 * @param mask - Subnet mask (e.g., "255.255.255.0")
 * @returns CIDR prefix length
 *
 * @example
 * ```typescript
 * const prefix = subnetMaskToCIDR('255.255.255.0'); // 24
 * ```
 */
export function subnetMaskToCIDR(mask: string): number {
  const octets = mask.split('.').map(Number);
  const binary = octets.map((o) => o.toString(2).padStart(8, '0')).join('');
  return binary.split('1').length - 1;
}

/**
 * Convert CIDR prefix to subnet mask
 *
 * @param prefix - CIDR prefix (0-32)
 * @returns Subnet mask string
 *
 * @example
 * ```typescript
 * const mask = cidrToSubnetMask(24); // "255.255.255.0"
 * ```
 */
export function cidrToSubnetMask(prefix: number): string {
  if (prefix < 0 || prefix > 32) {
    throw new NetworkCalculationError('Invalid CIDR prefix', { prefix });
  }

  const mask = ~((1 << (32 - prefix)) - 1);
  return intToIp(mask);
}

/**
 * Check if an IP address is within a subnet
 *
 * @param ip - IP address to check
 * @param cidr - CIDR notation of subnet
 * @returns True if IP is in subnet
 *
 * @example
 * ```typescript
 * const inSubnet = isIPInSubnet('192.168.1.50', '192.168.1.0/24'); // true
 * ```
 */
export function isIPInSubnet(ip: string, cidr: string): boolean {
  const [networkStr, prefixStr] = cidr.split('/');
  const prefix = parseInt(prefixStr, 10);
  const mask = ~((1 << (32 - prefix)) - 1);

  const ipInt = ipToInt(ip);
  const networkInt = ipToInt(networkStr) & mask;

  return (ipInt & mask) === networkInt;
}

// ============================================================================
// VLSM (Variable Length Subnet Masking)
// ============================================================================

/**
 * Calculate VLSM subnets based on host requirements
 *
 * @param baseNetwork - Base network in CIDR (e.g., "192.168.1.0/24")
 * @param requirements - Array of required host counts
 * @returns VLSM calculation result with subnets
 *
 * @example
 * ```typescript
 * const vlsm = calculateVLSM('192.168.1.0/24', [50, 30, 12, 6]);
 * vlsm.subnets.forEach(subnet => {
 *   console.log(`Network: ${subnet.network}/${subnet.cidr}`);
 *   console.log(`Usable hosts: ${subnet.usableHosts}`);
 * });
 * ```
 */
export function calculateVLSM(baseNetwork: string, requirements: number[]): VLSMResult {
  const [baseIp, basePrefixStr] = baseNetwork.split('/');
  const basePrefix = parseInt(basePrefixStr, 10);
  const baseSubnet = calculateSubnet(baseNetwork);

  // Sort requirements in descending order
  const sortedReqs = [...requirements].sort((a, b) => b - a);

  const subnets: SubnetInfo[] = [];
  let currentNetwork = ipToInt(baseIp);
  let totalAllocated = 0;

  for (const hostsNeeded of sortedReqs) {
    // Calculate prefix needed for this requirement
    // Need to account for network and broadcast addresses
    const totalAddresses = hostsNeeded + 2;
    const prefixNeeded = 32 - Math.ceil(Math.log2(totalAddresses));

    if (prefixNeeded < basePrefix) {
      throw new NetworkCalculationError(
        `Requirement of ${hostsNeeded} hosts exceeds base network capacity`,
        { hostsNeeded, baseNetwork }
      );
    }

    // Create subnet
    const cidr = `${intToIp(currentNetwork)}/${prefixNeeded}`;
    const subnet = calculateSubnet(cidr);
    subnets.push(subnet);

    // Move to next available network
    const subnetSize = Math.pow(2, 32 - prefixNeeded);
    totalAllocated += subnetSize;
    currentNetwork += subnetSize;
  }

  // Calculate efficiency
  const wastedAddresses = baseSubnet.totalHosts - totalAllocated;
  const efficiency = (totalAllocated / baseSubnet.totalHosts) * 100;

  return {
    subnets,
    wastedAddresses,
    efficiency: Math.round(efficiency * 100) / 100,
  };
}

/**
 * Calculate number of subnets possible with given prefix
 *
 * @param originalPrefix - Original network prefix
 * @param newPrefix - New subnet prefix
 * @returns Number of possible subnets
 *
 * @example
 * ```typescript
 * const count = calculateSubnetCount(24, 26); // 4
 * ```
 */
export function calculateSubnetCount(originalPrefix: number, newPrefix: number): number {
  if (newPrefix < originalPrefix) {
    throw new NetworkCalculationError('New prefix must be larger than original prefix', {
      originalPrefix,
      newPrefix,
    });
  }

  return Math.pow(2, newPrefix - originalPrefix);
}

// ============================================================================
// Port Utilities
// ============================================================================

/**
 * Get port information
 *
 * @param port - Port number
 * @returns Port information
 *
 * @example
 * ```typescript
 * const info = getPortInfo(443);
 * console.log(info.service); // "HTTPS"
 * ```
 */
export function getPortInfo(port: number): PortInfo {
  const wellKnownPorts: Record<number, { protocol: string; service: string }> = {
    20: { protocol: 'TCP', service: 'FTP Data' },
    21: { protocol: 'TCP', service: 'FTP Control' },
    22: { protocol: 'TCP', service: 'SSH' },
    23: { protocol: 'TCP', service: 'Telnet' },
    25: { protocol: 'TCP', service: 'SMTP' },
    53: { protocol: 'UDP', service: 'DNS' },
    67: { protocol: 'UDP', service: 'DHCP Server' },
    68: { protocol: 'UDP', service: 'DHCP Client' },
    69: { protocol: 'UDP', service: 'TFTP' },
    80: { protocol: 'TCP', service: 'HTTP' },
    110: { protocol: 'TCP', service: 'POP3' },
    143: { protocol: 'TCP', service: 'IMAP' },
    443: { protocol: 'TCP', service: 'HTTPS' },
    445: { protocol: 'TCP', service: 'SMB' },
    3389: { protocol: 'TCP', service: 'RDP' },
    8080: { protocol: 'TCP', service: 'HTTP Alternate' },
  };

  const knownPort = wellKnownPorts[port];

  // Type guard to validate NetworkProtocol
  const isValidProtocol = (value: string | undefined): value is NetworkProtocol => {
    const validProtocols: NetworkProtocol[] = [
      'TCP',
      'UDP',
      'ICMP',
      'HTTP',
      'HTTPS',
      'FTP',
      'SMTP',
      'DNS',
      'DHCP',
      'SSH',
      'SNMP',
    ];
    return value !== undefined && validProtocols.includes(value as NetworkProtocol);
  };

  let protocol: NetworkProtocol;
  if (isValidProtocol(knownPort?.protocol)) {
    protocol = knownPort.protocol;
  } else {
    protocol = 'TCP' as const;
  }

  const service: string = knownPort?.service ?? 'Unknown';

  return {
    number: port,
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    protocol, // Type-safe via type guard above
    service,
    isWellKnown: port >= 0 && port <= 1023,
    isRegistered: port >= 1024 && port <= 49151,
    isDynamic: port >= 49152 && port <= 65535,
  } satisfies PortInfo;
}

// ============================================================================
// Binary Conversion Utilities
// ============================================================================

/**
 * Convert decimal to binary (8-bit)
 *
 * @param decimal - Decimal number (0-255)
 * @returns 8-bit binary string
 */
export function decimalToBinary(decimal: number): string {
  if (decimal < 0 || decimal > 255) {
    throw new NetworkCalculationError('Decimal must be between 0 and 255', { decimal });
  }
  return decimal.toString(2).padStart(8, '0');
}

/**
 * Convert binary to decimal
 *
 * @param binary - Binary string
 * @returns Decimal number
 */
export function binaryToDecimal(binary: string): number {
  const decimal = parseInt(binary, 2);
  if (isNaN(decimal)) {
    throw new NetworkCalculationError('Invalid binary string', { binary });
  }
  return decimal;
}

/**
 * Convert IP address to binary notation
 *
 * @param ip - IP address string
 * @returns Binary representation (dotted)
 */
export function ipToBinary(ip: string): string {
  const octets = ip.split('.').map(Number);
  return octets.map((o) => decimalToBinary(o)).join('.');
}

/**
 * Convert binary notation to IP address
 *
 * @param binary - Binary string (dotted or continuous)
 * @returns IP address string
 */
export function binaryToIp(binary: string): string {
  // Remove dots if present
  const cleaned = binary.replace(/\./g, '');

  if (cleaned.length !== 32) {
    throw new NetworkCalculationError('Binary string must be 32 bits', { binary });
  }

  const octets = [];
  for (let i = 0; i < 32; i += 8) {
    octets.push(binaryToDecimal(cleaned.substr(i, 8)));
  }

  return octets.join('.');
}

// ============================================================================
// Advanced Network Calculations
// ============================================================================

/**
 * Calculate supernet from multiple networks
 *
 * @param networks - Array of network CIDRs
 * @returns Supernet CIDR that encompasses all networks
 *
 * @example
 * ```typescript
 * const supernet = calculateSupernet([
 *   '192.168.0.0/24',
 *   '192.168.1.0/24',
 *   '192.168.2.0/24',
 *   '192.168.3.0/24'
 * ]);
 * console.log(supernet); // "192.168.0.0/22"
 * ```
 */
export function calculateSupernet(networks: string[]): string {
  if (networks.length === 0) {
    throw new NetworkCalculationError('At least one network required');
  }

  const ips = networks.map((n) => ipToInt(n.split('/')[0]));
  const minIp = Math.min(...ips);
  const maxIp = Math.max(...ips);

  // Find common prefix length
  let prefix = 32;
  for (let i = 31; i >= 0; i--) {
    const mask = ~((1 << (32 - i)) - 1);
    if ((minIp & mask) === (maxIp & mask)) {
      prefix = i;
      break;
    }
  }

  const network = minIp & ~((1 << (32 - prefix)) - 1);
  return `${intToIp(network)}/${prefix}`;
}

/**
 * Split network into smaller subnets
 *
 * @param network - Network CIDR to split
 * @param newPrefix - New prefix length (must be larger)
 * @returns Array of subnet CIDRs
 *
 * @example
 * ```typescript
 * const subnets = splitNetwork('192.168.1.0/24', 26);
 * // Returns: ['192.168.1.0/26', '192.168.1.64/26', '192.168.1.128/26', '192.168.1.192/26']
 * ```
 */
export function splitNetwork(network: string, newPrefix: number): string[] {
  const [ipStr, oldPrefixStr] = network.split('/');
  const oldPrefix = parseInt(oldPrefixStr, 10);

  if (newPrefix <= oldPrefix) {
    throw new NetworkCalculationError('New prefix must be larger than current prefix', {
      oldPrefix,
      newPrefix,
    });
  }

  const subnetCount = calculateSubnetCount(oldPrefix, newPrefix);
  const subnetSize = Math.pow(2, 32 - newPrefix);
  let currentIp = ipToInt(ipStr);

  const subnets: string[] = [];
  for (let i = 0; i < subnetCount; i++) {
    subnets.push(`${intToIp(currentIp)}/${newPrefix}`);
    currentIp += subnetSize;
  }

  return subnets;
}

// ============================================================================
// Exports
// ============================================================================

export default {
  parseIPAddress,
  ipToInt,
  intToIp,
  calculateSubnet,
  subnetMaskToCIDR,
  cidrToSubnetMask,
  isIPInSubnet,
  calculateVLSM,
  calculateSubnetCount,
  getPortInfo,
  decimalToBinary,
  binaryToDecimal,
  ipToBinary,
  binaryToIp,
  calculateSupernet,
  splitNetwork,
};
