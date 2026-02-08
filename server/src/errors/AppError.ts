export class AppError extends Error {
  constructor(
    public code: string,
    public statusCode: number,
    message: string,
    public details?: Record<string, string[]>
  ) {
    super(message);
    this.name = 'AppError';
  }
}

// Common error factories
export const Errors = {
  unauthorized: (message = 'Unauthorized') =>
    new AppError('UNAUTHORIZED', 401, message),

  invalidCredentials: () =>
    new AppError('INVALID_CREDENTIALS', 401, 'Invalid email or password'),

  refreshTokenInvalid: () =>
    new AppError('REFRESH_TOKEN_INVALID', 401, 'Invalid or revoked refresh token'),

  forbidden: (message = 'Forbidden') =>
    new AppError('FORBIDDEN', 403, message),

  notFound: (resource: string) =>
    new AppError('NOT_FOUND', 404, `${resource} not found`),

  conflict: (message: string) =>
    new AppError('CONFLICT', 409, message),

  validation: (details: Record<string, string[]>) =>
    new AppError('VALIDATION_ERROR', 422, 'Validation failed', details),

  badRequest: (message: string) =>
    new AppError('BAD_REQUEST', 400, message),

  internal: (message = 'An unexpected error occurred') =>
    new AppError('INTERNAL_ERROR', 500, message),
};
