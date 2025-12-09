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
import { troubleshootingScenarios } from '../../ipv4-data';
import type { TroubleshootingScenario } from '../../ipv4-types';
import { getDifficultyColor } from '../utils/iconHelpers';

interface ScenarioSelectorProps {
  selectedScenario: TroubleshootingScenario;
  onScenarioChange: (scenarioId: string) => void;
}

export const ScenarioSelector: React.FC<ScenarioSelectorProps> = ({
  selectedScenario,
  onScenarioChange,
}) => (
  <Card sx={{ mb: 3 }}>
    <CardContent>
      <Grid container spacing={2} alignItems="center">
        <Grid item xs={12} md={8}>
          <FormControl fullWidth>
            <InputLabel>Troubleshooting Scenario</InputLabel>
            <Select
              value={selectedScenario.id}
              onChange={(e) => onScenarioChange(e.target.value)}
              label="Troubleshooting Scenario"
            >
              {troubleshootingScenarios.map((scenario) => (
                <MenuItem key={scenario.id} value={scenario.id}>
                  {scenario.title} ({scenario.problemType})
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid>
        <Grid item xs={12} md={4}>
          <Chip
            label={selectedScenario.difficulty.toUpperCase()}
            color={
              getDifficultyColor(selectedScenario.difficulty) as
                | 'success'
                | 'warning'
                | 'error'
                | 'default'
            }
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
