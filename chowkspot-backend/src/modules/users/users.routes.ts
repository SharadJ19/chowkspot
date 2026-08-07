import { Router } from 'express';
import { UserController } from '@/modules/users/users.controller.js';
import { validateRequest } from '@/middlewares/validate.js';
import { updateProfileSchema } from '@/modules/users/users.schema.js';
import { authenticate } from '@/middlewares/auth.middleware.js';

const router = Router();

// Protect all user profile routes
router.use(authenticate);

router.get('/me', UserController.getMe);
router.patch('/me', validateRequest(updateProfileSchema), UserController.updateMe);
router.delete('/me', UserController.deleteMe);

export default router;
