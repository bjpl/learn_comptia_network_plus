import type { IaCLanguage, ValidationResult } from '../types';

/**
 * Validates IaC code based on language type
 */
export const validateCode = (
  code: string,
  language: IaCLanguage
): ValidationResult => {
  const errors: string[] = [];

  if (code.trim().length === 0) {
    errors.push('Code editor is empty');
    return { isValid: false, errors };
  }

  // Basic syntax validation
  if (language === 'yaml') {
    if (!code.includes('---')) {
      errors.push('YAML should start with ---');
    }
    if (!code.includes('tasks:') && !code.includes('resource')) {
      errors.push('No tasks or resources defined');
    }
  } else if (language === 'json') {
    try {
      JSON.parse(code);
    } catch {
      errors.push('Invalid JSON syntax');
    }
  }

  return { isValid: errors.length === 0, errors };
};
