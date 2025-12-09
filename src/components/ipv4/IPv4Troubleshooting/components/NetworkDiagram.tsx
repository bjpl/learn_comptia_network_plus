/**
 * Network diagram visualization component
 */

import React from 'react';
import { Card, CardContent, Typography, Paper, Grid, Box } from '@mui/material';
import { Computer, Storage, Router, NetworkCheck } from '@mui/icons-material';
import type { Device } from '../../ipv4-types';
import type { DeviceType } from '../types';

interface NetworkDiagramProps {
  devices: Device[];
}

const getDeviceIcon = (type: DeviceType) => {
  switch (type) {
    case 'host':
      return <Computer />;
    case 'server':
      return <Storage />;
    case 'router':
      return <Router />;
    case 'switch':
      return <NetworkCheck />;
    default:
      return <Computer />;
  }
};

export const NetworkDiagram: React.FC<NetworkDiagramProps> = ({ devices }) => {
  return (
    <Card sx={{ mb: 3 }}>
      <CardContent>
        <Typography variant="h6" gutterBottom>
          Network Diagram
        </Typography>
        <Paper
          variant="outlined"
          sx={{
            p: 3,
            minHeight: 200,
            bgcolor: 'grey.50',
            position: 'relative',
            overflow: 'auto',
          }}
        >
          <Grid container spacing={3} justifyContent="center" alignItems="center">
            {devices.map((device) => (
              <Grid item key={device.id}>
                <Paper
                  elevation={3}
                  sx={{
                    p: 2,
                    textAlign: 'center',
                    minWidth: 120,
                    bgcolor:
                      device.status === 'error'
                        ? 'error.light'
                        : device.status === 'offline'
                          ? 'grey.300'
                          : 'success.light',
                    color:
                      device.status === 'error'
                        ? 'error.contrastText'
                        : device.status === 'offline'
                          ? 'text.secondary'
                          : 'success.contrastText',
                  }}
                >
                  <Box sx={{ display: 'flex', justifyContent: 'center', mb: 1 }}>
                    {getDeviceIcon(device.type as DeviceType)}
                  </Box>
                  <Typography variant="subtitle2" fontWeight="bold">
                    {device.name}
                  </Typography>
                  <Typography variant="caption" display="block">
                    {device.ipAddress}
                  </Typography>
                  {device.subnetMask && (
                    <Typography variant="caption" display="block">
                      /{device.subnetMask}
                    </Typography>
                  )}
                  {device.gateway && (
                    <Typography variant="caption" display="block">
                      GW: {device.gateway}
                    </Typography>
                  )}
                </Paper>
              </Grid>
            ))}
          </Grid>
        </Paper>
      </CardContent>
    </Card>
  );
};
