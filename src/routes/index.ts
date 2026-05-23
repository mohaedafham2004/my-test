import { Router } from 'express';
import authRoutes from './auth.routes';
import userRoutes from './user.routes';
import locationRoutes from './location.routes';
import weatherRoutes from './weather.routes';
import opinionRoutes from './opinion.routes';
import activityRoutes from './activity.routes';

export const router = Router();

router.use('/auth', authRoutes);
router.use('/users', userRoutes);
router.use('/locations', locationRoutes);
router.use('/weather', weatherRoutes);
router.use('/opinions', opinionRoutes);
router.use('/activity', activityRoutes);
