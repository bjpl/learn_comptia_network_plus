import React from 'react';
import type { ViewMode, ViewModeOption } from '../types';

interface ViewModeTabsProps {
  viewMode: ViewMode;
  onViewModeChange: (mode: ViewMode) => void;
}

const VIEW_MODE_OPTIONS: ViewModeOption[] = [
  { id: 'comparison', label: 'Device Comparison', icon: '📊' },
  { id: 'feature-matrix', label: 'Feature Matrix', icon: '📋' },
  { id: 'decision-helper', label: 'Which Device?', icon: '🧭' },
  { id: 'exam-questions', label: 'Exam Questions', icon: '🎓' },
];

const ViewModeTabs: React.FC<ViewModeTabsProps> = ({ viewMode, onViewModeChange }) => {
  return (
    <div className="mb-6 rounded-lg bg-white p-4 shadow-lg dark:bg-gray-800">
      <div className="flex flex-wrap gap-2">
        {VIEW_MODE_OPTIONS.map((mode) => (
          <button
            key={mode.id}
            onClick={() => onViewModeChange(mode.id)}
            className={`flex-1 rounded-lg px-4 py-3 font-semibold transition-all ${
              viewMode === mode.id
                ? 'bg-blue-600 text-white shadow-lg'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600'
            }`}
          >
            <span className="mr-2">{mode.icon}</span>
            {mode.label}
          </button>
        ))}
      </div>
    </div>
  );
};

export default ViewModeTabs;
