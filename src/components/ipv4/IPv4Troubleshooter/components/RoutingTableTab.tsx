/**
 * Routing Table Tab content
 */
import React from 'react';
import CardContent from '@mui/material/CardContent';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import Alert from '@mui/material/Alert';
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
    <div style={{ marginBottom: '16px' }}>
      <Typography variant="h6" gutterBottom className="text-gray-900 dark:text-white">
        Routing Table Analysis
      </Typography>
      <Typography variant="body2" className="text-gray-700 dark:text-gray-300" paragraph>
        Review the current routing table for the host or network. Incorrect routing tables can cause
        connectivity issues.
      </Typography>
    </div>
    <div style={{ marginBottom: '16px' }}>
      <Button variant="contained" onClick={onToggleTable} startIcon={<NetworkCheck />}>
        {showRoutingTable ? 'Hide' : 'Show'} Routing Table
      </Button>
    </div>
    {showRoutingTable && <RoutingTableComponent routingTable={routingTable} />}
    <Alert severity="info" sx={{ mt: 2 }}>
      <Typography variant="body2">
        <strong>Tips:</strong> The default route (0.0.0.0/0) should point to your gateway. All other
        routes should have valid gateways on the same network as the interface.
      </Typography>
    </Alert>
  </CardContent>
);
