# Architectural Remediation Plan

**CompTIA Network+ Learning Platform**

**Date:** December 4, 2025
**Status:** Draft v1.0
**Architect:** System Architecture Designer

---

## Executive Summary

This platform has accumulated significant technical debt across **3 critical areas**:

1. **Component Size Violations**: 14 components exceed 500 lines (max: 2,033 lines)
2. **State Management Fragmentation**: 3 concurrent systems causing confusion
3. **Structural Inconsistencies**: Duplicate folders, legacy artifacts, no standardized module patterns

**Impact:**

- Reduced maintainability and testing coverage
- Onboarding friction for new developers
- Increased bug surface area
- Performance degradation from large component re-renders

**Remediation Timeline:** 4-6 weeks with phased migration strategy

---

## 1. Component Decomposition Blueprints

### 1.1 PortProtocolTrainer.tsx (2,033 lines → ~400 lines)

**Current Responsibilities:**

- Flashcard rendering with Leitner spaced repetition
- Quiz question generation and grading
- Memory palace visualization
- Analytics dashboard with achievements
- Local storage persistence
- XP/level gamification system

**Proposed Subcomponents:**

```
src/components/protocols/
├── PortProtocolTrainer.tsx          (Main orchestrator, ~150 lines)
├── flashcard/
│   ├── FlashcardDeck.tsx             (Card display logic, ~120 lines)
│   ├── FlashcardControls.tsx         (Rating buttons, ~80 lines)
│   └── LeitnerProgressBar.tsx        (Box visualization, ~60 lines)
├── quiz/
│   ├── QuizEngine.tsx                (Question generator, ~150 lines)
│   ├── QuizResults.tsx               (Score display, ~100 lines)
│   └── QuizQuestionCard.tsx          (Single question UI, ~80 lines)
├── memory/
│   ├── MemoryPalace.tsx              (Port range groups, ~100 lines)
│   └── MnemonicCard.tsx              (Individual mnemonic, ~60 lines)
├── analytics/
│   ├── AnalyticsDashboard.tsx        (Stats overview, ~120 lines)
│   ├── AchievementGrid.tsx           (Badges, ~80 lines)
│   └── PerformanceCharts.tsx         (Leitner distribution, ~90 lines)
└── hooks/
    ├── usePortProgress.ts            (Leitner algorithm, ~100 lines)
    ├── useQuizGeneration.ts          (Question logic, ~80 lines)
    └── useGamification.ts            (XP/achievements, ~70 lines)
```

**State Management Approach:**

```typescript
// Use Zustand for training progress
// src/stores/portTrainingStore.ts
interface PortTrainingState {
  progress: Map<string, CardProgress>;
  stats: TrainingStats;
  updateProgress: (cardId: string, correct: boolean) => void;
  getNextCard: () => PortCard | null;
}

// Each component consumes specific slices
const FlashcardDeck = () => {
  const { getNextCard, updateProgress } = usePortTrainingStore();
  // ...
};
```

**Interface Definitions:**

```typescript
// src/types/port-training.ts
export interface CardProgress {
  cardId: string;
  box: 0 | 1 | 2 | 3 | 4;
  lastReviewed: number;
  nextReview: number;
  accuracy: number;
}

export interface QuizQuestion {
  id: string;
  type: 'port-to-protocol' | 'protocol-to-port' | 'security' | 'tcp-udp';
  question: string;
  options: string[];
  correctAnswer: string;
}
```

---

### 1.2 TopologyAnalyzer.tsx (1,855 lines → ~450 lines)

**Current Responsibilities:**

- Topology comparison grid (3 simultaneous)
- SPOF (Single Point of Failure) detection
- Redundancy metrics calculation
- Exam question generation
- Three-tier model visualization
- Traffic flow animation
- Keyboard navigation

**Proposed Subcomponents:**

```
src/components/topologies/
├── TopologyAnalyzer.tsx              (Main orchestrator, ~180 lines)
├── comparison/
│   ├── ComparisonGrid.tsx            (Topology cards, ~120 lines)
│   ├── TopologyCard.tsx              (Single topology, ~90 lines)
│   └── MetricsRadarChart.tsx         (Comparison viz, ~80 lines)
├── analysis/
│   ├── SPOFDetector.tsx              (Failure analysis, ~150 lines)
│   ├── RedundancyCalculator.tsx      (Metrics, ~100 lines)
│   └── CriticalPathMapper.tsx        (Path visualization, ~90 lines)
├── three-tier/
│   ├── ThreeTierExplorer.tsx         (Model details, ~120 lines)
│   ├── LayerSection.tsx              (Core/Distribution/Access, ~80 lines)
│   └── CollapsedCoreView.tsx         (Variation, ~70 lines)
├── exam/
│   ├── TopologyExamQuiz.tsx          (Question UI, ~100 lines)
│   └── QuestionCard.tsx              (Single question, ~60 lines)
├── traffic/
│   ├── TrafficVisualizer.tsx         (Animation, ~100 lines)
│   └── TrafficFlowPath.tsx           (Path rendering, ~70 lines)
└── hooks/
    ├── useTopologyAnalysis.ts        (SPOF/redundancy, ~120 lines)
    ├── useKeyboardNav.ts             (Shortcuts, ~60 lines)
    └── useExamQuestions.ts           (Generator, ~80 lines)
```

