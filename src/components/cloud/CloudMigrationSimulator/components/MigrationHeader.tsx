import React from 'react';
import { Box, Typography } from '@mui/material';
import { Cloud as CloudIcon } from '@mui/icons-material';

export const MigrationHeader: React.FC = () => (
  <Box className="migration-header" mb={3}>
    <Typography variant="h4" gutterBottom>
      <CloudIcon sx={{ verticalAlign: 'middle', mr: 1, fontSize: 40 }} />
      Cloud Migration Simulator
    </Typography>
    <Typography variant="body1" color="text.secondary">
      Plan and simulate cloud migration with the 6 R&apos;s framework: Rehost, Replatform,
      Refactor, Repurchase, Retire, Retain
    </Typography>
  </Box>
);
