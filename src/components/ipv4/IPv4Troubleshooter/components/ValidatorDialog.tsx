/**
 * IP Configuration Validator Dialog
 */
import React from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Grid,
  TextField,
  Typography,
  Alert,
} from '@mui/material';
import type { ValidationResult } from '../types';

interface ValidatorDialogProps {
  open: boolean;
  onClose: () => void;
  validatorIP: string;
  validatorMask: string;
  validatorGateway: string;
  onIPChange: (value: string) => void;
  onMaskChange: (value: string) => void;
  onGatewayChange: (value: string) => void;
  validationResults: ValidationResult[];
}

export const ValidatorDialog: React.FC<ValidatorDialogProps> = ({
  open,
  onClose,
  validatorIP,
  validatorMask,
  validatorGateway,
  onIPChange,
  onMaskChange,
  onGatewayChange,
  validationResults,
}) => (
  <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
    <DialogTitle>IP Configuration Validator</DialogTitle>
    <DialogContent sx={{ pt: 2 }}>
      <Grid container spacing={2} sx={{ mb: 3 }}>
        <Grid item xs={12}>
          <TextField
            fullWidth
            label="IP Address"
            value={validatorIP}
            onChange={(e) => onIPChange(e.target.value)}
            placeholder="192.168.1.100"
            size="small"
          />
        </Grid>
        <Grid item xs={12}>
          <TextField
            fullWidth
            label="Subnet Mask"
            value={validatorMask}
            onChange={(e) => onMaskChange(e.target.value)}
            placeholder="255.255.255.0"
            size="small"
          />
        </Grid>
        <Grid item xs={12}>
          <TextField
            fullWidth
            label="Default Gateway"
            value={validatorGateway}
            onChange={(e) => onGatewayChange(e.target.value)}
            placeholder="192.168.1.1"
            size="small"
          />
        </Grid>
      </Grid>

      <Typography variant="subtitle2" sx={{ mb: 1 }}>
        Validation Results:
      </Typography>
      {validationResults.map((result, index) => (
        <Alert
          key={index}
          severity={
            result.status === 'valid' ? 'success' : result.status === 'warning' ? 'warning' : 'error'
          }
          sx={{ mb: 1 }}
        >
          <Typography variant="body2">
            <strong>{result.field}:</strong> {result.message}
          </Typography>
        </Alert>
      ))}
    </DialogContent>
    <DialogActions>
      <Button onClick={onClose}>Close</Button>
    </DialogActions>
  </Dialog>
);
