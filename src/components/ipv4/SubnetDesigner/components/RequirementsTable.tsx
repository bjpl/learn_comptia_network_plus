/**
 * Network requirements table component
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
} from '@mui/material';
import { CheckCircle, Warning } from '@mui/icons-material';
import type { SubnetScenario, SubnetAllocation } from '../../ipv4-types';

interface RequirementsTableProps {
  scenario: SubnetScenario;
  allocations: SubnetAllocation[];
}

export const RequirementsTable: React.FC<RequirementsTableProps> = ({
  scenario,
  allocations,
}) => {
  return (
    <Card sx={{ mb: 3 }}>
      <CardContent>
        <Typography variant="h6" gutterBottom>
          Network Requirements
        </Typography>
        <TableContainer component={Paper} variant="outlined">
          <Table size="small">
            <TableHead>
              <TableRow>
                <TableCell>Name</TableCell>
                <TableCell>Description</TableCell>
                <TableCell align="right">Hosts Needed</TableCell>
                <TableCell align="center">Status</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {scenario.requirements.map((req) => {
                const allocated = allocations.find((a) => a.id === req.id);
                return (
                  <TableRow key={req.id}>
                    <TableCell>{req.name}</TableCell>
                    <TableCell>{req.description}</TableCell>
                    <TableCell align="right">{req.hostsNeeded}</TableCell>
                    <TableCell align="center">
                      {allocated ? (
                        <CheckCircle color="success" fontSize="small" />
                      ) : (
                        <Warning color="warning" fontSize="small" />
                      )}
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </TableContainer>
      </CardContent>
    </Card>
  );
};
