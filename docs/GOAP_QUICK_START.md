# GOAP Quick Start Guide

## 🚀 Execute the Remediation Plan

This quick reference provides the exact commands to execute each phase of the GOAP remediation plan.

**Full Documentation:**
- `docs/GOAP_REMEDIATION_PLAN.json` - Complete action specification
- `docs/GOAP_PLAN_SUMMARY.md` - Detailed explanation
- `docs/GOAP_VISUALIZATION.md` - Visual diagrams and flows

---

## Phase 1: Validation & Baseline (5-10 min)

### Objective
Verify builds and tests pass before decomposition work begins.

### Commands
```bash
# Step 1: Verify TypeScript build
npm run build

# Step 2: Verify linting (can run parallel with build)
npm run lint:check

# Step 3: Verify tests (requires build to pass)
npm run test

# Step 4: Commit validation state (if any fixes needed)
git add .
git commit -m "chore: validate build and tests before decomposition"
```

### Success Criteria
- ✓ Build exits with code 0
- ✓ No ESLint errors
- ✓ All tests passing
- ✓ Git status clean (or validation fixes committed)

### Fallback
If build fails:
```bash
# Capture errors
npm run build 2>&1 | tee /tmp/build-errors.log

# Analyze and fix TypeScript errors
# Create focused remediation plan
# Resume when build passes
```

If tests fail:
```bash
# Capture failures
npm run test 2>&1 | tee /tmp/test-failures.log

# Fix failing tests
# Re-run tests
# Resume when all pass
```

---

## Phase 2: Decompose Top 5 Critical Components (60-90 min)

### Objective
Decompose the 5 largest components (1173-1673 lines) using parallel agent execution.

### Target Components
1. TopologyAnalyzerEnhanced.tsx (1673 lines)
2. PortScannerEnhanced.tsx (1558 lines)
3. IaCBuilder.tsx (1288 lines)
4. IPv4Troubleshooter.tsx (1266 lines)
5. CloudArchitectureEnhancements.tsx (1173 lines)

### Execution Strategy

**Batch 1: 3 Components in Parallel**

Use Claude Code's Task tool to spawn 3 agents concurrently:

```
Agent 1: Decompose TopologyAnalyzerEnhanced
- Extract: Header, NodeSlider, VisualizationArea, AnalysisPanel, hooks
- Target structure: TopologyAnalyzerEnhanced/components/ and /hooks/
- Verify tests still pass

Agent 2: Decompose PortScannerEnhanced
- Extract: ScannerControls, ResultsDisplay, PortList, SecurityAnalysis, hooks
- Target structure: PortScannerEnhanced/components/ and /hooks/
- Verify tests still pass

Agent 3: Decompose IaCBuilder
- Extract: ToolSelector, CodeEditor, PreviewPanel, TemplateLibrary
- Target structure: IaCBuilder/components/ and /hooks/
- Verify tests still pass
```

**After Batch 1:**
```bash
# Validate all tests still pass
npm run test

# If tests fail: rollback and refactor differently
# If tests pass: proceed to Batch 2
```

**Batch 2: 2 Components in Parallel**

```
Agent 1: Decompose IPv4Troubleshooter
- Extract: DiagnosticWizard, TestRunner, ResultsAnalysis, SolutionPanel
- Target structure: IPv4Troubleshooter/components/ and /hooks/
- Verify tests still pass

Agent 2: Decompose CloudArchitectureEnhancements
- Extract: ServiceSelector, ArchitectureCanvas, CostCalculator, BestPractices
- Target structure: CloudArchitectureEnhancements/components/ and /hooks/
- Verify tests still pass
```

**After Batch 2:**
```bash
# Validate all tests still pass
npm run test

# Train neural patterns from successful decompositions
npx claude-flow@alpha neural train --pattern decomposition --files 'src/components/**/*.tsx'

# Commit the batch
git add .
git commit -m "refactor: decompose top 5 largest components

- TopologyAnalyzerEnhanced: 1673 → <500 lines
- PortScannerEnhanced: 1558 → <500 lines
- IaCBuilder: 1288 → <500 lines
- IPv4Troubleshooter: 1266 → <500 lines
- CloudArchitectureEnhancements: 1173 → <500 lines

All tests passing. Components modularized for maintainability."
```

### Success Criteria
- ✓ All 5 components decomposed to <500 lines
- ✓ All tests still passing
- ✓ Neural patterns trained
- ✓ Changes committed

---

## Phase 3: Batch Decompose 1000+ Lines (60-90 min)

### Objective
Decompose remaining 11 components over 1000 lines using 5-agent swarm.

### Target Components (11 total)
- CloudMigrationSimulator.tsx (1049)
- NetworkSimulator.tsx (1042)
- TransceiverMatch.tsx (1013)
- TroubleshootingScenariosEnhanced.tsx (1008)
- LayerExplanationBuilder.tsx (963)
- TopologyTransformerStyles.tsx (927)
- ConnectorIdentification/index.tsx (878)
- TrafficTypeDemo.tsx (873)
- UserProfile.tsx (858)
- SignalAnalyzer.tsx (826)
- ScenarioSimulator.tsx (797)

