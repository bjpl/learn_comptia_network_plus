/**
 * Account Details Section Component
 */

import React from 'react';
import type { User } from '../../../../types/auth';
import { formatDate } from '../utils/formatting';

interface AccountDetailsSectionProps {
  user: User;
}

export const AccountDetailsSection: React.FC<AccountDetailsSectionProps> = ({ user }) => {
  return (
    <div className="profile-section">
      <h2>Account Details</h2>
      <div className="account-details">
        <div className="detail-row">
          <span className="detail-label">User ID:</span>
          <span className="detail-value">{user.id}</span>
        </div>
        <div className="detail-row">
          <span className="detail-label">Member Since:</span>
          <span className="detail-value">{formatDate(user.createdAt)}</span>
        </div>
        {user.lastLogin && (
          <div className="detail-row">
            <span className="detail-label">Last Login:</span>
            <span className="detail-value">{formatDate(user.lastLogin)}</span>
          </div>
        )}
      </div>
    </div>
  );
};
