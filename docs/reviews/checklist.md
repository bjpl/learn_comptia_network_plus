# Code Quality Checklist - CompTIA Network+ Learning Platform

This checklist should be used for every pull request and code review to ensure consistent quality standards across the codebase.

---

## 📋 Pre-Development Checklist

### Before Starting Implementation
- [ ] User story/requirement is clearly defined
- [ ] Acceptance criteria are documented
- [ ] Component specifications are reviewed
- [ ] Design mockups are approved (if applicable)
- [ ] Dependencies are identified
- [ ] Estimated effort is reasonable

---

## 🔍 Code Review Checklist

### 1. TypeScript Usage

#### Type Safety
- [ ] **No `any` types** - All variables have explicit types
- [ ] **Proper interface/type definitions** - Reusable and well-documented
- [ ] **Generic types used appropriately** - Where applicable
- [ ] **Discriminated unions** - For complex state variations
- [ ] **Type guards** - For runtime type checking
- [ ] **Proper null/undefined handling** - Using optional chaining and nullish coalescing

#### Type Quality Examples
```typescript
// ✅ GOOD: Properly typed
interface LayerData {
  id: LayerNumber; // 1-7
  name: LayerName;
  protocols: Protocol[];
  pdu: PDUType;
  isComplete: boolean;
}

// ❌ BAD: Using any
function processLayer(data: any) { }

// ✅ GOOD: Type guard
function isLayerData(obj: unknown): obj is LayerData {
  return (
    typeof obj === 'object' &&
    obj !== null &&
    'id' in obj &&
    typeof obj.id === 'number'
  );
}
```

---

### 2. React Component Quality

#### Component Structure
- [ ] **Functional components** - Using hooks (no class components)
- [ ] **Props properly typed** - With interface/type
- [ ] **Proper memoization** - Using `React.memo` for expensive components
- [ ] **Custom hooks extracted** - For reusable logic
- [ ] **Single Responsibility** - Component does one thing well
- [ ] **Proper file naming** - PascalCase for components

#### Hooks Usage
- [ ] **Dependencies arrays correct** - No missing or unnecessary deps
- [ ] **useCallback for functions** - Passed to child components
- [ ] **useMemo for expensive calculations** - Only where needed
- [ ] **useEffect cleanup** - Returning cleanup functions
- [ ] **Custom hooks start with 'use'** - Following convention

#### Component Quality Examples
```typescript
// ✅ GOOD: Well-structured component
interface LayerAccordionProps {
  layer: LayerData;
  onUpdate: (layer: LayerData) => void;
  isExpanded: boolean;
}

const LayerAccordion: React.FC<LayerAccordionProps> = memo(({
  layer,
  onUpdate,
  isExpanded
}) => {
  const [localState, setLocalState] = useState<string>('');

  const handleChange = useCallback((newData: Partial<LayerData>) => {
    onUpdate({ ...layer, ...newData });
  }, [layer, onUpdate]);

  useEffect(() => {
    // Setup
    const subscription = subscribe();

    // Cleanup
    return () => subscription.unsubscribe();
  }, [layer.id]);

  return (
    <section aria-expanded={isExpanded}>
      {/* Content */}
    </section>
  );
});

LayerAccordion.displayName = 'LayerAccordion';

// ❌ BAD: Multiple issues
const LayerAccordion = (props) => { // No types
  const [data, setData] = useState(); // No type

  useEffect(() => {
    // No cleanup
    startInterval();
  }, []); // Missing deps

  return <div>{/* No semantics */}</div>;
};
```

---

### 3. State Management

#### State Organization
- [ ] **Appropriate state level** - Local vs global vs server
- [ ] **Immutable updates** - Never mutating state directly
- [ ] **Proper initialization** - With correct types
- [ ] **Minimal state** - Deriving values when possible
- [ ] **Context not overused** - Only for truly global state