**State Management Approach:**

```typescript
// Zustand store for analysis state
interface TopologyAnalysisState {
  selectedTopologies: TopologyType[];
  nodeCount: number;
  analysisResults: Map<string, SPOFAnalysis>;
  toggleTopology: (id: TopologyType) => void;
  analyzeTopology: (topology: TopologyDefinition) => SPOFAnalysis;
}
```

---

### 1.3 CloudSummaryBuilder.tsx (1,813 lines → ~500 lines)

**Current Responsibilities:**

- Scenario selection and display
- Multi-tab interface (6 tabs)
- Cloud terminology glossary
- Service comparison matrix
- Use case matcher
- Cost calculator
- Exam practice questions
- Scoring algorithm (40% models, 20% conciseness, 40% coverage)
- Word count validation

**Proposed Subcomponents:**

```
src/components/cloud/
├── CloudSummaryBuilder.tsx           (Main orchestrator, ~150 lines)
├── builder/
│   ├── ScenarioBuilder.tsx           (Form, ~180 lines)
│   ├── ScorePanel.tsx                (Results, ~100 lines)
│   └── IdealSolutionView.tsx         (Reference, ~80 lines)
├── terminology/
│   ├── TerminologyExplorer.tsx       (Glossary, ~100 lines)
│   └── TermCard.tsx                  (Definition card, ~50 lines)
├── comparison/
│   ├── ServiceComparisonTable.tsx    (Matrix, ~90 lines)
│   └── ComparisonRow.tsx             (Single row, ~40 lines)
├── use-cases/
│   ├── UseCaseMatcher.tsx            (Grid, ~100 lines)
│   └── UseCaseCard.tsx               (Scenario, ~70 lines)
├── cost/
│   ├── CostCalculator.tsx            (Estimator, ~120 lines)
│   └── CostBreakdown.tsx             (Line items, ~60 lines)
├── exam/
│   ├── CloudExamPractice.tsx         (Questions, ~100 lines)
│   └── ExamQuestionCard.tsx          (Single Q, ~70 lines)
└── hooks/
    ├── useCloudScoring.ts            (Algorithm, ~100 lines)
    ├── useWordCounter.ts             (Validation, ~50 lines)
    └── useCloudTerminology.ts        (Data, ~60 lines)
```

**State Management Approach:**

```typescript
// Combine local state with Zustand for user answers
const CloudSummaryBuilder = () => {
  const [activeTab, setActiveTab] = useState<TabType>('builder');
  const [userSummary, setUserSummary] = useState<CloudSummary>({});

  // Use Zustand for exam answers (persisted)
  const { userAnswers, answerQuestion } = useCloudExamStore();
};
```

---

### 1.4 TopologyTransformer.tsx (1,791 lines → ~450 lines)

**Proposed Subcomponents:**

```
src/components/topologies/
├── TopologyTransformer.tsx           (Orchestrator, ~150 lines)
├── transforms/
│   ├── TransformEngine.tsx           (Logic, ~180 lines)
│   ├── TransformVisualizer.tsx       (Display, ~120 lines)
│   └── TransformHistory.tsx          (Timeline, ~90 lines)
└── hooks/
    ├── useTopologyTransform.ts       (~120 lines)
    └── useTransformValidation.ts     (~80 lines)
```

---

### 1.5 TopologyAnalyzerEnhanced.tsx (1,673 lines → ~400 lines)

**Analysis:** Likely duplicate of TopologyAnalyzer.tsx. Recommend **merge/delete** after comparison.

**Action Plan:**

1. Compare features with TopologyAnalyzer.tsx
2. Merge unique enhancements into canonical TopologyAnalyzer
3. Delete duplicate file
4. Update imports across codebase

---

## 2. State Management Migration

### 2.1 Current Architecture Issues

**3 Concurrent Systems Detected:**

