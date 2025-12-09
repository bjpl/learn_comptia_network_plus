/**
 * Subnet cheat sheet reference component
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
  Tooltip,
  IconButton,
} from '@mui/material';
import { ContentCopy } from '@mui/icons-material';
import { subnetCheatData } from '../utils/subnetCheatData';
import { copyToClipboard } from '../utils/ipHelpers';

export const SubnetCheatSheet: React.FC = () => {
  return (
    <Card sx={{ mb: 3 }}>
      <CardContent>
        <Typography variant="h6" gutterBottom>
          Subnet Cheat Sheet
        </Typography>
        <TableContainer>
          <Table size="small">
            <TableHead>
              <TableRow sx={{ bgcolor: '#f5f5f5' }}>
                <TableCell>
                  <strong>CIDR</strong>
                </TableCell>
                <TableCell>
                  <strong>Subnet Mask</strong>
                </TableCell>
                <TableCell align="right">
                  <strong>Usable Hosts</strong>
                </TableCell>
                <TableCell>
                  <strong>Common Use</strong>
                </TableCell>
                <TableCell align="center">
                  <strong>Copy</strong>
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {subnetCheatData.map((row) => (
                <TableRow key={row.cidr}>
                  <TableCell>
                    <code>{row.cidr}</code>
                  </TableCell>
                  <TableCell>
                    <code>{row.mask}</code>
                  </TableCell>
                  <TableCell align="right">{row.hosts}</TableCell>
                  <TableCell>{row.common}</TableCell>
                  <TableCell align="center">
                    <Tooltip title="Copy mask">
                      <IconButton size="small" onClick={() => copyToClipboard(row.mask)}>
                        <ContentCopy fontSize="small" />
                      </IconButton>
                    </Tooltip>
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
