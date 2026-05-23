import { Request, Response, NextFunction } from 'express';
import * as activityService from '../services/activity.service';
import { sendSuccess } from '../utils/response';

export async function getUserHistory(req: Request, res: Response, next: NextFunction) {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 20;
    const result = await activityService.getUserHistory(req.user!.id, page, limit);
    return sendSuccess(res, result, 'Activity history fetched successfully');
  } catch (err) {
    next(err);
  }
}

export async function clearHistory(req: Request, res: Response, next: NextFunction) {
  try {
    await activityService.clearHistory(req.user!.id);
    return sendSuccess(res, null, 'Activity history cleared successfully');
  } catch (err) {
    next(err);
  }
}
