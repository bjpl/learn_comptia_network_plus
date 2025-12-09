/**
 * Diagnostic output dialog component
 */

import React from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Paper,
  Typography,
  Box,
} from '@mui/material';
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
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <Terminal sx={{ mr: 1 }} />
          {diagnostic?.command}
        </Box>
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
