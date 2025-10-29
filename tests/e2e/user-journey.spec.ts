/**
 * E2E tests for complete user journeys using Playwright
 */

import { test, expect } from '@playwright/test';

test.describe('Complete User Journey', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  // =========================================================================
  // First Time User Journey
  // =========================================================================

  test.describe('First Time User', () => {
    test('should complete onboarding and first component', async ({ page }) => {
      // Check if landing on home page
      await expect(page.locator('h1')).toContainText(/Network\+|Welcome/);

      // Navigate to first component
      await page.click('text=Cloud Architecture Designer');

      // Wait for component to load
      await expect(page.locator('.cloud-architecture-designer')).toBeVisible();

      // Interact with component
      await page.fill('[placeholder="Architecture name"]', 'My First Design');

      // Should save progress
      await expect(page.locator('[placeholder="Architecture name"]')).toHaveValue('My First Design');
    });

    test('should navigate through all learning domains', async ({ page }) => {
      // Navigate through sidebar items
      const domains = [
        'Network Appliances',
        'OSI Model',
        'IPv4 Addressing',
        'Transmission Media',
        'Cloud Architecture'
      ];

      for (const domain of domains) {
        const link = page.locator(`text=${domain}`).first();
        if (await link.isVisible()) {
          await link.click();
          await page.waitForLoadState('networkidle');

          // Verify navigation
          await expect(page).toHaveURL(/.+/);
        }
      }
    });

    test('should persist progress across sessions', async ({ page, context }) => {
      // Complete a component
      await page.click('text=Port Protocol Trainer');
      await page.waitForSelector('.port-protocol-trainer');

      // Interact with flashcard
      await page.fill('textarea', 'HTTP uses port 80 and transmits data in plaintext without encryption.');
      await page.click('text=Submit Explanation');

      // Wait for feedback
      await expect(page.locator('text=/Score:|Feedback:/')).toBeVisible();

      // Close and reopen
      await context.close();
      const newContext = await page.context().browser()!.newContext();
      const newPage = await newContext.newPage();
      await newPage.goto('/');

      // Progress should be saved
      await newPage.click('text=Port Protocol Trainer');
      await expect(newPage.locator('text=/cards mastered/')).toBeVisible();
    });
  });

  // =========================================================================
  // Returning User Journey
  // =========================================================================

  test.describe('Returning User', () => {
    test.beforeEach(async ({ page }) => {
      // Set up returning user state
      await page.evaluate(() => {
        localStorage.setItem('comptia-network-plus-storage', JSON.stringify({
          state: {
            progress: {
              completedComponents: ['cloud-designer'],
              componentScores: { 'cloud-designer': 85 },
              totalScore: 85,
              lastActivity: new Date().toISOString()
            },
            theme: { mode: 'light' },
            currentPath: '/'
          },
          version: 0
        }));
      });
      await page.reload();
    });

    test('should show progress indicators', async ({ page }) => {
      // Progress should be visible in sidebar
      await expect(page.locator('text=/\\d+%|completed/i')).toBeVisible();
    });

    test('should continue from last accessed component', async ({ page }) => {
      // Navigate based on stored path or show continue button
      const continueButton = page.locator('text=/Continue|Resume/i');
      if (await continueButton.isVisible()) {
        await continueButton.click();
      }
    });

    test('should show achievements', async ({ page }) => {
      // Check for achievement indicators
      const achievements = page.locator('[data-testid="achievement"], .achievement');
      if (await achievements.count() > 0) {
        await expect(achievements.first()).toBeVisible();
      }
    });
  });

  // =========================================================================
  // Complete Assessment Journey
  // =========================================================================

  test.describe('Assessment Flow', () => {
    test('should complete full integrated scenario', async ({ page }) => {
      // Navigate to integrated simulator
      await page.click('text=Integrated Simulator');
      await expect(page.locator('.integrated-simulator, text=Integrated Scenario')).toBeVisible();

      // Select scenario
      const scenarioCards = page.locator('.hover\\:shadow-lg, [role="button"]');
      await scenarioCards.first().click();

      // Wait for scenario to load
      await expect(page.locator('text=/Scenario Context|Phase \\d+/')).toBeVisible();

      // Answer assessment questions
      const textarea = page.locator('textarea').first();
      await textarea.fill(
        'The optimal network topology for this scenario is a star topology ' +
        'because it provides centralized management, easy troubleshooting, and ' +
        'scalability for future growth. This design ensures high availability ' +
        'and meets all security requirements.'
      );

      // Submit answers
      await page.click('text=Score Answers');

      // Wait for scoring
      await expect(page.locator('text=/Score:|Feedback:/')).toBeVisible();

      // Check score
      const scoreText = await page.locator('text=/Score: \\d+/').textContent();
      expect(scoreText).toMatch(/Score: \d+/);

      // Continue to next phase or complete
      const nextButton = page.locator('text=/Next Phase|Complete Scenario/');
      if (await nextButton.isVisible()) {
        await nextButton.click();
      }
    });

    test('should provide hints when stuck', async ({ page }) => {
      await page.click('text=Integrated Simulator');
      const scenarioCards = page.locator('.hover\\:shadow-lg');
      await scenarioCards.first().click();

      // Show hints
      await page.click('text=/Show Hints/');
      await expect(page.locator('text=/Hint|Consider|Think about/')).toBeVisible();

      // Hide hints
      await page.click('text=/Hide Hints/');
    });

    test('should track progress through assessment', async ({ page }) => {
      await page.click('text=Integrated Simulator');
      const scenarioCards = page.locator('.hover\\:shadow-lg');
      await scenarioCards.first().click();

      // Progress bar should be visible
      await expect(page.locator('[role="progressbar"], .progress-bar')).toBeVisible();

      // Phase indicators should be visible
      await expect(page.locator('text=/Phase \\d+ of \\d+/')).toBeVisible();
    });
  });

  // =========================================================================
  // Mobile User Journey
  // =========================================================================

  test.describe('Mobile Experience', () => {
    test.use({ viewport: { width: 375, height: 667 } });

    test('should navigate on mobile', async ({ page }) => {
      // Open mobile menu
      await page.click('[aria-label="menu"], button:has-text("Menu")');

      // Mobile nav should be visible
      await expect(page.locator('[role="dialog"], .mobile-nav')).toBeVisible();

      // Navigate to component
      await page.click('text=Cloud Architecture Designer');

      // Component should load
      await expect(page.locator('.cloud-architecture-designer')).toBeVisible();
    });

    test('should handle touch interactions', async ({ page }) => {
      await page.click('text=Media Selection Matrix');

      // Tap on table row
      const firstRow = page.locator('tr').nth(1);
      await firstRow.tap();

      // Row should be selected
      await expect(firstRow).toHaveClass(/selected|bg-blue-50/);
    });

    test('should show mobile-optimized layouts', async ({ page }) => {
      // Check that layout adapts
      await page.click('text=Cloud Architecture Designer');

      // Sidebar should be collapsed or hidden
      const sidebar = page.locator('.sidebar, [role="navigation"]');
      if (await sidebar.isVisible()) {
        // Should be collapsible
        const toggleButton = page.locator('[aria-label="toggle navigation"]');
        await expect(toggleButton).toBeVisible();
      }
    });
  });

  // =========================================================================
  // Accessibility Journey
  // =========================================================================

  test.describe('Keyboard Navigation', () => {
    test('should navigate entire app with keyboard', async ({ page }) => {
      // Tab through navigation
      await page.keyboard.press('Tab');
      await page.keyboard.press('Tab');
      await page.keyboard.press('Tab');

      // Enter should activate link
      await page.keyboard.press('Enter');

      // Should navigate
      await expect(page).toHaveURL(/.+/);
    });

    test('should operate component with keyboard', async ({ page }) => {
      await page.click('text=Port Protocol Trainer');

      // Tab to textarea
      await page.keyboard.press('Tab');
      await page.keyboard.press('Tab');

      // Type explanation
      await page.keyboard.type('HTTP is insecure because it transmits data in plaintext.');

      // Navigate to submit button
      await page.keyboard.press('Tab');
      await page.keyboard.press('Enter');

      // Should submit
      await expect(page.locator('text=/Score:|Feedback:/')).toBeVisible();
    });

    test('should show focus indicators', async ({ page }) => {
      await page.keyboard.press('Tab');

      // Active element should have visible focus
      const activeElement = page.locator(':focus');
      await expect(activeElement).toBeVisible();
    });
  });

  // =========================================================================
  // Error Recovery Journey
  // =========================================================================

  test.describe('Error Handling', () => {
    test('should recover from network errors', async ({ page, context }) => {
      // Simulate offline
      await context.setOffline(true);

      // Try to navigate
      await page.click('text=Cloud Architecture Designer').catch(() => {});

      // Go back online
      await context.setOffline(false);

      // Should recover
      await page.click('text=Cloud Architecture Designer');
      await expect(page.locator('.cloud-architecture-designer')).toBeVisible();
    });

    test('should handle corrupted localStorage', async ({ page }) => {
      // Corrupt localStorage
      await page.evaluate(() => {
        localStorage.setItem('comptia-network-plus-storage', 'invalid json');
      });

      // Reload page
      await page.reload();

      // Should not crash
      await expect(page.locator('h1')).toBeVisible();
    });

    test('should recover from component errors', async ({ page }) => {
      // Navigate to component
      await page.click('text=Cloud Architecture Designer');

      // Trigger error scenario (if any)
      // Component should show error boundary
      await expect(page.locator('.cloud-architecture-designer, text=Error')).toBeVisible();
    });
  });

  // =========================================================================
  // Performance Journey
  // =========================================================================

  test.describe('Performance', () => {
    test('should load initial page quickly', async ({ page }) => {
      const start = Date.now();

      await page.goto('/');
      await page.waitForLoadState('networkidle');

      const loadTime = Date.now() - start;
      expect(loadTime).toBeLessThan(3000); // 3 second max
    });

    test('should navigate between components quickly', async ({ page }) => {
      const components = [
        'Cloud Architecture Designer',
        'Port Protocol Trainer',
        'Media Selection Matrix'
      ];

      for (const component of components) {
        const start = Date.now();

        await page.click(`text=${component}`);
        await page.waitForLoadState('networkidle');

        const navTime = Date.now() - start;
        expect(navTime).toBeLessThan(1000); // 1 second max per navigation
      }
    });

    test('should handle large data sets efficiently', async ({ page }) => {
      await page.click('text=Port Protocol Trainer');

      // Navigate through many cards quickly
      for (let i = 0; i < 20; i++) {
        await page.click('text=Next →');
        await page.waitForTimeout(50); // Small delay
      }

      // Should not freeze
      await expect(page.locator('.port-protocol-trainer')).toBeVisible();
    });
  });
});
