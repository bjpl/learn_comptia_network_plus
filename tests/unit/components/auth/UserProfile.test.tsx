/**
 * UserProfile Component Tests
 * Tests profile display, editing, password change, account deletion, and security features
 */

import { describe, it, expect, beforeEach, vi, type Mock } from 'vitest';
import { render, screen, fireEvent, waitFor, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import { UserProfile } from '../../../../src/components/auth/UserProfile';
import { useAuth } from '../../../../src/contexts/AuthContext';
import type { User } from '../../../../src/types/auth';

// Mock navigate
const mockNavigate = vi.fn();

// Mock the modules
vi.mock('../../../../src/contexts/AuthContext', () => ({
  useAuth: vi.fn(),
}));

vi.mock('react-router-dom', async (importOriginal) => {
  const actual = await importOriginal<typeof import('react-router-dom')>();
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  };
});

vi.mock('../../../../src/utils/auth', () => ({
  getUserDisplayName: vi.fn((user: User) => `${user.firstName} ${user.lastName}`),
  getUserInitials: vi.fn((user: User) => `${user.firstName[0]}${user.lastName[0]}`),
  validateEmail: vi.fn((email: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)),
  validatePasswordStrength: vi.fn((password: string) => {
    if (password.length < 8) {
      return { isValid: false, score: 1, feedback: ['Password must be at least 8 characters'] };
    }
    return { isValid: true, score: 4, feedback: [] };
  }),
}));

// Mock child components
vi.mock('../../../../src/components/auth/TwoFactorSetup', () => ({
  TwoFactorSetup: vi.fn(({ onClose, onComplete }) => (
    <div data-testid="two-factor-setup">
      <button onClick={onClose}>Close 2FA</button>
      <button onClick={() => onComplete(true)}>Complete 2FA</button>
    </div>
  )),
}));

vi.mock('../../../../src/components/auth/ActiveSessions', () => ({
  ActiveSessions: vi.fn(({ onClose }) => (
    <div data-testid="active-sessions">
      <button onClick={onClose}>Close Sessions</button>
    </div>
  )),
}));

const mockedUseAuth = useAuth as Mock;

// ============================================
// Mock Data
// ============================================

const mockUser: User = {
  id: 'user-123',
  email: 'john@example.com',
  username: 'johndoe',
  firstName: 'John',
  lastName: 'Doe',
  role: 'student',
  emailVerified: true,
  createdAt: '2024-01-15T10:00:00Z',
  lastLogin: '2024-12-03T15:30:00Z',
};

const mockUnverifiedUser: User = {
  ...mockUser,
  emailVerified: false,
};

// ============================================
// Test Setup
// ============================================

const mockUpdateUser = vi.fn();
const mockLogout = vi.fn();

const setupMocks = (user: User | null = mockUser, overrides: Record<string, unknown> = {}) => {
  mockedUseAuth.mockReturnValue({
    user,
    updateUser: mockUpdateUser,
    logout: mockLogout,
    ...overrides,
  });
};

const renderUserProfile = () => {
  return render(
    <MemoryRouter>
      <UserProfile />
    </MemoryRouter>
  );
};

// ============================================
// Tests
// ============================================

