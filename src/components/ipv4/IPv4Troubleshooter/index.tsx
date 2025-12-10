/**
 * CompTIA Network+ - Component 18: IPv4 Troubleshooting Scenarios
 * Interactive network diagnosis and problem-solving tool with advanced troubleshooting features
 * Main orchestrator component (refactored)
 */

import React from 'react';
import Typography from '@mui/material/Typography';
import Card from '@mui/material/Card';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import CardContent from '@mui/material/CardContent';
import {
  BugReport,
  Router,
  Terminal,
  Build,
  ChecklistRtl,
  Settings,
  NetworkCheck,
  Storage,
} from '@mui/icons-material';
import { useTroubleshooter } from './hooks/useTroubleshooter';
import { TabPanel } from './components/TabPanel';
import { ScenarioSelector } from './components/ScenarioSelector';
import { NetworkDiagram } from './components/NetworkDiagram';
import { ValidatorDialog } from './components/ValidatorDialog';
import { TroubleshootingWizard } from './components/TroubleshootingWizard';
import { EducationalReference } from './components/EducationalReference';
import { ValidatorTab } from './components/ValidatorTab';
import { RoutingTableTab } from './components/RoutingTableTab';
import { ARPTableTab } from './components/ARPTableTab';
import { ProblemOverviewTab, DiagnosticsTab, SolutionStepsTab } from './components/tabs';

const IPv4Troubleshooter: React.FC = () => {
  const {
    selectedScenario,
    activeStep,
    showHints,
    showSolution,
    tabValue,
    validatorOpen,
    validatorIP,
    validatorMask,
    validatorGateway,
    wizardStep,
    showRoutingTable,
    showARPTable,
    validationResults,
    routingTable,
    arpTable,
    setActiveStep,
    setShowHints,
    setShowSolution,
    setTabValue,
    setValidatorOpen,
    setValidatorIP,
    setValidatorMask,
    setValidatorGateway,
    setWizardStep,
    setShowRoutingTable,
    setShowARPTable,
    handleScenarioChange,
  } = useTroubleshooter();

  return (
    <div style={{ padding: '24px' }}>
      <Typography variant="h4" gutterBottom className="text-gray-900 dark:text-white">
        IPv4 Troubleshooting Scenarios
      </Typography>
      <Typography variant="body1" className="text-gray-700 dark:text-gray-300" paragraph>
        Diagnose and resolve common IPv4 networking problems
      </Typography>

      <ScenarioSelector
        selectedScenario={selectedScenario}
        onScenarioChange={handleScenarioChange}
      />

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

        <TabPanel value={tabValue} index={0}>
          <ProblemOverviewTab
            scenario={selectedScenario}
            showHints={showHints}
            onToggleHints={() => setShowHints(!showHints)}
          />
        </TabPanel>

        <TabPanel value={tabValue} index={1}>
          <CardContent>
            <NetworkDiagram scenario={selectedScenario} />
          </CardContent>
        </TabPanel>

        <TabPanel value={tabValue} index={2}>
          <DiagnosticsTab scenario={selectedScenario} />
        </TabPanel>

        <TabPanel value={tabValue} index={3}>
          <SolutionStepsTab
            scenario={selectedScenario}
            activeStep={activeStep}
            showSolution={showSolution}
            onToggleSolution={() => setShowSolution(!showSolution)}
            onStepChange={setActiveStep}
            onReset={() => {
              setActiveStep(0);
              setShowSolution(false);
            }}
          />
        </TabPanel>

        <TabPanel value={tabValue} index={4}>
          <CardContent>
            <div style={{ marginBottom: '16px' }}>
              <Typography variant="h6" gutterBottom className="text-gray-900 dark:text-white">
                Step-by-Step Troubleshooting Guide
              </Typography>
              <Typography variant="body2" className="text-gray-700 dark:text-gray-300" paragraph>
                Follow these methodical steps to diagnose IPv4 connectivity issues
              </Typography>
            </div>
            <TroubleshootingWizard wizardStep={wizardStep} setWizardStep={setWizardStep} />
          </CardContent>
        </TabPanel>

        <TabPanel value={tabValue} index={5}>
          <ValidatorTab
            validatorIP={validatorIP}
            validatorMask={validatorMask}
            validatorGateway={validatorGateway}
            onIPChange={setValidatorIP}
            onMaskChange={setValidatorMask}
            onGatewayChange={setValidatorGateway}
            validationResults={validationResults}
          />
        </TabPanel>

        <TabPanel value={tabValue} index={6}>
          <RoutingTableTab
            showRoutingTable={showRoutingTable}
            onToggleTable={() => setShowRoutingTable(!showRoutingTable)}
            routingTable={routingTable}
          />
        </TabPanel>

        <TabPanel value={tabValue} index={7}>
          <ARPTableTab
            showARPTable={showARPTable}
            onToggleTable={() => setShowARPTable(!showARPTable)}
            arpTable={arpTable}
          />
        </TabPanel>
      </Card>

      <EducationalReference />

      <ValidatorDialog
        open={validatorOpen}
        onClose={() => setValidatorOpen(false)}
        validatorIP={validatorIP}
        validatorMask={validatorMask}
        validatorGateway={validatorGateway}
        onIPChange={setValidatorIP}
        onMaskChange={setValidatorMask}
        onGatewayChange={setValidatorGateway}
        validationResults={validationResults}
      />
    </div>
  );
};

export default IPv4Troubleshooter;
