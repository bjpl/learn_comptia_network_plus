import { Router } from 'express';
import { ProgressController } from '../controllers/progress.controller';
import { authenticate } from '../middleware/auth.middleware';
import { validate } from '../middleware/validation.middleware';
import { progressValidators } from '../utils/validators';

const router = Router();

// All progress routes require authentication
router.use(authenticate);

router.get('/', validate(progressValidators.query), ProgressController.getProgress);
router.post('/', validate(progressValidators.create), ProgressController.saveProgress);
router.delete('/:component_id', ProgressController.deleteProgress);

export default router;
