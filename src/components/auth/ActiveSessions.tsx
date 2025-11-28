/**
 * Active Sessions Management Component
 * Displays and manages user's active device sessions
 */

import React, { useState, useEffect } from 'react';
import {
  getDeviceSessions,
  removeSession,
  removeAllOtherSessions,
  formatRelativeTime,
} from '../../utils/security';
import type { DeviceSession } from '../../types/security';
import './ActiveSessions.css';

interface ActiveSessionsProps {
  onClose: () => void;
}

export const ActiveSessions: React.FC<ActiveSessionsProps> = ({ onClose }) => {
  const [sessions, setSessions] = useState<DeviceSession[]>([]);
  const [confirmSignOut, setConfirmSignOut] = useState<string | null>(null);
  const [confirmSignOutAll, setConfirmSignOutAll] = useState(false);

  useEffect(() => {
    loadSessions();
  }, []);

  const loadSessions = () => {
    const deviceSessions = getDeviceSessions();
    setSessions(deviceSessions);
  };

  const handleSignOut = (sessionId: string) => {
    const updated = removeSession(sessionId);
    setSessions(updated);
    setConfirmSignOut(null);
  };

  const handleSignOutAll = () => {
    const updated = removeAllOtherSessions();
    setSessions(updated);
    setConfirmSignOutAll(false);
  };

  const getDeviceIcon = (deviceType: DeviceSession['deviceType']): string => {
    switch (deviceType) {
      case 'Desktop':
        return '🖥️';
      case 'Mobile':
        return '📱';
      case 'Tablet':
        return '📱';
      default:
        return '💻';
    }
  };

  const otherSessions = sessions.filter((s) => !s.isCurrent);

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content sessions-modal" onClick={(e) => e.stopPropagation()}>
        <button className="modal-close" onClick={onClose} aria-label="Close modal">
          ×
        </button>

        <div className="sessions-header">
          <h2>Active Sessions</h2>
          <p>Manage devices that are currently signed in to your account</p>
        </div>

        <div className="sessions-list">
          {sessions.map((session) => (
            <div key={session.id} className={`session-item ${session.isCurrent ? 'current' : ''}`}>
              <div className="session-icon">{getDeviceIcon(session.deviceType)}</div>

              <div className="session-details">
                <div className="session-device">
                  <strong>
                    {session.browser} on {session.deviceType}
                  </strong>
                  {session.isCurrent && <span className="badge-current">Current Session</span>}
                </div>

                <div className="session-info">
                  <span className="session-location">
                    {session.location.city}, {session.location.country}
                  </span>
                  <span className="session-separator">•</span>
                  <span className="session-ip">{session.ipAddress}</span>
                </div>

                <div className="session-time">
                  Last active: {formatRelativeTime(session.lastActive)}
                </div>
              </div>

              {!session.isCurrent && (
                <div className="session-actions">
                  {confirmSignOut === session.id ? (
                    <div className="confirm-actions">
                      <button className="btn-danger-sm" onClick={() => handleSignOut(session.id)}>
                        Confirm
                      </button>
                      <button className="btn-secondary-sm" onClick={() => setConfirmSignOut(null)}>
                        Cancel
                      </button>
                    </div>
                  ) : (
                    <button
                      className="btn-secondary-sm"
                      onClick={() => setConfirmSignOut(session.id)}
                    >
                      Sign Out
                    </button>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>

        {otherSessions.length > 0 && (
          <div className="sessions-footer">
            {confirmSignOutAll ? (
              <div className="confirm-signout-all">
                <p>
                  Are you sure you want to sign out all other sessions? You will need to sign in
                  again on those devices.
                </p>
                <div className="confirm-actions">
                  <button className="btn-secondary" onClick={() => setConfirmSignOutAll(false)}>
                    Cancel
                  </button>
                  <button className="btn-danger" onClick={handleSignOutAll}>
                    Sign Out All Others
                  </button>
                </div>
              </div>
            ) : (
              <button className="btn-danger btn-full" onClick={() => setConfirmSignOutAll(true)}>
                Sign Out All Other Sessions
              </button>
            )}
          </div>
        )}

        {otherSessions.length === 0 && (
          <div className="no-other-sessions">
            <p>You do not have any other active sessions</p>
          </div>
        )}
      </div>
    </div>
  );
};
