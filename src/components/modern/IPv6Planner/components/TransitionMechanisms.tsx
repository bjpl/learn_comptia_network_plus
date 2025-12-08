/**
 * IPv6 Transition Mechanisms Component
 * Displays migration planning tools and scenarios
 */

import React from 'react';
import type { IPv6MigrationScenario, MigrationMethod, MigrationPlan } from '../../modern-types';
import { migrationScenarios } from '../../modern-data';
import { METHOD_INFO } from '../constants';
import { formatCurrency, getRiskColor } from '../utils/ipv6Calculations';

interface TransitionMechanismsProps {
  selectedScenario: IPv6MigrationScenario | null;
  setSelectedScenario: (scenario: IPv6MigrationScenario | null) => void;
  selectedMethod: MigrationMethod;
  setSelectedMethod: (method: MigrationMethod) => void;
  migrationPlan: MigrationPlan | null;
  activePhase: number;
  setActivePhase: (phase: number) => void;
  onGeneratePlan: () => void;
}

const TransitionMechanisms: React.FC<TransitionMechanismsProps> = ({
  selectedScenario,
  setSelectedScenario,
  selectedMethod,
  setSelectedMethod,
  migrationPlan,
  activePhase,
  setActivePhase,
  onGeneratePlan,
}) => {
  return (
    <div className="space-y-6">
      {/* Scenario Selection */}
      <div className="mb-6">
        <h3 className="mb-3 text-xl font-semibold">Select Migration Scenario</h3>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          {migrationScenarios.map((scenario) => (
            <button
              key={scenario.id}
              onClick={() => setSelectedScenario(scenario)}
              className={`rounded-lg border-2 p-4 text-left transition-all ${
                selectedScenario?.id === scenario.id
                  ? 'border-blue-500 bg-blue-50'
                  : 'border-gray-300 hover:border-blue-300'
              }`}
            >
              <div className="mb-2 flex items-start justify-between">
                <div className="font-semibold text-gray-800">{scenario.name}</div>
                <span
                  className={`rounded-full px-2 py-1 text-xs ${
                    scenario.complexity === 'critical'
                      ? 'bg-red-100 text-red-700'
                      : scenario.complexity === 'high'
                        ? 'bg-orange-100 text-orange-700'
                        : scenario.complexity === 'medium'
                          ? 'bg-yellow-100 text-yellow-700'
                          : 'bg-green-100 text-green-700'
                  }`}
                >
                  {scenario.complexity}
                </span>
              </div>
              <p className="mb-3 text-sm text-gray-700">{scenario.description}</p>
              <div className="grid grid-cols-2 gap-2 text-sm">
                <div>
                  <span className="text-gray-700">Devices:</span>{' '}
                  <span className="font-semibold">{scenario.currentState.devices}</span>
                </div>
                <div>
                  <span className="text-gray-700">Subnets:</span>{' '}
                  <span className="font-semibold">{scenario.currentState.subnets}</span>
                </div>
                <div>
                  <span className="text-gray-700">IPv6 Ready:</span>{' '}
                  <span className="font-semibold">
                    {scenario.currentState.infrastructure.routers.ipv6Capable}/
                    {scenario.currentState.infrastructure.routers.total} routers
                  </span>
                </div>
                <div>
                  <span className="text-gray-700">Constraints:</span>{' '}
                  <span className="font-semibold">{scenario.constraints.length}</span>
                </div>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Migration Method Selection */}
      {selectedScenario && (
        <div className="mb-6">
          <h3 className="mb-3 text-xl font-semibold">Select Migration Method</h3>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
            {(Object.keys(METHOD_INFO) as MigrationMethod[]).map((method) => (
              <button
                key={method}
                onClick={() => setSelectedMethod(method)}
                className={`rounded-lg border-2 p-4 text-left transition-all ${
                  selectedMethod === method
                    ? 'border-green-500 bg-green-50'
                    : 'border-gray-300 hover:border-green-300'
                }`}
              >
                <div className="mb-2 font-semibold text-gray-800">
                  {METHOD_INFO[method].name}
                </div>
                <p className="mb-3 text-sm text-gray-600">{METHOD_INFO[method].description}</p>
                <div className="space-y-1 text-xs">
                  <div className="font-semibold text-green-700">Pros:</div>
                  {METHOD_INFO[method].pros.slice(0, 2).map((pro, idx) => (
                    <div key={idx} className="text-gray-700">
                      • {pro}
                    </div>
                  ))}
                  <div className="mt-2 font-semibold text-red-700">Cons:</div>
                  {METHOD_INFO[method].cons.slice(0, 2).map((con, idx) => (
                    <div key={idx} className="text-gray-700">
                      • {con}
                    </div>
                  ))}
                </div>
              </button>
            ))}
          </div>
          <div className="mt-4 text-center">
            <button
              onClick={onGeneratePlan}
              className="rounded-lg bg-blue-600 px-8 py-3 font-semibold text-white transition-colors hover:bg-blue-700"
            >
              Generate Migration Plan
            </button>
          </div>
        </div>
      )}

      {/* Migration Plan Display */}
      {migrationPlan && (
        <div className="space-y-6">
          {/* Plan Overview */}
          <div className="rounded-lg border-2 border-blue-300 bg-gradient-to-r from-blue-50 to-green-50 p-6">
            <h3 className="mb-4 text-2xl font-bold">Migration Plan Overview</h3>
            <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
              <div className="rounded-lg bg-white p-4">
                <div className="mb-1 text-sm text-gray-700">Duration</div>
                <div className="text-2xl font-bold text-blue-600">
                  {migrationPlan.timeline.totalDays} days
                </div>
                <div className="text-xs text-gray-500">
                  {(migrationPlan.timeline.totalDays / 30).toFixed(1)} months
                </div>
              </div>
              <div className="rounded-lg bg-white p-4">
                <div className="mb-1 text-sm text-gray-700">Total Budget</div>
                <div className="text-2xl font-bold text-green-600">
                  {formatCurrency(migrationPlan.budget.total)}
                </div>
              </div>
              <div className="rounded-lg bg-white p-4">
                <div className="mb-1 text-sm text-gray-700">Phases</div>
                <div className="text-2xl font-bold text-purple-600">
                  {migrationPlan.phases.length}
                </div>
              </div>
              <div className="rounded-lg bg-white p-4">
                <div className="mb-1 text-sm text-gray-700">Risks</div>
                <div className="text-2xl font-bold text-orange-600">
                  {migrationPlan.riskAssessment.length}
                </div>
              </div>
            </div>

            {/* Budget Breakdown */}
            <div className="mt-4 rounded-lg bg-white p-4">
              <h4 className="mb-2 font-semibold">Budget Breakdown</h4>
              <div className="grid grid-cols-2 gap-3 text-sm md:grid-cols-4">
                <div>
                  <span className="text-gray-700">Hardware:</span>{' '}
                  <span className="font-semibold">
                    {formatCurrency(migrationPlan.budget.hardware)}
                  </span>
                </div>
                <div>
                  <span className="text-gray-700">Software:</span>{' '}
                  <span className="font-semibold">
                    {formatCurrency(migrationPlan.budget.software)}
                  </span>
                </div>
                <div>
                  <span className="text-gray-700">Training:</span>{' '}
                  <span className="font-semibold">
                    {formatCurrency(migrationPlan.budget.training)}
                  </span>
                </div>
                <div>
                  <span className="text-gray-700">Consulting:</span>{' '}
                  <span className="font-semibold">
                    {formatCurrency(migrationPlan.budget.consulting)}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Phase Navigation */}
          <div className="flex gap-2 overflow-x-auto pb-2">
            {migrationPlan.phases.map((phase, idx) => (
              <button
                key={phase.id}
                onClick={() => setActivePhase(idx)}
                className={`whitespace-nowrap rounded-lg px-4 py-2 transition-all ${
                  activePhase === idx
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                }`}
              >
                Phase {idx + 1}: {phase.name}
              </button>
            ))}
          </div>

          {/* Active Phase Details */}
          {migrationPlan.phases[activePhase] && (
            <div className="rounded-lg border-2 border-gray-300 p-6">
              <div className="mb-4 flex items-start justify-between">
                <div>
                  <h3 className="text-2xl font-bold">
                    Phase {activePhase + 1}: {migrationPlan.phases[activePhase].name}
                  </h3>
                  <p className="text-gray-700">
                    Method: {METHOD_INFO[migrationPlan.phases[activePhase].method].name}
                  </p>
                </div>
                <div className="text-right">
                  <div className="text-2xl font-bold text-blue-600">
                    {migrationPlan.phases[activePhase].duration} days
                  </div>
                  <div className="text-lg text-green-600">
                    {formatCurrency(migrationPlan.phases[activePhase].cost)}
                  </div>
                </div>
              </div>

              {/* Tasks */}
              <div className="mb-6">
                <h4 className="mb-3 font-semibold">
                  Tasks ({migrationPlan.phases[activePhase].tasks.length})
                </h4>
                <div className="space-y-3">
                  {migrationPlan.phases[activePhase].tasks.map((task) => (
                    <div
                      key={task.id}
                      className="rounded-lg border-l-4 border-blue-500 bg-gray-50 p-4"
                    >
                      <div className="mb-2 flex items-start justify-between">
                        <div className="font-semibold">{task.description}</div>
                        <span className="text-sm text-gray-700">{task.duration} days</span>
                      </div>
                      <div className="grid grid-cols-1 gap-2 text-sm md:grid-cols-2">
                        <div>
                          <span className="text-gray-700">Resources:</span>{' '}
                          <span className="text-gray-800">{task.resources.join(', ')}</span>
                        </div>
                        <div>
                          <span className="text-gray-700">Validation:</span>{' '}
                          <span className="text-gray-800">{task.validation.length} checks</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Risks */}
              <div>
                <h4 className="mb-3 font-semibold">
                  Phase Risks ({migrationPlan.phases[activePhase].risks.length})
                </h4>
                <div className="space-y-3">
                  {migrationPlan.phases[activePhase].risks.map((risk, idx) => (
                    <div
                      key={idx}
                      className={`rounded-lg border-2 p-4 ${getRiskColor(risk.probability, risk.impact)}`}
                    >
                      <div className="mb-1 font-semibold">{risk.description}</div>
                      <div className="mb-2 text-sm">
                        <span className="text-gray-800">Probability:</span>{' '}
                        <span className="font-semibold">{risk.probability}</span>
                        {' | '}
                        <span className="text-gray-800">Impact:</span>{' '}
                        <span className="font-semibold">{risk.impact}</span>
                      </div>
                      <div className="text-sm">
                        <span className="text-gray-800">Mitigation:</span> {risk.mitigation}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Success Metrics */}
          <div className="rounded-lg border-2 border-green-300 bg-green-50 p-6">
            <h3 className="mb-4 text-xl font-bold">Success Metrics</h3>
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
              {migrationPlan.successMetrics.map((metric, idx) => (
                <div key={idx} className="rounded-lg bg-white p-4">
                  <div className="mb-1 font-semibold text-gray-800">{metric.name}</div>
                  <div className="mb-1 text-2xl font-bold text-green-600">
                    {metric.target}
                    {metric.unit}
                  </div>
                  <div className="text-sm text-gray-700">
                    Measured via: {metric.measurement}
                  </div>
                  <div className="mt-2">
                    <span
                      className={`rounded-full px-2 py-1 text-xs ${
                        metric.priority === 'high'
                          ? 'bg-red-100 text-red-700'
                          : metric.priority === 'medium'
                            ? 'bg-yellow-100 text-yellow-700'
                            : 'bg-blue-100 text-blue-700'
                      }`}
                    >
                      {metric.priority} priority
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Instructions */}
      {!selectedScenario && (
        <div className="mt-6 rounded-lg border-2 border-blue-200 bg-blue-50 p-6">
          <h3 className="mb-3 text-lg font-semibold">How to Use This Planner:</h3>
          <ol className="list-inside list-decimal space-y-2 text-gray-800">
            <li>Select a migration scenario that matches your environment</li>
            <li>
              Choose the most appropriate migration method (dual stack, tunneling, or NAT64)
            </li>
            <li>
              Click &quot;Generate Migration Plan&quot; to create a detailed implementation plan
            </li>
            <li>Review each phase, including tasks, timeline, costs, and risks</li>
            <li>Use the success metrics to measure migration progress and success</li>
          </ol>
        </div>
      )}
    </div>
  );
};

export default TransitionMechanisms;
