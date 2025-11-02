/**
 * CompTIA Network+ - Component 18: IPv4 Troubleshooting Scenarios
 * Interactive network diagnosis and problem-solving tool with advanced troubleshooting features
 */

import React, { useState, useMemo } from 'react';
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
  TextField,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
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
  Settings,
  ChecklistRtl,
  Storage,
  NetworkCheck,
} from '@mui/icons-material';
import type { TroubleshootingScenario } from './ipv4-types';
import { troubleshootingScenarios, diagnosticCommands } from './ipv4-data';
import { parseIPAddress } from '../../utils/networking';

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

interface RoutingTableEntry {
  destination: string;
  netmask: string;
  gateway: string;
  interface: string;
  metric: number;
  status: 'valid' | 'invalid' | 'warning';
}

interface ARPEntry {
  ipAddress: string;
  macAddress: string;
  interface: string;
  type: 'static' | 'dynamic' | 'invalid';
}

interface ValidationResult {
  field: string;
  status: 'valid' | 'invalid' | 'warning';
  message: string;
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
  const [validatorOpen, setValidatorOpen] = useState(false);
  const [validatorIP, setValidatorIP] = useState('192.168.1.100');
  const [validatorMask, setValidatorMask] = useState('255.255.255.0');
  const [validatorGateway, setValidatorGateway] = useState('192.168.1.1');
  const [wizardStep, setWizardStep] = useState(0);
  const [showRoutingTable, setShowRoutingTable] = useState(false);
  const [showARPTable, setShowARPTable] = useState(false);

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

  // IP Configuration Validator
  const validateIPConfiguration = (): ValidationResult[] => {
    const results: ValidationResult[] = [];

    // Validate IP address
    try {
      parseIPAddress(validatorIP);
      const classification = classifyIPAddress(validatorIP);

      if (classification === 'Invalid') {
        results.push({ field: 'IP Address', status: 'invalid', message: 'Invalid IP format' });
      } else if (classification === 'Loopback (127.0.0.0/8)') {
        results.push({
          field: 'IP Address',
          status: 'warning',
          message: 'Loopback address detected - use only for testing',
        });
      } else if (classification === 'Multicast (224.0.0.0/4)') {
        results.push({
          field: 'IP Address',
          status: 'invalid',
          message: 'Multicast addresses cannot be assigned to hosts',
        });
      } else {
        results.push({ field: 'IP Address', status: 'valid', message: `Valid ${classification}` });
      }
    } catch {
      results.push({
        field: 'IP Address',
        status: 'invalid',
        message: 'Invalid IP address format',
      });
    }

    // Validate subnet mask
    try {
      const maskOctets = validatorMask.split('.').map(Number);
      if (maskOctets.some((octet) => octet < 0 || octet > 255)) {
        results.push({
          field: 'Subnet Mask',
          status: 'invalid',
          message: 'Mask octets must be 0-255',
        });
      } else {
        results.push({ field: 'Subnet Mask', status: 'valid', message: 'Valid subnet mask' });
      }
    } catch {
      results.push({ field: 'Subnet Mask', status: 'invalid', message: 'Invalid mask format' });
    }

    // Validate gateway
    try {
      parseIPAddress(validatorGateway);
      results.push({ field: 'Default Gateway', status: 'valid', message: 'Valid gateway address' });
    } catch {
      results.push({
        field: 'Default Gateway',
        status: 'invalid',
        message: 'Invalid gateway format',
      });
    }

    // Cross-check IP and gateway are in same subnet
    if (validatorIP && validatorGateway && validatorMask) {
      const ipOctets = validatorIP.split('.').map(Number);
      const gwOctets = validatorGateway.split('.').map(Number);
      const maskOctets = validatorMask.split('.').map(Number);

      let sameSubnet = true;
      for (let i = 0; i < 4; i++) {
        if ((ipOctets[i] & maskOctets[i]) !== (gwOctets[i] & maskOctets[i])) {
          sameSubnet = false;
          break;
        }
      }

      if (!sameSubnet) {
        results.push({
          field: 'Subnet Consistency',
          status: 'invalid',
          message: 'IP and gateway are not on the same subnet',
        });
      } else {
        results.push({
          field: 'Subnet Consistency',
          status: 'valid',
          message: 'IP and gateway are on the same subnet',
        });
      }
    }

    return results;
  };

