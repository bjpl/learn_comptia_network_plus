/**
 * Tab Navigation Component
 */

import React from 'react';
import type { TabType } from '../types';
import { getTabLabel, TAB_OPTIONS } from '../utils/tabLabels';

interface TabNavigationProps {
  activeTab: TabType;
  onTabChange: (tab: TabType) => void;
}

export const TabNavigation: React.FC<TabNavigationProps> = ({ activeTab, onTabChange }) => {
  return (
    <div className="tab-nav">
      {TAB_OPTIONS.map((tab) => (
        <button
          key={tab}
          className={`tab-btn ${activeTab === tab ? 'active' : ''}`}
          onClick={() => onTabChange(tab)}
        >
          {getTabLabel(tab)}
        </button>
      ))}
    </div>
  );
};