#### State Examples
```typescript
// ✅ GOOD: Proper state management
const [progress, setProgress] = useState<UserProgress>({
  completedComponents: [],
  currentScore: 0,
  lastActivity: Date.now(),
});

// Update immutably
setProgress(prev => ({
  ...prev,
  completedComponents: [...prev.completedComponents, newComponent],
}));

// ✅ GOOD: Derived state
const totalScore = useMemo(() => {
  return progress.completedComponents.reduce(
    (sum, comp) => sum + comp.score,
    0
  );
}, [progress.completedComponents]);

// ❌ BAD: Mutating state
progress.completedComponents.push(newComponent); // Direct mutation
setProgress(progress); // Not triggering re-render
```

---

### 4. Performance

#### Optimization Checks
- [ ] **Component memoization** - Where appropriate
- [ ] **Expensive calculations memoized** - Using useMemo
- [ ] **Large lists virtualized** - Using react-window or similar
- [ ] **Images optimized** - Proper format and lazy loading
- [ ] **Code splitting** - Route-based and component-based
- [ ] **Bundle size monitored** - Under target limits

#### Performance Examples
```typescript
// ✅ GOOD: Optimized rendering
const ExpensiveComponent = memo(({ data, onAction }) => {
  const processedData = useMemo(() => {
    return heavyComputation(data);
  }, [data]);

  const handleClick = useCallback(() => {
    onAction(processedData);
  }, [processedData, onAction]);

  return <VirtualList items={processedData} />;
});

// ✅ GOOD: Code splitting
const NetworkSimulator = lazy(() =>
  import('./components/NetworkSimulator')
);

// ❌ BAD: No optimization
const ExpensiveComponent = ({ data }) => {
  const processedData = heavyComputation(data); // Runs every render

  return data.map(item => <div key={item.id}>{item.name}</div>);
  // No virtualization for large list
};
```

---

### 5. Accessibility (WCAG 2.1 AA)

#### Semantic HTML
- [ ] **Proper element usage** - `<button>`, `<nav>`, `<section>`, etc.
- [ ] **Heading hierarchy** - Logical h1-h6 structure
- [ ] **Landmark roles** - For page sections
- [ ] **List elements** - For lists (`<ul>`, `<ol>`)

#### ARIA Attributes
- [ ] **ARIA labels** - For interactive elements
- [ ] **ARIA roles** - When semantic HTML insufficient
- [ ] **ARIA states** - `aria-expanded`, `aria-selected`, etc.
- [ ] **ARIA live regions** - For dynamic content updates
- [ ] **ARIA descriptions** - For complex interactions

#### Keyboard Navigation
- [ ] **Focusable elements** - All interactive elements in tab order
- [ ] **Focus indicators** - Visible focus states
- [ ] **Keyboard shortcuts** - For common actions
- [ ] **Escape key handling** - Closes modals/dropdowns
- [ ] **Tab order logical** - Follows visual order

#### Color & Contrast
- [ ] **Contrast ratio 4.5:1** - For normal text
- [ ] **Contrast ratio 3:1** - For large text and UI components
- [ ] **Not relying on color alone** - For conveying information
- [ ] **Focus indicators visible** - Against all backgrounds

#### Accessibility Examples
```typescript
// ✅ GOOD: Accessible component
<section aria-labelledby="layer-heading">
  <h2 id="layer-heading">OSI Layer 3: Network</h2>

  <button
    onClick={handleExpand}
    aria-expanded={isExpanded}
    aria-controls="layer-content"
  >
    {isExpanded ? 'Collapse' : 'Expand'} Layer Details
  </button>

  <div
    id="layer-content"
    role="region"
    aria-live="polite"
  >
    {/* Content */}
  </div>
</section>

// ❌ BAD: Not accessible
<div onClick={handleExpand}>
  <div>Layer 3</div> {/* No heading structure */}
  <div>Click to expand</div> {/* div as button */}
  <div style={{ display: isExpanded ? 'block' : 'none' }}>
    {/* No ARIA states */}
  </div>
</div>
```

---

### 6. Security

