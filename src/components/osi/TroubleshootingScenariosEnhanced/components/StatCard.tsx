/**
 * StatCard Component
 */

import React from 'react';
import type { StatCardProps } from '../types';

export const StatCard: React.FC<StatCardProps> = ({ title, value, color }) => {
  return (
    <div
      style={{
        padding: '15px',
        backgroundColor: `${color}20`,
        borderRadius: '8px',
        textAlign: 'center',
        border: `2px solid ${color}40`,
      }}
    >
      <div style={{ fontSize: '24px', fontWeight: 'bold', color }}>{value}</div>
      <div
        className="text-gray-900 dark:text-gray-100"
        style={{ fontSize: '14px', marginTop: '4px' }}
      >
        {title}
      </div>
    </div>
  );
};
