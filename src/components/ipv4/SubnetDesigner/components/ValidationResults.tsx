/**
 * Design validation results component
 */

import React from 'react';
import {
  Card,
  CardContent,
  Typography,
  Grid,
  Paper,
  Alert,
} from '@mui/material';
import type { SubnetDesignResult } from '../../ipv4-types';

interface ValidationResultsProps {
  designResult: SubnetDesignResult;
}

export const ValidationResults: React.FC<ValidationResultsProps> = ({ designResult }) => {
  return (
    <Card>
      <CardContent>
        <Typography variant="h6" gutterBottom>
          Design Validation
        </Typography>

        {/* Summary Stats */}
        <Grid container spacing={2} sx={{ mb: 2 }}>
          <Grid item xs={12} sm={4}>
            <Paper variant="outlined" sx={{ p: 2, textAlign: 'center' }}>
              <Typography variant="caption" className="text-gray-700 dark:text-gray-300">
                Overall Efficiency
              </Typography>
              <Typography variant="h4" color="primary">
                {designResult.totalEfficiency}%
              </Typography>
            </Paper>
          </Grid>
          <Grid item xs={12} sm={4}>
            <Paper variant="outlined" sx={{ p: 2, textAlign: 'center' }}>
              <Typography variant="caption" className="text-gray-700 dark:text-gray-300">
                Total Wasted
              </Typography>
              <Typography variant="h4" color="warning.main">
                {designResult.totalWasted}
              </Typography>
            </Paper>
          </Grid>
          <Grid item xs={12} sm={4}>
            <Paper variant="outlined" sx={{ p: 2, textAlign: 'center' }}>
              <Typography variant="caption" className="text-gray-700 dark:text-gray-300">
                Overlaps
              </Typography>
              <Typography
                variant="h4"
                color={designResult.hasOverlaps ? 'error' : 'success.main'}
              >
                {designResult.hasOverlaps ? 'Yes' : 'No'}
              </Typography>
            </Paper>
          </Grid>
        </Grid>

        {/* Errors */}
        {designResult.errors.length > 0 && (
          <Alert severity="error" sx={{ mb: 2 }}>
            <Typography variant="subtitle2" gutterBottom>
              Errors:
            </Typography>
            <ul style={{ margin: 0, paddingLeft: 20 }}>
              {designResult.errors.map((error, index) => (
                <li key={index}>{error}</li>
              ))}
            </ul>
          </Alert>
        )}

        {/* Warnings */}
        {designResult.warnings.length > 0 && (
          <Alert severity="warning" sx={{ mb: 2 }}>
            <Typography variant="subtitle2" gutterBottom>
              Warnings:
            </Typography>
            <ul style={{ margin: 0, paddingLeft: 20 }}>
              {designResult.warnings.map((warning, index) => (
                <li key={index}>{warning}</li>
              ))}
            </ul>
          </Alert>
        )}

        {/* Success */}
        {designResult.errors.length === 0 && designResult.warnings.length === 0 && (
          <Alert severity="success">
            <Typography variant="subtitle2">
              Excellent! Your subnet design is valid and efficient.
            </Typography>
          </Alert>
        )}
      </CardContent>
    </Card>
  );
};