#### Input Validation
- [ ] **All user inputs validated** - Using Zod or similar
- [ ] **Input sanitization** - Preventing XSS
- [ ] **Length limits enforced** - Preventing DoS
- [ ] **Type validation** - Server and client side
- [ ] **Whitelist over blacklist** - For allowed characters

#### Data Protection
- [ ] **No sensitive data in localStorage** - Use sessionStorage or memory
- [ ] **API keys not exposed** - Using environment variables
- [ ] **HTTPS enforced** - For all API calls
- [ ] **CSRF protection** - For state-changing operations
- [ ] **Content Security Policy** - Configured appropriately

#### Security Examples
```typescript
// ✅ GOOD: Input validation
import { z } from 'zod';
import DOMPurify from 'dompurify';

const layerExplanationSchema = z.object({
  layerId: z.number().int().min(1).max(7),
  explanation: z.string()
    .min(50, 'Explanation too short')
    .max(500, 'Explanation too long')
    .regex(/^[a-zA-Z0-9\s.,!?-]+$/, 'Invalid characters'),
});

function processInput(input: unknown): LayerExplanation {
  const validated = layerExplanationSchema.parse(input);
  const sanitized = {
    ...validated,
    explanation: DOMPurify.sanitize(validated.explanation),
  };
  return sanitized;
}

// ❌ BAD: No validation
function processInput(input) {
  // Direct use without validation
  return input;
}

// ❌ BAD: Exposing secrets
const apiKey = 'sk_live_12345'; // Hardcoded secret
```

---

### 7. Testing

#### Unit Tests
- [ ] **Test coverage ≥80%** - For new code
- [ ] **All functions tested** - Including edge cases
- [ ] **Component behavior tested** - User interactions
- [ ] **Error cases tested** - Failure scenarios
- [ ] **Test names descriptive** - Explain what's tested

#### Integration Tests
- [ ] **User flows tested** - Complete interactions
- [ ] **API integration tested** - With mock data
- [ ] **State management tested** - Cross-component state
- [ ] **Error handling tested** - Network failures, etc.

#### E2E Tests
- [ ] **Critical paths tested** - Key user journeys
- [ ] **Cross-browser tested** - Major browsers
- [ ] **Mobile tested** - Responsive behavior
- [ ] **Performance tested** - Load times

#### Testing Examples
```typescript
// ✅ GOOD: Comprehensive tests
describe('LayerExplanationBuilder', () => {
  describe('User Interactions', () => {
    it('should allow selecting a protocol', async () => {
      render(<LayerExplanationBuilder userId="test" />);

      const tcpCheckbox = screen.getByRole('checkbox', { name: /tcp/i });
      await userEvent.click(tcpCheckbox);

      expect(tcpCheckbox).toBeChecked();
    });

    it('should show error for invalid protocol selection', async () => {
      render(<LayerExplanationBuilder userId="test" />);

      // Select 4 protocols (max is 3)
      const checkboxes = screen.getAllByRole('checkbox');
      for (let i = 0; i < 4; i++) {
        await userEvent.click(checkboxes[i]);
      }

      expect(screen.getByText(/maximum 3 protocols/i)).toBeInTheDocument();
    });
  });

  describe('Accessibility', () => {
    it('should have no accessibility violations', async () => {
      const { container } = render(<LayerExplanationBuilder userId="test" />);
      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });
  });

  describe('Performance', () => {
    it('should render within 100ms', () => {
      const start = performance.now();
      render(<LayerExplanationBuilder userId="test" />);
      const duration = performance.now() - start;
      expect(duration).toBeLessThan(100);
    });
  });
});

// ❌ BAD: Inadequate tests
it('works', () => {
  render(<LayerExplanationBuilder />); // No assertions
});
```

---

### 8. Code Style & Maintainability

#### Naming Conventions
- [ ] **Components: PascalCase** - `LayerExplanationBuilder`
- [ ] **Functions: camelCase** - `calculateScore`
- [ ] **Constants: UPPER_SNAKE_CASE** - `MAX_PROTOCOLS`
- [ ] **Private functions: leading underscore** - `_internalHelper`
- [ ] **Boolean names: is/has/should** - `isExpanded`, `hasErrors`

