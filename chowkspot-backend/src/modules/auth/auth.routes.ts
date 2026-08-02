import { Router } from 'express';
import { AuthController } from '@/modules/auth/auth.controller.js';
import { validateRequest } from '@/middlewares/validate.js';
import { registerSchema, loginSchema } from '@/modules/auth/auth.schema.js';
import { authenticate } from '@/middlewares/auth.middleware.js';

const router = Router();

router.post('/register', validateRequest(registerSchema), AuthController.register);
router.post('/login', validateRequest(loginSchema), AuthController.login);
router.post('/logout', authenticate, AuthController.logout);
router.post('/refresh', AuthController.refreshToken);

export default router;
