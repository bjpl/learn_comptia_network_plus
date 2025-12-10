/**
 * Action buttons component
 */

import React from 'react';
import Button from '@mui/material/Button';
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
    <div style={{ marginBottom: '24px', display: 'flex', gap: '16px', flexWrap: 'wrap' }}>
      <Button variant="outlined" startIcon={<Lightbulb />} onClick={onToggleHints}>
        {showHints ? 'Hide' : 'Show'} Hints
      </Button>
      <Button variant="outlined" onClick={onToggleSolution}>
        {showSolution ? 'Hide' : 'Show'} Solution
      </Button>
      <Button variant="outlined" startIcon={<Refresh />} onClick={onReset}>
        Reset
      </Button>
    </div>
  );
};
