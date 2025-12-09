/**
 * Quick action buttons component
 */

import React from 'react';

interface QuickActionsProps {
  onScan: () => void;
  onAssess: () => void;
  onScore: () => void;
  onHelp: () => void;
  disabled: boolean;
}

export const QuickActions: React.FC<QuickActionsProps> = ({
  onScan,
  onAssess,
  onScore,
  onHelp,
  disabled,
}) => {
  return (
    <div className="quick-actions">
      <button onClick={onScan} disabled={disabled}>
        🔍 Scan Network
      </button>
      <button onClick={onAssess}>📊 Start Assessment</button>
      <button onClick={onScore}>🏆 Show Score</button>
      <button onClick={onHelp}>❓ Help</button>
    </div>
  );
};