#### Code Organization
- [ ] **Files under 300 lines** - Split if larger
- [ ] **Functions under 50 lines** - Extract if larger
- [ ] **Single responsibility** - Each function/component does one thing
- [ ] **DRY principle** - No repeated code
- [ ] **Proper imports** - Organized and grouped

#### Documentation
- [ ] **JSDoc for public APIs** - Functions and components
- [ ] **Inline comments for complexity** - Explaining "why", not "what"
- [ ] **README updated** - For significant features
- [ ] **Type documentation** - Complex types explained

#### Code Style Examples
```typescript
// ✅ GOOD: Well-organized and documented
/**
 * Calculates the assessment score based on user responses
 *
 * @param answers - User's answers to assessment questions
 * @param rubric - Scoring rubric with weights
 * @returns Assessment score from 0-100
 *
 * @example
 * ```ts
 * const score = calculateAssessmentScore(userAnswers, defaultRubric);
 * console.log(score); // 87.5
 * ```
 */
export function calculateAssessmentScore(
  answers: UserAnswers,
  rubric: ScoringRubric
): number {
  // Calculate weighted scores for each section
  const sectionScores = Object.entries(answers).map(([key, answer]) => {
    const weight = rubric.weights[key] ?? 0;
    const points = evaluateAnswer(answer, rubric.criteria[key]);
    return points * weight;
  });

  // Sum and normalize to 0-100 scale
  return Math.round(
    sectionScores.reduce((sum, score) => sum + score, 0)
  );
}

// ❌ BAD: Poor naming and organization
export function calc(a, r) { // No types, unclear names
  let x = 0; // No semantic meaning
  for (let i in a) {
    x += a[i] * r[i]; // Complex logic without explanation
  }
  return x;
}
```

---

### 9. Error Handling

#### Error Boundaries
- [ ] **Error boundaries implemented** - For component trees
- [ ] **Fallback UI provided** - User-friendly error messages
- [ ] **Errors logged** - For debugging

#### Try-Catch Usage
- [ ] **Async operations wrapped** - In try-catch
- [ ] **Errors typed** - Using custom error classes
- [ ] **Error messages clear** - User-facing messages helpful
- [ ] **Graceful degradation** - App continues when possible

#### Error Handling Examples
```typescript
// ✅ GOOD: Comprehensive error handling
class AssessmentError extends Error {
  constructor(
    message: string,
    public readonly code: string,
    public readonly details?: unknown
  ) {
    super(message);
    this.name = 'AssessmentError';
  }
}

async function submitAssessment(
  data: AssessmentData
): Promise<AssessmentResult> {
  try {
    // Validate before submission
    const validated = assessmentSchema.parse(data);

    // Submit to API
    const response = await api.submitAssessment(validated);

    if (!response.ok) {
      throw new AssessmentError(
        'Failed to submit assessment',
        'SUBMISSION_FAILED',
        { status: response.status }
      );
    }

    return await response.json();
  } catch (error) {
    if (error instanceof z.ZodError) {
      throw new AssessmentError(
        'Invalid assessment data',
        'VALIDATION_ERROR',
        error.errors
      );
    }

    if (error instanceof AssessmentError) {
      throw error; // Re-throw custom errors
    }

    // Log unexpected errors
    console.error('Unexpected error:', error);
    throw new AssessmentError(
      'An unexpected error occurred',
      'UNKNOWN_ERROR'
    );
  }
}

// ❌ BAD: Poor error handling
async function submitAssessment(data) {
  const response = await api.submitAssessment(data); // No try-catch
  return response.json(); // No validation
}
```

---

### 10. Documentation

#### Code Documentation
- [ ] **Public APIs documented** - With JSDoc
- [ ] **Complex logic explained** - Inline comments
- [ ] **Type definitions documented** - Purpose and usage
- [ ] **Examples provided** - For non-obvious usage

