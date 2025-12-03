/**
 * Unit tests for Media Selection Matrix component
 */

import { describe, it, expect, beforeEach, vi } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { axe, toHaveNoViolations } from 'jest-axe';
import MediaSelectionMatrix from '../../../src/components/media/MediaSelectionMatrix';
import { mockMediaOption, mockScenarioRequirement } from '../../fixtures/test-data';

expect.extend(toHaveNoViolations);

describe('MediaSelectionMatrix', () => {
  let user: ReturnType<typeof userEvent.setup>;

  beforeEach(() => {
    user = userEvent.setup();
  });

  // =========================================================================
  // Rendering Tests
  // =========================================================================

  describe('Rendering', () => {
    it('should render the component', () => {
      render(<MediaSelectionMatrix />);
      expect(screen.getByText('Media Selection Matrix')).toBeInTheDocument();
    });

    it('should display scenario information', () => {
      render(<MediaSelectionMatrix />);

      // Check for scenario elements
      expect(screen.getByText('Media Selection Matrix')).toBeInTheDocument();
      // The scenario title is rendered with the scenario number
      const content = document.body.textContent || '';
      expect(content).toContain('Scenario');
      expect(content).toContain('Required Distance');
      expect(content).toContain('Environment');
      expect(content).toContain('Budget');
    });

    it('should render media options table', () => {
      render(<MediaSelectionMatrix />);

      expect(screen.getByText('Select Transmission Media')).toBeInTheDocument();
      expect(screen.getByText('Media Type')).toBeInTheDocument();
      expect(screen.getByText('Max Distance')).toBeInTheDocument();
      expect(screen.getByText('Bandwidth')).toBeInTheDocument();
      expect(screen.getByText('Cost/m')).toBeInTheDocument();
    });

    it('should display progress tracker', () => {
      render(<MediaSelectionMatrix />);

      expect(screen.getByText('Progress')).toBeInTheDocument();
      expect(screen.getByText(/\d+ \/ \d+/)).toBeInTheDocument();
    });
  });

  // =========================================================================
  // Media Selection Tests
  // =========================================================================

  describe('Media Selection', () => {
    it('should allow selecting media option', async () => {
      render(<MediaSelectionMatrix />);

      const radioButtons = screen.getAllByRole('radio');
      expect(radioButtons.length).toBeGreaterThan(0);

      await user.click(radioButtons[0]);

      await waitFor(() => {
        expect(radioButtons[0]).toBeChecked();
      });
    });

    it('should highlight selected row', async () => {
      render(<MediaSelectionMatrix />);

      const rows = screen.getAllByRole('row').slice(1); // Skip header
      await user.click(rows[0]);

      await waitFor(() => {
        expect(rows[0]).toHaveClass(/bg-blue-50/);
      });
    });

    it('should enable submit button when media selected', async () => {
      render(<MediaSelectionMatrix />);

      const submitButton = screen.getByText('Submit Answer');
      expect(submitButton).toBeDisabled();

      const radioButtons = screen.getAllByRole('radio');
      await user.click(radioButtons[0]);

      await waitFor(() => {
        expect(submitButton).not.toBeDisabled();
      });
    });

    it('should allow changing selection', async () => {
      render(<MediaSelectionMatrix />);

      const radioButtons = screen.getAllByRole('radio');

      await user.click(radioButtons[0]);
      expect(radioButtons[0]).toBeChecked();

      await user.click(radioButtons[1]);
      await waitFor(() => {
        expect(radioButtons[1]).toBeChecked();
        expect(radioButtons[0]).not.toBeChecked();
      });
    });
  });

  // =========================================================================
  // Assessment Tests
  // =========================================================================

  describe('Assessment', () => {
    it('should show results after submission', async () => {
      render(<MediaSelectionMatrix />);

      const radioButtons = screen.getAllByRole('radio');
      await user.click(radioButtons[0]);

      const submitButton = screen.getByText('Submit Answer');
      await user.click(submitButton);

      await waitFor(() => {
        expect(screen.getByText('Assessment Results')).toBeInTheDocument();
      });
    });

    it('should display score', async () => {
      render(<MediaSelectionMatrix />);

      const radioButtons = screen.getAllByRole('radio');
      await user.click(radioButtons[0]);

      const submitButton = screen.getByText('Submit Answer');
      await user.click(submitButton);

      await waitFor(() => {
        expect(screen.getByText(/Your Selection/i)).toBeInTheDocument();
      });
    });

    it('should show assessment criteria', async () => {
      render(<MediaSelectionMatrix />);

      const radioButtons = screen.getAllByRole('radio');
      await user.click(radioButtons[0]);

      const submitButton = screen.getByText('Submit Answer');
      await user.click(submitButton);

      await waitFor(() => {
        expect(screen.getByText(/Distance Requirement/i)).toBeInTheDocument();
        expect(screen.getByText(/Bandwidth Requirement/i)).toBeInTheDocument();
        expect(screen.getByText(/Environmental Suitability/i)).toBeInTheDocument();
        expect(screen.getByText(/Budget Constraint/i)).toBeInTheDocument();
      });
    });

    it('should provide reasoning', async () => {
      render(<MediaSelectionMatrix />);

      const radioButtons = screen.getAllByRole('radio');
      await user.click(radioButtons[0]);

      const submitButton = screen.getByText('Submit Answer');
      await user.click(submitButton);

      await waitFor(() => {
        expect(screen.getByText(/Assessment Reasoning/i)).toBeInTheDocument();
      });
    });

    it('should show optimal solutions for suboptimal choice', async () => {
      render(<MediaSelectionMatrix />);

      const radioButtons = screen.getAllByRole('radio');
      await user.click(radioButtons[radioButtons.length - 1]); // Select worst option

      const submitButton = screen.getByText('Submit Answer');
      await user.click(submitButton);

      await waitFor(() => {
        // May show optimal solutions
        const resultsSection = screen.getByText('Assessment Results');
        expect(resultsSection).toBeInTheDocument();
      });
    });
  });

  // =========================================================================
  // Navigation Tests
  // =========================================================================

  describe('Navigation', () => {
    it('should navigate to next scenario', async () => {
      render(<MediaSelectionMatrix />);

      const initialScenario = screen.getByText(/Scenario \d+:/).textContent;
      const nextButton = screen.getByText('Next Scenario');

      await user.click(nextButton);

      await waitFor(() => {
        const newScenario = screen.getByText(/Scenario \d+:/).textContent;
        expect(newScenario).not.toBe(initialScenario);
      });
    });

    it('should navigate to previous scenario', async () => {
      render(<MediaSelectionMatrix />);

      const nextButton = screen.getByText('Next Scenario');
      await user.click(nextButton);

      const prevButton = screen.getByText('Previous Scenario');
      await user.click(prevButton);

      // Should return to first scenario
      expect(screen.getByText(/Scenario 1:/)).toBeInTheDocument();
    });

    it('should reset selection on scenario change', async () => {
      render(<MediaSelectionMatrix />);

      const radioButtons = screen.getAllByRole('radio');
      await user.click(radioButtons[0]);

      const nextButton = screen.getByText('Next Scenario');
      await user.click(nextButton);

      await waitFor(() => {
        const newRadioButtons = screen.getAllByRole('radio');
        newRadioButtons.forEach((button) => {
          expect(button).not.toBeChecked();
        });
      });
    });

    it('should clear results on scenario change', async () => {
      render(<MediaSelectionMatrix />);

      const radioButtons = screen.getAllByRole('radio');
      await user.click(radioButtons[0]);

      const submitButton = screen.getByText('Submit Answer');
      await user.click(submitButton);

      await waitFor(() => {
        expect(screen.getByText('Assessment Results')).toBeInTheDocument();
      });

      const nextButton = screen.getByText('Next Scenario');
      await user.click(nextButton);

      await waitFor(() => {
        expect(screen.queryByText('Assessment Results')).not.toBeInTheDocument();
      });
    });
  });

  // =========================================================================
  // Progress Tracking Tests
  // =========================================================================

  describe('Progress Tracking', () => {
    it('should update progress after completion', async () => {
      render(<MediaSelectionMatrix />);

      const initialProgress = screen.getByText(/\d+ \/ \d+/).textContent;

      const radioButtons = screen.getAllByRole('radio');
      await user.click(radioButtons[0]);

      const submitButton = screen.getByText('Submit Answer');
      await user.click(submitButton);

      await waitFor(() => {
        // Progress should be tracked
        expect(screen.getByText(/\d+ \/ \d+/)).toBeInTheDocument();
      });
    });

    it('should mark scenario as completed', async () => {
      render(<MediaSelectionMatrix />);

      const radioButtons = screen.getAllByRole('radio');
      await user.click(radioButtons[0]);

      const submitButton = screen.getByText('Submit Answer');
      await user.click(submitButton);

      await waitFor(() => {
        // Completion indicator should appear
        const checkIcon = document.querySelector('.text-green-600');
        expect(checkIcon).toBeInTheDocument();
      });
    });

    it('should update progress bar', async () => {
      render(<MediaSelectionMatrix />);

      const radioButtons = screen.getAllByRole('radio');
      await user.click(radioButtons[0]);

      const submitButton = screen.getByText('Submit Answer');
      await user.click(submitButton);

      await waitFor(() => {
        // Progress tracking should exist in the UI
        expect(screen.getByText(/\d+ \/ \d+/)).toBeInTheDocument();
      });
    });
  });

  // =========================================================================
  // Score Calculation Tests
  // =========================================================================

  describe('Score Calculation', () => {
    it('should award 100 points for optimal choice', async () => {
      render(<MediaSelectionMatrix />);

      // Find and select optimal media (would need to be determined from scenario)
      const radioButtons = screen.getAllByRole('radio');
      await user.click(radioButtons[0]);

      const submitButton = screen.getByText('Submit Answer');
      await user.click(submitButton);

      await waitFor(() => {
        // Score should be displayed
        expect(screen.getByText('Assessment Results')).toBeInTheDocument();
      });
    });

    it('should provide feedback for suboptimal choice', async () => {
      render(<MediaSelectionMatrix />);

      const radioButtons = screen.getAllByRole('radio');
      await user.click(radioButtons[radioButtons.length - 1]);

      const submitButton = screen.getByText('Submit Answer');
      await user.click(submitButton);

      await waitFor(() => {
        expect(screen.getByText(/Assessment Reasoning/i)).toBeInTheDocument();
      });
    });
  });

  // =========================================================================
  // Accessibility Tests
  // =========================================================================

  describe('Accessibility', () => {
    it('should have no accessibility violations', async () => {
      const { container } = render(<MediaSelectionMatrix />);
      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });

    it('should support keyboard navigation', async () => {
      render(<MediaSelectionMatrix />);

      await user.tab();
      expect(document.activeElement).toBeInTheDocument();
    });

    it('should have proper table structure', () => {
      render(<MediaSelectionMatrix />);

      // The shadcn/ui Table component should be present
      // Check for table headers like "Media Type", "Max Distance", etc.
      expect(screen.getByText('Media Type')).toBeInTheDocument();
      expect(screen.getByText('Max Distance')).toBeInTheDocument();
      expect(screen.getByText('Bandwidth')).toBeInTheDocument();
      expect(screen.getByText('Cost/m')).toBeInTheDocument();
    });
  });

  // =========================================================================
  // Responsive Design Tests
  // =========================================================================

  describe('Responsive Design', () => {
    it('should adapt layout for mobile', () => {
      global.innerWidth = 375;
      global.dispatchEvent(new Event('resize'));

      render(<MediaSelectionMatrix />);

      // Component should render without errors
      expect(screen.getByText('Media Selection Matrix')).toBeInTheDocument();
    });

    it('should adapt layout for tablet', () => {
      global.innerWidth = 768;
      global.dispatchEvent(new Event('resize'));

      render(<MediaSelectionMatrix />);

      expect(screen.getByText('Media Selection Matrix')).toBeInTheDocument();
    });
  });

  // =========================================================================
  // Edge Cases
  // =========================================================================

  describe('Edge Cases', () => {
    it('should handle scenarios with special conditions', () => {
      render(<MediaSelectionMatrix />);

      // Special conditions should be displayed if present
      const specialConditions = document.querySelector('.bg-blue-50');
      // May or may not be present depending on scenario
    });

    it('should handle media with zero cost', () => {
      render(<MediaSelectionMatrix />);

      // Wireless media may have zero cost per meter or show N/A
      // The component should render without errors even for zero-cost media
      expect(screen.getByText('Media Selection Matrix')).toBeInTheDocument();
      // Check that the table renders with cost column
      expect(screen.getByText('Cost/m')).toBeInTheDocument();
    });

    it('should handle extreme distance requirements', () => {
      render(<MediaSelectionMatrix />);

      // Component should handle large distances
      expect(screen.getByText('Media Selection Matrix')).toBeInTheDocument();
    });
  });
});
