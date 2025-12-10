import React from 'react';
import Typography from '@mui/material/Typography';
import { Cloud as CloudIcon } from '@mui/icons-material';

export const MigrationHeader: React.FC = () => (
  <div className="migration-header" style={{ marginBottom: '24px' }}>
    <Typography variant="h4" gutterBottom>
      <CloudIcon sx={{ verticalAlign: 'middle', mr: 1, fontSize: 40 }} />
      Cloud Migration Simulator
    </Typography>
    <Typography variant="body1" color="text.secondary">
      Plan and simulate cloud migration with the 6 R&apos;s framework: Rehost, Replatform, Refactor,
      Repurchase, Retire, Retain
    </Typography>
  </div>
);
