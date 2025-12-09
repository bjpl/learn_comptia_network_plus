/**
 * Action buttons component
 */

import React from 'react';
import { Box, Button } from '@mui/material';
import { Lightbulb, Refresh } from '@mui/icons-material';

interface ActionButtonsProps {
  showHints: boolean;
  showSolution: boolean;
  onToggleHints: () => void;
  onToggleSolution: () => void;
  onReset: () => void;
}

export const ActionButtons: React.FC<ActionButtonsProps> = ({
  showHints,
  showSolution,
  onToggleHints,
  onToggleSolution,
  onReset,
}) => {
  return (
    <Box sx={{ mb: 3, display: 'flex', gap: 2, flexWrap: 'wrap' }}>
      <Button variant="outlined" startIcon={<Lightbulb />} onClick={onToggleHints}>
        {showHints ? 'Hide' : 'Show'} Hints
      </Button>
      <Button variant="outlined" onClick={onToggleSolution}>
        {showSolution ? 'Hide' : 'Show'} Solution
      </Button>
      <Button variant="outlined" startIcon={<Refresh />} onClick={onReset}>
        Reset
      </Button>
    </Box>
  );
};
