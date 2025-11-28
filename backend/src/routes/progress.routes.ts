import { Router } from 'express';
import { ProgressController } from '../controllers/progress.controller';
import { authenticate } from '../middleware/auth.middleware';
import { validate } from '../middleware/validation.middleware';
import { progressValidators } from '../utils/validators';

const router = Router();

// All progress routes require authentication
router.use(authenticate);

// Get all progress (returns Record<componentId, ComponentProgress>)
router.get('/', ProgressController.getAllProgress);

// Legacy route for backward compatibility
router.post('/', validate(progressValidators.create), ProgressController.saveProgress);

// Get single component progress
router.get(
  '/component/:componentId',
  validate(progressValidators.componentParam),
  ProgressController.getComponentProgress
);

// Update single component progress
router.put(
  '/component/:componentId',
  validate(progressValidators.updateComponent),
  ProgressController.updateComponentProgress
);

// Sync progress (for offline queue processing)
router.post('/sync', validate(progressValidators.sync), ProgressController.syncProgress);

// Reset all progress
router.post('/reset', ProgressController.resetProgress);

// Delete specific component progress
router.delete('/:component_id', ProgressController.deleteProgress);

export default router;
