/**
 * Diagnostic outputs display component
 */

import React from 'react';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import Grid from '@mui/material/Grid';
import Paper from '@mui/material/Paper';
import { Terminal } from '@mui/icons-material';
import type { DiagnosticOutput } from '../../ipv4-types';

interface DiagnosticOutputsProps {
  diagnostics: DiagnosticOutput[];
  onShowDiagnostic: (diagnostic: DiagnosticOutput) => void;
}

export const DiagnosticOutputs: React.FC<DiagnosticOutputsProps> = ({
  diagnostics,
  onShowDiagnostic,
}) => {
  return (
    <Card sx={{ mb: 3 }}>
      <CardContent>
        <Typography variant="h6" gutterBottom>
          Diagnostic Command Outputs
        </Typography>
        <Grid container spacing={2}>
          {diagnostics.map((diagnostic, index) => (
            <Grid item xs={12} md={6} key={index}>
              <Paper
                variant="outlined"
                sx={{ p: 2, cursor: 'pointer', '&:hover': { bgcolor: 'action.hover' } }}
                onClick={() => onShowDiagnostic(diagnostic)}
              >
                <div style={{ display: 'flex', alignItems: 'center', marginBottom: '8px' }}>
                  <Terminal sx={{ mr: 1 }} color="primary" />
                  <Typography variant="subtitle2" fontWeight="bold">
                    {diagnostic.command}
                  </Typography>
                </div>
                <Typography variant="caption" className="text-gray-700 dark:text-gray-300">
                  Click to view output
                </Typography>
              </Paper>
            </Grid>
          ))}
        </Grid>
      </CardContent>
    </Card>
  );
};
