import { Request, Response, NextFunction } from 'express';
import { ZodError } from 'zod';
import { AppError } from '../errors/AppError';

export function errorHandler(err: Error, _req: Request, res: Response, _next: NextFunction) {
  if (err instanceof AppError) {
    return res.status(err.statusCode).json({
      code: err.code,
      message: err.message,
      details: err.details,
      statusCode: err.statusCode,
    });
  }

  if (err instanceof ZodError) {
    const details: Record<string, string[]> = {};
    err.errors.forEach((e) => {
      const path = e.path.join('.') || 'unknown';
      if (!details[path]) details[path] = [];
      details[path].push(e.message);
    });
    return res.status(422).json({
      code: 'VALIDATION_ERROR',
      message: 'Request validation failed',
      details,
      statusCode: 422,
    });
  }

  console.error('Unhandled error:', err);
  return res.status(500).json({
    code: 'INTERNAL_ERROR',
    message: 'An unexpected error occurred',
    statusCode: 500,
  });
}
