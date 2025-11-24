import { Router } from 'express';
import authRoutes from './auth.routes';
import userRoutes from './user.routes';
import progressRoutes from './progress.routes';
import assessmentRoutes from './assessment.routes';

const router = Router();

// Health check endpoint
router.get('/health', (req, res) => {
  res.status(200).json({
    success: true,
    status: 'healthy',
    message: 'API is running',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'development',
  });
});

// API routes
router.use('/auth', authRoutes);
router.use('/users', userRoutes);
router.use('/progress', progressRoutes);
router.use('/assessments', assessmentRoutes);

export default router;
