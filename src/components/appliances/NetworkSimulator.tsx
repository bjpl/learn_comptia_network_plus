/**
 * NetworkSimulator - Re-export module
 *
 * This file serves as the main entry point for the NetworkSimulator component.
 * The actual implementation has been decomposed into smaller modules for better maintainability.
 *
 * Structure:
 * - components/: UI components (Toolbar, Canvas, Panels, etc.)
 * - hooks/: Custom React hooks for state management
 * - utils/: Utility functions and helpers
 * - types/: TypeScript type definitions
 */

export { default } from './NetworkSimulator/NetworkSimulatorMain';
export type { NetworkSimulatorProps } from './NetworkSimulator/types';
