import request from 'supertest';
import app from '../src/server';

describe('Progress API', () => {
  let authToken: string;
  const testUser = {
    email: `progress-test${Date.now()}@example.com`,
    password: 'Test@1234',
  };

  beforeAll(async () => {
    // Register and login
    const registerResponse = await request(app)
      .post('/api/auth/register')
      .send(testUser);

    authToken = registerResponse.body.data.accessToken;
  });

  describe('POST /api/progress', () => {
    it('should save progress', async () => {
      const progressData = {
        component_id: 'networking-fundamentals',
        progress: {
          completed: true,
          score: 85,
          timeSpent: 1200,
        },
      };

      const response = await request(app)
        .post('/api/progress')
        .set('Authorization', `Bearer ${authToken}`)
        .send(progressData)
        .expect(201);

      expect(response.body.success).toBe(true);
      expect(response.body.data.component_id).toBe(progressData.component_id);
    });

    it('should update existing progress', async () => {
      const progressData = {
        component_id: 'networking-fundamentals',
        progress: {
          completed: true,
          score: 95,
          timeSpent: 1800,
        },
      };

      const response = await request(app)
        .post('/api/progress')
        .set('Authorization', `Bearer ${authToken}`)
        .send(progressData)
        .expect(201);

      expect(response.body.success).toBe(true);
      expect(response.body.data.progress.score).toBe(95);
    });

    it('should reject invalid component_id', async () => {
      const response = await request(app)
        .post('/api/progress')
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          component_id: '',
          progress: {},
        })
        .expect(400);

      expect(response.body.success).toBe(false);
    });

    it('should require authentication', async () => {
      const response = await request(app)
        .post('/api/progress')
        .send({
          component_id: 'test',
          progress: {},
        })
        .expect(401);

      expect(response.body.success).toBe(false);
    });
  });

  describe('GET /api/progress', () => {
    it('should get all progress', async () => {
      const response = await request(app)
        .get('/api/progress')
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data.totalComponents).toBeGreaterThan(0);
    });

    it('should get progress for specific component', async () => {
      const response = await request(app)
        .get('/api/progress?component_id=networking-fundamentals')
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data.component_id).toBe('networking-fundamentals');
    });

    it('should require authentication', async () => {
      const response = await request(app)
        .get('/api/progress')
        .expect(401);

      expect(response.body.success).toBe(false);
    });
  });

  describe('DELETE /api/progress/:component_id', () => {
    it('should delete progress', async () => {
      const response = await request(app)
        .delete('/api/progress/networking-fundamentals')
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200);

      expect(response.body.success).toBe(true);
    });

    it('should return 404 for non-existent progress', async () => {
      const response = await request(app)
        .delete('/api/progress/non-existent-component')
        .set('Authorization', `Bearer ${authToken}`)
        .expect(404);

      expect(response.body.success).toBe(false);
    });
  });
});
