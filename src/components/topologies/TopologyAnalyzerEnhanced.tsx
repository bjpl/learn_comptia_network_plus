/**
 * Enhanced Topology Comparison Analyzer Component
 *
 * This file is now a simple re-export of the refactored modular component.
 * The original 1673-line component has been decomposed into a clean modular structure:
 *
 * Structure:
 * - /TopologyAnalyzerEnhanced/
 *   - index.tsx (124 lines) - Main orchestrator
 *   - /components/ - UI sub-components
 *     - Header.tsx
 *     - TopologySelection.tsx
 *     - NodeCountSlider.tsx
 *     - TopologyCard.tsx (256 lines)
 *     - ComparisonTable.tsx (83 lines)
 *     - TooltipOverlay.tsx (39 lines)
 *   - /hooks/ - Custom React hooks
 *     - useTooltip.ts
 *     - useComparisonMetrics.ts
 *     - useAnalyzerState.ts
 *   - /utils/ - Utility functions
 *     - calculations.ts (50 lines)
 *   - /types/ - TypeScript definitions
 *     - index.ts (20 lines)
 *   - /styles/ - Stylesheet
 *     - styles.ts (complete CSS)
 *
 * Benefits:
 * - Main component reduced from 1673 lines to 124 lines (92.6% reduction)
 * - Better separation of concerns
 * - Easier testing and maintenance
 * - Reusable components and hooks
 * - Clear, organized structure
 */

export { TopologyAnalyzerEnhanced, TopologyAnalyzerEnhanced as default } from './TopologyAnalyzerEnhanced/index';
