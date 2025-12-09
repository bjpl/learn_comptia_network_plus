/**
 * Custom hook for managing troubleshooter state
 */
import { useState, useMemo } from 'react';
import type { TroubleshootingScenario } from '../../ipv4-types';
import { troubleshootingScenarios } from '../../ipv4-data';
import { validateIPConfiguration } from '../utils/validators';
import { generateRoutingTable, generateARPTable } from '../utils/tableGenerators';

export const useTroubleshooter = () => {
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

  const validationResults = useMemo(
    () => validateIPConfiguration(validatorIP, validatorMask, validatorGateway),
    [validatorIP, validatorMask, validatorGateway]
  );

  const routingTable = useMemo(() => generateRoutingTable(), []);
  const arpTable = useMemo(() => generateARPTable(), []);

  return {
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
  };
};
