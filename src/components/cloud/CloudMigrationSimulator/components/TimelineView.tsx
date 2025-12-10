import React from 'react';
import Typography from '@mui/material/Typography';
import Chip from '@mui/material/Chip';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Grid from '@mui/material/Grid';
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
    <div className="migration-timeline-view">
      <Typography variant="h5" gutterBottom>
        Migration Timeline
      </Typography>
      <Typography variant="body2" color="text.secondary" paragraph>
        Gantt-style visualization of migration phases. Total duration: {totalWeeks} weeks (~
        {Math.ceil(totalWeeks / 4)} months)
      </Typography>

      <div className="timeline-gantt" style={{ marginTop: '24px' }}>
        {timelineData.map((item) => {
          const widthPercent = (item.phase.duration / totalWeeks) * 100;
          const leftPercent = (item.startWeek / totalWeeks) * 100;

          return (
            <div key={item.phase.id} style={{ marginBottom: '24px' }}>
              <div
                style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}
              >
                <Typography variant="subtitle2">{item.phase.name}</Typography>
                <Typography variant="caption" color="text.secondary">
                  Week {item.startWeek} - {item.endWeek} ({item.phase.duration} weeks)
                </Typography>
              </div>
              <div
                style={{
                  position: 'relative',
                  height: '60px',
                  backgroundColor: '#f5f5f5',
                  borderRadius: '4px',
                }}
              >
                <div
                  style={{
                    position: 'absolute',
                    left: `${leftPercent}%`,
                    width: `${widthPercent}%`,
                    height: '100%',
                    backgroundColor: '#1976d2',
                    borderRadius: '4px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    opacity: 0.8,
                  }}
                >
                  <Typography variant="caption" style={{ color: 'white', fontWeight: 'bold' }}>
                    {item.progress}%
                  </Typography>
                </div>
              </div>
              <div style={{ display: 'flex', gap: '8px', marginTop: '8px' }}>
                <Chip label={`${item.phase.checklist.length} tasks`} size="small" />
                <Chip label={`${item.phase.risks.length} risks`} size="small" color="warning" />
                {item.phase.dependencies.length > 0 && (
                  <Chip
                    label={`${item.phase.dependencies.length} dependencies`}
                    size="small"
                    color="secondary"
                  />
                )}
              </div>
            </div>
          );
        })}
      </div>

      <div style={{ marginTop: '32px' }}>
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
      </div>
    </div>
  );
};
