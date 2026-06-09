import { Router } from 'express';
import { getAll, getByLocation, upsert, remove } from '../controllers/opinion.controller';
import { authMiddleware } from '../middleware/auth.middleware';
import { validate } from '../middleware/validate.middleware';
import { upsertOpinionSchema } from '../validators/opinion.validator';

const router = Router();

router.get('/', authMiddleware, getAll);
router.get('/location/:locationId', authMiddleware, getByLocation);
router.post('/', authMiddleware, validate(upsertOpinionSchema), upsert);
router.put('/location/:locationId', authMiddleware, validate(upsertOpinionSchema), upsert);
router.delete('/location/:locationId', authMiddleware, remove);

export default router;
