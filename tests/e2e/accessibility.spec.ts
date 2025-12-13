/**
 * E2E accessibility tests using Playwright and axe-core
 * @accessibility
 */

import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

test.describe('Accessibility Tests @accessibility', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  // =========================================================================
  // WCAG 2.1 AA Compliance Tests
  // =========================================================================

  test.describe('WCAG 2.1 AA Compliance', () => {
    test('homepage should have no accessibility violations', async ({ page }) => {
      const accessibilityScanResults = await new AxeBuilder({ page })
        .withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa'])
        .analyze();

      expect(accessibilityScanResults.violations).toEqual([]);
    });

    test('cloud designer should have no accessibility violations', async ({ page }) => {
      await page.click('text=Cloud Architecture Designer');
      await page.waitForLoadState('networkidle');

      const accessibilityScanResults = await new AxeBuilder({ page })
        .withTags(['wcag2a', 'wcag2aa'])
        .analyze();

      expect(accessibilityScanResults.violations).toEqual([]);
    });

    test('protocol trainer should have no accessibility violations', async ({ page }) => {
      await page.click('text=Port Protocol Trainer');
      await page.waitForLoadState('networkidle');

      const accessibilityScanResults = await new AxeBuilder({ page })
        .withTags(['wcag2a', 'wcag2aa'])
        .analyze();

      expect(accessibilityScanResults.violations).toEqual([]);
    });

    test('media matrix should have no accessibility violations', async ({ page }) => {
      await page.click('text=Media Selection Matrix');
      await page.waitForLoadState('networkidle');

      const accessibilityScanResults = await new AxeBuilder({ page })
        .withTags(['wcag2a', 'wcag2aa'])
        .analyze();

      expect(accessibilityScanResults.violations).toEqual([]);
    });

    test('integrated simulator should have no accessibility violations', async ({ page }) => {
      await page.click('text=Integrated Simulator');
      await page.waitForLoadState('networkidle');

      const accessibilityScanResults = await new AxeBuilder({ page })
        .withTags(['wcag2a', 'wcag2aa'])
        .analyze();

      expect(accessibilityScanResults.violations).toEqual([]);
    });
  });

  // =========================================================================
  // Keyboard Navigation Tests
  // =========================================================================

  test.describe('Keyboard Navigation', () => {
    test('should navigate all interactive elements with Tab', async ({ page }) => {
      let tabCount = 0;
      const maxTabs = 50;

      // Tab through page
      for (let i = 0; i < maxTabs; i++) {
        await page.keyboard.press('Tab');
        tabCount++;

        const focusedElement = await page.evaluate(() => {
          const el = document.activeElement;
          return {
            tag: el?.tagName,
            type: el?.getAttribute('type'),
            role: el?.getAttribute('role'),
          };
        });

        // All focusable elements should be interactive
        if (focusedElement.tag) {
          expect(['A', 'BUTTON', 'INPUT', 'SELECT', 'TEXTAREA', 'DIV']).toContain(
            focusedElement.tag
          );
        }
      }

      expect(tabCount).toBeGreaterThan(0);
    });

    test('should show visible focus indicators', async ({ page }) => {
      await page.keyboard.press('Tab');

      const focusedElement = page.locator(':focus');
      await expect(focusedElement).toBeVisible();

      // Check for focus styling
      const outlineWidth = await focusedElement.evaluate((el) => {
        const styles = window.getComputedStyle(el);
        return parseInt(styles.outlineWidth) || parseInt(styles.borderWidth);
      });

      expect(outlineWidth).toBeGreaterThan(0);
    });

    test('should operate dropdowns with keyboard', async ({ page }) => {
      await page.click('text=Port Protocol Trainer');

      // Find and focus select element
      const select = page.locator('select').first();
      await select.focus();

      // Open with Enter or Space
      await page.keyboard.press('Enter');

      // Navigate options with arrow keys
      await page.keyboard.press('ArrowDown');
      await page.keyboard.press('ArrowDown');

      // Select with Enter
      await page.keyboard.press('Enter');

      // Should have selected an option
      const value = await select.inputValue();
      expect(value).toBeTruthy();
    });

    test('should submit forms with Enter key', async ({ page }) => {
      await page.click('text=Port Protocol Trainer');

      const textarea = page.locator('textarea').first();
      await textarea.focus();
      await textarea.fill('Test explanation for accessibility');

      // Tab to submit button
      await page.keyboard.press('Tab');
      await page.keyboard.press('Tab');

      // Submit with Enter
      await page.keyboard.press('Enter');

      // Should show feedback
      await expect(page.locator('text=/Feedback:|Score:/')).toBeVisible();
    });

    test('should escape modals with Esc key', async ({ page }) => {
      // Open modal if present
      const modalTrigger = page.locator('[data-testid="open-modal"], text=/Show|Open/').first();

      if (await modalTrigger.isVisible()) {
        await modalTrigger.click();

        // Press Escape
        await page.keyboard.press('Escape');

        // Modal should close
        const modal = page.locator('[role="dialog"]');
        await expect(modal).not.toBeVisible();
      }
    });
  });

  // =========================================================================
  // Screen Reader Tests
  // =========================================================================

  test.describe('Screen Reader Support', () => {
    test('should have proper heading hierarchy', async ({ page }) => {
      const headings = await page.$$eval('h1, h2, h3, h4, h5, h6', (elements) =>
        elements.map((el) => ({
          level: parseInt(el.tagName[1]),
          text: el.textContent?.trim(),
        }))
      );

      expect(headings.length).toBeGreaterThan(0);

      // Should have exactly one h1
      const h1Count = headings.filter((h) => h.level === 1).length;
      expect(h1Count).toBe(1);

      // Heading levels should not skip
      for (let i = 1; i < headings.length; i++) {
        const prevLevel = headings[i - 1].level;
        const currLevel = headings[i].level;
        const levelDiff = currLevel - prevLevel;

        // Should not skip more than one level
        expect(levelDiff).toBeLessThanOrEqual(1);
      }
    });

    test('should have landmark regions', async ({ page }) => {
      const landmarks = await page.$$eval(
        '[role="main"], [role="navigation"], [role="complementary"], [role="contentinfo"], main, nav, aside, footer',
        (elements) => elements.map((el) => el.getAttribute('role') || el.tagName.toLowerCase())
      );

      expect(landmarks).toContain('main');
      expect(landmarks).toContain('navigation');
    });

    test('should have descriptive link text', async ({ page }) => {
      const links = await page.$$eval('a', (elements) =>
        elements.map((el) => el.textContent?.trim() || '')
      );

      // No "click here" or "read more" without context
      const genericLinks = links.filter((text) => /^(click here|read more|link)$/i.test(text));

      expect(genericLinks.length).toBe(0);
    });

    test('should have alt text for images', async ({ page }) => {
      const images = await page.$$eval('img', (imgs) =>
        imgs.map((img) => ({
          src: img.src,
          alt: img.alt,
          role: img.getAttribute('role'),
        }))
      );

      // All images should have alt text or role="presentation"
      images.forEach((img) => {
        if (img.role !== 'presentation') {
          expect(img.alt).toBeTruthy();
        }
      });
    });

    test('should label form inputs', async ({ page }) => {
      await page.click('text=Cloud Architecture Designer');

      const inputs = await page.$$eval('input, select, textarea', (elements) =>
        elements.map((el) => ({
          type: el.getAttribute('type'),
          id: el.id,
          ariaLabel: el.getAttribute('aria-label'),
          ariaLabelledBy: el.getAttribute('aria-labelledby'),
          hasLabel: !!document.querySelector(`label[for="${el.id}"]`),
        }))
      );

      // All inputs should have labels
      inputs.forEach((input) => {
        const hasAccessibleName = input.ariaLabel || input.ariaLabelledBy || input.hasLabel;
        expect(hasAccessibleName).toBeTruthy();
      });
    });

    test('should announce dynamic content changes', async ({ page }) => {
      await page.click('text=Port Protocol Trainer');

      // Submit form to trigger dynamic content
      const textarea = page.locator('textarea').first();
      await textarea.fill('Test explanation for screen reader announcement');

      await page.click('text=Submit Explanation');

      // Check for ARIA live regions
      const liveRegions = await page.$$('[aria-live], [role="alert"], [role="status"]');
      expect(liveRegions.length).toBeGreaterThan(0);
    });
  });

  // =========================================================================
  // Color Contrast Tests
  // =========================================================================

  test.describe('Color Contrast', () => {
    test('should meet contrast requirements', async ({ page }) => {
      const contrastResults = await new AxeBuilder({ page })
        .withTags(['wcag2aa'])
        .disableRules(['color-contrast']) // We'll check manually
        .analyze();

      // Check for color contrast violations separately
      const colorContrastResults = await new AxeBuilder({ page })
        .include('[class*="text-"], [class*="bg-"]')
        .withRules(['color-contrast'])
        .analyze();

      expect(colorContrastResults.violations.length).toBe(0);
    });

    test('should not rely on color alone', async ({ page }) => {
      await page.click('text=Media Selection Matrix');

      // Check that information is conveyed through multiple means
      const selectedRow = page.locator('tr.selected, tr.bg-blue-50').first();

      if (await selectedRow.isVisible()) {
        // Should have visual indicator beyond color
        const hasIcon = (await selectedRow.locator('svg, .icon').count()) > 0;
        const hasCheckbox = await selectedRow
          .locator('input[type="radio"], input[type="checkbox"]')
          .isChecked();

        expect(hasIcon || hasCheckbox).toBeTruthy();
      }
    });
  });

  // =========================================================================
  // Text Scaling Tests
  // =========================================================================

  test.describe('Text Scaling', () => {
    test('should remain usable at 200% zoom', async ({ page }) => {
      // Set viewport to simulate 200% zoom
      await page.setViewportSize({ width: 640, height: 480 });

      // Navigate to component
      await page.click('text=Cloud Architecture Designer');

      // Content should still be visible and usable
      await expect(page.locator('.cloud-architecture-designer')).toBeVisible();

      // Interactive elements should still be clickable
      const buttons = page.locator('button').first();
      await expect(buttons).toBeVisible();
    });

    test('should not truncate text when zoomed', async ({ page }) => {
      await page.setViewportSize({ width: 640, height: 480 });

      // Check for text overflow
      const overflowElements = await page.$$eval(
        '*',
        (elements) =>
          elements.filter((el) => {
            const styles = window.getComputedStyle(el);
            return styles.overflow === 'hidden' && el.scrollHeight > el.clientHeight;
          }).length
      );

      // Some overflow is acceptable for scrollable containers
      // But text content should not be hidden
      expect(overflowElements).toBeLessThan(5);
    });
  });

  // =========================================================================
  // Focus Management Tests
  // =========================================================================

  test.describe('Focus Management', () => {
    test('should trap focus in modals', async ({ page }) => {
      // Open modal if present
      const modalTrigger = page.locator('[data-testid="open-modal"]').first();

      if (await modalTrigger.isVisible()) {
        await modalTrigger.click();

        const modal = page.locator('[role="dialog"]');
        await expect(modal).toBeVisible();

        // Tab through modal elements
        await page.keyboard.press('Tab');
        await page.keyboard.press('Tab');
        await page.keyboard.press('Tab');

        // Focus should stay within modal
        const focusedElement = page.locator(':focus');
        const isInModal = await focusedElement.evaluate(
          (el, modalSelector) => el.closest(modalSelector) !== null,
          '[role="dialog"]'
        );

        expect(isInModal).toBeTruthy();
      }
    });

    test('should restore focus after modal closes', async ({ page }) => {
      const modalTrigger = page.locator('[data-testid="open-modal"]').first();

      if (await modalTrigger.isVisible()) {
        await modalTrigger.click();
        await page.keyboard.press('Escape');

        // Focus should return to trigger
        const focusedElement = await page.evaluateHandle(() => document.activeElement);
        const isTriggerFocused = await modalTrigger.evaluate(
          (trigger, focused) => trigger === focused,
          focusedElement
        );

        expect(isTriggerFocused).toBeTruthy();
      }
    });

    test('should skip navigation on navigation change', async ({ page }) => {
      await page.click('text=Cloud Architecture Designer');

      // Focus should be on main content or h1
      const focusTarget = await page.evaluate(() => {
        return document.activeElement?.tagName;
      });

      expect(['MAIN', 'H1', 'BODY']).toContain(focusTarget);
    });
  });

  // =========================================================================
  // Motion and Animation Tests
  // =========================================================================

  test.describe('Motion Preferences', () => {
    test('should respect prefers-reduced-motion', async ({ page, context }) => {
      // Enable reduced motion
      await context.addInitScript(() => {
        Object.defineProperty(window, 'matchMedia', {
          writable: true,
          value: (query: string) => ({
            matches: query === '(prefers-reduced-motion: reduce)',
            media: query,
            onchange: null,
            addListener: () => {},
            removeListener: () => {},
            addEventListener: () => {},
            removeEventListener: () => {},
            dispatchEvent: () => true,
          }),
        });
      });

      await page.reload();

      // Check that animations are reduced/disabled
      const animatedElements = await page.$$eval(
        '*',
        (elements) =>
          elements.filter((el) => {
            const styles = window.getComputedStyle(el);
            const duration = parseFloat(styles.animationDuration);
            const transition = parseFloat(styles.transitionDuration);
            return duration > 0 || transition > 0;
          }).length
      );

      // With reduced motion, animated elements should be minimal
      expect(animatedElements).toBeLessThan(10);
    });
  });

  // =========================================================================
  // Mobile Accessibility Tests
  // =========================================================================

  test.describe('Mobile Accessibility', () => {
    test.use({ viewport: { width: 375, height: 667 } });

    test('should have touch-friendly targets', async ({ page }) => {
      await page.click('text=Media Selection Matrix');

      // Check button sizes
      const buttons = await page.$$eval('button, a', (elements) =>
        elements.map((el) => {
          const rect = el.getBoundingClientRect();
          return {
            width: rect.width,
            height: rect.height,
          };
        })
      );

      // Touch targets should be at least 44x44px (WCAG 2.1)
      const smallTargets = buttons.filter((b) => b.width < 44 || b.height < 44);

      // Some small targets acceptable for dense UIs
      expect(smallTargets.length).toBeLessThan(buttons.length * 0.2);
    });

    test('should handle orientation changes', async ({ page }) => {
      await page.setViewportSize({ width: 667, height: 375 }); // Landscape

      await page.click('text=Cloud Architecture Designer');
      await expect(page.locator('.cloud-architecture-designer')).toBeVisible();

      // Switch to portrait
      await page.setViewportSize({ width: 375, height: 667 });

      // Content should still be accessible
      await expect(page.locator('.cloud-architecture-designer')).toBeVisible();
    });
  });
});
