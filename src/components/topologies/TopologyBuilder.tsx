/**
 * TopologyBuilder Component (Legacy Entry Point)
 *
 * This file is maintained for backwards compatibility.
 * The actual implementation has been decomposed into modular components
 * located in ./builder/ directory.
 *
 * @deprecated Import from './builder' instead
 */

// Re-export everything from the refactored builder
export {
  TopologyBuilder,
  type DeviceType,
  type DetectedTopologyType,
  type BuilderDevice,
  type BuilderConnection,
  type TopologyTemplate,
  type ValidationIssue,
  type TopologyBuilderProps
} from './builder';

export { default } from './builder';
