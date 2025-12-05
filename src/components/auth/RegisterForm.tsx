/**
 * Registration Form Component
 * Handles new user registration
 */

import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuthStore } from '../../stores/authStore';
import { validateEmail, validatePasswordStrength } from '../../utils/auth';
import type { RegisterData } from '../../types/auth';
import './AuthForms.css';

export const RegisterForm: React.FC = () => {
  const navigate = useNavigate();
  const { register, error: authError } = useAuthStore();

  const [formData, setFormData] = useState<RegisterData>({
    email: '',
    username: '',
    password: '',
    confirmPassword: '',
    firstName: '',
    lastName: '',
    acceptTerms: false,
  });

  const [errors, setErrors] = useState<Record<keyof RegisterData, string>>({
    email: '',
    username: '',
    password: '',
    confirmPassword: '',
    firstName: '',
    lastName: '',
    acceptTerms: '',
  });

  const [passwordStrength, setPasswordStrength] = useState<{
    score: number;
    feedback: string[];
  } | null>(null);

  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    // Email validation
    if (!formData.email) {
      newErrors.email = 'Email is required';
    } else if (!validateEmail(formData.email)) {
      newErrors.email = 'Invalid email format';
    }

    // Username validation
    if (!formData.username) {
      newErrors.username = 'Username is required';
    } else if (formData.username.length < 3) {
      newErrors.username = 'Username must be at least 3 characters';
    } else if (!/^[a-zA-Z0-9_]+$/.test(formData.username)) {
      newErrors.username = 'Username can only contain letters, numbers, and underscores';
    }

    // Password validation
    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else {
      const strength = validatePasswordStrength(formData.password);
      if (!strength.isValid) {
        newErrors.password = strength.feedback[0] || 'Password is too weak';
      }
    }

    // Confirm password validation
    if (!formData.confirmPassword) {
      newErrors.confirmPassword = 'Please confirm your password';
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }

    // Name validation
    if (!formData.firstName) {
      newErrors.firstName = 'First name is required';
    }

    if (!formData.lastName) {
      newErrors.lastName = 'Last name is required';
    }

    // Terms validation
    if (!formData.acceptTerms) {
      newErrors.acceptTerms = 'You must accept the terms and conditions';
    }

    setErrors(newErrors as Record<keyof RegisterData, string>);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);

    try {
      await register(formData);
      navigate('/', { replace: true });
    } catch (error) {
      console.error('Registration error:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    const newValue = type === 'checkbox' ? checked : value;

    setFormData((prev) => ({
      ...prev,
      [name]: newValue,
    }));

    // Clear error for this field
    if (errors[name as keyof typeof errors]) {
      setErrors((prev) => ({ ...prev, [name]: '' }));
    }

    // Update password strength on password change
    if (name === 'password' && typeof newValue === 'string') {
      const strength = validatePasswordStrength(newValue);
      setPasswordStrength({
        score: strength.score,
        feedback: strength.feedback,
      });
    }
  };

  const getPasswordStrengthColor = (score: number): string => {
    if (score <= 1) {
      return '#ef4444';
    } // red
    if (score === 2) {
      return '#f59e0b';
    } // orange
    if (score === 3) {
      return '#eab308';
    } // yellow
    return '#22c55e'; // green
  };

  const getPasswordStrengthLabel = (score: number): string => {
    if (score <= 1) {
      return 'Weak';
    }
    if (score === 2) {
      return 'Fair';
    }
    if (score === 3) {
      return 'Good';
    }
    return 'Strong';
  };

  return (
    <div className="auth-container">
      <div className="auth-card register-card">
        <div className="auth-header">
          <h1>Create Account</h1>
          <p>Start your CompTIA Network+ learning journey</p>
        </div>

        {authError && (
          <div className="auth-error" role="alert">
            {authError}
          </div>
        )}

        <form onSubmit={handleSubmit} className="auth-form" noValidate>
          <div className="form-row">
            <div className="form-group">
              <label htmlFor="firstName">First Name</label>
              <input
                type="text"
                id="firstName"
                name="firstName"
                value={formData.firstName}
                onChange={handleChange}
                className={errors.firstName ? 'error' : ''}
                placeholder="John"
                autoComplete="given-name"
                disabled={isSubmitting}
                aria-invalid={!!errors.firstName}
              />
              {errors.firstName && <span className="error-message">{errors.firstName}</span>}
            </div>

            <div className="form-group">
              <label htmlFor="lastName">Last Name</label>
              <input
                type="text"
                id="lastName"
                name="lastName"
                value={formData.lastName}
                onChange={handleChange}
                className={errors.lastName ? 'error' : ''}
                placeholder="Doe"
                autoComplete="family-name"
                disabled={isSubmitting}
                aria-invalid={!!errors.lastName}
              />
              {errors.lastName && <span className="error-message">{errors.lastName}</span>}
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="email">Email Address</label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className={errors.email ? 'error' : ''}
              placeholder="you@example.com"
              autoComplete="email"
              disabled={isSubmitting}
              aria-invalid={!!errors.email}
            />
            {errors.email && <span className="error-message">{errors.email}</span>}
          </div>

          <div className="form-group">
            <label htmlFor="username">Username</label>
            <input
              type="text"
              id="username"
              name="username"
              value={formData.username}
              onChange={handleChange}
              className={errors.username ? 'error' : ''}
              placeholder="johndoe"
              autoComplete="username"
              disabled={isSubmitting}
              aria-invalid={!!errors.username}
            />
            {errors.username && <span className="error-message">{errors.username}</span>}
          </div>

          <div className="form-group">
            <label htmlFor="password">Password</label>
            <div className="password-input-wrapper">
              <input
                type={showPassword ? 'text' : 'password'}
                id="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                className={errors.password ? 'error' : ''}
                placeholder="Create a strong password"
                autoComplete="new-password"
                disabled={isSubmitting}
                aria-invalid={!!errors.password}
              />
              <button
                type="button"
                className="password-toggle"
                onClick={() => setShowPassword(!showPassword)}
                aria-label={showPassword ? 'Hide password' : 'Show password'}
              >
                {showPassword ? '👁️' : '👁️‍🗨️'}
              </button>
            </div>
            {errors.password && <span className="error-message">{errors.password}</span>}
            {passwordStrength && formData.password && (
              <div className="password-strength">
                <div className="strength-bar-container">
                  <div
                    className="strength-bar"
                    style={{
                      width: `${(passwordStrength.score / 4) * 100}%`,
                      backgroundColor: getPasswordStrengthColor(passwordStrength.score),
                    }}
                  />
                </div>
                <span
                  className="strength-label"
                  style={{ color: getPasswordStrengthColor(passwordStrength.score) }}
                >
                  {getPasswordStrengthLabel(passwordStrength.score)}
                </span>
              </div>
            )}
          </div>

          <div className="form-group">
            <label htmlFor="confirmPassword">Confirm Password</label>
            <input
              type={showPassword ? 'text' : 'password'}
              id="confirmPassword"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              className={errors.confirmPassword ? 'error' : ''}
              placeholder="Re-enter your password"
              autoComplete="new-password"
              disabled={isSubmitting}
              aria-invalid={!!errors.confirmPassword}
            />
            {errors.confirmPassword && (
              <span className="error-message">{errors.confirmPassword}</span>
            )}
          </div>

          <div className="form-group">
            <label className="checkbox-label terms-label">
              <input
                type="checkbox"
                name="acceptTerms"
                checked={formData.acceptTerms}
                onChange={handleChange}
                disabled={isSubmitting}
                aria-invalid={!!errors.acceptTerms}
              />
              <span>
                I accept the{' '}
                <Link to="/terms" target="_blank" className="link">
                  Terms of Service
                </Link>{' '}
                and{' '}
                <Link to="/privacy" target="_blank" className="link">
                  Privacy Policy
                </Link>
              </span>
            </label>
            {errors.acceptTerms && <span className="error-message">{errors.acceptTerms}</span>}
          </div>

          <button type="submit" className="btn-primary btn-full" disabled={isSubmitting}>
            {isSubmitting ? 'Creating Account...' : 'Create Account'}
          </button>
        </form>

        <div className="auth-footer">
          <p>
            Already have an account?{' '}
            <Link to="/login" className="link">
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};
