# ADR 001: Component Architecture

## Status

Accepted

## Context

We need to establish a consistent architecture pattern for building components in the CompTIA Network+ learning platform. The platform requires highly interactive learning components, reusable UI elements, and a clear separation of concerns.

## Decision

We will adopt a **component-based architecture** using React with the following patterns:

### 1. Component Types

**Presentation Components (UI Layer)**
- Pure visual components
- Receive data via props
- No business logic
- Reusable across the application

**Container Components (Logic Layer)**
- Manage state and side effects
- Connect to services/APIs
- Handle business logic
- Wrap presentation components

**Interactive Learning Components**
- Specialized educational components
- Combine presentation and logic when needed
- Focus on learning interactions (quizzes, simulations, calculators)

### 2. Directory Structure

```
src/
├── components/
│   ├── ui/              # Basic UI components (Button, Card, Input)
│   ├── interactive/     # Learning components (Quiz, Calculator)
│   ├── layout/          # Layout components (Header, Sidebar)
│   └── containers/      # Container components
├── hooks/               # Custom React hooks
├── utils/               # Utility functions
└── types/               # TypeScript definitions
```

### 3. Component Design Principles

**Single Responsibility**
- Each component has one clear purpose
- Complex components are broken into smaller pieces

**Composition Over Inheritance**
- Build complex UIs from simple components
- Use compound components for related functionality

**Explicit Props**
- All props are typed with TypeScript interfaces
- Required props are clearly marked
- Default values provided where appropriate

**Accessibility First**
- Semantic HTML elements
- ARIA labels and roles
- Keyboard navigation support

### 4. State Management Strategy

**Local State (useState)**
- Component-specific state
- Simple, isolated data

**Context API**
- Shared application state
- Theme, user preferences
- Authentication state

**Custom Hooks**
- Reusable stateful logic
- Extract complex state management
- Examples: useQuiz, useLesson, useProgress

### 5. Styling Approach

**Primary: Tailwind CSS**
- Utility-first styling
- Consistent design system
- Rapid development

**Secondary: CSS Modules**
- Component-scoped styles when needed
- Complex animations
- Custom styling requirements

### 6. TypeScript Integration

**Strict Type Safety**
- All components use TypeScript
- Props interfaces exported
- No `any` types (use `unknown` when necessary)

**Type Reusability**
- Common types in shared location
- Domain types (Lesson, Quiz, etc.)
- Utility types for common patterns

## Consequences

### Positive

✅ **Reusability**: Components can be easily reused across the application

✅ **Testability**: Clear separation makes testing straightforward

✅ **Maintainability**: Consistent patterns make code easier to maintain

✅ **Type Safety**: TypeScript catches errors at compile time

✅ **Developer Experience**: Clear structure aids onboarding and development

✅ **Performance**: Can optimize individual components independently

### Negative

⚠️ **Initial Setup**: Requires more upfront planning and structure

⚠️ **Learning Curve**: Developers need to understand the patterns

⚠️ **Overhead**: Small features may feel over-engineered

### Mitigations

- Comprehensive documentation (this ADR and component guide)
- Code examples and templates
- Developer onboarding guide
- Linting rules to enforce patterns

## Examples

### Presentation Component

```typescript
// src/components/ui/Button.tsx
interface ButtonProps {
  label: string;
  onClick: () => void;
  variant?: 'primary' | 'secondary';
}

export const Button: React.FC<ButtonProps> = ({
  label,
  onClick,
  variant = 'primary'
}) => {
  return (
    <button onClick={onClick} className={`btn btn-${variant}`}>
      {label}
    </button>
  );
};
```

### Container Component

```typescript
// src/components/containers/QuizContainer.tsx
export const QuizContainer: React.FC<{ quizId: string }> = ({ quizId }) => {
  const [quizData, setQuizData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchQuizData(quizId).then(data => {
      setQuizData(data);
      setIsLoading(false);
    });
  }, [quizId]);

  if (isLoading) return <LoadingSpinner />;

  return <Quiz data={quizData} />;
};
```

### Custom Hook

```typescript
// src/hooks/useQuiz.ts
export function useQuiz(questions: Question[]) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState({});

  const nextQuestion = () => {
    setCurrentIndex(prev => Math.min(prev + 1, questions.length - 1));
  };

  return {
    currentIndex,
    currentQuestion: questions[currentIndex],
    answers,
    nextQuestion,
    submitAnswer: (id, answer) => {
      setAnswers(prev => ({ ...prev, [id]: answer }));
    }
  };
}
```

## Alternatives Considered

### Alternative 1: Monolithic Components

**Approach**: Keep logic and presentation together in single files.

**Rejected Because**:
- Harder to test in isolation
- Less reusable
- Grows complex quickly
- Difficult to maintain

### Alternative 2: Redux for State Management

**Approach**: Use Redux for all application state.

**Rejected Because**:
- Overkill for current needs
- Adds complexity and boilerplate
- Context API sufficient for our use case
- Can adopt later if needed

### Alternative 3: Styled Components for All Styling

**Approach**: Use styled-components exclusively.

**Rejected Because**:
- Tailwind provides faster development
- Adds runtime overhead
- Team prefers utility-first approach
- CSS Modules available for complex cases

## References

- [React Component Patterns](https://reactpatterns.com/)
- [Thinking in React](https://react.dev/learn/thinking-in-react)
- [Component Design Principles](../guides/component-guide.md)
- [TypeScript Best Practices](https://www.typescriptlang.org/docs/handbook/declaration-files/do-s-and-don-ts.html)

## Related ADRs

- ADR 002: State Management Strategy (planned)
- ADR 003: Testing Strategy (planned)
- ADR 004: API Integration Patterns (planned)

---

**Date**: 2025-10-28
**Authors**: Development Team
**Status**: Accepted
