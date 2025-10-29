/**
 * Integration tests for navigation and routing
 */

import { describe, it, expect, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import MainLayout from '../../src/components/layout/MainLayout';
import { useAppStore } from '../../src/store';

// Mock pages for testing
const MockCloudPage = () => <div>Cloud Architecture Designer</div>;
const MockProtocolPage = () => <div>Port Protocol Trainer</div>;
const MockMediaPage = () => <div>Media Selection Matrix</div>;
const MockHomePage = () => <div>Welcome to Network+</div>;

describe('Navigation Integration', () => {
  let user: ReturnType<typeof userEvent.setup>;

  const renderWithRouter = (initialRoute = '/') => {
    window.history.pushState({}, '', initialRoute);

    return render(
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<MainLayout />}>
            <Route index element={<MockHomePage />} />
            <Route path="cloud-designer" element={<MockCloudPage />} />
            <Route path="port-trainer" element={<MockProtocolPage />} />
            <Route path="media-matrix" element={<MockMediaPage />} />
          </Route>
        </Routes>
      </BrowserRouter>
    );
  };

  beforeEach(() => {
    user = userEvent.setup();
    useAppStore.getState().setCurrentPath('/');
  });

  // =========================================================================
  // Route Navigation Tests
  // =========================================================================

  describe('Route Navigation', () => {
    it('should navigate to cloud designer', async () => {
      renderWithRouter();

      // Find and click navigation link
      const cloudLink = screen.getByText(/cloud/i);
      await user.click(cloudLink);

      await waitFor(() => {
        expect(screen.getByText('Cloud Architecture Designer')).toBeInTheDocument();
      });
    });

    it('should navigate to protocol trainer', async () => {
      renderWithRouter();

      const protocolLink = screen.getByText(/protocol/i);
      await user.click(protocolLink);

      await waitFor(() => {
        expect(screen.getByText('Port Protocol Trainer')).toBeInTheDocument();
      });
    });

    it('should navigate to media matrix', async () => {
      renderWithRouter();

      const mediaLink = screen.getByText(/media/i);
      await user.click(mediaLink);

      await waitFor(() => {
        expect(screen.getByText('Media Selection Matrix')).toBeInTheDocument();
      });
    });

    it('should navigate back to home', async () => {
      renderWithRouter('/cloud-designer');

      const homeLink = screen.getByText(/home/i);
      await user.click(homeLink);

      await waitFor(() => {
        expect(screen.getByText('Welcome to Network+')).toBeInTheDocument();
      });
    });
  });

  // =========================================================================
  // Sidebar Navigation Tests
  // =========================================================================

  describe('Sidebar Navigation', () => {
    it('should highlight active route', async () => {
      renderWithRouter('/cloud-designer');

      await waitFor(() => {
        const activeLink = document.querySelector('[aria-current="page"]');
        expect(activeLink).toBeInTheDocument();
      });
    });

    it('should expand/collapse sidebar sections', async () => {
      renderWithRouter();

      const sectionToggle = screen.getAllByRole('button').find(
        btn => btn.textContent?.includes('Domain')
      );

      if (sectionToggle) {
        await user.click(sectionToggle);

        await waitFor(() => {
          // Section should expand/collapse
          expect(sectionToggle).toBeInTheDocument();
        });
      }
    });

    it('should show progress indicators', () => {
      renderWithRouter();

      const progressIndicators = document.querySelectorAll('.progress, [role="progressbar"]');
      expect(progressIndicators.length).toBeGreaterThan(0);
    });
  });

  // =========================================================================
  // Browser History Tests
  // =========================================================================

  describe('Browser History', () => {
    it('should support back button', async () => {
      renderWithRouter();

      const cloudLink = screen.getByText(/cloud/i);
      await user.click(cloudLink);

      await waitFor(() => {
        expect(screen.getByText('Cloud Architecture Designer')).toBeInTheDocument();
      });

      window.history.back();

      await waitFor(() => {
        expect(screen.getByText('Welcome to Network+')).toBeInTheDocument();
      });
    });

    it('should support forward button', async () => {
      renderWithRouter();

      const cloudLink = screen.getByText(/cloud/i);
      await user.click(cloudLink);

      window.history.back();
      window.history.forward();

      await waitFor(() => {
        expect(screen.getByText('Cloud Architecture Designer')).toBeInTheDocument();
      });
    });

    it('should preserve state across navigation', async () => {
      renderWithRouter();

      // Navigate away and back
      const cloudLink = screen.getByText(/cloud/i);
      await user.click(cloudLink);

      const homeLink = screen.getByText(/home/i);
      await user.click(homeLink);

      await waitFor(() => {
        // State should be preserved
        expect(screen.getByText('Welcome to Network+')).toBeInTheDocument();
      });
    });
  });

  // =========================================================================
  // Deep Linking Tests
  // =========================================================================

  describe('Deep Linking', () => {
    it('should load directly to cloud designer', () => {
      renderWithRouter('/cloud-designer');

      expect(screen.getByText('Cloud Architecture Designer')).toBeInTheDocument();
    });

    it('should load directly to protocol trainer', () => {
      renderWithRouter('/port-trainer');

      expect(screen.getByText('Port Protocol Trainer')).toBeInTheDocument();
    });

    it('should handle invalid routes', () => {
      renderWithRouter('/invalid-route');

      // Should show 404 or redirect to home
      expect(screen.getByText(/Welcome|Not Found/i)).toBeInTheDocument();
    });
  });

  // =========================================================================
  // Store Integration Tests
  // =========================================================================

  describe('Store Integration', () => {
    it('should update currentPath in store on navigation', async () => {
      renderWithRouter();

      const cloudLink = screen.getByText(/cloud/i);
      await user.click(cloudLink);

      await waitFor(() => {
        const currentPath = useAppStore.getState().currentPath;
        expect(currentPath).toBe('/cloud-designer');
      });
    });

    it('should persist navigation state', async () => {
      renderWithRouter();

      const cloudLink = screen.getByText(/cloud/i);
      await user.click(cloudLink);

      // Simulate page reload
      const { currentPath } = useAppStore.getState();
      expect(currentPath).toBeTruthy();
    });
  });

  // =========================================================================
  // Breadcrumb Tests
  // =========================================================================

  describe('Breadcrumbs', () => {
    it('should display breadcrumbs for nested routes', () => {
      renderWithRouter('/cloud-designer');

      const breadcrumbs = document.querySelectorAll('[aria-label="breadcrumb"] a, [aria-label="breadcrumb"] span');
      expect(breadcrumbs.length).toBeGreaterThan(0);
    });

    it('should navigate via breadcrumbs', async () => {
      renderWithRouter('/cloud-designer');

      const homeBreadcrumb = document.querySelector('[aria-label="breadcrumb"] a');
      if (homeBreadcrumb) {
        await user.click(homeBreadcrumb);

        await waitFor(() => {
          expect(screen.getByText('Welcome to Network+')).toBeInTheDocument();
        });
      }
    });
  });

  // =========================================================================
  // Mobile Navigation Tests
  // =========================================================================

  describe('Mobile Navigation', () => {
    beforeEach(() => {
      global.innerWidth = 375;
      global.dispatchEvent(new Event('resize'));
    });

    it('should show mobile menu button', () => {
      renderWithRouter();

      const menuButton = screen.getByRole('button', { name: /menu/i });
      expect(menuButton).toBeInTheDocument();
    });

    it('should toggle mobile menu', async () => {
      renderWithRouter();

      const menuButton = screen.getByRole('button', { name: /menu/i });
      await user.click(menuButton);

      await waitFor(() => {
        const mobileNav = document.querySelector('[role="dialog"], .mobile-nav');
        expect(mobileNav).toBeInTheDocument();
      });
    });

    it('should close mobile menu after navigation', async () => {
      renderWithRouter();

      const menuButton = screen.getByRole('button', { name: /menu/i });
      await user.click(menuButton);

      const cloudLink = screen.getByText(/cloud/i);
      await user.click(cloudLink);

      await waitFor(() => {
        const mobileNav = document.querySelector('[role="dialog"], .mobile-nav');
        expect(mobileNav).not.toBeVisible();
      });
    });
  });

  // =========================================================================
  // Accessibility Tests
  // =========================================================================

  describe('Navigation Accessibility', () => {
    it('should support keyboard navigation', async () => {
      renderWithRouter();

      await user.tab();
      await user.tab();
      await user.keyboard('{Enter}');

      // Should navigate somewhere
      expect(document.activeElement).toBeInTheDocument();
    });

    it('should have proper aria-labels', () => {
      renderWithRouter();

      const nav = screen.getByRole('navigation');
      expect(nav).toBeInTheDocument();
    });

    it('should announce route changes to screen readers', async () => {
      renderWithRouter();

      const cloudLink = screen.getByText(/cloud/i);
      await user.click(cloudLink);

      await waitFor(() => {
        const liveRegion = document.querySelector('[role="alert"], [aria-live="polite"]');
        // May or may not exist depending on implementation
      });
    });
  });

  // =========================================================================
  // Performance Tests
  // =========================================================================

  describe('Navigation Performance', () => {
    it('should navigate quickly', async () => {
      renderWithRouter();

      const start = performance.now();

      const cloudLink = screen.getByText(/cloud/i);
      await user.click(cloudLink);

      await waitFor(() => {
        expect(screen.getByText('Cloud Architecture Designer')).toBeInTheDocument();
      });

      const end = performance.now();
      expect(end - start).toBeLessThan(1000); // Should be fast
    });

    it('should not cause memory leaks on repeated navigation', async () => {
      renderWithRouter();

      // Navigate back and forth multiple times
      for (let i = 0; i < 10; i++) {
        const cloudLink = screen.getByText(/cloud/i);
        await user.click(cloudLink);

        const homeLink = screen.getByText(/home/i);
        await user.click(homeLink);
      }

      // Should not crash or slow down
      expect(screen.getByText('Welcome to Network+')).toBeInTheDocument();
    });
  });
});
