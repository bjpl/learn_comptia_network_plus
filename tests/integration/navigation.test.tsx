/**
 * Integration tests for navigation and routing
 */

import { describe, it, expect, beforeEach } from 'vitest';
import { render, screen, waitFor, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { MainLayout } from '../../src/components/layout/MainLayout';
import { useAppStore } from '../../src/store';

// Mock pages for testing
const MockCloudPage = () => <div data-testid="cloud-page">Cloud Architecture Designer</div>;
const MockProtocolPage = () => <div data-testid="protocol-page">Port Protocol Trainer</div>;
const MockMediaPage = () => <div data-testid="media-page">Media Selection Matrix</div>;
const MockHomePage = () => <div data-testid="home-page">Welcome to Network+</div>;

describe('Navigation Integration', () => {
  let user: ReturnType<typeof userEvent.setup>;

  const renderWithRouter = (initialRoute = '/') => {
    window.history.pushState({}, '', initialRoute);

    return render(
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<MainLayout />}>
            <Route index element={<MockHomePage />} />
            <Route path="cloud/architecture" element={<MockCloudPage />} />
            <Route path="ports/trainer" element={<MockProtocolPage />} />
            <Route path="transmission/media-selection" element={<MockMediaPage />} />
          </Route>
        </Routes>
      </BrowserRouter>
    );
  };

  beforeEach(() => {
    user = userEvent.setup();
    // Reset app store state
    const store = useAppStore.getState();
    store.setCurrentPath('/');
  });

  // =========================================================================
  // Route Navigation Tests
  // =========================================================================

  describe('Route Navigation', () => {
    it('should render the layout with navigation', async () => {
      renderWithRouter();

      // The sidebar should have a navigation element
      const nav = document.querySelector('nav');
      expect(nav).toBeInTheDocument();

      // Home page content should be visible
      expect(screen.getByTestId('home-page')).toBeInTheDocument();
    });

    it('should navigate to cloud architecture via sidebar', async () => {
      renderWithRouter();

      // Find the Cloud Concepts section and expand it if needed
      const cloudSection = screen.getByText(/Cloud Concepts/i);
      expect(cloudSection).toBeInTheDocument();

      // Click on Architecture Designer link
      const architectureLink = screen.getByText(/Architecture Designer/i);
      await user.click(architectureLink);

      await waitFor(() => {
        expect(screen.getByTestId('cloud-page')).toBeInTheDocument();
      });
    });

    it('should navigate to protocol trainer via sidebar', async () => {
      renderWithRouter();

      // Find the Ports & Protocols section
      const portsSection = screen.getByText(/Ports & Protocols/i);
      expect(portsSection).toBeInTheDocument();

      // Click on the trainer link
      const trainerLink = screen.getByText(/Port\/Protocol Trainer/i);
      await user.click(trainerLink);

      await waitFor(() => {
        expect(screen.getByTestId('protocol-page')).toBeInTheDocument();
      });
    });

    it('should navigate to media selection via sidebar', async () => {
      renderWithRouter();

      // Find the Transmission Media section
      const transmissionSection = screen.getByText(/Transmission Media/i);
      expect(transmissionSection).toBeInTheDocument();

      // Click on the media selection link
      const mediaLink = screen.getByText(/Media Selection Matrix/i);
      await user.click(mediaLink);

      await waitFor(() => {
        expect(screen.getByTestId('media-page')).toBeInTheDocument();
      });
    });

    it('should navigate back to home', async () => {
      renderWithRouter('/cloud/architecture');

      // Find the Home link in the sidebar
      const homeLinks = screen.getAllByText(/Home/i);
      const sidebarHomeLink = homeLinks[0]; // First Home link should be in sidebar
      await user.click(sidebarHomeLink);

      await waitFor(() => {
        expect(screen.getByTestId('home-page')).toBeInTheDocument();
      });
    });
  });

  // =========================================================================
  // Sidebar Navigation Tests
  // =========================================================================

  describe('Sidebar Navigation', () => {
    it('should display sidebar with navigation sections', async () => {
      renderWithRouter();

      // Check that main navigation sections exist
      expect(screen.getByText(/OSI Model/i)).toBeInTheDocument();
      expect(screen.getByText(/Cloud Concepts/i)).toBeInTheDocument();
      expect(screen.getByText(/Ports & Protocols/i)).toBeInTheDocument();
    });

    it('should have expandable sections', async () => {
      renderWithRouter();

      // Section children should be visible by default (expanded)
      expect(screen.getByText(/Layer Explanation Builder/i)).toBeInTheDocument();
      expect(screen.getByText(/Architecture Designer/i)).toBeInTheDocument();
    });

    it('should show learning objectives', () => {
      renderWithRouter();

      // Learning objectives like "LO 1.0", "LO 1.2" should be visible
      expect(screen.getByText(/LO 1\.0/i)).toBeInTheDocument();
      expect(screen.getByText(/LO 1\.2/i)).toBeInTheDocument();
    });
  });

  // =========================================================================
  // Browser History Tests
  // =========================================================================

  describe('Browser History', () => {
    it('should support back button navigation', async () => {
      renderWithRouter();

      const architectureLink = screen.getByText(/Architecture Designer/i);
      await user.click(architectureLink);

      await waitFor(() => {
        expect(screen.getByTestId('cloud-page')).toBeInTheDocument();
      });

      window.history.back();

      await waitFor(() => {
        expect(screen.getByTestId('home-page')).toBeInTheDocument();
      });
    });

    it('should support forward button navigation', async () => {
      renderWithRouter();

      const architectureLink = screen.getByText(/Architecture Designer/i);
      await user.click(architectureLink);

      await waitFor(() => {
        expect(screen.getByTestId('cloud-page')).toBeInTheDocument();
      });

      window.history.back();

      await waitFor(() => {
        expect(screen.getByTestId('home-page')).toBeInTheDocument();
      });

      window.history.forward();

      await waitFor(() => {
        expect(screen.getByTestId('cloud-page')).toBeInTheDocument();
      });
    });
  });

  // =========================================================================
  // Deep Linking Tests
  // =========================================================================

  describe('Deep Linking', () => {
    it('should load directly to cloud architecture', () => {
      renderWithRouter('/cloud/architecture');

      expect(screen.getByTestId('cloud-page')).toBeInTheDocument();
    });

    it('should load directly to protocol trainer', () => {
      renderWithRouter('/ports/trainer');

      expect(screen.getByTestId('protocol-page')).toBeInTheDocument();
    });

    it('should handle root route', () => {
      renderWithRouter('/');

      expect(screen.getByTestId('home-page')).toBeInTheDocument();
    });
  });

  // =========================================================================
  // Store Integration Tests
  // =========================================================================

  describe('Store Integration', () => {
    it('should have theme state available', () => {
      renderWithRouter();

      const state = useAppStore.getState();
      expect(state.theme).toBeDefined();
    });

    it('should have progress state available', () => {
      renderWithRouter();

      const state = useAppStore.getState();
      expect(state.progress).toBeDefined();
    });
  });

  // =========================================================================
  // Breadcrumb Tests
  // =========================================================================

  describe('Breadcrumbs', () => {
    it('should display breadcrumbs for nested routes', () => {
      renderWithRouter('/cloud/architecture');

      const breadcrumbNav = document.querySelector('[aria-label="Breadcrumb"]');
      expect(breadcrumbNav).toBeInTheDocument();

      // Should have Home link in breadcrumbs
      const homeLink = within(breadcrumbNav as HTMLElement).getByText('Home');
      expect(homeLink).toBeInTheDocument();
    });

    it('should display current page in breadcrumbs', () => {
      renderWithRouter('/cloud/architecture');

      const breadcrumbNav = document.querySelector('[aria-label="Breadcrumb"]');
      expect(breadcrumbNav).toBeInTheDocument();

      // Should show the path segments
      expect(within(breadcrumbNav as HTMLElement).getByText(/Cloud/i)).toBeInTheDocument();
    });
  });

  // =========================================================================
  // Sidebar Collapse Tests
  // =========================================================================

  describe('Sidebar Collapse', () => {
    it('should have a collapse button', () => {
      renderWithRouter();

      const collapseButton = screen.getByRole('button', {
        name: /collapse sidebar|expand sidebar/i,
      });
      expect(collapseButton).toBeInTheDocument();
    });

    it('should toggle sidebar visibility', async () => {
      renderWithRouter();

      const collapseButton = screen.getByRole('button', { name: /collapse sidebar/i });
      await user.click(collapseButton);

      // After collapse, the expand button should appear
      await waitFor(() => {
        const expandButton = screen.getByRole('button', { name: /expand sidebar/i });
        expect(expandButton).toBeInTheDocument();
      });
    });
  });

  // =========================================================================
  // Accessibility Tests
  // =========================================================================

  describe('Navigation Accessibility', () => {
    it('should have navigation landmark', () => {
      renderWithRouter();

      const navElements = document.querySelectorAll('nav');
      expect(navElements.length).toBeGreaterThan(0);
    });

    it('should have main content area', () => {
      renderWithRouter();

      const main = document.querySelector('main');
      expect(main).toBeInTheDocument();
    });

    it('should support keyboard navigation', async () => {
      renderWithRouter();

      // Tab through elements
      await user.tab();

      // Should have an active element
      expect(document.activeElement).not.toBe(document.body);
    });
  });

  // =========================================================================
  // Performance Tests
  // =========================================================================

  describe('Navigation Performance', () => {
    it('should navigate within reasonable time', async () => {
      renderWithRouter();

      const start = performance.now();

      const architectureLink = screen.getByText(/Architecture Designer/i);
      await user.click(architectureLink);

      await waitFor(() => {
        expect(screen.getByTestId('cloud-page')).toBeInTheDocument();
      });

      const end = performance.now();
      expect(end - start).toBeLessThan(2000); // Should complete in under 2 seconds
    });

    it('should handle multiple navigations without issues', async () => {
      renderWithRouter();

      // Navigate multiple times (reduced to 3 to speed up tests)
      for (let i = 0; i < 3; i++) {
        const architectureLink = screen.getByText(/Architecture Designer/i);
        await user.click(architectureLink);

        await waitFor(() => {
          expect(screen.getByTestId('cloud-page')).toBeInTheDocument();
        });

        const homeLinks = screen.getAllByText(/Home/i);
        await user.click(homeLinks[0]);

        await waitFor(() => {
          expect(screen.getByTestId('home-page')).toBeInTheDocument();
        });
      }

      // Should still be functional
      expect(screen.getByTestId('home-page')).toBeInTheDocument();
    });
  });
});
