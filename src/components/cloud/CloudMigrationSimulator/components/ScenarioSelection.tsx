import React from 'react';
import { Card, CardContent, Grid, FormControl, InputLabel, Select, MenuItem } from '@mui/material';
import { migrationScenarios, migrationStrategies } from '../../../../data/migration-data';

interface ScenarioSelectionProps {
  selectedScenario: string;
  onScenarioChange: (scenario: string) => void;
  selectedStrategy: string;
  onStrategyChange: (strategy: string) => void;
}

export const ScenarioSelection: React.FC<ScenarioSelectionProps> = ({
  selectedScenario,
  onScenarioChange,
  selectedStrategy,
  onStrategyChange,
}) => (
  <Card sx={{ mb: 3 }}>
    <CardContent>
      <Grid container spacing={2} alignItems="center">
        <Grid item xs={12} md={6}>
          <FormControl fullWidth size="small">
            <InputLabel>Migration Scenario</InputLabel>
            <Select
              value={selectedScenario}
              onChange={(e) => onScenarioChange(e.target.value)}
              label="Migration Scenario"
            >
              {migrationScenarios.map((s) => (
                <MenuItem key={s.id} value={s.id}>
                  {s.name} - {s.sourceEnvironment} → {s.targetEnvironment}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid>
        <Grid item xs={12} md={6}>
          <FormControl fullWidth size="small">
            <InputLabel>Migration Strategy</InputLabel>
            <Select
              value={selectedStrategy}
              onChange={(e) => onStrategyChange(e.target.value)}
              label="Migration Strategy"
            >
              {migrationStrategies.map((s) => (
                <MenuItem key={s.id} value={s.id}>
                  {s.icon} {s.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid>
      </Grid>
    </CardContent>
  </Card>
);
