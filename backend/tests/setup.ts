import dotenv from 'dotenv';
import path from 'path';

// Load test environment variables before any other code runs
dotenv.config({ path: path.resolve(__dirname, '../.env.test') });

// Ensure NODE_ENV is set to test
process.env.NODE_ENV = 'test';

// Set default values for required environment variables if not set
if (!process.env.JWT_SECRET) {
  process.env.JWT_SECRET = 'test-jwt-secret-for-testing-only';
}

if (!process.env.REFRESH_TOKEN_SECRET) {
  process.env.REFRESH_TOKEN_SECRET = 'test-refresh-token-secret-for-testing-only';
}

if (!process.env.SESSION_SECRET) {
  process.env.SESSION_SECRET = 'test-session-secret-for-testing-only';
}

if (!process.env.DB_PASSWORD) {
  process.env.DB_PASSWORD = 'test_password';
}

if (!process.env.CORS_ORIGIN) {
  process.env.CORS_ORIGIN = 'http://localhost:3000';
}

// Suppress console output during tests (optional)
if (process.env.SUPPRESS_TEST_LOGS === 'true') {
  global.console = {
    ...console,
    log: jest.fn(),
    debug: jest.fn(),
    info: jest.fn(),
    warn: jest.fn(),
    error: jest.fn(),
  };
}
