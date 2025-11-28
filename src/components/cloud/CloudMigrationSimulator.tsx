import React, { useState, useMemo } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Grid,
  Button,
  Stepper,
  Step,
  StepLabel,
  StepContent,
  Chip,
  Alert,
  LinearProgress,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Checkbox,
  FormControlLabel,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Divider,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  TextField,
} from '@mui/material';
import {
  Cloud as CloudIcon,
  Timeline as TimelineIcon,
  Assessment as AssessmentIcon,
  AttachMoney as MoneyIcon,
  Warning as WarningIcon,
  CheckCircle as CheckCircleIcon,
  ExpandMore as ExpandMoreIcon,
  Storage as StorageIcon,
  Settings as SettingsIcon,
} from '@mui/icons-material';
import {
  migrationStrategies,
  migrationScenarios,
  defaultCostModel,
  calculateTotalCost,
  calculateRiskSeverity,
  calculatePhaseProgress,
  type CostModel,
} from '../../data/migration-data';
import './CloudMigrationSimulator.css';

interface CloudMigrationSimulatorProps {
  className?: string;
}

const CloudMigrationSimulator: React.FC<CloudMigrationSimulatorProps> = ({ className = '' }) => {
  // State management
  const [selectedScenario, setSelectedScenario] = useState<string>('legacy-to-aws');
  const [selectedStrategy, setSelectedStrategy] = useState<string>('replatform');
  const [activePhase, setActivePhase] = useState<number>(0);
  const [customCostModel, setCustomCostModel] = useState<CostModel>(defaultCostModel);
  const [checkedItems, setCheckedItems] = useState<Record<string, boolean>>({});
  const [view, setView] = useState<
    'overview' | 'strategy' | 'phases' | 'costs' | 'risks' | 'timeline'
  >('overview');

  // Get current scenario and strategy
  const scenario = useMemo(
    () => migrationScenarios.find((s) => s.id === selectedScenario) || migrationScenarios[0],
    [selectedScenario]
  );

  const strategy = useMemo(
    () => migrationStrategies.find((s) => s.id === selectedStrategy) || migrationStrategies[0],
    [selectedStrategy]
  );

  // Calculate overall progress
  const overallProgress = useMemo(() => {
    const totalItems = scenario.phases.reduce((sum, phase) => sum + phase.checklist.length, 0);
    const completedItems = scenario.phases.reduce(
      (sum, phase) => sum + phase.checklist.filter((item) => checkedItems[item.id]).length,
      0
    );
    return totalItems > 0 ? Math.round((completedItems / totalItems) * 100) : 0;
  }, [scenario, checkedItems]);

  // Handle checklist item toggle
  const handleToggleChecklistItem = (itemId: string) => {
    setCheckedItems((prev) => ({
      ...prev,
      [itemId]: !prev[itemId],
    }));
  };

  // Handle cost model updates
  const handleCostUpdate = (category: 'onPremise' | 'cloud', field: string, value: number) => {
    setCustomCostModel((prev) => ({
      ...prev,
      [category]: {
        ...prev[category],
        [field]: value,
      },
    }));
  };

  // Calculate cost totals
  const { onPremTotal, cloudTotal, savings } = calculateTotalCost(customCostModel);

  // Render strategy selection view
  const renderStrategyView = () => (
    <Box className="migration-strategy-view">
      <Typography variant="h5" gutterBottom>
        Migration Strategies: The 6 R's
      </Typography>
      <Typography variant="body2" color="text.secondary" paragraph>
        Choose the right migration strategy based on your application requirements, timeline, and
        goals.
      </Typography>

      <Grid container spacing={3}>
        {migrationStrategies.map((strat) => (
          <Grid item xs={12} md={6} key={strat.id}>
            <Card
              className={`strategy-card ${selectedStrategy === strat.id ? 'selected' : ''}`}
              onClick={() => setSelectedStrategy(strat.id)}
              sx={{ cursor: 'pointer', height: '100%' }}
            >
              <CardContent>
                <Box display="flex" alignItems="center" gap={1} mb={2}>
                  <Typography variant="h2" component="span">
                    {strat.icon}
                  </Typography>
                  <Box>
                    <Typography variant="h6">{strat.name}</Typography>
                    <Box display="flex" gap={1} mt={0.5}>
                      <Chip label={`Complexity: ${strat.complexity}`} size="small" />
                      <Chip label={`Cost: ${strat.costImpact}`} size="small" color="primary" />
                      <Chip label={strat.timeframe} size="small" color="secondary" />
                    </Box>
                  </Box>
                </Box>

                <Typography variant="body2" color="text.secondary" paragraph>
                  {strat.description}
                </Typography>

                <Accordion>
                  <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                    <Typography variant="subtitle2">Use Cases</Typography>
                  </AccordionSummary>
                  <AccordionDetails>
                    <List dense>
                      {strat.useCases.map((useCase, idx) => (
                        <ListItem key={idx}>
                          <ListItemIcon>
                            <CheckCircleIcon fontSize="small" color="success" />
                          </ListItemIcon>
                          <ListItemText primary={useCase} />
                        </ListItem>
                      ))}
                    </List>
                  </AccordionDetails>
                </Accordion>

                <Accordion>
                  <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                    <Typography variant="subtitle2">Benefits & Challenges</Typography>
                  </AccordionSummary>
                  <AccordionDetails>
                    <Typography variant="subtitle2" color="success.main" gutterBottom>
                      Benefits:
                    </Typography>
                    <List dense>
                      {strat.benefits.map((benefit, idx) => (
                        <ListItem key={idx}>
                          <ListItemText primary={benefit} />
                        </ListItem>
                      ))}
                    </List>
                    <Typography
                      variant="subtitle2"
                      color="warning.main"
                      gutterBottom
                      sx={{ mt: 1 }}
                    >
                      Challenges:
                    </Typography>
                    <List dense>
                      {strat.challenges.map((challenge, idx) => (
                        <ListItem key={idx}>
                          <ListItemText primary={challenge} />
                        </ListItem>
                      ))}
                    </List>
                  </AccordionDetails>
                </Accordion>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Box>
  );

  // Render phases view
  const renderPhasesView = () => (
    <Box className="migration-phases-view">
      <Typography variant="h5" gutterBottom>
        Migration Phases: {scenario.name}
      </Typography>

      <Box mb={3}>
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
      </Box>

      <Stepper activeStep={activePhase} orientation="vertical">
        {scenario.phases.map((phase, index) => {
          const phaseProgress = calculatePhaseProgress({
            ...phase,
            checklist: phase.checklist.map((item) => ({
              ...item,
              completed: !!checkedItems[item.id],
            })),
          });

          return (
            <Step key={phase.id}>
              <StepLabel
                onClick={() => setActivePhase(index)}
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
                      Checklist ({phase.checklist.filter((item) => checkedItems[item.id]).length}/
                      {phase.checklist.length})
                    </Typography>
                    <LinearProgress
                      variant="determinate"
                      value={phaseProgress}
                      sx={{ mb: 2, height: 6 }}
                    />
                    <List>
                      {phase.checklist.map((item) => (
                        <ListItem key={item.id} dense>
                          <FormControlLabel
                            control={
                              <Checkbox
                                checked={!!checkedItems[item.id]}
                                onChange={() => handleToggleChecklistItem(item.id)}
                                size="small"
                              />
                            }
                            label={
                              <Box>
                                <Typography variant="body2">{item.task}</Typography>
                                <Typography variant="caption" color="text.secondary">
                                  {item.description} • {item.responsible}
                                </Typography>
                              </Box>
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
                        {phase.risks.map((risk) => {
                          const severity = calculateRiskSeverity(risk.probability, risk.impact);
                          return (
                            <ListItem key={risk.id} dense>
                              <ListItemText
                                primary={
                                  <Box display="flex" alignItems="center" gap={1}>
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
                                        severity >= 6
                                          ? 'error'
                                          : severity >= 4
                                            ? 'warning'
                                            : 'default'
                                      }
                                    />
                                  </Box>
                                }
                                secondary={`Mitigation: ${risk.mitigation}`}
                              />
                            </ListItem>
                          );
                        })}
                      </List>
                    </CardContent>
                  </Card>
                )}

                <Box display="flex" gap={1} mt={2}>
                  {index > 0 && (
                    <Button size="small" onClick={() => setActivePhase(index - 1)}>
                      Previous
                    </Button>
                  )}
                  {index < scenario.phases.length - 1 && (
                    <Button
                      size="small"
                      variant="contained"
                      onClick={() => setActivePhase(index + 1)}
                    >
                      Next Phase
                    </Button>
                  )}
                </Box>
              </StepContent>
            </Step>
          );
        })}
      </Stepper>
    </Box>
  );

  // Render costs view
  const renderCostsView = () => {
    const savingsPercent = onPremTotal > 0 ? Math.round((savings / onPremTotal) * 100) : 0;

    return (
      <Box className="migration-costs-view">
        <Typography variant="h5" gutterBottom>
          Cost Comparison: TCO Calculator
        </Typography>
        <Typography variant="body2" color="text.secondary" paragraph>
          Compare on-premises Total Cost of Ownership (TCO) vs. cloud costs over 3 years.
        </Typography>

        <Grid container spacing={3}>
          {/* On-Premises Costs */}
          <Grid item xs={12} md={6}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  <StorageIcon sx={{ verticalAlign: 'middle', mr: 1 }} />
                  On-Premises Costs
                </Typography>
                <Box mb={2}>
                  {Object.entries(customCostModel.onPremise).map(([key, value]) => (
                    <Box key={key} mb={2}>
                      <TextField
                        fullWidth
                        size="small"
                        label={key.charAt(0).toUpperCase() + key.slice(1)}
                        type="number"
                        value={value}
                        onChange={(e) => handleCostUpdate('onPremise', key, Number(e.target.value))}
                        InputProps={{
                          startAdornment: <MoneyIcon fontSize="small" sx={{ mr: 1 }} />,
                        }}
                      />
                    </Box>
                  ))}
                </Box>
                <Divider sx={{ my: 2 }} />
                <Typography variant="h6" color="primary">
                  Total: ${onPremTotal.toLocaleString()}
                </Typography>
              </CardContent>
            </Card>
          </Grid>

          {/* Cloud Costs */}
          <Grid item xs={12} md={6}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  <CloudIcon sx={{ verticalAlign: 'middle', mr: 1 }} />
                  Cloud Costs
                </Typography>
                <Box mb={2}>
                  {Object.entries(customCostModel.cloud).map(([key, value]) => (
                    <Box key={key} mb={2}>
                      <TextField
                        fullWidth
                        size="small"
                        label={key.charAt(0).toUpperCase() + key.slice(1)}
                        type="number"
                        value={value}
                        onChange={(e) => handleCostUpdate('cloud', key, Number(e.target.value))}
                        InputProps={{
                          startAdornment: <MoneyIcon fontSize="small" sx={{ mr: 1 }} />,
                        }}
                      />
                    </Box>
                  ))}
                </Box>
                <Divider sx={{ my: 2 }} />
                <Typography variant="h6" color="success.main">
                  Total: ${cloudTotal.toLocaleString()}
                </Typography>
              </CardContent>
            </Card>
          </Grid>

          {/* Savings Summary */}
          <Grid item xs={12}>
            <Card sx={{ bgcolor: savings > 0 ? 'success.light' : 'error.light' }}>
              <CardContent>
                <Typography variant="h5" gutterBottom>
                  {savings > 0 ? 'Estimated Savings' : 'Additional Cost'}
                </Typography>
                <Typography variant="h3" color={savings > 0 ? 'success.dark' : 'error.dark'}>
                  ${Math.abs(savings).toLocaleString()} ({Math.abs(savingsPercent)}%)
                </Typography>
                <Typography variant="body2" sx={{ mt: 1 }}>
                  {savings > 0
                    ? `Migrating to cloud could save ${savingsPercent}% over 3 years`
                    : `Cloud migration would cost ${Math.abs(savingsPercent)}% more over 3 years`}
                </Typography>
              </CardContent>
            </Card>
          </Grid>

          {/* Cost Breakdown Chart */}
          <Grid item xs={12}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Cost Breakdown Comparison
                </Typography>
                <Box display="flex" gap={2} mb={2}>
                  <Box flex={1}>
                    <Typography variant="subtitle2" gutterBottom>
                      On-Premises
                    </Typography>
                    {Object.entries(customCostModel.onPremise).map(([key, value]) => {
                      const percent = onPremTotal > 0 ? (value / onPremTotal) * 100 : 0;
                      return (
                        <Box key={key} mb={1}>
                          <Box display="flex" justifyContent="space-between">
                            <Typography variant="caption">{key}</Typography>
                            <Typography variant="caption">{percent.toFixed(1)}%</Typography>
                          </Box>
                          <LinearProgress variant="determinate" value={percent} />
                        </Box>
                      );
                    })}
                  </Box>
                  <Box flex={1}>
                    <Typography variant="subtitle2" gutterBottom>
                      Cloud
                    </Typography>
                    {Object.entries(customCostModel.cloud).map(([key, value]) => {
                      const percent = cloudTotal > 0 ? (value / cloudTotal) * 100 : 0;
                      return (
                        <Box key={key} mb={1}>
                          <Box display="flex" justifyContent="space-between">
                            <Typography variant="caption">{key}</Typography>
                            <Typography variant="caption">{percent.toFixed(1)}%</Typography>
                          </Box>
                          <LinearProgress variant="determinate" value={percent} color="success" />
                        </Box>
                      );
                    })}
                  </Box>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Box>
    );
  };

  // Render risks view
  const renderRisksView = () => {
    const allRisks = scenario.phases.flatMap((phase) =>
      phase.risks.map((risk) => ({
        ...risk,
        phase: phase.name,
        severity: calculateRiskSeverity(risk.probability, risk.impact),
      }))
    );

    const sortedRisks = [...allRisks].sort((a, b) => b.severity - a.severity);

    return (
      <Box className="migration-risks-view">
        <Typography variant="h5" gutterBottom>
          Risk Assessment Matrix
        </Typography>
        <Typography variant="body2" color="text.secondary" paragraph>
          Identified risks across all migration phases, sorted by severity (Probability × Impact).
        </Typography>

        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Risk</TableCell>
                <TableCell>Phase</TableCell>
                <TableCell align="center">Probability</TableCell>
                <TableCell align="center">Impact</TableCell>
                <TableCell align="center">Severity</TableCell>
                <TableCell>Mitigation</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {sortedRisks.map((risk) => (
                <TableRow key={`${risk.id}-${risk.phase}`}>
                  <TableCell>{risk.risk}</TableCell>
                  <TableCell>{risk.phase}</TableCell>
                  <TableCell align="center">
                    <Chip
                      label={risk.probability}
                      size="small"
                      color={
                        risk.probability === 'High'
                          ? 'error'
                          : risk.probability === 'Medium'
                            ? 'warning'
                            : 'default'
                      }
                    />
                  </TableCell>
                  <TableCell align="center">
                    <Chip
                      label={risk.impact}
                      size="small"
                      color={
                        risk.impact === 'High'
                          ? 'error'
                          : risk.impact === 'Medium'
                            ? 'warning'
                            : 'default'
                      }
                    />
                  </TableCell>
                  <TableCell align="center">
                    <Chip
                      label={risk.severity}
                      size="small"
                      color={
                        risk.severity >= 6 ? 'error' : risk.severity >= 4 ? 'warning' : 'success'
                      }
                    />
                  </TableCell>
                  <TableCell>{risk.mitigation}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>

        <Box mt={3}>
          <Alert severity="info">
            <Typography variant="subtitle2" gutterBottom>
              Risk Severity Scale
            </Typography>
            <Typography variant="body2">
              • 1-3: Low severity - Monitor and manage with standard procedures
              <br />
              • 4-6: Medium severity - Requires specific mitigation strategies
              <br />• 7-9: High severity - Critical risk requiring immediate attention and robust
              mitigation
            </Typography>
          </Alert>
        </Box>
      </Box>
    );
  };

  // Render timeline view
  const renderTimelineView = () => {
    let cumulativeWeeks = 0;
    const timelineData = scenario.phases.map((phase) => {
      const start = cumulativeWeeks;
      cumulativeWeeks += phase.duration;
      return {
        phase,
        startWeek: start,
        endWeek: cumulativeWeeks,
        progress: calculatePhaseProgress({
          ...phase,
          checklist: phase.checklist.map((item) => ({
            ...item,
            completed: !!checkedItems[item.id],
          })),
        }),
      };
    });

    const totalWeeks = cumulativeWeeks;

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
                    {scenario.phases.reduce((sum, p) => sum + p.checklist.length, 0)}
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

  // Render overview
  const renderOverview = () => (
    <Box className="migration-overview">
      <Grid container spacing={3}>
        {/* Scenario Info */}
        <Grid item xs={12}>
          <Card>
            <CardContent>
              <Typography variant="h5" gutterBottom>
                {scenario.name}
              </Typography>
              <Typography variant="body2" color="text.secondary" paragraph>
                {scenario.description}
              </Typography>
              <Grid container spacing={2}>
                <Grid item xs={6} md={3}>
                  <Typography variant="caption" color="text.secondary">
                    Source
                  </Typography>
                  <Typography variant="body2">{scenario.sourceEnvironment}</Typography>
                </Grid>
                <Grid item xs={6} md={3}>
                  <Typography variant="caption" color="text.secondary">
                    Target
                  </Typography>
                  <Typography variant="body2">{scenario.targetEnvironment}</Typography>
                </Grid>
                <Grid item xs={6} md={3}>
                  <Typography variant="caption" color="text.secondary">
                    Applications
                  </Typography>
                  <Typography variant="body2">{scenario.applicationCount}</Typography>
                </Grid>
                <Grid item xs={6} md={3}>
                  <Typography variant="caption" color="text.secondary">
                    Data Volume
                  </Typography>
                  <Typography variant="body2">{scenario.dataVolume}</Typography>
                </Grid>
                <Grid item xs={6} md={3}>
                  <Typography variant="caption" color="text.secondary">
                    Duration
                  </Typography>
                  <Typography variant="body2">{scenario.estimatedDuration}</Typography>
                </Grid>
                <Grid item xs={6} md={3}>
                  <Typography variant="caption" color="text.secondary">
                    Est. Cost
                  </Typography>
                  <Typography variant="body2">{scenario.estimatedCost}</Typography>
                </Grid>
                <Grid item xs={6} md={3}>
                  <Typography variant="caption" color="text.secondary">
                    Complexity
                  </Typography>
                  <Chip label={scenario.complexity} size="small" color="primary" />
                </Grid>
                <Grid item xs={6} md={3}>
                  <Typography variant="caption" color="text.secondary">
                    Strategy
                  </Typography>
                  <Chip label={strategy.shortName} size="small" color="secondary" />
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        </Grid>

        {/* Quick Stats */}
        <Grid item xs={12} md={3}>
          <Card>
            <CardContent>
              <TimelineIcon color="primary" />
              <Typography variant="h6" gutterBottom>
                Timeline
              </Typography>
              <Typography variant="h4">
                {scenario.phases.reduce((sum, p) => sum + p.duration, 0)} weeks
              </Typography>
              <Typography variant="caption" color="text.secondary">
                {scenario.phases.length} phases
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={3}>
          <Card>
            <CardContent>
              <AssessmentIcon color="primary" />
              <Typography variant="h6" gutterBottom>
                Progress
              </Typography>
              <Typography variant="h4">{overallProgress}%</Typography>
              <Typography variant="caption" color="text.secondary">
                {scenario.phases.reduce(
                  (sum, p) => sum + p.checklist.filter((i) => checkedItems[i.id]).length,
                  0
                )}
                /{scenario.phases.reduce((sum, p) => sum + p.checklist.length, 0)} tasks
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={3}>
          <Card>
            <CardContent>
              <MoneyIcon color="primary" />
              <Typography variant="h6" gutterBottom>
                Savings
              </Typography>
              <Typography variant="h4" color={savings > 0 ? 'success.main' : 'error.main'}>
                {savings > 0 ? '+' : ''}
                {Math.round((savings / onPremTotal) * 100)}%
              </Typography>
              <Typography variant="caption" color="text.secondary">
                ${Math.abs(savings).toLocaleString()}
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={3}>
          <Card>
            <CardContent>
              <WarningIcon color="primary" />
              <Typography variant="h6" gutterBottom>
                Risks
              </Typography>
              <Typography variant="h4">
                {scenario.phases.reduce((sum, p) => sum + p.risks.length, 0)}
              </Typography>
              <Typography variant="caption" color="text.secondary">
                identified risks
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        {/* Current Strategy Info */}
        <Grid item xs={12}>
          <Card>
            <CardContent>
              <Box display="flex" alignItems="center" gap={2} mb={2}>
                <Typography variant="h2">{strategy.icon}</Typography>
                <Box>
                  <Typography variant="h6">{strategy.name}</Typography>
                  <Box display="flex" gap={1}>
                    <Chip label={`Complexity: ${strategy.complexity}`} size="small" />
                    <Chip label={`Timeline: ${strategy.timeframe}`} size="small" color="primary" />
                  </Box>
                </Box>
              </Box>
              <Typography variant="body2" color="text.secondary">
                {strategy.description}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );

  return (
    // @ts-expect-error - Complex MUI className union type
    <Box className={`cloud-migration-simulator ${className}`}>
      {/* Header */}
      <Box className="migration-header" mb={3}>
        <Typography variant="h4" gutterBottom>
          <CloudIcon sx={{ verticalAlign: 'middle', mr: 1, fontSize: 40 }} />
          Cloud Migration Simulator
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Plan and simulate cloud migration with the 6 R's framework: Rehost, Replatform, Refactor,
          Repurchase, Retire, Retain
        </Typography>
      </Box>

      {/* Scenario Selection */}
      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Grid container spacing={2} alignItems="center">
            <Grid item xs={12} md={6}>
              <FormControl fullWidth size="small">
                <InputLabel>Migration Scenario</InputLabel>
                <Select
                  value={selectedScenario}
                  onChange={(e) => setSelectedScenario(e.target.value)}
                  label="Migration Scenario"
                >
                  {migrationScenarios.map((s) => (
                    <MenuItem key={s.id} value={s.id}>
                      {s.name} - {s.sourceEnvironment} → {s.targetEnvironment}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} md={6}>
              <FormControl fullWidth size="small">
                <InputLabel>Migration Strategy</InputLabel>
                <Select
                  value={selectedStrategy}
                  onChange={(e) => setSelectedStrategy(e.target.value)}
                  label="Migration Strategy"
                >
                  {migrationStrategies.map((s) => (
                    <MenuItem key={s.id} value={s.id}>
                      {s.icon} {s.name}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
          </Grid>
        </CardContent>
      </Card>

      {/* View Navigation */}
      <Box mb={3} display="flex" gap={1} flexWrap="wrap">
        <Button
          variant={view === 'overview' ? 'contained' : 'outlined'}
          onClick={() => setView('overview')}
          startIcon={<AssessmentIcon />}
        >
          Overview
        </Button>
        <Button
          variant={view === 'strategy' ? 'contained' : 'outlined'}
          onClick={() => setView('strategy')}
          startIcon={<SettingsIcon />}
        >
          Strategies
        </Button>
        <Button
          variant={view === 'phases' ? 'contained' : 'outlined'}
          onClick={() => setView('phases')}
          startIcon={<TimelineIcon />}
        >
          Phases
        </Button>
        <Button
          variant={view === 'costs' ? 'contained' : 'outlined'}
          onClick={() => setView('costs')}
          startIcon={<MoneyIcon />}
        >
          Costs
        </Button>
        <Button
          variant={view === 'risks' ? 'contained' : 'outlined'}
          onClick={() => setView('risks')}
          startIcon={<WarningIcon />}
        >
          Risks
        </Button>
        <Button
          variant={view === 'timeline' ? 'contained' : 'outlined'}
          onClick={() => setView('timeline')}
          startIcon={<TimelineIcon />}
        >
          Timeline
        </Button>
      </Box>

      {/* Content Views */}
      <Box className="migration-content">
        {view === 'overview' && renderOverview()}
        {view === 'strategy' && renderStrategyView()}
        {view === 'phases' && renderPhasesView()}
        {view === 'costs' && renderCostsView()}
        {view === 'risks' && renderRisksView()}
        {view === 'timeline' && renderTimelineView()}
      </Box>

      {/* Educational Footer */}
      <Box mt={4}>
        <Alert severity="info">
          <Typography variant="subtitle2" gutterBottom>
            About Cloud Migration
          </Typography>
          <Typography variant="body2">
            The 6 R's framework provides a systematic approach to cloud migration. Each strategy has
            different complexity, cost, and timeline implications. Consider your application
            requirements, business goals, and organizational readiness when selecting a strategy.
            Most organizations use a combination of strategies across their application portfolio.
          </Typography>
        </Alert>
      </Box>
    </Box>
  );
};

export default CloudMigrationSimulator;
