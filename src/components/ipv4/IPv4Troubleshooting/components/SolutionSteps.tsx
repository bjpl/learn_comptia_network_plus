/**
 * Solution steps component with stepper
 */

import React from 'react';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import Stepper from '@mui/material/Stepper';
import Step from '@mui/material/Step';
import StepLabel from '@mui/material/StepLabel';
import StepContent from '@mui/material/StepContent';
import Button from '@mui/material/Button';
import Paper from '@mui/material/Paper';
import Alert from '@mui/material/Alert';
import { CheckCircle } from '@mui/icons-material';
import type { SolutionStep } from '../../ipv4-types';
import { getTimeElapsed } from '../utils';

interface SolutionStepsProps {
  steps: SolutionStep[];
  activeStep: number;
  completedSteps: Set<number>;
  showSolution: boolean;
  score: number;
  startTime: number | null;
  onStepComplete: (stepIndex: number) => void;
}

export const SolutionSteps: React.FC<SolutionStepsProps> = ({
  steps,
  activeStep,
  completedSteps,
  showSolution,
  score,
  startTime,
  onStepComplete,
}) => {
  return (
    <Card sx={{ mb: 3 }}>
      <CardContent>
        <Typography variant="h6" gutterBottom>
          Troubleshooting Steps
        </Typography>

        <Stepper activeStep={activeStep} orientation="vertical">
          {steps.map((step, index) => (
            <Step key={step.id} completed={completedSteps.has(index)}>
              <StepLabel
                optional={
                  showSolution && <Typography variant="caption">Step {step.stepNumber}</Typography>
                }
                StepIconComponent={() =>
                  completedSteps.has(index) ? (
                    <CheckCircle color="success" />
                  ) : (
                    <div
                      style={{
                        width: 24,
                        height: 24,
                        borderRadius: '50%',
                        backgroundColor: activeStep === index ? '#1976d2' : '#d3d3d3',
                        color: 'white',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                      }}
                    >
                      {step.stepNumber}
                    </div>
                  )
                }
              >
                <Typography variant="subtitle1" fontWeight="bold">
                  {step.description}
                </Typography>
              </StepLabel>
              <StepContent>
                <div style={{ marginBottom: '16px' }}>
                  <Typography variant="body2" paragraph>
                    <strong>Action:</strong> {step.action}
                  </Typography>

                  {showSolution && (
                    <>
                      <Typography variant="body2" color="success.main" paragraph>
                        <strong>Expected Result:</strong> {step.expectedResult}
                      </Typography>
                      <Typography variant="body2" color="primary" paragraph>
                        <strong>Explanation:</strong> {step.explanation}
                      </Typography>
                    </>
                  )}

                  {step.diagnostic && (
                    <Paper variant="outlined" sx={{ p: 1, mb: 2, bgcolor: 'grey.50' }}>
                      <Typography variant="caption" fontWeight="bold" display="block">
                        {step.diagnostic.command}
                      </Typography>
                    </Paper>
                  )}

                  <Button
                    variant="contained"
                    size="small"
                    onClick={() => onStepComplete(index)}
                    disabled={completedSteps.has(index)}
                    startIcon={<CheckCircle />}
                  >
                    {completedSteps.has(index) ? 'Completed' : 'Mark Complete'}
                  </Button>
                </div>
              </StepContent>
            </Step>
          ))}
        </Stepper>

        {completedSteps.size === steps.length && (
          <Alert severity="success" sx={{ mt: 3 }}>
            <Typography variant="subtitle1" gutterBottom>
              Congratulations! You&apos;ve completed all troubleshooting steps.
            </Typography>
            <Typography variant="body2">
              Final Score: {score}/100 | Time: {getTimeElapsed(startTime)}
            </Typography>
            {score >= 90 && (
              <Typography variant="body2" sx={{ mt: 1 }}>
                Excellent work! You demonstrated efficient troubleshooting skills.
              </Typography>
            )}
          </Alert>
        )}
      </CardContent>
    </Card>
  );
};
