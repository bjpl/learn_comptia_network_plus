/**
 * Problem Overview Tab component
 */
import React from 'react';
import CardContent from '@mui/material/CardContent';
import Grid from '@mui/material/Grid';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
import Alert from '@mui/material/Alert';
import Button from '@mui/material/Button';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import { Warning, Error as ErrorIcon, Lightbulb } from '@mui/icons-material';
import type { TroubleshootingScenario } from '../../../ipv4-types';

interface ProblemOverviewTabProps {
  scenario: TroubleshootingScenario;
  showHints: boolean;
  onToggleHints: () => void;
}

export const ProblemOverviewTab: React.FC<ProblemOverviewTabProps> = ({
  scenario,
  showHints,
  onToggleHints,
}) => (
  <CardContent>
    <Grid container spacing={3}>
      <Grid item xs={12} md={6}>
        <Paper variant="outlined" sx={{ p: 2 }}>
          <Typography variant="subtitle2" gutterBottom color="success.main">
            Expected Behavior:
          </Typography>
          <Typography variant="body2" className="text-gray-800 dark:text-gray-200">
            {scenario.expectedBehavior}
          </Typography>
        </Paper>
      </Grid>
      <Grid item xs={12} md={6}>
        <Paper variant="outlined" sx={{ p: 2 }}>
          <Typography variant="subtitle2" gutterBottom color="error.main">
            Actual Behavior:
          </Typography>
          <Typography variant="body2" className="text-gray-800 dark:text-gray-200">
            {scenario.actualBehavior}
          </Typography>
        </Paper>
      </Grid>
      <Grid item xs={12}>
        <Alert severity="warning" icon={<Warning />}>
          <Typography variant="subtitle2" gutterBottom>
            Symptoms:
          </Typography>
          <List dense>
            {scenario.symptoms.map((symptom, index) => (
              <ListItem key={index}>
                <ListItemIcon sx={{ minWidth: 30 }}>
                  <ErrorIcon fontSize="small" color="warning" />
                </ListItemIcon>
                <ListItemText primary={symptom} />
              </ListItem>
            ))}
          </List>
        </Alert>
      </Grid>
    </Grid>

    <div style={{ marginTop: '24px', display: 'flex', gap: '16px' }}>
      <Button variant="outlined" startIcon={<Lightbulb />} onClick={onToggleHints}>
        {showHints ? 'Hide' : 'Show'} Hints
      </Button>
    </div>

    {showHints && scenario.hints && (
      <Alert severity="info" sx={{ mt: 2 }}>
        <Typography variant="subtitle2" gutterBottom>
          Hints:
        </Typography>
        <ul style={{ margin: 0, paddingLeft: 20 }}>
          {scenario.hints.map((hint, index) => (
            <li key={index}>{hint}</li>
          ))}
        </ul>
      </Alert>
    )}
  </CardContent>
);
