/**
 * Type definitions for security sanitization utilities
 * Provides type-safe alternatives to `any` types
 */

/**
 * JSON value types that can be safely sanitized
 */
export type SanitizableValue = string | number | boolean | null | undefined;

/**
 * JSON object type for sanitization
 */
export type SanitizableObject = {
  [key: string]: SanitizableValue | SanitizableValue[] | SanitizableObject | SanitizableObject[];
};

/**
 * Union type for all sanitizable data structures
 */
export type SanitizableData = SanitizableValue | SanitizableValue[] | SanitizableObject;

/**
 * Sanitizer function type
 */
export type SanitizerFunction = (value: string) => string;

/**
 * HTML sanitization configuration
 */
export interface HtmlSanitizeConfig {
  ALLOWED_TAGS: string[];
  ALLOWED_ATTR: string[];
}

/**
 * DOMPurify-compatible config
 */
export interface DOMPurifyConfig {
  ALLOWED_TAGS?: string[];
  ALLOWED_ATTR?: string[];
  KEEP_CONTENT?: boolean;
  RETURN_DOM?: boolean;
  RETURN_DOM_FRAGMENT?: boolean;
}

/**
 * Sanitization result with metadata
 */
export interface SanitizationResult<T = string> {
  sanitized: T;
  modified: boolean;
  removedTags?: string[];
  warnings?: string[];
}

/**
 * Batch sanitization result
 */
export interface BatchSanitizationResult<T extends SanitizableObject = SanitizableObject> {
  data: T;
  totalFields: number;
  sanitizedFields: number;
  warnings: Array<{
    field: string;
    message: string;
  }>;
}
