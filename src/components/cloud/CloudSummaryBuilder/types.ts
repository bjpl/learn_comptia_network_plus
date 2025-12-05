/**
 * Type definitions for CloudSummaryBuilder
 */

export interface CloudSummary {
  deploymentModel?: string;
  deploymentJustification?: string;
  serviceModel?: string;
  serviceExamples?: string[];
  connectivityMethod?: string;
  connectivityReasoning?: string;
  nfvImplementation?: string;
  vpcConfiguration?: {
    subnets: string[];
    securityGroups: string[];
    networkLists: string[];
  };
  cloudGateways?: {
    internetGateway: boolean;
    natGateway: boolean;
    usage: string;
  };
  scalabilityFeatures?: {
    type: string;
    description: string;
    triggers: string[];
  };
  elasticityImplementation?: string;
  multitenancyConsiderations?: string[];
}

export interface ScoreBreakdown {
  modelsAndConcepts: number;
  conciseness: number;
  coverage: number;
  total: number;
  feedback: string[];
}

export type TabType = 'builder' | 'terms' | 'comparison' | 'usecase' | 'cost' | 'exam';
