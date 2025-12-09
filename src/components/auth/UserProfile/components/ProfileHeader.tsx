/**
 * Profile Header Component
 */

import React from 'react';
import { getUserDisplayName, getUserInitials } from '../../../../utils/auth';
import type { User } from '../../../../types/auth';

interface ProfileHeaderProps {
  user: User;
}

export const ProfileHeader: React.FC<ProfileHeaderProps> = ({ user }) => {
  return (
    <div className="profile-header">
      <div className="profile-avatar">
        {user.avatar ? (
          <img src={user.avatar} alt={getUserDisplayName(user)} />
        ) : (
          <div className="avatar-placeholder">{getUserInitials(user)}</div>
        )}
      </div>
      <div className="profile-info">
        <h1>{getUserDisplayName(user)}</h1>
        <p className="profile-role">{user.role}</p>
        {user.emailVerified ? (
          <span className="badge badge-success">Email Verified</span>
        ) : (
          <span className="badge badge-warning">Email Not Verified</span>
        )}
      </div>
    </div>
  );
};
