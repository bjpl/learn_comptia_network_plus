/**
 * Hints display component
 */

import React from 'react';
import { Alert, Typography } from '@mui/material';

interface HintsDisplayProps {
  hints: string[];
  show: boolean;
}

export const HintsDisplay: React.FC<HintsDisplayProps> = ({ hints, show }) => {
  if (!show) return null;

  return (
    <Alert severity="info" sx={{ mb: 3 }}>
      <Typography variant="subtitle2" gutterBottom>
        Troubleshooting Hints:
      </Typography>
      <ul style={{ margin: 0, paddingLeft: 20 }}>
        {hints.map((hint, index) => (
          <li key={index}>{hint}</li>
        ))}
      </ul>
    </Alert>
  );
};
