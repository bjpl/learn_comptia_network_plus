/**
 * Database Query Utilities
 * SQL injection prevention and safe query execution
 */

import { Pool, QueryResult } from 'pg';
import { logger } from '../config/logger';

/**
 * Safe query execution with parameterized queries
 * ALWAYS use this instead of string concatenation
 */
export class DatabaseQuery {
  private pool: Pool;

  constructor(pool: Pool) {
    this.pool = pool;
  }

  /**
   * Execute a parameterized query safely
   * @param query SQL query with $1, $2, etc. placeholders
   * @param params Array of parameters to bind
   * @returns Query result
   */
  async execute<T = any>(query: string, params: any[] = []): Promise<QueryResult<T>> {
    // Validate inputs
    this.validateQuery(query);
    this.validateParams(params);

    try {
      const startTime = Date.now();
      const result = await this.pool.query<T>(query, params);
      const duration = Date.now() - startTime;

      // Log slow queries (> 1 second)
      if (duration > 1000) {
        logger.warn('Slow query detected', {
          query: this.sanitizeQueryForLog(query),
          duration,
          rowCount: result.rowCount,
        });
      }

      return result;
    } catch (error) {
      logger.error('Database query error', {
        query: this.sanitizeQueryForLog(query),
        error: error instanceof Error ? error.message : 'Unknown error',
      });
      throw error;
    }
  }

  /**
   * Execute a query and return the first row
   */
  async executeOne<T = any>(query: string, params: any[] = []): Promise<T | null> {
    const result = await this.execute<T>(query, params);
    return result.rows[0] || null;
  }

  /**
   * Execute a query and return all rows
   */
  async executeMany<T = any>(query: string, params: any[] = []): Promise<T[]> {
    const result = await this.execute<T>(query, params);
    return result.rows;
  }

  /**
   * Execute a transaction with multiple queries
   */
  async transaction<T>(callback: (query: DatabaseQuery) => Promise<T>): Promise<T> {
    const client = await this.pool.connect();
    const transactionQuery = new DatabaseQuery(this.pool);

    try {
      await client.query('BEGIN');
      const result = await callback(transactionQuery);
      await client.query('COMMIT');
      return result;
    } catch (error) {
      await client.query('ROLLBACK');
      logger.error('Transaction error', {
        error: error instanceof Error ? error.message : 'Unknown error',
      });
      throw error;
    } finally {
      client.release();
    }
  }