| System             | Location             | Purpose                                                      | Status            |
| ------------------ | -------------------- | ------------------------------------------------------------ | ----------------- |
| **Zustand Stores** | `src/stores/`        | Modern state (authStore, progressStore, appStore, userStore) | ✅ **Primary**    |
| **React Context**  | `src/contexts/`      | Legacy wrappers (AuthContext, ProgressContext)               | ⚠️ **Deprecated** |
| **Legacy Store**   | `src/store/index.ts` | Unknown purpose                                              | ❌ **Remove**     |

**Problems:**

- Confusion about which system to use
- Duplicate state in Context and Zustand
- AuthContext is a "thin wrapper" around authStore (unnecessary abstraction)
- ProgressContext likely duplicates progressStore

### 2.2 Target Architecture: Pure Zustand

**Migration Strategy:**

#### Phase 1: Audit & Document (Week 1)

```bash
# Find all Context usages
grep -r "useAuth\|useProgress" src/components --include="*.tsx"

# Find all Zustand usages
grep -r "useAuthStore\|useProgressStore" src/components --include="*.tsx"

# Identify components using both
```

#### Phase 2: Migrate Components (Weeks 2-3)

```typescript
// BEFORE (Context)
import { useAuth } from '../contexts/AuthContext';

const Component = () => {
  const { user, login } = useAuth();
  // ...
};

// AFTER (Zustand)
import { useAuthStore } from '../stores/authStore';

const Component = () => {
  const { user, login } = useAuthStore();
  // ...
};
```

#### Phase 3: Remove Context Providers (Week 4)

```typescript
// BEFORE (App.tsx)
<AuthProvider>
  <ProgressProvider>
    <App />
  </ProgressProvider>
</AuthProvider>

// AFTER
<App />  // Zustand works without providers
```

#### Phase 4: Delete Legacy Files (Week 4)

```bash
# Files to delete after migration
src/contexts/AuthContext.tsx       # 152 lines
src/contexts/ProgressContext.tsx   # ~150 lines (estimated)
src/store/index.ts                 # Legacy store

# Update imports automatically
npx jscodeshift -t migrate-context-to-zustand.ts src/
```

### 2.3 Migration Automation Script

```javascript
// migrate-context-to-zustand.ts (jscodeshift transformer)
export default function transformer(file, api) {
  const j = api.jscodeshift;
  const root = j(file.source);

  // Replace useAuth() with useAuthStore()
  root
    .find(j.ImportDeclaration, {
      source: { value: (v) => v.includes('contexts/AuthContext') },
    })
    .replaceWith((path) => {
      return j.importDeclaration(
        [j.importSpecifier(j.identifier('useAuthStore'))],
        j.literal('../stores/authStore')
      );
    });

  // Replace hook calls
  root.find(j.CallExpression, { callee: { name: 'useAuth' } }).replaceWith((path) => {
    return j.callExpression(j.identifier('useAuthStore'), []);
  });

  return root.toSource();
}
```

### 2.4 Testing Strategy

**Unit Tests:**

```typescript
// Before migration: Mock Context
vi.mock('../contexts/AuthContext', () => ({
  useAuth: () => ({ user: mockUser }),
}));

// After migration: Mock Zustand
vi.mock('../stores/authStore', () => ({
  useAuthStore: () => ({ user: mockUser }),
}));
```

**Integration Tests:**

```typescript
// Test components work without providers
describe('Component without AuthProvider', () => {
  it('accesses Zustand store directly', () => {
    render(<Component />);
    // Should work without <AuthProvider> wrapper
  });
});
```

---

## 3. Folder Structure Cleanup

### 3.1 Current Issues

**Duplicate Folders:**

```
src/components/
├── common/       # Shared components?
└── shared/       # Shared components?
```

**Empty/Unused Artifacts:**

```
router/           # Empty folder
*.bak files       # Backup files in root
```

### 3.2 Proposed Structure