  const validationResults = useMemo(
    () => validateIPConfiguration(),
    [validatorIP, validatorMask, validatorGateway]
  );

  // Generate routing table for scenario
  const generateRoutingTable = (): RoutingTableEntry[] => {
    return [
      {
        destination: '192.168.1.0',
        netmask: '255.255.255.0',
        gateway: '0.0.0.0',
        interface: 'Local',
        metric: 0,
        status: 'valid',
      },
      {
        destination: '192.168.0.0',
        netmask: '255.255.0.0',
        gateway: '192.168.1.1',
        interface: 'Eth0',
        metric: 1,
        status: 'valid',
      },
      {
        destination: '0.0.0.0',
        netmask: '0.0.0.0',
        gateway: '192.168.1.1',
        interface: 'Eth0',
        metric: 10,
        status: 'valid',
      },
    ];
  };

  // Generate ARP table for scenario
  const generateARPTable = (): ARPEntry[] => {
    return [
      {
        ipAddress: '192.168.1.1',
        macAddress: '00-1B-D4-3F-2A-1C',
        interface: 'Eth0',
        type: 'dynamic',
      },
      {
        ipAddress: '192.168.1.10',
        macAddress: '08-00-27-4A-BC-1F',
        interface: 'Eth0',
        type: 'dynamic',
      },
      {
        ipAddress: '192.168.1.255',
        macAddress: 'FF-FF-FF-FF-FF-FF',
        interface: 'Eth0',
        type: 'invalid',
      },
    ];
  };

  const routingTable = useMemo(() => generateRoutingTable(), []);
  const arpTable = useMemo(() => generateARPTable(), []);