describe('UserProfile Component', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    setupMocks();
    localStorage.clear();
  });

  describe('Initial Rendering', () => {
    it('should return null when no user', () => {
      setupMocks(null);
      const { container } = renderUserProfile();

      expect(container.firstChild).toBeNull();
    });

    it('should render profile container', () => {
      const { container } = renderUserProfile();

      expect(container.querySelector('.profile-container')).toBeInTheDocument();
    });

    it('should display user display name', () => {
      renderUserProfile();

      expect(screen.getByRole('heading', { name: /john doe/i })).toBeInTheDocument();
    });

    it('should display user role', () => {
      renderUserProfile();

      expect(screen.getByText('student')).toBeInTheDocument();
    });

    it('should display verified badge when email verified', () => {
      renderUserProfile();

      expect(screen.getByText('Email Verified')).toBeInTheDocument();
    });

    it('should display not verified badge when email not verified', () => {
      setupMocks(mockUnverifiedUser);
      renderUserProfile();

      expect(screen.getByText('Email Not Verified')).toBeInTheDocument();
    });

    it('should display user initials when no avatar', () => {
      renderUserProfile();

      expect(screen.getByText('JD')).toBeInTheDocument();
    });

    it('should display avatar when available', () => {
      const userWithAvatar = { ...mockUser, avatar: 'https://example.com/avatar.jpg' };
      setupMocks(userWithAvatar);
      renderUserProfile();

      const avatar = screen.getByAltText('John Doe');
      expect(avatar).toHaveAttribute('src', 'https://example.com/avatar.jpg');
    });
  });

  describe('Personal Information Section', () => {
    it('should display personal information header', () => {
      renderUserProfile();

      expect(screen.getByRole('heading', { name: /personal information/i })).toBeInTheDocument();
    });

    it('should display edit profile button', () => {
      renderUserProfile();

      expect(screen.getByRole('button', { name: /edit profile/i })).toBeInTheDocument();
    });

    it('should display form fields with user data', () => {
      renderUserProfile();

      expect(screen.getByLabelText(/first name/i)).toHaveValue('John');
      expect(screen.getByLabelText(/last name/i)).toHaveValue('Doe');
      expect(screen.getByLabelText(/email address/i)).toHaveValue('john@example.com');
      expect(screen.getByLabelText(/^username$/i)).toHaveValue('johndoe');
    });

    it('should have disabled inputs when not editing', () => {
      renderUserProfile();

      expect(screen.getByLabelText(/first name/i)).toBeDisabled();
      expect(screen.getByLabelText(/last name/i)).toBeDisabled();
      expect(screen.getByLabelText(/email address/i)).toBeDisabled();
      expect(screen.getByLabelText(/^username$/i)).toBeDisabled();
    });
  });

  describe('Edit Mode', () => {
    it('should enable inputs when clicking edit', async () => {
      renderUserProfile();

      await userEvent.click(screen.getByRole('button', { name: /edit profile/i }));

      expect(screen.getByLabelText(/first name/i)).not.toBeDisabled();
      expect(screen.getByLabelText(/last name/i)).not.toBeDisabled();
      expect(screen.getByLabelText(/email address/i)).not.toBeDisabled();
      expect(screen.getByLabelText(/^username$/i)).not.toBeDisabled();
    });

    it('should show cancel and save buttons when editing', async () => {
      renderUserProfile();

      await userEvent.click(screen.getByRole('button', { name: /edit profile/i }));

      expect(screen.getByRole('button', { name: /cancel/i })).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /save changes/i })).toBeInTheDocument();
    });

    it('should reset form on cancel', async () => {
      renderUserProfile();

      await userEvent.click(screen.getByRole('button', { name: /edit profile/i }));

      const firstNameInput = screen.getByLabelText(/first name/i);
      await userEvent.clear(firstNameInput);
      await userEvent.type(firstNameInput, 'Jane');

      await userEvent.click(screen.getByRole('button', { name: /cancel/i }));

      expect(screen.getByLabelText(/first name/i)).toHaveValue('John');
      expect(screen.getByLabelText(/first name/i)).toBeDisabled();
    });

    it('should call updateUser on save', async () => {
      renderUserProfile();

      await userEvent.click(screen.getByRole('button', { name: /edit profile/i }));

      const firstNameInput = screen.getByLabelText(/first name/i);
      await userEvent.clear(firstNameInput);
      await userEvent.type(firstNameInput, 'Jane');

      await userEvent.click(screen.getByRole('button', { name: /save changes/i }));

      await waitFor(() => {
        expect(mockUpdateUser).toHaveBeenCalledWith({
          firstName: 'Jane',
          lastName: 'Doe',
          email: 'john@example.com',
          username: 'johndoe',
        });
      });
    });

    it('should show success message after save', async () => {
      renderUserProfile();

      await userEvent.click(screen.getByRole('button', { name: /edit profile/i }));
      await userEvent.click(screen.getByRole('button', { name: /save changes/i }));

      await waitFor(() => {
        expect(screen.getByRole('alert')).toHaveTextContent('Profile updated successfully!');
      });
    });
  });

  describe('Form Validation', () => {
    it('should show error when first name is empty', async () => {
      renderUserProfile();

      await userEvent.click(screen.getByRole('button', { name: /edit profile/i }));

      const firstNameInput = screen.getByLabelText(/first name/i);
      await userEvent.clear(firstNameInput);

      await userEvent.click(screen.getByRole('button', { name: /save changes/i }));

      expect(await screen.findByText(/first name is required/i)).toBeInTheDocument();
    });

    it('should show error when email is invalid', async () => {
      renderUserProfile();

      await userEvent.click(screen.getByRole('button', { name: /edit profile/i }));

      const emailInput = screen.getByLabelText(/email address/i);
      await userEvent.clear(emailInput);
      await userEvent.type(emailInput, 'invalid-email');

      await userEvent.click(screen.getByRole('button', { name: /save changes/i }));

      expect(await screen.findByText(/invalid email format/i)).toBeInTheDocument();
    });

    it('should show error when username is too short', async () => {
      renderUserProfile();

      await userEvent.click(screen.getByRole('button', { name: /edit profile/i }));

      const usernameInput = screen.getByLabelText(/^username$/i);
      await userEvent.clear(usernameInput);
      await userEvent.type(usernameInput, 'ab');

      await userEvent.click(screen.getByRole('button', { name: /save changes/i }));

      expect(await screen.findByText(/username must be at least 3 characters/i)).toBeInTheDocument();
    });

    it('should clear error when user starts typing', async () => {
      renderUserProfile();

      await userEvent.click(screen.getByRole('button', { name: /edit profile/i }));

      const firstNameInput = screen.getByLabelText(/first name/i);
      await userEvent.clear(firstNameInput);
      await userEvent.click(screen.getByRole('button', { name: /save changes/i }));

      expect(await screen.findByText(/first name is required/i)).toBeInTheDocument();

      await userEvent.type(firstNameInput, 'J');

      expect(screen.queryByText(/first name is required/i)).not.toBeInTheDocument();
    });
  });

  describe('Account Details Section', () => {
    it('should display account details header', () => {
      renderUserProfile();

      expect(screen.getByRole('heading', { name: /account details/i })).toBeInTheDocument();
    });

    it('should display user ID', () => {
      renderUserProfile();

      expect(screen.getByText('user-123')).toBeInTheDocument();
    });

    it('should display member since date', () => {
      renderUserProfile();

      expect(screen.getByText('January 15, 2024')).toBeInTheDocument();
    });

    it('should display last login date when available', () => {
      renderUserProfile();

      expect(screen.getByText('December 3, 2024')).toBeInTheDocument();
    });
  });

  describe('Security Section', () => {
    it('should display security header', () => {
      renderUserProfile();

      expect(screen.getByRole('heading', { name: /^security$/i })).toBeInTheDocument();
    });

    it('should have change password button', () => {
      renderUserProfile();

      expect(screen.getByRole('button', { name: /change password/i })).toBeInTheDocument();
    });

    it('should have 2FA setup button', () => {
      renderUserProfile();

      expect(screen.getByRole('button', { name: /set up 2fa/i })).toBeInTheDocument();
    });

    it('should have active sessions button', () => {
      renderUserProfile();

      expect(screen.getByRole('button', { name: /active sessions/i })).toBeInTheDocument();
    });

    it('should show "Manage 2FA" when 2FA is enabled', () => {
      localStorage.setItem('twoFactorStatus', JSON.stringify({ enabled: true }));
      renderUserProfile();

      expect(screen.getByRole('button', { name: /manage 2fa/i })).toBeInTheDocument();
    });
  });

  describe('Password Change Modal', () => {
    it('should open password modal when clicking change password', async () => {
      renderUserProfile();

      await userEvent.click(screen.getByRole('button', { name: /change password/i }));

      expect(screen.getByRole('heading', { name: /^change password$/i })).toBeInTheDocument();
    });

    it('should have password input fields', async () => {
      renderUserProfile();

      await userEvent.click(screen.getByRole('button', { name: /change password/i }));

      const modal = screen.getByRole('dialog');
      expect(within(modal).getByLabelText(/current password/i)).toBeInTheDocument();
      expect(within(modal).getByLabelText(/^new password$/i)).toBeInTheDocument();
      expect(within(modal).getByLabelText(/confirm new password/i)).toBeInTheDocument();
    });

    it('should close modal when clicking cancel', async () => {
      renderUserProfile();

      await userEvent.click(screen.getByRole('button', { name: /change password/i }));
      await userEvent.click(screen.getByRole('button', { name: /^cancel$/i }));

      expect(screen.queryByRole('heading', { name: /^change password$/i })).not.toBeInTheDocument();
    });

    it('should show error for empty current password', async () => {
      renderUserProfile();

      await userEvent.click(screen.getByRole('button', { name: /change password/i }));

      const modal = screen.getByRole('dialog');
      await userEvent.click(within(modal).getByRole('button', { name: /^change password$/i }));

      expect(await screen.findByText(/current password is required/i)).toBeInTheDocument();
    });

    it('should show error for weak new password', async () => {
      renderUserProfile();

      await userEvent.click(screen.getByRole('button', { name: /change password/i }));

      const modal = screen.getByRole('dialog');
      await userEvent.type(within(modal).getByLabelText(/current password/i), 'oldpassword');
      await userEvent.type(within(modal).getByLabelText(/^new password$/i), 'weak');
      await userEvent.type(within(modal).getByLabelText(/confirm new password/i), 'weak');

      await userEvent.click(within(modal).getByRole('button', { name: /^change password$/i }));

      await waitFor(() => {
        // Error message appears in both error-message span and strength-feedback li
        const errorMessages = screen.getAllByText(/password must be at least 8 characters/i);
        expect(errorMessages.length).toBeGreaterThan(0);
      });
    });

    it('should show error when passwords do not match', async () => {
      renderUserProfile();

      await userEvent.click(screen.getByRole('button', { name: /change password/i }));

      const modal = screen.getByRole('dialog');
      await userEvent.type(within(modal).getByLabelText(/current password/i), 'oldpassword');
      await userEvent.type(within(modal).getByLabelText(/^new password$/i), 'newpassword123');
      await userEvent.type(within(modal).getByLabelText(/confirm new password/i), 'differentpassword');

      await userEvent.click(within(modal).getByRole('button', { name: /^change password$/i }));

      expect(await screen.findByText(/passwords do not match/i)).toBeInTheDocument();
    });

    it('should show success message on successful password change', async () => {
      renderUserProfile();

      await userEvent.click(screen.getByRole('button', { name: /change password/i }));

      const modal = screen.getByRole('dialog');
      await userEvent.type(within(modal).getByLabelText(/current password/i), 'oldpassword');
      await userEvent.type(within(modal).getByLabelText(/^new password$/i), 'newpassword123');
      await userEvent.type(within(modal).getByLabelText(/confirm new password/i), 'newpassword123');

      await userEvent.click(within(modal).getByRole('button', { name: /^change password$/i }));

      await waitFor(() => {
        expect(screen.getByRole('alert')).toHaveTextContent('Password changed successfully!');
      }, { timeout: 2000 });
    });
  });

  describe('Two-Factor Authentication', () => {
    it('should open 2FA modal when clicking setup button', async () => {
      renderUserProfile();

      await userEvent.click(screen.getByRole('button', { name: /set up 2fa/i }));

      expect(screen.getByTestId('two-factor-setup')).toBeInTheDocument();
    });

    it('should close 2FA modal on close', async () => {
      renderUserProfile();

      await userEvent.click(screen.getByRole('button', { name: /set up 2fa/i }));
      await userEvent.click(screen.getByRole('button', { name: /close 2fa/i }));

      expect(screen.queryByTestId('two-factor-setup')).not.toBeInTheDocument();
    });

    it('should show success message on 2FA complete', async () => {
      renderUserProfile();

      await userEvent.click(screen.getByRole('button', { name: /set up 2fa/i }));
      await userEvent.click(screen.getByRole('button', { name: /complete 2fa/i }));

      await waitFor(() => {
        expect(screen.getByRole('alert')).toHaveTextContent('Two-factor authentication has been enabled');
      });
    });
  });

  describe('Active Sessions', () => {
    it('should open sessions modal when clicking button', async () => {
      renderUserProfile();

      await userEvent.click(screen.getByRole('button', { name: /active sessions/i }));

      expect(screen.getByTestId('active-sessions')).toBeInTheDocument();
    });

    it('should close sessions modal on close', async () => {
      renderUserProfile();

      await userEvent.click(screen.getByRole('button', { name: /active sessions/i }));
      await userEvent.click(screen.getByRole('button', { name: /close sessions/i }));

      expect(screen.queryByTestId('active-sessions')).not.toBeInTheDocument();
    });
  });

  describe('Danger Zone', () => {
    it('should display danger zone section', () => {
      renderUserProfile();

      expect(screen.getByRole('heading', { name: /danger zone/i })).toBeInTheDocument();
    });

    it('should have sign out button', () => {
      renderUserProfile();

      expect(screen.getByRole('button', { name: /sign out/i })).toBeInTheDocument();
    });

    it('should have delete account button', () => {
      renderUserProfile();

      expect(screen.getByRole('button', { name: /delete account/i })).toBeInTheDocument();
    });

    it('should call logout and navigate on sign out', async () => {
      renderUserProfile();

      await userEvent.click(screen.getByRole('button', { name: /sign out/i }));

      expect(mockLogout).toHaveBeenCalled();
      expect(mockNavigate).toHaveBeenCalledWith('/login');
    });
  });

  describe('Delete Account Modal', () => {
    it('should open delete modal when clicking delete account', async () => {
      renderUserProfile();

      await userEvent.click(screen.getByRole('button', { name: /delete account/i }));

      expect(screen.getByRole('heading', { name: /^delete account$/i })).toBeInTheDocument();
    });

    it('should show warning message', async () => {
      renderUserProfile();

      await userEvent.click(screen.getByRole('button', { name: /delete account/i }));

      expect(screen.getByText(/this action cannot be undone/i)).toBeInTheDocument();
    });

    it('should require confirmation text', async () => {
      renderUserProfile();

      await userEvent.click(screen.getByRole('button', { name: /delete account/i }));

      const deleteButton = screen.getByRole('button', { name: /delete account permanently/i });
      expect(deleteButton).toBeDisabled();
    });

    it('should enable delete button when typing DELETE', async () => {
      renderUserProfile();

      await userEvent.click(screen.getByRole('button', { name: /delete account/i }));

      await userEvent.type(screen.getByPlaceholderText(/type delete/i), 'DELETE');

      const deleteButton = screen.getByRole('button', { name: /delete account permanently/i });
      expect(deleteButton).not.toBeDisabled();
    });

    it('should enable delete button when typing email', async () => {
      renderUserProfile();

      await userEvent.click(screen.getByRole('button', { name: /delete account/i }));

      await userEvent.type(screen.getByPlaceholderText(/type delete/i), 'john@example.com');

      const deleteButton = screen.getByRole('button', { name: /delete account permanently/i });
      expect(deleteButton).not.toBeDisabled();
    });

    it('should close modal when clicking cancel', async () => {
      renderUserProfile();

      await userEvent.click(screen.getByRole('button', { name: /delete account/i }));
      await userEvent.click(screen.getByRole('button', { name: /^cancel$/i }));

      expect(screen.queryByRole('heading', { name: /^delete account$/i })).not.toBeInTheDocument();
    });

    it('should call logout and navigate after successful delete', async () => {
      renderUserProfile();

      await userEvent.click(screen.getByRole('button', { name: /delete account/i }));

      await userEvent.type(screen.getByPlaceholderText(/type delete/i), 'DELETE');
      await userEvent.click(screen.getByRole('button', { name: /delete account permanently/i }));

      await waitFor(() => {
        expect(mockLogout).toHaveBeenCalled();
        expect(mockNavigate).toHaveBeenCalledWith('/');
      }, { timeout: 2000 });
    });
  });

  describe('Modal Accessibility', () => {
    it('should have aria-modal on password modal', async () => {
      renderUserProfile();

      await userEvent.click(screen.getByRole('button', { name: /change password/i }));

      const modal = screen.getByRole('dialog');
      expect(modal).toHaveAttribute('aria-modal', 'true');
    });

    it('should have aria-labelledby on password modal', async () => {
      renderUserProfile();

      await userEvent.click(screen.getByRole('button', { name: /change password/i }));

      const modal = screen.getByRole('dialog');
      expect(modal).toHaveAttribute('aria-labelledby', 'password-modal-title');
    });

    it('should close password modal on escape key', async () => {
      renderUserProfile();

      await userEvent.click(screen.getByRole('button', { name: /change password/i }));
      expect(screen.getByRole('heading', { name: /^change password$/i })).toBeInTheDocument();

      fireEvent.keyDown(document, { key: 'Escape' });

      await waitFor(() => {
        expect(screen.queryByRole('heading', { name: /^change password$/i })).not.toBeInTheDocument();
      });
    });

    it('should close delete modal on escape key', async () => {
      renderUserProfile();

      await userEvent.click(screen.getByRole('button', { name: /delete account/i }));
      expect(screen.getByRole('heading', { name: /^delete account$/i })).toBeInTheDocument();

      fireEvent.keyDown(document, { key: 'Escape' });

      await waitFor(() => {
        expect(screen.queryByRole('heading', { name: /^delete account$/i })).not.toBeInTheDocument();
      });
    });
  });

  describe('CSS Classes', () => {
    it('should have profile-card class', () => {
      const { container } = renderUserProfile();
      expect(container.querySelector('.profile-card')).toBeInTheDocument();
    });

    it('should have profile-header class', () => {
      const { container } = renderUserProfile();
      expect(container.querySelector('.profile-header')).toBeInTheDocument();
    });

    it('should have profile-avatar class', () => {
      const { container } = renderUserProfile();
      expect(container.querySelector('.profile-avatar')).toBeInTheDocument();
    });

    it('should have danger-zone class', () => {
      const { container } = renderUserProfile();
      expect(container.querySelector('.danger-zone')).toBeInTheDocument();
    });

    it('should have modal-danger class on delete modal', async () => {
      const { container } = renderUserProfile();

      await userEvent.click(screen.getByRole('button', { name: /delete account/i }));

      expect(container.querySelector('.modal-danger')).toBeInTheDocument();
    });
  });
});
