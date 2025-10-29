# Component Development Guide

## Creating Components for the Learning Platform

This guide covers best practices for creating reusable, maintainable components in our CompTIA Network+ learning platform.

## Table of Contents

1. [Component Types](#component-types)
2. [Creating a New Component](#creating-a-new-component)
3. [Component Patterns](#component-patterns)
4. [Interactive Components](#interactive-components)
5. [Styling Guidelines](#styling-guidelines)
6. [Props and TypeScript](#props-and-typescript)
7. [Testing Components](#testing-components)
8. [Examples](#examples)

## Component Types

### 1. Presentation Components (UI Components)

Pure UI components that receive data via props and render visual elements.

```typescript
// src/components/ui/Card.tsx
interface CardProps {
  title: string;
  content: string;
  variant?: 'default' | 'highlighted';
}

export const Card: React.FC<CardProps> = ({
  title,
  content,
  variant = 'default'
}) => {
  return (
    <div className={`card card-${variant}`}>
      <h3 className="card-title">{title}</h3>
      <p className="card-content">{content}</p>
    </div>
  );
};
```

### 2. Container Components

Components that manage state and business logic, often wrapping presentation components.

```typescript
// src/components/containers/QuizContainer.tsx
import { useState, useEffect } from 'react';
import { Quiz } from '../interactive/Quiz';
import { fetchQuizData } from '../../services/api';

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

### 3. Interactive Learning Components

Educational components with interactive features like simulations, quizzes, and exercises.

```typescript
// src/components/interactive/NetworkSimulator.tsx
interface NetworkSimulatorProps {
  topology: 'star' | 'mesh' | 'ring' | 'bus';
  nodes: NetworkNode[];
  onPacketSend: (from: string, to: string) => void;
}

export const NetworkSimulator: React.FC<NetworkSimulatorProps> = ({
  topology,
  nodes,
  onPacketSend
}) => {
  // Interactive simulation logic
  return (
    <div className="network-simulator">
      {/* Visualization and controls */}
    </div>
  );
};
```

## Creating a New Component

### Step 1: Component File Structure

```
src/components/
└── my-component/
    ├── MyComponent.tsx          # Main component
    ├── MyComponent.module.css   # Styles (if needed)
    ├── MyComponent.test.tsx     # Tests
    ├── MyComponent.stories.tsx  # Storybook stories (optional)
    └── index.ts                 # Export file
```

### Step 2: Basic Component Template

```typescript
// src/components/my-component/MyComponent.tsx
import React from 'react';
import styles from './MyComponent.module.css';

interface MyComponentProps {
  /**
   * Component title
   */
  title: string;

  /**
   * Optional description
   */
  description?: string;

  /**
   * Callback when action is triggered
   */
  onAction?: () => void;
}

/**
 * MyComponent description
 *
 * @example
 * ```tsx
 * <MyComponent
 *   title="Example"
 *   description="This is an example"
 *   onAction={() => console.log('Action triggered')}
 * />
 * ```
 */
export const MyComponent: React.FC<MyComponentProps> = ({
  title,
  description,
  onAction
}) => {
  return (
    <div className={styles.container}>
      <h2 className={styles.title}>{title}</h2>
      {description && (
        <p className={styles.description}>{description}</p>
      )}
      {onAction && (
        <button onClick={onAction} className={styles.button}>
          Take Action
        </button>
      )}
    </div>
  );
};
```

### Step 3: Export Component

```typescript
// src/components/my-component/index.ts
export { MyComponent } from './MyComponent';
export type { MyComponentProps } from './MyComponent';
```

## Component Patterns

### 1. Compound Components

For complex components with multiple sub-components:

```typescript
// Quiz component with compound pattern
export const Quiz = ({ children }) => {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState({});

  return (
    <QuizContext.Provider value={{ currentQuestion, answers, setAnswers }}>
      <div className="quiz-container">
        {children}
      </div>
    </QuizContext.Provider>
  );
};

Quiz.Question = ({ id, text }) => {
  // Question component
};

Quiz.Options = ({ options }) => {
  // Options component
};

Quiz.Submit = ({ onSubmit }) => {
  // Submit button component
};

// Usage
<Quiz>
  <Quiz.Question id="1" text="What is a subnet?" />
  <Quiz.Options options={['A', 'B', 'C']} />
  <Quiz.Submit onSubmit={handleSubmit} />
</Quiz>
```

### 2. Render Props Pattern

For flexible rendering:

```typescript
interface DataFetcherProps<T> {
  url: string;
  render: (data: T, loading: boolean, error: Error | null) => React.ReactNode;
}

export function DataFetcher<T>({ url, render }: DataFetcherProps<T>) {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    fetch(url)
      .then(res => res.json())
      .then(data => {
        setData(data);
        setLoading(false);
      })
      .catch(err => {
        setError(err);
        setLoading(false);
      });
  }, [url]);

  return <>{render(data, loading, error)}</>;
}

// Usage
<DataFetcher
  url="/api/lesson"
  render={(data, loading, error) => {
    if (loading) return <Spinner />;
    if (error) return <Error message={error.message} />;
    return <LessonContent data={data} />;
  }}
/>
```

### 3. Custom Hooks Pattern

Extract reusable logic into hooks:

```typescript
// src/hooks/useQuiz.ts
export function useQuiz(quizId: string) {
  const [questions, setQuestions] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState({});
  const [score, setScore] = useState(0);

  const nextQuestion = () => {
    setCurrentIndex(prev => Math.min(prev + 1, questions.length - 1));
  };

  const previousQuestion = () => {
    setCurrentIndex(prev => Math.max(prev - 1, 0));
  };

  const submitAnswer = (questionId: string, answer: string) => {
    setAnswers(prev => ({ ...prev, [questionId]: answer }));
  };

  const calculateScore = () => {
    // Score calculation logic
  };

  return {
    questions,
    currentQuestion: questions[currentIndex],
    currentIndex,
    answers,
    score,
    nextQuestion,
    previousQuestion,
    submitAnswer,
    calculateScore
  };
}

// Usage in component
const QuizComponent = ({ quizId }) => {
  const {
    currentQuestion,
    nextQuestion,
    previousQuestion,
    submitAnswer
  } = useQuiz(quizId);

  return (
    <div>
      <Question data={currentQuestion} onAnswer={submitAnswer} />
      <button onClick={previousQuestion}>Previous</button>
      <button onClick={nextQuestion}>Next</button>
    </div>
  );
};
```

## Interactive Components

### Creating an Interactive Learning Component

```typescript
// src/components/interactive/SubnetCalculator.tsx
import React, { useState, useCallback } from 'react';

interface SubnetCalculatorProps {
  /**
   * Called when calculation is performed
   */
  onCalculate?: (result: SubnetResult) => void;

  /**
   * Show detailed explanation
   */
  showExplanation?: boolean;
}

interface SubnetResult {
  networkAddress: string;
  broadcastAddress: string;
  usableHosts: number;
  subnetMask: string;
}

export const SubnetCalculator: React.FC<SubnetCalculatorProps> = ({
  onCalculate,
  showExplanation = false
}) => {
  const [ipAddress, setIpAddress] = useState('');
  const [cidr, setCidr] = useState('24');
  const [result, setResult] = useState<SubnetResult | null>(null);

  const calculateSubnet = useCallback(() => {
    // Subnet calculation logic
    const calculatedResult: SubnetResult = {
      networkAddress: '192.168.1.0',
      broadcastAddress: '192.168.1.255',
      usableHosts: 254,
      subnetMask: '255.255.255.0'
    };

    setResult(calculatedResult);
    onCalculate?.(calculatedResult);
  }, [ipAddress, cidr, onCalculate]);

  return (
    <div className="subnet-calculator">
      <h3>Subnet Calculator</h3>

      <div className="input-group">
        <label htmlFor="ip-address">IP Address:</label>
        <input
          id="ip-address"
          type="text"
          value={ipAddress}
          onChange={(e) => setIpAddress(e.target.value)}
          placeholder="192.168.1.0"
          aria-label="IP Address"
        />
      </div>

      <div className="input-group">
        <label htmlFor="cidr">CIDR:</label>
        <input
          id="cidr"
          type="number"
          value={cidr}
          onChange={(e) => setCidr(e.target.value)}
          min="0"
          max="32"
          aria-label="CIDR notation"
        />
      </div>

      <button onClick={calculateSubnet} className="calculate-btn">
        Calculate
      </button>

      {result && (
        <div className="result-panel">
          <h4>Results:</h4>
          <dl>
            <dt>Network Address:</dt>
            <dd>{result.networkAddress}</dd>

            <dt>Broadcast Address:</dt>
            <dd>{result.broadcastAddress}</dd>

            <dt>Subnet Mask:</dt>
            <dd>{result.subnetMask}</dd>

            <dt>Usable Hosts:</dt>
            <dd>{result.usableHosts}</dd>
          </dl>

          {showExplanation && (
            <div className="explanation">
              <h5>Explanation:</h5>
              <p>A /{cidr} network provides {result.usableHosts} usable host addresses...</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
```

### Interactive Visualization Component

```typescript
// src/components/interactive/NetworkTopology.tsx
interface NetworkTopologyProps {
  topology: 'star' | 'mesh' | 'ring' | 'bus';
  nodes: Array<{
    id: string;
    label: string;
    type: 'router' | 'switch' | 'host';
  }>;
  connections: Array<{
    from: string;
    to: string;
  }>;
  onNodeClick?: (nodeId: string) => void;
}

export const NetworkTopology: React.FC<NetworkTopologyProps> = ({
  topology,
  nodes,
  connections,
  onNodeClick
}) => {
  const [selectedNode, setSelectedNode] = useState<string | null>(null);

  const handleNodeClick = (nodeId: string) => {
    setSelectedNode(nodeId);
    onNodeClick?.(nodeId);
  };

  return (
    <svg className="network-topology" viewBox="0 0 800 600">
      {/* Render connections */}
      {connections.map(conn => (
        <line
          key={`${conn.from}-${conn.to}`}
          x1={/* calculate */}
          y1={/* calculate */}
          x2={/* calculate */}
          y2={/* calculate */}
          stroke="#333"
          strokeWidth="2"
        />
      ))}

      {/* Render nodes */}
      {nodes.map(node => (
        <g
          key={node.id}
          onClick={() => handleNodeClick(node.id)}
          className={`node ${selectedNode === node.id ? 'selected' : ''}`}
        >
          <circle cx={/* position */} cy={/* position */} r="30" />
          <text x={/* position */} y={/* position */}>
            {node.label}
          </text>
        </g>
      ))}
    </svg>
  );
};
```

## Styling Guidelines

### Using Tailwind CSS

```tsx
<div className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
  <h2 className="text-2xl font-bold text-gray-800 mb-4">Title</h2>
  <p className="text-gray-600">Content</p>
</div>
```

### CSS Modules

```typescript
// Component.module.css
.container {
  padding: 1rem;
  background: var(--color-background);
}

.title {
  font-size: 1.5rem;
  font-weight: bold;
  color: var(--color-primary);
}

// Component.tsx
import styles from './Component.module.css';

<div className={styles.container}>
  <h2 className={styles.title}>Title</h2>
</div>
```

### Dynamic Styles

```typescript
import clsx from 'clsx';

interface ButtonProps {
  variant: 'primary' | 'secondary';
  size: 'sm' | 'md' | 'lg';
}

const Button: React.FC<ButtonProps> = ({ variant, size }) => {
  return (
    <button
      className={clsx(
        'btn',
        `btn-${variant}`,
        `btn-${size}`,
        'hover:opacity-80 transition-opacity'
      )}
    >
      Click me
    </button>
  );
};
```

## Props and TypeScript

### Defining Props Interfaces

```typescript
// Basic props
interface ComponentProps {
  title: string;
  count: number;
  isActive: boolean;
  items: string[];
}

// Optional props
interface ComponentProps {
  required: string;
  optional?: number;
  callback?: () => void;
}

// Union types
interface ComponentProps {
  variant: 'primary' | 'secondary' | 'danger';
  size: 'sm' | 'md' | 'lg';
}

// Generic props
interface ListProps<T> {
  items: T[];
  renderItem: (item: T) => React.ReactNode;
}

// Extending HTML attributes
interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary';
}

// Children props
interface ContainerProps {
  children: React.ReactNode;
}

// Function props
interface FormProps {
  onSubmit: (data: FormData) => void;
  onChange: (field: string, value: string) => void;
}
```

### Props Validation and Defaults

```typescript
interface ComponentProps {
  title: string;
  variant?: 'default' | 'highlighted';
  size?: 'sm' | 'md' | 'lg';
}

export const Component: React.FC<ComponentProps> = ({
  title,
  variant = 'default',
  size = 'md'
}) => {
  // Component implementation
};
```

## Testing Components

See [Testing Guide](./testing-guide.md) for comprehensive testing documentation.

### Basic Component Test

```typescript
// MyComponent.test.tsx
import { render, screen, fireEvent } from '@testing-library/react';
import { MyComponent } from './MyComponent';

describe('MyComponent', () => {
  it('renders with title', () => {
    render(<MyComponent title="Test Title" />);
    expect(screen.getByText('Test Title')).toBeInTheDocument();
  });

  it('calls onAction when button is clicked', () => {
    const handleAction = jest.fn();
    render(<MyComponent title="Test" onAction={handleAction} />);

    fireEvent.click(screen.getByText('Take Action'));
    expect(handleAction).toHaveBeenCalledTimes(1);
  });
});
```

## Examples

### Complete Quiz Component Example

```typescript
// src/components/interactive/Quiz.tsx
import React, { useState } from 'react';

interface Question {
  id: string;
  text: string;
  options: string[];
  correctAnswer: number;
  explanation?: string;
}

interface QuizProps {
  questions: Question[];
  onComplete?: (score: number, total: number) => void;
}

export const Quiz: React.FC<QuizProps> = ({ questions, onComplete }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, number>>({});
  const [showResults, setShowResults] = useState(false);

  const currentQuestion = questions[currentIndex];

  const handleAnswer = (answerIndex: number) => {
    setAnswers(prev => ({
      ...prev,
      [currentQuestion.id]: answerIndex
    }));
  };

  const handleNext = () => {
    if (currentIndex < questions.length - 1) {
      setCurrentIndex(prev => prev + 1);
    } else {
      calculateResults();
    }
  };

  const handlePrevious = () => {
    setCurrentIndex(prev => Math.max(0, prev - 1));
  };

  const calculateResults = () => {
    const score = questions.reduce((acc, question) => {
      return acc + (answers[question.id] === question.correctAnswer ? 1 : 0);
    }, 0);

    setShowResults(true);
    onComplete?.(score, questions.length);
  };

  if (showResults) {
    const score = questions.reduce((acc, question) => {
      return acc + (answers[question.id] === question.correctAnswer ? 1 : 0);
    }, 0);

    return (
      <div className="quiz-results">
        <h2>Quiz Complete!</h2>
        <p>Your score: {score} / {questions.length}</p>
        <p>Percentage: {Math.round((score / questions.length) * 100)}%</p>
      </div>
    );
  }

  return (
    <div className="quiz-container">
      <div className="quiz-progress">
        Question {currentIndex + 1} of {questions.length}
      </div>

      <div className="quiz-question">
        <h3>{currentQuestion.text}</h3>

        <div className="quiz-options">
          {currentQuestion.options.map((option, index) => (
            <button
              key={index}
              onClick={() => handleAnswer(index)}
              className={`quiz-option ${
                answers[currentQuestion.id] === index ? 'selected' : ''
              }`}
            >
              {option}
            </button>
          ))}
        </div>
      </div>

      <div className="quiz-navigation">
        <button
          onClick={handlePrevious}
          disabled={currentIndex === 0}
        >
          Previous
        </button>

        <button
          onClick={handleNext}
          disabled={answers[currentQuestion.id] === undefined}
        >
          {currentIndex === questions.length - 1 ? 'Finish' : 'Next'}
        </button>
      </div>
    </div>
  );
};
```

## Best Practices Checklist

- [ ] Component has a single, clear responsibility
- [ ] Props are properly typed with TypeScript
- [ ] Component is documented with JSDoc comments
- [ ] Accessibility attributes are included (ARIA labels, roles)
- [ ] Component handles loading and error states
- [ ] Event handlers use useCallback when appropriate
- [ ] Component is tested with unit tests
- [ ] Styles are scoped or use utility classes
- [ ] Component is exported from index.ts
- [ ] Props have sensible default values
- [ ] Component is memoized if expensive to render

## Next Steps

- Review the [Component API Reference](../api/component-api.md)
- Check out [Testing Guide](./testing-guide.md) for testing strategies
- See existing components in `src/components/` for more examples

---

Need help? Open an issue or reach out to the development team!
