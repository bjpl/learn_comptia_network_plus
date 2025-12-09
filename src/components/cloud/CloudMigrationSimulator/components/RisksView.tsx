import React from 'react';
import {
  Box,
  Typography,
  TableContainer,
  Paper,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Chip,
  Alert,
} from '@mui/material';
import { getSortedRisks } from '../utils/calculationHelpers';

interface RisksViewProps {
  scenario: any;
}

export const RisksView: React.FC<RisksViewProps> = ({ scenario }) => {
  const sortedRisks = getSortedRisks(scenario);

  return (
    <Box className="migration-risks-view">
      <Typography variant="h5" gutterBottom>
        Risk Assessment Matrix
      </Typography>
      <Typography variant="body2" color="text.secondary" paragraph>
        Identified risks across all migration phases, sorted by severity (Probability × Impact).
      </Typography>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Risk</TableCell>
              <TableCell>Phase</TableCell>
              <TableCell align="center">Probability</TableCell>
              <TableCell align="center">Impact</TableCell>
              <TableCell align="center">Severity</TableCell>
              <TableCell>Mitigation</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {sortedRisks.map((risk) => (
              <TableRow key={`${risk.id}-${risk.phase}`}>
                <TableCell>{risk.risk}</TableCell>
                <TableCell>{risk.phase}</TableCell>
                <TableCell align="center">
                  <Chip
                    label={risk.probability}
                    size="small"
                    color={
                      risk.probability === 'High'
                        ? 'error'
                        : risk.probability === 'Medium'
                          ? 'warning'
                          : 'default'
                    }
                  />
                </TableCell>
                <TableCell align="center">
                  <Chip
                    label={risk.impact}
                    size="small"
                    color={
                      risk.impact === 'High'
                        ? 'error'
                        : risk.impact === 'Medium'
                          ? 'warning'
                          : 'default'
                    }
                  />
                </TableCell>
                <TableCell align="center">
                  <Chip
                    label={risk.severity}
                    size="small"
                    color={risk.severity >= 6 ? 'error' : risk.severity >= 4 ? 'warning' : 'success'}
                  />
                </TableCell>
                <TableCell>{risk.mitigation}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <Box mt={3}>
        <Alert severity="info">
          <Typography variant="subtitle2" gutterBottom>
            Risk Severity Scale
          </Typography>
          <Typography variant="body2">
            • 1-3: Low severity - Monitor and manage with standard procedures
            <br />
            • 4-6: Medium severity - Requires specific mitigation strategies
            <br />• 7-9: High severity - Critical risk requiring immediate attention and robust
            mitigation
          </Typography>
        </Alert>
      </Box>
    </Box>
  );
};
