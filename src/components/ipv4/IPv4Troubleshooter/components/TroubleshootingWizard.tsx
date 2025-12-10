/**
 * Step-by-step troubleshooting wizard component
 */
import React from 'react';
import Button from '@mui/material/Button';
import Stepper from '@mui/material/Stepper';
import Step from '@mui/material/Step';
import StepLabel from '@mui/material/StepLabel';
import StepContent from '@mui/material/StepContent';
import Typography from '@mui/material/Typography';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import Alert from '@mui/material/Alert';
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
  <div>
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
            <div style={{ marginTop: '16px' }}>
              <Button variant="contained" onClick={() => setWizardStep(index + 1)} sx={{ mr: 1 }}>
                {index === wizardSteps.length - 1 ? 'Complete' : 'Next'}
              </Button>
              {index > 0 && <Button onClick={() => setWizardStep(index - 1)}>Back</Button>}
            </div>
          </StepContent>
        </Step>
      ))}
    </Stepper>
    {wizardStep === wizardSteps.length && (
      <Alert severity="success" sx={{ mt: 2 }}>
        Troubleshooting wizard completed. All steps have been reviewed.
      </Alert>
    )}
  </div>
);
