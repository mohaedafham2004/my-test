import { Request, Response, NextFunction } from 'express';
import * as opinionService from '../services/opinion.service';
import { sendSuccess } from '../utils/response';

export async function getAll(req: Request, res: Response, next: NextFunction) {
  try {
    const favourite = req.query.favourite === 'true' ? true : req.query.favourite === 'false' ? false : undefined;
    const saved = req.query.saved === 'true' ? true : req.query.saved === 'false' ? false : undefined;
    const opinions = await opinionService.getAll(req.user!.id, { favourite, saved });
    return sendSuccess(res, opinions, 'Opinions fetched successfully');
  } catch (err) {
    next(err);
  }
}

export async function getByLocation(req: Request, res: Response, next: NextFunction) {
  try {
    const opinion = await opinionService.getByLocation(req.user!.id, req.params.locationId);
    return sendSuccess(res, opinion, 'Opinion fetched successfully');
  } catch (err) {
    next(err);
  }
}

export async function upsert(req: Request, res: Response, next: NextFunction) {
  try {
    const data = req.params.locationId
      ? { ...req.body, location_id: req.params.locationId }
      : req.body;
    const opinion = await opinionService.upsert(req.user!.id, data);
    return sendSuccess(res, opinion, 'Opinion saved successfully', 200);
  } catch (err) {
    next(err);
  }
}

export async function remove(req: Request, res: Response, next: NextFunction) {
  try {
    await opinionService.remove(req.user!.id, req.params.locationId);
    return sendSuccess(res, null, 'Opinion removed successfully');
  } catch (err) {
    next(err);
  }
}
