# Type System Quick Reference

Quick reference guide for the CompTIA Network+ TypeScript type system.

## Import Patterns

### Single Import
```typescript
import type { AnalysisResult } from '@/types';
```

### Multiple Imports
```typescript
import type {
  AnalysisResult,
  TopologyBuilderConfig,
  TransformOptions
} from '@/types';
```

### Aliased Imports
```typescript
import type {
  PerformanceMetrics as TopologyMetrics
} from '@/types/topology.types';

import type {
  PerformanceMetrics as CommonMetrics
} from '@/types/common.types';
```

---

## Type Categories

### 1. Sanitization Types
**File:** `src/types/sanitization.types.ts`

```typescript
import type {
  SanitizableData,      // Union of all sanitizable types
  SanitizableObject,    // Object with sanitizable properties
  SanitizationResult,   // Result with metadata
} from '@/types';

// Usage
function sanitize(input: SanitizableData): SanitizationResult {
  // implementation
}
```

### 2. Topology Types
**File:** `src/types/topology.types.ts`

```typescript
import type {
  AnalysisResult,       // Complete topology analysis
  TransformOptions,     // Transformation configuration
  TopologyBuilderConfig,// Builder settings
  BottleneckInfo,       // Bottleneck identification
} from '@/types';

// Usage
function analyzeTopology(config: TopologyBuilderConfig): AnalysisResult {
  // implementation
}
```

### 3. Protocol Types
**File:** `src/types/protocol.types.ts`

```typescript
import type {
  PortDefinition,       // Port specification
  ProtocolInfo,         // Protocol details
  TrainingSession,      // Learning session
  LearningAnalytics,    // Performance analytics
} from '@/types';

// Usage
function analyzeSession(session: TrainingSession): LearningAnalytics {
  // implementation
}
```

### 4. Cloud Types
**File:** `src/types/cloud.types.ts`

```typescript
import type {
  CloudMigrationScenario,  // Migration scenario
  MigrationPlan,           // Complete plan
  ServiceComparison,       // Service comparison
  CostOptimization,        // Cost savings
} from '@/types';

// Usage
function planMigration(scenario: CloudMigrationScenario): MigrationPlan {
  // implementation
}
```

### 5. Network Types
**File:** `src/types/network.types.ts`

```typescript
import type {
  IPv6Config,           // IPv6 configuration
  PacketRoute,          // Packet journey
  NetworkPathAnalysis,  // Path analysis
  RoutingTable,         // Routing information
} from '@/types';

// Usage
function analyzeRoute(route: PacketRoute): NetworkPathAnalysis {
  // implementation
}
```

### 6. Common Types
**File:** `src/types/common.types.ts`

```typescript
import type {
  ProgressData,         // Progress tracking
  ValidationResult,     // Validation results
  LoadingState,         // Loading management
  APIResponse,          // API responses
} from '@/types';

// Usage
function validateInput(input: string): ValidationResult {
  // implementation
}
```

---

## Common Patterns

### Generic Types

```typescript
// API Response
import type { APIResponse } from '@/types';

const response: APIResponse<AnalysisResult> = {
  success: true,
  data: analysisResult,
  metadata: { /* ... */ }
};

// Cache Entry
import type { CacheEntry } from '@/types';

const cache: CacheEntry<TopologyDefinition> = {
  key: 'topology-mesh',
  value: meshTopology,
  timestamp: new Date(),
  hits: 0
};

// Field State
import type { FieldState } from '@/types';

const emailField: FieldState<string> = {
  value: 'user@example.com',
  touched: true,
  dirty: true,
  error: undefined,
  validating: false
};
```

### Type Guards

```typescript
import type { SanitizableData, SanitizableObject } from '@/types';

function isSanitizableObject(data: SanitizableData): data is SanitizableObject {
  return typeof data === 'object' && data !== null && !Array.isArray(data);
}

// Usage
if (isSanitizableObject(input)) {
  // TypeScript knows input is SanitizableObject
  const keys = Object.keys(input);
}
```

