/**
 * Solution Steps Tab component
 */
import React from 'react';
import CardContent from '@mui/material/CardContent';
import Button from '@mui/material/Button';
import Stepper from '@mui/material/Stepper';
import Step from '@mui/material/Step';
import StepLabel from '@mui/material/StepLabel';
import StepContent from '@mui/material/StepContent';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
import Alert from '@mui/material/Alert';
import { PlayArrow, Refresh, CheckCircle, Lightbulb } from '@mui/icons-material';
import type { TroubleshootingScenario } from '../../../ipv4-types';

interface SolutionStepsTabProps {
  scenario: TroubleshootingScenario;
  activeStep: number;
  showSolution: boolean;
  onToggleSolution: () => void;
  onStepChange: (step: number) => void;
  onReset: () => void;
}

export const SolutionStepsTab: React.FC<SolutionStepsTabProps> = ({
  scenario,
  activeStep,
  showSolution,
  onToggleSolution,
  onStepChange,
  onReset,
}) => (
  <CardContent>
    <div style={{ marginBottom: '16px', display: 'flex', gap: '16px' }}>
      <Button variant="contained" startIcon={<PlayArrow />} onClick={onToggleSolution}>
        {showSolution ? 'Hide' : 'Show'} Solution
      </Button>
      <Button variant="outlined" startIcon={<Refresh />} onClick={onReset}>
        Reset
      </Button>
    </div>

    {showSolution && scenario.solution && (
      <Stepper activeStep={activeStep} orientation="vertical">
        {scenario.solution.map((step, index) => (
          <Step key={step.id}>
            <StepLabel>
              <Typography variant="subtitle2">{step.description}</Typography>
            </StepLabel>
            <StepContent>
              <Paper variant="outlined" sx={{ p: 2, mb: 2 }}>
                <Typography variant="body2" paragraph>
                  <strong>Action:</strong> {step.action}
                </Typography>
                <Typography variant="body2" paragraph>
                  <strong>Expected Result:</strong> {step.expectedResult}
                </Typography>
                <Alert severity="info" icon={<Lightbulb />}>
                  <Typography variant="body2">{step.explanation}</Typography>
                </Alert>
                {step.diagnostic && (
                  <div style={{ marginTop: '16px' }}>
                    <Typography variant="caption" className="text-gray-700 dark:text-gray-300">
                      Related Diagnostic:
                    </Typography>
                    <Paper
                      variant="outlined"
                      sx={{
                        p: 1,
                        mt: 1,
                        bgcolor: '#1e1e1e',
                        color: '#d4d4d4',
                        fontFamily: 'monospace',
                        fontSize: '0.75rem',
                      }}
                    >
                      <pre style={{ margin: 0 }}>{step.diagnostic.output}</pre>
                    </Paper>
                  </div>
                )}
              </Paper>
              <div style={{ marginBottom: '16px' }}>
                <Button variant="contained" onClick={() => onStepChange(index + 1)} sx={{ mr: 1 }}>
                  {index === scenario.solution!.length - 1 ? 'Finish' : 'Continue'}
                </Button>
                {index > 0 && <Button onClick={() => onStepChange(index - 1)}>Back</Button>}
              </div>
            </StepContent>
          </Step>
        ))}
      </Stepper>
    )}

    {activeStep === scenario.solution?.length && showSolution && (
      <Alert severity="success" icon={<CheckCircle />} sx={{ mt: 2 }}>
        <Typography variant="subtitle2">Troubleshooting Complete!</Typography>
        <Typography variant="body2">
          You have successfully identified and resolved the {scenario.problemType} issue.
        </Typography>
      </Alert>
    )}
  </CardContent>
);