### Commands

```bash
# Initialize mesh swarm topology
npx claude-flow@alpha swarm init --topology mesh --maxAgents 5
```

### Agent Assignment

Use Claude Code's Task tool to spawn 5 agents in parallel:

```
Agent 1: Decompose 2 components
- CloudMigrationSimulator (1049)
- NetworkSimulator (1042)

Agent 2: Decompose 2 components
- TransceiverMatch (1013)
- TroubleshootingScenariosEnhanced (1008)

Agent 3: Decompose 2 components
- LayerExplanationBuilder (963)
- TopologyTransformerStyles (927)

Agent 4: Decompose 2 components
- ConnectorIdentification/index (878)
- TrafficTypeDemo (873)

Agent 5: Decompose 3 components
- UserProfile (858)
- SignalAnalyzer (826)
- ScenarioSimulator (797)
```

### Agent Coordination Hooks

Each agent MUST run:

**Before work:**
```bash
npx claude-flow@alpha hooks pre-task --description "Decompose [COMPONENT_NAME]"
npx claude-flow@alpha hooks session-restore --session-id "swarm-phase3"
```

**During work:**
```bash
npx claude-flow@alpha hooks post-edit --file "[FILE]" --memory-key "swarm/agent-[N]/decompose"
npx claude-flow@alpha hooks notify --message "Decomposed [COMPONENT_NAME]"
```

**After work:**
```bash
npx claude-flow@alpha hooks post-task --task-id "decompose-[COMPONENT_NAME]"
npx claude-flow@alpha hooks session-end --export-metrics true
```

### Validation & Commit

```bash
# Run full test suite
npm run test

# Update test imports if needed
# (Run as separate agent or manually)

# Store progress in memory
npx claude-flow@alpha memory usage --action store --namespace remediation --key phase3-complete --value '{"components_decomposed": 11, "tests_passing": true}'

# Commit
git add .
git commit -m "refactor: decompose 11 components over 1000 lines

All components now under 1000 lines. Using modular structure
with subcomponents and hooks. Tests passing."
```

### Success Criteria
- ✓ All 11 components decomposed to <500 lines
- ✓ Tests passing
- ✓ Memory updated
- ✓ Changes committed

---

## Phase 4: Batch Decompose 500-1000 Lines (90-120 min)

### Objective
Decompose remaining 30 components between 500-1000 lines using 6-agent swarm.

### Target Components (30 total)
See full list in `docs/GOAP_REMEDIATION_PLAN.json` under Phase 4.

### Commands

```bash
# Initialize mesh swarm topology
npx claude-flow@alpha swarm init --topology mesh --maxAgents 6
```

### Agent Assignment

Use Claude Code's Task tool to spawn 6 agents in parallel, each handling 5 components.

```
Agent 1: 5 components (SubnetDesigner, QuizEngine, etc.)
Agent 2: 5 components (CloudSummaryBuilderEnhanced, etc.)
Agent 3: 5 components (CloudArchitectureDesigner, etc.)
Agent 4: 5 components (OSIEnhanced, TroubleshootingScenarios, etc.)
Agent 5: 5 components (PortScanner, IPv4Troubleshooting, etc.)
Agent 6: 5 components (MethodologyWizard, PerformanceAnalytics, etc.)
```

### Validation & Commit

```bash
# Run full test suite
npm run test

# Run coverage check
npm run test:coverage

# Update test imports
# (Parallel task or manual)

# Commit
git add .
git commit -m "refactor: decompose all remaining oversized components

All 30 components between 500-1000 lines now decomposed.
Project now has ZERO components over 500 lines.
All tests passing. Coverage maintained."
```

### Success Criteria
- ✓ All 30 components decomposed to <500 lines
- ✓ **Zero components over 500 lines in entire project**
- ✓ Tests passing
- ✓ Coverage >= baseline
- ✓ Changes committed

---

## Phase 5: Finalization (10-15 min)

### Objective
Train neural patterns, update memory, final commit.

### Commands (Parallel Execution)

```bash
# Train decomposition patterns
npx claude-flow@alpha neural train --pattern decomposition --files 'src/components/**/*.tsx' &

# Train test refactoring patterns
npx claude-flow@alpha neural train --pattern test-refactor --files 'tests/**/*.test.tsx' &

# Wait for both neural training jobs
wait

# Store successful patterns in memory
npx claude-flow@alpha memory usage --action store --namespace patterns --key component-decomposition --value '{
  "strategy": "Extract subcomponents with hooks",
  "target_structure": "Component/components/ and /hooks/",
  "max_component_size": 500,
  "success_rate": "100%"
}'

# Store final remediation state
npx claude-flow@alpha memory usage --action store --namespace remediation --key final-state --value '{
  "components_decomposed": 46,
  "oversized_components": 0,
  "builds_passing": true,
  "tests_passing": true,
  "completion_date": "'$(date -I)'"
}'

# Final commit
git add .
git commit -m "chore: complete component remediation - all components under 500 lines

Project remediation complete using GOAP methodology:
- 46 components decomposed
- 0 components over 500 lines
- All builds passing
- All tests passing
- Neural patterns trained
- Memory updated

Estimated time saved: 6+ hours via parallel agent execution
Speedup: 2.8-4.4x vs sequential approach"
```

