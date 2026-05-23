import { Router } from 'express';
import {
  getAll,
  getById,
  getProvinces,
  getDistricts,
  getTowns,
  create,
  update,
  softDelete,
} from '../controllers/location.controller';
import { authMiddleware } from '../middleware/auth.middleware';
import { roleMiddleware } from '../middleware/role.middleware';
import { validate } from '../middleware/validate.middleware';
import { createLocationSchema, updateLocationSchema } from '../validators/location.validator';

const router = Router();

// Static routes before dynamic /:id
router.get('/provinces', authMiddleware, getProvinces);
router.get('/districts', authMiddleware, getDistricts);
router.get('/towns', authMiddleware, getTowns);

router.get('/', authMiddleware, getAll);
router.get('/:id', authMiddleware, getById);
router.post('/', authMiddleware, roleMiddleware('ADMIN', 'STAFF'), validate(createLocationSchema), create);
router.put('/:id', authMiddleware, roleMiddleware('ADMIN', 'STAFF'), validate(updateLocationSchema), update);
router.delete('/:id', authMiddleware, roleMiddleware('ADMIN'), softDelete);

export default router;
