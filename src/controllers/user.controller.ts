import { Request, Response, NextFunction } from 'express';
import * as userService from '../services/user.service';
import { sendSuccess } from '../utils/response';

export async function getMe(req: Request, res: Response, next: NextFunction) {
  try {
    const user = await userService.getMe(req.user!.id);
    return sendSuccess(res, user, 'User fetched successfully');
  } catch (err) {
    next(err);
  }
}

export async function updateMe(req: Request, res: Response, next: NextFunction) {
  try {
    const user = await userService.updateMe(req.user!.id, req.body);
    return sendSuccess(res, user, 'User updated successfully');
  } catch (err) {
    next(err);
  }
}

export async function deleteMe(req: Request, res: Response, next: NextFunction) {
  try {
    await userService.deleteMe(req.user!.id);
    return sendSuccess(res, null, 'Account deactivated successfully');
  } catch (err) {
    next(err);
  }
}

export async function getAllUsers(req: Request, res: Response, next: NextFunction) {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 20;
    const role = req.query.role as string | undefined;
    const result = await userService.getAllUsers({ role, page, limit });
    return sendSuccess(res, result, 'Users fetched successfully');
  } catch (err) {
    next(err);
  }
}
