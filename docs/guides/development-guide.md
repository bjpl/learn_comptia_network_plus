# Development Guide

## Welcome to the CompTIA Network+ Learning Platform

This guide will help you get started with developing features for our interactive learning platform.

## Table of Contents

1. [Getting Started](#getting-started)
2. [Project Structure](#project-structure)
3. [Development Workflow](#development-workflow)
4. [Core Concepts](#core-concepts)
5. [Best Practices](#best-practices)
6. [Common Tasks](#common-tasks)
7. [Troubleshooting](#troubleshooting)

## Getting Started

### Prerequisites

- Node.js 18+ or Node.js 20+
- npm or yarn package manager
- Git for version control
- Code editor (VS Code recommended)

### Initial Setup

```bash
# Clone the repository
git clone <repository-url>
cd learn_comptia_network+

# Install dependencies
npm install

# Start development server
npm run dev

# Run tests
npm test

# Build for production
npm run build
```

### Environment Configuration

Create a `.env` file in the project root:

```env
# Add any required environment variables
VITE_API_URL=http://localhost:3000
```

## Project Structure

```
learn_comptia_network+/
├── src/                      # Source code
│   ├── components/          # Reusable UI components
│   │   ├── interactive/    # Interactive learning components
│   │   ├── layout/         # Layout components
│   │   └── ui/             # Basic UI elements
│   ├── pages/              # Page components
│   ├── hooks/              # Custom React hooks
│   ├── utils/              # Utility functions
│   ├── services/           # API and external services
│   ├── stores/             # State management
│   └── types/              # TypeScript type definitions
├── tests/                   # Test files
│   ├── unit/              # Unit tests
│   ├── integration/       # Integration tests
│   └── e2e/               # End-to-end tests
├── docs/                    # Documentation
│   ├── guides/            # Development guides
│   ├── api/               # API documentation
│   └── architecture/      # Architecture decisions
└── public/                  # Static assets
```

## Development Workflow

### 1. Feature Development Flow

```bash
# Create a feature branch
git checkout -b feature/your-feature-name

# Make changes and commit regularly
git add .
git commit -m "feat: add new interactive component"

# Push and create pull request
git push origin feature/your-feature-name
```

### 2. Commit Message Convention

Follow conventional commits format:

- `feat:` New feature
- `fix:` Bug fix
- `docs:` Documentation changes
- `style:` Code style changes (formatting, etc.)
- `refactor:` Code refactoring
- `test:` Adding or updating tests
- `chore:` Maintenance tasks

Examples:
```
feat: add network topology visualization component
fix: resolve quiz answer validation issue
docs: update component API documentation
test: add unit tests for subnet calculator
```

### 3. Code Review Process

1. Submit pull request with clear description
2. Ensure all tests pass
3. Request review from maintainers
4. Address feedback
5. Merge when approved

## Core Concepts

### Component Architecture

Our platform uses a component-based architecture:

```typescript
// Example interactive component structure
import React, { useState } from 'react';

interface ComponentProps {
  // Define props
}

export const InteractiveComponent: React.FC<ComponentProps> = (props) => {
  // Component logic
  const [state, setState] = useState();

  return (
    // JSX markup
    <div>
      {/* Component content */}
    </div>
  );
};
```

### State Management

- **Local State**: Use `useState` for component-specific state
- **Shared State**: Use Context API or state management library
- **Server State**: Use React Query for API data

### Styling Approach

We use a combination of:
- **Tailwind CSS**: Utility-first styling
- **CSS Modules**: Component-scoped styles
- **Styled Components**: Dynamic styling when needed

```tsx
// Example with Tailwind
<div className="bg-blue-500 text-white p-4 rounded-lg">
  Content
</div>
```

## Best Practices

### 1. Component Design

- **Single Responsibility**: Each component should do one thing well
- **Reusability**: Design components to be reused across the app
- **Composition**: Build complex UIs from simple components
- **Props Validation**: Use TypeScript interfaces for type safety

```typescript
// Good: Clear, focused component
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
```

### 2. Performance Optimization

- Use `React.memo` for expensive components
- Implement lazy loading for routes and large components
- Optimize images and assets
- Use code splitting

```typescript
// Lazy loading example
const QuizComponent = React.lazy(() => import('./components/Quiz'));

function App() {
  return (
    <Suspense fallback={<LoadingSpinner />}>
      <QuizComponent />
    </Suspense>
  );
}
```

### 3. Accessibility

- Use semantic HTML elements
- Add ARIA labels where needed
- Ensure keyboard navigation
- Maintain color contrast ratios

```tsx
// Accessible component example
<button
  aria-label="Start quiz"
  aria-describedby="quiz-description"
  role="button"
  tabIndex={0}
>
  Start Quiz
</button>
```

### 4. Testing Strategy

- Write unit tests for utilities and hooks
- Test component rendering and interactions
- Add integration tests for critical flows
- E2E tests for user journeys

```typescript
// Example unit test
import { render, screen, fireEvent } from '@testing-library/react';
import { Button } from './Button';

describe('Button', () => {
  it('calls onClick when clicked', () => {
    const handleClick = jest.fn();
    render(<Button label="Click me" onClick={handleClick} />);

    fireEvent.click(screen.getByText('Click me'));
    expect(handleClick).toHaveBeenCalledTimes(1);
  });
});
```

## Common Tasks

### Adding a New Component

```bash
# 1. Create component file
touch src/components/MyComponent.tsx

# 2. Create test file
touch tests/unit/MyComponent.test.tsx

# 3. Create story file (if using Storybook)
touch src/components/MyComponent.stories.tsx
```

### Adding a New Page

```bash
# 1. Create page component
touch src/pages/NewPage.tsx

# 2. Add route in router configuration
# Edit src/router.tsx or equivalent
```

### Working with APIs

```typescript
// Use service layer for API calls
// src/services/api.ts
export const fetchLessonData = async (lessonId: string) => {
  const response = await fetch(`/api/lessons/${lessonId}`);
  if (!response.ok) throw new Error('Failed to fetch lesson');
  return response.json();
};

// In component
import { useQuery } from 'react-query';
import { fetchLessonData } from '../services/api';

function LessonComponent({ lessonId }) {
  const { data, isLoading, error } = useQuery(
    ['lesson', lessonId],
    () => fetchLessonData(lessonId)
  );

  if (isLoading) return <LoadingSpinner />;
  if (error) return <ErrorMessage error={error} />;

  return <div>{/* Render lesson */}</div>;
}
```

### Debugging Tips

```typescript
// Use React DevTools
// Install browser extension for React DevTools

// Console logging with context
console.log('Component mounted:', { props, state });

// Performance profiling
import { Profiler } from 'react';

<Profiler id="MyComponent" onRender={onRenderCallback}>
  <MyComponent />
</Profiler>
```

## Troubleshooting

### Common Issues

#### Issue: Component not rendering

**Check:**
- Is the component imported correctly?
- Are all required props provided?
- Check browser console for errors
- Verify component is exported properly

#### Issue: State not updating

**Check:**
- Are you mutating state directly? Use setState
- Is the component re-rendering?
- Check React DevTools for state changes

#### Issue: Build failing

**Solutions:**
```bash
# Clear cache and reinstall
rm -rf node_modules package-lock.json
npm install

# Check for TypeScript errors
npm run typecheck

# Check for linting errors
npm run lint
```

#### Issue: Tests failing

**Solutions:**
- Check test environment setup
- Verify mocks are configured correctly
- Run tests in watch mode for debugging
- Check for async timing issues

### Getting Help

1. Check documentation first
2. Search existing issues on GitHub
3. Ask in team chat/Slack
4. Create detailed issue report if bug found

## Additional Resources

- [Component Guide](./component-guide.md) - How to create components
- [Testing Guide](./testing-guide.md) - Testing best practices
- [Component API Reference](../api/component-api.md) - Component documentation
- [Architecture Decisions](../architecture/decisions/) - ADRs

## Contributing

See [CONTRIBUTING.md](../../CONTRIBUTING.md) for detailed contribution guidelines.

---

**Happy coding!** If you have questions or suggestions for improving this guide, please open an issue or submit a pull request.
