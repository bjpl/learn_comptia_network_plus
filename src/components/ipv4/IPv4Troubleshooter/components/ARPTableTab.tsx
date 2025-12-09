/**
 * ARP Table Tab content
 */
import React from 'react';
import { CardContent, Box, Button, Typography, Alert } from '@mui/material';
import { Storage } from '@mui/icons-material';
import { ARPTableComponent } from './ARPTableComponent';
import type { ARPEntry } from '../types';

interface ARPTableTabProps {
  showARPTable: boolean;
  onToggleTable: () => void;
  arpTable: ARPEntry[];
}

export const ARPTableTab: React.FC<ARPTableTabProps> = ({
  showARPTable,
  onToggleTable,
  arpTable,
}) => (
  <CardContent>
    <Box sx={{ mb: 2 }}>
      <Typography variant="h6" gutterBottom className="text-gray-900 dark:text-white">
        ARP Table Simulator
      </Typography>
      <Typography variant="body2" className="text-gray-700 dark:text-gray-300" paragraph>
        Address Resolution Protocol (ARP) table maps IP addresses to MAC addresses. Invalid entries
        can prevent communication.
      </Typography>
    </Box>
    <Box sx={{ mb: 2 }}>
      <Button variant="contained" onClick={onToggleTable} startIcon={<Storage />}>
        {showARPTable ? 'Hide' : 'Show'} ARP Table
      </Button>
    </Box>
    {showARPTable && <ARPTableComponent arpTable={arpTable} />}
    <Alert severity="warning" sx={{ mt: 2 }}>
      <Typography variant="body2">
        <strong>Common ARP Issues:</strong> Incomplete entries may indicate the target is
        unreachable. Invalid entries suggest misconfiguration. Use arp -d (Windows) or ip neigh
        flush (Linux) to clear and rebuild the table.
      </Typography>
    </Alert>
  </CardContent>
);
