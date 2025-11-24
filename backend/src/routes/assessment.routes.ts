import { Router } from 'express';
import { AssessmentController } from '../controllers/assessment.controller';
import { authenticate } from '../middleware/auth.middleware';
import { validate } from '../middleware/validation.middleware';
import { assessmentValidators } from '../utils/validators';

const router = Router();

// All assessment routes require authentication
router.use(authenticate);

router.get('/', validate(assessmentValidators.query), AssessmentController.getAssessments);
router.post('/', validate(assessmentValidators.create), AssessmentController.saveAssessment);
router.get('/statistics', AssessmentController.getStatistics);

export default router;
