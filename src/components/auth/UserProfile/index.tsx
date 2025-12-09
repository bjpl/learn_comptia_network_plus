/**
 * User Profile Component - Main Entry Point
 * Displays and manages user profile information
 */

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../../../stores/authStore';
import { TwoFactorSetup } from '../TwoFactorSetup';
import { ActiveSessions } from '../ActiveSessions';
import { ProfileHeader } from './components/ProfileHeader';
import { PersonalInfoSection } from './components/PersonalInfoSection';
import { AccountDetailsSection } from './components/AccountDetailsSection';
import { SecuritySection } from './components/SecuritySection';
import { DangerZoneSection } from './components/DangerZoneSection';
import { PasswordChangeModal } from './components/PasswordChangeModal';
import { DeleteAccountModal } from './components/DeleteAccountModal';
import { useProfileForm } from './hooks/useProfileForm';
import { usePasswordChange } from './hooks/usePasswordChange';
import { useDeleteAccount } from './hooks/useDeleteAccount';
import { useTwoFactorAuth } from './hooks/useTwoFactorAuth';
import { useModalEffects } from './hooks/useModalEffects';
import '../UserProfile.css';

export const UserProfile: React.FC = () => {
  const { user, updateUser, logout } = useAuthStore();
  const navigate = useNavigate();
  const [successMessage, setSuccessMessage] = useState('');
  const [showActiveSessions, setShowActiveSessions] = useState(false);

  const profileForm = useProfileForm(user, updateUser);
  const passwordChange = usePasswordChange();
  const deleteAccount = useDeleteAccount(logout, user?.email || '');
  const twoFactorAuth = useTwoFactorAuth();

  useModalEffects(
    passwordChange.showPasswordModal,
    deleteAccount.showDeleteModal,
    passwordChange.handleClosePasswordModal,
    deleteAccount.handleCloseDeleteModal
  );

  if (!user) {
    return null;
  }

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const handleSaveProfile = async () => {
    const success = await profileForm.handleSave();
    if (success) {
      setSuccessMessage('Profile updated successfully!');
      setTimeout(() => setSuccessMessage(''), 3000);
    }
  };

  const handleChangePassword = async () => {
    const success = await passwordChange.handleChangePassword();
    if (success) {
      setSuccessMessage('Password changed successfully!');
      setTimeout(() => setSuccessMessage(''), 3000);
    }
  };

  const handleTwoFactorComplete = (enabled: boolean) => {
    const message = twoFactorAuth.handleTwoFactorComplete(enabled);
    setSuccessMessage(message);
    setTimeout(() => setSuccessMessage(''), 3000);
  };

  return (
    <div className="profile-container">
      <div className="profile-card">
        <ProfileHeader user={user} />

        {successMessage && (
          <div className="success-message" role="alert">
            {successMessage}
          </div>
        )}

        <PersonalInfoSection
          isEditing={profileForm.isEditing}
          formData={profileForm.formData}
          errors={profileForm.errors}
          isSaving={profileForm.isSaving}
          onEdit={profileForm.handleEdit}
          onChange={profileForm.handleChange}
          onCancel={profileForm.handleCancel}
          onSave={handleSaveProfile}
        />

        <AccountDetailsSection user={user} />

        <SecuritySection
          twoFactorStatus={twoFactorAuth.twoFactorStatus}
          onChangePassword={passwordChange.handleOpenPasswordModal}
          onManageTwoFactor={() => twoFactorAuth.setShowTwoFactorSetup(true)}
          onViewActiveSessions={() => setShowActiveSessions(true)}
        />

        <DangerZoneSection
          onLogout={handleLogout}
          onDeleteAccount={deleteAccount.handleOpenDeleteModal}
        />
      </div>

      {passwordChange.showPasswordModal && (
        <PasswordChangeModal
          passwordData={passwordChange.passwordData}
          passwordErrors={passwordChange.passwordErrors}
          passwordStrength={passwordChange.passwordStrength}
          isChangingPassword={passwordChange.isChangingPassword}
          firstPasswordInputRef={passwordChange.firstPasswordInputRef}
          onClose={passwordChange.handleClosePasswordModal}
          onChange={passwordChange.handlePasswordChange}
          onSubmit={handleChangePassword}
        />
      )}

      {deleteAccount.showDeleteModal && (
        <DeleteAccountModal
          userEmail={user.email}
          deleteConfirmation={deleteAccount.deleteConfirmation}
          isDeletingAccount={deleteAccount.isDeletingAccount}
          deleteInputRef={deleteAccount.deleteInputRef}
          onClose={deleteAccount.handleCloseDeleteModal}
          onConfirmationChange={deleteAccount.setDeleteConfirmation}
          onDelete={deleteAccount.handleDeleteAccount}
        />
      )}

      {twoFactorAuth.showTwoFactorSetup && (
        <TwoFactorSetup
          userEmail={user.email}
          isEnabled={twoFactorAuth.twoFactorStatus.enabled}
          onClose={() => twoFactorAuth.setShowTwoFactorSetup(false)}
          onComplete={handleTwoFactorComplete}
        />
      )}

      {showActiveSessions && <ActiveSessions onClose={() => setShowActiveSessions(false)} />}
    </div>
  );
};
