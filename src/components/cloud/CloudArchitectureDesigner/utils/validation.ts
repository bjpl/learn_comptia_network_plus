/**
 * Validation utilities
 */

import type {
  ArchitectureComponent,
  Connection,
  ValidationResult,
  ValidationError,
  ValidationWarning,
} from '../types';
import { validationRules } from '../../cloud-data';

export const validateArchitecture = (
  components: ArchitectureComponent[],
  connections: Connection[]
): ValidationResult => {
  const errors: ValidationError[] = [];
  const warnings: ValidationWarning[] = [];

  // Run validation rules
  Object.values(validationRules).forEach((rule) => {
    const result = rule.check(components);
    if (!result.valid) {
      const errorMessage =
        typeof result === 'object' && 'message' in result && typeof result.message === 'string'
          ? result.message
          : 'Validation failed';
      errors.push({
        message: errorMessage,
        severity: 'error',
        suggestion: 'Review architecture requirements',
      });
    }
  });

  // Check for isolated components
  components.forEach((component) => {
    const hasConnections = connections.some(
      (conn) => conn.from === component.id || conn.to === component.id
    );
    if (!hasConnections && component.type !== 'deployment-zone') {
      warnings.push({
        componentId: component.id,
        message: `${component.name} is not connected to any other components`,
        type: 'best-practice',
      });
    }
  });

  // Calculate score
  const maxScore = 100;
  const score = Math.max(0, maxScore - errors.length * 15 - warnings.length * 5);

  return {
    valid: errors.length === 0,
    errors,
    warnings,
    score,
  };
};
