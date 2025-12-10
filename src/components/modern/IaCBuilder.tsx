/**
 * IaCBuilder Component - Re-export from modular structure
 *
 * This file serves as a simple re-export for backward compatibility.
 * The actual implementation has been decomposed into a modular structure:
 *
 * Structure:
 * - IaCBuilder/
 *   - components/     - 9 sub-components (CodeBlock, tabs, BestPractices)
 *   - hooks/          - useIaCBuilder custom hook
 *   - utils/          - 4 utility modules (syntax highlighting, validation, etc.)
 *   - types/          - TypeScript type definitions
 *   - index.tsx       - Main orchestrator (122 lines)
 *
 * Original size: 1288 lines
 * New main file: 122 lines (90.5% reduction)
 */
export { default } from './IaCBuilder/index';
