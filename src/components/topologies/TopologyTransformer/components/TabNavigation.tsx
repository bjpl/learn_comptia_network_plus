/**
 * Tab navigation component for switching between different views
 */

import React from 'react';
import type { TabType } from '../types';

interface TabNavigationProps {
  activeTab: TabType;
  onTabChange: (tab: TabType) => void;
}

export const TabNavigation: React.FC<TabNavigationProps> = ({ activeTab, onTabChange }) => {
  return (
    <div className="tab-navigation">
      <button
        className={`tab-btn ${activeTab === 'transform' ? 'active' : ''}`}
        onClick={() => onTabChange('transform')}
      >
        <span className="tab-icon">↔</span> Topology Conversions
      </button>
      <button
        className={`tab-btn ${activeTab === 'compare' ? 'active' : ''}`}
        onClick={() => onTabChange('compare')}
      >
        <span className="tab-icon">⚖</span> Comparison Matrix
      </button>
      <button
        className={`tab-btn ${activeTab === 'scenarios' ? 'active' : ''}`}
        onClick={() => onTabChange('scenarios')}
      >
        <span className="tab-icon">✓</span> Exam Scenarios
      </button>
    </div>
  );
};
