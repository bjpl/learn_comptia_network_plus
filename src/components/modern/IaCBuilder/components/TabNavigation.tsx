import React from 'react';
import type { IaCTab } from '../types';

interface TabNavigationProps {
  activeTab: IaCTab;
  onTabChange: (tab: IaCTab) => void;
}

const TABS: readonly IaCTab[] = ['concepts', 'templates', 'builder', 'drift', 'pipeline', 'tools'];

export const TabNavigation: React.FC<TabNavigationProps> = ({ activeTab, onTabChange }) => {
  return (
    <div className="mb-6 flex gap-2 overflow-x-auto border-b-2 border-gray-200">
      {TABS.map((tab) => (
        <button
          key={tab}
          onClick={() => onTabChange(tab)}
          className={`whitespace-nowrap px-6 py-3 font-semibold transition-all ${
            activeTab === tab
              ? 'border-b-4 border-blue-600 text-blue-600'
              : 'text-gray-800 hover:text-blue-500 dark:text-gray-200'
          }`}
        >
          {tab.charAt(0).toUpperCase() + tab.slice(1)}
        </button>
      ))}
    </div>
  );
};
