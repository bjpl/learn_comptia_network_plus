/**
 * Subnet cheat sheet reference data
 */

import type { SubnetCheatData } from '../types';

export const subnetCheatData: SubnetCheatData[] = [
  { cidr: '/30', mask: '255.255.255.252', hosts: 2, common: 'Point-to-point links' },
  { cidr: '/25', mask: '255.255.255.128', hosts: 126, common: 'Small subnets' },
  { cidr: '/24', mask: '255.255.255.0', hosts: 254, common: 'Class C default' },
  { cidr: '/23', mask: '255.255.254.0', hosts: 510, common: 'Medium subnets' },
  { cidr: '/22', mask: '255.255.252.0', hosts: 1022, common: 'Large subnets' },
  { cidr: '/21', mask: '255.255.248.0', hosts: 2046, common: 'Very large' },
  { cidr: '/20', mask: '255.255.240.0', hosts: 4094, common: 'Enterprise' },
  { cidr: '/16', mask: '255.255.0.0', hosts: 65534, common: 'Class B default' },
];
