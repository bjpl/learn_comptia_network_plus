/**
 * State management hook for IPv6Planner
 */

import { useState } from 'react';
import type {
  TabType,
  MigrationMethod,
  SubnettingResult,
} from '../types';
import type {
  IPv6MigrationScenario,
  MigrationPlan,
} from '../../modern-types';

export const useIPv6State = () => {
  const [activeTab, setActiveTab] = useState<TabType>('migration');
  const [selectedScenario, setSelectedScenario] = useState<IPv6MigrationScenario | null>(null);
  const [selectedMethod, setSelectedMethod] = useState<MigrationMethod>('dual-stack');
  const [migrationPlan, setMigrationPlan] = useState<MigrationPlan | null>(null);
  const [activePhase, setActivePhase] = useState<number>(0);
  const [subnettingInput, setSubnettingInput] = useState<string>('2001:db8::/32');
  const [subnettingResult, setSubnettingResult] = useState<SubnettingResult | null>(null);
  const [currentQuestion, setCurrentQuestion] = useState<number>(0);
  const [answers, setAnswers] = useState<number[]>([]);
  const [showResults, setShowResults] = useState<boolean>(false);

  return {
    // Tab state
    activeTab,
    setActiveTab,

    // Migration planner state
    selectedScenario,
    setSelectedScenario,
    selectedMethod,
    setSelectedMethod,
    migrationPlan,
    setMigrationPlan,
    activePhase,
    setActivePhase,

    // Subnetting state
    subnettingInput,
    setSubnettingInput,
    subnettingResult,
    setSubnettingResult,

    // Quiz state
    currentQuestion,
    setCurrentQuestion,
    answers,
    setAnswers,
    showResults,
    setShowResults,
  };
};
