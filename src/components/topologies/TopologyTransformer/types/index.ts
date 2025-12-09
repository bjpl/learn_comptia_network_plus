/**
 * Type definitions for TopologyTransformer component
 */

export interface TopologyTransformerProps {
  className?: string;
}

export interface ExamScenario {
  id: string;
  title: string;
  requirements: string[];
  constraints: string[];
  recommendedTopology: string;
  explanation: string;
  examTip: string;
}

export interface TopologyComparison {
  topology: string;
  pros: string[];
  cons: string[];
  costScore: number; // 1-10 (1=most expensive, 10=cheapest)
  redundancyScore: number; // 1-10 (1=least redundant, 10=most redundant)
  scalabilityScore: number; // 1-10
  complexity: number; // 1-10 (1=simplest, 10=most complex)
}

export type TabType = 'transform' | 'compare' | 'scenarios';
