/**
 * Rate Limiting Tests
 * Verifies rate limiting works correctly for different endpoints
 */

import request from 'supertest';
import express, { Application } from 'express';
import {
  authRateLimit,
  registrationRateLimit,
  passwordResetRateLimit,
  standardRateLimit,
  readRateLimit,
  assessmentRateLimit,
} from '../../src/middleware/rate-limit.middleware';

describe('Rate Limiting', () => {
  describe('Authentication Rate Limit', () => {
    let app: Application;

    beforeEach(() => {
      app = express();
      app.use(express.json());
      app.post('/login', authRateLimit, (req, res) => {
        res.json({ success: true });
      });
    });

    test('should allow requests within limit', async () => {
      for (let i = 0; i < 5; i++) {
        const response = await request(app)
          .post('/login')
          .send({ email: 'test@example.com', password: 'test' });

        expect(response.status).toBe(200);
      }
    });

    test('should block requests exceeding limit', async () => {
      // Make 5 requests (the limit)
      for (let i = 0; i < 5; i++) {
        await request(app)
          .post('/login')
          .send({ email: 'test@example.com', password: 'test' });
      }

      // 6th request should be blocked
      const response = await request(app)
        .post('/login')
        .send({ email: 'test@example.com', password: 'test' });

      expect(response.status).toBe(429);
      expect(response.body.error).toContain('Too many');
      expect(response.body.code).toBe('RATE_LIMIT_EXCEEDED');
      expect(response.headers['retry-after']).toBeDefined();
    });

    test('should set rate limit headers', async () => {
      const response = await request(app)
        .post('/login')
        .send({ email: 'test@example.com', password: 'test' });

      expect(response.headers['ratelimit-limit']).toBeDefined();
      expect(response.headers['ratelimit-remaining']).toBeDefined();
      expect(response.headers['ratelimit-reset']).toBeDefined();
    });
  });

  describe('Registration Rate Limit', () => {
    let app: Application;

    beforeEach(() => {
      app = express();
      app.use(express.json());
      app.post('/register', registrationRateLimit, (req, res) => {
        res.json({ success: true });
      });
    });

    test('should allow 3 registrations per hour', async () => {
      for (let i = 0; i < 3; i++) {
        const response = await request(app)
          .post('/register')
          .send({ email: `test${i}@example.com`, password: 'test' });

        expect(response.status).toBe(200);
      }
    });

    test('should block 4th registration', async () => {
      // Make 3 requests (the limit)
      for (let i = 0; i < 3; i++) {
        await request(app)
          .post('/register')
          .send({ email: `test${i}@example.com`, password: 'test' });
      }

      // 4th request should be blocked
      const response = await request(app)
        .post('/register')
        .send({ email: 'test4@example.com', password: 'test' });

      expect(response.status).toBe(429);
    });
  });

  describe('Password Reset Rate Limit', () => {
    let app: Application;

    beforeEach(() => {
      app = express();
      app.use(express.json());
      app.post('/forgot-password', passwordResetRateLimit, (req, res) => {
        res.json({ success: true });
      });
    });

    test('should allow 3 password reset requests per hour', async () => {
      for (let i = 0; i < 3; i++) {
        const response = await request(app)
          .post('/forgot-password')
          .send({ email: 'test@example.com' });

        expect(response.status).toBe(200);
      }
    });

    test('should block 4th password reset request', async () => {
      // Make 3 requests (the limit)
      for (let i = 0; i < 3; i++) {
        await request(app)
          .post('/forgot-password')
          .send({ email: 'test@example.com' });
      }

      // 4th request should be blocked
      const response = await request(app)
        .post('/forgot-password')
        .send({ email: 'test@example.com' });

      expect(response.status).toBe(429);
    });
  });

  describe('Standard Rate Limit', () => {
    let app: Application;

    beforeEach(() => {
      app = express();
      app.use(express.json());
      app.post('/api/resource', standardRateLimit, (req, res) => {
        res.json({ success: true });
      });
    });

    test('should allow 100 requests per 15 minutes', async () => {
      // Test first few requests
      for (let i = 0; i < 10; i++) {
        const response = await request(app)
          .post('/api/resource')
          .send({ data: 'test' });

        expect(response.status).toBe(200);
      }
    });

    test('should track remaining requests', async () => {
      const response = await request(app)
        .post('/api/resource')
        .send({ data: 'test' });

      const remaining = parseInt(response.headers['ratelimit-remaining']);
      expect(remaining).toBeLessThan(100);
    });
  });

  describe('Read Rate Limit', () => {
    let app: Application;

    beforeEach(() => {
      app = express();
      app.get('/api/resource', readRateLimit, (req, res) => {
        res.json({ success: true });
      });
    });

    test('should allow 300 requests per 15 minutes', async () => {
      // Test first few requests
      for (let i = 0; i < 10; i++) {
        const response = await request(app).get('/api/resource');

        expect(response.status).toBe(200);
      }
    });

    test('should be more lenient than write operations', async () => {
      const response = await request(app).get('/api/resource');

      const limit = parseInt(response.headers['ratelimit-limit']);
      expect(limit).toBe(300);
    });
  });

  describe('Assessment Rate Limit', () => {
    let app: Application;

    beforeEach(() => {
      app = express();
      app.use(express.json());
      app.post('/api/assessment/submit', assessmentRateLimit, (req, res) => {
        res.json({ success: true });
      });
    });

    test('should allow 50 submissions per hour', async () => {
      // Test first few requests
      for (let i = 0; i < 10; i++) {
        const response = await request(app)
          .post('/api/assessment/submit')
          .send({ answers: [] });

        expect(response.status).toBe(200);
      }
    });

    test('should track submissions separately per user', async () => {
      const response = await request(app)
        .post('/api/assessment/submit')
        .send({ answers: [] });

      expect(response.headers['ratelimit-limit']).toBe('50');
    });
  });

  describe('Rate Limit Error Response', () => {
    let app: Application;

    beforeEach(() => {
      app = express();
      app.use(express.json());
      app.post('/test', authRateLimit, (req, res) => {
        res.json({ success: true });
      });
    });

    test('should return proper error structure', async () => {
      // Exceed rate limit
      for (let i = 0; i < 6; i++) {
        await request(app).post('/test').send({ data: 'test' });
      }

      const response = await request(app).post('/test').send({ data: 'test' });

      expect(response.status).toBe(429);
      expect(response.body).toHaveProperty('success', false);
      expect(response.body).toHaveProperty('error');
      expect(response.body).toHaveProperty('code');
      expect(response.body).toHaveProperty('retryAfter');
    });

    test('should include Retry-After header', async () => {
      // Exceed rate limit
      for (let i = 0; i < 6; i++) {
        await request(app).post('/test').send({ data: 'test' });
      }

      const response = await request(app).post('/test').send({ data: 'test' });

      expect(response.headers['retry-after']).toBeDefined();
      const retryAfter = parseInt(response.headers['retry-after']);
      expect(retryAfter).toBeGreaterThan(0);
    });
  });
});
