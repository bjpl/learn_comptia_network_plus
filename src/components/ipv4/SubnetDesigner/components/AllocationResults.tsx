/**
 * Subnet allocation results display component
 */

import React from 'react';
import {
  Card,
  CardContent,
  Typography,
  TableContainer,
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
  Paper,
  Chip,
} from '@mui/material';
import type { SubnetAllocation } from '../../ipv4-types';

interface AllocationResultsProps {
  allocations: SubnetAllocation[];
}

export const AllocationResults: React.FC<AllocationResultsProps> = ({ allocations }) => {
  if (allocations.length === 0) {
    return null;
  }

  return (
    <Card sx={{ mb: 3 }}>
      <CardContent>
        <Typography variant="h6" gutterBottom>
          Subnet Allocations
        </Typography>
        <TableContainer component={Paper} variant="outlined">
          <Table size="small">
            <TableHead>
              <TableRow>
                <TableCell>Name</TableCell>
                <TableCell>Network</TableCell>
                <TableCell>CIDR</TableCell>
                <TableCell>Subnet Mask</TableCell>
                <TableCell>Usable Range</TableCell>
                <TableCell align="right">Usable Hosts</TableCell>
                <TableCell align="right">Needed</TableCell>
                <TableCell align="right">Wasted</TableCell>
                <TableCell align="right">Efficiency</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {allocations.map((alloc) => (
                <TableRow key={alloc.id}>
                  <TableCell>{alloc.name}</TableCell>
                  <TableCell>
                    <code>{alloc.network}</code>
                  </TableCell>
                  <TableCell>
                    <code>/{alloc.cidr}</code>
                  </TableCell>
                  <TableCell>
                    <code>{alloc.subnetMask}</code>
                  </TableCell>
                  <TableCell>
                    <code style={{ fontSize: '0.75rem' }}>
                      {alloc.firstHost} - {alloc.lastHost}
                    </code>
                  </TableCell>
                  <TableCell align="right">{alloc.usableHosts}</TableCell>
                  <TableCell align="right">{alloc.hostsNeeded}</TableCell>
                  <TableCell align="right">{alloc.wastedAddresses}</TableCell>
                  <TableCell align="right">
                    <Chip
                      label={`${alloc.efficiency}%`}
                      size="small"
                      color={
                        alloc.efficiency >= 75
                          ? 'success'
                          : alloc.efficiency >= 50
                            ? 'warning'
                            : 'error'
                      }
                    />
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </CardContent>
    </Card>
  );
};
