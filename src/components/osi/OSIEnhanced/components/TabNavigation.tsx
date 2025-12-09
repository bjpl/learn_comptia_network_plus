/**
 * Tab navigation component for OSIEnhanced
 */

import React from 'react';
import type { TabType } from '../types';
import { TAB_CONFIGS } from '../utils/tabConfig';

interface TabNavigationProps {
  activeTab: TabType;
  onTabChange: (tab: TabType) => void;
}

export const TabNavigation: React.FC<TabNavigationProps> = ({ activeTab, onTabChange }) => {
  return (
    <div className="border-b border-gray-200 dark:border-gray-700">
      <nav
        className="-mb-px flex overflow-x-auto"
        role="tablist"
        aria-label="OSI Model sections"
      >
        {TAB_CONFIGS.map((tab) => (
          <button
            key={tab.id}
            onClick={() => onTabChange(tab.id)}
            role="tab"
            aria-selected={activeTab === tab.id}
            aria-controls={`${tab.id}-panel`}
            aria-label={tab.label}
            className={`flex items-center gap-2 whitespace-nowrap border-b-2 px-6 py-3 text-sm font-medium transition-colors ${
              activeTab === tab.id
                ? 'border-blue-600 text-blue-600 dark:text-blue-400'
                : 'border-transparent text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-100'
            } `}
          >
            <span aria-hidden="true">{tab.icon}</span>
            <span>{tab.label}</span>
          </button>
        ))}
      </nav>
    </div>
  );
};
