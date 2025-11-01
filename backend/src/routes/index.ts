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
    message: 'API is running',
    timestamp: new Date().toISOString(),
  });
});

// API routes
router.use('/auth', authRoutes);
router.use('/users', userRoutes);
router.use('/progress', progressRoutes);
router.use('/assessments', assessmentRoutes);

export default router;
