/**
 * IP Configuration Validator Tab content
 */
import React from 'react';
import {
  CardContent,
  Box,
  Grid,
  TextField,
  Typography,
  Alert,
} from '@mui/material';
import type { ValidationResult } from '../types';

interface ValidatorTabProps {
  validatorIP: string;
  validatorMask: string;
  validatorGateway: string;
  onIPChange: (value: string) => void;
  onMaskChange: (value: string) => void;
  onGatewayChange: (value: string) => void;
  validationResults: ValidationResult[];
}

export const ValidatorTab: React.FC<ValidatorTabProps> = ({
  validatorIP,
  validatorMask,
  validatorGateway,
  onIPChange,
  onMaskChange,
  onGatewayChange,
  validationResults,
}) => (
  <CardContent>
    <Box sx={{ mb: 2 }}>
      <Typography variant="h6" gutterBottom className="text-gray-900 dark:text-white">
        IP Configuration Validator
      </Typography>
      <Typography variant="body2" className="text-gray-700 dark:text-gray-300" paragraph>
        Validate your IP configuration against common issues and best practices
      </Typography>
    </Box>
    <Grid container spacing={2}>
      <Grid item xs={12} md={6}>
        <TextField
          fullWidth
          label="IP Address"
          value={validatorIP}
          onChange={(e) => onIPChange(e.target.value)}
          placeholder="192.168.1.100"
        />
      </Grid>
      <Grid item xs={12} md={6}>
        <TextField
          fullWidth
          label="Subnet Mask"
          value={validatorMask}
          onChange={(e) => onMaskChange(e.target.value)}
          placeholder="255.255.255.0"
        />
      </Grid>
      <Grid item xs={12} md={6}>
        <TextField
          fullWidth
          label="Default Gateway"
          value={validatorGateway}
          onChange={(e) => onGatewayChange(e.target.value)}
          placeholder="192.168.1.1"
        />
      </Grid>
    </Grid>

    <Box sx={{ mt: 3 }}>
      <Typography variant="subtitle2" sx={{ mb: 2 }}>
        Validation Results:
      </Typography>
      {validationResults.map((result, index) => (
        <Alert
          key={index}
          severity={
            result.status === 'valid'
              ? 'success'
              : result.status === 'warning'
                ? 'warning'
                : 'error'
          }
          sx={{ mb: 1 }}
        >
          <Typography variant="body2">
            <strong>{result.field}:</strong> {result.message}
          </Typography>
        </Alert>
      ))}
    </Box>
  </CardContent>
);
