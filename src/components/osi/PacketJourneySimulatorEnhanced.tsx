/**
 * PacketJourneySimulatorEnhanced - Backwards Compatibility Wrapper
 *
 * This file maintains backwards compatibility by re-exporting the refactored
 * PacketJourneySimulator component. The component has been decomposed into a
 * modular structure for better maintainability:
 *
 * - PacketJourneySimulator/index.tsx - Main orchestrator (under 200 lines)
 * - PacketJourneySimulator/components/ - UI components (8 components)
 * - PacketJourneySimulator/hooks/ - Custom React hooks (2 hooks)
 * - PacketJourneySimulator/data/ - Data and configuration
 * - PacketJourneySimulator/utils/ - Utility functions
 * - PacketJourneySimulator/types.ts - TypeScript definitions
 * - PacketJourneySimulator/constants.ts - Constants
 *
 * Original file: 1340 lines
 * New structure: Modular, maintainable, testable
 */

import React from 'react';
import { PacketJourneySimulator } from './PacketJourneySimulator';
import type { PacketJourneySimulatorProps } from './PacketJourneySimulator/types';

export const PacketJourneySimulatorEnhanced: React.FC<PacketJourneySimulatorProps> = (props) => {
  return <PacketJourneySimulator {...props} />;
};

export default PacketJourneySimulatorEnhanced;
