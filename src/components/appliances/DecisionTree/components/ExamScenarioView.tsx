import React from 'react';
import { networkDevices } from '../../appliances-data';
import type { ExamScenarioViewProps } from '../types';

export const ExamScenarioView: React.FC<ExamScenarioViewProps> = ({ scenario, onClose, onNext }) => {
  const device = networkDevices.find((d) => d.id === scenario.answer);

  return (
    <div className="space-y-4 rounded-lg bg-gradient-to-br from-purple-50 to-pink-50 p-6 dark:from-purple-900 dark:to-pink-900">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-bold text-gray-800 dark:text-gray-100">Exam Scenario</h3>
        <button
          onClick={onClose}
          className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
        >
          Close
        </button>
      </div>

      <div className="rounded-lg bg-white p-4 dark:bg-gray-800">
        <h4 className="mb-2 font-semibold text-gray-800 dark:text-gray-100">{scenario.title}</h4>
        <p className="text-sm text-gray-700 dark:text-gray-300">{scenario.description}</p>
      </div>

      <div className="rounded-lg bg-white p-4 dark:bg-gray-800">
        <p className="mb-2 font-semibold text-gray-800 dark:text-gray-100">Correct Answer:</p>
        <p className="mb-2 font-medium text-green-700 dark:text-green-400">{device?.name}</p>
        <p className="text-sm text-gray-700 dark:text-gray-300">{scenario.reasoning}</p>
      </div>

      <button
        onClick={onNext}
        className="w-full rounded-lg bg-purple-500 px-4 py-2 font-medium text-white transition-colors hover:bg-purple-600"
      >
        Next Scenario
      </button>
    </div>
  );
};
