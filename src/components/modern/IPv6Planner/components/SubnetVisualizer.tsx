/**
 * IPv6 Subnet Visualizer Component
 * Displays subnetting calculation results in a visual format
 */

import React from 'react';
import type { SubnettingResult } from '../types';

interface SubnetVisualizerProps {
  result: SubnettingResult | null;
}

const SubnetVisualizer: React.FC<SubnetVisualizerProps> = ({ result }) => {
  if (!result) {
    return null;
  }

  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
      <div className="rounded-lg bg-white p-4 dark:bg-gray-800">
        <div className="text-xs text-gray-600 dark:text-gray-400">Network Address</div>
        <div className="font-mono text-sm font-semibold text-gray-800 dark:text-gray-100">
          {result.network}
        </div>
      </div>
      <div className="rounded-lg bg-white p-4 dark:bg-gray-800">
        <div className="text-xs text-gray-600 dark:text-gray-400">Prefix Length</div>
        <div className="font-mono text-sm font-semibold text-gray-800 dark:text-gray-100">
          {result.prefix}
        </div>
      </div>
      <div className="rounded-lg bg-white p-4 dark:bg-gray-800">
        <div className="text-xs text-gray-600 dark:text-gray-400">Host Bits</div>
        <div className="font-mono text-sm font-semibold text-gray-800 dark:text-gray-100">
          {result.hostBits}
        </div>
      </div>
      <div className="rounded-lg bg-white p-4 dark:bg-gray-800">
        <div className="text-xs text-gray-600 dark:text-gray-400">Total Hosts</div>
        <div className="font-mono text-sm font-semibold text-gray-800 dark:text-gray-100">
          2^{result.hostBits} - 1
        </div>
      </div>
      <div className="rounded-lg bg-white p-4 dark:bg-gray-800">
        <div className="text-xs text-gray-600 dark:text-gray-400">First Address</div>
        <div className="font-mono text-sm font-semibold text-gray-800 dark:text-gray-100">
          {result.firstHost}
        </div>
      </div>
      <div className="rounded-lg bg-white p-4 dark:bg-gray-800">
        <div className="text-xs text-gray-600 dark:text-gray-400">Last Address</div>
        <div className="font-mono text-sm font-semibold text-gray-800 dark:text-gray-100">
          {result.lastHost}
        </div>
      </div>
    </div>
  );
};

export default SubnetVisualizer;
