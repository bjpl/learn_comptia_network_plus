/**
 * Step-by-step troubleshooting wizard component
 */
import React from 'react';
import {
  Box,
  Button,
  Stepper,
  Step,
  StepLabel,
  StepContent,
  Typography,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Alert,
} from '@mui/material';
import { ChecklistRtl } from '@mui/icons-material';
import { wizardSteps } from '../utils/wizardData';

interface TroubleshootingWizardProps {
  wizardStep: number;
  setWizardStep: (step: number) => void;
}

export const TroubleshootingWizard: React.FC<TroubleshootingWizardProps> = ({
  wizardStep,
  setWizardStep,
}) => (
  <Box>
    <Stepper activeStep={wizardStep} orientation="vertical">
      {wizardSteps.map((step, index) => (
        <Step key={index}>
          <StepLabel>
            <Typography variant="subtitle2">{step.title}</Typography>
          </StepLabel>
          <StepContent>
            <Typography variant="body2" color="text.secondary" paragraph>
              {step.description}
            </Typography>
            <List dense>
              {step.checks.map((check, checkIndex) => (
                <ListItem key={checkIndex}>
                  <ListItemIcon sx={{ minWidth: 32 }}>
                    <ChecklistRtl fontSize="small" color="primary" />
                  </ListItemIcon>
                  <ListItemText primary={check} />
                </ListItem>
              ))}
            </List>
            <Box sx={{ mt: 2 }}>
              <Button variant="contained" onClick={() => setWizardStep(index + 1)} sx={{ mr: 1 }}>
                {index === wizardSteps.length - 1 ? 'Complete' : 'Next'}
              </Button>
              {index > 0 && <Button onClick={() => setWizardStep(index - 1)}>Back</Button>}
            </Box>
          </StepContent>
        </Step>
      ))}
    </Stepper>
    {wizardStep === wizardSteps.length && (
      <Alert severity="success" sx={{ mt: 2 }}>
        Troubleshooting wizard completed. All steps have been reviewed.
      </Alert>
    )}
  </Box>
);
