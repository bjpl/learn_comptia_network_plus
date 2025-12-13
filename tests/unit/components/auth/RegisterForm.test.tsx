/**
 * RegisterForm Component Tests
 * Tests user registration form, validation, password strength, and submission flows
 */

import { describe, it, expect, beforeEach, vi, type Mock } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import { RegisterForm } from '../../../../src/components/auth/RegisterForm';
import { useAuthStore } from '../../../../src/stores/authStore';

// Mock navigate
const mockNavigate = vi.fn();

// Mock the modules
vi.mock('../../../../src/stores/authStore', () => ({
  useAuthStore: vi.fn(),
}));

vi.mock('../../../../src/utils/auth', () => ({
  validateEmail: vi.fn((email: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)),
  validatePasswordStrength: vi.fn((password: string) => {
    if (password.length < 8) {
      return { isValid: false, score: 1, feedback: ['Password must be at least 8 characters'] };
    }
    if (password.length < 10) {
      return { isValid: true, score: 2, feedback: [] };
    }
    if (password.length < 12) {
      return { isValid: true, score: 3, feedback: [] };
    }
    return { isValid: true, score: 4, feedback: [] };
  }),
}));

vi.mock('react-router-dom', async (importOriginal) => {
  const actual = await importOriginal<typeof import('react-router-dom')>();
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  };
});

const mockedUseAuthStore = useAuthStore as unknown as Mock;

// ============================================
// Test Setup
// ============================================

const mockRegister = vi.fn();

const setupMocks = (authOverrides: Record<string, unknown> = {}) => {
  mockedUseAuthStore.mockReturnValue({
    register: mockRegister,
    error: null,
    isLoading: false,
    isAuthenticated: false,
    user: null,
    token: null,
    ...authOverrides,
  });
};

const renderRegisterForm = () => {
  return render(
    <MemoryRouter initialEntries={['/register']}>
      <RegisterForm />
    </MemoryRouter>
  );
};

// Helper to fill out the form
const fillValidForm = async () => {
  const user = userEvent.setup();
  await user.type(screen.getByLabelText(/first name/i), 'John');
  await user.type(screen.getByLabelText(/last name/i), 'Doe');
  await user.type(screen.getByLabelText(/email address/i), 'john@example.com');
  await user.type(screen.getByLabelText(/^username$/i), 'johndoe');
  await user.type(screen.getByLabelText(/^password$/i), 'SecurePassword123');
  await user.type(screen.getByLabelText(/confirm password/i), 'SecurePassword123');
  await user.click(screen.getByRole('checkbox'));
};

// ============================================
// Tests
// ============================================