  /**
   * Validate query string
   * Prevents certain dangerous patterns
   */
  private validateQuery(query: string): void {
    if (!query || typeof query !== 'string') {
      throw new Error('Query must be a non-empty string');
    }

    // Trim and normalize whitespace
    const normalized = query.trim().toLowerCase();

    // Block multiple statements (prevents SQL injection via stacked queries)
    if (normalized.includes(';') && !normalized.endsWith(';')) {
      throw new Error('Multiple statements not allowed');
    }

    // Block dangerous commands
    const dangerousPatterns = [
      /\bdrop\s+table\b/i,
      /\bdrop\s+database\b/i,
      /\btruncate\s+table\b/i,
      /\bexec\s*\(/i,
      /\bexecute\s*\(/i,
      /\bsp_executesql\b/i,
      /\bxp_cmdshell\b/i,
    ];

    for (const pattern of dangerousPatterns) {
      if (pattern.test(normalized)) {
        logger.error('Dangerous SQL pattern detected', { pattern: pattern.toString() });
        throw new Error('Dangerous SQL pattern detected');
      }
    }
  }

  /**
   * Validate query parameters
   * Ensures parameters are safe
   */
  private validateParams(params: any[]): void {
    if (!Array.isArray(params)) {
      throw new Error('Params must be an array');
    }

    // Check for dangerous parameter types
    for (let i = 0; i < params.length; i++) {
      const param = params[i];

      // Null, undefined, and primitives are okay
      if (param === null || param === undefined) continue;
      if (typeof param === 'string') continue;
      if (typeof param === 'number') continue;
      if (typeof param === 'boolean') continue;
      if (param instanceof Date) continue;
      if (Buffer.isBuffer(param)) continue;
      if (Array.isArray(param)) {
        // Validate array elements
        this.validateParams(param);
        continue;
      }

      // Plain objects are okay for JSON columns
      if (typeof param === 'object' && param.constructor === Object) {
        continue;
      }

      logger.error('Invalid parameter type', {
        index: i,
        type: typeof param,
      });
      throw new Error(`Invalid parameter type at index ${i}`);
    }
  }

  /**
   * Sanitize query for logging
   * Removes sensitive data from logs
   */
  private sanitizeQueryForLog(query: string): string {
    return query
      .replace(/\$\d+/g, '?') // Replace $1, $2, etc. with ?
      .replace(/\s+/g, ' ') // Normalize whitespace
      .trim()
      .slice(0, 500); // Limit length
  }

  /**
   * Build a WHERE clause with AND conditions safely
   */
  buildWhereClause(conditions: Record<string, any>): { clause: string; params: any[] } {
    const entries = Object.entries(conditions).filter(([_, value]) => value !== undefined);

    if (entries.length === 0) {
      return { clause: '', params: [] };
    }

    const clauses: string[] = [];
    const params: any[] = [];

    entries.forEach(([key, value], index) => {
      // Validate column name (alphanumeric + underscore only)
      if (!/^[a-zA-Z_][a-zA-Z0-9_]*$/.test(key)) {
        throw new Error(`Invalid column name: ${key}`);
      }

      if (value === null) {
        clauses.push(`${key} IS NULL`);
      } else if (Array.isArray(value)) {
        const placeholders = value.map((_, i) => `$${params.length + i + 1}`).join(', ');
        clauses.push(`${key} IN (${placeholders})`);
        params.push(...value);
      } else {
        clauses.push(`${key} = $${params.length + 1}`);
        params.push(value);
      }
    });

    return {
      clause: `WHERE ${clauses.join(' AND ')}`,
      params,
    };
  }

  /**
   * Build ORDER BY clause safely
   */
  buildOrderByClause(orderBy: Record<string, 'ASC' | 'DESC' | 'asc' | 'desc'>): string {
    const entries = Object.entries(orderBy);

    if (entries.length === 0) {
      return '';
    }

    const clauses = entries.map(([key, direction]) => {
      // Validate column name
      if (!/^[a-zA-Z_][a-zA-Z0-9_]*$/.test(key)) {
        throw new Error(`Invalid column name: ${key}`);
      }

      // Validate direction
      const dir = direction.toUpperCase();
      if (dir !== 'ASC' && dir !== 'DESC') {
        throw new Error(`Invalid sort direction: ${direction}`);
      }

      return `${key} ${dir}`;
    });

    return `ORDER BY ${clauses.join(', ')}`;
  }

  /**
   * Build LIMIT and OFFSET clause safely
   */
  buildPaginationClause(page: number = 1, pageSize: number = 10): { clause: string; offset: number } {
    const limit = Math.min(Math.max(1, pageSize), 100); // Max 100 items per page
    const offset = Math.max(0, (page - 1) * limit);

    return {
      clause: `LIMIT ${limit} OFFSET ${offset}`,
      offset,
    };
  }
}

/**
 * Escape LIKE pattern wildcards
 * Use when accepting user input for LIKE queries
 */
export const escapeLikePattern = (pattern: string): string => {
  if (!pattern || typeof pattern !== 'string') {
    return '';
  }

  return pattern
    .replace(/\\/g, '\\\\')
    .replace(/%/g, '\\%')
    .replace(/_/g, '\\_');
};

/**
 * Validate table/column name
 * Ensures identifier is safe for dynamic queries
 */
export const validateIdentifier = (identifier: string): boolean => {
  return /^[a-zA-Z_][a-zA-Z0-9_]*$/.test(identifier);
};

/**
 * Quote identifier for use in queries
 * Use for table/column names from user input
 */
export const quoteIdentifier = (identifier: string): string => {
  if (!validateIdentifier(identifier)) {
    throw new Error(`Invalid identifier: ${identifier}`);
  }

  return `"${identifier}"`;
};

export default DatabaseQuery;
