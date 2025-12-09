/**
 * Custom hook for subnet design state management
 */

import { useState, useEffect } from 'react';
import type { SubnetScenario, SubnetAllocation, SubnetDesignResult } from '../../ipv4-types';
import { calculateVLSM } from '../../../../utils/networking';
import { validateDesign } from '../utils/validation';

export const useSubnetDesign = (initialScenario: SubnetScenario) => {
  const [selectedScenario, setSelectedScenario] = useState<SubnetScenario>(initialScenario);
  const [allocations, setAllocations] = useState<SubnetAllocation[]>([]);
  const [showHints, setShowHints] = useState(false);
  const [showSolution, setShowSolution] = useState(false);
  const [designResult, setDesignResult] = useState<SubnetDesignResult | null>(null);

  // Reset state when scenario changes
  useEffect(() => {
    setAllocations([]);
    setDesignResult(null);
    setShowHints(false);
    setShowSolution(false);
  }, [selectedScenario]);

  // Calculate VLSM allocation
  const handleAutoAllocate = () => {
    try {
      const hostsNeeded = selectedScenario.requirements.map((req) => req.hostsNeeded);
      const vlsmResult = calculateVLSM(selectedScenario.baseNetwork, hostsNeeded);

      const newAllocations: SubnetAllocation[] = vlsmResult.subnets.map((subnet, index) => {
        const req = selectedScenario.requirements[index];
        const wastedAddresses = subnet.usableHosts - req.hostsNeeded;
        const efficiency = (req.hostsNeeded / subnet.usableHosts) * 100;

        return {
          ...subnet,
          id: req.id,
          name: req.name,
          hostsNeeded: req.hostsNeeded,
          efficiency: Math.round(efficiency * 100) / 100,
          wastedAddresses,
        };
      });

      setAllocations(newAllocations);
      const result = validateDesign(newAllocations);
      setDesignResult(result);
    } catch (error) {
      console.error('Auto-allocation failed:', error);
    }
  };

  // Reset design
  const handleReset = () => {
    setAllocations([]);
    setDesignResult(null);
    setShowHints(false);
    setShowSolution(false);
  };

  return {
    selectedScenario,
    setSelectedScenario,
    allocations,
    showHints,
    setShowHints,
    showSolution,
    setShowSolution,
    designResult,
    handleAutoAllocate,
    handleReset,
  };
};
