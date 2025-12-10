/**
 * ARP Table Tab content
 */
import React from 'react';
import CardContent from '@mui/material/CardContent';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import Alert from '@mui/material/Alert';
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
    <div style={{ marginBottom: '16px' }}>
      <Typography variant="h6" gutterBottom className="text-gray-900 dark:text-white">
        ARP Table Simulator
      </Typography>
      <Typography variant="body2" className="text-gray-700 dark:text-gray-300" paragraph>
        Address Resolution Protocol (ARP) table maps IP addresses to MAC addresses. Invalid entries
        can prevent communication.
      </Typography>
    </div>
    <div style={{ marginBottom: '16px' }}>
      <Button variant="contained" onClick={onToggleTable} startIcon={<Storage />}>
        {showARPTable ? 'Hide' : 'Show'} ARP Table
      </Button>
    </div>
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
