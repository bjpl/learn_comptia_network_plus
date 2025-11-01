/**
 * CompTIA Network+ - Component 18: IPv4 Troubleshooting Scenarios
 * Interactive network diagnosis and problem-solving tool
 */

import React, { useState } from 'react';
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
  Divider,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Tab,
  Tabs,
} from '@mui/material';
import {
  ExpandMore,
  BugReport,
  CheckCircle,
  Error as ErrorIcon,
  Warning,
  Computer,
  Router,
  CloudQueue,
  PlayArrow,
  Refresh,
  Lightbulb,
  Terminal,
  Build,
} from '@mui/icons-material';
import type { TroubleshootingScenario } from './ipv4-types';
import { troubleshootingScenarios, diagnosticCommands } from './ipv4-data';
import { parseIPAddress } from '../../utils/networking';

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

const TabPanel: React.FC<TabPanelProps> = ({ children, value, index }) => (
  <div hidden={value !== index} style={{ padding: '20px 0' }}>
    {value === index && children}
  </div>
);

const IPv4Troubleshooter: React.FC = () => {
  const [selectedScenario, setSelectedScenario] = useState<TroubleshootingScenario>(
    troubleshootingScenarios[0]
  );
  const [activeStep, setActiveStep] = useState(0);
  const [showHints, setShowHints] = useState(false);
  const [showSolution, setShowSolution] = useState(false);
  const [tabValue, setTabValue] = useState(0);

  // Reset when scenario changes
  const handleScenarioChange = (scenarioId: string) => {
    const scenario = troubleshootingScenarios.find((s) => s.id === scenarioId);
    if (scenario) {
      setSelectedScenario(scenario);
      setActiveStep(0);
      setShowHints(false);
      setShowSolution(false);
      setTabValue(0);
    }
  };

  // Get device icon
  const getDeviceIcon = (type: string) => {
    switch (type) {
      case 'host':
        return <Computer />;
      case 'router':
        return <Router />;
      case 'server':
        return <CloudQueue />;
      default:
        return <Computer />;
    }
  };

  // Get status color
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'online':
        return 'success';
      case 'offline':
        return 'error';
      case 'error':
        return 'error';
      default:
        return 'default';
    }
  };

  // Get difficulty color
  const getDifficultyColor = (difficulty: string) => {
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

  // Classify IP address
  const classifyIPAddress = (ip: string): string => {
    try {
      const info = parseIPAddress(ip);
      if (info.isLoopback) {
        return 'Loopback (127.0.0.0/8)';
      }
      if (info.isMulticast) {
        return 'Multicast (224.0.0.0/4)';
      }
      if (info.isPrivate) {
        return 'Private (RFC 1918)';
      }

      // Check for APIPA
      const octets = ip.split('.').map(Number);
      if (octets[0] === 169 && octets[1] === 254) {
        return 'APIPA (169.254.0.0/16)';
      }

      return `Public (Class ${info.class})`;
    } catch {
      return 'Invalid';
    }
  };

  // Network diagram component
  const NetworkDiagram: React.FC<{ scenario: TroubleshootingScenario }> = ({ scenario }) => (
    <Paper
      variant="outlined"
      sx={{ p: 3, minHeight: 300, position: 'relative', bgcolor: '#f5f5f5' }}
    >
      <Typography variant="subtitle2" gutterBottom>
        Network Topology
      </Typography>
      <Grid container spacing={2}>
        {scenario.devices.map((device) => (
          <Grid item xs={12} sm={6} md={4} key={device.id}>
            <Paper
              elevation={2}
              sx={{
                p: 2,
                borderLeft: 4,
                borderColor: `${getStatusColor(device.status)}.main`,
              }}
            >
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                {getDeviceIcon(device.type)}
                <Typography variant="subtitle2" sx={{ ml: 1 }}>
                  {device.name}
                </Typography>
                <Chip
                  label={device.status}
                  size="small"
                  color={getStatusColor(device.status) as 'success' | 'error' | 'default'}
                  sx={{ ml: 'auto' }}
                />
              </Box>
              <Divider sx={{ my: 1 }} />
              <Typography variant="caption" display="block">
                <strong>IP:</strong> <code>{device.ipAddress}</code>
              </Typography>
              <Typography variant="caption" display="block">
                <strong>Mask:</strong> <code>{device.subnetMask}</code>
              </Typography>
              {device.gateway && (
                <Typography variant="caption" display="block">
                  <strong>Gateway:</strong> <code>{device.gateway}</code>
                </Typography>
              )}
              <Typography variant="caption" display="block" sx={{ mt: 1 }}>
                <strong>Type:</strong> {classifyIPAddress(device.ipAddress)}
              </Typography>
            </Paper>
          </Grid>
        ))}
      </Grid>

      {/* Connection indicators */}
      {scenario.connections.length > 0 && (
        <Box sx={{ mt: 2 }}>
          <Typography variant="caption" color="text.secondary">
            Connections:
          </Typography>
          {scenario.connections.map((conn, index) => (
            <Chip
              key={index}
              label={`${conn.from} ↔ ${conn.to} (${conn.status})`}
              size="small"
              color={
                (conn.status === 'ok'
                  ? 'success'
                  : conn.status === 'degraded'
                    ? 'warning'
                    : 'error') as 'success' | 'warning' | 'error'
              }
              sx={{ m: 0.5 }}
            />
          ))}
        </Box>
      )}
    </Paper>
  );

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom>
        IPv4 Troubleshooting Scenarios
      </Typography>
      <Typography variant="body1" color="text.secondary" paragraph>
        Diagnose and resolve common IPv4 networking problems
      </Typography>

      {/* Scenario Selection */}
      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Grid container spacing={2} alignItems="center">
            <Grid item xs={12} md={8}>
              <FormControl fullWidth>
                <InputLabel>Troubleshooting Scenario</InputLabel>
                <Select
                  value={selectedScenario.id}
                  onChange={(e) => handleScenarioChange(e.target.value)}
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
            <Typography variant="h6">{selectedScenario.title}</Typography>
            <Typography variant="body2" color="text.secondary">
              {selectedScenario.description}
            </Typography>
          </Box>
        </CardContent>
      </Card>

      {/* Main Content Tabs */}
      <Card sx={{ mb: 3 }}>
        <Tabs value={tabValue} onChange={(_, newValue) => setTabValue(newValue as number)}>
          <Tab label="Problem Overview" icon={<BugReport />} iconPosition="start" />
          <Tab label="Network Diagram" icon={<Router />} iconPosition="start" />
          <Tab label="Diagnostics" icon={<Terminal />} iconPosition="start" />
          <Tab label="Solution Steps" icon={<Build />} iconPosition="start" />
        </Tabs>

        {/* Tab 0: Problem Overview */}
        <TabPanel value={tabValue} index={0}>
          <CardContent>
            <Grid container spacing={3}>
              <Grid item xs={12} md={6}>
                <Paper variant="outlined" sx={{ p: 2 }}>
                  <Typography variant="subtitle2" gutterBottom color="success.main">
                    Expected Behavior:
                  </Typography>
                  <Typography variant="body2">{selectedScenario.expectedBehavior}</Typography>
                </Paper>
              </Grid>
              <Grid item xs={12} md={6}>
                <Paper variant="outlined" sx={{ p: 2 }}>
                  <Typography variant="subtitle2" gutterBottom color="error.main">
                    Actual Behavior:
                  </Typography>
                  <Typography variant="body2">{selectedScenario.actualBehavior}</Typography>
                </Paper>
              </Grid>
              <Grid item xs={12}>
                <Alert severity="warning" icon={<Warning />}>
                  <Typography variant="subtitle2" gutterBottom>
                    Symptoms:
                  </Typography>
                  <List dense>
                    {selectedScenario.symptoms.map((symptom, index) => (
                      <ListItem key={index}>
                        <ListItemIcon sx={{ minWidth: 30 }}>
                          <ErrorIcon fontSize="small" color="warning" />
                        </ListItemIcon>
                        <ListItemText primary={symptom} />
                      </ListItem>
                    ))}
                  </List>
                </Alert>
              </Grid>
            </Grid>

            <Box sx={{ mt: 3, display: 'flex', gap: 2 }}>
              <Button
                variant="outlined"
                startIcon={<Lightbulb />}
                onClick={() => setShowHints(!showHints)}
              >
                {showHints ? 'Hide' : 'Show'} Hints
              </Button>
            </Box>

            {showHints && selectedScenario.hints && (
              <Alert severity="info" sx={{ mt: 2 }}>
                <Typography variant="subtitle2" gutterBottom>
                  Hints:
                </Typography>
                <ul style={{ margin: 0, paddingLeft: 20 }}>
                  {selectedScenario.hints.map((hint, index) => (
                    <li key={index}>{hint}</li>
                  ))}
                </ul>
              </Alert>
            )}
          </CardContent>
        </TabPanel>

        {/* Tab 1: Network Diagram */}
        <TabPanel value={tabValue} index={1}>
          <CardContent>
            <NetworkDiagram scenario={selectedScenario} />
          </CardContent>
        </TabPanel>

        {/* Tab 2: Diagnostics */}
        <TabPanel value={tabValue} index={2}>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              Diagnostic Command Output
            </Typography>
            <Grid container spacing={2}>
              {selectedScenario.diagnosticOutputs.map((diagnostic, index) => (
                <Grid item xs={12} key={index}>
                  <Accordion>
                    <AccordionSummary expandIcon={<ExpandMore />}>
                      <Box sx={{ display: 'flex', alignItems: 'center', width: '100%' }}>
                        <Terminal sx={{ mr: 1 }} />
                        <Typography variant="subtitle2">
                          <code>{diagnostic.command}</code>
                        </Typography>
                        <Typography variant="caption" color="text.secondary" sx={{ ml: 'auto' }}>
                          {new Date(diagnostic.timestamp).toLocaleString()}
                        </Typography>
                      </Box>
                    </AccordionSummary>
                    <AccordionDetails>
                      <Paper
                        variant="outlined"
                        sx={{
                          p: 2,
                          bgcolor: '#1e1e1e',
                          color: '#d4d4d4',
                          fontFamily: 'monospace',
                          fontSize: '0.85rem',
                          overflowX: 'auto',
                        }}
                      >
                        <pre style={{ margin: 0 }}>{diagnostic.output}</pre>
                      </Paper>
                    </AccordionDetails>
                  </Accordion>
                </Grid>
              ))}
            </Grid>

            {/* Command Reference */}
            <Box sx={{ mt: 3 }}>
              <Accordion>
                <AccordionSummary expandIcon={<ExpandMore />}>
                  <Typography variant="subtitle2">Diagnostic Commands Reference</Typography>
                </AccordionSummary>
                <AccordionDetails>
                  <Grid container spacing={2}>
                    <Grid item xs={12} md={4}>
                      <Typography variant="caption" color="text.secondary">
                        Windows:
                      </Typography>
                      <List dense>
                        {diagnosticCommands.windows.map((cmd, index) => (
                          <ListItem key={index}>
                            <code style={{ fontSize: '0.8rem' }}>{cmd}</code>
                          </ListItem>
                        ))}
                      </List>
                    </Grid>
                    <Grid item xs={12} md={4}>
                      <Typography variant="caption" color="text.secondary">
                        Linux:
                      </Typography>
                      <List dense>
                        {diagnosticCommands.linux.map((cmd, index) => (
                          <ListItem key={index}>
                            <code style={{ fontSize: '0.8rem' }}>{cmd}</code>
                          </ListItem>
                        ))}
                      </List>
                    </Grid>
                    <Grid item xs={12} md={4}>
                      <Typography variant="caption" color="text.secondary">
                        Cisco IOS:
                      </Typography>
                      <List dense>
                        {diagnosticCommands.cisco.map((cmd, index) => (
                          <ListItem key={index}>
                            <code style={{ fontSize: '0.8rem' }}>{cmd}</code>
                          </ListItem>
                        ))}
                      </List>
                    </Grid>
                  </Grid>
                </AccordionDetails>
              </Accordion>
            </Box>
          </CardContent>
        </TabPanel>

        {/* Tab 3: Solution Steps */}
        <TabPanel value={tabValue} index={3}>
          <CardContent>
            <Box sx={{ mb: 2, display: 'flex', gap: 2 }}>
              <Button
                variant="contained"
                startIcon={<PlayArrow />}
                onClick={() => setShowSolution(!showSolution)}
              >
                {showSolution ? 'Hide' : 'Show'} Solution
              </Button>
              <Button
                variant="outlined"
                startIcon={<Refresh />}
                onClick={() => {
                  setActiveStep(0);
                  setShowSolution(false);
                }}
              >
                Reset
              </Button>
            </Box>

            {showSolution && selectedScenario.solution && (
              <Stepper activeStep={activeStep} orientation="vertical">
                {selectedScenario.solution.map((step, index) => (
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
                          <Box sx={{ mt: 2 }}>
                            <Typography variant="caption" color="text.secondary">
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
                          </Box>
                        )}
                      </Paper>
                      <Box sx={{ mb: 2 }}>
                        <Button
                          variant="contained"
                          onClick={() => setActiveStep(index + 1)}
                          sx={{ mr: 1 }}
                        >
                          {index === selectedScenario.solution!.length - 1 ? 'Finish' : 'Continue'}
                        </Button>
                        {index > 0 && (
                          <Button onClick={() => setActiveStep(index - 1)}>Back</Button>
                        )}
                      </Box>
                    </StepContent>
                  </Step>
                ))}
              </Stepper>
            )}

            {activeStep === selectedScenario.solution?.length && showSolution && (
              <Alert severity="success" icon={<CheckCircle />} sx={{ mt: 2 }}>
                <Typography variant="subtitle2">Troubleshooting Complete!</Typography>
                <Typography variant="body2">
                  You have successfully identified and resolved the {selectedScenario.problemType}{' '}
                  issue.
                </Typography>
              </Alert>
            )}
          </CardContent>
        </TabPanel>
      </Card>

      {/* Educational Reference */}
      <Accordion>
        <AccordionSummary expandIcon={<ExpandMore />}>
          <Typography variant="h6">IPv4 Troubleshooting Guide</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Grid container spacing={2}>
            <Grid item xs={12} md={6}>
              <Typography variant="subtitle2" gutterBottom>
                Common IPv4 Issues:
              </Typography>
              <List dense>
                <ListItem>
                  <ListItemText
                    primary="APIPA (169.254.x.x)"
                    secondary="Indicates DHCP failure - check server and connectivity"
                  />
                </ListItem>
                <ListItem>
                  <ListItemText
                    primary="Private Address Routing"
                    secondary="RFC 1918 addresses need NAT to access internet"
                  />
                </ListItem>
                <ListItem>
                  <ListItemText
                    primary="Multicast on Hosts"
                    secondary="Class D (224-239) is for multicast, not host addressing"
                  />
                </ListItem>
                <ListItem>
                  <ListItemText
                    primary="Loopback Assignment"
                    secondary="127.0.0.0/8 is local-only, cannot be used on interfaces"
                  />
                </ListItem>
                <ListItem>
                  <ListItemText
                    primary="Subnet Mask Mismatch"
                    secondary="All devices on same subnet must use same mask"
                  />
                </ListItem>
              </List>
            </Grid>
            <Grid item xs={12} md={6}>
              <Typography variant="subtitle2" gutterBottom>
                Troubleshooting Methodology:
              </Typography>
              <List dense>
                <ListItem>
                  <ListItemText
                    primary="1. Gather Information"
                    secondary="Collect symptoms, error messages, and configurations"
                  />
                </ListItem>
                <ListItem>
                  <ListItemText
                    primary="2. Identify the Problem"
                    secondary="Use diagnostic tools to pinpoint the issue"
                  />
                </ListItem>
                <ListItem>
                  <ListItemText
                    primary="3. Establish Theory"
                    secondary="Form hypothesis about the root cause"
                  />
                </ListItem>
                <ListItem>
                  <ListItemText
                    primary="4. Test Theory"
                    secondary="Verify your theory with additional diagnostics"
                  />
                </ListItem>
                <ListItem>
                  <ListItemText
                    primary="5. Implement Solution"
                    secondary="Apply fix and verify it resolves the issue"
                  />
                </ListItem>
                <ListItem>
                  <ListItemText
                    primary="6. Document"
                    secondary="Record the problem, solution, and lessons learned"
                  />
                </ListItem>
              </List>
            </Grid>
          </Grid>
        </AccordionDetails>
      </Accordion>
    </Box>
  );
};

export default IPv4Troubleshooter;
