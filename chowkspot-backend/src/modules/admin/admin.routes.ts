import { Router } from 'express';
import { AdminController } from '@/modules/admin/admin.controller.js';
import { authenticate, authorizeRoles } from '@/middlewares/auth.middleware.js';
import { CONSTANTS } from '@/config/constants.js';

const router = Router();

router.use(authenticate, authorizeRoles(CONSTANTS.ROLES.ADMIN));

router.get('/stats', AdminController.getStats);
router.get('/users', AdminController.getUsers);
router.delete('/users/:id', AdminController.removeUser);

export default router;
