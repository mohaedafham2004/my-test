import { Request, Response, NextFunction } from 'express';
import { verifyToken } from '../utils/jwt';
import { AppError } from '../utils/AppError';

export function authMiddleware(req: Request, _res: Response, next: NextFunction): void {
  const header = req.headers.authorization;
  if (!header || !header.startsWith('Bearer ')) {
    return next(new AppError('No token provided', 401, 'UNAUTHORIZED'));
  }
  try {
    const token = header.split(' ')[1];
    req.user = verifyToken(token);
    next();
  } catch {
    next(new AppError('Invalid or expired token', 401, 'TOKEN_INVALID'));
  }
}
