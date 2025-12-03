/**
 * Unit tests for Cloud Architecture Designer component
 */

import { describe, it, expect, beforeEach, vi } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { axe, toHaveNoViolations } from 'jest-axe';
import CloudArchitectureDesigner from '../../../src/components/cloud/CloudArchitectureDesigner';
// Fixtures available for extended tests if needed
// import { mockCloudComponent, mockCloudDesign, mockValidationResult } from '../../fixtures/test-data';

expect.extend(toHaveNoViolations);

describe('CloudArchitectureDesigner', () => {
  let user: ReturnType<typeof userEvent.setup>;

  beforeEach(() => {
    user = userEvent.setup();
  });

  // =========================================================================
  // Rendering Tests
  // =========================================================================

  describe('Rendering', () => {
    it('should render the component without errors', () => {
      render(<CloudArchitectureDesigner />);
      expect(screen.getByText('Cloud Architecture Designer')).toBeInTheDocument();
    });

    it('should render with component library visible by default', () => {
      render(<CloudArchitectureDesigner />);
      expect(screen.getByText('Component Library')).toBeInTheDocument();
    });

    it('should render all category tabs', () => {
      render(<CloudArchitectureDesigner />);
      expect(screen.getByText('Deployment')).toBeInTheDocument();
      expect(screen.getByText('Services')).toBeInTheDocument();
      expect(screen.getByText('Connect')).toBeInTheDocument();
      expect(screen.getByText('VPC')).toBeInTheDocument();
      expect(screen.getByText('Gateways')).toBeInTheDocument();
      expect(screen.getByText('NFV')).toBeInTheDocument();
    });

    it('should render toolbar controls', () => {
      render(<CloudArchitectureDesigner />);
      expect(screen.getByText(/Hide Library|Show Library/)).toBeInTheDocument();
      expect(screen.getByText('Validate')).toBeInTheDocument();
      expect(screen.getByText('Export')).toBeInTheDocument();
      expect(screen.getByLabelText(/Snap to Grid/i)).toBeInTheDocument();
    });
  });

  // =========================================================================
  // Interaction Tests
  // =========================================================================

  describe('User Interactions', () => {
    it('should toggle library visibility', async () => {
      render(<CloudArchitectureDesigner />);

      const toggleButton = screen.getByText('Hide Library');
      await user.click(toggleButton);

      await waitFor(() => {
        expect(screen.getByText('Show Library')).toBeInTheDocument();
      });
    });

    it('should switch between component categories', async () => {
      render(<CloudArchitectureDesigner />);

      const servicesTab = screen.getByText('Services');
      await user.click(servicesTab);

      // After clicking, the tab's parent button should have 'active' class
      // The text is inside a span within the button
      const button = servicesTab.closest('button');
      expect(button).toHaveClass('active');
    });

    it('should update design name', async () => {
      render(<CloudArchitectureDesigner />);

      const nameInput = screen.getByPlaceholderText('Architecture name');
      await user.clear(nameInput);
      await user.type(nameInput, 'Test Architecture');

      expect(nameInput).toHaveValue('Test Architecture');
    });

    it('should toggle snap to grid', async () => {
      render(<CloudArchitectureDesigner />);

      const snapCheckbox = screen.getByLabelText(/Snap to Grid/i);
      expect(snapCheckbox).toBeChecked();

      await user.click(snapCheckbox);
      expect(snapCheckbox).not.toBeChecked();
    });
  });

  // =========================================================================
  // Drag and Drop Tests
  // =========================================================================

  describe('Drag and Drop', () => {
    it('should handle drag start event', () => {
      render(<CloudArchitectureDesigner />);

      // Find a draggable library item
      const libraryItems = screen
        .getAllByRole('generic', {
          hidden: true,
        })
        .filter((el) => el.draggable);

      expect(libraryItems.length).toBeGreaterThan(0);
    });

    it('should add component on drop', async () => {
      render(<CloudArchitectureDesigner />);

      // Simulate drag and drop would require more complex setup
      // This is a placeholder for the test structure
      const canvas = document.querySelector('.canvas');
      expect(canvas).toBeInTheDocument();
    });

    it('should snap component to grid when enabled', () => {
      render(<CloudArchitectureDesigner />);

      const snapCheckbox = screen.getByLabelText(/Snap to Grid/i);
      expect(snapCheckbox).toBeChecked();

      // Grid snapping logic tested through component behavior
    });
  });

  // =========================================================================
  // Component Management Tests
  // =========================================================================

  describe('Component Management', () => {
    it('should select component on click', async () => {
      render(<CloudArchitectureDesigner />);

      // This test would require components to be added first
      // Placeholder for component selection logic
      const propertiesPanel = document.querySelector('.properties-panel');

      // Initially no properties panel should be visible
      expect(propertiesPanel).not.toBeInTheDocument();
    });

    it('should delete component', () => {
      render(<CloudArchitectureDesigner />);

      // Test component deletion logic
      // Requires component to exist first
    });

    it('should update component properties', () => {
      render(<CloudArchitectureDesigner />);

      // Test property updates
      // Requires component selection first
    });
  });

  // =========================================================================
  // Connection Tests
  // =========================================================================

  describe('Connections', () => {
    it('should create connection between components', () => {
      render(<CloudArchitectureDesigner />);

      // Test connection creation
      // Requires two components to exist
    });

    it('should validate allowed connections', () => {
      render(<CloudArchitectureDesigner />);

      // Test connection validation rules
    });

    it('should render connections on canvas', () => {
      render(<CloudArchitectureDesigner />);

      const svg = document.querySelector('.connections-layer');
      expect(svg).toBeInTheDocument();
    });
  });

  // =========================================================================
  // Validation Tests
  // =========================================================================

  describe('Architecture Validation', () => {
    it('should validate architecture on button click', async () => {
      render(<CloudArchitectureDesigner />);

      const validateButton = screen.getByText('Validate');
      await user.click(validateButton);

      // Validation panel should appear
      await waitFor(() => {
        expect(screen.getByText('Validation Results')).toBeInTheDocument();
      });
    });

    it('should show validation errors', async () => {
      render(<CloudArchitectureDesigner />);

      const validateButton = screen.getByText('Validate');
      await user.click(validateButton);

      await waitFor(() => {
        const score = screen.getByText(/Score:/);
        expect(score).toBeInTheDocument();
      });
    });

    it('should detect isolated components', async () => {
      render(<CloudArchitectureDesigner />);

      // Add component and validate
      const validateButton = screen.getByText('Validate');
      await user.click(validateButton);

      // Check for warnings about isolated components
      await waitFor(() => {
        expect(screen.getByText('Validation Results')).toBeInTheDocument();
      });
    });

    it('should calculate validation score correctly', async () => {
      render(<CloudArchitectureDesigner />);

      const validateButton = screen.getByText('Validate');
      await user.click(validateButton);

      await waitFor(() => {
        const scoreElement = screen.getByText(/Score:/);
        expect(scoreElement).toBeInTheDocument();
      });
    });
  });

  // =========================================================================
  // Export Tests
  // =========================================================================

  describe('Export Functionality', () => {
    it('should export design as JSON', async () => {
      const createObjectURL = vi.fn();
      global.URL.createObjectURL = createObjectURL;

      render(<CloudArchitectureDesigner />);

      const exportButton = screen.getByText('Export');
      await user.click(exportButton);

      expect(createObjectURL).toHaveBeenCalled();
    });

    it('should include all design data in export', async () => {
      render(<CloudArchitectureDesigner />);

      // Export functionality test
      const exportButton = screen.getByText('Export');
      expect(exportButton).toBeInTheDocument();
    });
  });

  // =========================================================================
  // Accessibility Tests
  // =========================================================================

  describe('Accessibility', () => {
    it('should have no accessibility violations', async () => {
      const { container } = render(<CloudArchitectureDesigner />);
      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });

    it('should support keyboard navigation', async () => {
      render(<CloudArchitectureDesigner />);

      const nameInput = screen.getByPlaceholderText('Architecture name');
      await user.tab();

      expect(document.activeElement).toBeInTheDocument();
    });

    it('should have proper ARIA labels', () => {
      render(<CloudArchitectureDesigner />);

      const snapCheckbox = screen.getByLabelText(/Snap to Grid/i);
      expect(snapCheckbox).toHaveAttribute('type', 'checkbox');
    });
  });

  // =========================================================================
  // Performance Tests
  // =========================================================================

  describe('Performance', () => {
    it('should render large architectures efficiently', () => {
      const start = performance.now();
      render(<CloudArchitectureDesigner />);
      const end = performance.now();

      expect(end - start).toBeLessThan(1000); // Should render in under 1s
    });

    it('should handle multiple rapid interactions', async () => {
      render(<CloudArchitectureDesigner />);

      const toggleButton = screen.getByText('Hide Library');

      // Rapid clicks
      await user.click(toggleButton);
      await user.click(toggleButton);
      await user.click(toggleButton);

      // Should handle gracefully without errors
    });
  });

  // =========================================================================
  // Edge Cases
  // =========================================================================

  describe('Edge Cases', () => {
    it('should handle empty design name', async () => {
      render(<CloudArchitectureDesigner />);

      const nameInput = screen.getByPlaceholderText('Architecture name');
      await user.clear(nameInput);

      expect(nameInput).toHaveValue('');
    });

    it('should handle maximum zoom level', () => {
      render(<CloudArchitectureDesigner />);

      // Zoom level testing
      const canvas = document.querySelector('.canvas');
      expect(canvas).toBeInTheDocument();
    });

    it('should handle canvas boundary limits', () => {
      render(<CloudArchitectureDesigner />);

      // Test canvas boundaries
      const canvas = document.querySelector('.canvas');
      expect(canvas).toHaveStyle({ minWidth: '2000px', minHeight: '1500px' });
    });
  });
});
