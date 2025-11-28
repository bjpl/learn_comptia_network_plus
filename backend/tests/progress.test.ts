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
    const registerResponse = await request(app).post('/api/auth/register').send(testUser);

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
      const response = await request(app).get('/api/progress').expect(401);

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

  describe('GET /api/progress/component/:componentId', () => {
    it('should get component progress', async () => {
      // First create some progress
      await request(app)
        .post('/api/progress')
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          component_id: 'test-component-1',
          progress: { completed: true, score: 90 },
        });

      const response = await request(app)
        .get('/api/progress/component/test-component-1')
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data.progress).toBeDefined();
      expect(response.body.data.progress.componentId).toBe('test-component-1');
      expect(response.body.data.progress.completed).toBe(true);
    });

    it('should return default progress for non-existent component', async () => {
      const response = await request(app)
        .get('/api/progress/component/non-existent')
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data.progress.componentId).toBe('non-existent');
      expect(response.body.data.progress.completed).toBe(false);
      expect(response.body.data.progress.score).toBe(0);
    });

    it('should require authentication', async () => {
      await request(app).get('/api/progress/component/test-component-1').expect(401);
    });
  });

  describe('PUT /api/progress/component/:componentId', () => {
    it('should create new component progress', async () => {
      const response = await request(app)
        .put('/api/progress/component/new-component')
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          completed: false,
          score: 75,
          timeSpent: 600,
          attempts: 2,
        })
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data.progress.componentId).toBe('new-component');
      expect(response.body.data.progress.score).toBe(75);
      expect(response.body.data.progress.attempts).toBe(2);
    });

    it('should update existing component progress', async () => {
      // Create initial progress
      await request(app)
        .put('/api/progress/component/update-test')
        .set('Authorization', `Bearer ${authToken}`)
        .send({ completed: false, score: 60 });

      // Update it
      const response = await request(app)
        .put('/api/progress/component/update-test')
        .set('Authorization', `Bearer ${authToken}`)
        .send({ completed: true, score: 95 })
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data.progress.completed).toBe(true);
      expect(response.body.data.progress.score).toBe(95);
    });

    it('should validate score range', async () => {
      const response = await request(app)
        .put('/api/progress/component/test')
        .set('Authorization', `Bearer ${authToken}`)
        .send({ score: 150 })
        .expect(400);

      expect(response.body.success).toBe(false);
    });

    it('should require authentication', async () => {
      await request(app).put('/api/progress/component/test').send({ completed: true }).expect(401);
    });
  });

  describe('POST /api/progress/sync', () => {
    it('should sync progress data', async () => {
      const localProgress = {
        'component-1': {
          componentId: 'component-1',
          completed: true,
          score: 85,
          timeSpent: 1200,
          attempts: 3,
          lastVisited: new Date().toISOString(),
        },
        'component-2': {
          componentId: 'component-2',
          completed: false,
          score: 50,
          timeSpent: 600,
          attempts: 1,
          lastVisited: new Date().toISOString(),
        },
      };

      const response = await request(app)
        .post('/api/progress/sync')
        .set('Authorization', `Bearer ${authToken}`)
        .send({ progress: localProgress })
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data.componentProgress).toBeDefined();
      expect(response.body.data.lastSyncedAt).toBeDefined();
      expect(response.body.data.version).toBeDefined();
    });

    it('should require progress data', async () => {
      const response = await request(app)
        .post('/api/progress/sync')
        .set('Authorization', `Bearer ${authToken}`)
        .send({})
        .expect(400);

      expect(response.body.success).toBe(false);
    });

    it('should require authentication', async () => {
      await request(app).post('/api/progress/sync').send({ progress: {} }).expect(401);
    });
  });

  describe('POST /api/progress/reset', () => {
    it('should reset all progress', async () => {
      // Create some progress first
      await request(app)
        .put('/api/progress/component/reset-test-1')
        .set('Authorization', `Bearer ${authToken}`)
        .send({ completed: true, score: 100 });

      await request(app)
        .put('/api/progress/component/reset-test-2')
        .set('Authorization', `Bearer ${authToken}`)
        .send({ completed: true, score: 90 });

      // Reset all progress
      const response = await request(app)
        .post('/api/progress/reset')
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.message).toContain('reset');

      // Verify progress was deleted
      const checkResponse = await request(app)
        .get('/api/progress')
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200);

      expect(checkResponse.body.data.progress).toEqual({});
    });

    it('should require authentication', async () => {
      await request(app).post('/api/progress/reset').expect(401);
    });
  });
});
