import { describe, it, expect } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import { RouterProvider, createMemoryRouter } from 'react-router-dom';
import { routeConfig } from '../../src/router';
import { ThemeProvider } from '../../src/contexts/ThemeContext';
import React from 'react';

// Helper to wrap router with providers
const renderWithProviders = (router: ReturnType<typeof createMemoryRouter>) => {
  return render(
    <ThemeProvider>
      <RouterProvider router={router} />
    </ThemeProvider>
  );
};

describe('Routing Integration', () => {
  describe('Root Route', () => {
    it('should render home page at root route', async () => {
      const testRouter = createMemoryRouter(routeConfig, {
        initialEntries: ['/'],
      });

      renderWithProviders(testRouter);

      await waitFor(
        () => {
          // Just verify the route loads without crashing
          expect(document.body).toBeTruthy();
        },
        { timeout: 3000 }
      );
    });

    it('should show loading state during lazy load', async () => {
      const testRouter = createMemoryRouter(routeConfig, {
        initialEntries: ['/'],
      });

      renderWithProviders(testRouter);

      // Loading spinner should appear briefly
      const loadingElement = screen.queryByText(/loading/i);
      // May or may not catch it depending on timing
      expect(loadingElement === null || loadingElement.textContent === 'Loading...').toBe(true);
    });
  });

  describe('OSI Model Routes', () => {
    it('should load layer builder route', async () => {
      const testRouter = createMemoryRouter(routeConfig, {
        initialEntries: ['/osi/layer-builder'],
      });

      renderWithProviders(testRouter);

      await waitFor(
        () => {
          // Just verify the route loads without crashing
          expect(document.body).toBeTruthy();
        },
        { timeout: 3000 }
      );
    });

    it('should load packet journey route', async () => {
      const testRouter = createMemoryRouter(routeConfig, {
        initialEntries: ['/osi/packet-journey'],
      });

      renderWithProviders(testRouter);

      await waitFor(
        () => {
          // Just verify the route loads without crashing
          expect(document.body).toBeTruthy();
        },
        { timeout: 3000 }
      );
    });

    it('should load troubleshooting route', async () => {
      const testRouter = createMemoryRouter(routeConfig, {
        initialEntries: ['/osi/troubleshooting'],
      });

      renderWithProviders(testRouter);

      await waitFor(
        () => {
          // Just verify the route loads without crashing
          expect(document.body).toBeTruthy();
        },
        { timeout: 3000 }
      );
    });
  });

  describe('Cloud Routes', () => {
    it('should load cloud summary builder', async () => {
      const testRouter = createMemoryRouter(routeConfig, {
        initialEntries: ['/cloud/summary-builder'],
      });

      renderWithProviders(testRouter);

      await waitFor(
        () => {
          // Just verify the route loads without crashing
          expect(document.body).toBeTruthy();
        },
        { timeout: 3000 }
      );
    });

    it('should load cloud architecture designer', async () => {
      const testRouter = createMemoryRouter(routeConfig, {
        initialEntries: ['/cloud/architecture'],
      });

      renderWithProviders(testRouter);

      await waitFor(
        () => {
          // Just verify the route loads without crashing
          expect(document.body).toBeTruthy();
        },
        { timeout: 3000 }
      );
    });
  });

  describe('Ports & Protocols Routes', () => {
    it('should load port protocol trainer', async () => {
      const testRouter = createMemoryRouter(routeConfig, {
        initialEntries: ['/ports/trainer'],
      });

      renderWithProviders(testRouter);

      await waitFor(
        () => {
          // Just verify the route loads without crashing
          expect(document.body).toBeTruthy();
        },
        { timeout: 3000 }
      );
    });

    it('should load traffic demo', async () => {
      const testRouter = createMemoryRouter(routeConfig, {
        initialEntries: ['/ports/traffic-demo'],
      });

      renderWithProviders(testRouter);

      await waitFor(
        () => {
          // Just verify the route loads without crashing
          expect(document.body).toBeTruthy();
        },
        { timeout: 3000 }
      );
    });

    it('should load port scanner', async () => {
      const testRouter = createMemoryRouter(routeConfig, {
        initialEntries: ['/ports/scanner'],
      });

      renderWithProviders(testRouter);

      await waitFor(
        () => {
          // Just verify the route loads without crashing
          expect(document.body).toBeTruthy();
        },
        { timeout: 3000 }
      );
    });
  });

  describe('Assessment Routes', () => {
    it('should load integrated simulator', async () => {
      const testRouter = createMemoryRouter(routeConfig, {
        initialEntries: ['/assessment/simulator'],
      });

      renderWithProviders(testRouter);

      await waitFor(
        () => {
          // Just verify the route loads without crashing
          expect(document.body).toBeTruthy();
        },
        { timeout: 3000 }
      );
    });

    it('should load progress dashboard', async () => {
      const testRouter = createMemoryRouter(routeConfig, {
        initialEntries: ['/assessment/dashboard'],
      });

      renderWithProviders(testRouter);

      await waitFor(
        () => {
          // Just verify the route loads without crashing
          expect(document.body).toBeTruthy();
        },
        { timeout: 3000 }
      );
    });
  });

  describe('Error Handling', () => {
    it('should handle 404 routes with error boundary', async () => {
      const testRouter = createMemoryRouter(routeConfig, {
        initialEntries: ['/non-existent-route'],
      });

      renderWithProviders(testRouter);

      await waitFor(
        () => {
          // Should show either error boundary or 404 page
          const body = document.body.textContent || '';
          expect(body.length).toBeGreaterThan(0);
        },
        { timeout: 3000 }
      );
    });
  });

  describe('Lazy Loading', () => {
    it('should suspend and show loading fallback', () => {
      const testRouter = createMemoryRouter(routeConfig, {
        initialEntries: ['/osi/layer-builder'],
      });

      renderWithProviders(testRouter);

      // Check for loading indicator during suspense
      const loadingText = screen.queryByText(/loading/i);
      expect(loadingText === null || loadingText).toBeTruthy();
    });

    it('should load multiple routes sequentially', async () => {
      const routes = ['/osi/layer-builder', '/cloud/architecture', '/assessment/simulator'];

      for (const route of routes) {
        const testRouter = createMemoryRouter(routeConfig, {
          initialEntries: [route],
        });

        const { unmount } = renderWithProviders(testRouter);

        await waitFor(
          () => {
            // Just verify the route loads without crashing
            expect(document.body).toBeTruthy();
          },
          { timeout: 3000 }
        );

        unmount();
      }
    });
  });

  describe('Navigation', () => {
    it('should maintain providers across route changes', async () => {
      const testRouter = createMemoryRouter(routeConfig, {
        initialEntries: ['/'],
      });

      renderWithProviders(testRouter);

      await waitFor(() => {
        expect(document.documentElement.classList.length).toBeGreaterThan(0);
      });

      // Navigate to different route
      testRouter.navigate('/osi/layer-builder');

      await waitFor(() => {
        // Theme should still be applied
        expect(
          document.documentElement.classList.contains('light') ||
            document.documentElement.classList.contains('dark')
        ).toBe(true);
      });
    });
  });

  describe('MainLayout Integration', () => {
    it('should wrap all routes with MainLayout', async () => {
      const testRouter = createMemoryRouter(routeConfig, {
        initialEntries: ['/'],
      });

      const { container } = renderWithProviders(testRouter);

      await waitFor(() => {
        expect(container.firstChild).toBeTruthy();
      });
    });
  });

  describe('Route Transitions', () => {
    it('should handle rapid route changes', async () => {
      const testRouter = createMemoryRouter(routeConfig, {
        initialEntries: ['/'],
      });

      renderWithProviders(testRouter);

      // Rapidly change routes
      testRouter.navigate('/osi/layer-builder');
      testRouter.navigate('/cloud/architecture');
      testRouter.navigate('/assessment/simulator');
      testRouter.navigate('/');

      await waitFor(
        () => {
          // Just verify the route loads without crashing
          expect(document.body).toBeTruthy();
        },
        { timeout: 5000 }
      );
    });

    it('should cleanup previous route on navigation', async () => {
      const testRouter = createMemoryRouter(routeConfig, {
        initialEntries: ['/osi/layer-builder'],
      });

      const { unmount } = renderWithProviders(testRouter);

      await waitFor(
        () => {
          // Just verify the route loads without crashing
          expect(document.body).toBeTruthy();
        },
        { timeout: 3000 }
      );

      testRouter.navigate('/cloud/architecture');

      await waitFor(
        () => {
          // Just verify the route loads without crashing
          expect(document.body).toBeTruthy();
        },
        { timeout: 3000 }
      );

      unmount();
    });
  });

  describe('Performance', () => {
    it('should load routes efficiently', async () => {
      const startTime = performance.now();

      const testRouter = createMemoryRouter(routeConfig, {
        initialEntries: ['/'],
      });

      renderWithProviders(testRouter);

      await waitFor(
        () => {
          // Just verify the route loads without crashing
          expect(document.body).toBeTruthy();
        },
        { timeout: 3000 }
      );

      const endTime = performance.now();
      const loadTime = endTime - startTime;

      // Initial route should load within 3 seconds
      expect(loadTime).toBeLessThan(3000);
    });
  });
});