```
src/
├── components/
│   ├── protocols/
│   │   ├── PortProtocolTrainer/        # Feature module
│   │   │   ├── index.tsx               # Main component
│   │   │   ├── FlashcardDeck.tsx
│   │   │   ├── QuizEngine.tsx
│   │   │   ├── MemoryPalace.tsx
│   │   │   ├── AnalyticsDashboard.tsx
│   │   │   ├── hooks/
│   │   │   │   ├── usePortProgress.ts
│   │   │   │   └── useQuizGeneration.ts
│   │   │   ├── types.ts
│   │   │   └── __tests__/
│   │   │       ├── FlashcardDeck.test.tsx
│   │   │       └── QuizEngine.test.tsx
│   │   └── PortScannerEnhanced/
│   ├── topologies/
│   │   ├── TopologyAnalyzer/           # Feature module
│   │   │   ├── index.tsx
│   │   │   ├── ComparisonGrid.tsx
│   │   │   ├── SPOFDetector.tsx
│   │   │   ├── ThreeTierExplorer.tsx
│   │   │   ├── hooks/
│   │   │   └── __tests__/
│   │   └── TopologyTransformer/
│   ├── cloud/
│   │   └── CloudSummaryBuilder/        # Feature module
│   ├── auth/
│   │   ├── LoginForm/
│   │   ├── RegisterForm/
│   │   └── UserProfile/
│   └── ui/                             # Merge common + shared here
│       ├── Button.tsx
│       ├── Card.tsx
│       ├── Modal.tsx
│       └── index.ts                    # Barrel export
├── stores/                             # Pure Zustand (no Context)
│   ├── authStore.ts
│   ├── progressStore.ts
│   ├── appStore.ts
│   ├── userStore.ts
│   └── portTrainingStore.ts            # New
├── services/                           # API calls
│   ├── auth-service.ts
│   ├── progress-service.ts
│   └── api/
├── hooks/                              # Global hooks
│   ├── useAuth.ts                      # Re-export from authStore
│   └── useProgress.ts                  # Re-export from progressStore
├── types/                              # TypeScript types
│   ├── auth.ts
│   ├── progress.ts
│   └── port-training.ts                # New
└── utils/
    ├── auth.ts
    ├── api/
    └── validation.ts
```

### 3.3 Migration Steps

