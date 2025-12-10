/**
 * Diagnostics Tab component
 */
import React from 'react';
import CardContent from '@mui/material/CardContent';
import Grid from '@mui/material/Grid';
import Accordion from '@mui/material/Accordion';
import AccordionSummary from '@mui/material/AccordionSummary';
import AccordionDetails from '@mui/material/AccordionDetails';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import { ExpandMore, Terminal } from '@mui/icons-material';
import type { TroubleshootingScenario } from '../../../ipv4-types';
import { diagnosticCommands } from '../../../ipv4-data';

interface DiagnosticsTabProps {
  scenario: TroubleshootingScenario;
}

export const DiagnosticsTab: React.FC<DiagnosticsTabProps> = ({ scenario }) => (
  <CardContent>
    <Typography variant="h6" gutterBottom>
      Diagnostic Command Output
    </Typography>
    <Grid container spacing={2}>
      {scenario.diagnosticOutputs.map((diagnostic, index) => (
        <Grid item xs={12} key={index}>
          <Accordion>
            <AccordionSummary expandIcon={<ExpandMore />}>
              <div style={{ display: 'flex', alignItems: 'center', width: '100%' }}>
                <Terminal sx={{ mr: 1 }} />
                <Typography variant="subtitle2">
                  <code>{diagnostic.command}</code>
                </Typography>
                <Typography
                  variant="caption"
                  className="text-gray-700 dark:text-gray-300"
                  sx={{ ml: 'auto' }}
                >
                  {new Date(diagnostic.timestamp).toLocaleString()}
                </Typography>
              </div>
            </AccordionSummary>
            <AccordionDetails>
              <Paper
                variant="outlined"
                sx={{
                  p: 2,
                  bgcolor: '#1e1e1e',
                  color: '#d4d4d4',
                  fontFamily: 'monospace',
                  fontSize: '0.85rem',
                  overflowX: 'auto',
                }}
              >
                <pre style={{ margin: 0 }}>{diagnostic.output}</pre>
              </Paper>
            </AccordionDetails>
          </Accordion>
        </Grid>
      ))}
    </Grid>

    {/* Command Reference */}
    <div style={{ marginTop: '24px' }}>
      <Accordion>
        <AccordionSummary expandIcon={<ExpandMore />}>
          <Typography variant="subtitle2">Diagnostic Commands Reference</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Grid container spacing={2}>
            <Grid item xs={12} md={4}>
              <Typography variant="caption" className="text-gray-700 dark:text-gray-300">
                Windows:
              </Typography>
              <List dense>
                {diagnosticCommands.windows.map((cmd, index) => (
                  <ListItem key={index}>
                    <code style={{ fontSize: '0.8rem' }}>{cmd}</code>
                  </ListItem>
                ))}
              </List>
            </Grid>
            <Grid item xs={12} md={4}>
              <Typography variant="caption" className="text-gray-700 dark:text-gray-300">
                Linux:
              </Typography>
              <List dense>
                {diagnosticCommands.linux.map((cmd, index) => (
                  <ListItem key={index}>
                    <code style={{ fontSize: '0.8rem' }}>{cmd}</code>
                  </ListItem>
                ))}
              </List>
            </Grid>
            <Grid item xs={12} md={4}>
              <Typography variant="caption" className="text-gray-700 dark:text-gray-300">
                Cisco IOS:
              </Typography>
              <List dense>
                {diagnosticCommands.cisco.map((cmd, index) => (
                  <ListItem key={index}>
                    <code style={{ fontSize: '0.8rem' }}>{cmd}</code>
                  </ListItem>
                ))}
              </List>
            </Grid>
          </Grid>
        </AccordionDetails>
      </Accordion>
    </div>
  </CardContent>
);
