/**
 * BACKWARD COMPATIBILITY WRAPPER
 *
 * This file maintains backward compatibility by re-exporting the refactored component.
 * The original PortScannerEnhanced.tsx has been decomposed into modular files in the
 * port-scanner/ directory for better maintainability.
 *
 * Original file: 1526 lines
 * Refactored structure:
 * - port-scanner/index.tsx (main orchestrator)
 * - port-scanner/components/ (UI components)
 * - port-scanner/hooks/ (state management)
 * - port-scanner/data/ (port definitions)
 * - port-scanner/utils/ (calculation utilities)
 * - port-scanner/types.ts (TypeScript interfaces)
 * - port-scanner/constants.ts (scan configurations)
 */

export { default } from './port-scanner/index';
export { default as PortScannerEnhancedRefactored } from './port-scanner/index';
