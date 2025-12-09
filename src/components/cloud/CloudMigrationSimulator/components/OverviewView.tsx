import React from 'react';
import { Box, Card, CardContent, Typography, Grid, Chip } from '@mui/material';
import {
  Timeline as TimelineIcon,
  Assessment as AssessmentIcon,
  AttachMoney as MoneyIcon,
  Warning as WarningIcon,
} from '@mui/icons-material';
import type { ChecklistItems } from '../types';

interface OverviewViewProps {
  scenario: any;
  strategy: any;
  overallProgress: number;
  savings: number;
  onPremTotal: number;
  checkedItems: ChecklistItems;
}

export const OverviewView: React.FC<OverviewViewProps> = ({
  scenario,
  strategy,
  overallProgress,
  savings,
  onPremTotal,
  checkedItems,
}) => (
  <Box className="migration-overview">
    <Grid container spacing={3}>
      <Grid item xs={12}>
        <Card>
          <CardContent>
            <Typography variant="h5" gutterBottom>
              {scenario.name}
            </Typography>
            <Typography variant="body2" color="text.secondary" paragraph>
              {scenario.description}
            </Typography>
            <Grid container spacing={2}>
              <Grid item xs={6} md={3}>
                <Typography variant="caption" color="text.secondary">
                  Source
                </Typography>
                <Typography variant="body2">{scenario.sourceEnvironment}</Typography>
              </Grid>
              <Grid item xs={6} md={3}>
                <Typography variant="caption" color="text.secondary">
                  Target
                </Typography>
                <Typography variant="body2">{scenario.targetEnvironment}</Typography>
              </Grid>
              <Grid item xs={6} md={3}>
                <Typography variant="caption" color="text.secondary">
                  Applications
                </Typography>
                <Typography variant="body2">{scenario.applicationCount}</Typography>
              </Grid>
              <Grid item xs={6} md={3}>
                <Typography variant="caption" color="text.secondary">
                  Data Volume
                </Typography>
                <Typography variant="body2">{scenario.dataVolume}</Typography>
              </Grid>
              <Grid item xs={6} md={3}>
                <Typography variant="caption" color="text.secondary">
                  Duration
                </Typography>
                <Typography variant="body2">{scenario.estimatedDuration}</Typography>
              </Grid>
              <Grid item xs={6} md={3}>
                <Typography variant="caption" color="text.secondary">
                  Est. Cost
                </Typography>
                <Typography variant="body2">{scenario.estimatedCost}</Typography>
              </Grid>
              <Grid item xs={6} md={3}>
                <Typography variant="caption" color="text.secondary">
                  Complexity
                </Typography>
                <Chip label={scenario.complexity} size="small" color="primary" />
              </Grid>
              <Grid item xs={6} md={3}>
                <Typography variant="caption" color="text.secondary">
                  Strategy
                </Typography>
                <Chip label={strategy.shortName} size="small" color="secondary" />
              </Grid>
            </Grid>
          </CardContent>
        </Card>
      </Grid>

      <Grid item xs={12} md={3}>
        <Card>
          <CardContent>
            <TimelineIcon color="primary" />
            <Typography variant="h6" gutterBottom>
              Timeline
            </Typography>
            <Typography variant="h4">
              {scenario.phases.reduce((sum: number, p: any) => sum + p.duration, 0)} weeks
            </Typography>
            <Typography variant="caption" color="text.secondary">
              {scenario.phases.length} phases
            </Typography>
          </CardContent>
        </Card>
      </Grid>

      <Grid item xs={12} md={3}>
        <Card>
          <CardContent>
            <AssessmentIcon color="primary" />
            <Typography variant="h6" gutterBottom>
              Progress
            </Typography>
            <Typography variant="h4">{overallProgress}%</Typography>
            <Typography variant="caption" color="text.secondary">
              {scenario.phases.reduce(
                (sum: number, p: any) =>
                  sum + p.checklist.filter((i: any) => checkedItems[i.id]).length,
                0
              )}
              /{scenario.phases.reduce((sum: number, p: any) => sum + p.checklist.length, 0)} tasks
            </Typography>
          </CardContent>
        </Card>
      </Grid>

      <Grid item xs={12} md={3}>
        <Card>
          <CardContent>
            <MoneyIcon color="primary" />
            <Typography variant="h6" gutterBottom>
              Savings
            </Typography>
            <Typography variant="h4" color={savings > 0 ? 'success.main' : 'error.main'}>
              {savings > 0 ? '+' : ''}
              {Math.round((savings / onPremTotal) * 100)}%
            </Typography>
            <Typography variant="caption" color="text.secondary">
              ${Math.abs(savings).toLocaleString()}
            </Typography>
          </CardContent>
        </Card>
      </Grid>

      <Grid item xs={12} md={3}>
        <Card>
          <CardContent>
            <WarningIcon color="primary" />
            <Typography variant="h6" gutterBottom>
              Risks
            </Typography>
            <Typography variant="h4">
              {scenario.phases.reduce((sum: number, p: any) => sum + p.risks.length, 0)}
            </Typography>
            <Typography variant="caption" color="text.secondary">
              identified risks
            </Typography>
          </CardContent>
        </Card>
      </Grid>

      <Grid item xs={12}>
        <Card>
          <CardContent>
            <Box display="flex" alignItems="center" gap={2} mb={2}>
              <Typography variant="h2">{strategy.icon}</Typography>
              <Box>
                <Typography variant="h6">{strategy.name}</Typography>
                <Box display="flex" gap={1}>
                  <Chip label={`Complexity: ${strategy.complexity}`} size="small" />
                  <Chip label={`Timeline: ${strategy.timeframe}`} size="small" color="primary" />
                </Box>
              </Box>
            </Box>
            <Typography variant="body2" color="text.secondary">
              {strategy.description}
            </Typography>
          </CardContent>
        </Card>
      </Grid>
    </Grid>
  </Box>
);
