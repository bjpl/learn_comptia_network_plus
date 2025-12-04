/**
 * ActiveSessions Component Tests
 * Tests session display, sign-out flows, and modal behavior
 */

import { describe, it, expect, beforeEach, vi, type Mock } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { ActiveSessions } from '../../../../src/components/auth/ActiveSessions';
import {
  getDeviceSessions,
  removeSession,
  removeAllOtherSessions,
  formatRelativeTime,
} from '../../../../src/utils/security';
import type { DeviceSession } from '../../../../src/types/security';

// Mock the security utilities
vi.mock('../../../../src/utils/security', () => ({
  getDeviceSessions: vi.fn(),
  removeSession: vi.fn(),
  removeAllOtherSessions: vi.fn(),
  formatRelativeTime: vi.fn(),
}));

const mockedGetDeviceSessions = getDeviceSessions as Mock;
const mockedRemoveSession = removeSession as Mock;
const mockedRemoveAllOtherSessions = removeAllOtherSessions as Mock;
const mockedFormatRelativeTime = formatRelativeTime as Mock;

// ============================================
// Mock Session Fixtures
// ============================================

const createMockSession = (overrides: Partial<DeviceSession> = {}): DeviceSession => ({
  id: 'session-1',
  deviceType: 'Desktop',
  browser: 'Chrome',
  location: {
    city: 'New York',
    country: 'USA',
  },
  ipAddress: '192.168.1.1',
  lastActive: '2024-12-03T10:00:00Z',
  isCurrent: false,
  createdAt: '2024-12-01T08:00:00Z',
  ...overrides,
});

const mockCurrentSession = createMockSession({
  id: 'current-session',
  deviceType: 'Desktop',
  browser: 'Chrome',
  isCurrent: true,
});

const mockMobileSession = createMockSession({
  id: 'mobile-session',
  deviceType: 'Mobile',
  browser: 'Safari',
  location: { city: 'Los Angeles', country: 'USA' },
  ipAddress: '10.0.0.1',
});

const mockTabletSession = createMockSession({
  id: 'tablet-session',
  deviceType: 'Tablet',
  browser: 'Firefox',
  location: { city: 'Chicago', country: 'USA' },
  ipAddress: '172.16.0.1',
});

// ============================================
// Test Setup
// ============================================

const defaultOnClose = vi.fn();

const setupMocks = (sessions: DeviceSession[] = []) => {
  mockedGetDeviceSessions.mockReturnValue(sessions);
  mockedRemoveSession.mockImplementation((sessionId: string) =>
    sessions.filter((s) => s.id !== sessionId)
  );
  mockedRemoveAllOtherSessions.mockImplementation(() =>
    sessions.filter((s) => s.isCurrent)
  );
  mockedFormatRelativeTime.mockImplementation((date: string) => {
    if (date.includes('10:00')) return '2 hours ago';
    return 'Just now';
  });
};

const renderActiveSessions = (onClose = defaultOnClose) => {
  return render(<ActiveSessions onClose={onClose} />);
};

// ============================================
// Tests
// ============================================