### Success Criteria
- ✓ Neural patterns trained and stored
- ✓ Memory updated with final state
- ✓ All changes committed
- ✓ Git status clean
- ✓ **GOAL STATE ACHIEVED**

---

## Rollback Procedures

### If Build Fails During Execution

```bash
# View last good commit
git log --oneline -5

# Revert to last passing state
git reset --hard HEAD~1

# Analyze what went wrong
npm run build 2>&1 | tee /tmp/build-errors.log

# Fix errors
# Re-run phase
```

### If Tests Fail After Decomposition

```bash
# View failing tests
npm run test 2>&1 | tee /tmp/test-failures.log

# Revert last decomposition
git reset --hard HEAD~1

# Analyze failures
# Refactor differently
# Re-run tests
```

### If Agent Coordination Fails

```bash
# Check swarm status
npx claude-flow@alpha swarm status

# Check agent metrics
npx claude-flow@alpha agent metrics

# If conflicts detected, switch to sequential:
# Execute components one at a time instead of in parallel
```

---

## Monitoring Progress

### Check Component Sizes
```bash
# View all components over 500 lines
find src/components src/pages -name "*.tsx" -type f -exec wc -l {} + | sort -rn | awk '$1 > 500'

# Count total oversized components
find src/components src/pages -name "*.tsx" -type f -exec wc -l {} + | awk '$1 > 500' | wc -l
```

### Check Build Status
```bash
npm run build && echo "✓ Build passing" || echo "✗ Build failing"
```

### Check Test Status
```bash
npm run test && echo "✓ Tests passing" || echo "✗ Tests failing"
```

### Check Memory State
```bash
npx claude-flow@alpha memory usage --action retrieve --namespace remediation --key progress
```

### Check Neural Training Status
```bash
npx claude-flow@alpha neural status
```

---

## Quick Checklist

Use this to track progress through the plan:

```
PHASE 1: VALIDATION
[ ] Build passing
[ ] Lint passing
[ ] Tests passing
[ ] Validation fixes committed (if any)

PHASE 2: TOP 5 CRITICAL
[ ] TopologyAnalyzerEnhanced decomposed
[ ] PortScannerEnhanced decomposed
[ ] IaCBuilder decomposed
[ ] IPv4Troubleshooter decomposed
[ ] CloudArchitectureEnhancements decomposed
[ ] Tests passing after batch
[ ] Neural patterns trained
[ ] Changes committed

PHASE 3: 1000+ LINES
[ ] Swarm initialized (mesh, 5 agents)
[ ] 11 components decomposed
[ ] Tests passing
[ ] Memory updated
[ ] Changes committed

PHASE 4: 500-1000 LINES
[ ] Swarm initialized (mesh, 6 agents)
[ ] 30 components decomposed
[ ] Tests passing
[ ] Coverage check passed
[ ] Changes committed

PHASE 5: FINALIZATION
[ ] Decomposition patterns trained
[ ] Test refactor patterns trained
[ ] Pattern library stored
[ ] Final state stored in memory
[ ] Final commit complete

VERIFICATION
[ ] Zero components over 500 lines
[ ] All builds passing
[ ] All tests passing
[ ] Git status clean
[ ] GOAL STATE ACHIEVED ✓
```

---

## Time Estimates

| Phase | Estimated Time | Actual Time | Notes |
|-------|---------------|-------------|-------|
| Phase 1 | 5-10 min | _____ | Validation |
| Phase 2 | 60-90 min | _____ | Top 5 critical |
| Phase 3 | 60-90 min | _____ | 1000+ lines (11 comps) |
| Phase 4 | 90-120 min | _____ | 500-1000 lines (30 comps) |
| Phase 5 | 10-15 min | _____ | Finalization |
| **Total** | **3.5-4 hours** | **_____** | With parallel execution |

---

## Key Success Factors

1. **Validate first:** Always run Phase 1 before decomposition
2. **Test after each batch:** Never proceed if tests fail
3. **Use coordination hooks:** All agents must run pre/post hooks
4. **Commit incrementally:** After each successful batch
5. **Monitor progress:** Use checklist and metrics
6. **Have rollback plan:** Know how to revert if needed
7. **Train patterns:** Build reusable knowledge for future work

---

## Support Resources

- **Full Plan:** `docs/GOAP_REMEDIATION_PLAN.json`
- **Detailed Guide:** `docs/GOAP_PLAN_SUMMARY.md`
- **Visualizations:** `docs/GOAP_VISUALIZATION.md`
- **Claude Flow Docs:** https://github.com/ruvnet/claude-flow

---

*Generated: 2025-12-09*
*Ready to execute the optimal path to component remediation!*
