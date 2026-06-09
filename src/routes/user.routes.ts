import { Router } from 'express';
import { getMe, updateMe, deleteMe, getAllUsers } from '../controllers/user.controller';
import { authMiddleware } from '../middleware/auth.middleware';
import { roleMiddleware } from '../middleware/role.middleware';

const router = Router();

router.get('/me', authMiddleware, getMe);
router.put('/me', authMiddleware, updateMe);
router.delete('/me', authMiddleware, deleteMe);
router.get('/', authMiddleware, roleMiddleware('ADMIN'), getAllUsers);

export default router;
