/**
 * Routing Table Tab content
 */
import React from 'react';
import { CardContent, Box, Button, Typography, Alert } from '@mui/material';
import { NetworkCheck } from '@mui/icons-material';
import { RoutingTableComponent } from './RoutingTableComponent';
import type { RoutingTableEntry } from '../types';

interface RoutingTableTabProps {
  showRoutingTable: boolean;
  onToggleTable: () => void;
  routingTable: RoutingTableEntry[];
}

export const RoutingTableTab: React.FC<RoutingTableTabProps> = ({
  showRoutingTable,
  onToggleTable,
  routingTable,
}) => (
  <CardContent>
    <Box sx={{ mb: 2 }}>
      <Typography variant="h6" gutterBottom className="text-gray-900 dark:text-white">
        Routing Table Analysis
      </Typography>
      <Typography variant="body2" className="text-gray-700 dark:text-gray-300" paragraph>
        Review the current routing table for the host or network. Incorrect routing tables can
        cause connectivity issues.
      </Typography>
    </Box>
    <Box sx={{ mb: 2 }}>
      <Button
        variant="contained"
        onClick={onToggleTable}
        startIcon={<NetworkCheck />}
      >
        {showRoutingTable ? 'Hide' : 'Show'} Routing Table
      </Button>
    </Box>
    {showRoutingTable && <RoutingTableComponent routingTable={routingTable} />}
    <Alert severity="info" sx={{ mt: 2 }}>
      <Typography variant="body2">
        <strong>Tips:</strong> The default route (0.0.0.0/0) should point to your gateway. All
        other routes should have valid gateways on the same network as the interface.
      </Typography>
    </Alert>
  </CardContent>
);
