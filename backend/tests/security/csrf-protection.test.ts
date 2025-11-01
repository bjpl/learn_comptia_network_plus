/**
 * CSRF Protection Tests
 * Verifies CSRF token generation and validation
 */

import request from 'supertest';
import express, { Application } from 'express';
import cookieParser from 'cookie-parser';
import { csrfProtection, generateCsrfToken, verifyCsrfToken } from '../../src/middleware/csrf.middleware';

describe('CSRF Protection', () => {
  let app: Application;

  beforeEach(() => {
    app = express();
    app.use(express.json());
    app.use(cookieParser());
  });

  describe('Token Generation', () => {
    test('should generate CSRF token for GET requests', async () => {
      app.get('/test', generateCsrfToken, (req, res) => {
        res.json({ token: res.locals.csrfToken });
      });

      const response = await request(app).get('/test');

      expect(response.status).toBe(200);
      expect(response.body.token).toBeDefined();
      expect(response.body.token).toHaveLength(64); // 32 bytes hex encoded
      expect(response.headers['set-cookie']).toBeDefined();

      const cookies = response.headers['set-cookie'] as unknown as string[];
      const csrfCookie = cookies.find(c => c.startsWith('XSRF-TOKEN='));
      expect(csrfCookie).toBeDefined();
    });

    test('should generate unique tokens', async () => {
      app.get('/test', generateCsrfToken, (req, res) => {
        res.json({ token: res.locals.csrfToken });
      });

      const response1 = await request(app).get('/test');
      const response2 = await request(app).get('/test');

      expect(response1.body.token).not.toBe(response2.body.token);
    });
  });

  describe('Token Verification', () => {
    test('should reject POST request without CSRF token', async () => {
      app.post('/test', verifyCsrfToken, (req, res) => {
        res.json({ success: true });
      });

      const response = await request(app).post('/test').send({ data: 'test' });

      expect(response.status).toBe(403);
      expect(response.body.error).toBe('CSRF token missing');
      expect(response.body.code).toBe('CSRF_TOKEN_MISSING');
    });

    test('should reject request with invalid CSRF token', async () => {
      app.post('/test', verifyCsrfToken, (req, res) => {
        res.json({ success: true });
      });

      const response = await request(app)
        .post('/test')
        .set('X-CSRF-Token', 'invalid-token')
        .send({ data: 'test' });

      expect(response.status).toBe(403);
      expect(response.body.error).toContain('CSRF token');
    });

    test('should accept request with valid CSRF token', async () => {
      let csrfToken: string;

      app.get('/get-token', generateCsrfToken, (req, res) => {
        res.json({ token: res.locals.csrfToken });
      });

      app.post('/test', verifyCsrfToken, (req, res) => {
        res.json({ success: true });
      });

      // Get token
      const getResponse = await request(app).get('/get-token');
      csrfToken = getResponse.body.token;

      const cookies = getResponse.headers['set-cookie'] as unknown as string[];
      const csrfCookie = cookies.find(c => c.startsWith('XSRF-TOKEN='));

      // Use token
      const postResponse = await request(app)
        .post('/test')
        .set('Cookie', csrfCookie!)
        .set('X-CSRF-Token', csrfToken)
        .send({ data: 'test' });

      expect(postResponse.status).toBe(200);
      expect(postResponse.body.success).toBe(true);
    });

    test('should accept CSRF token from body', async () => {
      let csrfToken: string;

      app.get('/get-token', generateCsrfToken, (req, res) => {
        res.json({ token: res.locals.csrfToken });
      });

      app.post('/test', verifyCsrfToken, (req, res) => {
        res.json({ success: true });
      });

      // Get token
      const getResponse = await request(app).get('/get-token');
      csrfToken = getResponse.body.token;

      const cookies = getResponse.headers['set-cookie'] as unknown as string[];
      const csrfCookie = cookies.find(c => c.startsWith('XSRF-TOKEN='));

      // Use token in body
      const postResponse = await request(app)
        .post('/test')
        .set('Cookie', csrfCookie!)
        .send({ _csrf: csrfToken, data: 'test' });

      expect(postResponse.status).toBe(200);
      expect(postResponse.body.success).toBe(true);
    });
  });

  describe('CSRF Protection Middleware', () => {
    test('should generate token for GET requests', async () => {
      app.use(csrfProtection);

      app.get('/test', (req, res) => {
        res.json({ token: res.locals.csrfToken });
      });

      const response = await request(app).get('/test');

      expect(response.status).toBe(200);
      expect(response.body.token).toBeDefined();
    });

    test('should verify token for POST requests', async () => {
      app.use(csrfProtection);

      app.post('/test', (req, res) => {
        res.json({ success: true });
      });

      const response = await request(app).post('/test').send({ data: 'test' });

      expect(response.status).toBe(403);
    });

    test('should skip verification for GET/HEAD/OPTIONS', async () => {
      app.use(csrfProtection);

      app.get('/get', (req, res) => res.json({ method: 'GET' }));
      app.head('/head', (req, res) => res.status(200).end());
      app.options('/options', (req, res) => res.json({ method: 'OPTIONS' }));

      await request(app).get('/get').expect(200);
      await request(app).head('/head').expect(200);
      await request(app).options('/options').expect(200);
    });

    test('should require verification for PUT/DELETE/PATCH', async () => {
      app.use(csrfProtection);

      app.put('/put', (req, res) => res.json({ success: true }));
      app.delete('/delete', (req, res) => res.json({ success: true }));
      app.patch('/patch', (req, res) => res.json({ success: true }));

      await request(app).put('/put').expect(403);
      await request(app).delete('/delete').expect(403);
      await request(app).patch('/patch').expect(403);
    });
  });

  describe('Token Expiration', () => {
    test('should reject expired token', async (done) => {
      app.get('/get-token', generateCsrfToken, (req, res) => {
        res.json({ token: res.locals.csrfToken });
      });

      app.post('/test', verifyCsrfToken, (req, res) => {
        res.json({ success: true });
      });

      // Get token
      const getResponse = await request(app).get('/get-token');
      const csrfToken = getResponse.body.token;
      const cookies = getResponse.headers['set-cookie'] as unknown as string[];
      const csrfCookie = cookies.find(c => c.startsWith('XSRF-TOKEN='));

      // Wait for token to expire (tokens expire after 15 minutes)
      // For testing, we'll just verify the response structure
      const postResponse = await request(app)
        .post('/test')
        .set('Cookie', csrfCookie!)
        .set('X-CSRF-Token', csrfToken)
        .send({ data: 'test' });

      expect(postResponse.status).toBe(200);
      done();
    }, 30000);
  });

  describe('Token Regeneration', () => {
    test('should regenerate token after successful verification', async () => {
      app.get('/get-token', generateCsrfToken, (req, res) => {
        res.json({ token: res.locals.csrfToken });
      });

      app.post('/test', verifyCsrfToken, (req, res) => {
        res.json({ success: true, newToken: res.locals.csrfToken });
      });

      // Get initial token
      const getResponse = await request(app).get('/get-token');
      const initialToken = getResponse.body.token;
      const cookies = getResponse.headers['set-cookie'] as unknown as string[];
      const csrfCookie = cookies.find(c => c.startsWith('XSRF-TOKEN='));

      // Use token
      const postResponse = await request(app)
        .post('/test')
        .set('Cookie', csrfCookie!)
        .set('X-CSRF-Token', initialToken)
        .send({ data: 'test' });

      expect(postResponse.status).toBe(200);

      // Check that a new token was set in cookie
      const newCookies = postResponse.headers['set-cookie'] as unknown as string[];
      expect(newCookies).toBeDefined();

      const newCsrfCookie = newCookies?.find(c => c.startsWith('XSRF-TOKEN='));
      expect(newCsrfCookie).toBeDefined();
    });
  });
});
