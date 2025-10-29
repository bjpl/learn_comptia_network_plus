/**
 * End-to-End Tests - User Workflows
 * Tests for complete user journeys through the application
 */

import { test, expect } from '@playwright/test';

test.describe('Complete Learning Journey', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('New user registration and first quiz', async ({ page }) => {
    // Navigate to registration
    await page.click('text=Sign Up');

    // Fill registration form
    await page.fill('input[name="email"]', 'newuser@example.com');
    await page.fill('input[name="password"]', 'SecurePass123!');
    await page.fill('input[name="confirmPassword"]', 'SecurePass123!');
    await page.click('button[type="submit"]');

    // Should redirect to dashboard
    await expect(page).toHaveURL(/.*dashboard/);

    // Navigate to first module
    await page.click('text=Module 1');

    // Start first quiz
    await page.click('text=Start Quiz');

    // Answer all questions
    for (let i = 0; i < 10; i++) {
      await page.click('[data-testid="answer-option-0"]');
      await page.click('text=Next');
    }

    // Verify completion
    await expect(page.locator('text=Quiz Complete')).toBeVisible();
    await expect(page.locator('[data-testid="score"]')).toBeVisible();
  });

  test('User login and progress continuation', async ({ page }) => {
    // Login
    await page.click('text=Login');
    await page.fill('input[name="email"]', 'existing@example.com');
    await page.fill('input[name="password"]', 'password123');
    await page.click('button[type="submit"]');

    // Verify dashboard loads
    await expect(page.locator('[data-testid="user-progress"]')).toBeVisible();

    // Continue from last activity
    await page.click('text=Continue Learning');

    // Verify correct module loads
    await expect(page.locator('[data-testid="module-content"]')).toBeVisible();
  });

  test('Complete module workflow', async ({ page }) => {
    // Login
    await page.goto('/login');
    await page.fill('input[name="email"]', 'user@example.com');
    await page.fill('input[name="password"]', 'password');
    await page.click('button[type="submit"]');

    // Select module
    await page.click('[data-testid="module-1"]');

    // Read content
    await page.click('text=Introduction');
    await expect(page.locator('[data-testid="module-content"]')).toBeVisible();

    // Take quiz
    await page.click('text=Take Quiz');

    // Answer questions
    for (let i = 0; i < 5; i++) {
      await page.click('[data-testid="answer-option-0"]');
      await page.click('text=Next');
    }

    // Complete lab exercise
    await page.click('text=Lab Exercise');
    await page.click('[data-testid="device-router"]');
    await page.click('[data-testid="device-switch"]');
    await page.click('text=Submit Lab');

    // Verify module completion
    await expect(page.locator('text=Module Complete')).toBeVisible();
    await expect(page.locator('[data-testid="completion-badge"]')).toBeVisible();
  });
});

test.describe('Interactive Learning Features', () => {
  test('Network topology builder', async ({ page }) => {
    await page.goto('/labs/topology-builder');

    // Add devices
    await page.click('[data-testid="add-router"]');
    await page.click('[data-testid="canvas"]', { position: { x: 100, y: 100 } });

    await page.click('[data-testid="add-switch"]');
    await page.click('[data-testid="canvas"]', { position: { x: 300, y: 100 } });

    // Connect devices
    await page.click('[data-testid="connect-tool"]');
    await page.click('[data-testid="device-0"]');
    await page.click('[data-testid="device-1"]');

    // Select cable type
    await page.selectOption('[data-testid="cable-type"]', 'straight-through');

    // Verify connection
    await expect(page.locator('[data-testid="connection-0"]')).toBeVisible();

    // Check for errors
    await page.click('[data-testid="validate-topology"]');
    await expect(page.locator('[data-testid="validation-result"]')).toContainText('Valid');
  });

  test('Subnet calculator', async ({ page }) => {
    await page.goto('/tools/subnet-calculator');

    // Enter IP address
    await page.fill('[data-testid="ip-input"]', '192.168.1.0');
    await page.fill('[data-testid="mask-input"]', '255.255.255.0');

    // Calculate
    await page.click('[data-testid="calculate-button"]');

    // Verify results
    await expect(page.locator('[data-testid="network-address"]')).toContainText('192.168.1.0');
    await expect(page.locator('[data-testid="broadcast-address"]')).toContainText('192.168.1.255');
    await expect(page.locator('[data-testid="usable-hosts"]')).toContainText('254');
  });

  test('Flash cards study mode', async ({ page }) => {
    await page.goto('/study/flashcards');

    // Start flashcard session
    await page.click('[data-testid="start-session"]');

    // Flip card
    await page.click('[data-testid="flashcard"]');
    await expect(page.locator('[data-testid="card-back"]')).toBeVisible();

    // Rate difficulty
    await page.click('[data-testid="rating-easy"]');

    // Next card
    await expect(page.locator('[data-testid="flashcard"]')).toBeVisible();

    // Complete session
    for (let i = 0; i < 5; i++) {
      await page.click('[data-testid="flashcard"]');
      await page.click('[data-testid="rating-medium"]');
    }

    await expect(page.locator('text=Session Complete')).toBeVisible();
  });
});

