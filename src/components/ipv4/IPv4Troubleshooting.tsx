/**
 * CompTIA Network+ - Component 18: IPv4 Troubleshooting Scenarios
 * Interactive troubleshooting with network diagrams, diagnostic tools, and step-by-step solutions
 */

import React, { useState, useEffect } from 'react';
import {
  Box,
  Button,
  Card,
  CardContent,
  Typography,
  Grid,
  Paper,
  Chip,
  Alert,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Stepper,
  Step,
  StepLabel,
  StepContent,
  List,
  ListItem,
  ListItemText,
  Divider,
  LinearProgress,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from '@mui/material';
import {
  ExpandMore,
  BugReport,
  CheckCircle,
  Error,
  Refresh,
  Lightbulb,
  Terminal,
  NetworkCheck,
  Router,
  Computer,
  Storage,
} from '@mui/icons-material';
import type { TroubleshootingScenario, DiagnosticOutput } from './ipv4-types';
import { troubleshootingScenarios } from './ipv4-data';

const IPv4Troubleshooting: React.FC = () => {
  const [selectedScenario, setSelectedScenario] = useState<TroubleshootingScenario>(
    troubleshootingScenarios[0]
  );
  const [activeStep, setActiveStep] = useState(0);
  const [showHints, setShowHints] = useState(false);
  const [showSolution, setShowSolution] = useState(false);
  const [, setUserDiagnosis] = useState('');
  const [completedSteps, setCompletedSteps] = useState<Set<number>>(new Set());
  const [score, setScore] = useState(0);
  const [startTime, setStartTime] = useState<number | null>(null);
  const [showDiagnosticDialog, setShowDiagnosticDialog] = useState(false);
  const [selectedDiagnostic, setSelectedDiagnostic] = useState<DiagnosticOutput | null>(null);

  // Reset when scenario changes
  useEffect(() => {
    setActiveStep(0);
    setCompletedSteps(new Set());
    setScore(0);
    setShowHints(false);
    setShowSolution(false);
    setUserDiagnosis('');
    setStartTime(Date.now());
  }, [selectedScenario]);

  // Get difficulty color
  const getDifficultyColor = (difficulty: string): 'success' | 'warning' | 'error' | 'default' => {
    switch (difficulty) {
      case 'beginner':
        return 'success';
      case 'intermediate':
        return 'warning';
      case 'advanced':
        return 'error';
      default:
        return 'default';
    }
  };

  // Get problem type color
  const getProblemTypeColor = (type: string) => {
    const colorMap: Record<string, 'error' | 'warning' | 'info' | 'success'> = {
      apipa: 'warning',
      private_routing: 'info',
      multicast_host: 'error',
      loopback_interface: 'error',
      network_address: 'error',
      broadcast_address: 'error',
      subnet_mismatch: 'warning',
      duplicate_ip: 'error',
      wrong_gateway: 'warning',
    };
    return colorMap[type] || 'default';
  };

  // Get device icon
  const getDeviceIcon = (type: string) => {
    switch (type) {
      case 'host':
        return <Computer />;
      case 'server':
        return <Storage />;
      case 'router':
        return <Router />;
      case 'switch':
        return <NetworkCheck />;
      default:
        return <Computer />;
    }
  };

  // Handle step completion
  const handleStepComplete = (stepIndex: number) => {
    const newCompleted = new Set(completedSteps);
    newCompleted.add(stepIndex);
    setCompletedSteps(newCompleted);

    // Calculate score based on efficiency
    const stepPoints = 100 / (selectedScenario.solution?.length || 1);
    const penaltyForHints = showHints ? 10 : 0;
    const newScore = Math.round(newCompleted.size * stepPoints - penaltyForHints);
    setScore(Math.max(0, Math.min(100, newScore)));

    // Move to next step
    if (stepIndex < (selectedScenario.solution?.length || 0) - 1) {
      setActiveStep(stepIndex + 1);
    }
  };

  // Reset troubleshooting
  const handleReset = () => {
    setActiveStep(0);
    setCompletedSteps(new Set());
    setScore(0);
    setShowHints(false);
    setShowSolution(false);
    setUserDiagnosis('');
    setStartTime(Date.now());
  };

  // Calculate time elapsed
  const getTimeElapsed = () => {
    if (!startTime) {
      return '0:00';
    }
    const seconds = Math.floor((Date.now() - startTime) / 1000);
    const minutes = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${minutes}:${secs.toString().padStart(2, '0')}`;
  };

  // Show diagnostic output
  const handleShowDiagnostic = (diagnostic: DiagnosticOutput) => {
    setSelectedDiagnostic(diagnostic);
    setShowDiagnosticDialog(true);
  };

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom className="text-gray-900 dark:text-white">
        IPv4 Troubleshooting Scenarios
      </Typography>
      <Typography variant="body1" className="text-gray-700 dark:text-gray-300" paragraph>
        Diagnose and resolve IPv4 networking issues using systematic troubleshooting methods
      </Typography>

      {/* Scenario Selection */}
      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Grid container spacing={2} alignItems="center">
            <Grid item xs={12} md={6}>
              <FormControl fullWidth>
                <InputLabel>Scenario</InputLabel>
                <Select
                  value={selectedScenario.id}
                  onChange={(e) => {
                    const scenario = troubleshootingScenarios.find((s) => s.id === e.target.value);
                    if (scenario) {
                      setSelectedScenario(scenario);
                    }
                  }}
                  label="Scenario"
                >
                  {troubleshootingScenarios.map((scenario) => (
                    <MenuItem key={scenario.id} value={scenario.id}>
                      {scenario.title}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={6} md={3}>
              <Chip
                label={selectedScenario.difficulty.toUpperCase()}
                color={getDifficultyColor(selectedScenario.difficulty)}
                size="small"
              />
            </Grid>
            <Grid item xs={6} md={3}>
              <Chip
                icon={<BugReport />}
                label={selectedScenario.problemType.replace('_', ' ').toUpperCase()}
                color={getProblemTypeColor(selectedScenario.problemType)}
                size="small"
              />
            </Grid>
          </Grid>

          <Box sx={{ mt: 2 }}>
            <Typography variant="h6" className="text-gray-900 dark:text-white">{selectedScenario.title}</Typography>
            <Typography variant="body2" className="text-gray-700 dark:text-gray-300">
              {selectedScenario.description}
            </Typography>
          </Box>
        </CardContent>
      </Card>

      {/* Progress and Score */}
      <Grid container spacing={2} sx={{ mb: 3 }}>
        <Grid item xs={12} sm={4}>
          <Paper sx={{ p: 2 }}>
            <Typography variant="caption" className="text-gray-700 dark:text-gray-300">
              Score
            </Typography>
            <Typography variant="h3" color="primary">
              {score}
            </Typography>
            <LinearProgress variant="determinate" value={score} sx={{ mt: 1 }} />
          </Paper>
        </Grid>
        <Grid item xs={12} sm={4}>
          <Paper sx={{ p: 2 }}>
            <Typography variant="caption" className="text-gray-700 dark:text-gray-300">
              Progress
            </Typography>
            <Typography variant="h3" color="success.main">
              {completedSteps.size}/{selectedScenario.solution?.length || 0}
            </Typography>
            <LinearProgress
              variant="determinate"
              value={(completedSteps.size / (selectedScenario.solution?.length || 1)) * 100}
              color="success"
              sx={{ mt: 1 }}
            />
          </Paper>
        </Grid>
        <Grid item xs={12} sm={4}>
          <Paper sx={{ p: 2 }}>
            <Typography variant="caption" className="text-gray-700 dark:text-gray-300">
              Time Elapsed
            </Typography>
            <Typography variant="h3" color="warning.main">
              {getTimeElapsed()}
            </Typography>
          </Paper>
        </Grid>
      </Grid>

      {/* Network Diagram */}
      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            Network Diagram
          </Typography>
          <Paper
            variant="outlined"
            sx={{
              p: 3,
              minHeight: 200,
              bgcolor: 'grey.50',
              position: 'relative',
              overflow: 'auto',
            }}
          >
            {/* Simplified network diagram */}
            <Grid container spacing={3} justifyContent="center" alignItems="center">
              {selectedScenario.devices.map((device) => (
                <Grid item key={device.id}>
                  <Paper
                    elevation={3}
                    sx={{
                      p: 2,
                      textAlign: 'center',
                      minWidth: 120,
                      bgcolor:
                        device.status === 'error'
                          ? 'error.light'
                          : device.status === 'offline'
                            ? 'grey.300'
                            : 'success.light',
                      color:
                        device.status === 'error'
                          ? 'error.contrastText'
                          : device.status === 'offline'
                            ? 'text.secondary'
                            : 'success.contrastText',
                    }}
                  >
                    <Box sx={{ display: 'flex', justifyContent: 'center', mb: 1 }}>
                      {getDeviceIcon(device.type)}
                    </Box>
                    <Typography variant="subtitle2" fontWeight="bold">
                      {device.name}
                    </Typography>
                    <Typography variant="caption" display="block">
                      {device.ipAddress}
                    </Typography>
                    {device.subnetMask && (
                      <Typography variant="caption" display="block">
                        /{device.subnetMask}
                      </Typography>
                    )}
                    {device.gateway && (
                      <Typography variant="caption" display="block">
                        GW: {device.gateway}
                      </Typography>
                    )}
                  </Paper>
                </Grid>
              ))}
            </Grid>
          </Paper>
        </CardContent>
      </Card>

      {/* Symptoms */}
      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            Observed Symptoms
          </Typography>
          <List dense>
            {selectedScenario.symptoms.map((symptom, index) => (
              <ListItem key={index}>
                <Error color="error" sx={{ mr: 1 }} fontSize="small" />
                <ListItemText primary={symptom} />
              </ListItem>
            ))}
          </List>

          <Divider sx={{ my: 2 }} />

          <Grid container spacing={2}>
            <Grid item xs={12} md={6}>
              <Typography variant="subtitle2" color="success.main" gutterBottom>
                Expected Behavior:
              </Typography>
              <Typography variant="body2" className="text-gray-800 dark:text-gray-200">{selectedScenario.expectedBehavior}</Typography>
            </Grid>
            <Grid item xs={12} md={6}>
              <Typography variant="subtitle2" color="error.main" gutterBottom>
                Actual Behavior:
              </Typography>
              <Typography variant="body2" className="text-gray-800 dark:text-gray-200">{selectedScenario.actualBehavior}</Typography>
            </Grid>
          </Grid>
        </CardContent>
      </Card>

      {/* Diagnostic Outputs */}
      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            Diagnostic Command Outputs
          </Typography>
          <Grid container spacing={2}>
            {selectedScenario.diagnosticOutputs.map((diagnostic, index) => (
              <Grid item xs={12} md={6} key={index}>
                <Paper
                  variant="outlined"
                  sx={{ p: 2, cursor: 'pointer', '&:hover': { bgcolor: 'action.hover' } }}
                  onClick={() => handleShowDiagnostic(diagnostic)}
                >
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                    <Terminal sx={{ mr: 1 }} color="primary" />
                    <Typography variant="subtitle2" fontWeight="bold">
                      {diagnostic.command}
                    </Typography>
                  </Box>
                  <Typography variant="caption" className="text-gray-700 dark:text-gray-300">
                    Click to view output
                  </Typography>
                </Paper>
              </Grid>
            ))}
          </Grid>
        </CardContent>
      </Card>

      {/* Action Buttons */}
      <Box sx={{ mb: 3, display: 'flex', gap: 2, flexWrap: 'wrap' }}>
        <Button
          variant="outlined"
          startIcon={<Lightbulb />}
          onClick={() => setShowHints(!showHints)}
        >
          {showHints ? 'Hide' : 'Show'} Hints
        </Button>
        <Button variant="outlined" onClick={() => setShowSolution(!showSolution)}>
          {showSolution ? 'Hide' : 'Show'} Solution
        </Button>
        <Button variant="outlined" startIcon={<Refresh />} onClick={handleReset}>
          Reset
        </Button>
      </Box>

      {/* Hints */}
      {showHints && selectedScenario.hints && (
        <Alert severity="info" sx={{ mb: 3 }}>
          <Typography variant="subtitle2" gutterBottom>
            Troubleshooting Hints:
          </Typography>
          <ul style={{ margin: 0, paddingLeft: 20 }}>
            {selectedScenario.hints.map((hint, index) => (
              <li key={index}>{hint}</li>
            ))}
          </ul>
        </Alert>
      )}

      {/* Solution Steps */}
      {selectedScenario.solution && (
        <Card sx={{ mb: 3 }}>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              Troubleshooting Steps
            </Typography>

            <Stepper activeStep={activeStep} orientation="vertical">
              {selectedScenario.solution.map((step, index) => (
                <Step key={step.id} completed={completedSteps.has(index)}>
                  <StepLabel
                    optional={
                      showSolution && (
                        <Typography variant="caption">Step {step.stepNumber}</Typography>
                      )
                    }
                    StepIconComponent={() =>
                      completedSteps.has(index) ? (
                        <CheckCircle color="success" />
                      ) : (
                        <Box
                          sx={{
                            width: 24,
                            height: 24,
                            borderRadius: '50%',
                            bgcolor: activeStep === index ? 'primary.main' : 'grey.300',
                            color: 'white',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                          }}
                        >
                          {step.stepNumber}
                        </Box>
                      )
                    }
                  >
                    <Typography variant="subtitle1" fontWeight="bold">
                      {step.description}
                    </Typography>
                  </StepLabel>
                  <StepContent>
                    <Box sx={{ mb: 2 }}>
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
                        onClick={() => handleStepComplete(index)}
                        disabled={completedSteps.has(index)}
                        startIcon={<CheckCircle />}
                      >
                        {completedSteps.has(index) ? 'Completed' : 'Mark Complete'}
                      </Button>
                    </Box>
                  </StepContent>
                </Step>
              ))}
            </Stepper>

            {completedSteps.size === selectedScenario.solution.length && (
              <Alert severity="success" sx={{ mt: 3 }}>
                <Typography variant="subtitle1" gutterBottom>
                  Congratulations! You&apos;ve completed all troubleshooting steps.
                </Typography>
                <Typography variant="body2">
                  Final Score: {score}/100 | Time: {getTimeElapsed()}
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
      )}

      {/* Educational Reference */}
      <Accordion>
        <AccordionSummary expandIcon={<ExpandMore />}>
          <Typography variant="h6">Troubleshooting Methodology</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Typography variant="subtitle2" gutterBottom>
            Systematic Troubleshooting Approach:
          </Typography>
          <ol>
            <li>
              <strong>Identify the Problem:</strong> Gather symptoms and user reports
            </li>
            <li>
              <strong>Establish Theory:</strong> Consider possible causes based on symptoms
            </li>
            <li>
              <strong>Test Theory:</strong> Use diagnostic tools to verify hypothesis
            </li>
            <li>
              <strong>Establish Action Plan:</strong> Determine steps to resolve issue
            </li>
            <li>
              <strong>Implement Solution:</strong> Apply fixes methodically
            </li>
            <li>
              <strong>Verify Functionality:</strong> Confirm problem is resolved
            </li>
            <li>
              <strong>Document:</strong> Record findings and resolution for future reference
            </li>
          </ol>

          <Divider sx={{ my: 2 }} />

          <Typography variant="subtitle2" gutterBottom>
            Essential Diagnostic Commands:
          </Typography>
          <Grid container spacing={2}>
            <Grid item xs={12} md={6}>
              <Typography variant="caption" display="block" fontWeight="bold">
                Windows:
              </Typography>
              <ul style={{ fontSize: '0.875rem' }}>
                <li>
                  <code>ipconfig /all</code> - View IP configuration
                </li>
                <li>
                  <code>ping [address]</code> - Test connectivity
                </li>
                <li>
                  <code>tracert [address]</code> - Trace route path
                </li>
                <li>
                  <code>arp -a</code> - View ARP cache
                </li>
                <li>
                  <code>route print</code> - Display routing table
                </li>
              </ul>
            </Grid>
            <Grid item xs={12} md={6}>
              <Typography variant="caption" display="block" fontWeight="bold">
                Linux:
              </Typography>
              <ul style={{ fontSize: '0.875rem' }}>
                <li>
                  <code>ip addr show</code> - Show IP addresses
                </li>
                <li>
                  <code>ping [address]</code> - Test connectivity
                </li>
                <li>
                  <code>traceroute [address]</code> - Trace route
                </li>
                <li>
                  <code>arp -n</code> - Show ARP table
                </li>
                <li>
                  <code>ip route show</code> - Display routes
                </li>
              </ul>
            </Grid>
          </Grid>
        </AccordionDetails>
      </Accordion>

      {/* Diagnostic Output Dialog */}
      <Dialog
        open={showDiagnosticDialog}
        onClose={() => setShowDiagnosticDialog(false)}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <Terminal sx={{ mr: 1 }} />
            {selectedDiagnostic?.command}
          </Box>
        </DialogTitle>
        <DialogContent>
          <Paper
            variant="outlined"
            sx={{
              p: 2,
              bgcolor: 'grey.900',
              color: 'grey.100',
              fontFamily: 'monospace',
              fontSize: '0.875rem',
              whiteSpace: 'pre-wrap',
              overflowX: 'auto',
            }}
          >
            {selectedDiagnostic?.output}
          </Paper>
          {selectedDiagnostic?.timestamp && (
            <Typography variant="caption" className="text-gray-700 dark:text-gray-300" sx={{ mt: 1, display: 'block' }}>
              Timestamp: {new Date(selectedDiagnostic.timestamp).toLocaleString()}
            </Typography>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setShowDiagnosticDialog(false)}>Close</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default IPv4Troubleshooting;
