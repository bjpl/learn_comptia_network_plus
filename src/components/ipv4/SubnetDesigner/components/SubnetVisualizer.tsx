/**
 * Subnet visualization component showing host allocation efficiency
 */

import React from 'react';
import Typography from '@mui/material/Typography';
import LinearProgress from '@mui/material/LinearProgress';
import type { SubnetAllocation } from '../../ipv4-types';

interface SubnetVisualizerProps {
  allocation: SubnetAllocation;
}

export const SubnetVisualizer: React.FC<SubnetVisualizerProps> = ({ allocation }) => {
  const hostPercentage = (allocation.hostsNeeded / allocation.usableHosts) * 100;

  return (
    <div style={{ marginBottom: '16px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
        <Typography variant="caption" fontWeight="bold">
          {allocation.name}
        </Typography>
        <Typography variant="caption">
          {allocation.hostsNeeded} / {allocation.usableHosts}
        </Typography>
      </div>
      <LinearProgress variant="determinate" value={hostPercentage} sx={{ mb: 0.5 }} />
      <Typography variant="caption" className="text-gray-700 dark:text-gray-300">
        Range: {allocation.firstHost} - {allocation.lastHost}
      </Typography>
    </div>
  );
};
