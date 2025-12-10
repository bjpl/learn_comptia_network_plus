/**
 * CompTIA Network+ - Component 16: Enhanced Subnet Designer
 * Interactive tool for designing subnet allocations with VLSM, visualization, and utilities
 * Features: VLSM calculator, subnet visualization, practice scenarios, cheat sheet, binary converter
 */

import React from 'react';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import Alert from '@mui/material/Alert';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import { Calculate, Refresh } from '@mui/icons-material';
import { subnetScenarios } from '../ipv4-data';
import { useSubnetDesign } from './hooks/useSubnetDesign';
import { useBinaryConverter } from './hooks/useBinaryConverter';
import {
  ScenarioSelector,
  RequirementsTable,
  AllocationResults,
  SubnetVisualizer,
  ValidationResults,
  EducationalAccordions,
} from './components';

const SubnetDesigner: React.FC = () => {
  const {
    selectedScenario,
    setSelectedScenario,
    allocations,
    showHints,
    setShowHints,
    showSolution,
    setShowSolution,
    designResult,
    handleAutoAllocate,
    handleReset,
  } = useSubnetDesign(subnetScenarios[0]);

  const { binaryConverter, setBinaryConverter } = useBinaryConverter();

  return (
    <div style={{ padding: '24px' }}>
      <Typography variant="h4" gutterBottom className="text-gray-900 dark:text-white">
        Scenario-Based Subnet Designer
      </Typography>
      <Typography variant="body1" className="text-gray-700 dark:text-gray-300" paragraph>
        Design optimal subnet allocations using VLSM and CIDR for real-world scenarios
      </Typography>

      {/* Scenario Selection */}
      <ScenarioSelector
        selectedScenario={selectedScenario}
        scenarios={subnetScenarios}
        onScenarioChange={setSelectedScenario}
      />

      {/* Requirements Table */}
      <RequirementsTable scenario={selectedScenario} allocations={allocations} />

      {/* Action Buttons */}
      <div style={{ marginBottom: '24px', display: 'flex', gap: '16px', flexWrap: 'wrap' }}>
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
      </div>

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
      <AllocationResults allocations={allocations} />

      {/* Subnet Visualization */}
      {allocations.length > 0 && (
        <Card sx={{ mb: 3 }}>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              Host Allocation Visualization
            </Typography>
            <Typography variant="body2" color="text.secondary" paragraph>
              Visual representation of address usage efficiency for each subnet
            </Typography>
            {allocations.map((alloc) => (
              <SubnetVisualizer key={alloc.id} allocation={alloc} />
            ))}
          </CardContent>
        </Card>
      )}

      {/* Validation Results */}
      {designResult && <ValidationResults designResult={designResult} />}

      {/* Educational Accordions */}
      <EducationalAccordions
        binaryConverter={binaryConverter}
        setBinaryConverter={setBinaryConverter}
      />
    </div>
  );
};

export default SubnetDesigner;
