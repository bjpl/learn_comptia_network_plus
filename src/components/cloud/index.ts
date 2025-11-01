/**
 * Cloud Concepts Components - Barrel Export
 * CompTIA Network+ Learning Objective 1.2
 */

export { CloudSummaryBuilder } from './CloudSummaryBuilder';
export { CloudArchitectureDesigner } from './CloudArchitectureDesigner';
export { CloudSummaryBuilderEnhanced } from './CloudSummaryBuilderEnhanced';

export * from './cloud-types';
export * from './cloud-data';

// Component metadata for integration
export const cloudComponents = {
  summaryBuilder: {
    id: 'component-7',
    name: 'Cloud Concept Summary Card Builder',
    learningObjective: '1.2',
    description:
      'Interactive workspace for reading cloud scenarios and creating structured summaries',
    features: [
      '500-1000 word cloud scenarios (AWS, Azure, GCP)',
      'Structured summary cards with 9 required elements',
      'Auto-scoring: 40% models, 20% conciseness, 40% coverage',
      'Real-time word counter with 100-word target',
      'Validation and feedback system',
    ],
  },
  architectureDesigner: {
    id: 'component-8',
    name: 'Cloud Architecture Designer',
    learningObjective: '1.2',
    description: 'Drag-and-drop canvas for designing cloud architectures',
    features: [
      'Visual component library (deployment, services, connectivity, VPC, gateways, NFV)',
      'Snap-to-grid drag-and-drop interface',
      'Connection management between components',
      'Architecture validation with scoring',
      'Export designs to JSON',
      'Property configuration for each component',
    ],
  },
  summaryBuilderEnhanced: {
    id: 'component-12',
    name: 'Cloud Concept Summary Builder (Enhanced)',
    learningObjective: '1.2',
    description: 'Comprehensive exam-focused cloud learning tool',
    features: [
      'Cloud terminology with 12+ definitions (3 categories)',
      'Service model comparison matrix (SaaS/PaaS/IaaS)',
      'Use case matcher (6 real-world scenarios)',
      'Cloud cost calculator (3 infrastructure profiles)',
      'Exam practice questions (4 questions with feedback)',
      'Responsive design with mobile optimization',
      '637 lines (under 700-line limit)',
    ],
  },
};
