# Testing Guide

## Comprehensive Testing Strategy for the Learning Platform

This guide covers testing best practices, strategies, and examples for ensuring code quality in our CompTIA Network+ learning platform.

## Table of Contents

1. [Testing Philosophy](#testing-philosophy)
2. [Testing Stack](#testing-stack)
3. [Unit Testing](#unit-testing)
4. [Component Testing](#component-testing)
5. [Integration Testing](#integration-testing)
6. [End-to-End Testing](#end-to-end-testing)
7. [Test Organization](#test-organization)
8. [Best Practices](#best-practices)
9. [Mocking and Fixtures](#mocking-and-fixtures)
10. [Code Coverage](#code-coverage)

## Testing Philosophy

### Testing Pyramid

```
        /\
       /E2E\          <- Few, test critical user journeys
      /------\
     /        \
    /Integration\     <- Moderate, test feature integration
   /------------\
  /              \
 /  Unit Tests    \   <- Many, test individual functions
/------------------\
```

### Key Principles

1. **Write tests first** (TDD approach when possible)
2. **Test behavior, not implementation**
3. **Keep tests simple and focused**
4. **Make tests independent and isolated**
5. **Maintain test code quality** (tests are code too!)
6. **Aim for meaningful coverage** (not just high numbers)

## Testing Stack

### Core Testing Tools

- **Jest**: Test runner and assertion library
- **React Testing Library**: Component testing utilities
- **Vitest**: Fast unit test runner (Vite-compatible)
- **Playwright/Cypress**: E2E testing
- **MSW (Mock Service Worker)**: API mocking

### Installation

```bash
npm install --save-dev \
  @testing-library/react \
  @testing-library/jest-dom \
  @testing-library/user-event \
  vitest \
  jsdom
```

### Configuration

```typescript
// vitest.config.ts
import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  test: {
    environment: 'jsdom',
    globals: true,
    setupFiles: './tests/setup.ts',
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html'],
      exclude: [
        'node_modules/',
        'tests/',
        '**/*.config.*',
        '**/*.d.ts'
      ]
    }
  }
});
```

```typescript
// tests/setup.ts
import '@testing-library/jest-dom';
import { cleanup } from '@testing-library/react';
import { afterEach } from 'vitest';

// Cleanup after each test
afterEach(() => {
  cleanup();
});
```

## Unit Testing

### Testing Utility Functions

```typescript
// src/utils/subnet.ts
export function calculateUsableHosts(cidr: number): number {
  const hostBits = 32 - cidr;
  return Math.pow(2, hostBits) - 2;
}

export function isValidIPv4(ip: string): boolean {
  const pattern = /^(\d{1,3}\.){3}\d{1,3}$/;
  if (!pattern.test(ip)) return false;

  return ip.split('.').every(octet => {
    const num = parseInt(octet, 10);
    return num >= 0 && num <= 255;
  });
}

// tests/unit/subnet.test.ts
import { describe, it, expect } from 'vitest';
import { calculateUsableHosts, isValidIPv4 } from '../../src/utils/subnet';

describe('calculateUsableHosts', () => {
  it('calculates correct hosts for /24 network', () => {
    expect(calculateUsableHosts(24)).toBe(254);
  });

  it('calculates correct hosts for /30 network', () => {
    expect(calculateUsableHosts(30)).toBe(2);
  });

  it('calculates correct hosts for /8 network', () => {
    expect(calculateUsableHosts(8)).toBe(16777214);
  });
});

describe('isValidIPv4', () => {
  it('validates correct IP addresses', () => {
    expect(isValidIPv4('192.168.1.1')).toBe(true);
    expect(isValidIPv4('10.0.0.1')).toBe(true);
    expect(isValidIPv4('255.255.255.255')).toBe(true);
  });

  it('rejects invalid IP addresses', () => {
    expect(isValidIPv4('256.1.1.1')).toBe(false);
    expect(isValidIPv4('192.168.1')).toBe(false);
    expect(isValidIPv4('192.168.1.1.1')).toBe(false);
    expect(isValidIPv4('not.an.ip.address')).toBe(false);
  });
});
```

### Testing Custom Hooks

```typescript
// src/hooks/useQuiz.ts
import { useState, useCallback } from 'react';

export function useQuiz(initialQuestions: Question[]) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, number>>({});

  const nextQuestion = useCallback(() => {
    setCurrentIndex(prev => Math.min(prev + 1, initialQuestions.length - 1));
  }, [initialQuestions.length]);

  const submitAnswer = useCallback((questionId: string, answerIndex: number) => {
    setAnswers(prev => ({ ...prev, [questionId]: answerIndex }));
  }, []);

  return {
    currentIndex,
    answers,
    nextQuestion,
    submitAnswer
  };
}

// tests/unit/useQuiz.test.ts
import { renderHook, act } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { useQuiz } from '../../src/hooks/useQuiz';

const mockQuestions = [
  { id: '1', text: 'Question 1', options: [], correctAnswer: 0 },
  { id: '2', text: 'Question 2', options: [], correctAnswer: 1 },
];

describe('useQuiz', () => {
  it('initializes with first question', () => {
    const { result } = renderHook(() => useQuiz(mockQuestions));

    expect(result.current.currentIndex).toBe(0);
    expect(result.current.answers).toEqual({});
  });

  it('advances to next question', () => {
    const { result } = renderHook(() => useQuiz(mockQuestions));

    act(() => {
      result.current.nextQuestion();
    });

    expect(result.current.currentIndex).toBe(1);
  });

  it('does not advance past last question', () => {
    const { result } = renderHook(() => useQuiz(mockQuestions));

    act(() => {
      result.current.nextQuestion();
      result.current.nextQuestion();
      result.current.nextQuestion();
    });

    expect(result.current.currentIndex).toBe(1);
  });

  it('stores answers correctly', () => {
    const { result } = renderHook(() => useQuiz(mockQuestions));

    act(() => {
      result.current.submitAnswer('1', 2);
    });

    expect(result.current.answers).toEqual({ '1': 2 });
  });
});
```

## Component Testing

### Basic Component Tests

```typescript
// src/components/Button.tsx
interface ButtonProps {
  label: string;
  onClick: () => void;
  variant?: 'primary' | 'secondary';
  disabled?: boolean;
}

export const Button: React.FC<ButtonProps> = ({
  label,
  onClick,
  variant = 'primary',
  disabled = false
}) => {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`btn btn-${variant}`}
    >
      {label}
    </button>
  );
};

// tests/unit/Button.test.tsx
import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { Button } from '../../src/components/Button';

describe('Button', () => {
  it('renders with label', () => {
    render(<Button label="Click me" onClick={() => {}} />);
    expect(screen.getByText('Click me')).toBeInTheDocument();
  });

  it('calls onClick when clicked', () => {
    const handleClick = vi.fn();
    render(<Button label="Click me" onClick={handleClick} />);

    fireEvent.click(screen.getByText('Click me'));
    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  it('applies correct variant class', () => {
    const { rerender } = render(
      <Button label="Test" onClick={() => {}} variant="primary" />
    );
    expect(screen.getByText('Test')).toHaveClass('btn-primary');

    rerender(<Button label="Test" onClick={() => {}} variant="secondary" />);
    expect(screen.getByText('Test')).toHaveClass('btn-secondary');
  });

  it('is disabled when disabled prop is true', () => {
    render(<Button label="Test" onClick={() => {}} disabled />);
    expect(screen.getByText('Test')).toBeDisabled();
  });

  it('does not call onClick when disabled', () => {
    const handleClick = vi.fn();
    render(<Button label="Test" onClick={handleClick} disabled />);

    fireEvent.click(screen.getByText('Test'));
    expect(handleClick).not.toHaveBeenCalled();
  });
});
```

### Testing Interactive Components

```typescript
// tests/unit/Quiz.test.tsx
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { Quiz } from '../../src/components/interactive/Quiz';

const mockQuestions = [
  {
    id: '1',
    text: 'What is a subnet?',
    options: ['Option A', 'Option B', 'Option C'],
    correctAnswer: 0
  },
  {
    id: '2',
    text: 'What is a router?',
    options: ['Option A', 'Option B', 'Option C'],
    correctAnswer: 1
  }
];

describe('Quiz', () => {
  it('renders first question', () => {
    render(<Quiz questions={mockQuestions} />);
    expect(screen.getByText('What is a subnet?')).toBeInTheDocument();
  });

  it('displays all options for current question', () => {
    render(<Quiz questions={mockQuestions} />);
    expect(screen.getByText('Option A')).toBeInTheDocument();
    expect(screen.getByText('Option B')).toBeInTheDocument();
    expect(screen.getByText('Option C')).toBeInTheDocument();
  });

  it('allows selecting an answer', () => {
    render(<Quiz questions={mockQuestions} />);

    const optionB = screen.getByText('Option B');
    fireEvent.click(optionB);

    expect(optionB).toHaveClass('selected');
  });

  it('navigates to next question', () => {
    render(<Quiz questions={mockQuestions} />);

    // Select an answer
    fireEvent.click(screen.getByText('Option A'));

    // Click next
    fireEvent.click(screen.getByText('Next'));

    // Should show second question
    expect(screen.getByText('What is a router?')).toBeInTheDocument();
  });

  it('shows results after completing quiz', async () => {
    const onComplete = vi.fn();
    render(<Quiz questions={mockQuestions} onComplete={onComplete} />);

    // Answer first question
    fireEvent.click(screen.getByText('Option A'));
    fireEvent.click(screen.getByText('Next'));

    // Answer second question
    fireEvent.click(screen.getByText('Option B'));
    fireEvent.click(screen.getByText('Finish'));

    await waitFor(() => {
      expect(screen.getByText('Quiz Complete!')).toBeInTheDocument();
      expect(onComplete).toHaveBeenCalledWith(2, 2);
    });
  });

  it('disables next button when no answer selected', () => {
    render(<Quiz questions={mockQuestions} />);
    expect(screen.getByText('Next')).toBeDisabled();
  });

  it('displays progress indicator', () => {
    render(<Quiz questions={mockQuestions} />);
    expect(screen.getByText('Question 1 of 2')).toBeInTheDocument();
  });
});
```

### Testing with User Events

```typescript
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect } from 'vitest';

describe('SubnetCalculator', () => {
  it('calculates subnet on form submission', async () => {
    const user = userEvent.setup();
    render(<SubnetCalculator />);

    // Type in IP address
    const ipInput = screen.getByLabelText('IP Address');
    await user.type(ipInput, '192.168.1.0');

    // Select CIDR
    const cidrInput = screen.getByLabelText('CIDR');
    await user.clear(cidrInput);
    await user.type(cidrInput, '24');

    // Click calculate
    await user.click(screen.getByText('Calculate'));

    // Verify results
    expect(screen.getByText('Network Address:')).toBeInTheDocument();
    expect(screen.getByText('192.168.1.0')).toBeInTheDocument();
  });
});
```

## Integration Testing

### Testing Component Integration

```typescript
// tests/integration/lesson-flow.test.tsx
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect, beforeEach } from 'vitest';
import { LessonPage } from '../../src/pages/LessonPage';
import { setupServer } from 'msw/node';
import { rest } from 'msw';

// Mock API
const server = setupServer(
  rest.get('/api/lessons/:id', (req, res, ctx) => {
    return res(
      ctx.json({
        id: '1',
        title: 'Introduction to Subnetting',
        content: 'Lesson content here...',
        quiz: {
          questions: [/* questions */]
        }
      })
    );
  })
);

beforeAll(() => server.listen());
afterEach(() => server.resetHandlers());
afterAll(() => server.close());

describe('Lesson Flow Integration', () => {
  it('completes full lesson workflow', async () => {
    render(<LessonPage lessonId="1" />);

    // Wait for lesson to load
    await waitFor(() => {
      expect(screen.getByText('Introduction to Subnetting')).toBeInTheDocument();
    });

    // Read lesson content
    expect(screen.getByText('Lesson content here...')).toBeInTheDocument();

    // Start quiz
    fireEvent.click(screen.getByText('Start Quiz'));

    // Complete quiz
    fireEvent.click(screen.getByText('Option A'));
    fireEvent.click(screen.getByText('Submit'));

    // Verify completion
    await waitFor(() => {
      expect(screen.getByText('Lesson Complete!')).toBeInTheDocument();
    });
  });
});
```

## End-to-End Testing

### Playwright E2E Tests

```typescript
// tests/e2e/quiz-completion.spec.ts
import { test, expect } from '@playwright/test';

test.describe('Quiz Completion Flow', () => {
  test('user completes quiz successfully', async ({ page }) => {
    // Navigate to lesson page
    await page.goto('/lessons/subnetting');

    // Wait for lesson to load
    await expect(page.locator('h1')).toContainText('Introduction to Subnetting');

    // Start quiz
    await page.click('text=Start Quiz');

    // Answer questions
    await page.click('text=Option A');
    await page.click('text=Next');

    await page.click('text=Option B');
    await page.click('text=Next');

    await page.click('text=Option C');
    await page.click('text=Finish');

    // Verify results page
    await expect(page.locator('.quiz-results')).toBeVisible();
    await expect(page.locator('.score')).toContainText('3 / 3');
  });

  test('user can navigate between questions', async ({ page }) => {
    await page.goto('/lessons/subnetting/quiz');

    // Answer first question
    await page.click('text=Option A');
    await page.click('text=Next');

    // Go back
    await page.click('text=Previous');

    // Verify we're back at first question
    await expect(page.locator('.question-number')).toContainText('1 of 3');
  });
});
```

## Test Organization

### Directory Structure

```
tests/
├── unit/                     # Unit tests
│   ├── components/          # Component tests
│   ├── hooks/               # Hook tests
│   └── utils/               # Utility tests
├── integration/             # Integration tests
│   ├── features/           # Feature integration
│   └── api/                # API integration
├── e2e/                     # End-to-end tests
│   ├── user-flows/         # User journey tests
│   └── critical-paths/     # Critical functionality
├── fixtures/                # Test data
│   ├── lessons.json
│   └── quizzes.json
└── setup.ts                 # Test setup
```

### Naming Conventions

```typescript
// Component tests: ComponentName.test.tsx
Button.test.tsx
Quiz.test.tsx

// Hook tests: useHookName.test.ts
useQuiz.test.ts
useLesson.test.ts

// Utility tests: utilityName.test.ts
subnet.test.ts
validation.test.ts

// Integration tests: feature-name.test.tsx
lesson-flow.test.tsx
quiz-submission.test.tsx

// E2E tests: user-flow.spec.ts
quiz-completion.spec.ts
user-registration.spec.ts
```

## Best Practices

### 1. Arrange-Act-Assert Pattern

```typescript
it('calculates subnet correctly', () => {
  // Arrange
  const ipAddress = '192.168.1.0';
  const cidr = 24;

  // Act
  const result = calculateSubnet(ipAddress, cidr);

  // Assert
  expect(result.networkAddress).toBe('192.168.1.0');
  expect(result.usableHosts).toBe(254);
});
```

### 2. Test One Thing at a Time

```typescript
// ❌ Bad: Testing multiple things
it('button works', () => {
  render(<Button label="Test" onClick={handler} />);
  expect(screen.getByText('Test')).toBeInTheDocument();
  fireEvent.click(screen.getByText('Test'));
  expect(handler).toHaveBeenCalled();
  expect(screen.getByText('Test')).toHaveClass('clicked');
});

// ✅ Good: Separate tests
it('renders with label', () => {
  render(<Button label="Test" onClick={handler} />);
  expect(screen.getByText('Test')).toBeInTheDocument();
});

it('calls onClick when clicked', () => {
  render(<Button label="Test" onClick={handler} />);
  fireEvent.click(screen.getByText('Test'));
  expect(handler).toHaveBeenCalled();
});
```

### 3. Use Descriptive Test Names

```typescript
// ❌ Bad
it('works', () => { /* ... */ });
it('test 1', () => { /* ... */ });

// ✅ Good
it('calculates usable hosts for /24 network', () => { /* ... */ });
it('validates IPv4 address format', () => { /* ... */ });
it('disables submit button when form is invalid', () => { /* ... */ });
```

### 4. Avoid Implementation Details

```typescript
// ❌ Bad: Testing implementation
it('calls setState', () => {
  const component = render(<Quiz />);
  expect(component.setState).toHaveBeenCalled();
});

// ✅ Good: Testing behavior
it('updates selected answer when option is clicked', () => {
  render(<Quiz />);
  fireEvent.click(screen.getByText('Option A'));
  expect(screen.getByText('Option A')).toHaveClass('selected');
});
```

## Mocking and Fixtures

### Mocking API Calls

```typescript
// tests/mocks/handlers.ts
import { rest } from 'msw';

export const handlers = [
  rest.get('/api/lessons/:id', (req, res, ctx) => {
    return res(
      ctx.json({
        id: req.params.id,
        title: 'Mock Lesson',
        content: 'Mock content'
      })
    );
  }),

  rest.post('/api/quiz/submit', (req, res, ctx) => {
    return res(
      ctx.json({
        score: 10,
        total: 10
      })
    );
  })
];

// tests/mocks/server.ts
import { setupServer } from 'msw/node';
import { handlers } from './handlers';

export const server = setupServer(...handlers);
```

### Using Fixtures

```typescript
// tests/fixtures/lessons.ts
export const mockLesson = {
  id: '1',
  title: 'Introduction to Subnetting',
  content: 'Detailed lesson content...',
  quiz: {
    questions: [
      {
        id: 'q1',
        text: 'What is a subnet?',
        options: ['A', 'B', 'C'],
        correctAnswer: 0
      }
    ]
  }
};

// In tests
import { mockLesson } from '../fixtures/lessons';

it('renders lesson content', () => {
  render(<Lesson data={mockLesson} />);
  expect(screen.getByText(mockLesson.title)).toBeInTheDocument();
});
```

## Code Coverage

### Running Coverage Reports

```bash
# Generate coverage report
npm run test:coverage

# View HTML report
open coverage/index.html
```

### Coverage Goals

- **Overall**: 80%+ coverage
- **Critical paths**: 95%+ coverage
- **Utilities**: 90%+ coverage
- **Components**: 80%+ coverage

### Coverage Configuration

```typescript
// vitest.config.ts
export default defineConfig({
  test: {
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html'],
      statements: 80,
      branches: 75,
      functions: 80,
      lines: 80,
      exclude: [
        'node_modules/',
        'tests/',
        '**/*.config.*',
        '**/*.d.ts',
        '**/types/**'
      ]
    }
  }
});
```

## Continuous Integration

### GitHub Actions Example

```yaml
# .github/workflows/test.yml
name: Tests

on: [push, pull_request]

jobs:
  test:
    runs-on: ubuntu-latest

    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: '18'

      - name: Install dependencies
        run: npm ci

      - name: Run unit tests
        run: npm run test:unit

      - name: Run integration tests
        run: npm run test:integration

      - name: Generate coverage
        run: npm run test:coverage

      - name: Upload coverage
        uses: codecov/codecov-action@v3
```

## Summary

- Write tests for all new features
- Maintain high test coverage (80%+)
- Use appropriate test types (unit, integration, E2E)
- Follow testing best practices
- Keep tests maintainable and readable
- Run tests before committing code

## Additional Resources

- [React Testing Library Documentation](https://testing-library.com/react)
- [Vitest Documentation](https://vitest.dev/)
- [Playwright Documentation](https://playwright.dev/)
- [Component API Reference](../api/component-api.md)

---

Happy testing! Write tests that give you confidence in your code.
