/**
 * Routing Table display component
 */
import React from 'react';
import {
  TableContainer,
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
  Paper,
  Chip,
} from '@mui/material';
import type { RoutingTableEntry } from '../types';

interface RoutingTableComponentProps {
  routingTable: RoutingTableEntry[];
}

export const RoutingTableComponent: React.FC<RoutingTableComponentProps> = ({ routingTable }) => (
  <TableContainer component={Paper}>
    <Table size="small">
      <TableHead>
        <TableRow sx={{ backgroundColor: '#f5f5f5' }}>
          <TableCell>
            <strong>Destination</strong>
          </TableCell>
          <TableCell>
            <strong>Netmask</strong>
          </TableCell>
          <TableCell>
            <strong>Gateway</strong>
          </TableCell>
          <TableCell>
            <strong>Interface</strong>
          </TableCell>
          <TableCell align="center">
            <strong>Metric</strong>
          </TableCell>
          <TableCell align="center">
            <strong>Status</strong>
          </TableCell>
        </TableRow>
      </TableHead>
      <TableBody>
        {routingTable.map((entry, index) => (
          <TableRow key={index} sx={{ '&:hover': { backgroundColor: '#f9f9f9' } }}>
            <TableCell>
              <code>{entry.destination}</code>
            </TableCell>
            <TableCell>
              <code>{entry.netmask}</code>
            </TableCell>
            <TableCell>
              <code>{entry.gateway}</code>
            </TableCell>
            <TableCell>{entry.interface}</TableCell>
            <TableCell align="center">{entry.metric}</TableCell>
            <TableCell align="center">
              <Chip
                label={entry.status}
                size="small"
                color={entry.status === 'valid' ? 'success' : 'error'}
              />
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  </TableContainer>
);
