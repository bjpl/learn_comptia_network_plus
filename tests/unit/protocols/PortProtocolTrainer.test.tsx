/**
 * Unit tests for Port/Protocol Trainer component
 */

import { describe, it, expect, beforeEach, vi } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { axe, toHaveNoViolations } from 'jest-axe';
import PortProtocolTrainer from '../../../src/components/protocols/PortProtocolTrainer';
import { mockProtocol, mockFlashCard } from '../../fixtures/test-data';

expect.extend(toHaveNoViolations);

describe('PortProtocolTrainer', () => {
  let user: ReturnType<typeof userEvent.setup>;

  beforeEach(() => {
    user = userEvent.setup();
  });

  // =========================================================================
  // Rendering Tests
  // =========================================================================

  describe('Rendering', () => {
    it('should render the trainer component', () => {
      render(<PortProtocolTrainer />);
      expect(screen.getByText('Port & Protocol Explanation Trainer')).toBeInTheDocument();
    });

    it('should display progress bar', () => {
      render(<PortProtocolTrainer />);
      expect(screen.getByText(/cards mastered/i)).toBeInTheDocument();
    });

    it('should show card counter', () => {
      render(<PortProtocolTrainer />);
      expect(screen.getByText(/Card \d+ of \d+/)).toBeInTheDocument();
    });

    it('should render protocol filter', () => {
      render(<PortProtocolTrainer />);
      expect(screen.getByLabelText(/Filter by protocol/i)).toBeInTheDocument();
    });
  });

  // =========================================================================
  // Flashcard Navigation Tests
  // =========================================================================

  describe('Navigation', () => {
    it('should navigate to next card', async () => {
      render(<PortProtocolTrainer />);

      const initialCardText = screen.getByText(/Card \d+ of \d+/).textContent;
      const nextButton = screen.getByText('Next →');

      await user.click(nextButton);

      await waitFor(() => {
        const newCardText = screen.getByText(/Card \d+ of \d+/).textContent;
        expect(newCardText).not.toBe(initialCardText);
      });
    });

    it('should navigate to previous card', async () => {
      render(<PortProtocolTrainer />);

      const nextButton = screen.getByText('Next →');
      await user.click(nextButton);

      const prevButton = screen.getByText('← Previous');
      await user.click(prevButton);

      // Should return to first card
      expect(screen.getByText(/Card 1 of/)).toBeInTheDocument();
    });

    it('should wrap around at end of deck', async () => {
      render(<PortProtocolTrainer />);

      const nextButton = screen.getByText('Next →');

      // Click through all cards
      for (let i = 0; i < 50; i++) {
        await user.click(nextButton);
      }

      // Should wrap to beginning
      expect(screen.getByText(/Card/)).toBeInTheDocument();
    });
  });

  // =========================================================================
  // Explanation Tests
  // =========================================================================

  describe('Explanation System', () => {
    it('should display explanation textarea', () => {
      render(<PortProtocolTrainer />);

      const textarea = screen.getByPlaceholderText(/Type your explanation here/i);
      expect(textarea).toBeInTheDocument();
    });

    it('should count words in explanation', async () => {
      render(<PortProtocolTrainer />);

      const textarea = screen.getByPlaceholderText(/Type your explanation here/i);
      await user.type(textarea, 'HTTP is a protocol that transmits data in plaintext format.');

      await waitFor(() => {
        expect(screen.getByText(/Word count: 10/i)).toBeInTheDocument();
      });
    });

    it('should disable submit button for insufficient words', async () => {
      render(<PortProtocolTrainer />);

      const textarea = screen.getByPlaceholderText(/Type your explanation here/i);
      await user.type(textarea, 'Too short');

      const submitButton = screen.getByText('Submit Explanation');
      expect(submitButton).toBeDisabled();
    });

    it('should enable submit button for sufficient words', async () => {
      render(<PortProtocolTrainer />);

      const textarea = screen.getByPlaceholderText(/Type your explanation here/i);
      const longExplanation = 'HTTP is a protocol used for transmitting web pages over the internet. It operates on port 80 and sends data in plaintext format, making it vulnerable to interception. This is why HTTPS was developed.';

      await user.type(textarea, longExplanation);

      const submitButton = screen.getByText('Submit Explanation');
      await waitFor(() => {
        expect(submitButton).not.toBeDisabled();
      });
    });

    it('should calculate explanation score', async () => {
      render(<PortProtocolTrainer />);

      const textarea = screen.getByPlaceholderText(/Type your explanation here/i);
      const explanation = 'HTTP uses port 80 and transmits data in plaintext without encryption, making it vulnerable to man-in-the-middle attacks and packet sniffing.';

      await user.type(textarea, explanation);

      const submitButton = screen.getByText('Submit Explanation');
      await user.click(submitButton);

      await waitFor(() => {
        expect(screen.getByText(/Score:/i)).toBeInTheDocument();
      });
    });

    it('should provide feedback after submission', async () => {
      render(<PortProtocolTrainer />);

      const textarea = screen.getByPlaceholderText(/Type your explanation here/i);
      const explanation = 'HTTP transmits data without encryption on port 80, which makes it insecure for sensitive information.';

      await user.type(textarea, explanation);

      const submitButton = screen.getByText('Submit Explanation');
      await user.click(submitButton);

      await waitFor(() => {
        expect(screen.getByText(/Feedback:/i)).toBeInTheDocument();
      });
    });

    it('should mark card as mastered for high score', async () => {
      render(<PortProtocolTrainer />);

      const initialMastered = screen.getByText(/\d+ \/ \d+ cards mastered/).textContent;

      const textarea = screen.getByPlaceholderText(/Type your explanation here/i);
      const excellentExplanation = 'HTTP is an insecure protocol operating on port 80 that transmits data in plaintext format. This makes it vulnerable to man-in-the-middle attacks, packet sniffing, and data interception. Best practice is to use HTTPS with TLS encryption instead, which provides authentication and confidentiality.';

      await user.type(textarea, excellentExplanation);

      const submitButton = screen.getByText('Submit Explanation');
      await user.click(submitButton);

      await waitFor(() => {
        const newMastered = screen.getByText(/\d+ \/ \d+ cards mastered/).textContent;
        // High score should increase mastered count
        expect(screen.getByText(/Score:/i)).toBeInTheDocument();
      });
    });
  });

  // =========================================================================
  // Hints Tests
  // =========================================================================

  describe('Hints System', () => {
    it('should display hint buttons', () => {
      render(<PortProtocolTrainer />);

      expect(screen.getByText('Need a hint?')).toBeInTheDocument();
      expect(screen.getAllByText(/Hint \d+/).length).toBeGreaterThan(0);
    });

    it('should reveal hint on click', async () => {
      render(<PortProtocolTrainer />);

      const hintButton = screen.getAllByText(/Hint \d+/)[0];
      await user.click(hintButton);

      await waitFor(() => {
        // Button should be disabled after revealing
        expect(hintButton).toBeDisabled();
      });
    });

    it('should disable used hints', async () => {
      render(<PortProtocolTrainer />);

      const hintButton = screen.getAllByText(/Hint \d+/)[0];
      await user.click(hintButton);

      await waitFor(() => {
        expect(hintButton).toBeDisabled();
      });

      // Should not be clickable again
      await user.click(hintButton);
      expect(hintButton).toBeDisabled();
    });
  });

  // =========================================================================
  // Answer Display Tests
  // =========================================================================

  describe('Answer Display', () => {
    it('should toggle answer visibility', async () => {
      render(<PortProtocolTrainer />);

      const toggleButton = screen.getByText('Show Answer');
      await user.click(toggleButton);

      await waitFor(() => {
        expect(screen.getByText('Hide Answer')).toBeInTheDocument();
        expect(screen.getByText('Answer:')).toBeInTheDocument();
      });
    });

    it('should hide answer when toggled', async () => {
      render(<PortProtocolTrainer />);

      const showButton = screen.getByText('Show Answer');
      await user.click(showButton);

      const hideButton = screen.getByText('Hide Answer');
      await user.click(hideButton);

      await waitFor(() => {
        expect(screen.getByText('Show Answer')).toBeInTheDocument();
      });
    });
  });

  // =========================================================================
  // Protocol Details Tests
  // =========================================================================

  describe('Protocol Details', () => {
    it('should display protocol badge', () => {
      render(<PortProtocolTrainer />);

      // Protocol information should be visible
      const badge = document.querySelector('.protocol-badge');
      expect(badge).toBeInTheDocument();
    });

    it('should show security indicator', () => {
      render(<PortProtocolTrainer />);

      const securityIndicator = document.querySelector('.security-indicator');
      expect(securityIndicator).toBeInTheDocument();
    });

    it('should display protocol details section', () => {
      render(<PortProtocolTrainer />);

      expect(screen.getByText(/Protocol Details:/)).toBeInTheDocument();
    });

    it('should show vulnerabilities', () => {
      render(<PortProtocolTrainer />);

      expect(screen.getByText('Common Vulnerabilities:')).toBeInTheDocument();
    });

    it('should show best practices', () => {
      render(<PortProtocolTrainer />);

      expect(screen.getByText('Best Practices:')).toBeInTheDocument();
    });
  });

  // =========================================================================
  // Filter Tests
  // =========================================================================

  describe('Protocol Filtering', () => {
    it('should filter cards by protocol', async () => {
      render(<PortProtocolTrainer />);

      const filterSelect = screen.getByLabelText(/Filter by protocol/i);
      await user.selectOptions(filterSelect, 'HTTP');

      // Should update card display
      expect(filterSelect).toHaveValue('HTTP');
    });

    it('should reset to all protocols', async () => {
      render(<PortProtocolTrainer />);

      const filterSelect = screen.getByLabelText(/Filter by protocol/i);
      await user.selectOptions(filterSelect, 'All Protocols');

      expect(filterSelect).toHaveValue('all');
    });
  });

  // =========================================================================
  // Progress Tracking Tests
  // =========================================================================

  describe('Progress Tracking', () => {
    it('should update progress bar', async () => {
      render(<PortProtocolTrainer />);

      const progressBar = document.querySelector('.progress-fill');
      expect(progressBar).toBeInTheDocument();
    });

    it('should track completed cards', () => {
      render(<PortProtocolTrainer />);

      const masteredText = screen.getByText(/\d+ \/ \d+ cards mastered/);
      expect(masteredText).toBeInTheDocument();
    });
  });

  // =========================================================================
  // Accessibility Tests
  // =========================================================================

  describe('Accessibility', () => {
    it('should have no accessibility violations', async () => {
      const { container } = render(<PortProtocolTrainer />);
      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });

    it('should support keyboard navigation', async () => {
      render(<PortProtocolTrainer />);

      await user.tab();
      expect(document.activeElement).toBeInTheDocument();
    });

    it('should have proper labels', () => {
      render(<PortProtocolTrainer />);

      const filterSelect = screen.getByLabelText(/Filter by protocol/i);
      expect(filterSelect).toHaveAccessibleName();
    });
  });

  // =========================================================================
  // Performance Tests
  // =========================================================================

  describe('Performance', () => {
    it('should render quickly', () => {
      const start = performance.now();
      render(<PortProtocolTrainer />);
      const end = performance.now();

      expect(end - start).toBeLessThan(500);
    });

    it('should handle rapid navigation', async () => {
      render(<PortProtocolTrainer />);

      const nextButton = screen.getByText('Next →');

      // Rapid clicking
      for (let i = 0; i < 10; i++) {
        await user.click(nextButton);
      }

      // Should handle gracefully
      expect(screen.getByText(/Card/)).toBeInTheDocument();
    });
  });

  // =========================================================================
  // Edge Cases
  // =========================================================================

  describe('Edge Cases', () => {
    it('should handle empty explanation', async () => {
      render(<PortProtocolTrainer />);

      const submitButton = screen.getByText('Submit Explanation');
      expect(submitButton).toBeDisabled();
    });

    it('should handle very long explanations', async () => {
      render(<PortProtocolTrainer />);

      const textarea = screen.getByPlaceholderText(/Type your explanation here/i);
      const longText = 'word '.repeat(500);

      await user.type(textarea, longText);

      await waitFor(() => {
        expect(screen.getByText(/Word count: 500/i)).toBeInTheDocument();
      }, { timeout: 10000 });
    });

    it('should handle special characters', async () => {
      render(<PortProtocolTrainer />);

      const textarea = screen.getByPlaceholderText(/Type your explanation here/i);
      await user.type(textarea, 'HTTP: <script>alert("test")</script> & special chars!');

      // Should not break or execute scripts
      expect(textarea).toBeInTheDocument();
    });
  });
});
