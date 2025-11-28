import request from 'supertest';
import app from '../src/server';

describe('Auth API', () => {
  let authToken: string;
  let refreshToken: string;
  const testUser = {
    email: `test${Date.now()}@example.com`,
    password: 'Test@1234',
  };

  describe('POST /api/auth/register', () => {
    it('should register a new user', async () => {
      const response = await request(app).post('/api/auth/register').send(testUser).expect(201);

      expect(response.body.success).toBe(true);
      expect(response.body.data.user.email).toBe(testUser.email);
      expect(response.body.data.accessToken).toBeDefined();
      expect(response.body.data.refreshToken).toBeDefined();

      authToken = response.body.data.accessToken;
      refreshToken = response.body.data.refreshToken;
    });

    it('should not register duplicate email', async () => {
      const response = await request(app).post('/api/auth/register').send(testUser).expect(409);

      expect(response.body.success).toBe(false);
      expect(response.body.error).toContain('already exists');
    });

    it('should validate email format', async () => {
      const response = await request(app)
        .post('/api/auth/register')
        .send({
          email: 'invalid-email',
          password: 'Test@1234',
        })
        .expect(400);

      expect(response.body.success).toBe(false);
    });

    it('should validate password strength', async () => {
      const response = await request(app)
        .post('/api/auth/register')
        .send({
          email: 'test2@example.com',
          password: 'weak',
        })
        .expect(400);

      expect(response.body.success).toBe(false);
    });
  });

  describe('POST /api/auth/login', () => {
    it('should login with valid credentials', async () => {
      const response = await request(app).post('/api/auth/login').send(testUser).expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data.user.email).toBe(testUser.email);
      expect(response.body.data.accessToken).toBeDefined();
      expect(response.body.data.refreshToken).toBeDefined();
    });

    it('should not login with invalid email', async () => {
      const response = await request(app)
        .post('/api/auth/login')
        .send({
          email: 'nonexistent@example.com',
          password: 'Test@1234',
        })
        .expect(401);

      expect(response.body.success).toBe(false);
    });

    it('should not login with invalid password', async () => {
      const response = await request(app)
        .post('/api/auth/login')
        .send({
          email: testUser.email,
          password: 'WrongPassword123!',
        })
        .expect(401);

      expect(response.body.success).toBe(false);
    });
  });

  describe('POST /api/auth/refresh', () => {
    it('should refresh access token', async () => {
      const response = await request(app)
        .post('/api/auth/refresh')
        .send({ refreshToken })
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data.accessToken).toBeDefined();
      expect(response.body.data.refreshToken).toBeDefined();
    });

    it('should reject invalid refresh token', async () => {
      const response = await request(app)
        .post('/api/auth/refresh')
        .send({ refreshToken: 'invalid-token' })
        .expect(401);

      expect(response.body.success).toBe(false);
    });
  });

  describe('GET /api/auth/me', () => {
    it('should get current user with valid token', async () => {
      const response = await request(app)
        .get('/api/auth/me')
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data.email).toBe(testUser.email);
    });

    it('should reject request without token', async () => {
      const response = await request(app).get('/api/auth/me').expect(401);

      expect(response.body.success).toBe(false);
    });

    it('should reject request with invalid token', async () => {
      const response = await request(app)
        .get('/api/auth/me')
        .set('Authorization', 'Bearer invalid-token')
        .expect(401);

      expect(response.body.success).toBe(false);
    });
  });

  describe('POST /api/auth/logout', () => {
    it('should logout successfully', async () => {
      const response = await request(app)
        .post('/api/auth/logout')
        .set('Authorization', `Bearer ${authToken}`)
        .send({ refreshToken })
        .expect(200);

      expect(response.body.success).toBe(true);
    });
  });

  describe('Account Lockout Protection', () => {
    const lockoutTestUser = {
      email: `lockout${Date.now()}@example.com`,
      password: 'Test@1234',
    };

    beforeAll(async () => {
      // Register a test user for lockout testing
      await request(app).post('/api/auth/register').send(lockoutTestUser).expect(201);
    });

    it('should track failed login attempts', async () => {
      // First failed attempt
      const response1 = await request(app)
        .post('/api/auth/login')
        .send({
          email: lockoutTestUser.email,
          password: 'WrongPassword123!',
        })
        .expect(401);

      expect(response1.body.success).toBe(false);
      expect(response1.body.error).toContain('Invalid email or password');
    });

    it('should lock account after 5 failed login attempts', async () => {
      const wrongCredentials = {
        email: `locktest${Date.now()}@example.com`,
        password: 'Test@1234',
      };

      // Register user
      await request(app).post('/api/auth/register').send(wrongCredentials).expect(201);

      // Make 5 failed login attempts
      for (let i = 0; i < 5; i++) {
        await request(app).post('/api/auth/login').send({
          email: wrongCredentials.email,
          password: 'WrongPassword123!',
        });
      }

      // 6th attempt should return locked status
      const response = await request(app)
        .post('/api/auth/login')
        .send({
          email: wrongCredentials.email,
          password: 'WrongPassword123!',
        })
        .expect(423);

      expect(response.body.success).toBe(false);
      expect(response.body.error).toContain('locked');
      expect(response.body.remainingMinutes).toBeDefined();
    });

    it('should prevent login on locked account even with correct password', async () => {
      const lockedUser = {
        email: `locked${Date.now()}@example.com`,
        password: 'Test@1234',
      };

      // Register user
      await request(app).post('/api/auth/register').send(lockedUser).expect(201);

      // Make 5 failed login attempts to lock the account
      for (let i = 0; i < 5; i++) {
        await request(app).post('/api/auth/login').send({
          email: lockedUser.email,
          password: 'WrongPassword123!',
        });
      }

      // Try to login with correct password while locked
      const response = await request(app).post('/api/auth/login').send(lockedUser).expect(423);

      expect(response.body.success).toBe(false);
      expect(response.body.error).toContain('locked');
    });

    it('should reset failed attempts on successful login', async () => {
      const resetUser = {
        email: `reset${Date.now()}@example.com`,
        password: 'Test@1234',
      };

      // Register user
      await request(app).post('/api/auth/register').send(resetUser).expect(201);

      // Make 3 failed login attempts
      for (let i = 0; i < 3; i++) {
        await request(app).post('/api/auth/login').send({
          email: resetUser.email,
          password: 'WrongPassword123!',
        });
      }

      // Successful login should reset counter
      const successResponse = await request(app)
        .post('/api/auth/login')
        .send(resetUser)
        .expect(200);

      expect(successResponse.body.success).toBe(true);

      // Make 2 more failed attempts (should not lock since counter was reset)
      for (let i = 0; i < 2; i++) {
        await request(app)
          .post('/api/auth/login')
          .send({
            email: resetUser.email,
            password: 'WrongPassword123!',
          })
          .expect(401);
      }

      // Should still be able to login
      const finalResponse = await request(app).post('/api/auth/login').send(resetUser).expect(200);

      expect(finalResponse.body.success).toBe(true);
    });

    it('should include remaining attempts in response before lockout', async () => {
      const attemptsUser = {
        email: `attempts${Date.now()}@example.com`,
        password: 'Test@1234',
      };

      // Register user
      await request(app).post('/api/auth/register').send(attemptsUser).expect(201);

      // Make 4 failed attempts
      for (let i = 0; i < 4; i++) {
        const response = await request(app)
          .post('/api/auth/login')
          .send({
            email: attemptsUser.email,
            password: 'WrongPassword123!',
          })
          .expect(401);

        expect(response.body.success).toBe(false);
        if (i < 4) {
          expect(response.body.remainingAttempts).toBeDefined();
          expect(response.body.remainingAttempts).toBe(4 - i);
        }
      }
    });

    it('should not reveal if email exists during failed attempts', async () => {
      // Try to login with non-existent email
      const response = await request(app)
        .post('/api/auth/login')
        .send({
          email: 'nonexistent@example.com',
          password: 'SomePassword123!',
        })
        .expect(401);

      expect(response.body.error).toContain('Invalid email or password');
      // Should not indicate whether email exists
    });
  });
});
