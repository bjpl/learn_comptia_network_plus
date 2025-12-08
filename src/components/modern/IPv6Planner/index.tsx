/**
 * IPv6 Planner - Main Orchestrator Component
 * Coordinates all IPv6 learning, planning, and practice features
 */

import React from 'react';
import { useIPv6State } from './hooks/useIPv6State';
import { useIPv6Calculations } from './hooks/useIPv6Calculations';
import AddressInput from './components/AddressInput';
import AddressCalculator from './components/AddressCalculator';
import TransitionMechanisms from './components/TransitionMechanisms';
import IPv6PracticeQuiz from './components/IPv6PracticeQuiz';

const IPv6Planner: React.FC = () => {
  const state = useIPv6State();
  const { generateMigrationPlan } = useIPv6Calculations();

  const handleGeneratePlan = () => {
    const plan = generateMigrationPlan(state.selectedScenario, state.selectedMethod);
    state.setMigrationPlan(plan);
    state.setActivePhase(0);
  };

  return (
    <div className="mx-auto max-w-7xl rounded-lg bg-white p-6 shadow-lg">
      <div className="mb-6">
        <h2 className="mb-2 text-3xl font-bold text-gray-800 dark:text-gray-100">
          Component 19: IPv6 Planner - Complete Learning Tool
        </h2>
        <p className="text-gray-700 dark:text-gray-400">
          Master IPv6 fundamentals, address types, subnetting, transition strategies, and exam
          practice.
        </p>
      </div>

      {/* Tab Navigation */}
      <div
        className="mb-6 flex gap-2 border-b border-gray-300"
        role="tablist"
        aria-label="IPv6 Planner sections"
      >
        <button
          onClick={() => state.setActiveTab('migration')}
          role="tab"
          aria-selected={state.activeTab === 'migration'}
          aria-controls="migration-panel"
          className={`px-4 py-2 font-semibold transition-colors ${
            state.activeTab === 'migration'
              ? 'border-b-2 border-blue-600 text-blue-600'
              : 'text-gray-600 hover:text-blue-600 dark:text-gray-400'
          }`}
        >
          Migration Planner
        </button>
        <button
          onClick={() => state.setActiveTab('fundamentals')}
          role="tab"
          aria-selected={state.activeTab === 'fundamentals'}
          aria-controls="fundamentals-panel"
          className={`px-4 py-2 font-semibold transition-colors ${
            state.activeTab === 'fundamentals'
              ? 'border-b-2 border-blue-600 text-blue-600'
              : 'text-gray-600 hover:text-blue-600 dark:text-gray-400'
          }`}
        >
          IPv6 Fundamentals
        </button>
        <button
          onClick={() => state.setActiveTab('subnetting')}
          role="tab"
          aria-selected={state.activeTab === 'subnetting'}
          aria-controls="subnetting-panel"
          className={`px-4 py-2 font-semibold transition-colors ${
            state.activeTab === 'subnetting'
              ? 'border-b-2 border-blue-600 text-blue-600'
              : 'text-gray-600 hover:text-blue-600 dark:text-gray-400'
          }`}
        >
          Subnetting Calculator
        </button>
        <button
          onClick={() => state.setActiveTab('practice')}
          role="tab"
          aria-selected={state.activeTab === 'practice'}
          aria-controls="practice-panel"
          className={`px-4 py-2 font-semibold transition-colors ${
            state.activeTab === 'practice'
              ? 'border-b-2 border-blue-600 text-blue-600'
              : 'text-gray-600 hover:text-blue-600 dark:text-gray-400'
          }`}
        >
          Exam Practice
        </button>
      </div>

      {/* Tab Content */}
      {state.activeTab === 'fundamentals' && <AddressInput />}

      {state.activeTab === 'subnetting' && (
        <AddressCalculator
          subnettingInput={state.subnettingInput}
          setSubnettingInput={state.setSubnettingInput}
          subnettingResult={state.subnettingResult}
          setSubnettingResult={state.setSubnettingResult}
        />
      )}

      {state.activeTab === 'practice' && (
        <IPv6PracticeQuiz
          currentQuestion={state.currentQuestion}
          setCurrentQuestion={state.setCurrentQuestion}
          answers={state.answers}
          setAnswers={state.setAnswers}
          showResults={state.showResults}
          setShowResults={state.setShowResults}
        />
      )}

      {state.activeTab === 'migration' && (
        <TransitionMechanisms
          selectedScenario={state.selectedScenario}
          setSelectedScenario={state.setSelectedScenario}
          selectedMethod={state.selectedMethod}
          setSelectedMethod={state.setSelectedMethod}
          migrationPlan={state.migrationPlan}
          activePhase={state.activePhase}
          setActivePhase={state.setActivePhase}
          onGeneratePlan={handleGeneratePlan}
        />
      )}
    </div>
  );
};

export default IPv6Planner;
