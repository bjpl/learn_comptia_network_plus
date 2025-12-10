import React from 'react';
import Typography from '@mui/material/Typography';
import LinearProgress from '@mui/material/LinearProgress';
import Stepper from '@mui/material/Stepper';
import Step from '@mui/material/Step';
import StepLabel from '@mui/material/StepLabel';
import StepContent from '@mui/material/StepContent';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';
import Chip from '@mui/material/Chip';
import Button from '@mui/material/Button';
import { CheckCircle as CheckCircleIcon, Warning as WarningIcon } from '@mui/icons-material';
import { calculatePhaseProgress, calculateRiskSeverity } from '../../../../data/migration-data';
import type { ChecklistItems } from '../types';

interface PhasesViewProps {
  scenario: any;
  activePhase: number;
  onPhaseChange: (phase: number) => void;
  checkedItems: ChecklistItems;
  onToggleItem: (itemId: string) => void;
  overallProgress: number;
}

export const PhasesView: React.FC<PhasesViewProps> = ({
  scenario,
  activePhase,
  onPhaseChange,
  checkedItems,
  onToggleItem,
  overallProgress,
}) => (
  <div className="migration-phases-view">
    <Typography variant="h5" gutterBottom>
      Migration Phases: {scenario.name}
    </Typography>

    <div style={{ marginBottom: '24px' }}>
      <Typography variant="body2" color="text.secondary" gutterBottom>
        Overall Progress
      </Typography>
      <LinearProgress
        variant="determinate"
        value={overallProgress}
        sx={{ height: 10, borderRadius: 5 }}
      />
      <Typography variant="caption" color="text.secondary">
        {overallProgress}% Complete
      </Typography>
    </div>

    <Stepper activeStep={activePhase} orientation="vertical">
      {scenario.phases.map((phase: any, index: number) => {
        const phaseProgress = calculatePhaseProgress({
          ...phase,
          checklist: phase.checklist.map((item: any) => ({
            ...item,
            completed: !!checkedItems[item.id],
          })),
        });

        return (
          <Step key={phase.id}>
            <StepLabel
              onClick={() => onPhaseChange(index)}
              sx={{ cursor: 'pointer' }}
              optional={
                <Typography variant="caption">
                  {phase.duration} weeks • {phaseProgress}% complete
                </Typography>
              }
            >
              {phase.name}
            </StepLabel>
            <StepContent>
              <Typography variant="body2" color="text.secondary" paragraph>
                {phase.description}
              </Typography>

              <Card variant="outlined" sx={{ mb: 2 }}>
                <CardContent>
                  <Typography variant="subtitle2" gutterBottom>
                    <CheckCircleIcon fontSize="small" sx={{ verticalAlign: 'middle', mr: 1 }} />
                    Checklist ({phase.checklist.filter((item: any) => checkedItems[item.id]).length}
                    /{phase.checklist.length})
                  </Typography>
                  <LinearProgress
                    variant="determinate"
                    value={phaseProgress}
                    sx={{ mb: 2, height: 6 }}
                  />
                  <List>
                    {phase.checklist.map((item: any) => (
                      <ListItem key={item.id} dense>
                        <FormControlLabel
                          control={
                            <Checkbox
                              checked={!!checkedItems[item.id]}
                              onChange={() => onToggleItem(item.id)}
                              size="small"
                            />
                          }
                          label={
                            <div>
                              <Typography variant="body2">{item.task}</Typography>
                              <Typography variant="caption" color="text.secondary">
                                {item.description} • {item.responsible}
                              </Typography>
                            </div>
                          }
                        />
                      </ListItem>
                    ))}
                  </List>
                </CardContent>
              </Card>

              {phase.risks.length > 0 && (
                <Card variant="outlined" sx={{ mb: 2, borderColor: 'warning.main' }}>
                  <CardContent>
                    <Typography variant="subtitle2" gutterBottom color="warning.main">
                      <WarningIcon fontSize="small" sx={{ verticalAlign: 'middle', mr: 1 }} />
                      Risks ({phase.risks.length})
                    </Typography>
                    <List>
                      {phase.risks.map((risk: any) => {
                        const severity = calculateRiskSeverity(risk.probability, risk.impact);
                        return (
                          <ListItem key={risk.id} dense>
                            <div>
                              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                <Typography variant="body2">{risk.risk}</Typography>
                                <Chip
                                  label={`P: ${risk.probability}`}
                                  size="small"
                                  color={
                                    risk.probability === 'High'
                                      ? 'error'
                                      : risk.probability === 'Medium'
                                        ? 'warning'
                                        : 'default'
                                  }
                                />
                                <Chip
                                  label={`I: ${risk.impact}`}
                                  size="small"
                                  color={
                                    risk.impact === 'High'
                                      ? 'error'
                                      : risk.impact === 'Medium'
                                        ? 'warning'
                                        : 'default'
                                  }
                                />
                                <Chip
                                  label={`Severity: ${severity}`}
                                  size="small"
                                  color={
                                    severity >= 6 ? 'error' : severity >= 4 ? 'warning' : 'default'
                                  }
                                />
                              </div>
                              <Typography variant="caption" color="text.secondary">
                                Mitigation: {risk.mitigation}
                              </Typography>
                            </div>
                          </ListItem>
                        );
                      })}
                    </List>
                  </CardContent>
                </Card>
              )}

              <div style={{ display: 'flex', gap: '8px', marginTop: '16px' }}>
                {index > 0 && (
                  <Button size="small" onClick={() => onPhaseChange(index - 1)}>
                    Previous
                  </Button>
                )}
                {index < scenario.phases.length - 1 && (
                  <Button size="small" variant="contained" onClick={() => onPhaseChange(index + 1)}>
                    Next Phase
                  </Button>
                )}
              </div>
            </StepContent>
          </Step>
        );
      })}
    </Stepper>
  </div>
);
