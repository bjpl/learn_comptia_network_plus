/**
 * Progress and score display component
 */

import React from 'react';
import { Grid, Paper, Typography, LinearProgress } from '@mui/material';
import { getTimeElapsed } from '../utils';

interface ProgressDisplayProps {
  score: number;
  completedSteps: number;
  totalSteps: number;
  startTime: number | null;
}

export const ProgressDisplay: React.FC<ProgressDisplayProps> = ({
  score,
  completedSteps,
  totalSteps,
  startTime,
}) => {
  return (
    <Grid container spacing={2} sx={{ mb: 3 }}>
      <Grid item xs={12} sm={4}>
        <Paper sx={{ p: 2 }}>
          <Typography variant="caption" className="text-gray-700 dark:text-gray-300">
            Score
          </Typography>
          <Typography variant="h3" color="primary">
            {score}
          </Typography>
          <LinearProgress variant="determinate" value={score} sx={{ mt: 1 }} />
        </Paper>
      </Grid>
      <Grid item xs={12} sm={4}>
        <Paper sx={{ p: 2 }}>
          <Typography variant="caption" className="text-gray-700 dark:text-gray-300">
            Progress
          </Typography>
          <Typography variant="h3" color="success.main">
            {completedSteps}/{totalSteps}
          </Typography>
          <LinearProgress
            variant="determinate"
            value={(completedSteps / (totalSteps || 1)) * 100}
            color="success"
            sx={{ mt: 1 }}
          />
        </Paper>
      </Grid>
      <Grid item xs={12} sm={4}>
        <Paper sx={{ p: 2 }}>
          <Typography variant="caption" className="text-gray-700 dark:text-gray-300">
            Time Elapsed
          </Typography>
          <Typography variant="h3" color="warning.main">
            {getTimeElapsed(startTime)}
          </Typography>
        </Paper>
      </Grid>
    </Grid>
  );
};