describe('ActiveSessions Component', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    defaultOnClose.mockClear();
  });

  describe('Initial Rendering', () => {
    it('should load sessions on mount', () => {
      setupMocks([mockCurrentSession]);
      renderActiveSessions();

      expect(mockedGetDeviceSessions).toHaveBeenCalledTimes(1);
    });

    it('should render modal with header', () => {
      setupMocks([mockCurrentSession]);
      renderActiveSessions();

      expect(screen.getByText('Active Sessions')).toBeInTheDocument();
      expect(
        screen.getByText('Manage devices that are currently signed in to your account')
      ).toBeInTheDocument();
    });

    it('should render close button', () => {
      setupMocks([mockCurrentSession]);
      renderActiveSessions();

      expect(screen.getByRole('button', { name: /close modal/i })).toBeInTheDocument();
    });
  });

  describe('Session Display', () => {
    it('should display current session with badge', () => {
      setupMocks([mockCurrentSession]);
      renderActiveSessions();

      expect(screen.getByText('Chrome on Desktop')).toBeInTheDocument();
      expect(screen.getByText('Current Session')).toBeInTheDocument();
    });

    it('should display session location and IP', () => {
      setupMocks([mockCurrentSession]);
      renderActiveSessions();

      expect(screen.getByText('New York, USA')).toBeInTheDocument();
      expect(screen.getByText('192.168.1.1')).toBeInTheDocument();
    });

    it('should display last active time', () => {
      setupMocks([mockCurrentSession]);
      renderActiveSessions();

      expect(screen.getByText(/Last active:/)).toBeInTheDocument();
      expect(screen.getByText(/2 hours ago/)).toBeInTheDocument();
    });

    it('should display multiple sessions', () => {
      setupMocks([mockCurrentSession, mockMobileSession, mockTabletSession]);
      renderActiveSessions();

      expect(screen.getByText('Chrome on Desktop')).toBeInTheDocument();
      expect(screen.getByText('Safari on Mobile')).toBeInTheDocument();
      expect(screen.getByText('Firefox on Tablet')).toBeInTheDocument();
    });

    it('should not show sign out button for current session', () => {
      setupMocks([mockCurrentSession]);
      renderActiveSessions();

      // Current session should not have a Sign Out button
      const signOutButtons = screen.queryAllByRole('button', { name: /sign out/i });
      // Filter out "Sign Out All Other Sessions" button
      const sessionSignOutButtons = signOutButtons.filter(
        (btn) => !btn.textContent?.includes('All')
      );
      expect(sessionSignOutButtons).toHaveLength(0);
    });

    it('should show sign out button for other sessions', () => {
      setupMocks([mockCurrentSession, mockMobileSession]);
      renderActiveSessions();

      const signOutButtons = screen.getAllByRole('button', { name: /^sign out$/i });
      expect(signOutButtons).toHaveLength(1);
    });
  });

  describe('Device Icons', () => {
    it('should display desktop icon for Desktop device', () => {
      setupMocks([mockCurrentSession]);
      const { container } = renderActiveSessions();

      const icon = container.querySelector('.session-icon');
      expect(icon?.textContent).toBe('🖥️');
    });

    it('should display mobile icon for Mobile device', () => {
      setupMocks([mockMobileSession]);
      const { container } = renderActiveSessions();

      const icon = container.querySelector('.session-icon');
      expect(icon?.textContent).toBe('📱');
    });

    it('should display tablet icon for Tablet device', () => {
      setupMocks([mockTabletSession]);
      const { container } = renderActiveSessions();

      const icon = container.querySelector('.session-icon');
      expect(icon?.textContent).toBe('📱');
    });
  });

  describe('Sign Out Individual Session', () => {
    it('should show confirm dialog when clicking sign out', () => {
      setupMocks([mockCurrentSession, mockMobileSession]);
      renderActiveSessions();

      const signOutButton = screen.getByRole('button', { name: /^sign out$/i });
      fireEvent.click(signOutButton);

      expect(screen.getByRole('button', { name: /confirm/i })).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /cancel/i })).toBeInTheDocument();
    });

    it('should remove session on confirm', () => {
      setupMocks([mockCurrentSession, mockMobileSession]);
      renderActiveSessions();

      const signOutButton = screen.getByRole('button', { name: /^sign out$/i });
      fireEvent.click(signOutButton);

      const confirmButton = screen.getByRole('button', { name: /confirm/i });
      fireEvent.click(confirmButton);

      expect(mockedRemoveSession).toHaveBeenCalledWith('mobile-session');
    });

    it('should cancel sign out on cancel click', () => {
      setupMocks([mockCurrentSession, mockMobileSession]);
      renderActiveSessions();

      const signOutButton = screen.getByRole('button', { name: /^sign out$/i });
      fireEvent.click(signOutButton);

      const cancelButton = screen.getByRole('button', { name: /cancel/i });
      fireEvent.click(cancelButton);

      expect(mockedRemoveSession).not.toHaveBeenCalled();
      // Confirm dialog should be hidden
      expect(screen.queryByRole('button', { name: /confirm/i })).not.toBeInTheDocument();
    });
  });

  describe('Sign Out All Other Sessions', () => {
    it('should show "Sign Out All Other Sessions" button when other sessions exist', () => {
      setupMocks([mockCurrentSession, mockMobileSession]);
      renderActiveSessions();

      expect(
        screen.getByRole('button', { name: /sign out all other sessions/i })
      ).toBeInTheDocument();
    });

    it('should not show "Sign Out All Other Sessions" when only current session', () => {
      setupMocks([mockCurrentSession]);
      renderActiveSessions();

      expect(
        screen.queryByRole('button', { name: /sign out all other sessions/i })
      ).not.toBeInTheDocument();
    });

    it('should show confirm dialog for sign out all', () => {
      setupMocks([mockCurrentSession, mockMobileSession]);
      renderActiveSessions();

      const signOutAllButton = screen.getByRole('button', {
        name: /sign out all other sessions/i,
      });
      fireEvent.click(signOutAllButton);

      expect(
        screen.getByText(/are you sure you want to sign out all other sessions/i)
      ).toBeInTheDocument();
      expect(
        screen.getByRole('button', { name: /sign out all others/i })
      ).toBeInTheDocument();
    });

    it('should remove all other sessions on confirm', () => {
      setupMocks([mockCurrentSession, mockMobileSession, mockTabletSession]);
      renderActiveSessions();

      const signOutAllButton = screen.getByRole('button', {
        name: /sign out all other sessions/i,
      });
      fireEvent.click(signOutAllButton);

      const confirmButton = screen.getByRole('button', { name: /sign out all others/i });
      fireEvent.click(confirmButton);

      expect(mockedRemoveAllOtherSessions).toHaveBeenCalledTimes(1);
    });

    it('should cancel sign out all on cancel click', () => {
      setupMocks([mockCurrentSession, mockMobileSession]);
      renderActiveSessions();

      const signOutAllButton = screen.getByRole('button', {
        name: /sign out all other sessions/i,
      });
      fireEvent.click(signOutAllButton);

      const cancelButton = screen.getByRole('button', { name: /^cancel$/i });
      fireEvent.click(cancelButton);

      expect(mockedRemoveAllOtherSessions).not.toHaveBeenCalled();
    });
  });

  describe('No Other Sessions', () => {
    it('should show message when no other sessions exist', () => {
      setupMocks([mockCurrentSession]);
      renderActiveSessions();

      expect(
        screen.getByText('You do not have any other active sessions')
      ).toBeInTheDocument();
    });

    it('should not show message when other sessions exist', () => {
      setupMocks([mockCurrentSession, mockMobileSession]);
      renderActiveSessions();

      expect(
        screen.queryByText('You do not have any other active sessions')
      ).not.toBeInTheDocument();
    });
  });

  describe('Modal Behavior', () => {
    it('should call onClose when clicking overlay', () => {
      setupMocks([mockCurrentSession]);
      const { container } = renderActiveSessions();

      const overlay = container.querySelector('.modal-overlay');
      fireEvent.click(overlay!);

      expect(defaultOnClose).toHaveBeenCalledTimes(1);
    });

    it('should call onClose when clicking close button', () => {
      setupMocks([mockCurrentSession]);
      renderActiveSessions();

      const closeButton = screen.getByRole('button', { name: /close modal/i });
      fireEvent.click(closeButton);

      expect(defaultOnClose).toHaveBeenCalledTimes(1);
    });

    it('should not call onClose when clicking modal content', () => {
      setupMocks([mockCurrentSession]);
      const { container } = renderActiveSessions();

      const modalContent = container.querySelector('.modal-content');
      fireEvent.click(modalContent!);

      expect(defaultOnClose).not.toHaveBeenCalled();
    });
  });

  describe('CSS Classes', () => {
    it('should have sessions-modal class on content', () => {
      setupMocks([mockCurrentSession]);
      const { container } = renderActiveSessions();

      expect(container.querySelector('.sessions-modal')).toBeInTheDocument();
    });

    it('should add current class to current session item', () => {
      setupMocks([mockCurrentSession, mockMobileSession]);
      const { container } = renderActiveSessions();

      const currentItem = container.querySelector('.session-item.current');
      expect(currentItem).toBeInTheDocument();
    });

    it('should have sessions-header class', () => {
      setupMocks([mockCurrentSession]);
      const { container } = renderActiveSessions();

      expect(container.querySelector('.sessions-header')).toBeInTheDocument();
    });

    it('should have sessions-list class', () => {
      setupMocks([mockCurrentSession]);
      const { container } = renderActiveSessions();

      expect(container.querySelector('.sessions-list')).toBeInTheDocument();
    });
  });
});
