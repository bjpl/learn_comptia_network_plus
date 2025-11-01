/**
 * Appliance Comparison Components
 * Enhanced for CompTIA Network+ N10-008 LO 1.1
 */

export { default as ComparisonMatrix } from './ComparisonMatrix';
export { default as EnhancedComparisonMatrix } from './EnhancedComparisonMatrix';
export { default as OsiLayerFilter } from './OsiLayerFilter';
export { default as DomainVisualizer } from './DomainVisualizer';
export { default as DeviceDecisionHelper } from './DeviceDecisionHelper';
export { default as ExamQuestions } from './ExamQuestions';

export { networkDevices, decisionTreeData, deviceTemplates } from './appliances-data';
export { enhancedNetworkDevices, examQuestions } from './enhanced-appliances-data';

export type {
  NetworkDevice,
  DeviceType,
  DeviceSpecs,
  DeviceFeatures,
  DevicePricing,
  ComparisonDevice,
  DecisionNode,
  DecisionTree,
  ExamQuestion,
  Scenario,
  PoESpecs,
  WirelessSpecs,
  SecuritySpecs,
  LoadBalancerSpecs,
  VpnSpecs,
} from './appliances-types';
