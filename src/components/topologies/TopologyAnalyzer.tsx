/**
 * TopologyAnalyzer - Backwards Compatibility Re-export
 * This file maintains backwards compatibility by re-exporting from the new modular structure
 *
 * New structure location: /TopologyAnalyzer/index.tsx
 */

export { TopologyAnalyzer, default } from './TopologyAnalyzer/index';
export type { TopologyAnalyzerProps, SPOFAnalysis, RedundancyMetrics, ExamQuestion } from './TopologyAnalyzer/types';

/**
 * DEPRECATION NOTICE (for future reference):
 * The monolithic TopologyAnalyzer component has been decomposed into a modular structure:
 *
 * Directory Structure:
 * - TopologyAnalyzer/index.tsx (main orchestrator, 238 lines)
 * - TopologyAnalyzer/components/
 *   - TopologyCard.tsx (individual topology card with metrics)
 *   - TopologyComparison.tsx (overall comparison table)
 *   - SPOFAnalysisPanel.tsx (SPOF detection display)
 *   - RedundancyMetrics.tsx (redundancy analysis display)
 *   - ExamQuestions.tsx (exam scenarios)
 *   - TrafficFlowVisualization.tsx (traffic patterns)
 *   - ThreeTierModel.tsx (three-tier model explorer)
 * - TopologyAnalyzer/hooks/
 *   - useSPOFAnalysis.ts (SPOF detection logic)
 *   - useRedundancyAnalysis.ts (redundancy calculations)
 *   - useComparisonMetrics.ts (comparison metrics)
 * - TopologyAnalyzer/utils/
 *   - calculations.ts (helper functions)
 * - TopologyAnalyzer/data/
 *   - examQuestions.ts (exam question generation)
 * - TopologyAnalyzer/types.ts (TypeScript types)
 * - TopologyAnalyzer/styles.css (all component styles)
 *
 * Original monolithic component: 1855 lines
 * New modular structure: ~14 files, each under 200 lines
 *
 * All functionality has been preserved and is fully backwards compatible.
 */
