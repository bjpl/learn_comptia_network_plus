import React from 'react';
import { Box, Typography, Chip, Card, CardContent, Grid } from '@mui/material';
import { calculateTimelineData } from '../utils/calculationHelpers';
import type { ChecklistItems } from '../types';

interface TimelineViewProps {
  scenario: any;
  checkedItems: ChecklistItems;
  overallProgress: number;
}

export const TimelineView: React.FC<TimelineViewProps> = ({
  scenario,
  checkedItems,
  overallProgress,
}) => {
  const timelineData = calculateTimelineData(scenario, checkedItems);
  const totalWeeks = timelineData[timelineData.length - 1]?.endWeek || 0;

  return (
    <Box className="migration-timeline-view">
      <Typography variant="h5" gutterBottom>
        Migration Timeline
      </Typography>
      <Typography variant="body2" color="text.secondary" paragraph>
        Gantt-style visualization of migration phases. Total duration: {totalWeeks} weeks (~
        {Math.ceil(totalWeeks / 4)} months)
      </Typography>

      <Box className="timeline-gantt" sx={{ mt: 3 }}>
        {timelineData.map((item) => {
          const widthPercent = (item.phase.duration / totalWeeks) * 100;
          const leftPercent = (item.startWeek / totalWeeks) * 100;

          return (
            <Box key={item.phase.id} mb={3}>
              <Box display="flex" justifyContent="space-between" mb={1}>
                <Typography variant="subtitle2">{item.phase.name}</Typography>
                <Typography variant="caption" color="text.secondary">
                  Week {item.startWeek} - {item.endWeek} ({item.phase.duration} weeks)
                </Typography>
              </Box>
              <Box position="relative" height={60} bgcolor="grey.100" borderRadius={1}>
                <Box
                  position="absolute"
                  left={`${leftPercent}%`}
                  width={`${widthPercent}%`}
                  height="100%"
                  bgcolor="primary.main"
                  borderRadius={1}
                  display="flex"
                  alignItems="center"
                  justifyContent="center"
                  sx={{ opacity: 0.8 }}
                >
                  <Typography variant="caption" color="white" fontWeight="bold">
                    {item.progress}%
                  </Typography>
                </Box>
              </Box>
              <Box display="flex" gap={1} mt={1}>
                <Chip label={`${item.phase.checklist.length} tasks`} size="small" />
                <Chip label={`${item.phase.risks.length} risks`} size="small" color="warning" />
                {item.phase.dependencies.length > 0 && (
                  <Chip
                    label={`${item.phase.dependencies.length} dependencies`}
                    size="small"
                    color="secondary"
                  />
                )}
              </Box>
            </Box>
          );
        })}
      </Box>

      <Box mt={4}>
        <Card>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              Timeline Summary
            </Typography>
            <Grid container spacing={2}>
              <Grid item xs={6} md={3}>
                <Typography variant="body2" color="text.secondary">
                  Total Duration
                </Typography>
                <Typography variant="h6">{totalWeeks} weeks</Typography>
              </Grid>
              <Grid item xs={6} md={3}>
                <Typography variant="body2" color="text.secondary">
                  Total Phases
                </Typography>
                <Typography variant="h6">{scenario.phases.length}</Typography>
              </Grid>
              <Grid item xs={6} md={3}>
                <Typography variant="body2" color="text.secondary">
                  Total Tasks
                </Typography>
                <Typography variant="h6">
                  {scenario.phases.reduce((sum: number, p: any) => sum + p.checklist.length, 0)}
                </Typography>
              </Grid>
              <Grid item xs={6} md={3}>
                <Typography variant="body2" color="text.secondary">
                  Overall Progress
                </Typography>
                <Typography variant="h6">{overallProgress}%</Typography>
              </Grid>
            </Grid>
          </CardContent>
        </Card>
      </Box>
    </Box>
  );
};
