/**
 * SQL Injection Prevention Tests
 * Verifies that database queries are safe from SQL injection attacks
 */

import { Pool } from 'pg';
import DatabaseQuery, { escapeLikePattern, validateIdentifier, quoteIdentifier } from '../../src/utils/db-query';

describe('SQL Injection Prevention', () => {
  let mockPool: Pool;
  let dbQuery: DatabaseQuery;

  beforeEach(() => {
    mockPool = {
      query: jest.fn().mockResolvedValue({ rows: [], rowCount: 0 }),
      connect: jest.fn().mockResolvedValue({
        query: jest.fn(),
        release: jest.fn(),
      }),
    } as any;

    dbQuery = new DatabaseQuery(mockPool);
  });

  describe('Query Validation', () => {
    test('should reject queries with multiple statements', async () => {
      const maliciousQuery = "SELECT * FROM users; DROP TABLE users;";

      await expect(
        dbQuery.execute(maliciousQuery, [])
      ).rejects.toThrow('Multiple statements not allowed');
    });

    test('should reject DROP TABLE commands', async () => {
      const maliciousQuery = "DROP TABLE users";

      await expect(
        dbQuery.execute(maliciousQuery, [])
      ).rejects.toThrow('Dangerous SQL pattern detected');
    });

    test('should reject DROP DATABASE commands', async () => {
      const maliciousQuery = "DROP DATABASE mydb";

      await expect(
        dbQuery.execute(maliciousQuery, [])
      ).rejects.toThrow('Dangerous SQL pattern detected');
    });

    test('should reject TRUNCATE commands', async () => {
      const maliciousQuery = "TRUNCATE TABLE users";

      await expect(
        dbQuery.execute(maliciousQuery, [])
      ).rejects.toThrow('Dangerous SQL pattern detected');
    });

    test('should reject EXEC commands', async () => {
      const maliciousQuery = "EXEC('malicious code')";

      await expect(
        dbQuery.execute(maliciousQuery, [])
      ).rejects.toThrow('Dangerous SQL pattern detected');
    });

    test('should accept safe SELECT queries', async () => {
      const safeQuery = "SELECT * FROM users WHERE id = $1";

      await expect(
        dbQuery.execute(safeQuery, [1])
      ).resolves.toBeDefined();
    });

    test('should accept safe INSERT queries', async () => {
      const safeQuery = "INSERT INTO users (email, password) VALUES ($1, $2)";

      await expect(
        dbQuery.execute(safeQuery, ['test@example.com', 'hashed_password'])
      ).resolves.toBeDefined();
    });
  });

  describe('Parameter Validation', () => {
    test('should reject non-array parameters', async () => {
      const query = "SELECT * FROM users WHERE id = $1";

      await expect(
        dbQuery.execute(query, 'not_an_array' as any)
      ).rejects.toThrow('Params must be an array');
    });

    test('should accept string parameters', async () => {
      const query = "SELECT * FROM users WHERE email = $1";

      await expect(
        dbQuery.execute(query, ['test@example.com'])
      ).resolves.toBeDefined();
    });

    test('should accept number parameters', async () => {
      const query = "SELECT * FROM users WHERE id = $1";

      await expect(
        dbQuery.execute(query, [123])
      ).resolves.toBeDefined();
    });

    test('should accept boolean parameters', async () => {
      const query = "SELECT * FROM users WHERE is_active = $1";

      await expect(
        dbQuery.execute(query, [true])
      ).resolves.toBeDefined();
    });

    test('should accept null parameters', async () => {
      const query = "SELECT * FROM users WHERE deleted_at = $1";

      await expect(
        dbQuery.execute(query, [null])
      ).resolves.toBeDefined();
    });

    test('should accept Date parameters', async () => {
      const query = "SELECT * FROM users WHERE created_at > $1";

      await expect(
        dbQuery.execute(query, [new Date()])
      ).resolves.toBeDefined();
    });

    test('should accept array parameters', async () => {
      const query = "SELECT * FROM users WHERE id = ANY($1)";

      await expect(
        dbQuery.execute(query, [[1, 2, 3]])
      ).resolves.toBeDefined();
    });
  });

  describe('WHERE Clause Builder', () => {
    test('should build safe WHERE clause with single condition', () => {
      const { clause, params } = dbQuery.buildWhereClause({ email: 'test@example.com' });

      expect(clause).toBe('WHERE email = $1');
      expect(params).toEqual(['test@example.com']);
    });

    test('should build safe WHERE clause with multiple conditions', () => {
      const { clause, params } = dbQuery.buildWhereClause({
        email: 'test@example.com',
        is_active: true,
      });

      expect(clause).toBe('WHERE email = $1 AND is_active = $2');
      expect(params).toEqual(['test@example.com', true]);
    });

    test('should handle NULL values correctly', () => {
      const { clause, params } = dbQuery.buildWhereClause({ deleted_at: null });

      expect(clause).toBe('WHERE deleted_at IS NULL');
      expect(params).toEqual([]);
    });

    test('should handle IN clause with arrays', () => {
      const { clause, params } = dbQuery.buildWhereClause({ id: [1, 2, 3] });

      expect(clause).toBe('WHERE id IN ($1, $2, $3)');
      expect(params).toEqual([1, 2, 3]);
    });

    test('should reject invalid column names', () => {
      expect(() => {
        dbQuery.buildWhereClause({ 'DROP TABLE users': 'value' });
      }).toThrow('Invalid column name');
    });

    test('should return empty clause for no conditions', () => {
      const { clause, params } = dbQuery.buildWhereClause({});

      expect(clause).toBe('');
      expect(params).toEqual([]);
    });
  });

  describe('ORDER BY Clause Builder', () => {
    test('should build safe ORDER BY clause', () => {
      const clause = dbQuery.buildOrderByClause({ created_at: 'DESC' });

      expect(clause).toBe('ORDER BY created_at DESC');
    });

    test('should build ORDER BY with multiple columns', () => {
      const clause = dbQuery.buildOrderByClause({
        is_active: 'DESC',
        created_at: 'ASC',
      });

      expect(clause).toBe('ORDER BY is_active DESC, created_at ASC');
    });

    test('should reject invalid column names', () => {
      expect(() => {
        dbQuery.buildOrderByClause({ 'DROP TABLE users': 'ASC' });
      }).toThrow('Invalid column name');
    });

    test('should reject invalid sort direction', () => {
      expect(() => {
        dbQuery.buildOrderByClause({ created_at: 'INVALID' as any });
      }).toThrow('Invalid sort direction');
    });
  });

  describe('Pagination Builder', () => {
    test('should build safe pagination clause', () => {
      const { clause, offset } = dbQuery.buildPaginationClause(1, 10);

      expect(clause).toBe('LIMIT 10 OFFSET 0');
      expect(offset).toBe(0);
    });

    test('should calculate correct offset for page 2', () => {
      const { clause, offset } = dbQuery.buildPaginationClause(2, 10);

      expect(clause).toBe('LIMIT 10 OFFSET 10');
      expect(offset).toBe(10);
    });

    test('should limit maximum page size to 100', () => {
      const { clause } = dbQuery.buildPaginationClause(1, 1000);

      expect(clause).toBe('LIMIT 100 OFFSET 0');
    });

    test('should handle negative page numbers', () => {
      const { clause, offset } = dbQuery.buildPaginationClause(-1, 10);

      expect(offset).toBeGreaterThanOrEqual(0);
    });
  });

  describe('LIKE Pattern Escaping', () => {
    test('should escape % wildcard', () => {
      const escaped = escapeLikePattern('test%value');
      expect(escaped).toBe('test\\%value');
    });

    test('should escape _ wildcard', () => {
      const escaped = escapeLikePattern('test_value');
      expect(escaped).toBe('test\\_value');
    });

    test('should escape backslash', () => {
      const escaped = escapeLikePattern('test\\value');
      expect(escaped).toBe('test\\\\value');
    });

    test('should handle empty string', () => {
      const escaped = escapeLikePattern('');
      expect(escaped).toBe('');
    });

    test('should handle multiple special characters', () => {
      const escaped = escapeLikePattern('test%_value\\test');
      expect(escaped).toBe('test\\%\\_value\\\\test');
    });
  });

  describe('Identifier Validation', () => {
    test('should validate safe column names', () => {
      expect(validateIdentifier('user_id')).toBe(true);
      expect(validateIdentifier('email')).toBe(true);
      expect(validateIdentifier('created_at')).toBe(true);
    });

    test('should reject column names with spaces', () => {
      expect(validateIdentifier('user name')).toBe(false);
    });

    test('should reject column names with special characters', () => {
      expect(validateIdentifier('user-id')).toBe(false);
      expect(validateIdentifier('user.id')).toBe(false);
      expect(validateIdentifier('user;DROP TABLE users')).toBe(false);
    });

    test('should reject column names starting with numbers', () => {
      expect(validateIdentifier('1user')).toBe(false);
    });
  });

  describe('Identifier Quoting', () => {
    test('should quote valid identifiers', () => {
      expect(quoteIdentifier('user_id')).toBe('"user_id"');
      expect(quoteIdentifier('email')).toBe('"email"');
    });

    test('should reject invalid identifiers', () => {
      expect(() => quoteIdentifier('user; DROP TABLE users')).toThrow('Invalid identifier');
      expect(() => quoteIdentifier('user name')).toThrow('Invalid identifier');
    });
  });
});