**Step 1: Merge common/ and shared/**

```bash
# Copy all unique components from common/ to ui/
cp -r src/components/common/* src/components/ui/

# Review shared/ for duplicates
diff -r src/components/common src/components/shared

# Move unique components from shared/ to ui/
# Delete both folders
rm -rf src/components/common src/components/shared
```

**Step 2: Create Feature Modules**

```bash
# Example: PortProtocolTrainer
mkdir -p src/components/protocols/PortProtocolTrainer/{hooks,__tests__}

# Move and decompose
mv src/components/protocols/PortProtocolTrainer.tsx \
   src/components/protocols/PortProtocolTrainer/index.tsx

# Create subcomponents in same directory
```

**Step 3: Clean Up Artifacts**

```bash
# Delete empty folders
find src -type d -empty -delete

# Remove backup files
rm *.bak

# Delete legacy store
rm -rf src/store
```

**Step 4: Update Barrel Exports**

```typescript
// src/components/ui/index.ts
export { Button } from './Button';
export { Card } from './Card';
export { Modal } from './Modal';
// ... all UI components

// Usage
import { Button, Card } from '@/components/ui';
```

---

## 4. Standardized Feature Module Pattern

### 4.1 Module Template

Every feature module follows this structure:

```
ComponentName/
├── index.tsx                 # Main component (export default)
├── ComponentName.tsx         # If index is just re-export
├── SubComponent1.tsx         # Child components
├── SubComponent2.tsx
├── hooks/
│   ├── useComponentLogic.ts  # Business logic
│   └── useComponentData.ts   # Data fetching
├── types.ts                  # Component-specific types
├── utils.ts                  # Component-specific utilities
├── constants.ts              # Component constants
├── ComponentName.module.css  # Scoped styles (optional)
└── __tests__/
    ├── index.test.tsx        # Main component tests
    ├── SubComponent1.test.tsx
    └── hooks.test.ts
```

### 4.2 Implementation Rules

**Rule 1: Single Responsibility**

- Main component = orchestration only (< 200 lines)
- Subcomponents = specific UI concerns (< 150 lines)
- Hooks = business logic extraction (< 100 lines each)

**Rule 2: Clear Dependencies**

```typescript
// index.tsx
export { default } from './ComponentName';
export { SubComponent1, SubComponent2 } from './SubComponent1';
export type { ComponentProps } from './types';

// External usage
import ComponentName, { SubComponent1, type ComponentProps } from './ComponentName';
```

**Rule 3: Co-located Tests**

```typescript
// __tests__/index.test.tsx
import ComponentName from '../index';

describe('ComponentName', () => {
  it('renders correctly', () => {
    render(<ComponentName />);
    expect(screen.getByRole('button')).toBeInTheDocument();
  });
});
```

**Rule 4: Type Safety**

```typescript
// types.ts
export interface ComponentProps {
  id: string;
  onUpdate: (data: UpdateData) => void;
}

export interface UpdateData {
  field: string;
  value: string;
}

// index.tsx
import type { ComponentProps } from './types';

const Component: React.FC<ComponentProps> = ({ id, onUpdate }) => {
  // ...
};
```

---

## 5. Implementation Roadmap

### Week 1: Foundation

- [ ] Create migration scripts (jscodeshift transformers)
- [ ] Set up feature module templates
- [ ] Audit Context usage across codebase
- [ ] Document all state flows

### Week 2-3: Component Decomposition

- [ ] Decompose PortProtocolTrainer (Priority 1)
- [ ] Decompose TopologyAnalyzer (Priority 2)
- [ ] Decompose CloudSummaryBuilder (Priority 3)
- [ ] Write unit tests for all subcomponents

### Week 4: State Migration

- [ ] Migrate 50% of components from Context to Zustand
- [ ] Update all imports via automated script
- [ ] Run full test suite
- [ ] Performance benchmarks

### Week 5: Cleanup

- [ ] Migrate remaining 50% of components
- [ ] Remove Context providers from App.tsx
- [ ] Delete legacy Context files
- [ ] Delete legacy store folder
- [ ] Merge common/ and shared/ into ui/

### Week 6: Validation

- [ ] Full regression testing (475+ tests)
- [ ] Performance validation (no degradation)
- [ ] Code review and documentation
- [ ] Update developer onboarding guide

---

## 6. Success Metrics

**Code Quality:**

- ✅ All components < 500 lines
- ✅ Average component size < 200 lines
- ✅ Test coverage maintained at 79%+

**Architecture:**

- ✅ Single state management system (Zustand)
- ✅ Zero Context providers in App.tsx
- ✅ Standardized feature module pattern

**Performance:**

- ✅ No render performance regression
- ✅ Bundle size reduction (fewer abstractions)
- ✅ Faster component load times

**Developer Experience:**

- ✅ Clear component organization
- ✅ Predictable file locations
- ✅ Reduced onboarding time (< 2 days)

---

## 7. Risk Mitigation

**Risk 1: Breaking Changes**

- **Mitigation:** Run full test suite after each migration step
- **Rollback:** Git tags at each phase completion

**Risk 2: Performance Degradation**

- **Mitigation:** Benchmark before/after each component split
- **Monitoring:** React DevTools profiler for re-render tracking

**Risk 3: Incomplete Migration**

- **Mitigation:** Automated migration scripts
- **Validation:** TypeScript compiler errors for missing imports

**Risk 4: Test Coverage Drop**

- **Mitigation:** Write tests for subcomponents before extraction
- **CI Gate:** Fail builds if coverage < 79%

---

## 8. Next Steps

**Immediate Actions (This Week):**

1. Review and approve this remediation plan
2. Set up feature branch: `feat/architectural-remediation`
3. Create jscodeshift migration scripts
4. Begin PortProtocolTrainer decomposition (highest line count)

**Decision Required:**

- Approve 4-6 week timeline?
- Prioritize different component for Phase 1?
- Include TopologyAnalyzerEnhanced merge in scope?

---

## Appendix A: Component Size Analysis

| Component                | Current Lines | Target Lines | Reduction | Priority    |
| ------------------------ | ------------- | ------------ | --------- | ----------- |
| PortProtocolTrainer      | 2,033         | 400          | 80%       | 🔴 Critical |
| TopologyAnalyzer         | 1,855         | 450          | 76%       | 🔴 Critical |
| CloudSummaryBuilder      | 1,813         | 500          | 72%       | 🔴 Critical |
| TopologyTransformer      | 1,791         | 450          | 75%       | 🟡 High     |
| TopologyAnalyzerEnhanced | 1,673         | 0 (merge)    | 100%      | 🟡 High     |
| PortScannerEnhanced      | 1,526         | 400          | 74%       | 🟡 High     |

**Total Lines Reduced:** ~7,200 lines → ~2,200 lines (70% reduction)

---

## Appendix B: State Management Comparison

| Feature     | Context                   | Zustand                | Winner     |
| ----------- | ------------------------- | ---------------------- | ---------- |
| Performance | Re-renders entire subtree | Granular subscriptions | ✅ Zustand |
| DevTools    | React DevTools only       | Redux DevTools + React | ✅ Zustand |
| Boilerplate | Provider wrappers         | Direct imports         | ✅ Zustand |
| TypeScript  | Manual typing             | Inferred types         | ✅ Zustand |
| Persistence | Manual localStorage       | Built-in middleware    | ✅ Zustand |
| Testing     | Requires providers        | Works standalone       | ✅ Zustand |

**Verdict:** Zustand is superior for this application's needs.

---

**Document Version:** 1.0
**Last Updated:** December 4, 2025
**Next Review:** After Phase 1 completion (Week 4)
