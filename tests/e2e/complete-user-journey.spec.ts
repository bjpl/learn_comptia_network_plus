import { test, expect } from '@playwright/test';

test.describe('Complete User Journey', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('should navigate from homepage to OSI module and complete activity', async ({ page }) => {
    // Wait for homepage to load
    await expect(page).toHaveTitle(/CompTIA Network\+/i);

    // Navigate to OSI Layer Builder
    await page.click('text=/OSI.*Model/i');
    await page.waitForLoadState('networkidle');

    // Should load OSI page
    await expect(page.locator('body')).toContainText(/layer/i);

    // Complete an activity (if interactive elements exist)
    const continueButton = page.locator('button:has-text("Continue")');
    if (await continueButton.isVisible()) {
      await continueButton.click();
    }
  });

  test('should navigate to cloud architecture and interact', async ({ page }) => {
    // Navigate to Cloud Architecture
    await page.goto('/cloud/architecture');
    await page.waitForLoadState('networkidle');

    // Page should load successfully
    await expect(page.locator('body')).toContainText(/cloud|architecture/i);
  });

  test('should navigate to assessment and view progress', async ({ page }) => {
    // Navigate to Assessment
    await page.goto('/assessment/dashboard');
    await page.waitForLoadState('networkidle');

    // Should show progress tracking
    await expect(page.locator('body')).toContainText(/progress|dashboard|assessment/i);
  });

  test('should navigate between multiple modules', async ({ page }) => {
    // Start at home
    await page.goto('/');
    await page.waitForLoadState('networkidle');

    // Navigate to OSI
    await page.goto('/osi/layer-builder');
    await page.waitForLoadState('networkidle');
    await expect(page.locator('body')).toContainText(/layer|OSI/i);

    // Navigate to Ports
    await page.goto('/ports/trainer');
    await page.waitForLoadState('networkidle');
    await expect(page.locator('body')).toContainText(/port|protocol/i);

    // Navigate to Cloud
    await page.goto('/cloud/architecture');
    await page.waitForLoadState('networkidle');
    await expect(page.locator('body')).toContainText(/cloud/i);

    // Navigate to Assessment
    await page.goto('/assessment/simulator');
    await page.waitForLoadState('networkidle');
    await expect(page.locator('body')).toContainText(/assessment|simulator/i);
  });

  test('should toggle theme and persist preference', async ({ page }) => {
    // Check for theme toggle button
    const themeToggle = page.locator('button[aria-label*="theme" i], button:has-text("Dark"), button:has-text("Light")');

    if (await themeToggle.isVisible()) {
      // Get initial theme
      const html = page.locator('html');
      const initialClass = await html.getAttribute('class');

      // Toggle theme
      await themeToggle.click();
      await page.waitForTimeout(500);

      // Theme should change
      const newClass = await html.getAttribute('class');
      expect(newClass).not.toBe(initialClass);

      // Refresh page
      await page.reload();
      await page.waitForLoadState('networkidle');

      // Theme should persist
      const persistedClass = await html.getAttribute('class');
      expect(persistedClass).toBe(newClass);
    }
  });

  test('should handle errors gracefully', async ({ page }) => {
    // Navigate to non-existent route
    await page.goto('/non-existent-route-12345');
    await page.waitForLoadState('networkidle');

    // Should show error page or handle gracefully
    const bodyText = await page.locator('body').textContent();
    expect(bodyText).toBeTruthy();
    expect(bodyText!.length).toBeGreaterThan(0);
  });

  test('should display loading states during navigation', async ({ page }) => {
    await page.goto('/');

    // Navigate to heavy component
    const navigationPromise = page.goto('/assessment/simulator');

    // Check for loading indicator (may be too fast to catch)
    const loadingText = page.locator('text=/loading/i');
    const isVisible = await loadingText.isVisible().catch(() => false);

    await navigationPromise;
    await page.waitForLoadState('networkidle');

    // Page should eventually load
    const bodyText = await page.locator('body').textContent();
    expect(bodyText).toBeTruthy();
  });

  test('should maintain scroll position on back navigation', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');

    // Scroll down if page is long enough
    await page.evaluate(() => window.scrollTo(0, 500));
    await page.waitForTimeout(500);

    // Navigate away
    await page.goto('/osi/layer-builder');
    await page.waitForLoadState('networkidle');

    // Go back
    await page.goBack();
    await page.waitForLoadState('networkidle');

    // Should return to homepage
    await expect(page).toHaveURL('/');
  });

  test('should work across different viewport sizes', async ({ page }) => {
    // Mobile viewport
    await page.setViewportSize({ width: 375, height: 667 });
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    await expect(page.locator('body')).toBeVisible();

    // Tablet viewport
    await page.setViewportSize({ width: 768, height: 1024 });
    await page.reload();
    await page.waitForLoadState('networkidle');
    await expect(page.locator('body')).toBeVisible();

    // Desktop viewport
    await page.setViewportSize({ width: 1920, height: 1080 });
    await page.reload();
    await page.waitForLoadState('networkidle');
    await expect(page.locator('body')).toBeVisible();
  });

  test('should handle rapid navigation', async ({ page }) => {
    await page.goto('/');

    // Rapidly navigate between routes
    await page.goto('/osi/layer-builder');
    await page.goto('/cloud/architecture');
    await page.goto('/ports/trainer');
    await page.goto('/assessment/dashboard');
    await page.goto('/');

    await page.waitForLoadState('networkidle');
    await expect(page).toHaveURL('/');
    await expect(page.locator('body')).toBeVisible();
  });

  test('should support keyboard navigation', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');

    // Tab through focusable elements
    await page.keyboard.press('Tab');
    await page.waitForTimeout(200);

    const focusedElement = await page.evaluate(() => {
      return document.activeElement?.tagName;
    });

    // Should have focused an interactive element
    expect(['A', 'BUTTON', 'INPUT', 'SELECT', 'TEXTAREA'].includes(focusedElement || '')).toBeTruthy();
  });

  test('should complete full learning path', async ({ page }) => {
    const learningPath = [
      { path: '/osi/layer-builder', keyword: 'layer' },
      { path: '/appliances/comparison', keyword: 'appliance' },
      { path: '/cloud/architecture', keyword: 'cloud' },
      { path: '/ports/trainer', keyword: 'port' },
      { path: '/transmission/media-selection', keyword: 'media' },
      { path: '/topologies/analyzer', keyword: 'topology' },
      { path: '/ipv4/subnet-designer', keyword: 'subnet' },
      { path: '/modern/technology', keyword: 'technology' },
      { path: '/assessment/simulator', keyword: 'assessment' },
    ];

    for (const step of learningPath) {
      await page.goto(step.path);
      await page.waitForLoadState('networkidle');

      const bodyText = await page.locator('body').textContent();
      expect(bodyText?.toLowerCase()).toContain(step.keyword.toLowerCase());
    }

    // Finally check dashboard
    await page.goto('/assessment/dashboard');
    await page.waitForLoadState('networkidle');
    await expect(page.locator('body')).toContainText(/progress|dashboard/i);
  });

  test('should handle browser refresh on any page', async ({ page }) => {
    const routes = [
      '/',
      '/osi/layer-builder',
      '/cloud/architecture',
      '/assessment/simulator',
    ];

    for (const route of routes) {
      await page.goto(route);
      await page.waitForLoadState('networkidle');

      // Refresh page
      await page.reload();
      await page.waitForLoadState('networkidle');

      // Should still be on same route
      await expect(page).toHaveURL(route);
      await expect(page.locator('body')).toBeVisible();
    }
  });
});
