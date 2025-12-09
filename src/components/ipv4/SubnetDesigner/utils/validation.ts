/**
 * Subnet design validation logic
 */

import type { SubnetAllocation, SubnetDesignResult } from '../../ipv4-types';
import { isIPInSubnet } from '../../../../utils/networking';

/**
 * Validate subnet design and return validation results
 */
export const validateDesign = (allocs: SubnetAllocation[]): SubnetDesignResult => {
  const errors: string[] = [];
  const warnings: string[] = [];

  // Check for overlaps
  let hasOverlaps = false;
  for (let i = 0; i < allocs.length; i++) {
    for (let j = i + 1; j < allocs.length; j++) {
      if (
        isIPInSubnet(allocs[i].network, `${allocs[j].network}/${allocs[j].cidr}`) ||
        isIPInSubnet(allocs[j].network, `${allocs[i].network}/${allocs[i].cidr}`)
      ) {
        hasOverlaps = true;
        errors.push(`Overlap detected between ${allocs[i].name} and ${allocs[j].name}`);
      }
    }
  }

  // Check efficiency
  allocs.forEach((alloc) => {
    if (alloc.efficiency < 50) {
      warnings.push(`${alloc.name} has low efficiency (${alloc.efficiency}%)`);
    }
    if (alloc.usableHosts < alloc.hostsNeeded) {
      errors.push(
        `${alloc.name} subnet too small (needs ${alloc.hostsNeeded}, has ${alloc.usableHosts})`
      );
    }
  });

  // Calculate overall efficiency
  const totalWasted = allocs.reduce((sum, a) => sum + a.wastedAddresses, 0);
  const totalEfficiency =
    allocs.length > 0 ? allocs.reduce((sum, a) => sum + a.efficiency, 0) / allocs.length : 0;

  return {
    allocations: allocs,
    totalEfficiency: Math.round(totalEfficiency * 100) / 100,
    totalWasted,
    hasOverlaps,
    errors,
    warnings,
  };
};
