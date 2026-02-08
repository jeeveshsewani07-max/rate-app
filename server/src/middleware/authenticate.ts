import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { env } from '../config/env';
import { Errors } from '../errors/AppError';

export function authenticate(req: Request, _res: Response, next: NextFunction) {
  const authHeader = req.headers.authorization;

  if (!authHeader?.startsWith('Bearer ')) {
    return next(Errors.unauthorized('Missing or invalid authorization header'));
  }

  const token = authHeader.slice(7);

  try {
    const payload = jwt.verify(token, env.JWT_ACCESS_SECRET) as { sub: string };
    req.userId = payload.sub;
    next();
  } catch {
    next(Errors.unauthorized('Invalid or expired access token'));
  }
}
