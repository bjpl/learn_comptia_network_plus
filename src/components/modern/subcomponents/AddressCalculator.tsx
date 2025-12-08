/**
 * AddressCalculator Component
 * IPv6 subnetting calculator with visual feedback
 */

import React, { memo } from 'react';
import type { SubnettingResult } from '../utils/ipv6Calculations';

interface AddressCalculatorProps {
  input: string;
  result: SubnettingResult | null;
  onInputChange: (value: string) => void;
  onCalculate: () => void;
}

const AddressCalculator: React.FC<AddressCalculatorProps> = memo(({
  input,
  result,
  onInputChange,
  onCalculate,
}) => {
  return (
    <div className="space-y-6">
      <div className="rounded-lg border-2 border-green-300 bg-green-50 p-6">
        <h3 className="mb-4 text-xl font-bold text-gray-900 dark:text-gray-100">
          IPv6 Subnetting Calculator
        </h3>
        <div className="mb-6 flex gap-4">
          <input
            type="text"
            value={input}
            onChange={(e) => onInputChange(e.target.value)}
            placeholder="e.g., 2001:db8::/32"
            className="flex-1 rounded-lg border-2 border-gray-300 px-4 py-2 font-mono text-sm focus:border-green-500 focus:outline-none"
            aria-label="IPv6 address and prefix length"
          />
          <button
            onClick={onCalculate}
            className="rounded-lg bg-green-600 px-6 py-2 font-semibold text-white transition-colors hover:bg-green-700"
            aria-label="Calculate IPv6 subnetting information"
          >
            Calculate
          </button>
        </div>

        {result && (
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
            <ResultCard label="Network Address" value={result.network} />
            <ResultCard label="Prefix Length" value={result.prefix} />
            <ResultCard label="Host Bits" value={result.hostBits.toString()} />
            <ResultCard
              label="Total Hosts"
              value={`2^${result.hostBits} - 1`}
            />
            <ResultCard label="First Address" value={result.firstHost} />
            <ResultCard label="Last Address" value={result.lastHost} />
          </div>
        )}
      </div>
    </div>
  );
});

AddressCalculator.displayName = 'AddressCalculator';

interface ResultCardProps {
  label: string;
  value: string;
}

const ResultCard: React.FC<ResultCardProps> = memo(({ label, value }) => (
  <div className="rounded-lg bg-white p-4 dark:bg-gray-800">
    <div className="text-xs text-gray-600 dark:text-gray-400">{label}</div>
    <div className="font-mono text-sm font-semibold text-gray-800 dark:text-gray-100">
      {value}
    </div>
  </div>
));

ResultCard.displayName = 'ResultCard';

export default AddressCalculator;
