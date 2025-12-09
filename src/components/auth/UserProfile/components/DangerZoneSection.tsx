/**
 * Danger Zone Section Component
 */

import React from 'react';

interface DangerZoneSectionProps {
  onLogout: () => void;
  onDeleteAccount: () => void;
}

export const DangerZoneSection: React.FC<DangerZoneSectionProps> = ({
  onLogout,
  onDeleteAccount,
}) => {
  return (
    <div className="profile-section danger-zone">
      <h2>Danger Zone</h2>
      <div className="danger-actions">
        <button onClick={onLogout} className="btn-danger btn-full">
          Sign Out
        </button>
        <button className="btn-danger-outline btn-full" onClick={onDeleteAccount}>
          Delete Account
        </button>
      </div>
    </div>
  );
};