  // Routing Table Component
  const RoutingTableComponent: React.FC = () => (
    <TableContainer component={Paper}>
      <Table size="small">
        <TableHead>
          <TableRow sx={{ backgroundColor: '#f5f5f5' }}>
            <TableCell>
              <strong>Destination</strong>
            </TableCell>
            <TableCell>
              <strong>Netmask</strong>
            </TableCell>
            <TableCell>
              <strong>Gateway</strong>
            </TableCell>
            <TableCell>
              <strong>Interface</strong>
            </TableCell>
            <TableCell align="center">
              <strong>Metric</strong>
            </TableCell>
            <TableCell align="center">
              <strong>Status</strong>
            </TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {routingTable.map((entry, index) => (
            <TableRow key={index} sx={{ '&:hover': { backgroundColor: '#f9f9f9' } }}>
              <TableCell>
                <code>{entry.destination}</code>
              </TableCell>
              <TableCell>
                <code>{entry.netmask}</code>
              </TableCell>
              <TableCell>
                <code>{entry.gateway}</code>
              </TableCell>
              <TableCell>{entry.interface}</TableCell>
              <TableCell align="center">{entry.metric}</TableCell>
              <TableCell align="center">
                <Chip
                  label={entry.status}
                  size="small"
                  color={entry.status === 'valid' ? 'success' : 'error'}
                />
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );

  // ARP Table Component
  const ARPTableComponent: React.FC = () => (
    <TableContainer component={Paper}>
      <Table size="small">
        <TableHead>
          <TableRow sx={{ backgroundColor: '#f5f5f5' }}>
            <TableCell>
              <strong>IP Address</strong>
            </TableCell>
            <TableCell>
              <strong>MAC Address</strong>
            </TableCell>
            <TableCell>
              <strong>Interface</strong>
            </TableCell>
            <TableCell align="center">
              <strong>Type</strong>
            </TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {arpTable.map((entry, index) => (
            <TableRow key={index} sx={{ '&:hover': { backgroundColor: '#f9f9f9' } }}>
              <TableCell>
                <code>{entry.ipAddress}</code>
              </TableCell>
              <TableCell>
                <code>{entry.macAddress}</code>
              </TableCell>
              <TableCell>{entry.interface}</TableCell>
              <TableCell align="center">
                <Chip
                  label={entry.type}
                  size="small"
                  color={
                    entry.type === 'invalid'
                      ? 'error'
                      : entry.type === 'static'
                        ? 'primary'
                        : 'default'
                  }
                />
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );

  // IP Configuration Validator Dialog
  const ValidatorDialog: React.FC = () => (
    <Dialog open={validatorOpen} onClose={() => setValidatorOpen(false)} maxWidth="sm" fullWidth>
      <DialogTitle>IP Configuration Validator</DialogTitle>
      <DialogContent sx={{ pt: 2 }}>
        <Grid container spacing={2} sx={{ mb: 3 }}>
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="IP Address"
              value={validatorIP}
              onChange={(e) => setValidatorIP(e.target.value)}
              placeholder="192.168.1.100"
              size="small"
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Subnet Mask"
              value={validatorMask}
              onChange={(e) => setValidatorMask(e.target.value)}
              placeholder="255.255.255.0"
              size="small"
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Default Gateway"
              value={validatorGateway}
              onChange={(e) => setValidatorGateway(e.target.value)}
              placeholder="192.168.1.1"
              size="small"
            />
          </Grid>
        </Grid>

        <Typography variant="subtitle2" sx={{ mb: 1 }}>
          Validation Results:
        </Typography>
        {validationResults.map((result, index) => (
          <Alert
            key={index}
            severity={
              result.status === 'valid'
                ? 'success'
                : result.status === 'warning'
                  ? 'warning'
                  : 'error'
            }
            sx={{ mb: 1 }}
          >
            <Typography variant="body2">
              <strong>{result.field}:</strong> {result.message}
            </Typography>
          </Alert>
        ))}
      </DialogContent>
      <DialogActions>
        <Button onClick={() => setValidatorOpen(false)}>Close</Button>
      </DialogActions>
    </Dialog>
  );

  // Troubleshooting Wizard
  const TroubleshootingWizard: React.FC = () => {
    const wizardSteps = [
      {
        title: 'Check Physical Connectivity',
        description: 'Verify cable connections and link lights are active',
        checks: [
          'Check Ethernet cable is properly connected',
          'Verify link light is illuminated (green)',
          'Look for any damage to the connector',
        ],
      },
      {
        title: 'Verify IP Configuration',
        description: 'Check if device has valid IP address assigned',
        checks: [
          'Run ipconfig (Windows) or ifconfig (Linux)',
          'Verify IP is not APIPA (169.254.x.x)',
          'Confirm subnet mask is correct',
        ],
      },
      {
        title: 'Test Gateway Connectivity',
        description: 'Ensure default gateway is reachable',
        checks: [
          'Ping default gateway IP',
          'Check ARP table for gateway MAC address',
          'Verify gateway is on same subnet',
        ],
      },
      {
        title: 'Check Routing',
        description: 'Verify routing table is correct',
        checks: [
          'Review routing table with route print (Windows) or ip route (Linux)',
          'Confirm default route points to gateway',
          'Look for any invalid or duplicate routes',
        ],
      },
      {
        title: 'Test DNS Resolution',
        description: 'Verify DNS is working properly',
        checks: [
          'Ping known IP address to test connectivity',
          'Use nslookup or dig to test DNS',
          'Verify DNS servers are configured',
        ],
      },
    ];

    return (
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
                  <Button
                    variant="contained"
                    onClick={() => setWizardStep(index + 1)}
                    sx={{ mr: 1 }}
                  >
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
              <Typography variant="caption" display="block" className="text-gray-800 dark:text-gray-200">
                <strong>IP:</strong> <code>{device.ipAddress}</code>
              </Typography>
              <Typography variant="caption" display="block" className="text-gray-800 dark:text-gray-200">
                <strong>Mask:</strong> <code>{device.subnetMask}</code>
              </Typography>
              {device.gateway && (
                <Typography variant="caption" display="block" className="text-gray-800 dark:text-gray-200">
                  <strong>Gateway:</strong> <code>{device.gateway}</code>
                </Typography>
              )}
              <Typography variant="caption" display="block" sx={{ mt: 1 }} className="text-gray-800 dark:text-gray-200">
                <strong>Type:</strong> {classifyIPAddress(device.ipAddress)}
              </Typography>
            </Paper>
          </Grid>
        ))}
      </Grid>

      {/* Connection indicators */}
      {scenario.connections.length > 0 && (
        <Box sx={{ mt: 2 }}>
          <Typography variant="caption" className="text-gray-700 dark:text-gray-300">
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
    <div style={{ padding: '24px' }}>
      <Typography variant="h4" gutterBottom className="text-gray-900 dark:text-white">
        IPv4 Troubleshooting Scenarios
      </Typography>
      <Typography variant="body1" className="text-gray-700 dark:text-gray-300" paragraph>
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
            <Typography variant="h6" className="text-gray-900 dark:text-white">{selectedScenario.title}</Typography>
            <Typography variant="body2" className="text-gray-700 dark:text-gray-300">
              {selectedScenario.description}
            </Typography>
          </Box>
        </CardContent>
      </Card>

      {/* Main Content Tabs */}
      <Card sx={{ mb: 3 }}>
        <Tabs
          value={tabValue}
          onChange={(_, newValue) => setTabValue(newValue as number)}
          variant="scrollable"
          scrollButtons="auto"
        >
          <Tab label="Problem Overview" icon={<BugReport />} iconPosition="start" />
          <Tab label="Network Diagram" icon={<Router />} iconPosition="start" />
          <Tab label="Diagnostics" icon={<Terminal />} iconPosition="start" />
          <Tab label="Solution Steps" icon={<Build />} iconPosition="start" />
          <Tab label="Troubleshooting Wizard" icon={<ChecklistRtl />} iconPosition="start" />
          <Tab label="Validator" icon={<Settings />} iconPosition="start" />
          <Tab label="Routing Table" icon={<NetworkCheck />} iconPosition="start" />
          <Tab label="ARP Table" icon={<Storage />} iconPosition="start" />
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
                  <Typography variant="body2" className="text-gray-800 dark:text-gray-200">{selectedScenario.expectedBehavior}</Typography>
                </Paper>
              </Grid>
              <Grid item xs={12} md={6}>
                <Paper variant="outlined" sx={{ p: 2 }}>
                  <Typography variant="subtitle2" gutterBottom color="error.main">
                    Actual Behavior:
                  </Typography>
                  <Typography variant="body2" className="text-gray-800 dark:text-gray-200">{selectedScenario.actualBehavior}</Typography>
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
                        <Typography variant="caption" className="text-gray-700 dark:text-gray-300" sx={{ ml: 'auto' }}>
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
                      <Typography variant="caption" className="text-gray-700 dark:text-gray-300">
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
                      <Typography variant="caption" className="text-gray-700 dark:text-gray-300">
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
                      <Typography variant="caption" className="text-gray-700 dark:text-gray-300">
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

        {/* Tab 4: Troubleshooting Wizard */}
        <TabPanel value={tabValue} index={4}>
          <CardContent>
            <Box sx={{ mb: 2 }}>
              <Typography variant="h6" gutterBottom className="text-gray-900 dark:text-white">
                Step-by-Step Troubleshooting Guide
              </Typography>
              <Typography variant="body2" className="text-gray-700 dark:text-gray-300" paragraph>
                Follow these methodical steps to diagnose IPv4 connectivity issues
              </Typography>
            </Box>
            <TroubleshootingWizard />
          </CardContent>
        </TabPanel>

        {/* Tab 5: IP Configuration Validator */}
        <TabPanel value={tabValue} index={5}>
          <CardContent>
            <Box sx={{ mb: 2 }}>
              <Typography variant="h6" gutterBottom className="text-gray-900 dark:text-white">
                IP Configuration Validator
              </Typography>
              <Typography variant="body2" className="text-gray-700 dark:text-gray-300" paragraph>
                Validate your IP configuration against common issues and best practices
              </Typography>
            </Box>
            <Grid container spacing={2}>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="IP Address"
                  value={validatorIP}
                  onChange={(e) => setValidatorIP(e.target.value)}
                  placeholder="192.168.1.100"
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Subnet Mask"
                  value={validatorMask}
                  onChange={(e) => setValidatorMask(e.target.value)}
                  placeholder="255.255.255.0"
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Default Gateway"
                  value={validatorGateway}
                  onChange={(e) => setValidatorGateway(e.target.value)}
                  placeholder="192.168.1.1"
                />
              </Grid>
            </Grid>

            <Box sx={{ mt: 3 }}>
              <Typography variant="subtitle2" sx={{ mb: 2 }}>
                Validation Results:
              </Typography>
              {validationResults.map((result, index) => (
                <Alert
                  key={index}
                  severity={
                    result.status === 'valid'
                      ? 'success'
                      : result.status === 'warning'
                        ? 'warning'
                        : 'error'
                  }
                  sx={{ mb: 1 }}
                >
                  <Typography variant="body2">
                    <strong>{result.field}:</strong> {result.message}
                  </Typography>
                </Alert>
              ))}
            </Box>
          </CardContent>
        </TabPanel>

        {/* Tab 6: Routing Table */}
        <TabPanel value={tabValue} index={6}>
          <CardContent>
            <Box sx={{ mb: 2 }}>
              <Typography variant="h6" gutterBottom className="text-gray-900 dark:text-white">
                Routing Table Analysis
              </Typography>
              <Typography variant="body2" className="text-gray-700 dark:text-gray-300" paragraph>
                Review the current routing table for the host or network. Incorrect routing tables
                can cause connectivity issues.
              </Typography>
            </Box>
            <Box sx={{ mb: 2 }}>
              <Button
                variant="contained"
                onClick={() => setShowRoutingTable(!showRoutingTable)}
                startIcon={<NetworkCheck />}
              >
                {showRoutingTable ? 'Hide' : 'Show'} Routing Table
              </Button>
            </Box>
            {showRoutingTable && <RoutingTableComponent />}
            <Alert severity="info" sx={{ mt: 2 }}>
              <Typography variant="body2">
                <strong>Tips:</strong> The default route (0.0.0.0/0) should point to your gateway.
                All other routes should have valid gateways on the same network as the interface.
              </Typography>
            </Alert>
          </CardContent>
        </TabPanel>

        {/* Tab 7: ARP Table */}
        <TabPanel value={tabValue} index={7}>
          <CardContent>
            <Box sx={{ mb: 2 }}>
              <Typography variant="h6" gutterBottom className="text-gray-900 dark:text-white">
                ARP Table Simulator
              </Typography>
              <Typography variant="body2" className="text-gray-700 dark:text-gray-300" paragraph>
                Address Resolution Protocol (ARP) table maps IP addresses to MAC addresses. Invalid
                entries can prevent communication.
              </Typography>
            </Box>
            <Box sx={{ mb: 2 }}>
              <Button
                variant="contained"
                onClick={() => setShowARPTable(!showARPTable)}
                startIcon={<Storage />}
              >
                {showARPTable ? 'Hide' : 'Show'} ARP Table
              </Button>
            </Box>
            {showARPTable && <ARPTableComponent />}
            <Alert severity="warning" sx={{ mt: 2 }}>
              <Typography variant="body2">
                <strong>Common ARP Issues:</strong> Incomplete entries may indicate the target is
                unreachable. Invalid entries suggest misconfiguration. Use arp -d (Windows) or ip
                neigh flush (Linux) to clear and rebuild the table.
              </Typography>
            </Alert>
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

      {/* Validator Dialog */}
      <ValidatorDialog />
    </div>
  );
};

export default IPv4Troubleshooter;
