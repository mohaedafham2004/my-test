import { Router } from 'express';
import {
  getWeatherForLocation,
  searchWeather,
  getBestWeather,
} from '../controllers/weather.controller';
import { authMiddleware } from '../middleware/auth.middleware';

const router = Router();

router.get('/location/:locationId', authMiddleware, getWeatherForLocation);
router.get('/search', authMiddleware, searchWeather);
router.get('/best', authMiddleware, getBestWeather);

export default router;
