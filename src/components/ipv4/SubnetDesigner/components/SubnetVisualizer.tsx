/**
 * Subnet visualization component showing host allocation efficiency
 */

import React from 'react';
import { Box, Typography, LinearProgress } from '@mui/material';
import type { SubnetAllocation } from '../../ipv4-types';

interface SubnetVisualizerProps {
  allocation: SubnetAllocation;
}

export const SubnetVisualizer: React.FC<SubnetVisualizerProps> = ({ allocation }) => {
  const hostPercentage = (allocation.hostsNeeded / allocation.usableHosts) * 100;

  return (
    <Box sx={{ mb: 2 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
        <Typography variant="caption" fontWeight="bold">
          {allocation.name}
        </Typography>
        <Typography variant="caption">
          {allocation.hostsNeeded} / {allocation.usableHosts}
        </Typography>
      </Box>
      <LinearProgress variant="determinate" value={hostPercentage} sx={{ mb: 0.5 }} />
      <Typography variant="caption" className="text-gray-700 dark:text-gray-300">
        Range: {allocation.firstHost} - {allocation.lastHost}
      </Typography>
    </Box>
  );
};
