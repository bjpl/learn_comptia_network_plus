import { Router } from 'express';
import { UserController } from '../controllers/user.controller';
import { authenticate } from '../middleware/auth.middleware';
import { validate } from '../middleware/validation.middleware';
import {
  profileValidators,
  userSettingsValidators,
  passwordValidators,
  avatarValidators,
  accountDeletionValidators,
} from '../utils/validators';

const router = Router();

// All user routes require authentication
router.use(authenticate);

router.get('/profile', UserController.getProfile);
router.put('/profile', validate(profileValidators.update), UserController.updateProfile);

// User settings routes
router.get('/settings', UserController.getSettings);
router.put('/settings', validate(userSettingsValidators.update), UserController.updateSettings);

// Password change route
router.post('/password', validate(passwordValidators.change), UserController.changePassword);

// Avatar upload route
router.post('/avatar', validate(avatarValidators.update), UserController.updateAvatar);

// Account deletion route
router.delete('/account', validate(accountDeletionValidators.delete), UserController.deleteAccount);

export default router;
