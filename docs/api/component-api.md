# Component API Reference

## Complete API Documentation for Learning Platform Components

This document provides comprehensive API documentation for all reusable components in the CompTIA Network+ learning platform.

## Table of Contents

1. [UI Components](#ui-components)
2. [Interactive Learning Components](#interactive-learning-components)
3. [Layout Components](#layout-components)
4. [Form Components](#form-components)
5. [Hooks](#hooks)
6. [Utilities](#utilities)

## UI Components

### Button

Primary button component for user interactions.

```typescript
interface ButtonProps {
  /**
   * Button label text
   */
  label: string;

  /**
   * Click handler
   */
  onClick: () => void;

  /**
   * Button visual style
   * @default 'primary'
   */
  variant?: 'primary' | 'secondary' | 'danger' | 'success';

  /**
   * Button size
   * @default 'md'
   */
  size?: 'sm' | 'md' | 'lg';

  /**
   * Disabled state
   * @default false
   */
  disabled?: boolean;

  /**
   * Loading state
   * @default false
   */
  loading?: boolean;

  /**
   * Full width button
   * @default false
   */
  fullWidth?: boolean;

  /**
   * Optional icon
   */
  icon?: React.ReactNode;
}
```

**Example:**
```tsx
<Button
  label="Start Quiz"
  onClick={handleStart}
  variant="primary"
  size="lg"
  icon={<PlayIcon />}
/>
```

---

### Card

Container component for displaying content with consistent styling.

```typescript
interface CardProps {
  /**
   * Card title
   */
  title?: string;

  /**
   * Card content
   */
  children: React.ReactNode;

  /**
   * Card visual style
   * @default 'default'
   */
  variant?: 'default' | 'highlighted' | 'bordered';

  /**
   * Add padding to card content
   * @default true
   */
  padding?: boolean;

  /**
   * Optional header actions
   */
  headerActions?: React.ReactNode;

  /**
   * Optional footer content
   */
  footer?: React.ReactNode;

  /**
   * Click handler for entire card
   */
  onClick?: () => void;

  /**
   * Hoverable state
   * @default false
   */
  hoverable?: boolean;
}
```

**Example:**
```tsx
<Card
  title="Lesson 1: Introduction"
  variant="highlighted"
  headerActions={<Button label="Edit" onClick={handleEdit} />}
  footer={<ProgressBar progress={75} />}
>
  <p>Lesson content goes here...</p>
</Card>
```

---

### ProgressBar

Visual progress indicator.

```typescript
interface ProgressBarProps {
  /**
   * Current progress (0-100)
   */
  progress: number;

  /**
   * Progress bar color
   * @default 'primary'
   */
  variant?: 'primary' | 'success' | 'warning' | 'danger';

  /**
   * Show percentage label
   * @default true
   */
  showLabel?: boolean;

  /**
   * Progress bar height
   * @default 'md'
   */
  size?: 'sm' | 'md' | 'lg';

  /**
   * Animated progress transition
   * @default true
   */
  animated?: boolean;
}
```

**Example:**
```tsx
<ProgressBar
  progress={65}
  variant="success"
  size="lg"
  showLabel
/>
```

---

### Modal

Modal dialog component for overlays and focused interactions.

```typescript
interface ModalProps {
  /**
   * Modal visibility state
   */
  isOpen: boolean;

  /**
   * Close handler
   */
  onClose: () => void;

  /**
   * Modal title
   */
  title: string;

  /**
   * Modal content
   */
  children: React.ReactNode;

  /**
   * Modal size
   * @default 'md'
   */
  size?: 'sm' | 'md' | 'lg' | 'xl' | 'full';

  /**
   * Close on backdrop click
   * @default true
   */
  closeOnBackdrop?: boolean;

  /**
   * Close on escape key
   * @default true
   */
  closeOnEscape?: boolean;

  /**
   * Footer actions
   */
  footer?: React.ReactNode;
}
```

**Example:**
```tsx
<Modal
  isOpen={showModal}
  onClose={() => setShowModal(false)}
  title="Quiz Results"
  size="lg"
  footer={
    <>
      <Button label="Review Answers" onClick={handleReview} />
      <Button label="Continue" onClick={handleContinue} />
    </>
  }
>
  <QuizResults score={score} total={total} />
</Modal>
```

---

## Interactive Learning Components

### Quiz

Interactive quiz component with multiple-choice questions.

```typescript
interface Question {
  id: string;
  text: string;
  options: string[];
  correctAnswer: number;
  explanation?: string;
}

interface QuizProps {
  /**
   * Array of quiz questions
   */
  questions: Question[];

  /**
   * Quiz title
   */
  title?: string;

  /**
   * Completion callback
   */
  onComplete?: (score: number, total: number) => void;

  /**
   * Show explanations after each question
   * @default false
   */
  showExplanations?: boolean;

  /**
   * Allow navigation between questions
   * @default true
   */
  allowNavigation?: boolean;

  /**
   * Show progress indicator
   * @default true
   */
  showProgress?: boolean;

  /**
   * Time limit in seconds (optional)
   */
  timeLimit?: number;

  /**
   * Shuffle questions order
   * @default false
   */
  shuffleQuestions?: boolean;
}
```

**Example:**
```tsx
<Quiz
  questions={quizQuestions}
  title="Subnetting Basics Quiz"
  showExplanations
  showProgress
  timeLimit={600}
  onComplete={(score, total) => {
    console.log(`Score: ${score}/${total}`);
  }}
/>
```

---

### SubnetCalculator

Interactive subnet calculation tool.

```typescript
interface SubnetResult {
  networkAddress: string;
  broadcastAddress: string;
  firstHost: string;
  lastHost: string;
  usableHosts: number;
  subnetMask: string;
  wildcardMask: string;
  binaryMask: string;
}

interface SubnetCalculatorProps {
  /**
   * Initial IP address
   */
  defaultIP?: string;

  /**
   * Initial CIDR
   */
  defaultCIDR?: number;

  /**
   * Calculation callback
   */
  onCalculate?: (result: SubnetResult) => void;

  /**
   * Show detailed explanation
   * @default true
   */
  showExplanation?: boolean;

  /**
   * Show binary representations
   * @default false
   */
  showBinary?: boolean;

  /**
   * Enable subnet splitting
   * @default false
   */
  enableSplitting?: boolean;
}
```

**Example:**
```tsx
<SubnetCalculator
  defaultIP="192.168.1.0"
  defaultCIDR={24}
  showExplanation
  showBinary
  onCalculate={(result) => {
    console.log('Subnet calculated:', result);
  }}
/>
```

---

### NetworkTopology

Interactive network topology visualization.

```typescript
interface NetworkNode {
  id: string;
  label: string;
  type: 'router' | 'switch' | 'host' | 'server' | 'firewall';
  position?: { x: number; y: number };
}

interface NetworkConnection {
  from: string;
  to: string;
  label?: string;
  type?: 'ethernet' | 'fiber' | 'wireless';
}

interface NetworkTopologyProps {
  /**
   * Network topology type
   */
  topology: 'star' | 'mesh' | 'ring' | 'bus' | 'tree' | 'hybrid';

  /**
   * Network nodes
   */
  nodes: NetworkNode[];

  /**
   * Node connections
   */
  connections: NetworkConnection[];

  /**
   * Node click handler
   */
  onNodeClick?: (nodeId: string) => void;

  /**
   * Connection click handler
   */
  onConnectionClick?: (from: string, to: string) => void;

  /**
   * Enable interactive mode
   * @default true
   */
  interactive?: boolean;

  /**
   * Show node labels
   * @default true
   */
  showLabels?: boolean;

  /**
   * Zoom controls
   * @default true
   */
  zoomControls?: boolean;
}
```

**Example:**
```tsx
<NetworkTopology
  topology="star"
  nodes={[
    { id: '1', label: 'Router', type: 'router' },
    { id: '2', label: 'PC-1', type: 'host' },
    { id: '3', label: 'PC-2', type: 'host' }
  ]}
  connections={[
    { from: '1', to: '2', type: 'ethernet' },
    { from: '1', to: '3', type: 'ethernet' }
  ]}
  onNodeClick={(id) => console.log('Node clicked:', id)}
  interactive
/>
```

---

### PacketSimulator

Simulate network packet transmission.

```typescript
interface PacketSimulatorProps {
  /**
   * Network nodes for simulation
   */
  nodes: NetworkNode[];

  /**
   * Network connections
   */
  connections: NetworkConnection[];

  /**
   * Packet sent callback
   */
  onPacketSent?: (from: string, to: string, packet: Packet) => void;

  /**
   * Show packet details
   * @default true
   */
  showPacketDetails?: boolean;

  /**
   * Animation speed (1-10)
   * @default 5
   */
  animationSpeed?: number;

  /**
   * Packet types to simulate
   */
  packetTypes?: Array<'tcp' | 'udp' | 'icmp' | 'http'>;
}
```

**Example:**
```tsx
<PacketSimulator
  nodes={networkNodes}
  connections={networkConnections}
  showPacketDetails
  animationSpeed={7}
  packetTypes={['tcp', 'http']}
  onPacketSent={(from, to, packet) => {
    console.log(`Packet sent from ${from} to ${to}`);
  }}
/>
```

---

### FlashCards

Interactive flashcard component for memorization.

```typescript
interface FlashCard {
  id: string;
  front: string;
  back: string;
  category?: string;
  difficulty?: 'easy' | 'medium' | 'hard';
}

interface FlashCardsProps {
  /**
   * Array of flashcards
   */
  cards: FlashCard[];

  /**
   * Study mode
   * @default 'sequential'
   */
  mode?: 'sequential' | 'random' | 'spaced-repetition';

  /**
   * Auto-flip after duration (seconds)
   */
  autoFlipAfter?: number;

  /**
   * Completion callback
   */
  onComplete?: (studiedCards: string[]) => void;

  /**
   * Card flip callback
   */
  onFlip?: (cardId: string) => void;

  /**
   * Show progress
   * @default true
   */
  showProgress?: boolean;
}
```

**Example:**
```tsx
<FlashCards
  cards={studyCards}
  mode="spaced-repetition"
  showProgress
  onComplete={(studied) => {
    console.log('Studied cards:', studied);
  }}
/>
```

---

## Layout Components

### Header

Application header with navigation.

```typescript
interface HeaderProps {
  /**
   * Application title
   */
  title: string;

  /**
   * Navigation items
   */
  navItems?: Array<{
    label: string;
    href: string;
    active?: boolean;
  }>;

  /**
   * User info
   */
  user?: {
    name: string;
    avatar?: string;
  };

  /**
   * Header actions
   */
  actions?: React.ReactNode;

  /**
   * Fixed header
   * @default true
   */
  fixed?: boolean;
}
```

---

### Sidebar

Side navigation panel.

```typescript
interface SidebarProps {
  /**
   * Navigation items
   */
  items: Array<{
    id: string;
    label: string;
    icon?: React.ReactNode;
    href?: string;
    children?: Array<{
      label: string;
      href: string;
    }>;
  }>;

  /**
   * Active item ID
   */
  activeId?: string;

  /**
   * Collapsed state
   * @default false
   */
  collapsed?: boolean;

  /**
   * Toggle collapsed
   */
  onToggle?: () => void;
}
```

---

## Form Components

### Input

Text input field with validation.

```typescript
interface InputProps {
  /**
   * Input label
   */
  label: string;

  /**
   * Input value
   */
  value: string;

  /**
   * Change handler
   */
  onChange: (value: string) => void;

  /**
   * Input type
   * @default 'text'
   */
  type?: 'text' | 'email' | 'password' | 'number' | 'tel';

  /**
   * Placeholder text
   */
  placeholder?: string;

  /**
   * Required field
   * @default false
   */
  required?: boolean;

  /**
   * Error message
   */
  error?: string;

  /**
   * Helper text
   */
  helperText?: string;

  /**
   * Disabled state
   * @default false
   */
  disabled?: boolean;
}
```

---

### Select

Dropdown select component.

```typescript
interface SelectProps {
  /**
   * Select label
   */
  label: string;

  /**
   * Selected value
   */
  value: string;

  /**
   * Change handler
   */
  onChange: (value: string) => void;

  /**
   * Select options
   */
  options: Array<{
    value: string;
    label: string;
    disabled?: boolean;
  }>;

  /**
   * Placeholder text
   */
  placeholder?: string;

  /**
   * Required field
   * @default false
   */
  required?: boolean;

  /**
   * Error message
   */
  error?: string;
}
```

---

## Hooks

### useQuiz

Custom hook for quiz state management.

```typescript
function useQuiz(questions: Question[]): {
  currentIndex: number;
  currentQuestion: Question;
  answers: Record<string, number>;
  score: number;
  isComplete: boolean;
  nextQuestion: () => void;
  previousQuestion: () => void;
  submitAnswer: (questionId: string, answerIndex: number) => void;
  calculateScore: () => number;
  reset: () => void;
}
```

**Example:**
```typescript
const {
  currentQuestion,
  nextQuestion,
  submitAnswer,
  score,
  isComplete
} = useQuiz(quizQuestions);
```

---

### useLocalStorage

Custom hook for localStorage persistence.

```typescript
function useLocalStorage<T>(
  key: string,
  initialValue: T
): [T, (value: T) => void, () => void]
```

**Example:**
```typescript
const [progress, setProgress, clearProgress] = useLocalStorage('lesson-progress', {});
```

---

### useDebounce

Custom hook for debouncing values.

```typescript
function useDebounce<T>(value: T, delay: number): T
```

**Example:**
```typescript
const debouncedSearchTerm = useDebounce(searchTerm, 500);
```

---

## Utilities

### Subnet Utilities

```typescript
/**
 * Calculate usable hosts in a subnet
 */
function calculateUsableHosts(cidr: number): number

/**
 * Validate IPv4 address format
 */
function isValidIPv4(ip: string): boolean

/**
 * Convert CIDR to subnet mask
 */
function cidrToSubnetMask(cidr: number): string

/**
 * Calculate network address
 */
function calculateNetworkAddress(ip: string, cidr: number): string

/**
 * Calculate broadcast address
 */
function calculateBroadcastAddress(ip: string, cidr: number): string
```

---

### Validation Utilities

```typescript
/**
 * Validate email format
 */
function isValidEmail(email: string): boolean

/**
 * Validate MAC address
 */
function isValidMAC(mac: string): boolean

/**
 * Validate port number
 */
function isValidPort(port: number): boolean
```

---

## Type Definitions

### Common Types

```typescript
type NetworkDeviceType = 'router' | 'switch' | 'host' | 'server' | 'firewall';
type TopologyType = 'star' | 'mesh' | 'ring' | 'bus' | 'tree' | 'hybrid';
type ProtocolType = 'tcp' | 'udp' | 'icmp' | 'http' | 'https';
type DifficultyLevel = 'beginner' | 'intermediate' | 'advanced' | 'expert';

interface Lesson {
  id: string;
  title: string;
  description: string;
  content: string;
  difficulty: DifficultyLevel;
  duration: number; // minutes
  topics: string[];
  quiz?: Quiz;
}

interface UserProgress {
  userId: string;
  completedLessons: string[];
  quizScores: Record<string, number>;
  lastAccessed: Date;
}
```

---

## Usage Examples

### Complete Lesson Page Example

```tsx
import { Quiz, SubnetCalculator, ProgressBar, Card } from '@/components';
import { useQuiz, useLocalStorage } from '@/hooks';

export function LessonPage({ lesson }: { lesson: Lesson }) {
  const [progress, setProgress] = useLocalStorage('progress', 0);
  const quiz = useQuiz(lesson.quiz?.questions || []);

  return (
    <div className="lesson-page">
      <ProgressBar progress={progress} />

      <Card title={lesson.title} variant="highlighted">
        <div dangerouslySetInnerHTML={{ __html: lesson.content }} />
      </Card>

      <SubnetCalculator
        showExplanation
        showBinary
        onCalculate={(result) => {
          console.log('Calculated:', result);
        }}
      />

      {lesson.quiz && (
        <Quiz
          questions={lesson.quiz.questions}
          showExplanations
          onComplete={(score, total) => {
            setProgress(100);
            console.log(`Quiz complete: ${score}/${total}`);
          }}
        />
      )}
    </div>
  );
}
```

---

## Additional Resources

- [Development Guide](../guides/development-guide.md)
- [Component Guide](../guides/component-guide.md)
- [Testing Guide](../guides/testing-guide.md)

---

**Last Updated:** 2025-10-28

For questions or suggestions, please open an issue or submit a pull request.
