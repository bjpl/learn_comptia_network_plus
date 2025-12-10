/**
 * Network topology diagram component
 */
import React from 'react';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
import Grid from '@mui/material/Grid';
import Chip from '@mui/material/Chip';
import Divider from '@mui/material/Divider';
import type { TroubleshootingScenario } from '../../ipv4-types';
import { getDeviceIcon, getStatusColor } from '../utils/iconHelpers';
import { classifyIPAddress } from '../utils/ipHelpers';

interface NetworkDiagramProps {
  scenario: TroubleshootingScenario;
}

export const NetworkDiagram: React.FC<NetworkDiagramProps> = ({ scenario }) => {
  const DeviceIcon = (type: string) => {
    const Icon = getDeviceIcon(type);
    return <Icon />;
  };

  return (
    <Paper
      variant="outlined"
      sx={{ p: 3, minHeight: 300, position: 'relative', bgcolor: '#f5f5f5' }}
    >
      <Typography variant="subtitle2" gutterBottom>
        Network Topology
      </Typography>
      <Grid container spacing={2}>
        {scenario.devices.map((device) => (
          <Grid item xs={12} sm={6} md={4} key={device.id}>
            <Paper
              elevation={2}
              sx={{
                p: 2,
                borderLeft: 4,
                borderColor: `${getStatusColor(device.status)}.main`,
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', marginBottom: '8px' }}>
                {DeviceIcon(device.type)}
                <Typography variant="subtitle2" sx={{ ml: 1 }}>
                  {device.name}
                </Typography>
                <Chip
                  label={device.status}
                  size="small"
                  color={getStatusColor(device.status) as 'success' | 'error' | 'default'}
                  sx={{ ml: 'auto' }}
                />
              </div>
              <Divider sx={{ my: 1 }} />
              <Typography
                variant="caption"
                display="block"
                className="text-gray-800 dark:text-gray-200"
              >
                <strong>IP:</strong> <code>{device.ipAddress}</code>
              </Typography>
              <Typography
                variant="caption"
                display="block"
                className="text-gray-800 dark:text-gray-200"
              >
                <strong>Mask:</strong> <code>{device.subnetMask}</code>
              </Typography>
              {device.gateway && (
                <Typography
                  variant="caption"
                  display="block"
                  className="text-gray-800 dark:text-gray-200"
                >
                  <strong>Gateway:</strong> <code>{device.gateway}</code>
                </Typography>
              )}
              <Typography
                variant="caption"
                display="block"
                sx={{ mt: 1 }}
                className="text-gray-800 dark:text-gray-200"
              >
                <strong>Type:</strong> {classifyIPAddress(device.ipAddress)}
              </Typography>
            </Paper>
          </Grid>
        ))}
      </Grid>

      {/* Connection indicators */}
      {scenario.connections.length > 0 && (
        <div style={{ marginTop: '16px' }}>
          <Typography variant="caption" className="text-gray-700 dark:text-gray-300">
            Connections:
          </Typography>
          {scenario.connections.map((conn, index) => (
            <Chip
              key={index}
              label={`${conn.from} ↔ ${conn.to} (${conn.status})`}
              size="small"
              color={
                (conn.status === 'ok'
                  ? 'success'
                  : conn.status === 'degraded'
                    ? 'warning'
                    : 'error') as 'success' | 'warning' | 'error'
              }
              sx={{ m: 0.5 }}
            />
          ))}
        </div>
      )}
    </Paper>
  );
};