describe('RegisterForm Component', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockRegister.mockResolvedValue(undefined);
    setupMocks();
  });

  describe('Initial Rendering', () => {
    it('should render the registration form', () => {
      renderRegisterForm();

      expect(screen.getByRole('heading', { name: /create account/i })).toBeInTheDocument();
      expect(
        screen.getByText(/start your comptia network\+ learning journey/i)
      ).toBeInTheDocument();
    });

    it('should render first name input field', () => {
      renderRegisterForm();

      expect(screen.getByLabelText(/first name/i)).toBeInTheDocument();
      expect(screen.getByPlaceholderText('John')).toBeInTheDocument();
    });

    it('should render last name input field', () => {
      renderRegisterForm();

      expect(screen.getByLabelText(/last name/i)).toBeInTheDocument();
      expect(screen.getByPlaceholderText('Doe')).toBeInTheDocument();
    });

    it('should render email input field', () => {
      renderRegisterForm();

      expect(screen.getByLabelText(/email address/i)).toBeInTheDocument();
      expect(screen.getByPlaceholderText(/you@example.com/i)).toBeInTheDocument();
    });

    it('should render username input field', () => {
      renderRegisterForm();

      expect(screen.getByLabelText(/^username$/i)).toBeInTheDocument();
      expect(screen.getByPlaceholderText(/johndoe/i)).toBeInTheDocument();
    });

    it('should render password input field', () => {
      renderRegisterForm();

      expect(screen.getByLabelText(/^password$/i)).toBeInTheDocument();
      expect(screen.getByPlaceholderText(/create a strong password/i)).toBeInTheDocument();
    });

    it('should render confirm password input field', () => {
      renderRegisterForm();

      expect(screen.getByLabelText(/confirm password/i)).toBeInTheDocument();
      expect(screen.getByPlaceholderText(/re-enter your password/i)).toBeInTheDocument();
    });

    it('should render terms checkbox', () => {
      renderRegisterForm();

      expect(screen.getByRole('checkbox')).toBeInTheDocument();
      expect(screen.getByText(/i accept the/i)).toBeInTheDocument();
    });

    it('should render create account button', () => {
      renderRegisterForm();

      expect(screen.getByRole('button', { name: /create account/i })).toBeInTheDocument();
    });

    it('should render sign in link', () => {
      renderRegisterForm();

      expect(screen.getByRole('link', { name: /sign in/i })).toBeInTheDocument();
    });

    it('should render terms and privacy links', () => {
      renderRegisterForm();

      expect(screen.getByRole('link', { name: /terms of service/i })).toBeInTheDocument();
      expect(screen.getByRole('link', { name: /privacy policy/i })).toBeInTheDocument();
    });
  });

  describe('Form Validation - First Name', () => {
    it('should show error when first name is empty', async () => {
      renderRegisterForm();

      const submitButton = screen.getByRole('button', { name: /create account/i });
      fireEvent.click(submitButton);

      expect(await screen.findByText(/first name is required/i)).toBeInTheDocument();
    });
  });

  describe('Form Validation - Last Name', () => {
    it('should show error when last name is empty', async () => {
      renderRegisterForm();

      await userEvent.type(screen.getByLabelText(/first name/i), 'John');
      fireEvent.click(screen.getByRole('button', { name: /create account/i }));

      expect(await screen.findByText(/last name is required/i)).toBeInTheDocument();
    });
  });

  describe('Form Validation - Email', () => {
    it('should show error when email is empty', async () => {
      renderRegisterForm();

      fireEvent.click(screen.getByRole('button', { name: /create account/i }));

      expect(await screen.findByText(/email is required/i)).toBeInTheDocument();
    });

    it('should show error when email format is invalid', async () => {
      renderRegisterForm();

      await userEvent.type(screen.getByLabelText(/email address/i), 'invalid-email');
      fireEvent.click(screen.getByRole('button', { name: /create account/i }));

      expect(await screen.findByText(/invalid email format/i)).toBeInTheDocument();
    });
  });

  describe('Form Validation - Username', () => {
    it('should show error when username is empty', async () => {
      renderRegisterForm();

      fireEvent.click(screen.getByRole('button', { name: /create account/i }));

      expect(await screen.findByText(/username is required/i)).toBeInTheDocument();
    });

    it('should show error when username is too short', async () => {
      renderRegisterForm();

      await userEvent.type(screen.getByLabelText(/^username$/i), 'ab');
      fireEvent.click(screen.getByRole('button', { name: /create account/i }));

      expect(
        await screen.findByText(/username must be at least 3 characters/i)
      ).toBeInTheDocument();
    });

    it('should show error when username has invalid characters', async () => {
      renderRegisterForm();

      await userEvent.type(screen.getByLabelText(/^username$/i), 'user@name!');
      fireEvent.click(screen.getByRole('button', { name: /create account/i }));

      expect(
        await screen.findByText(/username can only contain letters, numbers, and underscores/i)
      ).toBeInTheDocument();
    });

    it('should accept valid username with underscores', async () => {
      renderRegisterForm();

      await userEvent.type(screen.getByLabelText(/^username$/i), 'john_doe_123');
      fireEvent.click(screen.getByRole('button', { name: /create account/i }));

      // Should not show username error
      await waitFor(() => {
        expect(
          screen.queryByText(/username can only contain letters, numbers, and underscores/i)
        ).not.toBeInTheDocument();
      });
    });
  });

  describe('Form Validation - Password', () => {
    it('should show error when password is empty', async () => {
      renderRegisterForm();

      fireEvent.click(screen.getByRole('button', { name: /create account/i }));

      expect(await screen.findByText(/password is required/i)).toBeInTheDocument();
    });

    it('should show error when password is too weak', async () => {
      renderRegisterForm();

      await userEvent.type(screen.getByLabelText(/^password$/i), 'weak');
      fireEvent.click(screen.getByRole('button', { name: /create account/i }));

      expect(
        await screen.findByText(/password must be at least 8 characters/i)
      ).toBeInTheDocument();
    });
  });

  describe('Form Validation - Confirm Password', () => {
    it('should show error when confirm password is empty', async () => {
      renderRegisterForm();

      await userEvent.type(screen.getByLabelText(/^password$/i), 'SecurePassword123');
      fireEvent.click(screen.getByRole('button', { name: /create account/i }));

      expect(await screen.findByText(/please confirm your password/i)).toBeInTheDocument();
    });

    it('should show error when passwords do not match', async () => {
      renderRegisterForm();

      await userEvent.type(screen.getByLabelText(/^password$/i), 'SecurePassword123');
      await userEvent.type(screen.getByLabelText(/confirm password/i), 'DifferentPassword456');
      fireEvent.click(screen.getByRole('button', { name: /create account/i }));

      expect(await screen.findByText(/passwords do not match/i)).toBeInTheDocument();
    });
  });

  describe('Form Validation - Terms', () => {
    it('should show error when terms are not accepted', async () => {
      renderRegisterForm();

      // Fill all fields except terms
      await userEvent.type(screen.getByLabelText(/first name/i), 'John');
      await userEvent.type(screen.getByLabelText(/last name/i), 'Doe');
      await userEvent.type(screen.getByLabelText(/email address/i), 'john@example.com');
      await userEvent.type(screen.getByLabelText(/^username$/i), 'johndoe');
      await userEvent.type(screen.getByLabelText(/^password$/i), 'SecurePassword123');
      await userEvent.type(screen.getByLabelText(/confirm password/i), 'SecurePassword123');

      fireEvent.click(screen.getByRole('button', { name: /create account/i }));

      expect(
        await screen.findByText(/you must accept the terms and conditions/i)
      ).toBeInTheDocument();
    });
  });

  describe('Error Clearing', () => {
    it('should clear error when user starts typing', async () => {
      renderRegisterForm();

      // Trigger validation error
      fireEvent.click(screen.getByRole('button', { name: /create account/i }));

      expect(await screen.findByText(/email is required/i)).toBeInTheDocument();

      // Start typing
      await userEvent.type(screen.getByLabelText(/email address/i), 't');

      expect(screen.queryByText(/email is required/i)).not.toBeInTheDocument();
    });
  });

  describe('Password Strength Indicator', () => {
    it('should show weak password strength for short password', async () => {
      renderRegisterForm();

      await userEvent.type(screen.getByLabelText(/^password$/i), 'short');

      expect(screen.getByText(/weak/i)).toBeInTheDocument();
    });

    it('should show fair password strength for medium password', async () => {
      renderRegisterForm();

      // 8-9 chars = score 2 (Fair)
      await userEvent.type(screen.getByLabelText(/^password$/i), 'password');

      expect(screen.getByText(/fair/i)).toBeInTheDocument();
    });

    it('should show good password strength for longer password', async () => {
      renderRegisterForm();

      // 10-11 chars = score 3 (Good)
      await userEvent.type(screen.getByLabelText(/^password$/i), 'goodpasswd');

      expect(screen.getByText(/good/i)).toBeInTheDocument();
    });

    it('should show strong password strength for very long password', async () => {
      renderRegisterForm();

      // 12+ chars = score 4 (Strong)
      await userEvent.type(screen.getByLabelText(/^password$/i), 'verystrongpw');

      expect(screen.getByText(/strong/i)).toBeInTheDocument();
    });

    it('should not show strength indicator when password is empty', () => {
      renderRegisterForm();

      expect(screen.queryByText(/weak|fair|good|strong/i)).not.toBeInTheDocument();
    });
  });

  describe('Password Toggle', () => {
    it('should toggle password visibility', async () => {
      renderRegisterForm();

      const passwordInput = screen.getByLabelText(/^password$/i);
      const toggleButton = screen.getByRole('button', { name: /show password/i });

      expect(passwordInput).toHaveAttribute('type', 'password');

      await userEvent.click(toggleButton);

      expect(passwordInput).toHaveAttribute('type', 'text');

      await userEvent.click(screen.getByRole('button', { name: /hide password/i }));

      expect(passwordInput).toHaveAttribute('type', 'password');
    });

    it('should affect confirm password visibility too', async () => {
      renderRegisterForm();

      const confirmPasswordInput = screen.getByLabelText(/confirm password/i);
      const toggleButton = screen.getByRole('button', { name: /show password/i });

      expect(confirmPasswordInput).toHaveAttribute('type', 'password');

      await userEvent.click(toggleButton);

      expect(confirmPasswordInput).toHaveAttribute('type', 'text');
    });
  });

  describe('Form Submission', () => {
    it('should call register with form data on valid submission', async () => {
      renderRegisterForm();

      await fillValidForm();
      fireEvent.click(screen.getByRole('button', { name: /create account/i }));

      await waitFor(() => {
        expect(mockRegister).toHaveBeenCalledWith({
          email: 'john@example.com',
          username: 'johndoe',
          password: 'SecurePassword123',
          confirmPassword: 'SecurePassword123',
          firstName: 'John',
          lastName: 'Doe',
          acceptTerms: true,
        });
      });
    });

    it('should navigate after successful registration', async () => {
      renderRegisterForm();

      await fillValidForm();
      fireEvent.click(screen.getByRole('button', { name: /create account/i }));

      await waitFor(() => {
        expect(mockNavigate).toHaveBeenCalledWith('/', { replace: true });
      });
    });

    it('should not call register when form is invalid', async () => {
      renderRegisterForm();

      fireEvent.click(screen.getByRole('button', { name: /create account/i }));

      await waitFor(() => {
        expect(screen.getByText(/email is required/i)).toBeInTheDocument();
      });

      expect(mockRegister).not.toHaveBeenCalled();
    });
  });

  describe('Submitting State', () => {
    it('should show "Creating Account..." when submitting', async () => {
      mockRegister.mockImplementation(() => new Promise((resolve) => setTimeout(resolve, 100)));
      renderRegisterForm();

      await fillValidForm();
      fireEvent.click(screen.getByRole('button', { name: /create account/i }));

      expect(await screen.findByText(/creating account.../i)).toBeInTheDocument();
    });

    it('should disable all inputs while submitting', async () => {
      mockRegister.mockImplementation(() => new Promise((resolve) => setTimeout(resolve, 100)));
      renderRegisterForm();

      await fillValidForm();
      fireEvent.click(screen.getByRole('button', { name: /create account/i }));

      await waitFor(() => {
        expect(screen.getByLabelText(/first name/i)).toBeDisabled();
        expect(screen.getByLabelText(/last name/i)).toBeDisabled();
        expect(screen.getByLabelText(/email address/i)).toBeDisabled();
        expect(screen.getByLabelText(/^username$/i)).toBeDisabled();
        expect(screen.getByLabelText(/^password$/i)).toBeDisabled();
        expect(screen.getByLabelText(/confirm password/i)).toBeDisabled();
        expect(screen.getByRole('checkbox')).toBeDisabled();
        expect(screen.getByRole('button', { name: /creating account/i })).toBeDisabled();
      });
    });
  });

  describe('Auth Error Display', () => {
    it('should display auth error from context', () => {
      setupMocks({ error: 'Email already exists' });
      renderRegisterForm();

      expect(screen.getByRole('alert')).toHaveTextContent('Email already exists');
    });

    it('should not show error alert when no error', () => {
      setupMocks({ error: null });
      renderRegisterForm();

      expect(screen.queryByRole('alert')).not.toBeInTheDocument();
    });
  });

  describe('Navigation Links', () => {
    it('should have correct href for sign in', () => {
      renderRegisterForm();

      const signInLink = screen.getByRole('link', { name: /sign in/i });
      expect(signInLink).toHaveAttribute('href', '/login');
    });

    it('should have correct href for terms', () => {
      renderRegisterForm();

      const termsLink = screen.getByRole('link', { name: /terms of service/i });
      expect(termsLink).toHaveAttribute('href', '/terms');
    });

    it('should have correct href for privacy', () => {
      renderRegisterForm();

      const privacyLink = screen.getByRole('link', { name: /privacy policy/i });
      expect(privacyLink).toHaveAttribute('href', '/privacy');
    });

    it('should open terms and privacy links in new tab', () => {
      renderRegisterForm();

      const termsLink = screen.getByRole('link', { name: /terms of service/i });
      const privacyLink = screen.getByRole('link', { name: /privacy policy/i });

      expect(termsLink).toHaveAttribute('target', '_blank');
      expect(privacyLink).toHaveAttribute('target', '_blank');
    });
  });

  describe('CSS Classes', () => {
    it('should have auth-container class', () => {
      const { container } = renderRegisterForm();
      expect(container.querySelector('.auth-container')).toBeInTheDocument();
    });

    it('should have auth-card and register-card classes', () => {
      const { container } = renderRegisterForm();
      expect(container.querySelector('.auth-card.register-card')).toBeInTheDocument();
    });

    it('should have auth-form class on form', () => {
      const { container } = renderRegisterForm();
      expect(container.querySelector('.auth-form')).toBeInTheDocument();
    });

    it('should add error class to input with validation error', async () => {
      renderRegisterForm();

      fireEvent.click(screen.getByRole('button', { name: /create account/i }));

      await waitFor(() => {
        const emailInput = screen.getByLabelText(/email address/i);
        expect(emailInput).toHaveClass('error');
      });
    });

    it('should have password-strength container', async () => {
      const { container } = renderRegisterForm();

      await userEvent.type(screen.getByLabelText(/^password$/i), 'testpass');

      expect(container.querySelector('.password-strength')).toBeInTheDocument();
    });
  });

  describe('Accessibility', () => {
    it('should have form with noValidate', () => {
      const { container } = renderRegisterForm();
      const form = container.querySelector('form');
      expect(form).toHaveAttribute('noValidate');
    });

    it('should have autocomplete on first name', () => {
      renderRegisterForm();
      const input = screen.getByLabelText(/first name/i);
      expect(input).toHaveAttribute('autocomplete', 'given-name');
    });

    it('should have autocomplete on last name', () => {
      renderRegisterForm();
      const input = screen.getByLabelText(/last name/i);
      expect(input).toHaveAttribute('autocomplete', 'family-name');
    });

    it('should have autocomplete on email', () => {
      renderRegisterForm();
      const input = screen.getByLabelText(/email address/i);
      expect(input).toHaveAttribute('autocomplete', 'email');
    });

    it('should have autocomplete on username', () => {
      renderRegisterForm();
      const input = screen.getByLabelText(/^username$/i);
      expect(input).toHaveAttribute('autocomplete', 'username');
    });

    it('should have autocomplete on password', () => {
      renderRegisterForm();
      const input = screen.getByLabelText(/^password$/i);
      expect(input).toHaveAttribute('autocomplete', 'new-password');
    });

    it('should have autocomplete on confirm password', () => {
      renderRegisterForm();
      const input = screen.getByLabelText(/confirm password/i);
      expect(input).toHaveAttribute('autocomplete', 'new-password');
    });

    it('should set aria-invalid on inputs when error', async () => {
      renderRegisterForm();

      fireEvent.click(screen.getByRole('button', { name: /create account/i }));

      await waitFor(() => {
        const emailInput = screen.getByLabelText(/email address/i);
        expect(emailInput).toHaveAttribute('aria-invalid', 'true');
      });
    });
  });

  describe('Form Row Layout', () => {
    it('should render first name and last name in same row', () => {
      const { container } = renderRegisterForm();
      const formRow = container.querySelector('.form-row');
      expect(formRow).toBeInTheDocument();

      // Both inputs should be inside the form-row
      const formGroups = formRow?.querySelectorAll('.form-group');
      expect(formGroups?.length).toBe(2);
    });
  });
});
