/**
 * LoginForm Component Tests
 * Tests authentication form, validation, and login flows
 */

import { describe, it, expect, beforeEach, vi, type Mock } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import { LoginForm } from '../../../../src/components/auth/LoginForm';
import { useAuth } from '../../../../src/contexts/AuthContext';

// Mock navigate
const mockNavigate = vi.fn();

// Mock the modules
vi.mock('../../../../src/contexts/AuthContext', () => ({
  useAuth: vi.fn(),
}));

vi.mock('../../../../src/utils/auth', () => ({
  validateEmail: vi.fn((email: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)),
}));

vi.mock('react-router-dom', async (importOriginal) => {
  const actual = await importOriginal<typeof import('react-router-dom')>();
  return {
    ...actual,
    useNavigate: () => mockNavigate,
    useLocation: () => ({ state: null, pathname: '/login', search: '', hash: '', key: 'default' }),
  };
});

const mockedUseAuth = useAuth as Mock;

// ============================================
// Test Setup
// ============================================

const mockLogin = vi.fn();

const setupMocks = (authOverrides: Record<string, unknown> = {}) => {
  mockedUseAuth.mockReturnValue({
    login: mockLogin,
    error: null,
    ...authOverrides,
  });
};

const renderLoginForm = (initialPath = '/login') => {
  return render(
    <MemoryRouter initialEntries={[initialPath]}>
      <LoginForm />
    </MemoryRouter>
  );
};

// ============================================
// Tests
// ============================================