test.describe('Progress and Performance', () => {
  test('View progress dashboard', async ({ page }) => {
    await page.goto('/login');
    await page.fill('input[name="email"]', 'user@example.com');
    await page.fill('input[name="password"]', 'password');
    await page.click('button[type="submit"]');

    await page.goto('/dashboard');

    // Verify progress metrics
    await expect(page.locator('[data-testid="overall-progress"]')).toBeVisible();
    await expect(page.locator('[data-testid="modules-completed"]')).toBeVisible();
    await expect(page.locator('[data-testid="quiz-scores"]')).toBeVisible();
    await expect(page.locator('[data-testid="time-spent"]')).toBeVisible();
  });

  test('Review quiz history', async ({ page }) => {
    await page.goto('/dashboard');

    await page.click('text=Quiz History');

    // Verify quiz list
    await expect(page.locator('[data-testid="quiz-history-list"]')).toBeVisible();

    // View quiz details
    await page.click('[data-testid="quiz-0"]');

    // Verify detailed results
    await expect(page.locator('[data-testid="quiz-score"]')).toBeVisible();
    await expect(page.locator('[data-testid="question-breakdown"]')).toBeVisible();
    await expect(page.locator('[data-testid="time-taken"]')).toBeVisible();
  });

  test('Track study streaks', async ({ page }) => {
    await page.goto('/dashboard');

    // Verify streak display
    await expect(page.locator('[data-testid="current-streak"]')).toBeVisible();
    await expect(page.locator('[data-testid="longest-streak"]')).toBeVisible();

    // Check calendar view
    await page.click('[data-testid="streak-calendar"]');
    await expect(page.locator('[data-testid="activity-calendar"]')).toBeVisible();
  });
});

test.describe('Responsive Design', () => {
  test('Mobile navigation', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 });
    await page.goto('/');

    // Open mobile menu
    await page.click('[data-testid="mobile-menu-button"]');
    await expect(page.locator('[data-testid="mobile-menu"]')).toBeVisible();

    // Navigate
    await page.click('text=Modules');
    await expect(page).toHaveURL(/.*modules/);
  });

  test('Tablet layout', async ({ page }) => {
    await page.setViewportSize({ width: 768, height: 1024 });
    await page.goto('/');

    // Verify layout adapts
    await expect(page.locator('[data-testid="main-content"]')).toBeVisible();
    await expect(page.locator('[data-testid="sidebar"]')).toBeVisible();
  });
});

test.describe('Accessibility', () => {
  test('Keyboard navigation', async ({ page }) => {
    await page.goto('/');

    // Tab through elements
    await page.keyboard.press('Tab');
    await page.keyboard.press('Tab');
    await page.keyboard.press('Enter');

    // Verify navigation works
    await expect(page).toHaveURL(/.*modules|login/);
  });

  test('Screen reader support', async ({ page }) => {
    await page.goto('/');

    // Verify ARIA labels
    const button = page.locator('button').first();
    await expect(button).toHaveAttribute('aria-label');
  });
});

test.describe('Performance', () => {
  test('Page load performance', async ({ page }) => {
    const startTime = Date.now();
    await page.goto('/');
    const loadTime = Date.now() - startTime;

    // Page should load in under 3 seconds
    expect(loadTime).toBeLessThan(3000);
  });

  test('Quiz rendering performance', async ({ page }) => {
    await page.goto('/quiz/1');

    const startTime = Date.now();
    await page.click('[data-testid="answer-option-0"]');
    await page.click('text=Next');
    const renderTime = Date.now() - startTime;

    // Should render next question quickly
    expect(renderTime).toBeLessThan(500);
  });
});