### Utility Types

```typescript
import type { PartialBy, RequiredBy } from '@/types';

// Make some properties optional
type OptionalUserPrefs = PartialBy<UserPreferences, 'theme' | 'accessibility'>;

// Make some properties required
type RequiredCloudConfig = RequiredBy<CloudSummary, 'deploymentModel' | 'serviceModel'>;
```

---

## Component Props Patterns

### Base Component Props

```typescript
import type { BaseComponentProps } from '@/types';

interface MyComponentProps extends BaseComponentProps {
  title: string;
  onComplete?: () => void;
}

export function MyComponent({ title, className, testId }: MyComponentProps) {
  return <div className={className} data-testid={testId}>{title}</div>;
}
```

### Interactive Components

```typescript
import type { InteractiveComponentProps, AnalysisResult } from '@/types';

interface TopologyAnalyzerProps extends InteractiveComponentProps {
  topology: TopologyType;
  config: TopologyBuilderConfig;
}

export function TopologyAnalyzer({
  topology,
  config,
  onComplete,
  onProgress,
  disabled
}: TopologyAnalyzerProps) {
  // implementation
}
```

### Scorable Components

```typescript
import type { ScorableComponentProps, Question } from '@/types';

interface QuizComponentProps extends ScorableComponentProps {
  domain: string;
}

export function QuizComponent({
  questions,
  timeLimit,
  showFeedback,
  onComplete,
  domain
}: QuizComponentProps) {
  // implementation
}
```

---

## State Management Patterns

### Loading State

```typescript
import type { LoadingState } from '@/types';

const [loading, setLoading] = useState<LoadingState>({
  isLoading: false,
  operation: undefined,
  progress: undefined
});

// Start loading
setLoading({
  isLoading: true,
  operation: 'Analyzing topology',
  progress: 0,
  startTime: new Date()
});

// Update progress
setLoading(prev => ({ ...prev, progress: 50 }));

// Complete
setLoading({ isLoading: false });
```

### Error State

```typescript
import type { ErrorState } from '@/types';

const [error, setError] = useState<ErrorState>({
  hasError: false,
  recoverable: true
});

// Set error
setError({
  hasError: true,
  error: new Error('Analysis failed'),
  errorCode: 'ANALYSIS_ERROR',
  message: 'Failed to analyze topology',
  timestamp: new Date(),
  recoverable: true,
  retry: () => analyzeTopology()
});
```

### Pagination State

```typescript
import type { PaginationState } from '@/types';

const pagination: PaginationState = {
  currentPage: 1,
  pageSize: 10,
  totalItems: 100,
  totalPages: 10,
  hasNextPage: true,
  hasPreviousPage: false
};
```

---

## Validation Patterns

### Basic Validation

```typescript
import type { ValidationResult } from '@/types';

function validateEmail(email: string): ValidationResult {
  const errors = [];

  if (!email) {
    errors.push({
      field: 'email',
      message: 'Email is required',
      code: 'REQUIRED',
      severity: 'error'
    });
  }

  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    errors.push({
      field: 'email',
      message: 'Invalid email format',
      code: 'INVALID_FORMAT',
      severity: 'error'
    });
  }

  return {
    valid: errors.length === 0,
    errors
  };
}
```

### Form Validation

```typescript
import type { ValidationResult, FieldState } from '@/types';

interface FormState {
  email: FieldState<string>;
  password: FieldState<string>;
}

function validateForm(form: FormState): ValidationResult {
  const errors = [];

  if (form.email.error) {
    errors.push({
      field: 'email',
      message: form.email.error,
      code: 'INVALID_EMAIL',
      severity: 'error'
    });
  }

  if (form.password.error) {
    errors.push({
      field: 'password',
      message: form.password.error,
      code: 'INVALID_PASSWORD',
      severity: 'error'
    });
  }

  return {
    valid: errors.length === 0,
    errors,
    warnings: []
  };
}
```

