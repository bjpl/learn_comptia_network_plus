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
      style={{
        display: 'flex',
        gap: '4px',
        borderBottom: '2px solid #e0e0e0',
      }}
    >
      {tabs.map((tab) => (
        <button
          key={tab.key}
          onClick={() => !tab.disabled && onViewModeChange(tab.key)}
          disabled={tab.disabled}
          style={{
            padding: '12px 24px',
            backgroundColor: viewMode === tab.key ? '#2196F3' : 'transparent',
            color: viewMode === tab.key ? '#fff' : tab.disabled ? '#ccc' : '#666',
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
