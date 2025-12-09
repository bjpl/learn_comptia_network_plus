/**
 * Scenario selection component
 */

import React from 'react';
import {
  Card,
  CardContent,
  Grid,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Chip,
  Box,
  Typography,
} from '@mui/material';
import { BugReport } from '@mui/icons-material';
import type { TroubleshootingScenario } from '../../ipv4-types';
import { getDifficultyColor, getProblemTypeColor } from '../utils';

interface ScenarioSelectorProps {
  scenarios: TroubleshootingScenario[];
  selectedScenario: TroubleshootingScenario;
  onScenarioChange: (scenario: TroubleshootingScenario) => void;
}

export const ScenarioSelector: React.FC<ScenarioSelectorProps> = ({
  scenarios,
  selectedScenario,
  onScenarioChange,
}) => {
  return (
    <Card sx={{ mb: 3 }}>
      <CardContent>
        <Grid container spacing={2} alignItems="center">
          <Grid item xs={12} md={6}>
            <FormControl fullWidth>
              <InputLabel>Scenario</InputLabel>
              <Select
                value={selectedScenario.id}
                onChange={(e) => {
                  const scenario = scenarios.find((s) => s.id === e.target.value);
                  if (scenario) {
                    onScenarioChange(scenario);
                  }
                }}
                label="Scenario"
              >
                {scenarios.map((scenario) => (
                  <MenuItem key={scenario.id} value={scenario.id}>
                    {scenario.title}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={6} md={3}>
            <Chip
              label={selectedScenario.difficulty.toUpperCase()}
              color={getDifficultyColor(selectedScenario.difficulty)}
              size="small"
            />
          </Grid>
          <Grid item xs={6} md={3}>
            <Chip
              icon={<BugReport />}
              label={selectedScenario.problemType.replace('_', ' ').toUpperCase()}
              color={getProblemTypeColor(selectedScenario.problemType)}
              size="small"
            />
          </Grid>
        </Grid>

        <Box sx={{ mt: 2 }}>
          <Typography variant="h6" className="text-gray-900 dark:text-white">
            {selectedScenario.title}
          </Typography>
          <Typography variant="body2" className="text-gray-700 dark:text-gray-300">
            {selectedScenario.description}
          </Typography>
        </Box>
      </CardContent>
    </Card>
  );
};
