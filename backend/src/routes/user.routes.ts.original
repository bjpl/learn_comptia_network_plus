import { Router } from 'express';
import { UserController } from '../controllers/user.controller';
import { authenticate } from '../middleware/auth.middleware';
import { validate } from '../middleware/validation.middleware';
import { profileValidators } from '../utils/validators';

const router = Router();

// All user routes require authentication
router.use(authenticate);

router.get('/profile', UserController.getProfile);
router.put('/profile', validate(profileValidators.update), UserController.updateProfile);

export default router;
