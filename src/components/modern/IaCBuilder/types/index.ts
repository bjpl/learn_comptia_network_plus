export type IaCLanguage = 'yaml' | 'json' | 'hcl';

export type IaCTab = 'concepts' | 'templates' | 'builder' | 'drift' | 'pipeline' | 'tools';

export interface ValidationResult {
  isValid: boolean;
  errors: string[];
}

export interface PipelineStage {
  name: string;
  description: string;
  status: 'success' | 'running' | 'failed' | 'pending';
  duration: string;
}

export interface SampleCode {
  yaml: string;
  json: string;
  hcl: string;
}