---

## Testing Patterns

### Mock Data Creation

```typescript
import type {
  AnalysisResult,
  TopologyType,
  RedundancyMetrics
} from '@/types';

function createMockAnalysisResult(
  overrides?: Partial<AnalysisResult>
): AnalysisResult {
  return {
    topology: 'mesh',
    nodeCount: 10,
    edgeCount: 15,
    redundancy: createMockRedundancyMetrics(),
    spofAnalysis: [],
    performanceMetrics: createMockPerformanceMetrics(),
    recommendations: [],
    score: 85,
    ...overrides
  };
}
```

### Type-Safe Test Fixtures

```typescript
import type { TrainingSession } from '@/types';

const testSessions: TrainingSession[] = [
  {
    sessionId: 'test-1',
    userId: 'user-1',
    startTime: new Date('2025-01-01'),
    endTime: new Date('2025-01-01'),
    mode: 'flashcards',
    cardsReviewed: 20,
    correctAnswers: 18,
    incorrectAnswers: 2,
    averageResponseTime: 3.5,
    progress: [],
    achievements: [],
    score: 90
  }
];
```

---

## Best Practices

### 1. Always Use Type Imports
```typescript
// ✅ Good
import type { AnalysisResult } from '@/types';

// ❌ Bad
import { AnalysisResult } from '@/types';
```

### 2. Prefer Specific Types Over Generic
```typescript
// ✅ Good
import type { SanitizableObject } from '@/types';
const data: SanitizableObject = {};

// ❌ Bad
const data: any = {};
```

### 3. Use Utility Types for Variants
```typescript
// ✅ Good
import type { CloudSummary } from '@/types';
type PartialCloudSummary = Partial<CloudSummary>;

// ❌ Bad
interface PartialCloudSummary {
  deploymentModel?: string;
  serviceModel?: string;
  // ... repeat all fields
}
```

### 4. Document Complex Types
```typescript
/**
 * Represents a complete topology analysis result
 * including performance metrics and recommendations
 */
interface AnalysisResult {
  // ...
}
```

### 5. Use Discriminated Unions
```typescript
type LoadingState =
  | { status: 'idle' }
  | { status: 'loading'; progress: number }
  | { status: 'success'; data: unknown }
  | { status: 'error'; error: Error };

function handleState(state: LoadingState) {
  switch (state.status) {
    case 'loading':
      // TypeScript knows state.progress exists
      console.log(state.progress);
      break;
    // ...
  }
}
```

---

## Migration Checklist

### Replacing `any` Types

- [ ] Identify all `any` occurrences (use grep/search)
- [ ] Determine appropriate replacement type
- [ ] Update function signatures
- [ ] Add type guards where needed
- [ ] Update tests with proper types
- [ ] Verify TypeScript compilation
- [ ] Test runtime behavior

### Component Decomposition

- [ ] Identify large components (>500 lines)
- [ ] Define component boundaries with types
- [ ] Extract subcomponents with typed props
- [ ] Create type-safe data flow
- [ ] Add integration tests
- [ ] Update documentation

---

## Quick Reference Table

| Category | Key Types | Use Cases |
|----------|-----------|-----------|
| **Sanitization** | `SanitizableData`, `SanitizationResult` | Input sanitization, XSS prevention |
| **Topology** | `AnalysisResult`, `TransformOptions` | Network topology analysis |
| **Protocol** | `ProtocolInfo`, `TrainingSession` | Port/protocol learning |
| **Cloud** | `MigrationPlan`, `ServiceComparison` | Cloud migration planning |
| **Network** | `IPv6Config`, `PacketRoute` | Network simulation |
| **Common** | `ValidationResult`, `ProgressData` | Shared utilities |

---

**Last Updated:** 2025-12-04
**Type System Version:** 1.0.0
