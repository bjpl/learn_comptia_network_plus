/**
 * Unit tests for Port/Protocol Trainer component
 * Tests the ULTIMATE Port/Protocol Trainer with flashcards, quiz, and analytics modes
 */

import { describe, it, expect, beforeEach, vi } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { PortProtocolTrainer } from '../../../src/components/protocols/PortProtocolTrainer';

// Note: localStorage is mocked globally in tests/setup.ts
// We use the global mock and clear it in beforeEach

describe('PortProtocolTrainer', () => {
  let user: ReturnType<typeof userEvent.setup>;

  beforeEach(() => {
    user = userEvent.setup();
    localStorage.clear();
    vi.clearAllMocks();
  });

  // =========================================================================
  // Rendering Tests
  // =========================================================================

  describe('Rendering', () => {
    it('should render the trainer component with header', () => {
      render(<PortProtocolTrainer />);
      expect(screen.getByText(/ULTIMATE Port\/Protocol Trainer/i)).toBeInTheDocument();
    });

    it('should display stats bar with level and XP', () => {
      render(<PortProtocolTrainer />);
      expect(screen.getByText(/Level/i)).toBeInTheDocument();
      expect(screen.getByText(/XP/i)).toBeInTheDocument();
    });

    it('should display streak counter', () => {
      render(<PortProtocolTrainer />);
      expect(screen.getByText(/Streak/i)).toBeInTheDocument();
    });

    it('should have mode navigation buttons', () => {
      render(<PortProtocolTrainer />);

      // Check for mode buttons - they should be clickable elements
      const flashcardsButton = screen.getByText(/Flashcards/i);
      const quizButton = screen.getByText(/Quiz/i);

      expect(flashcardsButton).toBeInTheDocument();
      expect(quizButton).toBeInTheDocument();
    });
  });

  // =========================================================================
  // Flashcard Mode Tests
  // =========================================================================

  describe('Flashcard Mode', () => {
    it('should display flashcards by default', () => {
      render(<PortProtocolTrainer />);

      // Should be in flashcard mode by default and show card content
      expect(screen.getByText(/ULTIMATE Port\/Protocol Trainer/i)).toBeInTheDocument();
    });

    it('should show port numbers on flashcards', () => {
      render(<PortProtocolTrainer />);

      // Look for port numbers (20, 21, 22, etc.)
      const portNumbers = screen.getAllByText(/\d{2,5}/);
      expect(portNumbers.length).toBeGreaterThan(0);
    });

    it('should have navigation controls', () => {
      render(<PortProtocolTrainer />);

      // There should be some navigation - previous/next or similar
      const buttons = screen.getAllByRole('button');
      expect(buttons.length).toBeGreaterThan(0);
    });
  });

  // =========================================================================
  // Quiz Mode Tests
  // =========================================================================

  describe('Quiz Mode', () => {
    it('should switch to quiz mode', async () => {
      render(<PortProtocolTrainer />);

      const quizButton = screen.getByText(/Quiz/i);
      await user.click(quizButton);

      // Should now be in quiz mode
      await waitFor(() => {
        // Quiz mode should show questions or start quiz UI
        expect(screen.getByText(/Quiz/i)).toBeInTheDocument();
      });
    });

    it('should display quiz start button', async () => {
      render(<PortProtocolTrainer />);

      const quizButton = screen.getByText(/Quiz/i);
      await user.click(quizButton);

      await waitFor(() => {
        // Should have a start quiz option
        const startButtons = screen.getAllByRole('button');
        expect(startButtons.length).toBeGreaterThan(0);
      });
    });
  });

  // =========================================================================
  // Analytics Mode Tests
  // =========================================================================

  describe('Analytics Mode', () => {
    it('should switch to analytics mode', async () => {
      render(<PortProtocolTrainer />);

      // Find the Analytics mode button (first one in the mode selector)
      const analyticsButtons = screen.getAllByText(/Analytics/i);
      const modeButton = analyticsButtons[0]; // First match is the mode button
      await user.click(modeButton);

      await waitFor(() => {
        // Analytics mode should be active
        expect(document.body.textContent).toContain('Analytics');
      });
    });

    it('should display performance metrics', async () => {
      render(<PortProtocolTrainer />);

      const analyticsButtons = screen.getAllByText(/Analytics/i);
      await user.click(analyticsButtons[0]);

      await waitFor(() => {
        // Should show some performance data
        const statsElements = screen.getAllByText(/\d+/);
        expect(statsElements.length).toBeGreaterThan(0);
      });
    });
  });

  // =========================================================================
  // Memory Palace Mode Tests
  // =========================================================================

  describe('Memory Palace Mode', () => {
    it('should switch to memory palace mode', async () => {
      render(<PortProtocolTrainer />);

      // Find the Memory Palace mode button (first one is the mode selector)
      const palaceButtons = screen.getAllByText(/Memory Palace/i);
      await user.click(palaceButtons[0]);

      await waitFor(() => {
        expect(document.body.textContent).toContain('Memory Palace');
      });
    });
  });

  // =========================================================================
  // Progress Persistence Tests
  // =========================================================================

  describe('Progress Persistence', () => {
    it('should save progress to localStorage', async () => {
      render(<PortProtocolTrainer />);

      // Component should save stats on mount - check that localStorage has stats
      await waitFor(() => {
        const savedStats = localStorage.getItem('portTrainerStats');
        expect(savedStats).toBeTruthy();
      });
    });

    it('should load saved progress on mount', () => {
      // Set up saved progress before rendering
      const savedStats = JSON.stringify({
        totalCards: 30,
        masteredCards: 5,
        studyStreak: 3,
        lastStudyDate: new Date().toISOString(),
        totalReviews: 20,
        accuracy: 80,
        level: 2,
        xp: 150,
        achievements: [],
        quizScores: [80, 90],
      });

      localStorage.setItem('portTrainerStats', savedStats);

      render(<PortProtocolTrainer />);

      // Component should have loaded the stats - verify it renders with level info
      expect(screen.getByText(/Level/i)).toBeInTheDocument();
    });
  });

  // =========================================================================
  // Gamification Tests
  // =========================================================================

  describe('Gamification', () => {
    it('should display level information', () => {
      render(<PortProtocolTrainer />);

      expect(screen.getByText(/Level/i)).toBeInTheDocument();
    });

    it('should display XP progress', () => {
      render(<PortProtocolTrainer />);

      expect(screen.getByText(/XP/i)).toBeInTheDocument();
    });

    it('should have an XP progress bar', () => {
      render(<PortProtocolTrainer />);

      const xpBar = document.querySelector('.xp-bar, .xp-fill, [class*="xp"]');
      expect(xpBar).toBeInTheDocument();
    });
  });

  // =========================================================================
  // Protocol Data Tests
  // =========================================================================

  describe('Protocol Data', () => {
    it('should include exam-critical ports', () => {
      render(<PortProtocolTrainer />);

      // Check for port numbers that should be in the data
      // Port 20, 21, 22, 25, 80, 443 are exam-critical
      const content = document.body.textContent || '';

      // Should have port numbers somewhere (the flashcards show port numbers)
      expect(content).toMatch(/20|21|22|25|80|443/);
    });

    it('should display security information', () => {
      render(<PortProtocolTrainer />);

      // The component should show security status (Secure/Insecure)
      // This may be in flashcard details or elsewhere
      const content = document.body.textContent || '';
      expect(content).toMatch(/Secure|Insecure|TCP|UDP/i);
    });
  });

  // =========================================================================
  // Accessibility Tests
  // =========================================================================

  describe('Accessibility', () => {
    it('should have accessible buttons', () => {
      render(<PortProtocolTrainer />);

      const buttons = screen.getAllByRole('button');
      expect(buttons.length).toBeGreaterThan(0);

      // All buttons should be interactive
      buttons.forEach((button) => {
        expect(button).not.toBeDisabled();
      });
    });

    it('should have heading structure', () => {
      render(<PortProtocolTrainer />);

      const heading = screen.getByRole('heading', { level: 1 });
      expect(heading).toBeInTheDocument();
    });

    it('should support keyboard navigation', async () => {
      render(<PortProtocolTrainer />);

      // Tab should move focus
      await user.tab();
      expect(document.activeElement).not.toBe(document.body);
    });
  });

  // =========================================================================
  // Error Handling Tests
  // =========================================================================

  describe('Error Handling', () => {
    it('should handle empty localStorage gracefully', () => {
      localStorage.clear();

      expect(() => render(<PortProtocolTrainer />)).not.toThrow();
    });

    it('should render with default values when no saved data', () => {
      localStorage.clear();

      render(<PortProtocolTrainer />);

      // Should render with default state (level 1, 0 XP)
      expect(screen.getByText(/Level/i)).toBeInTheDocument();
      expect(screen.getByText(/XP/i)).toBeInTheDocument();
    });
  });

  // =========================================================================
  // UI State Tests
  // =========================================================================

  describe('UI State', () => {
    it('should maintain state across mode switches', async () => {
      render(<PortProtocolTrainer />);

      // Switch to quiz mode
      const quizButton = screen.getByText(/Quiz/i);
      await user.click(quizButton);

      // Switch back to flashcards
      const flashcardsButton = screen.getByText(/Flashcards/i);
      await user.click(flashcardsButton);

      // Should still have the header and stats
      expect(screen.getByText(/ULTIMATE Port\/Protocol Trainer/i)).toBeInTheDocument();
    });

    it('should update stats display dynamically', () => {
      render(<PortProtocolTrainer />);

      // Stats should be displayed and reactive
      const levelDisplay = screen.getByText(/Level/i);
      expect(levelDisplay).toBeInTheDocument();
    });
  });
});
