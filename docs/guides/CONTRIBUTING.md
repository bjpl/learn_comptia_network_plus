# Contributing to CompTIA Network+ Learning Platform

Thank you for your interest in contributing to our learning platform! This document provides guidelines and information for contributors.

## Table of Contents

1. [Code of Conduct](#code-of-conduct)
2. [Getting Started](#getting-started)
3. [Development Workflow](#development-workflow)
4. [Contribution Guidelines](#contribution-guidelines)
5. [Pull Request Process](#pull-request-process)
6. [Coding Standards](#coding-standards)
7. [Testing Requirements](#testing-requirements)
8. [Documentation](#documentation)
9. [Community](#community)

## Code of Conduct

### Our Pledge

We are committed to providing a welcoming and inclusive environment for all contributors, regardless of:

- Age, body size, disability, ethnicity
- Gender identity and expression
- Level of experience
- Nationality, personal appearance, race, religion
- Sexual identity and orientation

### Our Standards

**Positive behaviors include:**

- Using welcoming and inclusive language
- Being respectful of differing viewpoints
- Gracefully accepting constructive criticism
- Focusing on what's best for the community
- Showing empathy towards other community members

**Unacceptable behaviors include:**

- Harassment, trolling, or insulting comments
- Public or private harassment
- Publishing others' private information
- Other conduct inappropriate in a professional setting

### Enforcement

Violations of the Code of Conduct may result in:

1. Warning
2. Temporary ban
3. Permanent ban

Report violations to: [project-maintainers@example.com]

## Getting Started

### Prerequisites

- Node.js 18+ or 20+
- npm or yarn
- Git
- Code editor (VS Code recommended)

### Fork and Clone

```bash
# Fork the repository on GitHub
# Then clone your fork
git clone https://github.com/YOUR_USERNAME/learn_comptia_network+.git
cd learn_comptia_network+

# Add upstream remote
git remote add upstream https://github.com/ORIGINAL_OWNER/learn_comptia_network+.git
```

### Install Dependencies

```bash
npm install
```

### Create a Branch

```bash
# Create a feature branch
git checkout -b feature/your-feature-name

# Or a bugfix branch
git checkout -b fix/issue-description
```

## Development Workflow

### 1. Run Development Server

```bash
npm run dev
```

Access the app at `http://localhost:5173` (or configured port)

### 2. Make Changes

- Write code following our [coding standards](#coding-standards)
- Add tests for new functionality
- Update documentation as needed
- Ensure all tests pass

### 3. Test Your Changes

```bash
# Run all tests
npm test

# Run tests in watch mode
npm test -- --watch

# Check test coverage
npm run test:coverage

# Run linter
npm run lint

# Run type checker
npm run typecheck
```

### 4. Commit Changes

Follow conventional commit format:

```bash
git add .
git commit -m "feat: add subnet calculator component"
```

**Commit Types:**

- `feat:` New feature
- `fix:` Bug fix
- `docs:` Documentation changes
- `style:` Code style changes (formatting)
- `refactor:` Code refactoring
- `test:` Adding or updating tests
- `chore:` Maintenance tasks

**Examples:**

```bash
git commit -m "feat: add interactive network topology visualization"
git commit -m "fix: resolve quiz answer validation issue"
git commit -m "docs: update component API documentation"
git commit -m "test: add unit tests for subnet utilities"
```

### 5. Keep Your Branch Updated

```bash
# Fetch latest changes from upstream
git fetch upstream

# Rebase your branch on upstream/main
git rebase upstream/main

# Force push to your fork (if already pushed)
git push --force-with-lease origin feature/your-feature-name
```

## Contribution Guidelines

### What to Contribute

**We welcome:**

- Bug fixes
- New features
- Performance improvements
- Documentation improvements
- Test coverage improvements
- Accessibility enhancements
- UI/UX improvements

**Before starting major work:**

1. Check existing issues and PRs
2. Open an issue to discuss your idea
3. Wait for maintainer feedback
4. Proceed with implementation

### Issue Guidelines

**When creating an issue:**

**Bug Reports:**

```markdown
**Describe the bug**
A clear description of what the bug is.

**To Reproduce**
Steps to reproduce the behavior:

1. Go to '...'
2. Click on '...'
3. See error

**Expected behavior**
What you expected to happen.

**Screenshots**
If applicable, add screenshots.

**Environment:**

- OS: [e.g., Windows 11]
- Browser: [e.g., Chrome 120]
- Node version: [e.g., 20.10.0]
```

**Feature Requests:**

```markdown
**Is your feature request related to a problem?**
A clear description of the problem.

**Describe the solution you'd like**
A clear description of what you want to happen.

**Describe alternatives you've considered**
Alternative solutions or features you've considered.

**Additional context**
Any other context or screenshots.
```

## Pull Request Process

### Before Submitting

- [ ] Code follows style guidelines
- [ ] Self-review completed
- [ ] Code commented where needed
- [ ] Documentation updated
- [ ] Tests added/updated
- [ ] All tests pass
- [ ] No linting errors
- [ ] Commits follow convention
- [ ] Branch is up to date

### PR Template

```markdown
## Description

Brief description of changes.

## Type of Change

- [ ] Bug fix (non-breaking change fixing an issue)
- [ ] New feature (non-breaking change adding functionality)
- [ ] Breaking change (fix or feature causing existing functionality to change)
- [ ] Documentation update

## How Has This Been Tested?

Describe tests performed.

## Checklist

- [ ] Code follows style guidelines
- [ ] Self-review performed
- [ ] Code is commented
- [ ] Documentation updated
- [ ] No new warnings
- [ ] Tests added/updated
- [ ] All tests pass
- [ ] Changes are backwards compatible
```

### Review Process

1. **Automated Checks**: CI/CD runs tests and linting
2. **Code Review**: Maintainers review your code
3. **Feedback**: Address requested changes
4. **Approval**: PR approved by maintainers
5. **Merge**: PR merged into main branch

**Response Times:**

- Initial review: Within 48 hours
- Follow-up reviews: Within 24 hours
- Merge: After approval and passing checks

## Coding Standards

### TypeScript

```typescript
// ✅ Good: Clear types and interfaces
interface ButtonProps {
  label: string;
  onClick: () => void;
  variant?: 'primary' | 'secondary';
}

export const Button: React.FC<ButtonProps> = ({ label, onClick, variant = 'primary' }) => {
  return <button onClick={onClick} className={`btn-${variant}`}>{label}</button>;
};

// ❌ Bad: Using 'any', no types
const Button = ({ label, onClick, variant }: any) => {
  return <button onClick={onClick}>{label}</button>;
};
```

### File Organization

```typescript
// Component file structure
import React from 'react'; // External imports first
import { useState } from 'react';

import { Button } from '../ui'; // Internal imports second

import styles from './Component.module.css'; // Styles last

// Types
interface ComponentProps {
  // ...
}

// Component
export const Component: React.FC<ComponentProps> = (props) => {
  // Component implementation
};
```

### Naming Conventions

```typescript
// Components: PascalCase
export const SubnetCalculator: React.FC = () => {};

// Hooks: camelCase with 'use' prefix
export function useQuiz() {}

// Utilities: camelCase
export function calculateSubnet() {}

// Constants: UPPER_SNAKE_CASE
export const MAX_QUIZ_TIME = 600;

// Types/Interfaces: PascalCase
interface QuizQuestion {}
type NetworkType = 'star' | 'mesh';
```

### Code Style

```typescript
// Use arrow functions for components
const Component = () => {
  // Component code
};

// Use destructuring
const { title, description } = props;

// Use template literals
const message = `Score: ${score}/${total}`;

// Use optional chaining
const data = user?.profile?.settings;

// Use nullish coalescing
const value = userInput ?? defaultValue;
```

## Testing Requirements

### Test Coverage Goals

- **Overall**: 80%+ coverage
- **Critical components**: 95%+ coverage
- **Utilities**: 90%+ coverage
- **UI components**: 80%+ coverage

### Writing Tests

```typescript
// tests/unit/Component.test.tsx
import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { Component } from './Component';

describe('Component', () => {
  it('renders correctly', () => {
    render(<Component title="Test" />);
    expect(screen.getByText('Test')).toBeInTheDocument();
  });

  it('handles user interaction', () => {
    const handleClick = vi.fn();
    render(<Component onClick={handleClick} />);

    fireEvent.click(screen.getByRole('button'));
    expect(handleClick).toHaveBeenCalledTimes(1);
  });
});
```

### Test Requirements

- **Unit tests**: For all utilities and hooks
- **Component tests**: For all components
- **Integration tests**: For critical user flows
- **No skipped tests**: Unless documented reason

## Documentation

### Code Documentation

````typescript
/**
 * Calculate usable hosts in a subnet
 *
 * @param cidr - CIDR notation (0-32)
 * @returns Number of usable host addresses
 *
 * @example
 * ```typescript
 * calculateUsableHosts(24); // Returns 254
 * ```
 */
export function calculateUsableHosts(cidr: number): number {
  const hostBits = 32 - cidr;
  return Math.pow(2, hostBits) - 2;
}
````

### Component Documentation

````typescript
/**
 * Interactive quiz component with multiple-choice questions
 *
 * @example
 * ```tsx
 * <Quiz
 *   questions={questions}
 *   showExplanations
 *   onComplete={(score, total) => console.log(`${score}/${total}`)}
 * />
 * ```
 */
export const Quiz: React.FC<QuizProps> = (props) => {
  // Implementation
};
````

### Update Documentation

When changing:

- Component APIs → Update `docs/api/component-api.md`
- Architecture → Create/update ADR in `docs/architecture/decisions/`
- Development process → Update `docs/guides/development-guide.md`
- Testing → Update `docs/guides/testing-guide.md`

## Community

### Communication Channels

- **GitHub Issues**: Bug reports and feature requests
- **GitHub Discussions**: General questions and discussions
- **Pull Requests**: Code reviews and contributions

### Getting Help

1. Check documentation first
2. Search existing issues
3. Ask in GitHub Discussions
4. Create detailed issue if needed

### Recognition

Contributors are recognized in:

- README.md contributors section
- Release notes
- Annual contributor highlights

### Maintainers

Current maintainers:

- [Maintainer Name] (@github-username)

## License

By contributing, you agree that your contributions will be licensed under the same license as the project.

---

## Quick Reference

```bash
# Setup
git clone <fork-url>
cd learn_comptia_network+
npm install

# Development
git checkout -b feature/my-feature
npm run dev
# Make changes
npm test
npm run lint

# Commit
git add .
git commit -m "feat: add my feature"

# Update and push
git fetch upstream
git rebase upstream/main
git push origin feature/my-feature

# Create PR on GitHub
```

---

Thank you for contributing! Your efforts help make this learning platform better for everyone. 🎉
