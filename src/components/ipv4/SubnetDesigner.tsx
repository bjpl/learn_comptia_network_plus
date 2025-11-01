/**
 * CompTIA Network+ - Component 17: Scenario-Based Subnet Designer
 * Interactive tool for designing subnet allocations using VLSM/CIDR
 */

import React, { useState, useEffect } from 'react';
import {
  Box,
  Button,
  Card,
  CardContent,
  Typography,
  Grid,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
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
  Divider,
} from '@mui/material';
import { ExpandMore, CheckCircle, Warning, Refresh, Calculate } from '@mui/icons-material';
import type { SubnetScenario, SubnetAllocation, SubnetDesignResult } from './ipv4-types';
import { subnetScenarios } from './ipv4-data';
import { calculateVLSM, isIPInSubnet } from '../../utils/networking';

const SubnetDesigner: React.FC = () => {
  const [selectedScenario, setSelectedScenario] = useState<SubnetScenario>(subnetScenarios[0]);
  const [allocations, setAllocations] = useState<SubnetAllocation[]>([]);
  const [showHints, setShowHints] = useState(false);
  const [showSolution, setShowSolution] = useState(false);
  const [designResult, setDesignResult] = useState<SubnetDesignResult | null>(null);

  // Auto-calculate when scenario changes
  useEffect(() => {
    setAllocations([]);
    setDesignResult(null);
    setShowHints(false);
    setShowSolution(false);
  }, [selectedScenario]);

  // Calculate VLSM allocation
  const handleAutoAllocate = () => {
    try {
      const hostsNeeded = selectedScenario.requirements.map((req) => req.hostsNeeded);
      const vlsmResult = calculateVLSM(selectedScenario.baseNetwork, hostsNeeded);

      const newAllocations: SubnetAllocation[] = vlsmResult.subnets.map((subnet, index) => {
        const req = selectedScenario.requirements[index];
        const wastedAddresses = subnet.usableHosts - req.hostsNeeded;
        const efficiency = (req.hostsNeeded / subnet.usableHosts) * 100;

        return {
          ...subnet,
          id: req.id,
          name: req.name,
          hostsNeeded: req.hostsNeeded,
          efficiency: Math.round(efficiency * 100) / 100,
          wastedAddresses,
        };
      });

      setAllocations(newAllocations);
      validateDesign(newAllocations);
    } catch (error) {
      console.error('Auto-allocation failed:', error);
    }
  };

  // Manual allocation for a specific requirement (reserved for future use)
  /*
  const handleManualAllocate = (reqId: string, cidr: string) => {
    const { calculateSubnet } = require('../../utils/networking');
    try {
      const subnet = calculateSubnet(cidr);
      const req = selectedScenario.requirements.find(r => r.id === reqId);

      if (!req) {return;}

      const wastedAddresses = subnet.usableHosts - req.hostsNeeded;
      const efficiency = (req.hostsNeeded / subnet.usableHosts) * 100;

      const newAllocation: SubnetAllocation = {
        ...subnet,
        id: req.id,
        name: req.name,
        hostsNeeded: req.hostsNeeded,
        efficiency: Math.round(efficiency * 100) / 100,
        wastedAddresses,
      };

      const updatedAllocations = allocations.filter(a => a.id !== reqId);
      updatedAllocations.push(newAllocation);

      setAllocations(updatedAllocations);
      validateDesign(updatedAllocations);
    } catch (error) {
      console.error('Manual allocation failed:', error);
    }
  };
  */

  // Validate the design
  const validateDesign = (allocs: SubnetAllocation[]) => {
    const errors: string[] = [];
    const warnings: string[] = [];

    // Check for overlaps
    let hasOverlaps = false;
    for (let i = 0; i < allocs.length; i++) {
      for (let j = i + 1; j < allocs.length; j++) {
        if (
          isIPInSubnet(allocs[i].network, `${allocs[j].network}/${allocs[j].cidr}`) ||
          isIPInSubnet(allocs[j].network, `${allocs[i].network}/${allocs[i].cidr}`)
        ) {
          hasOverlaps = true;
          errors.push(`Overlap detected between ${allocs[i].name} and ${allocs[j].name}`);
        }
      }
    }

    // Check efficiency
    allocs.forEach((alloc) => {
      if (alloc.efficiency < 50) {
        warnings.push(`${alloc.name} has low efficiency (${alloc.efficiency}%)`);
      }
      if (alloc.usableHosts < alloc.hostsNeeded) {
        errors.push(
          `${alloc.name} subnet too small (needs ${alloc.hostsNeeded}, has ${alloc.usableHosts})`
        );
      }
    });

    // Check if all requirements are allocated
    if (allocs.length < selectedScenario.requirements.length) {
      warnings.push(
        `Only ${allocs.length} of ${selectedScenario.requirements.length} requirements allocated`
      );
    }

    // Calculate overall efficiency
    const totalWasted = allocs.reduce((sum, a) => sum + a.wastedAddresses, 0);
    const totalEfficiency =
      allocs.length > 0 ? allocs.reduce((sum, a) => sum + a.efficiency, 0) / allocs.length : 0;

    setDesignResult({
      allocations: allocs,
      totalEfficiency: Math.round(totalEfficiency * 100) / 100,
      totalWasted,
      hasOverlaps,
      errors,
      warnings,
    });
  };

  // Reset design
  const handleReset = () => {
    setAllocations([]);
    setDesignResult(null);
    setShowHints(false);
    setShowSolution(false);
  };

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

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom>
        Scenario-Based Subnet Designer
      </Typography>
      <Typography variant="body1" color="text.secondary" paragraph>
        Design optimal subnet allocations using VLSM and CIDR for real-world scenarios
      </Typography>

      {/* Scenario Selection */}
      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Grid container spacing={2} alignItems="center">
            <Grid item xs={12} md={8}>
              <FormControl fullWidth>
                <InputLabel>Scenario</InputLabel>
                <Select
                  value={selectedScenario.id}
                  onChange={(e) => {
                    const scenario = subnetScenarios.find((s) => s.id === e.target.value);
                    if (scenario) {
                      setSelectedScenario(scenario);
                    }
                  }}
                  label="Scenario"
                >
                  {subnetScenarios.map((scenario) => (
                    <MenuItem key={scenario.id} value={scenario.id}>
                      {scenario.title} - {scenario.category}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} md={4}>
              <Chip
                label={selectedScenario.difficulty.toUpperCase()}
                color={getDifficultyColor(selectedScenario.difficulty)}
                size="small"
              />
            </Grid>
          </Grid>

          <Box sx={{ mt: 2 }}>
            <Typography variant="h6">{selectedScenario.title}</Typography>
            <Typography variant="body2" color="text.secondary">
              {selectedScenario.description}
            </Typography>
            <Typography variant="body2" sx={{ mt: 1 }}>
              <strong>Base Network:</strong> {selectedScenario.baseNetwork}
            </Typography>
          </Box>
        </CardContent>
      </Card>

      {/* Requirements Table */}
      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            Network Requirements
          </Typography>
          <TableContainer component={Paper} variant="outlined">
            <Table size="small">
              <TableHead>
                <TableRow>
                  <TableCell>Name</TableCell>
                  <TableCell>Description</TableCell>
                  <TableCell align="right">Hosts Needed</TableCell>
                  <TableCell align="center">Status</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {selectedScenario.requirements.map((req) => {
                  const allocated = allocations.find((a) => a.id === req.id);
                  return (
                    <TableRow key={req.id}>
                      <TableCell>{req.name}</TableCell>
                      <TableCell>{req.description}</TableCell>
                      <TableCell align="right">{req.hostsNeeded}</TableCell>
                      <TableCell align="center">
                        {allocated ? (
                          <CheckCircle color="success" fontSize="small" />
                        ) : (
                          <Warning color="warning" fontSize="small" />
                        )}
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </TableContainer>
        </CardContent>
      </Card>

      {/* Action Buttons */}
      <Box sx={{ mb: 3, display: 'flex', gap: 2, flexWrap: 'wrap' }}>
        <Button variant="contained" startIcon={<Calculate />} onClick={handleAutoAllocate}>
          Auto-Allocate (VLSM)
        </Button>
        <Button variant="outlined" startIcon={<Refresh />} onClick={handleReset}>
          Reset
        </Button>
        <Button variant="outlined" onClick={() => setShowHints(!showHints)}>
          {showHints ? 'Hide' : 'Show'} Hints
        </Button>
        <Button variant="outlined" onClick={() => setShowSolution(!showSolution)}>
          {showSolution ? 'Hide' : 'Show'} Solution
        </Button>
      </Box>

      {/* Hints */}
      {showHints && selectedScenario.hints && (
        <Alert severity="info" sx={{ mb: 3 }}>
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

      {/* Allocation Results */}
      {allocations.length > 0 && (
        <Card sx={{ mb: 3 }}>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              Subnet Allocations
            </Typography>
            <TableContainer component={Paper} variant="outlined">
              <Table size="small">
                <TableHead>
                  <TableRow>
                    <TableCell>Name</TableCell>
                    <TableCell>Network</TableCell>
                    <TableCell>CIDR</TableCell>
                    <TableCell>Subnet Mask</TableCell>
                    <TableCell>Usable Range</TableCell>
                    <TableCell align="right">Usable Hosts</TableCell>
                    <TableCell align="right">Needed</TableCell>
                    <TableCell align="right">Wasted</TableCell>
                    <TableCell align="right">Efficiency</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {allocations.map((alloc) => (
                    <TableRow key={alloc.id}>
                      <TableCell>{alloc.name}</TableCell>
                      <TableCell>
                        <code>{alloc.network}</code>
                      </TableCell>
                      <TableCell>
                        <code>/{alloc.cidr}</code>
                      </TableCell>
                      <TableCell>
                        <code>{alloc.subnetMask}</code>
                      </TableCell>
                      <TableCell>
                        <code style={{ fontSize: '0.75rem' }}>
                          {alloc.firstHost} - {alloc.lastHost}
                        </code>
                      </TableCell>
                      <TableCell align="right">{alloc.usableHosts}</TableCell>
                      <TableCell align="right">{alloc.hostsNeeded}</TableCell>
                      <TableCell align="right">{alloc.wastedAddresses}</TableCell>
                      <TableCell align="right">
                        <Chip
                          label={`${alloc.efficiency}%`}
                          size="small"
                          color={
                            alloc.efficiency >= 75
                              ? 'success'
                              : alloc.efficiency >= 50
                                ? 'warning'
                                : 'error'
                          }
                        />
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </CardContent>
        </Card>
      )}

      {/* Validation Results */}
      {designResult && (
        <Card>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              Design Validation
            </Typography>

            {/* Summary Stats */}
            <Grid container spacing={2} sx={{ mb: 2 }}>
              <Grid item xs={12} sm={4}>
                <Paper variant="outlined" sx={{ p: 2, textAlign: 'center' }}>
                  <Typography variant="caption" color="text.secondary">
                    Overall Efficiency
                  </Typography>
                  <Typography variant="h4" color="primary">
                    {designResult.totalEfficiency}%
                  </Typography>
                </Paper>
              </Grid>
              <Grid item xs={12} sm={4}>
                <Paper variant="outlined" sx={{ p: 2, textAlign: 'center' }}>
                  <Typography variant="caption" color="text.secondary">
                    Total Wasted
                  </Typography>
                  <Typography variant="h4" color="warning.main">
                    {designResult.totalWasted}
                  </Typography>
                </Paper>
              </Grid>
              <Grid item xs={12} sm={4}>
                <Paper variant="outlined" sx={{ p: 2, textAlign: 'center' }}>
                  <Typography variant="caption" color="text.secondary">
                    Overlaps
                  </Typography>
                  <Typography
                    variant="h4"
                    color={designResult.hasOverlaps ? 'error' : 'success.main'}
                  >
                    {designResult.hasOverlaps ? 'Yes' : 'No'}
                  </Typography>
                </Paper>
              </Grid>
            </Grid>

            {/* Errors */}
            {designResult.errors.length > 0 && (
              <Alert severity="error" sx={{ mb: 2 }}>
                <Typography variant="subtitle2" gutterBottom>
                  Errors:
                </Typography>
                <ul style={{ margin: 0, paddingLeft: 20 }}>
                  {designResult.errors.map((error, index) => (
                    <li key={index}>{error}</li>
                  ))}
                </ul>
              </Alert>
            )}

            {/* Warnings */}
            {designResult.warnings.length > 0 && (
              <Alert severity="warning" sx={{ mb: 2 }}>
                <Typography variant="subtitle2" gutterBottom>
                  Warnings:
                </Typography>
                <ul style={{ margin: 0, paddingLeft: 20 }}>
                  {designResult.warnings.map((warning, index) => (
                    <li key={index}>{warning}</li>
                  ))}
                </ul>
              </Alert>
            )}

            {/* Success */}
            {designResult.errors.length === 0 && designResult.warnings.length === 0 && (
              <Alert severity="success">
                <Typography variant="subtitle2">
                  Excellent! Your subnet design is valid and efficient.
                </Typography>
              </Alert>
            )}
          </CardContent>
        </Card>
      )}

      {/* Educational Info */}
      <Box sx={{ mt: 3 }}>
        <Accordion>
          <AccordionSummary expandIcon={<ExpandMore />}>
            <Typography variant="h6">IPv4 Concepts Reference</Typography>
          </AccordionSummary>
          <AccordionDetails>
            <Grid container spacing={2}>
              <Grid item xs={12} md={6}>
                <Typography variant="subtitle2" gutterBottom>
                  RFC 1918 Private Addresses:
                </Typography>
                <ul>
                  <li>
                    <code>10.0.0.0/8</code> - Class A (16.7M addresses)
                  </li>
                  <li>
                    <code>172.16.0.0/12</code> - Class B (1M addresses)
                  </li>
                  <li>
                    <code>192.168.0.0/16</code> - Class C (65K addresses)
                  </li>
                </ul>
              </Grid>
              <Grid item xs={12} md={6}>
                <Typography variant="subtitle2" gutterBottom>
                  Special Address Ranges:
                </Typography>
                <ul>
                  <li>
                    <code>127.0.0.0/8</code> - Loopback
                  </li>
                  <li>
                    <code>169.254.0.0/16</code> - APIPA
                  </li>
                  <li>
                    <code>224.0.0.0/4</code> - Multicast (Class D)
                  </li>
                  <li>
                    <code>240.0.0.0/4</code> - Reserved (Class E)
                  </li>
                </ul>
              </Grid>
              <Grid item xs={12}>
                <Divider sx={{ my: 2 }} />
                <Typography variant="subtitle2" gutterBottom>
                  VLSM Best Practices:
                </Typography>
                <ul>
                  <li>Always allocate largest subnets first</li>
                  <li>Account for network and broadcast addresses</li>
                  <li>Use /30 or /31 for point-to-point links</li>
                  <li>Plan for future growth (20-30% overhead)</li>
                  <li>Avoid subnet overlaps</li>
                  <li>Document all allocations</li>
                </ul>
              </Grid>
            </Grid>
          </AccordionDetails>
        </Accordion>
      </Box>
    </Box>
  );
};

export default SubnetDesigner;
