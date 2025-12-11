/**
 * NavigationTabs Component
 */

import React from 'react';
import type { ViewMode, ModeConfig } from '../types';

interface NavigationTabsProps {
  viewMode: ViewMode;
  modeConfig: ModeConfig;
  onViewModeChange: (mode: ViewMode) => void;
}

export const NavigationTabs: React.FC<NavigationTabsProps> = ({
  viewMode,
  modeConfig,
  onViewModeChange,
}) => {
  const tabs = [
    { key: 'practice' as ViewMode, label: '📝 Practice', icon: '' },
    { key: 'tools' as ViewMode, label: '🔧 Tools', icon: '' },
    {
      key: 'methodology' as ViewMode,
      label: '📋 Methodology',
      icon: '',
      disabled: !modeConfig.wizardEnabled,
    },
    { key: 'analytics' as ViewMode, label: '📊 Analytics', icon: '' },
    { key: 'reference' as ViewMode, label: '📚 Reference', icon: '' },
  ];

  return (
    <div
      className="border-gray-300 dark:border-gray-600"
      style={{
        display: 'flex',
        gap: '4px',
        borderBottom: '2px solid',
      }}
    >
      {tabs.map((tab) => (
        <button
          key={tab.key}
          onClick={() => !tab.disabled && onViewModeChange(tab.key)}
          disabled={tab.disabled}
          className={viewMode !== tab.key ? (tab.disabled ? 'text-gray-400 dark:text-gray-600' : 'text-gray-700 dark:text-gray-300') : ''}
          style={{
            padding: '12px 24px',
            backgroundColor: viewMode === tab.key ? '#2196F3' : 'transparent',
            color: viewMode === tab.key ? '#fff' : undefined,
            border: 'none',
            borderBottom: viewMode === tab.key ? 'none' : '2px solid transparent',
            borderRadius: '8px 8px 0 0',
            fontWeight: viewMode === tab.key ? 'bold' : 'normal',
            fontSize: '14px',
            cursor: tab.disabled ? 'not-allowed' : 'pointer',
            transition: 'all 0.2s',
          }}
        >
          {tab.label}
        </button>
      ))}
    </div>
  );
};
