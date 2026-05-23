import { Router } from 'express';
import { getUserHistory, clearHistory } from '../controllers/activity.controller';
import { authMiddleware } from '../middleware/auth.middleware';

const router = Router();

router.get('/', authMiddleware, getUserHistory);
router.delete('/', authMiddleware, clearHistory);

export default router;
