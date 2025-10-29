# CompTIA Network+ Learning Platform - Test Suite

Comprehensive test documentation for the Network+ learning platform.

## Test Structure

```
tests/
├── fixtures/          # Shared test data and mocks
│   └── test-data.ts   # Mock data for all test suites
├── unit/              # Unit tests for individual components
│   ├── cloud/         # Cloud architecture tests
│   ├── protocols/     # Protocol trainer tests
│   ├── media/         # Media selection tests
│   ├── assessment/    # Assessment simulator tests
│   ├── topologies/    # Topology tests
│   ├── ipv4/          # IPv4 tests
│   └── modern/        # Modern networking tests
├── integration/       # Integration tests
│   ├── navigation.test.tsx
│   └── state-management.test.tsx
├── e2e/               # End-to-end tests (Playwright)
│   ├── user-journey.spec.ts
│   ├── accessibility.spec.ts
│   └── performance.spec.ts
├── setup.ts           # Test environment setup
└── README.md          # This file
```

## Running Tests

### Unit Tests (Vitest)

```bash
# Run all unit tests
npm run test

# Run with coverage
npm run test:coverage

# Run specific test file
npm run test tests/unit/cloud/CloudArchitectureDesigner.test.tsx

# Watch mode for development
npm run test:watch

# Run tests matching pattern
npm run test -- --grep "Cloud Architecture"
```

### Integration Tests

```bash
# Run integration tests
npm run test tests/integration

# Run with coverage
npm run test:coverage tests/integration
```

### E2E Tests (Playwright)

```bash
# Run all E2E tests
npm run test:e2e

# Run in headed mode (see browser)
npm run test:e2e -- --headed

# Run specific test file
npm run test:e2e tests/e2e/user-journey.spec.ts

# Run on specific browser
npm run test:e2e -- --project=chromium

# Debug mode
npm run test:e2e -- --debug
```

### Accessibility Tests

```bash
# Run accessibility tests
npm run test:e2e tests/e2e/accessibility.spec.ts

# Run with specific device
npm run test:e2e -- --project="Mobile Chrome"
```

## Test Coverage Goals

| Category | Target | Current |
|----------|--------|---------|
| Statements | 90% | TBD |
| Branches | 90% | TBD |
| Functions | 90% | TBD |
| Lines | 90% | TBD |

## Test Categories

### Unit Tests

Test individual components in isolation:

- **Cloud Components**: Architecture designer, summary builder
- **Protocol Components**: Port trainer, traffic demo, scanner
- **Media Components**: Selection matrix, connector lab, transceiver match
- **Assessment Components**: Integrated simulator, progress dashboard
- **Topology Components**: Analyzer, transformer
- **IPv4 Components**: Subnet designer, troubleshooter
- **Modern Components**: IPv6 planner, SDN, technology summarizer

### Integration Tests

Test interactions between components:

- **Navigation**: Routing, sidebar, breadcrumbs, history
- **State Management**: Zustand store, persistence, updates
- **Data Flow**: Component communication, event handling

### E2E Tests

Test complete user workflows:

- **User Journeys**: First-time user, returning user, assessment flow
- **Accessibility**: WCAG 2.1 AA compliance, keyboard navigation
- **Performance**: Load times, navigation speed, responsiveness
- **Mobile**: Touch interactions, responsive design

## Writing Tests

### Unit Test Template

```typescript
import { describe, it, expect, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { axe, toHaveNoViolations } from 'jest-axe';
import YourComponent from '../../../src/components/YourComponent';

expect.extend(toHaveNoViolations);

describe('YourComponent', () => {
  let user: ReturnType<typeof userEvent.setup>;

  beforeEach(() => {
    user = userEvent.setup();
  });

  describe('Rendering', () => {
    it('should render without errors', () => {
      render(<YourComponent />);
      expect(screen.getByText('Expected Text')).toBeInTheDocument();
    });
  });

  describe('Interactions', () => {
    it('should handle user clicks', async () => {
      render(<YourComponent />);
      const button = screen.getByRole('button');
      await user.click(button);
      // Assertions
    });
  });

  describe('Accessibility', () => {
    it('should have no accessibility violations', async () => {
      const { container } = render(<YourComponent />);
      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });
  });
});
```

### E2E Test Template

```typescript
import { test, expect } from '@playwright/test';

test.describe('Feature Name', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('should complete workflow', async ({ page }) => {
    // Navigate
    await page.click('text=Component Name');

    // Interact
    await page.fill('input[name="field"]', 'value');
    await page.click('button[type="submit"]');

    // Assert
    await expect(page.locator('.result')).toBeVisible();
  });
});
```

## Best Practices

### Unit Tests

1. **Test behavior, not implementation**
2. **Use realistic test data**
3. **Mock external dependencies**
4. **Test edge cases and error conditions**
5. **Keep tests fast (<100ms per test)**

### Integration Tests

1. **Test real user workflows**
2. **Use actual components, mock external services**
3. **Test state management thoroughly**
4. **Verify data flows correctly**

### E2E Tests

1. **Focus on critical user paths**
2. **Use stable selectors (test IDs, roles)**
3. **Handle asynchronous operations properly**
4. **Test on multiple devices and browsers**
5. **Keep tests independent and isolated**

### Accessibility Tests

1. **Run axe-core on every page**
2. **Test keyboard navigation**
3. **Verify screen reader support**
4. **Check color contrast**
5. **Test with assistive technologies**

## Debugging Tests

### Vitest

```bash
# Debug in VS Code
# Add breakpoint, then run Debug Jest Test

# Debug in Chrome DevTools
npm run test -- --inspect-brk

# View DOM on failure
npm run test -- --reporter=verbose
```

### Playwright

```bash
# Debug with browser
npm run test:e2e -- --debug

# Headed mode
npm run test:e2e -- --headed

# Trace viewer
npx playwright show-trace trace.zip

# Screenshot on failure (automatic)
# Check test-results/ folder
```

## Continuous Integration

Tests run automatically on:

- Pull requests
- Commits to main branch
- Nightly builds

### CI Configuration

```yaml
# .github/workflows/test.yml
- name: Run unit tests
  run: npm run test:coverage

- name: Run E2E tests
  run: npm run test:e2e

- name: Upload coverage
  uses: codecov/codecov-action@v3
```

## Test Data

All test fixtures are in `tests/fixtures/test-data.ts`:

- **mockCloudComponent**: Sample cloud architecture component
- **mockFlashCard**: Sample protocol flashcard
- **mockMediaOption**: Sample transmission media
- **mockIntegratedScenario**: Sample assessment scenario
- **mockUserProgress**: Sample user progress data

## Troubleshooting

### Common Issues

**Tests timing out**
- Increase timeout in test configuration
- Check for infinite loops or unresolved promises

**Tests flaking**
- Add proper waitFor calls
- Use stable selectors
- Ensure proper cleanup

**Coverage not accurate**
- Check coverage exclude patterns
- Verify source maps are generated
- Run coverage with --all flag

**E2E tests failing**
- Check baseURL configuration
- Ensure dev server is running
- Verify network conditions

## Contributing

When adding new features:

1. Write tests first (TDD)
2. Aim for 90%+ coverage
3. Include accessibility tests
4. Document test scenarios
5. Update this README if needed

## Resources

- [Vitest Documentation](https://vitest.dev/)
- [Testing Library](https://testing-library.com/)
- [Playwright Documentation](https://playwright.dev/)
- [axe-core Rules](https://github.com/dequelabs/axe-core/blob/develop/doc/rule-descriptions.md)
- [WCAG 2.1 Guidelines](https://www.w3.org/WAI/WCAG21/quickref/)
