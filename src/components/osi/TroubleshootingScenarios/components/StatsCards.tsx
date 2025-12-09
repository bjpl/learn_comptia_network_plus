import React from 'react';
import type { TroubleshootingStats } from '../types';
import { TROUBLESHOOTING_SCENARIOS } from '../../osi-data';

interface StatsCardsProps {
  stats: TroubleshootingStats;
}

export const StatsCards: React.FC<StatsCardsProps> = ({ stats }) => {
  return (
    <div
      className="stats"
      style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
        gap: '15px',
        marginTop: '20px',
        marginBottom: '20px',
      }}
    >
      <div
        className="bg-blue-50 dark:bg-blue-950"
        style={{
          padding: '15px',
          borderRadius: '8px',
          textAlign: 'center',
        }}
      >
        <div
          className="text-gray-900 dark:text-gray-100"
          style={{ fontSize: '24px', fontWeight: 'bold' }}
        >
          {stats.attempted}/{TROUBLESHOOTING_SCENARIOS.length}
        </div>
        <div style={{ fontSize: '14px' }} className="text-gray-900 dark:text-gray-100">
          Scenarios Attempted
        </div>
      </div>

      <div
        className="bg-green-50 dark:bg-green-950"
        style={{
          padding: '15px',
          borderRadius: '8px',
          textAlign: 'center',
        }}
      >
        <div
          className="text-gray-900 dark:text-gray-100"
          style={{ fontSize: '24px', fontWeight: 'bold' }}
        >
          {stats.correct}
        </div>
        <div style={{ fontSize: '14px' }} className="text-gray-900 dark:text-gray-100">
          Correct Layer IDs
        </div>
      </div>

      <div
        className="bg-orange-50 dark:bg-orange-950"
        style={{
          padding: '15px',
          borderRadius: '8px',
          textAlign: 'center',
        }}
      >
        <div
          className="text-gray-900 dark:text-gray-100"
          style={{ fontSize: '24px', fontWeight: 'bold' }}
        >
          {Math.round(stats.avgScore)}%
        </div>
        <div style={{ fontSize: '14px' }} className="text-gray-900 dark:text-gray-100">
          Average Score
        </div>
      </div>
    </div>
  );
};
