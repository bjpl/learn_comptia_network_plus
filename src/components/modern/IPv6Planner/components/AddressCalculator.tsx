/**
 * IPv6 Address Calculator Component
 * Provides IPv6 subnetting calculator interface
 */

import React from 'react';
import SubnetVisualizer from './SubnetVisualizer';
import type { SubnettingResult } from '../types';
import { calculateIPv6Subnetting } from '../utils/ipv6Calculations';

interface AddressCalculatorProps {
  subnettingInput: string;
  setSubnettingInput: (input: string) => void;
  subnettingResult: SubnettingResult | null;
  setSubnettingResult: (result: SubnettingResult | null) => void;
}

const AddressCalculator: React.FC<AddressCalculatorProps> = ({
  subnettingInput,
  setSubnettingInput,
  subnettingResult,
  setSubnettingResult,
}) => {
  const handleCalculate = () => {
    const result = calculateIPv6Subnetting(subnettingInput);
    if (!result) {
      alert('Invalid prefix. Use 0-128 for IPv6.');
      return;
    }
    setSubnettingResult(result);
  };

  return (
    <div className="space-y-6">
      <div className="rounded-lg border-2 border-green-300 bg-green-50 p-6">
        <h3 className="mb-4 text-xl font-bold text-gray-900 dark:text-gray-100">
          IPv6 Subnetting Calculator
        </h3>
        <div className="mb-6 flex gap-4">
          <input
            type="text"
            value={subnettingInput}
            onChange={(e) => setSubnettingInput(e.target.value)}
            placeholder="e.g., 2001:db8::/32"
            className="flex-1 rounded-lg border-2 border-gray-300 px-4 py-2 font-mono text-sm focus:border-green-500 focus:outline-none"
            aria-label="IPv6 address and prefix length"
          />
          <button
            onClick={handleCalculate}
            className="rounded-lg bg-green-600 px-6 py-2 font-semibold text-white transition-colors hover:bg-green-700"
            aria-label="Calculate IPv6 subnetting information"
          >
            Calculate
          </button>
        </div>

        <SubnetVisualizer result={subnettingResult} />
      </div>
    </div>
  );
};

export default AddressCalculator;
