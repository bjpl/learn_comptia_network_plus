import React from 'react';
import { BrowserRouter, MemoryRouter } from 'react-router-dom';
import { render as rtlRender, RenderOptions } from '@testing-library/react';
import { ProgressProvider } from '../../src/contexts/ProgressContext';
import { ThemeProvider } from '../../src/contexts/ThemeContext';

/**
 * Common provider wrapper for tests
 */
export const AllProviders: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <ThemeProvider>
      <ProgressProvider>
        {children}
      </ProgressProvider>
    </ThemeProvider>
  );
};

/**
 * Provider with routing support (uses BrowserRouter)
 */
export const AllProvidersWithRouter: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <BrowserRouter>
      <AllProviders>
        {children}
      </AllProviders>
    </BrowserRouter>
  );
};

/**
 * Provider with memory router (for testing without actual routing)
 */
export const AllProvidersWithMemoryRouter: React.FC<{
  children: React.ReactNode;
  initialEntries?: string[];
}> = ({ children, initialEntries = ['/'] }) => {
  return (
    <MemoryRouter initialEntries={initialEntries}>
      <AllProviders>
        {children}
      </AllProviders>
    </MemoryRouter>
  );
};

/**
 * Custom render that includes all providers
 */
export function renderWithProviders(
  ui: React.ReactElement,
  options?: Omit<RenderOptions, 'wrapper'>
) {
  return rtlRender(ui, { wrapper: AllProviders, ...options });
}

/**
 * Custom render that includes all providers and router
 */
export function renderWithRouter(
  ui: React.ReactElement,
  options?: Omit<RenderOptions, 'wrapper'>
) {
  return rtlRender(ui, { wrapper: AllProvidersWithRouter, ...options });
}

/**
 * Custom render that includes all providers and memory router
 */
export function renderWithMemoryRouter(
  ui: React.ReactElement,
  initialEntries: string[] = ['/'],
  options?: Omit<RenderOptions, 'wrapper'>
) {
  const Wrapper: React.FC<{ children: React.ReactNode }> = ({ children }) => (
    <AllProvidersWithMemoryRouter initialEntries={initialEntries}>
      {children}
    </AllProvidersWithMemoryRouter>
  );

  return rtlRender(ui, { wrapper: Wrapper, ...options });
}

/**
 * Mock authentication user
 */
export const mockAuthUser = {
  id: 'test-user-123',
  email: 'test@example.com',
  name: 'Test User',
  role: 'student' as const,
};

/**
 * Mock progress data
 */
export const mockProgressData = {
  totalCompleted: 0,
  totalComponents: 23,
  percentage: 0,
  averageScore: 0,
};
