/**
 * ARP Table display component
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
import type { ARPEntry } from '../types';

interface ARPTableComponentProps {
  arpTable: ARPEntry[];
}

export const ARPTableComponent: React.FC<ARPTableComponentProps> = ({ arpTable }) => (
  <TableContainer component={Paper}>
    <Table size="small">
      <TableHead>
        <TableRow sx={{ backgroundColor: '#f5f5f5' }}>
          <TableCell>
            <strong>IP Address</strong>
          </TableCell>
          <TableCell>
            <strong>MAC Address</strong>
          </TableCell>
          <TableCell>
            <strong>Interface</strong>
          </TableCell>
          <TableCell align="center">
            <strong>Type</strong>
          </TableCell>
        </TableRow>
      </TableHead>
      <TableBody>
        {arpTable.map((entry, index) => (
          <TableRow key={index} sx={{ '&:hover': { backgroundColor: '#f9f9f9' } }}>
            <TableCell>
              <code>{entry.ipAddress}</code>
            </TableCell>
            <TableCell>
              <code>{entry.macAddress}</code>
            </TableCell>
            <TableCell>{entry.interface}</TableCell>
            <TableCell align="center">
              <Chip
                label={entry.type}
                size="small"
                color={
                  entry.type === 'invalid'
                    ? 'error'
                    : entry.type === 'static'
                      ? 'primary'
                      : 'default'
                }
              />
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  </TableContainer>
);
