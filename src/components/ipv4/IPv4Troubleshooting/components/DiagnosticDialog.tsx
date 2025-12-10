/**
 * Diagnostic output dialog component
 */

import React from 'react';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import Button from '@mui/material/Button';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
import { Terminal } from '@mui/icons-material';
import type { DiagnosticOutput } from '../../ipv4-types';

interface DiagnosticDialogProps {
  open: boolean;
  diagnostic: DiagnosticOutput | null;
  onClose: () => void;
}

export const DiagnosticDialog: React.FC<DiagnosticDialogProps> = ({
  open,
  diagnostic,
  onClose,
}) => {
  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <Terminal sx={{ mr: 1 }} />
          {diagnostic?.command}
        </div>
      </DialogTitle>
      <DialogContent>
        <Paper
          variant="outlined"
          sx={{
            p: 2,
            bgcolor: 'grey.900',
            color: 'grey.100',
            fontFamily: 'monospace',
            fontSize: '0.875rem',
            whiteSpace: 'pre-wrap',
            overflowX: 'auto',
          }}
        >
          {diagnostic?.output}
        </Paper>
        {diagnostic?.timestamp && (
          <Typography
            variant="caption"
            className="text-gray-700 dark:text-gray-300"
            sx={{ mt: 1, display: 'block' }}
          >
            Timestamp: {new Date(diagnostic.timestamp).toLocaleString()}
          </Typography>
        )}
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Close</Button>
      </DialogActions>
    </Dialog>
  );
};
