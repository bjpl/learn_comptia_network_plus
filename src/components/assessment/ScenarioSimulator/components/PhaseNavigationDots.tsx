/**
 * Phase navigation dots component
 */

import React from 'react';
import type { IntegratedScenario } from '../types';

interface PhaseNavigationDotsProps {
  scenario: IntegratedScenario;
  currentPhaseIndex: number;
  onSelectPhase: (index: number) => void;
}

export const PhaseNavigationDots: React.FC<PhaseNavigationDotsProps> = ({
  scenario,
  currentPhaseIndex,
  onSelectPhase,
}) => {
  return (
    <div className="flex justify-center gap-2">
      {scenario.phases.map((phase, idx) => (
        <button
          key={phase.id}
          onClick={() => onSelectPhase(idx)}
          className={`h-3 w-3 rounded-full transition-colors ${
            idx === currentPhaseIndex
              ? 'bg-blue-600'
              : idx < currentPhaseIndex
                ? 'bg-green-500'
                : 'bg-gray-300'
          }`}
          title={phase.title}
        />
      ))}
    </div>
  );
};
