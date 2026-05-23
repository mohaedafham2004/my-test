import { Request, Response, NextFunction } from 'express';
import { AppError } from '../utils/AppError';

export function roleMiddleware(...roles: string[]) {
  return (req: Request, _res: Response, next: NextFunction): void => {
    if (!req.user || !roles.includes(req.user.role)) {
      return next(new AppError('Forbidden: insufficient permissions', 403, 'FORBIDDEN'));
    }
    next();
  };
}
