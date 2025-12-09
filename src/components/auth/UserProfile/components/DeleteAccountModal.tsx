/**
 * Delete Account Modal Component
 */

import React from 'react';

interface DeleteAccountModalProps {
  userEmail: string;
  deleteConfirmation: string;
  isDeletingAccount: boolean;
  deleteInputRef: React.RefObject<HTMLInputElement>;
  onClose: () => void;
  onConfirmationChange: (value: string) => void;
  onDelete: () => void;
}

export const DeleteAccountModal: React.FC<DeleteAccountModalProps> = ({
  userEmail,
  deleteConfirmation,
  isDeletingAccount,
  deleteInputRef,
  onClose,
  onConfirmationChange,
  onDelete,
}) => {
  return (
    <div
      className="modal-overlay"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby="delete-modal-title"
    >
      <div className="modal-content modal-danger" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2 id="delete-modal-title">Delete Account</h2>
          <button
            className="modal-close"
            onClick={onClose}
            aria-label="Close modal"
            disabled={isDeletingAccount}
          >
            &times;
          </button>
        </div>

        <div className="modal-body">
          <div className="warning-box">
            <p className="warning-title">Warning: This action cannot be undone!</p>
            <p>Deleting your account will:</p>
            <ul>
              <li>Permanently delete all your personal data</li>
              <li>Remove all your progress and achievements</li>
              <li>Cancel any active subscriptions</li>
              <li>Delete all saved content and preferences</li>
            </ul>
          </div>

          <div className="form-group">
            <label htmlFor="deleteConfirmation">
              To confirm, type <strong>DELETE</strong> or your email <strong>{userEmail}</strong>
            </label>
            <input
              ref={deleteInputRef}
              type="text"
              id="deleteConfirmation"
              value={deleteConfirmation}
              onChange={(e) => onConfirmationChange(e.target.value)}
              disabled={isDeletingAccount}
              placeholder="Type DELETE or your email"
              autoComplete="off"
            />
          </div>
        </div>

        <div className="modal-footer">
          <button className="btn-secondary" onClick={onClose} disabled={isDeletingAccount}>
            Cancel
          </button>
          <button
            className="btn-danger"
            onClick={onDelete}
            disabled={
              isDeletingAccount ||
              (deleteConfirmation !== 'DELETE' && deleteConfirmation !== userEmail)
            }
          >
            {isDeletingAccount ? 'Deleting...' : 'Delete Account Permanently'}
          </button>
        </div>
      </div>
    </div>
  );
};