#### Project Documentation
- [ ] **README updated** - With new features
- [ ] **API documentation current** - Reflects implementation
- [ ] **Architecture decisions recorded** - In ADRs
- [ ] **Setup instructions accurate** - Easy to follow

---

## 🏁 PR Approval Checklist

### Before Merging
- [ ] All automated checks pass (linting, tests, build)
- [ ] Code reviewed by at least one other developer
- [ ] Test coverage meets threshold (80%)
- [ ] No console.log or debugging code left
- [ ] Bundle size impact acceptable
- [ ] Accessibility tested (screen reader, keyboard)
- [ ] Documentation updated
- [ ] Breaking changes communicated
- [ ] Migration guide provided (if needed)

### Quality Gates
- [ ] **TypeScript**: No errors, no `any` types
- [ ] **ESLint**: Zero warnings or errors
- [ ] **Tests**: All passing, ≥80% coverage
- [ ] **Bundle**: Size increase <5%
- [ ] **Lighthouse**: Score maintained or improved
- [ ] **Accessibility**: WCAG 2.1 AA compliant

---

## 📊 Automated Checks

### Pre-Commit Hooks
```json
{
  "husky": {
    "hooks": {
      "pre-commit": "lint-staged",
      "pre-push": "npm test"
    }
  },
  "lint-staged": {
    "*.{ts,tsx}": [
      "eslint --fix",
      "prettier --write",
      "tsc --noEmit"
    ],
    "*.test.{ts,tsx}": [
      "vitest related --run"
    ]
  }
}
```

### CI Pipeline Checks
- [ ] TypeScript compilation succeeds
- [ ] All tests pass
- [ ] Test coverage ≥80%
- [ ] No ESLint errors
- [ ] Bundle size under limit
- [ ] Lighthouse CI passes
- [ ] Accessibility tests pass

---

## 🎯 Component-Specific Checks

### Interactive Components
- [ ] Keyboard navigation works completely
- [ ] Screen reader announcements appropriate
- [ ] Touch gestures supported (mobile)
- [ ] Animations respect `prefers-reduced-motion`
- [ ] Loading states shown
- [ ] Error states handled

### Form Components
- [ ] Validation on submit and blur
- [ ] Error messages specific and helpful
- [ ] Required fields marked
- [ ] Success feedback provided
- [ ] Autofocus on first field
- [ ] Enter key submits form

### Data Display Components
- [ ] Loading skeletons shown
- [ ] Empty states handled
- [ ] Error states handled
- [ ] Pagination/virtualization for large datasets
- [ ] Sort and filter work correctly
- [ ] Export functionality (if applicable)

---

## 📝 Review Comments Template

### For Suggesting Changes
```markdown
**Issue**: [Brief description of the problem]
**Severity**: [Critical/High/Medium/Low]
**Location**: [File:Line or component name]

**Current Code**:
```typescript
// Code showing the issue
```

**Suggested Fix**:
```typescript
// Proposed solution
```

**Reasoning**: [Why this change is needed]
```

### For Requesting Clarification
```markdown
**Question**: [What you're unclear about]
**Context**: [Why this matters]
**Suggestion**: [Possible approach if you have one]
```

### For Approving with Minor Notes
```markdown
✅ **Approved** - Code quality looks good overall

**Minor suggestions** (non-blocking):
- [ ] Consider extracting [X] into a separate function
- [ ] Could add a test case for [Y] scenario
- [ ] Might be worth documenting [Z] behavior
```

---

## 🔄 Continuous Improvement

### After Each Sprint
- [ ] Review common issues found in reviews
- [ ] Update checklist with new patterns
- [ ] Share learnings with team
- [ ] Update tooling configuration
- [ ] Refine quality metrics

### Quarterly Reviews
- [ ] Assess checklist effectiveness
- [ ] Compare metrics to targets
- [ ] Identify training needs
- [ ] Update best practices
- [ ] Celebrate quality wins

---

**Remember**: This checklist is a living document. Update it as you discover new patterns, issues, or best practices. Quality is a journey, not a destination!