describe('LoginForm Component', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockLogin.mockResolvedValue(undefined);
    setupMocks();
  });

  describe('Initial Rendering', () => {
    it('should render the login form', () => {
      renderLoginForm();

      expect(screen.getByRole('heading', { name: /welcome back/i })).toBeInTheDocument();
      expect(
        screen.getByText(/sign in to continue your comptia network\+ journey/i)
      ).toBeInTheDocument();
    });

    it('should render email input field', () => {
      renderLoginForm();

      expect(screen.getByLabelText(/email address/i)).toBeInTheDocument();
      expect(screen.getByPlaceholderText(/you@example.com/i)).toBeInTheDocument();
    });

    it('should render password input field', () => {
      renderLoginForm();

      expect(screen.getByLabelText(/password/i)).toBeInTheDocument();
      expect(screen.getByPlaceholderText(/enter your password/i)).toBeInTheDocument();
    });

    it('should render remember me checkbox', () => {
      renderLoginForm();

      expect(screen.getByRole('checkbox')).toBeInTheDocument();
      expect(screen.getByText(/remember me/i)).toBeInTheDocument();
    });

    it('should render sign in button', () => {
      renderLoginForm();

      expect(screen.getByRole('button', { name: /sign in/i })).toBeInTheDocument();
    });

    it('should render forgot password link', () => {
      renderLoginForm();

      expect(screen.getByRole('link', { name: /forgot password/i })).toBeInTheDocument();
    });

    it('should render register link', () => {
      renderLoginForm();

      expect(screen.getByRole('link', { name: /sign up/i })).toBeInTheDocument();
    });

    it('should render demo login buttons', () => {
      renderLoginForm();

      expect(screen.getByRole('button', { name: /try as student/i })).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /try as admin/i })).toBeInTheDocument();
    });
  });

  describe('Form Validation', () => {
    it('should show error when email is empty', async () => {
      renderLoginForm();

      const submitButton = screen.getByRole('button', { name: /sign in/i });
      fireEvent.click(submitButton);

      expect(await screen.findByText(/email is required/i)).toBeInTheDocument();
    });

    it('should show error when email format is invalid', async () => {
      renderLoginForm();

      const emailInput = screen.getByLabelText(/email address/i);
      await userEvent.type(emailInput, 'invalid-email');

      const submitButton = screen.getByRole('button', { name: /sign in/i });
      fireEvent.click(submitButton);

      expect(await screen.findByText(/invalid email format/i)).toBeInTheDocument();
    });

    it('should show error when password is empty', async () => {
      renderLoginForm();

      const emailInput = screen.getByLabelText(/email address/i);
      await userEvent.type(emailInput, 'test@example.com');

      const submitButton = screen.getByRole('button', { name: /sign in/i });
      fireEvent.click(submitButton);

      expect(await screen.findByText(/password is required/i)).toBeInTheDocument();
    });

    it('should clear error when user starts typing', async () => {
      renderLoginForm();

      // Trigger validation error
      const submitButton = screen.getByRole('button', { name: /sign in/i });
      fireEvent.click(submitButton);

      expect(await screen.findByText(/email is required/i)).toBeInTheDocument();

      // Start typing
      const emailInput = screen.getByLabelText(/email address/i);
      await userEvent.type(emailInput, 't');

      expect(screen.queryByText(/email is required/i)).not.toBeInTheDocument();
    });

    it('should set aria-invalid on email input when error', async () => {
      renderLoginForm();

      const submitButton = screen.getByRole('button', { name: /sign in/i });
      fireEvent.click(submitButton);

      await waitFor(() => {
        const emailInput = screen.getByLabelText(/email address/i);
        expect(emailInput).toHaveAttribute('aria-invalid', 'true');
      });
    });
  });

  describe('Form Submission', () => {
    it('should call login with form data on valid submission', async () => {
      renderLoginForm();

      const emailInput = screen.getByLabelText(/email address/i);
      const passwordInput = screen.getByLabelText(/password/i);

      await userEvent.type(emailInput, 'test@example.com');
      await userEvent.type(passwordInput, 'password123');

      const submitButton = screen.getByRole('button', { name: /sign in/i });
      fireEvent.click(submitButton);

      await waitFor(() => {
        expect(mockLogin).toHaveBeenCalledWith({
          email: 'test@example.com',
          password: 'password123',
          rememberMe: false,
        });
      });
    });

    it('should include rememberMe when checked', async () => {
      renderLoginForm();

      const emailInput = screen.getByLabelText(/email address/i);
      const passwordInput = screen.getByLabelText(/password/i);
      const rememberCheckbox = screen.getByRole('checkbox');

      await userEvent.type(emailInput, 'test@example.com');
      await userEvent.type(passwordInput, 'password123');
      await userEvent.click(rememberCheckbox);

      const submitButton = screen.getByRole('button', { name: /sign in/i });
      fireEvent.click(submitButton);

      await waitFor(() => {
        expect(mockLogin).toHaveBeenCalledWith({
          email: 'test@example.com',
          password: 'password123',
          rememberMe: true,
        });
      });
    });

    it('should navigate after successful login', async () => {
      renderLoginForm();

      const emailInput = screen.getByLabelText(/email address/i);
      const passwordInput = screen.getByLabelText(/password/i);

      await userEvent.type(emailInput, 'test@example.com');
      await userEvent.type(passwordInput, 'password123');

      const submitButton = screen.getByRole('button', { name: /sign in/i });
      fireEvent.click(submitButton);

      await waitFor(() => {
        expect(mockNavigate).toHaveBeenCalledWith('/', { replace: true });
      });
    });

    it('should not call login when form is invalid', async () => {
      renderLoginForm();

      const submitButton = screen.getByRole('button', { name: /sign in/i });
      fireEvent.click(submitButton);

      await waitFor(() => {
        expect(screen.getByText(/email is required/i)).toBeInTheDocument();
      });

      expect(mockLogin).not.toHaveBeenCalled();
    });
  });

  describe('Submitting State', () => {
    it('should show "Signing in..." when submitting', async () => {
      mockLogin.mockImplementation(
        () => new Promise((resolve) => setTimeout(resolve, 100))
      );
      renderLoginForm();

      const emailInput = screen.getByLabelText(/email address/i);
      const passwordInput = screen.getByLabelText(/password/i);

      await userEvent.type(emailInput, 'test@example.com');
      await userEvent.type(passwordInput, 'password123');

      const submitButton = screen.getByRole('button', { name: /sign in/i });
      fireEvent.click(submitButton);

      expect(await screen.findByText(/signing in.../i)).toBeInTheDocument();
    });

    it('should disable inputs while submitting', async () => {
      mockLogin.mockImplementation(
        () => new Promise((resolve) => setTimeout(resolve, 100))
      );
      renderLoginForm();

      const emailInput = screen.getByLabelText(/email address/i);
      const passwordInput = screen.getByLabelText(/password/i);

      await userEvent.type(emailInput, 'test@example.com');
      await userEvent.type(passwordInput, 'password123');

      const submitButton = screen.getByRole('button', { name: /sign in/i });
      fireEvent.click(submitButton);

      await waitFor(() => {
        expect(emailInput).toBeDisabled();
        expect(passwordInput).toBeDisabled();
        expect(submitButton).toBeDisabled();
      });
    });

    it('should disable demo buttons while submitting', async () => {
      mockLogin.mockImplementation(
        () => new Promise((resolve) => setTimeout(resolve, 100))
      );
      renderLoginForm();

      const emailInput = screen.getByLabelText(/email address/i);
      const passwordInput = screen.getByLabelText(/password/i);

      await userEvent.type(emailInput, 'test@example.com');
      await userEvent.type(passwordInput, 'password123');

      fireEvent.click(screen.getByRole('button', { name: /sign in/i }));

      await waitFor(() => {
        expect(screen.getByRole('button', { name: /try as student/i })).toBeDisabled();
        expect(screen.getByRole('button', { name: /try as admin/i })).toBeDisabled();
      });
    });
  });

  describe('Auth Error Display', () => {
    it('should display auth error from context', () => {
      setupMocks({ error: 'Invalid credentials' });
      renderLoginForm();

      expect(screen.getByRole('alert')).toHaveTextContent('Invalid credentials');
    });

    it('should not show error alert when no error', () => {
      setupMocks({ error: null });
      renderLoginForm();

      expect(screen.queryByRole('alert')).not.toBeInTheDocument();
    });
  });

  describe('Demo Login', () => {
    it('should call login with student demo credentials', async () => {
      renderLoginForm();

      const studentButton = screen.getByRole('button', { name: /try as student/i });
      fireEvent.click(studentButton);

      await waitFor(() => {
        expect(mockLogin).toHaveBeenCalledWith({
          email: 'demo@comptia.test',
          password: 'demo123',
          rememberMe: false,
        });
      });
    });

    it('should call login with admin demo credentials', async () => {
      renderLoginForm();

      const adminButton = screen.getByRole('button', { name: /try as admin/i });
      fireEvent.click(adminButton);

      await waitFor(() => {
        expect(mockLogin).toHaveBeenCalledWith({
          email: 'admin@comptia.test',
          password: 'admin123',
          rememberMe: false,
        });
      });
    });

    it('should fill form with demo credentials', async () => {
      renderLoginForm();

      const studentButton = screen.getByRole('button', { name: /try as student/i });
      fireEvent.click(studentButton);

      await waitFor(() => {
        const emailInput = screen.getByLabelText(/email address/i) as HTMLInputElement;
        expect(emailInput.value).toBe('demo@comptia.test');
      });
    });

    it('should navigate after successful demo login', async () => {
      renderLoginForm();

      const studentButton = screen.getByRole('button', { name: /try as student/i });
      fireEvent.click(studentButton);

      await waitFor(() => {
        expect(mockNavigate).toHaveBeenCalledWith('/', { replace: true });
      });
    });
  });

  describe('Navigation Links', () => {
    it('should have correct href for forgot password', () => {
      renderLoginForm();

      const forgotLink = screen.getByRole('link', { name: /forgot password/i });
      expect(forgotLink).toHaveAttribute('href', '/forgot-password');
    });

    it('should have correct href for register', () => {
      renderLoginForm();

      const registerLink = screen.getByRole('link', { name: /sign up/i });
      expect(registerLink).toHaveAttribute('href', '/register');
    });
  });

  describe('CSS Classes', () => {
    it('should have auth-container class', () => {
      const { container } = renderLoginForm();
      expect(container.querySelector('.auth-container')).toBeInTheDocument();
    });

    it('should have auth-card class', () => {
      const { container } = renderLoginForm();
      expect(container.querySelector('.auth-card')).toBeInTheDocument();
    });

    it('should have auth-form class on form', () => {
      const { container } = renderLoginForm();
      expect(container.querySelector('.auth-form')).toBeInTheDocument();
    });

    it('should add error class to input with validation error', async () => {
      renderLoginForm();

      const submitButton = screen.getByRole('button', { name: /sign in/i });
      fireEvent.click(submitButton);

      await waitFor(() => {
        const emailInput = screen.getByLabelText(/email address/i);
        expect(emailInput).toHaveClass('error');
      });
    });
  });

  describe('Accessibility', () => {
    it('should have form with noValidate', () => {
      const { container } = renderLoginForm();
      const form = container.querySelector('form');
      expect(form).toHaveAttribute('noValidate');
    });

    it('should have autocomplete on email', () => {
      renderLoginForm();
      const emailInput = screen.getByLabelText(/email address/i);
      expect(emailInput).toHaveAttribute('autocomplete', 'email');
    });

    it('should have autocomplete on password', () => {
      renderLoginForm();
      const passwordInput = screen.getByLabelText(/password/i);
      expect(passwordInput).toHaveAttribute('autocomplete', 'current-password');
    });

    it('should associate error message with input via aria-describedby', async () => {
      renderLoginForm();

      const submitButton = screen.getByRole('button', { name: /sign in/i });
      fireEvent.click(submitButton);

      await waitFor(() => {
        const emailInput = screen.getByLabelText(/email address/i);
        expect(emailInput).toHaveAttribute('aria-describedby', 'email-error');
      });
    });
  });
});
