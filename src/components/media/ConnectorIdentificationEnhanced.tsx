/**
 * Enhanced Connector Identification Component (Legacy Export)
 *
 * This file maintains backward compatibility by re-exporting the modular implementation.
 * The component has been decomposed into a modular architecture located in:
 * ./ConnectorIdentification/
 *
 * New modular structure:
 * - ConnectorIdentification/index.tsx (main orchestrator)
 * - ConnectorIdentification/components/ (UI components)
 * - ConnectorIdentification/hooks/ (state management)
 * - ConnectorIdentification/data/ (connector database)
 * - ConnectorIdentification/utils/ (helper functions)
 * - ConnectorIdentification/types.ts (TypeScript definitions)
 * - ConnectorIdentification/constants.ts (constants)
 *
 * Interactive training tool for CompTIA Network+ LO 1.4
 * Includes identification quiz, wiring trainer, termination simulator, and fiber inspection
 */

export { default } from './ConnectorIdentification';
export { default as ConnectorIdentificationEnhanced } from './ConnectorIdentification';
