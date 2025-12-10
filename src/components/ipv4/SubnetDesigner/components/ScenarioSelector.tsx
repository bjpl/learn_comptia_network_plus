/**
 * Scenario selection component
 */

import React from 'react';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Grid from '@mui/material/Grid';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import Chip from '@mui/material/Chip';
import Typography from '@mui/material/Typography';
import type { SubnetScenario } from '../../ipv4-types';
import { getDifficultyColor } from '../utils/ipHelpers';

interface ScenarioSelectorProps {
  selectedScenario: SubnetScenario;
  scenarios: SubnetScenario[];
  onScenarioChange: (scenario: SubnetScenario) => void;
}

export const ScenarioSelector: React.FC<ScenarioSelectorProps> = ({
  selectedScenario,
  scenarios,
  onScenarioChange,
}) => {
  return (
    <Card sx={{ mb: 3 }}>
      <CardContent>
        <Grid container spacing={2} alignItems="center">
          <Grid item xs={12} md={8}>
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
                    {scenario.title} - {scenario.category}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} md={4}>
            <Chip
              label={selectedScenario.difficulty.toUpperCase()}
              color={getDifficultyColor(selectedScenario.difficulty)}
              size="small"
            />
          </Grid>
        </Grid>

        <div style={{ marginTop: '16px' }}>
          <Typography variant="h6" className="text-gray-900 dark:text-white">
            {selectedScenario.title}
          </Typography>
          <Typography variant="body2" className="text-gray-700 dark:text-gray-300">
            {selectedScenario.description}
          </Typography>
          <Typography variant="body2" sx={{ mt: 1 }}>
            <strong>Base Network:</strong> {selectedScenario.baseNetwork}
          </Typography>
        </div>
      </CardContent>
    </Card>
  );
};
