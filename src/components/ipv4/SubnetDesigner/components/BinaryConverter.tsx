/**
 * Binary converter tool component
 */

import React from 'react';
import { Card, CardContent, Typography, Grid, TextField, Paper } from '@mui/material';
import type { BinaryConverterState } from '../types';
import { ipToBinary, maskToCidr } from '../utils/ipHelpers';

interface BinaryConverterProps {
  binaryConverter: BinaryConverterState;
  setBinaryConverter: React.Dispatch<React.SetStateAction<BinaryConverterState>>;
}

export const BinaryConverter: React.FC<BinaryConverterProps> = ({
  binaryConverter,
  setBinaryConverter,
}) => {
  const ipBinary = ipToBinary(binaryConverter.ipInput);
  const maskBinary = ipToBinary(binaryConverter.maskInput);
  const cidr = maskToCidr(binaryConverter.maskInput);

  return (
    <Card sx={{ mb: 3 }}>
      <CardContent>
        <Typography variant="h6" gutterBottom>
          Binary Converter
        </Typography>
        <Grid container spacing={2}>
          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              label="IP Address"
              value={binaryConverter.ipInput}
              onChange={(e) =>
                setBinaryConverter({ ...binaryConverter, ipInput: e.target.value })
              }
              size="small"
              variant="outlined"
            />
            <Paper variant="outlined" sx={{ p: 2, mt: 2, bgcolor: '#f5f5f5' }}>
              <Typography variant="caption" className="text-gray-700 dark:text-gray-300">
                Binary:
              </Typography>
              <Typography
                variant="body2"
                sx={{ fontFamily: 'monospace', wordBreak: 'break-all', mt: 1 }}
              >
                {ipBinary}
              </Typography>
            </Paper>
          </Grid>
          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              label="Subnet Mask"
              value={binaryConverter.maskInput}
              onChange={(e) =>
                setBinaryConverter({ ...binaryConverter, maskInput: e.target.value })
              }
              size="small"
              variant="outlined"
            />
            <Paper variant="outlined" sx={{ p: 2, mt: 2, bgcolor: '#f5f5f5' }}>
              <Typography variant="caption" className="text-gray-700 dark:text-gray-300">
                CIDR: /{cidr}
              </Typography>
              <Typography
                variant="body2"
                sx={{ fontFamily: 'monospace', wordBreak: 'break-all', mt: 1 }}
              >
                {maskBinary}
              </Typography>
            </Paper>
          </Grid>
        </Grid>
      </CardContent>
    </Card>
  );
};
