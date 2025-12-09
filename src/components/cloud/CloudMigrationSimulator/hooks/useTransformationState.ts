import { useState, useMemo } from 'react';
import {
  migrationStrategies,
  migrationScenarios,
  defaultCostModel,
  calculateTotalCost,
  type CostModel,
} from '../../../../data/migration-data';
import type { ChecklistItems } from '../types';

export const useTransformationState = () => {
  const [selectedScenario, setSelectedScenario] = useState<string>('legacy-to-aws');
  const [selectedStrategy, setSelectedStrategy] = useState<string>('replatform');
  const [activePhase, setActivePhase] = useState<number>(0);
  const [customCostModel, setCustomCostModel] = useState<CostModel>(defaultCostModel);
  const [checkedItems, setCheckedItems] = useState<ChecklistItems>({});
  const [view, setView] = useState<
    'overview' | 'strategy' | 'phases' | 'costs' | 'risks' | 'timeline'
  >('overview');

  const scenario = useMemo(
    () => migrationScenarios.find((s) => s.id === selectedScenario) || migrationScenarios[0],
    [selectedScenario]
  );

  const strategy = useMemo(
    () => migrationStrategies.find((s) => s.id === selectedStrategy) || migrationStrategies[0],
    [selectedStrategy]
  );

  const overallProgress = useMemo(() => {
    const totalItems = scenario.phases.reduce((sum, phase) => sum + phase.checklist.length, 0);
    const completedItems = scenario.phases.reduce(
      (sum, phase) => sum + phase.checklist.filter((item) => checkedItems[item.id]).length,
      0
    );
    return totalItems > 0 ? Math.round((completedItems / totalItems) * 100) : 0;
  }, [scenario, checkedItems]);

  const handleToggleChecklistItem = (itemId: string) => {
    setCheckedItems((prev) => ({
      ...prev,
      [itemId]: !prev[itemId],
    }));
  };

  const handleCostUpdate = (category: 'onPremise' | 'cloud', field: string, value: number) => {
    setCustomCostModel((prev) => ({
      ...prev,
      [category]: {
        ...prev[category],
        [field]: value,
      },
    }));
  };

  const { onPremTotal, cloudTotal, savings } = calculateTotalCost(customCostModel);

  return {
    selectedScenario,
    setSelectedScenario,
    selectedStrategy,
    setSelectedStrategy,
    activePhase,
    setActivePhase,
    customCostModel,
    checkedItems,
    view,
    setView,
    scenario,
    strategy,
    overallProgress,
    handleToggleChecklistItem,
    handleCostUpdate,
    onPremTotal,
    cloudTotal,
    savings,
  };
};
