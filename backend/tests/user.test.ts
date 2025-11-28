import request from 'supertest';
import app from '../src/server';

describe('User API', () => {
  let authToken: string;
  const testUser = {
    email: `user-test${Date.now()}@example.com`,
    password: 'Test@1234',
  };

  beforeAll(async () => {
    // Register and login to get auth token
    const registerResponse = await request(app).post('/api/auth/register').send(testUser);
    authToken = registerResponse.body.data.accessToken;
  });

  describe('GET /api/users/profile', () => {
    it('should get user profile with valid token', async () => {
      const response = await request(app)
        .get('/api/users/profile')
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data.user).toBeDefined();
      expect(response.body.data.user.email).toBe(testUser.email);
    });

    it('should reject request without authentication', async () => {
      const response = await request(app).get('/api/users/profile').expect(401);

      expect(response.body.success).toBe(false);
      expect(response.body.error).toContain('Unauthorized');
    });

    it('should reject request with invalid token', async () => {
      const response = await request(app)
        .get('/api/users/profile')
        .set('Authorization', 'Bearer invalid-token')
        .expect(401);

      expect(response.body.success).toBe(false);
    });

    it('should reject request with expired token', async () => {
      // Use a known expired token format (this will fail validation)
      const expiredToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.expired.token';
      const response = await request(app)
        .get('/api/users/profile')
        .set('Authorization', `Bearer ${expiredToken}`)
        .expect(401);

      expect(response.body.success).toBe(false);
    });
  });

  describe('PUT /api/users/profile', () => {
    it('should update profile with valid data', async () => {
      const profileData = {
        first_name: 'John',
        last_name: 'Doe',
        bio: 'Software developer learning networking',
      };

      const response = await request(app)
        .put('/api/users/profile')
        .set('Authorization', `Bearer ${authToken}`)
        .send(profileData)
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data.first_name).toBe(profileData.first_name);
      expect(response.body.data.last_name).toBe(profileData.last_name);
    });

    it('should update partial profile data', async () => {
      const response = await request(app)
        .put('/api/users/profile')
        .set('Authorization', `Bearer ${authToken}`)
        .send({ first_name: 'Jane' })
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data.first_name).toBe('Jane');
    });

    it('should reject request without authentication', async () => {
      const response = await request(app)
        .put('/api/users/profile')
        .send({ first_name: 'Test' })
        .expect(401);

      expect(response.body.success).toBe(false);
    });

    it('should handle invalid data types', async () => {
      const response = await request(app)
        .put('/api/users/profile')
        .set('Authorization', `Bearer ${authToken}`)
        .send({ first_name: 123 }) // Should be string
        .expect(400);

      expect(response.body.success).toBe(false);
    });

    it('should reject overly long bio', async () => {
      const response = await request(app)
        .put('/api/users/profile')
        .set('Authorization', `Bearer ${authToken}`)
        .send({ bio: 'a'.repeat(1001) }) // Assuming 1000 char limit
        .expect(400);

      expect(response.body.success).toBe(false);
    });
  });

  describe('GET /api/users/settings', () => {
    it('should get user settings', async () => {
      const response = await request(app)
        .get('/api/users/settings')
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data).toBeDefined();
    });

    it('should require authentication', async () => {
      const response = await request(app).get('/api/users/settings').expect(401);

      expect(response.body.success).toBe(false);
    });

    it('should reject invalid token', async () => {
      const response = await request(app)
        .get('/api/users/settings')
        .set('Authorization', 'Bearer invalid')
        .expect(401);

      expect(response.body.success).toBe(false);
    });
  });

  describe('PUT /api/users/settings', () => {
    it('should update user settings', async () => {
      const settingsData = {
        theme: 'dark',
        notifications: true,
        language: 'en',
      };

      const response = await request(app)
        .put('/api/users/settings')
        .set('Authorization', `Bearer ${authToken}`)
        .send(settingsData)
        .expect(200);

      expect(response.body.success).toBe(true);
    });

    it('should update partial settings', async () => {
      const response = await request(app)
        .put('/api/users/settings')
        .set('Authorization', `Bearer ${authToken}`)
        .send({ theme: 'light' })
        .expect(200);

      expect(response.body.success).toBe(true);
    });

    it('should require authentication', async () => {
      const response = await request(app)
        .put('/api/users/settings')
        .send({ theme: 'dark' })
        .expect(401);

      expect(response.body.success).toBe(false);
    });

    it('should validate theme values', async () => {
      const response = await request(app)
        .put('/api/users/settings')
        .set('Authorization', `Bearer ${authToken}`)
        .send({ theme: 'invalid-theme' })
        .expect(400);

      expect(response.body.success).toBe(false);
    });

    it('should validate language codes', async () => {
      const response = await request(app)
        .put('/api/users/settings')
        .set('Authorization', `Bearer ${authToken}`)
        .send({ language: 'invalid-lang-code' })
        .expect(400);

      expect(response.body.success).toBe(false);
    });

    it('should handle boolean settings correctly', async () => {
      const response = await request(app)
        .put('/api/users/settings')
        .set('Authorization', `Bearer ${authToken}`)
        .send({ notifications: false })
        .expect(200);

      expect(response.body.success).toBe(true);
    });
  });

  describe('POST /api/users/password', () => {
    it('should change password with valid credentials', async () => {
      const passwordData = {
        currentPassword: testUser.password,
        newPassword: 'NewPass@1234',
      };

      const response = await request(app)
        .post('/api/users/password')
        .set('Authorization', `Bearer ${authToken}`)
        .send(passwordData)
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.message).toContain('updated');

      // Update test user password for subsequent tests
      testUser.password = 'NewPass@1234';
    });

    it('should reject incorrect current password', async () => {
      const response = await request(app)
        .post('/api/users/password')
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          currentPassword: 'WrongPassword@123',
          newPassword: 'AnotherPass@1234',
        })
        .expect(401);

      expect(response.body.success).toBe(false);
      expect(response.body.error).toContain('incorrect');
    });

    it('should require authentication', async () => {
      const response = await request(app)
        .post('/api/users/password')
        .send({
          currentPassword: 'Test@1234',
          newPassword: 'NewPass@1234',
        })
        .expect(401);

      expect(response.body.success).toBe(false);
    });

    it('should reject weak new password', async () => {
      const response = await request(app)
        .post('/api/users/password')
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          currentPassword: testUser.password,
          newPassword: 'weak',
        })
        .expect(400);

      expect(response.body.success).toBe(false);
      expect(response.body.error).toContain('8 characters');
    });

    it('should reject missing current password', async () => {
      const response = await request(app)
        .post('/api/users/password')
        .set('Authorization', `Bearer ${authToken}`)
        .send({ newPassword: 'NewPass@1234' })
        .expect(400);

      expect(response.body.success).toBe(false);
    });

    it('should reject missing new password', async () => {
      const response = await request(app)
        .post('/api/users/password')
        .set('Authorization', `Bearer ${authToken}`)
        .send({ currentPassword: testUser.password })
        .expect(400);

      expect(response.body.success).toBe(false);
    });

    it('should enforce password complexity requirements', async () => {
      const response = await request(app)
        .post('/api/users/password')
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          currentPassword: testUser.password,
          newPassword: 'NoSpecialChar123',
        })
        .expect(400);

      expect(response.body.success).toBe(false);
    });
  });

  describe('POST /api/users/avatar', () => {
    it('should update avatar with valid data URL', async () => {
      const avatarData = {
        avatar:
          'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==',
      };

      const response = await request(app)
        .post('/api/users/avatar')
        .set('Authorization', `Bearer ${authToken}`)
        .send(avatarData)
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data.avatarUrl).toBeDefined();
    });

    it('should update avatar with URL', async () => {
      const response = await request(app)
        .post('/api/users/avatar')
        .set('Authorization', `Bearer ${authToken}`)
        .send({ avatar: 'https://example.com/avatar.png' })
        .expect(200);

      expect(response.body.success).toBe(true);
    });

    it('should require authentication', async () => {
      const response = await request(app)
        .post('/api/users/avatar')
        .send({ avatar: 'https://example.com/avatar.png' })
        .expect(401);

      expect(response.body.success).toBe(false);
    });

    it('should reject missing avatar field', async () => {
      const response = await request(app)
        .post('/api/users/avatar')
        .set('Authorization', `Bearer ${authToken}`)
        .send({})
        .expect(400);

      expect(response.body.success).toBe(false);
    });

    it('should reject invalid data URL format', async () => {
      const response = await request(app)
        .post('/api/users/avatar')
        .set('Authorization', `Bearer ${authToken}`)
        .send({ avatar: 'data:invalid' })
        .expect(400);

      expect(response.body.success).toBe(false);
    });

    it('should reject oversized avatar (>5MB)', async () => {
      // Create a large base64 string (>5MB)
      const largeImage = 'data:image/png;base64,' + 'A'.repeat(7 * 1024 * 1024);

      const response = await request(app)
        .post('/api/users/avatar')
        .set('Authorization', `Bearer ${authToken}`)
        .send({ avatar: largeImage })
        .expect(400);

      expect(response.body.success).toBe(false);
      expect(response.body.error).toContain('5MB');
    });

    it('should accept valid image types', async () => {
      const jpegAvatar = 'data:image/jpeg;base64,/9j/4AAQSkZJRgABAQEAAAAAAAD/2wBD';

      const response = await request(app)
        .post('/api/users/avatar')
        .set('Authorization', `Bearer ${authToken}`)
        .send({ avatar: jpegAvatar })
        .expect(200);

      expect(response.body.success).toBe(true);
    });
  });

  describe('DELETE /api/users/account', () => {
    // Create a separate user for deletion testing
    let deleteTestUser: { email: string; password: string };
    let deleteTestToken: string;

    beforeAll(async () => {
      deleteTestUser = {
        email: `delete-test${Date.now()}@example.com`,
        password: 'DeleteTest@1234',
      };

      const registerResponse = await request(app).post('/api/auth/register').send(deleteTestUser);

      deleteTestToken = registerResponse.body.data.accessToken;
    });

    it('should delete account with valid password', async () => {
      const response = await request(app)
        .delete('/api/users/account')
        .set('Authorization', `Bearer ${deleteTestToken}`)
        .send({ password: deleteTestUser.password })
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.message).toContain('deleted');
    });

    it('should reject deletion with incorrect password', async () => {
      // Create another test user for this test
      const tempUser = {
        email: `temp-${Date.now()}@example.com`,
        password: 'TempPass@1234',
      };

      const registerResponse = await request(app).post('/api/auth/register').send(tempUser);
      const tempToken = registerResponse.body.data.accessToken;

      const response = await request(app)
        .delete('/api/users/account')
        .set('Authorization', `Bearer ${tempToken}`)
        .send({ password: 'WrongPassword@123' })
        .expect(401);

      expect(response.body.success).toBe(false);
      expect(response.body.error).toContain('incorrect');
    });

    it('should require authentication', async () => {
      const response = await request(app)
        .delete('/api/users/account')
        .send({ password: 'Test@1234' })
        .expect(401);

      expect(response.body.success).toBe(false);
    });

    it('should require password confirmation', async () => {
      const response = await request(app)
        .delete('/api/users/account')
        .set('Authorization', `Bearer ${authToken}`)
        .send({})
        .expect(400);

      expect(response.body.success).toBe(false);
      expect(response.body.error).toContain('required');
    });

    it('should prevent login after account deletion', async () => {
      // Verify the deleted account cannot login
      const loginResponse = await request(app)
        .post('/api/auth/login')
        .send(deleteTestUser)
        .expect(401);

      expect(loginResponse.body.success).toBe(false);
    });

    it('should invalidate tokens after deletion', async () => {
      // Create and delete a user
      const testDeletionUser = {
        email: `invalidate-test${Date.now()}@example.com`,
        password: 'InvalidateTest@1234',
      };

      const registerResponse = await request(app).post('/api/auth/register').send(testDeletionUser);
      const userToken = registerResponse.body.data.accessToken;

      // Delete account
      await request(app)
        .delete('/api/users/account')
        .set('Authorization', `Bearer ${userToken}`)
        .send({ password: testDeletionUser.password })
        .expect(200);

      // Try to use the token after deletion
      const profileResponse = await request(app)
        .get('/api/users/profile')
        .set('Authorization', `Bearer ${userToken}`)
        .expect(401);

      expect(profileResponse.body.success).toBe(false);
    });
  });

  describe('Error Handling', () => {
    it('should handle malformed JSON', async () => {
      const response = await request(app)
        .put('/api/users/profile')
        .set('Authorization', `Bearer ${authToken}`)
        .set('Content-Type', 'application/json')
        .send('{"invalid": json}')
        .expect(400);

      expect(response.body.success).toBe(false);
    });

    it('should handle missing Authorization header', async () => {
      const response = await request(app).get('/api/users/profile').expect(401);

      expect(response.body.success).toBe(false);
      expect(response.body.error).toContain('Unauthorized');
    });

    it('should handle malformed Authorization header', async () => {
      const response = await request(app)
        .get('/api/users/profile')
        .set('Authorization', 'NotBearer token')
        .expect(401);

      expect(response.body.success).toBe(false);
    });

    it('should handle XSS attempts in profile data', async () => {
      const response = await request(app)
        .put('/api/users/profile')
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          first_name: '<script>alert("XSS")</script>',
          bio: '<img src=x onerror=alert(1)>',
        });

      // Should either sanitize or reject
      expect([200, 400]).toContain(response.status);
      if (response.status === 200) {
        // Data should be sanitized
        expect(response.body.data.first_name).not.toContain('<script>');
      }
    });
  });
});
