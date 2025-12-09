/**
 * BACKWARD COMPATIBILITY EXPORT
 *
 * This file now re-exports the refactored PortScannerEnhanced component
 * from the modular structure in ./PortScannerEnhanced/
 *
 * Original file: 1558 lines
 * Refactored structure:
 * - index.tsx: Main orchestrator (~250 lines)
 * - components/: 8 sub-components
 * - hooks/: 1 custom hook
 * - utils/: Constants, simulation logic, styles
 * - types/: TypeScript type definitions
 *
 * All functionality remains identical.
 */

export { PortScannerEnhanced, default } from './PortScannerEnhanced/index';
